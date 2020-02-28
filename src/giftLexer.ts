import { createToken, Lexer } from "chevrotain";

const WhiteSpace = createToken({
    name: "WhiteSpace", pattern: /\s+/,
    group: Lexer.SKIPPED
});

const NewLine = createToken({
    name: "NewLine",
    pattern: /\r?\n/
  });

const True = createToken({name: "True", pattern: /true/});
const False = createToken({name: "False", pattern: /false/});

const LCurly = createToken({name: "LCurly", pattern: /{/});
const RCurly = createToken({name: "RCurly", pattern: /}/});
const DoubleColon = createToken({name: "DoubleColon", pattern: /::/});
const Colon = createToken({name: "Colon", pattern: /:/});
const Hash = createToken({name: "Hash", pattern: /#/});
const Percentage = createToken({name: "Percentage", pattern: /%/});
const Tilde = createToken({name: "Tilde", pattern: /~/});
const Equals = createToken({name: "Equals", pattern: /=/});

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });

let allTokens = [
    WhiteSpace,
    NewLine,
    // "keywords" appear before the Identifier
    True,
    False,
    LCurly,
    RCurly,
    DoubleColon,
    Colon,
    Hash,
    Tilde,
    Equals,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier,
    Integer
];

export default new Lexer(allTokens);