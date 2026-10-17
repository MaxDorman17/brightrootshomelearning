import type { LessonUnit } from "@/lib/lessons";

/** Length and height in centimetres, for ages 5 to 7. Comparing tall and short, long and short, measuring with hands and feet, then using a ruler, counting centimetres and measuring autumn leaves. */
export const lengthAndHeight: LessonUnit = {
  slug: "length-and-height",
  title: "Length and height in centimetres",
  short: "Length",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "📏",
  color: "#2F5D3A",
  summary: "Six lessons: comparing tall and short, long and short, measuring with hands and feet, using a ruler, counting centimetres, and measuring autumn leaves.",
  cover: "/lessons/units/length-and-height.jpg",
  lessons: [
    {
      slug: "length-and-height-1",
      title: "Tall and short",
      emoji: "🦒",
      minutes: 30,
      goal: "I can say which thing is taller or shorter, and put things in order of height.",
      starter: [
        { type: "choice", q: "Which is bigger?", options: ["A mouse", "An elephant"], answer: 1 },
        { type: "choice", q: "Which is taller?", options: ["A tree", "A flower"], answer: 0 },
        { type: "choice", q: "Who is usually taller?", options: ["A baby", "A grown-up"], answer: 1 },
        { type: "type", q: "Count the dots. How many are there?", visual: { kind: "dots", rows: 2, cols: 4 }, answer: ["8", "eight"] },
        {
          type: "pick",
          q: "Which of these are tall? There is more than one.",
          options: ["A giraffe", "A ladybird", "A lamp post", "A house"],
          answers: [0, 2, 3],
        },
        { type: "order", q: "Put these numbers from smallest to biggest.", items: ["2", "5", "7", "9"] },
      ],
      learn: {
        cards: [
          {
            heading: "Tall and short",
            picture: "/lessons/length-and-height/lesson-1-1.jpg",
            alt: "A child standing next to a tall sunflower and a short pumpkin in a garden",
            text: [
              "Height is how tall something is, from the bottom to the top.",
              "Something tall reaches up high, like a tree or a giraffe. Something short stays low, like a mushroom or a cat.",
            ],
          },
          {
            heading: "Taller and shorter",
            picture: "/lessons/length-and-height/lesson-1-2.jpg",
            alt: "Two children standing back to back while a grown-up checks who is taller",
            text: [
              "To compare two things, stand them side by side on the same flat floor.",
              "The one that reaches higher is taller. The other one is shorter.",
              "Stand back to back with someone. Who is taller? Who is shorter?",
            ],
          },
          {
            heading: "Tallest and shortest",
            picture: "/lessons/length-and-height/lesson-1-3.jpg",
            alt: "Three toy towers of different heights lined up on a table",
            text: [
              "When we compare three or more things, the one that reaches highest is the tallest.",
              "The one that is lowest is the shortest. We can line them up from shortest to tallest.",
            ],
          },
        ],
        words: [
          { word: "height", meaning: "how tall something is, from bottom to top" },
          { word: "taller", meaning: "reaches higher than the other one" },
          { word: "shorter", meaning: "does not reach as high as the other one" },
        ],
      },
      practice: {
        intro: "Let's compare how tall things are.",
        questions: [
          { type: "choice", q: "Which is taller?", options: ["A door", "A cup"], answer: 0 },
          { type: "choice", q: "Which is shorter?", options: ["A giraffe", "A rabbit"], answer: 1 },
          { type: "order", q: "Put these from shortest to tallest.", items: ["A mouse", "A dog", "A horse", "A giraffe"] },
          {
            type: "choice",
            q: "Tower A has 3 blocks. Tower B has 7 blocks. The blocks are all the same size. Which tower is taller?",
            visual: { kind: "dots", rows: 1, cols: 7 },
            options: ["Tower A", "Tower B"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Tower building",
        intro: "Build towers and put them in order of height.",
        need: ["Building blocks, tins or plastic cups", "A flat floor or table", "A grown-up to help"],
        steps: [
          "Build three towers. Make one tall, one short and one in the middle.",
          "Line them up side by side on the floor.",
          "Point to the tallest tower. Then point to the shortest.",
          "Now find a toy. Is it taller or shorter than your middle tower?",
        ],
      },
      exit: [
        { type: "choice", q: "Which is taller?", options: ["A tree", "A daisy"], answer: 0 },
        { type: "choice", q: "Which is shorter?", options: ["A cat", "A lamp post"], answer: 0 },
        { type: "choice", q: "What does height tell us?", options: ["How heavy something is", "How tall something is"], answer: 1 },
        { type: "choice", q: "To compare heights fairly, the things should stand...", options: ["on the same flat floor", "one on a chair and one on the floor"], answer: 0 },
        { type: "order", q: "Put these from shortest to tallest.", items: ["An acorn", "A child", "A grown-up", "An oak tree"] },
        { type: "gap", q: "Fill the gap.", text: "A giraffe is ___ than a mouse.", bank: ["taller", "shorter"], answers: ["taller"] },
      ],
      grownUp: {
        need: ["Building blocks, tins or plastic cups"],
        tips: [
          "Use the words taller, shorter, tallest and shortest a lot. Children often say 'bigger' and 'smaller', so gently swap in the height words.",
          "Check the bottoms line up. Comparing is only fair when both things start from the same place.",
        ],
        younger: "Just compare two towers and say which one is taller.",
        older: "Build four or five towers, put them in order, then count the blocks in each to check.",
      },
    },
    {
      slug: "length-and-height-2",
      title: "Long and short",
      emoji: "🐍",
      minutes: 30,
      goal: "I can say which thing is longer or shorter, and put things in order of length.",
      starter: [
        { type: "choice", q: "Which is taller?", options: ["A house", "A dog"], answer: 0 },
        { type: "choice", q: "Which is shorter?", options: ["A giraffe", "A hedgehog"], answer: 1 },
        { type: "choice", q: "What does height tell us?", options: ["How tall something is", "What colour it is"], answer: 0 },
        { type: "order", q: "Put these from shortest to tallest.", items: ["A mouse", "A cat", "A horse"] },
        { type: "gap", q: "Fill the gap.", text: "The tower that reaches highest is the ___.", bank: ["tallest", "shortest"], answers: ["tallest"] },
        { type: "choice", q: "To compare heights fairly, the things should start...", options: ["in the same place", "in different places"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Long and short",
            picture: "/lessons/length-and-height/lesson-2-1.jpg",
            alt: "A child holding a long scarf next to a short sock on a bed",
            text: [
              "Length is how long something is, from one end to the other.",
              "A scarf is long. A sock is short. A train is long. A car is short.",
            ],
          },
          {
            heading: "Line up the ends",
            picture: "/lessons/length-and-height/lesson-2-2.jpg",
            alt: "Two children lining up two sticks on a path so the ends touch the same line",
            text: [
              "To compare two lengths, line them up so one end of each starts in the same place.",
              "Then look at the other end. The one that sticks out further is longer.",
            ],
          },
          {
            heading: "Longest and shortest",
            picture: "/lessons/length-and-height/lesson-2-3.jpg",
            alt: "Three ribbons of different lengths laid out on a table",
            text: [
              "With three or more things, the one that goes furthest is the longest. The one that goes least far is the shortest.",
              "Tall and short are for things standing up. Long and short are for things lying down or going along.",
            ],
          },
        ],
        words: [
          { word: "length", meaning: "how long something is, from one end to the other" },
          { word: "longer", meaning: "goes further than the other one" },
          { word: "longest", meaning: "goes the furthest of them all" },
        ],
      },
      practice: {
        intro: "Let's compare how long things are.",
        questions: [
          { type: "choice", q: "Which is longer?", options: ["A bus", "A bike"], answer: 0 },
          { type: "choice", q: "Which is shorter?", options: ["A pencil", "A broom"], answer: 0 },
          { type: "order", q: "Put these from shortest to longest.", items: ["A paper clip", "A spoon", "A scarf", "A train"] },
          {
            type: "choice",
            q: "One snake is 4 conkers long. The other is 9 conkers long. Which snake is longer?",
            visual: { kind: "dots", rows: 1, cols: 9 },
            options: ["The 4 conker snake", "The 9 conker snake"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Long and short hunt",
        intro: "Find long and short things around your home.",
        need: ["A piece of string or a shoelace", "Things from around your home", "A grown-up to help"],
        steps: [
          "Hold up your string. This is your measuring string.",
          "Find something longer than your string and something shorter.",
          "Lay them on the floor. Line up one end of each with one end of the string.",
          "Put everything in order, from shortest to longest.",
        ],
      },
      exit: [
        { type: "choice", q: "Which is longer?", options: ["A snake", "A worm"], answer: 0 },
        { type: "choice", q: "Which is shorter?", options: ["A sock", "A scarf"], answer: 0 },
        { type: "choice", q: "What does length tell us?", options: ["How long something is", "How loud something is"], answer: 0 },
        { type: "choice", q: "To compare two lengths, first...", options: ["line up one end of each", "put them far apart"], answer: 0 },
        { type: "order", q: "Put these from shortest to longest.", items: ["An ant", "A leaf", "A stick", "A tree branch"] },
        { type: "gap", q: "Fill the gap.", text: "A train is ___ than a car.", bank: ["longer", "shorter"], answers: ["longer"] },
      ],
      grownUp: {
        need: ["A piece of string, ribbon or a shoelace"],
        tips: [
          "The most important idea today is lining up the ends. Try comparing two pencils with the ends not lined up and ask whether that is fair.",
          "Height and length are both measuring, just in different directions. Laying a toy down turns its height into a length.",
        ],
        younger: "Just compare two things at a time and say which is longer.",
        older: "Cut three pieces of string and ask your child to find one thing that matches each length exactly.",
      },
    },
    {
      slug: "length-and-height-3",
      title: "Measuring with hands and feet",
      emoji: "✋",
      minutes: 30,
      goal: "I can measure how long something is by counting hand spans, footsteps or blocks.",
      starter: [
        { type: "choice", q: "Which is longer?", options: ["A train", "A car"], answer: 0 },
        { type: "choice", q: "Which is taller?", options: ["A lamp post", "A cat"], answer: 0 },
        { type: "choice", q: "To compare two lengths, first...", options: ["line up one end of each", "put them far apart"], answer: 0 },
        { type: "order", q: "Put these from shortest to longest.", items: ["A paper clip", "A pencil", "A broom"] },
        { type: "gap", q: "Fill the gap.", text: "A sock is ___ than a scarf.", bank: ["longer", "shorter"], answers: ["shorter"] },
        { type: "type", q: "Count the dots. How many are there?", visual: { kind: "tenframe", filled: 6 }, answer: ["6", "six"] },
      ],
      learn: {
        cards: [
          {
            heading: "Measuring means counting",
            picture: "/lessons/length-and-height/lesson-3-1.jpg",
            alt: "A child measuring a table by putting hand spans along its edge",
            text: [
              "When we measure, we find out how long or tall something is by counting.",
              "Spread your hand wide. This is a hand span. Put your hand spans along a table, one after another, and count them.",
            ],
          },
          {
            heading: "No gaps, no overlaps",
            picture: "/lessons/length-and-height/lesson-3-2.jpg",
            alt: "A child walking heel to toe across a rug, counting footsteps",
            text: [
              "Start right at one end. Put each hand or foot right next to the last one.",
              "Don't leave gaps. Don't let them overlap. Keep going until you reach the other end.",
              "Walk heel to toe across a rug to count how many feet long it is.",
            ],
          },
          {
            heading: "Different hands, different answers",
            picture: "/lessons/length-and-height/lesson-3-3.jpg",
            alt: "A grown-up and a child each measuring the same table with their hand spans",
            text: [
              "A grown-up's hand is bigger than yours. So a table might be 4 of their hand spans, but 6 of yours.",
              "If we all use the same thing, like blocks that are all the same size, we get the same answer.",
            ],
          },
        ],
        words: [
          { word: "measure", meaning: "find out how long or tall something is" },
          { word: "hand span", meaning: "the width of your hand stretched out wide" },
          { word: "gap", meaning: "an empty space between two things" },
        ],
      },
      practice: {
        intro: "Let's count and measure.",
        questions: [
          { type: "type", q: "A book is as long as these blocks. How many blocks long is it?", visual: { kind: "dots", rows: 1, cols: 5 }, answer: ["5", "five"], after: "blocks" },
          { type: "choice", q: "When you measure with hand spans, should you leave gaps?", options: ["Yes", "No"], answer: 1 },
          { type: "choice", q: "A rug is 7 of Sam's feet long. A mat is 3 of Sam's feet long. Which is longer?", options: ["The rug", "The mat"], answer: 0 },
          {
            type: "choice",
            q: "Mum and Ava measure the same table with hand spans. Mum gets 4. Ava gets 6. Why?",
            options: ["Mum's hands are bigger", "The table grew"],
            answer: 0,
          },
        ],
      },
      task: {
        title: "Hands and feet measuring",
        intro: "Measure things around your home with your hands and feet.",
        need: ["Your hands and feet", "A table, a bed and a rug or a hallway", "Paper and a pencil", "A grown-up to help"],
        steps: [
          "Measure the table with hand spans. Count them and write or draw the number.",
          "Walk heel to toe along the rug or hallway. How many footsteps long is it?",
          "Ask your grown-up to measure the same table with their hand spans.",
          "Did you get the same number? Who got more? Why do you think that is?",
        ],
      },
      exit: [
        { type: "choice", q: "What does measure mean?", options: ["Find out how long or tall something is", "Colour something in"], answer: 0 },
        { type: "type", q: "A pencil is as long as these cubes. How many cubes long is it?", visual: { kind: "dots", rows: 1, cols: 8 }, answer: ["8", "eight"], after: "cubes" },
        { type: "choice", q: "When you measure, your hands or feet should...", options: ["leave gaps", "overlap", "touch, with no gaps and no overlaps"], answer: 2 },
        { type: "choice", q: "A path is 9 footsteps long. A doormat is 2 footsteps long. Which is shorter?", options: ["The path", "The doormat"], answer: 1 },
        { type: "choice", q: "Who will need more hand spans to measure the same table?", options: ["Someone with small hands", "Someone with big hands"], answer: 0 },
        { type: "choice", q: "How can we all get the same answer?", options: ["Use things that are all the same size", "Use our own hands"], answer: 0 },
      ],
      grownUp: {
        need: ["Somewhere to walk heel to toe, like a hallway or rug", "Paper and a pencil"],
        tips: [
          "Measuring with hands and feet shows why we need the same unit for everyone. The puzzle of getting different answers is the whole point, so let your child notice it.",
          "Watch for gaps and overlaps. Lining up hands or blocks carefully is the skill they will need with a ruler.",
        ],
        younger: "Measure just one thing with blocks or bricks, counting together as you place each one.",
        older: "Measure the same thing with hand spans, footsteps and blocks. Which gives the biggest number? Why?",
      },
    },
    {
      slug: "length-and-height-4",
      title: "Using a ruler",
      emoji: "📏",
      minutes: 30,
      goal: "I can use a ruler to measure something in centimetres, starting at 0.",
      starter: [
        { type: "choice", q: "What does measure mean?", options: ["Find out how long or tall something is", "Find out what colour it is"], answer: 0 },
        { type: "type", q: "A spoon is as long as these blocks. How many blocks long is it?", visual: { kind: "dots", rows: 1, cols: 6 }, answer: ["6", "six"], after: "blocks" },
        { type: "choice", q: "When you measure with blocks, should they overlap?", options: ["Yes", "No"], answer: 1 },
        { type: "choice", q: "Who needs more hand spans to measure the same bed?", options: ["A child", "A grown-up"], answer: 0 },
        { type: "choice", q: "A rug is 8 footsteps long. A mat is 5 footsteps long. Which is longer?", options: ["The rug", "The mat"], answer: 0 },
        { type: "order", q: "Put these numbers from smallest to biggest.", items: ["0", "3", "6", "10"] },
      ],
      learn: {
        cards: [
          {
            heading: "Meet the ruler",
            picture: "/lessons/length-and-height/lesson-4-1.jpg",
            alt: "A child holding a wooden ruler and looking closely at the marks on it",
            text: [
              "A ruler helps us measure. It has marks along the edge, all the same distance apart.",
              "Each space between two marks is one centimetre. We write cm for short.",
              "A centimetre is about as wide as your little finger.",
            ],
          },
          {
            heading: "Start at zero",
            picture: "/lessons/length-and-height/lesson-4-2.jpg",
            alt: "A child lining up the end of a crayon with the start of a ruler",
            text: [
              "Find the 0 on your ruler. It might be a little way in from the end.",
              "Put one end of the thing you are measuring right on the 0 mark.",
              "Lay the ruler flat and straight along it.",
            ],
          },
          {
            heading: "Read the number",
            picture: "/lessons/length-and-height/lesson-4-3.jpg",
            alt: "A child pointing to where a crayon ends on a ruler",
            text: [
              "Look at the other end. Which mark does it reach? Read the number there.",
              "If a crayon starts at 0 and ends at 7, it is 7 centimetres long.",
            ],
          },
        ],
        words: [
          { word: "ruler", meaning: "a straight strip with marks for measuring" },
          { word: "centimetre", meaning: "a small length, about as wide as your little finger. We write cm" },
          { word: "zero", meaning: "the number 0, where you start measuring" },
        ],
      },
      practice: {
        intro: "Let's read the ruler.",
        questions: [
          { type: "choice", q: "Where do you start measuring on a ruler?", options: ["At 0", "At 1", "At the end of the ruler"], answer: 0 },
          { type: "type", q: "A crayon starts at 0 and ends at 5. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 5] }, answer: ["5", "five"], after: "cm" },
          { type: "type", q: "A twig starts at 0 and ends at 9. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 9] }, answer: ["9", "nine"], after: "cm" },
          { type: "gap", q: "Fill the gap.", text: "We write ___ for centimetres.", bank: ["cm", "kg", "p"], answers: ["cm"] },
        ],
      },
      task: {
        title: "Ruler explorer",
        intro: "Measure small things with a real ruler.",
        need: ["A ruler with centimetres on it", "Five small things, like a crayon, a spoon, a sock, a toy car and a button", "Paper and a pencil", "A grown-up to help"],
        steps: [
          "Find the 0 on your ruler.",
          "Put one end of the crayon on the 0. Keep the ruler flat and straight.",
          "Look at the other end. Read the number and say it with 'centimetres' after it.",
          "Measure the other things the same way. Write or draw each one with its length.",
          "Which was the longest? Which was the shortest?",
        ],
      },
      exit: [
        { type: "choice", q: "What do we use a ruler for?", options: ["Measuring", "Painting"], answer: 0 },
        { type: "choice", q: "Where should one end of the thing be?", options: ["On the 0 mark", "On the 5 mark"], answer: 0 },
        { type: "type", q: "A bead starts at 0 and ends at 3. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 3] }, answer: ["3", "three"], after: "cm" },
        { type: "type", q: "A toy car starts at 0 and ends at 8. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 8] }, answer: ["8", "eight"], after: "cm" },
        { type: "choice", q: "A centimetre is about as wide as...", options: ["your little finger", "a door"], answer: 0 },
        { type: "choice", q: "How should the ruler lie?", options: ["Flat and straight", "Bent and wobbly"], answer: 0 },
      ],
      grownUp: {
        need: ["A ruler marked in centimetres (a 15 cm or 30 cm ruler is ideal)", "Five small household objects"],
        tips: [
          "Many rulers have a small gap before the 0. The most common mistake is lining things up with the end of the ruler instead of the 0, so check this together.",
          "Choose things that are close to a whole number of centimetres at first. Say 'about' when something falls between two marks.",
        ],
        younger: "Measure just two or three things that are under 10 cm, and help your child find the number.",
        older: "Measure things up to 20 cm, then say which is longer and by how many centimetres.",
      },
    },
    {
      slug: "length-and-height-5",
      title: "Counting centimetres",
      emoji: "🔢",
      minutes: 30,
      goal: "I can count centimetres to find a length, and compare lengths in centimetres.",
      starter: [
        { type: "choice", q: "Where do you start measuring on a ruler?", options: ["At 0", "At 10"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "We write ___ for centimetres.", bank: ["cm", "p", "kg"], answers: ["cm"] },
        { type: "type", q: "A crayon starts at 0 and ends at 6. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 6] }, answer: ["6", "six"], after: "cm" },
        { type: "choice", q: "A centimetre is about as wide as...", options: ["a bed", "your little finger"], answer: 1 },
        { type: "choice", q: "How should the ruler lie?", options: ["Flat and straight", "Standing on its end"], answer: 0 },
        { type: "type", q: "A spoon starts at 0 and ends at 10. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 10] }, answer: ["10", "ten"], after: "cm" },
      ],
      learn: {
        cards: [
          {
            heading: "Counting the spaces",
            picture: "/lessons/length-and-height/lesson-5-1.jpg",
            alt: "A child counting along a ruler with a finger, next to a short carrot",
            text: [
              "Each space on the ruler is 1 centimetre. When we measure, we count the spaces, not the lines.",
              "Put your finger on 0. Hop along one space at a time and count: 1, 2, 3...",
            ],
          },
          {
            heading: "Which is longer?",
            picture: "/lessons/length-and-height/lesson-5-2.jpg",
            alt: "Two pencils of different lengths lying next to a ruler on a table",
            text: [
              "A pencil is 12 cm long. A crayon is 8 cm long.",
              "12 is more than 8, so the pencil is longer. The bigger number means the longer thing.",
            ],
          },
          {
            heading: "How much longer?",
            picture: "/lessons/length-and-height/lesson-5-3.jpg",
            alt: "A child counting on from the end of a short ribbon to the end of a longer one",
            text: [
              "A ribbon is 7 cm. Another is 10 cm. How much longer is the second one?",
              "Start at 7 and count on to 10: 8, 9, 10. That is 3 more. The second ribbon is 3 cm longer.",
            ],
          },
        ],
        words: [
          { word: "cm", meaning: "short for centimetre" },
          { word: "count on", meaning: "start at one number and count forward" },
          { word: "compare", meaning: "look at two things to see how they are different" },
        ],
      },
      practice: {
        intro: "Let's count and compare centimetres.",
        questions: [
          { type: "choice", q: "A stick is 14 cm. A leaf is 9 cm. Which is longer?", options: ["The stick", "The leaf"], answer: 0 },
          { type: "type", q: "A worm goes from 0 to 4 on the ruler. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 4] }, answer: ["4", "four"], after: "cm" },
          { type: "order", q: "Put these lengths from shortest to longest.", items: ["3 cm", "8 cm", "11 cm", "15 cm"] },
          { type: "type", q: "A ribbon is 6 cm. Another is 9 cm. How many centimetres longer is the second ribbon? Count on from 6.", visual: { kind: "numberline", from: 0, to: 10, jump: [6, 9] }, answer: ["3", "three"], after: "cm" },
        ],
      },
      task: {
        title: "Paper snakes",
        intro: "Make paper snakes, measure them and compare.",
        need: ["Strips of paper", "Scissors and a grown-up to help", "A ruler with centimetres on it", "Crayons"],
        steps: [
          "Cut three paper strips: one short, one middle and one long. Your grown-up can help.",
          "Draw a face on one end of each strip to make a snake.",
          "Measure each snake with the ruler. Start at 0 and count the centimetres.",
          "Write each snake's length on its back.",
          "Which snake is longest? How many centimetres longer is it than the shortest one?",
        ],
      },
      exit: [
        { type: "choice", q: "When we measure, we count the...", options: ["spaces between the marks", "colours on the ruler"], answer: 0 },
        { type: "type", q: "A twig goes from 0 to 7 on the ruler. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 7] }, answer: ["7", "seven"], after: "cm" },
        { type: "choice", q: "A pencil is 15 cm. A crayon is 10 cm. Which is shorter?", options: ["The pencil", "The crayon"], answer: 1 },
        { type: "order", q: "Put these lengths from shortest to longest.", items: ["2 cm", "5 cm", "9 cm", "13 cm"] },
        { type: "type", q: "A sock is 8 cm. A glove is 10 cm. How many centimetres longer is the glove?", visual: { kind: "numberline", from: 0, to: 10, jump: [8, 10] }, answer: ["2", "two"], after: "cm" },
        { type: "choice", q: "Which number means the longer thing?", options: ["The bigger number", "The smaller number"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper strips", "Child-safe scissors", "A ruler marked in centimetres"],
        tips: [
          "Counting the spaces, not the lines, is a big idea. If your child starts counting at 1 on the 0 mark, they will get an answer one too big.",
          "Finding 'how much longer' is the same as finding a difference. Counting on from the smaller number is the easiest way at this age.",
        ],
        younger: "Keep all lengths under 10 cm and just say which snake is longer.",
        older: "Make a snake exactly 12 cm long without measuring first, then check. How close did you get?",
      },
    },
    {
      slug: "length-and-height-6",
      title: "Measuring autumn leaves",
      emoji: "🍂",
      minutes: 30,
      goal: "I can measure real leaves in centimetres and put them in order of length.",
      starter: [
        { type: "choice", q: "When we measure with a ruler, we count the...", options: ["spaces between the marks", "numbers we like"], answer: 0 },
        { type: "type", q: "A crayon goes from 0 to 9 on the ruler. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 9] }, answer: ["9", "nine"], after: "cm" },
        { type: "choice", q: "A stick is 12 cm. A twig is 7 cm. Which is longer?", options: ["The stick", "The twig"], answer: 0 },
        { type: "order", q: "Put these lengths from shortest to longest.", items: ["4 cm", "6 cm", "10 cm", "14 cm"] },
        { type: "type", q: "A ribbon is 5 cm. Another is 8 cm. How many centimetres longer is the second ribbon?", visual: { kind: "numberline", from: 0, to: 10, jump: [5, 8] }, answer: ["3", "three"], after: "cm" },
        { type: "choice", q: "Where do you start measuring on a ruler?", options: ["At 1", "At 0"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Collecting leaves",
            picture: "/lessons/length-and-height/lesson-6-1.jpg",
            alt: "Two children and a grown-up collecting fallen autumn leaves in a park",
            text: [
              "In autumn, lots of leaves fall from the trees. They can be red, orange, yellow and brown.",
              "Leaves come in all sizes. Some are tiny and some are as big as your hand, or even bigger.",
              "Pick up leaves from the ground. Leave the ones still on the trees.",
            ],
          },
          {
            heading: "Measuring a leaf",
            picture: "/lessons/length-and-height/lesson-6-2.jpg",
            alt: "A child lining up the bottom of a leaf stalk with the start of a ruler",
            text: [
              "Lay the leaf flat. Put the bottom of the stalk on the 0 of the ruler.",
              "Look at the tip of the leaf. Read the number it reaches. That is how long your leaf is.",
              "If the tip is between two numbers, say the one it is closest to.",
            ],
          },
          {
            heading: "A leaf line",
            picture: "/lessons/length-and-height/lesson-6-3.jpg",
            alt: "A row of autumn leaves laid out on a table from smallest to biggest",
            text: [
              "Once you have measured your leaves, line them up from shortest to longest.",
              "Which leaf is the longest? Which is the shortest? How many centimetres longer is the longest one?",
            ],
          },
        ],
        words: [
          { word: "stalk", meaning: "the thin stick that joins a leaf to a tree" },
          { word: "tip", meaning: "the pointy end of a leaf" },
          { word: "about", meaning: "close to, but not exactly" },
        ],
      },
      practice: {
        intro: "Let's measure some leaves.",
        questions: [
          { type: "type", q: "A leaf goes from 0 to 8 on the ruler. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 8] }, answer: ["8", "eight"], after: "cm" },
          { type: "choice", q: "Where should the bottom of the stalk go?", options: ["On the 0", "On the 10"], answer: 0 },
          { type: "order", q: "Put these leaves from shortest to longest.", items: ["A 5 cm leaf", "A 7 cm leaf", "A 12 cm leaf", "A 16 cm leaf"] },
          { type: "choice", q: "A leaf tip is between 5 and 6, very close to 6. About how long is the leaf?", options: ["About 6 cm", "About 2 cm"], answer: 0 },
        ],
      },
      task: {
        title: "Leaf measuring",
        intro: "Collect autumn leaves, measure them and make a leaf line.",
        need: ["A grown-up to go with you", "A bag for leaves", "A ruler with centimetres on it", "Paper and a pencil"],
        steps: [
          "Go outside with your grown-up and collect five fallen leaves of different sizes.",
          "At home, lay one leaf flat. Put the bottom of the stalk on the 0.",
          "Read the number at the tip. Write it next to the leaf, or on a sticky note.",
          "Measure all five leaves.",
          "Line them up from shortest to longest. Which is longest? Which is shortest?",
          "Wash your hands when you have finished.",
        ],
      },
      exit: [
        { type: "type", q: "A leaf goes from 0 to 6 on the ruler. How long is it?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 6] }, answer: ["6", "six"], after: "cm" },
        { type: "choice", q: "Which leaf is longer?", options: ["A 9 cm leaf", "A 13 cm leaf"], answer: 1 },
        { type: "order", q: "Put these leaves from shortest to longest.", items: ["A 3 cm leaf", "An 8 cm leaf", "An 11 cm leaf", "A 15 cm leaf"] },
        { type: "choice", q: "Where should the bottom of the stalk go?", options: ["On the 0 of the ruler", "Anywhere on the ruler"], answer: 0 },
        { type: "type", q: "One leaf is 7 cm. Another is 10 cm. How many centimetres longer is the second leaf?", visual: { kind: "numberline", from: 0, to: 10, jump: [7, 10] }, answer: ["3", "three"], after: "cm" },
        { type: "match", q: "Match each word to what it means.", pairs: [["Tip", "The pointy end of a leaf"], ["Stalk", "Joins the leaf to the tree"], ["cm", "Centimetre"]] },
      ],
      grownUp: {
        need: ["A park, garden or street with fallen leaves", "A ruler marked in centimetres", "A bag for collecting"],
        tips: [
          "Stay with your child outside and keep away from roads. Only collect fallen leaves, avoid anything mushy or mouldy, and wash hands afterwards.",
          "Real leaves rarely land on a whole number. This is a good chance to use 'about' and 'nearly', which is how real measuring works.",
        ],
        younger: "Collect three leaves, measure together and just say which is longest.",
        older: "Measure ten leaves and make a simple chart, or find two leaves whose lengths add up to 20 cm.",
      },
    },
  ],
};
