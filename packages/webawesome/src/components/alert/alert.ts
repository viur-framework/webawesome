import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WaAfterHideEvent } from '../../events/after-hide.js';
import { WaAfterShowEvent } from '../../events/after-show.js';
import { WaHideEvent } from '../../events/hide.js';
import { WaShowEvent } from '../../events/show.js';
import { animateWithClass } from '../../internal/animate.js';
import { waitForEvent } from '../../internal/event.js';
import { watch } from '../../internal/watch.js';
import { LocalizeController } from '../../utilities/localize.js';
import '../button/button.js';
import WaCallout from '../callout/callout.js';
import '../icon/icon.js';
import styles from './alert.styles.js';

/**
 * @summary Alerts are used to display important messages inline.
 * @documentation https://webawesome.com/docs/components/alert
 * @status experimental
 * @since 3.0
 *
 * @dependency wa-button
 * @dependency wa-icon
 *
 * @slot - The alert's main content.
 * @slot icon - An optional icon to show in the alert. Works best with `<wa-icon>`.
 * @slot close-icon - An optional close icon to use instead of the default.
 *
 * @event wa-show - Emitted when the alert opens.
 * @event wa-after-show - Emitted after the alert opens and all animations are complete.
 * @event wa-hide - Emitted when the alert closes.
 * @event wa-after-hide - Emitted after the alert closes and all animations are complete.
 *
 * @csspart icon - The container that wraps the optional icon.
 * @csspart message - The container that wraps the alert's main content.
 * @csspart close-button - The alert's close button, a `<wa-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart progress-bar - The bar that indicates the remaining duration.
 *
 * @cssproperty [--show-duration=150ms] - The show duration to use when applying built-in animation classes.
 * @cssproperty [--hide-duration=150ms] - The hide duration to use when applying built-in animation classes.
 * @cssproperty [--progress-bar-height=4px] - The height of the duration progress bar.
 * @cssproperty [--progress-bar-color=currentColor] - The color of the duration progress bar.
 */
@customElement('wa-alert')
export default class WaAlert extends WaCallout {
  static css = [...(Array.isArray(WaCallout.css) ? WaCallout.css : WaCallout.css ? [WaCallout.css] : []), styles];

  private autoHideAnimationFrame: number | null = null;
  private autoHideStartTime: number | null = null;
  private autoHideRemaining = 0;
  @state() private timeLeft = 100;
  private readonly localize = new LocalizeController(this);

  /** Indicates whether or not the alert is open. You can toggle this attribute to show and hide the alert. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Makes the alert closable and shows the close button. */
  @property({ type: Boolean, reflect: true }) closable = false;

  /** The amount of time, in milliseconds, to wait before closing the alert. Set to `Infinity` to disable. */
  @property({ type: Number }) duration = Infinity;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'alert');
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
  }

  disconnectedCallback() {
    this.clearAutoHideTimer();
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.handleMouseEnter);
    this.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  firstUpdated() {
    this.hidden = !this.open;
    if (this.open) {
      this.startAutoHideTimer();
    }
  }

  private clearAutoHideTimer() {
    if (this.autoHideAnimationFrame !== null) {
      cancelAnimationFrame(this.autoHideAnimationFrame);
      this.autoHideAnimationFrame = null;
    }

    this.autoHideStartTime = null;
  }

  private startAutoHideTimer() {
    this.clearAutoHideTimer();

    if (this.duration > 0 && Number.isFinite(this.duration)) {
      this.autoHideRemaining = this.duration;
      this.timeLeft = 100;
      this.autoHideStartTime = performance.now();
      this.tickAutoHideTimer();
    } else {
      this.autoHideRemaining = 0;
      this.timeLeft = 100;
    }
  }

  private pauseAutoHideTimer() {
    if (this.autoHideStartTime === null) {
      return;
    }

    this.autoHideRemaining = Math.max(0, this.autoHideRemaining - (performance.now() - this.autoHideStartTime));
    this.clearAutoHideTimer();
    this.timeLeft = (this.autoHideRemaining / this.duration) * 100;
  }

  private resumeAutoHideTimer() {
    if (
      !this.open ||
      this.duration <= 0 ||
      !Number.isFinite(this.duration) ||
      this.autoHideStartTime !== null ||
      this.autoHideRemaining <= 0
    ) {
      return;
    }

    this.autoHideStartTime = performance.now();
    this.tickAutoHideTimer();
  }

  private tickAutoHideTimer = () => {
    if (this.autoHideStartTime === null) {
      return;
    }

    const now = performance.now();
    const elapsed = now - this.autoHideStartTime;
    this.autoHideRemaining = Math.max(this.autoHideRemaining - elapsed, 0);
    this.timeLeft = (this.autoHideRemaining / this.duration) * 100;

    if (this.autoHideRemaining > 0) {
      this.autoHideStartTime = now;
      this.autoHideAnimationFrame = requestAnimationFrame(this.tickAutoHideTimer);
    } else {
      this.clearAutoHideTimer();
      this.hide();
    }
  };

  private handleCloseClick = () => {
    this.hide();
  };

  private handleMouseEnter = () => {
    this.pauseAutoHideTimer();
  };

  private handleMouseLeave = () => {
    this.resumeAutoHideTimer();
  };

  @watch('duration')
  handleDurationChange() {
    if (this.open) {
      this.startAutoHideTimer();
    }
  }

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      const waShow = new WaShowEvent();
      this.dispatchEvent(waShow);
      if (waShow.defaultPrevented) {
        this.open = false;
        return;
      }

      this.hidden = false;
      await animateWithClass(this, 'show');
      this.dispatchEvent(new WaAfterShowEvent());
      this.startAutoHideTimer();
    } else {
      const waHide = new WaHideEvent();
      this.dispatchEvent(waHide);
      if (waHide.defaultPrevented) {
        this.open = true;
        return;
      }

      this.clearAutoHideTimer();
      await animateWithClass(this, 'hide');
      this.hidden = true;
      this.dispatchEvent(new WaAfterHideEvent());
    }
  }

  /** Shows the alert. */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'wa-after-show');
  }

  /** Hides the alert. */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'wa-after-hide');
  }

  render() {
    return html`
      <div part="icon">
        <slot name="icon"></slot>
      </div>

      <div part="message">
        <slot></slot>
      </div>

      ${this.open && this.duration > 0 && Number.isFinite(this.duration)
        ? html`<div
            part="progress-bar"
            class="progress-bar"
            style="--progress: ${this.timeLeft}%"
            aria-hidden="true"
          ></div>`
        : ''}
      ${this.closable
        ? html`
            <wa-button
              part="close-button"
              exportparts="base:close-button__base"
              appearance="plain"
              size="small"
              @click=${this.handleCloseClick}
            >
              <slot name="close-icon">
                <wa-icon name="xmark" library="system" variant="solid" label=${this.localize.term('close')}></wa-icon>
              </slot>
            </wa-button>
          `
        : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wa-alert': WaAlert;
  }
}
