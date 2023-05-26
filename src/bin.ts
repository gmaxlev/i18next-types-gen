import { Command } from "commander";
import { isRecord, isString, isUndefined } from "tsguarder";
import pkg from "../package.json";
import { genLocalesTypeIntoFile } from "./fs";

const program = new Command();

let description = `CLI to ${pkg.name} package\n`;
description += `See docs at ${pkg.homepage}`;

program.name(pkg.name).description(description).version(pkg.version);

program
  .command("run")
  .description("Generate locales type definition into a file")
  .argument("<sources>", "sources paths")
  .argument("<output>", "output path")
  .option("-n, --name <name>", "interface name")
  .action(async (sourcesString, output, options) => {
    isString.assert(sourcesString, "sources");
    isString.assert(output, "sources");
    isRecord.assert(options, "options");

    const sources = sourcesString.split(",");

    const name = "name" in options ? options["name"] : undefined;

    if (!isUndefined(name)) {
      isString.assert(name, "name");
    }

    await genLocalesTypeIntoFile({
      sources,
      output,
      interfaceName: name,
    });
  });

program.parse();
