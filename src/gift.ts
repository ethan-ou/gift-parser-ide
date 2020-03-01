import { createToken, Lexer, Parser, EOF } from "chevrotain";

// TODO: Remove this._ and this.__ using Lexer.SKIPPED
const WhiteSpace = createToken({
    name: "WhiteSpace", pattern: /\s+/,
    // group: Lexer.SKIPPED
});

const EndOfLine = createToken({
    name: "NewLine",
    pattern: /\r?\n/
  });

const True = createToken({name: "True", pattern: /TRUE|True|true/});
const False = createToken({name: "False", pattern: /FALSE|False|false/});
const T = createToken({name: "T", pattern: /T|t/});
const F = createToken({name: "F", pattern: /F|f/});

const LCurly = createToken({name: "LCurly", pattern: /{/});
const RCurly = createToken({name: "RCurly", pattern: /}/});
const Colon = createToken({name: "Colon", pattern: /:/});
const TitleColon = createToken({name: "TitleColon", pattern: /::/, longer_alt: Colon});

const Match = createToken({name: "Match", pattern: /->/});

const Hash = createToken({name: "Hash", pattern: /#/});
const TripleHash = createToken({name: "TripleHash", pattern: /###/, longer_alt: Hash});
const QuadHash = createToken({name: "QuadHash", pattern: /####/, longer_alt: Hash});
const Dollar = createToken({name: "Dollar", pattern: /\$/});
const Percentage = createToken({name: "Percentage", pattern: /%/});
const Tilde = createToken({name: "Tilde", pattern: /~/});
const Equals = createToken({name: "Equals", pattern: /=/});
const LSquare = createToken({name: "LSquare", pattern: /\[/});
const RSquare = createToken({name: "RSquare", pattern: /]/});
const Comment = createToken({name: "Comment", pattern: /\/\//});
const Escape = createToken({name: "Escape", pattern: /\\/});
const Period = createToken({name: "Period", pattern: /\./});
const Dash = createToken({name: "Dash", pattern: /-/});

const DoublePeriod = createToken({name: "DoublePeriod", pattern: /\.\./, longer_alt: Period});

const Category = createToken({name: "Category", pattern: /CATEGORY:/});

const html = createToken({name: "html", pattern: /html/});
const markdown = createToken({name: "markdown", pattern: /markdown/});
const plain = createToken({name: "plain", pattern: /plain/});
const moodle = createToken({name: "moodle", pattern: /moodle/});

const Hundred = createToken({name: "Hundred", pattern: /100/});

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const Integer = createToken({ name: "Integer", pattern: /[0-9]/ });

const Any = createToken({name: "Any", pattern: /./});

let allTokens = [
    WhiteSpace,
    EndOfLine,
    // "keywords" appear before the Identifier
    True,
    False,
    LCurly,
    RCurly,
    Match,
    TitleColon,
    Colon,
    Dollar,
    QuadHash,
    TripleHash,
    Hash,
    Tilde,
    Equals,
    Percentage,
    LSquare,
    RSquare,
    Comment,
    Escape,
    Period,
    DoublePeriod,
    Category,
    html,
    markdown,
    plain,
    moodle,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier,
    Integer,
    Any
];

const GIFTLexer = new Lexer(allTokens);

class GIFTParser extends Parser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    public document = this.RULE("Document", () => {
        this.SUBRULE(this.GIFTQuestions);
    });

    // GIFTQuestions = (Category / Description / Question)+ _ __
    private GIFTQuestions = this.RULE("GIFTQuestions", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.Category) },
            { ALT: () => this.SUBRULE(this.Description) },
            { ALT: () => this.SUBRULE(this.Question) }
        ]);
    });

    // Category = __ '$' 'CATEGORY:' _ PlainText QuestionSeparator
    private Category = this.RULE("Category", () => {
        this.SUBRULE(this.__);
        this.CONSUME(Dollar);
        this.CONSUME(Category);
        this.SUBRULE(this._);
        this.SUBRULE(this.PlainText);
        this.SUBRULE(this.QuestionSeparator);
    });

    // Description = __ QuestionTitle? _ QuestionStem QuestionSeparator
    private Description = this.RULE("Description", () => {
        this.SUBRULE(this.__);
        this.OPTION(() => this.SUBRULE(this.QuestionTitle));
        this.SUBRULE(this._);
        this.SUBRULE(this.QuestionStem);
        this.SUBRULE(this.QuestionSeparator);
    });

    // Question = __ QuestionTitle? _ QuestionStem? _ '{' _
    // (MatchingAnswers / TrueFalseAnswer / MCAnswers / NumericalAnswerType / SingleCorrectShortAnswer / EssayAnswer ) _
    // '}' _ (Comment / QuestionStem)? QuestionSeparator

    private Question = this.RULE("Question", () => {
        this.SUBRULE(this.__);
        this.OPTION(() => this.SUBRULE(this.QuestionTitle));
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.QuestionStem));
        this.SUBRULE(this._);
        this.CONSUME(LCurly);
        this.SUBRULE(this._);
        this.OR([
            {ALT: () => this.SUBRULE(this.MatchingAnswers)},
            {ALT: () => this.SUBRULE(this.TrueFalseAnswer)},
            {ALT: () => this.SUBRULE(this.MCAnswers)},
            {ALT: () => this.SUBRULE(this.NumericalAnswerType)},
            {ALT: () => this.SUBRULE(this.SingleCorrectShortAnswer)},
            {ALT: () => this.SUBRULE(this.EssayAnswer)}
        ]);
        this.SUBRULE(this._);
        this.CONSUME(RCurly);
        this.SUBRULE(this._);
        this.OPTION(() => this.OR([
                {ALT: () => this.SUBRULE(this.Comment)},
                {ALT: () => this.SUBRULE(this.QuestionStem)}
            ])
        );
        this.SUBRULE(this.QuestionSeparator);
    });
    
    // MatchingAnswers = Matches _ GlobalFeedback? _
    private MatchingAnswers = this.RULE("MatchingAnswers", () => {
        this.SUBRULE(this.Matches);
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.GlobalFeedback));
        this.SUBRULE(this._);
    });

    // Matches = (Match)+
    private Matches = this.RULE("Matches", () => {
        this.AT_LEAST_ONE(() => this.SUBRULE(this.Match));
    });

    // Match = _ '=' _ MatchRichText? _ '->' _ PlainText _
    private Match = this.RULE("Match", () => {
        this.SUBRULE(this._);
        this.CONSUME(Equals);
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.MatchRichText));
        this.SUBRULE(this._);
        this.CONSUME(Match);
        this.SUBRULE(this._);
        this.SUBRULE(this.PlainText);
        this.SUBRULE(this._);
    });

    // TrueFalseAnswer = TrueOrFalseType _ (_ Feedback? Feedback?) _ GlobalFeedback?
    private TrueFalseAnswer = this.RULE("TrueFalseAnswer", () => {
        this.SUBRULE(this.TrueOrFalseType);
        this.SUBRULE(this._);
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.Feedback));
        this.OPTION(() => this.SUBRULE(this.Feedback));
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.GlobalFeedback));
    });


    // TrueOrFalseType = (TrueType / FalseType)
    private TrueOrFalseType = this.RULE("TrueOrFalseType", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.TrueType)},
            {ALT: () => this.SUBRULE(this.FalseType)}
        ]);
    });

    // TrueType = ('TRUE'i / 'T'i)
    private TrueType = this.RULE("TrueType", () => {
        this.OR([
            {ALT: () => this.CONSUME(T)},
            {ALT: () => this.CONSUME(True)}
        ]);
    });

    // FalseType = ('FALSE'i / 'F'i)
    private FalseType = this.RULE("FalseType", () => {
        this.OR([
            {ALT: () => this.CONSUME(F)},
            {ALT: () => this.CONSUME(False)}
        ]);
    });
    
    // MCAnswers = Choices _ GlobalFeedback? _
    private MCAnswers = this.RULE("MCAnswers", () => {
        this.SUBRULE(this.Choices);
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.GlobalFeedback));
        this.SUBRULE(this._);
    });

    // Choices = (Choice)+
    private Choices = this.RULE("Choices", () => {
        this.AT_LEAST_ONE(() => this.SUBRULE(this.Choice));
    });

    // Choice = _ ([=~] _ Weight? _ RichText) Feedback? _ 
    private Choice = this.RULE("Choice", () => {
        this.SUBRULE(this._);
        this.OR([
            {ALT: () => this.CONSUME(Equals)},
            {ALT: () => this.CONSUME(Tilde)}
        ]);
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.Weight));
        this.SUBRULE(this._);
        this.SUBRULE(this.RichText);
        this.OPTION(() => this.SUBRULE(this.Feedback));
        this.SUBRULE(this._);
    });
    
    // Weight = '%' ([-]? PercentValue) '%'
    private Weight = this.RULE("Weight", () => {
        this.CONSUME(Percentage);
        this.OPTION(() => this.CONSUME(Dash));
        this.SUBRULE(this.PercentValue);
        this.CONSUME(Percentage);
    });

    // PercentValue = '100' / [0-9][0-9]?[.]?[0-9]*
    private PercentValue = this.RULE("PercentValue", () => {
        this.OR([
            {ALT: () => this.CONSUME(Hundred)},
            {ALT: () => {
                this.OPTION(() => this.CONSUME(Integer));
                this.OPTION(() => this.CONSUME(Period));
                this.OPTION(() => this.MANY(() => this.CONSUME(Integer)));
            }}
        ]);
    });

    // Feedback = '#' !'###' _ RichText?
    private Feedback = this.RULE("Feedback", () => {
        this.CONSUME(Hash);
        this.OPTION({
            GATE: () => !this.CONSUME(TripleHash),
            DEF: () => this.SUBRULE(this._)
        });
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.RichText));
    });

    // EssayAnswer = '' _ GlobalFeedback? _
    private EssayAnswer = this.RULE("EssayAnswer", () => {
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.GlobalFeedback));
        this.SUBRULE(this._);
    });

    // SingleCorrectShortAnswer = RichText _ Feedback? _ GlobalFeedback? _
    private SingleCorrectShortAnswer = this.RULE("SingleCorrectShortAnswer", () => {
        this.SUBRULE(this.RichText);
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.Feedback));
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.GlobalFeedback));
        this.SUBRULE(this._);
    });

    // NumericalAnswerType = '#' _ NumericalAnswers _ GlobalFeedback? 
    private NumericalAnswerType = this.RULE("NumericalAnswerType", () => {
        this.CONSUME(Hash);
        this.SUBRULE(this._);
        this.SUBRULE(this.NumericalAnswers);
        this.SUBRULE(this._);
        this.OPTION(() => this.SUBRULE(this.GlobalFeedback));
    });

    // NumericalAnswers = MultipleNumericalChoices / SingleNumericalAnswer
    private NumericalAnswers = this.RULE("Numerical Answers", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.MultipleNumericalChoices)},
            {ALT: () => this.SUBRULE(this.SingleNumericalAnswer)}
        ]);
    });

    // MultipleNumericalChoices = (NumericalChoice)+
    private MultipleNumericalChoices = this.RULE("MultipleNumericalChoices", () => {
        this.AT_LEAST_ONE(() => this.SUBRULE(this.NumericalChoice));
    });

    // NumericalChoice = _ ([=~] Weight? SingleNumericalAnswer?) _ Feedback? _ 
    private NumericalChoice = this.RULE("NumericalChoice", () => {
        this.SUBRULE(this._);
        this.OR([
            {ALT: () => this.CONSUME(Equals)},
            {ALT: () => this.CONSUME(Tilde)}
        ]);
        this.OPTION(() => this.SUBRULE(this.Weight));
        this.OPTION(() => this.SUBRULE(this.SingleNumericalAnswer));
        this.SUBRULE(this._);
        this.OPTION( () => this.SUBRULE(this.Feedback));
        this.SUBRULE(this._);
    });

    // SingleNumericalAnswer = NumberWithRange / NumberHighLow / NumberAlone
    private SingleNumericalAnswer = this.RULE("SingleNumericalAnswer", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.NumberWithRange)},
            {ALT: () => this.SUBRULE(this.NumberHighLow)},
            {ALT: () => this.SUBRULE(this.NumberAlone)}
        ]);
    });

    // NumberWithRange = Number ':' Number 
    private NumberWithRange = this.RULE("NumberWithRange", () => {
        this.SUBRULE(this.Number);
        this.CONSUME(Colon);
        this.SUBRULE(this.Number);
    });

    // NumberHighLow = Number '..' Number 
    private NumberHighLow = this.RULE("NumberHighLow", () => {
        this.SUBRULE(this.Number);
        this.CONSUME(DoublePeriod);
        this.SUBRULE(this.Number);
    });

    // NumberAlone = Number
    private NumberAlone = this.RULE("NumberAlone", () => {
        this.SUBRULE(this.Number);
    });

    // QuestionTitle = '::' TitleText+ '::'
    private QuestionTitle = this.RULE("QuestionTitle", () => {
        this.CONSUME(TitleColon);
        this.AT_LEAST_ONE(() => this.SUBRULE(this.TitleText));
        this.CONSUME(TitleColon);
    });


    // QuestionStem = RichText
    private QuestionStem = this.RULE("QuestionStem", () => {
        this.SUBRULE(this.RichText);
    });


    // QuestionSeparator = EndOfLine BlankLine+ / EndOfLine? EndOfFile
    private QuestionSeparator = this.RULE("QuestionSeparator", () => {
        this.OR([
            {ALT: () => {
                this.SUBRULE(this.EndOfLine);
                this.AT_LEAST_ONE(() => this.SUBRULE(this.BlankLine));
            }},
            {ALT: () => {
                this.OPTION(() => this.SUBRULE(this.EndOfLine));
                this.SUBRULE(this.EndOfFile);
            }}
        ]);
    });

    // BlankLine = Space* EndOfLine
    private BlankLine = this.RULE("BlankLine", () => {
        this.MANY(() => this.CONSUME(WhiteSpace)); //this.OPTION?
        this.SUBRULE(this.EndOfLine);
    });

    // TitleText = !'::' (EscapeSequence / UnescapedChar)
    private TitleText = this.RULE("TitleText", () => {
        this.OPTION({
            GATE: () => !this.CONSUME(TitleColon),
            DEF: () => this.OR([
                {ALT: () => this.SUBRULE(this.EscapeSequence)},
                {ALT: () => this.SUBRULE(this.UnescapedChar)}
            ])
        });
    });


    // TextChar = (UnescapedChar / EscapeSequence / EscapeChar)
    private TextChar = this.RULE("TextChar", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.UnescapedChar)},
            {ALT: () => this.SUBRULE(this.EscapeSequence)},
            {ALT: () => this.SUBRULE(this.EscapeChar)}
        ]);
    });

    // MatchTextChar = (UnescapedMatchChar / EscapeSequence / EscapeChar)
    private MatchTextChar = this.RULE("MatchTextChar", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.UnescapedMatchChar)},
            {ALT: () => this.SUBRULE(this.EscapeSequence)},
            {ALT: () => this.SUBRULE(this.EscapeChar)}
        ]);
    });

    // Format = '[' ('html' / 'markdown' / 'plain' / 'moodle') ']'
    private Format = this.RULE("Format", () => {
        this.CONSUME(LSquare);
        this.OR([
            {ALT: () => this.CONSUME(html)},
            {ALT: () => this.CONSUME(markdown)},
            {ALT: () => this.CONSUME(plain)},
            {ALT: () => this.CONSUME(moodle)}
        ]);
        this.CONSUME(RSquare);
    });
  
    // EscapeChar = '\\' 
    private EscapeChar = this.RULE("EscapeChar", () => {
        this.CONSUME(Escape);
    });

    // EscapeSequence = EscapeChar ( EscapeChar / ":" / "~" / "=" / "#" / "[" / "]" / "{" / "}" )
    private EscapeSequence = this.RULE("EscapeSequence", () => {
        this.SUBRULE(this.EscapeChar);
        this.OR([
            {ALT: () => this.SUBRULE(this.EscapeChar)},
            {ALT: () => this.CONSUME(Colon)},
            {ALT: () => this.CONSUME(Tilde)},
            {ALT: () => this.CONSUME(Equals)},
            {ALT: () => this.CONSUME(Hash)},
            {ALT: () => this.CONSUME(LSquare)},
            {ALT: () => this.CONSUME(RSquare)},
            {ALT: () => this.CONSUME(LCurly)},
            {ALT: () => this.CONSUME(RCurly)}
        ]);
    });

    // UnescapedChar = !(EscapeSequence / ControlChar / QuestionSeparator) .
    private UnescapedChar = this.RULE("UnescapedChar", () => {
        this.MANY({
            GATE: () => !this.OR([
                {ALT: () => this.SUBRULE(this.EscapeSequence)},
                {ALT: () => this.SUBRULE(this.ControlChar)},
                {ALT: () => this.SUBRULE(this.QuestionSeparator)}
            ]),
            DEF: () => this.CONSUME(Any)
        });
    });


    // UnescapedMatchChar = !(EscapeSequence / ControlChar / '->' / QuestionSeparator) .
    private UnescapedMatchChar = this.RULE("UnescapedMatchChar", () => {
        this.MANY({
            GATE: () => !this.OR([
                {ALT: () => this.SUBRULE(this.EscapeSequence)},
                {ALT: () => this.SUBRULE(this.ControlChar)},
                {ALT: () => this.CONSUME(Match)},
                {ALT: () => this.SUBRULE(this.QuestionSeparator)}
            ]),
            DEF: () => this.CONSUME(Any)
        });
    });

    // ControlChar = '=' / '~' / "#" / '{' / '}' / '\\' / ':'
    private ControlChar = this.RULE("ControlChar", () => {
        this.OR([
            {ALT: () => this.CONSUME(Equals)},
            {ALT: () => this.CONSUME(Tilde)},
            {ALT: () => this.CONSUME(Hash)},
            {ALT: () => this.CONSUME(LCurly)},
            {ALT: () => this.CONSUME(RCurly)},
            {ALT: () => this.CONSUME(Comment)},
            {ALT: () => this.CONSUME(Colon)}
        ]);
    });

    // MatchRichText = Format? _ MatchTextChar+
    private MatchRichText = this.RULE("MatchRichText", () => {
        this.OPTION(() => this.SUBRULE(this.Format));
        this.SUBRULE(this._);
        this.AT_LEAST_ONE(() => this.SUBRULE(this.MatchTextChar));
    });


    // RichText = Format? _ TextChar+
    private RichText = this.RULE("RichText", () => {
        this.OPTION(() => this.SUBRULE(this.Format));
        this.SUBRULE(this._);
        this.AT_LEAST_ONE(() => this.SUBRULE(this.TextChar));
    });


    // PlainText = TextChar+
    private PlainText = this.RULE("PlainText", () => {
        this.AT_LEAST_ONE(() => this.SUBRULE(this.TextChar));
    });

    // Number = [0-9]+ NumberFraction?
    private Number = this.RULE("Number", () => {
        this.AT_LEAST_ONE(() => this.CONSUME(Integer));
        this.OPTION(() => this.SUBRULE(this.NumberFraction));
    });

    // NumberFraction = "." !"." [0-9]*
    private NumberFraction = this.RULE("NumberFraction", () => {
        this.CONSUME(Period);
        this.OPTION({
            GATE: () => !this.CONSUME(Period), 
            DEF: () => this.MANY(() => this.CONSUME(Integer))
        });
    });

    // GlobalFeedback = '####' _ RichText _
    private GlobalFeedback = this.RULE("GlobalFeedback", () => {
        this.CONSUME(QuadHash);
        this.SUBRULE(this._);
        this.SUBRULE(this.RichText);
        this.SUBRULE(this._);
    });

    // _ = (Space / EndOfLine !BlankLine)*
    private _ = this.RULE("_", () => {
        this.MANY(() => {
            this.OR([
                {ALT: () => this.SUBRULE(this.Space)},
                {GATE: () => !this.SUBRULE(this.BlankLine), ALT: () => this.SUBRULE(this.EndOfLine)}
            ]);
        });
    });

    // __ = (Comment / EndOfLine / Space )*
    private __ = this.RULE("__", () => {
        this.MANY(() => {
            this.OR([
                {ALT: () => this.SUBRULE(this.Comment)},
                {ALT: () => this.SUBRULE(this.EndOfLine)},
                {ALT: () => this.SUBRULE(this.Space)}
            ]);
        });
    });

    // Comment = '//' (!EndOfLine .)* &(EndOfLine / EndOfFile) // don't consume the EOL in comment, so it can count towards question separator
    private Comment = this.RULE("Comment", () => {
        this.CONSUME(Comment);
        this.MANY({
            GATE: () => !this.SUBRULE(this.EndOfLine), 
            DEF: () => this.CONSUME(Any)
        });
        this.OR([
            {ALT: () => this.SUBRULE(this.EndOfLine)},
            {ALT: () => this.SUBRULE(this.EndOfFile)}
        ]);
    });

    // Space = ' ' / '\t'
    private Space = this.RULE("Space", () => {
        this.CONSUME(WhiteSpace);
    });

    // EndOfLine = '\r\n' / '\n' / '\r'
    private EndOfLine = this.RULE("EndOfLine", () => {
        this.CONSUME(EndOfLine);
    });

    // EndOfFile = !.
    private EndOfFile = this.RULE("EndOfFile", () => {
        this.CONSUME(EOF);
    });
}

const newGiftParser = new GIFTParser();

export default {
    parse: function(text: string) {
        const lexResult = GIFTLexer.tokenize(text);
        newGiftParser.input = lexResult.tokens;
        
        const output = newGiftParser.document();

        return {
            output: output,
            lexErrors: lexResult.errors,
            parseErrors: newGiftParser.errors
        };
    },
    parserInstance: newGiftParser
};