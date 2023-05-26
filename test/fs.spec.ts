import { vol } from "memfs";
import { genLocalesTypeIntoFile } from "../src";
jest.mock("fs/promises");

describe("fs.ts", () => {
  afterEach(() => {
    vol.reset();
  });

  describe("genLocalesTypeIntoFile()", () => {
    test("Should save type declaration in a file", async () => {
      vol.fromNestedJSON(
        {
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
        },
        "/src"
      );

      const result = await genLocalesTypeIntoFile({
        sources: ["/src/file1.json", "/src/file2.json", "/src/file3.json"],
        output: "/src/output/path/my-file.ts",
        interfaceName: "SpecialLocalesKeys",
      });

      expect(result).toEqual({ size: 3 });
      expect(vol.toJSON()).toMatchSnapshot();
    });
  });
});
