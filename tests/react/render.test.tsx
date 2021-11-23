import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { component, css } from '../../react';

export const getCSS = (scope: Document | HTMLElement): string =>
  Array.from(scope.querySelectorAll('style'))
    .map((tag) => tag.innerHTML)
    .join('\n')
    .replace(/ {/g, '{')
    .replace(/:\s+/g, ':')
    .replace(/:\s+;/g, ':;');

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

  render(<Example>content</Example>);

  expect(getCSS(document)).toMatchInlineSnapshot(
    `".f-1hqrme-style{color:red}.f-1hqrme-style:hover{color:#000}@media (min-width:800px){.f-1hqrme-style{padding:20px}}"`,
  );
});
