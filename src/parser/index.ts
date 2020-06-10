import { parse, SyntaxError } from "./parser";
export default function (text: string, options?: any) {
  try {
    return { parse: parse(text), error: null };
  } catch (error) {
    return { parse: null, error: createError(error, text) };
  }
}

function createError(e: SyntaxError, text: string) {
  return {
    message: e.message,
    found: e.found,
    expected: e.expected,
    location: e.location,
  };
}
