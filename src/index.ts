import Lexer from "./giftLexer";

let inputText = "Gift Language { =Hello ~Goodbye }";
let lexingResult = Lexer.tokenize(inputText);

console.log(lexingResult);