import { createEvent, createStore } from 'effector';
import { using, h, spec, node } from 'effector-dom';
import { serialize, compile, stringify } from 'stylis';

const addStyle = createEvent<{ id: string; styles: string }>();
const $styles = createStore<{ map: Map<string, string> }>({ map: new Map() });

$styles.on(addStyle, (state, { id, styles }) => {
  if (state.map.has(id)) return state;
  state.map.set(id, make(id, styles));
  return { map: state.map };
});

function make(id: string, styles: string) {
  return serialize(compile(`.es-${id} { ${styles} }`), stringify);
}

const idCount = () => {
  let id = 9005000;
  return () => (++id).toString(36);
};

const styledId = idCount();

type ComponentType = Function & { STYLED_ID: string };

function join(strings: string[], interps: (string | ComponentType | number)[]) {
  const result = [strings[0]];
  interps.forEach((part, index) => {
    if (typeof part === 'function') {
      if (typeof part.STYLED_ID === 'string') {
        result.push(`.es-${part.STYLED_ID}`);
      } else {
        throw new TypeError('Passed not an effector styled component');
      }
    } else {
      result.push(String(part));
    }
    result.push(strings[index + 1]);
  });

  return result.join('');
}

const domElements = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'marquee',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',

  // SVG
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan',
] as const;

type DomTag = typeof domElements[number];

const styled = (tag: DomTag) => (
  content: string[],
  ...interpolations: (string | ComponentType | number)[]
) => {
  const id = styledId();

  const styles = join(content, interpolations);

  const Component = (config: any) => {
    addStyle({ id, styles });

    (h as any)(tag, {
      fn() {
        node((reference) => {
          reference.classList.add(`es-${id}`);
        });
        if (config) {
          spec(config);
          if (typeof config.fn === 'function') {
            config.fn();
          }
        }
      },
    });
  };

  Component.STYLED_ID = id;

  return Component;
};

domElements.forEach((element) => {
  styled[element] = styled(element);
});

type Styled = {
  [P in DomTag]: number;
};

export { styled };
