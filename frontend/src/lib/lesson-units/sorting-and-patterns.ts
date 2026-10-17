import type { LessonUnit } from "@/lib/lessons";

/** Sorting and patterns, for ages 5 to 7. Sorting things by colour, by size and by two rules at once, then repeating colour, shape and sound patterns, growing patterns, and making a pattern of your own. */
export const sortingAndPatterns: LessonUnit = {
  slug: "sorting-and-patterns",
  title: "Sorting and patterns",
  short: "Patterns",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "🔁",
  color: "#2F5D3A",
  summary: "Six lessons: sorting things by colour and size, then by two rules, then repeating colour, shape and sound patterns, growing patterns, and making a pattern of your own.",
  cover: "/lessons/units/sorting-and-patterns.jpg",
  lessons: [
    {
      slug: "sorting-and-patterns-1",
      title: "Sorting by colour and size",
      emoji: "🍂",
      minutes: 30,
      goal: "I can sort things into groups by their colour or by their size.",
      starter: [
        { type: "choice", q: "What colour is a ripe tomato?", options: ["Red", "Blue"], answer: 0 },
        { type: "choice", q: "Which is bigger?", options: ["A mouse", "An elephant"], answer: 1 },
        { type: "type", q: "Each dot is a conker. How many conkers are there?", visual: { kind: "tenframe", filled: 4 }, answer: ["4", "four"] },
        {
          type: "pick",
          q: "Which of these are colours? There is more than one.",
          options: ["Red", "Spoon", "Yellow", "Green"],
          answers: [0, 2, 3],
        },
        { type: "match", q: "Match each thing to its colour.", pairs: [["Grass", "Green"], ["A clear sky", "Blue"], ["A banana", "Yellow"]] },
        { type: "choice", q: "Which is smaller?", options: ["A tree", "A leaf"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is sorting?",
            picture: "/lessons/sorting-and-patterns/lesson-1-1.jpg",
            alt: "A child tidying toys into different boxes on a bedroom floor",
            text: [
              "Sorting means putting things into groups. Everything in a group is the same in some way.",
              "You sort when you tidy up. Cars go in one box, teddies in another, and books on the shelf.",
            ],
          },
          {
            heading: "Sorting by colour",
            picture: "/lessons/sorting-and-patterns/lesson-1-2.jpg",
            alt: "Two children sorting red, yellow and brown autumn leaves into three piles",
            text: [
              "We can sort by colour. All the red things go together. All the yellow things go together.",
              "Look at these autumn leaves. One pile is red, one pile is yellow and one pile is brown.",
              "Once things are sorted, it is easy to count each group.",
            ],
          },
          {
            heading: "Sorting by size",
            picture: "/lessons/sorting-and-patterns/lesson-1-3.jpg",
            alt: "A child putting big apples in one bowl and small apples in another",
            text: [
              "We can sort by size too. Big things go in one group. Small things go in another.",
              "These apples are all green, but some are big and some are small. So we sort them by size.",
            ],
          },
        ],
        words: [
          { word: "sort", meaning: "put things into groups that are the same in some way" },
          { word: "group", meaning: "some things that go together" },
          { word: "size", meaning: "how big or small something is" },
        ],
      },
      practice: {
        intro: "Let's sort some things by colour and by size.",
        questions: [
          { type: "choice", q: "Which leaf goes in the red group?", options: ["A red leaf", "A green leaf", "A yellow leaf"], answer: 0 },
          {
            type: "pick",
            q: "Which go in the yellow group? There is more than one.",
            options: ["A banana", "A lemon", "A strawberry", "A sunflower"],
            answers: [0, 1, 3],
          },
          { type: "order", q: "Put these from smallest to biggest.", items: ["An ant", "A cat", "A horse"] },
          { type: "type", q: "Each dot is a blue button. How many blue buttons are in the group?", visual: { kind: "tenframe", filled: 5 }, answer: ["5", "five"] },
        ],
      },
      task: {
        title: "Sock and toy sort",
        intro: "Sort real things into groups, first by colour and then by size.",
        need: ["A pile of clean socks from the washing basket", "About ten small toys or teddies", "A grown-up to help"],
        steps: [
          "Tip the socks out on the floor. Sort them into colour groups.",
          "Count the socks in each group. Which colour has the most?",
          "Now mix up the toys. Sort them into a big group and a small group.",
          "Can you line up the toys from smallest to biggest?",
        ],
      },
      exit: [
        { type: "choice", q: "What does sort mean?", options: ["Put things into groups that are the same in some way", "Throw things away"], answer: 0 },
        { type: "choice", q: "A red apple, a red sock and a red car. How are they the same?", options: ["They are all red", "They are all big"], answer: 0 },
        { type: "choice", q: "Which one does not belong in the green group?", options: ["Grass", "A pea", "A carrot"], answer: 2 },
        { type: "order", q: "Put these from smallest to biggest.", items: ["A pea", "An apple", "A pumpkin"] },
        { type: "type", q: "Each dot is a big leaf. How many big leaves are in the group?", visual: { kind: "tenframe", filled: 6 }, answer: ["6", "six"] },
        { type: "gap", q: "Fill the gap.", text: "Sorting by ___ puts big things in one group and small things in another.", bank: ["size", "colour", "smell"], answers: ["size"] },
      ],
      grownUp: {
        need: ["A basket of clean socks", "About ten small toys of different sizes"],
        tips: [
          "Let your child choose how to sort first, then ask them to explain their groups. There is often more than one right answer.",
          "Counting each group after sorting links this to number work. Ask 'Which group has more? How many more?'",
        ],
        younger: "Sort into just two groups, like red and not red, or big and small.",
        older: "Sort the socks by colour, then sort each colour group again by size, and count every group.",
      },
    },
    {
      slug: "sorting-and-patterns-2",
      title: "Sorting in two ways",
      emoji: "🧺",
      minutes: 30,
      goal: "I can sort the same things in different ways and use two rules at once.",
      starter: [
        { type: "choice", q: "What does sort mean?", options: ["Put things into groups", "Hide things"], answer: 0 },
        { type: "choice", q: "Which belongs in the red group?", options: ["A strawberry", "A banana"], answer: 0 },
        { type: "order", q: "Put these from smallest to biggest.", items: ["A button", "An apple", "A football"] },
        {
          type: "pick",
          q: "Which of these are green? There is more than one.",
          options: ["Grass", "A frog", "Snow", "A lettuce"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "Each dot is a small conker. How many small conkers are there?", visual: { kind: "tenframe", filled: 3 }, answer: ["3", "three"] },
        { type: "choice", q: "Putting things into big and small groups is sorting by...", options: ["size", "colour"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "One set, lots of ways",
            picture: "/lessons/sorting-and-patterns/lesson-2-1.jpg",
            alt: "A child looking at a mixed pile of red and blue balls, some big and some small",
            text: [
              "The same things can be sorted in different ways. Look at these balls.",
              "We can sort them by colour: red balls and blue balls. Or we can sort them by size: big balls and small balls.",
              "Each way is right. It depends on the rule we choose.",
            ],
          },
          {
            heading: "Yes and no groups",
            picture: "/lessons/sorting-and-patterns/lesson-2-2.jpg",
            alt: "Two hoops on the grass, one with red things in it and one with other colours",
            text: [
              "A rule tells us which group something goes in. The rule might be: is it red?",
              "If it is red, it goes in the yes hoop. If it is not red, it goes in the no hoop.",
            ],
          },
          {
            heading: "Two rules at once",
            picture: "/lessons/sorting-and-patterns/lesson-2-3.jpg",
            alt: "A child picking out a big red apple from a bowl of big and small red and green apples",
            text: [
              "Sometimes we use two rules at the same time. Can you find an apple that is big and red?",
              "It must be both. A small red apple does not fit. A big green apple does not fit either.",
            ],
          },
        ],
        words: [
          { word: "rule", meaning: "what decides which group something goes in" },
          { word: "both", meaning: "two things together, like big and red" },
          { word: "not", meaning: "the opposite, like not red" },
        ],
      },
      practice: {
        intro: "Let's use rules to sort.",
        questions: [
          { type: "choice", q: "A big red ball and a small red ball. How are they the same?", options: ["Colour", "Size"], answer: 0 },
          { type: "choice", q: "Which one is big and red?", options: ["A big red bus", "A small red ladybird", "A big yellow bus"], answer: 0 },
          {
            type: "pick",
            q: "The rule is: not red. Pick everything that fits. There is more than one.",
            options: ["A blue sock", "A red apple", "A green leaf", "A yellow duck"],
            answers: [0, 2, 3],
          },
          {
            type: "match",
            q: "Match each thing to its group.",
            pairs: [["A small yellow duck", "Small and yellow"], ["A big blue ball", "Big and blue"], ["A small blue button", "Small and blue"]],
          },
        ],
      },
      task: {
        title: "Sort it again",
        intro: "Sort one pile of things in lots of different ways.",
        need: ["About twelve things from around the home, like socks, toys, spoons, leaves or pine cones", "Two scarves or pieces of string to make two rings on the floor", "A grown-up to help"],
        steps: [
          "Make two rings on the floor with the scarves or string.",
          "Sort your things by colour. Then mix them up.",
          "Sort them again by size. Then mix them up.",
          "Your grown-up says a rule, like 'Is it soft?' Put yes things in one ring and no things in the other.",
          "Now try two rules: can you find things that are small and brown?",
        ],
      },
      exit: [
        { type: "choice", q: "Can you sort the same things in more than one way?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "Which one is small and green?", options: ["A small green pea", "A big green tree", "A small red berry"], answer: 0 },
        { type: "choice", q: "The rule is: not round. Which one fits?", options: ["A ball", "An orange", "A book"], answer: 2 },
        {
          type: "pick",
          q: "The rule is: big. Pick everything that fits. There is more than one.",
          options: ["An elephant", "A bus", "An ant", "A house"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "Each dot is a small red button. How many are there?", visual: { kind: "dots", rows: 2, cols: 3 }, answer: ["6", "six"] },
        { type: "gap", q: "Fill the gap.", text: "A ___ tells us which group something goes in.", bank: ["rule", "song", "sock"], answers: ["rule"] },
      ],
      grownUp: {
        need: ["About twelve mixed household objects", "Two scarves, hoops or lengths of string"],
        tips: [
          "Ask 'What rule did I use?' after you sort something yourself. Guessing someone else's rule is great thinking.",
          "Two rules at once is tricky. Say both rules out loud and check each thing against them one at a time.",
        ],
        younger: "Stick to one rule at a time, with yes and no rings.",
        older: "Overlap the two rings to make a middle part for things that fit both rules, like red and soft.",
      },
    },
    {
      slug: "sorting-and-patterns-3",
      title: "Repeating colour patterns",
      emoji: "🔴",
      minutes: 30,
      goal: "I can spot, copy and carry on a repeating colour pattern.",
      starter: [
        { type: "choice", q: "Can you sort the same things in more than one way?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "Which one is big and yellow?", options: ["A big yellow bus", "A small yellow duck"], answer: 0 },
        {
          type: "pick",
          q: "The rule is: not red. Pick everything that fits. There is more than one.",
          options: ["A green leaf", "A red apple", "A blue sock", "A red berry"],
          answers: [0, 2],
        },
        { type: "gap", q: "Fill the gap.", text: "A ___ tells us which group something goes in.", bank: ["rule", "song", "sock"], answers: ["rule"] },
        { type: "type", q: "Each dot is a small conker. How many are there?", visual: { kind: "dots", rows: 2, cols: 4 }, answer: ["8", "eight"] },
        { type: "choice", q: "Putting things into red and blue groups is sorting by...", options: ["colour", "size"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "What is a pattern?",
            picture: "/lessons/sorting-and-patterns/lesson-3-1.jpg",
            alt: "A child laying red and yellow leaves in a long line on a garden path",
            text: [
              "A repeating pattern goes again and again in the same order.",
              "Red leaf, yellow leaf, red leaf, yellow leaf. Can you hear it repeat?",
              "Patterns are all around us, on jumpers, wrapping paper, fences and floors.",
            ],
          },
          {
            heading: "Find the part that repeats",
            picture: "/lessons/sorting-and-patterns/lesson-3-2.jpg",
            alt: "A child threading red and blue beads onto a string",
            text: [
              "Every pattern has a part that repeats. In red, red, blue, red, red, blue, the part is red, red, blue.",
              "Find the part that repeats, and you know the whole pattern.",
            ],
          },
          {
            heading: "What comes next?",
            picture: "/lessons/sorting-and-patterns/lesson-3-3.jpg",
            alt: "A child pointing along a row of coloured building bricks with a grown-up beside them",
            text: [
              "To find what comes next, point to each one and say it out loud.",
              "Green, orange, green, orange, green... The next one is orange!",
            ],
          },
        ],
        words: [
          { word: "pattern", meaning: "something that goes in the same order again and again" },
          { word: "repeat", meaning: "do or say the same thing again" },
          { word: "next", meaning: "the one that comes after" },
        ],
      },
      practice: {
        intro: "Let's look at some colour patterns.",
        questions: [
          { type: "choice", q: "What comes next? 🔴 🔵 🔴 🔵 🔴 ...", options: ["🔵", "🔴", "🟡"], answer: 0 },
          { type: "choice", q: "What comes next? 🟡 🟡 🟢 🟡 🟡 🟢 🟡 ...", options: ["🟢", "🟡"], answer: 1 },
          {
            type: "pick",
            q: "Which of these are repeating patterns? There is more than one.",
            options: ["🔴 🔵 🔴 🔵 🔴 🔵", "🟢 🟡 🔴 🔵 🟠 🟣", "🟡 🟢 🟡 🟢 🟡 🟢", "🔴 🔴 🔵 🔴 🔴 🔵"],
            answers: [0, 2, 3],
          },
          { type: "gap", q: "Fill the gaps.", text: "red, blue, red, blue, ___, ___", bank: ["red", "blue", "green"], answers: ["red", "blue"] },
        ],
      },
      task: {
        title: "A pattern path",
        intro: "Make a long colour pattern on the floor or outside.",
        need: ["Things in two or three colours, like leaves, socks, building bricks or coloured pegs", "A grown-up to help"],
        steps: [
          "Sort your things into colour groups first.",
          "Pick two colours. Lay them in a line: one of this colour, one of that colour, again and again.",
          "Point and say your pattern out loud as you go.",
          "Now try a harder one, like two red, one yellow, two red, one yellow.",
          "Ask your grown-up to carry on your pattern. Did they get it right?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a repeating pattern?", options: ["Something that goes again and again in the same order", "A pile of things all mixed up"], answer: 0 },
        { type: "choice", q: "What comes next? 🟢 🟠 🟢 🟠 🟢 ...", options: ["🟠", "🟢"], answer: 0 },
        { type: "choice", q: "What comes next? 🔴 🔴 🔵 🔴 🔴 🔵 🔴 🔴 ...", options: ["🔴", "🔵", "🟡"], answer: 1 },
        { type: "choice", q: "What is the part that repeats? 🟡 🟣 🟡 🟣 🟡 🟣", options: ["🟡 🟣", "🟡 🟡", "🟣 🟣"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "yellow, green, yellow, green, ___", bank: ["yellow", "green", "red"], answers: ["yellow"] },
        { type: "type", q: "How many red circles are in this pattern? 🔴 🔵 🔴 🔵 🔴 🔵", answer: ["3", "three"] },
      ],
      grownUp: {
        need: ["Small things in two or three colours: leaves, socks, bricks, pegs or pasta coloured with felt pen"],
        tips: [
          "Saying the pattern out loud as you point helps a lot. Children often hear a pattern before they can see it.",
          "If you use small things like beads or pegs, keep them away from babies and toddlers in the house.",
        ],
        younger: "Use just two colours in a simple one-then-one pattern, and make it with big things like socks.",
        older: "Try three colours, like red, yellow, blue, or a two-then-one pattern, and make it really long.",
      },
    },
    {
      slug: "sorting-and-patterns-4",
      title: "Shape and sound patterns",
      emoji: "👏",
      minutes: 30,
      goal: "I can make and carry on patterns with shapes, sounds and actions.",
      starter: [
        { type: "choice", q: "What is a repeating pattern?", options: ["Something that goes again and again in the same order", "Things all mixed up"], answer: 0 },
        { type: "choice", q: "What comes next? 🔴 🔵 🔴 🔵 ...", options: ["🔴", "🔵"], answer: 0 },
        { type: "choice", q: "What is the part that repeats? 🟢 🟢 🟡 🟢 🟢 🟡", options: ["🟢 🟢 🟡", "🟢 🟡"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "red, blue, red, ___", bank: ["blue", "red", "green"], answers: ["blue"] },
        {
          type: "pick",
          q: "Which of these are repeating patterns? There is more than one.",
          options: ["🟠 🟣 🟠 🟣 🟠 🟣", "🔴 🟢 🔵 🟡 🟠 🟣", "🟡 🟡 🔵 🟡 🟡 🔵"],
          answers: [0, 2],
        },
        { type: "type", q: "How many colours are in the part that repeats? 🔴 🔵 🟡 🔴 🔵 🟡", answer: ["3", "three"] },
      ],
      learn: {
        cards: [
          {
            heading: "Shape patterns",
            picture: "/lessons/sorting-and-patterns/lesson-4-1.jpg",
            alt: "A child laying paper circles and squares in a row on a kitchen table",
            text: [
              "Patterns can use shapes as well as colours. Circle, square, circle, square.",
              "Here is a trickier one: triangle, triangle, square, triangle, triangle, square.",
            ],
          },
          {
            heading: "Sound and action patterns",
            picture: "/lessons/sorting-and-patterns/lesson-4-2.jpg",
            alt: "Two children clapping and stamping in a living room",
            text: [
              "You can make a pattern with sounds. Clap, stamp, clap, stamp.",
              "You can make a pattern with actions too. Jump, sit, jump, sit.",
              "Listen carefully. What comes next?",
            ],
          },
          {
            heading: "The same pattern, a new way",
            picture: "/lessons/sorting-and-patterns/lesson-4-3.jpg",
            alt: "A child tapping a pan with a wooden spoon next to a row of red and blue bricks",
            text: [
              "Red, blue, red, blue goes the same way as clap, stamp, clap, stamp. One thing, then the other, again and again.",
              "So you can turn a colour pattern into a sound pattern. Clap for red and stamp for blue!",
            ],
          },
        ],
        words: [
          { word: "shape", meaning: "the outline of something, like a circle or a square" },
          { word: "sound pattern", meaning: "sounds that repeat in the same order" },
          { word: "beat", meaning: "a sound like a clap or a tap" },
        ],
      },
      practice: {
        intro: "Let's try shape and sound patterns.",
        questions: [
          { type: "choice", q: "What comes next? circle, square, circle, square, circle, ...", options: ["Square", "Triangle", "Circle"], answer: 0 },
          { type: "choice", q: "What comes next? clap, stamp, clap, stamp, clap, ...", options: ["Clap", "Stamp"], answer: 1 },
          {
            type: "match",
            q: "Match each colour pattern to the sound pattern that goes the same way.",
            pairs: [
              ["🔴 🔵 🔴 🔵", "clap, stamp, clap, stamp"],
              ["🔴 🔴 🔵 🔴 🔴 🔵", "clap, clap, stamp, clap, clap, stamp"],
              ["🔴 🔵 🔵 🔴 🔵 🔵", "clap, stamp, stamp, clap, stamp, stamp"],
            ],
          },
          { type: "gap", q: "Fill the gap.", text: "triangle, triangle, circle, triangle, triangle, ___", bank: ["circle", "square", "triangle"], answers: ["circle"] },
        ],
      },
      task: {
        title: "Pattern band",
        intro: "Make sound patterns and shape patterns at home.",
        need: ["A pan and a wooden spoon, or a box to tap", "Paper and child-safe scissors, or square and round things like coasters and lids", "A grown-up to help"],
        steps: [
          "Make a sound pattern: tap, clap, tap, clap. Can your grown-up copy it?",
          "Your grown-up makes a sound pattern. Join in when you know what comes next.",
          "Cut out paper circles and squares, or find round and square things.",
          "Lay them in a shape pattern. Then play it: clap for each circle and tap for each square.",
        ],
      },
      exit: [
        { type: "choice", q: "What comes next? square, triangle, square, triangle, ...", options: ["Square", "Circle"], answer: 0 },
        { type: "choice", q: "What comes next? stamp, stamp, clap, stamp, stamp, clap, stamp, ...", options: ["Clap", "Stamp"], answer: 1 },
        { type: "choice", q: "Which one is a sound pattern?", options: ["Clap, stamp, clap, stamp", "Red, blue, red, blue", "Circle, square, circle, square"], answer: 0 },
        { type: "choice", q: "Which colour pattern goes the same way as clap, stamp, clap, stamp?", options: ["🟢 🟡 🟢 🟡", "🟢 🟢 🟢 🟢", "🟢 🟡 🟡 🟢"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "circle, circle, square, circle, circle, ___", bank: ["square", "circle", "triangle"], answers: ["square"] },
        { type: "type", q: "The part that repeats is clap, clap, stamp. How many claps are in it?", answer: ["2", "two"] },
      ],
      grownUp: {
        need: ["A pan and wooden spoon, or a box to tap", "Paper, child-safe scissors, or round and square household things"],
        tips: [
          "Many songs and nursery rhymes have sound patterns. Clap along and talk about the parts that repeat.",
          "Seeing that red, blue matches clap, stamp is the big idea: the same pattern can be shown in different ways.",
        ],
        younger: "Stick to clap, stamp patterns and circle, square patterns, and do lots of copying.",
        older: "Make a three-part pattern, like clap, stamp, tap, and turn it into colours and shapes as well.",
      },
    },
    {
      slug: "sorting-and-patterns-5",
      title: "Growing patterns",
      emoji: "🧱",
      minutes: 30,
      goal: "I can spot a pattern that grows and say what comes next.",
      starter: [
        { type: "choice", q: "What comes next? clap, stamp, clap, ...", options: ["Stamp", "Clap"], answer: 0 },
        { type: "choice", q: "What comes next? circle, square, circle, square, ...", options: ["Square", "Circle"], answer: 1 },
        { type: "choice", q: "Which one is a shape pattern?", options: ["Clap, stamp, clap, stamp", "Circle, square, circle, square"], answer: 1 },
        {
          type: "match",
          q: "Match each colour pattern to the sound pattern that goes the same way.",
          pairs: [
            ["🔴 🔵 🔴 🔵", "clap, stamp, clap, stamp"],
            ["🔴 🔴 🔵 🔴 🔴 🔵", "clap, clap, stamp, clap, clap, stamp"],
          ],
        },
        { type: "gap", q: "Fill the gap.", text: "triangle, square, triangle, ___", bank: ["square", "triangle", "circle"], answers: ["square"] },
        { type: "type", q: "The part that repeats is clap, clap, stamp. How many claps are in it?", answer: ["2", "two"] },
      ],
      learn: {
        cards: [
          {
            heading: "Patterns that grow",
            picture: "/lessons/sorting-and-patterns/lesson-5-1.jpg",
            alt: "A child building a row of brick towers, each one a little taller than the last",
            text: [
              "Some patterns do not repeat. They grow instead.",
              "Look at these towers. The first has one brick. The next has two. Then three, then four.",
              "Each tower has one more brick than the one before.",
            ],
          },
          {
            heading: "Spot the jump",
            picture: "/lessons/sorting-and-patterns/lesson-5-2.jpg",
            alt: "Pairs of wellies lined up by a back door, a child counting them",
            text: [
              "To understand a growing pattern, count each step and see how much it grows.",
              "Wellies come in pairs. One pair is 2 boots, two pairs is 4, three pairs is 6. This pattern jumps by two each time.",
            ],
          },
          {
            heading: "What comes next?",
            picture: "/lessons/sorting-and-patterns/lesson-5-3.jpg",
            alt: "A child laying rows of conkers on a table, one more in each row",
            text: [
              "If you know how a pattern grows, you can say what comes next.",
              "Rows of 1, 2, 3, 4 conkers. Each row has one more, so the next row has 5.",
            ],
          },
        ],
        words: [
          { word: "grow", meaning: "get bigger or get more" },
          { word: "step", meaning: "one part of a growing pattern" },
          { word: "one more", meaning: "the number after, like 4 is one more than 3" },
        ],
      },
      practice: {
        intro: "Let's find out how these patterns grow.",
        questions: [
          { type: "type", q: "Step 1 has 1 conker, step 2 has 2 and step 3 has 3. Here is step 4. How many conkers?", visual: { kind: "dots", rows: 1, cols: 4 }, answer: ["4", "four"] },
          { type: "choice", q: "What comes next? 2, 4, 6, ...", visual: { kind: "numberline", from: 0, to: 10, jump: [4, 6] }, options: ["7", "8", "10"], answer: 1 },
          { type: "order", q: "Put the towers in a growing pattern, smallest first.", items: ["1 brick", "2 bricks", "3 bricks", "4 bricks"] },
          { type: "choice", q: "Which one is a growing pattern?", options: ["1, 2, 3, 4, 5", "3, 3, 3, 3, 3", "5, 1, 4, 2, 3"], answer: 0 },
        ],
      },
      task: {
        title: "Growing towers",
        intro: "Build a pattern that grows, and work out what comes next.",
        need: ["Building bricks, or tins and boxes from the cupboard", "Leaves, conkers or pasta shapes", "A grown-up to help"],
        steps: [
          "Build a tower of 1 brick. Next to it, build a tower of 2 bricks, then 3.",
          "Before you build the next one, guess how many bricks it needs. Build it to check.",
          "Now make rows on the table: 1 leaf, then 2 leaves, then 3 leaves.",
          "Count each row out loud. How many leaves will the next row have?",
        ],
      },
      exit: [
        { type: "type", q: "A pattern grows by one each time. Here is step 4. How many will step 5 have?", visual: { kind: "dots", rows: 1, cols: 4 }, answer: ["5", "five"] },
        { type: "choice", q: "What comes next? 5, 6, 7, ...", options: ["8", "9", "6"], answer: 0 },
        { type: "choice", q: "What comes next? 2, 4, 6, 8, ...", visual: { kind: "numberline", from: 0, to: 10, jump: [6, 8] }, options: ["9", "10", "12"], answer: 1 },
        { type: "choice", q: "In a growing pattern, each step...", options: ["gets more", "stays the same"], answer: 0 },
        { type: "order", q: "Put these in a growing pattern, smallest first.", items: ["1 leaf", "2 leaves", "3 leaves", "4 leaves"] },
        { type: "type", q: "Towers have 3, 4 and 5 bricks. Here is the tower of 5. How many bricks in the next tower?", visual: { kind: "tenframe", filled: 5 }, answer: ["6", "six"] },
      ],
      grownUp: {
        need: ["Building bricks, or tins and boxes", "Leaves, conkers or dried pasta"],
        tips: [
          "Ask 'How did it grow?' as well as 'What comes next?' Saying 'one more each time' is the key idea.",
          "Jumping in twos is a first step towards counting in twos. Wellies, socks and gloves are handy for this.",
        ],
        younger: "Build towers of 1, 2 and 3 only, and count each one together.",
        older: "Try patterns that grow by two (2, 4, 6, 8) or that shrink (5, 4, 3, 2), and say how they change.",
      },
    },
    {
      slug: "sorting-and-patterns-6",
      title: "Making my own pattern",
      emoji: "🎨",
      minutes: 30,
      goal: "I can make my own pattern, check it for mistakes and tell someone about it.",
      starter: [
        { type: "choice", q: "What comes next? 1, 2, 3, 4, ...", options: ["5", "6"], answer: 0 },
        { type: "choice", q: "What comes next? 2, 4, 6, ...", options: ["7", "8"], answer: 1 },
        { type: "choice", q: "Which one is a growing pattern?", options: ["4, 4, 4, 4", "1, 2, 3, 4"], answer: 1 },
        { type: "type", q: "Towers have 5, 6 and 7 bricks. Here is the tower of 7. How many bricks in the next tower?", visual: { kind: "tenframe", filled: 7 }, answer: ["8", "eight"] },
        { type: "choice", q: "In a growing pattern, each step...", options: ["stays the same", "gets more"], answer: 1 },
        { type: "order", q: "Put the towers in a growing pattern, smallest first.", items: ["1 brick", "2 bricks", "3 bricks", "4 bricks"] },
      ],
      learn: {
        cards: [
          {
            heading: "Choose your rule",
            picture: "/lessons/sorting-and-patterns/lesson-6-1.jpg",
            alt: "A child choosing conkers and leaves from a basket to make a pattern",
            text: [
              "To make your own pattern, first choose your things. Then choose your rule.",
              "Your rule might be conker, leaf. Or leaf, leaf, conker. You decide!",
              "Repeat the part at least three times so everyone can see the pattern.",
            ],
          },
          {
            heading: "Spot the mistake",
            picture: "/lessons/sorting-and-patterns/lesson-6-2.jpg",
            alt: "A child and a grown-up looking closely at a line of coloured buttons on a table",
            text: [
              "Check your pattern by pointing and saying it out loud.",
              "Red, blue, red, red... Oops! That should be blue. If something sounds wrong, it is easy to fix.",
            ],
          },
          {
            heading: "Tell someone about it",
            picture: "/lessons/sorting-and-patterns/lesson-6-3.jpg",
            alt: "A child showing a finished pattern of autumn leaves to a family member",
            text: [
              "Tell someone about your pattern. Say what it is made of and what the part that repeats is.",
              "For example: my pattern goes conker, leaf, conker, leaf. The part that repeats is conker, leaf.",
            ],
          },
        ],
        words: [
          { word: "rule", meaning: "the order your pattern follows" },
          { word: "mistake", meaning: "something that is not quite right" },
          { word: "describe", meaning: "say what something is like" },
        ],
      },
      practice: {
        intro: "Let's check some patterns and find the rules.",
        questions: [
          { type: "choice", q: "Which pattern has a mistake?", options: ["🟡 🟢 🟡 🟢 🟡 🟢", "🟡 🟢 🟡 🟡 🟡 🟢"], answer: 1 },
          { type: "gap", q: "The rule is leaf, conker. Fill the gap.", text: "leaf, conker, leaf, conker, leaf, ___", bank: ["conker", "leaf", "apple"], answers: ["conker"] },
          {
            type: "pick",
            q: "Which patterns follow the rule red, red, blue? There is more than one.",
            options: ["🔴 🔴 🔵 🔴 🔴 🔵", "🔴 🔵 🔴 🔵 🔴 🔵", "🔴 🔴 🔵 🔴 🔴 🔵 🔴 🔴 🔵"],
            answers: [0, 2],
          },
          { type: "choice", q: "Ava's pattern is apple, apple, pear, apple, apple, pear. What is the part that repeats?", options: ["apple, apple, pear", "apple, pear", "pear, pear"], answer: 0 },
        ],
      },
      task: {
        title: "My own pattern",
        intro: "Make a pattern of your own, check it and show it off.",
        need: ["Things to make a pattern with, like leaves, conkers, socks, spoons, toys or building bricks", "Paper and crayons", "A grown-up to help"],
        steps: [
          "Choose your things and choose your rule.",
          "Make your pattern. Repeat the part at least three times.",
          "Point and say it out loud to check for mistakes.",
          "Ask your grown-up to carry it on. Then turn away while they make one mistake. Can you find it?",
          "Draw your pattern on paper and tell someone about it.",
        ],
      },
      exit: [
        { type: "choice", q: "What do you do first to make your own pattern?", options: ["Choose your things and a rule", "Mix everything up"], answer: 0 },
        { type: "choice", q: "Which pattern has a mistake?", options: ["🔵 🟠 🔵 🟠 🔵 🟠", "🔵 🟠 🟠 🔵 🟠 🔵"], answer: 1 },
        { type: "choice", q: "What comes next? conker, leaf, leaf, conker, leaf, leaf, conker, ...", options: ["Conker", "Leaf"], answer: 1 },
        {
          type: "pick",
          q: "Which of these are repeating patterns? There is more than one.",
          options: ["clap, stamp, clap, stamp", "circle, square, circle, square", "1, 2, 3, 4, 5", "🔴 🟢 🔵 🔴 🟢 🔵"],
          answers: [0, 1, 3],
        },
        {
          type: "match",
          q: "Match each pattern to its kind.",
          pairs: [["red, blue, red, blue", "A colour pattern"], ["clap, stamp, clap, stamp", "A sound pattern"], ["1, 2, 3, 4", "A growing pattern"]],
        },
        { type: "gap", q: "Fill the gap.", text: "The part of a pattern that goes again and again is the part that ___.", bank: ["repeats", "grows", "stops"], answers: ["repeats"] },
      ],
      grownUp: {
        need: ["A collection of everyday things to make patterns with", "Paper and crayons"],
        tips: [
          "Hiding a mistake for your child to find is a favourite game. Swap roles so they hide one for you too.",
          "If buttons or beads are used, keep them away from babies and toddlers in the house.",
        ],
        younger: "Make a simple one-then-one pattern together and take turns adding the next piece.",
        older: "Make a three-part pattern, or a growing pattern, and describe it to someone who cannot see it so they can build it too.",
      },
    },
  ],
};
