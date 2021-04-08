import React from 'react';

interface BlockCSS {
  content: string;
  css: string;
}

export function component(
  Tag: string, // eslint-disable-line @typescript-eslint/naming-convention
  styles: BlockCSS | BlockCSS[],
  {
    component: _c = () => null,
    children: _h = () => null,
    mapVariants = {},
    variants = {},
    compound = [],
    defaults = {},
  } = {},
): React.Component {
  const styleClasses = toArray(styles).map((style) => style.css);

  return ({ className, children, withTheme, ...props }) => {
    React.useEffect(() => {
      toArray(styles).forEach((block) => add(block));
    }, [styleClasses]);
    const classes: string[] = styleClasses.concat([className].filter(Boolean));
    Object.keys(variants).forEach((variantName) => {
      const propValue = props[variantName] ?? defaults[variantName];
      const mapper = mapVariants[variantName] ?? id;
      const variantCase = mapper(propValue);
      const cssBlock = variants[variantName][variantCase];
      if (cssBlock) {
        classes.push(cssBlock.css);
        add(cssBlock);
      }
    });

    compound.forEach(({ css: cssBlock, ...matchers }) => {
      const isMatched = Object.keys(matchers).every((variantName) => {
        const expectedVariantCase = matchers[variantName];
        const propValue = props[variantName] ?? defaults[variantName];
        const mapper = mapVariants[variantName] ?? id;
        const variantCase = mapper(propValue);
        return expectedVariantCase === variantCase;
      });
      if (isMatched) {
        classes.push(cssBlock.css);
        add(cssBlock);
      }
    });

    return <Tag className={classes.join(' ')}>{children}</Tag>;
  };
}

function toArray<T>(maybe: T | T[]): T[] {
  return Array.isArray(maybe) ? maybe : [maybe];
}

function id<T>(value: T): T {
  return value;
}

function add(cssBlock: BlockCSS) {
  console.log(cssBlock);
  if (!document.querySelector(`[data-foliage="${cssBlock.css}"]`)) {
    const style = document.createElement('style');
    style.dataset.foliage = cssBlock.css;
    style.textContent = cssBlock.content;
    document.head.append(style);
  }
}
