---
title: Combobox
description: COMBOBOX
layout: component
category: Form Controls
---

```html {.example}
<wa-combobox class="combobox-remote"
  clearable>
</wa-combobox>

<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

:::info
This component works with standard `<form>` elements. Please refer to the section on [form controls](/docs/form-controls) to learn more about form submission and client-side validation.
:::

## Examples

### Labels

Use the `label` attribute to give the combobox an accessible label. For labels that contain HTML, use the `label` slot instead.

```html {.example}
<wa-combobox label="Select one"  class="combobox-remote">
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

### Hint

Add descriptive hint to a combobox with the `hint` attribute. For hints that contain HTML, use the `hint` slot instead.

```html {.example}
<wa-combobox label="Experience" hint="Please tell us your skill level."  class="combobox-remote">
  <wa-option value="1">Novice</wa-option>
  <wa-option value="2">Intermediate</wa-option>
  <wa-option value="3">Advanced</wa-option>
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

### Placeholders

Use the `placeholder` attribute to add a placeholder.

```html {.example}
<wa-combobox placeholder="Select one" class="combobox-remote">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

### Clearable

Use the `with-clear` attribute to make the control clearable. The clear button only appears when an option is selected.

```html {.example}
<wa-combobox with-clear value="option-1" class="combobox-remote" placement="top">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

### Appearance

Use the `appearance` attribute to change the combobox's visual appearance.

```html {.example}
<wa-combobox appearance="filled" class="combobox-remote">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

### Pill

Use the `pill` attribute to give comboboxes rounded edges.

```html {.example}
<wa-combobox pill class="combobox-remote">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

### Disabled

Use the `disabled` attribute to disable a combobox.

```html {.example}
<wa-combobox placeholder="Disabled" disabled class="combobox-remote">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```

### Setting Initial Values

Use the `selected` attribute on individual options to set the initial selection, similar to native HTML.

```html {.example}
<wa-combobox class="combobox-remote">
  <wa-option value="option-1" selected>Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
  <wa-option value="option-4">Option 4</wa-option>
</wa-combobox>
<script>
  const combobox = document.querySelector('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  combobox.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
</script>
```


:::info
Framework users can bind directly to the `value` property for reactive data binding and form state management.
:::


### Sizes

Use the `size` attribute to change a combobox's size.

```html {.example}
<wa-combobox placeholder="Small" size="small">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>

<br />

<wa-combobox placeholder="Medium" size="medium">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>

<br />

<wa-combobox placeholder="Large" size="large">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
```

### Placement

The preferred placement of the combobox's listbox can be set with the `placement` attribute. Note that the actual position may vary to ensure the panel remains in the viewport. Valid placements are `top` and `bottom`.

```html {.example}
<wa-combobox placement="top">
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
```

### Custom Value

Use the `custom-value` attribute to allow users to enter values that aren't in the suggestions list. The typed value is committed when the user presses Enter or moves focus away from the combobox.

```html {.example}
<wa-combobox
  label="Reason for completion"
  placeholder="Select or type a reason"
  custom-value
  class="combobox-custom-value"
></wa-combobox>

<div style="margin-top: 0.75rem; font-size: 0.875rem; color: var(--wa-color-neutral-600)">
  Current value: <strong id="custom-value-output">—</strong>
</div>

<script>
  const combobox = document.querySelector('.combobox-custom-value');
  const output = document.querySelector('#custom-value-output');

  combobox.source = query => {
    const options = [
      { value: 'Target depth reached', text: 'Target depth reached' },
      { value: 'Equipment failure', text: 'Equipment failure' },
      { value: 'Obstruction encountered', text: 'Obstruction encountered' },
    ];
    if (!query) return options;
    return options.filter(o => o.text.toLowerCase().includes(query.toLowerCase()));
  };

  combobox.addEventListener('change', () => {
    output.textContent = combobox.value || '—';
  });
</script>
```

### Start & End Decorations

Use the `start` and `end` slots to add presentational elements like `<wa-icon>` within the combobox.

```html {.example}
<wa-combobox placeholder="Small" size="small" with-clear>
  <wa-icon slot="start" name="house" variant="solid"></wa-icon>
  <wa-icon slot="end" name="flag-checkered"></wa-icon>
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
<br />
<wa-combobox placeholder="Medium" size="medium" with-clear>
  <wa-icon slot="start" name="house" variant="solid"></wa-icon>
  <wa-icon slot="end" name="flag-checkered"></wa-icon>
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
<br />
<wa-combobox placeholder="Large" size="large" with-clear>
  <wa-icon slot="start" name="house" variant="solid"></wa-icon>
  <wa-icon slot="end" name="flag-checkered"></wa-icon>
  <wa-option value="option-1">Option 1</wa-option>
  <wa-option value="option-2">Option 2</wa-option>
  <wa-option value="option-3">Option 3</wa-option>
</wa-combobox>
```



```html {.example}

<script>
  const comboboxes = document.querySelectorAll('.combobox-remote');
  const url = 'https://60db3b45801dcb0017290fdb.mockapi.io/users?name={q}';
  comboboxes.forEach((v)=>{
      v.source = search => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then(data =>
        data.map(d => {
          return {
            text: d.name,
            value: d.id
          };
        })
      );
    };
  })
</script>

```

:::info
The key principle is that the combobox component prioritizes user interactions and explicit selections over programmatic changes, ensuring a predictable user experience even with dynamically loaded content.
:::