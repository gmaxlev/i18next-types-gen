import { isRecord } from "tsguarder";
import fsp from "fs/promises";

/**
 * Recursively extract keys from a JSON object.
 * @param value The value to extract keys from.
 * @param set The set to add keys to.
 * @param from The path to the current value.
 */
export function extractKeys(
  value: unknown,
  set = new Set<string>(),
  from: string[] = []
) {
  if (isRecord(value)) {
    for (const key in value) {
      extractKeys(value[key], set, [...from, key]);
    }
  } else {
    set.add(from.join("."));
  }

  return set;
}

/**
 * Create an interface definition from a set of keys.
 * @param set The set of keys.
 * @param name The name of the interface.
 */
export function createInterfaceDefinition(set: Set<string>, name: string) {
  let string = `export interface ${name} {`;
  set.forEach((key) => {
    const formatNamespace = key.replace(".", ":");
    string += `\n  '${formatNamespace}': string;`;
  });
  string += "\n}\n";
  return string;
}

/**
 * Reads a locale file and returns the parsed JSON.
 * @param path The path to the locale file.
 */
export async function readLocaleFile(path: string) {
  let buffer: Buffer;

  try {
    buffer = await fsp.readFile(path);
  } catch (e) {
    console.error("Failed to read file: " + path);
    throw e;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(buffer.toString());
  } catch (e) {
    console.error("Failed to parse JSON file: " + path);
    throw e;
  }

  try {
    isRecord.assert(parsed, path);
  } catch (e) {
    console.error("Invalid JSON file: " + path);
    throw e;
  }

  return parsed;
}

/**
 * Joins multiple locales into a single object.
 * @param sources The sources to join.
 */
export function joinLocales(sources: Record<PropertyKey, unknown>[]) {
  let common: Record<PropertyKey, unknown> = {};
  sources.forEach((source) => {
    common = {
      ...common,
      ...source,
    };
  });
  return common;
}
