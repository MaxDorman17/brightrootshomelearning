import type { LessonUnit } from "@/lib/lessons";

/** Counting and numbers to 20, for ages 5 to 7. Counting forwards and back, reading and writing numbers, tens and ones, one more and one less, comparing, and number lines, with lots of counting real things. */
export const countingTo20: LessonUnit = {
  slug: "counting-to-20",
  title: "Counting and numbers to 20",
  short: "Counting",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "🔢",
  color: "#2F5D3A",
  summary: "Six lessons: counting forwards and back, reading and writing numbers, tens and ones, one more and one less, comparing numbers, and using a number line, all to 20.",
  cover: "/lessons/units/counting-to-20.jpg",
  lessons: [
    {
      slug: "counting-to-20-1",
      title: "Counting forwards and back",
      emoji: "🔢",
      minutes: 30,
      goal: "I can count forwards and back to 20.",
      starter: [
        { type: "type", q: "How many counters are in the ten frame?", visual: { kind: "tenframe", filled: 5 }, answer: ["5", "five"] },
        { type: "choice", q: "How many dots can you count?", visual: { kind: "dots", rows: 2, cols: 3 }, options: ["5", "6", "7"], answer: 1 },
        { type: "order", q: "Put these numbers in counting order.", items: ["1", "2", "3", "4", "5"] },
        { type: "choice", q: "What number comes after 3?", options: ["2", "4", "5"], answer: 1 },
        { type: "type", q: "The ten frame is full. How many counters are there?", visual: { kind: "tenframe", filled: 10 }, answer: ["10", "ten"] },
        { type: "choice", q: "What number comes just before 5?", options: ["4", "6"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Counting one by one",
            picture: "/lessons/counting-to-20/lesson-1-1.jpg",
            alt: "A child touching conkers in a row, one at a time, as they count",
            text: [
              "When we count things, we touch each one and say one number for it. One, two, three, four...",
              "Touch each thing once. Don't skip any, and don't count any twice.",
              "The last number you say tells you how many there are.",
            ],
          },
          {
            heading: "Counting on past 10",
            picture: "/lessons/counting-to-20/lesson-1-2.jpg",
            alt: "Two children counting a long line of autumn leaves on the grass",
            text: [
              "After 10 the counting keeps going: eleven, twelve, thirteen, fourteen, fifteen.",
              "Then sixteen, seventeen, eighteen, nineteen, twenty.",
              "You can start counting from any number. Try starting at 8: eight, nine, ten, eleven...",
            ],
          },
          {
            heading: "Counting back",
            picture: "/lessons/counting-to-20/lesson-1-3.jpg",
            alt: "A child crouching down like a rocket, ready to jump up at the end of a countdown",
            text: [
              "Counting back is like a rocket countdown. Ten, nine, eight, seven... blast off!",
              "Each number is one less than the one before.",
              "You can count back from 20 too: twenty, nineteen, eighteen, seventeen...",
            ],
          },
        ],
        words: [
          { word: "count", meaning: "say the numbers in order to find how many" },
          { word: "forwards", meaning: "counting up: 1, 2, 3" },
          { word: "back", meaning: "counting down: 3, 2, 1" },
        ],
      },
      practice: {
        intro: "Let's count forwards and back.",
        questions: [
          { type: "order", q: "Count on. Put these numbers in order.", items: ["11", "12", "13", "14", "15"] },
          { type: "order", q: "Count back from 20. Put these numbers in order.", items: ["20", "19", "18", "17", "16"] },
          { type: "choice", q: "What comes next? 14, 15, 16, ...", options: ["17", "18", "15"], answer: 0 },
          { type: "gap", q: "Fill the gaps.", text: "8, 9, ___, 11, ___", bank: ["10", "12", "13"], answers: ["10", "12"] },
        ],
      },
      task: {
        title: "A conker count",
        intro: "Collect 20 things and count them forwards and back.",
        need: ["20 small things, like conkers, leaves, buttons or pasta shapes", "A table or the floor", "A grown-up to help"],
        steps: [
          "Collect 20 things. Line them up in a row.",
          "Count them. Touch each one as you say its number.",
          "Now count back. Take one away each time you say a number: twenty, nineteen, eighteen...",
          "Your grown-up picks a number. Start counting from there!",
        ],
      },
      exit: [
        { type: "type", q: "Count on: 15, 16, 17, ___", answer: ["18", "eighteen"] },
        { type: "choice", q: "Count back: 12, 11, 10, ___", options: ["11", "9", "8"], answer: 1 },
        { type: "order", q: "Count back. Put these numbers in order.", items: ["13", "12", "11", "10", "9"] },
        { type: "choice", q: "What number comes after 19?", options: ["18", "20", "21"], answer: 1 },
        { type: "type", q: "Count the dots. How many are there?", visual: { kind: "dots", rows: 2, cols: 6 }, answer: ["12", "twelve"] },
        { type: "choice", q: "When you count things, how many numbers do you say for each one?", options: ["One", "Two"], answer: 0 },
      ],
      grownUp: {
        need: ["20 small objects, like conkers, leaves, buttons or dried pasta"],
        tips: [
          "Watch for touching and counting at the same pace. Many children say the numbers faster than they point, so slow down together.",
          "The numbers 11 to 19 are the hardest to say in order. Count on from 10 often, on walks, on the stairs and while tidying up.",
          "Small items like buttons are a choking risk for little brothers and sisters, so keep them out of reach.",
        ],
        younger: "Count to 10 first, forwards and back, then add one more number each day.",
        older: "Count on and back from any number to 20, then try counting in twos: 2, 4, 6, 8...",
      },
    },
    {
      slug: "counting-to-20-2",
      title: "Reading and writing numbers",
      emoji: "✏️",
      minutes: 30,
      goal: "I can read and write numbers to 20 in digits, and some in words.",
      starter: [
        { type: "type", q: "Count on: 11, 12, 13, ___", answer: ["14", "fourteen"] },
        { type: "choice", q: "Count back: 20, 19, 18, ___", options: ["17", "19", "16"], answer: 0 },
        { type: "order", q: "Count on. Put these numbers in order.", items: ["14", "15", "16", "17", "18"] },
        { type: "choice", q: "What number comes after 10?", options: ["9", "11", "12"], answer: 1 },
        { type: "type", q: "How many dots are there?", visual: { kind: "dots", rows: 3, cols: 3 }, answer: ["9", "nine"] },
        { type: "choice", q: "What number comes just before 16?", options: ["15", "17"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Numbers have names and shapes",
            picture: "/lessons/counting-to-20/lesson-2-1.jpg",
            alt: "A child and a grown-up looking at a picture book together on the sofa",
            text: [
              "Every number has a name we say, like seven, and a shape we write.",
              "We write numbers with digits. There are ten digits: 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9.",
              "Look around and you will spot numbers everywhere: on doors, on buses and in books.",
            ],
          },
          {
            heading: "Teen numbers",
            picture: "/lessons/counting-to-20/lesson-2-2.jpg",
            alt: "A child sorting apples into a basket of ten with a few apples beside it",
            text: [
              "The numbers 13 to 19 are called teen numbers. Thirteen, fourteen, fifteen...",
              "They all have two digits, and they all start with a 1. Fourteen is written 14.",
              "Listen to the end of the word: four-TEEN. Be careful not to write 41 by mistake!",
            ],
          },
          {
            heading: "Writing numbers well",
            picture: "/lessons/counting-to-20/lesson-2-3.jpg",
            alt: "A child writing in a notebook with a pencil at the kitchen table",
            text: [
              "Start most numbers at the top and go down.",
              "Some numbers like to flip the wrong way, like 2, 3, 5, 7 and 9. Check which way they face.",
              "Twenty is written 20. That is a 2 and a 0.",
            ],
          },
        ],
        words: [
          { word: "digit", meaning: "one of the ten shapes we use to write numbers, 0 to 9" },
          { word: "teen numbers", meaning: "the numbers thirteen to nineteen" },
          { word: "numeral", meaning: "a number written in digits, like 12" },
        ],
      },
      practice: {
        intro: "Let's read and write some numbers.",
        questions: [
          { type: "match", q: "Match each number to its word.", pairs: [["6", "six"], ["9", "nine"], ["12", "twelve"]] },
          { type: "choice", q: "Which number is fifteen?", options: ["50", "15", "51"], answer: 1 },
          { type: "type", q: "How many counters? Type the number.", visual: { kind: "tenframe", filled: 8 }, answer: ["8", "eight"] },
          { type: "gap", q: "Fill the gap.", text: "Twenty is written ___.", bank: ["20", "12", "2"], answers: ["20"] },
        ],
      },
      task: {
        title: "A number hunt",
        intro: "Find numbers around your home, then make your own.",
        need: ["Paper and a pencil or crayons", "A handful of leaves, conkers or buttons", "A grown-up to help"],
        steps: [
          "Hunt for numbers around your home. Look at doors, books, the cooker and the telephone.",
          "Read each number you find to your grown-up.",
          "Write the numbers 1 to 10 on your paper. Take your time with each one.",
          "Your grown-up says a number to 20. Write it, then put that many leaves or conkers next to it.",
        ],
      },
      exit: [
        { type: "match", q: "Match each number to its word.", pairs: [["3", "three"], ["11", "eleven"], ["20", "twenty"]] },
        { type: "choice", q: "Which number is thirteen?", options: ["31", "13", "30"], answer: 1 },
        { type: "type", q: "Write fourteen in digits.", answer: ["14"] },
        { type: "choice", q: "How many digits does 18 have?", options: ["One", "Two"], answer: 1 },
        { type: "type", q: "How many dots are there?", visual: { kind: "dots", rows: 2, cols: 8 }, answer: ["16", "sixteen"] },
        { type: "choice", q: "Which number is nineteen?", options: ["9", "19", "90"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and a pencil", "A handful of small objects to count"],
        tips: [
          "Reversed digits are very common at this age and not a worry. Gently show the right way and praise the try.",
          "Mixing up 13 and 31, or 17 and 71, is common because we say the 'teen' part last. Saying 'one ten and three' can help.",
        ],
        younger: "Read and write numbers to 10, and match each one to that many objects.",
        older: "Write the words for numbers to 20 too, and try a few tricky ones like eight, eleven and twelve.",
      },
    },
    {
      slug: "counting-to-20-3",
      title: "Tens and ones to 20",
      emoji: "🧱",
      minutes: 30,
      goal: "I can say how many tens and ones are in numbers to 20.",
      starter: [
        { type: "match", q: "Match each number to its word.", pairs: [["7", "seven"], ["15", "fifteen"], ["18", "eighteen"]] },
        { type: "choice", q: "Which number is twelve?", options: ["21", "12"], answer: 1 },
        { type: "type", q: "Write sixteen in digits.", answer: ["16"] },
        { type: "choice", q: "How many digits does 11 have?", options: ["One", "Two"], answer: 1 },
        { type: "type", q: "How many counters are there?", visual: { kind: "tenframe", filled: 6 }, answer: ["6", "six"] },
        { type: "choice", q: "Which number is twenty?", options: ["20", "2", "12"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Making a ten",
            picture: "/lessons/counting-to-20/lesson-3-1.jpg",
            alt: "A child tying ten sticks together with a piece of string",
            text: [
              "When we have ten things, we can put them together to make one ten.",
              "Ten ones make one ten. A full ten frame shows one ten.",
              "Tens make big numbers easier to count.",
            ],
          },
          {
            heading: "Teen numbers are ten and some more",
            picture: "/lessons/counting-to-20/lesson-3-2.jpg",
            alt: "A bundle of ten sticks next to four single sticks on a garden table",
            text: [
              "Fourteen is one ten and four ones. We write it 14.",
              "The 1 tells us there is one ten. The 4 tells us there are four ones.",
              "Every number from 11 to 19 has one ten and some ones.",
            ],
          },
          {
            heading: "Twenty is two tens",
            picture: "/lessons/counting-to-20/lesson-3-3.jpg",
            alt: "Two children each holding a bundle of ten sticks",
            text: [
              "Twenty is two tens, with no ones left over. We write it 20.",
              "The 2 tells us there are two tens. The 0 tells us there are no ones.",
            ],
          },
        ],
        words: [
          { word: "ones", meaning: "single things, counted one at a time" },
          { word: "ten", meaning: "a group of ten ones put together" },
          { word: "bundle", meaning: "things tied together in a group" },
        ],
      },
      practice: {
        intro: "Let's count the tens and the ones.",
        questions: [
          { type: "type", q: "There is one stick of ten and some ones. What number do the blocks show?", visual: { kind: "blocks", tens: 1, ones: 3 }, answer: ["13", "thirteen"] },
          { type: "choice", q: "17 is one ten and how many ones?", options: ["1", "7", "10"], answer: 1 },
          { type: "choice", q: "What number do the blocks show?", visual: { kind: "blocks", tens: 2, ones: 0 }, options: ["2", "20", "12"], answer: 1 },
          { type: "match", q: "Match the tens and ones to the number.", pairs: [["1 ten and 5 ones", "15"], ["1 ten and 9 ones", "19"], ["1 ten and 1 one", "11"]] },
        ],
      },
      task: {
        title: "Bundle and count",
        intro: "Make tens with sticks, then build numbers to 20.",
        need: ["20 sticks, straws, pencils or lolly sticks", "Two elastic bands, hair bobbles or bits of string", "A grown-up to help"],
        steps: [
          "Count out ten sticks. Tie them together to make one ten.",
          "Make another ten with ten more sticks. How many sticks is two tens?",
          "Undo one bundle. Your grown-up says a number, like 16. Build it with one ten and some ones.",
          "Swap jobs. Build a number with your sticks and ask your grown-up to say it.",
        ],
      },
      exit: [
        { type: "type", q: "What number do the blocks show?", visual: { kind: "blocks", tens: 1, ones: 6 }, answer: ["16", "sixteen"] },
        { type: "choice", q: "How many tens are in 20?", options: ["1", "2", "20"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "12 is 1 ten and ___ ones.", bank: ["2", "1", "12"], answers: ["2"] },
        { type: "choice", q: "What number do the blocks show?", visual: { kind: "blocks", tens: 1, ones: 0 }, options: ["1", "10", "11"], answer: 1 },
        { type: "match", q: "Match the tens and ones to the number.", pairs: [["1 ten and 8 ones", "18"], ["1 ten and 4 ones", "14"], ["2 tens", "20"]] },
        { type: "pick", q: "Which numbers have one ten? There is more than one.", options: ["13", "9", "17", "5"], answers: [0, 2] },
      ],
      grownUp: {
        need: ["20 sticks, straws or pencils", "Two elastic bands or bits of string"],
        tips: [
          "Let your child do the bundling. Counting out ten and tying it up shows that one ten really is ten ones.",
          "Say teen numbers the long way too: 'seventeen is one ten and seven ones'. It helps with reading and writing them.",
        ],
        younger: "Make one bundle of ten, then add ones and count on from ten: ten, eleven, twelve...",
        older: "Use three bundles and go beyond 20. What number is two tens and five ones?",
      },
    },
    {
      slug: "counting-to-20-4",
      title: "One more, one less",
      emoji: "➕",
      minutes: 30,
      goal: "I can find one more and one less than a number to 20.",
      starter: [
        { type: "type", q: "What number do the blocks show?", visual: { kind: "blocks", tens: 1, ones: 4 }, answer: ["14", "fourteen"] },
        { type: "choice", q: "How many tens are in 20?", options: ["2", "10"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "15 is 1 ten and ___ ones.", bank: ["5", "1", "15"], answers: ["5"] },
        { type: "match", q: "Match the tens and ones to the number.", pairs: [["1 ten and 2 ones", "12"], ["1 ten and 7 ones", "17"], ["2 tens", "20"]] },
        { type: "choice", q: "10 is one ten and how many ones?", options: ["0", "1", "10"], answer: 0 },
        { type: "choice", q: "What number do the blocks show?", visual: { kind: "blocks", tens: 1, ones: 9 }, options: ["19", "91", "10"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "One more",
            picture: "/lessons/counting-to-20/lesson-4-1.jpg",
            alt: "A child adding one more apple to a bowl of apples",
            text: [
              "There are 6 apples in the bowl. Put in one more. Now there are 7.",
              "One more is the next number when you count on.",
              "One more than 12 is 13. One more than 19 is 20.",
            ],
          },
          {
            heading: "One less",
            picture: "/lessons/counting-to-20/lesson-4-2.jpg",
            alt: "A child taking one sock off a washing line with other socks on it",
            text: [
              "There are 8 socks on the line. Take one away. Now there are 7.",
              "One less is the number just before when you count back.",
              "One less than 15 is 14. One less than 10 is 9.",
            ],
          },
          {
            heading: "Hopping along",
            picture: "/lessons/counting-to-20/lesson-4-3.jpg",
            alt: "A child hopping between stepping stones in a garden",
            text: [
              "Think of numbers in a row, like stepping stones.",
              "Hop forwards one stone to find one more. Hop back one stone to find one less.",
            ],
          },
        ],
        words: [
          { word: "one more", meaning: "add one, the next number when you count on" },
          { word: "one less", meaning: "take one away, the number before" },
          { word: "next", meaning: "the one that comes straight after" },
        ],
      },
      practice: {
        intro: "Let's find one more and one less.",
        questions: [
          { type: "type", q: "Here are 7 counters. What is one more?", visual: { kind: "tenframe", filled: 7 }, answer: ["8", "eight"] },
          { type: "choice", q: "What is one less than 15?", options: ["16", "14", "13"], answer: 1 },
          { type: "choice", q: "The jump starts at 12 and goes one more. Where does it land?", visual: { kind: "numberline", from: 10, to: 20, jump: [12, 13] }, options: ["11", "13", "14"], answer: 1 },
          { type: "match", q: "Match each one to its answer.", pairs: [["One more than 9", "10"], ["One less than 20", "19"], ["One more than 16", "17"]] },
        ],
      },
      task: {
        title: "One more, one less bowl",
        intro: "Play a game of adding one and taking one away.",
        need: ["A bowl", "Up to 20 small things, like conkers, apples, buttons or toy bricks", "A grown-up to help"],
        steps: [
          "Your grown-up puts some things in the bowl. Count them.",
          "Your grown-up calls 'one more!' or 'one less!'.",
          "Say what the new number will be. Then add one or take one away, and count to check.",
          "Swap jobs. Now you call out, and your grown-up has to answer.",
        ],
      },
      exit: [
        { type: "type", q: "What is one more than 11?", answer: ["12", "twelve"] },
        { type: "type", q: "What is one less than 18?", answer: ["17", "seventeen"] },
        { type: "choice", q: "The ten frame is full. What is one more than this?", visual: { kind: "tenframe", filled: 10 }, options: ["9", "11", "10"], answer: 1 },
        { type: "choice", q: "The jump goes back one, to one less. Where does it land?", visual: { kind: "numberline", from: 0, to: 10, jump: [6, 5] }, options: ["4", "5", "7"], answer: 1 },
        { type: "choice", q: "What is one less than 1?", options: ["0", "2"], answer: 0 },
        { type: "pick", q: "Which numbers are one more or one less than 14? There is more than one.", options: ["13", "15", "16", "12"], answers: [0, 1] },
      ],
      grownUp: {
        need: ["A bowl", "Up to 20 small objects"],
        tips: [
          "Ask for a guess before they count to check. Saying 'one more than 12 is 13' without counting from 1 is the real step forward.",
          "Crossing 10 and 20 is tricky: one more than 9, one less than 10, one more than 19. Practise those few often.",
          "If you use buttons or other small things, keep them away from little brothers and sisters.",
        ],
        younger: "Stay with numbers to 10 and keep the objects in the bowl to count.",
        older: "Try two more and two less, or one more than a number they can't see.",
      },
    },
    {
      slug: "counting-to-20-5",
      title: "Bigger, smaller, equal",
      emoji: "⚖️",
      minutes: 30,
      goal: "I can compare numbers to 20 using more than, less than and equal to.",
      starter: [
        { type: "type", q: "What is one more than 15?", answer: ["16", "sixteen"] },
        { type: "type", q: "What is one less than 10?", answer: ["9", "nine"] },
        { type: "choice", q: "The jump starts at 17 and goes one more. Where does it land?", visual: { kind: "numberline", from: 10, to: 20, jump: [17, 18] }, options: ["16", "18", "19"], answer: 1 },
        { type: "match", q: "Match each one to its answer.", pairs: [["One more than 19", "20"], ["One less than 12", "11"], ["One more than 5", "6"]] },
        { type: "choice", q: "What is one less than 13?", options: ["14", "12"], answer: 1 },
        { type: "type", q: "Here are 4 counters. What is one more?", visual: { kind: "tenframe", filled: 4 }, answer: ["5", "five"] },
      ],
      learn: {
        cards: [
          {
            heading: "More and fewer",
            picture: "/lessons/counting-to-20/lesson-5-1.jpg",
            alt: "Two children lining up their conkers side by side to see who has more",
            text: [
              "To see who has more, line the things up side by side.",
              "The longer line has more. The shorter line has fewer.",
              "You can count each group too. The bigger number is more.",
            ],
          },
          {
            heading: "Equal",
            picture: "/lessons/counting-to-20/lesson-5-2.jpg",
            alt: "Two plates with the same number of apple slices on each",
            text: [
              "When two groups have the same number, they are equal.",
              "We write = for equal. It means 'is the same as'. 7 = 7.",
            ],
          },
          {
            heading: "Comparing numbers",
            picture: "/lessons/counting-to-20/lesson-5-3.jpg",
            alt: "A child holding a big pile of leaves next to a child holding a small pile",
            text: [
              "When we count, the numbers get bigger. 18 comes after 12, so 18 is more than 12.",
              "Look at the tens first. 15 has a ten and 9 does not, so 15 is more than 9.",
              "Small numbers are less than big ones. 4 is less than 10.",
            ],
          },
        ],
        words: [
          { word: "more than", meaning: "a bigger number or amount" },
          { word: "less than", meaning: "a smaller number or amount" },
          { word: "equal", meaning: "the same number or amount" },
        ],
      },
      practice: {
        intro: "Let's compare some numbers.",
        questions: [
          { type: "choice", q: "Which number is bigger?", options: ["9", "14"], answer: 1 },
          { type: "choice", q: "Here are 10 dots. Is that more than, less than or equal to 10?", visual: { kind: "dots", rows: 2, cols: 5 }, options: ["More than 10", "Less than 10", "Equal to 10"], answer: 2 },
          { type: "order", q: "Put these from smallest to biggest.", items: ["3", "8", "12", "19"] },
          { type: "pick", q: "Which numbers are more than 10? There is more than one.", options: ["7", "15", "20", "10"], answers: [1, 2] },
        ],
      },
      task: {
        title: "Handful race",
        intro: "Grab handfuls and find out who has more.",
        need: ["A pile of conkers, leaves, buttons or dried pasta", "Paper and a pencil", "A grown-up to play with"],
        steps: [
          "You and your grown-up each grab a handful from the pile.",
          "Line your things up side by side. Whose line is longer?",
          "Count both groups. Say who has more, who has fewer, or if they are equal.",
          "Write numbers 1 to 20 on scraps of paper and turn them face down. Each pick one. The bigger number wins!",
        ],
      },
      exit: [
        { type: "choice", q: "Which number is smaller?", options: ["17", "11"], answer: 1 },
        { type: "choice", q: "Is 6 more than or less than 10?", visual: { kind: "tenframe", filled: 6 }, options: ["More than 10", "Less than 10"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "Two groups of 7 socks are ___.", bank: ["equal", "more", "fewer"], answers: ["equal"] },
        { type: "order", q: "Put these from biggest to smallest.", items: ["20", "16", "11", "4"] },
        { type: "choice", q: "Mia has 13 buttons. Jo has 15 buttons. Who has fewer?", options: ["Mia", "Jo"], answer: 0 },
        { type: "pick", q: "Which numbers are less than 12? There is more than one.", options: ["9", "14", "11", "18"], answers: [0, 2] },
      ],
      grownUp: {
        need: ["A pile of small objects", "Scraps of paper and a pencil"],
        tips: [
          "Lining things up side by side is the key move. A spread-out group can look bigger even when it has fewer.",
          "Use 'fewer' for things you can count and 'less' for amounts, but don't worry if your child mixes them up for now.",
          "Small items like buttons are a choking risk for little brothers and sisters, so stay close.",
        ],
        younger: "Compare two small groups to 10 and just say which has more.",
        older: "Put three numbers in order, and try the signs < and > as well as =.",
      },
    },
    {
      slug: "counting-to-20-6",
      title: "Number lines",
      emoji: "📏",
      minutes: 30,
      goal: "I can find numbers on a number line to 20 and use it to count on and back.",
      starter: [
        { type: "choice", q: "Which number is bigger?", options: ["16", "6"], answer: 0 },
        { type: "choice", q: "Ali has 9 apples. Ben has 12 apples. Who has more?", options: ["Ali", "Ben"], answer: 1 },
        { type: "order", q: "Put these from smallest to biggest.", items: ["2", "10", "13", "17"] },
        { type: "pick", q: "Which numbers are more than 15? There is more than one.", options: ["18", "12", "20", "15"], answers: [0, 2] },
        { type: "gap", q: "Fill the gap.", text: "When two groups have the same number, they are ___.", bank: ["equal", "bigger", "smaller"], answers: ["equal"] },
        { type: "choice", q: "Here are 6 dots. Is 6 more than or less than 4?", visual: { kind: "dots", rows: 2, cols: 3 }, options: ["More than 4", "Less than 4"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "What is a number line?",
            picture: "/lessons/counting-to-20/lesson-6-1.jpg",
            alt: "A child walking along a row of stepping stones on a garden path",
            text: [
              "A number line shows numbers in order along a line, like stepping stones on a path.",
              "The small numbers are at the start, on the left. The numbers get bigger as you go right.",
              "The steps between the numbers are all the same size.",
            ],
          },
          {
            heading: "Jumping forwards",
            picture: "/lessons/counting-to-20/lesson-6-2.jpg",
            alt: "A toy frog hopping along a chalk line on a patio",
            text: [
              "To count on, start on a number and jump to the right.",
              "Start on 8 and jump on 3: nine, ten, eleven. You land on 11.",
              "Count the jumps, not the number you start on.",
            ],
          },
          {
            heading: "Jumping back",
            picture: "/lessons/counting-to-20/lesson-6-3.jpg",
            alt: "A child jumping backwards along a line of leaves on the grass",
            text: [
              "To count back, jump to the left.",
              "Start on 15 and jump back 2: fourteen, thirteen. You land on 13.",
              "A number line also helps you find missing numbers. What comes between 16 and 18?",
            ],
          },
        ],
        words: [
          { word: "number line", meaning: "numbers in order along a line" },
          { word: "jump", meaning: "move along the number line, one step at a time" },
          { word: "count on", meaning: "start at a number and count forwards" },
        ],
      },
      practice: {
        intro: "Let's jump along the number line.",
        questions: [
          { type: "choice", q: "The jump starts at 4 and goes on 2. Where does it land?", visual: { kind: "numberline", from: 0, to: 10, jump: [4, 6] }, options: ["5", "6", "7"], answer: 1 },
          { type: "type", q: "The jump starts at 15 and goes back 3. Where does it land?", visual: { kind: "numberline", from: 10, to: 20, jump: [15, 12] }, answer: ["12", "twelve"] },
          { type: "choice", q: "On a number line, where are the bigger numbers?", options: ["Further along, to the right", "At the start, on the left"], answer: 0 },
          { type: "gap", q: "Fill the gaps on the number line.", text: "14, 15, ___, 17, ___", bank: ["16", "18", "19"], answers: ["16", "18"] },
        ],
      },
      task: {
        title: "A floor number line",
        intro: "Make a number line big enough to jump along.",
        need: ["21 scraps of paper or paper plates", "A thick pen or crayon", "A small toy", "A grown-up to help"],
        steps: [
          "Write the numbers 0 to 20 on your scraps of paper, one on each.",
          "Lay them out in order on the floor or in the garden, in a long line.",
          "Stand on a number your grown-up picks. Jump on 2. Where did you land?",
          "Now jump back 3. Then let your toy have a turn, hopping along the line.",
        ],
      },
      exit: [
        { type: "type", q: "The jump starts at 9 and goes on 3. Where does it land?", visual: { kind: "numberline", from: 0, to: 20, jump: [9, 12] }, answer: ["12", "twelve"] },
        { type: "choice", q: "The jump starts at 8 and goes back 3. Where does it land?", visual: { kind: "numberline", from: 0, to: 10, jump: [8, 5] }, options: ["5", "6", "3"], answer: 0 },
        { type: "choice", q: "Which number is between 13 and 15?", options: ["12", "14", "16"], answer: 1 },
        { type: "choice", q: "You want to count on. Which way do you jump?", options: ["Right, towards bigger numbers", "Left, towards smaller numbers"], answer: 0 },
        { type: "order", q: "Put these in order, like on a number line.", items: ["0", "5", "10", "15", "20"] },
        { type: "type", q: "Start at 17. Count back 2. Where do you land?", answer: ["15", "fifteen"] },
      ],
      grownUp: {
        need: ["21 scraps of paper or paper plates", "A thick pen", "A small toy"],
        tips: [
          "The most common slip is counting the starting number as the first jump. Say 'hop' for each jump and count the hops.",
          "A chalk number line on a path or patio works well too, and the rain washes it away.",
        ],
        younger: "Use a number line from 0 to 10 and jump on or back just one or two.",
        older: "Use the number line for adding and taking away, like 8 + 5 or 17 − 4.",
      },
    },
  ],
};
