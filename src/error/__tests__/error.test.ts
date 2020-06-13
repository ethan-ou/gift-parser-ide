import fs from "fs";
import path from "path";
import error from "../index";

describe("Error Module: Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/input");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".json");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks/expected"),
      `${path.basename(file)}`
    );

    const text = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Parses ${file}`, () => {
      expect(JSON.parse(JSON.stringify(error(text)))).toEqual(expected);
    });
  });
});
