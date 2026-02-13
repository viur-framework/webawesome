import { css } from 'lit';

export default css`
  :host {
    display: block;
    font-size: inherit;
  }

  div[part='base'] {
    display: flex;
    white-space: nowrap;
    align-items: center;
  }
  div[part='base'][page-align='left'] {
    justify-content: flex-start;
  }
  div[part='base'][page-align='center'] {
    justify-content: center;
  }
  div[part='base'][page-align='right'] {
    justify-content: flex-end;
  }

  .pageCountSpan {
    margin: auto 5px;
  }

  div[part='pageWrap'] {
    display: inline-flex;
  }

  div[part='empty'] {
    margin: 0 1em;
  }

  wa-button {
    margin: 0 3px;
    color: inherit;
    cursor: pointer;
  }
  wa-button[disabled] {
    cursor: default;
  }

  wa-select,
  wa-input {
    display: inline-flex;
    margin: 0 3px;
  }
`;
