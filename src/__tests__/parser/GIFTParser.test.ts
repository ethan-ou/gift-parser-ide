import fs from "fs";
import path from "path";
import parser from "../../parser/GIFTParser";

describe("PEG Parser Module: Pass Mocks", () => {
  const folderPath = path.join(__dirname, "../mocks/main/pass");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks/GIFTParser/pass"),
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

describe("PEG Parser Module: Error Mocks", () => {
  const folderPath = path.join(__dirname, "../mocks/main/error");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks/GIFTParser/error"),
      `${path.basename(file, ".gift")}.json`
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // fs.writeFileSync(expectedPath, JSON.stringify(parser(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Parses ${file}`, () => {
      expect(JSON.parse(JSON.stringify(parser(text)))).toEqual(expected);
    });
  });
});
