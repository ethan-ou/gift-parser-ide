import { Expectation, IFileRange, SyntaxError } from "./parser/parser";

type GIFTSyntaxError = SyntaxError;

type ParseType = "parse" | "error";

interface ParseReturn {
  type: Extract<"parse", ParseType>;
  parse: any;
}

interface ErrorReturn {
  type: Extract<"error", ParseType>;
  error: GIFTSyntaxError;
}

interface ErrorReturnArr {
  type: Extract<"error", ParseType>;
  error: GIFTSyntaxError[];
}

interface ErrorResult extends ErrorReturn {
  start: number;
  end: number;
  text: string;
}

interface ErrorResultArr extends ErrorReturnArr {
  start: number;
  end: number;
  text: string;
}

interface ParseResult extends ParseReturn {
  start: number;
  end: number;
  text: string;
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
