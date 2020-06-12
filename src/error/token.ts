import { SyntaxError } from "../parser/parser";

export default function (text: string, message: SyntaxError) {
  return escapeToken(
    text,
    findToken(text, message.found, message.location.start.offset)
  );
}

function findToken(
  text: string,
  token: string | null,
  location: number
): number {
  const SEARCH_LIMIT = 1;
  const UPPER_LIMIT = Math.min(text.length, location + SEARCH_LIMIT);
  const LOWER_LIMIT = Math.max(0, location - SEARCH_LIMIT);
  const iterators = {
    i: 0,
  };
  let iteratorUpper = location + iterators.i;
  let iteratorLower = location - iterators.i;

  if (token === null) {
    throw new Error("Token is Null.");
  }

  while (
    iteratorUpper < UPPER_LIMIT &&
    (iteratorLower > LOWER_LIMIT || iteratorLower === 0)
  ) {
    //  Favour tokens that are before the token location
    if (text[iteratorLower] === token) {
      return iteratorLower;
    }

    if (text[iteratorUpper] === token) {
      return iteratorUpper;
    }
    iterators.i++;
  }

  throw new Error("No Token Found.");
}

function escapeToken(text: string, location: number): string {
  const escape = "\\";
  const newLine = "\n";
  const tokens = [":", "~", "=", "#", "{", "}", "\n"];

  const tokenIsAccepted = tokens.includes(text[location]);

  if (tokenIsAccepted && text[location] === newLine) {
    const escapeLocation = location + 1;
    const tokenNotEscaped = text[escapeLocation] !== escape;

    if (tokenNotEscaped) {
      return `${text.slice(0, location + 1)}${escape}${text.slice(
        location + 1
      )}`;
    } else {
      throw new Error("No Token Found.");
    }
  }

  const escapeLocation = location - 1 > 0 ? location - 1 : 0;
  const tokenNotEscaped = text[escapeLocation] !== escape;

  if (tokenIsAccepted && tokenNotEscaped) {
    return `${text.slice(0, location)}${escape}${text.slice(location)}`;
  }

  throw new Error("No Token Found.");
}
