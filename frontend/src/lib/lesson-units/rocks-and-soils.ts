import type { LessonUnit } from "@/lib/lessons";

/** Rocks and soils, for ages 7 to 9. Every investigation uses pebbles, soil and things most homes already have. */
export const rocksAndSoils: LessonUnit = {
  slug: "rocks-and-soils",
  title: "Rocks and soils",
  short: "Rocks and soils",
  subject: "Science",
  ages: "7 to 9",
  emoji: "🪨",
  color: "#8A6A4F",
  summary: "Six lessons of rock detective work with pebbles, soil and kitchen kit: grouping rocks, testing them, how fossils form, and what soil is made of.",
  cover: "/lessons/units/rocks-and-soils.jpg",
  lessons: [
    {
      slug: "rocks-and-soils-1",
      title: "What is a rock?",
      emoji: "🪨",
      minutes: 45,
      goal: "I can explain what a rock is and tell the difference between natural rock and things people have made.",
      starter: [
        { type: "choice", q: "Where might you find rocks?", options: ["Only at the seaside", "Almost everywhere, even under your feet", "Only in museums"], answer: 1 },
        { type: "choice", q: "Are all rocks the same colour?", options: ["Yes, they are all grey", "No, they come in lots of colours"], answer: 1 },
        { type: "pick", q: "Which of these do you think are made of rock? There is more than one.", options: ["A pebble on a beach", "A plastic cup", "A mountain", "A woolly hat"], answers: [0, 2] },
        { type: "choice", q: "What is a pebble?", options: ["A small, smooth rock", "A kind of seed", "A tiny shell"], answer: 0 },
        { type: "choice", q: "Is a rock alive?", options: ["Yes", "No"], answer: 1 },
        { type: "type", q: "What is under the grass in a garden? Type one word.", answer: ["soil", "Soil", "mud", "dirt", "earth"] },
      ],
      learn: {
        cards: [
          {
            heading: "Rocks are everywhere",
            picture: "/lessons/rocks-and-soils/lesson-1-1.jpg",
            alt: "A hillside cut open to show grass, soil, stones and solid rock underneath, with a cliff and pebbly beach",
            text: [
              "Rock is the hard, natural material that makes up the outside of the Earth. Under the soil, the grass and the roads, there is solid rock.",
              "Mountains, cliffs and beaches are made of rock. So are pebbles, boulders and the tiny grains of sand.",
            ],
          },
          {
            heading: "What is rock made of?",
            picture: "/lessons/rocks-and-soils/lesson-1-2.jpg",
            alt: "A speckled rock split open to show different coloured minerals, with a shiny quartz crystal",
            text: [
              "Rocks are made of minerals. A mineral is a natural solid, like quartz or salt, that forms in the ground.",
              "Some rocks are made of one mineral. Most are a mix of several, which is why many rocks look speckled or stripy.",
            ],
          },
          {
            heading: "Natural or made by people?",
            picture: "/lessons/rocks-and-soils/lesson-1-3.jpg",
            alt: "A child holding a pebble and a brick, between an old stone wall and a brick wall",
            text: [
              "Rocks are natural. Nobody made them. They formed in the Earth over a very, very long time.",
              "Bricks, concrete and tiles look a bit like rock, but people made them, often from clay, sand or crushed rock. They are man-made materials, not rocks.",
            ],
          },
        ],
        words: [
          { word: "rock", meaning: "a hard, natural material that makes up the outside of the Earth" },
          { word: "mineral", meaning: "a natural solid that rocks are made from" },
          { word: "natural", meaning: "made by nature, not by people" },
          { word: "man-made", meaning: "made by people" },
        ],
      },
      practice: {
        intro: "Natural rock or made by people?",
        questions: [
          {
            type: "pick",
            q: "Which of these are natural rocks? There is more than one.",
            options: ["A brick", "A pebble", "A cliff", "A concrete path", "A boulder"],
            answers: [1, 2, 4],
            why: "Bricks and concrete are made by people, often from clay, sand or crushed rock.",
          },
          { type: "choice", q: "What are rocks made of?", options: ["Plastic", "Minerals", "Wood"], answer: 1 },
          { type: "choice", q: "What is under the soil in a garden?", options: ["Solid rock", "Water only", "Nothing at all"], answer: 0 },
          {
            type: "match",
            q: "Match each thing to the right word.",
            pairs: [["A pebble", "Natural"], ["A brick", "Man-made"], ["Quartz", "A mineral"]],
          },
        ],
      },
      task: {
        title: "Rock hunt",
        intro: "Go on a hunt for rocks and things that only look like rock.",
        need: ["Paper and a pencil", "A small box, tray or egg box for your finds", "A grown-up to come outside with you"],
        steps: [
          "With a grown-up, look around your home, garden, street or park. Look at walls, paths, steps and flower beds.",
          "Make two lists: 'natural rock' and 'made by people'. Put each thing you spot in one list, like a pebble, a brick or a stone wall.",
          "Collect five or six small pebbles or stones that are different from each other. Keep them in your box. You will use them all through this unit.",
          "Wash your hands when you come in. Then pick your favourite rock and write three words to describe it.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a rock?", options: ["A hard, natural material that makes up the outside of the Earth", "Anything that is hard", "A type of plant"], answer: 0 },
        { type: "choice", q: "What are rocks made of?", options: ["Minerals", "Sand only", "Plastic"], answer: 0 },
        { type: "choice", q: "Is a brick a natural rock?", options: ["Yes", "No, people made it"], answer: 1 },
        { type: "pick", q: "Which of these are made of rock? There is more than one.", options: ["A mountain", "A cliff", "A glass bottle", "A pebble"], answers: [0, 1, 3] },
        { type: "choice", q: "Why do many rocks look speckled?", options: ["They have been painted", "They are a mix of different minerals", "They are dirty"], answer: 1 },
        { type: "gap", q: "Fill in the gaps.", text: "Rocks are ___, which means nobody made them. Concrete is ___.", bank: ["natural", "man-made", "alive", "soft"], answers: ["natural", "man-made"] },
      ],
      grownUp: {
        need: ["A small box or egg box", "Paper and a pencil", "A short walk outside"],
        tips: [
          "Stay with your child outside, and only collect small loose stones from your own garden or public paths, never from walls or buildings. Leave beach pebbles where they are where signs ask you to.",
          "The pebble collection gets used again in lessons 2 and 3, so keep it somewhere safe. Gravel from a garden path, a few landscaping chips or holiday pebbles are perfect.",
        ],
        younger: "Hunt for rocks of different colours and line them up from lightest to darkest.",
        older: "Look at a few old buildings or walls nearby. Which are made of stone and which of brick? Why might builders choose each one?",
      },
    },
    {
      slug: "rocks-and-soils-2",
      title: "Comparing and grouping rocks",
      emoji: "🔍",
      minutes: 45,
      goal: "I can compare rocks by how they look and group them in different ways.",
      starter: [
        { type: "choice", q: "What are rocks made of?", options: ["Wood", "Minerals", "Soil"], answer: 1 },
        { type: "choice", q: "Is a brick a natural rock?", options: ["No, people made it", "Yes"], answer: 0 },
        { type: "choice", q: "What does natural mean?", options: ["Made by people", "Made by nature"], answer: 1 },
        { type: "pick", q: "Which of these are natural rocks? There is more than one.", options: ["A boulder", "A concrete slab", "A pebble", "A roof tile"], answers: [0, 2] },
        { type: "type", q: "What is the hard, natural material under the soil? Type one word.", answer: ["rock", "Rock", "rocks"] },
        { type: "choice", q: "Why do many rocks look speckled?", options: ["They are a mix of minerals", "They are wet"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Look closely",
            picture: "/lessons/rocks-and-soils/lesson-2-1.jpg",
            alt: "Two children looking at wet, colourful pebbles through a magnifying glass",
            text: [
              "Scientists compare rocks by looking closely at them. They look at the colour, and whether the rock is shiny or dull.",
              "They look at the texture too. Is it rough or smooth? Can you see grains, crystals or stripes called layers?",
            ],
          },
          {
            heading: "Grains, crystals and layers",
            picture: "/lessons/rocks-and-soils/lesson-2-2.jpg",
            alt: "A grainy sandstone, a sparkly granite and a flat grey slate side by side",
            text: [
              "Some rocks, like sandstone, are made of tiny grains stuck together. Rub them and a little sand may come off.",
              "Some rocks, like granite, have crystals that fit together like a jigsaw. They often sparkle.",
              "Some rocks have stripes of different colours, called layers. Slate splits into thin, flat sheets.",
            ],
          },
          {
            heading: "Three families of rock",
            picture: "/lessons/rocks-and-soils/lesson-2-3.jpg",
            alt: "A volcano with cooling lava, layers building up on a seabed, and rock squeezed deep underground",
            text: [
              "Igneous rocks, like granite and basalt, formed when hot, melted rock from deep in the Earth cooled and went hard.",
              "Sedimentary rocks, like sandstone and chalk, formed when layers of sand, mud or shells were pressed together over millions of years.",
              "Metamorphic rocks, like marble and slate, formed when other rocks were squeezed and heated deep underground, which changed them.",
            ],
          },
        ],
        words: [
          { word: "texture", meaning: "how something feels, like rough or smooth" },
          { word: "grain", meaning: "a tiny bit of rock, like a grain of sand" },
          { word: "crystal", meaning: "a mineral with flat, shiny sides" },
          { word: "layer", meaning: "a flat band of rock lying on top of another" },
        ],
      },
      practice: {
        intro: "How would a rock scientist describe these?",
        questions: [
          {
            type: "match",
            q: "Match each rock to how it formed.",
            pairs: [["Granite", "Melted rock that cooled"], ["Sandstone", "Sand pressed together in layers"], ["Marble", "Rock changed by heat and squeezing"]],
          },
          { type: "choice", q: "Which word describes how a rock feels?", options: ["Colour", "Texture", "Shape"], answer: 1 },
          { type: "choice", q: "Granite often sparkles. Why?", options: ["It has shiny crystals", "It is wet", "It is made of glass"], answer: 0 },
          { type: "pick", q: "Which are good ways to group rocks? There is more than one.", options: ["By colour", "By who found them", "By texture", "By whether they have layers"], answers: [0, 2, 3] },
        ],
      },
      task: {
        title: "Sort your rock collection",
        intro: "Be a rock scientist and sort your rocks in different ways.",
        need: ["Your rocks from lesson 1", "A magnifying glass, if you have one", "A bowl of water and an old toothbrush", "Paper and a pencil"],
        steps: [
          "Scrub your rocks gently in the water with the toothbrush, then dry them. Wet rocks show their colours best, so look at them wet and dry.",
          "Look closely at each rock. Can you see grains, crystals or layers? Is it shiny or dull, rough or smooth?",
          "Sort your rocks into two groups, then mix them up and sort them a different way. Try colour, texture, size and whether they have layers.",
          "Draw your favourite way of sorting as two circles with your rocks drawn inside. Can a family member guess your rule?",
        ],
      },
      exit: [
        { type: "choice", q: "What does texture mean?", options: ["How heavy something is", "How something feels", "What colour something is"], answer: 1 },
        { type: "choice", q: "Which rock is made of tiny grains of sand stuck together?", options: ["Granite", "Sandstone", "Marble"], answer: 1 },
        { type: "choice", q: "How did igneous rock form?", options: ["Hot, melted rock cooled and went hard", "Shells were pressed together"], answer: 0 },
        { type: "match", q: "Match each rock to its family.", pairs: [["Granite", "Igneous"], ["Chalk", "Sedimentary"], ["Slate", "Metamorphic"]] },
        { type: "choice", q: "What are the flat bands of colour in some rocks called?", options: ["Crystals", "Grains", "Layers"], answer: 2 },
        { type: "gap", q: "Fill in the gaps.", text: "Granite has shiny ___ that fit together. Slate splits into thin, flat ___.", bank: ["crystals", "sheets", "grains", "shells"], answers: ["crystals", "sheets"] },
      ],
      grownUp: {
        need: ["The rock collection", "A bowl of water and an old toothbrush", "A magnifying glass if you have one"],
        tips: [
          "Children don't need to name the rocks they found. The skill here is careful looking and describing. 'Speckled, rough, with sparkly bits' is great science.",
          "If you have stone items at home, like a granite worktop, a marble chopping board or a slate coaster, look at them together.",
        ],
        younger: "Sort the rocks into just two groups, such as 'rough' and 'smooth', and say why each one goes where it does.",
        older: "Make a sorting tree with yes or no questions, like 'Does it have layers?', that leads to each rock in the collection.",
      },
    },
    {
      slug: "rocks-and-soils-3",
      title: "Testing rocks",
      emoji: "💧",
      minutes: 45,
      goal: "I can test rocks to find out if they are hard or soft and whether water soaks into them.",
      starter: [
        { type: "choice", q: "What does texture mean?", options: ["How something feels", "How old something is"], answer: 0 },
        { type: "choice", q: "Which rock family formed from hot, melted rock that cooled?", options: ["Sedimentary", "Igneous", "Metamorphic"], answer: 1 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Grain", "A tiny bit of rock"], ["Crystal", "A mineral with flat, shiny sides"], ["Layer", "A flat band of rock"]] },
        { type: "choice", q: "Which rock is made of sand stuck together?", options: ["Granite", "Slate", "Sandstone"], answer: 2 },
        { type: "choice", q: "Marble and slate are...", options: ["metamorphic rocks", "man-made", "igneous rocks"], answer: 0 },
        { type: "type", q: "Granite has shiny, sparkly bits. What are they called?", answer: ["crystals", "crystal", "Crystals"] },
      ],
      learn: {
        cards: [
          {
            heading: "Hard or soft?",
            picture: "/lessons/rocks-and-soils/lesson-3-1.jpg",
            alt: "A child scratching soft chalk with a fingernail while a friend fails to scratch granite with a coin",
            text: [
              "Rocks are not all equally hard. Scientists test hardness by trying to scratch them.",
              "Chalk is so soft you can scratch it with a fingernail. Granite is so hard that a steel nail won't scratch it. That's why granite is used for kitchen worktops and steps.",
            ],
          },
          {
            heading: "Does water soak in?",
            picture: "/lessons/rocks-and-soils/lesson-3-2.jpg",
            alt: "Water soaking into sandstone but sitting as a bead on slate",
            text: [
              "Some rocks have tiny gaps between their grains. Water can soak into them. These rocks are permeable. Sandstone and chalk are permeable.",
              "Other rocks have no gaps, so water stays on top. These rocks are impermeable. Slate and granite are impermeable.",
            ],
          },
          {
            heading: "The right rock for the job",
            picture: "/lessons/rocks-and-soils/lesson-3-3.jpg",
            alt: "A stone cottage with a wet slate roof, granite steps and an old worn stone",
            text: [
              "Builders choose rocks for their properties. Slate is impermeable and splits into thin sheets, so it makes good roof tiles.",
              "Some rocks wear away slowly in wind and rain. Gravestones and old buildings show this. Hard rocks like granite last much longer than soft rocks like chalk.",
            ],
          },
        ],
        words: [
          { word: "hardness", meaning: "how difficult a rock is to scratch" },
          { word: "permeable", meaning: "lets water soak in or pass through" },
          { word: "impermeable", meaning: "does not let water soak in" },
          { word: "property", meaning: "a word that describes what a material is like" },
        ],
      },
      practice: {
        intro: "Think like a rock tester.",
        questions: [
          { type: "choice", q: "A drop of water sinks into a rock and disappears. The rock is...", options: ["impermeable", "permeable", "metamorphic"], answer: 1 },
          { type: "choice", q: "Why is slate good for roofs?", options: ["It soaks up rain", "It is impermeable and splits into thin sheets", "It is very soft"], answer: 1 },
          {
            type: "match",
            q: "Match each rock to its property.",
            pairs: [["Chalk", "Soft and permeable"], ["Granite", "Hard and impermeable"], ["Slate", "Splits into thin sheets"]],
          },
          { type: "choice", q: "How can you test how hard a rock is?", options: ["See if it floats", "Try to scratch it", "Smell it"], answer: 1 },
        ],
      },
      task: {
        title: "The rock tests",
        intro: "Do two fair tests on the rocks in your collection.",
        need: ["Your rock collection", "A teaspoon and a cup of water", "An old coin", "A clean jam jar with a lid", "Paper and a pencil"],
        steps: [
          "Draw a table with your rocks down the side and three columns: 'fingernail', 'coin' and 'water'.",
          "Scratch test: try to scratch each rock with a fingernail, then with the edge of the coin. Tick each one that leaves a mark. Use the same small, firm scratch each time to keep it fair.",
          "Water test: put each rock on a plate. Drip one teaspoon of water on top. Count to 30. Does the water soak in or stay on top? Write permeable or impermeable.",
          "Wear-away test: put two of your rocks in the jar with some water, screw the lid on tight and shake for one minute. Is the water cloudy? Bits have worn off.",
          "Which rock was hardest? Which was most permeable? Write one sentence about each.",
        ],
      },
      exit: [
        { type: "choice", q: "What does permeable mean?", options: ["Water can soak in", "Water stays on top", "It is very hard"], answer: 0 },
        { type: "choice", q: "Which rock can you scratch with a fingernail?", options: ["Granite", "Chalk"], answer: 1 },
        { type: "choice", q: "Which rock is impermeable?", options: ["Sandstone", "Chalk", "Slate"], answer: 2 },
        { type: "choice", q: "Why is granite used for steps and worktops?", options: ["It is very hard", "It soaks up water", "It is soft"], answer: 0 },
        { type: "pick", q: "Which help keep a rock test fair? There is more than one.", options: ["Use the same amount of water each time", "Use a different coin for each rock", "Wait the same time for each rock", "Only test the prettiest rocks"], answers: [0, 2] },
        { type: "gap", q: "Fill in the gaps.", text: "Rocks with tiny gaps between their grains are ___. Rocks that let no water in are ___.", bank: ["permeable", "impermeable", "igneous", "crystals"], answers: ["permeable", "impermeable"] },
      ],
      grownUp: {
        need: ["The rock collection", "A teaspoon, water and a plate", "An old coin", "A jam jar with a lid"],
        tips: [
          "Supervise the scratch test and check the coin is only rubbed against the rock, away from fingers. A bit of brick or a terracotta pot shard makes a good extra 'soft and permeable' comparison.",
          "Use a plastic jar for the shaking test if you have one, and check the lid is on tightly. Results won't always be dramatic, and that's fine: talking about why is the science.",
        ],
        younger: "Just do the water test, and sort the rocks into two piles: 'water soaks in' and 'water stays on top'.",
        older: "Predict the results before each test, then compare. Was anything a surprise? Suggest a reason.",
      },
    },
    {
      slug: "rocks-and-soils-4",
      title: "How fossils form",
      emoji: "🦕",
      minutes: 45,
      goal: "I can explain how fossils form inside rock over a very long time.",
      starter: [
        { type: "choice", q: "What does permeable mean?", options: ["Water can soak in", "It can't be scratched"], answer: 0 },
        { type: "choice", q: "How do scientists test how hard a rock is?", options: ["By weighing it", "By trying to scratch it"], answer: 1 },
        { type: "choice", q: "Which rock is soft enough to scratch with a fingernail?", options: ["Chalk", "Granite", "Slate"], answer: 0 },
        { type: "choice", q: "Why is slate used for roofs?", options: ["It is permeable", "It is impermeable and splits into sheets"], answer: 1 },
        { type: "type", q: "Granite lets no water in. Is it permeable or impermeable?", answer: ["impermeable", "Impermeable"] },
        { type: "pick", q: "Which are permeable? There is more than one.", options: ["Sandstone", "Granite", "Chalk", "Slate"], answers: [0, 2] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a fossil?",
            picture: "/lessons/rocks-and-soils/lesson-4-1.jpg",
            alt: "A child on a beach holding an ammonite fossil, with a fern fossil and a fossil tooth nearby",
            text: [
              "A fossil is what is left of a plant or animal that lived a very long time ago, saved in rock. It can be bones, teeth, shells or even a footprint.",
              "Fossils show us living things that are now extinct, like dinosaurs and ammonites, sea creatures with curly shells.",
            ],
          },
          {
            heading: "How a fossil forms",
            picture: "/lessons/rocks-and-soils/lesson-4-2.jpg",
            alt: "An ammonite on the seabed being buried, turned to rock and uncovered in a cliff",
            text: [
              "A sea creature dies and sinks to the seabed. Its soft parts rot away, but the hard shell or bones are left.",
              "Layers of sand and mud cover it. Over millions of years, the layers are pressed into rock. Minerals in the water slowly replace the shell or bones, turning them to stone.",
              "Much later, wind, rain and waves wear the rock away, and the fossil is uncovered.",
            ],
          },
          {
            heading: "Mary Anning, fossil hunter",
            picture: "/lessons/rocks-and-soils/lesson-4-3.jpg",
            alt: "Mary Anning uncovering a sea reptile skeleton in the cliffs at Lyme Regis",
            text: [
              "Mary Anning lived in Lyme Regis, by the sea in Dorset, about 200 years ago. She searched the crumbly cliffs for fossils.",
              "When she was about 12, she and her brother found the skeleton of an ichthyosaur, a huge sea reptile. She went on to make many important discoveries.",
            ],
          },
        ],
        words: [
          { word: "fossil", meaning: "the remains or shape of a living thing from long ago, saved in rock" },
          { word: "extinct", meaning: "no longer alive anywhere on Earth" },
          { word: "sediment", meaning: "sand, mud and tiny bits of rock that settle in layers" },
          { word: "palaeontologist", meaning: "a scientist who studies fossils" },
        ],
      },
      practice: {
        intro: "Put the fossil story together.",
        questions: [
          {
            type: "order",
            q: "Put the steps in order, from first to last.",
            items: [
              "A sea creature dies and sinks to the seabed",
              "Its soft parts rot away",
              "Layers of sand and mud cover the shell",
              "The layers are pressed into rock over millions of years",
              "The rock wears away and the fossil is uncovered",
            ],
          },
          { type: "choice", q: "Which parts of an animal usually become fossils?", options: ["Hard parts, like shells and bones", "Soft parts, like skin"], answer: 0 },
          { type: "choice", q: "Who was Mary Anning?", options: ["A queen", "A famous fossil hunter", "An astronaut"], answer: 1 },
          { type: "choice", q: "Which rock family are fossils usually found in?", options: ["Igneous", "Sedimentary", "Metamorphic"], answer: 1, why: "Fossils form in layers of sand and mud, which become sedimentary rock." },
        ],
      },
      task: {
        title: "Make a salt dough fossil",
        intro: "Make your own fossil print, just like a shell pressed into mud long ago.",
        need: ["1 cup of plain flour and half a cup of salt", "About half a cup of water and a mixing bowl", "A shell, a leaf, a toy dinosaur or a pasta shape", "A little oil or flour to stop sticking"],
        steps: [
          "Mix the flour and salt in the bowl. Add the water a little at a time and squish it into a smooth dough.",
          "Roll a ball of dough and flatten it into a thick circle. This is the soft mud on the seabed.",
          "Dust your shell or toy with flour, press it firmly into the dough, then lift it out carefully. You've made a mould fossil.",
          "Leave it somewhere warm to dry and harden for a day or two. Then swap fossils with someone and see if they can guess what made the print.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a fossil?", options: ["A kind of crystal", "The remains of a living thing from long ago, saved in rock", "A very old pebble"], answer: 1 },
        { type: "choice", q: "What happens to the soft parts of a dead animal?", options: ["They rot away", "They turn into crystals"], answer: 0 },
        { type: "choice", q: "How long does it usually take for a fossil to form?", options: ["A few days", "About a year", "Millions of years"], answer: 2 },
        {
          type: "order",
          q: "Put these in order.",
          items: ["The animal dies", "It is covered by sand and mud", "The layers turn to rock", "The fossil is uncovered"],
        },
        { type: "choice", q: "What does extinct mean?", options: ["Very large", "Living in the sea", "No longer alive anywhere on Earth"], answer: 2 },
        { type: "gap", q: "Fill in the gaps.", text: "Mary Anning found fossils in the ___ at Lyme Regis. A scientist who studies fossils is a ___.", bank: ["cliffs", "palaeontologist", "garden", "astronaut"], answers: ["cliffs", "palaeontologist"] },
      ],
      grownUp: {
        need: ["Plain flour, salt and water", "A bowl", "A shell, leaf or small toy"],
        tips: [
          "Air-drying takes a day or two. If you'd like to speed it up, an adult can bake the fossils in a low oven (around 100°C) for an hour or two. Let them cool before touching.",
          "Salt dough is not for eating, so keep an eye on little ones. Children sometimes think fossils are actual bones; explain that most have slowly turned to stone.",
        ],
        younger: "Press lots of different objects into a ball of dough and play 'guess the fossil'.",
        older: "Find out about ammonites and belemnites, two fossils often found on British beaches. Draw and label one.",
      },
    },
    {
      slug: "rocks-and-soils-5",
      title: "What is soil made of?",
      emoji: "🌱",
      minutes: 45,
      goal: "I can explain that soil is made from tiny bits of rock mixed with rotted plants and animals, air and water.",
      starter: [
        { type: "choice", q: "What is a fossil?", options: ["The remains of a living thing from long ago, saved in rock", "A rock with crystals"], answer: 0 },
        { type: "choice", q: "Which parts of an animal usually become fossils?", options: ["Skin and fur", "Shells, bones and teeth"], answer: 1 },
        {
          type: "order",
          q: "Put the fossil steps in order.",
          items: ["A creature dies", "Sand and mud cover it", "The layers turn to rock", "The rock wears away and shows the fossil"],
        },
        { type: "choice", q: "Who was Mary Anning?", options: ["A famous painter", "A fossil hunter from Lyme Regis"], answer: 1 },
        { type: "type", q: "What word means an animal is no longer alive anywhere on Earth?", answer: ["extinct", "Extinct"] },
        { type: "choice", q: "How long do fossils usually take to form?", options: ["Millions of years", "A week"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Rocks break down",
            picture: "/lessons/rocks-and-soils/lesson-5-1.jpg",
            alt: "Rain, ice and roots breaking a rocky hillside into stones and sand",
            text: [
              "Rain, ice, wind and plant roots slowly break rocks into smaller and smaller pieces. This is called weathering.",
              "Over a very long time, rock is broken into stones, then sand, then tiny bits too small to see. These bits of rock are the main part of soil.",
            ],
          },
          {
            heading: "Rotted plants and animals",
            picture: "/lessons/rocks-and-soils/lesson-5-2.jpg",
            alt: "Fallen leaves rotting into dark soil with worms and a beetle",
            text: [
              "When leaves fall and plants and animals die, they rot. Worms, beetles and tiny living things called microbes break them down.",
              "This dark, rotted material is called organic matter, or humus. It feeds the soil and helps plants grow.",
            ],
          },
          {
            heading: "Soil also has air, water and life",
            picture: "/lessons/rocks-and-soils/lesson-5-3.jpg",
            alt: "Soil close up, with rock grains, air spaces, water drops, roots and a worm",
            text: [
              "There are tiny spaces in soil filled with air and water. Plant roots need both.",
              "A handful of healthy soil holds millions of living things, from worms to microbes. Soil forms very slowly: making one centimetre can take hundreds of years.",
            ],
          },
        ],
        words: [
          { word: "soil", meaning: "a mix of tiny bits of rock, rotted living things, air and water" },
          { word: "weathering", meaning: "when rocks are slowly broken into smaller pieces" },
          { word: "organic matter", meaning: "rotted bits of plants and animals" },
          { word: "humus", meaning: "dark, rotted organic matter in soil" },
        ],
      },
      practice: {
        intro: "What's in a handful of soil?",
        questions: [
          { type: "pick", q: "Which of these are found in soil? There is more than one.", options: ["Tiny bits of rock", "Plastic", "Rotted leaves", "Air and water"], answers: [0, 2, 3] },
          { type: "choice", q: "What is weathering?", options: ["When rocks are broken into smaller pieces", "When it rains a lot", "When soil turns into rock"], answer: 0 },
          {
            type: "match",
            q: "Match each part of soil to where it comes from.",
            pairs: [["Sand and tiny grains", "Broken-down rock"], ["Humus", "Rotted plants and animals"], ["Worms and microbes", "Living things"]],
          },
          { type: "choice", q: "Which helps break down dead leaves into soil?", options: ["Worms", "Stones", "Sunlight only"], answer: 0 },
        ],
      },
      task: {
        title: "Soil in a jar",
        intro: "Shake up some soil and watch it settle into layers.",
        need: ["A clean jam jar with a lid", "A few spoonfuls of garden soil", "Water", "An old spoon", "Gardening gloves or a plastic bag over your hand"],
        steps: [
          "With a grown-up, dig up a few spoonfuls of soil from the garden or a park flower bed. Wear gloves.",
          "Spoon the soil into the jar until it is about a third full. Fill the jar nearly to the top with water. Screw the lid on tightly.",
          "Shake the jar hard for one minute, then put it down somewhere it won't be knocked. Leave it overnight.",
          "Look the next day. Heavy stones sink to the bottom, then sand, then fine mud. Bits of rotted plants float on top. Draw what you see.",
          "Wash your hands well when you have finished.",
        ],
      },
      exit: [
        { type: "choice", q: "What is the main part of soil made from?", options: ["Sugar", "Plastic", "Tiny bits of rock"], answer: 2 },
        { type: "choice", q: "What is humus?", options: ["A type of rock", "Dark, rotted organic matter", "A kind of worm"], answer: 1 },
        { type: "choice", q: "What does weathering do to rocks?", options: ["Makes them bigger", "Breaks them into smaller pieces"], answer: 1 },
        { type: "pick", q: "Which help to make soil? There is more than one.", options: ["Rain and ice", "Worms", "Glass", "Fallen leaves"], answers: [0, 1, 3] },
        { type: "choice", q: "In the soil jar, what floats on top?", options: ["Stones", "Rotted bits of plants", "Sand"], answer: 1 },
        { type: "gap", q: "Fill in the gaps.", text: "Soil is a mix of tiny bits of ___, rotted plants and animals, air and ___.", bank: ["rock", "water", "plastic", "glass"], answers: ["rock", "water"] },
      ],
      grownUp: {
        need: ["A jam jar with a lid", "A few spoonfuls of garden soil", "Gloves or a plastic bag", "An old spoon"],
        tips: [
          "Supervise digging outside, use gloves, and make sure hands are washed afterwards, as soil can carry germs. Avoid soil where animals may have toileted.",
          "If you have no garden, a little compost from a houseplant pot works, though it will show mostly organic matter. Comparing the two is a bonus experiment.",
        ],
        younger: "Spread a spoonful of soil on a white plate and use a cocktail stick to find stones, roots, bits of leaf and maybe a tiny creature. Put any creatures back outside.",
        older: "Measure the height of each layer in the jar with a ruler and draw a labelled diagram.",
      },
    },
    {
      slug: "rocks-and-soils-6",
      title: "Investigating soils",
      emoji: "🪴",
      minutes: 45,
      goal: "I can carry out a fair test to find out which soil holds the most water.",
      starter: [
        { type: "choice", q: "What is the main part of soil made from?", options: ["Tiny bits of rock", "Bits of plastic"], answer: 0 },
        { type: "choice", q: "What is weathering?", options: ["When soil dries out", "When rocks are broken into smaller pieces"], answer: 1 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Humus", "Dark, rotted organic matter"], ["Weathering", "Rocks breaking into smaller pieces"], ["Soil", "Rock bits, rotted living things, air and water"]] },
        { type: "choice", q: "In the soil jar, what sank to the bottom?", options: ["Rotted leaves", "Heavy stones"], answer: 1 },
        { type: "pick", q: "Which are found in soil? There is more than one.", options: ["Air", "Water", "Glass", "Tiny bits of rock"], answers: [0, 1, 3] },
        { type: "type", q: "What wriggly animal helps break down leaves in soil?", answer: ["worm", "worms", "earthworm", "earthworms", "a worm"] },
      ],
      learn: {
        cards: [
          {
            heading: "Not all soil is the same",
            picture: "/lessons/rocks-and-soils/lesson-6-1.jpg",
            alt: "Two children feeling gritty sandy soil and sticky clay soil",
            text: [
              "Soils are different depending on the rock they came from and how much organic matter they have.",
              "Sandy soil has big grains. It feels gritty and water drains through it quickly.",
              "Clay soil has very tiny grains. It feels sticky when wet, holds lots of water and can get waterlogged.",
            ],
          },
          {
            heading: "Loam: the gardener's favourite",
            picture: "/lessons/rocks-and-soils/lesson-6-2.jpg",
            alt: "A grown-up and child adding compost to a vegetable patch",
            text: [
              "Loam is a mix of sand, clay and lots of humus. It holds enough water for plants but lets the extra drain away.",
              "Gardeners add compost to their soil to give it more organic matter. This helps almost any soil grow healthy plants.",
            ],
          },
          {
            heading: "Planning a fair test",
            picture: "/lessons/rocks-and-soils/lesson-6-3.jpg",
            alt: "Children testing three soils in bottle funnels with water dripping through",
            text: [
              "To compare soils fairly, change only one thing: the type of soil. Keep everything else the same.",
              "Use the same amount of soil, the same amount of water, and the same time for each test. Then measure how much water drips through.",
            ],
          },
        ],
        words: [
          { word: "drain", meaning: "when water flows through and away" },
          { word: "sandy soil", meaning: "gritty soil with big grains that water drains through quickly" },
          { word: "clay soil", meaning: "sticky soil with tiny grains that holds lots of water" },
          { word: "fair test", meaning: "a test where you change only one thing" },
        ],
      },
      practice: {
        intro: "Which soil is which?",
        questions: [
          {
            type: "match",
            q: "Match each soil to what it's like.",
            pairs: [["Sandy soil", "Gritty, water drains fast"], ["Clay soil", "Sticky, holds lots of water"], ["Loam", "A mix, good for plants"]],
          },
          { type: "choice", q: "In a fair test of soils, what should you change?", options: ["Only the type of soil", "The amount of water", "Everything"], answer: 0 },
          { type: "pick", q: "Which should you keep the same? There is more than one.", options: ["The amount of soil", "The type of soil", "The amount of water", "How long you wait"], answers: [0, 2, 3] },
          { type: "choice", q: "Why do gardeners add compost to soil?", options: ["To add organic matter", "To make it gritty", "To keep worms away"], answer: 0 },
          { type: "choice", q: "Which soil is most likely to get waterlogged?", options: ["Sandy soil", "Clay soil"], answer: 1 },
        ],
      },
      task: {
        title: "The soil drainage test",
        intro: "Find out which soil lets water through fastest and which holds on to the most.",
        need: [
          "Two or three soils, such as garden soil, sand from a play pit and houseplant compost",
          "Two or three empty plastic bottles, cut in half by a grown-up",
          "Kitchen roll or coffee filters",
          "A measuring jug and a tablespoon",
          "A timer, like a phone or kitchen timer",
        ],
        steps: [
          "Ask a grown-up to cut each bottle in half. Turn the top half upside down into the bottom half to make a funnel.",
          "Put a piece of kitchen roll in each funnel. Add 4 tablespoons of a different soil to each one.",
          "Predict: which soil will let the most water through?",
          "Pour 100 ml of water into each funnel at the same time. Wait 5 minutes.",
          "Measure how much water dripped through each one with the jug. Which soil held on to the most water? Was your prediction right?",
        ],
      },
      exit: [
        { type: "choice", q: "Which soil lets water drain through quickly?", options: ["Clay soil", "Sandy soil"], answer: 1 },
        { type: "choice", q: "What does clay soil feel like when wet?", options: ["Sticky", "Gritty", "Dry and dusty"], answer: 0 },
        { type: "choice", q: "What is loam?", options: ["A kind of rock", "A mix of sand, clay and humus", "Pure sand"], answer: 1 },
        { type: "choice", q: "In a fair test, how many things do you change?", options: ["As many as you like", "Two", "Only one"], answer: 2 },
        { type: "pick", q: "In the drainage test, which did you keep the same? There is more than one.", options: ["The amount of water", "The type of soil", "The waiting time", "The amount of soil"], answers: [0, 2, 3] },
        { type: "gap", q: "Fill in the gaps.", text: "Sandy soil has ___ grains. Clay soil has tiny grains and holds lots of ___.", bank: ["big", "water", "glass", "small"], answers: ["big", "water"] },
      ],
      grownUp: {
        need: ["Two or three different soils", "Plastic bottles", "Kitchen roll or coffee filters", "A measuring jug, tablespoon and timer"],
        tips: [
          "An adult should cut the bottles with scissors or a knife, and tape over any sharp edges. Supervise any digging outside and wash hands afterwards.",
          "Sand usually lets water through fastest, and compost often holds the most. Real results vary, and that's fine: talk about why.",
        ],
        younger: "Just compare two soils, and use a cup to see which one has the most water at the bottom.",
        older: "Draw a bar chart of your results and write a conclusion. Which soil would be best for a plant that likes damp roots?",
      },
    },
  ],
};
