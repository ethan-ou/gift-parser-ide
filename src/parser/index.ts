import { parse as parser, SyntaxError } from "./parser";
export default function (text: string, options?: any) {
  try {
    return { parse: parser(text), error: null };
  } catch (error) {
    return { parse: null, error: [createError(error, text)] };
  }
}

export function parse(text: string, options?: any) {
  try {
    return { parse: parser(text) };
  } catch (error) {
    return { parse: null };
  }
}

export function error(text: string, options?: any) {
  try {
    parser(text);
    return { error: null };
  } catch (error) {
    return { error: [createError(error, text)] };
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
