import { parse } from "./PEGParser";
import { ParseReturn, ErrorReturn } from "../types";

/**
 * Parse the text using the GIFT
 * parser.
 * @param text Cleaned input text.
 * @returns An object with either a successful parse
 * or a syntax error.
 */

export default function parser(text: string): ParseReturn | ErrorReturn {
  try {
    return { type: "result", result: parse(text) };
  } catch (error) {
    return {
      type: "error",
      result: error,
    };
  }
}
