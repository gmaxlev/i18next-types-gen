import { genLocalesType } from "../src";
import { vol } from "memfs";

jest.mock("fs/promises");

describe("gen.ts", () => {
  afterEach(() => {
    vol.reset();
  });

  const fsSnapshot = {
    "file1.json": JSON.stringify({
      a: {
        b: "c",
      },
    }),
    "file2.json": JSON.stringify({
      d: {
        e: "f",
      },
    }),
    "file3.json": JSON.stringify({
      g: "h",
    }),
  };

  describe("genLocalesType()", () => {
    test("Should generate type definition and use specified name", async () => {
      vol.fromNestedJSON(fsSnapshot, "/src");

      const definition = await genLocalesType({
        sources: ["/src/file1.json", "/src/file2.json", "/src/file3.json"],
        interfaceName: "SpecialLocalesKeys",
      });

      expect(definition).toMatchSnapshot();
    });

    test("Should generate type definition and use the default interface name", async () => {
      vol.fromNestedJSON(fsSnapshot, "/src");

      const definition = await genLocalesType({
        sources: ["/src/file1.json", "/src/file2.json", "/src/file3.json"],
      });

      expect(definition).toMatchSnapshot();
    });
  });
});
