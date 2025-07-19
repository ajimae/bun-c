import { cc, CString, type ConvertFns, type Pointer } from "bun:ffi";

type FFIFunction = {
  readonly get: {
    readonly args: readonly [];
    readonly returns: "ptr";
  };
  readonly save: {
    readonly args: readonly ["cstring"];
    readonly returns: "void";
  };
};

export class BunCache<K extends string | number | symbol, V extends unknown> {
  private symbols: ConvertFns<FFIFunction>;

  constructor() {
    this.symbols = this.init();
  }

  async set(key: K, value: V): Promise<void> {
    const o = { [key]: value } as Record<K, V>;
    const ptr = this.symbols.get() as Pointer;
    const jsonStr = new CString(ptr).toString();

    if (Boolean(jsonStr)) this.merge(JSON.parse(jsonStr), o);
    else {
      this.merge({} as Record<K, V>, o);
    }
  }

  async get(key: K): Promise<V | undefined> {
    const ptr = this.symbols.get() as Pointer;
    const jsonStr = new CString(ptr).toString();

    if (Boolean(jsonStr)) {
      const data = JSON.parse(jsonStr);
      return data[key] ?? undefined;
    }

    return undefined;
  }

  async mGet(): Promise<V | undefined> {
    const ptr = this.symbols.get() as Pointer;
    const jsonStr = new CString(ptr).toString();
    return Boolean(jsonStr) ? JSON.parse(jsonStr) : undefined;
  }

  private merge(o: Record<K, V>, m: Record<K, V>): void {
    const json = Object.assign({}, o, m);
    const jsonStr = JSON.stringify(json);
    const cString = Buffer.from(jsonStr, "utf-8");
    this.symbols.save(cString);
  }

  private init() {
    return cc({
      source: "./cache.c",
      symbols: {
        get: {
          args: [],
          returns: "ptr",
        },
        save: {
          args: ["cstring"],
          returns: "void",
        },
      } as const,
    }).symbols;
  }
}
