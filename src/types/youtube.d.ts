declare namespace YT {
  class Player {
    constructor(elementId: string, options: Record<string, unknown>);
    destroy(): void;
  }
  interface OnStateChangeEvent { data: number; }
}
interface Window { YT: typeof YT; }
