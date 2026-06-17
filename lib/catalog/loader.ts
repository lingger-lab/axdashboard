import { readFile } from "fs/promises";
import { join } from "path";
import type { AssetItem } from "./types";

const CATALOG_PATH = join(process.cwd(), "asset-catalog.json");

let _cache: AssetItem[] | null = null;

export async function loadCatalog(): Promise<AssetItem[]> {
  if (_cache) return _cache;
  const raw = await readFile(CATALOG_PATH, "utf-8");
  _cache = JSON.parse(raw) as AssetItem[];
  return _cache;
}

export async function loadAssetById(id: string): Promise<AssetItem | null> {
  const catalog = await loadCatalog();
  return catalog.find((item) => item.id === id) ?? null;
}
