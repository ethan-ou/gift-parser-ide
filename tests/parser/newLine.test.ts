import { detectLineType, convertLineType } from "../../src/parser/newLine";
import { describe } from "node:test";
import assert from "node:assert";

describe("Detect Line Type", () => {
  assert.strictEqual(detectLineType("foo"), "\n");
  assert.strictEqual(detectLineType("foo\r\nbar\r\nbaz\n"), "\r\n");
  assert.strictEqual(detectLineType("foo\r\nbar\r\nbaz\n\n\n"), "\n");
  assert.strictEqual(detectLineType("foo\r\nbar\r\nbaz\n"), "\r\n");
});

describe("Convert Line Type", () => {
  assert.strictEqual(convertLineType("\r\n\r\n"), "\n\n");
  assert.strictEqual(convertLineType("\r\n\r\n", "LF"), "\n\n");
  assert.strictEqual(convertLineType("\r\n\r\n", "CRLF"), "\r\n\r\n");
});
