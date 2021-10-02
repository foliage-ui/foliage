interface CompilationResult {
  __NONE: number;
}
export function serialize(
  compilationResult: CompilationResult,
  // eslint-disable-next-line @typescript-eslint/ban-types
  stringifier: Function,
): string;
export function compile(styles: string): CompilationResult;
export function stringify(): void;
