import { Expectation, IFileRange, SyntaxError } from "./parser/PEGParser";

interface GIFTSyntaxError extends SyntaxError {}

type ParseType = "result" | "error";

interface ParseReturn {
  type: Extract<"result", ParseType>;
  result: any;
}

interface ErrorReturn {
  type: Extract<"error", ParseType>;
  result: GIFTSyntaxError;
}

interface ErrorReturnArr {
  type: Extract<"error", ParseType>;
  result: GIFTSyntaxError[];
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

interface TextSplit {
  start: number;
  end: number;
  text: string;
}

type GIFTResult = ParseResult | ErrorResultArr;
