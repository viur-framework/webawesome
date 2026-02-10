---
title: Pagination
description: Pagination streamlines navigation through large data sets by segmenting results into pages, reducing cognitive load and improving findability.
layout: component
---
Pagination streamlines navigation through large data sets by segmenting results into pages, reducing cognitive load and improving findability.

Use this default pagination to navigate a large data set with standard page controls and a fixed page size.
```html {.example}
<wa-pagination id='page-btn-DIV' total='2120' page-size='20' value='1'></wa-pagination>
```


## Examples

### Simple Pagination

Use the simple variant for compact views where you only need basic next/previous navigation.

```html {.example}
<wa-pagination id='page-btn-DIV2' total='2120' page-size='20' value='1' simple></wa-pagination>
```

### Empty Pagination

Use the simple variant for compact views where you only need basic next/previous navigation.

```html {.example}
<wa-pagination id='page-btn-DIV2' total='0' page-size='20' value='1' simple></wa-pagination>
```

### Full Pagination

Use the full variant when users must jump to first/last pages and adjust page size in enterprise workflows.

```html {.example}
<wa-pagination id='page-btn-DIV3' total='2120' page-size='20' value='1' show-first show-last show-size-change show-page-change></wa-pagination>
```
