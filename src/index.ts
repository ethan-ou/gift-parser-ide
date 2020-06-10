import eol from "eol";
import split from "./split";
import parse from "./parser";
import { findToken } from "./error";
import mocks from "./__tests__/mocks";

export default function parser(text: string) {
  const cleanText = eol.lf(text);
  const splitText = split(cleanText);
  const parsedText = splitText.map((text) => {
    return { ...parse(text.text), ...text };
  });

  console.log(JSON.stringify(parsedText.map((text) => text.error)[0]));
}
console.log(parser(mocks[4].text));
