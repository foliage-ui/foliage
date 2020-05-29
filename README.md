# leafs

## Usage

```ts
import { using } from 'forest';
import { styled, StyledRoot } from 'leafs';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 2px 20px;
  box-sizing: border-box;
  min-height: 100vh;
  margin-bottom: 160px;
  background: linear-gradient(20deg, rgb(219, 112, 147), rgb(218, 163, 87));
`;

const Button = styled.a`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: white;
  border: 2px solid white;
  text-decoration: none;

  &[data-fill='true'] {
    background: white;
    color: palevioletred;
  }
`;

function App() {
  Block({
    fn() {
      Button({
        text: 'Google',
        attr: { href: 'https://google.com' },
        data: { fill: true },
      });
      Button({
        text: 'Yandex',
        attr: { href: 'https://yandex.ru' },
      });
    },
  });
}

using(document.querySelector('#root'), App);
using(document.querySelector('head'), StyledRoot));
```
