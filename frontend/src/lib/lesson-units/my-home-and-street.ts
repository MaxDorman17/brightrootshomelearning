import type { LessonUnit } from "@/lib/lessons";

/** My home and my street, for ages 5 to 7. A first look at homes, streets, features and maps, read aloud with a grown-up. */
export const myHomeAndStreet: LessonUnit = {
  slug: "my-home-and-street",
  title: "My home and my street",
  short: "My street",
  subject: "Geography",
  ages: "5 to 7",
  emoji: "🏡",
  color: "#7FA38A",
  summary: "Six lessons: my address, all kinds of homes, what is in my street, things people made and nature made, a bird's-eye view map, and a safe walk to spot features.",
  cover: "/lessons/units/my-home-and-street.jpg",
  lessons: [
    {
      slug: "my-home-and-street-1",
      title: "Where I live",
      emoji: "🏠",
      minutes: 30,
      goal: "I can say my address and know who it is safe to tell.",
      starter: [
        { type: "choice", q: "What is a home?", options: ["A place where people live", "A place where cars are washed", "A kind of fruit"], answer: 0 },
        { type: "choice", q: "Do all homes look the same?", options: ["Yes", "No"], answer: 1 },
        {
          type: "pick",
          q: "Which of these can you find in a home? There is more than one.",
          options: ["A bed", "A cloud", "A door", "A kitchen"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Who helps you cross the road?", options: ["Nobody", "A grown-up"], answer: 1 },
        { type: "match", q: "Match each room to what you do there.", pairs: [["Bedroom", "Sleep"], ["Kitchen", "Cook"], ["Bathroom", "Wash"]] },
        { type: "choice", q: "What does a postie bring to your home?", options: ["Rain", "Post", "Snow"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "My home has an address",
            text: [
              "Every home has an address. An address tells people where your home is.",
              "It helps the post, friends and family find you.",
            ],
          },
          {
            heading: "The parts of an address",
            text: [
              "An address has a house number or name. Then comes the street name, and the name of the town or village.",
              "At the end is a postcode. A postcode is a mix of letters and numbers.",
              "Can you say the first part of your address with your grown-up?",
            ],
          },
          {
            heading: "Who can I tell?",
            text: [
              "Your address is special. Only tell it to grown-ups you trust, like your family or teacher.",
              "If you are ever lost, tell a police officer or a person working in a shop.",
              "Never type your address online without asking a grown-up first.",
            ],
          },
        ],
        words: [
          { word: "address", meaning: "the words that say where your home is" },
          { word: "street", meaning: "a road with homes or shops on it" },
          { word: "postcode", meaning: "letters and numbers at the end of an address" },
        ],
      },
      practice: {
        intro: "Let's look at addresses.",
        questions: [
          { type: "choice", q: "What does an address tell people?", options: ["What you had for tea", "Where your home is", "How old you are"], answer: 1 },
          { type: "order", q: "Put the parts of an address in order.", items: ["House number", "Street name", "Town", "Postcode"] },
          {
            type: "pick",
            q: "Who is it OK to tell your address to? There is more than one.",
            options: ["Your family", "Someone you meet online", "Your teacher"],
            answers: [0, 2],
          },
          { type: "choice", q: "A postcode is made of...", options: ["letters and numbers", "colours", "animals"], answer: 0 },
        ],
      },
      task: {
        title: "My address card",
        intro: "Make a card that shows where you live.",
        need: ["A piece of card or paper", "Pencils and crayons", "A grown-up to help write"],
        steps: [
          "Draw a picture of your home on the card.",
          "Ask your grown-up to help you write your house number and street.",
          "Add your town and postcode with help.",
          "Say your address out loud three times.",
          "Keep the card safe at home. Do not take it out to show people.",
        ],
      },
      exit: [
        { type: "choice", q: "What tells people where your home is?", options: ["A clock", "An address"], answer: 1 },
        { type: "choice", q: "What comes at the end of an address?", options: ["The postcode", "The house number", "Your name"], answer: 0 },
        { type: "choice", q: "Should you type your address online on your own?", options: ["Yes", "No, ask a grown-up first"], answer: 1 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Address", "Where your home is"], ["Street", "A road with homes on it"], ["Postcode", "Letters and numbers"]] },
        { type: "choice", q: "If you are lost, who can you tell?", options: ["A stranger in a car", "A police officer or shop worker"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "An address helps the ___ find my home.", bank: ["post", "moon"], answers: ["post"] },
      ],
      grownUp: {
        need: ["Card or paper and crayons", "Your address written down for you to copy from"],
        tips: [
          "Learning an address is easier as a little song or chant. Try tapping a beat as you say it.",
          "Talk about safe people to tell in a calm, matter-of-fact way. There's no need to make it scary.",
          "You may want to point to your address on a letter or parcel so they see it is real.",
        ],
        younger: "Learn just the house number and street name. Spot your house number on your front door.",
        older: "Learn the whole address including the postcode, and write it on an envelope to post a card to a relative.",
      },
    },
    {
      slug: "my-home-and-street-2",
      title: "All kinds of homes",
      emoji: "🏘️",
      minutes: 30,
      goal: "I can name different kinds of homes.",
      starter: [
        { type: "choice", q: "What tells people where your home is?", options: ["An address", "A shoe"], answer: 0 },
        { type: "choice", q: "What is at the end of an address?", options: ["A song", "A postcode", "A picture"], answer: 1 },
        { type: "order", q: "Put the parts of an address in order.", items: ["House number", "Street name", "Town"] },
        { type: "choice", q: "Who is it safe to tell your address to?", options: ["Someone online", "A grown-up you trust"], answer: 1 },
        { type: "type", q: "What is the road outside a home called? It starts with s.", answer: ["street", "a street"] },
        { type: "choice", q: "A postcode is made of letters and...", options: ["numbers", "flowers", "stickers"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Houses and bungalows",
            text: [
              "Some people live in a house. Most houses have stairs and an upstairs.",
              "A bungalow is a home with all its rooms on one floor. There are no stairs.",
            ],
          },
          {
            heading: "Flats",
            text: [
              "A flat is a home inside a bigger building. Lots of families live in the same building.",
              "Some flats are high up. You might take a lift or the stairs to get home.",
            ],
          },
          {
            heading: "Farmhouses and houseboats",
            text: [
              "A farmhouse is a home on a farm. It may have fields and animals all around it.",
              "A houseboat is a boat that people live on. It floats on a river or canal.",
              "Every home is different. What matters is that it keeps us safe and warm.",
            ],
          },
        ],
        words: [
          { word: "bungalow", meaning: "a home with all its rooms on one floor" },
          { word: "flat", meaning: "a home inside a bigger building" },
          { word: "houseboat", meaning: "a boat that people live on" },
          { word: "farmhouse", meaning: "a home on a farm" },
        ],
      },
      practice: {
        intro: "Which home is which?",
        questions: [
          { type: "match", q: "Match each home to a clue.", pairs: [["Bungalow", "No stairs"], ["Houseboat", "Floats on water"], ["Farmhouse", "Fields all around"]] },
          { type: "choice", q: "Lots of families live in one big building. What are their homes called?", options: ["Bungalows", "Flats", "Houseboats"], answer: 1 },
          {
            type: "pick",
            q: "Which of these are kinds of homes? There is more than one.",
            options: ["Flat", "Spoon", "House", "Bungalow"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "Where does a houseboat float?", options: ["On a field", "On a river or canal"], answer: 1 },
        ],
      },
      task: {
        title: "A street of homes",
        intro: "Make a row of different homes.",
        need: ["Paper or old cereal boxes", "Crayons or felt pens", "Child-safe scissors and glue", "A grown-up to help with cutting"],
        steps: [
          "Pick three kinds of home: maybe a house, a bungalow and a flat.",
          "Draw each one on paper or card.",
          "Ask your grown-up to help you cut them out.",
          "Stick them in a row to make a street.",
          "Tell your grown-up the name of each home.",
        ],
      },
      exit: [
        { type: "choice", q: "A home with all its rooms on one floor is a...", options: ["houseboat", "bungalow", "flat"], answer: 1 },
        { type: "choice", q: "A flat is a home inside a...", options: ["bigger building", "tree"], answer: 0 },
        { type: "choice", q: "Where is a farmhouse?", options: ["On a boat", "On a farm", "In a shop"], answer: 1 },
        { type: "match", q: "Match each home to a clue.", pairs: [["House", "Has an upstairs"], ["Flat", "In a big building"], ["Houseboat", "On a canal"]] },
        { type: "choice", q: "Do all homes look the same?", options: ["Yes", "No"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "A houseboat is a ___ that people live on.", bank: ["boat", "car", "bus"], answers: ["boat"] },
      ],
      grownUp: {
        need: ["Paper or card, crayons, child-safe scissors and glue"],
        tips: [
          "Look at photos of homes together online or in books, or spot different homes from the car or bus.",
          "Make sure your child's own kind of home is talked about warmly. Some children move a lot or share homes; every kind of home is fine.",
        ],
        younger: "Draw just one home, your own, and talk about its door, windows and roof.",
        older: "Add terraced, semi-detached and detached houses. Terraced houses are joined in a row, semi-detached are joined in pairs, detached stand on their own.",
      },
    },
    {
      slug: "my-home-and-street-3",
      title: "What is in my street?",
      emoji: "🏪",
      minutes: 30,
      goal: "I can name things I might find in my street and nearby.",
      starter: [
        { type: "choice", q: "A home with no stairs and all rooms on one floor is a...", options: ["flat", "bungalow"], answer: 1 },
        { type: "choice", q: "A boat that people live on is a...", options: ["houseboat", "farmhouse", "bus"], answer: 0 },
        { type: "match", q: "Match each home to a clue.", pairs: [["Flat", "In a big building"], ["Farmhouse", "On a farm"], ["House", "Has an upstairs"]] },
        {
          type: "pick",
          q: "Which are kinds of homes? There is more than one.",
          options: ["Bungalow", "Banana", "Flat"],
          answers: [0, 2],
        },
        { type: "choice", q: "Where does a houseboat float?", options: ["On a canal", "On a hill", "In a park"], answer: 0 },
        { type: "choice", q: "Do all homes look the same?", options: ["Yes", "No"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "My neighbourhood",
            text: [
              "Your neighbourhood is the area all around your home.",
              "It has the streets, places and people near where you live.",
            ],
          },
          {
            heading: "Places we go",
            text: [
              "A neighbourhood might have shops where we buy food. It might have a park to play in and a school to learn in.",
              "Some places are big, like a supermarket. Some are small, like a corner shop.",
            ],
          },
          {
            heading: "Things in the street",
            text: [
              "Look for a red post box. We post letters in it.",
              "Look for a bus stop. People wait there to catch a bus.",
              "You might see street lights, benches and bins too. What is in your street?",
            ],
          },
        ],
        words: [
          { word: "neighbourhood", meaning: "the area all around your home" },
          { word: "post box", meaning: "a red box where we post letters" },
          { word: "bus stop", meaning: "where people wait for a bus" },
        ],
      },
      practice: {
        intro: "Where would you go?",
        questions: [
          { type: "match", q: "Match each place to what you do there.", pairs: [["Park", "Play"], ["Shop", "Buy food"], ["School", "Learn"]] },
          { type: "choice", q: "Where do you post a letter?", options: ["In a bin", "In a post box", "At a bus stop"], answer: 1 },
          { type: "choice", q: "Where do people wait for a bus?", options: ["At a bus stop", "In a park"], answer: 0 },
          {
            type: "pick",
            q: "Which things might you see in a street? There is more than one.",
            options: ["A street light", "A whale", "A bench", "A bin"],
            answers: [0, 2, 3],
          },
        ],
      },
      task: {
        title: "Play shops and streets",
        intro: "Make a pretend street on the floor.",
        need: ["Toy cars, blocks or boxes", "Paper and crayons", "A space on the floor"],
        steps: [
          "Use blocks or boxes to make a shop, a school and a home.",
          "Draw a red post box and a bus stop on paper. Stand them up.",
          "Make a park with a green cloth or paper.",
          "Drive a toy car along your street.",
          "Tell your grown-up what is in your street.",
        ],
      },
      exit: [
        { type: "choice", q: "What is your neighbourhood?", options: ["The area around your home", "The inside of your fridge"], answer: 0 },
        { type: "choice", q: "What colour are most post boxes in the UK?", options: ["Blue", "Red", "Purple"], answer: 1 },
        { type: "choice", q: "Where do you go to play on swings?", options: ["A bus stop", "A post box", "A park"], answer: 2 },
        { type: "match", q: "Match each thing to what it is for.", pairs: [["Post box", "Letters"], ["Bus stop", "Waiting for a bus"], ["Shop", "Buying food"]] },
        {
          type: "pick",
          q: "Which might be in a neighbourhood? There is more than one.",
          options: ["A school", "A shop", "A volcano"],
          answers: [0, 1],
        },
        { type: "gap", q: "Fill the gap.", text: "We buy food at the ___.", bank: ["shop", "post box"], answers: ["shop"] },
      ],
      grownUp: {
        need: ["Toy cars, blocks or boxes, paper and crayons"],
        tips: [
          "Every area is different. Talk about what is near you, whether it's a village green, a city block or a farm track.",
          "If you have a letter to post this week, let your child pop it in the post box.",
        ],
        younger: "Just name three places: home, shop and park.",
        older: "Make a list of places in your neighbourhood and tick off the ones you have visited this month.",
      },
    },
    {
      slug: "my-home-and-street-4",
      title: "Made by people, made by nature",
      emoji: "🌳",
      minutes: 30,
      goal: "I can sort things into made by people and made by nature.",
      starter: [
        { type: "choice", q: "What is the area around your home called?", options: ["Neighbourhood", "Kitchen"], answer: 0 },
        { type: "choice", q: "Where do we post letters?", options: ["A bus stop", "A post box"], answer: 1 },
        { type: "match", q: "Match each place to what you do there.", pairs: [["Park", "Play"], ["School", "Learn"], ["Shop", "Buy food"]] },
        { type: "choice", q: "Where do people wait for a bus?", options: ["In a shop", "At a school", "At a bus stop"], answer: 2 },
        {
          type: "pick",
          q: "Which might you see in a street? There is more than one.",
          options: ["A bench", "A street light", "A dinosaur"],
          answers: [0, 1],
        },
        { type: "choice", q: "What colour are most post boxes in the UK?", options: ["Red", "Green", "Yellow"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Made by people",
            text: [
              "Some things around us were made by people. Houses, roads, shops and bridges were all built by people.",
              "Geographers call these human features.",
            ],
          },
          {
            heading: "Made by nature",
            text: [
              "Some things were made by nature. Hills, rivers, the sea, rocks and the sky were not built by people.",
              "Geographers call these physical features.",
            ],
          },
          {
            heading: "Look around",
            text: [
              "Look out of a window. Can you see something people made? Can you see something nature made?",
              "Most places have both. A town has roads and houses. It may also have a river and a hill.",
            ],
          },
        ],
        words: [
          { word: "human feature", meaning: "something made by people, like a road" },
          { word: "physical feature", meaning: "something made by nature, like a hill" },
          { word: "geographer", meaning: "someone who learns about places" },
        ],
      },
      practice: {
        intro: "People or nature?",
        questions: [
          { type: "choice", q: "Who made a road?", options: ["Nature", "People"], answer: 1 },
          { type: "choice", q: "Who made a river?", options: ["Nature", "People"], answer: 0 },
          {
            type: "pick",
            q: "Which were made by nature? There is more than one.",
            options: ["A hill", "A school", "The sea", "A rock"],
            answers: [0, 2, 3],
          },
          {
            type: "pick",
            q: "Which were made by people? There is more than one.",
            options: ["A bridge", "A shop", "A river"],
            answers: [0, 1],
          },
        ],
      },
      task: {
        title: "Sorting hoops",
        intro: "Sort pictures into people-made and nature-made.",
        need: ["Two hoops, scarves or strings to make two circles", "Paper and crayons", "Old magazines (optional)"],
        steps: [
          "Make two circles on the floor.",
          "Put a drawing of a person in one circle. Put a drawing of a leaf in the other.",
          "Draw small pictures: a house, a road, a hill, a river, a car and the sea.",
          "Put each picture in the right circle.",
          "Tell your grown-up why you put each one there.",
        ],
      },
      exit: [
        { type: "choice", q: "A house was made by...", options: ["nature", "people"], answer: 1 },
        { type: "choice", q: "The sea was made by...", options: ["nature", "people"], answer: 0 },
        { type: "choice", q: "A thing made by people is a...", options: ["human feature", "physical feature"], answer: 0 },
        { type: "choice", q: "A thing made by nature is a...", options: ["human feature", "physical feature"], answer: 1 },
        { type: "match", q: "Match each word to an example.", pairs: [["Made by people", "A bridge"], ["Made by nature", "A hill"], ["Human feature", "A shop"]] },
        { type: "gap", q: "Fill the gap.", text: "A river was made by ___.", bank: ["nature", "people"], answers: ["nature"] },
      ],
      grownUp: {
        need: ["Two hoops, scarves or strings, paper and crayons"],
        tips: [
          "Some things are tricky, like a tree planted in a park. A good answer: nature grew the tree, but people chose where to plant it.",
          "Use the words human and physical, but people-made and nature-made are fine for now.",
        ],
        younger: "Just sort toys or objects into 'people made it' and 'nature made it', like a pine cone and a toy car.",
        older: "Look out of three different windows and list two human and two physical features from each.",
      },
    },
    {
      slug: "my-home-and-street-5",
      title: "A bird's-eye view",
      emoji: "🐦",
      minutes: 30,
      goal: "I can draw a simple map of my bedroom from above.",
      starter: [
        { type: "choice", q: "A road was made by...", options: ["people", "nature"], answer: 0 },
        { type: "choice", q: "A hill was made by...", options: ["people", "nature"], answer: 1 },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Human feature", "Made by people"], ["Physical feature", "Made by nature"], ["Geographer", "Learns about places"]] },
        {
          type: "pick",
          q: "Which were made by nature? There is more than one.",
          options: ["A river", "A bridge", "A rock"],
          answers: [0, 2],
        },
        { type: "choice", q: "Is a shop a human feature or a physical feature?", options: ["Physical feature", "Human feature"], answer: 1 },
        { type: "choice", q: "Can a town have people-made and nature-made things?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Like a bird in the sky",
            text: [
              "Imagine you are a bird flying high. You look down at the ground.",
              "You see the tops of houses, trees and cars. This is called a bird's-eye view.",
            ],
          },
          {
            heading: "Things look different from above",
            text: [
              "From the side, a table has legs. From above, you only see the flat top.",
              "From above, a round plate looks like a circle. A book looks like a rectangle.",
            ],
          },
          {
            heading: "A map is a picture from above",
            text: [
              "A map shows a place from a bird's-eye view. It shows where things are.",
              "You can make a map of your bedroom. Draw your bed, door and window as simple shapes.",
            ],
          },
        ],
        words: [
          { word: "bird's-eye view", meaning: "looking down from high above" },
          { word: "map", meaning: "a drawing of a place from above" },
          { word: "above", meaning: "higher up, over the top" },
        ],
      },
      practice: {
        intro: "Look from above.",
        questions: [
          { type: "choice", q: "A bird's-eye view is looking...", options: ["down from above", "up from the floor", "inside a box"], answer: 0 },
          { type: "match", q: "Match each thing to its shape from above.", pairs: [["A plate", "Circle"], ["A book", "Rectangle"], ["A square rug", "Square"]] },
          { type: "choice", q: "From above, what do you see of a table?", options: ["Only its legs", "Its flat top"], answer: 1 },
          { type: "choice", q: "A map shows a place from...", options: ["inside", "above", "underneath"], answer: 1 },
        ],
      },
      task: {
        title: "A map of my bedroom",
        intro: "Be a bird and draw your room from above.",
        need: ["Paper and a pencil", "Crayons", "A step or chair to stand on, with a grown-up holding you (optional)"],
        steps: [
          "Look around your bedroom. Where is your bed? Where is the door?",
          "With a grown-up beside you, stand on a low step and look down at a toy on the floor.",
          "Draw a big box on the paper. That is your room.",
          "Draw your bed as a rectangle and your door as a gap in the wall.",
          "Add your window, a rug or a toy box.",
          "Show your map to your grown-up. Can they find your bed?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a bird's-eye view?", options: ["Looking down from above", "Looking at a bird's eye"], answer: 0 },
        { type: "choice", q: "A map is a drawing of a place from...", options: ["the side", "above"], answer: 1 },
        { type: "choice", q: "From above, a round plate looks like a...", options: ["triangle", "square", "circle"], answer: 2 },
        { type: "choice", q: "On a bedroom map, a bed could be drawn as a...", options: ["rectangle", "star"], answer: 0 },
        { type: "order", q: "Put the steps for drawing a room map in order.", items: ["Look around the room", "Draw a box for the room", "Add the bed and door"] },
        { type: "gap", q: "Fill the gap.", text: "A ___ shows where things are.", bank: ["map", "sock"], answers: ["map"] },
      ],
      grownUp: {
        need: ["Paper, pencil and crayons"],
        tips: [
          "Put a few objects (a cup, a book, a plate) on the floor and look down on them together before drawing.",
          "Accuracy doesn't matter. The idea that a map is 'looking down' is the big step.",
          "If your child stands on a step to look down, stay right beside them.",
        ],
        younger: "Draw round the bottom of a cup, a book and a block, then guess which outline is which.",
        older: "Add a simple key: a colour or symbol for the bed, toy box and window. Then hide a toy and mark it with an X for someone to find.",
      },
    },
    {
      slug: "my-home-and-street-6",
      title: "A safe street walk",
      emoji: "🚸",
      minutes: 30,
      goal: "I can spot features on a walk and cross the road safely with a grown-up.",
      starter: [
        { type: "choice", q: "What is a bird's-eye view?", options: ["Looking up at the sky", "Looking down from above"], answer: 1 },
        { type: "choice", q: "A map shows a place from...", options: ["above", "underneath"], answer: 0 },
        { type: "match", q: "Match each thing to its shape from above.", pairs: [["Plate", "Circle"], ["Book", "Rectangle"], ["Square rug", "Square"]] },
        { type: "choice", q: "From above, you see a table's...", options: ["legs", "flat top"], answer: 1 },
        { type: "order", q: "Put the steps for a room map in order.", items: ["Look around the room", "Draw a box for the room", "Add the bed and door"] },
        { type: "type", q: "What is a drawing of a place from above? It starts with m.", answer: ["map", "a map"] },
      ],
      learn: {
        cards: [
          {
            heading: "Going on a feature walk",
            text: [
              "Let's go on a walk with a grown-up. We will be geographers!",
              "Look for things people made, like a post box or a bus stop. Look for things nature made, like a hill or a puddle.",
            ],
          },
          {
            heading: "Safe on the pavement",
            text: [
              "Always walk with a grown-up. Hold their hand near roads.",
              "Walk on the pavement, away from the edge. The edge of the pavement is called the kerb.",
            ],
          },
          {
            heading: "Stop, look, listen, think",
            text: [
              "To cross a road, find a safe place, like a crossing. Stop at the kerb.",
              "Look all around and listen for traffic. When there is nothing coming, walk straight across.",
              "Keep looking and listening as you cross. Never run. This is called the Green Cross Code.",
            ],
          },
        ],
        words: [
          { word: "pavement", meaning: "the path for people at the side of a road" },
          { word: "kerb", meaning: "the edge of the pavement" },
          { word: "traffic", meaning: "cars, buses, bikes and lorries on the road" },
          { word: "crossing", meaning: "a safe place to cross the road" },
        ],
      },
      practice: {
        intro: "Let's practise being safe.",
        questions: [
          { type: "order", q: "Put the road crossing steps in order.", items: ["Stop at the kerb", "Look and listen", "Walk straight across"] },
          { type: "choice", q: "Who should you walk with near roads?", options: ["On your own", "A grown-up"], answer: 1 },
          { type: "choice", q: "Should you run across the road?", options: ["No, walk", "Yes, run fast"], answer: 0 },
          {
            type: "pick",
            q: "Which could you spot on a walk? There is more than one.",
            options: ["A post box", "A tree", "A bus stop", "A shark"],
            answers: [0, 1, 2],
          },
        ],
      },
      task: {
        title: "My feature walk",
        intro: "Go for a short walk with your grown-up and spot features.",
        need: ["A grown-up to walk with you", "A clipboard or book to lean on", "Paper and a pencil", "Clothes for the weather"],
        steps: [
          "Before you go, draw two boxes on your paper. One for people-made, one for nature-made.",
          "Hold your grown-up's hand and walk on the pavement.",
          "Stop when you see something. Draw it or tick it in the right box.",
          "At a road, help your grown-up stop, look and listen before you cross together.",
          "At home, count your ticks. Which box has more?",
        ],
      },
      exit: [
        { type: "choice", q: "Who should you go on a walk with?", options: ["A grown-up", "Nobody"], answer: 0 },
        { type: "choice", q: "What is the edge of the pavement called?", options: ["The kerb", "The roof"], answer: 0 },
        { type: "order", q: "Put the road crossing steps in order.", items: ["Find a safe place", "Stop at the kerb", "Look and listen", "Walk straight across"] },
        { type: "choice", q: "While you cross the road, you should...", options: ["close your eyes", "keep looking and listening", "run"], answer: 1 },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Pavement", "The path for people"], ["Kerb", "The edge of the pavement"], ["Traffic", "Cars, buses and bikes"]] },
        { type: "gap", q: "Fill the gap.", text: "We walk on the ___, not the road.", bank: ["pavement", "roof"], answers: ["pavement"] },
      ],
      grownUp: {
        need: ["Time for a short walk together", "Paper, pencil and something to lean on"],
        tips: [
          "Keep the walk short and close to home. You choose where to cross, and model saying the steps out loud.",
          "At a crossing with a green figure, explain that we still look and listen even when it shows green.",
          "If going outdoors isn't possible today, look out of a window or use a street view on a map app together instead.",
        ],
        younger: "Play 'I spy' on the walk: 'I spy something red' for a post box. Keep holding hands the whole time.",
        older: "Draw a simple map of your walk when you get home, adding the features you spotted in the right order.",
      },
    },
  ],
};
