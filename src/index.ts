import { createEvent, createStore, Store } from 'effector';
import { DOMTag, h, node, spec } from 'forest';
import { serialize, compile, stringify } from 'stylis';

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

type Cb = () => void;

export type Component = ((config: Spec | Cb) => void) & {
  STYLED_ID: string;
};

function join(
  strings: TemplateStringsArray,
  interps: (string | Component | number)[],
) {
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

export type Spec = Parameters<typeof spec>[0] & { fn?: Cb };

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

  const Component = (config: Spec | Cb) => {
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
