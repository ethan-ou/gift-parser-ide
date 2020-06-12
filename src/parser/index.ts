import { parse as parser, SyntaxError } from "./parser";

/**
 * Parse the text using the GIFT
 * parser.
 * @param text Cleaned input text.
 * @returns An object with either a successful parse
 * or a syntax error.
 */

export default function (
  text: string
): { parse: any; error: SyntaxError | null } {
  try {
    return { parse: parser(text), error: null };
  } catch (error) {
    return {
      parse: null,
      error: error,
    };
  }
}
