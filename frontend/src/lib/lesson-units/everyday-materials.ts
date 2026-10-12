import type { LessonUnit } from "@/lib/lessons";

/** Everyday materials, for ages 5 to 7. A grown-up reads along. Every activity uses things most homes already have. */
export const everydayMaterials: LessonUnit = {
  slug: "everyday-materials",
  title: "Everyday materials",
  short: "Materials",
  subject: "Science",
  ages: "5 to 7",
  emoji: "🧱",
  color: "#9DB4A0",
  summary: "Six playful lessons about what things are made of: naming materials, how they feel, keeping teddy dry, squashing and stretching, and building houses for the Three Little Pigs.",
  cover: "/lessons/units/everyday-materials.jpg",
  lessons: [
    {
      slug: "everyday-materials-1",
      title: "Object or material?",
      emoji: "🥄",
      minutes: 30,
      goal: "I can say what a thing is and what it is made of.",
      starter: [
        { type: "choice", q: "Which of these is soft?", options: ["A rock", "A teddy", "A fork"], answer: 1 },
        { type: "choice", q: "Where does wood come from?", options: ["Trees", "Rocks", "The sea"], answer: 0 },
        { type: "choice", q: "What can you see through?", options: ["A wall", "A door", "A window"], answer: 2 },
        { type: "pick", q: "Which of these are hard? There is more than one.", options: ["A stone", "A cushion", "A metal spoon", "A sock"], answers: [0, 2] },
        { type: "match", q: "Match each thing to what we do with it.", pairs: [["Cup", "Drink from it"], ["Coat", "Wear it"], ["Chair", "Sit on it"]] },
        { type: "choice", q: "Which would keep you dry in the rain?", options: ["A paper hat", "A raincoat", "A woolly jumper"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is an object?",
            text: [
              "An object is a thing. You can touch it, hold it or use it.",
              "A cup is an object. A chair is an object. Your shoe is an object too!",
            ],
          },
          {
            heading: "What is a material?",
            text: [
              "A material is the stuff an object is made of.",
              "A chair might be made of wood. A cup might be made of plastic.",
              "Ask: what is it made of? The answer is the material.",
            ],
          },
          {
            heading: "Same object, different materials",
            text: [
              "A spoon can be made of metal, wood or plastic. It is still a spoon!",
              "One material can make lots of objects too. Wood can make a table, a spoon and a pencil.",
            ],
          },
        ],
        words: [
          { word: "object", meaning: "a thing you can touch or use" },
          { word: "material", meaning: "the stuff a thing is made of" },
          { word: "sort", meaning: "put things into groups" },
        ],
      },
      practice: {
        intro: "Is it an object or a material? Have a think, then choose.",
        questions: [
          { type: "choice", q: "Is a cup an object or a material?", options: ["An object", "A material"], answer: 0 },
          { type: "choice", q: "Is wood an object or a material?", options: ["An object", "A material"], answer: 1 },
          { type: "pick", q: "Which of these are materials? There is more than one.", options: ["Plastic", "Chair", "Metal", "Shoe"], answers: [0, 2] },
          { type: "match", q: "Match each object to what it is made of.", pairs: [["Wooden spoon", "Wood"], ["Paper plate", "Paper"], ["Metal fork", "Metal"]] },
        ],
      },
      task: {
        title: "The spoon family",
        intro: "Meet some spoons that are all a bit different, then play a guessing game.",
        need: ["A metal spoon, a wooden spoon and a plastic spoon", "Your grown-up"],
        steps: [
          "Find three spoons with your grown-up: a metal one, a wooden one and a plastic one.",
          "Line them up. Say: they are all spoons!",
          "Hold each one. Is it heavy or light?",
          "Say what each spoon is made of.",
          "Play 'What's it made of?'. Your grown-up points to a thing in the room. You say its material.",
          "Swap! You point, and your grown-up answers.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a material?", options: ["The stuff a thing is made of", "A thing you play with", "A colour"], answer: 0 },
        { type: "choice", q: "Which of these is an object?", options: ["Plastic", "A chair", "Wood"], answer: 1 },
        { type: "choice", q: "Which of these is a material?", options: ["A spoon", "A cup", "Metal"], answer: 2 },
        { type: "pick", q: "What can a spoon be made of? There is more than one.", options: ["Metal", "Wood", "Water", "Plastic"], answers: [0, 1, 3] },
        { type: "choice", q: "A wooden spoon and a metal spoon are both...", options: ["made of wood", "spoons", "made of metal"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "A table can be made of ___.", bank: ["wood", "water"], answers: ["wood"] },
      ],
      grownUp: {
        need: ["Spoons made of metal, wood and plastic", "A few other everyday objects"],
        tips: [
          "The big idea is object versus material. Keep asking: what is it? What is it made of?",
          "Children often answer with the object or the colour ('it's a cup', 'it's red'). Gently ask again: what stuff is it made of?",
        ],
        younger: "Just play 'What's it made of?' with three materials: wood, plastic and metal.",
        older: "Find an object made of two materials, like a saucepan with a metal pan and a plastic handle. Why is each part made of that material?",
      },
    },
    {
      slug: "everyday-materials-2",
      title: "Materials all around",
      emoji: "🔍",
      minutes: 30,
      goal: "I can name lots of materials, like wood, metal and glass.",
      starter: [
        { type: "choice", q: "What is a material?", options: ["A thing you play with", "The stuff a thing is made of"], answer: 1 },
        { type: "choice", q: "Is a cup an object or a material?", options: ["An object", "A material"], answer: 0 },
        { type: "choice", q: "Which of these is a material?", options: ["A shoe", "Plastic", "A table"], answer: 1 },
        { type: "pick", q: "What can a spoon be made of? There is more than one.", options: ["Wood", "Metal", "Water"], answers: [0, 1] },
        { type: "match", q: "Match each object to what it is made of.", pairs: [["Pencil", "Wood"], ["Book page", "Paper"], ["Coin", "Metal"]] },
        { type: "choice", q: "A metal spoon and a plastic spoon are both...", options: ["forks", "spoons", "cups"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Meet the materials",
            text: [
              "Today we will meet eight materials: wood, plastic, glass, metal, water, rock, fabric and paper.",
              "Let's say them together, and count them on our fingers!",
            ],
          },
          {
            heading: "Where do they come from?",
            text: [
              "Wood comes from trees. Paper is made from wood!",
              "Rock comes from the ground. Water falls from the sky as rain.",
              "Glass is made from sand. Fabric is made from threads, like wool from sheep.",
            ],
          },
          {
            heading: "Spot them at home",
            text: [
              "A window is glass. A pan is metal. A jumper is fabric.",
              "A book is paper. A toy brick might be plastic or wood.",
              "Look around you now. What can you spot?",
            ],
          },
        ],
        words: [
          { word: "wood", meaning: "a material that comes from trees" },
          { word: "rock", meaning: "hard stuff from the ground, like a pebble" },
          { word: "glass", meaning: "hard and see-through, like a window" },
          { word: "fabric", meaning: "cloth, like your clothes are made of" },
        ],
      },
      practice: {
        intro: "Let's name some materials.",
        questions: [
          { type: "match", q: "Match each object to what it is made of.", pairs: [["Window", "Glass"], ["Jumper", "Fabric"], ["Pebble", "Rock"]] },
          { type: "choice", q: "Where does wood come from?", options: ["Sand", "Trees", "Sheep"], answer: 1 },
          { type: "choice", q: "Paper is made from...", options: ["wood", "glass", "water"], answer: 0 },
          { type: "pick", q: "Which of these are made of fabric? There is more than one.", options: ["A sock", "A spoon", "A T-shirt", "A window"], answers: [0, 2] },
        ],
      },
      task: {
        title: "Materials I spy",
        intro: "Go on a hunt for all eight materials, indoors and outside.",
        need: ["Paper and crayons", "A grown-up to go outside with you"],
        steps: [
          "Draw eight boxes on your paper. Your grown-up can help.",
          "In each box, draw a tiny picture for one material. A tree for wood, a drop for water, and so on.",
          "Walk around your home with your grown-up. When you spot a material, tick its box.",
          "Go outside with your grown-up. Can you find rock and water?",
          "Did you tick all eight? Which one was the hardest to find?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a window made of?", options: ["Paper", "Glass", "Fabric"], answer: 1 },
        { type: "choice", q: "Where does wood come from?", options: ["Trees", "Rocks"], answer: 0 },
        { type: "match", q: "Match each object to what it is made of.", pairs: [["Book", "Paper"], ["Pan", "Metal"], ["Pebble", "Rock"]] },
        { type: "pick", q: "Which of these are materials? There is more than one.", options: ["Glass", "Rock", "Teddy", "Water"], answers: [0, 1, 3] },
        { type: "choice", q: "Which material is made from sand?", options: ["Wood", "Paper", "Glass"], answer: 2 },
        { type: "type", q: "Paper is made from which material? Type the word.", answer: ["wood", "Wood"] },
      ],
      grownUp: {
        need: ["Paper and crayons", "A safe outdoor space, like a garden, yard or park"],
        tips: [
          "Water counts as a material in the Year 1 curriculum, even though it isn't solid. A puddle, a bath or a glass of water all count.",
          "Glass is made by heating sand (with a few other things) until it melts. 'Made from sand' is right for this age.",
          "Stay with your child outdoors, and steer clear of broken glass.",
        ],
        younger: "Hunt for just three materials: wood, metal and fabric.",
        older: "Find something made of each material, then find one object made of three materials at once.",
      },
    },
    {
      slug: "everyday-materials-3",
      title: "How does it feel?",
      emoji: "✋",
      minutes: 30,
      goal: "I can say if a material is hard or soft, rough or smooth, shiny or dull.",
      starter: [
        { type: "choice", q: "What is a jumper made of?", options: ["Metal", "Fabric", "Glass"], answer: 1 },
        { type: "choice", q: "Paper is made from...", options: ["wood", "rock"], answer: 0 },
        { type: "choice", q: "Which material is made from sand?", options: ["Glass", "Wood", "Fabric"], answer: 0 },
        { type: "match", q: "Match each object to what it is made of.", pairs: [["Pebble", "Rock"], ["Window", "Glass"], ["Pan", "Metal"]] },
        { type: "pick", q: "Which of these are materials? There is more than one.", options: ["Wood", "Chair", "Water", "Cup"], answers: [0, 2] },
        { type: "choice", q: "Where does wood come from?", options: ["The sea", "Sheep", "Trees"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Hard or soft?",
            text: [
              "Press a material with your finger. Does it squish down? Then it is soft.",
              "A cushion and a sponge are soft. A rock and a metal spoon are hard.",
            ],
          },
          {
            heading: "Rough or smooth?",
            text: [
              "Stroke it gently with your fingers. Is it bumpy or scratchy? That is rough.",
              "Is it flat and even, like a window? That is smooth.",
              "Tree bark is rough. A glass jar is smooth.",
            ],
          },
          {
            heading: "Shiny or dull?",
            text: [
              "Shiny things catch the light and sparkle. Some are so shiny you can see yourself!",
              "Dull things don't shine. A metal spoon is shiny. A woolly sock is dull.",
            ],
          },
        ],
        words: [
          { word: "soft", meaning: "squishes when you press it" },
          { word: "rough", meaning: "bumpy or scratchy to touch" },
          { word: "smooth", meaning: "flat and even to touch" },
          { word: "shiny", meaning: "catches the light and sparkles" },
        ],
      },
      practice: {
        intro: "Use your feeling words.",
        questions: [
          { type: "choice", q: "Is a cushion hard or soft?", options: ["Hard", "Soft"], answer: 1 },
          { type: "match", q: "Match each object to a word that fits it.", pairs: [["Rock", "Hard"], ["Tree bark", "Rough"], ["Metal spoon", "Shiny"]] },
          { type: "pick", q: "Which of these are smooth? There is more than one.", options: ["A window", "Sandpaper", "A glass jar", "Tree bark"], answers: [0, 2] },
          { type: "choice", q: "Which is shiny?", options: ["A woolly sock", "A piece of foil", "A paper bag"], answer: 1 },
        ],
      },
      task: {
        title: "The feely bag",
        intro: "Use your fingers like a scientist. No peeking!",
        need: ["A pillowcase or cloth bag", "Some objects made of different materials, like a spoon, a sock, a pebble, a sponge, a wooden brick and some scrunched-up foil"],
        steps: [
          "Your grown-up puts the objects in the bag. Close your eyes!",
          "Put your hand in and feel one object.",
          "Say how it feels. Hard or soft? Rough or smooth?",
          "Guess what it is and what it is made of. Pull it out to check!",
          "Is it shiny or dull? You need your eyes for that one.",
          "Swap, and let your grown-up have a go.",
        ],
      },
      exit: [
        { type: "choice", q: "A sponge is...", options: ["hard", "soft"], answer: 1 },
        { type: "choice", q: "Which is rough?", options: ["Tree bark", "A window", "A glass jar"], answer: 0 },
        { type: "choice", q: "Which word means it catches the light and sparkles?", options: ["Dull", "Soft", "Shiny"], answer: 2 },
        { type: "pick", q: "Which of these are hard? There is more than one.", options: ["A wooden brick", "A woolly hat", "A pebble", "A sponge"], answers: [0, 2] },
        { type: "match", q: "Match the opposites.", pairs: [["Hard", "Soft"], ["Rough", "Smooth"], ["Shiny", "Dull"]] },
        { type: "gap", q: "Fill the gap.", text: "A woolly sock is soft and ___.", bank: ["dull", "shiny"], answers: ["dull"] },
      ],
      grownUp: {
        need: ["A pillowcase or cloth bag", "6 to 8 safe objects of different materials"],
        tips: [
          "Leave out anything sharp, breakable or small enough to swallow.",
          "Encourage whole sentences: 'The pebble is hard and smooth.'",
          "One object can be lots of things at once. A metal spoon is hard, smooth and shiny.",
        ],
        younger: "Just do hard or soft. Feel, guess, then sort the objects into two piles.",
        older: "Find a material that is hard but rough, and one that is soft but smooth. Draw them both.",
      },
    },
    {
      slug: "everyday-materials-4",
      title: "Rain, rain, go away!",
      emoji: "☂️",
      minutes: 30,
      goal: "I can test which materials keep water out, and which ones I can see through.",
      starter: [
        { type: "choice", q: "Is a rock hard or soft?", options: ["Hard", "Soft"], answer: 0 },
        { type: "choice", q: "Which is smooth?", options: ["Tree bark", "A window"], answer: 1 },
        { type: "choice", q: "A metal spoon is...", options: ["dull", "shiny", "soft"], answer: 1 },
        { type: "match", q: "Match each object to a word that fits it.", pairs: [["Sponge", "Soft"], ["Tree bark", "Rough"], ["Foil", "Shiny"]] },
        { type: "pick", q: "Which of these are soft? There is more than one.", options: ["A cushion", "A brick", "A teddy", "A spoon"], answers: [0, 2] },
        { type: "choice", q: "What do you use to see if something is shiny?", options: ["Your ears", "Your eyes", "Your nose"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Can you see through it?",
            text: [
              "Some materials let you see right through them. We say they are see-through.",
              "A window is see-through. So is clear plastic, like some water bottles.",
              "A wall, a wooden door and a book are not see-through. You can't see what is behind them.",
            ],
          },
          {
            heading: "Waterproof",
            text: [
              "Waterproof means water can't get through.",
              "Wellies, raincoats and umbrellas are waterproof. Plastic and metal keep water out.",
              "Paper and kitchen roll are not waterproof. They soak water up and go soggy!",
            ],
          },
          {
            heading: "Testing like a scientist",
            text: [
              "Scientists don't just guess. They test!",
              "First, say what you think will happen. Then try it and look carefully.",
              "If you were wrong, that's fine. Now you know something new!",
            ],
          },
        ],
        words: [
          { word: "see-through", meaning: "you can see what is behind it" },
          { word: "waterproof", meaning: "water can't get through it" },
          { word: "soggy", meaning: "wet and floppy" },
          { word: "test", meaning: "try something to find out" },
        ],
      },
      practice: {
        intro: "Will it keep the rain out?",
        questions: [
          { type: "choice", q: "Which is see-through?", options: ["A wooden door", "A window", "A book"], answer: 1 },
          { type: "pick", q: "Which would keep teddy dry? There is more than one.", options: ["A plastic bag", "A paper towel", "A piece of foil", "A tissue"], answers: [0, 2] },
          { type: "choice", q: "What happens to paper in the rain?", options: ["It stays dry", "It gets soggy", "It turns into glass"], answer: 1 },
          { type: "choice", q: "Why are wellies waterproof?", options: ["So they look shiny", "So they are soft", "So your feet stay dry"], answer: 2 },
        ],
      },
      task: {
        title: "An umbrella for teddy",
        intro: "Oh no, it's raining on teddy! Find the best material to make teddy an umbrella.",
        need: [
          "A teddy or a plastic toy, and a tissue",
          "Squares of paper, kitchen roll, a plastic bag, foil and old fabric",
          "A cup of water, a spoon and a tray",
          "A grown-up to help with the water",
        ],
        steps: [
          "Sit teddy on the tray. Put a dry tissue on teddy's head.",
          "Look at your materials. Which one will keep teddy dry? Point to it.",
          "Hold one material over teddy like an umbrella.",
          "Drip three spoonfuls of water on top. Your grown-up can help.",
          "Lift it up. Is the tissue wet or dry? Use a new dry tissue each time.",
          "Try each material the same way. Which is the best umbrella?",
          "Hold each material up to the window. Which ones can you see through?",
        ],
      },
      exit: [
        { type: "choice", q: "What does waterproof mean?", options: ["Water soaks in", "Water can't get through"], answer: 1 },
        { type: "choice", q: "Which is see-through?", options: ["A brick", "A wall", "Clear plastic"], answer: 2 },
        { type: "pick", q: "Which are waterproof? There is more than one.", options: ["A plastic bag", "Kitchen roll", "Foil", "Paper"], answers: [0, 2] },
        { type: "choice", q: "Which would make the best umbrella?", options: ["Paper", "Plastic", "Kitchen roll"], answer: 1 },
        { type: "choice", q: "Before a test, a scientist says...", options: ["what they think will happen", "what they had for lunch", "nothing at all"], answer: 0 },
        { type: "order", q: "Put the test in order.", items: ["Say what you think will happen", "Try it", "Look carefully at what happened"] },
      ],
      grownUp: {
        need: ["A teddy or plastic toy, and some tissues", "Squares of paper, kitchen roll, a plastic bag, foil and old fabric", "A cup of water, a spoon and a tray"],
        tips: [
          "This is water play: do it on a tray, by the sink or in the bath, and stay close by.",
          "Keep plastic bags away from faces, and put them away afterwards.",
          "Foil is waterproof and shiny but not see-through. Clear plastic is waterproof and see-through. Most fabric lets water through.",
        ],
        younger: "Test just two materials: a plastic bag and a paper towel. Which one keeps teddy dry?",
        older: "Make a tiny umbrella from foil. How many spoonfuls of water can it keep off? Can they say why paper is a poor choice?",
      },
    },
    {
      slug: "everyday-materials-5",
      title: "Squash, bend, twist and stretch",
      emoji: "🤸",
      minutes: 30,
      goal: "I can squash, bend, twist and stretch things and say what happens.",
      starter: [
        { type: "choice", q: "Which is waterproof?", options: ["A paper towel", "A plastic bag"], answer: 1 },
        { type: "choice", q: "Is a window see-through?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What happens to paper when it gets wet?", options: ["It gets soggy", "It gets shiny", "It gets harder"], answer: 0 },
        { type: "pick", q: "Which would keep teddy dry? There is more than one.", options: ["Foil", "A tissue", "A plastic bag"], answers: [0, 2] },
        { type: "match", q: "Match each word to something it fits.", pairs: [["See-through", "Window"], ["Waterproof", "Wellies"], ["Soggy", "Wet paper"]] },
        { type: "choice", q: "Which is not see-through?", options: ["Clear plastic", "A window", "A book"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Changing shape",
            text: [
              "You can change the shape of some objects with your hands.",
              "You can squash them, bend them, twist them or stretch them.",
              "Try it now! Squash your hands together. Bend your arm. Twist your body. Stretch up tall!",
            ],
          },
          {
            heading: "Bendy or stiff?",
            text: [
              "A bendy material is easy to bend. A sock, a sheet of paper and a strip of foil are bendy.",
              "A stiff material won't bend easily. A wooden spoon and a rock are stiff.",
            ],
          },
          {
            heading: "Does it go back?",
            text: [
              "Stretch an elastic band, then let go. It springs back!",
              "Squash a sponge and let go. It springs back too.",
              "But squash play dough or scrunch up foil, and it stays squashed.",
            ],
          },
        ],
        words: [
          { word: "squash", meaning: "press hard to make it flatter" },
          { word: "twist", meaning: "turn it round" },
          { word: "stretch", meaning: "pull it to make it longer" },
          { word: "bendy", meaning: "easy to bend" },
        ],
      },
      practice: {
        intro: "Show what you know about changing shape.",
        questions: [
          { type: "match", q: "Match each word to what you do.", pairs: [["Squash", "Press it hard"], ["Stretch", "Pull it longer"], ["Twist", "Turn it round"]] },
          { type: "choice", q: "Which is bendy?", options: ["A sheet of paper", "A rock", "A wooden spoon"], answer: 0 },
          { type: "choice", q: "You stretch an elastic band and let go. What happens?", options: ["It stays long", "It springs back", "It turns into water"], answer: 1 },
          { type: "pick", q: "Which can you squash? There is more than one.", options: ["A sponge", "A rock", "Play dough", "A metal spoon"], answers: [0, 2] },
        ],
      },
      task: {
        title: "The shape-changing test",
        intro: "Squash it, bend it, twist it, stretch it! What happens to each object?",
        need: ["Play dough", "A sponge", "A sock", "An elastic band", "A strip of foil", "A wooden spoon or a pebble"],
        steps: [
          "Put all your objects in a row.",
          "Try to squash each one. Which ones squash?",
          "Now try to bend each one. Which are bendy? Which are stiff?",
          "Try twisting and stretching them too. Gently!",
          "Make two piles: things that spring back, and things that stay changed.",
          "Roll a play dough snake. Can you bend it, twist it and stretch it?",
        ],
      },
      exit: [
        { type: "choice", q: "What does stretch mean?", options: ["Pull it to make it longer", "Press it flat", "Turn it round"], answer: 0 },
        { type: "choice", q: "Which is stiff?", options: ["A sock", "A wooden spoon", "A sheet of paper"], answer: 1 },
        { type: "pick", q: "Which spring back after you squash them? There is more than one.", options: ["A sponge", "Play dough", "A soft ball"], answers: [0, 2] },
        { type: "choice", q: "You squash play dough. What happens?", options: ["It springs back", "It stays squashed"], answer: 1 },
        { type: "gap", q: "Fill the gaps.", text: "A sock is ___ and a rock is ___.", bank: ["bendy", "stiff", "shiny"], answers: ["bendy", "stiff"] },
        { type: "match", q: "Match each object to a way you can change its shape.", pairs: [["Elastic band", "Stretch"], ["Sponge", "Squash"], ["Paper", "Bend"]] },
      ],
      grownUp: {
        need: ["Play dough", "A sponge, a sock, an elastic band, a strip of foil and a wooden spoon or pebble"],
        tips: [
          "Stretch elastic bands gently and away from faces, as they can snap. Make sure play dough isn't eaten.",
          "Squashing, bending, twisting and stretching are all pushes and pulls. That's a handy link to forces later on.",
          "Some shape changes go back (a sponge, an elastic band) and some don't (play dough, scrunched foil).",
        ],
        younger: "Just squash and stretch play dough, saying the words out loud as you go.",
        older: "Can they find something that squashes but won't stretch? Or something that bends but doesn't spring back?",
      },
    },
    {
      slug: "everyday-materials-6",
      title: "The right material for the job",
      emoji: "🐷",
      minutes: 30,
      goal: "I can choose a good material for a job and say why.",
      starter: [
        { type: "choice", q: "What does squash mean?", options: ["Press it hard", "Pull it longer"], answer: 0 },
        { type: "choice", q: "Which is bendy?", options: ["A rock", "A sock"], answer: 1 },
        { type: "choice", q: "You let go of a stretched elastic band. It...", options: ["stays long", "springs back", "melts"], answer: 1 },
        { type: "pick", q: "Which can you twist? There is more than one.", options: ["A sock", "A pebble", "A towel"], answers: [0, 2] },
        { type: "match", q: "Match each word to an object you can do it to.", pairs: [["Squash", "Sponge"], ["Stretch", "Elastic band"], ["Bend", "Paper"]] },
        { type: "choice", q: "Which stays squashed?", options: ["A sponge", "Play dough", "A soft ball"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The Three Little Pigs",
            text: [
              "Three little pigs each built a house. One used straw. One used sticks. One used bricks.",
              "The wolf huffed and puffed. The straw house fell down! The stick house fell down too!",
              "But the brick house was strong and stiff. It stayed standing.",
            ],
          },
          {
            heading: "Choosing the best material",
            text: [
              "Every job needs the right material.",
              "A window needs to be see-through, so we use glass. An umbrella needs to be waterproof, so we use plastic or waterproof fabric.",
              "A pillow needs to be soft, so we use fabric.",
            ],
          },
          {
            heading: "Silly materials",
            text: [
              "What if we used the wrong material? A paper umbrella would go soggy. A glass pillow would be hard, and it could break!",
              "When you choose a material, ask: what does it need to be like?",
            ],
          },
        ],
        words: [
          { word: "strong", meaning: "hard to break" },
          { word: "job", meaning: "what an object is for" },
          { word: "choose", meaning: "pick the best one" },
        ],
      },
      practice: {
        intro: "Be a materials expert and pick the best material.",
        questions: [
          { type: "choice", q: "Why was the brick house the best?", options: ["It was strong", "It was soft", "It was see-through"], answer: 0 },
          { type: "match", q: "Match each object to the best material.", pairs: [["Window", "Glass"], ["Pillow", "Fabric"], ["Umbrella", "Plastic"]] },
          { type: "choice", q: "Why is a paper umbrella a silly idea?", options: ["It would be too shiny", "It would go soggy", "It would be too heavy"], answer: 1 },
          { type: "pick", q: "Which would make a strong bridge for a toy car? There is more than one.", options: ["A wooden ruler", "A tissue", "A metal baking tray"], answers: [0, 2] },
        ],
      },
      task: {
        title: "Huff and puff houses",
        intro: "Build three little houses, then be the wolf and try to blow them down.",
        need: [
          "Strips of paper, for the straw house",
          "Lolly sticks or twigs, for the stick house",
          "Building blocks, for the brick house",
          "A sheet of card or paper to fold into a fan",
          "A grown-up to help collect twigs outside",
        ],
        steps: [
          "Build a little house out of paper strips. This is the straw house.",
          "Build one out of lolly sticks or twigs. This is the stick house.",
          "Build one out of blocks. This is the brick house.",
          "Be the wolf! Huff and puff at each house, or wave your fan.",
          "Which houses fell down? Which one stayed up?",
          "Tell your grown-up which material was best for a house, and why.",
        ],
      },
      exit: [
        { type: "choice", q: "In the story, which house did not fall down?", options: ["The straw house", "The brick house", "The stick house"], answer: 1 },
        { type: "choice", q: "Why is a window made of glass?", options: ["It is soft", "It is see-through", "It is bendy"], answer: 1 },
        { type: "choice", q: "What does an umbrella need to be?", options: ["Waterproof", "Soft", "Rough"], answer: 0 },
        { type: "match", q: "Match each object to what it needs to be.", pairs: [["Pillow", "Soft"], ["Window", "See-through"], ["Raincoat", "Waterproof"]] },
        { type: "pick", q: "Which of these are silly? There is more than one.", options: ["A paper umbrella", "A glass window", "A glass pillow", "A fabric jumper"], answers: [0, 2] },
        { type: "type", q: "What did the third little pig build his house with? Type one word.", answer: ["bricks", "brick", "Bricks", "Brick"] },
      ],
      grownUp: {
        need: ["Paper strips, lolly sticks or twigs, and building blocks", "Card or paper for a fan"],
        tips: [
          "Retell the story together first. At each house, ask: why did that one fall down?",
          "If your child asks, bricks are made from clay that is baked until it is hard, a bit like rock.",
          "Collect twigs together outdoors, and wash hands afterwards.",
        ],
        younger: "Build just two houses, one of paper and one of blocks, then huff and puff.",
        older: "Design and draw a house for a fourth little pig. Say what material each part is made of, and why.",
      },
    },
  ],
};
