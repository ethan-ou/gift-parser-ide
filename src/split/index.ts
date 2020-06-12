import { createTokens, createSingleLineScopeTokens } from "./tokens";
import { noEmptyLinesInScope } from "./rules";
import { TextSplit } from "../types";

/**
 * Splits the text when an empty line is found.
 * Only splits if the empty line is not found within
 * a scope (i.e. a set of curly brackets "{", "}").
 * To get the original text, join all text properties
 * with "\n".
 * @param text Input text
 * @returns An array of objects with start and end
 * line numbers, and the split text.
 */
export default function (text: string): TextSplit[] {
  const output: TextSplit[] = [];
  const newLine = "\n";
  const textTokens = createTokens(text);
  const splitText = text.split(newLine);

  const outputTokens = noEmptyLinesInScope(
    textTokens,
    createSingleLineScopeTokens(text),
    splitText.length
  );

  /* Concatenates strings by pushing to an array,
     then joining when an EMPTY_LINE token is found. */
  let splitArr: string[] = [];
  for (let i = 0; i < splitText.length; i++) {
    if (outputTokens[i] === "EMPTY_LINE") {
      output.push({
        start: i + 1 - splitArr.length,
        end: i + 1,
        text: splitArr.join(newLine),
      });
      splitArr = [];
    } else {
      splitArr.push(splitText[i]);
    }

    if (i === splitText.length - 1) {
      output.push({
        start: i + 1 - (splitArr.length - 1),
        end: i + 1,
        text: splitArr.join(newLine),
      });
    }
  }

  const filteredOutput = output.filter((item) => item.text !== "");

  return filteredOutput;
}
