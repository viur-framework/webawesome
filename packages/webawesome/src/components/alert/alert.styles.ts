import { css } from 'lit';

export default css`
  :host {
    --show-duration: 150ms;
    --hide-duration: 150ms;
    align-items: center;
  }

  :host([hidden]) {
    display: none;
  }

  /* Built-in animations */
  :host(.show) {
    animation: show var(--show-duration) ease;
  }

  :host(.hide) {
    animation: show var(--hide-duration) ease reverse;
  }

  @keyframes show {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  [part~='close-button'] {
    margin-inline-start: var(--wa-form-control-padding-inline);
  }

  [part~='close-button']::part(base) {
    padding: 0;
    height: 1em;
    width: 1em;
    color: currentColor;
  }

  @media (hover: hover) {
    :host(:hover) > [part~='close-button']::part(base) {
      background-color: transparent;
      color: color-mix(in oklab, currentColor, var(--wa-color-mix-hover));
    }
  }

  :host(:active) > [part~='close-button']::part(base) {
    background-color: transparent;
    color: color-mix(in oklab, currentColor, var(--wa-color-mix-active));
  }
`;
