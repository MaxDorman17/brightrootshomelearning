import type { LessonUnit } from "@/lib/lessons";

/** Kitchen science: materials, for ages 7 to 11. Every experiment uses things most homes already have. */
export const kitchenScience: LessonUnit = {
  slug: "kitchen-science",
  title: "Kitchen science: materials",
  short: "Kitchen science",
  subject: "Science",
  ages: "7 to 11",
  emoji: "🧪",
  color: "#2F7A8C",
  summary: "Six lessons of experiments with things from the kitchen: properties, waterproofing, floating, dissolving, melting and changes you can't undo.",
  lessons: [
    {
      slug: "kitchen-science-1",
      title: "What are things made of?",
      emoji: "🥄",
      minutes: 45,
      goal: "I can name materials and describe their properties, like hard, soft, bendy or see-through.",
      starter: [
        { type: "choice", q: "Which of these is made of glass?", options: ["A window", "A jumper", "A wooden spoon"], answer: 0 },
        { type: "choice", q: "Which word means you can see through something?", options: ["Bendy", "Transparent", "Heavy"], answer: 1 },
        { type: "choice", q: "What is a scientist?", options: ["Someone who finds things out by testing and looking closely", "Someone who sells things", "Someone who writes stories"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Objects and materials",
            text: [
              "An object is a thing, like a spoon, a cup or a jumper.",
              "A material is what the object is made of, like metal, plastic, wood, glass, fabric or paper.",
              "The same object can be made of different materials. A spoon can be metal, wooden or plastic.",
            ],
          },
          {
            heading: "Properties",
            text: [
              "A property is a word that describes what a material is like.",
              "Hard or soft. Bendy or stiff. Rough or smooth. Transparent (you can see through it) or opaque (you can't).",
              "Waterproof means water can't get through it. Absorbent means it soaks water up.",
            ],
          },
          {
            heading: "The right material for the job",
            text: [
              "We choose materials because of their properties.",
              "A window is glass because it's transparent. A saucepan is metal because it's strong and doesn't melt on the cooker. A tea towel is fabric because it's absorbent.",
              "A chocolate teapot would be no good at all. Can you think why?",
            ],
          },
        ],
        words: [
          { word: "material", meaning: "what an object is made of" },
          { word: "property", meaning: "a word that describes what a material is like" },
          { word: "transparent", meaning: "you can see through it" },
          { word: "opaque", meaning: "you can't see through it" },
          { word: "absorbent", meaning: "it soaks up water" },
        ],
      },
      practice: {
        intro: "Match the material to the job.",
        questions: [
          {
            type: "match",
            q: "Match each object to the best material for it.",
            pairs: [["Window", "Glass"], ["Saucepan", "Metal"], ["Tea towel", "Fabric"], ["Chopping board", "Wood"]],
          },
          { type: "choice", q: "Why is a tea towel made of fabric?", options: ["It's absorbent", "It's transparent", "It's shiny"], answer: 0 },
        ],
      },
      task: {
        title: "Kitchen materials hunt",
        intro: "Be a materials detective in the kitchen.",
        need: ["Paper and a pencil", "A grown-up to say which cupboards are OK to look in"],
        steps: [
          "Draw a table with five columns: metal, plastic, wood, glass and fabric.",
          "Find at least two objects for each column and write or draw them in.",
          "Pick three of your objects. Write one property for each, like 'the spoon is hard and shiny'.",
          "Find one object made of more than one material. Which materials, and why?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a material?", options: ["What an object is made of", "A kind of object", "A colour"], answer: 0 },
        { type: "choice", q: "Which word means you can't see through it?", options: ["Transparent", "Opaque", "Bendy"], answer: 1 },
        { type: "choice", q: "Why is a window made of glass?", options: ["It's soft", "It's transparent", "It's absorbent"], answer: 1 },
        {
          type: "pick",
          q: "Which of these are materials? There is more than one.",
          options: ["Wood", "Spoon", "Plastic", "Metal", "Cup"],
          answers: [0, 2, 3],
          why: "A spoon and a cup are objects. They are made of materials.",
        },
        { type: "choice", q: "What does absorbent mean?", options: ["It soaks up water", "It keeps water out", "It is very heavy"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and a pencil", "Access to a few kitchen cupboards"],
        tips: [
          "Children often mix up 'object' and 'material'. Keep asking 'what's it made of?' until it sticks.",
          "Steer them away from sharp knives and anything breakable during the hunt.",
        ],
        younger: "Sort a handful of objects into two piles, hard and soft, then into two more, bendy and stiff.",
        older: "Pick one object and redesign it in a silly material, like a chocolate teapot. Explain what would go wrong and why.",
      },
    },
    {
      slug: "kitchen-science-2",
      title: "Which material is waterproof?",
      emoji: "☔",
      minutes: 45,
      goal: "I can carry out a fair test to find out which materials are waterproof.",
      starter: [
        { type: "choice", q: "What is a property?", options: ["A word that describes what a material is like", "An object", "A type of food"], answer: 0 },
        { type: "choice", q: "Which is absorbent?", options: ["A sponge", "A metal spoon", "A glass"], answer: 0 },
        { type: "choice", q: "Transparent means...", options: ["you can see through it", "it is waterproof", "it is soft"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Waterproof",
            text: [
              "A waterproof material doesn't let water through. Raincoats, umbrellas and wellies are made of waterproof materials.",
              "Materials that soak water up, like kitchen roll, are absorbent.",
            ],
          },
          {
            heading: "A fair test",
            text: [
              "Scientists test things to find out the answer. To be sure the answer is right, the test has to be fair.",
              "In a fair test you change only one thing, and keep everything else the same.",
              "Here, we change the material. We keep the same amount of water, the same size of material and the same time for each one.",
            ],
          },
          {
            heading: "Predict, test, record",
            text: [
              "Before you test, make a prediction: what do you think will happen, and why?",
              "Then do the test and write down what you see. This is called recording your results.",
              "It's fine if your prediction was wrong. Scientists find that all the time, and it's how they learn.",
            ],
          },
        ],
        words: [
          { word: "waterproof", meaning: "doesn't let water through" },
          { word: "fair test", meaning: "a test where you change only one thing and keep everything else the same" },
          { word: "prediction", meaning: "what you think will happen, before you test it" },
          { word: "results", meaning: "what you found out in your test" },
        ],
      },
      practice: {
        intro: "Think like a scientist.",
        questions: [
          {
            type: "pick",
            q: "To make the test fair, what should stay the same? There is more than one.",
            options: ["The amount of water", "The size of each material", "The material", "How long you wait"],
            answers: [0, 1, 3],
            why: "The material is the one thing we change.",
          },
          { type: "order", q: "Put the steps in order.", items: ["Make a prediction", "Do the test", "Record the results", "Say what you found out"] },
        ],
      },
      task: {
        title: "The waterproof test",
        intro: "Find out which material would make the best roof for a toy's house.",
        need: [
          "A jar or cup",
          "An elastic band",
          "Squares of different materials, about the same size: kitchen roll, cling film, foil, a bit of old cotton, a plastic bag, paper",
          "A teaspoon and some water",
        ],
        steps: [
          "Write down your prediction: which material do you think will be the most waterproof?",
          "Stretch the first material over the top of the jar and hold it on with the elastic band.",
          "Pour two teaspoons of water on top. Wait one minute.",
          "Look: did any water get into the jar? Write down 'waterproof' or 'not waterproof'.",
          "Dry the jar and test the next material in exactly the same way.",
          "Which material would you use for the roof? Was your prediction right?",
        ],
      },
      exit: [
        { type: "choice", q: "What does waterproof mean?", options: ["It soaks up water", "It doesn't let water through", "It floats"], answer: 1 },
        { type: "choice", q: "In a fair test you change...", options: ["only one thing", "everything", "nothing"], answer: 0 },
        { type: "choice", q: "What is a prediction?", options: ["What you think will happen", "What did happen", "A kind of material"], answer: 0 },
        { type: "choice", q: "Which is most likely to be waterproof?", options: ["Kitchen roll", "Cling film", "Paper"], answer: 1 },
        { type: "choice", q: "If your prediction was wrong, that means...", options: ["you did it badly", "you learned something new", "you must start again"], answer: 1 },
      ],
      grownUp: {
        need: ["A jar, an elastic band, a teaspoon and water", "Squares of kitchen roll, cling film, foil, cotton, a plastic bag and paper"],
        tips: [
          "Do this on a tray or by the sink. It gets a bit wet.",
          "The key idea is the fair test. Ask 'what are we keeping the same?' before each go.",
        ],
        younger: "Test just three materials and sort them into 'keeps water out' and 'lets water in'.",
        older: "Make a results table, then test one waterproof material again with a whole tablespoon of water. Does it still hold?",
      },
    },
    {
      slug: "kitchen-science-3",
      title: "Floating and sinking",
      emoji: "🍊",
      minutes: 45,
      goal: "I can test which objects float or sink and explain that it isn't just about how heavy they are.",
      starter: [
        { type: "choice", q: "In a fair test you change...", options: ["only one thing", "everything"], answer: 0 },
        { type: "choice", q: "What is a prediction?", options: ["What you think will happen", "Your results"], answer: 0 },
        { type: "choice", q: "Which is waterproof?", options: ["A plastic bag", "A paper towel"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Float or sink?",
            text: [
              "When you put something in water, it either floats on top or sinks to the bottom.",
              "Lots of people think heavy things sink and light things float. But a huge ship floats, and a tiny coin sinks!",
            ],
          },
          {
            heading: "The water pushes back",
            text: [
              "When an object goes into water, it pushes some water out of the way. The water pushes back up on it.",
              "If the push of the water is strong enough, the object floats. If not, it sinks.",
              "Big, spread-out shapes push away lots of water, so the water can push back harder. That's why a ship's shape helps it float.",
            ],
          },
          {
            heading: "Air helps",
            text: [
              "Things with lots of air inside, like a ball or an empty bottle, are good at floating.",
              "An orange floats in its peel because the peel is full of tiny air pockets. Peel it, and it sinks!",
            ],
          },
        ],
        words: [
          { word: "float", meaning: "to stay on top of the water" },
          { word: "sink", meaning: "to go down to the bottom of the water" },
          { word: "upthrust", meaning: "the push of the water upwards on an object" },
        ],
      },
      practice: {
        intro: "Float or sink?",
        questions: [
          { type: "choice", q: "A big ship floats because...", options: ["it's light", "its shape pushes away lots of water", "it's made of wood"], answer: 1 },
          { type: "choice", q: "Why does an orange float in its peel?", options: ["The peel is full of tiny air pockets", "Oranges are magic", "It's very heavy"], answer: 0 },
        ],
      },
      task: {
        title: "Float or sink, and the foil boat challenge",
        intro: "Test your predictions, then build a boat.",
        need: ["A washing-up bowl of water", "Small objects: a coin, an apple, a cork, a spoon, a grape, a plastic lid, an orange", "A sheet of foil", "Coins or marbles for cargo"],
        steps: [
          "Before each object goes in, predict: float or sink? Then test it and record what happens.",
          "Test the orange with its peel on, then peeled. What happens?",
          "Scrunch a sheet of foil into a ball and drop it in. Now take a new sheet and fold it into a boat shape.",
          "Load your boat with coins one at a time. How many can it carry before it sinks?",
        ],
      },
      exit: [
        { type: "choice", q: "Do all heavy things sink?", options: ["Yes", "No"], answer: 1, why: "A huge ship is very heavy, but it floats." },
        { type: "choice", q: "What is upthrust?", options: ["The water pushing up on an object", "A kind of boat", "How heavy something is"], answer: 0 },
        { type: "choice", q: "Which shape of foil floats best?", options: ["A tight ball", "A boat shape"], answer: 1 },
        { type: "choice", q: "Things with lots of air inside are good at...", options: ["sinking", "floating"], answer: 1 },
        { type: "choice", q: "What happens to a peeled orange in water?", options: ["It floats", "It sinks"], answer: 1 },
      ],
      grownUp: {
        need: ["A washing-up bowl of water", "Small objects", "Foil", "Coins or marbles"],
        tips: [
          "The orange test is the wow moment. Let your child predict first.",
          "'Upthrust' is the word KS2 science uses. It's fine to just say 'the water pushes back'.",
        ],
        younger: "Just do float or sink with five objects, sorting them into two piles.",
        older: "Change one thing about the boat (its size, or the height of its sides) and test again. Which design carried the most?",
      },
    },
    {
      slug: "kitchen-science-4",
      title: "Dissolving",
      emoji: "🧂",
      minutes: 45,
      goal: "I can test which materials dissolve in water, and say how to get a dissolved material back.",
      starter: [
        { type: "choice", q: "What helps things float?", options: ["Lots of air inside", "Being made of metal"], answer: 0 },
        { type: "choice", q: "What is a fair test?", options: ["Change one thing, keep the rest the same", "Change everything"], answer: 0 },
        { type: "choice", q: "What is a material?", options: ["What an object is made of", "A colour"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Where did it go?",
            text: [
              "Stir a spoonful of sugar into warm water and it seems to disappear. But it's still there: taste the water and it's sweet!",
              "The sugar has dissolved. It has broken up into pieces far too tiny to see, mixed all through the water.",
              "The mixture of water with something dissolved in it is called a solution.",
            ],
          },
          {
            heading: "Soluble or insoluble",
            text: [
              "Something that dissolves is soluble. Sugar, salt and instant coffee are soluble.",
              "Something that doesn't dissolve is insoluble. Sand, rice and flour are insoluble: they just sink or make the water cloudy.",
              "Warm water and stirring both help things dissolve faster.",
            ],
          },
          {
            heading: "Getting it back",
            text: [
              "If you leave salty water somewhere warm, the water slowly evaporates into the air. The salt is left behind as crystals.",
              "So dissolving is a change you can undo. Scientists call it a reversible change.",
              "This is how sea salt is made, from seawater!",
            ],
          },
        ],
        words: [
          { word: "dissolve", meaning: "when a solid mixes into a liquid and breaks up so small you can't see it" },
          { word: "soluble", meaning: "it can dissolve" },
          { word: "insoluble", meaning: "it can't dissolve" },
          { word: "solution", meaning: "a liquid with something dissolved in it" },
          { word: "evaporate", meaning: "when a liquid turns into a gas and goes into the air" },
        ],
      },
      practice: {
        intro: "Soluble or insoluble?",
        questions: [
          {
            type: "pick",
            q: "Which of these dissolve in water? There is more than one.",
            options: ["Sugar", "Sand", "Salt", "Rice"],
            answers: [0, 2],
          },
          { type: "choice", q: "What helps sugar dissolve faster?", options: ["Cold water and no stirring", "Warm water and stirring"], answer: 1 },
        ],
      },
      task: {
        title: "The dissolving test, and salt crystals",
        intro: "Find out what dissolves, then grow some crystals.",
        need: ["Four clear glasses of warm tap water", "A teaspoon each of sugar, salt, sand (or soil) and rice", "A spoon to stir", "A dark-coloured saucer"],
        steps: [
          "Predict which ones will dissolve.",
          "Put one teaspoon of each into its own glass. Stir each one ten times.",
          "Wait a minute and look. Which ones disappeared? Write 'soluble' or 'insoluble' for each.",
          "Pour a little of the salty water onto the dark saucer. Leave it somewhere warm, like a sunny windowsill.",
          "Check it over the next few days. What's left when the water has gone?",
        ],
      },
      exit: [
        { type: "choice", q: "What does soluble mean?", options: ["It can dissolve", "It can't dissolve", "It floats"], answer: 0 },
        { type: "choice", q: "Is sand soluble?", options: ["Yes", "No"], answer: 1 },
        { type: "choice", q: "What is a solution?", options: ["A liquid with something dissolved in it", "A kind of rock", "A hard material"], answer: 0 },
        { type: "choice", q: "How can you get salt back from salty water?", options: ["Let the water evaporate", "Freeze it", "Stir it more"], answer: 0 },
        { type: "choice", q: "Dissolving is...", options: ["a change you can undo", "a change you can never undo"], answer: 0, why: "It's a reversible change." },
      ],
      grownUp: {
        need: ["Four clear glasses", "Sugar, salt, sand or soil, rice", "A dark saucer"],
        tips: [
          "Use warm tap water, not hot from the kettle.",
          "The salt crystals take a few days. A sunny windowsill or near a radiator speeds it up.",
        ],
        younger: "Try just sugar and sand, and taste (a clean finger) the sugar water to show the sugar is still there.",
        older: "Keep adding sugar a teaspoon at a time to one glass. How many before no more will dissolve? That's called a saturated solution.",
      },
    },
    {
      slug: "kitchen-science-5",
      title: "Melting and freezing",
      emoji: "🧊",
      minutes: 45,
      goal: "I can describe solids and liquids, and explain melting and freezing.",
      starter: [
        { type: "choice", q: "What does dissolve mean?", options: ["Mix into a liquid and break up too small to see", "Turn into ice"], answer: 0 },
        { type: "choice", q: "Which is soluble?", options: ["Sugar", "Sand"], answer: 0 },
        { type: "choice", q: "Evaporate means...", options: ["a liquid turns into a gas", "a liquid turns into ice"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Solids and liquids",
            text: [
              "A solid keeps its own shape, like an ice cube, a spoon or a block of cheese.",
              "A liquid flows and takes the shape of whatever it's in, like water, milk or juice.",
              "Some things are tricky: sugar and flour pour, but each tiny grain is a solid.",
            ],
          },
          {
            heading: "Melting",
            text: [
              "When a solid gets warm enough, it melts and becomes a liquid.",
              "Ice melts into water above 0°C. Chocolate and butter melt on a warm day, or in your hand!",
            ],
          },
          {
            heading: "Freezing",
            text: [
              "When a liquid gets cold enough, it freezes and becomes a solid.",
              "Water freezes into ice at 0°C. That's why puddles turn to ice on a frosty morning.",
              "Melting and freezing are changes you can undo, so they are reversible changes.",
            ],
          },
        ],
        words: [
          { word: "solid", meaning: "keeps its own shape" },
          { word: "liquid", meaning: "flows and takes the shape of its container" },
          { word: "melt", meaning: "when a solid warms up and turns into a liquid" },
          { word: "freeze", meaning: "when a liquid cools down and turns into a solid" },
          { word: "reversible", meaning: "a change you can undo" },
        ],
      },
      practice: {
        intro: "Solid or liquid?",
        questions: [
          {
            type: "match",
            q: "Match each one to solid or liquid.",
            pairs: [["Ice cube", "Solid"], ["Milk", "Liquid"], ["Spoon", "Solid, it keeps its shape"], ["Orange juice", "Liquid, it flows"]],
          },
          { type: "type", q: "At what temperature does water freeze? Type the number.", answer: "0", after: "°C" },
        ],
      },
      task: {
        title: "The ice cube race",
        intro: "Where in your home will an ice cube melt fastest?",
        need: ["Four ice cubes, all the same size", "Four saucers", "A timer"],
        steps: [
          "Put one ice cube on each saucer.",
          "Choose four places: a sunny windowsill, the fridge, a shady room, and near a radiator or in your hands (wrapped in a cloth).",
          "Predict which will melt first and which last.",
          "Check every five minutes and record which ones have melted.",
          "Pour one of the meltwaters into an ice cube tray and freeze it again. You've reversed the change!",
        ],
      },
      exit: [
        { type: "choice", q: "A solid...", options: ["keeps its own shape", "flows"], answer: 0 },
        { type: "choice", q: "What happens when ice gets warm?", options: ["It freezes", "It melts"], answer: 1 },
        { type: "type", q: "Water freezes at how many degrees Celsius?", answer: "0", after: "°C" },
        { type: "choice", q: "Is melting a reversible change?", options: ["Yes, you can freeze it again", "No, it can never be undone"], answer: 0 },
        { type: "choice", q: "Where would an ice cube melt fastest?", options: ["In the fridge", "On a sunny windowsill"], answer: 1 },
      ],
      grownUp: {
        need: ["Four ice cubes the same size", "Saucers", "A timer"],
        tips: [
          "Making the ice cubes the same size is what keeps the race fair. Ask your child why that matters.",
          "If it's a cold day, the hands-in-a-cloth spot is a fun one to test.",
        ],
        younger: "Watch one ice cube and one piece of chocolate melt in a warm room and talk about what's happening.",
        older: "Draw a line graph of how long each ice cube took. What made the biggest difference?",
      },
    },
    {
      slug: "kitchen-science-6",
      title: "Changes you can't undo",
      emoji: "🥚",
      minutes: 45,
      goal: "I can sort changes into reversible and irreversible, with kitchen examples.",
      starter: [
        { type: "choice", q: "What happens when water gets cold enough?", options: ["It freezes", "It evaporates"], answer: 0 },
        { type: "choice", q: "A reversible change is...", options: ["a change you can undo", "a change you can't undo"], answer: 0 },
        { type: "choice", q: "Is melting chocolate reversible?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Reversible changes",
            text: [
              "So far, every change we've looked at can be undone. Ice melts, and you can freeze it again. Salt dissolves, and you can get it back by evaporating the water.",
              "These are reversible changes.",
            ],
          },
          {
            heading: "Irreversible changes",
            text: [
              "Some changes can never be undone. They make something completely new.",
              "You can't unbake a cake back into eggs, flour and sugar. You can't uncook a fried egg. You can't turn toast back into bread.",
              "These are irreversible changes.",
            ],
          },
          {
            heading: "Spotting a new material",
            text: [
              "Clues that something new has been made: it changes colour, it fizzes and makes bubbles of gas, or it smells different.",
              "Mix bicarbonate of soda with vinegar and it fizzes like mad. The bubbles are a gas called carbon dioxide. That's a new material, so it's irreversible.",
            ],
          },
        ],
        words: [
          { word: "irreversible", meaning: "a change you can't undo" },
          { word: "reversible", meaning: "a change you can undo" },
          { word: "carbon dioxide", meaning: "a gas, the bubbles made when bicarbonate of soda and vinegar mix" },
        ],
      },
      practice: {
        intro: "Can you undo it?",
        questions: [
          {
            type: "match",
            q: "Match each change to reversible or irreversible.",
            pairs: [["Melting ice", "Reversible"], ["Baking a cake", "Irreversible"], ["Dissolving salt", "Reversible, evaporate the water"], ["Frying an egg", "Irreversible, it can't be uncooked"]],
          },
        ],
      },
      task: {
        title: "Fizz, and a kitchen changes hunt",
        intro: "Make an irreversible change, then hunt for more in the kitchen.",
        need: ["A tray", "A small glass or jar", "Two teaspoons of bicarbonate of soda", "A little vinegar", "A grown-up"],
        steps: [
          "Stand the glass on the tray and put the bicarbonate of soda in it.",
          "Pour in a little vinegar and stand back. What happens? What clues tell you something new has been made?",
          "Can you get the bicarbonate of soda and vinegar back? Why not?",
          "Next time someone cooks, watch closely. Spot one reversible change and one irreversible change, and tell your grown-up.",
        ],
      },
      exit: [
        { type: "choice", q: "What is an irreversible change?", options: ["A change you can't undo", "A change you can undo"], answer: 0 },
        { type: "choice", q: "Baking a cake is...", options: ["reversible", "irreversible"], answer: 1 },
        { type: "choice", q: "Freezing water is...", options: ["reversible", "irreversible"], answer: 0 },
        {
          type: "pick",
          q: "Which are clues that something new has been made? There is more than one.",
          options: ["It fizzes", "It changes colour", "It gets wet", "It smells different"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "What are the bubbles when bicarbonate of soda and vinegar mix?", options: ["Air from the cupboard", "Carbon dioxide gas", "Steam"], answer: 1 },
      ],
      grownUp: {
        need: ["A tray", "A small glass", "Bicarbonate of soda", "Vinegar"],
        tips: [
          "Do the fizz on a tray: it can froth over the top. Keep vinegar away from eyes.",
          "To finish the unit, ask your child to explain the difference between reversible and irreversible to someone else in the family.",
        ],
        younger: "Do the fizz together and talk about what you can see, hear and smell.",
        older: "Is burning a candle reversible or irreversible? The wax melts (reversible) but the wick burns (irreversible). Can a change be both?",
      },
    },
  ],
};
