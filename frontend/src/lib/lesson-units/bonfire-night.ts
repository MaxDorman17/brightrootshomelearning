import type { LessonUnit } from "@/lib/lessons";

/** Bonfire Night and the Gunpowder Plot: an event beyond living memory, for ages 5 to 7. Told simply and calmly. */
export const bonfireNight: LessonUnit = {
  slug: "bonfire-night",
  title: "Bonfire Night and the Gunpowder Plot",
  short: "Bonfire Night",
  subject: "History",
  ages: "5 to 7",
  emoji: "🎆",
  color: "#8C6A9E",
  summary: "Six gentle lessons about King James I, Guy Fawkes and 5 November 1605, why we have bonfires and fireworks, how to stay safe, and making sparkly firework art.",
  cover: "/lessons/units/bonfire-night.jpg",
  lessons: [
    {
      slug: "bonfire-night-1",
      title: "Long, long ago: King James",
      emoji: "👑",
      minutes: 30,
      goal: "I can say who King James was and that he lived a long, long time ago.",
      starter: [
        { type: "choice", q: "What do we see in the sky on Bonfire Night?", options: ["Rainbows", "Fireworks"], answer: 1 },
        { type: "choice", q: "Which month is Bonfire Night in?", options: ["July", "November", "April"], answer: 1 },
        { type: "choice", q: "Who wears a crown?", options: ["A king or a queen", "A doctor", "A farmer"], answer: 0 },
        { type: "choice", q: "Is a bonfire hot or cold?", options: ["Cold", "Hot"], answer: 1 },
        { type: "pick", q: "Which of these might you see on Bonfire Night? There is more than one.", options: ["Fireworks", "Snowmen", "A bonfire", "Sparklers"], answers: [0, 2, 3] },
        { type: "choice", q: "Does Bonfire Night happen in the day or at night?", options: ["At night", "In the morning"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "A very long time ago",
            text: [
              "This story happened more than 400 years ago. That is a very, very long time!",
              "Nobody alive today was there. Not your grown-ups, not your grandparents, not even their grandparents.",
              "Back then there were no cars, no electric lights and no phones. People used candles to see at night.",
            ],
          },
          {
            heading: "King James",
            text: [
              "In 1605 the king of England was called King James. We call him King James the First.",
              "He was the king of Scotland too. He wore fine clothes and lived in big palaces.",
            ],
          },
          {
            heading: "Parliament",
            text: [
              "Parliament is a big building in London. Important people meet there to make the rules for the country.",
              "King James went to Parliament on special days. People still meet in Parliament today.",
            ],
          },
        ],
        words: [
          { word: "king", meaning: "a man who rules a country" },
          { word: "long ago", meaning: "a time before anyone alive today was born" },
          { word: "Parliament", meaning: "a building in London where the country's rules are made" },
        ],
      },
      practice: {
        intro: "Let's think about long ago and today.",
        questions: [
          { type: "choice", q: "Who was the king of England in 1605?", options: ["King Arthur", "King James", "King Charles"], answer: 1 },
          { type: "pick", q: "Which things did people NOT have long ago? There is more than one.", options: ["Cars", "Candles", "Phones", "Electric lights"], answers: [0, 2, 3] },
          { type: "match", q: "Match each thing to long ago or today.", pairs: [["Candle", "Long ago light"], ["Light bulb", "Today's light"], ["Horse and cart", "Long ago travel"]] },
          { type: "choice", q: "What is Parliament?", options: ["A building where rules are made", "A kind of firework", "A boat"], answer: 0 },
        ],
      },
      task: {
        title: "Make a crown for King James",
        intro: "Make a crown and be King James for the day.",
        need: ["A strip of card long enough to go round your head", "Crayons or pens", "Sticky tape", "Child-safe scissors and a grown-up to help"],
        steps: [
          "With your grown-up, cut zigzag points along the top of the card.",
          "Colour your crown gold or yellow.",
          "Draw jewels on it in bright colours.",
          "Ask your grown-up to tape it into a circle that fits your head.",
          "Put it on. Walk like a king and wave to your people!",
        ],
      },
      exit: [
        { type: "choice", q: "Who was the king in this story?", options: ["King James", "King Henry", "King Alfred"], answer: 0 },
        { type: "choice", q: "Did this story happen long ago or last week?", options: ["Last week", "Long, long ago"], answer: 1 },
        { type: "choice", q: "What did people use to see at night long ago?", options: ["Candles", "Torches with batteries", "Light bulbs"], answer: 0 },
        { type: "choice", q: "What is Parliament?", options: ["A palace for horses", "A park", "A building where rules are made"], answer: 2 },
        { type: "choice", q: "Which city is Parliament in?", options: ["Paris", "London"], answer: 1 },
        { type: "pick", q: "Which countries was King James king of? There is more than one.", options: ["England", "Scotland", "Spain"], answers: [0, 1] },
      ],
      grownUp: {
        need: ["Card, crayons, sticky tape and child-safe scissors"],
        tips: [
          "Young children find 'long ago' hard. Try 'before Granny was born, and before her granny was born, and keep going'.",
          "James was James VI of Scotland and became James I of England in 1603, so he ruled both. There's no need to explain the numbers.",
          "Help with the cutting.",
        ],
        younger: "Just make and wear the crown, and talk about what a king does.",
        older: "Draw two pictures side by side: a room long ago lit by candles, and your room today with a light switch.",
      },
    },
    {
      slug: "bonfire-night-2",
      title: "Guy Fawkes and the plot",
      emoji: "🕯️",
      minutes: 30,
      goal: "I can tell the story of Guy Fawkes and the plotters in my own words.",
      starter: [
        { type: "choice", q: "Who was the king of England in 1605?", options: ["King James", "King Arthur"], answer: 0 },
        { type: "choice", q: "What is Parliament?", options: ["A building where rules are made", "A shop"], answer: 0 },
        { type: "choice", q: "Did the story happen long ago?", options: ["No, yesterday", "Yes, long, long ago"], answer: 1 },
        { type: "choice", q: "What did people use for light long ago?", options: ["Candles", "Phones", "Light bulbs"], answer: 0 },
        { type: "choice", q: "Which city is Parliament in?", options: ["Edinburgh", "Cardiff", "London"], answer: 2 },
        { type: "choice", q: "What does a king wear on his head?", options: ["A crown", "A helmet"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Some unhappy men",
            text: [
              "Some men were unhappy with King James. They did not like the way he ran the country.",
              "They made a secret plan to get rid of the king. A secret plan like this is called a plot.",
              "Their leader was Robert Catesby. One of the plotters was called Guy Fawkes.",
            ],
          },
          {
            heading: "The secret plan",
            text: [
              "The plotters hid barrels of gunpowder in a cellar under Parliament. Gunpowder can make a very big bang.",
              "They wanted to blow up Parliament when the king was there. That was a very wrong thing to plan.",
              "Guy Fawkes's job was to guard the gunpowder.",
            ],
          },
          {
            heading: "Caught!",
            text: [
              "But someone sent a letter warning about the plan. The king's men searched under Parliament.",
              "Late at night they found Guy Fawkes with the gunpowder. The plan was stopped, and no one was hurt.",
              "Guy Fawkes and the other plotters were caught and punished. The king was safe.",
            ],
          },
        ],
        words: [
          { word: "plot", meaning: "a secret plan to do something bad" },
          { word: "plotter", meaning: "a person in the secret plan" },
          { word: "gunpowder", meaning: "a powder that makes a big bang" },
          { word: "cellar", meaning: "a room under a building" },
        ],
      },
      practice: {
        intro: "Can you remember the story?",
        questions: [
          { type: "order", q: "Put the story in order.", items: ["The plotters made a secret plan", "They hid gunpowder under Parliament", "The king's men searched", "Guy Fawkes was caught"] },
          { type: "choice", q: "What was Guy Fawkes's job in the plot?", options: ["To guard the gunpowder", "To be the king", "To write letters"], answer: 0 },
          { type: "choice", q: "Where did the plotters hide the gunpowder?", options: ["In a tree", "In a cellar under Parliament", "On a boat"], answer: 1 },
          { type: "choice", q: "Was anyone hurt by the gunpowder?", options: ["Yes", "No, the plan was stopped"], answer: 1 },
        ],
      },
      task: {
        title: "Act out the story",
        intro: "Tell the story with toys, like a little play.",
        need: ["A few toys or teddies", "A box to be Parliament", "Some small cups or bricks to be the barrels", "A torch"],
        steps: [
          "Choose a toy to be King James and a toy to be Guy Fawkes.",
          "Put the box down. That is Parliament.",
          "Hide the barrels under a cushion next to the box. That is the cellar.",
          "Make the king's men search with the torch. Ssh, it's night!",
          "Find Guy Fawkes. Say, \"The king is safe!\"",
          "Now tell the story again, all by yourself.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a plot?", options: ["A secret plan", "A kind of cake", "A king's house"], answer: 0 },
        { type: "choice", q: "What did the plotters hide under Parliament?", options: ["Gold", "Gunpowder", "Food"], answer: 1 },
        { type: "choice", q: "Who was caught with the gunpowder?", options: ["King James", "Guy Fawkes"], answer: 1 },
        { type: "choice", q: "Who was the leader of the plotters?", options: ["Robert Catesby", "King James", "Guy Fawkes"], answer: 0 },
        { type: "choice", q: "What happened to the king?", options: ["He was hurt", "He was safe"], answer: 1 },
        { type: "order", q: "Put the story in order.", items: ["The plotters hid the gunpowder", "Guy Fawkes was found", "The king was safe"] },
      ],
      grownUp: {
        need: ["A few toys, a box, small cups or bricks, a torch"],
        tips: [
          "Keep it calm and matter-of-fact. The key message is that the plan was stopped and nobody was hurt by it.",
          "If asked how they were punished, 'they were punished very harshly, as people were back then' is enough. There's no need for detail.",
          "The plotters were Catholics who were angry that Catholics were treated badly. For older children you can say they wanted a different kind of church in charge.",
          "Guy Fawkes was found in the cellar around midnight on the night of 4 to 5 November 1605.",
        ],
        younger: "Tell the story with the toys yourself and let your child do the searching with the torch.",
        older: "Draw the story as a comic strip in four boxes, with a sentence under each.",
      },
    },
    {
      slug: "bonfire-night-3",
      title: "Remember, remember!",
      emoji: "🔥",
      minutes: 30,
      goal: "I can say why people lit bonfires on 5 November 1605.",
      starter: [
        { type: "choice", q: "What is a plot?", options: ["A secret plan", "A song"], answer: 0 },
        { type: "choice", q: "Who guarded the gunpowder?", options: ["King James", "Guy Fawkes", "Robert Catesby"], answer: 1 },
        { type: "choice", q: "Where was the gunpowder hidden?", options: ["Under Parliament", "In the king's bedroom"], answer: 0 },
        { type: "choice", q: "Was the king safe?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What is a cellar?", options: ["A room at the top of a house", "A room under a building", "A garden"], answer: 1 },
        { type: "order", q: "Put the story in order.", items: ["The plotters made a secret plan", "They hid gunpowder", "Guy Fawkes was caught"] },
      ],
      learn: {
        cards: [
          {
            heading: "The fifth of November",
            text: [
              "Guy Fawkes was caught on the fifth of November in 1605.",
              "When people in London heard the king was safe, they were very glad.",
            ],
          },
          {
            heading: "Happy bonfires",
            text: [
              "To show they were happy, people lit bonfires in the streets of London that night.",
              "The next year, a new rule said people should remember the day every year. And so they did!",
              "That is why we still have bonfires on the fifth of November, more than 400 years later.",
            ],
          },
          {
            heading: "A rhyme to remember",
            text: [
              "There is an old rhyme about it. \"Remember, remember, the fifth of November, gunpowder, treason and plot.\"",
              "Treason means a plan against the king or the country.",
              "Today, before Parliament opens each year, guards still search the cellars, just to be sure!",
            ],
          },
        ],
        words: [
          { word: "bonfire", meaning: "a big fire outside" },
          { word: "celebrate", meaning: "to do something fun because you are happy" },
          { word: "treason", meaning: "a plan against the king or the country" },
        ],
      },
      practice: {
        intro: "Why do we have bonfires?",
        questions: [
          { type: "choice", q: "Why did people light bonfires in 1605?", options: ["They were cold", "They were happy the king was safe", "To cook dinner"], answer: 1 },
          { type: "gap", q: "Fill the gap.", text: "Remember, remember, the fifth of ___.", bank: ["November", "June", "May"], answers: ["November"] },
          { type: "type", q: "Bonfire Night is on the fifth of November. Type the number for fifth.", answer: ["5"] },
          { type: "choice", q: "Who still searches the cellars of Parliament today?", options: ["Guards", "Cats", "Nobody"], answer: 0 },
        ],
      },
      task: {
        title: "Say the rhyme",
        intro: "Learn the old rhyme and make it into a clapping game.",
        need: ["Your hands", "A grown-up or a friend"],
        steps: [
          "Listen to your grown-up say: \"Remember, remember, the fifth of November.\"",
          "Say it back together.",
          "Clap on each word as you say it.",
          "Now add: \"Gunpowder, treason and plot.\"",
          "Say it loud, then say it in a whisper.",
          "Can you say it all by yourself?",
        ],
      },
      exit: [
        { type: "choice", q: "On which day was Guy Fawkes caught?", options: ["25 December", "5 November", "1 January"], answer: 1 },
        { type: "choice", q: "In which year did it happen?", options: ["1605", "2005"], answer: 0 },
        { type: "choice", q: "Why did people light bonfires that night?", options: ["To be happy the king was safe", "Because it was dark"], answer: 0 },
        { type: "choice", q: "What is a bonfire?", options: ["A big fire outside", "A kind of sweet", "A song"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Remember, remember, the fifth of November, gunpowder, ___ and plot.", bank: ["treason", "toffee", "teddy"], answers: ["treason"] },
        { type: "choice", q: "What does celebrate mean?", options: ["To feel sad", "To go to sleep", "To do something fun because you are happy"], answer: 2 },
      ],
      grownUp: {
        need: ["Nothing extra"],
        tips: [
          "Bonfires were lit in London on the night of 5 November 1605. In 1606 Parliament passed a law making 5 November a day of thanksgiving.",
          "The search of the cellars by the Yeomen of the Guard before the State Opening of Parliament still happens. Children love this fact.",
          "Some families mention the 'guy' put on top of bonfires. If it comes up, you can say it's a pretend figure made of old clothes.",
        ],
        younger: "Just say the first line of the rhyme together and clap along.",
        older: "Write the date 5 November 1605 and draw a happy bonfire with people around it.",
      },
    },
    {
      slug: "bonfire-night-4",
      title: "Bonfire Night today",
      emoji: "🎆",
      minutes: 30,
      goal: "I can say how people celebrate Bonfire Night today.",
      starter: [
        { type: "choice", q: "Why did people light bonfires in 1605?", options: ["The king was safe", "It was snowing"], answer: 0 },
        { type: "choice", q: "What date is Bonfire Night?", options: ["5 November", "14 February"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Remember, remember, the fifth of ___.", bank: ["July", "November"], answers: ["November"] },
        { type: "choice", q: "What does treason mean?", options: ["A plan against the king", "A big party", "A kind of tree"], answer: 0 },
        { type: "choice", q: "Who still search the cellars of Parliament?", options: ["Children", "Guards", "Ducks"], answer: 1 },
        { type: "choice", q: "What is a bonfire?", options: ["A big fire outside", "A small lamp"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Fireworks and bonfires",
            text: [
              "Today, many people go to watch a big bonfire and fireworks on or near the fifth of November.",
              "Fireworks fizz, whizz and bang. They fill the dark sky with colour.",
              "Lots of people go to a big show in a park, where grown-ups set off the fireworks safely.",
            ],
          },
          {
            heading: "Warm and cosy",
            text: [
              "It is cold in November, so people wrap up in hats, scarves and gloves.",
              "Some people eat warm food, like baked potatoes, soup or sausages. Some eat sticky toffee apples or a ginger cake called parkin.",
            ],
          },
          {
            heading: "Where it happens",
            text: [
              "Bonfire Night is a big night in England.",
              "In Scotland, Wales and Northern Ireland, some people have fireworks too, but it is not as big a night.",
              "People in other places have their own special days with fireworks too.",
            ],
          },
        ],
        words: [
          { word: "firework", meaning: "something that flies up and makes bright lights and bangs" },
          { word: "display", meaning: "a big show for people to watch" },
          { word: "parkin", meaning: "a sticky ginger cake" },
        ],
      },
      practice: {
        intro: "Then and now.",
        questions: [
          { type: "pick", q: "What might people do on Bonfire Night today? There is more than one.", options: ["Watch fireworks", "Build a snowman", "See a bonfire", "Eat a toffee apple"], answers: [0, 2, 3] },
          { type: "choice", q: "In which country is Bonfire Night a really big night?", options: ["England", "France", "Australia"], answer: 0 },
          { type: "match", q: "Match the thing to what you do with it.", pairs: [["Toffee apple", "Eat it"], ["Firework display", "Watch it"], ["Woolly hat", "Wear it"]] },
          { type: "choice", q: "Did people have big firework displays in 1605?", options: ["No, they lit bonfires", "Yes, every night"], answer: 0 },
        ],
      },
      task: {
        title: "Get ready for Bonfire Night",
        intro: "Pack a pretend bag for a trip to a firework display.",
        need: ["A bag", "Warm clothes from your room", "Paper and crayons"],
        steps: [
          "Think: it will be dark and cold. What will you need?",
          "Find a hat, a scarf and some gloves. Put them in the bag.",
          "Draw a picture of a warm snack to take.",
          "Put on your hat and scarf.",
          "Show your grown-up what you packed and say why.",
        ],
      },
      exit: [
        { type: "choice", q: "What do many people watch on Bonfire Night today?", options: ["Fireworks", "A football match", "A puppet show"], answer: 0 },
        { type: "choice", q: "Is it warm or cold in November?", options: ["Warm", "Cold"], answer: 1 },
        { type: "choice", q: "What is parkin?", options: ["A sticky ginger cake", "A firework", "A hat"], answer: 0 },
        { type: "choice", q: "Where is Bonfire Night a really big night?", options: ["Wales", "Scotland", "England"], answer: 2 },
        { type: "choice", q: "Who sets off the fireworks at a big display?", options: ["Children", "Grown-ups"], answer: 1 },
        { type: "pick", q: "What should you wear on a cold Bonfire Night? There is more than one.", options: ["A hat", "Gloves", "Swimming shorts", "A scarf"], answers: [0, 1, 3] },
      ],
      grownUp: {
        need: ["A bag and some warm clothes", "Paper and crayons"],
        tips: [
          "If your family has been to a display, look at photos together and talk about what you saw, heard and smelled.",
          "Bonfire Night is mainly celebrated in England. It is marked less in Scotland, Wales and Northern Ireland, where Halloween is often the bigger night for fireworks.",
          "If your family celebrates Diwali, Hogmanay or New Year with fireworks, make the link: lots of people use fireworks to celebrate.",
        ],
        younger: "Just pack the bag together and talk about being cosy in the dark.",
        older: "Draw a 'then and now' picture: London in 1605 with bonfires, and a firework display today.",
      },
    },
    {
      slug: "bonfire-night-5",
      title: "Staying safe on Bonfire Night",
      emoji: "🧤",
      minutes: 30,
      goal: "I can say how to stay safe near fireworks, bonfires and sparklers.",
      starter: [
        { type: "choice", q: "What do many people watch on Bonfire Night?", options: ["Fireworks", "Television"], answer: 0 },
        { type: "choice", q: "What is parkin?", options: ["A ginger cake", "A sock"], answer: 0 },
        { type: "choice", q: "Who sets off fireworks at a big display?", options: ["Children", "Grown-ups", "Dogs"], answer: 1 },
        { type: "pick", q: "What do people wear on a cold Bonfire Night? There is more than one.", options: ["Gloves", "A hat", "Flip-flops"], answers: [0, 1] },
        { type: "choice", q: "Where is Bonfire Night a really big night?", options: ["Spain", "England"], answer: 1 },
        { type: "choice", q: "What is a display?", options: ["A big show to watch", "A bedtime story", "A kind of food"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Fireworks are for grown-ups",
            text: [
              "Fireworks are very hot and very fast. Only grown-ups light them.",
              "Stand well back with your grown-up and watch. At a display, stay behind the rope or fence.",
              "Never touch or pick up a firework, even one that has gone out. These rules are part of the Firework Code.",
            ],
          },
          {
            heading: "Sparklers",
            text: [
              "Sparklers are fun, but they get very hot. Always hold one with a grown-up, and wear gloves.",
              "Hold it out at arm's length, away from your face and other people. Have just one at a time.",
              "When it stops sparkling, put it in a bucket of water, hot end down.",
            ],
          },
          {
            heading: "Happy pets and quiet ears",
            text: [
              "Bangs can be loud. If you don't like the noise, you can cover your ears or wear ear defenders.",
              "Lots of pets don't like bangs. Keep them cosy indoors. Stay well back from bonfires too.",
            ],
          },
        ],
        words: [
          { word: "safe", meaning: "kept away from getting hurt" },
          { word: "sparkler", meaning: "a stick that gives out bright sparks" },
          { word: "arm's length", meaning: "as far away as your arm can reach" },
          { word: "Firework Code", meaning: "rules to keep everyone safe with fireworks" },
        ],
      },
      practice: {
        intro: "Safe or not safe?",
        questions: [
          { type: "choice", q: "Who should light fireworks?", options: ["Children", "Only grown-ups"], answer: 1 },
          { type: "pick", q: "Which are safe things to do? There is more than one.", options: ["Stand well back", "Wear gloves with a sparkler", "Pick up a used firework", "Hold a sparkler with a grown-up"], answers: [0, 1, 3] },
          { type: "choice", q: "Where does a finished sparkler go?", options: ["In your pocket", "In a bucket of water", "On the grass"], answer: 1 },
          { type: "order", q: "Put the sparkler steps in order.", items: ["Put on gloves", "Hold it out with a grown-up", "Put it in the bucket of water"] },
        ],
      },
      task: {
        title: "Make a safety poster",
        intro: "Make a poster to help your family stay safe on Bonfire Night.",
        need: ["A big piece of paper", "Crayons or felt-tip pens"],
        steps: [
          "Draw yourself standing well back from a firework, with a grown-up.",
          "Draw your hand in a glove holding a sparkler out at arm's length.",
          "Draw a bucket of water for finished sparklers.",
          "Ask your grown-up to help you write \"Stay safe!\" at the top.",
          "Stick it up at home and tell everyone the rules.",
        ],
      },
      exit: [
        { type: "choice", q: "Who lights the fireworks?", options: ["Grown-ups", "Children"], answer: 0 },
        { type: "choice", q: "What should you wear to hold a sparkler?", options: ["Gloves", "Sunglasses", "Slippers"], answer: 0 },
        { type: "choice", q: "How should you hold a sparkler?", options: ["Close to your face", "Out at arm's length"], answer: 1 },
        { type: "choice", q: "A firework has gone out. What do you do?", options: ["Pick it up", "Leave it and stay back", "Kick it"], answer: 1 },
        { type: "choice", q: "Where should pets be on Bonfire Night?", options: ["Next to the bonfire", "Cosy indoors", "In the garden"], answer: 1 },
        { type: "choice", q: "How many sparklers should you hold at once?", options: ["One", "Three", "Ten"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and pens"],
        tips: [
          "The Firework Code covers buying fireworks with a UK safety mark, keeping them in a closed box, following the instructions, lighting at arm's length with a taper, standing well back, never going back to a lit firework, and never putting fireworks in pockets or throwing them.",
          "Sparklers are not recommended for children under 5. Gloves, one at a time, arm's length, and a bucket of water for used ones.",
          "If your child is worried about the bangs, reassure them that it's fine to watch from a window or skip fireworks altogether.",
        ],
        younger: "Play 'safe or not safe' with thumbs up or thumbs down while you say simple ideas aloud.",
        older: "Write three safety rules in their own words on the poster.",
      },
    },
    {
      slug: "bonfire-night-6",
      title: "Firework art",
      emoji: "🎨",
      minutes: 30,
      goal: "I can make a safe firework picture and tell the Bonfire Night story.",
      starter: [
        { type: "choice", q: "Who lights fireworks?", options: ["Grown-ups", "Children"], answer: 0 },
        { type: "choice", q: "Where does a finished sparkler go?", options: ["In a bucket of water", "In a bag"], answer: 0 },
        { type: "choice", q: "What should you wear with a sparkler?", options: ["Gloves", "A swimming hat", "Wellies"], answer: 0 },
        { type: "choice", q: "A firework has gone out. What should you do?", options: ["Pick it up", "Stay back and leave it"], answer: 1 },
        { type: "choice", q: "How should you hold a sparkler?", options: ["At arm's length", "Near your face", "In your mouth"], answer: 0 },
        { type: "choice", q: "Where should pets be on Bonfire Night?", options: ["Outside", "Cosy indoors"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Fireworks without the bang",
            text: [
              "We can make fireworks that are totally safe. We make them with art!",
              "Fireworks burst into shapes like stars, circles, fountains and long, falling trails.",
            ],
          },
          {
            heading: "Bright on dark",
            text: [
              "Fireworks look brightest in a dark sky. So we use dark paper, like black or dark blue.",
              "Then we add bright colours: pink, yellow, green, orange and silver.",
              "Glitter makes your fireworks sparkle, just like the real thing.",
            ],
          },
          {
            heading: "Ways to make them",
            text: [
              "You can draw fireworks with chalk on dark paper, or on the ground outside with a grown-up.",
              "You can dab paint with a fork, or splat it with a straw. Blow gently and watch it spread out like a firework!",
            ],
          },
        ],
        words: [
          { word: "burst", meaning: "to break open quickly and spread out" },
          { word: "trail", meaning: "a long line left behind" },
          { word: "glitter", meaning: "tiny shiny bits that sparkle" },
        ],
      },
      practice: {
        intro: "Let's remember the whole story too.",
        questions: [
          { type: "choice", q: "Which paper makes firework colours look brightest?", options: ["White paper", "Black paper"], answer: 1 },
          { type: "order", q: "Put the Bonfire Night story in order.", items: ["The plotters hid gunpowder", "Guy Fawkes was caught", "People lit bonfires", "We have fireworks today"] },
          { type: "match", q: "Match each name to who they were.", pairs: [["King James", "The king"], ["Guy Fawkes", "Guarded the gunpowder"], ["Robert Catesby", "Leader of the plotters"]] },
          { type: "pick", q: "Which can you use to make firework art? There is more than one.", options: ["Chalk", "Paint", "Real fireworks", "Glitter"], answers: [0, 1, 3] },
        ],
      },
      task: {
        title: "Make a firework picture",
        intro: "Make a sky full of fireworks that will never go bang.",
        need: ["Black or dark blue paper", "Paint in bright colours", "A fork or a straw", "Chalk or glitter (optional)", "Glue", "An apron and old newspaper"],
        steps: [
          "Put on your apron. Cover the table with newspaper.",
          "Dip a fork in paint. Press it on the paper in a circle, like a star bursting.",
          "Or drop a blob of paint and blow it gently through a straw. Don't suck!",
          "Add lines and dots with chalk.",
          "With your grown-up, dot on glue and sprinkle glitter.",
          "Let it dry. Tell your grown-up the Bonfire Night story using your picture.",
        ],
      },
      exit: [
        { type: "choice", q: "Is a firework picture safe?", options: ["Yes, totally safe", "No"], answer: 0 },
        { type: "choice", q: "Why do we use dark paper for firework art?", options: ["Bright colours show up best", "It is cheaper", "It smells nice"], answer: 0 },
        { type: "choice", q: "What makes your picture sparkle?", options: ["Glitter", "Water", "Sand"], answer: 0 },
        { type: "choice", q: "When you blow paint with a straw, you should...", options: ["suck hard", "blow gently"], answer: 1 },
        { type: "pick", q: "Which shapes can fireworks make? There is more than one.", options: ["Stars", "Trails", "Circles"], answers: [0, 1, 2] },
        { type: "choice", q: "What does burst mean?", options: ["To fall asleep", "To break open quickly and spread out", "To stay still"], answer: 1 },
      ],
      grownUp: {
        need: ["Dark paper, bright paint, a fork or straw, chalk, glue and glitter", "An apron and newspaper"],
        tips: [
          "Supervise the straw painting so that your child blows and doesn't suck. Use a little watered-down paint.",
          "Chalk drawings on the patio or path work well, but only outdoors with a grown-up.",
          "Biodegradable or paper glitter is a kinder choice, and easier to tidy up than you might fear.",
        ],
        younger: "Use chalk on dark paper and just make big swirls and dots. Talk about the colours.",
        older: "Add a small King James, Guy Fawkes or Parliament to the bottom of the picture and tell the story from it.",
      },
    },
  ],
};
