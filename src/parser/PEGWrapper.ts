import { parse, SyntaxError } from "./PEGParser";
import { ParseReturn, ErrorReturn } from "../types";

/**
 * Parse the text using the GIFT
 * parser.
 * @param text Cleaned input text.
 * @returns An object with either a successful parse
 * or a syntax error.
 */

export default function PEGWrapper(text: string): ParseReturn | ErrorReturn {
  try {
    return { type: "result", result: parse(text) };
  } catch (error) {
    if (error.name === "SyntaxError") {
      return {
        type: "error",
        result: error,
      };
    } else {
      throw new Error("Parser not compatible with Node or Javascript Version.");
    }
  }
}
