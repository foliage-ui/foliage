import { using, DOMElement } from 'forest';
import { styled, StyledRoot } from '../src';

const Button = styled.button`
  padding: 1rem 2rem;
  border: 2px solid gray;
  border-radius: 1rem;
  color: white;
  background-color: black;
  appearance: none;
  -webkit-appearance: none;
`;

const Primary = styled.div`
  background-color: black;
  color: white;
  padding: 1rem 2rem;

  ${Button} {
    background-color: white;
    border-color: lightgray;
    color: black;
  }
`;

const Vertical = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 20rem;

  & > * + * {
    margin-top: 1rem;
  }
`;

function Main() {
  Vertical({
    fn() {
      Button({ text: 'Simple button' });
      Primary({
        fn() {
          Button({ text: 'Button inside Primary' });
        },
      });
    },
  });
}

const root = document.querySelector('#root');
const head = document.querySelector('head');

if (root) {
  using(root as DOMElement, Main);
  using(head as DOMElement, StyledRoot);
}
