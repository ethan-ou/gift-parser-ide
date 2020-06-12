import fs from "fs";
import path from "path";
import parser from "../index";

describe("PEG Parser Pass", () => {
  const folderPath = path.join(__dirname, "../../__tests__/mocks/pass");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks"),
      `${path.basename(file, ".gift")}.json`
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // fs.writeFileSync(expectedPath, JSON.stringify(parser(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Parses ${file}`, () => {
      expect(parser(text)).toEqual(expected);
    });
  });
});
