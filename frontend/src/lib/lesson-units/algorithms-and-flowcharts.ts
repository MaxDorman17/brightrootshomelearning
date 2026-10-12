import type { LessonUnit } from "@/lib/lessons";

/**
 * Algorithms and flowcharts, for ages 11 to 14 (KS3 computing). Computational thinking; flowchart symbols; pseudocode
 * with sequence, selection and iteration; trace tables; linear and binary search; bubble sort and merge sort acted out
 * with a pack of playing cards; and comparing how efficient algorithms are. Almost entirely unplugged: paper, pens and cards.
 * Pseudocode follows the style of the OCR Exam Reference Language, which is close to Python.
 */
export const algorithmsAndFlowcharts: LessonUnit = {
  slug: "algorithms-and-flowcharts",
  title: "Algorithms and flowcharts",
  short: "Flowcharts",
  subject: "Computing",
  ages: "11 to 14",
  emoji: "🔀",
  color: "#4F5D75",
  summary: "Six mostly unplugged lessons on thinking like a computer scientist: decomposition, abstraction and pattern recognition, flowchart symbols, pseudocode with sequence, selection and iteration, linear and binary search, and bubble sort and merge sort acted out with a pack of playing cards.",
  cover: "/lessons/units/algorithms-and-flowcharts.jpg",
  lessons: [
    {
      slug: "algorithms-and-flowcharts-1",
      title: "Thinking like a computer scientist",
      emoji: "🧠",
      minutes: 60,
      goal: "I can explain decomposition, abstraction, pattern recognition and algorithmic thinking, and use them to tackle a real problem.",
      starter: [
        { type: "choice", q: "What is an algorithm?", options: ["A type of computer chip", "A precise set of step-by-step instructions to solve a problem or complete a task", "Any program written in Scratch"], answer: 1 },
        { type: "choice", q: "What do we call an error in an algorithm or program?", options: ["A loop", "A sprite", "A bug"], answer: 2 },
        { type: "choice", q: "Why does the order of instructions matter in an algorithm?", options: ["Doing the right steps in the wrong order can give the wrong result", "It doesn't matter as long as every step is there", "Computers always sort the steps into the best order themselves"], answer: 0 },
        { type: "type", q: "In Scratch and other languages, what do we call a block that repeats some instructions? (It begins with L.)", answer: ["loop", "a loop", "loops", "Loop"] },
        { type: "pick", q: "Which of these are algorithms? There is more than one.", options: ["A recipe for flapjacks", "A photo of a beach", "Directions from school to the station", "The rules for long multiplication"], answers: [0, 2, 3] },
        { type: "choice", q: "What does 'debugging' mean?", options: ["Cleaning the keyboard", "Finding and fixing errors", "Making a program run faster by deleting it"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What computational thinking is",
            text: [
              "Computational thinking is a way of approaching problems so that they can be solved, either by a computer or by a person working methodically. It is not the same as programming. Programming is writing instructions in a language a computer understands; computational thinking is the planning that comes first, working out exactly what those instructions should be.",
              "The idea was popularised by the computer scientist Jeannette Wing in 2006, who argued that it was a basic skill for everyone, like reading and arithmetic. Engineers, scientists, doctors and logistics planners all use it, often without a computer in sight.",
              "It is usually described as four connected techniques: decomposition, pattern recognition, abstraction and algorithmic thinking. You rarely use them one at a time. On a real problem you move between them, breaking the problem up, spotting what the parts have in common, ignoring what doesn't matter and finally writing a precise solution.",
              "The word 'algorithm' itself comes from the name of Muhammad ibn Musa al-Khwarizmi, a Persian mathematician who worked at the House of Wisdom in Baghdad in the 800s. His books explained step-by-step methods for calculation, and when they were translated into Latin, his name became 'Algoritmi'.",
            ],
          },
          {
            heading: "Decomposition and pattern recognition",
            text: [
              "Decomposition means breaking a large, complex problem into smaller sub-problems that are easier to understand and solve. 'Make a video game' is overwhelming. 'Draw the player', 'make the player move', 'detect when the player touches an enemy' and 'keep score' are each manageable, and different people can work on them at the same time.",
              "Each sub-problem can be broken down again until every piece is small enough to solve directly. This produces a tree of tasks, with the big problem at the top and simple, concrete jobs at the bottom.",
              "Pattern recognition means spotting similarities, either between parts of the same problem or between this problem and one you have solved before. If you notice that every enemy in your game moves in the same way, you only need to solve 'make an enemy move' once and reuse that solution.",
              "Finding a pattern often leads to generalisation: writing one solution that works for many cases. A method for working out the area of any rectangle is more useful than a separate method for every rectangle you meet.",
            ],
          },
          {
            heading: "Abstraction and algorithms",
            text: [
              "Abstraction means removing unnecessary detail so you can focus on what matters for the problem in hand. A famous example is Harry Beck's map of the London Underground, first published in 1933. It ignores real distances and the twists of the tunnels and shows only stations, lines and where you can change. For a passenger, that is all that matters.",
              "Choosing what to leave out depends on the purpose. A sat nav needs road lengths and speed limits but not the colour of the houses. A model of the weather keeps temperature, pressure and wind but ignores individual raindrops. Every computer program is an abstraction of some part of the real world.",
              "Algorithmic thinking is the final step: designing a clear, ordered set of instructions that solves the problem. A good algorithm is precise (each step has only one meaning), finite (it eventually stops) and correct (it gives the right result for every valid input, not just the example you tried).",
              "Algorithms are often planned before any code is written, using flowcharts or pseudocode. That is what the next two lessons are about.",
            ],
          },
        ],
        words: [
          { word: "computational thinking", meaning: "a set of problem-solving techniques used to plan a solution that a computer or person could carry out" },
          { word: "decomposition", meaning: "breaking a complex problem down into smaller, more manageable sub-problems" },
          { word: "pattern recognition", meaning: "spotting similarities within a problem or between problems so solutions can be reused" },
          { word: "abstraction", meaning: "removing unnecessary detail to focus on the information that matters for the problem" },
          { word: "algorithm", meaning: "a precise, finite sequence of steps that solves a problem or completes a task" },
          { word: "generalisation", meaning: "adapting a solution so it works for a whole group of similar problems" },
        ],
      },
      practice: {
        intro: "Match each idea to how it is used.",
        questions: [
          {
            type: "match",
            q: "Match each technique to an example of it.",
            pairs: [
              ["Decomposition", "Splitting 'plan a party' into food, music, invitations and budget"],
              ["Pattern recognition", "Noticing that every level of a game has the same scoring rules"],
              ["Abstraction", "A Tube map that shows stations but not real distances"],
              ["Algorithmic thinking", "Writing numbered steps a friend could follow exactly"],
            ],
          },
          { type: "choice", q: "A sat nav app stores road lengths and speed limits but not the colour of the buildings. Which technique does this show?", options: ["Decomposition", "Abstraction", "Debugging"], answer: 1, why: "The designers removed detail that does not help with planning a route." },
          { type: "pick", q: "Which are features of a good algorithm? There is more than one.", options: ["Each step has only one meaning", "It eventually stops", "It works for the example you tried, even if it fails for others", "It gives the correct result for every valid input"], answers: [0, 1, 3] },
          { type: "choice", q: "Which best explains why decomposition is useful for a team building a large program?", options: ["It makes the program shorter", "It removes all bugs automatically", "Smaller sub-problems are easier to solve and can be shared out between people"], answer: 2 },
          { type: "gap", q: "Fill in the gaps.", text: "Removing unnecessary detail is called ___. Breaking a problem into smaller parts is called ___.", bank: ["abstraction", "decomposition", "iteration", "selection"], answers: ["abstraction", "decomposition"] },
        ],
      },
      task: {
        title: "Decompose and abstract a real problem",
        intro: "Use all four techniques on a problem from your own life, then draw an abstract map.",
        need: ["Plain paper and a pencil", "Coloured pens", "A ruler"],
        steps: [
          "Choose a problem: planning a family day out, organising a week of packed lunches, or designing a simple quiz app.",
          "Draw a decomposition tree. Write the problem in a box at the top, split it into three or four sub-problems, then split each of those again until every box at the bottom is a single job someone could just do.",
          "Circle in one colour any boxes that are really the same kind of job (pattern recognition). Write one sentence on how you could solve them once and reuse the solution.",
          "Draw a map of the route from your home to somewhere you go often, first as a realistic sketch, then as an abstract map in the style of a Tube map with only the key stops and turns. Underneath, list five details you deliberately left out and why.",
          "Choose one box from the bottom of your tree and write it as a numbered algorithm of at least six precise steps. Ask someone to follow it exactly and note any step they found unclear.",
        ],
      },
      exit: [
        { type: "choice", q: "What is decomposition?", options: ["Removing unnecessary detail", "Breaking a problem into smaller sub-problems", "Repeating a set of instructions"], answer: 1 },
        { type: "choice", q: "What is abstraction?", options: ["Removing unnecessary detail to focus on what matters", "Writing code in Python", "Spotting similarities between problems"], answer: 0 },
        { type: "choice", q: "Harry Beck's Tube map shows stations and connections but not real distances. This is an example of...", options: ["decomposition", "pattern recognition", "abstraction"], answer: 2 },
        { type: "pick", q: "Which are the four techniques of computational thinking? There is more than one.", options: ["Decomposition", "Pattern recognition", "Abstraction", "Algorithmic thinking", "Compression"], answers: [0, 1, 2, 3] },
        { type: "type", q: "The word 'algorithm' comes from the name of which Persian mathematician? (al-...)", answer: ["al-Khwarizmi", "al Khwarizmi", "alkhwarizmi", "Khwarizmi", "al-khwarizmi", "Al-Khwarizmi"] },
        { type: "choice", q: "Why is pattern recognition useful?", options: ["It means a solution to one part can be reused for similar parts", "It makes a program use more memory", "It means you never need to test"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper, pencil, coloured pens and a ruler"],
        tips: [
          "This unit is almost entirely unplugged. Learners do not need a computer to understand algorithms, and working on paper makes the thinking visible.",
          "The four techniques overlap. Do not worry if your learner labels an example 'abstraction' when it could also be 'decomposition'; ask them to justify their choice.",
          "The follow-my-algorithm step works best if the person following is deliberately literal. Doing exactly what is written, rather than what was meant, shows quickly where the instructions are vague.",
        ],
        younger: "Keep the decomposition tree to two levels, and choose a familiar problem such as getting ready for school.",
        older: "Read about Jeannette Wing's 2006 essay 'Computational Thinking' and write a paragraph on whether you agree that it is a skill everyone needs, with examples from jobs outside computing.",
      },
    },
    {
      slug: "algorithms-and-flowcharts-2",
      title: "Flowcharts",
      emoji: "🔷",
      minutes: 60,
      goal: "I can use the standard flowchart symbols correctly and draw a flowchart that includes a decision and a loop.",
      starter: [
        { type: "choice", q: "What is abstraction?", options: ["Removing unnecessary detail", "Breaking a problem into parts", "Writing instructions in order"], answer: 0 },
        { type: "choice", q: "Splitting 'build a website' into 'design pages', 'write text' and 'add pictures' is an example of...", options: ["pattern recognition", "decomposition", "abstraction"], answer: 1 },
        { type: "pick", q: "Which are features of a good algorithm? There is more than one.", options: ["Precise", "Finite", "Vague, so people can choose", "Correct for every valid input"], answers: [0, 1, 3] },
        { type: "type", q: "Which technique means spotting similarities so a solution can be reused? (pattern ...)", answer: ["recognition", "pattern recognition", "Pattern recognition"] },
        { type: "choice", q: "Why did the Tube map leave out real distances?", options: ["Nobody had measured them", "Passengers only need stations and connections, so the extra detail gets in the way", "It was printed too small"], answer: 1 },
        { type: "choice", q: "What is generalisation?", options: ["Making one solution that works for many similar problems", "Deleting every comment from a program", "Drawing a map to scale"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Why draw an algorithm?",
            text: [
              "A flowchart is a diagram that shows the steps of an algorithm and the order in which they happen. Each type of step has its own shape, and arrows called flow lines join the shapes to show which step comes next.",
              "Flowcharts are useful because they are visual and independent of any programming language. A programmer, a manager and a customer can all look at the same flowchart and agree on what a system should do before anyone writes code. They also make it easy to spot paths that lead nowhere or loops that never end.",
              "Flowcharts have been used in engineering and business since the 1920s, and computer programmers adopted them in the 1940s and 1950s. The shapes have since been standardised, so a flowchart drawn in one country can be read in another.",
              "A flowchart should be read from the top, following the arrows. By convention the main flow runs downwards, and every flowchart has exactly one start and at least one end.",
            ],
          },
          {
            heading: "The symbols",
            text: [
              "Terminator: a rounded rectangle (sometimes drawn as an oval) marks the start and the end of the algorithm. It contains just 'Start' or 'Stop'.",
              "Process: a rectangle holds an instruction or calculation, such as 'add 1 to score' or 'total = price × quantity'. Input and output: a parallelogram (a slanted rectangle) is used whenever data comes in, such as 'input guess', or goes out, such as 'output \"Well done\"'.",
              "Decision: a diamond holds a question with a yes or no (true or false) answer, such as 'Is guess = number?'. A decision always has exactly two flow lines leaving it, one labelled Yes and one labelled No. This is how a flowchart shows a choice between two paths.",
              "Subroutine: a rectangle with an extra vertical line down each side stands for a separate, named algorithm that is described elsewhere, such as 'calculate VAT'. Flow lines are arrows that show the direction of flow. Lines should not cross if you can avoid it, and every shape except a Stop must have an arrow leaving it.",
            ],
          },
          {
            heading: "Branches and loops",
            text: [
              "A flowchart with no decisions is pure sequence: every step happens once, in order, from Start to Stop. Most useful algorithms need more than that.",
              "When a decision leads to two different paths that later rejoin and carry on down the page, the flowchart is showing selection. For example: 'Is it raining?' Yes leads to 'take umbrella'; No skips it; both paths then continue to 'leave the house'.",
              "When a flow line from a decision goes back up to an earlier step, the flowchart is showing iteration, a loop. In a guessing game, after 'input guess' comes the decision 'Is guess = number?'. No leads to 'output \"Try again\"' and back up to 'input guess'; Yes leads to 'output \"Correct\"' and Stop.",
              "Every loop needs a way out. If no path from inside the loop can ever reach the exit condition, the algorithm runs forever, which is called an infinite loop. Checking each loop has a reachable exit is one of the first things to do when reviewing a flowchart.",
            ],
          },
        ],
        words: [
          { word: "flowchart", meaning: "a diagram showing the steps of an algorithm with standard symbols joined by arrows" },
          { word: "terminator", meaning: "the rounded symbol that marks the start or end of a flowchart" },
          { word: "process", meaning: "the rectangle symbol for an instruction or calculation" },
          { word: "decision", meaning: "the diamond symbol for a yes or no question, with exactly two exits" },
          { word: "input/output", meaning: "the parallelogram symbol for data going into or out of the algorithm" },
          { word: "infinite loop", meaning: "a loop that never ends because its exit condition can never be met" },
        ],
      },
      practice: {
        intro: "Check you know your shapes.",
        questions: [
          {
            type: "match",
            q: "Match each flowchart symbol to what it is used for.",
            pairs: [
              ["Rounded rectangle", "Start or Stop"],
              ["Rectangle", "An instruction or calculation"],
              ["Diamond", "A yes or no question"],
              ["Parallelogram", "Data going in or out"],
              ["Rectangle with double sides", "A subroutine described elsewhere"],
            ],
          },
          { type: "choice", q: "Which symbol should hold the step 'input password'?", options: ["Rectangle", "Diamond", "Parallelogram"], answer: 2 },
          { type: "choice", q: "How many flow lines leave a decision symbol?", options: ["Exactly two, labelled Yes and No", "One", "As many as you like"], answer: 0 },
          { type: "choice", q: "In a flowchart, a 'No' arrow from 'Is count = 10?' goes back up to 'add 1 to count'. What does this show?", options: ["Sequence", "Iteration (a loop)", "An input"], answer: 1, why: "An arrow that returns to an earlier step makes the steps repeat." },
          {
            type: "order",
            q: "Put these flowchart steps for a simple guessing game in the right order from top to bottom.",
            items: ["Start", "Process: set number = 7", "Input: guess", "Decision: is guess = number?", "Output: \"Correct!\"", "Stop"],
          },
        ],
      },
      task: {
        title: "Paper flowchart kit",
        intro: "Make your own set of flowchart symbols, build a flowchart on the table, then test it by tracing paths through it.",
        need: ["Card or paper and scissors", "Pens in a few colours", "A large sheet of paper or a clear table", "Optional: a free browser-based diagram tool such as diagrams.net, with a grown-up's permission"],
        steps: [
          "Cut out at least 12 shapes: 2 rounded rectangles, 4 rectangles, 3 parallelograms and 3 diamonds. Use a different colour for each type.",
          "Design a flowchart for a password check: the user has up to three attempts to type the correct password. If they get it right, output 'Welcome'. After three wrong attempts, output 'Locked'. You will need a counter that starts at 0 and goes up by 1 after each wrong attempt.",
          "Lay out your shapes on the table, write on them in pencil, then draw the arrows on the big sheet. Label every exit from a diamond with Yes or No.",
          "Test it with three cases: correct first time; wrong, wrong, right; and wrong three times. Put a coin on the Start shape and move it along the arrows for each case. Does each case end where it should?",
          "Check: does every loop have a reachable exit? Is there exactly one Start? Copy the finished flowchart neatly onto paper, or recreate it in a free browser-based diagram tool.",
        ],
      },
      exit: [
        { type: "choice", q: "Which symbol is used for a decision?", options: ["Rectangle", "Diamond", "Parallelogram"], answer: 1 },
        { type: "choice", q: "Which symbol is used for 'output total'?", options: ["Parallelogram", "Rounded rectangle", "Diamond"], answer: 0 },
        { type: "choice", q: "What does the rounded rectangle (terminator) show?", options: ["A calculation", "A question", "The start or end of the algorithm"], answer: 2 },
        { type: "type", q: "What do we call a loop that can never end?", answer: ["infinite loop", "an infinite loop", "infinite", "Infinite loop", "endless loop"] },
        { type: "choice", q: "An arrow from a decision goes back up to an earlier step. Which programming construct does this show?", options: ["Sequence", "Selection", "Iteration"], answer: 2 },
        { type: "choice", q: "Why are flowcharts useful before writing code?", options: ["They run faster than programs", "They show the logic visually in a way anyone can check, whatever language is used later", "They can only be read by computers"], answer: 1 },
      ],
      grownUp: {
        need: ["Card, scissors and coloured pens", "A large sheet of paper", "Optional: a computer with a free browser-based diagram tool, with permission"],
        tips: [
          "The password task is harder than it looks. The tricky part is deciding where the counter is increased and where it is checked. If your learner gets stuck, ask them to trace the 'wrong three times' case with a coin.",
          "There is often more than one correct flowchart for the same problem. Judge it by whether every test case reaches the right end, not by whether it matches a model answer.",
          "Some books draw terminators as ovals and some as rounded rectangles. Both are accepted.",
        ],
        younger: "Start with a flowchart that has one decision and no loop, such as 'Is it raining? Take an umbrella', before trying the password check.",
        older: "Add a subroutine to your flowchart, drawn with the double-sided symbol, and draw a second, separate flowchart showing what happens inside it.",
      },
    },
    {
      slug: "algorithms-and-flowcharts-3",
      title: "Pseudocode: sequence, selection and iteration",
      emoji: "📝",
      minutes: 60,
      goal: "I can read and write pseudocode using sequence, selection and iteration, and trace an algorithm with a trace table.",
      starter: [
        { type: "choice", q: "Which flowchart symbol holds a yes or no question?", options: ["Diamond", "Rectangle", "Parallelogram"], answer: 0 },
        { type: "choice", q: "Which flowchart symbol is used for input and output?", options: ["Rectangle", "Rounded rectangle", "Parallelogram"], answer: 2 },
        { type: "type", q: "What do we call a loop that never ends?", answer: ["infinite loop", "an infinite loop", "infinite", "endless loop"] },
        { type: "choice", q: "How many arrows leave a decision symbol?", options: ["One", "Two", "Three"], answer: 1 },
        { type: "choice", q: "A flow line that goes back up to an earlier step shows...", options: ["a loop", "the end of the program", "an error"], answer: 0 },
        { type: "match", q: "Match each symbol to its use.", pairs: [["Rounded rectangle", "Start or Stop"], ["Rectangle", "Process"], ["Diamond", "Decision"]] },
      ],
      learn: {
        cards: [
          {
            heading: "What pseudocode is",
            text: [
              "Pseudocode is a way of writing an algorithm in structured, code-like English. It looks like a program but is not written in any real programming language, so it cannot be run. Its job is to describe the logic clearly so that a programmer can then turn it into Python, Java or any other language.",
              "Unlike a flowchart, pseudocode is quick to write and easy to change, and it maps closely onto real code. Unlike ordinary English, it is precise and uses a small set of keywords such as if, else, for and while.",
              "There is no single official pseudocode. Exam boards publish their own versions; this unit uses a style close to OCR's Exam Reference Language, which looks a lot like Python. A variable is a named store for a value that can change. The line 'score = 0' assigns the value 0 to the variable score, and 'score = score + 1' takes the current value, adds 1 and stores the result back in score.",
              "Two other keywords appear often: 'input()' gets data from the user and 'print()' outputs it. A double equals sign, '==', is used to compare two values, so 'if guess == 7' asks whether guess is equal to 7, while a single '=' sets a value.",
            ],
          },
          {
            heading: "Sequence and selection",
            text: [
              "Every algorithm is built from three basic constructs: sequence, selection and iteration. Any algorithm, however complex, can be written using only these three.",
              "Sequence means instructions run one after another, in the order they are written. In 'price = 4', 'quantity = 3', 'total = price * quantity', 'print(total)', each line runs once, top to bottom, and the output is 12. Swap the last two lines and the program breaks, because total has not been worked out yet.",
              "Selection means the algorithm chooses which instructions to run depending on a condition, an expression that is either true or false. In pseudocode it looks like this: 'if temp > 25 then print(\"Hot\") elseif temp > 15 then print(\"Warm\") else print(\"Cold\") endif'. The conditions are checked in order and only the first true branch runs.",
              "Careful reading matters. With that code, a temperature of 25 prints 'Warm', not 'Hot', because 25 is not greater than 25. A temperature of 15 prints 'Cold'. The comparison operators are > (greater than), < (less than), >= (greater than or equal to), <= (less than or equal to), == (equal to) and != (not equal to).",
            ],
          },
          {
            heading: "Iteration and trace tables",
            text: [
              "Iteration means repeating a set of instructions. A count-controlled loop repeats a fixed number of times and is written with for: 'total = 0', 'for i = 1 to 4', 'total = total + i', 'next i', 'print(total)'. The variable i takes the values 1, 2, 3 and 4 in turn, so total becomes 1, 3, 6 and finally 10.",
              "A condition-controlled loop repeats until something changes, so you do not need to know in advance how many times it will run. A while loop checks its condition before each repeat: 'number = 1', 'while number < 50', 'number = number * 3', 'endwhile', 'print(number)'. Number goes 1, 3, 9, 27, 81; when it reaches 81 the condition is false, the loop ends and 81 is printed.",
              "A do ... until loop checks its condition at the end, so it always runs at least once. That makes it suitable for something like 'keep asking for a password until it is correct'.",
              "To check an algorithm by hand you use a trace table: a table with a column for each variable (and for any output) and a new row each time a value changes. Working through the code line by line and filling in the table is called a dry run. It is the most reliable way to find out exactly what an algorithm does, and it is a standard GCSE skill.",
            ],
          },
        ],
        words: [
          { word: "pseudocode", meaning: "structured, code-like English used to describe an algorithm; it cannot be run" },
          { word: "variable", meaning: "a named storage location holding a value that can change while the algorithm runs" },
          { word: "selection", meaning: "choosing which instructions to run depending on whether a condition is true or false" },
          { word: "iteration", meaning: "repeating a set of instructions, either a set number of times or until a condition is met" },
          { word: "condition", meaning: "an expression that is either true or false, such as score > 10" },
          { word: "trace table", meaning: "a table used to record the values of variables step by step during a dry run" },
        ],
      },
      practice: {
        intro: "Read the pseudocode carefully, line by line.",
        questions: [
          {
            type: "match",
            q: "Match each construct to an example.",
            pairs: [
              ["Sequence", "Three lines that each run once, in order"],
              ["Selection", "if score >= 50 then print(\"Pass\") else print(\"Retry\") endif"],
              ["Count-controlled iteration", "for i = 1 to 10"],
              ["Condition-controlled iteration", "while lives > 0"],
            ],
          },
          { type: "choice", q: "temp = 25. The code is: if temp > 25 then print(\"Hot\") elseif temp > 15 then print(\"Warm\") else print(\"Cold\") endif. What is printed?", options: ["Hot", "Cold", "Warm"], answer: 2, why: "25 is not greater than 25, so the first condition is false. 25 is greater than 15, so 'Warm' is printed." },
          { type: "type", q: "total = 0, then for i = 1 to 4: total = total + i, next i, then print(total). What is printed?", answer: ["10"] },
          { type: "choice", q: "Which loop is best when you don't know in advance how many times it will need to repeat?", options: ["A condition-controlled loop such as while", "A count-controlled for loop", "No loop: copy the lines out many times"], answer: 0 },
          { type: "gap", q: "Fill in the gaps.", text: "In pseudocode, a single ___ sets a value, while a double ___ compares two values.", bank: ["=", "==", ">", "!="], answers: ["=", "=="] },
        ],
      },
      task: {
        title: "Dry run and design",
        intro: "Trace two algorithms with trace tables, then write and test your own pseudocode.",
        need: ["Squared or lined paper", "A pencil and ruler", "Optional: a free browser-based Python editor, with a grown-up's permission"],
        steps: [
          "Draw a trace table with columns number and output. Dry run this algorithm and fill a new row each time a value changes: number = 1, while number < 50, number = number * 3, endwhile, print(number). How many times did the loop body run?",
          "Draw a trace table with columns i and total. Dry run: total = 0, for i = 2 to 10 step 2, total = total + i, next i, print(total). (step 2 means i goes up by 2 each time.) What is printed?",
          "Write your own pseudocode for a times-table tester: it picks a times table, asks five questions using a for loop, uses if to check each answer, adds 1 to a score variable when the answer is right, and prints the score at the end.",
          "Dry run your pseudocode with a trace table, imagining an answer for each question, including at least one wrong one. Fix any bugs you find.",
          "Optional: with permission, type your algorithm into a free browser-based Python editor and run it. Note anything you had to change, because real code is stricter than pseudocode.",
        ],
      },
      exit: [
        { type: "choice", q: "What is pseudocode?", options: ["A programming language that runs in a browser", "Structured, code-like English used to describe an algorithm", "A type of flowchart symbol"], answer: 1 },
        { type: "choice", q: "Which construct is shown by 'if lives == 0 then print(\"Game over\") endif'?", options: ["Selection", "Sequence", "Iteration"], answer: 0 },
        { type: "type", q: "number = 1, while number < 50: number = number * 3, endwhile, print(number). What is printed?", answer: ["81"] },
        { type: "choice", q: "What is the difference between a while loop and a do ... until loop?", options: ["There is no difference", "A while loop always runs at least once", "A do ... until loop checks at the end, so it always runs at least once"], answer: 2 },
        { type: "choice", q: "What is a trace table used for?", options: ["Recording the values of variables step by step during a dry run", "Drawing flowchart symbols neatly", "Storing a program on a computer"], answer: 0 },
        { type: "choice", q: "score = 15. The code is: if score >= 15 then print(\"Gold\") else print(\"Silver\") endif. What is printed?", options: ["Silver", "Gold", "Nothing"], answer: 1 },
      ],
      grownUp: {
        need: ["Squared or lined paper, pencil and ruler", "Optional: a computer with a free browser-based Python editor, with permission"],
        tips: [
          "Answers to the dry runs: the while loop prints 81 after running 4 times; the step 2 loop adds 2 + 4 + 6 + 8 + 10 and prints 30.",
          "Pseudocode has no single 'right' syntax. Accept any version that is clear, consistent and unambiguous, but encourage the keywords from the lesson, since they match GCSE exam style.",
          "A common confusion is between = (assign) and == (compare). It is worth saying it aloud: 'score becomes 0' versus 'is score equal to 0?'.",
        ],
        younger: "Trace only the for loop, using a table with just two columns, and talk through each row aloud together.",
        older: "Extend your times-table tester with a while loop so the user can keep playing until they type 'no', and add a nested if to give different messages for 5 out of 5, 3 or 4, and below 3.",
      },
    },
    {
      slug: "algorithms-and-flowcharts-4",
      title: "Searching: linear and binary search",
      emoji: "🔍",
      minutes: 60,
      goal: "I can carry out a linear search and a binary search, explain when each can be used, and compare how efficient they are.",
      starter: [
        { type: "choice", q: "What is pseudocode?", options: ["Code that has a bug", "Structured, code-like English that describes an algorithm", "A diagram with shapes and arrows"], answer: 1 },
        { type: "match", q: "Match each construct to its meaning.", pairs: [["Sequence", "Steps run in order"], ["Selection", "Choosing a path using a condition"], ["Iteration", "Repeating steps"]] },
        { type: "type", q: "total = 0, then for i = 1 to 3: total = total + i, next i, then print(total). What is printed?", answer: ["6"] },
        { type: "choice", q: "Which kind of loop always runs at least once?", options: ["for", "while", "do ... until"], answer: 2 },
        { type: "choice", q: "What does '==' mean in pseudocode?", options: ["Is equal to (a comparison)", "Set the value of a variable", "Not equal to"], answer: 0 },
        { type: "choice", q: "What is a trace table for?", options: ["Drawing flowcharts", "Tracking variable values during a dry run", "Measuring how long a program takes"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Linear search",
            text: [
              "Searching means finding whether an item is in a list and, if so, where. It is one of the most common jobs a computer does: finding a contact in your phone, a product in an online shop or a word in a document.",
              "The simplest method is a linear search. You start at the first item and check each item in turn. If it matches the target, you stop and report where it is. If you reach the end of the list without a match, the item is not there.",
              "In pseudocode: 'found = false', 'i = 0', 'while i < length and found == false', 'if list[i] == target then found = true else i = i + 1 endif', 'endwhile'. Here list[i] means the item at position i. Computer scientists usually number positions from 0, so a list of 10 items has positions 0 to 9.",
              "The big advantage of linear search is that it works on any list, sorted or not, and it is very easy to write. The disadvantage is speed. In the worst case, when the item is last or missing, you check every single item: 10 checks for 10 items, a million checks for a million items.",
            ],
          },
          {
            heading: "Binary search",
            text: [
              "A binary search is much faster, but it only works if the list is already sorted into order. It repeatedly halves the part of the list that could contain the target, like looking up a word in a paper dictionary by opening it near the middle.",
              "The steps are: look at the middle item. If it is the target, stop. If the target is smaller, throw away the middle item and everything after it. If the target is larger, throw away the middle item and everything before it. Repeat with the half that is left until you find the target or there is nothing left to search.",
              "Try it on the sorted list 2, 5, 8, 12, 16, 23, 38, 56, 72, 91, looking for 23. Positions run from 0 to 9, so the middle is position (0 + 9) DIV 2 = 4, which holds 16. 23 is larger, so search positions 5 to 9. The middle is (5 + 9) DIV 2 = 7, which holds 56. 23 is smaller, so search positions 5 to 6. The middle is (5 + 6) DIV 2 = 5, which holds 23. Found, in 3 comparisons; a linear search would have needed 6.",
              "DIV means whole-number division, which throws away any remainder: 11 DIV 2 = 5. When the list has an even number of items there are two middle candidates, and this rule picks the lower one.",
            ],
          },
          {
            heading: "Which is better?",
            text: [
              "Each comparison in a binary search halves the number of items left. That means the number of comparisons grows very slowly as the list gets longer. A list of 1,000 items needs at most 10 comparisons, because halving 1,000 ten times gets you down to 1. A list of a million items needs at most 20.",
              "Compare that with linear search, where the worst case is 1,000 comparisons for 1,000 items and 1,000,000 for a million. For large, sorted lists, binary search is dramatically faster.",
              "But binary search is not always the right choice. The list must be sorted, and sorting takes time. If you only need to search an unsorted list once, a linear search may be quicker overall. For a very short list the difference hardly matters, and linear search is simpler to write and less likely to contain bugs.",
              "This is a theme you will meet throughout computer science: there is rarely one best algorithm. Programmers choose by thinking about the size of the data, whether it is sorted, how often it will be searched and how much time and memory they have.",
            ],
          },
        ],
        words: [
          { word: "linear search", meaning: "a search that checks each item in a list in turn, from the start, until the target is found or the list ends" },
          { word: "binary search", meaning: "a search on a sorted list that repeatedly checks the middle item and discards half of the remaining items" },
          { word: "sorted", meaning: "arranged in order, such as smallest to largest or A to Z" },
          { word: "worst case", meaning: "the input that makes an algorithm do the most work, such as the target being last or missing" },
          { word: "efficiency", meaning: "how much time (number of steps) and memory an algorithm needs to solve a problem" },
          { word: "DIV", meaning: "whole-number division that discards the remainder, e.g. 9 DIV 2 = 4" },
        ],
      },
      practice: {
        intro: "Work these out on paper if it helps.",
        questions: [
          { type: "choice", q: "Which search can be used on an unsorted list?", options: ["Binary search only", "Linear search only", "Both"], answer: 1, why: "Binary search depends on the list being in order so it can discard half of it." },
          {
            type: "order",
            q: "Put the steps of one round of a binary search in order.",
            items: ["Find the middle item of the remaining list", "Compare the middle item with the target", "If it matches, stop: the item is found", "Otherwise, discard the half that cannot contain the target", "Repeat with the half that is left"],
          },
          { type: "type", q: "Sorted list: 2, 5, 8, 12, 16, 23, 38, 56, 72, 91. Using a linear search for 38, how many items are checked?", answer: ["7", "seven"] },
          { type: "choice", q: "What is the greatest number of comparisons a binary search needs for a sorted list of 1,000 items?", options: ["10", "500", "1,000"], answer: 0 },
          { type: "pick", q: "Which are good reasons to choose linear search? There is more than one.", options: ["The list is unsorted and will only be searched once", "The list has millions of sorted items and is searched constantly", "The list is very short", "You want the simplest code"], answers: [0, 2, 3] },
        ],
      },
      task: {
        title: "Card search race",
        intro: "Use playing cards to act out both searches, count comparisons and record your results in a table.",
        need: ["A pack of playing cards (one suit of 13 cards works well, plus a second suit)", "Paper and a pencil", "A helper, if possible"],
        steps: [
          "Take the 13 cards of one suit (Ace = 1 up to King = 13), shuffle them and lay them face down in a row. Your helper names a target card. Do a linear search: turn over one card at a time from the left, counting comparisons, until you find it. Repeat for five different targets and record the counts.",
          "Now put the cards in order, Ace to King, and lay them face down. Do a binary search: turn over the middle card (position 6, counting from 0), decide which half to keep, and push the other half away. Count comparisons. Repeat for the same five targets.",
          "Draw a results table with columns: target, linear comparisons, binary comparisons. Work out the average for each method.",
          "Try to find the worst case for each method with 13 cards. For a linear search it is easy; for binary search, test a few targets. (Hint: it should never be more than 4.)",
          "Write a short conclusion of about 100 words: which method was faster, by how much, what binary search needed that linear search did not, and what you predict would happen with all 52 cards in order.",
        ],
      },
      exit: [
        { type: "choice", q: "How does a linear search work?", options: ["It checks the middle item and discards half", "It checks each item in turn from the start", "It sorts the list first"], answer: 1 },
        { type: "choice", q: "What must be true of a list before a binary search can be used?", options: ["It must be sorted", "It must contain only numbers", "It must have an even number of items"], answer: 0 },
        { type: "type", q: "In a binary search of positions 0 to 9, which position is checked first? (Use (first + last) DIV 2.)", answer: ["4", "four", "position 4"] },
        { type: "choice", q: "Searching a sorted list of 1,000,000 items, roughly how many comparisons does binary search need at most?", options: ["1,000,000", "500,000", "20"], answer: 2 },
        { type: "choice", q: "Which best explains why binary search is faster on large lists?", options: ["It checks two items at a time", "Each comparison halves the number of items left to search", "It starts at the end of the list"], answer: 1 },
        { type: "choice", q: "You need to check once whether a name appears in an unsorted list of 30 names. Which search is the sensible choice?", options: ["Linear search", "Binary search", "Neither will work"], answer: 0 },
      ],
      grownUp: {
        need: ["A pack of playing cards", "Paper and pencil"],
        tips: [
          "Acting out the searches with real cards is far more memorable than reading about them. Be the 'helper' who names targets if you can.",
          "With 13 sorted cards, a binary search never needs more than 4 comparisons, because 13 halves to 6, then 3, then 1. A linear search can need 13.",
          "The worked example's positions start at 0, as in most programming languages. If your learner counts from 1, the middle positions shift by one, which is fine as long as they are consistent.",
        ],
        younger: "Use just 7 cards for both searches, and talk through each 'keep this half' decision aloud.",
        older: "Write pseudocode for a binary search using variables first, last and mid and a while loop, then dry run it with a trace table to search for 72 in the ten-item list from the lesson.",
      },
    },
    {
      slug: "algorithms-and-flowcharts-5",
      title: "Sorting with cards: bubble sort",
      emoji: "🃏",
      minutes: 60,
      goal: "I can carry out a bubble sort pass by pass, describe the state of a list after each pass, and explain its strengths and weaknesses.",
      starter: [
        { type: "choice", q: "Which search can only be used on a sorted list?", options: ["Linear search", "Binary search", "Both"], answer: 1 },
        { type: "choice", q: "In a linear search, what is the worst case?", options: ["The target is first", "The target is in the middle", "The target is last or missing"], answer: 2 },
        { type: "type", q: "What is 11 DIV 2?", answer: ["5", "five"] },
        { type: "choice", q: "Binary search finds the middle item, compares it with the target, then...", options: ["discards the half that cannot contain the target", "starts again from the beginning", "swaps the middle item with the first"], answer: 0 },
        { type: "choice", q: "About how many comparisons does binary search need at most for 1,000 sorted items?", options: ["1,000", "10", "100"], answer: 1 },
        { type: "pick", q: "When might a linear search be the better choice? There is more than one.", options: ["The list is unsorted", "The list is very short", "The list has a billion sorted items searched every second"], answers: [0, 1] },
      ],
      learn: {
        cards: [
          {
            heading: "Why sort?",
            text: [
              "Sorting means putting items into order: numbers from smallest to largest (ascending) or largest to smallest (descending), or words alphabetically. Sorted data is easier for people to read, and it makes other algorithms possible, as you saw with binary search.",
              "Computers sort constantly: emails by date, search results by relevance, a music library by artist, a leaderboard by score. Because sorting is so common, computer scientists have invented dozens of sorting algorithms and studied carefully which ones are fastest for which kinds of data.",
              "All the sorting algorithms you will meet at KS3 and GCSE work by comparing items and moving them. The question is how many comparisons and moves each one needs. In this lesson and the next, you will act two of them out with playing cards, because doing it by hand makes the difference between them very clear.",
            ],
          },
          {
            heading: "How bubble sort works",
            text: [
              "Bubble sort works through the list comparing each pair of neighbouring items. If a pair is in the wrong order, the two items are swapped. Going through the whole list once like this is called a pass.",
              "Try it with the cards 7, 3, 9, 2, 5. First pass: compare 7 and 3, wrong order, swap: 3, 7, 9, 2, 5. Compare 7 and 9, fine. Compare 9 and 2, swap: 3, 7, 2, 9, 5. Compare 9 and 5, swap: 3, 7, 2, 5, 9. That pass made 4 comparisons and 3 swaps.",
              "Notice that the largest card, 9, has 'bubbled' all the way to the end. That always happens: after the first pass the largest item is in its final place, after the second pass the two largest are, and so on. That is where the algorithm gets its name.",
              "Second pass: 3, 7, 2, 5, 9 becomes 3, 2, 5, 7, 9. Third pass: 3 and 2 swap, giving 2, 3, 5, 7, 9. Fourth pass: no swaps at all. When a whole pass makes no swaps, the list must be sorted, so the algorithm can stop. A list of n items needs at most n - 1 passes.",
            ],
          },
          {
            heading: "Strengths and weaknesses",
            text: [
              "Bubble sort is simple to understand and to code. It sorts the list 'in place', moving items within the list itself, so it needs hardly any extra memory. On a list that is already sorted, or nearly sorted, a version that stops after a pass with no swaps is quick: it needs just one pass to confirm the order.",
              "A simple improvement: because the end of the list is already sorted after each pass, each new pass can stop one comparison earlier. The first pass on 5 items makes 4 comparisons, the next 3, then 2, then 1.",
              "Even so, its weakness is speed on large or jumbled lists. In the worst case, a list in reverse order, every comparison causes a swap and every pass is needed. With the improvement, n items need n × (n - 1) ÷ 2 comparisons: 10 for 5 items, 45 for 10 items, but 499,500 for 1,000 items. Without it, there are even more.",
              "That rapid growth is the problem. Doubling the length of the list roughly quadruples the work. For a few dozen items nobody will notice; for millions of records, bubble sort would be painfully slow, which is why real software rarely uses it.",
                          ],
          },
        ],
        words: [
          { word: "bubble sort", meaning: "a sorting algorithm that repeatedly compares neighbouring items and swaps them if they are in the wrong order" },
          { word: "pass", meaning: "one complete run through the list, comparing each neighbouring pair" },
          { word: "swap", meaning: "exchanging the positions of two items" },
          { word: "ascending", meaning: "in order from smallest to largest, or A to Z" },
          { word: "in place", meaning: "sorting within the original list, without needing a second list" },
        ],
      },
      practice: {
        intro: "Use cards or jot the lists down as you go.",
        questions: [
          { type: "choice", q: "After the first pass of a bubble sort into ascending order, what is always true?", options: ["The smallest item is first", "The list is sorted", "The largest item is in its final place at the end"], answer: 2 },
          { type: "choice", q: "What is the list 6, 4, 8, 1 after one pass of bubble sort into ascending order?", options: ["4, 6, 1, 8", "1, 4, 6, 8", "4, 1, 6, 8"], answer: 0, why: "6 and 4 swap (4, 6, 8, 1); 6 and 8 stay; 8 and 1 swap (4, 6, 1, 8)." },
          { type: "type", q: "How many comparisons are made in the first pass of a bubble sort on 8 items?", answer: ["7", "seven"] },
          { type: "choice", q: "How does a bubble sort know it can stop early?", options: ["When the first item is the smallest", "When a whole pass makes no swaps", "After exactly two passes"], answer: 1 },
          { type: "pick", q: "Which are strengths of bubble sort? There is more than one.", options: ["It is easy to understand and code", "It needs very little extra memory", "It is the fastest algorithm for millions of items", "It is quick on a list that is already nearly sorted"], answers: [0, 1, 3] },
        ],
      },
      task: {
        title: "Bubble sort with playing cards",
        intro: "Act out bubble sort with real cards, counting every comparison and swap, and investigate how the work grows.",
        need: ["A pack of playing cards", "Paper and a pencil", "A stopwatch or phone timer (optional)"],
        steps: [
          "Deal 6 cards from one suit face up in a row (Ace = 1, Jack = 11, Queen = 12, King = 13). Write the starting order down.",
          "Bubble sort them into ascending order. Use two fingers to point at the pair you are comparing; swap them if needed. After each pass, write down the order of the cards and the number of comparisons and swaps in that pass. Stop after a pass with no swaps.",
          "Repeat with 6 cards in reverse order (largest first) and with 6 cards already in order. Which needed the most comparisons? Which needed the fewest?",
          "Now try 10 cards in reverse order and count the total comparisons. If each pass stops one comparison earlier than the last, the formula n × (n - 1) ÷ 2 should match your count. Then use it to predict the worst case for all 13 cards of a suit, and for all 52 cards.",
          "Write a paragraph explaining, with your numbers as evidence, why bubble sort is fine for small lists but a poor choice for very large ones.",
        ],
      },
      exit: [
        { type: "choice", q: "What does bubble sort compare?", options: ["The first and last items", "Each pair of neighbouring items", "Every item with the middle item"], answer: 1 },
        { type: "choice", q: "What is the list 5, 1, 4, 2 after one pass of bubble sort into ascending order?", options: ["1, 2, 4, 5", "1, 4, 2, 5", "1, 5, 2, 4"], answer: 1 },
        { type: "type", q: "What do we call one complete run through the list in a bubble sort?", answer: ["pass", "a pass", "Pass"] },
        { type: "choice", q: "What is the largest number of passes a bubble sort needs for 6 items?", options: ["6", "36", "5"], answer: 2 },
        { type: "choice", q: "Which best explains why bubble sort is slow on large lists?", options: ["The number of comparisons grows roughly with the square of the list length", "It can only sort numbers", "It needs a second copy of the list"], answer: 0 },
        { type: "choice", q: "What does 'ascending order' mean?", options: ["Largest to smallest", "Smallest to largest", "Random order"], answer: 1 },
      ],
      grownUp: {
        need: ["A pack of playing cards", "Paper and pencil", "Optional: a timer"],
        tips: [
          "Expected worst-case comparison counts using n × (n - 1) ÷ 2: 15 for 6 cards, 45 for 10, 78 for 13 and 1,326 for 52. These assume each pass stops one comparison earlier; the basic version, where every pass checks the whole list, does (n - 1) × (n - 1) comparisons in the worst case, for example 25 for 6 cards.",
          "If your learner checks the whole list on every pass, their counts will be higher than the formula. That is a good discussion point about why the improvement matters.",
          "Watching someone sort by hand, it is common to 'cheat' by spotting where a card should go. Gently insist on comparing only neighbouring pairs; the point is to follow the algorithm exactly as a computer would.",
        ],
        younger: "Sort just 4 cards, and say each comparison aloud: 'Is 7 bigger than 3? Yes, swap.'",
        older: "Write bubble sort in pseudocode using a nested loop and a swapped flag, then dry run it on 4, 3, 2, 1 with a trace table.",
      },
    },
    {
      slug: "algorithms-and-flowcharts-6",
      title: "Merge sort and choosing an algorithm",
      emoji: "🧩",
      minutes: 60,
      goal: "I can carry out a merge sort, explain 'divide and conquer', and compare bubble sort and merge sort to choose the right algorithm for a task.",
      starter: [
        { type: "choice", q: "What does bubble sort do with a neighbouring pair in the wrong order?", options: ["Deletes them", "Swaps them", "Moves them to the end"], answer: 1 },
        { type: "choice", q: "After the first pass of a bubble sort into ascending order, where is the largest item?", options: ["At the end", "At the start", "In the middle"], answer: 0 },
        { type: "type", q: "How many comparisons are made in the first pass of a bubble sort on 5 items?", answer: ["4", "four"] },
        { type: "choice", q: "When can a bubble sort stop early?", options: ["When it reaches the middle", "After one pass", "After a pass with no swaps"], answer: 2 },
        { type: "choice", q: "What is 3, 1, 2 after one pass of bubble sort into ascending order?", options: ["1, 3, 2", "1, 2, 3", "3, 2, 1"], answer: 1 },
        { type: "pick", q: "Which are true of bubble sort? There is more than one.", options: ["It sorts in place", "It is simple to code", "It is very fast on huge jumbled lists"], answers: [0, 1] },
      ],
      learn: {
        cards: [
          {
            heading: "Divide and conquer",
            text: [
              "Merge sort uses a strategy called divide and conquer: split a big problem into smaller versions of the same problem, solve those, then combine the answers. It is decomposition turned into an algorithm. It was described by the mathematician John von Neumann in 1945, in the early days of electronic computers.",
              "The key insight is that a list of one item is already sorted, and that it is easy to merge two lists that are each already sorted. So merge sort splits the list in half, then splits each half, and keeps going until every item is on its own. Then it merges the single items into sorted pairs, the pairs into sorted fours, and so on, until the whole list is back together, in order.",
              "Merging two sorted lists works like this. Look at the first item of each list and take whichever is smaller, putting it into a new list. Repeat, always comparing the front items of what is left. When one list is empty, put the rest of the other list on the end; it is already in order.",
            ],
          },
          {
            heading: "Merge sort with cards",
            text: [
              "Take the cards 6, 3, 8, 1, 7, 2, 5, 4. Split them in half: 6, 3, 8, 1 and 7, 2, 5, 4. Split again: 6, 3 / 8, 1 / 7, 2 / 5, 4. Split again into eight single cards. With 8 cards that takes three rounds of splitting, because 8 halves to 4, then 2, then 1.",
              "Now merge pairs: 6 and 3 make 3, 6; 8 and 1 make 1, 8; 7 and 2 make 2, 7; 5 and 4 make 4, 5.",
              "Merge those pairs into fours. Merging 3, 6 with 1, 8: compare 3 and 1, take 1; compare 3 and 8, take 3; compare 6 and 8, take 6; one list is empty, so add 8. That gives 1, 3, 6, 8. In the same way, 2, 7 and 4, 5 make 2, 4, 5, 7.",
              "Finally merge the two fours: compare the front cards each time and take the smaller. 1, then 2, then 3, then 4, then 5, then 6, then 7, then 8. The list is sorted after three rounds of merging. If you lay the cards out in rows on a table as you go, the splitting and merging form a neat diamond shape.",
            ],
          },
          {
            heading: "Comparing and choosing",
            text: [
              "Merge sort is much faster than bubble sort on large lists. Each round of merging touches every item once, and the number of rounds only grows with the number of times you can halve the list. For 1,000 items there are 10 rounds, so merge sort needs fewer than 10,000 comparisons, compared with up to 499,500 for bubble sort.",
              "Its speed is also reliable: merge sort takes about the same number of steps whatever the starting order, while bubble sort's time varies hugely from best case to worst case. That predictability matters for systems that must respond quickly.",
              "Merge sort has costs too. It needs extra memory to hold the new lists while merging, whereas bubble sort sorts in place. It is also harder to code, because it is usually written recursively, meaning the algorithm calls itself on each half. On a tiny or already sorted list, a bubble sort that stops early can actually be quicker.",
              "Choosing an algorithm means weighing these trade-offs: the size of the data, whether it is partly sorted, how much memory is available and how important simple, bug-free code is. Real programming languages often use hybrid algorithms; Python's built-in sort, for example, combines merging with a simpler method for short runs of data.",
            ],
          },
        ],
        words: [
          { word: "merge sort", meaning: "a sorting algorithm that splits a list into single items, then repeatedly merges them back together in order" },
          { word: "divide and conquer", meaning: "a strategy that splits a problem into smaller versions of itself, solves them, then combines the results" },
          { word: "merge", meaning: "to combine two sorted lists into one sorted list" },
          { word: "recursion", meaning: "when an algorithm solves a problem by calling itself on a smaller version of the same problem" },
          { word: "trade-off", meaning: "a situation where gaining one advantage means accepting a disadvantage, such as speed versus memory" },
        ],
      },
      practice: {
        intro: "Try these with cards in front of you.",
        questions: [
          {
            type: "order",
            q: "Put the stages of a merge sort in order.",
            items: ["Split the list in half", "Keep splitting until every item is on its own", "Merge single items into sorted pairs", "Merge sorted pairs into sorted groups of four", "Keep merging until there is one sorted list"],
          },
          { type: "choice", q: "Merge the sorted lists 2, 9 and 4, 5. What is the result?", options: ["2, 9, 4, 5", "2, 4, 5, 9", "4, 5, 2, 9"], answer: 1 },
          { type: "type", q: "How many rounds of splitting does merge sort need to break 8 cards into single cards?", answer: ["3", "three"] },
          {
            type: "match",
            q: "Match each algorithm from this unit to how it works.",
            pairs: [
              ["Bubble sort", "Swaps neighbouring items that are in the wrong order"],
              ["Merge sort", "Splits the list, then merges sorted parts back together"],
              ["Linear search", "Checks each item in turn from the start"],
              ["Binary search", "Discards half of a sorted list after each comparison"],
            ],
          },
          { type: "choice", q: "A streaming service must sort 50 million songs by popularity every night. Which algorithm is the better choice, and why?", options: ["Bubble sort, because it is simpler to code", "Merge sort, because its number of steps grows far more slowly for huge lists", "Either, because they take the same time"], answer: 1 },
        ],
      },
      task: {
        title: "Merge sort race and recommendation",
        intro: "Act out merge sort with cards, race it against bubble sort, then write a recommendation as a computer scientist would.",
        need: ["A pack of playing cards (two packs if racing a partner)", "Paper and a pencil", "A stopwatch or phone timer"],
        steps: [
          "Deal 8 cards face up in a row and write down the order. Merge sort them: split into rows on the table, halving each time, until each card is alone. Then merge back upwards, counting every comparison you make. Write the total.",
          "Shuffle and deal 16 cards. Merge sort them, timing yourself and counting comparisons. Then put the same 16 cards back into their starting order and bubble sort them, again timing and counting.",
          "If you have a partner, race: one of you bubble sorts while the other merge sorts the same starting order from a second pack. Who finishes first? Try it again with an already-sorted row of cards. Does the result change?",
          "Record everything in a table: number of cards, starting order, algorithm, comparisons, time.",
          "Write a recommendation of 150 to 200 words for a school that needs to sort (a) a class list of 30 names once a term and (b) every exam result in the country. For each, recommend bubble sort or merge sort, using your results and the ideas of speed, memory and simplicity as evidence.",
        ],
      },
      exit: [
        { type: "choice", q: "What strategy does merge sort use?", options: ["Divide and conquer", "Comparing only the first and last items", "Checking each item in turn"], answer: 0 },
        { type: "choice", q: "Merge the sorted lists 1, 6 and 3, 4. What is the result?", options: ["1, 6, 3, 4", "1, 3, 6, 4", "1, 3, 4, 6"], answer: 2 },
        { type: "choice", q: "When merging two sorted lists, which item do you take next?", options: ["The smaller of the two front items", "The last item of the longer list", "Any item at random"], answer: 0 },
        { type: "pick", q: "Which are disadvantages of merge sort compared with bubble sort? There is more than one.", options: ["It needs extra memory", "It is harder to code", "It is slower on large jumbled lists", "On a tiny, already sorted list it may be slower"], answers: [0, 1, 3] },
        { type: "type", q: "What is the word for an algorithm that calls itself on a smaller version of the problem?", answer: ["recursion", "recursive", "Recursion"] },
        { type: "choice", q: "Which best explains why merge sort is faster than bubble sort for 1,000 items?", options: ["It never compares any items", "It halves the problem repeatedly, so it needs only about 10 rounds of merging instead of hundreds of thousands of comparisons", "It only sorts half of the list"], answer: 1 },
      ],
      grownUp: {
        need: ["One or two packs of playing cards", "Paper and pencil", "A timer"],
        tips: [
          "Merging 8 cards needs between 12 and 17 comparisons depending on the starting order; 16 cards needs at most 49. A worst-case bubble sort on 16 cards needs 120.",
          "The race with already-sorted cards is a useful surprise: an early-stopping bubble sort finishes after one pass of 15 comparisons, while merge sort still does all its splitting and merging. This shows why 'best' depends on the data.",
          "Laying cards out in rows on a large table makes merge sort's structure visible. Clear plenty of space.",
        ],
        younger: "Merge sort just 4 cards and focus on the merging step: always take the smaller of the two front cards.",
        older: "Research insertion sort, act it out with cards, and add it to your comparison table. Then find out what 'O(n²)' and 'O(n log n)' mean and which sorts they describe.",
      },
    },
  ],
};
