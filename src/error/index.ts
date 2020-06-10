import { error as errorParser } from "../parser";

// export default function (text, error) {

// }

export function findToken(
  text: string,
  token: string,
  location: number
): number | null {
  const SEARCH_LIMIT = 5;
  const UPPER_LIMIT = Math.min(text.length, location + SEARCH_LIMIT);
  const LOWER_LIMIT = Math.max(0, location - SEARCH_LIMIT);
  const iterators = {
    i: 0,
  };
  let iteratorUpper = location + iterators.i;
  let iteratorLower = location - iterators.i;

  while (iteratorUpper < UPPER_LIMIT && iteratorLower > LOWER_LIMIT) {
    if (text[iteratorLower] === token) {
      return iteratorLower;
    }

    if (text[iteratorUpper] === token) {
      return iteratorUpper;
    }
    iterators.i++;
  }

  return null;
}

function escapeToken(text: string, location: number): string | null {
  const escape = "\\";
  const tokens = [":", "~", "=", "#"];

  // FUTURE: Test escaping these tokens.
  const unsafeTokens = ["\n", "{", "}"];
  const escapeLocation = location - 1 > 0 ? location - 1 : 0;
  if (tokens.includes(text[location])) {
    return `${text.slice(0, escapeLocation)}${escape}${text.slice(location)}`;
  }

  return null;
}

// function correctLocation(error, options) {

// }
