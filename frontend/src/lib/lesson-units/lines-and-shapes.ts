import type { LessonUnit } from "@/lib/lessons";

/** Lines and shapes, for ages 5 to 7. A grown-up reads along. Only pencils, crayons, paper and things from around the home. */
export const linesAndShapes: LessonUnit = {
  slug: "lines-and-shapes",
  title: "Lines and shapes",
  short: "Lines and shapes",
  subject: "Art & Design",
  ages: "5 to 7",
  emoji: "🔺",
  color: "#C9A86A",
  summary: "Six playful lessons on lines, shapes and patterns, drawing to music, drawing a favourite toy, and the artist Paul Klee.",
  cover: "/lessons/units/lines-and-shapes.jpg",
  lessons: [
    {
      slug: "lines-and-shapes-1",
      title: "Lots of lines",
      emoji: "〰️",
      minutes: 30,
      goal: "I can draw and name lots of different lines.",
      starter: [
        { type: "choice", q: "What can you draw with?", options: ["A spoon", "A crayon"], answer: 1 },
        { type: "choice", q: "Which one is paper for?", options: ["Drawing on", "Eating"], answer: 0 },
        {
          type: "pick",
          q: "Which of these can make a mark on paper? There is more than one.",
          options: ["A pencil", "A felt pen", "A sock", "A crayon"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "A ruler helps you draw a line that is...", options: ["wobbly", "straight", "curly"], answer: 1 },
        { type: "choice", q: "Do artists draw lines?", options: ["Yes, all the time", "No, never"], answer: 0 },
        { type: "choice", q: "What shape is a ball?", options: ["Square", "Triangle", "Round"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "What is a line?",
            picture: "/lessons/lines-and-shapes/lesson-1-1.jpg",
            alt: "A child's hand drawing a long pencil line on paper",
            text: [
              "A line is a mark you make by moving your pencil.",
              "Put your pencil down. Move it along. Lift it up. You made a line!",
            ],
          },
          {
            heading: "So many lines",
            picture: "/lessons/lines-and-shapes/lesson-1-2.jpg",
            alt: "A page of straight, wavy, zigzag, curly and dotted crayon lines",
            text: [
              "Lines can be straight, like a stick. They can be wavy, like the sea.",
              "Lines can be zigzag, like a lightning bolt. They can be curly, like a pig's tail.",
              "A dotted line is lots of little dots in a row.",
            ],
          },
          {
            heading: "Thick and thin",
            picture: "/lessons/lines-and-shapes/lesson-1-3.jpg",
            alt: "A boy comparing a thick crayon line and a thin pencil line",
            text: [
              "Press hard, or use a big crayon, for a thick line. Press gently, or use a sharp pencil, for a thin line.",
              "Artists use thick and thin lines to make their pictures exciting.",
            ],
          },
        ],
        words: [
          { word: "line", meaning: "a mark made by moving a pencil or crayon" },
          { word: "wavy", meaning: "going up and down gently, like the sea" },
          { word: "zigzag", meaning: "going up and down in sharp points" },
          { word: "dotted", meaning: "made of little dots in a row" },
        ],
      },
      practice: {
        intro: "Can you spot the lines?",
        questions: [
          {
            type: "match",
            q: "Match each line to what it looks like.",
            pairs: [["Wavy", "The sea"], ["Zigzag", "Lightning"], ["Curly", "A pig's tail"]],
          },
          { type: "choice", q: "Which line is made of little dots?", options: ["A thick line", "A dotted line"], answer: 1 },
          { type: "choice", q: "How do you make a thick line?", options: ["Press gently", "Press hard"], answer: 1 },
          { type: "choice", q: "A stick looks like which line?", options: ["Curly", "Straight", "Zigzag"], answer: 1 },
        ],
      },
      task: {
        title: "A page of lines",
        intro: "Fill a whole page with different lines.",
        need: ["A big sheet of paper", "Pencils and crayons"],
        steps: [
          "Fold your paper in half, then in half again. Open it out. Now you have four boxes.",
          "Draw straight lines in box one.",
          "Draw wavy lines in box two.",
          "Draw zigzag lines in box three.",
          "Draw curly and dotted lines in box four.",
          "Go over some lines with a crayon to make them thick.",
        ],
      },
      exit: [
        { type: "choice", q: "A line like the sea is...", options: ["wavy", "straight"], answer: 0 },
        { type: "choice", q: "A line like lightning is...", options: ["curly", "dotted", "zigzag"], answer: 2 },
        { type: "choice", q: "Lots of little dots in a row make a...", options: ["thick line", "dotted line"], answer: 1 },
        { type: "choice", q: "To make a thin line, you press...", options: ["gently", "very hard"], answer: 0 },
        {
          type: "pick",
          q: "Which are kinds of line? There is more than one.",
          options: ["Wavy", "Curly", "Sleepy", "Straight"],
          answers: [0, 1, 3],
        },
        {
          type: "match",
          q: "Match each line to what it looks like.",
          pairs: [["Straight", "A stick"], ["Curly", "A pig's tail"], ["Wavy", "The sea"]],
        },
      ],
      grownUp: {
        need: ["Paper", "Pencils, crayons or felt pens"],
        tips: [
          "Draw lines in the air with a finger first, saying the name out loud: 'zig, zag, zig, zag'.",
          "Praise trying, not neatness. Wobbly lines are still lines!",
        ],
        younger: "Draw big lines in the air, then on a large sheet with chunky crayons. Name just straight, wavy and zigzag.",
        older: "Invent new lines, like a 'bumpy' line or a 'spiky' line, and give each one a name.",
      },
    },
    {
      slug: "lines-and-shapes-2",
      title: "Lines that dance",
      emoji: "🎵",
      minutes: 30,
      goal: "I can draw lines that match how music makes me feel.",
      starter: [
        { type: "choice", q: "A line like the sea is...", options: ["zigzag", "wavy"], answer: 1 },
        { type: "choice", q: "A line like lightning is...", options: ["zigzag", "straight", "dotted"], answer: 0 },
        { type: "choice", q: "To draw a thick line, you press...", options: ["gently", "hard"], answer: 1 },
        { type: "choice", q: "Little dots in a row make a...", options: ["curly line", "dotted line"], answer: 1 },
        {
          type: "match",
          q: "Match each line to what it looks like.",
          pairs: [["Curly", "A pig's tail"], ["Straight", "A stick"], ["Zigzag", "Lightning"]],
        },
        {
          type: "pick",
          q: "Which are kinds of line? There is more than one.",
          options: ["Thin", "Hungry", "Wavy", "Thick"],
          answers: [0, 2, 3],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Lines can show feelings",
            picture: "/lessons/lines-and-shapes/lesson-2-1.jpg",
            alt: "A calm wavy drawing next to an excited zigzag drawing",
            text: [
              "Lines can look calm, or busy, or excited.",
              "Soft, wavy lines look calm and sleepy. Sharp zigzag lines look fast and excited.",
            ],
          },
          {
            heading: "Listen and draw",
            picture: "/lessons/lines-and-shapes/lesson-2-2.jpg",
            alt: "A girl drawing swirly lines while listening to music",
            text: [
              "When music is slow and quiet, try long, gentle, wavy lines.",
              "When music is fast and loud, try quick zigzags and dots. Let your pencil dance!",
            ],
          },
          {
            heading: "No right or wrong",
            picture: "/lessons/lines-and-shapes/lesson-2-3.jpg",
            alt: "A grown-up and child comparing their music drawings",
            text: [
              "Everyone hears music in their own way. Your lines will be different from mine.",
              "That is fine. Artists choose lines to show how they feel.",
            ],
          },
        ],
        words: [
          { word: "calm", meaning: "quiet and peaceful" },
          { word: "fast", meaning: "quick" },
          { word: "feeling", meaning: "how you are inside, like happy or sleepy" },
        ],
      },
      practice: {
        intro: "What lines would you draw?",
        questions: [
          { type: "choice", q: "Slow, quiet music. Which lines might you draw?", options: ["Sharp zigzags", "Gentle wavy lines"], answer: 1 },
          { type: "choice", q: "Fast, loud music. Which lines might you draw?", options: ["Quick zigzags and dots", "One long, slow line"], answer: 0 },
          {
            type: "match",
            q: "Match each line to how it looks.",
            pairs: [["Wavy", "Calm"], ["Zigzag", "Excited"], ["Dots", "Bouncy"]],
          },
          { type: "choice", q: "Will your music drawing look the same as everyone else's?", options: ["Yes, exactly the same", "No, it can be different"], answer: 1 },
        ],
      },
      task: {
        title: "Draw the music",
        intro: "Listen to two kinds of music and let your crayon move to the sound.",
        need: ["Two sheets of paper", "Crayons", "Some music: one slow song and one fast song"],
        steps: [
          "Hold a crayon. Close your eyes and listen to the slow music for a moment.",
          "Open your eyes. Draw lines that move like the music.",
          "Now take a new sheet. Listen to the fast music.",
          "Draw lines that move like the fast music.",
          "Put your drawings side by side. Which one looks calm? Which one looks excited?",
        ],
      },
      exit: [
        { type: "choice", q: "Which lines look calm?", options: ["Soft wavy lines", "Sharp zigzags"], answer: 0 },
        { type: "choice", q: "Which lines look fast and excited?", options: ["Long gentle lines", "Quick zigzags"], answer: 1 },
        { type: "choice", q: "Slow, quiet music might make you draw...", options: ["spiky zigzags", "gentle wavy lines", "lots of quick dots"], answer: 1 },
        { type: "choice", q: "Is there a right or wrong way to draw music?", options: ["No, everyone draws it their own way", "Yes, only one way is right"], answer: 0 },
        {
          type: "match",
          q: "Match the music to the lines.",
          pairs: [["Slow music", "Wavy lines"], ["Fast music", "Zigzag lines"], ["Bouncy music", "Dots"]],
        },
        { type: "choice", q: "Lines can show...", options: ["feelings", "nothing at all"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and crayons", "A way to play music: a slow, gentle piece and a fast, lively one"],
        tips: [
          "Classical music works well. Try something slow like 'The Swan' by Saint-Saëns and something fast like 'Flight of the Bumblebee'.",
          "Join in and draw too. Then compare: 'My lines went round and round. What did yours do?'",
        ],
        younger: "Tape a big sheet to the table and use two crayons, one in each hand. Just move to the music.",
        older: "Use a different colour for each instrument you can hear, or draw to a third piece and guess how it will feel first.",
      },
    },
    {
      slug: "lines-and-shapes-3",
      title: "Shapes all around",
      emoji: "🔺",
      minutes: 30,
      goal: "I can find shapes in things around me and use them to make a picture.",
      starter: [
        { type: "choice", q: "Which lines look calm?", options: ["Wavy lines", "Zigzag lines"], answer: 0 },
        { type: "choice", q: "Fast music might make you draw...", options: ["slow, long lines", "quick zigzags"], answer: 1 },
        { type: "choice", q: "Lines can show...", options: ["feelings", "nothing"], answer: 0 },
        { type: "choice", q: "Is there one right way to draw music?", options: ["Yes", "No"], answer: 1 },
        {
          type: "match",
          q: "Match the music to the lines.",
          pairs: [["Slow music", "Wavy lines"], ["Fast music", "Zigzag lines"], ["Bouncy music", "Dots"]],
        },
        { type: "choice", q: "A line like lightning is...", options: ["curly", "dotted", "zigzag"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Lines make shapes",
            picture: "/lessons/lines-and-shapes/lesson-3-1.jpg",
            alt: "A triangle, square and circle drawn in crayon",
            text: [
              "Join lines up and you make a shape.",
              "Three straight sides make a triangle. Four equal sides make a square. A round line that joins up makes a circle.",
            ],
          },
          {
            heading: "Shape hunt",
            picture: "/lessons/lines-and-shapes/lesson-3-2.jpg",
            alt: "A child pointing at a round plate, a book and triangle sandwiches",
            text: [
              "Shapes are everywhere! A plate is a circle. A book is a rectangle.",
              "A window might be a square. A slice of sandwich cut corner to corner is a triangle.",
            ],
          },
          {
            heading: "Shapes make pictures",
            picture: "/lessons/lines-and-shapes/lesson-3-3.jpg",
            alt: "A house and a lollipop drawn from simple shapes",
            text: [
              "Artists put shapes together to make pictures.",
              "A square and a triangle make a house. A circle and a rectangle make a lollipop. What can you make?",
            ],
          },
        ],
        words: [
          { word: "shape", meaning: "the outline of something, made when lines join up" },
          { word: "circle", meaning: "a round shape with no corners" },
          { word: "triangle", meaning: "a shape with three straight sides" },
          { word: "rectangle", meaning: "a shape with four straight sides, two long and two short" },
        ],
      },
      practice: {
        intro: "Shape detectives!",
        questions: [
          {
            type: "match",
            q: "Match each thing to its shape.",
            pairs: [["A plate", "Circle"], ["A book", "Rectangle"], ["A slice of pizza", "Triangle"]],
          },
          { type: "choice", q: "How many sides does a triangle have?", options: ["Three", "Four", "None"], answer: 0 },
          { type: "choice", q: "Which shape has no corners?", options: ["A square", "A circle"], answer: 1 },
          { type: "choice", q: "A square and a triangle on top could make a...", options: ["house", "fish", "ball"], answer: 0 },
        ],
      },
      task: {
        title: "Draw-around picture",
        intro: "Find shapes at home, draw around them, and turn them into a picture.",
        need: ["Paper", "A pencil and crayons", "Things to draw around, like a cup, a small box, a coin or a lid"],
        steps: [
          "Go on a shape hunt round the room. Find three or four things with flat sides.",
          "Put one on the paper. Hold it still and draw around it.",
          "Draw around the other things too. They can touch or overlap.",
          "Look at your shapes. What could they become? A robot? A car? A face?",
          "Add lines and colour to turn your shapes into a picture.",
        ],
      },
      exit: [
        { type: "choice", q: "A plate is shaped like a...", options: ["square", "circle"], answer: 1 },
        { type: "choice", q: "A shape with three straight sides is a...", options: ["triangle", "circle", "rectangle"], answer: 0 },
        { type: "choice", q: "What do you get when you join lines up?", options: ["A shape", "A sound"], answer: 0 },
        {
          type: "pick",
          q: "Which things are shaped like a rectangle? There is more than one.",
          options: ["A book", "A door", "A ball"],
          answers: [0, 1],
        },
        { type: "choice", q: "A circle has how many corners?", options: ["Four", "Three", "None"], answer: 2 },
        {
          type: "match",
          q: "Match each picture to the shapes that make it.",
          pairs: [["A house", "Square and triangle"], ["A lollipop", "Circle and rectangle"], ["A snowman", "Two circles"]],
        },
      ],
      grownUp: {
        need: ["Paper, pencil, crayons", "Household objects to draw around: cups, lids, small boxes, coins"],
        tips: [
          "Hold the object down for your child while they draw around it. It's tricky to do both at once.",
          "Use real names for shapes, and point out that a rectangle has two long sides and two short sides.",
        ],
        younger: "Draw around just one cup or lid a few times and turn the circles into faces or balloons.",
        older: "Try a picture using only one kind of shape, like all triangles. Count how many you used.",
      },
    },
    {
      slug: "lines-and-shapes-4",
      title: "Pattern party",
      emoji: "🔁",
      minutes: 30,
      goal: "I can make a pattern by repeating lines and shapes.",
      starter: [
        { type: "choice", q: "A plate is shaped like a...", options: ["circle", "triangle"], answer: 0 },
        { type: "choice", q: "How many sides does a triangle have?", options: ["Four", "Three"], answer: 1 },
        { type: "choice", q: "A square and a triangle can make a...", options: ["house", "fish", "cloud"], answer: 0 },
        { type: "choice", q: "Which shape has no corners?", options: ["Square", "Triangle", "Circle"], answer: 2 },
        {
          type: "match",
          q: "Match each thing to its shape.",
          pairs: [["A book", "Rectangle"], ["A coin", "Circle"], ["A slice of pizza", "Triangle"]],
        },
        { type: "choice", q: "What do you get when you join lines up?", options: ["A shape", "A song"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "What is a pattern?",
            picture: "/lessons/lines-and-shapes/lesson-4-1.jpg",
            alt: "Paper circles and squares in a repeating pattern",
            text: [
              "A pattern is something that repeats again and again.",
              "Circle, square, circle, square. That is a pattern!",
            ],
          },
          {
            heading: "Patterns with lines",
            picture: "/lessons/lines-and-shapes/lesson-4-2.jpg",
            alt: "A paper strip with a wavy and zigzag line pattern",
            text: [
              "You can make patterns with lines too. Try zigzag, wavy, zigzag, wavy.",
              "Or try thick, thin, thick, thin.",
            ],
          },
          {
            heading: "Patterns everywhere",
            picture: "/lessons/lines-and-shapes/lesson-4-3.jpg",
            alt: "Stripy socks, a checked tea towel, a spotty mug and a toy zebra",
            text: [
              "Look for patterns on clothes, wrapping paper and tiles.",
              "A zebra has a pattern of stripes. Stripes are lines in a row.",
            ],
          },
        ],
        words: [
          { word: "pattern", meaning: "something that repeats again and again" },
          { word: "repeat", meaning: "do the same thing again" },
          { word: "stripes", meaning: "lines in a row" },
        ],
      },
      practice: {
        intro: "What comes next?",
        questions: [
          { type: "choice", q: "Circle, square, circle, square, circle... What comes next?", options: ["Circle", "Square"], answer: 1 },
          { type: "choice", q: "Wavy, zigzag, wavy, zigzag... What comes next?", options: ["Wavy", "Zigzag"], answer: 0 },
          { type: "choice", q: "Big, small, big, small... What comes next?", options: ["Small", "Big"], answer: 1 },
          { type: "choice", q: "Which one is a pattern?", options: ["Red, blue, red, blue", "Red, cat, seven, hat"], answer: 0 },
        ],
      },
      task: {
        title: "Pattern strip",
        intro: "Make a long strip covered in patterns, like a bookmark or a crown.",
        need: ["A long strip of paper", "Pencils and crayons", "A grown-up to cut the strip, if you need one"],
        steps: [
          "Ask a grown-up to help cut a long strip of paper.",
          "Draw lines across the strip to make lots of boxes.",
          "Choose two shapes, like a circle and a triangle.",
          "Draw them in the boxes: circle, triangle, circle, triangle.",
          "Add a line pattern along the edges, like wavy, zigzag, wavy, zigzag.",
          "Colour it in. You could tape the ends to make a crown!",
        ],
      },
      exit: [
        { type: "choice", q: "A pattern is something that...", options: ["repeats again and again", "only happens once"], answer: 0 },
        { type: "choice", q: "Triangle, circle, triangle, circle... What comes next?", options: ["Circle", "Triangle", "Square"], answer: 1 },
        { type: "choice", q: "Thick, thin, thick, thin... What comes next?", options: ["Thick", "Thin"], answer: 0 },
        { type: "choice", q: "Stripes are...", options: ["circles in a pile", "lines in a row"], answer: 1 },
        {
          type: "pick",
          q: "Which are patterns? There is more than one.",
          options: ["Wavy, zigzag, wavy, zigzag", "Dog, sun, tree", "Big, small, big, small"],
          answers: [0, 2],
        },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "Square, circle, square, ___.",
          bank: ["circle", "triangle", "square"],
          answers: ["circle"],
        },
      ],
      grownUp: {
        need: ["Paper (a long strip is nice)", "Crayons or felt pens", "Scissors for the grown-up"],
        tips: [
          "Say patterns out loud together, clapping on each one: 'circle, square, circle, square'.",
          "Go on a pattern hunt around the house: stripy socks, tiles, a checked tea towel.",
        ],
        younger: "Make a pattern with real things first, like spoon, fork, spoon, fork, then draw just two shapes.",
        older: "Try a pattern with three parts, like circle, circle, triangle, or change colour as well as shape.",
      },
    },
    {
      slug: "lines-and-shapes-5",
      title: "Look carefully",
      emoji: "🧸",
      minutes: 30,
      goal: "I can look carefully and draw my favourite toy.",
      starter: [
        { type: "choice", q: "A pattern is something that...", options: ["repeats", "never repeats"], answer: 0 },
        { type: "choice", q: "Circle, square, circle, square... What comes next?", options: ["Square", "Circle"], answer: 1 },
        { type: "choice", q: "Stripes are...", options: ["lines in a row", "dots in a pile"], answer: 0 },
        { type: "choice", q: "Thick, thin, thick... What comes next?", options: ["Thick", "Thin"], answer: 1 },
        {
          type: "pick",
          q: "Which are patterns? There is more than one.",
          options: ["Red, blue, red, blue", "Up, down, up, down", "Cat, hat, seven"],
          answers: [0, 1],
        },
        { type: "choice", q: "Where might you see a pattern?", options: ["On a stripy jumper", "Nowhere at all"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Be a looking artist",
            picture: "/lessons/lines-and-shapes/lesson-5-1.jpg",
            alt: "A boy looking closely at his teddy before drawing it",
            text: [
              "Artists look very carefully before they draw.",
              "They look, then draw a little. Then they look again.",
            ],
          },
          {
            heading: "Find the shapes",
            picture: "/lessons/lines-and-shapes/lesson-5-2.jpg",
            alt: "A teddy next to a drawing of it made from circles and an oval",
            text: [
              "Look at a teddy. Its head is a circle. Its ears are small circles too.",
              "Its tummy might be an oval, like an egg. Finding the shapes helps you start.",
            ],
          },
          {
            heading: "Add the lines",
            picture: "/lessons/lines-and-shapes/lesson-5-3.jpg",
            alt: "A girl adding eyes and buttons to her teddy drawing",
            text: [
              "Now look for lines. Is the fur curly? Is there a zigzag stitch?",
              "Look for little things too, like eyes, buttons and a nose. Add them last.",
            ],
          },
        ],
        words: [
          { word: "look carefully", meaning: "look slowly to see every bit" },
          { word: "oval", meaning: "a round shape like an egg" },
          { word: "detail", meaning: "a small part, like a button or an eye" },
        ],
      },
      practice: {
        intro: "Looking like an artist.",
        questions: [
          {
            type: "order",
            q: "Put the steps in order.",
            items: ["Look carefully", "Draw the big shapes", "Add the lines", "Add the little details"],
          },
          { type: "choice", q: "A teddy's head is often shaped like a...", options: ["triangle", "circle"], answer: 1 },
          { type: "choice", q: "What shape is like an egg?", options: ["An oval", "A square", "A triangle"], answer: 0 },
          { type: "choice", q: "Artists look at the thing they are drawing...", options: ["only once", "again and again"], answer: 1 },
        ],
      },
      task: {
        title: "Draw my favourite toy",
        intro: "Choose a toy you love and draw it by looking very carefully.",
        need: ["Your favourite toy", "Paper", "A pencil and crayons"],
        steps: [
          "Sit your toy on the table in front of you.",
          "Look at it for a slow count of ten. What shapes can you see?",
          "Draw the big shapes first, lightly.",
          "Look again. Add the lines you can see.",
          "Look again. Add the little details, like eyes or buttons.",
          "Colour it in, using the colours you can really see.",
        ],
      },
      exit: [
        { type: "choice", q: "Before they draw, artists...", options: ["look very carefully", "close their eyes"], answer: 0 },
        { type: "choice", q: "What do you draw first?", options: ["The tiny details", "The big shapes"], answer: 1 },
        { type: "choice", q: "An oval is shaped like...", options: ["a box", "an egg", "a star"], answer: 1 },
        { type: "choice", q: "Eyes and buttons are...", options: ["patterns", "details"], answer: 1 },
        {
          type: "order",
          q: "Put the steps in order.",
          items: ["Look carefully", "Draw the big shapes", "Add the little details"],
        },
        { type: "choice", q: "While you draw, you should look at your toy...", options: ["again and again", "never"], answer: 0 },
      ],
      grownUp: {
        need: ["A favourite toy", "Paper, pencil, crayons"],
        tips: [
          "Ask looking questions: 'What shape is its head? Are its ears big or small? What colour are its feet?'",
          "Remind your child that drawings don't have to be perfect. Careful looking is the skill we're practising.",
        ],
        younger: "Trace the toy's outline in the air with a finger first, then draw just the big shapes.",
        older: "Draw the toy twice, from the front and from the side, and spot what changes.",
      },
    },
    {
      slug: "lines-and-shapes-6",
      title: "Paul Klee",
      emoji: "🏰",
      minutes: 30,
      goal: "I can talk about Paul Klee and make a picture from lines and shapes like him.",
      starter: [
        { type: "choice", q: "Before they draw, artists...", options: ["look carefully", "shut their eyes"], answer: 0 },
        { type: "choice", q: "What do you draw first?", options: ["The big shapes", "The tiny details"], answer: 0 },
        { type: "choice", q: "An oval is shaped like...", options: ["a box", "an egg"], answer: 1 },
        { type: "choice", q: "Eyes and buttons are...", options: ["stripes", "lines", "details"], answer: 2 },
        {
          type: "order",
          q: "Put the steps in order.",
          items: ["Look carefully", "Draw the big shapes", "Add the lines", "Add the little details"],
        },
        { type: "choice", q: "While you draw, you look at your toy...", options: ["once", "again and again"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Meet Paul Klee",
            picture: "/lessons/lines-and-shapes/lesson-6-1.jpg",
            alt: "A violin beside a sketchbook of lines and shapes",
            text: [
              "Paul Klee was an artist. You say his name 'Clay'.",
              "He was born in Switzerland a long time ago, in 1879. He loved music and played the violin.",
            ],
          },
          {
            heading: "Taking a line for a walk",
            picture: "/lessons/lines-and-shapes/lesson-6-2.jpg",
            alt: "One long wandering pencil line drawn without lifting",
            text: [
              "Paul Klee said drawing is like taking a line for a walk.",
              "Put your pencil down and let it wander. Round and round, up and down. Don't lift it until the walk is over!",
            ],
          },
          {
            heading: "A castle made of shapes",
            picture: "/lessons/lines-and-shapes/lesson-6-3.jpg",
            alt: "A child's castle drawing made of bright squares, rectangles and triangles",
            text: [
              "One of his paintings is called 'Castle and Sun'. It is made of squares, rectangles and triangles in bright colours.",
              "Up in the sky there is a round sun. Simple shapes make a whole castle!",
            ],
          },
        ],
        words: [
          { word: "artist", meaning: "a person who makes art" },
          { word: "Paul Klee", meaning: "an artist who loved lines, shapes and music" },
          { word: "simple", meaning: "easy and not fussy" },
        ],
      },
      practice: {
        intro: "What do you know about Paul Klee?",
        questions: [
          { type: "choice", q: "How do you say Klee?", options: ["Clay", "Key", "Kelly"], answer: 0 },
          { type: "choice", q: "Paul Klee said drawing is like taking a line for a...", options: ["swim", "walk"], answer: 1 },
          {
            type: "pick",
            q: "Which shapes are in 'Castle and Sun'? There is more than one.",
            options: ["Squares", "Triangles", "Hearts", "A circle for the sun"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "Which instrument did Paul Klee play?", options: ["The drums", "The violin"], answer: 1 },
        ],
      },
      task: {
        title: "My shape castle",
        intro: "Take a line for a walk, then build a castle out of shapes, like Paul Klee.",
        need: ["Two sheets of paper", "A pencil", "Bright crayons or felt pens", "A ruler (if you like)"],
        steps: [
          "Warm up: take a line for a walk on one sheet. Don't lift your pencil!",
          "On the other sheet, draw lots of squares and rectangles for the castle walls.",
          "Add triangles on top for the roofs.",
          "Draw a big circle in the sky for the sun.",
          "Colour each shape a different bright colour.",
        ],
      },
      exit: [
        { type: "choice", q: "Paul Klee was...", options: ["a footballer", "an artist"], answer: 1 },
        { type: "choice", q: "Paul Klee said drawing is like taking a line for a...", options: ["nap", "swim", "walk"], answer: 2 },
        { type: "choice", q: "What did Paul Klee love as well as art?", options: ["Music", "Cooking"], answer: 0 },
        { type: "choice", q: "'Castle and Sun' is made of...", options: ["photos", "simple shapes"], answer: 1 },
        {
          type: "pick",
          q: "Which shapes are in 'Castle and Sun'? There is more than one.",
          options: ["Triangles", "Stars", "Squares", "Rectangles"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "When you take a line for a walk, you...", options: ["lift your pencil a lot", "keep your pencil on the paper"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper, pencil, bright crayons or felt pens"],
        tips: [
          "Look up 'Castle and Sun' (1928) by Paul Klee together online, and also his face painting 'Senecio'. Ask: 'What shapes can you see?'",
          "Paul Klee's exact words were about 'an active line on a walk'; 'taking a line for a walk' is how most people say it today.",
        ],
        younger: "Just take a line for a walk, then colour in the spaces your line made, each a different colour.",
        older: "Look at 'Senecio' and make a face using only simple shapes, like circles, triangles and squares.",
      },
    },
  ],
};
