import type { LessonUnit } from "@/lib/lessons";

/** Where is it? Position words, for ages 5 to 7. Above, below, between, left and right, in front and behind, forwards and backwards, with lots of moving, hiding and a treasure hunt to finish. */
export const positionWords: LessonUnit = {
  slug: "position-words",
  title: "Where is it? Position words",
  short: "Position",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "🧭",
  color: "#2F5D3A",
  summary: "Six lessons: above, below and between, left and right, in front and behind, forwards and backwards, then describing where things are and following treasure hunt directions.",
  cover: "/lessons/units/position-words.jpg",
  lessons: [
    {
      slug: "position-words-1",
      title: "Above, below and between",
      emoji: "⬆️",
      minutes: 30,
      goal: "I can use the words above, below and between to say where something is.",
      starter: [
        { type: "choice", q: "Where is the sky?", options: ["Up high", "Under the ground"], answer: 0 },
        { type: "choice", q: "Where do your shoes go?", options: ["On your head", "On your feet", "On your hands"], answer: 1 },
        { type: "choice", q: "A cat is sitting in a box. Where is the cat?", options: ["On the box", "Next to the box", "In the box"], answer: 2 },
        {
          type: "pick",
          q: "Which of these are high up? There is more than one.",
          options: ["A bird in a tree", "A worm in the soil", "The Moon", "A cloud"],
          answers: [0, 2, 3],
        },
        { type: "match", q: "Match each thing to where it usually is.", pairs: [["Roots of a tree", "Under the ground"], ["Leaves of a tree", "Up high"], ["A rug", "On the floor"]] },
        { type: "choice", q: "You put a book on a table. Where is the book?", options: ["On the table", "Under the table"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Above",
            picture: "/lessons/position-words/lesson-1-1.jpg",
            alt: "A child holding a red leaf high above their head under an oak tree",
            text: [
              "Above means higher up than something else.",
              "The birds fly above the trees. Your hair is above your eyes.",
              "Hold your hand above your head. Now hold it above your knee.",
            ],
          },
          {
            heading: "Below",
            picture: "/lessons/position-words/lesson-1-2.jpg",
            alt: "A child crouching to look at conkers lying on the grass below a tree",
            text: [
              "Below means lower down than something else. Under means nearly the same thing.",
              "The conkers lie on the grass below the tree. Your feet are below your knees.",
            ],
          },
          {
            heading: "Between",
            picture: "/lessons/position-words/lesson-1-3.jpg",
            alt: "A teddy sitting between two children on a sofa",
            text: [
              "Between means in the middle of two things.",
              "Teddy is sitting between two children. Your nose is between your eyes and your mouth.",
              "Put an apple on the table. Put a sock on each side. The apple is between the socks.",
            ],
          },
        ],
        words: [
          { word: "above", meaning: "higher up than something" },
          { word: "below", meaning: "lower down than something" },
          { word: "between", meaning: "in the middle of two things" },
        ],
      },
      practice: {
        intro: "Let's think about what is above, below and between.",
        questions: [
          { type: "choice", q: "Is your nose above or below your mouth?", options: ["Above", "Below"], answer: 0 },
          { type: "choice", q: "A ball is in the middle of two boxes. Where is the ball?", options: ["Above the boxes", "Between the boxes", "Below the boxes"], answer: 1 },
          { type: "order", q: "Put these from the top of a tree to the bottom.", items: ["A bird on the top branch", "Leaves", "The trunk", "The roots"] },
          {
            type: "gap",
            text: "The roof is ___ the house. A spade is ___ in the soil.",
            q: "Fill in the gaps.",
            bank: ["above", "below", "between"],
            answers: ["above", "below"],
          },
        ],
      },
      task: {
        title: "Teddy hide and seek",
        intro: "Hide a toy around the room and say where it is.",
        need: ["A teddy or small toy", "Two cushions", "A table or chair"],
        steps: [
          "Put teddy above the table, held up high. Say: teddy is above the table.",
          "Put teddy below the table, on the floor. Say: teddy is below the table.",
          "Put two cushions on the floor. Sit teddy between them. Say: teddy is between the cushions.",
          "Now swap. Your grown-up hides teddy, and you use above, below or between to say where it is.",
        ],
      },
      exit: [
        { type: "choice", q: "Above means...", options: ["Higher up", "Lower down"], answer: 0 },
        { type: "choice", q: "Your feet are ___ your knees.", options: ["above", "below", "between"], answer: 1 },
        { type: "choice", q: "A leaf is in the middle of two conkers. The leaf is...", options: ["above the conkers", "between the conkers", "below the conkers"], answer: 1 },
        { type: "choice", q: "Is the sky above or below you?", options: ["Above", "Below"], answer: 0 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Above", "Higher up"], ["Below", "Lower down"], ["Between", "In the middle"]] },
        {
          type: "pick",
          q: "Which of these are below you when you stand outside? There is more than one.",
          options: ["The grass", "The clouds", "Your shoes", "The Sun"],
          answers: [0, 2],
        },
      ],
      grownUp: {
        need: ["A teddy or small toy", "Two cushions"],
        tips: [
          "Children learn position words best with their bodies. Ask them to put a hand above, below or between things as you say the words.",
          "Under and below mean almost the same. Over and above do too. It is fine to use both, so long as your child hears the word clearly.",
        ],
        younger: "Use just above and below today. Bring in between when those feel easy.",
        older: "Add on top of, underneath and beside, and ask your child to give you instructions for where to put teddy.",
      },
    },
    {
      slug: "position-words-2",
      title: "Left and right",
      emoji: "👋",
      minutes: 30,
      goal: "I can find my left hand and my right hand, and say if something is on the left or the right.",
      starter: [
        { type: "choice", q: "Above means...", options: ["Lower down", "Higher up"], answer: 1 },
        { type: "choice", q: "Your nose is ___ your eyes and your mouth.", options: ["between", "above", "below"], answer: 0 },
        { type: "choice", q: "Where are the roots of a tree?", options: ["Above the ground", "Below the ground"], answer: 1 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Above", "Higher up"], ["Below", "Lower down"], ["Between", "In the middle"]] },
        { type: "choice", q: "A bird flies over your house. Is it above or below the roof?", options: ["Above", "Below"], answer: 0 },
        {
          type: "pick",
          q: "Which of these are above your shoulders? There is more than one.",
          options: ["Your eyes", "Your knees", "Your ears", "Your toes"],
          answers: [0, 2],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Two sides",
            picture: "/lessons/position-words/lesson-2-1.jpg",
            alt: "A child standing with both arms stretched out wide to the sides",
            text: [
              "Your body has two sides. One side is your left. The other side is your right.",
              "You have a left hand and a right hand, a left foot and a right foot.",
            ],
          },
          {
            heading: "A trick for left",
            picture: "/lessons/position-words/lesson-2-2.jpg",
            alt: "A child holding both hands up in front of them, palms facing away, thumbs stretched out",
            text: [
              "Hold both hands out in front of you, palms facing away. Stick your thumbs out to the side.",
              "Look at your hands. One finger and thumb make an L shape. That is your left hand.",
              "Your other hand is your right hand. Wave your right hand. Stamp your left foot.",
            ],
          },
          {
            heading: "On the left, on the right",
            picture: "/lessons/position-words/lesson-2-3.jpg",
            alt: "A child at a table with a red apple on one side of a plate and a green apple on the other",
            text: [
              "Things can be on your left or on your right.",
              "Put a red apple next to your left hand and a green apple next to your right hand. The red apple is on the left.",
              "When you read a book, you start on the left and go to the right.",
            ],
          },
        ],
        words: [
          { word: "left", meaning: "the side where your hand makes an L shape" },
          { word: "right", meaning: "the other side, not left" },
          { word: "side", meaning: "one of the two halves of your body or a thing" },
        ],
      },
      practice: {
        intro: "Let's practise left and right. Use your L trick if you need it.",
        questions: [
          { type: "choice", q: "Hold your hands out, palms away. Which hand makes an L shape?", options: ["My left hand", "My right hand"], answer: 0 },
          { type: "choice", q: "How many sides does your body have?", options: ["One", "Two", "Three"], answer: 1 },
          { type: "choice", q: "When you read a book, where do you start?", options: ["On the left", "On the right"], answer: 0 },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "I have a ___ hand and a ___ hand.",
            bank: ["left", "right", "top"],
            answers: ["left", "right"],
          },
        ],
      },
      task: {
        title: "Left and right dance",
        intro: "Play a moving game to practise left and right.",
        need: ["A sticker or a ribbon", "Some music (or a grown-up to sing)"],
        steps: [
          "Ask your grown-up to put a sticker or a ribbon on your left hand.",
          "Wave your left hand. Wave your right hand. Shake your left foot. Shake your right foot.",
          "Your grown-up calls out moves, like: touch your right ear, or hop on your left foot. Do each one.",
          "Put a toy on your left and a toy on your right. Tell your grown-up which toy is on which side.",
        ],
      },
      exit: [
        { type: "choice", q: "Which hand makes the L shape?", options: ["Right", "Left"], answer: 1 },
        { type: "choice", q: "When you read, which way do you go?", options: ["Left to right", "Right to left"], answer: 0 },
        { type: "type", q: "How many hands do you have?", answer: ["2", "two"] },
        { type: "choice", q: "If something is not on your left, it is on your...", options: ["Right", "Head", "Below"], answer: 0 },
        { type: "match", q: "Match each one.", pairs: [["Left hand", "Makes the L shape"], ["Right hand", "The other hand"], ["Reading", "Starts on the left"]] },
        {
          type: "pick",
          q: "Which of these do you have a left one and a right one of? There is more than one.",
          options: ["Ear", "Nose", "Foot", "Mouth"],
          answers: [0, 2],
        },
      ],
      grownUp: {
        need: ["A sticker, ribbon or hair bobble for the left wrist"],
        tips: [
          "Left and right take a long time to learn, often until 7 or later. Lots of short, playful practice works better than one long go.",
          "If you face your child, your left is opposite their right, which is confusing. Stand beside them, facing the same way, when you show left and right.",
        ],
        younger: "Keep the sticker on all lesson, and just practise waving and stamping on each side.",
        older: "Ask your child to sort toys into a left pile and a right pile, then swap them over and say where each one is now.",
      },
    },
    {
      slug: "position-words-3",
      title: "In front and behind",
      emoji: "🙈",
      minutes: 30,
      goal: "I can say if something is in front of or behind something else.",
      starter: [
        { type: "choice", q: "Which hand makes the L shape?", options: ["Left", "Right"], answer: 0 },
        { type: "choice", q: "When you read, where do you start?", options: ["On the right", "On the left"], answer: 1 },
        { type: "choice", q: "Below means...", options: ["Lower down", "Higher up", "In the middle"], answer: 0 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Left", "The L shape side"], ["Above", "Higher up"], ["Between", "In the middle"]] },
        { type: "choice", q: "How many sides does your body have?", options: ["Two", "Four"], answer: 0 },
        {
          type: "pick",
          q: "Which of these are position words? There is more than one.",
          options: ["Above", "Apple", "Left", "Between"],
          answers: [0, 2, 3],
        },
      ],
      learn: {
        cards: [
          {
            heading: "In front",
            picture: "/lessons/position-words/lesson-3-1.jpg",
            alt: "A child standing in front of a garden shed, smiling at the viewer",
            text: [
              "In front means facing you, nearer to you, or ahead of you.",
              "Your nose is on the front of your face. When you walk, you look where you are going, in front of you.",
            ],
          },
          {
            heading: "Behind",
            picture: "/lessons/position-words/lesson-3-2.jpg",
            alt: "A child peeking out from behind a tree trunk in an autumn park",
            text: [
              "Behind means at the back of something.",
              "When you hide behind a tree, the tree is in front of you. Your friend cannot see you.",
              "Put your hands behind your back. Now put them in front of you.",
            ],
          },
          {
            heading: "Standing in a line",
            picture: "/lessons/position-words/lesson-3-3.jpg",
            alt: "Three children standing in a line, one behind the other, waiting to go down a slide",
            text: [
              "When we stand in a line, some people are in front of us and some are behind us.",
              "Ali is first. Sam is behind Ali. Ruby is behind Sam. Ali is in front of Sam.",
            ],
          },
        ],
        words: [
          { word: "in front", meaning: "ahead of something, or nearer to you" },
          { word: "behind", meaning: "at the back of something" },
        ],
      },
      practice: {
        intro: "Let's think about what is in front and what is behind.",
        questions: [
          { type: "choice", q: "You hide at the back of a tree. Where are you?", options: ["In front of the tree", "Behind the tree"], answer: 1 },
          { type: "choice", q: "Is your nose on the front or the back of your head?", options: ["The front", "The back"], answer: 0 },
          { type: "order", q: "Ali is first in the line. Sam is behind Ali. Ruby is behind Sam. Put them in order from the front.", items: ["Ali", "Sam", "Ruby"] },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "My eyes are on the ___ of my head. My back is ___ me.",
            bank: ["front", "behind", "above"],
            answers: ["front", "behind"],
          },
        ],
      },
      task: {
        title: "Toy parade",
        intro: "Line up your toys and talk about who is in front and who is behind.",
        need: ["Four or five toys", "A box or a cushion to hide behind"],
        steps: [
          "Stand your toys in a line, one behind the other, all facing the same way.",
          "Say which toy is at the front. Say which toy is at the back.",
          "Pick one toy. Say which toy is in front of it and which toy is behind it.",
          "Hide a toy behind the box. Ask your grown-up to guess which one it is. Then put it in front of the box.",
        ],
      },
      exit: [
        { type: "choice", q: "Behind means...", options: ["At the back", "Higher up"], answer: 0 },
        { type: "choice", q: "You hide behind a sofa. What is in front of you?", options: ["The sofa", "Nothing at all"], answer: 0 },
        { type: "choice", q: "Ruby is behind Sam. So Sam is ___ Ruby.", options: ["behind", "in front of", "below"], answer: 1 },
        { type: "choice", q: "Where are your heels?", options: ["At the front of your feet", "At the back of your feet"], answer: 1 },
        { type: "match", q: "Match each word to what it means.", pairs: [["In front", "Ahead"], ["Behind", "At the back"], ["Between", "In the middle"]] },
        {
          type: "pick",
          q: "Which of these are on the front of you? There is more than one.",
          options: ["Your nose", "Your tummy", "Your back", "Your toes"],
          answers: [0, 1, 3],
        },
      ],
      grownUp: {
        need: ["Four or five toys", "A box or cushion"],
        tips: [
          "In front and behind depend on which way things are facing. Lining toys up all facing the same way keeps it simple to begin with.",
          "Play peekaboo or hide and seek with a toy behind a cushion. Saying the words while you play helps them stick.",
        ],
        younger: "Use just two toys, one in front and one behind, and swap them over.",
        older: "Ask your child to describe a toy's place using two words, like: the bear is behind the car and in front of the doll.",
      },
    },
    {
      slug: "position-words-4",
      title: "Forwards and backwards",
      emoji: "👣",
      minutes: 30,
      goal: "I can move forwards and backwards and count my steps.",
      starter: [
        { type: "choice", q: "Behind means...", options: ["At the back", "In the middle"], answer: 0 },
        { type: "choice", q: "Ruby is behind Sam. So Sam is...", options: ["behind Ruby", "in front of Ruby"], answer: 1 },
        { type: "choice", q: "Which hand makes the L shape?", options: ["Right", "Left"], answer: 1 },
        { type: "order", q: "Ali is first in the line. Sam is behind Ali. Ruby is behind Sam. Put them in order from the front.", items: ["Ali", "Sam", "Ruby"] },
        { type: "match", q: "Match each word to what it means.", pairs: [["In front", "Ahead"], ["Behind", "At the back"], ["Above", "Higher up"]] },
        {
          type: "pick",
          q: "Which of these are on the back of you? There is more than one.",
          options: ["Your heels", "Your nose", "Your bottom", "Your knees"],
          answers: [0, 2],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Forwards",
            picture: "/lessons/position-words/lesson-4-1.jpg",
            alt: "A child in wellies striding forwards along a path covered in autumn leaves",
            text: [
              "Forwards means moving the way you are facing.",
              "When you walk to the door, you walk forwards. Your eyes can see where you are going.",
            ],
          },
          {
            heading: "Backwards",
            picture: "/lessons/position-words/lesson-4-2.jpg",
            alt: "A child taking careful steps backwards on a lawn while a grown-up watches",
            text: [
              "Backwards means moving the way your back is facing.",
              "You cannot see where you are going, so go slowly and carefully. Check there is nothing to trip on.",
            ],
          },
          {
            heading: "Counting steps",
            picture: "/lessons/position-words/lesson-4-3.jpg",
            alt: "A toy car on a row of paper squares on the floor, with a child pushing it along",
            text: [
              "We can count how far we move. Take 3 steps forwards: 1, 2, 3.",
              "On a number line, forwards means going up. Backwards means going down.",
              "Start on 2. Jump forwards 3. You land on 5.",
            ],
          },
        ],
        words: [
          { word: "forwards", meaning: "moving the way you are facing" },
          { word: "backwards", meaning: "moving the way your back is facing" },
          { word: "step", meaning: "one move of your foot" },
        ],
      },
      practice: {
        intro: "Let's move forwards and backwards on a number line.",
        questions: [
          { type: "choice", q: "You walk the way you are facing. Which way are you moving?", options: ["Forwards", "Backwards"], answer: 0 },
          { type: "type", q: "Start on 2. Jump forwards 3. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [2, 5] }, answer: ["5", "five"] },
          { type: "type", q: "Start on 7. Jump backwards 2. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [7, 5] }, answer: ["5", "five"] },
          { type: "choice", q: "On a number line, going backwards makes the number...", options: ["bigger", "smaller"], answer: 1 },
        ],
      },
      task: {
        title: "Stepping stones",
        intro: "Make a path on the floor and move along it.",
        need: ["10 sheets of paper or 10 cushions", "A toy", "A clear space with nothing to trip on"],
        steps: [
          "Lay the paper in a line on the floor, like stepping stones.",
          "Stand on the first sheet. Step forwards 3. Count each step out loud.",
          "Now step backwards 2, slowly. Where are you now?",
          "Swap. You tell your grown-up how many steps to take, forwards or backwards, and check they get it right.",
        ],
      },
      exit: [
        { type: "choice", q: "Backwards means moving...", options: ["the way you are facing", "the way your back is facing"], answer: 1 },
        { type: "type", q: "Start on 1. Jump forwards 4. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [1, 5] }, answer: ["5", "five"] },
        { type: "type", q: "Start on 8. Jump backwards 3. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [8, 5] }, answer: ["5", "five"] },
        { type: "type", q: "Start on 4. Jump forwards 2. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [4, 6] }, answer: ["6", "six"] },
        { type: "choice", q: "Why should you go slowly when you walk backwards?", options: ["You cannot see where you are going", "It is too fast"], answer: 0 },
        { type: "match", q: "Match each move to where you land.", pairs: [["Start on 3, forwards 1", "4"], ["Start on 6, backwards 3", "3"], ["Start on 0, forwards 7", "7"]] },
      ],
      grownUp: {
        need: ["10 sheets of paper or cushions", "A clear space"],
        tips: [
          "Clear the floor before any backwards walking, and stay close by. Small steps are safer than big ones.",
          "Counting steps on a path is the start of using a number line. Let your child say each number as they land on it.",
        ],
        younger: "Keep to forwards and backwards with up to 3 steps, and count together.",
        older: "Use a path of 20 and bigger jumps, and ask: how many steps from here to the end?",
      },
    },
    {
      slug: "position-words-5",
      title: "Describing where things are",
      emoji: "🔍",
      minutes: 30,
      goal: "I can use position words to describe where things are.",
      starter: [
        { type: "choice", q: "Forwards means moving...", options: ["the way you are facing", "the way your back is facing"], answer: 0 },
        { type: "type", q: "Start on 3. Jump forwards 2. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [3, 5] }, answer: ["5", "five"] },
        { type: "type", q: "Start on 9. Jump backwards 3. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [9, 6] }, answer: ["6", "six"] },
        { type: "choice", q: "On a number line, going forwards makes the number...", options: ["bigger", "smaller"], answer: 0 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Forwards", "The way you face"], ["Backwards", "The way your back faces"], ["Behind", "At the back"]] },
        { type: "choice", q: "Which hand makes the L shape?", options: ["Left", "Right"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Lots of position words",
            picture: "/lessons/position-words/lesson-5-1.jpg",
            alt: "A cosy bedroom with a cat on a bed, slippers under it and a lamp beside it",
            text: [
              "Position words tell us where things are.",
              "We know above, below, between, left, right, in front and behind. Here are some more: on, under, in, next to and inside.",
            ],
          },
          {
            heading: "Saying it clearly",
            picture: "/lessons/position-words/lesson-5-2.jpg",
            alt: "A child pointing at a bowl of apples on a kitchen table while talking to a grown-up",
            text: [
              "To help someone find a thing, say what is near it.",
              "The apples are on the table, next to the jug. The cat is under the chair.",
              "Using two position words makes it even clearer: the sock is under the bed, behind the box.",
            ],
          },
          {
            heading: "Where is the conker?",
            picture: "/lessons/position-words/lesson-5-3.jpg",
            alt: "A shelf with three conkers in a row, a cup above them and a book below",
            text: [
              "Three conkers sit in a row on a shelf. The middle conker is between the other two.",
              "A cup is above the conkers. A book is below them.",
              "Can you say where the first conker is? It is on the shelf, on the left.",
            ],
          },
        ],
        words: [
          { word: "position", meaning: "where something is" },
          { word: "next to", meaning: "right beside something" },
          { word: "describe", meaning: "say what something is like or where it is" },
        ],
      },
      practice: {
        intro: "Let's describe where things are.",
        questions: [
          { type: "choice", q: "The cat is sleeping on the floor, and the chair is right over it. The cat is...", options: ["on the chair", "under the chair", "above the chair"], answer: 1 },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "The apples are ___ the table, ___ the jug.",
            bank: ["on", "next to", "below"],
            answers: ["on", "next to"],
          },
          {
            type: "pick",
            q: "Which of these are position words? There is more than one.",
            options: ["Under", "Sock", "Inside", "Next to"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "Five buttons are in a row. Which one is between the second and the fourth?", visual: { kind: "dots", rows: 1, cols: 5 }, options: ["The first", "The third", "The fifth"], answer: 1 },
        ],
      },
      task: {
        title: "Where is it game",
        intro: "Take turns to describe where something is, and find it.",
        need: ["Five small things from around the house, like a sock, a spoon, a toy, a leaf and an apple"],
        steps: [
          "Put the five things in different places in the room: on, under, next to, behind and in front of something.",
          "Choose one thing. Describe where it is, without saying what it is. Can your grown-up find it?",
          "Swap. Your grown-up describes, and you find it.",
          "Try to use two position words each time, like: under the chair, next to the door.",
        ],
      },
      exit: [
        { type: "choice", q: "Position words tell us...", options: ["where things are", "how many things there are"], answer: 0 },
        { type: "choice", q: "Your shoes are on the floor, and your bed is right over them. Your shoes are...", options: ["under the bed", "above the bed"], answer: 0 },
        { type: "choice", q: "Three conkers sit in a row. Which one is between the other two?", visual: { kind: "dots", rows: 1, cols: 3 }, options: ["The first", "The middle one", "The last"], answer: 1 },
        {
          type: "gap",
          q: "Think of the conker shelf: the cup is higher up and the book is lower down. Fill in the gaps.",
          text: "The cup is ___ the shelf. The book is ___ the shelf.",
          bank: ["above", "below", "behind"],
          answers: ["above", "below"],
        },
        { type: "match", q: "Match the opposites.", pairs: [["Above", "Below"], ["Left", "Right"], ["In front", "Behind"]] },
        {
          type: "pick",
          q: "Which of these help someone find a lost sock? There is more than one.",
          options: ["It is under the bed", "It is a sock", "It is behind the door", "It is next to the basket"],
          answers: [0, 2, 3],
        },
      ],
      grownUp: {
        need: ["Five small household things"],
        tips: [
          "Ask 'where is it?' through the day: at tidy-up time, getting dressed, or laying the table. Everyday talk does most of the teaching.",
          "If your child points instead of saying, gently ask: can you tell me with words?",
        ],
        younger: "Use three things and the simpler words: on, under, in and next to.",
        older: "Ask your child to describe a whole room or a picture so you could draw it without looking.",
      },
    },
    {
      slug: "position-words-6",
      title: "Treasure hunt directions",
      emoji: "🗺️",
      minutes: 30,
      goal: "I can follow and give directions to find hidden treasure.",
      starter: [
        { type: "choice", q: "Position words tell us...", options: ["what colour things are", "where things are"], answer: 1 },
        { type: "choice", q: "The shoes are on the floor, and the bed is right over them. They are...", options: ["under the bed", "on the bed"], answer: 0 },
        { type: "match", q: "Match the opposites.", pairs: [["Above", "Below"], ["Left", "Right"], ["Forwards", "Backwards"]] },
        {
          type: "pick",
          q: "Which of these are position words? There is more than one.",
          options: ["Behind", "Next to", "Conker", "On"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "Start on 2. Jump forwards 4. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [2, 6] }, answer: ["6", "six"] },
        { type: "choice", q: "A ball is in the middle of two boxes. It is...", options: ["between the boxes", "behind the boxes"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Directions",
            picture: "/lessons/position-words/lesson-6-1.jpg",
            alt: "A grown-up and a child standing in a garden, the grown-up pointing the way",
            text: [
              "Directions tell you how to get somewhere.",
              "They use words like forwards, backwards, left and right, and how many steps to take.",
            ],
          },
          {
            heading: "Turning",
            picture: "/lessons/position-words/lesson-6-2.jpg",
            alt: "A child turning on the spot with one arm pointing out to the side",
            text: [
              "You can turn left or turn right. Turning changes the way you are facing.",
              "Stand still and point your left arm out to the side. Turn so you face where it points. You have turned left.",
              "Turn all the way round and you are back where you started.",
            ],
          },
          {
            heading: "Follow the steps",
            picture: "/lessons/position-words/lesson-6-3.jpg",
            alt: "Two children finding a small box of conkers hidden under a bush in an autumn garden",
            text: [
              "Directions come in order. Do one, then the next.",
              "Forwards 3 steps. Turn right. Forwards 2 steps. Look under the bush.",
              "Follow every step in order, and you will find the treasure.",
            ],
          },
        ],
        words: [
          { word: "directions", meaning: "steps that tell you how to get somewhere" },
          { word: "turn", meaning: "change the way you are facing" },
        ],
      },
      practice: {
        intro: "Let's follow some directions.",
        questions: [
          { type: "choice", q: "You turn left. What changes?", options: ["The way you are facing", "How tall you are"], answer: 0 },
          { type: "order", q: "Put these directions in the order they were given: forwards 3, turn right, forwards 2, look under the bush.", items: ["Forwards 3 steps", "Turn right", "Forwards 2 steps", "Look under the bush"] },
          { type: "type", q: "A path has stones. You start on 0 and go forwards 3, then forwards 2. Which stone are you on?", visual: { kind: "numberline", from: 0, to: 10, jump: [0, 5] }, answer: ["5", "five"] },
          { type: "type", q: "You start on stone 6. You go backwards 4. Which stone are you on?", visual: { kind: "numberline", from: 0, to: 10, jump: [6, 2] }, answer: ["2", "two"] },
        ],
      },
      task: {
        title: "Treasure hunt",
        intro: "Hide some treasure and give each other directions to find it.",
        need: ["Some treasure, like a conker, a shiny button or a small toy", "A safe space indoors or in the garden", "A grown-up nearby"],
        steps: [
          "Close your eyes while your grown-up hides the treasure.",
          "Your grown-up gives you directions, one at a time, like: forwards 4 steps, turn left, look behind the cushion.",
          "Follow each direction carefully. Count your steps out loud.",
          "Swap. You hide the treasure and give the directions. Use as many position words as you can.",
        ],
      },
      exit: [
        { type: "choice", q: "Directions tell you...", options: ["how to get somewhere", "what time it is"], answer: 0 },
        { type: "choice", q: "You turn all the way round. Which way are you facing?", options: ["The same way as before", "Upside down"], answer: 0 },
        { type: "type", q: "Start on 1. Go forwards 5. Where are you?", visual: { kind: "numberline", from: 0, to: 10, jump: [1, 6] }, answer: ["6", "six"] },
        { type: "type", q: "Start on 10. Go backwards 3. Where are you?", visual: { kind: "numberline", from: 0, to: 10, jump: [10, 7] }, answer: ["7", "seven"] },
        { type: "match", q: "Match each direction to what you do.", pairs: [["Forwards", "Walk the way you face"], ["Turn left", "Face your left hand side"], ["Backwards", "Walk the way your back faces"]] },
        {
          type: "gap",
          q: "Fill in the gaps.",
          text: "Go ___ 2 steps. Then look ___ the bush.",
          bank: ["forwards", "under", "above"],
          answers: ["forwards", "under"],
        },
      ],
      grownUp: {
        need: ["A small treasure", "A safe, clear space"],
        tips: [
          "Give one direction at a time to begin with. Holding several steps in mind is hard at this age.",
          "Stand behind your child, facing the same way, when you say left and right. Then your left is their left too.",
        ],
        younger: "Use just forwards and a position word, like: forwards 3 steps, look under the chair.",
        older: "Draw a simple map of the room with your child, mark the treasure with a cross, and write the directions as arrows.",
      },
    },
  ],
};
