import { TextSplit, CharToken } from "../types";

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
export default function split(text: string): TextSplit[] {
  const output: TextSplit[] = [];
  const newLine = "\n";

  const iter = {
    line: 1,
    idx: 0,
  };

  const splitText = text.split(newLine);
  const lineSplit = findSafeSplit(text, splitText);

  let joinText: string[] = [];

  while (iter.line <= splitText.length) {
    if (lineSplit[iter.idx] === iter.line) {
      output.push({
        start: iter.line - joinText.length,
        end: iter.line - 1,
        text: joinText.join(newLine),
      });
      iter.idx++;
      joinText = [];
    } else {
      joinText.push(splitText[iter.line - 1]);
    }

    if (iter.line === splitText.length) {
      output.push({
        start: iter.line - (joinText.length - 1),
        end: iter.line - 1,
        text: joinText.join(newLine),
      });
    }

    iter.line++;
  }
  const filteredOutput = output.filter((item) => item.text !== "");

  return filteredOutput;
}

/**
 * Filters all line breaks and removes those inside a scope.
 * A scope is limited by an opening and closing curly bracket.
 * If a closing curly bracket is found, it's assumed it's safe
 * to split.
 * This avoids GIFT spliting a partially written question.
 * @param text Input text
 * @returns An array of line numbers that are safe for splitting.
 * */

function findSafeSplit(text: string, splitText: string[]): number[] {
  const out = [];
  const scopes = findScopes(text);

  const emptyLines = findEmptyLines(text, splitText);
  for (const line of emptyLines) {
    if (!scopes[line]) {
      out.push(line);
    }
  }
  return out;
}

/**
 * Generates an array of all tokens that
 * open or close a GIFT question scope.
 * @param text Input text
 * @returns An array of Parse objects showing
 * where the scope tokens "{" "}" were found
 * in the text.
 */
export function findScopes(text: string): boolean[] {
  const TOKEN = { START: "{", END: "}" };
  const LINEBREAK = "\n";
  const out = [];
  const iter = {
    i: 0,
    char: 1,
    line: 1,
    scope: false,
  };

  while (iter.i < text.length) {
    let char = text[iter.i];
    let nextChar = text[iter.i + 1];

    if (char === LINEBREAK) {
      out[iter.line] = iter.scope;
      iter.line++;
      iter.char = 1;
    }

    // Skip any backslashed tokens as per GIFT spec
    if (char === "\\" && (nextChar === TOKEN.START || nextChar === TOKEN.END)) {
      iter.i += 2;
      iter.char += 2;
    }

    if (char === TOKEN.START) {
      iter.scope = true;
      out[iter.line] = iter.scope;
    }

    if (char === TOKEN.END) {
      iter.scope = false;
      out[iter.line] = iter.scope;
    }

    iter.i++;
    iter.char++;
  }

  return out;
}

/**
 * Find all empty lines in text.
 * @param text Input text
 * @returns An array of empty line numbers
 * indexed from 1.
 */
export function findEmptyLines(text: string, splitText: string[]): number[] {
  const emptyorSpaces = /^\s*$/g;
  return splitText.reduce(
    (accum: number[], curr: string, idx: number): number[] => {
      if (curr.match(emptyorSpaces)) {
        accum.push(idx + 1);
      }
      return accum;
    },
    []
  );
}
