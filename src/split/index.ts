import { createTokens, createSingleLineScopeTokens } from "./tokens";
import { noEmptyLinesInScope } from "./rules";

export default function (text: string) {
  const output = [];

  const textTokens = createTokens(text);
  const splitText = text.split("\n");

  const outputTokens = noEmptyLinesInScope(
    textTokens,
    createSingleLineScopeTokens(text),
    splitText.length
  );

  //   REDO
  let currText = "";
  let startLine = 1;
  let i = 0;
  for (i; i < splitText.length; i++) {
    if (outputTokens[i] === "EMPTY_LINE") {
      output.push({ start: startLine, end: i + 1, text: currText });
      startLine = i + 2;
      currText = "";
    } else {
      currText += splitText[i] + "\n";
    }
  }

  output.push({ start: startLine, end: i + 1, text: currText });

  return output;
}
