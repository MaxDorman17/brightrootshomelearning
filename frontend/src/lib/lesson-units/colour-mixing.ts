import type { LessonUnit } from "@/lib/lessons";

/** Colour mixing, for ages 5 to 7. Only paints, crayons, food colouring in water and other household things. A grown-up reads along. */
export const colourMixing: LessonUnit = {
  slug: "colour-mixing",
  title: "Colour mixing",
  short: "Colour mixing",
  subject: "Art & Design",
  ages: "5 to 7",
  emoji: "🖍️",
  color: "#C98BA6",
  summary: "Six playful lessons on red, yellow and blue, mixing new colours, lighter and darker, warm and cool colours, a colour hunt, and the artist Piet Mondrian.",
  cover: "/lessons/units/colour-mixing.jpg",
  lessons: [
    {
      slug: "colour-mixing-1",
      title: "Red, yellow and blue",
      emoji: "🔴",
      minutes: 30,
      goal: "I can name the three primary colours.",
      starter: [
        { type: "choice", q: "What colour is a banana?", options: ["Blue", "Yellow", "Red"], answer: 1 },
        { type: "choice", q: "What colour is the sky on a sunny day?", options: ["Blue", "Pink"], answer: 0 },
        { type: "choice", q: "What colour is a ripe strawberry?", options: ["Green", "Purple", "Red"], answer: 2 },
        { type: "match", q: "Match each thing to its colour.", pairs: [["Grass", "Green"], ["Snow", "White"], ["A lemon", "Yellow"]] },
        { type: "pick", q: "Which of these can you use to make colours on paper? There is more than one.", options: ["Crayons", "Paints", "A spoon", "Felt-tip pens"], answers: [0, 1, 3] },
        { type: "choice", q: "Which of these is a colour?", options: ["Orange", "Table"], answer: 0, why: "Orange is a colour. A table is a thing." },
      ],
      learn: {
        cards: [
          {
            heading: "A world full of colour",
            text: [
              "Look around you. Colours are everywhere!",
              "Your clothes, your toys and your food all have colours. Which colours can you see right now?",
            ],
          },
          {
            heading: "Three special colours",
            text: [
              "Red, yellow and blue are very special colours. They are called the primary colours.",
              "Primary means first. Artists start with these three colours.",
              "You can't make red, yellow or blue by mixing other paints together.",
            ],
          },
          {
            heading: "Spot the primary colours",
            text: [
              "A red bus. A yellow duck. A blue sea.",
              "Primary colours are bright and bold. You will spot them all over the place.",
              "Can you point to something red, something yellow and something blue?",
            ],
          },
        ],
        words: [
          { word: "colour", meaning: "red, blue, green and the rest: what we see on things" },
          { word: "primary colours", meaning: "red, yellow and blue" },
          { word: "primary", meaning: "first" },
        ],
      },
      practice: {
        intro: "Let's find the primary colours.",
        questions: [
          { type: "pick", q: "Which are primary colours? Tap all three.", options: ["Red", "Green", "Yellow", "Blue"], answers: [0, 2, 3] },
          { type: "match", q: "Match each thing to its primary colour.", pairs: [["A fire engine", "Red"], ["The sun in a drawing", "Yellow"], ["The sea in a drawing", "Blue"]] },
          { type: "choice", q: "How many primary colours are there?", options: ["Two", "Three", "Ten"], answer: 1 },
          { type: "choice", q: "Is pink a primary colour?", options: ["Yes", "No"], answer: 1, why: "The primary colours are red, yellow and blue." },
        ],
      },
      task: {
        title: "Red, yellow and blue treasure",
        intro: "Go on a hunt around your home for the three primary colours.",
        need: ["Three pieces of paper", "A red, a yellow and a blue crayon", "Small toys and things from around the home"],
        steps: [
          "Colour one paper red, one yellow and one blue. These are your mats.",
          "Put the mats on the floor.",
          "Hunt for small red, yellow and blue things.",
          "Put each thing on the mat that matches.",
          "Which mat has the most things?",
        ],
      },
      exit: [
        { type: "pick", q: "Tap the three primary colours.", options: ["Blue", "Red", "Purple", "Yellow"], answers: [0, 1, 3] },
        { type: "choice", q: "What does primary mean?", options: ["Last", "First", "Small"], answer: 1 },
        { type: "choice", q: "Which is a primary colour?", options: ["Brown", "Red"], answer: 1 },
        { type: "choice", q: "Can you make yellow paint by mixing other paints?", options: ["No", "Yes"], answer: 0 },
        { type: "type", q: "How many primary colours are there? Type the number.", answer: ["3", "three"] },
        { type: "choice", q: "Which one is NOT a primary colour?", options: ["Blue", "Yellow", "Green"], answer: 2 },
      ],
      grownUp: {
        need: ["Paper", "Red, yellow and blue crayons", "Small toys or objects from around the home"],
        tips: [
          "Children often call lots of colours 'primary'. Keep the rhyme short: red, yellow, blue, just those three.",
          "Colours on screens and in printing use a different set of 'primaries'. For painting at this age, red, yellow and blue is the right answer.",
        ],
        younger: "Just hunt for one colour at a time, starting with red.",
        older: "Make a primary colour picture using only red, yellow and blue crayons, then say which colour you used most.",
      },
    },
    {
      slug: "colour-mixing-2",
      title: "Mixing new colours",
      emoji: "🧪",
      minutes: 30,
      goal: "I can mix two primary colours to make a new colour.",
      starter: [
        { type: "pick", q: "Tap the three primary colours.", options: ["Red", "Pink", "Yellow", "Blue"], answers: [0, 2, 3] },
        { type: "choice", q: "What does primary mean?", options: ["First", "Biggest"], answer: 0 },
        { type: "choice", q: "Which is a primary colour?", options: ["Orange", "Blue", "Grey"], answer: 1 },
        { type: "match", q: "Match each thing to its colour.", pairs: [["A fire engine", "Red"], ["A rubber duck", "Yellow"], ["The sea in a drawing", "Blue"]] },
        { type: "choice", q: "How many primary colours are there?", options: ["Three", "Six"], answer: 0 },
        { type: "choice", q: "Can you make red paint by mixing other paints?", options: ["Yes", "No"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Colour magic",
            text: [
              "When you mix two primary colours, you make a brand new colour!",
              "The new colours are called secondary colours. Secondary means second.",
            ],
          },
          {
            heading: "Three new colours",
            text: [
              "Red and yellow make orange.",
              "Yellow and blue make green.",
              "Red and blue make purple.",
            ],
          },
          {
            heading: "A little at a time",
            text: [
              "Mix slowly. Add a little bit, then stir.",
              "More yellow makes a yellowy green. More blue makes a bluey green.",
              "Wash your brush between colours, or they get muddy!",
            ],
          },
        ],
        words: [
          { word: "mix", meaning: "to stir things together" },
          { word: "secondary colours", meaning: "orange, green and purple" },
          { word: "secondary", meaning: "second" },
        ],
      },
      practice: {
        intro: "What colour will you make?",
        questions: [
          { type: "choice", q: "Red and yellow make...", options: ["green", "orange", "purple"], answer: 1 },
          { type: "choice", q: "Yellow and blue make...", options: ["green", "pink"], answer: 0 },
          { type: "choice", q: "Red and blue make...", options: ["orange", "brown", "purple"], answer: 2 },
          { type: "pick", q: "Which are secondary colours? There is more than one.", options: ["Orange", "Red", "Green", "Purple"], answers: [0, 2, 3] },
        ],
      },
      task: {
        title: "Magic mixing cups",
        intro: "Mix colours in water and watch the magic happen.",
        need: [
          "Clear cups or jars",
          "Water",
          "Red, yellow and blue food colouring",
          "A spoon",
          "A tray or old towel",
          "A grown-up to help",
        ],
        steps: [
          "With your grown-up, fill three cups halfway with water.",
          "Add a drop of red to one cup, yellow to one and blue to one. Stir.",
          "Pour a little red and a little yellow into an empty cup. What colour is it?",
          "Now try yellow and blue in another cup.",
          "Now try red and blue.",
          "Line up your six cups. Say each colour out loud.",
        ],
      },
      exit: [
        { type: "choice", q: "Red and yellow make...", options: ["purple", "orange", "green"], answer: 1 },
        { type: "choice", q: "Blue and yellow make...", options: ["green", "orange"], answer: 0 },
        { type: "choice", q: "Red and blue make...", options: ["yellow", "green", "purple"], answer: 2 },
        { type: "match", q: "Match the two colours to the colour they make.", pairs: [["Red and yellow", "Orange"], ["Yellow and blue", "Green"], ["Red and blue", "Purple"]] },
        { type: "choice", q: "What are orange, green and purple called?", options: ["Secondary colours", "Primary colours"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Wash your brush between colours, or they get ___.", bank: ["muddy", "bigger", "louder"], answers: ["muddy"] },
      ],
      grownUp: {
        need: ["Clear cups or jars", "Water", "Red, yellow and blue food colouring", "A spoon", "A tray or old towel"],
        tips: [
          "Food colouring stains clothes, skin and surfaces. Use a tray, roll up sleeves and keep a cloth handy.",
          "Stay with your child around water. A few drops of colouring is plenty.",
          "Purple from food colouring can come out dark or brownish. Use more red than blue if it looks too dark.",
        ],
        younger: "Just mix yellow and blue together and enjoy the green appearing.",
        older: "Try mixing all three primary colours in one cup. What happens? (It goes brown or murky.)",
      },
    },
    {
      slug: "colour-mixing-3",
      title: "Lighter and darker",
      emoji: "🌗",
      minutes: 30,
      goal: "I can make a colour lighter or darker.",
      starter: [
        { type: "choice", q: "Red and yellow make...", options: ["orange", "blue"], answer: 0 },
        { type: "choice", q: "Yellow and blue make...", options: ["purple", "green", "red"], answer: 1 },
        { type: "choice", q: "Red and blue make...", options: ["green", "orange", "purple"], answer: 2 },
        { type: "pick", q: "Tap the secondary colours. There is more than one.", options: ["Green", "Purple", "Yellow", "Orange"], answers: [0, 1, 3] },
        { type: "choice", q: "What does secondary mean?", options: ["Second", "Last"], answer: 0 },
        { type: "choice", q: "Why do we wash the brush between colours?", options: ["So the colours don't get muddy", "So the brush gets longer"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Add white",
            text: [
              "Add a little white paint to a colour. It gets lighter!",
              "Red and white make pink. Blue and white make a soft sky blue.",
              "A colour made lighter with white is called a tint.",
            ],
          },
          {
            heading: "Add black",
            text: [
              "Add a tiny bit of black paint to a colour. It gets darker!",
              "Black is very strong. Just a tiny dot is enough.",
              "A colour made darker with black is called a shade.",
            ],
          },
          {
            heading: "So many blues",
            text: [
              "With one blue, some white and a little black, you can make lots of blues.",
              "Pale blue like a summer sky. Dark blue like the night.",
              "Artists use light and dark colours to make their pictures interesting.",
            ],
          },
        ],
        words: [
          { word: "lighter", meaning: "more pale, closer to white" },
          { word: "darker", meaning: "deeper, closer to black" },
          { word: "tint", meaning: "a colour made lighter by adding white" },
          { word: "shade", meaning: "a colour made darker by adding black" },
        ],
      },
      practice: {
        intro: "Lighter or darker?",
        questions: [
          { type: "choice", q: "To make a colour lighter, add...", options: ["black", "white"], answer: 1 },
          { type: "choice", q: "To make a colour darker, add a tiny bit of...", options: ["white", "yellow", "black"], answer: 2 },
          { type: "choice", q: "Red and white make...", options: ["pink", "green", "purple"], answer: 0 },
          { type: "order", q: "Put these blues in order, from lightest to darkest.", items: ["Very pale blue", "Sky blue", "Dark blue like the night"] },
        ],
      },
      task: {
        title: "Colour steps",
        intro: "Make a staircase of one colour, from light to dark.",
        need: ["Paper", "Blue, white and black paint", "A brush", "A pot of water", "An old plate for mixing", "An apron or old T-shirt"],
        steps: [
          "Put a blob of blue paint in the middle of your plate.",
          "Paint one square of plain blue in the middle of your paper.",
          "Mix a little white into some blue. Paint a square on the left.",
          "Add more white. Paint another square, further left.",
          "Now mix a tiny dot of black into some blue. Paint a square on the right.",
          "Look along your steps. Which square is lightest? Which is darkest?",
        ],
      },
      exit: [
        { type: "choice", q: "What makes a colour lighter?", options: ["Adding white", "Adding black"], answer: 0 },
        { type: "choice", q: "What makes a colour darker?", options: ["Adding white", "Adding a tiny bit of black", "Adding water to the brush"], answer: 1 },
        { type: "choice", q: "Red and white make...", options: ["orange", "pink", "brown"], answer: 1 },
        { type: "choice", q: "How much black should you add?", options: ["A whole pot", "A tiny bit"], answer: 1, why: "Black is very strong, so a tiny bit is enough." },
        { type: "match", q: "Match each word to what it means.", pairs: [["Tint", "Colour plus white"], ["Shade", "Colour plus black"], ["Lighter", "More pale"]] },
        { type: "order", q: "Put these in order, from lightest to darkest.", items: ["Pale pink", "Red", "Dark red"] },
      ],
      grownUp: {
        need: ["Paper", "Blue, white and black paint (poster paint or ready-mix is fine)", "A brush, water pot and old plate", "An apron or old T-shirt"],
        tips: [
          "Give black paint in a tiny blob on the edge of the plate. A little goes a very long way.",
          "If you have no black, a little dark blue or brown also makes colours darker.",
        ],
        younger: "Just make two squares: blue, and blue with white. Talk about light and dark.",
        older: "Make colour steps for a second colour, such as red, with at least five squares.",
      },
    },
    {
      slug: "colour-mixing-4",
      title: "Warm and cool colours",
      emoji: "🔥",
      minutes: 30,
      goal: "I can sort colours into warm and cool.",
      starter: [
        { type: "choice", q: "What makes a colour lighter?", options: ["Adding black", "Adding white"], answer: 1 },
        { type: "choice", q: "What makes a colour darker?", options: ["Adding a tiny bit of black", "Adding white", "Adding yellow"], answer: 0 },
        { type: "choice", q: "Red and white make...", options: ["pink", "green"], answer: 0 },
        { type: "choice", q: "A colour made lighter with white is called a...", options: ["shade", "tint", "spot"], answer: 1 },
        { type: "choice", q: "How much black paint should you add?", options: ["A tiny bit", "Lots and lots"], answer: 0 },
        { type: "order", q: "Put these in order, from lightest to darkest.", items: ["Pale blue", "Blue", "Dark blue"] },
      ],
      learn: {
        cards: [
          {
            heading: "Warm colours",
            text: [
              "Red, orange and yellow are warm colours.",
              "They make us think of hot things, like the sun and a cosy fire.",
            ],
          },
          {
            heading: "Cool colours",
            text: [
              "Blue, green and purple are cool colours.",
              "They make us think of cold or calm things, like the sea, ice and shady trees.",
            ],
          },
          {
            heading: "Colours and feelings",
            text: [
              "Warm colours can feel bright, happy and full of energy.",
              "Cool colours can feel calm, quiet and peaceful.",
              "Which colours do you like best?",
            ],
          },
        ],
        words: [
          { word: "warm colours", meaning: "red, orange and yellow" },
          { word: "cool colours", meaning: "blue, green and purple" },
          { word: "calm", meaning: "quiet and peaceful" },
        ],
      },
      practice: {
        intro: "Warm or cool?",
        questions: [
          { type: "choice", q: "Is red warm or cool?", options: ["Warm", "Cool"], answer: 0 },
          { type: "choice", q: "Is blue warm or cool?", options: ["Warm", "Cool"], answer: 1 },
          { type: "pick", q: "Tap all the warm colours.", options: ["Yellow", "Green", "Orange", "Red"], answers: [0, 2, 3] },
          { type: "match", q: "Match each picture idea to its colours.", pairs: [["A sunny beach", "Warm colours"], ["An icy pond", "Cool colours"], ["A campfire", "Red and orange"]] },
        ],
      },
      task: {
        title: "Warm and cool baskets",
        intro: "Sort things around your home into warm colours and cool colours.",
        need: ["Two baskets, boxes or cushions", "Clothes, toys or blocks in lots of colours", "Paper and crayons"],
        steps: [
          "Call one basket 'warm' and one basket 'cool'.",
          "Find things in lots of colours.",
          "Put red, orange and yellow things in the warm basket.",
          "Put blue, green and purple things in the cool basket.",
          "Draw a sun using only warm crayons.",
          "Now draw a fish in the sea using only cool crayons.",
        ],
      },
      exit: [
        { type: "pick", q: "Tap the three warm colours.", options: ["Red", "Blue", "Yellow", "Orange"], answers: [0, 2, 3] },
        { type: "pick", q: "Tap the three cool colours.", options: ["Green", "Purple", "Red", "Blue"], answers: [0, 1, 3] },
        { type: "choice", q: "Warm colours make us think of...", options: ["snow and ice", "the sun and fire"], answer: 1 },
        { type: "choice", q: "Cool colours often feel...", options: ["calm", "noisy", "spicy"], answer: 0 },
        { type: "choice", q: "Is orange warm or cool?", options: ["Cool", "Warm"], answer: 1 },
        { type: "choice", q: "Which colours would be best for a picture of the sea?", options: ["Red and orange", "Yellow and red", "Blue and green"], answer: 2 },
      ],
      grownUp: {
        need: ["Two baskets or boxes", "Coloured clothes, toys or blocks", "Paper and crayons"],
        tips: [
          "Some colours are tricky, like pink or brown. Let your child decide and explain why. There's no wrong answer for those.",
          "Talk about how a room or a picture feels, not just which colours it has.",
        ],
        younger: "Sort just red things and blue things: 'hot like fire' and 'cold like water'.",
        older: "Draw the same house twice: once in warm colours and once in cool colours. Which one feels cosier?",
      },
    },
    {
      slug: "colour-mixing-5",
      title: "Colours in nature",
      emoji: "🍂",
      minutes: 30,
      goal: "I can find and match colours in nature.",
      starter: [
        { type: "pick", q: "Tap the warm colours. There is more than one.", options: ["Red", "Orange", "Blue", "Yellow"], answers: [0, 1, 3] },
        { type: "pick", q: "Tap the cool colours. There is more than one.", options: ["Yellow", "Blue", "Green", "Purple"], answers: [1, 2, 3] },
        { type: "choice", q: "Warm colours make us think of...", options: ["the sun", "ice"], answer: 0 },
        { type: "choice", q: "Cool colours can feel...", options: ["calm", "hot"], answer: 0 },
        { type: "choice", q: "Is purple warm or cool?", options: ["Warm", "Cool"], answer: 1 },
        { type: "choice", q: "Which colours would be best for a picture of a fire?", options: ["Blue and green", "Red and orange", "Purple and blue"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Nature's colours",
            text: [
              "Nature is full of colours. Green grass, blue sky, brown mud and grey stones.",
              "There are lots of different greens, too. Light greens, dark greens and yellowy greens!",
            ],
          },
          {
            heading: "Bright flowers",
            text: [
              "Many flowers have bright colours, like red, yellow and purple.",
              "The bright colours help bees and butterflies find the flowers.",
              "Look, but don't pick flowers that grow in parks or gardens that aren't yours.",
            ],
          },
          {
            heading: "Colours change",
            text: [
              "In autumn, many leaves change from green to red, orange, yellow and brown.",
              "Some animals have colours that help them hide. A green frog is hard to spot on a green leaf.",
            ],
          },
        ],
        words: [
          { word: "nature", meaning: "plants, animals, sky and everything outside not made by people" },
          { word: "autumn", meaning: "the season when many leaves change colour and fall" },
          { word: "hide", meaning: "to be hard to see" },
        ],
      },
      practice: {
        intro: "Look closely at nature's colours.",
        questions: [
          { type: "match", q: "Match each thing in nature to its usual colour.", pairs: [["Grass", "Green"], ["A clear sky", "Blue"], ["Mud", "Brown"]] },
          { type: "choice", q: "What colours can leaves turn in autumn?", options: ["Red, orange and yellow", "Blue and purple"], answer: 0 },
          { type: "choice", q: "Why do many flowers have bright colours?", options: ["To scare the rain", "To help bees find them", "To keep warm"], answer: 1 },
          { type: "choice", q: "Where would a green frog be hard to spot?", options: ["On a red bucket", "On a white plate", "On a green leaf"], answer: 2 },
        ],
      },
      task: {
        title: "Egg box colour hunt",
        intro: "Go outside and find nature's colours to fill your egg box.",
        need: ["An empty egg box", "Crayons", "A garden, park or path to explore", "A grown-up to come with you"],
        steps: [
          "Colour a crayon dot inside each cup of the egg box. Use a different colour each time.",
          "Go outside with your grown-up.",
          "Look for a leaf, petal, stone or twig that matches each dot.",
          "Only collect things from the ground. Leave growing flowers alone.",
          "Put each find in the cup that matches.",
          "Back home, look at your box. Which colour was hardest to find?",
        ],
      },
      exit: [
        { type: "choice", q: "What colour is grass?", options: ["Green", "Purple"], answer: 0 },
        { type: "choice", q: "What can happen to leaves in autumn?", options: ["They turn blue", "They turn red, orange and yellow", "They turn white"], answer: 1 },
        { type: "choice", q: "Bright flower colours help...", options: ["bees find the flowers", "the flowers grow legs"], answer: 0 },
        { type: "choice", q: "Why can a green frog be hard to spot on a leaf?", options: ["It is very loud", "Its colour helps it hide", "It is invisible"], answer: 1 },
        { type: "choice", q: "On a colour hunt, what should you collect?", options: ["Flowers growing in the park", "Things already on the ground"], answer: 1 },
        { type: "match", q: "Match each thing to its colour.", pairs: [["Mud", "Brown"], ["Many stones", "Grey"], ["A sunflower", "Yellow"]] },
      ],
      grownUp: {
        need: ["An empty egg box", "Crayons", "Somewhere outside to explore"],
        tips: [
          "Stay with your child outside. Avoid berries, mushrooms and anything that might be dirty or sharp, and wash hands afterwards.",
          "Collect only fallen leaves, petals and twigs, and leave living plants growing.",
          "Unusual colours like blue or purple are hard to find. That's part of the fun, so talk about it.",
        ],
        younger: "Hunt for just three colours: green, brown and yellow.",
        older: "Hunt for five different greens and line them up from lightest to darkest.",
      },
    },
    {
      slug: "colour-mixing-6",
      title: "Piet Mondrian",
      emoji: "🟥",
      minutes: 30,
      goal: "I can make a picture like Piet Mondrian's.",
      starter: [
        { type: "choice", q: "What colour is grass?", options: ["Green", "Red"], answer: 0 },
        { type: "choice", q: "In autumn, many leaves turn...", options: ["blue and purple", "red, orange and yellow"], answer: 1 },
        { type: "choice", q: "Bright flower colours help...", options: ["bees find them", "the rain stop"], answer: 0 },
        { type: "choice", q: "Why is a green frog hard to see on a leaf?", options: ["It is tiny", "Its colour helps it hide", "It is asleep"], answer: 1 },
        { type: "choice", q: "On a colour hunt, what should you collect?", options: ["Things already on the ground", "Flowers from the park"], answer: 0 },
        { type: "match", q: "Match each thing to its colour.", pairs: [["Sky", "Blue"], ["Mud", "Brown"], ["A daffodil", "Yellow"]] },
      ],
      learn: {
        cards: [
          {
            heading: "Meet Piet Mondrian",
            text: [
              "Piet Mondrian was an artist. He was born in the Netherlands a long time ago, more than 150 years ago.",
              "When he was young, he painted trees, rivers and windmills.",
            ],
          },
          {
            heading: "Lines and blocks",
            text: [
              "Later, Mondrian made a new kind of picture.",
              "He painted thick, straight black lines going across and up and down.",
              "He filled some of the boxes with red, yellow or blue. He left the rest white.",
            ],
          },
          {
            heading: "Just a few colours",
            text: [
              "Mondrian chose the primary colours: red, yellow and blue.",
              "He moved the lines and colours around until the picture felt just right.",
              "He also loved music and dancing!",
            ],
          },
        ],
        words: [
          { word: "artist", meaning: "a person who makes art" },
          { word: "straight line", meaning: "a line that doesn't bend or wiggle" },
          { word: "block", meaning: "a box shape filled with one colour" },
        ],
      },
      practice: {
        intro: "What do you remember about Piet Mondrian?",
        questions: [
          { type: "choice", q: "What was Piet Mondrian?", options: ["A footballer", "An artist", "A baker"], answer: 1 },
          { type: "pick", q: "Which colours did Mondrian fill his boxes with? Tap all three.", options: ["Red", "Yellow", "Pink", "Blue"], answers: [0, 1, 3] },
          { type: "choice", q: "What kind of lines did he paint?", options: ["Wiggly lines", "Straight black lines"], answer: 1 },
          { type: "choice", q: "What did he paint when he was young?", options: ["Robots and rockets", "Dinosaurs", "Trees, rivers and windmills"], answer: 2 },
        ],
      },
      task: {
        title: "My Mondrian picture",
        intro: "Make your own picture of lines and coloured blocks.",
        need: ["White paper", "A ruler", "A black crayon or felt-tip pen", "Red, yellow and blue crayons or paint", "A grown-up to help"],
        steps: [
          "With help, use the ruler to draw a few straight black lines across the paper.",
          "Now draw some straight lines up and down.",
          "Go over the lines again to make them thick.",
          "Colour some boxes red, some yellow and some blue.",
          "Leave some boxes white.",
          "Stand back and look. Does it feel just right?",
        ],
      },
      exit: [
        { type: "choice", q: "Piet Mondrian was...", options: ["an artist", "a singer"], answer: 0 },
        { type: "pick", q: "Which colours did Mondrian use for his boxes? Tap all three.", options: ["Blue", "Green", "Red", "Yellow"], answers: [0, 2, 3] },
        { type: "choice", q: "What colour were his thick lines?", options: ["Pink", "Black", "Orange"], answer: 1 },
        { type: "choice", q: "His lines were...", options: ["wiggly", "straight"], answer: 1 },
        { type: "choice", q: "What colour did he leave the other boxes?", options: ["White", "Green", "Purple"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Red, yellow and blue are the ___ colours.", bank: ["primary", "cool", "muddy"], answers: ["primary"] },
      ],
      grownUp: {
        need: ["White paper", "A ruler", "A black crayon or felt-tip pen", "Red, yellow and blue crayons or paint"],
        tips: [
          "If you can, look up 'Mondrian Composition with Red, Yellow and Blue' together online and spot the primary colours.",
          "Help hold the ruler still while your child draws. Lines don't need to be perfect.",
          "Strips of black paper or tape glued onto white paper also make great Mondrian lines.",
        ],
        younger: "Draw the black lines for your child, then let them choose which boxes to colour.",
        older: "Look at Mondrian's 'Broadway Boogie Woogie', inspired by busy New York and jazz music. Make a picture with small coloured squares along the lines.",
      },
    },
  ],
};
