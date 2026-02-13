/** Waits for a specific event to be emitted from an element. Ignores events that bubble up from child elements. */
export function waitForEvent(el: HTMLElement, eventName: string) {
  return new Promise<void>(resolve => {
    function done(event: Event) {
      if (event.target === el) {
        el.removeEventListener(eventName, done);
        resolve();
      }
    }

    el.addEventListener(eventName, done);
  });
}

type EventDisposable = { dispose: () => void };

/**
 * Delegates events from a parent element to matching descendants.
 * Adds `event.delegateTarget` when a match is found.
 */
export function onEvent(
  node: Element,
  selector: string,
  type: string,
  callBack: EventListener,
  userCapture = false,
  context?: unknown,
): EventDisposable {
  const listener = function (e: Event) {
    const target = e.target as Node | null;
    const elementTarget = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const delegateTarget = elementTarget?.closest(selector) ?? null;
    (e as any).delegateTarget = delegateTarget;
    if (delegateTarget) {
      callBack.call(context || delegateTarget, e);
    }
  };

  if (typeof userCapture === 'undefined') {
    // UI events: load, unload, scroll, resize
    // Focus events: blur, focus
    // Mouse events: mouseleave, mouseenter
    if (type === 'mouseenter' || type === 'mouseleave' || type === 'blur' || type === 'focus') {
      userCapture = true;
    }
  }

  node.addEventListener(type, listener, userCapture);

  return {
    dispose() {
      node.removeEventListener(type, listener, userCapture);
    },
  };
}
