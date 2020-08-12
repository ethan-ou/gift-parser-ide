/**
 * Clean the input text for particular GIFT syntax, to
 * avoid false positive errors. Currently only removes comments.
 * @param text The cleaned input text.
 */

export default function cleanText(text: string): string {
  const NEWLINE = "\n";
  const splitText = text
    .split(NEWLINE)
    .map((comment) => removeComment(comment));

  const fullText = splitText.join(NEWLINE);
  return fullText;
}

function removeComment(text: string): string {
  return text.replace(/(^[ \\t]+)?(^)((\/\/))(.*)/gm, "");
}
