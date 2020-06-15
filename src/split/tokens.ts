import { CharToken, LineToken } from "../types";

/**
 * Generate an array of important tokens in the text.
 * Each index of the array corresponds to a new line,
 * starting from 0. Index 0 is equal to line 1 etc.
 * @param text Input text
 * @returns An array of tokens where each array index
 * corresponds to a line number, indexed from 0.
 */
export function createTokens(text: string): LineToken[] {
  const lineTokens: LineToken[] = [];

  const emptyLines = findEmptyLines(text);
  const scopeList = findScopes(text);
  const multiLineScopes: CharToken[] = [];

  //  Remove all scopes that start and end on the same line.
  //  The remaining scopes are multiline scopes.
  for (let i = 0; i < scopeList.length; i++) {
    let lastPushedItem = multiLineScopes.length - 1;

    if (scopeList[i].token === "{") {
      multiLineScopes.push(scopeList[i]);
    }
    if (
      scopeList[i].token === "}" &&
      scopeList[i].line === multiLineScopes[lastPushedItem]?.line
    ) {
      multiLineScopes.pop();
    } else if (scopeList[i].token === "}") {
      multiLineScopes.push(scopeList[i]);
    }
  }

  //  Add empty lines to the lineTokens array.
  for (let i = 0; i < emptyLines.length; i++) {
    lineTokens[emptyLines[i] - 1] = "EMPTY_LINE";
  }

  // If a scope starts and ends on different lines, add to the
  // lineTokens array.
  for (let i = 0; i < multiLineScopes.length; i++) {
    if (multiLineScopes[i].token === "{") {
      lineTokens[multiLineScopes[i].line - 1] = "SCOPE_OPEN";
    }

    if (scopeList[i].token === "}") {
      lineTokens[multiLineScopes[i].line - 1] = "SCOPE_CLOSED";
    }
  }

  return lineTokens;
}

export function createSingleLineScopeTokens(text: string): LineToken[] {
  const lineTokens: LineToken[] = [];
  const stack = [];

  const scopeList = findScopes(text);
  const singleLineScopes: CharToken[] = [];

  for (let i = 0; i < scopeList.length; i++) {
    if (scopeList[i].token === "{") {
      stack.push(scopeList[i]);
    }

    if (scopeList[i].token === "}") {
      let prev = stack.pop();
      if (scopeList[i].line === prev?.line) {
        singleLineScopes.push(prev);
        singleLineScopes.push(scopeList[i]);
      }
    }
  }

  // Output tokens
  for (let i = 0; i < singleLineScopes.length; i++) {
    if (singleLineScopes[i].token === "{") {
      lineTokens[singleLineScopes[i].line - 1] = "SCOPE";
    }

    if (singleLineScopes[i].token === "}") {
      lineTokens[singleLineScopes[i].line - 1] = "SCOPE";
    }
  }
  return lineTokens;
}

/**
 * Generates an array of all tokens that
 * open or close a GIFT question scope.
 * @param text Input text
 * @returns An array of Parse objects showing
 * where the scope tokens "{" "}" were found
 * in the text.
 */
export function findScopes(text: string): CharToken[] {
  const tokens = { start: "{", end: "}" };
  const output: CharToken[] = [];
  const lineBreak = "\n";
  const iterators = {
    i: 0,
    char: 1,
    line: 1,
  };

  while (iterators.i < text.length) {
    let char = text[iterators.i];
    let nextChar = text[iterators.i + 1];

    if (char === lineBreak) {
      iterators.line++;
      iterators.char = 1;
    }

    // Skip any backslashed tokens as per GIFT spec
    if (
      char === "\\" &&
      (nextChar === tokens.start || nextChar === tokens.end)
    ) {
      iterators.i += 2;
      iterators.char += 2;
    }

    if (char === tokens.start) {
      output.push({
        token: tokens.start,
        line: iterators.line,
        char: iterators.char,
      });
    }

    if (char === tokens.end) {
      output.push({
        token: tokens.end,
        line: iterators.line,
        char: iterators.char,
      });
    }

    iterators.i++;
    iterators.char++;
  }

  return output;
}

/**
 * Find all empty lines in text.
 * @param text Input text
 * @returns An array of empty line numbers
 * indexed from 1.
 */
export function findEmptyLines(text: string): number[] {
  const output = [];
  const lineBreak = "\n";
  const emptyorSpaces = /^\s*$/g;
  const iterators = {
    i: 0,
    line: 1,
  };

  const lines = text.split(lineBreak);

  while (iterators.i < lines.length) {
    if (lines[iterators.i].match(emptyorSpaces)) {
      output.push(iterators.line);
    }

    iterators.i++;
    iterators.line++;
  }

  return output;
}
