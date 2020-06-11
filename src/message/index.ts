import { IErrorArr } from "../types";
import { SyntaxError } from "../parser/parser";

export default function message(
  originalText: string,
  message: IErrorArr
): IErrorArr {
  const columnCorrected = correctTokenMessages(message);
  return correctTextSplitMessages(originalText, columnCorrected);
}

function correctTextSplitMessages(text: string, message: IErrorArr) {
  const newLine = "\n";
  const charNum = text.split(newLine).map((string) => string.length);
  return {
    ...message,
    error: message.error.map((item) => {
      return incrementError(
        {
          offset: charNum[message.start - 1],
          line: message.start - 1,
          column: 0,
        },
        item
      );
    }),
  };
}

function correctTokenMessages(message: IErrorArr) {
  let iterators: { prevLine: undefined | number; count: number } = {
    prevLine: undefined,
    count: 0,
  };

  const corrected = message.error.map((item, index) => {
    const { start, end } = item.location;

    if (iterators.prevLine === start.line) {
      iterators.count++;
    } else {
      iterators.count = 0;
      iterators.prevLine = start.line;
    }

    let output;
    if (end.line > start.line) {
      output = removeColumnStartError(iterators.count, item);
    } else {
      output = removeColumnError(iterators.count, item);
    }

    return removeOffsetError(index, output);
  });

  return {
    ...message,
    error: corrected,
  };
}

export function incrementError(
  number: {
    line: number;
    offset: number;
    column: number;
  },
  message: SyntaxError
): SyntaxError {
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

export function incrementColumnError(
  number: number,
  message: SyntaxError
): SyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        column: message.location.start.column + number,
      },
      end: {
        ...message.location.end,
        column: message.location.end.column + number,
      },
    },
  };
}

export function incrementOffsetError(
  number: number,
  message: SyntaxError
): SyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        offset: message.location.start.offset + number,
      },
      end: {
        ...message.location.end,
        offset: message.location.end.offset + number,
      },
    },
  };
}

export function incrementLineError(
  number: number,
  message: SyntaxError
): SyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        line: message.location.start.line + number,
      },
      end: {
        ...message.location.end,
        line: message.location.end.line + number,
      },
    },
  };
}

export function removeOffsetError(
  number: number,
  message: SyntaxError
): SyntaxError {
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

export function removeLineError(
  number: number,
  message: SyntaxError
): SyntaxError {
  return {
    ...message,
    location: {
      ...message.location,
      start: {
        ...message.location.start,
        line: message.location.start.line - number,
      },
      end: {
        ...message.location.end,
        line: message.location.end.line - number,
      },
    },
  };
}

export function removeColumnError(
  number: number,
  message: SyntaxError
): SyntaxError {
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

export function removeColumnStartError(
  number: number,
  message: SyntaxError
): SyntaxError {
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
