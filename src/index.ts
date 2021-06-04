import { GIFTQuestion } from "gift-pegjs";
import parse, {
  createTextSplit,
  diffTextSplitToParse,
  parserWrapper,
  reduceParseType,
} from "./parser";

import { TextSplit, GIFTSyntaxError, GIFTResult } from "./types";

/**
 * Incremental error parser for Moodle's GIFT format. Create a parser
 * using var parser = new Parser(). Update the parser with parser.update(text);
 * @class Parser
 */
export default class GIFTParser {
  private _split: TextSplit[];
  private _parse: GIFTResult[];

  /**
   * Create a new Parser object.
   */
  constructor(text?: string) {
    this._split = [];
    this._parse = [];

    if (text) {
      this.update(text);
    }
  }

  /**
   * Update the parser with new text.
   * The parser will parse the changes
   * between the new text and the previous
   * text.
   * @param text Input text
   */
  public update(text: string) {
    const newSplit = createTextSplit(text);
    this._parse = diffTextSplitToParse(
      newSplit,
      this._split,
      this._parse,
      text
    );
    this._split = newSplit;

    return this;
  }

  public result(): GIFTResult[] {
    return this._parse;
  }

  public parseOnly(): GIFTQuestion[] {
    return reduceParseType(this._parse, "result") as GIFTQuestion[];
  }

  public errorOnly(): GIFTSyntaxError[] {
    return reduceParseType(this._parse, "error") as GIFTSyntaxError[];
  }
}

/**
 * Error parser for Moodle's GIFT format. The performance of this parser is faster
 * for one-shot parsing but slower for continuous parsing. Use the Parser class for
 * IDE usage.
 * @param text Input text
 * @returns An array of syntax errors.
 */

export const parser = {
  parse: (text: string) => parse(text),
  parseOnly: (text: string) => reduceParseType(parse(text), "result") as GIFTQuestion[],
  errorOnly: (text: string) => reduceParseType(parse(text), "error") as GIFTSyntaxError[],
  parseRaw: (text: string) => parserWrapper(text),
};
