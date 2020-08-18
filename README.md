# GIFT-Parser

A parser for Moodle's GIFT format designed for error checking in IDE's. It is the library that powers the [VSCode GIFT Language Extension](https://github.com/ethan-ou/vscode-gift).

This project builds on [fuhrmanator's GIFT grammar](https://github.com/fuhrmanator/GIFT-grammar-PEG.js), adding heuristic based error recovery and incremental parsing to deliver better error reports for end users.

## Install

```
npm install gift-parser-ide
```

## Usage

There are two parsers available:

- Class-based incremental parser: This parser diffs the changes in the text from the previous parse and only parses the changes. This improves the speed of parsing drastically for repeated parsing, making it useful for IDE's.
- Function-based one-shot parser: Parses the whole input text everytime a new text is given.

### Importing

**ES6+**

```javascript
import GIFTParser from "gift-parser-ide"; // Default: Class-based Incremental Parser
import { parser } from "gift-parser-ide"; // Function-based One-Shot Parser
```

**Node/CommonJS**

```javascript
var Parser = require("gift-parser-ide").default; // Default: Class-based Incremental Parser
var parser = require("gift-parser-ide").parser; // Function-based One-Shot Parser
```

### Example

```javascript
var text = "::Title:: Gift Question {}";

// Class
var Parser = new GIFTParser();
Parser.update(text) //Updates the parser with new text
var output = Parser.result(); // Returns GIFTResult[]

// Function
var output = parser.parse(text); // Returns GIFTResult[]
```

## API
### `GIFTParser.update(text: string)`
- Updates the GIFTParser with new text. To return a value, use `.result()` to get a full result or `.parseOnly()` and `.errorOnly()` to get only the parsed output or error output respectively.

### `GIFTParser.result()`
- Returns a `GIFTResult[]` which includes both parsed sections of GIFT and sections with errors.

### `GIFTParser.parseOnly()`
- Returns the parsed output of a GIFT text. Does not throw an error if a section cannot be parsed.

### `GIFTParser.errorOnly()`
- Returns all errors found within a GIFT text.

### `parser.parse(text: string)`
- Parses a GIFT text and returns both parsed sections of GIFT and sections with errors. Functionally equivalent to `GIFTParser.update(text).result()` without keeping previous parses.

### `parser.parseOnly(text: string)`
- Returns the parsed output of a GIFT text. Does not throw an error if a section cannot be parsed. Functionally equivalent to `GIFTParser.update(text).parseOnly()` without keeping previous parses.

### `parser.errorOnly(text: string)`
- Returns all errors found within a GIFT text. Functionally equivalent to `GIFTParser.update(text).errorOnly()` without keeping previous parses.

### `parser.parseRaw(text: string)`
- Wraps the raw GIFT parser. Mainly used as a utility class.

## License

MIT
