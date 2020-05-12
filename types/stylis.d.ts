declare module 'stylis' {
  type CompilationResult = { __NONE: number };
  export function serialize(
    compilationResult: CompilationResult,
    stringifier: Function,
  ): string;
  export function compile(styles: string): CompilationResult;
  export function stringify(): void;
}
