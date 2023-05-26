import { isArray, isRecord, isString, isUndefined } from "tsguarder";
import {
  createInterfaceDefinition,
  extractKeys,
  joinLocales,
  readLocaleFile,
} from "./utils";
import { DEFAULT_INTERFACE_NAME } from "./constants";

export interface GenLocalesTypeOptions {
  sources: string[];
  interfaceName?: string | undefined;
}

export async function genLocalesType(options: GenLocalesTypeOptions) {
  try {
    isRecord.assert(options, "options");

    const { sources, interfaceName = DEFAULT_INTERFACE_NAME } = options;

    isArray.assert(sources, "sources");

    if (!isUndefined(interfaceName)) {
      isString.assert(interfaceName, "interfaceName");
    }

    const contents = await Promise.all(
      sources.map((source, index) => {
        isString.assert(source, `sources[${index}]`);
        return readLocaleFile(source);
      })
    );

    const common = joinLocales(contents);

    const keys = extractKeys(common);

    const typeDefinition = createInterfaceDefinition(
      keys,
      interfaceName ?? "LocalesKeys"
    );

    return {
      typeDefinition,
      size: keys.size,
    };
  } catch (e) {
    console.error("Failed to generate type definition");
    throw e;
  }
}
