import React from 'react';
import '@testing-library/jest-dom';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  prettyDOM as reactTestingLibraryPrettyDOM,
} from '@testing-library/react';
import beautify from 'js-beautify';
import {
  component,
  css,
  keyframes,
  createGlobalStyle,
  Global,
} from '../../react';

export const getCSS = (scope: Document | HTMLElement): string =>
  beautify.css(
    Array.from(scope.querySelectorAll('style'))
      .map((tag) => tag.innerHTML)
      .join('\n')
      .replace(/ {/g, '{')
      .replace(/:\s+/g, ':')
      .replace(/:\s+;/g, ':;'),
  );

export const printDOM = (element: Element | HTMLDocument): string | false =>
  reactTestingLibraryPrettyDOM(element, undefined, { highlight: false });

beforeEach(() => {
  document.head.innerHTML = '';
});

test('check it rendering', () => {
  const style = css`
    color: red;
    &:hover {
      color: black;
    }
    @media (min-width: 800px) {
      padding: 20px;
    }
  `;

  const Example = component('button', style);

  const { baseElement } = render(<Example>content</Example>);

  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".fqwyk1a-style {
        color: red
    }

    .fqwyk1a-style:hover {
        color: #000
    }

    @media (min-width:800px) {
        .fqwyk1a-style {
            padding: 20px
        }
    }"
  `);
  expect(printDOM(baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div>
        <button
          class=\\"fqwyk1a-style\\"
        >
          content
        </button>
      </div>
    </body>"
  `);
});

test('variants from readme', () => {
  const button = css`
    display: inline-block;
    border-radius: 3px;
    padding: 0.5rem 0;
    margin: 0.5rem 1rem;
    width: 11rem;
    border: 2px solid white;
  `;

  const Button = component('a', button, {
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

  const defaultOption = render(<Button>Example</Button>);
  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".f89xayi-button {
        display: inline-block;
        border-radius: 3px;
        padding: .5rem 0;
        margin: .5rem 1rem;
        width: 11rem;
        border: 2px solid #fff
    }

    .f-tt0vsb-Button-variants-color-default {
        background: 0 0;
        color: #fff
    }"
  `);
  expect(printDOM(defaultOption.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div>
        <a
          class=\\"f89xayi-button f-tt0vsb-Button-variants-color-default\\"
        >
          Example
        </a>
      </div>
    </body>"
  `);
  defaultOption.unmount();

  const changedOption = render(<Button color="primary">Example</Button>);
  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".f89xayi-button {
        display: inline-block;
        border-radius: 3px;
        padding: .5rem 0;
        margin: .5rem 1rem;
        width: 11rem;
        border: 2px solid #fff
    }

    .f-tt0vsb-Button-variants-color-default {
        background: 0 0;
        color: #fff
    }

    .f-k92sfa-Button-variants-color-primary {
        background: #fff;
        color: #000
    }"
  `);
  expect(printDOM(changedOption.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div />
      <div>
        <a
          class=\\"f89xayi-button f-k92sfa-Button-variants-color-primary\\"
        >
          Example
        </a>
      </div>
    </body>"
  `);
});

test('extending variants', () => {
  const button = css`
    color: palevioletred;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  `;

  const Button = component('button', button);

  const tomato = css`
    color: tomato;
    border-color: tomato;
  `;

  const TomatoButton = component('button', [button, tomato]);

  const result = render(
    <>
      <Button>Base</Button>
      <TomatoButton>Extended</TomatoButton>
    </>,
  );

  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".fhjc0iy-button {
        color: #db7093;
        font-size: 1em;
        margin: 1em;
        padding: .25em 1em;
        border: 2px solid #db7093;
        border-radius: 3px
    }

    .f2d2unm-tomato {
        color: tomato;
        border-color: tomato
    }"
  `);
  expect(printDOM(result.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div>
        <button
          class=\\"fhjc0iy-button\\"
        >
          Base
        </button>
        <button
          class=\\"fhjc0iy-button f2d2unm-tomato\\"
        >
          Extended
        </button>
      </div>
    </body>"
  `);
});

test('preudoelement, pseudoselectors, nesting', () => {
  const thing = css`
    color: blue;

    &:hover {
      color: red;
    }

    & ~ & {
      background: tomato;
    }

    & + & {
      background: lime;
    }

    &.something {
      background: orange;
    }

    .something-else & {
      border: 1px solid;
    }
  `;

  const Thing = component('div', thing);

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

  const result = render(<Example />);
  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".f-j90c5c-thing {
        color: #00f
    }

    .f-j90c5c-thing:hover {
        color: red
    }

    .f-j90c5c-thing~.f-j90c5c-thing {
        background: tomato
    }

    .f-j90c5c-thing+.f-j90c5c-thing {
        background: #0f0
    }

    .f-j90c5c-thing.something {
        background: orange
    }

    .something-else .f-j90c5c-thing {
        border: 1px solid
    }"
  `);
  expect(printDOM(result.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div>
        <div
          class=\\"f-j90c5c-thing\\"
        >
          Hello world!
        </div>
        <div
          class=\\"f-j90c5c-thing\\"
        >
          How ya doing?
        </div>
        <div
          class=\\"something f-j90c5c-thing\\"
        >
          The sun is shining...
        </div>
        <div>
          Pretty nice day today.
        </div>
        <div
          class=\\"f-j90c5c-thing\\"
        >
          Don't you think?
        </div>
        <div
          class=\\"something-else\\"
        >
          <div
            class=\\"f-j90c5c-thing\\"
          >
            Splendid.
          </div>
        </div>
      </div>
    </body>"
  `);
});

test('animations', () => {
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

  const Block = component('div', block);

  const result = render(<Block />);

  // TODO: keyframes should be appended to a styles
  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".f-a6lm45-block {
        display: inline-block;
        -webkit-animation: [object Object] 2s linear infinite;
        animation: [object Object] 2s linear infinite;
        padding: 2rem 1rem;
        font-size: 1.2rem
    }"
  `);
  expect(printDOM(result.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div>
        <div
          class=\\"f-a6lm45-block\\"
        />
      </div>
    </body>"
  `);
});

test('theming and globalStyle', () => {
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

  const Example = () => (
    <>
      <Global styles={primaryTheme} />
      <Button />
    </>
  );

  const result = render(<Example />);

  expect(getCSS(document)).toMatchInlineSnapshot(`
    ":root {
        --theme-main: palevioletred
    }

    .f7gs9fl-button {
        font-size: 1em;
        margin: 1em;
        padding: .25em 1em;
        border-radius: 3px;
        color: var(--theme-main);
        border: 2px solid var(--theme-main)
    }"
  `);
  expect(printDOM(result.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div>
        <button
          class=\\"f7gs9fl-button\\"
        />
      </div>
    </body>"
  `);
});

test('composable components', () => {
  const baseStyles = css`
    color: white;
    background-color: mediumseagreen;
    border-radius: 4px;
  `;

  const Button = component('button', baseStyles, {
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

  const defaultOptions = render(<Button />);
  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".f-40ddeg-baseStyles {
        color: #fff;
        background-color: #3cb371;
        border-radius: 4px
    }

    .fx4y0y0-Button-variants-color-gray {
        background-color: #dcdcdc
    }

    .f-4ritl8-Button-variants-size-md {
        height: 26px
    }"
  `);
  expect(printDOM(defaultOptions.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div>
        <button
          class=\\"f-40ddeg-baseStyles fx4y0y0-Button-variants-color-gray f-4ritl8-Button-variants-size-md\\"
        />
      </div>
    </body>"
  `);
  defaultOptions.unmount();

  const compoundOptions = render(<Button color="blue" size="lg" />);
  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".f-40ddeg-baseStyles {
        color: #fff;
        background-color: #3cb371;
        border-radius: 4px
    }

    .fx4y0y0-Button-variants-color-gray {
        background-color: #dcdcdc
    }

    .f-4ritl8-Button-variants-size-md {
        height: 26px
    }

    .f14ofny-Button-variants-color-blue {
        background-color: #1e90ff
    }

    .f-uxnw08-Button-variants-size-lg {
        height: 36px
    }

    .f-z7u4br-css {
        background-color: purple
    }"
  `);
  expect(printDOM(compoundOptions.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div />
      <div>
        <button
          class=\\"f-40ddeg-baseStyles f14ofny-Button-variants-color-blue f-uxnw08-Button-variants-size-lg f-z7u4br-css\\"
        />
      </div>
    </body>"
  `);
  compoundOptions.unmount();

  const partialOptions = render(<Button color="blue" />);
  expect(getCSS(document)).toMatchInlineSnapshot(`
    ".f-40ddeg-baseStyles {
        color: #fff;
        background-color: #3cb371;
        border-radius: 4px
    }

    .fx4y0y0-Button-variants-color-gray {
        background-color: #dcdcdc
    }

    .f-4ritl8-Button-variants-size-md {
        height: 26px
    }

    .f14ofny-Button-variants-color-blue {
        background-color: #1e90ff
    }

    .f-uxnw08-Button-variants-size-lg {
        height: 36px
    }

    .f-z7u4br-css {
        background-color: purple
    }"
  `);
  expect(printDOM(partialOptions.baseElement)).toMatchInlineSnapshot(`
    "<body>
      <div />
      <div />
      <div>
        <button
          class=\\"f-40ddeg-baseStyles f14ofny-Button-variants-color-blue f-4ritl8-Button-variants-size-md\\"
        />
      </div>
    </body>"
  `);
  partialOptions.unmount();
});
