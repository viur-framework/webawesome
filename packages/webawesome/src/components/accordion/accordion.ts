import { html } from 'lit';
import { customElement, queryAssignedNodes } from 'lit/decorators.js';
import WebAwesomeElement from '../../internal/webawesome-element.js';
import styles from './accordion.styles.js';

/**
 * @summary Provides a wrapper for the details component to implement an accordion-like behavior, allowing only a single section to be open at any given time.
 * @documentation https://viur-framework.github.io/webawesome/docs/components/accordion
 * @status experimental
 * @since 3.0
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --details-gap - The Gap between the details.
 */
 @customElement("wa-accordion")
export default class WaAccordion extends WebAwesomeElement {
  static css = styles;

  @queryAssignedNodes({flatten:true})
  currentSlotNodes: any;

  hasChanged() {
    this.registerDetails();
  }

  handleSlotChange() {
    this.registerDetails();
  }

  registerDetails() {
    let detailsList = Array.prototype.filter.call(
      this.currentSlotNodes,
      (node: any) => node.nodeType == Node.ELEMENT_NODE
    );

    if (detailsList) {
      for (const details of detailsList) {
        details.addEventListener('wa-show', (event: Event) => {
          [...detailsList].map(details => (details.open = event.target === details));
        });
      }
    }
  }


  render() {
    return html` <slot part="base" @slotchange=${this.handleSlotChange}></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wa-accordion': WaAccordion;
  }
}
