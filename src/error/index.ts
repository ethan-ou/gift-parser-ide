import parser from "../parser";
import { IErrorArr, IError } from "../types";
import token from "./token";
import { SyntaxError } from "../parser/parser";

/**
 * Recursively finds errors in a section of the input
 * text. When an error is found, the token is escaped
 * with a backslash "\\". This replicates the error
 * recovery found on traditional LL(*) parsers.
 * @param message
 */

export default function (message: IError): IErrorArr {
  const ITERATION_LIMIT = 50;
  const stack: string[] = [];
  const errors: SyntaxError[] = [];

  stack.push(message.text);
  errors.push(message.error);

  try {
    let i = 0;

    while (i < ITERATION_LIMIT) {
      let findToken = token(stack[stack.length - 1], errors[errors.length - 1]);
      stack.push(findToken);

      let newError = parser(findToken);

      if (newError.error !== null) {
        errors.push(newError.error);
        i++;
      } else {
        throw new Error("Finished");
      }
    }
  } catch (err) {}

  return {
    ...message,
    error: errors,
  };
}
