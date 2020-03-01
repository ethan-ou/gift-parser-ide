import Parser from "./gift";
import chevrotain from "chevrotain";

const result = Parser.parse("Hello");

console.log(result);
console.log(result.parseErrors);

// const parserInstance = Parser.parserInstance;
// const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
// const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);
// console.log(htmlText);

// export function parseGIFT(text: string) {
//     const lexResult = Parser.tokenize(text);
//     // setting a new input will RESET the parser instance's state.
//     Parser.input = lexResult.tokens;
//     // any top level rule may be used as an entry point
//     const cst = Parser.json();
  
//     // this would be a TypeScript compilation error because our parser now has a clear API.
//     // let value = parser.json_OopsTypo()
  
//     return {
//       // This is a pure grammar, the value will be undefined until we add embedded actions
//       // or enable automatic CST creation.
//       cst: cst,
//       lexErrors: lexResult.errors,
//       parseErrors: Parser.errors
//     }
//   }