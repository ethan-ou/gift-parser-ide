import { Expectation, IFileRange, SyntaxError } from "./parser/PEGParser";

export interface GIFTSyntaxError extends SyntaxError {}

export type ParseType = "result" | "error";

export interface ParseReturn {
  type: Extract<"result", ParseType>;
  result: any;
}

export interface ErrorReturn {
  type: Extract<"error", ParseType>;
  result: GIFTSyntaxError;
}

export interface ErrorReturnArr {
  type: Extract<"error", ParseType>;
  result: GIFTSyntaxError[];
}

export interface ErrorResult extends ErrorReturn {
  start: number;
  end: number;
  text: string;
}

export interface ErrorResultArr extends ErrorReturnArr {
  start: number;
  end: number;
  text: string;
}

export interface ParseResult extends ParseReturn {
  start: number;
  end: number;
  text: string;
}

export interface TextSplit {
  start: number;
  end: number;
  text: string;
}

export type GIFTResult = ParseResult | ErrorResultArr;
