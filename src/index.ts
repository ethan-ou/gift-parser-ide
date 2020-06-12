import eol from "eol";
import { diff } from "deep-diff";
import split from "./split";
import parse from "./parser";
import error from "./error";
import clean from "./clean";
import { IError, IParse, IErrorArr, TextSplit } from "./types";
import { SyntaxError } from "./parser/parser";
import message from "./message";

export default class Parser {
  private output: SyntaxError[];
  private text: string;
  private split: TextSplit[];
  private incompleteParseOutput: (IParse | IErrorArr)[];

  constructor() {
    this.text = "";
    this.split = [];
    this.incompleteParseOutput = [];
    this.output = [];
  }

  public update(text: string): SyntaxError[] {
    const cleanText = eol.lf(text);

    const processText = clean(cleanText);
    const newSplit = split(processText);

    this.diff(newSplit);

    this.text = cleanText;
    this.split = newSplit;
    this.output = this.correctMessages(this.incompleteParseOutput, this.text);
    return this.output;
  }

  private diff(newSplit: TextSplit[]) {
    const diffArray = diff(this.split, newSplit);

    if (!diffArray) {
      return;
    }

    for (let diff of diffArray) {
      // If the change was an Edit
      if (diff.kind === "E") {
        if (diff?.path && diff.path[1] === "text") {
          this.incompleteParseOutput[diff.path[0]] = this.parse(
            newSplit[diff.path[0]]
          );
        }

        if (diff?.path && diff.path[1] === "start") {
          this.incompleteParseOutput[diff.path[0]].start =
            newSplit[diff.path[0]].start;
        }

        if (diff?.path && diff.path[1] === "end") {
          this.incompleteParseOutput[diff.path[0]].end =
            newSplit[diff.path[0]].end;
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

  const processText = clean(cleanText);

  const parsedText = split(processText).map((item) => {
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
