# foliage 🍃

<!-- [NPM](https://npmjs.org/package/foliage) -->

[GitHub](https://github.com/effector/foliage) [dev.to](https://dev.to/foliage)

## Usage with React

> Work in progress. Most of this examples are just concept

<!-- [Edit on Stackblitz](https://stackblitz.com/edit/foliage-forest) -->

```ts
import { css, component } from 'foliage-react';

const button = css`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  border: 2px solid white;
`;

export const Button = component('a', button, {
  defaults: { color: 'default' },
  variants: {
    color: {
      primary: css`
        background: white;
        color: black;
      `,
      default: css`
        background: transparent;
        color: white;
      `,
    },
  },
});
```

### Extending styles

```ts
import { css, component } from 'foliage-react';

const button = css`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

export const Button = component('button', button);

const tomato = css`
  color: tomato;
  border-color: tomato;
`;

export const TomatoButton = component('button', [button, tomato]);
```

### Pseudoelement, pseudoselectors, and nesting

```tsx
import { css, component } from 'foliage-react';

const thing = css`
  color: blue;

  &:hover {
    color: red; // <Thing> when hovered
  }

  & ~ & {
    background: tomato; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
  }

  & + & {
    background: lime; // <Thing> next to <Thing>
  }

  &.something {
    background: orange; // <Thing> tagged with an additional CSS class ".something"
  }

  .something-else & {
    border: 1px solid; // <Thing> inside another element labeled ".something-else"
  }
`;

export const Thing = component('div', thing, { attrs: { tabIndex: 0 } });

const Example = () => (
  <>
    <Thing>Hello world!</Thing>
    <Thing>How ya doing?</Thing>
    <Thing className="something">The sun is shining...</Thing>
    <div>Pretty nice day today.</div>
    <Thing>Don't you think?</Thing>
    <div className="something-else">
      <Thing>Splendid.</Thing>
    </div>
  </>
);
```

### Animations

```ts
import { css, keyframes, component } from 'foliage-react';

const rotate = keyframes`
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
`;

const block = css`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;

export const Block = component('div', block);
```

### Theming

```tsx
import { css, keyframes, createGlobalStyle, Global } from 'foliage-react';
const theme = {
  main: '--theme-main',
};

const button = css`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

  /* Color the border and text with theme.main */
  color: var(${theme.main});
  border: 2px solid var(${theme.main});
`;

const Button = component('button', button);

const primaryTheme = createGlobalStyle`
  :root {
    ${theme.main}: palevioletred;
  }
`;

const secondaryTheme = createGlobalStyle`
  :root {
    ${theme.main}: mediumseagreen;
  }
`;

const Example = () => (
  <>
    <Global styles={primaryTheme} />
    <Button />
  </>
);
```

### Composable components

```tsx
import { css, component } from 'foliage-react';

const baseStyles = css`
  color: white;
  background-color: mediumseagreen;
  border-radius: 4px;
`;

export const Button = component('button', baseStyles, {
  variants: {
    color: {
      gray: css`
        background-color: gainsboro;
      `,
      blue: css`
        background-color: dodgerblue;
      `,
    },
    size: {
      md: css`
        height: 26px;
      `,
      lg: css`
        height: 36px;
      `,
    },
  },
  compound: [
    {
      color: 'blue',
      size: 'lg',
      css: css`
        background-color: purple;
      `,
    },
  ],
  defaults: {
    color: 'gray',
    size: 'md',
  },
});
```

## Release process

1. Check out the [draft release](https://github.com/foliage-ui/foliage/releases).
1. All PRs should have correct labels and useful titles. You can [review available labels here](https://github.com/foliage-ui/foliage/blob/master/.github/release-drafter.yml).
1. Update labels for PRs and titles, next [manually run the release drafter action](https://github.com/foliage-ui/foliage/actions/workflows/release-drafter.yml) to regenerate the draft release.
1. Review the new version and press "Publish"
1. If required check "Create discussion for this release"
