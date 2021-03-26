//https://astexplorer.net/#/gist/68f6ac120f7543e3efc6a43b0904e107/ab6b50e36e1ebc79938d80b6d9547dac9d6465e2
https: import { css, keyframes, createGlobalStyle } from 'foliage-react';

const padding = css`
  --woly-vertical: calc(
    1px * var(--woly-component-level) * var(--woly-main-level)
  );
  --woly-horizontal: calc(
    var(--woly-const-m) + (1px * var(--woly-main-level)) + var(--woly-vertical)
  );
  padding: var(--woly-vertical) var(--woly-horizontal);
`;

const gap = css`
  --woly-gap: calc(
    (1px * var(--woly-main-level)) +
      (1px * var(--woly-main-level) * var(--woly-component-level))
  );
`;

const gapPrint = css`
  @media print {
    --woly-gap: calc(
      (1px * var(--woly-main-level)) +
        (1px * var(--woly-main-level) * var(--woly-component-level))
    );
  }
`;

const Global = createGlobalStyle`
  body {
    color: black;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const vars = theme('woly', {
  rounding: '4px',
});

vars = {};

vars.rounding.property; // --woly-rounding

const icon = css``;

const button = css`
  border-radius: var(${vars.rounding});
  animation: ${fadeIn} 3s infinite;

  & ${icon} {
    margin-left: 10px;
  }
`;

const button_compiled = {
  [Symbol.for('foliage.content')]:
    // prettier-ignore
    `.8sdy7g{border-radius:var(${_assert.var(vars.rounding)});animation:${_assert.keyframe(fadeIn)} 3s infinite};.8sdy7g ${_assert.class(icon)}{margin-left:10px}`,
  [Symbol.for('foliage.class')]: `8sdy7g`,
};
