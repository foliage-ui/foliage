import React from 'react';
import ReactDOM from 'react-dom';
import { css, assertSelector as ass } from '../foliage';
import { component } from '../react';

const button = css`
  padding: 1rem 2rem;
  border: 2px solid gray;
  border-radius: 1rem;
  color: white;
  background-color: black;
  appearance: none;
`;

const Button = component('button', button, {
  defaults: { color: 'default' },
  variants: {
    color: {
      primary: css`
        background-color: blue;
        color: white;
      `,
      default: css`
        background-color: gray;
        color: black;
      `,
    },
  },
});

const primary = css`
  background-color: black;
  color: white;
  padding: 1rem 2rem;

  ${button} {
    background-color: red;
    color: white;
  }

  ${button} + ${button} {
    margin-left: 15px;
  }
`;

const primary2 = {
  content: `.f520of8-primary{background-color:#000;color:#fff;padding:1rem 2rem}.f520of8-primary ${ass(
    button,
  )}{background-color:red;color:#fff}`,
  css: 'f520of8-primary',
};

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
