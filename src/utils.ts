import eol from "eol";
import detectNewLine from "detect-newline";
import parse from "./parser";
import error from "./error";
import {
  ErrorResult,
  ParseResult,
  ErrorResultArr,
  TextSplit,
  GIFTSyntaxError,
  GIFTResult,
} from "./types";
import message from "./message";

/**
 * Higher Order Function that pipes the result of
 * one function to another.
 * @param fns A list of functions.
 */
export const pipe = <T extends any[]>(...fns: T) => (x: any) =>
  fns.reduce((y: any, f: any) => f(y), x);

export const parseTextSplit = (split: TextSplit[]) =>
  split.map((item) => {
    return { ...parse(item.text), ...item };
  });

/**
 * Filters an array to contain only errors.
 * @param parseArray An array of parse objects.
 * @returns An ErrorResult[] or ErrorResultArr[]
 */
export const filterErrors = (
  parseArray: (ParseResult | ErrorResult | ErrorResultArr)[]
): (ErrorResult | ErrorResultArr)[] => {
  const emptyorSpaces = /^\s*$/g;
  return parseArray.filter(
    (item) => item.error !== null && !item.text.match(emptyorSpaces)
  ) as (ErrorResult | ErrorResultArr)[];
};

/**
 * Maps through an ErrorResult[] to look for errors
 * using the error module.
 * @param parseArray An array of errors.
 * @returns An array of ErrorResultArr[]
 */
export const findErrors = (parseArray: ErrorResult[]) => {
  return parseArray.map((item) => error(item));
};

/**
 * A curried function that fixes all line and character
 * numbers for error messages. Currying is useful for
 * allowing the message function to be piped from other
 * functions.
 * @param originalText The original input text.
 * @returns An array of ErrorResultArr[]
 */
export const fixMessagesCurried = (originalText: string) => (
  parseArray: ErrorResultArr[]
): ErrorResultArr[] => {
  const fixMessage = (item: ErrorResultArr) =>
    message(eol.lf(originalText), item, detectNewLine.graceful(originalText));

  return parseArray.map((item) => fixMessage(item));
};

/**
 * Reduces nested error objects into a single array for
 * simple IDE access.
 * @param array Parsed input.
 * @returns An array of syntax errors.
 */
export function reduceErrors(array: ErrorResultArr[]): GIFTSyntaxError[] {
  const output: GIFTSyntaxError[] = [];
  for (let item of array) {
    for (let error of item.error) {
      output.push(error);
    }
  }

  return output;
}
