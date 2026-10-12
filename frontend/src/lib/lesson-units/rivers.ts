import type { LessonUnit } from "@/lib/lessons";

/** Rivers and the water cycle, for ages 7 to 11. Uses rivers from across the UK, with Scotland's own. */
export const rivers: LessonUnit = {
  slug: "rivers",
  title: "Rivers and the water cycle",
  short: "Rivers",
  subject: "Geography",
  ages: "7 to 9",
  emoji: "🌊",
  color: "#2C6FA6",
  summary: "Six lessons: the water cycle, a river's journey from source to sea, how rivers shape the land, great rivers of the UK and the world, and looking after them.",
  cover: "/lessons/units/rivers.jpg",
  lessons: [
    {
      slug: "rivers-1",
      title: "The water cycle",
      emoji: "🌧️",
      minutes: 45,
      goal: "I can explain how water moves round and round between the sea, the sky and the land.",
      starter: [
        { type: "choice", q: "Where does rain come from?", options: ["Clouds", "Trees", "The ground"], answer: 0 },
        { type: "choice", q: "What happens to a puddle on a sunny day?", options: ["It gets bigger", "It dries up", "It turns to ice"], answer: 1 },
        { type: "choice", q: "Is seawater salty or fresh?", options: ["Salty", "Fresh"], answer: 0 },
        { type: "pick", q: "Which of these are made of water? There is more than one.", options: ["Rain", "Snow", "Sand", "Ice"], answers: [0, 1, 3] },
        { type: "choice", q: "What does water turn into when it freezes?", options: ["Steam", "Ice", "Mud"], answer: 1 },
        { type: "type", q: "What is the big area of salty water that rivers flow into called?", answer: ["sea", "the sea", "ocean", "the ocean"] },
      ],
      learn: {
        cards: [
          {
            heading: "The same water, again and again",
            picture: "/lessons/rivers/lesson-1.jpg",
            alt: "The water cycle over a coast: the sun warms the sea, water rises, clouds rain on mountains, and a river flows back",
            text: [
              "The water on Earth is very, very old. The water in your glass today might once have been drunk by a dinosaur!",
              "That's because water doesn't get used up. It goes round and round in a never-ending loop called the water cycle.",
            ],
          },
          {
            heading: "Evaporation and condensation",
            text: [
              "The sun warms the water in seas, lakes and rivers. Some of it turns into an invisible gas called water vapour and rises into the air. This is evaporation.",
              "High up, the air is cold. The water vapour cools and turns back into tiny drops of water, which make clouds. This is condensation.",
            ],
          },
          {
            heading: "Precipitation and collection",
            text: [
              "When the drops in a cloud join together and get too heavy, they fall as rain, snow, sleet or hail. This is precipitation.",
              "The water lands on the ground, soaks in, or runs into streams and rivers, which carry it back to the sea. This is collection.",
              "Then the sun warms it again, and the cycle starts over.",
            ],
          },
        ],
        words: [
          { word: "evaporation", meaning: "when water warms up and turns into a gas called water vapour" },
          { word: "condensation", meaning: "when water vapour cools and turns back into drops of water" },
          { word: "precipitation", meaning: "water falling from clouds as rain, snow, sleet or hail" },
          { word: "collection", meaning: "when water gathers in rivers, lakes and the sea" },
        ],
      },
      practice: {
        intro: "Get the cycle in order.",
        questions: [
          { type: "order", q: "Put the water cycle in order, starting with the sun warming the sea.", items: ["Evaporation", "Condensation", "Precipitation", "Collection"] },
          {
            type: "match",
            q: "Match each word to what happens.",
            pairs: [["Evaporation", "Water turns into a gas"], ["Condensation", "Clouds form"], ["Precipitation", "Rain or snow falls"]],
          },
        ],
      },
      task: {
        title: "A water cycle in a bag",
        intro: "Make a tiny water cycle you can watch for days.",
        need: ["A clear sandwich bag that seals", "Water and a few drops of blue food colouring (if you have it)", "A permanent pen", "Sticky tape and a sunny window"],
        steps: [
          "Draw a sun, a cloud and some waves on the bag with the pen.",
          "Pour in about a quarter of a cup of water, with a drop of food colouring. Seal the bag tightly.",
          "Tape the bag to a sunny window.",
          "Check it over the next few hours and days. Can you spot drops forming at the top (condensation) and running down the sides (precipitation)?",
        ],
      },
      exit: [
        { type: "choice", q: "What is evaporation?", options: ["Water turning into a gas", "Rain falling", "Water freezing"], answer: 0 },
        { type: "choice", q: "What makes clouds?", options: ["Condensation", "Collection", "Evaporation"], answer: 0 },
        {
          type: "pick",
          q: "Which of these are precipitation? There is more than one.",
          options: ["Rain", "Snow", "A cloud", "Hail"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "What warms the water to start the cycle?", options: ["The moon", "The sun", "The wind"], answer: 1 },
        { type: "choice", q: "Does the water on Earth get used up?", options: ["Yes, it runs out", "No, it goes round and round"], answer: 1 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "High up, water vapour cools and makes ___. This is called ___.",
          bank: ["clouds", "condensation", "evaporation", "rain"],
          answers: ["clouds", "condensation"],
        },
      ],
      grownUp: {
        need: ["A clear sealable sandwich bag", "Water, food colouring (optional)", "A permanent pen and tape"],
        tips: [
          "The bag works best on a sunny, south-facing window. Seal it well, or tape over the seal.",
          "Steam on a cold window after a bath or cooking is condensation too. Point it out when you see it.",
        ],
        younger: "Just learn three words: water goes up (evaporation), makes clouds, then comes down as rain.",
        older: "Draw and label the water cycle as a diagram, adding arrows and all four key words.",
      },
    },
    {
      slug: "rivers-2",
      title: "A river's journey",
      emoji: "🏞️",
      minutes: 45,
      goal: "I can describe a river's journey from its source to its mouth, using the right words.",
      starter: [
        { type: "choice", q: "What is precipitation?", options: ["Rain, snow, sleet or hail falling", "Water turning to gas"], answer: 0 },
        { type: "choice", q: "Where do rivers carry water to?", options: ["The sea", "The clouds"], answer: 0 },
        { type: "choice", q: "What makes clouds?", options: ["Condensation", "Collection"], answer: 0 },
        { type: "order", q: "Put the water cycle in order, starting with the sun warming the sea.", items: ["Evaporation", "Condensation", "Precipitation", "Collection"] },
        { type: "type", q: "When water evaporates, what invisible gas does it turn into?", answer: ["water vapour", "vapour", "water vapor", "vapor"] },
        { type: "choice", q: "Which of these is NOT precipitation?", options: ["Snow", "Hail", "A cloud"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Where a river starts",
            picture: "/lessons/rivers/lesson-2.jpg",
            alt: "A river starting as a mountain stream, winding past farms and a village and reaching the sea",
            text: [
              "The start of a river is called its source. It's usually high up in hills or mountains, where lots of rain falls.",
              "A source might be a spring bubbling out of the ground, a boggy patch, or melting snow.",
              "At first it's just a small, fast stream tumbling down steep slopes.",
            ],
          },
          {
            heading: "Growing bigger",
            text: [
              "As the river flows downhill, smaller streams join it. A stream that joins a bigger river is called a tributary.",
              "The place where two rivers meet is called a confluence.",
              "With every tributary, the river gets wider, deeper and carries more water.",
            ],
          },
          {
            heading: "Reaching the sea",
            text: [
              "Near the end, the land is flatter, so the river slows down and winds from side to side.",
              "The end of a river, where it flows into the sea or a lake, is called its mouth.",
              "Many rivers widen into an estuary at the mouth, where fresh river water mixes with salty seawater.",
            ],
          },
        ],
        words: [
          { word: "source", meaning: "where a river starts" },
          { word: "tributary", meaning: "a smaller stream or river that joins a bigger one" },
          { word: "confluence", meaning: "where two rivers meet" },
          { word: "mouth", meaning: "where a river flows into the sea or a lake" },
          { word: "estuary", meaning: "the wide part at a river's mouth, where fresh water and seawater mix" },
        ],
      },
      practice: {
        intro: "Follow the river.",
        questions: [
          { type: "order", q: "Put a river's journey in order, from start to end.", items: ["Source", "Tributaries join", "River winds across flat land", "Mouth"] },
          { type: "choice", q: "Where is a river's source usually?", options: ["High up in hills or mountains", "Next to the sea"], answer: 0 },
        ],
      },
      task: {
        title: "Map a river",
        intro: "Draw a river's whole journey and label every part.",
        need: ["A big piece of paper", "Pencils or felt pens", "A map or atlas, or a map on a screen with your grown-up"],
        steps: [
          "Draw hills or mountains in one corner and the sea in the opposite corner.",
          "Draw your river from the hills to the sea. Add two or three tributaries joining it.",
          "Label the source, a tributary, a confluence, the mouth and the estuary.",
          "Find a real river near where you live on a map. Can you find its source and its mouth?",
        ],
      },
      exit: [
        { type: "choice", q: "What is the source of a river?", options: ["Where it starts", "Where it ends", "Where two rivers meet"], answer: 0 },
        { type: "choice", q: "What is a tributary?", options: ["A stream that joins a bigger river", "The end of a river", "A kind of boat"], answer: 0 },
        { type: "choice", q: "What is the mouth of a river?", options: ["Where it flows into the sea or a lake", "Where it starts"], answer: 0 },
        { type: "choice", q: "In an estuary, river water mixes with...", options: ["seawater", "rain"], answer: 0 },
        { type: "choice", q: "Near its source, a river is usually...", options: ["small and fast", "wide and slow"], answer: 0 },
        {
          type: "match",
          q: "Match each word to its meaning.",
          pairs: [["Source", "Where a river starts"], ["Confluence", "Where two rivers meet"], ["Mouth", "Where a river flows into the sea"]],
        },
      ],
      grownUp: {
        need: ["A big sheet of paper and pens", "A map, atlas or online map"],
        tips: [
          "Online maps are great for following a local river back to its source. Zoom in together.",
          "If there's a river or stream near you, a walk along it is the best way to bring this lesson to life.",
        ],
        younger: "Draw the river and label just the source and the mouth.",
        older: "Pick a real UK river and find out where its source and mouth are, and which towns it flows through.",
      },
    },
    {
      slug: "rivers-3",
      title: "How rivers shape the land",
      emoji: "🪨",
      minutes: 45,
      goal: "I can explain erosion, transportation and deposition, and describe a waterfall and a meander.",
      starter: [
        { type: "choice", q: "Where does a river start?", options: ["Its source", "Its mouth"], answer: 0 },
        { type: "choice", q: "What is a tributary?", options: ["A stream that joins a bigger river", "The sea"], answer: 0 },
        { type: "choice", q: "Near the sea, rivers often...", options: ["wind from side to side", "go uphill"], answer: 0 },
        { type: "type", q: "What is the place where two rivers meet called?", answer: ["confluence", "a confluence"] },
        { type: "choice", q: "In an estuary, fresh river water mixes with...", options: ["rain", "seawater", "oil"], answer: 1 },
        { type: "order", q: "Put a river's journey in order, from start to end.", items: ["Source", "Tributaries join", "Mouth"] },
      ],
      learn: {
        cards: [
          {
            heading: "Erosion",
            picture: "/lessons/rivers/lesson-3.jpg",
            alt: "Two children on a footpath watching a waterfall, with the river meandering across a green valley",
            text: [
              "Moving water is powerful. Over many years, a river wears away the rock and soil of its banks and bed. This is called erosion.",
              "Stones carried by the water bash against the riverbed and wear it down even faster.",
            ],
          },
          {
            heading: "Transportation and deposition",
            text: [
              "A river carries the bits it has worn away, from tiny grains of mud to big pebbles. This is transportation.",
              "When the river slows down, it can't carry everything any more, so it drops some of it. This is deposition.",
              "That's how sandbanks and muddy riverbanks form, especially near the mouth.",
            ],
          },
          {
            heading: "Waterfalls and meanders",
            text: [
              "A waterfall forms where a river flows over hard rock on top of softer rock. The soft rock wears away faster, leaving a step that the water falls over.",
              "On flatter land, rivers bend in big loops called meanders. The water flows faster on the outside of a bend, wearing it away, and slower on the inside, dropping sand and mud.",
            ],
          },
        ],
        words: [
          { word: "erosion", meaning: "when water wears away rock and soil" },
          { word: "transportation", meaning: "when a river carries mud, sand and stones along" },
          { word: "deposition", meaning: "when a river slows down and drops what it was carrying" },
          { word: "meander", meaning: "a big bend or loop in a river" },
        ],
      },
      practice: {
        intro: "Wear it, carry it, drop it.",
        questions: [
          {
            type: "match",
            q: "Match each word to what the river does.",
            pairs: [["Erosion", "Wears away rock and soil"], ["Transportation", "Carries mud and stones"], ["Deposition", "Drops what it carries"]],
          },
          { type: "choice", q: "On a meander, the water is fastest on...", options: ["the outside of the bend", "the inside of the bend"], answer: 0 },
        ],
      },
      task: {
        title: "Make a river in a tray",
        intro: "Watch erosion and deposition happen in front of you.",
        need: ["A baking tray or large plastic tub", "Sand, soil or a mix (from the garden or a sandpit)", "A jug of water", "A book to prop one end up", "Somewhere outdoors, or a big towel"],
        steps: [
          "Fill the tray with damp sand or soil, smoothed flat.",
          "Prop one end up on the book so the tray slopes.",
          "Slowly pour a thin stream of water at the top. Watch where it goes.",
          "Look for erosion (where the sand is worn away) and deposition (where it piles up at the bottom).",
          "Pour faster. What changes? Can you make your river meander?",
        ],
      },
      exit: [
        { type: "choice", q: "What is erosion?", options: ["Water wearing away rock and soil", "A river dropping sand", "Rain falling"], answer: 0 },
        { type: "choice", q: "When does a river drop what it's carrying?", options: ["When it speeds up", "When it slows down"], answer: 1 },
        { type: "choice", q: "What is a meander?", options: ["A big bend in a river", "A waterfall", "A river's source"], answer: 0 },
        { type: "choice", q: "A waterfall forms where hard rock sits on top of...", options: ["softer rock", "ice"], answer: 0 },
        { type: "choice", q: "What does transportation mean for a river?", options: ["Carrying mud, sand and stones", "Flowing uphill"], answer: 0 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "On a meander, the water flows faster on the ___ of the bend and slower on the ___.",
          bank: ["outside", "inside", "top", "bottom"],
          answers: ["outside", "inside"],
        },
      ],
      grownUp: {
        need: ["A baking tray or tub", "Sand or soil", "A jug of water", "A book or block"],
        tips: [
          "The river tray is messy. Outdoors is best, or over a big towel.",
          "Pouring slowly makes clearer channels. Let your child experiment with the slope too.",
        ],
        younger: "Just pour water down the sand and talk about where it digs and where it piles up.",
        older: "Look up High Force in County Durham or the Falls of Clyde in Scotland. Can you spot the hard rock on top?",
      },
    },
    {
      slug: "rivers-4",
      title: "Rivers of the UK",
      emoji: "🗺️",
      minutes: 45,
      goal: "I can name and find some of the UK's major rivers, and say why towns grew up beside them.",
      starter: [
        { type: "choice", q: "What is erosion?", options: ["Water wearing away the land", "Water freezing"], answer: 0 },
        { type: "choice", q: "What is a meander?", options: ["A big bend in a river", "A lake"], answer: 0 },
        { type: "choice", q: "Where does a river end?", options: ["Its mouth", "Its source"], answer: 0 },
        {
          type: "match",
          q: "Match each word to what the river does.",
          pairs: [["Erosion", "Wears away"], ["Transportation", "Carries"], ["Deposition", "Drops"]],
        },
        { type: "choice", q: "A river drops sand and mud when it...", options: ["speeds up", "slows down", "freezes"], answer: 1 },
        { type: "pick", q: "Which of these can a river carry along? There is more than one.", options: ["Mud", "Pebbles", "Sand", "Clouds"], answers: [0, 1, 2] },
      ],
      learn: {
        cards: [
          {
            heading: "The longest rivers",
            picture: "/lessons/rivers/lesson-4.jpg",
            alt: "Children feeding swans by a stone bridge in a riverside town, with narrowboats and a water mill",
            text: [
              "The River Severn is the longest river in the UK, about 220 miles long. It starts in the mountains of Wales and flows into the sea near Bristol.",
              "The River Thames is the second longest, about 215 miles. It flows through London.",
            ],
          },
          {
            heading: "Rivers around the UK",
            text: [
              "The River Tay is the longest river in Scotland. It carries more water than any other river in the UK.",
              "The River Clyde flows through Glasgow, and the River Forth runs past Stirling into the sea near Edinburgh.",
              "In Northern Ireland, the River Bann flows through Lough Neagh, the biggest lake in the UK.",
            ],
          },
          {
            heading: "Why towns grew by rivers",
            text: [
              "Long ago, people built their homes near rivers for fresh water to drink, fish to eat, and good farmland.",
              "Rivers were like roads: boats carried people and goods. Many towns grew up where a river could be crossed, or where it met the sea.",
              "London, Glasgow, Newcastle and Belfast all grew up beside rivers.",
            ],
          },
        ],
        words: [
          { word: "settlement", meaning: "a place where people live, like a village, town or city" },
          { word: "port", meaning: "a town where ships load and unload" },
        ],
      },
      practice: {
        intro: "Rivers and cities.",
        questions: [
          {
            type: "match",
            q: "Match each river to a city it flows through.",
            pairs: [["Thames", "London"], ["Clyde", "Glasgow"], ["Tyne", "Newcastle"], ["Lagan", "Belfast"]],
          },
          { type: "choice", q: "Which is the longest river in the UK?", options: ["The Thames", "The Severn", "The Tay"], answer: 1 },
        ],
      },
      task: {
        title: "Your UK rivers map",
        intro: "Make a map of the UK's great rivers, and find your nearest one.",
        need: ["An outline map of the UK (draw one, or print one with your grown-up)", "A blue pen or pencil", "An atlas or online map"],
        steps: [
          "Using an atlas or online map, draw in the Severn, Thames, Tay, Clyde, Tyne and Bann in blue.",
          "Mark London, Glasgow, Newcastle, Belfast and Bristol with a dot and label them.",
          "Find the river nearest to where you live and add it to your map.",
          "Write one reason why people might have built a town beside your nearest river.",
        ],
      },
      exit: [
        { type: "choice", q: "What is the longest river in the UK?", options: ["The Severn", "The Thames", "The Clyde"], answer: 0 },
        { type: "choice", q: "Which river flows through London?", options: ["The Tay", "The Thames", "The Severn"], answer: 1 },
        { type: "choice", q: "Which is the longest river in Scotland?", options: ["The Clyde", "The Forth", "The Tay"], answer: 2 },
        {
          type: "pick",
          q: "Why did people build towns beside rivers? There is more than one.",
          options: ["Fresh water", "Boats to carry goods", "No rain", "Fish and good farmland"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "What is a port?", options: ["A town where ships load and unload", "A river's source"], answer: 0 },
        {
          type: "match",
          q: "Match each river to its fact.",
          pairs: [["Severn", "Longest river in the UK"], ["Tay", "Longest river in Scotland"], ["Bann", "Flows through Lough Neagh"]],
        },
      ],
      grownUp: {
        need: ["A UK outline map", "An atlas or online map"],
        tips: [
          "River lengths vary a little depending on the source used. 'About 220 miles' for the Severn is the usual figure.",
          "Outline maps of the UK are easy to find and print, or your child can trace one from an atlas.",
        ],
        younger: "Find just the Thames and the river nearest to you, and the town on it.",
        older: "Find out how your nearest town or city used its river in the past: mills, a port, a bridge or a ferry?",
      },
    },
    {
      slug: "rivers-5",
      title: "Great rivers of the world",
      emoji: "🌍",
      minutes: 45,
      goal: "I can find the Nile, the Amazon and other great rivers on a world map, and describe how people use them.",
      starter: [
        { type: "choice", q: "Which is the longest river in the UK?", options: ["The Severn", "The Thames"], answer: 0 },
        { type: "choice", q: "Which river flows through Glasgow?", options: ["The Clyde", "The Tyne"], answer: 0 },
        { type: "choice", q: "Why did towns grow by rivers?", options: ["Fresh water and transport", "Rivers are quiet"], answer: 0 },
        { type: "type", q: "Which river flows through London? The River...", answer: ["Thames", "the Thames", "River Thames", "the River Thames"] },
        { type: "choice", q: "What is a settlement?", options: ["A kind of boat", "A waterfall", "A place where people live"], answer: 2 },
        {
          type: "match",
          q: "Match each river to a city it flows through.",
          pairs: [["Thames", "London"], ["Clyde", "Glasgow"], ["Tyne", "Newcastle"]],
        },
      ],
      learn: {
        cards: [
          {
            heading: "The Nile",
            picture: "/lessons/rivers/lesson-5.jpg",
            alt: "Children in a canoe on the Amazon, with parrots in the trees and pink river dolphins",
            text: [
              "The Nile flows north through Africa into the Mediterranean Sea. It's about 4,100 miles long, and is usually called the longest river in the world.",
              "Ancient Egypt grew up along the Nile. Every year it flooded and left rich mud for farming, in the middle of the desert.",
            ],
          },
          {
            heading: "The Amazon",
            text: [
              "The Amazon flows across South America through the biggest rainforest on Earth.",
              "It carries more water than any other river in the world, more than the next several biggest rivers put together.",
              "Some scientists think it might even be longer than the Nile. They're still measuring!",
            ],
          },
          {
            heading: "Rivers on every continent",
            text: [
              "The Yangtze is the longest river in Asia, flowing through China. The Mississippi flows through the USA. The Danube flows through ten countries in Europe.",
              "Around the world, people use rivers for drinking water, farming, fishing, transport and making electricity.",
            ],
          },
        ],
        words: [
          { word: "continent", meaning: "one of the seven huge areas of land on Earth, like Africa or Europe" },
          { word: "rainforest", meaning: "a thick forest where it rains a lot" },
          { word: "irrigation", meaning: "bringing river water to fields to help crops grow" },
        ],
      },
      practice: {
        intro: "Around the world.",
        questions: [
          {
            type: "match",
            q: "Match each river to its continent.",
            pairs: [["Nile", "Africa"], ["Amazon", "South America"], ["Yangtze", "Asia"], ["Danube", "Europe"]],
          },
          { type: "choice", q: "Which river carries the most water in the world?", options: ["The Nile", "The Amazon", "The Thames"], answer: 1 },
        ],
      },
      task: {
        title: "World rivers race",
        intro: "Find the great rivers and compare them.",
        need: ["A world map or atlas, or an online map", "Paper and pens", "A strip of paper or a long ribbon (optional)"],
        steps: [
          "Find the Nile, the Amazon, the Yangtze, the Mississippi and the Danube on a world map. Which continent is each on?",
          "Make a 'river fact card' for your favourite one: where it is, how long it is, and one way people use it.",
          "The Nile is about 4,100 miles and the Thames about 215. Cut a strip of paper 1 centimetre long for the Thames. How long would the Nile's strip be? (About 19 centimetres!)",
        ],
      },
      exit: [
        { type: "choice", q: "Which continent is the Nile in?", options: ["Africa", "Asia", "Europe"], answer: 0 },
        { type: "choice", q: "The Amazon flows through...", options: ["the biggest rainforest on Earth", "a desert", "the Arctic"], answer: 0 },
        { type: "choice", q: "Which ancient civilisation grew up along the Nile?", options: ["The Romans", "Ancient Egypt", "The Vikings"], answer: 1 },
        {
          type: "pick",
          q: "How do people use rivers? There is more than one.",
          options: ["Drinking water", "Transport", "Farming", "Growing hair"],
          answers: [0, 1, 2],
        },
        { type: "choice", q: "Which is the longest river in Asia?", options: ["The Yangtze", "The Danube", "The Mississippi"], answer: 0 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "The Mississippi flows through the ___, and the Danube flows through ten countries in ___.",
          bank: ["USA", "Europe", "Africa", "China"],
          answers: ["USA", "Europe"],
        },
      ],
      grownUp: {
        need: ["A world map, atlas or online map", "Paper and pens"],
        tips: [
          "The Nile v Amazon length question is a real scientific debate, depending on where you measure the source. It's a nice example of how facts can change.",
          "This lesson links nicely to Ancient Egypt if you're doing it later.",
        ],
        younger: "Find the Nile and the Amazon on a globe or map, and talk about the animals that live in each.",
        older: "Research one river that's used to make electricity, like the Yangtze and the Three Gorges Dam. What's good and bad about it?",
      },
    },
    {
      slug: "rivers-6",
      title: "Water in our lives",
      emoji: "🚰",
      minutes: 45,
      goal: "I can explain how water gets to our taps, how rivers get polluted, and ways to save water.",
      starter: [
        { type: "choice", q: "Which river carries the most water?", options: ["The Amazon", "The Severn"], answer: 0 },
        { type: "choice", q: "What is evaporation?", options: ["Water turning into a gas", "A river's mouth"], answer: 0 },
        { type: "choice", q: "Where does a river start?", options: ["Its source", "Its estuary"], answer: 0 },
        {
          type: "match",
          q: "Match each river to its continent.",
          pairs: [["Nile", "Africa"], ["Amazon", "South America"], ["Yangtze", "Asia"]],
        },
        { type: "choice", q: "Every year the Nile flooded and left rich mud for...", options: ["building boats", "farming", "making pots"], answer: 1 },
        { type: "type", q: "Which river is usually called the longest in the world? The...", answer: ["Nile", "the Nile", "River Nile", "the River Nile"] },
      ],
      learn: {
        cards: [
          {
            heading: "From river to tap",
            picture: "/lessons/rivers/lesson-6.jpg",
            alt: "A girl turning off the tap while brushing her teeth, with a reservoir outside and a water butt",
            text: [
              "Most of the water from our taps starts as rain. It's collected in reservoirs (big man-made lakes), rivers and underground rocks.",
              "Before it reaches us, it's cleaned at a water treatment works to make it safe to drink.",
              "After we use it, waste water goes down the drain to a sewage works, where it's cleaned again before going back into rivers.",
            ],
          },
          {
            heading: "Keeping rivers clean",
            text: [
              "Rivers can be polluted by rubbish, oil, chemicals from farms and factories, and sewage.",
              "Pollution harms fish, birds and the other wildlife that live in and around rivers.",
              "Plastic dropped on the street can be washed into drains and rivers, and end up in the sea.",
            ],
          },
          {
            heading: "Saving water",
            text: [
              "Cleaning and pumping water uses lots of energy, so saving water helps the planet.",
              "Turning the tap off while you brush your teeth saves several litres of water each time.",
              "Shorter showers, full washing machines and fixing dripping taps all help too.",
            ],
          },
        ],
        words: [
          { word: "reservoir", meaning: "a big man-made lake that stores water" },
          { word: "pollution", meaning: "something harmful getting into water, air or land" },
          { word: "treatment works", meaning: "where water is cleaned to make it safe to drink" },
        ],
      },
      practice: {
        intro: "Water wise.",
        questions: [
          { type: "order", q: "Put tap water's journey in order.", items: ["Rain falls", "Stored in a reservoir", "Cleaned at a treatment works", "Comes out of your tap"] },
          {
            type: "pick",
            q: "Which of these save water? There is more than one.",
            options: ["Turn the tap off while brushing your teeth", "Leave the tap running", "Take shorter showers", "Fix dripping taps"],
            answers: [0, 2, 3],
          },
        ],
      },
      task: {
        title: "Family water detectives",
        intro: "Find out how your family uses water, and make a plan to save some.",
        need: ["Paper and a pencil", "A measuring jug", "A timer"],
        steps: [
          "For one day, keep a tally of every time someone in your family uses water: taps, toilet flushes, showers, washing up.",
          "Put a jug under the tap while you brush your teeth with it running (then use the water to water plants!). How much water went by?",
          "Make a poster with three ways your family could save water.",
          "Finish the unit by telling your grown-up the whole journey of a raindrop, from the sea to your tap.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a reservoir?", options: ["A big man-made lake that stores water", "A river's source", "A kind of fish"], answer: 0 },
        { type: "choice", q: "What happens at a water treatment works?", options: ["Water is cleaned to make it safe to drink", "Water is turned into ice"], answer: 0 },
        {
          type: "pick",
          q: "What can pollute a river? There is more than one.",
          options: ["Rubbish", "Oil", "Fish", "Chemicals"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "Why does saving water help the planet?", options: ["Cleaning and pumping water uses energy", "It doesn't"], answer: 0 },
        { type: "choice", q: "Most tap water starts as...", options: ["rain", "seawater", "melted ice cream"], answer: 0 },
        { type: "order", q: "Put waste water's journey in order, after we use it.", items: ["Goes down the drain", "Cleaned at a sewage works", "Goes back into a river"] },
      ],
      grownUp: {
        need: ["Paper and a pencil", "A measuring jug", "A timer"],
        tips: [
          "Collect the teeth-brushing water in a jug and use it to water plants, so none is wasted.",
          "If you're near a river, a short litter pick (with gloves) is a great way to round off the unit.",
        ],
        younger: "Make the poster together, with pictures of three ways to save water.",
        older: "Work out how many litres your family could save in a week if everyone turned the tap off while brushing their teeth.",
      },
    },
  ],
};
