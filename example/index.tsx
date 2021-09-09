import React from 'react';
import ReactDOM from 'react-dom';
import { css } from '../foliage';
import { component } from '../react';

const button = css`
  --main: black;
  --text: white;
  padding: 1rem 2rem;
  border: 2px solid gray;
  border-radius: 1rem;
  color: var(--text);
  background-color: var(--main);
  appearance: none;

  &:hover {
    box-shadow: 0 0 15px -3px black;
  }
`;

const Button = component('button', button, {
  defaults: { color: 'default' },
  variants: {
    color: {
      primary: css`
        --main: blue;
        --text: white;
      `,
      default: css`
        --main: gray;
        --text: black;
      `,
    },
  },
});

const primary = css`
  background-color: black;
  color: white;
  padding: 1rem 2rem;

  ${button} {
    --main: red;
    --text: white;
  }

  ${button}:hover {
    --main: pink;
    --text: black;
  }

  ${button} + ${button} {
    margin-left: 15px;
  }
`;

const Wrapper = component('div', [primary]);

const vertical = css`
  display: flex;
  flex-flow: column;
  max-width: 20rem;

  & > * + * {
    margin-top: 1rem;
  }
`;

const Vertical = component('div', [vertical]);

const root = document.querySelector('#root');
const head = document.querySelector('head');

const App = () => (
  <Vertical>
    <Button>Default</Button>
    <Button color="primary">Primary</Button>
    <Wrapper>
      <Button>Button inside Wrapper</Button>
    </Wrapper>
  </Vertical>
);

ReactDOM.render(<App />, root);
