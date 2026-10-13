import type { LessonUnit } from "@/lib/lessons";

/** Autumn and winter: Year 1 seasonal changes, for ages 5 to 7. A grown-up reads along. Activities indoors and on safe walks with a grown-up. */
export const autumnAndWinter: LessonUnit = {
  slug: "autumn-and-winter",
  title: "Autumn and winter",
  short: "Autumn and winter",
  subject: "Science",
  ages: "5 to 7",
  emoji: "🍂",
  color: "#B7865A",
  summary: "Six lessons about the four seasons, autumn leaves and conkers, animals getting ready for winter, frost and snow, a weather diary and dressing for the weather.",
  cover: "/lessons/units/autumn-and-winter.jpg",
  lessons: [
    {
      slug: "autumn-and-winter-1",
      title: "The four seasons",
      emoji: "🌳",
      minutes: 30,
      goal: "I can name the four seasons in order.",
      starter: [
        { type: "choice", q: "What falls from the clouds on a rainy day?", options: ["Water", "Sweets"], answer: 0 },
        { type: "choice", q: "When is it usually hot and sunny?", options: ["Winter", "Summer"], answer: 1 },
        { type: "choice", q: "When might it snow?", options: ["Winter", "Summer", "Never"], answer: 0 },
        { type: "pick", q: "Which of these are kinds of weather? There is more than one.", options: ["Rain", "Spoon", "Sun", "Wind"], answers: [0, 2, 3] },
        { type: "choice", q: "What do we call the time of year when leaves fall off trees?", options: ["Spring", "Autumn", "Summer"], answer: 1 },
        { type: "choice", q: "What might you wear on a cold day?", options: ["A swimsuit", "Sandals", "A warm coat"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Four seasons",
            picture: "/lessons/autumn-and-winter/lesson-1-1.jpg",
            alt: "The same tree in spring, summer, autumn and winter",
            text: [
              "A year is split into four parts. We call them seasons.",
              "The four seasons are spring, summer, autumn and winter.",
              "Each season has its own kind of weather.",
            ],
          },
          {
            heading: "Round and round",
            picture: "/lessons/autumn-and-winter/lesson-1-2.jpg",
            alt: "A seasons wheel with spring, summer, autumn and winter pictures",
            text: [
              "The seasons always come in the same order. Spring, then summer, then autumn, then winter.",
              "After winter, spring comes again. Round and round, every year!",
            ],
          },
          {
            heading: "What is each season like?",
            picture: "/lessons/autumn-and-winter/lesson-1-3.jpg",
            alt: "A boy watching autumn leaves fall from a window",
            text: [
              "In spring, flowers pop up and baby animals are born. In summer, it is warmer and the days are long.",
              "In autumn, leaves fall from many trees. In winter, it is cold and the days are short.",
              "Right now it is autumn. Can you see any autumn signs outside your window?",
            ],
          },
        ],
        words: [
          { word: "season", meaning: "one of the four parts of the year" },
          { word: "autumn", meaning: "the season when leaves fall" },
          { word: "winter", meaning: "the coldest season" },
        ],
      },
      practice: {
        intro: "Let's practise the seasons.",
        questions: [
          { type: "order", q: "Put the seasons in order, starting with spring.", items: ["Spring", "Summer", "Autumn", "Winter"] },
          { type: "match", q: "Match each season to something you might see.", pairs: [["Spring", "New flowers"], ["Autumn", "Falling leaves"], ["Winter", "Snow"]] },
          { type: "choice", q: "Which season comes after winter?", options: ["Autumn", "Spring", "Summer"], answer: 1 },
          { type: "type", q: "How many seasons are there?", answer: ["4", "four"] },
        ],
      },
      task: {
        title: "My seasons wheel",
        intro: "Make a wheel that shows the seasons going round and round.",
        need: ["A paper plate or a big circle of paper", "Crayons or pens", "A grown-up to help"],
        steps: [
          "Ask your grown-up to draw two lines across the plate, like a cross. Now you have four parts.",
          "Draw spring in the first part. Maybe flowers or a lamb.",
          "Go round and draw summer, then autumn, then winter.",
          "Spin your wheel slowly and say the seasons in order.",
          "Point to the season we are in now.",
        ],
      },
      exit: [
        { type: "type", q: "How many seasons are there in a year?", answer: ["4", "four"] },
        { type: "choice", q: "Which season comes after summer?", options: ["Autumn", "Winter", "Spring"], answer: 0 },
        { type: "choice", q: "Which is the coldest season?", options: ["Summer", "Spring", "Winter"], answer: 2 },
        { type: "pick", q: "Which of these are seasons? There is more than one.", options: ["Spring", "Monday", "Winter", "Autumn"], answers: [0, 2, 3] },
        { type: "order", q: "Put the seasons in order, starting with spring.", items: ["Spring", "Summer", "Autumn", "Winter"] },
        { type: "choice", q: "After winter, what comes next?", options: ["Summer", "Spring", "Autumn"], answer: 1 },
      ],
      grownUp: {
        need: ["A paper plate or circle of paper", "Crayons or pens"],
        tips: [
          "Say the seasons in order as a chant or clap, and come back to it at the start of each lesson.",
          "Link each season to things your child knows, like birthdays, Bonfire Night or holidays.",
        ],
        younger: "Just talk about two seasons, summer and winter. Sort a few clothes or pictures into hot and cold.",
        older: "Ask them to write the season names on the wheel and add the months of autumn: September, October and November.",
      },
    },
    {
      slug: "autumn-and-winter-2",
      title: "Signs of autumn",
      emoji: "🍁",
      minutes: 30,
      goal: "I can spot signs of autumn.",
      starter: [
        { type: "type", q: "How many seasons are there?", answer: ["4", "four"] },
        { type: "choice", q: "Which season comes after summer?", options: ["Spring", "Autumn"], answer: 1 },
        { type: "order", q: "Put the seasons in order, starting with spring.", items: ["Spring", "Summer", "Autumn", "Winter"] },
        { type: "choice", q: "Which season is the coldest?", options: ["Winter", "Summer", "Spring"], answer: 0 },
        { type: "match", q: "Match each season to something you might see.", pairs: [["Spring", "New flowers"], ["Summer", "Hot sun"], ["Winter", "Snow"]] },
        { type: "choice", q: "Which season comes after winter?", options: ["Autumn", "Summer", "Spring"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Leaves change colour",
            picture: "/lessons/autumn-and-winter/lesson-2-1.jpg",
            alt: "A girl walking through colourful autumn leaves",
            text: [
              "In autumn, lots of leaves change from green to yellow, orange, red and brown.",
              "Then they fall off the trees. Crunch, crunch, under your feet!",
              "Some trees, like holly and pine trees, keep their green leaves all year.",
            ],
          },
          {
            heading: "Seeds and conkers",
            picture: "/lessons/autumn-and-winter/lesson-2-2.jpg",
            alt: "A child's hands holding conkers and acorns",
            text: [
              "Autumn is when many trees drop their seeds. Acorns come from oak trees. Conkers come from horse chestnut trees.",
              "Conkers are shiny and fun to collect. But never eat a conker. Conkers can make you poorly.",
              "Always wash your hands after playing with things you find outside.",
            ],
          },
          {
            heading: "Shorter days",
            picture: "/lessons/autumn-and-winter/lesson-2-3.jpg",
            alt: "A parent and child walking home as it gets dark early",
            text: [
              "In autumn the days get shorter. It gets dark earlier in the evening.",
              "It gets colder too. We start to need our coats again.",
            ],
          },
        ],
        words: [
          { word: "leaf", meaning: "the flat green part of a plant" },
          { word: "seed", meaning: "a tiny thing that can grow into a new plant" },
          { word: "conker", meaning: "the shiny brown seed of a horse chestnut tree" },
        ],
      },
      practice: {
        intro: "Can you spot the autumn signs?",
        questions: [
          { type: "pick", q: "Which of these are signs of autumn? There is more than one.", options: ["Leaves falling", "Conkers on the ground", "Paddling in the sea", "Darker evenings"], answers: [0, 1, 3] },
          { type: "choice", q: "What tree does an acorn come from?", options: ["An apple tree", "An oak tree", "A holly tree"], answer: 1 },
          { type: "choice", q: "Is it OK to eat a conker?", options: ["Yes", "No, never"], answer: 1 },
          { type: "gap", q: "Fill the gap.", text: "In autumn, the days get ___.", bank: ["shorter", "hotter"], answers: ["shorter"] },
        ],
      },
      task: {
        title: "Autumn treasure hunt",
        intro: "Go on a safe walk with your grown-up and look for autumn treasure.",
        need: ["A bag or a box", "A grown-up to go with you", "Paper and crayons"],
        steps: [
          "Put on your coat and go out with your grown-up.",
          "Find leaves in three different colours.",
          "Look for seeds, like acorns, conkers or sycamore helicopters. Look, but never eat them.",
          "Take your treasure home and wash your hands.",
          "Lay your leaves on paper and rub a crayon over them, or draw them.",
        ],
      },
      exit: [
        { type: "choice", q: "What happens to many leaves in autumn?", options: ["They change colour and fall", "They grow bigger", "They turn blue"], answer: 0 },
        { type: "choice", q: "What tree does a conker come from?", options: ["An oak tree", "A pine tree", "A horse chestnut tree"], answer: 2 },
        { type: "choice", q: "Should you eat a conker?", options: ["No, never", "Yes"], answer: 0 },
        { type: "choice", q: "In autumn, the days get...", options: ["longer", "shorter"], answer: 1 },
        { type: "pick", q: "Which colours can autumn leaves turn? There is more than one.", options: ["Red", "Orange", "Blue", "Yellow"], answers: [0, 1, 3] },
        { type: "match", q: "Match each seed to its tree.", pairs: [["Acorn", "Oak tree"], ["Conker", "Horse chestnut tree"], ["Helicopter", "Sycamore tree"]] },
      ],
      grownUp: {
        need: ["A bag for treasures", "Paper and crayons for leaf rubbing", "Coats for a safe walk"],
        tips: [
          "Stay with your child on the walk and keep away from roads. Avoid berries and mushrooms.",
          "Conkers and acorns are not for eating. Keep conkers away from babies, toddlers and dogs.",
          "Wash hands when you get home.",
        ],
        younger: "Collect leaves and sort them by colour or by size. Count how many are in each pile.",
        older: "Find out why holly and pine trees keep their leaves. They are called evergreen trees.",
      },
    },
    {
      slug: "autumn-and-winter-3",
      title: "Animals get ready for winter",
      emoji: "🦔",
      minutes: 30,
      goal: "I can say how some animals get ready for winter.",
      starter: [
        { type: "choice", q: "What happens to many leaves in autumn?", options: ["They grow bigger", "They change colour and fall"], answer: 1 },
        { type: "choice", q: "Should you eat a conker?", options: ["No, never", "Yes"], answer: 0 },
        { type: "choice", q: "What tree does an acorn come from?", options: ["A pine tree", "An oak tree", "A holly tree"], answer: 1 },
        { type: "choice", q: "In autumn, the days get...", options: ["shorter", "longer"], answer: 0 },
        { type: "pick", q: "Which are signs of autumn? There is more than one.", options: ["Conkers on the ground", "Leaves falling", "Snowmen", "Red and yellow leaves"], answers: [0, 1, 3] },
        { type: "choice", q: "What should you do after playing with leaves and conkers?", options: ["Wash your hands", "Eat a snack straight away", "Nothing"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Hedgehogs hibernate",
            picture: "/lessons/autumn-and-winter/lesson-3-1.jpg",
            alt: "A hedgehog asleep in a nest of leaves",
            text: [
              "Winter is hard for animals. It is cold and there is not much food.",
              "In autumn, hedgehogs eat lots and get fat. Then they make a cosy nest of leaves.",
              "They curl up and sleep through the winter. This long winter sleep is called hibernating.",
            ],
          },
          {
            heading: "Swallows fly away",
            picture: "/lessons/autumn-and-winter/lesson-3-2.jpg",
            alt: "Swallows flying across the sky",
            text: [
              "Swallows are birds. In summer they live here and eat flying insects.",
              "In autumn, there are not many insects. So swallows fly all the way to Africa, where it is warm.",
              "Going on a long journey like this is called migrating. They come back in spring.",
            ],
          },
          {
            heading: "Squirrels store food",
            picture: "/lessons/autumn-and-winter/lesson-3-3.jpg",
            alt: "A squirrel burying an acorn",
            text: [
              "Squirrels do not hibernate. In autumn they collect nuts and acorns.",
              "They bury them in the ground to dig up later, when food is hard to find.",
              "Squirrels forget some of them. Those acorns can grow into new oak trees!",
            ],
          },
        ],
        words: [
          { word: "hibernate", meaning: "sleep through the winter" },
          { word: "migrate", meaning: "go on a long journey to a warmer place" },
          { word: "store", meaning: "keep something to use later" },
        ],
      },
      practice: {
        intro: "How do the animals get ready?",
        questions: [
          { type: "match", q: "Match each animal to what it does.", pairs: [["Hedgehog", "Sleeps all winter"], ["Swallow", "Flies to Africa"], ["Squirrel", "Buries nuts"]] },
          { type: "choice", q: "What do we call a long winter sleep?", options: ["Migrating", "Hibernating", "Swimming"], answer: 1 },
          { type: "choice", q: "Why do swallows fly away in autumn?", options: ["There are not many insects to eat", "They are bored", "They like the snow"], answer: 0 },
          { type: "gap", q: "Fill the gap.", text: "A hedgehog makes a cosy nest of ___.", bank: ["leaves", "stones"], answers: ["leaves"] },
        ],
      },
      task: {
        title: "Animal winter game",
        intro: "Move like the animals getting ready for winter.",
        need: ["Some space to move", "A blanket or cushion", "Paper and crayons"],
        steps: [
          "When your grown-up says 'hedgehog', curl up small under the blanket and pretend to sleep.",
          "When they say 'swallow', flap your wings and fly around the room.",
          "When they say 'squirrel', pretend to dig and hide a nut.",
          "Play a few times. Can you remember all three?",
          "Draw a hedgehog asleep in its leafy nest.",
        ],
      },
      exit: [
        { type: "choice", q: "What does a hedgehog do in winter?", options: ["Flies away", "Hibernates", "Builds a snowman"], answer: 1 },
        { type: "choice", q: "Where do swallows fly to in autumn?", options: ["Africa", "The North Pole", "The moon"], answer: 0 },
        { type: "choice", q: "What does a squirrel do with nuts in autumn?", options: ["Throws them away", "Gives them to birds", "Buries them to eat later"], answer: 2 },
        { type: "choice", q: "What does hibernate mean?", options: ["Fly far away", "Sleep through the winter"], answer: 1 },
        { type: "match", q: "Match each animal to what it does.", pairs: [["Hedgehog", "Hibernates"], ["Swallow", "Migrates"], ["Squirrel", "Stores food"]] },
        { type: "choice", q: "Why do hedgehogs eat lots in autumn?", options: ["To get ready for their long sleep", "Because they are going to fly"], answer: 0 },
      ],
      grownUp: {
        need: ["Space to move", "A blanket", "Paper and crayons"],
        tips: [
          "Children often think all animals hibernate. Squirrels are a good example of one that stays awake.",
          "If you have a garden, leave a pile of leaves in a quiet corner for hedgehogs. Never disturb a sleeping hedgehog.",
        ],
        younger: "Play just the hedgehog part: curl up to sleep, then 'wake up' when spring comes.",
        older: "Find another animal that gets ready for winter, like a bear, a dormouse or a goose, and say which way it does it.",
      },
    },
    {
      slug: "autumn-and-winter-4",
      title: "Frost, ice and snow",
      emoji: "❄️",
      minutes: 30,
      goal: "I can talk about winter weather and say why winter days are short.",
      starter: [
        { type: "choice", q: "What does a hedgehog do in winter?", options: ["Hibernates", "Flies away"], answer: 0 },
        { type: "choice", q: "Where do swallows go in autumn?", options: ["Under the ground", "To Africa", "Into the sea"], answer: 1 },
        { type: "choice", q: "What does a squirrel bury?", options: ["Toys", "Nuts and acorns", "Leaves"], answer: 1 },
        { type: "match", q: "Match each animal to what it does.", pairs: [["Hedgehog", "Hibernates"], ["Swallow", "Migrates"], ["Squirrel", "Stores food"]] },
        { type: "choice", q: "What does migrate mean?", options: ["Sleep all winter", "Go on a long journey to a warmer place"], answer: 1 },
        { type: "choice", q: "What does a hedgehog make its nest from?", options: ["Snow", "Sand", "Leaves"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Frost and ice",
            picture: "/lessons/autumn-and-winter/lesson-4-1.jpg",
            alt: "Frost on grass, a bench and a car on a cold morning",
            text: [
              "When it is very cold, water freezes. It goes hard and turns into ice.",
              "On a cold, clear night, water in the air freezes onto grass, cars and windows. This sparkly white coat is called frost.",
              "Ice can be very slippery. Walk slowly and hold a grown-up's hand.",
            ],
          },
          {
            heading: "Snow",
            picture: "/lessons/autumn-and-winter/lesson-4-2.jpg",
            alt: "Two children catching snowflakes in a park",
            text: [
              "Snow is made of tiny bits of ice that fall from the clouds. They are called snowflakes.",
              "Snow only falls when it is very cold. When it gets warmer, the snow melts back into water.",
            ],
          },
          {
            heading: "Short winter days",
            picture: "/lessons/autumn-and-winter/lesson-4-3.jpg",
            alt: "A low winter Sun over snowy rooftops",
            text: [
              "In winter, the Sun comes up late and goes down early. So the days are short and the nights are long.",
              "That is because our part of the Earth leans away from the Sun in winter. The Sun stays low in the sky.",
              "Never look straight at the Sun. It can hurt your eyes.",
            ],
          },
        ],
        words: [
          { word: "freeze", meaning: "go hard and icy because it is so cold" },
          { word: "frost", meaning: "white ice that forms on things on a cold night" },
          { word: "melt", meaning: "turn back into water when it gets warmer" },
          { word: "snowflake", meaning: "a tiny bit of ice that falls as snow" },
        ],
      },
      practice: {
        intro: "Let's think about winter.",
        questions: [
          { type: "choice", q: "What happens to water when it gets very cold?", options: ["It gets hot", "It freezes into ice", "It disappears"], answer: 1 },
          { type: "choice", q: "What is snow made of?", options: ["Tiny bits of ice", "Cotton wool", "Sugar"], answer: 0 },
          { type: "pick", q: "Which are winter weather? There is more than one.", options: ["Frost", "Snow", "Ice", "Very hot sun"], answers: [0, 1, 2] },
          { type: "gap", q: "Fill the gap.", text: "In winter, the nights are ___.", bank: ["long", "short"], answers: ["long"] },
        ],
      },
      task: {
        title: "Ice detective",
        intro: "Watch water freeze and ice melt.",
        need: ["A small plastic pot", "Water", "A freezer", "A plate", "A grown-up to help"],
        steps: [
          "With your grown-up, pour a little water into the pot.",
          "Put it in the freezer. Leave it overnight.",
          "Next day, take it out. Is it still water? Touch it. How does it feel?",
          "Tip the ice onto a plate. Leave it in a warm room.",
          "Check it after a while. What is happening to the ice?",
        ],
      },
      exit: [
        { type: "choice", q: "What do we call sparkly white ice on the grass on a cold morning?", options: ["Frost", "Rain", "Fog"], answer: 0 },
        { type: "choice", q: "What is snow made of?", options: ["Tiny bits of rain", "Tiny bits of ice", "Tiny bits of cloud"], answer: 1 },
        { type: "choice", q: "What happens to snow when it gets warmer?", options: ["It grows", "It turns blue", "It melts"], answer: 2 },
        { type: "choice", q: "In winter, the days are...", options: ["short", "long"], answer: 0 },
        { type: "choice", q: "Why should you walk slowly on ice?", options: ["It is slippery", "It is hot", "It is noisy"], answer: 0 },
        { type: "match", q: "Match the words.", pairs: [["Freeze", "Water turns to ice"], ["Melt", "Ice turns to water"], ["Snowflake", "A tiny bit of falling ice"]] },
      ],
      grownUp: {
        need: ["A small plastic pot and water", "Space in the freezer", "A plate"],
        tips: [
          "Start the ice the night before so it is ready for the lesson.",
          "The 'leaning away from the Sun' idea is enough at this age. A torch and a ball can show it if your child is curious.",
          "On icy days, hold hands and walk slowly outside.",
        ],
        younger: "Just hold an ice cube in a gloved hand and talk about how it feels and what happens to it.",
        older: "Time how long the ice takes to melt somewhere warm and somewhere cool. Which melts first?",
      },
    },
    {
      slug: "autumn-and-winter-5",
      title: "My weather diary",
      emoji: "🌦️",
      minutes: 30,
      goal: "I can look at the weather and record it with a symbol.",
      starter: [
        { type: "choice", q: "What is snow made of?", options: ["Tiny bits of ice", "Cotton wool"], answer: 0 },
        { type: "choice", q: "What is frost?", options: ["Warm rain", "White ice on things on a cold night", "A kind of cloud"], answer: 1 },
        { type: "choice", q: "In winter, the days are...", options: ["long", "short"], answer: 1 },
        { type: "choice", q: "What happens to ice when it gets warm?", options: ["It melts", "It gets bigger", "It turns to snow"], answer: 0 },
        { type: "pick", q: "Which are winter weather? There is more than one.", options: ["Frost", "Snow", "Very hot sun", "Ice"], answers: [0, 1, 3] },
        { type: "choice", q: "How should you walk on ice?", options: ["Run fast", "Walk slowly and hold a hand", "Jump up and down"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The weather changes",
            picture: "/lessons/autumn-and-winter/lesson-5-1.jpg",
            alt: "Windows showing sunny, cloudy, rainy, windy and snowy weather",
            text: [
              "The weather is what it is like outside. Sunny, cloudy, rainy, windy or snowy.",
              "The weather can change every day. Sometimes it changes in one day!",
            ],
          },
          {
            heading: "Weather symbols",
            picture: "/lessons/autumn-and-winter/lesson-5-2.jpg",
            alt: "Weather symbols for sun, cloud, rain, snow and wind",
            text: [
              "A symbol is a little picture that means something.",
              "A yellow sun means sunny. A grey cloud means cloudy. A cloud with drops means rainy. A snowflake means snowy. Wavy lines mean windy.",
              "People on the TV weather use symbols like these too.",
            ],
          },
          {
            heading: "Keeping a weather diary",
            picture: "/lessons/autumn-and-winter/lesson-5-3.jpg",
            alt: "A girl drawing the weather in her diary",
            text: [
              "A weather diary is where you draw the weather every day.",
              "Look out of the window at the same time each day. Draw the symbol for what you see.",
              "After a week, you can count the sunny days and the rainy days.",
            ],
          },
        ],
        words: [
          { word: "weather", meaning: "what it is like outside" },
          { word: "symbol", meaning: "a little picture that means something" },
          { word: "diary", meaning: "a book where you write or draw each day" },
        ],
      },
      practice: {
        intro: "What do the weather symbols mean?",
        questions: [
          { type: "match", q: "Match each symbol to the weather.", pairs: [["A yellow sun", "Sunny"], ["A cloud with drops", "Rainy"], ["A snowflake", "Snowy"]] },
          { type: "choice", q: "What do wavy lines mean?", options: ["Rainy", "Windy", "Sunny"], answer: 1 },
          { type: "choice", q: "A grey cloud means it is...", options: ["cloudy", "snowy", "hot"], answer: 0 },
          { type: "choice", q: "What is a weather diary for?", options: ["Drawing the weather each day", "Writing a shopping list", "Counting toys"], answer: 0 },
        ],
      },
      task: {
        title: "Start a weather diary",
        intro: "Make a diary and fill it in every day for a week.",
        need: ["A sheet of paper", "Crayons or pens", "A ruler and a grown-up to help"],
        steps: [
          "Ask your grown-up to split the paper into seven boxes, one for each day.",
          "Help them write the days of the week in the boxes.",
          "Look out of the window. What is the weather like today?",
          "Draw the symbol in today's box.",
          "Do it again at the same time every day this week.",
          "At the end, count the sunny days and the rainy days.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a symbol?", options: ["A kind of cloud", "A little picture that means something", "A song"], answer: 1 },
        { type: "choice", q: "Which symbol means sunny?", options: ["A snowflake", "A cloud with drops", "A yellow sun"], answer: 2 },
        { type: "choice", q: "Which symbol means rainy?", options: ["A cloud with drops", "A yellow sun"], answer: 0 },
        { type: "match", q: "Match each symbol to the weather.", pairs: [["Wavy lines", "Windy"], ["A snowflake", "Snowy"], ["A grey cloud", "Cloudy"]] },
        { type: "choice", q: "How often do you fill in a weather diary?", options: ["Once a year", "Every day", "Never"], answer: 1 },
        { type: "choice", q: "Can the weather change from day to day?", options: ["Yes", "No"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper, a ruler and crayons", "A few minutes at the same time each day this week"],
        tips: [
          "Pick a fixed time, like after breakfast, so the diary becomes a habit.",
          "Talk about what you see, hear and feel: wet ground, swaying trees, a chilly wind.",
          "Remind your child never to look straight at the Sun.",
        ],
        younger: "Use just three symbols, sun, cloud and rain. Your child can point and you draw, or use stickers.",
        older: "Add a 'hot, warm or cold' column, and at the end of the week make a simple tally of each kind of weather.",
      },
    },
    {
      slug: "autumn-and-winter-6",
      title: "Dressing for the weather",
      emoji: "🧣",
      minutes: 30,
      goal: "I can choose the right clothes for the weather.",
      starter: [
        { type: "choice", q: "What is a symbol?", options: ["A little picture that means something", "A kind of rain"], answer: 0 },
        { type: "choice", q: "Which symbol means snowy?", options: ["A yellow sun", "A snowflake", "Wavy lines"], answer: 1 },
        { type: "choice", q: "What do wavy lines mean?", options: ["Windy", "Sunny", "Rainy"], answer: 0 },
        { type: "match", q: "Match each symbol to the weather.", pairs: [["A yellow sun", "Sunny"], ["A cloud with drops", "Rainy"], ["A grey cloud", "Cloudy"]] },
        { type: "choice", q: "How often do you fill in a weather diary?", options: ["Once a year", "Never", "Every day"], answer: 2 },
        { type: "choice", q: "What is the weather?", options: ["What it is like outside", "What you eat for lunch"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Cold and frosty",
            picture: "/lessons/autumn-and-winter/lesson-6-1.jpg",
            alt: "A boy in a warm coat, hat, scarf and gloves",
            text: [
              "In cold weather, we wear warm clothes. A thick coat, a woolly hat, a scarf and gloves.",
              "Lots of layers help too. A vest, a top and a jumper keep you snug.",
            ],
          },
          {
            heading: "Wet and rainy",
            picture: "/lessons/autumn-and-winter/lesson-6-2.jpg",
            alt: "A girl in a raincoat and wellies jumping in a puddle",
            text: [
              "When it rains, we wear a raincoat and wellies. They keep the water out.",
              "Clothes that keep the water out are called waterproof. Then we can jump in puddles and stay dry!",
            ],
          },
          {
            heading: "Hot and sunny",
            picture: "/lessons/autumn-and-winter/lesson-6-3.jpg",
            alt: "A child in summer clothes getting sun cream on",
            text: [
              "In hot weather, we wear thin, cool clothes like shorts and a T-shirt.",
              "A sun hat and sun cream help keep our skin safe from the Sun.",
              "Before you go out, look at the weather. Then choose your clothes!",
            ],
          },
        ],
        words: [
          { word: "layers", meaning: "clothes worn on top of each other" },
          { word: "waterproof", meaning: "keeps the water out" },
          { word: "wellies", meaning: "rubber boots for wet days" },
        ],
      },
      practice: {
        intro: "Help choose the clothes.",
        questions: [
          { type: "match", q: "Match the weather to the clothes.", pairs: [["Snowy", "Gloves and a woolly hat"], ["Rainy", "Raincoat and wellies"], ["Hot and sunny", "Sun hat and T-shirt"]] },
          { type: "pick", q: "What would keep you warm on a frosty day? There is more than one.", options: ["A scarf", "Shorts", "A thick coat", "Gloves"], answers: [0, 2, 3] },
          { type: "choice", q: "What keeps your feet dry in puddles?", options: ["Sandals", "Wellies", "Socks"], answer: 1 },
          { type: "choice", q: "Why do we wear layers in winter?", options: ["To keep warm", "To keep cool"], answer: 0 },
        ],
      },
      task: {
        title: "Dress for the weather game",
        intro: "Your grown-up says a kind of weather. You dress for it!",
        need: ["A pile of clothes: coat, hat, scarf, gloves, wellies, sun hat, T-shirt", "A grown-up to call out the weather"],
        steps: [
          "Put all the clothes in a big pile.",
          "Your grown-up calls out a weather, like 'snowy!'",
          "Find the right clothes and put them on as fast as you can.",
          "Take them off and play again with a new weather.",
          "Look out of the window. What should you wear today?",
        ],
      },
      exit: [
        { type: "choice", q: "What should you wear on a snowy day?", options: ["Shorts and sandals", "A coat, hat and gloves", "A swimsuit"], answer: 1 },
        { type: "choice", q: "What should you wear on a rainy day?", options: ["A raincoat and wellies", "A sun hat"], answer: 0 },
        { type: "choice", q: "What helps keep your skin safe on a sunny day?", options: ["A scarf", "Wellies", "Sun cream and a sun hat"], answer: 2 },
        { type: "choice", q: "What does waterproof mean?", options: ["It soaks up water", "It keeps the water out"], answer: 1 },
        { type: "match", q: "Match the weather to the clothes.", pairs: [["Cold", "Woolly hat"], ["Wet", "Wellies"], ["Hot", "T-shirt"]] },
        { type: "choice", q: "What should you do before you choose your clothes?", options: ["Look at the weather", "Close your eyes", "Eat a biscuit"], answer: 0 },
      ],
      grownUp: {
        need: ["A pile of everyday clothes for different weather"],
        tips: [
          "Make this part of getting ready each morning: look at the weather diary, then choose clothes together.",
          "Let your child put on their own coat and wellies. It builds independence.",
        ],
        younger: "Use just two piles, warm clothes and cool clothes, and sort them together.",
        older: "Draw a person and dress them for a cold, wet, windy day. Label each item and say why it helps.",
      },
    },
  ],
};
