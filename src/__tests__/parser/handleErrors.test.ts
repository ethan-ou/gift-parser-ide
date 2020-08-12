import fs from "fs";
import path from "path";
import handleErrors, {
  handleSingleError,
  correctMessage,
} from "../../parser/handleErrors";

describe("Error Module: Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/handleErrors/input");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".json");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks/handleErrors/expected"),
      `${path.basename(file)}`
    );

    const text = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    const originalText = text.text;
    // fs.writeFileSync(
    //   expectedPath,
    //   JSON.stringify(handleSingleError(text, originalText, "\n"))
    // );

    it(`Parses ${file}`, () => {
      expect(
        JSON.parse(JSON.stringify(handleSingleError(text, originalText, "\n")))
      ).toEqual(expected);
    });
  });
});

describe("Message Module: Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/handleErrors/message/input");

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
      path.join(__dirname, "/mocks/handleErrors/message/expected"),
      `${path.basename(file, ".gift")}.json`
    );

    const text = fs.readFileSync(filePath, "utf-8");
    const input = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // fs.writeFileSync(expectedPath, JSON.stringify(message(text, json, "\n")));
    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Parses ${file}`, () => {
      expect(
        JSON.parse(JSON.stringify(correctMessage(input, text, "\n")))
      ).toEqual(expected);
    });
  });
});
