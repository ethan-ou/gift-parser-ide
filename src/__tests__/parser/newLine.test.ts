import { detectLineType, convertLineType } from "../../parser/newLine";

test("Detect Line Type", () => {
  expect(detectLineType("foo")).toBe("\n");
  expect(detectLineType("foo\r\nbar\r\nbaz\n")).toBe("\r\n");
  expect(detectLineType("foo\r\nbar\r\nbaz\n\n\n")).toBe("\n");
  expect(detectLineType("foo\r\nbar\r\nbaz\n")).toBe("\r\n");
});

test("Convert Line Type", () => {
  expect(convertLineType("\r\n\r\n")).toBe("\n\n");
  expect(convertLineType("\r\n\r\n", "LF")).toBe("\n\n");
  expect(convertLineType("\r\n\r\n", "CRLF")).toBe("\r\n\r\n");
});
