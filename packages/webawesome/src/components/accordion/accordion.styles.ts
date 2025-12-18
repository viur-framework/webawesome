import {css} from 'lit'

export default css`
:host {
  display: block;
  --details-gap: var(--wa-space-s);
}

::slotted(wa-details:not(:last-of-type)) {
    margin-bottom: var(--details-gap);
  }

`
