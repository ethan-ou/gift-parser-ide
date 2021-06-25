import { SyntaxError, GIFTQuestion } from "gift-pegjs";

export type GIFTSyntaxError = SyntaxError;

export type GIFTParse = [GIFTQuestion[] | null, GIFTSyntaxError[] | null];

export interface GIFTParseSection {
  location: GIFTTextSection;
  result: GIFTParse;
}

export interface GIFTTextSection {
  start: number;
  end: number;
  text: string;
}
