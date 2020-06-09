var parse = require("../out/parser").default;
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

const parseOnce1 = performance.now();
parse(text);
const parseOnce2 = performance.now();
console.log("Parse Once:", parseOnce2 - parseOnce1);

const parseFifty1 = performance.now();
for (var i = 0; i < 50; i++) {
  parse(text);
}
const parseFifty2 = performance.now();
console.log("Parse Fifty:", parseFifty2 - parseFifty1);

const parseHundred1 = performance.now();
for (var i = 0; i < 100; i++) {
  parse(text);
}
const parseHundred2 = performance.now();
console.log("Parse Hundred:", parseHundred2 - parseHundred1);
