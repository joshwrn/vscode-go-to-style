# Go To Style README

A simple vscode extension to go to a specific css/scss class by clicking on the css module (`styles.wrapper`).

## Extension Link

https://marketplace.visualstudio.com/items?itemName=josh-warren.go-to-style

## Tutorial

1. Install the extension
2. Right click on the class name you want to go to.
3. Click on `Go To Style`

![Tutorial](https://i.imgur.com/4h7o9bC.gif)

## Example

In the following example, clicking on `styles.title` will take you to the definition of the class in the `styles.module.scss` file.

```tsx
// ./index.tsx

import React from 'react'
import styles from './styles.module.scss'

const Component = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Title</div>
      <div className={styles.subtitle}>Subtitle</div>
    </div>
  )
}

export default Component
```

Clicking `styles.title` will take you here:

```scss
// ./styles.module.scss

.title {
  font-size: 20px;
  font-weight: bold;
}
```
