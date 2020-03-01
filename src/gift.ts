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

const True = createToken({name: "True", pattern: /TRUE/});
const False = createToken({name: "False", pattern: /FALSE/});
const T = createToken({name: "T", pattern: /T/});
const F = createToken({name: "F", pattern: /F/});

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

    // // All these helper functions are available inside of actions 
    // {
    //     var defaultFormat = "moodle"; // default format - the GIFT specs say [moodle] is default, but not sure what that means for other applications
    //     var format = defaultFormat;
    //     function processAnswers(question, answers) {
    //     question.globalFeedback = answers.globalFeedback;
    //     switch(question.type) {
    //         case "TF":
    //         question.isTrue = answers.isTrue;
    //         question.incorrectFeedback = answers.feedback[1];
    //         question.correctFeedback = answers.feedback[2];
    //         break;
    //         case "MC":
    //         case "Numerical":
    //         case "Short":
    //         question.choices = answers.choices;
    //         break;
    //         case "Matching":
    //         question.matchPairs = answers.matchPairs;
    //         break;
    //   }
    //   // check for MC that's actually a short answer (all correct answers)
    //   if (question.type == "MC" && areAllCorrect(question.choices)) {
    //     question.type = "Short";
    //   } 
    //   return question;
    // }
    // function areAllCorrect(choices) {
    //   var allAreCorrect = true;
    //   for (var i = 0; i < choices.length; i++) {
    //     allAreCorrect &= choices[i].isCorrect;
    //   }
    //   return allAreCorrect;
    // }
    // function removeNewLinesDuplicateSpaces(text) {
    //   text = text.replace(/[\n\r]/g,' '); // replace newlines with spaces
    //   return text.replace(/\s\s+/g,' '); 
    // }
    // function setLastQuestionTextFormat(fmt) {
    //   format = fmt;
    // }
    // function getLastQuestionTextFormat() {
    //   return format;
    // }
    // function resetLastQuestionTextFormat() {
    //   format = defaultFormat;
    // }
    // }
    
    // GIFTQuestions
    //     = questions:(Category / Description / Question)+ _ __ { return questions; }
    private GIFTQuestions = this.RULE("GIFTQuestions", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.Category) },
            { ALT: () => this.SUBRULE(this.Description) },
            { ALT: () => this.SUBRULE(this.Question) }
        ]);
    });


    // Category "Category"
    //     = __ '$' 'CATEGORY:' _ cat:PlainText QuestionSeparator {return {type:"Category", title:cat}}
    private Category = this.RULE("Category", () => {
        this.SUBRULE(this.__);
        this.CONSUME(Dollar);
        this.CONSUME(Category);
        this.SUBRULE(this._);
        this.SUBRULE(this.PlainText);
        this.SUBRULE(this.QuestionSeparator);
    });


    // Description "Description"
    //     = __
    //     title:QuestionTitle? _
    //     text:QuestionStem QuestionSeparator
    //     { resetLastQuestionTextFormat(); return {type:"Description", title:title, stem:text, hasEmbeddedAnswers:false} }
    private Description = this.RULE("Description", () => {
        this.SUBRULE(this.__);
        this.OPTION({
            DEF: () => this.SUBRULE(this.QuestionTitle)
        });
        this.SUBRULE(this._);
        this.SUBRULE(this.QuestionStem);
        this.SUBRULE(this.QuestionSeparator);
    });


    // Question
    //     = __
    //     title:QuestionTitle? _
    //     stem1:QuestionStem? _ 
    //     '{' _
    //     answers:(MatchingAnswers / TrueFalseAnswer / MCAnswers / NumericalAnswerType / SingleCorrectShortAnswer / EssayAnswer ) _
    //     '}' _
    //     stem2:(Comment / QuestionStem)?
    //     QuestionSeparator
    //     {
        
    //     var embedded = (stem2 !== null);    
    //     var stem1Text = stem1 ? (stem1.text + (embedded ? " " : "")) : "";
    
    //     var format = (stem1 && stem1.format) || (stem2 && stem2.format) || "moodle";
    //     var text = stem1Text + ( embedded ? "_____ " + stem2.text : "");
        
    //     var question = {type:answers.type, title:title, stem: {format: format, text: text}, hasEmbeddedAnswers:embedded};
    //     question = processAnswers(question, answers);
    //     resetLastQuestionTextFormat();
    //     return question;
    //     }
    private Question = this.RULE("Question", () => {
        this.SUBRULE(this.__);
        this.OPTION({
            DEF: () => this.SUBRULE(this.QuestionTitle)
        });
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.QuestionStem)
        });
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
        this.OPTION({
            DEF: () => this.OR([
                {ALT: () => this.SUBRULE(this.Comment)},
                {ALT: () => this.SUBRULE(this.QuestionStem)}
            ])
        });
        this.SUBRULE(this.QuestionSeparator);
    });
    
    // MatchingAnswers "{= match1 -> Match1\n...}"
    //     = matchPairs:Matches _ globalFeedback:GlobalFeedback? _
    //     { return { type: "Matching", matchPairs:matchPairs, globalFeedback:globalFeedback }; }
    private MatchingAnswers = this.RULE("MatchingAnswers", () => {
        this.SUBRULE(this.Matches);
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.GlobalFeedback)
        });
        this.SUBRULE(this._);
    });


    // Matches "matches"
    //     = matchPairs:(Match)+  { return matchPairs }
    private Matches = this.RULE("Matches", () => {
        this.AT_LEAST_ONE({
            DEF: () => this.SUBRULE(this.Match)
        });
    });


    // Match "match"
    //     = _ '=' _ left:MatchRichText? _ '->' _ right:PlainText _ 
    //     { var matchPair = { 
    //         subquestion:{
    //             format:(left !== null ? left.format : getLastQuestionTextFormat()), 
    //             text:(left !== null ? left.text : "")
    //         }, 
    //         subanswer:right}; 
    //         return matchPair } 
    private Match = this.RULE("Match", () => {
        this.SUBRULE(this._);
        this.CONSUME(Equals);
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.MatchRichText)
        });
        this.SUBRULE(this._);
        this.CONSUME(Match);
        this.SUBRULE(this._);
        this.SUBRULE(this.PlainText);
        this.SUBRULE(this._);
    });

    
    // ///////////
    // TrueFalseAnswer "{T} or {F} or {True} or {False}"
    //     = isTrue:TrueOrFalseType _ 
    //     feedback:(_ Feedback? Feedback?) _
    //     globalFeedback:GlobalFeedback?
    //     { return { type:"TF", isTrue: isTrue, feedback:feedback, globalFeedback:globalFeedback}; }
    private TrueFalseAnswer = this.RULE("TrueFalseAnswer", () => {
        this.SUBRULE(this.TrueOrFalseType);
        this.SUBRULE(this._);
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.Feedback)
        });
        this.OPTION({
            DEF: () => this.SUBRULE(this.Feedback)
        });
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.GlobalFeedback)
        });
    });


    // TrueOrFalseType 
    //     = isTrue:(TrueType / FalseType) { return isTrue }
    private TrueOrFalseType = this.RULE("TrueOrFalseType", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.TrueType)},
            {ALT: () => this.SUBRULE(this.FalseType)}
        ]);
    });

    // TrueType
    //     = ('TRUE'i / 'T'i) {return true} // appending i after a literal makes it case insensitive
    private TrueType = this.RULE("TrueType", () => {
        this.OR([
            {ALT: () => this.CONSUME(T)},
            {ALT: () => this.CONSUME(True)}
        ]);
    });

    // FalseType
    //     = ('FALSE'i / 'F'i) {return false}
    private FalseType = this.RULE("FalseType", () => {
        this.OR([
            {ALT: () => this.CONSUME(F)},
            {ALT: () => this.CONSUME(False)}
        ]);
    });
    
    // ////////////////////
    // MCAnswers "{=correct choice ~incorrect choice ... }"
    //     = choices:Choices _ 
    //     globalFeedback:GlobalFeedback? _
    //     { return { type: "MC", choices:choices, globalFeedback:globalFeedback}; }
    private MCAnswers = this.RULE("MCAnswers", () => {
        this.SUBRULE(this.Choices);
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.GlobalFeedback)
        });
        this.SUBRULE(this._);
    });

    // Choices "Choices"
    //     = choices:(Choice)+ { return choices; }
    private Choices = this.RULE("Choices", () => {
        this.AT_LEAST_ONE(() => this.SUBRULE(this.Choice));
    });

    // Choice "Choice"
    //     = _ choice:([=~] _ Weight? _ RichText) feedback:Feedback? _ 
    //     { var wt = choice[2];
    //         var txt = choice[4];
    //         var choice = { isCorrect: (choice[0] == '='), 
    //                     weight:wt, 
    //                     text: txt,
    //                     feedback:feedback };
    //         return choice } 
    private Choice = this.RULE("Choice", () => {
        this.SUBRULE(this._);
        this.OR([
            {ALT: () => this.CONSUME(Equals)},
            {ALT: () => this.CONSUME(Tilde)}
        ]);
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.Weight)
        });
        this.SUBRULE(this._);
        this.SUBRULE(this.RichText);
        this.OPTION({
            DEF: () => this.SUBRULE(this.Feedback)
        });
        this.SUBRULE(this._);
    });
    
    // Weight "(weight)"
    //     = '%' percent:([-]? PercentValue) '%' { return parseFloat(percent.join('')) }
    private Weight = this.RULE("Weight", () => {
        this.CONSUME(Percentage);
        this.OPTION({
            DEF: () => this.CONSUME(Dash)
        });
        this.SUBRULE(this.PercentValue);
        this.CONSUME(Percentage);
    });

    // PercentValue "(percent)"
    //     = '100' / [0-9][0-9]?[.]?[0-9]*  { return text() }
    private PercentValue = this.RULE("PercentValue", () => {
        this.OR([
            {ALT: () => this.CONSUME(Hundred)},
            {ALT: () => {
                this.OPTION({
                    DEF: () => this.CONSUME(Integer)
                });
                this.OPTION({
                    DEF: () => this.CONSUME(Period)
                });
                this.OPTION({
                    DEF: () => this.MANY(() => this.CONSUME(Integer))
                });
            }}
        ]);
    });

    // Feedback "(feedback)" 
    //     = '#' !'###' _ feedback:RichText? { return feedback }
    private Feedback = this.RULE("Feedback", () => {
        this.CONSUME(Hash);
        this.OPTION({
            GATE: () => !this.CONSUME(TripleHash),
            DEF: () => this.SUBRULE(this._)
        });
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.RichText)
        });
    });

    // ////////////////////
    // EssayAnswer "Essay question { ... }"
    //     = '' _
    //     globalFeedback:GlobalFeedback? _ 
    //     { return { type: "Essay", globalFeedback:globalFeedback}; }
    private EssayAnswer = this.RULE("EssayAnswer", () => {
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.GlobalFeedback)
        });
        this.SUBRULE(this._);
    });

    // ///////////////////
    // SingleCorrectShortAnswer "Single short answer { ... }"
    //     = answer:RichText _ 
    //     feedback:Feedback? _ 
    //     globalFeedback:GlobalFeedback? _
    //     { var choices = [];
    //     choices.push({isCorrect:true, text:answer, feedback:feedback, weight:null});
    //     return { type: "Short", choices:choices, globalFeedback:globalFeedback}; }
    private SingleCorrectShortAnswer = this.RULE("SingleCorrectShortAnswer", () => {
        this.SUBRULE(this.RichText);
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.Feedback)
        });
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.GlobalFeedback)
        });
        this.SUBRULE(this._);
    });

    // ///////////////////
    // NumericalAnswerType "{#... }" // Number ':' Range / Number '..' Number / Number
    //     = '#' _
    //     numericalAnswers:NumericalAnswers _ 
    //     globalFeedback:GlobalFeedback? 
    //     { return { type:"Numerical", 
    //             choices:numericalAnswers, 
    //             globalFeedback:globalFeedback}; }
    private NumericalAnswerType = this.RULE("NumericalAnswerType", () => {
        this.CONSUME(Hash);
        this.SUBRULE(this._);
        this.SUBRULE(this.NumericalAnswers);
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.GlobalFeedback)
        });
    });

    // NumericalAnswers "Numerical Answers"
    //     = MultipleNumericalChoices / SingleNumericalAnswer
    private NumericalAnswers = this.RULE("Numerical Answers", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.MultipleNumericalChoices)},
            {ALT: () => this.SUBRULE(this.SingleNumericalAnswer)}
        ]);
    });

    // MultipleNumericalChoices "Multiple Numerical Choices"
    //     = choices:(NumericalChoice)+ { return choices; }
    private MultipleNumericalChoices = this.RULE("MultipleNumericalChoices", () => {
        this.AT_LEAST_ONE({
            DEF: () => this.SUBRULE(this.NumericalChoice)
        });
    });

    // NumericalChoice "Numerical Choice"
    // = _ choice:([=~] Weight? SingleNumericalAnswer?) _ feedback:Feedback? _ 
    //     { var symbol = choice[0];
    //     var wt = choice[1];
    //     var txt = choice[2];
    //     var choice = { isCorrect:(symbol == '='), 
    //                     weight:wt, 
    //                     text: (txt !== null ? txt : {format:getLastQuestionTextFormat(), text:'*'}), // Moodle unit tests show this, not in documentation
    //                     feedback: feedback }; 
    //     return choice }
    private NumericalChoice = this.RULE("NumericalChoice", () => {
        this.SUBRULE(this._);
        this.OR([
            {ALT: () => this.CONSUME(Equals)},
            {ALT: () => this.CONSUME(Tilde)}
        ]);
        this.OPTION({
            DEF: () => this.SUBRULE(this.Weight)
        });
        this.OPTION({
            DEF: () => this.SUBRULE(this.SingleNumericalAnswer)
        });
        this.SUBRULE(this._);
        this.OPTION({
            DEF: () => this.SUBRULE(this.Feedback)
        });
    });

    // SingleNumericalAnswer "Single numeric answer"
    //  = NumberWithRange / NumberHighLow / NumberAlone
    private SingleNumericalAnswer = this.RULE("SingleNumericalAnswer", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.NumberWithRange)},
            {ALT: () => this.SUBRULE(this.NumberHighLow)},
            {ALT: () => this.SUBRULE(this.NumberAlone)}
        ]);
    });

    // NumberWithRange "(number with range)"
    //  = number:Number ':' range:Number 
    // { var numericAnswer = {type: 'range', number: number, range:range}; return numericAnswer}
    private NumberWithRange = this.RULE("NumberWithRange", () => {
        this.SUBRULE(this.Number);
        this.CONSUME(Colon);
        this.SUBRULE(this.Number);
    });

    // NumberHighLow "(number with high-low)"
    // = numberLow:Number '..' numberHigh:Number 
    // { var numericAnswer = {type: 'high-low', numberHigh: numberHigh, numberLow:numberLow}; return numericAnswer}
    private NumberHighLow = this.RULE("NumberHighLow", () => {
        this.SUBRULE(this.Number);
        this.CONSUME(DoublePeriod);
        this.SUBRULE(this.Number);
    });

    // NumberAlone "(number answer)"
    // = number:Number
    // { var numericAnswer = {type: 'simple', number: number}; return numericAnswer}  
    private NumberAlone = this.RULE("NumberAlone", () => {
        this.SUBRULE(this.Number);
    });

    // QuestionTitle ":: Title ::"
    // = '::' title:TitleText+ '::' { return title.join('') }
    private QuestionTitle = this.RULE("QuestionTitle", () => {
        this.CONSUME(TitleColon);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.TitleText);
        });
        this.CONSUME(TitleColon);
    });


    // QuestionStem "Question stem"
    // = stem:RichText 
    // { setLastQuestionTextFormat(stem.format); // save format for question, for default of other non-formatted text
    //   return stem }
    private QuestionStem = this.RULE("QuestionStem", () => {
        this.SUBRULE(this.RichText);
    });


    // QuestionSeparator "(blank line separator)"
    // = EndOfLine BlankLine+ 
    // / EndOfLine? EndOfFile
    private QuestionSeparator = this.RULE("QuestionSeparator", () => {
        this.OR([
            {ALT: () => {
                this.SUBRULE(this.EndOfLine);
                this.AT_LEAST_ONE(() => this.SUBRULE(this.BlankLine));
            }},
            {ALT: () => {
                this.MANY(() => this.SUBRULE(this.EndOfLine));
                this.SUBRULE(this.EndOfFile);
            }}
        ]);
    });

    // BlankLine "blank line"
    // = Space* EndOfLine
    private BlankLine = this.RULE("BlankLine", () => {
        this.OPTION(() => {
            this.MANY(() => this.CONSUME(WhiteSpace));
        });
        this.SUBRULE(this.EndOfLine);
    });

    // TitleText "(Title text)"
    // = !'::' t:(EscapeSequence / UnescapedChar) {return t}
    private TitleText = this.RULE("TitleText", () => {
        this.OPTION({
            GATE: () => !this.CONSUME(TitleColon),
            DEF: () => this.OR([
                {ALT: () => this.SUBRULE(this.EscapeSequence)},
                {ALT: () => this.SUBRULE(this.UnescapedChar)}
            ])
        });
    });


    // TextChar "(text character)"
    // = (UnescapedChar / EscapeSequence / EscapeChar)
    private TextChar = this.RULE("TextChar", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.UnescapedChar)},
            {ALT: () => this.SUBRULE(this.EscapeSequence)},
            {ALT: () => this.SUBRULE(this.EscapeChar)}
        ]);
    });

    // MatchTextChar "(text character)"
    // = (UnescapedMatchChar / EscapeSequence / EscapeChar)
    private MatchTextChar = this.RULE("MatchTextChar", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.UnescapedMatchChar)},
            {ALT: () => this.SUBRULE(this.EscapeSequence)},
            {ALT: () => this.SUBRULE(this.EscapeChar)}
        ]);
    });

    // Format "format"
    // = '[' format:('html' /
    //               'markdown' /
    //               'plain' / 
    //               'moodle') 
    //   ']' {return format}
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
  

    // EscapeChar "(escape character)"
    //  = '\\' 
    private EscapeChar = this.RULE("EscapeChar", () => {
        this.CONSUME(Escape);
    });

    // EscapeSequence "escape sequence" 
    //  = EscapeChar 
    // sequence:( 
    //   EscapeChar 
    //   / ":" 
    //   / "~" 
    //   / "="
    //   / "#"
    //   / "["
    //   / "]"
    //   / "{"
    //   / "}" )
    // { return sequence }
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

    // UnescapedChar ""
    // = !(EscapeSequence / ControlChar / QuestionSeparator) . {return text()}
    private UnescapedChar = this.RULE("UnescapedChar", () => {
        this.OPTION(() => { 
            this.MANY({
                GATE: () => !this.OR([
                    {ALT: () => this.SUBRULE(this.EscapeSequence)},
                    {ALT: () => this.SUBRULE(this.ControlChar)},
                    {ALT: () => this.CONSUME(this.QuestionSeparator)}
                ]),
                DEF: () => this.CONSUME(Any)
            });
        });
    });


    // UnescapedMatchChar ""
    //   = !(EscapeSequence / ControlChar / '->' / QuestionSeparator) . {return text()}
    private UnescapedMatchChar = this.RULE("UnescapedMatchChar", () => {
        this.OPTION(() => { 
            this.MANY({
                GATE: () => !this.OR([
                    {ALT: () => this.SUBRULE(this.EscapeSequence)},
                    {ALT: () => this.SUBRULE(this.ControlChar)},
                    {ALT: () => this.CONSUME(Match)},
                    {ALT: () => this.CONSUME(this.QuestionSeparator)}
                ]),
                DEF: () => this.CONSUME(Any)
            });
        });
    });

    // ControlChar 
    //   = '=' / '~' / "#" / '{' / '}' / '\\' / ':'
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

    // MatchRichText "(formatted text excluding '->'"
    // = format:Format? _ txt:MatchTextChar+ { return {
    //     format:(format!==null ? format : getLastQuestionTextFormat()), 
    //     text:((format !== "html") 
    //         ? removeNewLinesDuplicateSpaces(txt.join('').trim())
    //         : txt.join('').replace(/\r\n/g,'\n'))}}  // avoid failing tests because of Windows line breaks 
    private MatchRichText = this.RULE("MatchRichText", () => {
        this.OPTION(() => this.SUBRULE(this.Format));
        this.SUBRULE(this._);
        this.AT_LEAST_ONE(() => this.SUBRULE(this.MatchTextChar));
    });


    // RichText "(formatted text)"
    // = format:Format? _ txt:TextChar+ { return {
    //     format:(format!==null ? format : getLastQuestionTextFormat()), 
    //     text:((format !== "html") 
    //         ? removeNewLinesDuplicateSpaces(txt.join('').trim())
    //         : txt.join('').replace(/\r\n/g,'\n'))}}  // avoid failing tests because of Windows line breaks 
    private RichText = this.RULE("RichText", () => {
        this.OPTION(() => this.SUBRULE(this.Format));
        this.SUBRULE(this._);
        this.AT_LEAST_ONE(() => this.SUBRULE(this.TextChar));
    });


    // PlainText "(unformatted text)"
    // = txt:TextChar+ { return removeNewLinesDuplicateSpaces(txt.join('').trim())} 
    private PlainText = this.RULE("PlainText", () => {
        this.AT_LEAST_ONE(() => this.SUBRULE(this.TextChar));
    });

    // Number
    // = chars:[0-9]+ frac:NumberFraction?
    //     { return parseFloat(chars.join('') + frac); }
    private Number = this.RULE("Number", () => {
        this.AT_LEAST_ONE(() => this.CONSUME(Integer));
        this.OPTION(() => this.SUBRULE(this.NumberFraction));
    });

    // NumberFraction
    // = "." !"." chars:[0-9]*
    //     { return "." + chars.join(''); }
    private NumberFraction = this.RULE("NumberFraction", () => {
        this.CONSUME(Period);
        this.OPTION({
            GATE: () => !this.CONSUME(Period), 
            DEF: () => this.MANY(() => {
                this.CONSUME(Integer);
            })
        });
    });

    // GlobalFeedback
    // = '####' _ rt:RichText _ {return rt;}
    private GlobalFeedback = this.RULE("GlobalFeedback", () => {
        this.CONSUME(QuadHash);
        this.SUBRULE(this._);
        this.SUBRULE(this.RichText);
        this.SUBRULE(this._);
    });

    // TEST!!!
    // _ "(single line whitespace)"
    // = (Space / EndOfLine !BlankLine)*
    private _ = this.RULE("_", () => {
        this.OPTION(() => {
            this.MANY(() => {
                this.OR([
                    {ALT: () => this.SUBRULE(this.Space)},
                    {GATE: () => !this.SUBRULE(this.BlankLine), ALT: () => this.SUBRULE(this.EndOfLine)}
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
                        GATE: () => !this.SUBRULE(this.EndOfLine), ALT: () => this.CONSUME(Any)
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