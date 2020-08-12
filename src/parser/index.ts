import eol from "eol";
import detectNewLine from "detect-newline";
import { diff } from "deep-diff";
import textSplit from "./textSplit";
import cleanText from "./cleanText";
import PEGWrapper from "./PEGWrapper";
import handleErrors, { handleSingleError } from "./handleErrors";
import {
  TextSplit,
  ParseResult,
  ErrorResult,
  ErrorResultArr,
  GIFTResult,
  GIFTSyntaxError,
  ParseType,
} from "../types";

export default function parse(text: string) {
  const textSplit = createTextSplit(text);
  const parseResult = parseTextSplit(textSplit);
  const allErrors = findAllErrors(
    parseResult,
    text,
    detectNewLine.graceful(text)
  );
  return allErrors;
}

export const createTextSplit = (text: string) =>
  textSplit(cleanText(eol.lf(text)));

export const parseTextSplit = (split: TextSplit[]) =>
  split.map((split) => {
    return parseSingleTextSplit(split);
  });

const parseSingleTextSplit = (split: TextSplit) => {
  return { ...PEGWrapper(split.text), ...split };
};

/**
 * Diffs the old TextSplit[] with a
 * new TextSplit[] to look for changes
 * within a text document.
 * @param newSplit An array of TextSplit objects.
 */
export const diffTextSplitToParse = (
  split: TextSplit[],
  oldSplit: TextSplit[],
  changeArray: GIFTResult[],
  originalText: string
): GIFTResult[] => {
  const onChange = (split: TextSplit) =>
    handleSingleError(
      parseSingleTextSplit(split),
      originalText,
      detectNewLine.graceful(originalText)
    );
  const diffArray = diff(oldSplit, split);

  if (!diffArray) {
    return changeArray;
  }

  for (let diff of diffArray) {
    switch (diff.kind) {
      // If the change was an Edit
      case "E": {
        let diffIndex = diff?.path && diff.path[0];
        let diffKey = diff?.path && diff.path[1];

        switch (diffKey) {
          case "text":
            changeArray[diffIndex] = onChange(split[diffIndex]);
            break;
          case "start":
            changeArray[diffIndex].start = split[diffIndex].start;
            break;
          case "end":
            changeArray[diffIndex].end = split[diffIndex].end;
            break;
        }
        break;
      }
      // If the change was an Array change
      case "A": {
        switch (diff.item.kind) {
          // New Item
          case "N":
            changeArray[diff.index] = onChange(split[diff.index]);
            break;
          // Delete item
          case "D":
            changeArray.splice(diff.index, 1);
            break;
        }
        break;
      }
    }
  }

  return changeArray;
};

export const findAllErrors = (
  parse: (ParseResult | ErrorResult | ErrorResultArr)[],
  originalText: string,
  lineEnding: string
) => handleErrors(parse, originalText, lineEnding);

export const parserWrapper = (text: string) => PEGWrapper(text);

/**
 * Reduces nested error objects into a single array for
 * simple IDE access.
 * @param array Parsed input.
 * @returns An array of syntax errors.
 */
export const reduceParseType = (
  parse: GIFTResult[],
  type: ParseType
): GIFTSyntaxError[] | any => {
  const out = [];
  for (const item of parse) {
    if (item.type === type) {
      for (const result of item.result) {
        out.push(result);
      }
    }
  }

  return out;
};
