import { isRecord, isString } from "tsguarder";
import path from "path";
import fsp from "fs/promises";
import { genLocalesType, GenLocalesTypeOptions } from "./gen";

interface GenLocalesTypeIntoFileOptions extends GenLocalesTypeOptions {
  output: string;
}

export async function genLocalesTypeIntoFile(
  options: GenLocalesTypeIntoFileOptions
) {
  try {
    console.log("☄️ Start generating locales type definition");

    isRecord.assert(options, "options");

    const { sources, interfaceName, output } = options;

    const { typeDefinition, size } = await genLocalesType({
      sources,
      interfaceName,
    });

    console.log(`🌈 Generated ${size} keys`);

    isString.assert(options.output, "output");

    const dirname = path.dirname(output);

    try {
      await fsp.mkdir(dirname, { recursive: true });
    } catch (e) {
      console.error("Failed to create directory: " + dirname);
      throw e;
    }

    try {
      await fsp.writeFile(output, typeDefinition);
    } catch (e) {
      console.error("Failed to write file: " + output);
      throw e;
    }
    console.log("🎉 Saved locales type definition into file:", output);
  } catch (e) {
    console.error("Failed to generate type definition into file");
    throw e;
  }
}
