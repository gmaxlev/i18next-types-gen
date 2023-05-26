# i18next-types-gen

Generates TS declaration file from i18next translation files.

Due to the [issue](https://github.com/i18next/react-i18next/issues/1601), it is currently not possible to use TypeScript to infer types from translation files when you have many keys. This tool solves this problem by generating a declaration type file from translation files using a simple script.

> ⚠️ Take a look at this [pull request](https://github.com/i18next/i18next/pull/1911).

## Installation

```bash
npm install --save-dev i18next-types-gen
```

## How it works

In general, it turns this:

```json
{
  "key1": "value1",
  "key2": {
    "key3": "value2"
  },
  "key4": {
    "key5": {
      "key6": "value3"
    }
  }
}
```

into this:

```typescript
export interface LocalesKeys {
  key1: string;
  "key2:key3": string;
  "key4:key5.key6": string;
}
```

## JavaScript API

### genLocalesType(options)

Generates a TypeScript interface from translation files.

Receives an object with the following properties:

- `sources`: An array of paths to translation JSON files.
- `interfaceName` [optional]: The name of the generated interface. Default: `LocalesKeys`.

Returns a string with the generated interface and the number of keys.

- `typeDefinition`: The generated interface.
- `size`: The number of keys.

Example:

```javascript
import { genLocalesType } from "i18next-types-gen";

const { typeDefinition, size } = genLocalesType({
  sources: ["./locales/en.json", "./locales/de.json"],
  interfaceName: "MyCustomInterfaceName",
});
```

### genLocalesTypeIntoFile(options)

Generates a TypeScript interface from translation files and writes it to a file.

Receives an object with the following properties:

- `sources`: An array of paths to translation JSON files.
- `output`: The path to the output file.
- `interfaceName` [optional]: The name of the generated interface. Default: `LocalesKeys`.

Returns the number of keys.

- `size`: The number of keys.

Example:

```javascript
import { genLocalesTypeIntoFile } from "i18next-types-gen";

const { typeDefinition, size } = genLocalesTypeIntoFile({
  sources: ["./locales/en.json", "./locales/de.json"],
  output: "./locales/locales.d.ts",
  interfaceName: "MyCustomInterfaceName",
});
```

## CLI

You can even use this tool as a CLI.

There is only one available command: `run [options] <sources> <output>`.

It requires tho arguments:

- `sources`: the paths to the translation files separated by commas.
- `output`: the path to the output file.

Additionally, there is one optional argument:

- `name <value>` - interface name. Default: `LocalesKeys`.

For example:

```bash
npx i18next-types-gen locales/en.json,locales/de.json locales/locales.d.ts --name MyCustomInterfaceName
```

## License

[MIT](LICENSE)
