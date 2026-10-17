import type { LessonUnit } from "@/lib/lessons";

/** Number stories and problem solving, for ages 5 to 7. Word problems told as little stories, with drawing, part-whole models, choosing to add or take away, two-step puzzles and making up stories, all with numbers within 20. */
export const numberStories: LessonUnit = {
  slug: "number-stories",
  title: "Number stories and problem solving",
  short: "Number stories",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "📖",
  color: "#2F5D3A",
  summary: "Six lessons: acting out number stories with conkers, drawing to help, part-whole models, choosing to add or take away, two-step puzzles and making up your own stories, with numbers within 20.",
  cover: "/lessons/units/number-stories.jpg",
  lessons: [
    {
      slug: "number-stories-1",
      title: "Number stories with conkers",
      emoji: "🌰",
      minutes: 30,
      goal: "I can act out a number story with real things and find the answer.",
      starter: [
        { type: "choice", q: "How many dots are there?", visual: { kind: "dots", rows: 2, cols: 3 }, options: ["5", "6", "7"], answer: 1 },
        { type: "type", q: "3 and 2 more makes how many?", answer: ["5", "five"] },
        { type: "choice", q: "How many are on the ten frame?", visual: { kind: "tenframe", filled: 7 }, options: ["7", "8", "6"], answer: 0 },
        { type: "choice", q: "You have 5 apples. You eat 1. Do you have more or fewer now?", options: ["More", "Fewer"], answer: 1 },
        { type: "order", q: "Put these numbers in order, smallest first.", items: ["2", "5", "8", "11"] },
        { type: "match", q: "Match each sum to its answer.", pairs: [["2 + 2", "4"], ["4 + 1", "5"], ["3 + 3", "6"]] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a number story?",
            picture: "/lessons/number-stories/lesson-1-1.jpg",
            alt: "A child holding out a handful of shiny conkers under a big tree",
            text: [
              "A number story is a little story with numbers in it. It ends with a question we can answer with maths.",
              "Here is one. Sam found 4 conkers. Then Sam found 3 more. How many conkers does Sam have now?",
            ],
          },
          {
            heading: "Act it out",
            picture: "/lessons/number-stories/lesson-1-2.jpg",
            alt: "Two children on a rug putting conkers into a line, counting them",
            text: [
              "You can use real things to act out the story. Put out 4 conkers. Then put out 3 more.",
              "Now count them all: 1, 2, 3, 4, 5, 6, 7. Sam has 7 conkers altogether.",
              "Altogether means all of them counted together.",
            ],
          },
          {
            heading: "Stories that take away",
            picture: "/lessons/number-stories/lesson-1-3.jpg",
            alt: "A girl handing two conkers to her little brother",
            text: [
              "Some stories take away. Mia had 8 conkers. She gave 2 to her brother. How many are left?",
              "Start with 8 conkers. Move 2 away. Count the ones left: 6. Mia has 6 conkers left.",
            ],
          },
        ],
        words: [
          { word: "number story", meaning: "a little story with numbers and a question to answer" },
          { word: "altogether", meaning: "all of them counted together" },
          { word: "left", meaning: "what is still there after some go away" },
        ],
      },
      practice: {
        intro: "Let's solve some conker stories.",
        questions: [
          { type: "type", q: "Here are Sam's 4 conkers. He finds 3 more. How many does he have now?", visual: { kind: "tenframe", filled: 4 }, answer: ["7", "seven"] },
          { type: "choice", q: "Mia has 8 conkers. She gives 2 away. How many are left?", visual: { kind: "tenframe", filled: 8 }, options: ["10", "6", "5"], answer: 1 },
          { type: "choice", q: "Ben has 5 leaves. The wind blows 2 away. Does this story add or take away?", options: ["Add", "Take away"], answer: 1 },
          { type: "match", q: "Match each story to its answer.", pairs: [["3 conkers and 3 more", "6"], ["9 conkers, then 1 rolls away", "8"], ["2 conkers and 1 more", "3"]] },
        ],
      },
      task: {
        title: "Conker stories",
        intro: "Act out number stories with real things.",
        need: ["Up to 20 conkers, or buttons, pasta shapes or toy bricks", "A bowl", "A grown-up to help"],
        steps: [
          "Your grown-up tells you a number story, like: 'Ana has 5 conkers. She finds 2 more.'",
          "Act it out with your conkers. Put them in the bowl or move them away.",
          "Count to find the answer. Say it out loud as a whole sentence: 'Ana has 7 conkers.'",
          "Swap! Tell your grown-up a story and watch them act it out.",
        ],
      },
      exit: [
        { type: "type", q: "Ali has 5 conkers. He finds 2 more. How many does he have now?", answer: ["7", "seven"] },
        { type: "choice", q: "Kim has 6 apples. She eats 1. How many are left?", options: ["5", "7", "6"], answer: 0 },
        { type: "choice", q: "Here are 9 conkers. 3 roll away. How many are left?", visual: { kind: "tenframe", filled: 9 }, options: ["5", "6", "12"], answer: 1 },
        { type: "choice", q: "What does altogether mean?", options: ["All of them counted together", "Take some away"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "4 conkers and 4 more makes ___ conkers.", bank: ["7", "8", "9"], answers: ["8"] },
        { type: "choice", q: "Which story takes away?", options: ["Jo finds 3 more leaves", "Jo drops 3 leaves"], answer: 1 },
      ],
      grownUp: {
        need: ["Up to 20 conkers, buttons, pasta shapes or bricks", "A bowl"],
        tips: [
          "Conkers must not be eaten and, like buttons, they are a choking risk, so keep them away from little brothers and sisters.",
          "Use your child's name, their toys and their friends in the stories. Children work much harder on a story about themselves.",
        ],
        younger: "Keep the numbers to 10 and only tell adding stories until they feel confident.",
        older: "Use numbers up to 20 and write the sum underneath, like 4 + 3 = 7.",
      },
    },
    {
      slug: "number-stories-2",
      title: "Drawing a picture to help",
      emoji: "✏️",
      minutes: 30,
      goal: "I can draw a quick picture to help me solve a number story.",
      starter: [
        { type: "type", q: "Sam has 5 conkers. He finds 4 more. How many does he have now?", answer: ["9", "nine"] },
        { type: "choice", q: "There are 7 leaves. 2 blow away. How many are left?", options: ["5", "9", "4"], answer: 0 },
        { type: "choice", q: "Which story adds?", options: ["Tom eats 2 apples", "Tom picks 2 more apples"], answer: 1 },
        { type: "choice", q: "Here are 6 conkers. Then 2 more come. How many now?", visual: { kind: "tenframe", filled: 6 }, options: ["7", "8", "9"], answer: 1 },
        { type: "match", q: "Match each story to its answer.", pairs: [["3 conkers and 4 more", "7"], ["10 conkers, then 2 roll away", "8"], ["5 conkers and 5 more", "10"]] },
        { type: "choice", q: "What does altogether mean?", options: ["All of them counted together", "Only the ones left"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "No conkers? Draw!",
            picture: "/lessons/number-stories/lesson-2-1.jpg",
            alt: "A child at a kitchen table drawing rows of little circles with a pencil",
            text: [
              "You don't always have real things to count. Then you can draw them instead.",
              "Keep your drawing quick. A dot or a circle is fine for a conker or an apple. Maths drawings don't need to be fancy.",
            ],
          },
          {
            heading: "Draw, then add",
            picture: "/lessons/number-stories/lesson-2-2.jpg",
            alt: "An apple tree with apples on the branches and more apples lying on the grass",
            text: [
              "There are 6 apples on a tree and 5 apples on the grass. How many apples are there altogether?",
              "Draw 6 dots. Then draw 5 more dots. Count them all: there are 11 apples.",
            ],
          },
          {
            heading: "Draw, then cross out",
            picture: "/lessons/number-stories/lesson-2-3.jpg",
            alt: "Autumn leaves falling from a branch as a child watches",
            text: [
              "There were 12 leaves on a branch. 4 fell off. How many leaves are left?",
              "Draw 12 dots. Cross out 4 of them, because they went away. Count the dots that are not crossed out: 8 leaves are left.",
            ],
          },
        ],
        words: [
          { word: "draw", meaning: "make a quick picture to help you think" },
          { word: "cross out", meaning: "draw a line through something to show it has gone" },
          { word: "dot", meaning: "a small round mark, quick to draw" },
        ],
      },
      practice: {
        intro: "Let's use drawings to help.",
        questions: [
          { type: "choice", q: "Zara drew 10 dots for 10 buttons. She crosses out 3. How many are left?", visual: { kind: "dots", rows: 2, cols: 5 }, options: ["7", "6", "13"], answer: 0 },
          { type: "type", q: "Leo drew the apples on a tree. How many apples did he draw?", visual: { kind: "dots", rows: 3, cols: 4 }, answer: ["12", "twelve"] },
          { type: "choice", q: "What is the quickest way to draw 8 conkers?", options: ["8 quick dots", "8 careful pictures with every detail"], answer: 0 },
          { type: "order", q: "Put the steps in order to solve a take-away story.", items: ["Draw the first number", "Cross out the ones that go", "Count what is left"] },
        ],
      },
      task: {
        title: "Draw the story",
        intro: "Solve number stories by drawing them.",
        need: ["Paper", "A pencil", "A grown-up to tell the stories"],
        steps: [
          "Your grown-up tells you a story, like: '9 hedgehogs are asleep in the leaves. 4 more come.'",
          "Draw dots for the first number. Then draw more dots, or cross some out.",
          "Count to find the answer and tell your grown-up.",
          "Do three stories. Try one adding story and one take-away story.",
        ],
      },
      exit: [
        { type: "type", q: "Here are 8 socks on the washing line. 4 more are pegged on. How many socks now?", visual: { kind: "dots", rows: 2, cols: 4 }, answer: ["12", "twelve"] },
        { type: "choice", q: "Here are 15 leaves. 5 blow away. How many are left?", visual: { kind: "dots", rows: 3, cols: 5 }, options: ["10", "20", "5"], answer: 0 },
        { type: "choice", q: "In a take-away story, what do you do to the dots that go?", options: ["Cross them out", "Draw more"], answer: 0 },
        { type: "type", q: "Draw it! 7 ducks are on a pond. 6 more fly in. How many ducks now?", answer: ["13", "thirteen"] },
        { type: "type", q: "Draw it! There are 11 apples in a bowl. You eat 2. How many are left?", answer: ["9", "nine"] },
        { type: "choice", q: "Do maths drawings need to be fancy?", options: ["Yes, very fancy", "No, quick dots are fine"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and a pencil"],
        tips: [
          "Encourage drawing in neat rows of five. It makes counting much quicker and less likely to go wrong.",
          "If your child starts drawing detailed conkers with stalks, praise it, then show how a dot does the same job in a second.",
        ],
        younger: "Keep to numbers within 10 and do the drawing together, one dot at a time.",
        older: "Ask them to write the sum next to each drawing, like 12 − 4 = 8.",
      },
    },
    {
      slug: "number-stories-3",
      title: "Part-whole models",
      emoji: "⭕",
      minutes: 30,
      goal: "I can use a part-whole model to show two parts that make a whole.",
      starter: [
        { type: "type", q: "Ella drew 6 conkers. Then she drew 3 more. How many did she draw?", visual: { kind: "dots", rows: 2, cols: 3 }, answer: ["9", "nine"] },
        { type: "choice", q: "How do you show things going away in a drawing?", options: ["Cross them out", "Colour them in"], answer: 0 },
        { type: "type", q: "Draw it! There are 10 leaves. 4 blow away. How many are left?", answer: ["6", "six"] },
        { type: "choice", q: "What is quickest to draw for 9 apples?", options: ["9 dots", "9 pictures with leaves and stalks"], answer: 0 },
        { type: "order", q: "Put the steps in order to solve an adding story.", items: ["Draw the first number", "Draw the ones that come", "Count them all"] },
        { type: "choice", q: "There are 10 buttons. 5 are taken away. How many are left?", visual: { kind: "tenframe", filled: 10 }, options: ["5", "15", "4"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Parts and a whole",
            picture: "/lessons/number-stories/lesson-3-1.jpg",
            alt: "A child sorting a small pile of conkers into big ones and small ones",
            text: [
              "The whole is all of something. The parts are the groups that make it up.",
              "Here are 7 conkers. 4 are big and 3 are small. The parts are 4 and 3. The whole is 7.",
            ],
          },
          {
            heading: "The part-whole model",
            picture: "/lessons/number-stories/lesson-3-2.jpg",
            alt: "Three paper plates on a table, one at the top and two below, with conkers on them",
            text: [
              "We can show parts and a whole with three circles. The big circle at the top holds the whole.",
              "The two circles underneath hold the parts. Lines join each part to the whole.",
              "Put 7 in the top circle. Put 4 and 3 in the circles underneath.",
            ],
          },
          {
            heading: "Finding a missing part",
            picture: "/lessons/number-stories/lesson-3-3.jpg",
            alt: "A child holding a bag of socks, some striped and some spotty",
            text: [
              "Sometimes one part is missing. There are 10 socks. 6 are striped. The rest are spotty. How many are spotty?",
              "The whole is 10 and one part is 6. Count on from 6 to 10: 7, 8, 9, 10. That is 4, so 4 socks are spotty.",
            ],
          },
        ],
        words: [
          { word: "whole", meaning: "all of something, every bit of it" },
          { word: "part", meaning: "one group that is part of the whole" },
          { word: "part-whole model", meaning: "three joined circles that show two parts and a whole" },
        ],
      },
      practice: {
        intro: "Let's find parts and wholes.",
        questions: [
          { type: "type", q: "The whole is 8. One part is 5. What is the other part?", visual: { kind: "tenframe", filled: 8 }, answer: ["3", "three"] },
          { type: "choice", q: "There are 9 socks. 4 are red. The rest are blue. How many are blue?", options: ["5", "4", "13"], answer: 0 },
          {
            type: "pick",
            q: "Which pairs of parts make a whole of 10? There is more than one.",
            options: ["6 and 4", "5 and 4", "7 and 3", "2 and 8"],
            answers: [0, 2, 3],
          },
          { type: "match", q: "Match the parts to the whole.", pairs: [["3 and 2", "5"], ["6 and 6", "12"], ["10 and 5", "15"]] },
        ],
      },
      worksheet: "number-bonds-to-10",
      task: {
        title: "Part-whole plates",
        intro: "Make a part-whole model with plates and split a whole lots of ways.",
        need: ["Three paper plates, or three circles drawn on paper", "10 conkers, buttons or pasta shapes", "A grown-up to help"],
        steps: [
          "Put one plate at the top and two plates underneath, like the model.",
          "Put all 10 conkers on the top plate. That is the whole.",
          "Move them onto the two bottom plates to make two parts. How many are on each?",
          "Put them back and split them a different way. How many different ways can you find?",
        ],
      },
      exit: [
        { type: "choice", q: "In a part-whole model, where does the whole go?", options: ["In the big circle at the top", "In a small circle underneath"], answer: 0 },
        { type: "type", q: "The parts are 7 and 2. What is the whole?", answer: ["9", "nine"] },
        { type: "type", q: "The whole is 12. One part is 10. What is the other part?", visual: { kind: "blocks", tens: 1, ones: 2 }, answer: ["2", "two"] },
        { type: "choice", q: "The whole is 10 leaves. The ten frame shows one part. How big is the other part?", visual: { kind: "tenframe", filled: 6 }, options: ["4", "6", "3"], answer: 0 },
        { type: "gap", q: "Fill the gaps.", text: "5 and 3 are the ___. 8 is the ___.", bank: ["parts", "whole", "story"], answers: ["parts", "whole"] },
        {
          type: "pick",
          q: "Which pairs of parts make 7? There is more than one.",
          options: ["4 and 3", "5 and 1", "6 and 1", "2 and 5"],
          answers: [0, 2, 3],
        },
      ],
      grownUp: {
        need: ["Three paper plates or circles on paper", "10 small objects to count"],
        tips: [
          "Keep small objects away from little brothers and sisters.",
          "Write down each way your child splits 10 (like 6 and 4, then 4 and 6). Seeing them together helps them spot pairs that make 10.",
        ],
        younger: "Use a whole of 5, and let them find all the ways to split it.",
        older: "Try a whole up to 20, and hide one part under a cup for them to work out.",
      },
    },
    {
      slug: "number-stories-4",
      title: "Which sum do I need?",
      emoji: "🤔",
      minutes: 30,
      goal: "I can choose whether a number story needs adding or taking away.",
      starter: [
        { type: "type", q: "The parts are 4 and 4. What is the whole?", answer: ["8", "eight"] },
        { type: "type", q: "The whole is 10. One part is 7. What is the other part?", answer: ["3", "three"] },
        { type: "choice", q: "In a part-whole model, where does the whole go?", options: ["In a small circle underneath", "In the big circle at the top"], answer: 1 },
        { type: "match", q: "Match the parts to the whole.", pairs: [["2 and 3", "5"], ["5 and 5", "10"], ["9 and 2", "11"]] },
        {
          type: "pick",
          q: "Which pairs of parts make 10? There is more than one.",
          options: ["1 and 9", "4 and 5", "8 and 2", "3 and 3"],
          answers: [0, 2],
        },
        { type: "choice", q: "The whole is 10. The ten frame shows one part. What is the other part?", visual: { kind: "tenframe", filled: 7 }, options: ["3", "7", "2"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Clue words",
            picture: "/lessons/number-stories/lesson-4-1.jpg",
            alt: "A child listening carefully as a grown-up reads a story from a book",
            text: [
              "Listen for clue words in a story. Words like more, altogether and join often mean add.",
              "Words like left, eat, give away and fly away often mean take away.",
            ],
          },
          {
            heading: "Bigger or smaller?",
            picture: "/lessons/number-stories/lesson-4-2.jpg",
            alt: "Birds sitting on a garden fence, with some flying off into the sky",
            text: [
              "Think about what happens in the story. If more things come, the number gets bigger, so you add.",
              "If some things go, the number gets smaller, so you take away.",
              "9 birds sit on a fence. 3 fly away. There will be fewer birds, so we take away.",
            ],
          },
          {
            heading: "Writing the sum",
            picture: "/lessons/number-stories/lesson-4-3.jpg",
            alt: "A child lining up buttons in two groups on a table, pushing some together",
            text: [
              "The + sign means add. The − sign means take away. The = sign means is the same as.",
              "For the birds, we write 9 − 3 = 6. For 5 apples and 4 more, we write 5 + 4 = 9.",
              "Then check: does your answer make sense in the story?",
            ],
          },
        ],
        words: [
          { word: "add", meaning: "put together to make more; the sign is +" },
          { word: "take away", meaning: "remove some to leave fewer; the sign is −" },
          { word: "clue word", meaning: "a word in a story that helps you choose the sum" },
        ],
      },
      practice: {
        intro: "Add or take away? Let's choose.",
        questions: [
          { type: "choice", q: "There are 6 apples on the grass. 5 more fall from the tree. How many apples now? Which sum do you need?", options: ["6 + 5", "6 − 5"], answer: 0 },
          { type: "choice", q: "There are 14 leaves on a branch. 4 blow away. How many are left? Which sum do you need?", options: ["14 + 4", "14 − 4"], answer: 1 },
          {
            type: "pick",
            q: "Which are clue words for taking away? There is more than one.",
            options: ["left", "more", "fly away", "eat"],
            answers: [0, 2, 3],
          },
          { type: "type", q: "There are 13 conkers. 3 roll away. How many are left? The number line can help.", visual: { kind: "numberline", from: 0, to: 20, jump: [13, 10] }, answer: ["10", "ten"] },
        ],
      },
      worksheet: "adding-and-taking-away-to-20",
      task: {
        title: "Add or take away?",
        intro: "Choose the sum, then act out the story.",
        need: ["Two pieces of paper", "A pen", "Up to 20 buttons, conkers or bricks", "A grown-up to help"],
        steps: [
          "Ask your grown-up to help you draw a big + on one paper and a big − on the other.",
          "Your grown-up tells a number story.",
          "Listen for clue words. Point to + if the story adds, or − if it takes away.",
          "Act it out with your buttons to find the answer. Were you right to choose that sign?",
        ],
      },
      exit: [
        { type: "choice", q: "8 ducks are swimming. 4 more join them. Add or take away?", options: ["Add", "Take away"], answer: 0 },
        { type: "choice", q: "There are 15 socks. 5 get lost. Which sum do you need?", options: ["15 − 5", "15 + 5"], answer: 0 },
        { type: "type", q: "There are 15 socks. 5 get lost. How many are left?", answer: ["10", "ten"] },
        { type: "choice", q: "This jump shows a story. Which sum does it show?", visual: { kind: "numberline", from: 0, to: 20, jump: [7, 12] }, options: ["7 + 5 = 12", "12 − 5 = 7"], answer: 0 },
        { type: "gap", q: "Fill the gaps.", text: "If more come, I ___. If some go, I ___.", bank: ["add", "take away"], answers: ["add", "take away"] },
        { type: "type", q: "Ivy has 9 buttons. Her gran gives her 9 more. How many does she have now?", answer: ["18", "eighteen"] },
      ],
      grownUp: {
        need: ["Two pieces of paper and a pen", "Up to 20 small objects to count"],
        tips: [
          "Clue words help, but they can trick children. Keep asking 'Will there be more or fewer at the end?' as it works every time.",
          "Mix adding and take-away stories at random, so your child really has to listen rather than guess.",
        ],
        younger: "Keep the numbers within 10 and just point to + or − without writing the sum.",
        older: "Ask them to write the whole sum for each story, then check it with a number line from 0 to 20.",
      },
    },
    {
      slug: "number-stories-5",
      title: "Two-step puzzles",
      emoji: "🧩",
      minutes: 30,
      goal: "I can solve a number story with two steps, one step at a time.",
      starter: [
        { type: "choice", q: "There are 7 birds. 2 fly away. Add or take away?", options: ["Add", "Take away"], answer: 1 },
        { type: "choice", q: "There are 5 apples. 6 more fall. Which sum do you need?", options: ["5 + 6", "6 − 5"], answer: 0 },
        { type: "type", q: "What is 5 + 6?", answer: ["11", "eleven"] },
        {
          type: "pick",
          q: "Which are clue words for adding? There is more than one.",
          options: ["more", "altogether", "left", "join"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "There are 12 conkers. 2 roll away. How many are left?", answer: ["10", "ten"] },
        { type: "match", q: "Match each sum to its answer.", pairs: [["8 + 2", "10"], ["8 − 2", "6"], ["9 + 9", "18"]] },
      ],
      learn: {
        cards: [
          {
            heading: "Two things happen",
            picture: "/lessons/number-stories/lesson-5-1.jpg",
            alt: "A dad dropping conkers into a bowl while a girl reaches in to take some out",
            text: [
              "Some stories have two things happening, one after the other.",
              "There are 5 conkers in a bowl. Dad adds 4. Then Ella takes 3. How many conkers are in the bowl now?",
            ],
          },
          {
            heading: "One step at a time",
            picture: "/lessons/number-stories/lesson-5-2.jpg",
            alt: "A child stepping from one stepping stone to the next in a garden",
            text: [
              "Step one: Dad adds 4. 5 + 4 = 9. Now there are 9 conkers.",
              "Step two: Ella takes 3. 9 − 3 = 6. There are 6 conkers in the bowl.",
              "The answer to step one is where step two starts.",
            ],
          },
          {
            heading: "Keep track",
            picture: "/lessons/number-stories/lesson-5-3.jpg",
            alt: "A child moving buttons on a table while a grown-up watches and smiles",
            text: [
              "Use real things or draw dots, so you don't lose your place.",
              "Say the number out loud after each step. At the end, check that your answer makes sense.",
            ],
          },
        ],
        words: [
          { word: "step", meaning: "one part of solving a puzzle" },
          { word: "two-step", meaning: "a puzzle with two things to work out, one after the other" },
          { word: "check", meaning: "look again to make sure your answer is right" },
        ],
      },
      practice: {
        intro: "Let's solve some puzzles, one step at a time.",
        questions: [
          { type: "type", q: "There are 6 leaves on the path. 2 more fall. Then 3 more fall. How many leaves now?", answer: ["11", "eleven"] },
          { type: "choice", q: "You have 4 apples. Gran gives you 6 more. Then you eat 2. How many apples now?", options: ["8", "12", "10"], answer: 0 },
          { type: "order", q: "Put the steps in order. There are 10 buttons. You find 5 more. Then you lose 3.", items: ["Start with 10", "Add 5 to make 15", "Take away 3 to make 12"] },
          { type: "type", q: "There are 7 conkers in a tin. Add 7 more. Then 4 roll away. How many conkers now?", answer: ["10", "ten"] },
        ],
      },
      task: {
        title: "The toy bus",
        intro: "Make a bus for your toys and solve two-step puzzles.",
        need: ["A shoebox or a row of chairs for the bus", "Up to 20 small toys", "A grown-up to help"],
        steps: [
          "Put some toys on the bus. Count them.",
          "Your grown-up says what happens at the first stop, like: '3 toys get on.' Move the toys and count again.",
          "At the next stop, your grown-up says: '2 toys get off.' Move them and count again.",
          "How many toys are on the bus now? Then you be the bus driver and tell your grown-up what happens.",
        ],
      },
      exit: [
        { type: "type", q: "3 ducks are on a pond. 5 more land. Then 2 fly away. How many ducks now?", answer: ["6", "six"] },
        { type: "choice", q: "There are 12 socks in the wash. 4 more go in. Then 6 come out. How many socks are in the wash now?", options: ["10", "22", "14"], answer: 0 },
        { type: "choice", q: "Sam has 9 conkers. He finds 5 more. Then he gives 4 away. What is the first step?", options: ["9 + 5", "9 − 4", "5 − 4"], answer: 0 },
        { type: "type", q: "Sam has 9 conkers. He finds 5 more. Then he gives 4 away. How many does he have now?", answer: ["10", "ten"] },
        { type: "choice", q: "Here are 8 apples. 2 get eaten. Then 4 more are picked. How many apples now?", visual: { kind: "tenframe", filled: 8 }, options: ["10", "6", "14"], answer: 0 },
        { type: "choice", q: "After step one, what do you do with the answer?", options: ["Use it to start step two", "Forget about it"], answer: 0 },
      ],
      grownUp: {
        need: ["A shoebox or chairs for a bus", "Up to 20 small toys"],
        tips: [
          "Two-step problems are a big jump at this age. Pause after the first step and ask 'How many are there now?' before moving on.",
          "Make sure no step goes over 20, and that you never take away more than there are.",
        ],
        younger: "Do one step at a time as two separate stories, using totals within 10.",
        older: "Add a third stop, and ask them to write the sums for each step.",
      },
    },
    {
      slug: "number-stories-6",
      title: "Making up my own number story",
      emoji: "✍️",
      minutes: 30,
      goal: "I can make up my own number story to match a sum.",
      starter: [
        { type: "type", q: "You have 4 conkers. You find 4 more. Then 3 roll away. How many now?", answer: ["5", "five"] },
        { type: "choice", q: "There are 10 leaves. 5 blow away. Then 2 more fall. How many leaves now?", options: ["7", "3", "17"], answer: 0 },
        { type: "choice", q: "There are 6 apples. You pick 3 more. Then you eat 1. What is the first step?", options: ["6 + 3", "6 − 1"], answer: 0 },
        { type: "order", q: "Put the steps in order. There are 11 buttons. You lose 1. Then you find 6.", items: ["Start with 11", "Take away 1 to make 10", "Add 6 to make 16"] },
        { type: "choice", q: "After step one, what do you do with the answer?", options: ["Forget about it", "Use it to start step two"], answer: 1 },
        { type: "type", q: "What is 10 + 6?", answer: ["16", "sixteen"] },
      ],
      learn: {
        cards: [
          {
            heading: "A story for every sum",
            picture: "/lessons/number-stories/lesson-6-1.jpg",
            alt: "Squirrels climbing up an autumn tree while a child points at them",
            text: [
              "Every sum can be turned into a story. Here is 3 + 4 = 7.",
              "3 squirrels sat in a tree. 4 more climbed up. How many squirrels were in the tree? 7!",
            ],
          },
          {
            heading: "Who, what and what happens",
            picture: "/lessons/number-stories/lesson-6-2.jpg",
            alt: "A child thinking, surrounded by a teddy, a toy hedgehog and a basket of apples",
            text: [
              "To make a story, choose who it is about: you, a friend, a pet or a hedgehog.",
              "Choose what they have: conkers, apples, socks or toys. Then choose what happens. Do more come, or do some go?",
              "End with a question, like 'How many now?'",
            ],
          },
          {
            heading: "Take-away stories too",
            picture: "/lessons/number-stories/lesson-6-3.jpg",
            alt: "A child giving apples from a basket to two friends",
            text: [
              "Here is 12 − 5 = 7. There were 12 apples in a basket. I gave 5 to my friends. How many were left? 7!",
              "Tell your story to someone and ask them to solve it. Can they find the answer?",
            ],
          },
        ],
        words: [
          { word: "question", meaning: "the part of the story that asks what we need to find" },
          { word: "match", meaning: "go together; the story and the sum show the same thing" },
          { word: "make up", meaning: "think of something new by yourself" },
        ],
      },
      practice: {
        intro: "Which story goes with which sum?",
        questions: [
          { type: "choice", q: "Which story matches 5 + 2?", options: ["5 cats, then 2 more come", "5 cats, then 2 run away"], answer: 0 },
          { type: "choice", q: "Which story matches 9 − 4?", options: ["9 leaves, then 4 more fall", "9 leaves, then 4 blow away"], answer: 1 },
          { type: "match", q: "Match each story to its sum.", pairs: [["6 hats, then 3 more", "6 + 3"], ["6 hats, then 3 blow away", "6 − 3"], ["3 hats, then 6 more", "3 + 6"]] },
          { type: "gap", q: "Finish the story for 8 + 2 = 10.", text: "I had ___ apples. I picked ___ more. Now I have ___ apples.", bank: ["8", "2", "10", "6"], answers: ["8", "2", "10"] },
        ],
      },
      task: {
        title: "My number story book",
        intro: "Make a little book of your own number stories.",
        need: ["Two sheets of paper folded in half to make a book", "Crayons or felt pens", "A grown-up to help"],
        steps: [
          "Ask your grown-up to give you a sum, like 6 + 4 or 11 − 3.",
          "Make up a story to go with it. Who is it about? What happens?",
          "Draw your story on one page. Your grown-up can help you write the sum underneath.",
          "Make one adding story and one take-away story. Then read your book to someone and ask them to solve it.",
        ],
      },
      exit: [
        { type: "choice", q: "Which story matches 4 + 3?", options: ["4 hedgehogs, then 3 more come", "4 hedgehogs, then 3 go away"], answer: 0 },
        { type: "choice", q: "Which story matches 10 − 6?", options: ["10 conkers, then 6 roll away", "10 conkers, then 6 more"], answer: 0 },
        { type: "type", q: "I had 7 buttons. I found 7 more. How many do I have now?", answer: ["14", "fourteen"] },
        { type: "choice", q: "What should a number story end with?", options: ["A question to answer", "A song"], answer: 0 },
        { type: "match", q: "Match each story to its answer.", pairs: [["15 birds, then 5 fly away", "10"], ["15 birds, then 5 more land", "20"], ["5 birds, then 1 more lands", "6"]] },
        { type: "choice", q: "Which sum matches: 'There are 12 apples. I eat 3.'?", options: ["12 − 3 = 9", "12 + 3 = 15"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper folded into a little book", "Crayons or felt pens"],
        tips: [
          "Making up a story is harder than solving one, so model one first using something from your own day.",
          "Accept spoken stories. Writing is a bonus: the maths is in matching the story to the sum.",
        ],
        younger: "Use sums within 10 and let them tell the story out loud while you draw it.",
        older: "Ask for a two-step story, like 8 + 5 − 3, with a question at the end.",
      },
    },
  ],
};
