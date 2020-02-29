import { createToken, Lexer, Parser, EOF } from "chevrotain";

const WhiteSpace = createToken({
    name: "WhiteSpace", pattern: /\s+/,
    group: Lexer.SKIPPED
});

const EndOfLine = createToken({
    name: "NewLine",
    pattern: /\r?\n/
  });

const True = createToken({name: "True", pattern: /true/});
const False = createToken({name: "False", pattern: /false/});

const LCurly = createToken({name: "LCurly", pattern: /{/});
const RCurly = createToken({name: "RCurly", pattern: /}/});
const Colon = createToken({name: "Colon", pattern: /:/});

const Hash = createToken({name: "Hash", pattern: /#/});
const QuadHash = createToken({name: "QuadHash", pattern: /#/, longer_alt: Hash});
const Dollar = createToken({name: "Dollar", pattern: /\$/});
const Percentage = createToken({name: "Percentage", pattern: /%/});
const Tilde = createToken({name: "Tilde", pattern: /~/});
const Equals = createToken({name: "Equals", pattern: /=/});
const LSquare = createToken({name: "LSquare", pattern: /\[/});
const RSquare = createToken({name: "RSquare", pattern: /]/});
const Comment = createToken({name: "Comment", pattern: /\/\//});
const Backslash = createToken({name: "Backslash", pattern: /\\/});
const Period = createToken({name: "Period", pattern: /\./});

const Category = createToken({name: "Category", pattern: /CATEGORY:/});

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });

const Any = createToken({name: "Any", pattern: /./});

export let allTokens = [
    WhiteSpace,
    EndOfLine,
    // "keywords" appear before the Identifier
    True,
    False,
    LCurly,
    RCurly,
    Colon,
    Dollar,
    Hash,
    QuadHash,
    Tilde,
    Equals,
    Percentage,
    LSquare,
    RSquare,
    Comment,
    Backslash,
    Period,
    Category,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier,
    Integer,
    Any
];

export const GIFTLexer = new Lexer(allTokens);

export default class GIFTParser extends Parser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    // public gift = this.RULE("Document", () => {
    //     this.OR([
    //         { ALT: () => this.SUBRULE(this.Category) },
    //         { ALT: () => this.SUBRULE(this.Description) },
    //         { ALT: () => this.SUBRULE(this.Question) }
    //     ]);
    // });

    // private Category = this.RULE("Category", () => {
    //     this.CONSUME(Dollar);
    //     this.CONSUME(Category);
    //     //Not sure yet what to put here.

    //     //End of Line, Blank Line, End of File
    // });

    // private Description = this.RULE("Description", () => {

    // });

    // private Question = this.RULE("Question", () => {
        
    // })

    // GlobalFeedback
    // = '####' _ rt:RichText _ {return rt;}
    private GlobalFeedback = this.RULE("GlobalFeedback", () => {
        this.CONSUME(QuadHash);
    })

    // TEST!!!
    // _ "(single line whitespace)"
    // = (Space / EndOfLine !BlankLine)*
    private _ = this.RULE("_", () => {
        this.OPTION(() => {
            this.MANY(() => {
                this.OR([
                    {ALT: () => this.SUBRULE(this.Space)},
                    {GATE: () => !this.BlankLine, ALT: () => this.SUBRULE(this.EndOfLine)}
                ]);
            });
        });
    });

    // __ "(multiple line whitespace)"
    // = (Comment / EndOfLine / Space )*

    private __ = this.RULE("__", () => {
        this.OPTION(() => {
            this.MANY(() => {
                this.OR([
                    {ALT: () => this.SUBRULE(this.Comment)},
                    {ALT: () => this.SUBRULE(this.EndOfLine)},
                    {ALT: () => this.SUBRULE(this.Space)}
                ]);
            });
        });
    });

    // TEST!!!
    // Comment "(comment)"
    //   = '//' (!EndOfLine .)* &(EndOfLine / EndOfFile) {return null}  // don't consume the EOL in comment, so it can count towards question separator
    private Comment = this.RULE("Comment", () => {
        this.CONSUME(Comment);
        this.OPTION(() => {
            this.MANY(() => {
                this.OR([
                    {
                        GATE: () => !this.EndOfLine, ALT: () => this.CONSUME(Any)
                    }
                ]);
                
            });
        });
        this.OR([
            {
                ALT: () => this.SUBRULE(this.EndOfLine)
            },
            {
                ALT: () => this.SUBRULE(this.EndOfFile)
            }
        ]);
    });

    // Space "(space)"
    //   = ' ' / '\t'
    private Space = this.RULE("Space", () => {
        this.CONSUME(WhiteSpace);
    });

    // EndOfLine "(end of line)"
    // = '\r\n' / '\n' / '\r'
    private EndOfLine = this.RULE("EndOfLine", () => {
        this.CONSUME(EndOfLine);
    });

    // EndOfFile 
    // = !. { return "EOF"; }
    private EndOfFile = this.RULE("EndOfFile", () => {
        this.CONSUME(EOF);
    });


    this.performSelfAnalysis();
}
