import { TextSplit } from "../types";

/**
 * Finds all line breaks where it's safe to split a GIFT text,
 * then splits them.
 * To get the original text, join all text properties
 * with "\n".
 * @param text Input text
 * @returns An array of objects with start and end
 * line numbers, and the split text.
 */
export default function textSplit(text: string): TextSplit[] {
  const NEWLINE = "\n";
  const out: TextSplit[] = [];

  const iter = {
    line: 1,
    idx: 0,
  };

  const splitText = text.split(NEWLINE);
  const lineSplit = findSafeLineBreaks(text);

  let joinText: string[] = [];

  while (iter.line <= splitText.length) {
    if (lineSplit[iter.idx] === iter.line) {
      // Avoid adding empty text
      if (joinText.join("") !== "") {
        out.push({
          start: iter.line - joinText.length,
          end: iter.line - 1,
          text: joinText.join(NEWLINE),
        });
      }
      iter.idx++;
      joinText = [];
    } else {
      joinText.push(splitText[iter.line - 1]);
    }

    if (iter.line === splitText.length && joinText.join("") !== "") {
      out.push({
        start: iter.line - (joinText.length - 1),
        end: iter.line - 1,
        text: joinText.join(NEWLINE),
      });
    }

    iter.line++;
  }

  return out;
}

/**
 * Finds all line breaks where it's safe to split a GIFT text.
 * Avoids line breaks found inside a GIFT question scope.
 * @param text Input text
 * @returns An array of line numbers that are safe for splitting.
 * */
export function findSafeLineBreaks(text: string): number[] {
  const TOKEN = { START: "{", END: "}" };
  const NEWLINE = "\n";
  const ESCAPE = "\\";
  const EMPTYORSPACES = /^\s*$/g;

  const out = [];
  const iter = {
    i: 0,
    line: 1,
    scope: false,
    prevBreak: -1,
  };

  while (iter.i < text.length) {
    let char = text[iter.i];
    let prevChar = text[iter.i - 1];

    if (char === NEWLINE) {
      const emptyLineFound =
        text.slice(iter.prevBreak + 1, iter.i).match(EMPTYORSPACES) !== null;
      // Backtrack to previous break and check if text
      // contains only spaces, and not in scope.
      if (emptyLineFound && iter.scope === false) {
        out.push(iter.line);
      }
      // Cleanup any ending line breaks
      else if (iter.i === text.length - 1) {
        out.push(iter.line + 1);
      }

      iter.prevBreak = iter.i;
      iter.line++;
    }

    // Skip any backslashed tokens as per GIFT spec
    if (char === TOKEN.START && prevChar !== ESCAPE) {
      iter.scope = true;
    }

    if (char === TOKEN.END && prevChar !== ESCAPE) {
      iter.scope = false;
    }

    iter.i++;
  }

  return out;
}
