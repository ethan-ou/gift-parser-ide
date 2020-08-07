import fs from "fs";
import path from "path";
import message from "../index";

describe("Message Module: Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/input");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const jsonPath = path.join(
      folderPath,
      `${path.basename(file, ".gift")}.json`
    );

    const expectedPath = path.join(
      path.join(__dirname, "/mocks/expected"),
      `${path.basename(file, ".gift")}.json`
    );

    const text = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    fs.writeFileSync(expectedPath, JSON.stringify(message(text, json, "\n")));
    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Parses ${file}`, () => {
      expect(JSON.parse(JSON.stringify(message(text, json, "\n")))).toEqual(
        expected
      );
    });
  });
});
