import { GIFTQuestion, parse as GIFTPEGParse } from "gift-pegjs";
import parse, {
  createTextSections,
  diffTextSection,
  filterParseType,
} from "./parser";

import {
  GIFTTextSection,
  GIFTSyntaxError,
  GIFTParse,
  GIFTParseSection,
} from "./types";

/**
 * Incremental error parser for Moodle's GIFT format. Create a parser
 * using var parser = new Parser(). Update the parser with parser.update(text);
 * @class Parser
 */
export default class GIFTParser {
  private _split: GIFTTextSection[];
  private _parse: GIFTParseSection[];

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
    const newSplit = createTextSections(text);
    this._parse = diffTextSection(newSplit, this._split, this._parse, text);
    this._split = newSplit;

    return this;
  }

  public result(): GIFTParseSection[] {
    return this._parse;
  }

  public parseOnly(): GIFTQuestion[] {
    return filterParseType(this._parse, "success") as GIFTQuestion[];
  }

  public errorOnly(): GIFTSyntaxError[] {
    return filterParseType(this._parse, "error") as GIFTSyntaxError[];
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
  parse: (text: string): GIFTParseSection[] => parse(text),
  parseOnly: (text: string): GIFTQuestion[] =>
    filterParseType(parse(text), "success") as GIFTQuestion[],
  errorOnly: (text: string): GIFTSyntaxError[] =>
    filterParseType(parse(text), "error") as GIFTSyntaxError[],
  parseRaw: (text: string): GIFTQuestion[] => GIFTPEGParse(text),
};
