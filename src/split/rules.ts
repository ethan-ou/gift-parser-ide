/**
 * Discards any empty lines inside a scope.
 * @param array Array of special tokens in text
 * @param singleScope Array of single-line scopes
 * @param length Number of lines in file.
 */
export function noEmptyLinesInScope(
  array: string[],
  singleScope: string[],
  length: number
): string[] {
  const output = [];
  let scope = false;
  for (let i = 0; i < length; i++) {
    if (array[i] === "SCOPE_OPEN") {
      scope = true;
      output[i] = array[i];
    }

    // Extra check to ensure unhandled open scopes are
    // closed. Refers to the next scope.
    if (singleScope[i] === "SCOPE" && scope === true) {
      scope = false;
    }

    if (array[i] === "EMPTY_LINE" && scope === false) {
      output[i] = array[i];
    }

    if (array[i] === "SCOPE_CLOSED") {
      scope = false;
      output[i] = array[i];
    }
  }
  return output;
}
