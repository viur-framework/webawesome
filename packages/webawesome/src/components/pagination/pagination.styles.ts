import { css } from "lit";

export default css`
  :host {
    display: block;
    font-size: inherit;
  }

  div[part=base] {
    display: flex;
    white-space: nowrap;
    align-items: center;
  }
  div[part=base][page-align=left] {
    justify-content: flex-start;
  }
  div[part=base][page-align=center] {
    justify-content: center;
  }
  div[part=base][page-align=right] {
    justify-content: flex-end;
  }

  .pageCountSpan {
    margin: auto 5px;
  }

  div[part=pageWrap] {
    display: inline-flex;
  }

  div[part=no-data] {
    margin: 0 1em;
    color: rgb(var(--wa-color-gray-30));
  }

  wa-button {
    margin: 0 3px;
    color: inherit;
    cursor: pointer;
  }
  wa-button[disabled] {
    cursor: default;
  }
  wa-button wa-icon {
    color: rgb(var(--wa-color-neutral-600));
  }

  wa-button::part(base) {
    height: var(--wa-input-height-small);
    line-height: var(--wa-input-height-small);
  }

  wa-select, wa-input {
    display: inline-flex;
    margin: 0 3px;
  }
`
