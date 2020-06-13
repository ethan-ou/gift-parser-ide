# GIFT-Parser

A parser for Moodle's GIFT format designed for error checking in IDE's. It is the library that powers the [VSCode GIFT Language Extension](https://github.com/ethan-ou/vscode-gift).

This project builds on [fuhrmanator's GIFT grammar](https://github.com/fuhrmanator/GIFT-grammar-PEG.js), adding heuristic based error recovery and incremental parsing to deliver better error reports for end users.

## Install

```
npm install gift-parser
```

## Usage

There are two parsers available:

- Class-based incremental parser: This parser diffs the changes in the text from the previous parse and only parses the changes. This improves the speed of parsing drastically for repeated parsing, making it useful for IDE's.
- Function-based one-shot parser: Parses the whole input text everytime a new text is given.

### Importing

**ES6+**

```javascript
import Parser from "gift-parser"; // Default: Class-based Incremental Parser

import { parser } from "gift-parser"; // Function-based One-Shot Parser
```

**Node/CommonJS**

```javascript
var Parser = require("gift-parser").default; // Default:  Class-based Incremental Parser

var parser = require("gift-parser").parser; // Function-based One-Shot Parser
```

### Example

```javascript
var text = "::Title:: Gift Question {}";

// Class
var GIFTParser = new Parser();
var output = GIFTParser.update(text); // Returns SyntaxError[]

// Function
var output = parser(text); // Returns SyntaxError[]
```

## API

### `Parser()`

Class-based parser.

- `Parser.update(text: string)`: Update the parser with new text. Returns: `SyntaxError[]`

### `parser(text: string)`

Function-based parser.

## License

MIT
