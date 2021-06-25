import { diff } from "deep-diff";
import findTextSections from "./textSection";
import cleanText from "./cleanText";
import GIFTParser from "./GIFTParser";
import handleErrors, { handleSingleError } from "./handleErrors";
import { convertLineType, detectLineType } from "./newLine";
import {
  GIFTParse,
  GIFTParseSection,
  GIFTTextSection,
  GIFTSyntaxError,
} from "../types";
import { GIFTQuestion } from "gift-pegjs";

// TODO: Change to preprocessing function over going directly for errors
export default function parse(text: string) {
  const textSection = createTextSections(text);
  const parseResult = textSection.map((section) => parseTextSection(section));
  const allErrors = findAllErrors(parseResult, text, detectLineType(text));
  return allErrors;
}

// TODO: Add comments back into parsing
export const createTextSections = (text: string): GIFTTextSection[] =>
  findTextSections(cleanText(convertLineType(text, "LF")));

export const parseTextSection = (
  section: GIFTTextSection
): GIFTParseSection => {
  return {
    location: section,
    result: GIFTParser(section.text),
  };
};

export const findAllErrors = (
  parse: GIFTParseSection[],
  originalText: string,
  lineEnding: string
) => handleErrors(parse, originalText, lineEnding);

/**
 * Diffs the old GIFTTextSection[] with a
 * new GIFTTextSection[] to look for changes
 * within a text document.
 */
export const diffTextSection = (
  section: GIFTTextSection[],
  oldSection: GIFTTextSection[],
  changeArray: GIFTParseSection[],
  originalText: string
): GIFTParseSection[] => {
  const onChange = (section: GIFTTextSection): GIFTParseSection =>
    handleSingleError(
      parseTextSection(section),
      originalText,
      detectLineType(originalText)
    );
  const diffArray = diff(oldSection, section);

  if (!diffArray) {
    return changeArray;
  }

  for (let diff of diffArray) {
    switch (diff.kind) {
      // If the change was an Edit
      case "E": {
        let diffIndex: number = diff?.path && diff.path[0];
        let diffKey: string = diff?.path && diff.path[1];

        switch (diffKey) {
          case "text":
            changeArray[diffIndex] = onChange(section[diffIndex]);
            break;
          case "start":
            changeArray[diffIndex].location.start = section[diffIndex].start;
            break;
          case "end":
            changeArray[diffIndex].location.end = section[diffIndex].end;
            break;
        }
        break;
      }
      // If the change was an Array change
      case "A": {
        switch (diff.item.kind) {
          // New Item
          case "N":
            changeArray[diff.index] = onChange(section[diff.index]);
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

/**
 * Reduces nested error objects into a single array for
 * simple IDE access.
 * @param array Parsed input.
 * @returns An array of syntax errors.
 */
export const filterParseType = (
  sections: GIFTParseSection[],
  type: "success" | "error"
): GIFTQuestion[] | GIFTSyntaxError[] => {
  switch (type) {
    case "success":
      const successArray: GIFTQuestion[] = [];
      for (const section of sections) {
        const [success, error] = section.result;

        if (success !== null) {
          successArray.push(...success);
        }
      }
      return successArray;

    case "error":
      const errorArray: GIFTSyntaxError[] = [];
      for (const section of sections) {
        const [success, error] = section.result;

        if (error !== null) {
          errorArray.push(...error);
        }
      }
      return errorArray;
  }
};
