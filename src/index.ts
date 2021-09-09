import { createEvent, createStore } from 'effector';
import { DOMTag, h, node, spec } from 'forest';
import { compile, serialize, stringify } from 'stylis';

import { domElements } from './elements';

const addStyle = createEvent<{ id: string; styles: string }>();
const $styles = createStore<{ map: Map<string, string> }>({ map: new Map() });

export function StyledRoot(): void {
  const text = $styles.map(({ map }) => [...map.values()].join(' '));
  h('style', { text });
}

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

type Callback = () => void;

export type FunctionComponent = (config: Spec | Callback) => void;

export type Component = FunctionComponent & {
  STYLED_ID: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
function hasStyledId(fn: object | Function): fn is { STYLED_ID: string } {
  // eslint-disable-next-line dot-notation
  return typeof fn['STYLED_ID'] === 'string';
}

function join(
  strings: TemplateStringsArray,
  interps: (string | FunctionComponent | Component | number)[],
) {
  console.log('JOIN', strings, interps);
  const result = [strings[0]];
  interps.forEach((part, index) => {
    if (typeof part === 'function') {
      if (hasStyledId(part)) {
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

export type Spec = Parameters<typeof spec>[0] & { fn?: Callback };

type Creator = (
  content: TemplateStringsArray,
  ...interpolations: (string | Component | number)[]
) => Component;

type TagFabric = (tag: DOMTag) => Creator;

type TagMap = {
  [P in DOMTag]: Creator;
};

const fabric: TagFabric & Partial<TagMap> = (tag: DOMTag) => (
  content,
  ...interpolations
) => {
  const id = styledId();

  const styles = join(content, interpolations);

  const Component = (config: Spec | Callback) => {
    addStyle({ id, styles });

    h(tag, () => {
      node((reference) => {
        reference.classList.add(`es-${id}`);
      });
      if (config) {
        if (typeof config === 'function') {
          config();
        } else {
          spec(config);
          if (typeof config.fn === 'function') {
            config.fn();
          }
        }
      }
    });
  };

  Component.STYLED_ID = id;

  return Component;
};

domElements.forEach((element) => {
  fabric[element] = fabric(element);
});

export const styled = fabric as TagFabric & TagMap;
