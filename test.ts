import { BunCache } from "./index.ts";

type IData<T extends unknown> = {
  key: string;
  encrypted: boolean;
  data: T;
};

const bunCache = new BunCache<string, IData<unknown>>();

const json = {
  key: "bun-ffi",
  encrypted: false,
  data: [1, "e", 0, null],
};

const json2 = {
  key: "@meeky",
  encrypted: true,
  data: "md9abta2.md9abn1w.1981f45bb81.95b.1jp.ac",
};

await bunCache.set("bun", json);
await bunCache.set("me", json2);

// console.log(await bunCache.get("me"));
console.log(await bunCache.mGet());
