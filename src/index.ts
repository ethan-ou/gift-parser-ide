import eol from "eol";
import split from "./split";
import parse from "./parser";
import error from "./error";
import { IError, IParse, IErrorArr } from "./types";
import { SyntaxError } from "./parser/parser";

export default function parser(text: string): SyntaxError[] {
  const cleanText = eol.lf(text);
  const splitText = split(cleanText);
  const parsedText: any[] = splitText.map((text) => {
    return { ...parse(text.text), ...text };
  });
  const checkErrors: (IParse | IErrorArr)[] = parsedText.map((item) =>
    item.error !== null && (item as IError) ? error(text, item) : item
  );

  return reduceErrors(checkErrors);
}

function reduceErrors(array: (IParse | IErrorArr)[]) {
  const emptyorSpaces = /^\s*$/g;
  return array
    .filter(
      (item): item is IErrorArr =>
        item.error !== null && !item.text.match(emptyorSpaces)
    )
    .map((item) => item.error)
    .reduce((a, b) => a.concat(b), []);
}
