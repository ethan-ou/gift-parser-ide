import { Expectation, IFileRange, SyntaxError } from "./parser/parser";

type GIFTSyntaxError = SyntaxError;

interface ErrorResult {
  start: number;
  end: number;
  text: string;
  parse: null;
  error: SyntaxError;
}

interface ErrorResultArr {
  start: number;
  end: number;
  text: string;
  parse: null;
  error: SyntaxError[];
}

interface ParseResult {
  start: number;
  end: number;
  text: string;
  parse: any;
  error: null;
}

interface CharToken {
  token: string;
  line: number;
  char: number;
}

type LineToken =
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

type GIFTResult = ParseResult | ErrorResultArr;
