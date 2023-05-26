import {
  extractKeys,
  createInterfaceDefinition,
  joinLocales,
  readLocaleFile,
} from "../src/utils";
import { vol } from "memfs";

jest.mock("fs/promises");

describe("utils.ts", () => {
  afterEach(() => {
    vol.reset();
  });

  describe("extractKeys()", () => {
    test("Should extract keys from an object", () => {
      const keys = extractKeys({
        a: {
          b: {
            c: "d",
          },
          e: "f",
          g: {
            h: "i",
          },
        },
      });

      expect(keys).toEqual(new Set(["a.b.c", "a.e", "a.g.h"]));
    });
  });

  describe("createInterfaceDefinition()", () => {
    test("Should create an interface definition with the default name", () => {
      const definition = createInterfaceDefinition(
        new Set(["a.b.c", "a.e", "a.g.h", "j"]),
        "LocalesKeys"
      );
      expect(definition).toMatchSnapshot();
    });
  });

  describe("joinLocales()", () => {
    test("Should join locales", () => {
      const locales = [
        {
          a: {
            b: {
              c: "d",
            },
            e: "f",
            g: {
              h: "i",
            },
          },
        },
        {
          j: "k",
          l: {
            m: "n",
          },
        },
      ];
      const joined = joinLocales(locales);
      expect(joined).toMatchSnapshot();
    });
  });

  describe("readLocaleFile()", () => {
    test("Should throw an error if the file is not an object", async () => {
      vol.fromNestedJSON(
        {
          "file.json": JSON.stringify(["a"]),
        },
        "/src"
      );

      await expect(readLocaleFile("/src/file.json")).rejects.toThrowError(
        "/src/file.json: must be a record"
      );
    });

    test("Should read and parse a locale file", async () => {
      vol.fromNestedJSON(
        {
          "file.json": JSON.stringify({
            a: {
              b: "c",
            },
          }),
        },
        "/src"
      );

      const parsed = await readLocaleFile("/src/file.json");
      expect(parsed).toMatchSnapshot();
    });
  });
});
