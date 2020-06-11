import { Expectation, IFileRange, SyntaxError } from "./parser/parser";

interface IError {
  start: number;
  end: number;
  text: string;
  parse: null;
  error: SyntaxError;
}

interface IErrorArr {
  start: number;
  end: number;
  text: string;
  parse: null;
  error: SyntaxError[];
}

interface IParse {
  start: number;
  end: number;
  text: string;
  parse: any;
  error: null;
}

type IResult = IParse | IError;

interface Parse {
  token: string;
  line: number;
  char: number;
}

type TextToken =
  | "SCOPE_OPEN"
  | "SCOPE_CLOSED"
  | "EMPTY_LINE"
  | "SCOPE"
  | undefined;

interface TextSplit {
  start: number;
  end: number;
  text: string;
}
