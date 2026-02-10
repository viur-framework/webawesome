export class WaBeforeChangeEvent extends Event {
  constructor() {
    super('wa-before-change', { bubbles: true, cancelable: false, composed: true });
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    'wa-before-change': WaBeforeChangeEvent;
  }
}
