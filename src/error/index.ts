import parser from "../parser";
import { ErrorResultArr, ErrorResult, GIFTSyntaxError } from "../types";

/**
 * Recursively finds errors in a section of the input
 * text. When an error is found, the token is escaped
 * with a backslash "\\". This replicates the error
 * recovery found on traditional LL(*) parsers.
 * @param message
 */
export default function (message: ErrorResult): ErrorResultArr {
  const ITERATION_LIMIT = 50;
  const stack: string[] = [];
  const errors: GIFTSyntaxError[] = [];

  stack.push(message.text);
  errors.push(message.result);

  try {
    let i = 0;

    while (i < ITERATION_LIMIT) {
      const findToken = token(
        stack[stack.length - 1],
        errors[errors.length - 1]
      );
      stack.push(findToken);

      const newError = parser(findToken);

      if (newError.type === "error") {
        errors.push(newError.result);
        i++;
      } else {
        break;
      }
    }
  } catch (err) {}

  return {
    ...message,
    result: errors,
  };
}

function token(text: string, message: GIFTSyntaxError) {
  return escapeToken(
    text,
    findToken(text, message.found, message.location.start.offset)
  );
}

/**
 * Iterates through text to find a matching token,
 * looking at the token location first before looking
 * at the previous and next character simultaneously.
 */
function findToken(
  text: string,
  token: string | null,
  location: number
): number {
  if (token === null) {
    throw new Error("Token is Null.");
  }

  const SEARCH_LIMIT = 1;
  const UPPER_LIMIT = Math.min(text.length, location + SEARCH_LIMIT);
  const LOWER_LIMIT = Math.max(0, location - SEARCH_LIMIT);

  const iter = {
    i: 0,
  };
  let iteratorUpper = location + iter.i;
  let iteratorLower = location - iter.i;

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
    iter.i++;
  }

  throw new Error("No Token Found.");
}

/**
 * Adds an escape in front of a token. Used to
 * allow GIFT's PEG parser to parse text with errors,
 * by emulating error correction.
 * @param text
 * @param location
 */
function escapeToken(text: string, location: number): string {
  const ESCAPE = "\\";
  const NEWLINE = "\n";
  const tokens = [":", "~", "=", "#", "{", "}", "\n"];

  const tokenIsAccepted = tokens.includes(text[location]);

  if (tokenIsAccepted && text[location] === NEWLINE) {
    const escapeLocation = location + 1;
    const tokenNotEscaped = text[escapeLocation] !== ESCAPE;

    if (tokenNotEscaped) {
      return `${text.slice(0, location + 1)}${ESCAPE}${text.slice(
        location + 1
      )}`;
    } else {
      throw new Error("No Token Found.");
    }
  }

  const escapeLocation = location - 1 > 0 ? location - 1 : 0;
  const tokenNotEscaped = text[escapeLocation] !== ESCAPE;

  if (tokenIsAccepted && tokenNotEscaped) {
    return `${text.slice(0, location)}${ESCAPE}${text.slice(location)}`;
  }

  throw new Error("No Token Found.");
}
