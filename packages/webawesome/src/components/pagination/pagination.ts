import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import WebAwesomeElement from '../../internal/webawesome-element.js';
import styles from './pagination.styles.js';
import { repeat } from 'lit/directives/repeat.js';
import type { PropertyValues, TemplateResult } from 'lit';
import WaButton from '../button/button.js';
import { watch } from '../../internal/watch.js';
import { LocalizeController } from '../../utilities/localize.js';
import { onEvent } from '../../internal/event.js';
/**
 * @since 2.0
 * @status experimental
 *
 * @dependency sl-button,sl-select,sl-icon
 *
 * @event sl-page-change - Emitted when current page changed   .
 * @event sl-page-before-change - Emitted before  page changed,use can defaultPrevented ,then sl-page-change can not be emit    .
 *
 * @slot prefix The prefix slot.
 * @slot no-data - when total=0 to show .
 * @slot default - tool bar end to show .

 * @csspart base - The component's base wrapper.
 * @csspart pageWrap - The component's to page button  wrapper.
 *
 *
 */
 @customElement("wa-pagination")
export default class WaPagination extends WebAwesomeElement {
  static css = [styles];
  private readonly localize = new LocalizeController(this);
  /** Current page */
  @property({ type: Number, reflect: true, attribute: 'value' }) value = 1;
  /** Page Break Size */
  @property({ type: Number, attribute: 'page-size', reflect: true }) pageSize = 20;
  /** Whether to resize the paging component */
  @property({ type: Boolean, attribute: 'show-size-change', reflect: true }) showSizeChange = false;

  /** Whether to allow direct adjustment of the first few pages */
  @property({ type: Boolean, attribute: 'show-page-change', reflect: true }) showPageChange = false;

  /** Allowed or not Simplified paging mode */
  @property({ type: Boolean }) simple = false;
  /**Layout alignment */
  @property({ type: String, attribute: 'align', reflect: true }) align: 'left' | 'right' | 'center' = 'right';

  /** Total number of sizes */
  @property({ type: Number, attribute: 'total', reflect: true }) total: number;
  /** Support for resized pagination */
  @property({ type: Array, attribute: false }) pageSizeOptions: Array<Number> = Array.from({ length: 10 }, (_item, value) => 10 + value * 10);
  /** Whether to display Jump directly to the first page */
  @property({ type: Boolean, attribute: false }) showFirst = false;
  /** Show or not Show Jump directly to the last page */
  @property({ type: Boolean, attribute: false }) showLast = false;

  get pageCount() {
    return Math.ceil(this.total / this.pageSize);
  }

  @watch(['value', 'pageSize', 'total'])
  watchPageChange() {
    if (this.total < 0) {
      this.total = 0;
    }
    if (this.value > this.pageCount) {
      this.value = this.pageCount;
    }
    if (this.value <= 0) {
      this.value = 1;
    }
  }
  _renderSimple() {
    return html`<wa-input size="small" type="number" step="1" min="1" max=${this.pageCount} .value=${this.value + ''}></wa-input><span part="page" class="pageCountSpan">von ${this.pageCount}</span>`;
  }
  _renderPageButton() {
    const pageCount = this.pageCount;
    const current = this.value;
    let prev = current - 3;
    let size = 3;
    if (prev <= 1) {
      prev = 1;
      size = current - prev;
    }
    let next = current + (7 - size);
    if (next > pageCount) {
      next = pageCount;
    }
    if (next - prev < 7) {
      prev = next - 7;
      if (prev < 1) {
        prev = 1;
      }
    }
    const array = [];
    for (let i = prev; i <= next; i++) {
      array.push(i);
    }
    return html`${repeat(array, item => html`<wa-button size="small" data-page-no=${item} .variant=${this.value == item ? 'primary' : 'default'}>${item}</wa-button> `)}`;
  }

  _renderPage() {
    const result: Array<TemplateResult<1>> = [];
    result.push(this._renderPageButton());
    if (this.showPageChange) {
      result.push(this._renderSimple());
    }
    if (this.showSizeChange) {
      result.push(html`<wa-select size="small" .hoist=${true} part="show-size-change" .value=${this.pageSize + ''}>
        ${repeat(this.pageSizeOptions, (value, _index) => html`<wa-option .value=${value + ''}>${value}</wa-option>`)}
      </wa-select>`);
    }
    return result;
  }
  private _eventDispose1: {
    dispose: () => void;
  };
  private _eventDispose2: {
    dispose: () => void;
  };
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
    let baseDiv = this.renderRoot.querySelector('div[part=base]') as HTMLElement;
    this._eventDispose1 = onEvent(baseDiv, 'wa-button[data-page-no]', 'click', async (event: MouseEvent) => {
      let pageNo = ((event as any).delegateTarget as WaButton).getAttribute('data-page-no');
      let tempNo = parseInt(pageNo as string, 10);
      if (isNaN(tempNo)) {
        this.goToPageByKey(pageNo as string);
      } else {
        this.goToPage(tempNo);
      }
      });
      this._eventDispose2 = onEvent(baseDiv, 'wa-input,wa-select[part=show-size-change]', 'change', (event: Event) => {
        let el = (event as any).delegateTarget as HTMLElement;
        //@ts-ignore
        const beforeEvent = this.emit('wa-page-before-change');
        if (!beforeEvent.defaultPrevented) {
          if (el.matches('wa-select[part=show-size-change]')) {
            this.pageSize = Number((el as any).value);
          } else {
            this.watchPageChange();
            let value = (el as any).value;
            if (isNaN(value)) {
              value = 1;
            }
            value = Number(value);
            if (value > this.pageCount) {
              value = this.pageCount;
            }
            (el as any).value = value;
            this.value = value;
          }
          //@ts-ignore
          this.emit('wa-page-change', {
            detail: { value: this.value }
          });
        }
      });

  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._eventDispose1?.dispose();
    this._eventDispose2?.dispose();
  }
  private goToPageByKey(pageKey: string) {
    let result = 1;
    pageKey = pageKey.toLowerCase();
    switch (pageKey) {
      case 'first':
        result = 1;
        break;
      case 'prev':
        result = this.value - 1;
        break;
      case 'next':
        result = this.value + 1;
        break;
      case 'last':
        result = this.pageCount;
        break;
      default:
        result = this.value;
    }
    this.goToPage(result);
  }
  goToPage(pageNo: number) {
    //@ts-ignore
    const event = this.emit('wa-page-before-change');
    if (!event.defaultPrevented) {
      if (!isNaN(pageNo)) {
        let tempValue = pageNo;
        if (tempValue <= 0) {
          tempValue = 1;
        } else if (tempValue > this.pageCount) {
          tempValue = this.pageCount;
        }
        this.value = tempValue;
        //@ts-ignore
        this.emit('wa-page-change', {
          detail: { value: this.value }
        });
      }
    }
  }

  render() {
    return html`<div part="base" page-align=${this.align}>
      <slot name="prefix"></slot>
      ${this.total == 0
        ? html`<div part="no-data"><slot name="no-data">${this.localize.term('zoomIn')}</slot></div>`
        : html`
            ${this.showFirst
              ? html`<wa-tooltip content="${this.localize.term('zoomIn')}"
                  ><wa-button size="small" ?disabled=${this.value == 1} data-page-no="first" variant="text"><wa-icon part="first" name="angles-left" library="system"></wa-icon></wa-button
                ></wa-tooltip>`
              : nothing}
            <wa-tooltip content="${this.localize.term('zoomIn')}">
              <wa-button ?disabled=${this.value == 1} data-page-no="prev" size="small" left variant="text"><wa-icon part="prev" name="chevron-left" ?disabled=${this.value <= 1} library="system"></wa-icon></wa-button
            ></wa-tooltip>
            <div part="pageWrap">${this.simple ? this._renderSimple() : this._renderPage()}</div>
            <wa-tooltip content="${this.localize.term('zoomIn')}"
              ><wa-button size="small" ?disabled=${this.value + 1 > this.pageCount} data-page-no="next" right variant="text"><wa-icon part="next" name="chevron-right" ?disabled=${this.value <= 1} library="system"></wa-icon></wa-button
            ></wa-tooltip>
            ${this.showLast
              ? html`<wa-tooltip content="${this.localize.term('zoomIn')}"
                  ><wa-button size="small" ?disabled=${this.value == this.pageCount} data-page-no="last" variant="text"><wa-icon part="last" name="angles-right" library="system"></wa-icon></wa-button
                ></wa-tooltip>`
              : nothing}
          `}
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wa-pagination': WaPagination;
  }
}
