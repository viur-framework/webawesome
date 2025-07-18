---
title: Accordion
description: Description of component.
layout: component
---

```html {.example}
<wa-accordion>
    <wa-details open>
    <div slot="summary" class="wa-flank">
        <wa-icon  name="plus"></wa-icon>
        <span>First</span>
    </div>
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </wa-details>

  <wa-details>
    <div slot="summary" class=wa-split:row">
        <span>Second</span>
        <wa-badge variant="brand" attention="bounce" pill>1</wa-badge>
    </div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </wa-details>

  <wa-details class="change_icon" summary="Third">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    <wa-icon slot="expand-icon" name="angles-right"></wa-icon>    
    <wa-icon slot="collapse-icon" name="angles-right"></wa-icon>    
  </wa-details>
</wa-accordion>
```
