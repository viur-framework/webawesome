---
title: Alert
description: Alerts display important messages inline that can be dismissed or auto-hidden.
layout: component
category: Feedback & Status
---

Unlike `<wa-callout>`, alerts are stateful and can be shown/hidden, optionally dismissed, and auto-hidden after a duration. Use alerts when the message lifecycle matters. Use callouts for static, always-visible messaging.

```html {.example}
<wa-alert open>
  <wa-icon slot="icon" name="circle-info" library="cdn"></wa-icon>
  This is a standard alert. You can customize its content and even the icon.
</wa-alert>
```

Alerts are only visible when the `open` attribute is present.

## Examples

### Variants

Set the `variant` attribute to change the alert's variant.

```html {.example}
<wa-alert variant="brand" open>
  <wa-icon slot="icon" name="circle-info" library="cdn"></wa-icon>
  <strong>This is super informative</strong><br />
  You can tell by how pretty the alert is.
</wa-alert>

<br />

<wa-alert variant="success" open>
  <wa-icon slot="icon" name="circle-check" library="cdn"></wa-icon>
  <strong>Your changes have been saved</strong><br />
  You can safely exit the app now.
</wa-alert>

<br />

<wa-alert variant="neutral" open>
  <wa-icon slot="icon" name="gear" library="cdn"></wa-icon>
  <strong>Your settings have been updated</strong><br />
  Settings will take effect on next login.
</wa-alert>

<br />

<wa-alert variant="warning" open>
  <wa-icon slot="icon" name="triangle-exclamation" library="cdn"></wa-icon>
  <strong>Your session has ended</strong><br />
  Please login again to continue.
</wa-alert>

<br />

<wa-alert variant="danger" open>
  <wa-icon slot="icon" name="circle-exclamation" library="cdn"></wa-icon>
  <strong>Your account has been deleted</strong><br />
  We're very sorry to see you go!
</wa-alert>
```

### Closable

Add the `closable` attribute to show a close button that will hide the alert.

```html {.example}
<wa-alert variant="brand" open closable class="alert-closable">
  <wa-icon slot="icon" name="circle-info" library="cdn"></wa-icon>
  You can close this alert any time!
</wa-alert>

<script>
  const alert = document.querySelector('.alert-closable');
  alert.addEventListener('wa-after-hide', () => {
    setTimeout(() => (alert.open = true), 2000);
  });
</script>
```

### Without Icons

Icons are optional. Simply omit the `icon` slot if you don't want them.

```html {.example}
<wa-alert variant="brand" open> Nothing fancy here, just a simple alert. </wa-alert>
```

### Duration

Set the `duration` attribute to automatically hide an alert after a period of time. This is useful for alerts that don't require acknowledgement. The timer pauses while the alert is hovered.

```html {.example}
<div class="alert-duration">
  <wa-button variant="brand">Show Alert</wa-button>

  <wa-alert variant="brand" duration="3000" closable>
    <wa-icon slot="icon" name="circle-info" variant="regular" library="cdn"></wa-icon>
    This alert will automatically hide itself after three seconds, unless you interact with it.
  </wa-alert>
</div>

<script>
  const container = document.querySelector('.alert-duration');
  const button = container.querySelector('wa-button');
  const alert = container.querySelector('wa-alert');

  button.addEventListener('click', () => alert.show());
</script>

<style>
  .alert-duration wa-alert {
    margin-top: var(--wa-space-m);
  }
</style>
```
