var Parse = require("../out").default;
var parser = require("../out").parser;
var { performance } = require("perf_hooks");

const text = `
// true/false
::Q1:: 1+1=2 {T}

// multiple choice with specified feedback for right and wrong answers
::Q2:: What's between orange and green in the spectrum? 
{ =yellow # right; good! ~red # wrong, it's yellow ~blue # wrong, it's yellow }

// fill-in-the-blank
::Q3:: Two plus {=two =2} equals four.

// matching
::Q4:: Which animal eats which food? { =cat -> cat food =dog -> dog food }

// math range question
::Q5:: What is a number from 1 to 5? {#3:2}

// math range specified with interval end points
::Q6:: What is a number from 1 to 5? {#1..5}
// translated on import to the same as Q5, but unavailable from Moodle question interface

// multiple numeric answers with partial credit and feedback
::Q7:: When was Ulysses S. Grant born? {#
         =1822:0      # Correct! Full credit.
         =%50%1822:2  # He was born in 1822. Half credit for being close.
}

// essay
::Q8:: How are you? {}
`;

const text1 = `// true/false
::Q1:: 1+1=2 {T}

// multiple choice with specified feedback for right and wrong answers
::Q2:: What's between orange and green in the spectrum? 
{ =yellow # right; good! ~red # wrong, it's yellow ~blue # wrong, it's yellow }

// fill-in-the-blank
::Q3:: Two plus {=two =2} equals four.

// matching
::Q4:: Which animal eats which food? { =cat -> cat food =dog -> dog food }

// math range question
::Q5:: What is a number from 1 to 5? {#3:2}

// math range specified with interval end points
::Q6:: What is a number from 1 to 5? {#1..5}
// translated on import to the same as Q5, but unavailable from Moodle question interface

// multiple numeric answers with partial credit and feedback
::Q7:: When was Ulysses S. Grant born? {#
         =1822:0      # Correct! Full credit.
         =%50%1822:2  # He was born in 1822. Half credit for being close.
}

// essay
::Q8:: How are you? {}`;

function ClassParser(text, text1) {
  const GIFTParser = new Parse();

  GIFTParser.update(text).result();
  const parseUpdate1 = performance.now();
  GIFTParser.update(text1).result();
  const parseUpdate2 = performance.now();
  console.log("Class Update:", parseUpdate2 - parseUpdate1);

  GIFTParser.update("").result();

  const parseOnce1 = performance.now();
  GIFTParser.update(text).result();
  const parseOnce2 = performance.now();
  console.log("Class Parse Once:", parseOnce2 - parseOnce1);

  GIFTParser.update("").result();

  const parseFifty1 = performance.now();
  for (var i = 0; i < 50; i++) {
    GIFTParser.update(text).result();
  }
  const parseFifty2 = performance.now();
  console.log("Class Parse Fifty:", parseFifty2 - parseFifty1);

  GIFTParser.update("").result();

  const parseHundred1 = performance.now();
  for (var i = 0; i < 100; i++) {
    GIFTParser.update(text).result();
  }
  const parseHundred2 = performance.now();
  console.log("Class Parse Hundred:", parseHundred2 - parseHundred1);
}

function functionParser(text, text1) {
  parser.parse(text);
  const parseUpdate1 = performance.now();
  parser.parse(text1);
  const parseUpdate2 = performance.now();
  console.log("Function Update:", parseUpdate2 - parseUpdate1);

  const parseOnce1 = performance.now();
  parser.parse(text);
  const parseOnce2 = performance.now();
  console.log("Function Parse Once:", parseOnce2 - parseOnce1);

  const parseFifty1 = performance.now();
  for (var i = 0; i < 50; i++) {
    parser.parse(text);
  }
  const parseFifty2 = performance.now();
  console.log("Function Parse Fifty:", parseFifty2 - parseFifty1);

  const parseHundred1 = performance.now();
  for (var i = 0; i < 100; i++) {
    parser.parse(text);
  }
  const parseHundred2 = performance.now();
  console.log("Function Parse Hundred:", parseHundred2 - parseHundred1);
}

ClassParser(text, text1);
functionParser(text, text1);
