import eol from "eol";
import { diff } from "deep-diff";
import split from "./split";
import parse from "./parser";
import error from "./error";
import { IError, IParse, IErrorArr, TextSplit } from "./types";
import { SyntaxError } from "./parser/parser";
import message from "./message";

export default class Parser {
  private output: SyntaxError[];
  private text: string;
  private splitText: string[];
  private incompleteParseOutput: (IParse | IErrorArr)[];

  constructor() {
    this.text = "";
    this.splitText = [];
    this.incompleteParseOutput = [];
    this.output = [];
  }

  public update(text: string): SyntaxError[] {
    const CHARACTER_PERF_LIMIT = 30000;
    const cleanText = eol.lf(text);

    if (cleanText.length < CHARACTER_PERF_LIMIT) {
      return parser(cleanText);
    }

    const newSplit = split(cleanText);
    const newSplitText = newSplit.map((item) => item.text);
    const diffArray = diff(this.splitText, newSplitText);

    if (!diffArray) {
      return this.output;
    }

    for (let diff of diffArray) {
      // If the change was an Edit
      if (diff.kind === "E") {
        if (diff.path) {
          this.incompleteParseOutput[diff.path[0]] = this.parse(
            newSplit[diff.path[0]]
          );
        }
      }

      // If the change was an Array change
      if (diff.kind === "A") {
        // New Item
        if (diff.item.kind === "N") {
          this.incompleteParseOutput[diff.index] = this.parse(
            newSplit[diff.index]
          );
        }

        // Delete Item
        if (diff.item.kind === "D") {
          this.incompleteParseOutput.splice(diff.index, 1);
        }
      }
    }

    this.text = cleanText;
    this.splitText = newSplitText;
    this.output = this.correctMessages(this.incompleteParseOutput, this.text);
    return this.output;
  }

  private parse(item: TextSplit): IParse | IErrorArr {
    const parsedText: IError | IParse = { ...parse(item.text), ...item };

    if (parsedText.error !== null) {
      return error(parsedText);
    } else {
      return parsedText;
    }
  }

  private correctMessages(parseArray: (IParse | IErrorArr)[], text: string) {
    const correctMessages: (IParse | IErrorArr)[] = parseArray.map((item) =>
      item.error !== null ? message(text, item) : item
    );

    return reduceToSyntaxErrors(correctMessages);
  }
}

export function parser(text: string): SyntaxError[] {
  const cleanText = eol.lf(text);

  const parsedText = split(cleanText).map((item) => {
    return { ...parse(item.text), ...item };
  });

  const checkErrors: (IParse | IErrorArr)[] = parsedText.map((item) =>
    item.error !== null ? error(item as IError) : (item as IParse)
  );

  const correctMessages = checkErrors.map((item) =>
    item.error !== null ? message(cleanText, item) : item
  );

  return reduceToSyntaxErrors(correctMessages);
}

function reduceToSyntaxErrors(array: (IParse | IErrorArr)[]): SyntaxError[] {
  const emptyorSpaces = /^\s*$/g;
  const output: SyntaxError[] = [];
  for (let item of array) {
    if (item.error !== null && !item.text.match(emptyorSpaces)) {
      item.error.forEach((item) => output.push(item));
    }
  }

  return output;
}
