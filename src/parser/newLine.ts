export const newLineRegex = /(?:\r?\n)/g;
export const newLineType = {
  LF: "\n",
  CRLF: "\r\n",
};

/**
 * Detects predominant type of new line ending.
 * Based on sindresorhus's detect-newline library.
 * @param string Input string
 */
export const detectLineType = (string: string) => {
  const newLines = string.match(newLineRegex) || [];

  if (newLines.length === 0) {
    return newLineType.LF;
  }

  const crlf = newLines.filter(
    (newline) => newline === newLineType.CRLF,
  ).length;
  const lf = newLines.length - crlf;

  return crlf > lf ? newLineType.CRLF : newLineType.LF;
};

export const convertLineType = (string: string, type: "LF" | "CRLF" = "LF") => {
  return string.replace(newLineRegex, newLineType[type]);
};
