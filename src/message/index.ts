import { ErrorResultArr, GIFTSyntaxError } from "../types";

/**
 * Process error messages to display the correct line, column and offset
 * numbers for the text.
 * @param originalText The text being parsed. Must have LF line endings.
 * @param message The error message.
 * @param lineEnding The type of line-ending used (e.g. \n, \r\n, \r).
 * Used to correct offset property of syntax errors.
 */

export default function message(
  originalText: string,
  message: ErrorResultArr,
  lineEnding: string
): ErrorResultArr {
  return correctMessage(originalText, correctToken(message), lineEnding);
}

function correctMessage(
  text: string,
  message: ErrorResultArr,
  lineEnding: string
): ErrorResultArr {
  const NEWLINE = "\n";
  const charPerLine = text
    .split(NEWLINE)
    .map((line) => line.length + lineEnding.length);
  const offsetIndex = charPerLine[message.start - 2]
    ? charPerLine[message.start - 2]
    : 0;

  return {
    ...message,
    result: message.result.map((item) =>
      addError(
        {
          offset: offsetIndex,
          line: message.start - 1,
          column: 0,
        },
        item
      )
    ),
  };
}

function correctToken(message: ErrorResultArr): ErrorResultArr {
  const iter = {
    prevLine: -1,
    count: 0,
  };

  return {
    ...message,
    result: message.result.map((item, index) => {
      const start = item?.location?.start;
      const end = item?.location?.end;

      iter.prevLine === start.line
        ? iter.count++
        : ((iter.count = 0), (iter.prevLine = start.line));

      return end.line > start.line
        ? removeOffset(index, removeColumnStart(iter.count, item))
        : removeOffset(index, removeColumn(iter.count, item));
    }),
  };
}

function addError(
  number: {
    line: number;
    offset: number;
    column: number;
  },
  message: GIFTSyntaxError
): GIFTSyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        line: message.location.start.line + number.line,
        offset: message.location.start.offset + number.offset,
        column: message.location.start.column + number.column,
      },
      end: {
        ...message.location.end,
        line: message.location.end.line + number.line,
        offset: message.location.end.offset + number.offset,
        column: message.location.end.column + number.column,
      },
    },
  };
}

function removeOffset(
  number: number,
  message: GIFTSyntaxError
): GIFTSyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        offset: message.location.start.offset - number,
      },
      end: {
        ...message.location.end,
        offset: message.location.end.offset - number,
      },
    },
  };
}

function removeColumn(
  number: number,
  message: GIFTSyntaxError
): GIFTSyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        column: message.location.start.column - number,
      },
      end: {
        ...message.location.end,
        column: message.location.end.column - number,
      },
    },
  };
}

function removeColumnStart(
  number: number,
  message: GIFTSyntaxError
): GIFTSyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        column: message.location.start.column - number,
      },
    },
  };
}
