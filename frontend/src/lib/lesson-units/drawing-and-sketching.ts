import type { LessonUnit } from "@/lib/lessons";

/** Drawing and sketching, for ages 7 to 9. Only pencils, paper and things from around the house. No drawings are shown on the page; grown-ups look up the artists' work together. */
export const drawingAndSketching: LessonUnit = {
  slug: "drawing-and-sketching",
  title: "Drawing and sketching",
  short: "Drawing",
  subject: "Art & Design",
  ages: "7 to 9",
  emoji: "✏️",
  color: "#5E6E8C",
  summary: "Six lessons with just a pencil and paper: lines and marks, shapes, light and shade, texture, the sketchbooks of Leonardo da Vinci and Albrecht Dürer, and a still life of your own.",
  cover: "/lessons/units/drawing-and-sketching.jpg",
  lessons: [
    {
      slug: "drawing-and-sketching-1",
      title: "Lines and marks",
      emoji: "〰️",
      minutes: 45,
      goal: "I can make lots of different lines and marks with a pencil, and press lightly or firmly to change them.",
      starter: [
        { type: "choice", q: "What do we usually draw with?", options: ["A spoon", "A pencil", "A sock"], answer: 1 },
        { type: "choice", q: "What is the black or grey middle of a pencil made of?", options: ["Lead", "Graphite", "Coal"], answer: 1, why: "We often call it 'lead', but it is really graphite mixed with clay." },
        {
          type: "pick",
          q: "Which of these could you draw on? There is more than one.",
          options: ["Paper", "An old envelope", "A glass of water", "Card"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "Which of these is a zigzag line?", options: ["~~~~", "/\\/\\/\\", "- - - -"], answer: 1 },
        { type: "choice", q: "What do you use to rub out a pencil mark?", options: ["A ruler", "A sharpener", "A rubber"], answer: 2 },
        { type: "choice", q: "Which person's job is to make drawings and paintings?", options: ["An artist", "A baker", "A plumber"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Every drawing starts with a line",
            text: [
              "A line is a mark made by moving a pencil across paper. Every drawing is built from lines and marks.",
              "Lines can be straight, curved, wavy, zigzag, dotted or spiral. They can be thick or thin, long or short.",
              "Different lines give different feelings. A zigzag can look spiky or angry. A gentle wavy line can look calm, like water.",
            ],
          },
          {
            heading: "Mark-making",
            text: [
              "Mark-making means all the different marks you can make: dots, dashes, ticks, crosses, curls and scribbles.",
              "Artists use marks to show things. Tiny dots can be sand. Short flicks can be grass. Curls can be a sheep's woolly coat.",
              "Try holding your pencil in different ways: near the tip for small, careful marks, and further back for big, loose ones.",
            ],
          },
          {
            heading: "Light and heavy",
            text: [
              "How hard you press changes your mark. This is called pressure.",
              "Press lightly and you get a pale, thin line. Press firmly and you get a dark, strong line.",
              "Pencils have letters on the side. H pencils are hard and make light lines. B pencils are soft and make dark lines. HB is in the middle, and it is the pencil most of us have at home.",
            ],
          },
        ],
        words: [
          { word: "line", meaning: "a mark made by moving a pencil across paper" },
          { word: "mark-making", meaning: "the different marks you can make, like dots, dashes and curls" },
          { word: "pressure", meaning: "how hard you press with your pencil" },
          { word: "graphite", meaning: "the grey material inside a pencil" },
        ],
      },
      practice: {
        intro: "Lines and marks.",
        questions: [
          {
            type: "match",
            q: "Match each mark to something it could show.",
            pairs: [["Tiny dots", "Sand"], ["Short flicks", "Grass"], ["Curls", "A sheep's wool"], ["Wavy lines", "Water"]],
          },
          { type: "choice", q: "You want a pale, thin line. What should you do?", options: ["Press firmly", "Press lightly"], answer: 1 },
          { type: "choice", q: "Which pencil makes the darkest lines?", options: ["H", "HB", "B"], answer: 2 },
          {
            type: "gap",
            q: "Fill the gaps.",
            text: "Press ___ for a dark line and ___ for a pale line.",
            bank: ["firmly", "lightly", "sideways"],
            answers: ["firmly", "lightly"],
          },
        ],
      },
      task: {
        title: "A page of marks",
        intro: "Fill a whole page with every kind of line and mark you can invent.",
        need: ["A pencil (any kind)", "A sheet of paper", "A ruler or a book to help you fold"],
        steps: [
          "Fold your paper in half, then in half again, then once more. Open it out. You now have eight boxes.",
          "In the first box, draw straight, wavy and zigzag lines. In the next, try dots, dashes and crosses.",
          "Make one box all spirals and curls. Make another box using only very light lines, and another using only very dark ones.",
          "In the last boxes, invent marks of your own. Can you make a mark that looks like rain? Or fur? Or a feeling, like excited or sleepy?",
        ],
      },
      exit: [
        { type: "choice", q: "What is mark-making?", options: ["Making lots of different marks, like dots and dashes", "Giving your work a score", "Colouring in neatly"], answer: 0 },
        { type: "choice", q: "What happens when you press firmly with your pencil?", options: ["The line gets paler", "The line gets darker", "The line disappears"], answer: 1 },
        { type: "choice", q: "What does a B pencil do?", options: ["Makes hard, light lines", "Rubs out mistakes", "Makes soft, dark lines"], answer: 2 },
        {
          type: "pick",
          q: "Which are kinds of line? There is more than one.",
          options: ["Wavy", "Zigzag", "Purple", "Dotted"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "What is the word for how hard you press with your pencil?", answer: ["pressure", "Pressure"] },
        { type: "choice", q: "A gentle wavy line can make a picture look...", options: ["spiky and angry", "calm, like water"], answer: 1 },
      ],
      grownUp: {
        need: ["A pencil and a sheet of paper", "If you have them, a few different pencils (HB, 2B, 4B)"],
        tips: [
          "There are no mistakes in this lesson. Every mark is an experiment, so hide the rubber for today!",
          "If you only have one pencil, that's fine. Pressure alone gives a big range of light and dark.",
          "Ask 'what could that mark be used to draw?' to link marks to real things.",
        ],
        younger: "Draw lines to music: wavy lines for slow music, zigzags for fast music.",
        older: "Make a 'mark dictionary': ten marks, each labelled with something it could show, like bark, hair, rain or bricks.",
      },
    },
    {
      slug: "drawing-and-sketching-2",
      title: "Shapes and looking closely",
      emoji: "🍐",
      minutes: 45,
      goal: "I can find simple shapes in objects and draw what I really see by looking closely.",
      starter: [
        { type: "choice", q: "Which pencil makes soft, dark lines?", options: ["H", "B"], answer: 1 },
        { type: "choice", q: "What happens if you press lightly with your pencil?", options: ["You get a pale line", "You get a dark line"], answer: 0 },
        {
          type: "match",
          q: "Match each mark to something it could show.",
          pairs: [["Tiny dots", "Sand"], ["Curls", "A sheep's wool"], ["Short flicks", "Grass"]],
        },
        { type: "choice", q: "What is the word for how hard you press with a pencil?", options: ["Pattern", "Shape", "Pressure"], answer: 2 },
        { type: "choice", q: "What is inside a pencil?", options: ["Graphite", "Chalk", "Ink"], answer: 0 },
        {
          type: "pick",
          q: "Which of these are marks you could make? There is more than one.",
          options: ["Dots", "Dashes", "Spirals", "Smells"],
          answers: [0, 1, 2],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Shapes hiding everywhere",
            text: [
              "Almost everything can be drawn by starting with simple shapes: circles, ovals, squares, rectangles and triangles.",
              "A mug is a rectangle with an oval on top and a curved handle. A cat sitting down is a big oval for its body and a circle for its head, with two triangle ears.",
              "Artists sketch these shapes very lightly first, then draw the real edges over the top.",
            ],
          },
          {
            heading: "Observational drawing",
            text: [
              "Observational drawing means drawing something real that is in front of you, not from memory.",
              "Good artists look more than they draw. Look at the object, draw a little, then look again.",
              "Our brains like to draw what we think things look like. A drawing of a leaf from memory is often a simple oval. A real leaf has wobbly edges, veins and maybe a hole where a bug has nibbled it!",
            ],
          },
          {
            heading: "Compare sizes",
            text: [
              "Compare the parts of your object with each other. Is the handle half as tall as the mug? Is the pear's top narrower than its bottom?",
              "The outline is the line around the outside edge of a shape.",
              "A fun warm-up is a blind contour drawing: you draw the outline slowly without looking at your paper at all. It looks funny, but it trains your eyes to really look.",
            ],
          },
        ],
        words: [
          { word: "observational drawing", meaning: "drawing something real that is in front of you" },
          { word: "shape", meaning: "a flat outline, like a circle, square or triangle" },
          { word: "outline", meaning: "the line around the outside edge of a shape" },
          { word: "sketch", meaning: "a quick, light drawing" },
        ],
      },
      practice: {
        intro: "Find the shapes.",
        questions: [
          {
            type: "match",
            q: "Match each object to the shape you could start it with.",
            pairs: [["An orange", "A circle"], ["A book", "A rectangle"], ["An egg", "An oval"], ["A slice of pizza", "A triangle"]],
          },
          { type: "choice", q: "What is observational drawing?", options: ["Drawing from memory", "Drawing something real in front of you", "Copying a cartoon"], answer: 1 },
          {
            type: "order",
            q: "Put the steps for drawing a mug in order.",
            items: ["Look carefully at the mug", "Sketch the simple shapes lightly", "Draw the real edges over the top", "Look again and add the details"],
          },
          { type: "choice", q: "When you start a drawing, your first shapes should be...", options: ["very light", "very dark"], answer: 0 },
        ],
      },
      task: {
        title: "Fruit bowl detective",
        intro: "Draw a piece of fruit by looking, looking and looking again.",
        need: ["A pencil and paper", "A piece of fruit or vegetable, such as an apple, pear, banana or pepper"],
        steps: [
          "Warm up: do a blind contour drawing of your hand. Don't peek at the paper! Laugh at the result.",
          "Put your fruit on the table in front of you. Look at it for one whole minute before you draw. What shapes can you see?",
          "Sketch those simple shapes very lightly.",
          "Now draw the real outline over the top. Look up at the fruit after every few lines.",
          "Add the details you can see: the stalk, a bruise, a little leaf, the bumps and dents.",
        ],
      },
      exit: [
        { type: "choice", q: "Which shape could you start with to draw a ball?", options: ["A triangle", "A square", "A circle"], answer: 2 },
        { type: "choice", q: "Good artists...", options: ["look more than they draw", "never look at the object", "draw everything from memory"], answer: 0 },
        { type: "choice", q: "What is an outline?", options: ["The line around the outside edge of a shape", "A very dark shadow", "A type of pencil"], answer: 0 },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "Drawing something real that is in front of you is called ___ drawing.",
          bank: ["observational", "memory", "cartoon"],
          answers: ["observational"],
        },
        { type: "choice", q: "In a blind contour drawing, you...", options: ["close the curtains", "don't look at your paper", "use a ruler"], answer: 1 },
        { type: "choice", q: "Why should you sketch your first shapes lightly?", options: ["So they are easy to draw over or rub out", "So nobody can see your drawing"], answer: 0 },
      ],
      grownUp: {
        need: ["Pencil and paper", "A piece of fruit or vegetable with an interesting shape"],
        tips: [
          "Children often draw from memory even with the object in front of them. Keep gently asking 'is that what you can see?'",
          "Blind contour drawings always look silly. That is the point, so laugh together and do one yourself.",
        ],
        younger: "Trace around the edge of the fruit with a finger first, then draw that same path on paper.",
        older: "Draw the same fruit from three different sides on one page. How does the shape change?",
      },
    },
    {
      slug: "drawing-and-sketching-3",
      title: "Light, shade and tone",
      emoji: "🌗",
      minutes: 45,
      goal: "I can use pencil pressure, hatching and cross-hatching to show light and shade.",
      starter: [
        { type: "choice", q: "What is observational drawing?", options: ["Drawing something real in front of you", "Drawing from memory"], answer: 0 },
        { type: "choice", q: "Which shape could you start with to draw an egg?", options: ["A square", "An oval", "A triangle"], answer: 1 },
        { type: "choice", q: "What is an outline?", options: ["A shadow", "A kind of rubber", "The line around the outside edge of a shape"], answer: 2 },
        {
          type: "match",
          q: "Match each object to its starting shape.",
          pairs: [["A book", "A rectangle"], ["An orange", "A circle"], ["A slice of pizza", "A triangle"]],
        },
        { type: "choice", q: "Good artists look...", options: ["more than they draw", "less than they draw"], answer: 0 },
        { type: "type", q: "What do we call a quick, light drawing? A s...", answer: ["sketch", "Sketch", "a sketch"] },
      ],
      learn: {
        cards: [
          {
            heading: "What is tone?",
            text: [
              "Tone means how light or dark something is.",
              "Light comes from somewhere, like a window, a lamp or the sun. This is the light source. The side of an object facing the light is light. The side facing away is darker.",
              "The brightest spot, where the light hits hardest, is the highlight. The dark shape an object makes on the table is its cast shadow.",
            ],
          },
          {
            heading: "Pressure makes tone",
            text: [
              "Remember pressure? You can use it to make tone. Press very lightly for pale grey, a bit harder for middle grey, and firmly for dark grey.",
              "A tonal scale is a row of boxes going from white to the darkest dark you can make, a little darker in each box.",
              "Adding tone makes a flat circle start to look like a round ball. That is how drawings look 3D.",
            ],
          },
          {
            heading: "Hatching and cross-hatching",
            text: [
              "Hatching is drawing lots of lines side by side, all going the same way. The closer together the lines, the darker it looks.",
              "Cross-hatching is adding another layer of lines that cross over the first ones. More layers make it darker still.",
              "Stippling uses lots of tiny dots instead. Lots of dots close together look dark. A few dots spread out look light.",
            ],
          },
        ],
        words: [
          { word: "tone", meaning: "how light or dark something is" },
          { word: "light source", meaning: "where the light is coming from" },
          { word: "highlight", meaning: "the brightest spot, where the light hits" },
          { word: "cast shadow", meaning: "the dark shape an object makes on the surface beside it" },
          { word: "hatching", meaning: "lines drawn side by side to show tone" },
          { word: "cross-hatching", meaning: "layers of lines that cross over each other to show darker tone" },
        ],
      },
      practice: {
        intro: "Light and dark.",
        questions: [
          {
            type: "match",
            q: "Match each word to its meaning.",
            pairs: [["Tone", "How light or dark something is"], ["Highlight", "The brightest spot"], ["Hatching", "Lines side by side"], ["Stippling", "Lots of tiny dots"]],
          },
          { type: "choice", q: "Which hatching looks darker?", options: ["Lines far apart", "Lines close together"], answer: 1 },
          {
            type: "order",
            q: "Put these tones in order, from lightest to darkest.",
            items: ["White paper", "Very light pressure", "Medium pressure", "Firm pressure", "Cross-hatching pressed firmly"],
          },
          { type: "choice", q: "A lamp is on the left of an apple. Which side of the apple is darker?", options: ["The left side", "The right side"], answer: 1 },
        ],
      },
      task: {
        title: "Make an egg look round",
        intro: "Turn a flat oval into an egg you could almost pick up.",
        need: ["A pencil and paper", "An egg, a ball or an orange", "A lamp or a sunny window"],
        steps: [
          "Draw a tonal scale: six boxes in a row. Leave the first one white and make each box a little darker than the one before.",
          "Put your egg on a sheet of paper near a lamp or window. Which side is light? Where is the highlight? Where is the cast shadow?",
          "Draw the egg's outline lightly. Leave the highlight as white paper.",
          "Shade the egg, pressing harder on the side away from the light. Use hatching or cross-hatching if you like.",
          "Shade the cast shadow on the table. It is often darkest right underneath the egg.",
        ],
      },
      exit: [
        { type: "choice", q: "What is tone?", options: ["How light or dark something is", "A kind of line", "The shape of an object"], answer: 0 },
        { type: "choice", q: "What is cross-hatching?", options: ["Lots of tiny dots", "Layers of lines that cross over each other", "Rubbing out mistakes"], answer: 1 },
        { type: "choice", q: "The side of an object facing away from the light is...", options: ["lighter", "darker"], answer: 1 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "The brightest spot is the ___. The dark shape on the table is the ___ shadow.",
          bank: ["highlight", "cast", "outline", "tonal"],
          answers: ["highlight", "cast"],
        },
        { type: "choice", q: "How do you make a darker tone with one pencil?", options: ["Press more lightly", "Press more firmly", "Hold it upside down"], answer: 1 },
        { type: "choice", q: "What do we call where the light is coming from?", options: ["The highlight", "The tonal scale", "The light source"], answer: 2 },
      ],
      grownUp: {
        need: ["Pencil and paper", "An egg, ball or orange", "A desk lamp or a sunny window"],
        tips: [
          "One strong light from the side works best. Turn off the big ceiling light so the shadows show up clearly.",
          "Squinting at the object makes the light and dark parts easier to see. Show your child how.",
          "If you have a soft pencil (2B or darker), it makes this lesson much easier, but an HB is fine.",
        ],
        younger: "Shade one side of a drawn circle dark and the other side light, and see how it looks like a ball.",
        older: "Draw three eggs: one with pressure shading, one with hatching, and one with stippling. Which works best?",
      },
    },
    {
      slug: "drawing-and-sketching-4",
      title: "Texture: fur, bark and bumps",
      emoji: "🐾",
      minutes: 45,
      goal: "I can use different marks to show texture, and draw a pet, a soft toy or a plant from life.",
      starter: [
        { type: "choice", q: "What is tone?", options: ["How light or dark something is", "How big something is"], answer: 0 },
        { type: "choice", q: "What is hatching?", options: ["Lines drawn side by side", "Tiny dots", "A thick outline"], answer: 0 },
        {
          type: "match",
          q: "Match each word to its meaning.",
          pairs: [["Highlight", "The brightest spot"], ["Cast shadow", "The dark shape on the table"], ["Light source", "Where the light comes from"]],
        },
        { type: "choice", q: "Which looks darker?", options: ["One layer of hatching", "Cross-hatching with two layers"], answer: 1 },
        { type: "choice", q: "What is stippling?", options: ["Lines that cross over", "Rubbing out", "Lots of tiny dots"], answer: 2 },
        { type: "choice", q: "The side of an egg facing away from the lamp looks...", options: ["lighter", "darker", "exactly the same"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is texture?",
            text: [
              "Texture is how something feels when you touch it: rough, smooth, bumpy, furry, spiky or soft.",
              "In a drawing, you can't really touch the texture. So artists use marks to show what it would feel like.",
              "Short flicky lines can look like fur. Long wobbly lines can look like tree bark. Little circles can look like bumpy orange peel.",
            ],
          },
          {
            heading: "Rubbings",
            text: [
              "A rubbing is a way to collect real textures. Put thin paper over a bumpy surface and rub over it with the side of your pencil.",
              "The bumps and patterns appear on your paper as if by magic. Try a coin, a leaf, a cheese grater or the sole of a shoe.",
              "Artists have used rubbings in their pictures too. A German artist called Max Ernst called it frottage, the French word for rubbing.",
            ],
          },
          {
            heading: "Drawing from life",
            text: [
              "Drawing from life means drawing something real while you look at it: a pet, a plant, a person or an object.",
              "Pets move, so draw them fast! Do quick sketches of just the main shapes. A sleeping pet is the easiest model of all.",
              "Plants keep still, so you can take your time. Look at how the leaves join the stem and at the lines on each leaf, called veins.",
            ],
          },
        ],
        words: [
          { word: "texture", meaning: "how something feels, or looks like it would feel" },
          { word: "rubbing", meaning: "rubbing a pencil over paper on a bumpy surface to copy its texture" },
          { word: "drawing from life", meaning: "drawing something real while you look at it" },
          { word: "veins", meaning: "the thin lines on a leaf" },
        ],
      },
      practice: {
        intro: "Show the texture.",
        questions: [
          {
            type: "match",
            q: "Match each texture to a mark that could show it.",
            pairs: [["Fur", "Short flicky lines"], ["Tree bark", "Long wobbly lines"], ["Orange peel", "Little circles"], ["Smooth glass", "Very light, even shading"]],
          },
          {
            type: "pick",
            q: "Which words describe texture? There is more than one.",
            options: ["Rough", "Furry", "Seven", "Bumpy"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "To make a rubbing, you rub with...", options: ["the side of your pencil", "a wet sponge", "your finger"], answer: 0 },
          { type: "choice", q: "Your cat keeps moving. What should you do?", options: ["Give up", "Do quick sketches of the main shapes", "Ask it to sit still for an hour"], answer: 1 },
        ],
      },
      task: {
        title: "Texture hunt and a drawing from life",
        intro: "Collect textures from around your home, then use marks to draw something furry, leafy or bumpy.",
        need: ["A pencil and some thin paper (printer paper works)", "Bumpy things to rub, like a coin, a leaf or a grater", "A pet, a soft toy or a house plant to draw"],
        steps: [
          "Go on a texture hunt. Make at least five rubbings of different surfaces. Can your family guess what each one is?",
          "Next to each rubbing, try to copy the texture using only pencil marks, without rubbing.",
          "Choose your model: a pet (best when it's asleep!), a soft toy, or a plant.",
          "Draw the main shapes lightly, then fill them with texture marks: fur, leaf veins, or bumps.",
          "Add some tone too. Where is it darker? Press harder there.",
        ],
      },
      exit: [
        { type: "choice", q: "What is texture?", options: ["How light or dark something is", "How something feels, or looks like it would feel", "The outline of a shape"], answer: 1 },
        { type: "choice", q: "Which marks could show fur?", options: ["Short flicky lines", "One straight line", "A big empty circle"], answer: 0 },
        { type: "choice", q: "What does drawing from life mean?", options: ["Drawing a cartoon", "Drawing something real while you look at it"], answer: 1 },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "Put paper over a bumpy surface and rub with your pencil to make a ___.",
          bank: ["sketch", "rubbing", "shadow"],
          answers: ["rubbing"],
        },
        { type: "type", q: "What are the thin lines on a leaf called?", answer: ["veins", "Veins", "vein"] },
        { type: "choice", q: "Which model is easiest to draw?", options: ["A cat chasing a ball", "A dog running in the park", "A sleeping pet"], answer: 2 },
      ],
      grownUp: {
        need: ["Pencils and thin paper", "Things to rub: coins, leaves, a grater, a shoe sole, a radiator cover", "A pet, a soft toy or a house plant"],
        tips: [
          "Thin paper and a soft pencil held on its side make the best rubbings. Tape the paper down so it doesn't slide.",
          "If you have a pet, wait until it's dozing. Even then, encourage lots of quick 2-minute sketches instead of one slow one.",
          "If you have no pet, a soft toy or a slipper works just as well for fur.",
        ],
        younger: "Do the rubbings and play a guessing game. Then draw one simple furry or bumpy thing.",
        older: "Draw the same animal twice: once with only outlines, once with texture marks. Write one sentence about the difference.",
      },
    },
    {
      slug: "drawing-and-sketching-5",
      title: "Leonardo and Dürer: great drawers",
      emoji: "📓",
      minutes: 50,
      goal: "I can describe the drawings of Leonardo da Vinci and Albrecht Dürer and make a study page in their style.",
      starter: [
        { type: "choice", q: "What is texture?", options: ["How something feels, or looks like it would feel", "How light or dark it is"], answer: 0 },
        { type: "choice", q: "Short flicky lines could show...", options: ["smooth glass", "fur"], answer: 1 },
        {
          type: "pick",
          q: "Which words describe texture? There is more than one.",
          options: ["Furry", "Bumpy", "Triangle", "Rough"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "What does drawing from life mean?", options: ["Drawing from memory", "Copying a photo", "Drawing something real while you look at it"], answer: 2 },
        { type: "choice", q: "How do you make a rubbing?", options: ["Rub a pencil over paper on a bumpy surface", "Rub out your drawing", "Draw with your finger"], answer: 0 },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "The thin lines on a leaf are called ___.",
          bank: ["veins", "stalks", "petals"],
          answers: ["veins"],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Leonardo da Vinci's notebooks",
            text: [
              "Leonardo da Vinci was an Italian artist and inventor. He lived from 1452 to 1519 and painted the Mona Lisa.",
              "He always carried a notebook. He filled thousands of pages with drawings of people, horses, plants, flowing water and inventions like flying machines.",
              "He wrote his notes in mirror writing, from right to left, so you need a mirror to read them easily. He was left-handed.",
              "Hundreds of his drawings belong to the Royal Collection and are kept at Windsor Castle.",
            ],
          },
          {
            heading: "Albrecht Dürer",
            text: [
              "Albrecht Dürer was a German artist from the city of Nuremberg. He lived from 1471 to 1528.",
              "When he was just 13, he drew a picture of himself using a mirror. It is one of the oldest self-portraits by a child that we know of.",
              "In 1502 he made Young Hare, a hare so detailed you can see single hairs and even a window reflected in its eye. It is in a gallery in Vienna, Austria.",
            ],
          },
          {
            heading: "A study",
            text: [
              "Both artists made studies: careful drawings to learn about something, like a hand, a face, a plant or an animal.",
              "Leonardo often drew the same thing many times on one page, from different sides, with notes beside it.",
              "Dürer even made a famous print of a rhinoceros in 1515 without ever seeing one! He worked from a written description and a sketch someone sent him. That is why it looks like it's wearing armour.",
            ],
          },
        ],
        words: [
          { word: "sketchbook", meaning: "a book of plain paper for drawing ideas and studies" },
          { word: "study", meaning: "a careful drawing made to learn about something" },
          { word: "self-portrait", meaning: "a picture an artist makes of themselves" },
          { word: "mirror writing", meaning: "writing that goes backwards, from right to left" },
        ],
      },
      practice: {
        intro: "Two great drawers.",
        questions: [
          {
            type: "match",
            q: "Match each artist to a fact about them.",
            pairs: [["Leonardo da Vinci", "Wrote in mirror writing"], ["Albrecht Dürer", "Drew a self-portrait aged 13"]],
          },
          { type: "choice", q: "Which country was Leonardo da Vinci from?", options: ["Germany", "Italy", "France"], answer: 1 },
          { type: "choice", q: "Which animal did Dürer draw so carefully you can see single hairs?", options: ["A hare", "A horse", "A cat"], answer: 0 },
          {
            type: "pick",
            q: "What did Leonardo draw in his notebooks? There is more than one.",
            options: ["Horses", "Flying machines", "Aeroplanes he had flown in", "Flowing water"],
            answers: [0, 1, 3],
            why: "Leonardo designed flying machines, but nobody had flown in an aeroplane until 1903.",
          },
          { type: "choice", q: "What is a self-portrait?", options: ["A picture of your house", "A picture an artist makes of themselves"], answer: 1 },
        ],
      },
      task: {
        title: "Make a study page",
        intro: "Fill one page like a page from Leonardo's notebook.",
        need: ["A pencil and paper", "Your own hand, or a leaf, a flower, a shell or a small toy animal", "A small mirror (optional)"],
        steps: [
          "With your grown-up, look up Leonardo's studies of hands and Dürer's Young Hare. Zoom in. What marks did they use?",
          "Pick one thing to study, like your own hand or a leaf from outside.",
          "Draw it at least three times on one page, from different sides or in different positions.",
          "Make one drawing big and careful, with tone and texture. Make the others quick sketches.",
          "Add a few notes beside your drawings about what you noticed. If you're brave, write one in mirror writing and check it with a mirror!",
        ],
      },
      exit: [
        { type: "choice", q: "Which famous painting did Leonardo da Vinci make?", options: ["The Starry Night", "The Mona Lisa", "The Snail"], answer: 1 },
        { type: "choice", q: "Which way did Leonardo write his notes?", options: ["In mirror writing, from right to left", "Upside down", "In circles"], answer: 0 },
        { type: "choice", q: "Which country was Albrecht Dürer from?", options: ["Italy", "Spain", "Germany"], answer: 2 },
        { type: "choice", q: "How old was Dürer when he drew his famous self-portrait?", options: ["13", "3", "80"], answer: 0 },
        {
          type: "match",
          q: "Match each word to its meaning.",
          pairs: [["Study", "A careful drawing to learn about something"], ["Self-portrait", "A picture of yourself"], ["Sketchbook", "A book of plain paper for drawing"]],
        },
        { type: "choice", q: "Why does Dürer's rhinoceros look like it's wearing armour?", options: ["He had never seen a real rhino", "Rhinos really wear armour", "He drew it at night"], answer: 0 },
      ],
      grownUp: {
        need: ["Pencil and paper", "A hand, leaf or small object to study", "A small mirror if you have one"],
        tips: [
          "Search for 'Leonardo da Vinci studies of hands Royal Collection' and 'Dürer Young Hare Albertina' to look at them together. The Royal Collection Trust website lets you zoom right in on Leonardo's drawings.",
          "Young Hare is painted with watercolour and fine brushes, but Dürer drew with the brush, so it's a great example of careful looking.",
          "Search 'Dürer Rhinoceros 1515' for the rhino. Children love spotting what he got wrong.",
        ],
        younger: "Draw your own hand three times: flat, making a fist, and waving.",
        older: "Try drawing a self-portrait using a mirror, like Dürer did at 13. Look more at the mirror than at the paper.",
      },
    },
    {
      slug: "drawing-and-sketching-6",
      title: "Still life and my sketchbook",
      emoji: "🫖",
      minutes: 50,
      goal: "I can set up and draw a still life using line, shape, tone and texture, and start my own sketchbook.",
      starter: [
        { type: "choice", q: "Who wrote his notes in mirror writing?", options: ["Albrecht Dürer", "Leonardo da Vinci"], answer: 1 },
        { type: "choice", q: "Who made Young Hare?", options: ["Albrecht Dürer", "Leonardo da Vinci"], answer: 0 },
        { type: "choice", q: "What is a study?", options: ["A careful drawing to learn about something", "A very fast scribble", "A frame for a picture"], answer: 0 },
        {
          type: "match",
          q: "Match each artist to their country.",
          pairs: [["Leonardo da Vinci", "Italy"], ["Albrecht Dürer", "Germany"]],
        },
        { type: "choice", q: "What is a self-portrait?", options: ["A drawing of a pet", "A drawing of a house", "A picture an artist makes of themselves"], answer: 2 },
        { type: "type", q: "What kind of book did Leonardo carry everywhere to draw in? A note...", answer: ["book", "notebook", "Notebook", "sketchbook"] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a still life?",
            text: [
              "A still life is a picture of objects that don't move, arranged by the artist. Fruit, cups, jugs, flowers and shells are favourites.",
              "Artists have drawn and painted still lifes for hundreds of years. It's a great way to practise, because your models never get bored or walk away!",
            ],
          },
          {
            heading: "Setting it up",
            text: [
              "Choose three to five objects with different shapes and textures, like a smooth mug, a bumpy orange and a soft sock.",
              "Overlap some of them, so one is partly in front of another. Put tall things at the back.",
              "Use a viewfinder to choose your picture: a piece of card with a small rectangle cut out. Look through it to frame your still life, like a camera.",
              "Shine a lamp from one side to get strong light and shadows.",
            ],
          },
          {
            heading: "Keeping a sketchbook",
            text: [
              "A sketchbook is a place to practise, try ideas and collect things you notice. It doesn't have to be neat.",
              "Draw in it a little and often: your breakfast, a shoe, the view from a window, your pet asleep. Write the date and a few notes, like Leonardo did.",
              "Look back through it sometimes. You'll be surprised how much your drawing grows.",
            ],
          },
        ],
        words: [
          { word: "still life", meaning: "a picture of objects that don't move, arranged by the artist" },
          { word: "overlap", meaning: "when one object is partly in front of another" },
          { word: "viewfinder", meaning: "a card frame you look through to choose what to draw" },
          { word: "composition", meaning: "how the parts of a picture are arranged" },
        ],
      },
      practice: {
        intro: "Bring it all together.",
        questions: [
          {
            type: "match",
            q: "Match each art word to its meaning.",
            pairs: [["Tone", "How light or dark something is"], ["Texture", "How something feels"], ["Line", "A mark made by moving a pencil"], ["Still life", "A picture of objects that don't move"]],
          },
          {
            type: "pick",
            q: "Which would be good objects for a still life? There is more than one.",
            options: ["An apple", "A mug", "A running dog", "A shell"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "What is a viewfinder for?", options: ["Choosing what to draw, like a camera", "Sharpening pencils", "Rubbing out"], answer: 0 },
          {
            type: "order",
            q: "Put the steps for drawing a still life in order.",
            items: ["Arrange your objects", "Choose your view with a viewfinder", "Sketch the simple shapes lightly", "Add tone and texture"],
          },
        ],
      },
      task: {
        title: "My still life, and my first sketchbook",
        intro: "Set up a still life, draw it using everything you've learned, and make a sketchbook to keep drawing in.",
        need: ["Pencil and paper", "Three to five objects from around the house", "A piece of card (a cereal box is perfect) and child's scissors", "A lamp", "For the sketchbook: a few sheets of paper, a stapler or string"],
        steps: [
          "Make a viewfinder: cut a small rectangle out of the middle of your card, with your grown-up's help.",
          "Arrange your objects on a table. Overlap some and put tall ones at the back. Shine the lamp from one side.",
          "Look through the viewfinder and choose your best view. Sketch the simple shapes lightly.",
          "Draw the real outlines, then add tone with pressure or hatching, and texture with marks.",
          "Fold a few sheets of paper in half and staple or tie them along the fold. That's your sketchbook! Put today's drawing on the front and the date inside.",
          "Look back at your drawings from this whole unit. What went well? What would you try next?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a still life?", options: ["A drawing of a moving animal", "A picture of objects that don't move, arranged by the artist", "A self-portrait"], answer: 1 },
        { type: "choice", q: "What does overlap mean?", options: ["One object is partly in front of another", "All the objects are far apart", "The drawing is upside down"], answer: 0 },
        { type: "choice", q: "Where should tall objects go in a still life?", options: ["At the front", "At the back"], answer: 1 },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "Look through a ___ to choose your picture, like a camera.",
          bank: ["viewfinder", "rubber", "sharpener"],
          answers: ["viewfinder"],
        },
        {
          type: "pick",
          q: "Which are good things to do in a sketchbook? There is more than one.",
          options: ["Try out ideas", "Only draw perfect pictures", "Write the date and notes", "Draw a little and often"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Why are still lifes good for practising?", options: ["They are always very small", "The objects keep still, so you can take your time", "You don't need to look at them"], answer: 1 },
      ],
      grownUp: {
        need: ["Pencil and paper", "A few household objects with different shapes and textures", "Card and child's scissors", "A lamp", "Stapler or string for the sketchbook"],
        tips: [
          "Help with cutting the viewfinder window, as card can be tough to cut.",
          "A sketchbook works best when it's never marked or judged. Make it a place where any drawing is welcome.",
          "Try keeping a sketchbook yourself and drawing alongside your child for ten minutes a week.",
        ],
        younger: "Draw a still life of just two objects, one in front of the other.",
        older: "Draw the same still life twice, once in the morning and once in the evening light. How do the shadows change?",
      },
    },
  ],
};
