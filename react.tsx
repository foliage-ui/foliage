import React, { ReactNode } from 'react';

interface BlockCSS {
  content: string;
  css: string;
}

interface ComponentConfig {
  component?: React.FC;
  children?: React.FC;
  mapVariants?: Record<string, (value: any) => any>;
  variants?: Record<string, Record<string, BlockCSS>>;
  compound?: Array<{ css: BlockCSS } & Record<string, any>>;
  defaults?: Record<string, any>;
}

interface ComponentProps {
  className?: string;
}

export function component(
  tag: string, // eslint-disable-line @typescript-eslint/naming-convention
  styles: BlockCSS | BlockCSS[],
  {
    component: _c = () => null,
    children: _h = () => null,
    mapVariants = {},
    variants = {},
    compound = [],
    defaults = {},
  }: ComponentConfig = {},
): React.FC<ComponentProps & Record<string, unknown>> {
  const styleClasses = toArray(styles).map((style) => style.css);
  console.log('COM', tag, variants, styles);

  return ({ className, children, ...props }) => {
    React.useEffect(() => {
      toArray(styles).forEach((block) => add(block));
    }, [styleClasses]);
    const classes: string[] = styleClasses.concat([className].filter(isString));
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

    const Tag = (tag as unknown) as React.FC<{ className?: string }>;
    return <Tag className={classes.join(' ')}>{children}</Tag>;
  };
}

function toArray<T>(maybe: T | T[]): T[] {
  return Array.isArray(maybe) ? maybe : [maybe];
}

function id<T>(value: T): T {
  return value;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
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
