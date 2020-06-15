import { parse as parser } from "./parser";
import { GIFTSyntaxError } from "../types";

/**
 * Parse the text using the GIFT
 * parser.
 * @param text Cleaned input text.
 * @returns An object with either a successful parse
 * or a syntax error.
 */

export default function (
  text: string
): { parse: any; error: GIFTSyntaxError | null } {
  try {
    return { parse: parser(text), error: null };
  } catch (error) {
    return {
      parse: null,
      error: error,
    };
  }
}
