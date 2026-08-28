import { css } from 'lit';

export default css`
  :host {
    --show-duration: 150ms;
    --hide-duration: 150ms;
    --progress-bar-height: 4px;
    --progress-bar-color: currentColor;
    align-items: center;
    overflow: hidden;
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

  [part~='progress-bar'] {
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 0;
    width: var(--progress);
    height: var(--progress-bar-height);
    background-color: var(--progress-bar-color);
    opacity: 0.5;
    pointer-events: none;
    transition: width 50ms linear;
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
