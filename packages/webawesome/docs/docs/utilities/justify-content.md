---
title: Justify Content
description: Justify content utilities control the horizontal alignment of items within flex and grid containers. Like other Web Awesome layout utilities.
layout: docs
tags: layoutUtilities
---

<style>
  .preview-wrapper {
    border: var(--wa-border-width-s) dashed var(--wa-color-neutral-border-normal);
    border-radius: var(--wa-border-radius-m);
    min-block-size: 3em;
    padding: var(--wa-space-2xs);
  }
  .preview-block {
    aspect-ratio: 1 / 1;
    background-color: var(--wa-color-neutral-fill-loud);
    border-radius: var(--wa-border-radius-s);
    min-block-size: 1em;
  }

</style>

Web Awesome includes classes to set the `justify-content` property of flex and grid containers. They can be used alongside other Web Awesome layout utilities, like [cluster](/docs/layout/cluster) and [stack](/docs/layout/stack), to align children within a container along the container’s main axis.

| Class Name                 | `justify-content` Value | Preview                                                                                                                                   |
|----------------------------|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `wa-justify-start`         | `flex-start`            | <div class="wa-cluster wa-justify-start preview-wrapper"><div class="preview-block"></div><div class="preview-block"></div><div class="preview-block"></div></div>         |
| `wa-justify-center`        | `center`                | <div class="wa-cluster wa-justify-center preview-wrapper"><div class="preview-block"></div><div class="preview-block"></div><div class="preview-block"></div></div>    |
| `wa-justify-end`           | `flex-end`              | <div class="wa-cluster wa-justify-end preview-wrapper"><div class="preview-block"></div><div class="preview-block"></div><div class="preview-block"></div></div>           |
| `wa-justify-space-around`  | `space-around`          | <div class="wa-cluster wa-justify-space-around preview-wrapper"><div class="preview-block"></div><div class="preview-block"></div><div class="preview-block"></div></div>  |
| `wa-justify-space-between` | `space-between`         | <div class="wa-cluster wa-justify-space-between preview-wrapper"><div class="preview-block"></div><div class="preview-block"></div><div class="preview-block"></div></div> |
| `wa-justify-space-evenly`  | `space-evenly`          | <div class="wa-cluster wa-justify-space-evenly preview-wrapper"><div class="preview-block"></div><div class="preview-block"></div><div class="preview-block"></div></div>  |
