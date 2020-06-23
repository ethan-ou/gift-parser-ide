import eol from "eol";
import { diff } from "deep-diff";
import split from "./split";
import parse from "./parser";
import error from "./error";
import clean from "./clean";
import {
  ErrorResult,
  ParseResult,
  TextSplit,
  GIFTSyntaxError,
  GIFTResult,
} from "./types";
import {
  filterErrors,
  findErrors,
  fixMessagesCurried,
  parseTextSplit,
  reduceErrors,
  pipe,
} from "./utils";

/**
 * Incremental error parser for Moodle's GIFT format. Create a parser
 * using var parser = new Parser(). Update the parser with parser.update(text);
 * @class Parser
 */
export default class Parser {
  private output: GIFTSyntaxError[];
  private split: TextSplit[];
  private incompleteParseOutput: GIFTResult[];

  /**
   * Create a new Parser object.
   */
  constructor() {
    this.split = [];
    this.incompleteParseOutput = [];
    this.output = [];
  }

  /**
   * Update the parser with new text.
   * The parser will parse the changes
   * between the new text and the previous
   * text.
   * @param text Input text
   * @returns {GIFTSyntaxError[]} An array of syntax
   * errors.
   */
  public update(text: string): GIFTSyntaxError[] {
    const fixMessages = fixMessagesCurried(text);

    const newSplit = pipe(eol.lf, clean, split)(text);
    this.diff(newSplit, this.split, this.incompleteParseOutput);

    this.split = newSplit;
    this.output = pipe(
      filterErrors,
      fixMessages,
      reduceErrors
    )(this.incompleteParseOutput);

    return this.output;
  }

  /**
   * Diffs the old TextSplit[] with a
   * new TextSplit[] to look for changes
   * within a text document.
   * @param newSplit An array of TextSplit objects.
   */
  private diff(
    newSplit: TextSplit[],
    oldSplit: TextSplit[],
    changeArray: GIFTResult[]
  ) {
    const diffArray = diff(oldSplit, newSplit);

    if (!diffArray) {
      return;
    }

    for (let diff of diffArray) {
      // If the change was an Edit
      if (diff.kind === "E") {
        let diffIndex = diff?.path && diff.path[0];
        let diffKey = diff?.path && diff.path[1];

        if (diffKey === "text") {
          changeArray[diffIndex] = this.parse(newSplit[diffIndex]);
        }

        if (diffKey === "start") {
          changeArray[diffIndex].start = newSplit[diffIndex].start;
        }

        if (diffKey === "end") {
          changeArray[diffIndex].end = newSplit[diffIndex].end;
        }
      }

      // If the change was an Array change
      if (diff.kind === "A") {
        // New Item
        if (diff.item.kind === "N") {
          changeArray[diff.index] = this.parse(newSplit[diff.index]);
        }

        // Delete Item
        if (diff.item.kind === "D") {
          changeArray.splice(diff.index, 1);
        }
      }
    }
  }

  private parse(item: TextSplit): GIFTResult {
    const parsedText: ErrorResult | ParseResult = {
      ...parse(item.text),
      ...item,
    };

    if (parsedText.error !== null) {
      return error(parsedText);
    } else {
      return parsedText;
    }
  }
}

/**
 * Error parser for Moodle's GIFT format. The performance of this parser is faster
 * for one-shot parsing but slower for continuous parsing. Use the Parser class for
 * IDE usage.
 * @param text Input text
 * @returns An array of syntax errors.
 */

export function parser(text: string): GIFTSyntaxError[] {
  const fixMessages = fixMessagesCurried(text);

  const process = pipe(eol.lf, clean, split, parseTextSplit)(text);

  const postProcessErrors = pipe(
    filterErrors,
    findErrors,
    fixMessages,
    reduceErrors
  )(process);

  return postProcessErrors;
}
