import type { LessonUnit } from "@/lib/lessons";

/** Maps and directions, for ages 5 to 7: bird's-eye views, symbols and keys, position words, directions, the four compass points, and treasure and story maps. */
export const mapsAndDirections: LessonUnit = {
  slug: "maps-and-directions",
  title: "Maps and directions",
  short: "Maps",
  subject: "Geography",
  ages: "5 to 7",
  emoji: "📍",
  color: "#8FAF9A",
  summary: "Six playful lessons on what maps are, bird's-eye views, symbols and keys, position words, giving directions, the four compass points and treasure maps.",
  cover: "/lessons/units/maps-and-directions.jpg",
  lessons: [
    {
      slug: "maps-and-directions-1",
      title: "What is a map?",
      emoji: "🗺️",
      minutes: 30,
      goal: "I can say what a map is and what a bird's-eye view is.",
      starter: [
        { type: "choice", q: "Have you seen a map before? Which of these is a map?", options: ["A shopping list", "A picture of a place from above", "A birthday card"], answer: 1 },
        { type: "choice", q: "What can a map help you do?", options: ["Brush your teeth", "Bake a cake", "Find your way"], answer: 2 },
        { type: "choice", q: "Which animal flies high up in the sky?", options: ["A cat", "A fish", "A bird"], answer: 2 },
        { type: "pick", q: "Where might you see a map? There is more than one.", options: ["At a zoo", "In a bath", "In a park", "On a phone"], answers: [0, 2, 3] },
        { type: "choice", q: "If you stand on a chair and look down at a table, what do you see most?", options: ["The legs of the table", "The top of the table"], answer: 1 },
        { type: "match", q: "Match each place to something you find there.", pairs: [["Park", "Swings"], ["Kitchen", "Cooker"], ["Beach", "Sand"]] },
      ],
      learn: {
        cards: [
          {
            heading: "A map is a picture of a place",
            text: [
              "A map is a special picture of a place. It shows where things are.",
              "Maps help us find our way. There are maps of rooms, parks, towns and even the whole world.",
            ],
          },
          {
            heading: "A bird's-eye view",
            text: [
              "Imagine you are a bird flying high above your home. You look straight down.",
              "You would see the tops of things: roofs, treetops and the tops of cars.",
              "Maps are drawn like this. We call it a bird's-eye view.",
            ],
          },
          {
            heading: "Tops, not sides",
            text: [
              "From the side, a table has legs. From above, you only see the flat top.",
              "So on a map, a table looks like a rectangle. A round rug looks like a circle.",
              "Try it! Look down at a cup. What shape is the top?",
            ],
          },
        ],
        words: [
          { word: "map", meaning: "a picture of a place that shows where things are" },
          { word: "bird's-eye view", meaning: "looking straight down from above" },
          { word: "above", meaning: "higher up, over the top" },
        ],
      },
      practice: {
        intro: "Think like a bird looking down.",
        questions: [
          { type: "choice", q: "From above, what shape is the top of a round plate?", options: ["A square", "A circle", "A triangle"], answer: 1 },
          { type: "choice", q: "A bird flying over a house sees mostly...", options: ["the front door", "the roof", "the windows"], answer: 1 },
          { type: "match", q: "Match each thing to how it looks from above.", pairs: [["Table", "A rectangle"], ["Round rug", "A circle"], ["Tree", "A green blob"]] },
          { type: "pick", q: "Which of these can you see from a bird's-eye view? There is more than one.", options: ["Roofs", "Treetops", "Under the table"], answers: [0, 1] },
        ],
      },
      task: {
        title: "Toy town from above",
        intro: "Make a little town and look at it like a bird.",
        need: ["A few toys, blocks or boxes", "A big sheet of paper", "Crayons"],
        steps: [
          "Put the paper on the floor.",
          "Set out your toys and blocks on the paper.",
          "Stand up and look straight down. You are a bird!",
          "Draw round each toy with a crayon.",
          "Lift the toys off. Now you have a map!",
        ],
      },
      exit: [
        { type: "choice", q: "What is a map?", options: ["A kind of song", "A picture of a place that shows where things are", "A toy"], answer: 1 },
        { type: "choice", q: "A bird's-eye view means looking...", options: ["from the side", "straight down from above", "from underneath"], answer: 1 },
        { type: "choice", q: "On a map, what shape is a table usually?", options: ["A circle", "A rectangle"], answer: 1 },
        { type: "choice", q: "From above, a house looks like...", options: ["its roof", "its front door"], answer: 0 },
        { type: "pick", q: "What can a map help you do? There is more than one.", options: ["Find your way", "Know where things are", "Go to sleep"], answers: [0, 1] },
        { type: "gap", q: "Fill the gap.", text: "Maps show a place from ___.", bank: ["above", "inside", "behind"], answers: ["above"] },
      ],
      grownUp: {
        need: ["A few toys or blocks", "A large sheet of paper", "Crayons"],
        tips: [
          "Standing on a sturdy step (with you holding on) really helps children 'get' the idea of looking down from above.",
          "Point out maps in daily life: a shopping centre board, a park sign or a map app on your phone.",
        ],
        younger: "Draw round just two or three toys and talk about the shapes they leave behind.",
        older: "Add a road and a pond to the toy town map, drawn as they would look from above.",
      },
    },
    {
      slug: "maps-and-directions-2",
      title: "Symbols and keys",
      emoji: "🔑",
      minutes: 30,
      goal: "I can use simple symbols and a key on a map.",
      starter: [
        { type: "choice", q: "What is a map?", options: ["A picture of a place that shows where things are", "A story book", "A game of tag"], answer: 0 },
        { type: "choice", q: "A bird's-eye view means looking...", options: ["from underneath", "straight down from above"], answer: 1 },
        { type: "choice", q: "From above, a round rug looks like...", options: ["a square", "a circle", "a star"], answer: 1 },
        { type: "choice", q: "From above, what do you see on a house?", options: ["The roof", "The doorbell"], answer: 0 },
        { type: "match", q: "Match each thing to how it looks from above.", pairs: [["Plate", "A circle"], ["Bed", "A rectangle"], ["Tree", "A green blob"]] },
        { type: "choice", q: "What can a map help you do?", options: ["Eat lunch", "Find your way", "Sing a song"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Little pictures called symbols",
            text: [
              "Maps are too small to draw everything in full. So map makers use little pictures called symbols.",
              "A symbol is a simple drawing that stands for something. A tiny tree can mean a wood. A blue blob can mean a pond.",
            ],
          },
          {
            heading: "The key tells you what they mean",
            text: [
              "A map has a box called a key. The key shows each symbol and says what it means.",
              "If you see a symbol and don't know it, look in the key. It unlocks the map, just like a real key!",
            ],
          },
          {
            heading: "Symbols all around us",
            text: [
              "You see symbols every day. A picture of a person on a toilet door. A green running man over a fire exit.",
              "Good symbols are simple and easy to draw. Anyone can understand them quickly.",
            ],
          },
        ],
        words: [
          { word: "symbol", meaning: "a little picture that stands for something" },
          { word: "key", meaning: "the box on a map that says what each symbol means" },
          { word: "simple", meaning: "easy, with not much detail" },
        ],
      },
      practice: {
        intro: "Read the symbols like a map maker.",
        questions: [
          { type: "match", q: "Match each symbol to what it could mean on a map.", pairs: [["Little tree", "A wood"], ["Blue blob", "A pond"], ["Swing", "A playground"]] },
          { type: "choice", q: "Where do you look to find out what a symbol means?", options: ["In the key", "Under the bed", "On the back of the map"], answer: 0 },
          { type: "choice", q: "Which is the best symbol for a church?", options: ["A small drawing of a church with a cross", "A drawing of a fish", "A big scribble"], answer: 0 },
          { type: "choice", q: "A good symbol is...", options: ["very tiny and hard to see", "simple and easy to understand", "full of lots of detail"], answer: 1 },
        ],
      },
      task: {
        title: "Make a map key",
        intro: "Draw a map of one room and make a key for it.",
        need: ["Paper", "Crayons or coloured pencils", "A ruler (if you like)"],
        steps: [
          "Pick a room, like your bedroom.",
          "Draw the room as a big box.",
          "Draw the bed, door and window from above.",
          "Make a simple symbol for each one.",
          "Draw a small box in the corner. This is the key.",
          "Put each symbol in the key with its name next to it. A grown-up can help with the words.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a symbol?", options: ["A very big map", "A kind of pencil", "A little picture that stands for something"], answer: 2 },
        { type: "choice", q: "What does the key on a map tell you?", options: ["How to open a door", "What each symbol means", "What time it is"], answer: 1 },
        { type: "choice", q: "On a map, a blue blob is most likely...", options: ["a pond", "a car", "a house"], answer: 0 },
        { type: "choice", q: "A little tree symbol could mean...", options: ["a school", "a wood", "a shop"], answer: 1 },
        { type: "pick", q: "Which make good symbols? There is more than one.", options: ["Simple", "Easy to understand", "Messy and hard to see"], answers: [0, 1] },
        { type: "gap", q: "Fill the gap.", text: "The ___ shows what the symbols mean.", bank: ["key", "door", "roof"], answers: ["key"] },
      ],
      grownUp: {
        need: ["Paper", "Crayons or coloured pencils"],
        tips: [
          "Children love inventing symbols. Let them choose their own, as long as they put them in the key.",
          "If you have a local map or a park leaflet, look at its key together.",
        ],
        younger: "Use only three symbols: bed, door and window. You can write the words in the key for them.",
        older: "Add colour to the key, such as blue for water and green for grass, and draw a map of the garden or a park too.",
      },
    },
    {
      slug: "maps-and-directions-3",
      title: "Near, far, left and right",
      emoji: "👈",
      minutes: 30,
      goal: "I can use words like near, far, left, right, behind and next to.",
      starter: [
        { type: "choice", q: "What is a symbol?", options: ["A little picture that stands for something", "A kind of road", "A big building"], answer: 0 },
        { type: "choice", q: "Where do you find out what a symbol means?", options: ["In the key", "In the fridge"], answer: 0 },
        { type: "match", q: "Match each symbol to what it could mean.", pairs: [["Blue blob", "A pond"], ["Little tree", "A wood"], ["Swing", "A playground"]] },
        { type: "choice", q: "Maps show places from...", options: ["underneath", "above", "inside a box"], answer: 1 },
        { type: "choice", q: "A good symbol is...", options: ["simple", "very messy"], answer: 0 },
        { type: "choice", q: "On a map, what shape is a table usually?", options: ["A star", "A heart", "A rectangle"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Where is it?",
            text: [
              "We use special words to say where things are. These are called position words.",
              "Near means close by. Far means a long way away.",
              "Next to means right beside. The cup is next to the plate.",
            ],
          },
          {
            heading: "In front of and behind",
            text: [
              "In front of means before something, where you can see it. Behind means at the back.",
              "Stand behind a chair. Now stand in front of it. Can you feel the difference?",
            ],
          },
          {
            heading: "Left and right",
            text: [
              "Hold up both hands with the backs of your hands facing you. Point one finger up and stick your thumb out to the side. Your left hand makes the letter L.",
              "Left and right can be tricky. Even grown-ups mix them up sometimes!",
              "Practise a lot: wave your right hand, stamp your left foot.",
            ],
          },
        ],
        words: [
          { word: "near", meaning: "close by" },
          { word: "far", meaning: "a long way away" },
          { word: "behind", meaning: "at the back of something" },
          { word: "next to", meaning: "right beside" },
        ],
      },
      practice: {
        intro: "Use your position words.",
        questions: [
          { type: "match", q: "Match each word to its opposite.", pairs: [["Near", "Far"], ["Left", "Right"], ["In front of", "Behind"]] },
          { type: "choice", q: "The cat is right beside the dog. The cat is...", options: ["far from the dog", "next to the dog", "behind the moon"], answer: 1 },
          { type: "choice", q: "Your home is only a few steps from the shop. It is...", options: ["near the shop", "far from the shop"], answer: 0 },
          { type: "choice", q: "Which hand makes an L shape when you hold it up, thumb out?", options: ["Right hand", "Left hand"], answer: 1 },
        ],
      },
      task: {
        title: "Teddy hide and seek",
        intro: "Hide a teddy and use position words to find it.",
        need: ["A teddy or small toy", "A chair, a box and a cushion"],
        steps: [
          "Put the chair, box and cushion on the floor.",
          "A grown-up hides teddy while you close your eyes.",
          "Find teddy. Then say where it was: behind, in front of, next to or under.",
          "Swap! You hide teddy and give clues.",
          "Play Simon Says: wave your left hand, hop on your right foot.",
        ],
      },
      exit: [
        { type: "choice", q: "What does near mean?", options: ["A long way away", "Close by"], answer: 1 },
        { type: "choice", q: "What is the opposite of in front of?", options: ["Behind", "Next to", "Far"], answer: 0 },
        { type: "choice", q: "The sun is a very long way from us. The sun is...", options: ["near", "far"], answer: 1 },
        { type: "match", q: "Match each word to its opposite.", pairs: [["Left", "Right"], ["Near", "Far"], ["Behind", "In front of"]] },
        { type: "choice", q: "The spoon is right beside the bowl. The spoon is...", options: ["behind the bowl", "far from the bowl", "next to the bowl"], answer: 2 },
        { type: "pick", q: "Which are position words? There is more than one.", options: ["Behind", "Happy", "Next to", "Left"], answers: [0, 2, 3] },
      ],
      grownUp: {
        need: ["A teddy or small toy", "A few household objects to hide it behind"],
        tips: [
          "Left and right take years to settle. Lots of short, playful practice beats one long session.",
          "A sticker or ribbon on the right wrist can help as a reminder.",
        ],
        younger: "Focus on in front of, behind, next to and under first. Leave left and right for later.",
        older: "Give two-step clues, such as 'Teddy is behind something that is next to the sofa.'",
      },
    },
    {
      slug: "maps-and-directions-4",
      title: "Following directions",
      emoji: "🚶",
      minutes: 30,
      goal: "I can follow directions and give simple directions to someone else.",
      starter: [
        { type: "choice", q: "What does far mean?", options: ["Close by", "A long way away"], answer: 1 },
        { type: "choice", q: "What is the opposite of left?", options: ["Right", "Up", "Behind"], answer: 0 },
        { type: "match", q: "Match each word to its opposite.", pairs: [["Near", "Far"], ["In front of", "Behind"], ["Left", "Right"]] },
        { type: "choice", q: "The cup is right beside the plate. The cup is...", options: ["far from the plate", "next to the plate"], answer: 1 },
        { type: "pick", q: "Which are position words? There is more than one.", options: ["Near", "Jump", "Behind"], answers: [0, 2] },
        { type: "choice", q: "Which hand makes an L shape when you hold it up, thumb out?", options: ["Right hand", "Left hand"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What are directions?",
            text: [
              "Directions tell someone how to get from one place to another.",
              "They are like little steps. Do one, then the next, then the next.",
            ],
          },
          {
            heading: "Direction words",
            text: [
              "Forwards means go the way you are facing. Backwards means go the other way.",
              "Turn left and turn right mean change the way you are facing.",
              "Stop means stand still!",
            ],
          },
          {
            heading: "Giving good directions",
            text: [
              "Good directions are clear and in the right order. Say how many steps, too.",
              "For example: walk 3 steps forwards. Turn right. Walk 2 steps. Stop at the door.",
              "You can use things you pass, like 'go past the sofa'.",
            ],
          },
        ],
        words: [
          { word: "directions", meaning: "steps that tell you how to get somewhere" },
          { word: "forwards", meaning: "the way you are facing" },
          { word: "turn", meaning: "change the way you are facing" },
        ],
      },
      practice: {
        intro: "Be a direction detective.",
        questions: [
          { type: "choice", q: "What do directions tell you?", options: ["What to eat", "How to get somewhere", "What time it is"], answer: 1 },
          { type: "order", q: "Put these directions to the door in order.", items: ["Stand up", "Walk forwards 3 steps", "Turn left", "Stop at the door"] },
          { type: "choice", q: "Which direction is clearer?", options: ["Go over there", "Walk 4 steps forwards to the sofa"], answer: 1 },
          { type: "choice", q: "Forwards means...", options: ["the way you are facing", "the way behind you"], answer: 0 },
        ],
      },
      task: {
        title: "Be a robot",
        intro: "One person is the robot. The other gives directions.",
        need: ["A small toy to be the prize", "Some space to walk"],
        steps: [
          "Put the toy somewhere in the room.",
          "The grown-up is the robot first. The robot can only do what you say.",
          "Give directions: steps forwards, turn left, turn right, stop.",
          "Did the robot reach the toy? If not, try again.",
          "Swap! Now you are the robot. Listen carefully.",
        ],
      },
      exit: [
        { type: "choice", q: "What are directions?", options: ["A kind of map symbol", "A song", "Steps that tell you how to get somewhere"], answer: 2 },
        { type: "choice", q: "Forwards means go...", options: ["the way you are facing", "up into the sky"], answer: 0 },
        { type: "choice", q: "Which is the best direction?", options: ["Go somewhere", "Walk 2 steps forwards, then turn right", "Just walk"], answer: 1 },
        { type: "choice", q: "What does stop mean?", options: ["Run fast", "Stand still", "Turn round"], answer: 1 },
        { type: "order", q: "Put these directions to the bed in order.", items: ["Walk forwards to the door", "Turn right", "Walk 2 steps", "Stop at the bed"] },
        { type: "pick", q: "Which help make good directions? There is more than one.", options: ["Saying how many steps", "Saying them in the right order", "Mumbling"], answers: [0, 1] },
      ],
      grownUp: {
        need: ["A small toy", "Clear floor space"],
        tips: [
          "Be a very literal robot. If they forget 'stop', keep going into the wall (gently). It makes the point and gets lots of giggles.",
          "Clear trip hazards from the floor before you start.",
        ],
        younger: "Use only forwards and stop, and count steps out loud together.",
        older: "Draw arrows on paper to plan the route first, then give the directions without looking.",
      },
    },
    {
      slug: "maps-and-directions-5",
      title: "North, East, South, West",
      emoji: "🧭",
      minutes: 30,
      goal: "I can name the four compass points in order.",
      starter: [
        { type: "choice", q: "What are directions?", options: ["Steps that tell you how to get somewhere", "A kind of food"], answer: 0 },
        { type: "choice", q: "Forwards means...", options: ["the way you are facing", "the way behind you", "upside down"], answer: 0 },
        { type: "choice", q: "What does turn mean?", options: ["Stand still", "Change the way you are facing"], answer: 1 },
        { type: "order", q: "Put these directions in order.", items: ["Stand up", "Walk forwards", "Turn left", "Stop"] },
        { type: "choice", q: "Which direction is clearer?", options: ["Go that way", "Walk 3 steps forwards to the table"], answer: 1 },
        { type: "match", q: "Match each word to its opposite.", pairs: [["Forwards", "Backwards"], ["Left", "Right"], ["Go", "Stop"]] },
      ],
      learn: {
        cards: [
          {
            heading: "The four compass points",
            text: [
              "There are four main directions. They are North, East, South and West.",
              "They are called the compass points. They stay the same wherever you are standing.",
            ],
          },
          {
            heading: "Never Eat Shredded Wheat",
            text: [
              "North is at the top. Then go round like the hands of a clock: East, South, West.",
              "Here is a trick to remember: Never Eat Shredded Wheat. N for North, E for East, S for South, W for West.",
            ],
          },
          {
            heading: "A compass",
            text: [
              "A compass is a tool with a needle that points North.",
              "Sailors, walkers and explorers use a compass so they don't get lost.",
              "On most maps, North is at the top.",
            ],
          },
        ],
        words: [
          { word: "North", meaning: "the direction at the top of most maps" },
          { word: "compass", meaning: "a tool with a needle that points North" },
          { word: "compass points", meaning: "North, East, South and West" },
        ],
      },
      practice: {
        intro: "Go round the compass.",
        questions: [
          { type: "order", q: "Put the compass points in order, starting at North.", items: ["North", "East", "South", "West"] },
          { type: "choice", q: "On most maps, which way is at the top?", options: ["South", "North", "West"], answer: 1 },
          { type: "choice", q: "In 'Never Eat Shredded Wheat', what does the W stand for?", options: ["West", "Wind", "Water"], answer: 0 },
          { type: "type", q: "Which compass point is opposite North?", answer: ["South", "south"] },
        ],
      },
      task: {
        title: "Compass in the kitchen",
        intro: "Make a giant compass on the floor and jump to each point.",
        need: ["4 sheets of paper", "A crayon", "A compass or a compass app (if you have one)"],
        steps: [
          "Write N, E, S and W on the four sheets. A grown-up can help.",
          "A grown-up finds North with a compass or phone.",
          "Put N on the floor that way. Then go round: E, S, W.",
          "Stand in the middle. A grown-up calls out a point and you jump to it!",
          "Say 'Never Eat Shredded Wheat' as you go round.",
        ],
      },
      exit: [
        { type: "pick", q: "Which are compass points? There is more than one.", options: ["North", "Up", "South", "West"], answers: [0, 2, 3] },
        { type: "order", q: "Put the compass points in order, starting at North.", items: ["North", "East", "South", "West"] },
        { type: "choice", q: "What does a compass needle point to?", options: ["North", "South", "Your house"], answer: 0 },
        { type: "choice", q: "What helps you remember the compass points?", options: ["Twinkle Twinkle Little Star", "Never Eat Shredded Wheat"], answer: 1 },
        { type: "choice", q: "Which compass point is opposite East?", options: ["North", "West", "South"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "On most maps, ___ is at the top.", bank: ["North", "South", "West"], answers: ["North"] },
      ],
      grownUp: {
        need: ["4 sheets of paper", "A compass or a free compass app on a phone"],
        tips: [
          "If you don't have a compass, use a phone's compass app, or just pick a wall to be North for the game.",
          "East and West are easy to swap. Saying the rhyme while pointing round clockwise helps.",
        ],
        younger: "Just learn North and South first, and chant the rhyme together.",
        older: "Put a toy on each compass point and ask, 'What is to the West of you?' Then add a fifth toy in the middle.",
      },
    },
    {
      slug: "maps-and-directions-6",
      title: "Treasure maps and story maps",
      emoji: "🏴‍☠️",
      minutes: 30,
      goal: "I can make and follow a treasure map, and draw a map for a story.",
      starter: [
        { type: "choice", q: "On most maps, which way is at the top?", options: ["North", "South"], answer: 0 },
        { type: "order", q: "Put the compass points in order, starting at North.", items: ["North", "East", "South", "West"] },
        { type: "choice", q: "What does a compass needle point to?", options: ["South", "The sun", "North"], answer: 2 },
        { type: "choice", q: "In 'Never Eat Shredded Wheat', what does the E stand for?", options: ["East", "Egg"], answer: 0 },
        { type: "choice", q: "Which compass point is opposite North?", options: ["East", "South", "West"], answer: 1 },
        { type: "pick", q: "Which are compass points? There is more than one.", options: ["East", "Left", "West"], answers: [0, 2] },
      ],
      learn: {
        cards: [
          {
            heading: "Treasure maps",
            text: [
              "A treasure map shows where something is hidden. A big X marks the spot!",
              "It has symbols, like a tree or a rock, so you know where to go.",
            ],
          },
          {
            heading: "Following a treasure map",
            text: [
              "First, find where you are on the map. Then look for the X.",
              "Use the symbols and directions to get there, step by step.",
              "Near the X? Look behind, under and next to things!",
            ],
          },
          {
            heading: "Story maps",
            text: [
              "Some stories have a journey in them. You can draw a map of it.",
              "In Little Red Riding Hood, she walks from her home, through the woods, to Grandma's cottage.",
              "Draw each place and a path joining them. Now you can tell the story with your map!",
            ],
          },
        ],
        words: [
          { word: "treasure map", meaning: "a map that shows where something is hidden" },
          { word: "route", meaning: "the way you go to get somewhere" },
          { word: "journey", meaning: "going from one place to another" },
        ],
      },
      practice: {
        intro: "Get ready to hunt for treasure.",
        questions: [
          { type: "choice", q: "On a treasure map, what marks the spot?", options: ["A circle", "An X", "A heart"], answer: 1 },
          { type: "choice", q: "What should you find first on a map?", options: ["Where you are", "The edge of the paper"], answer: 0 },
          { type: "order", q: "Put Little Red Riding Hood's journey in order.", items: ["Her home", "The woods", "Grandma's cottage"] },
          { type: "pick", q: "What could you put on a treasure map? There is more than one.", options: ["An X", "Symbols", "A key", "A sandwich"], answers: [0, 1, 2] },
        ],
      },
      task: {
        title: "Treasure hunt at home",
        intro: "Hide some treasure and make a map so someone can find it.",
        need: ["Paper and crayons", "A small treasure, like a coin or a sweet", "A grown-up to play with"],
        steps: [
          "Pick a room or the garden. A grown-up comes too if you go outside.",
          "Draw a map of it from above, with simple symbols.",
          "Hide the treasure. Draw a big X on the map where it is.",
          "Give the map to your grown-up. Can they find the treasure?",
          "Swap and let them make a map for you.",
          "Bonus: draw a story map for your favourite fairy tale.",
        ],
      },
      exit: [
        { type: "choice", q: "What does a treasure map show?", options: ["Where something is hidden", "What to have for tea"], answer: 0 },
        { type: "choice", q: "On a treasure map, the treasure is usually marked with...", options: ["a star", "a smiley face", "an X"], answer: 2 },
        { type: "choice", q: "What is a route?", options: ["A kind of treasure", "The way you go to get somewhere"], answer: 1 },
        { type: "order", q: "Put the steps for following a treasure map in order.", items: ["Find where you are", "Find the X", "Walk there", "Dig up the treasure"] },
        { type: "choice", q: "A story map shows...", options: ["the journey in a story", "the colours in a story", "how long a story is"], answer: 0 },
        { type: "order", q: "Put Little Red Riding Hood's journey in order.", items: ["Her home", "The woods", "Grandma's cottage"] },
      ],
      grownUp: {
        need: ["Paper and crayons", "A small treasure to hide"],
        tips: [
          "Keep the first hunt in one room so the map is easy to read. Go outside together only, and stay with your child.",
          "Small sweets or coins are a choking risk for very young siblings, so pick the treasure with them in mind.",
          "Any story with a journey works for the story map: The Gingerbread Man, Goldilocks, We're Going on a Bear Hunt.",
        ],
        younger: "You draw the map together and the child just adds the X and finds the treasure.",
        older: "Add compass points to the treasure map and write clues such as 'Walk North to the tree'.",
      },
    },
  ],
};
