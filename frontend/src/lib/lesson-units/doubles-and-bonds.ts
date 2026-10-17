import type { LessonUnit } from "@/lib/lessons";

/** Doubles, bonds and fact families, for ages 5 to 7. Doubles to 10, near doubles, bonds to 20, fact families, adding three small numbers, and games to remember facts quickly. */
export const doublesAndBonds: LessonUnit = {
  slug: "doubles-and-bonds",
  title: "Doubles, bonds and fact families",
  short: "Doubles",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "🧦",
  color: "#2F5D3A",
  summary: "Six lessons: doubles to 10, near doubles, number bonds to 20, fact families, adding three small numbers, and quick games to help facts stick.",
  cover: "/lessons/units/doubles-and-bonds.jpg",
  lessons: [
    {
      slug: "doubles-and-bonds-1",
      title: "Doubles to 10",
      emoji: "🧦",
      minutes: 30,
      goal: "I can double numbers up to 5 and say the answer.",
      starter: [
        { type: "choice", q: "How many dots are there?", visual: { kind: "dots", rows: 1, cols: 5 }, options: ["4", "5", "6"], answer: 1 },
        { type: "type", q: "How many counters are on the ten frame?", visual: { kind: "tenframe", filled: 6 }, answer: ["6", "six"] },
        { type: "choice", q: "What is 2 + 2?", options: ["3", "4", "5"], answer: 1 },
        { type: "choice", q: "Which number is bigger?", options: ["3", "5"], answer: 1 },
        { type: "order", q: "Put these numbers in order, smallest first.", items: ["1", "3", "6", "8", "10"] },
        { type: "type", q: "What is one more than 4?", answer: ["5", "five"] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a double?",
            picture: "/lessons/doubles-and-bonds/lesson-1-1.jpg",
            alt: "A child putting two equal groups of conkers on a table",
            text: [
              "A double is when you have two groups that are the same.",
              "Here are 3 conkers and 3 more conkers. That is double 3. Count them all: 6!",
              "So 3 + 3 = 6. We say double 3 is 6.",
            ],
          },
          {
            heading: "Doubles all around us",
            picture: "/lessons/doubles-and-bonds/lesson-1-2.jpg",
            alt: "A child holding up both hands with all fingers spread out",
            text: [
              "Look at your hands. You have 5 fingers on one hand and 5 on the other. Double 5 is 10.",
              "Socks come in pairs. Two socks is double 1. A ladybird can have the same number of spots on each wing.",
            ],
          },
          {
            heading: "Doubles to remember",
            picture: "/lessons/doubles-and-bonds/lesson-1-3.jpg",
            alt: "Rows of apples set out in matching pairs on a table",
            text: [
              "Double 1 is 2. Double 2 is 4. Double 3 is 6. Double 4 is 8. Double 5 is 10.",
              "The answers go up in twos: 2, 4, 6, 8, 10. Say them out loud like a little song.",
            ],
          },
        ],
        words: [
          { word: "double", meaning: "two groups the same, added together" },
          { word: "pair", meaning: "two things that go together, like two socks" },
          { word: "same", meaning: "just like each other, not more and not less" },
        ],
      },
      practice: {
        intro: "Let's find some doubles.",
        questions: [
          { type: "choice", q: "Two rows of 3 dots. What is double 3?", visual: { kind: "dots", rows: 2, cols: 3 }, options: ["5", "6", "7"], answer: 1 },
          { type: "match", q: "Match each double to its answer.", pairs: [["Double 1", "2"], ["Double 2", "4"], ["Double 5", "10"]] },
          { type: "type", q: "5 counters on top and 5 underneath. What is double 5?", visual: { kind: "tenframe", filled: 10 }, answer: ["10", "ten"] },
          { type: "gap", q: "Fill the gap.", visual: { kind: "dots", rows: 2, cols: 4 }, text: "4 + 4 = ___", bank: ["6", "8", "9"], answers: ["8"] },
        ],
      },
      task: {
        title: "Double it!",
        intro: "Make doubles with real things and count them.",
        need: ["A piece of paper", "Ten small things, like conkers, buttons or dried pasta", "A grown-up to help"],
        steps: [
          "Fold the paper in half, then open it out flat.",
          "Put 3 conkers on one side of the fold.",
          "Put the same number on the other side. That is a double!",
          "Count them all and say, \"Double 3 is 6.\"",
          "Try again with 1, 2, 4 and 5 on each side.",
        ],
      },
      exit: [
        { type: "type", q: "What is double 2?", visual: { kind: "dots", rows: 2, cols: 2 }, answer: ["4", "four"] },
        { type: "choice", q: "What is double 5?", options: ["8", "10", "12"], answer: 1 },
        { type: "choice", q: "What does double mean?", options: ["Two groups the same", "One more"], answer: 0 },
        { type: "match", q: "Match each double to its answer.", pairs: [["Double 3", "6"], ["Double 4", "8"], ["Double 1", "2"]] },
        { type: "gap", q: "Fill the gap.", text: "2 + 2 = ___", bank: ["3", "4", "5"], answers: ["4"] },
        { type: "type", q: "You have 5 fingers on each hand. How many fingers is that on two hands?", answer: ["10", "ten"] },
      ],
      grownUp: {
        need: ["A piece of paper", "Ten small things, like conkers, buttons or dried pasta"],
        tips: [
          "Chant the doubles together: double 1 is 2, double 2 is 4, and so on. Saying them out loud helps them stick.",
          "Fingers are great for doubles: hold up the same number on both hands and count them all. Keep small things away from little brothers and sisters.",
        ],
        younger: "Just do double 1, double 2 and double 3 with real things, counting every one.",
        older: "Carry on past 10: double 6 is 12, double 7 is 14, all the way to double 10 is 20.",
      },
    },
    {
      slug: "doubles-and-bonds-2",
      title: "Near doubles",
      emoji: "🍎",
      minutes: 30,
      goal: "I can use a double to help me add two numbers next to each other, like 3 + 4.",
      starter: [
        { type: "choice", q: "What is double 4?", options: ["6", "8", "10"], answer: 1 },
        { type: "type", q: "What is double 3?", visual: { kind: "dots", rows: 2, cols: 3 }, answer: ["6", "six"] },
        { type: "match", q: "Match each double to its answer.", pairs: [["Double 2", "4"], ["Double 5", "10"], ["Double 1", "2"]] },
        { type: "choice", q: "What does double mean?", options: ["Two groups the same", "Two groups that are different"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "4 + 4 = ___", bank: ["7", "8", "9"], answers: ["8"] },
        { type: "order", q: "Put these in order, smallest answer first.", items: ["Double 1", "Double 2", "Double 3", "Double 4", "Double 5"] },
      ],
      learn: {
        cards: [
          {
            heading: "Nearly a double",
            picture: "/lessons/doubles-and-bonds/lesson-2-1.jpg",
            alt: "Two small piles of apples on a kitchen table, one pile with one extra apple",
            text: [
              "Here are 3 apples and 4 apples. It is nearly a double, but not quite.",
              "One group has just one more. We call this a near double.",
            ],
          },
          {
            heading: "Double, then one more",
            picture: "/lessons/doubles-and-bonds/lesson-2-2.jpg",
            alt: "Two towers of toy bricks side by side, one a brick taller",
            text: [
              "To work out 3 + 4, start with the double you know. Double 3 is 6.",
              "The 4 is one more than 3, so add one more. 6 and one more is 7.",
              "So 3 + 4 = 7.",
            ],
          },
          {
            heading: "More near doubles",
            picture: "/lessons/doubles-and-bonds/lesson-2-3.jpg",
            alt: "A child lining up two rows of socks on a bed, one row with one more sock",
            text: [
              "Try 4 + 5. Double 4 is 8, and one more is 9. So 4 + 5 = 9.",
              "You can go the other way too. Double 5 is 10, and one less is 9. Both ways work!",
            ],
          },
        ],
        words: [
          { word: "near double", meaning: "two numbers next to each other, like 3 and 4" },
          { word: "one more", meaning: "the next number when you count up" },
          { word: "one less", meaning: "the number just before when you count back" },
        ],
      },
      practice: {
        intro: "Let's use doubles to help.",
        questions: [
          { type: "choice", q: "Which is a near double?", options: ["2 + 3", "2 + 6", "1 + 5"], answer: 0 },
          {
            type: "type",
            q: "3 + 4. Double 3 is 6. Jump one more. Where do you land?",
            visual: { kind: "numberline", from: 0, to: 10, jump: [6, 7] },
            answer: ["7", "seven"],
          },
          { type: "gap", q: "Fill the gap.", text: "Double 4 is 8, so 4 + 5 = ___", bank: ["8", "9", "10"], answers: ["9"] },
          { type: "match", q: "Match each near double to its answer.", pairs: [["1 + 2", "3"], ["2 + 3", "5"], ["4 + 5", "9"]] },
        ],
      },
      task: {
        title: "Near double towers",
        intro: "Build towers to see a near double.",
        need: ["Toy bricks, or things that stack, like buttons or coins", "A grown-up to help"],
        steps: [
          "Build a tower of 3 bricks. Build another tower of 3 next to it. That is double 3.",
          "Add one more brick to the second tower. Now you have 3 and 4.",
          "Count all the bricks. Double 3 is 6, and one more makes 7.",
          "Try again with towers of 2 and 3, then 4 and 5.",
        ],
      },
      exit: [
        { type: "type", q: "What is 2 + 3?", answer: ["5", "five"] },
        { type: "choice", q: "Which double helps you work out 3 + 4?", options: ["Double 1", "Double 3", "Double 5"], answer: 1 },
        {
          type: "type",
          q: "Double 4 is 8. Jump one more. What is 4 + 5?",
          visual: { kind: "numberline", from: 0, to: 10, jump: [8, 9] },
          answer: ["9", "nine"],
        },
        { type: "choice", q: "Which is a near double?", options: ["4 + 5", "4 + 8"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Double 1 is 2, so 1 + 2 = ___", bank: ["2", "3", "4"], answers: ["3"] },
        {
          type: "pick",
          q: "Which of these make 7? There is more than one.",
          options: ["3 + 4", "4 + 3", "2 + 4", "5 + 1"],
          answers: [0, 1],
        },
      ],
      grownUp: {
        need: ["Toy bricks, or other things that stack"],
        tips: [
          "Always ask, \"Which double can help?\" first. Using a fact they know to find one they don't is a big step in maths.",
          "Show it with real things: make the double, then add the extra one so they can see where the 'one more' comes from.",
        ],
        younger: "Stick to 1 + 2 and 2 + 3, building each one with bricks and counting.",
        older: "Try bigger near doubles, like 6 + 7 (double 6 is 12, one more is 13) and 7 + 8.",
      },
    },
    {
      slug: "doubles-and-bonds-3",
      title: "Bonds to 20",
      emoji: "🍂",
      minutes: 30,
      goal: "I can find pairs of numbers that make 10 and pairs that make 20.",
      starter: [
        { type: "choice", q: "What is 3 + 4?", options: ["6", "7", "8"], answer: 1 },
        { type: "choice", q: "Which double helps you work out 4 + 5?", options: ["Double 4", "Double 2"], answer: 0 },
        { type: "type", q: "What is double 5?", visual: { kind: "tenframe", filled: 10 }, answer: ["10", "ten"] },
        { type: "gap", q: "Fill the gap.", text: "2 + 3 = ___", bank: ["4", "5", "6"], answers: ["5"] },
        { type: "match", q: "Match each near double to its answer.", pairs: [["1 + 2", "3"], ["3 + 4", "7"], ["4 + 5", "9"]] },
        { type: "choice", q: "Which is a near double?", options: ["5 + 6", "5 + 9"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Pairs that make 10",
            picture: "/lessons/doubles-and-bonds/lesson-3-1.jpg",
            alt: "A child filling an egg box with conkers, with a few spaces still empty",
            text: [
              "Two numbers that make 10 are called a number bond to 10.",
              "If 7 spaces are full, there are 3 spaces left. 7 and 3 make 10.",
              "The bonds to 10 are 10 and 0, 9 and 1, 8 and 2, 7 and 3, 6 and 4, and 5 and 5.",
            ],
          },
          {
            heading: "From 10 to 20",
            picture: "/lessons/doubles-and-bonds/lesson-3-2.jpg",
            alt: "Two rows of buttons on a rug, one full row and one with only a few buttons",
            text: [
              "20 is two tens. When you know your bonds to 10, you can find bonds to 20.",
              "3 and 7 make 10. So 13 and 7 make 20. You just add a ten to the first number.",
            ],
          },
          {
            heading: "Bonds to 20",
            picture: "/lessons/doubles-and-bonds/lesson-3-3.jpg",
            alt: "Two children collecting autumn leaves into a basket in a park",
            text: [
              "Some bonds to 20 are 10 and 10, 12 and 8, 15 and 5, and 18 and 2.",
              "You want 20 leaves. You have 14. How many more do you need? 4 and 6 make 10, so 14 and 6 make 20. You need 6!",
            ],
          },
        ],
        words: [
          { word: "number bond", meaning: "two numbers that go together to make another number" },
          { word: "total", meaning: "how many there are all together" },
          { word: "ten frame", meaning: "a box with ten spaces, in two rows of five" },
        ],
      },
      practice: {
        intro: "Let's find the missing part.",
        questions: [
          { type: "type", q: "How many more counters make 10?", visual: { kind: "tenframe", filled: 6 }, answer: ["4", "four"] },
          { type: "match", q: "Match the pairs that make 10.", pairs: [["3", "7"], ["2", "8"], ["4", "6"]] },
          { type: "type", q: "This shows 14. How many more make 20?", visual: { kind: "blocks", tens: 1, ones: 4 }, answer: ["6", "six"] },
          { type: "gap", q: "Fill the gap.", text: "13 + ___ = 20", bank: ["5", "7", "17"], answers: ["7"] },
        ],
      },
      worksheet: "number-bonds-to-10",
      task: {
        title: "The hiding game",
        intro: "Hide some conkers and work out how many are hiding.",
        need: ["Twenty small things, like conkers, buttons or dried pasta", "A cup or an old sock", "A grown-up to help"],
        steps: [
          "Count out 10 conkers and put them in a line.",
          "Close your eyes. Your grown-up hides some under the cup.",
          "Open your eyes and count the ones you can see. How many are hiding? Use your bonds to 10.",
          "Lift the cup to check. Then take turns.",
          "Now play with 20 conkers in two lines of ten.",
        ],
      },
      exit: [
        { type: "choice", q: "What goes with 7 to make 10?", options: ["2", "3", "4"], answer: 1 },
        { type: "type", q: "How many empty spaces are there?", visual: { kind: "tenframe", filled: 8 }, answer: ["2", "two"] },
        { type: "choice", q: "What goes with 16 to make 20?", options: ["4", "6", "14"], answer: 0 },
        { type: "match", q: "Match the pairs that make 20.", pairs: [["11", "9"], ["15", "5"], ["18", "2"]] },
        { type: "gap", q: "Fill the gap.", text: "10 + ___ = 20", bank: ["5", "10", "20"], answers: ["10"] },
        {
          type: "pick",
          q: "Which pairs make 20? There is more than one.",
          options: ["12 + 8", "13 + 6", "17 + 3", "10 + 9"],
          answers: [0, 2],
        },
      ],
      grownUp: {
        need: ["Twenty small things, like conkers, buttons or dried pasta", "A cup or an old sock"],
        tips: [
          "Bonds to 10 come first. Once they are sure of those, show how 3 + 7 = 10 helps with 13 + 7 = 20.",
          "An egg box with the two end spaces cut off makes a handy ten frame. Keep small things away from little brothers and sisters.",
        ],
        younger: "Just play the hiding game with 5 conkers, then 10, using a ten frame drawn on paper.",
        older: "Turn the bonds round into taking away: if 14 + 6 = 20, then 20 − 6 = 14.",
      },
    },
    {
      slug: "doubles-and-bonds-4",
      title: "Fact families",
      emoji: "🏠",
      minutes: 30,
      goal: "I can use three numbers to make two adding facts and two taking-away facts.",
      starter: [
        { type: "type", q: "How many more counters make 10?", visual: { kind: "tenframe", filled: 7 }, answer: ["3", "three"] },
        { type: "choice", q: "What goes with 14 to make 20?", options: ["6", "4", "16"], answer: 0 },
        { type: "match", q: "Match the pairs that make 10.", pairs: [["4", "6"], ["1", "9"], ["8", "2"]] },
        { type: "gap", q: "Fill the gap.", text: "15 + ___ = 20", bank: ["5", "10", "15"], answers: ["5"] },
        { type: "choice", q: "Which is a bond to 10?", options: ["6 + 4", "6 + 3"], answer: 0 },
        { type: "type", q: "What is 12 + 8?", answer: ["20", "twenty"] },
      ],
      learn: {
        cards: [
          {
            heading: "Three numbers, one family",
            picture: "/lessons/doubles-and-bonds/lesson-4-1.jpg",
            alt: "A child with a small group of red apples and a bigger group of green apples",
            text: [
              "Here are 3 red apples and 5 green apples. All together there are 8.",
              "The numbers 3, 5 and 8 belong together. They are a fact family.",
              "3 and 5 are the parts. 8 is the whole.",
            ],
          },
          {
            heading: "Two ways to add",
            picture: "/lessons/doubles-and-bonds/lesson-4-2.jpg",
            alt: "A child turning a plate of apples round to look from the other side",
            text: [
              "3 + 5 = 8. Now turn it round: 5 + 3 = 8.",
              "You can add the parts in any order. The whole is still 8.",
            ],
          },
          {
            heading: "Two ways to take away",
            picture: "/lessons/doubles-and-bonds/lesson-4-3.jpg",
            alt: "A child taking some apples away from a group and putting them in a bowl",
            text: [
              "Start with the whole, 8 apples. Take away 3 and there are 5 left. 8 − 3 = 5.",
              "Start again with 8. Take away 5 and there are 3 left. 8 − 5 = 3.",
              "When you take away, the whole comes first. So one family gives you four facts!",
            ],
          },
        ],
        words: [
          { word: "fact family", meaning: "three numbers that make two adding and two taking-away facts" },
          { word: "part", meaning: "one of the smaller numbers that make the whole" },
          { word: "whole", meaning: "the biggest number, made when you put the parts together" },
        ],
      },
      practice: {
        intro: "Let's make some fact families.",
        questions: [
          {
            type: "pick",
            q: "Which facts belong to the family 2, 4, 6? There is more than one.",
            options: ["2 + 4 = 6", "4 + 2 = 6", "6 − 2 = 4", "6 + 2 = 8"],
            answers: [0, 1, 2],
          },
          { type: "gap", q: "Fill the gaps for the family 3, 4, 7.", text: "3 + 4 = ___ and 7 − 4 = ___", bank: ["3", "7", "1"], answers: ["7", "3"] },
          { type: "choice", q: "This ten frame shows 9. What is 9 − 4?", visual: { kind: "tenframe", filled: 9 }, options: ["4", "5", "6"], answer: 1 },
          { type: "match", q: "Match each fact from the family 1, 5, 6 to its answer.", pairs: [["5 + 1", "6"], ["6 − 1", "5"], ["6 − 5", "1"]] },
        ],
      },
      task: {
        title: "Fact family houses",
        intro: "Build a house for a fact family.",
        need: ["Paper and a pencil", "Ten small things, like buttons or conkers", "A grown-up to help"],
        steps: [
          "Draw a house with a big triangle roof and four windows.",
          "Count out 8 buttons. Split them into two groups, like 5 and 3.",
          "Write the three numbers in the roof: 3, 5 and 8.",
          "Write one fact in each window: two adding facts and two taking-away facts. Use the buttons to check.",
          "Make another house for a different split, like 6 and 2.",
        ],
      },
      exit: [
        { type: "choice", q: "Which number is the whole in the family 2, 5, 7?", options: ["2", "5", "7"], answer: 2 },
        { type: "gap", q: "Fill the gap.", text: "4 + 5 = 9, so 5 + 4 = ___", bank: ["1", "9", "20"], answers: ["9"] },
        { type: "choice", q: "What is 9 − 5?", options: ["4", "5", "14"], answer: 0 },
        {
          type: "pick",
          q: "Which facts belong to the family 3, 6, 9? There is more than one.",
          options: ["3 + 6 = 9", "9 − 3 = 6", "6 + 9 = 15", "9 − 6 = 3"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "There are 8 counters. Take away 3. How many are left?", visual: { kind: "tenframe", filled: 8 }, answer: ["5", "five"] },
        { type: "choice", q: "How many facts are in a fact family like 3, 5, 8?", options: ["2", "4", "8"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and a pencil", "Ten small things, like buttons or conkers"],
        tips: [
          "Keep real things on the table. Seeing 8 buttons split into 3 and 5 makes it clear why the four facts belong together.",
          "Help with writing the facts if needed. The thinking matters more than the neat numbers today.",
        ],
        younger: "Just find the two adding facts, like 3 + 5 and 5 + 3, using buttons.",
        older: "Try families with bigger numbers, like 7, 10 and 17, and write all four facts.",
      },
    },
    {
      slug: "doubles-and-bonds-5",
      title: "Adding three small numbers",
      emoji: "🌰",
      minutes: 30,
      goal: "I can add three small numbers by looking for a double or a 10 first.",
      starter: [
        { type: "choice", q: "3 + 5 = 8, so what is 8 − 5?", options: ["3", "5", "13"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "6 + 2 = 8, so 2 + 6 = ___", bank: ["4", "8", "10"], answers: ["8"] },
        { type: "choice", q: "Which number is the whole in the family 1, 4, 5?", options: ["1", "4", "5"], answer: 2 },
        { type: "type", q: "What is 7 − 3?", answer: ["4", "four"] },
        { type: "match", q: "Match each fact to its answer.", pairs: [["4 + 3", "7"], ["7 − 3", "4"], ["7 − 4", "3"]] },
        { type: "choice", q: "How many facts are in a fact family?", options: ["4", "2", "3"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Three groups",
            picture: "/lessons/doubles-and-bonds/lesson-5-1.jpg",
            alt: "Three small piles of conkers on a wooden table",
            text: [
              "Here are 2 conkers, 3 conkers and 1 conker. How many all together?",
              "Add two of the numbers first: 2 + 3 = 5. Then add the last one: 5 + 1 = 6.",
            ],
          },
          {
            heading: "Look for a double",
            picture: "/lessons/doubles-and-bonds/lesson-5-2.jpg",
            alt: "A child pushing two equal piles of buttons together, with a single button to one side",
            text: [
              "You can add the numbers in any order. The total stays the same.",
              "Try 4 + 1 + 4. Spot the double first: double 4 is 8. Then add 1 more. The total is 9.",
            ],
          },
          {
            heading: "Look for a 10",
            picture: "/lessons/doubles-and-bonds/lesson-5-3.jpg",
            alt: "A child putting toy cars into a box with ten spaces, with a couple of cars waiting beside it",
            text: [
              "Try 7 + 2 + 3. Can you see two numbers that make 10?",
              "7 and 3 make 10. Then add the 2. 10 + 2 = 12. That was quick!",
            ],
          },
        ],
        words: [
          { word: "total", meaning: "how many there are all together" },
          { word: "add", meaning: "put groups together to find how many" },
          { word: "any order", meaning: "you can start with whichever number you like" },
        ],
      },
      practice: {
        intro: "Let's add three numbers.",
        questions: [
          { type: "type", q: "What is 2 + 2 + 1?", answer: ["5", "five"] },
          { type: "choice", q: "6 + 2 + 4. Which two numbers make 10?", options: ["6 and 4", "6 and 2", "2 and 4"], answer: 0 },
          { type: "gap", q: "Fill the gap.", text: "3 + 1 + 3: double 3 is 6, and 1 more makes ___", bank: ["6", "7", "8"], answers: ["7"] },
          { type: "match", q: "Match each sum to its total.", pairs: [["1 + 1 + 1", "3"], ["2 + 2 + 2", "6"], ["5 + 5 + 1", "11"]] },
        ],
      },
      worksheet: "adding-and-taking-away-to-20",
      task: {
        title: "Three cups",
        intro: "Add up three groups of conkers.",
        need: ["Three cups or bowls", "Fifteen small things, like conkers, buttons or dried pasta", "A grown-up to help"],
        steps: [
          "Your grown-up puts a few conkers in each cup, no more than 5 in each.",
          "Tip out the cups and count each group.",
          "Look for a double or two numbers that make 10. Add those first.",
          "Add the last group. Say the total, then count them all to check.",
          "Swap jobs. You fill the cups and your grown-up adds them up.",
        ],
      },
      exit: [
        { type: "type", q: "What is 3 + 3 + 2?", answer: ["8", "eight"] },
        { type: "choice", q: "What is 8 + 1 + 2?", options: ["10", "11", "12"], answer: 1 },
        { type: "choice", q: "5 + 4 + 5. Which two numbers make a double?", options: ["5 and 5", "5 and 4"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "4 + 6 + 3: 4 and 6 make 10, so the total is ___", bank: ["12", "13", "14"], answers: ["13"] },
        { type: "choice", q: "Does the order you add in change the total?", options: ["Yes", "No"], answer: 1 },
        { type: "type", q: "What is 1 + 9 + 4?", answer: ["14", "fourteen"] },
      ],
      grownUp: {
        need: ["Three cups or bowls", "Fifteen small things, like conkers, buttons or dried pasta"],
        tips: [
          "Ask, \"Can you see a double, or a pair that makes 10?\" before they start counting. Spotting these is the clever part.",
          "If you have dice, roll three and add them for a quick extra game. Keep small things away from little brothers and sisters.",
        ],
        younger: "Put just 1, 2 or 3 things in each cup, and count them all together.",
        older: "Use four cups, or try sums like 6 + 5 + 4 where they spot 6 + 4 = 10 first.",
      },
    },
    {
      slug: "doubles-and-bonds-6",
      title: "Quick-recall games",
      emoji: "⚡",
      minutes: 30,
      goal: "I can remember doubles and number bonds quickly, without counting.",
      starter: [
        { type: "type", q: "What is 2 + 3 + 2?", answer: ["7", "seven"] },
        { type: "choice", q: "What is 7 + 3 + 4?", options: ["13", "14", "15"], answer: 1 },
        { type: "choice", q: "6 + 1 + 6. Which two numbers make a double?", options: ["6 and 6", "6 and 1"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "5 + 2 + 5: double 5 is 10, so the total is ___", bank: ["11", "12", "13"], answers: ["12"] },
        { type: "choice", q: "Does the order you add in change the total?", options: ["No", "Yes"], answer: 0 },
        { type: "match", q: "Match each sum to its total.", pairs: [["1 + 2 + 3", "6"], ["4 + 4 + 1", "9"], ["2 + 8 + 5", "15"]] },
      ],
      learn: {
        cards: [
          {
            heading: "Knowing it by heart",
            picture: "/lessons/doubles-and-bonds/lesson-6-1.jpg",
            alt: "A child smiling and putting a hand up with an answer ready",
            text: [
              "Some facts you can just remember, without counting. We say you know them by heart.",
              "When you know double 4 is 8 by heart, you can say it quick as a flash.",
            ],
          },
          {
            heading: "A little every day",
            picture: "/lessons/doubles-and-bonds/lesson-6-2.jpg",
            alt: "A child and a grown-up pairing socks from a laundry basket",
            text: [
              "The best way to remember facts is to practise a little bit, lots of times.",
              "Say your doubles while you pair socks. Say bonds to 10 while you walk to the park or tidy up toys.",
            ],
          },
          {
            heading: "Games to play",
            picture: "/lessons/doubles-and-bonds/lesson-6-3.jpg",
            alt: "A child and a grown-up throwing a rolled-up pair of socks to each other in a garden",
            text: [
              "Play bond ping-pong. Your grown-up says 3. You say 7, because 3 and 7 make 10.",
              "Play double clap. Your grown-up claps 4 times. You say double 4 is 8. It is fine to count at first. You will get faster!",
            ],
          },
        ],
        words: [
          { word: "by heart", meaning: "remembered so well you don't need to count" },
          { word: "recall", meaning: "bring a fact back into your head" },
          { word: "practise", meaning: "do something again and again to get better" },
        ],
      },
      practice: {
        intro: "Quick as a flash! How fast can you answer?",
        questions: [
          { type: "match", q: "Match each double to its answer.", pairs: [["Double 4", "8"], ["Double 5", "10"], ["Double 3", "6"]] },
          { type: "type", q: "Quick! How many more counters make 10?", visual: { kind: "tenframe", filled: 9 }, answer: ["1", "one"] },
          { type: "choice", q: "What goes with 12 to make 20?", options: ["8", "6", "10"], answer: 0 },
          { type: "choice", q: "Quick! Which double is this?", visual: { kind: "dots", rows: 2, cols: 4 }, options: ["Double 2", "Double 4", "Double 8"], answer: 1 },
        ],
      },
      task: {
        title: "Sock ball ping-pong",
        intro: "Throw a sock ball and shout out the answers.",
        need: ["A pair of socks rolled into a ball", "Space to throw, inside or in the garden", "A grown-up to play with"],
        steps: [
          "Stand facing your grown-up.",
          "Your grown-up says a number from 0 to 10 and throws you the sock ball.",
          "Catch it and say the number that goes with it to make 10. Throw it back.",
          "Now play doubles: your grown-up says 3, you say 6.",
          "Swap. You say the numbers and your grown-up answers. Then try bonds to 20.",
        ],
      },
      exit: [
        { type: "type", q: "What is double 3?", answer: ["6", "six"] },
        { type: "type", q: "What goes with 4 to make 10?", answer: ["6", "six"] },
        { type: "choice", q: "What is 4 + 5?", options: ["8", "9", "10"], answer: 1 },
        { type: "choice", q: "What goes with 17 to make 20?", options: ["3", "7", "13"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "5 + 3 = 8, so 8 − 3 = ___", bank: ["3", "5", "11"], answers: ["5"] },
        { type: "type", q: "What is 2 + 2 + 6?", answer: ["10", "ten"] },
      ],
      grownUp: {
        need: ["A pair of socks rolled into a ball"],
        tips: [
          "Little and often works best. Five minutes of quick games most days beats one long sit-down session.",
          "Accuracy comes before speed. If they still need fingers or counting, that is fine. Praise them when they just know one.",
        ],
        younger: "Play with doubles of 1 to 5 and bonds to 5 only, and roll the ball instead of throwing it.",
        older: "Mix in bonds to 20 and doubles up to double 10, and count how many they get right in a minute.",
      },
    },
  ],
};
