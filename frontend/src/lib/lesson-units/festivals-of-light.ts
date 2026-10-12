import type { LessonUnit } from "@/lib/lessons";

/** Festivals of light, for ages 7 to 11. Diwali, Hanukkah, Advent and Christmas, St Lucia's Day: good for October to December. */
export const festivalsOfLight: LessonUnit = {
  slug: "festivals-of-light",
  title: "Festivals of light",
  short: "Festivals of light",
  subject: "Religious Education",
  ages: "7 to 9",
  emoji: "🪔",
  color: "#7B4FA3",
  summary: "Six lessons on why light matters in so many faiths: Diwali, Hanukkah, Advent and Christmas, St Lucia's Day, and comparing them.",
  cover: "/lessons/units/festivals-of-light.jpg",
  lessons: [
    {
      slug: "festivals-of-light-1",
      title: "Why light?",
      emoji: "🕯️",
      minutes: 40,
      goal: "I can explain what a festival is and why light is a special symbol for many people.",
      starter: [
        { type: "choice", q: "What do we put on a birthday cake?", options: ["Candles", "Stones", "Leaves"], answer: 0 },
        { type: "choice", q: "When are the darkest days of the year in the UK?", options: ["In winter", "In summer"], answer: 0 },
        { type: "choice", q: "What is a celebration?", options: ["A special happy time to mark something", "A kind of food"], answer: 0 },
        { type: "pick", q: "Which of these give us light? There is more than one.", options: ["A candle", "A torch", "A pillow", "The Sun"], answers: [0, 1, 3] },
        { type: "choice", q: "How do you feel in a dark room when someone switches on a light?", options: ["Scared", "Safer and happier", "Hungry"], answer: 1 },
        { type: "type", q: "What season comes after autumn? Type one word.", answer: ["winter", "Winter"] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a festival?",
            picture: "/lessons/festivals-of-light/lesson-1.jpg",
            alt: "A girl at a window holding a battery candle on a snowy winter evening, looking up at the stars",
            text: [
              "A festival is a special day or time of celebration. Many festivals belong to a religion, and remember an important story or belief.",
              "Festivals often have special food, decorations, music, prayers and time with family.",
            ],
          },
          {
            heading: "Light in the dark",
            text: [
              "Many festivals happen in autumn and winter, when the nights are long and dark.",
              "Lighting lamps and candles brings warmth and hope in the darkest time of the year.",
            ],
          },
          {
            heading: "Light as a symbol",
            text: [
              "A symbol is something that stands for an idea. For many people, light is a symbol of goodness, hope, knowledge and God.",
              "In this unit you'll find out how Hindus, Sikhs, Jews and Christians use light in their festivals, and what it means to them.",
            ],
          },
        ],
        words: [
          { word: "festival", meaning: "a special day or time of celebration" },
          { word: "religion", meaning: "a set of beliefs, often about God or gods, shared by a group of people" },
          { word: "symbol", meaning: "something that stands for an idea" },
          { word: "worship", meaning: "showing love and respect to God or gods, for example by praying" },
        ],
      },
      practice: {
        intro: "Light and festivals.",
        questions: [
          { type: "choice", q: "What is a symbol?", options: ["Something that stands for an idea", "A loud noise"], answer: 0 },
          {
            type: "pick",
            q: "What can light be a symbol of? There is more than one.",
            options: ["Hope", "Goodness", "Knowledge", "Being hungry"],
            answers: [0, 1, 2],
          },
        ],
      },
      task: {
        title: "What does light mean to me?",
        intro: "Think about light in your own life.",
        need: ["Paper and pens", "A torch or a battery tea light"],
        steps: [
          "Sit in a dark room for a moment with your grown-up. How does it feel? Then switch on the torch. How does that feel?",
          "Draw a big candle flame. Inside it, write or draw what light makes you think of: safety, warmth, hope, home...",
          "Talk about when your family uses candles or lights to celebrate: birthdays, festivals, special meals?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a festival?", options: ["A special day or time of celebration", "A school test"], answer: 0 },
        { type: "choice", q: "Why do many festivals of light happen in winter?", options: ["The nights are long and dark", "It's sunny"], answer: 0 },
        { type: "choice", q: "What is worship?", options: ["Showing love and respect to God or gods", "Playing football"], answer: 0 },
        { type: "choice", q: "A symbol is...", options: ["something that stands for an idea", "a type of candle"], answer: 0 },
        { type: "choice", q: "Light is often a symbol of...", options: ["hope and goodness", "sadness and anger"], answer: 0 },
        { type: "gap", q: "Fill the gaps.", text: "Many festivals happen in autumn and ___, when the nights are long and ___.", bank: ["winter", "summer", "dark", "sunny"], answers: ["winter", "dark"] },
      ],
      grownUp: {
        need: ["Paper and pens", "A torch or battery tea light"],
        tips: [
          "Use a torch or battery tea lights rather than real candles for any lesson in this unit where your child handles the light.",
          "This unit is about understanding what others believe. Phrases like 'Hindus believe...' or 'For Christians...' help keep it respectful.",
        ],
        younger: "Turn off the lights and switch on a torch, and talk about how the light makes you feel.",
        older: "List as many festivals with light as you can think of, from any religion or country.",
      },
    },
    {
      slug: "festivals-of-light-2",
      title: "Diwali",
      emoji: "🪔",
      minutes: 45,
      goal: "I can tell the story of Rama and Sita and explain how Hindus and Sikhs celebrate Diwali.",
      starter: [
        { type: "choice", q: "What is a festival?", options: ["A special time of celebration", "A shop"], answer: 0 },
        { type: "choice", q: "What can light be a symbol of?", options: ["Hope and goodness", "Being cross"], answer: 0 },
        { type: "choice", q: "What is a symbol?", options: ["Something that stands for an idea", "A drum"], answer: 0 },
        { type: "choice", q: "Why do many festivals of light happen in winter?", options: ["It's hot", "The nights are long and dark", "The shops are open"], answer: 1 },
        { type: "pick", q: "Which groups use light in their festivals? There is more than one.", options: ["Hindus", "Jews", "Christians", "Sikhs"], answers: [0, 1, 2, 3], why: "All four! You'll learn about each one in this unit." },
        { type: "choice", q: "What is worship?", options: ["A type of game", "A kind of lamp", "Showing love and respect to God or gods"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "The festival of lights",
            picture: "/lessons/festivals-of-light/lesson-2.jpg",
            alt: "A family celebrating Diwali with diya lamps, a colourful rangoli, sparklers and fireworks",
            text: [
              "Diwali is the Hindu festival of lights. It's celebrated by millions of people around the world, usually in October or November.",
              "The name comes from 'deepavali', which means 'a row of lights'. Families light small clay lamps called diyas, wear new clothes, share sweets and watch fireworks.",
            ],
          },
          {
            heading: "Rama and Sita",
            text: [
              "Hindus remember the story of Prince Rama and Princess Sita. Sita was taken away by Ravana, a demon king with ten heads.",
              "With the help of Hanuman, the monkey god, and his army, Rama rescued Sita and defeated Ravana.",
              "When Rama and Sita came home, people lit rows of lamps to guide their way. That's why Hindus light diyas at Diwali: to show that good wins over evil and light wins over darkness.",
            ],
          },
          {
            heading: "Lakshmi, rangoli, and Bandi Chhor Divas",
            text: [
              "Many Hindus also welcome Lakshmi, the goddess of good fortune, and make colourful patterns called rangoli at their doors.",
              "Sikhs celebrate Bandi Chhor Divas at the same time. They remember Guru Hargobind being freed from prison along with 52 princes. The Golden Temple in Amritsar is lit up with thousands of lights.",
            ],
          },
        ],
        words: [
          { word: "Hindu", meaning: "someone who follows Hinduism, one of the world's oldest religions" },
          { word: "diya", meaning: "a small clay lamp lit at Diwali" },
          { word: "rangoli", meaning: "a colourful pattern made on the ground at the door, with coloured powder, rice or flowers" },
          { word: "Sikh", meaning: "someone who follows Sikhism, which began in India with Guru Nanak" },
        ],
      },
      practice: {
        intro: "Diwali facts.",
        questions: [
          { type: "order", q: "Put the story of Rama and Sita in order.", items: ["Sita is taken by Ravana", "Hanuman helps Rama", "Rama rescues Sita", "People light lamps to welcome them home"] },
          {
            type: "match",
            q: "Match each word to its meaning.",
            pairs: [["Diya", "A small clay lamp"], ["Rangoli", "A colourful pattern at the door"], ["Lakshmi", "The goddess of good fortune"]],
          },
        ],
      },
      task: {
        title: "Design a rangoli pattern",
        intro: "Make a colourful pattern to welcome visitors.",
        need: ["Paper and coloured pencils or felt pens", "Or: coloured rice, lentils or chalk outside (with your grown-up's OK)"],
        steps: [
          "With your grown-up, look up pictures of rangoli patterns online.",
          "Draw a dot in the middle of your page. Build a symmetrical pattern out from it: petals, circles and diamonds.",
          "Colour it in bright colours, and draw a diya in each corner.",
          "Retell the story of Rama and Sita to someone in your family in your own words.",
        ],
      },
      exit: [
        { type: "choice", q: "Diwali is the Hindu festival of...", options: ["lights", "harvest", "spring"], answer: 0 },
        { type: "choice", q: "What is a diya?", options: ["A small clay lamp", "A sweet", "A song"], answer: 0 },
        { type: "choice", q: "Who rescued Sita?", options: ["Rama, with Hanuman's help", "Ravana", "Lakshmi"], answer: 0 },
        { type: "choice", q: "What does the Diwali story show?", options: ["Good wins over evil", "Fireworks are loud"], answer: 0 },
        { type: "choice", q: "Which festival do Sikhs celebrate at the same time?", options: ["Bandi Chhor Divas", "Hanukkah", "Easter"], answer: 0 },
        { type: "gap", q: "Fill the gaps.", text: "Many Hindus welcome ___, the goddess of good fortune, and make colourful ___ patterns at their doors.", bank: ["Lakshmi", "Sita", "rangoli", "diya"], answers: ["Lakshmi", "rangoli"] },
      ],
      grownUp: {
        need: ["Paper and coloured pens", "Coloured rice or chalk (optional)"],
        tips: [
          "Diwali moves each year with the Hindu calendar, usually falling in October or November. It's lovely to do this lesson close to the day.",
          "If you have Hindu or Sikh friends or neighbours, they may be happy to tell your child how their family celebrates.",
        ],
        younger: "Colour in a diya and a simple rangoli, and listen to the story of Rama and Sita.",
        older: "Make a clay or salt-dough diya (a battery tea light can go inside), and write a short version of the story for a younger child.",
      },
    },
    {
      slug: "festivals-of-light-3",
      title: "Hanukkah",
      emoji: "🕎",
      minutes: 45,
      goal: "I can tell the story of Hanukkah and explain why Jewish families light the hanukkiah for eight nights.",
      starter: [
        { type: "choice", q: "What is a diya?", options: ["A small clay lamp", "A drum"], answer: 0 },
        { type: "choice", q: "Who is Diwali celebrated by?", options: ["Hindus and Sikhs", "Nobody"], answer: 0 },
        { type: "choice", q: "What did people light to welcome Rama and Sita?", options: ["Lamps", "Bonfires"], answer: 0 },
        { type: "choice", q: "Who helped Rama rescue Sita?", options: ["Ravana", "Hanuman, the monkey god", "Lakshmi"], answer: 1 },
        { type: "choice", q: "What is a rangoli?", options: ["A sweet", "A song", "A colourful pattern at the door"], answer: 2 },
        { type: "choice", q: "What does the Diwali story show?", options: ["Good wins over evil", "Fireworks are loud"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "The Jewish festival of lights",
            picture: "/lessons/festivals-of-light/lesson-3.jpg",
            alt: "A Jewish family lighting the hanukkiah, with latkes, doughnuts and a dreidel on the table",
            text: [
              "Hanukkah is the Jewish festival of lights. It lasts for eight days and nights, usually in December.",
              "Jews follow Judaism, one of the oldest religions in the world. Their holy book is the Torah.",
            ],
          },
          {
            heading: "The story",
            text: [
              "More than 2,000 years ago, a king called Antiochus took over the Temple in Jerusalem and banned the Jewish people from worshipping God.",
              "A small group called the Maccabees fought back and won the Temple back.",
              "To make it holy again, they needed to light the Temple lamp. They found only enough pure oil for one day, but it burned for eight days. Jews remember this as a miracle.",
            ],
          },
          {
            heading: "How Hanukkah is celebrated",
            text: [
              "Families light a special candlestick called a hanukkiah. It has eight candles, one for each night, and a ninth helper candle called the shamash, used to light the others.",
              "On the first night one candle is lit, on the second night two, and so on until all eight are burning.",
              "People eat foods fried in oil, like potato latkes and jam doughnuts, and play a spinning-top game called dreidel.",
            ],
          },
        ],
        words: [
          { word: "Jewish", meaning: "to do with Judaism, or the people who follow it" },
          { word: "hanukkiah", meaning: "the nine-branched candlestick lit at Hanukkah" },
          { word: "shamash", meaning: "the helper candle used to light the others" },
          { word: "miracle", meaning: "an amazing event that people believe was done by God" },
          { word: "dreidel", meaning: "a four-sided spinning top played with at Hanukkah" },
        ],
      },
      practice: {
        intro: "Hanukkah facts.",
        questions: [
          { type: "type", q: "How many nights does Hanukkah last? Type the number.", answer: ["8", "eight"] },
          { type: "choice", q: "What is the shamash?", options: ["The helper candle that lights the others", "A food"], answer: 0 },
        ],
      },
      task: {
        title: "Make a paper hanukkiah",
        intro: "Make a hanukkiah you can 'light' one night at a time.",
        need: ["Card or paper", "Scissors and glue", "Yellow and orange paper for flames"],
        steps: [
          "Cut out nine thin card strips for candles. Make the middle one, the shamash, taller or set higher than the others.",
          "Glue them in a row onto a card base: four, then the shamash, then four.",
          "Cut out nine paper flames. Stick the shamash flame on.",
          "Each day this week, add one more flame, from right to left, and tell your grown-up one part of the Hanukkah story.",
        ],
      },
      exit: [
        { type: "choice", q: "Hanukkah is the festival of lights for...", options: ["Jewish people", "Hindus", "Sikhs"], answer: 0 },
        { type: "choice", q: "How long did the oil in the Temple burn?", options: ["One day", "Eight days", "One year"], answer: 1 },
        { type: "choice", q: "Who won the Temple back?", options: ["The Maccabees", "The Romans", "Antiochus"], answer: 0 },
        { type: "choice", q: "How many branches does a hanukkiah have?", options: ["Seven", "Eight", "Nine"], answer: 2, why: "Eight candles, plus the shamash." },
        { type: "choice", q: "Why do people eat foods fried in oil at Hanukkah?", options: ["To remember the oil that lasted eight days", "Because they're cheap"], answer: 0 },
        { type: "order", q: "Put the Hanukkah story in order.", items: ["Antiochus takes over the Temple", "The Maccabees fight back and win", "They find only enough oil for one day", "The oil burns for eight days"] },
      ],
      grownUp: {
        need: ["Card, scissors, glue", "Yellow and orange paper"],
        tips: [
          "Many people call the Hanukkah candlestick a menorah. Strictly, the menorah in the Temple had seven branches, and the Hanukkah one, with nine, is a hanukkiah.",
          "The hanukkiah's candles are placed from right to left, and the newest candle is lit first each night.",
        ],
        younger: "Count to eight with candles (paper or real, with you lighting them), and spin a top or dreidel.",
        older: "Find out the Hebrew letters on a dreidel and what they stand for: 'a great miracle happened there'.",
      },
    },
    {
      slug: "festivals-of-light-4",
      title: "Advent and Christmas",
      emoji: "🎄",
      minutes: 45,
      goal: "I can explain why Christians call Jesus the light of the world and how they use light at Advent and Christmas.",
      starter: [
        { type: "choice", q: "How many nights does Hanukkah last?", options: ["Eight", "Two"], answer: 0 },
        { type: "choice", q: "What is the shamash?", options: ["The helper candle", "A song"], answer: 0 },
        { type: "choice", q: "Diwali is celebrated by...", options: ["Hindus and Sikhs", "Only Christians"], answer: 0 },
        { type: "choice", q: "Who won the Temple back in the Hanukkah story?", options: ["Antiochus", "The Maccabees", "Ravana"], answer: 1 },
        { type: "pick", q: "Which foods are eaten at Hanukkah? There is more than one.", options: ["Potato latkes", "Jam doughnuts", "Hot cross buns"], answers: [0, 1] },
        { type: "choice", q: "What is a dreidel?", options: ["A candle", "A prayer", "A spinning top"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Christmas",
            picture: "/lessons/festivals-of-light/lesson-4.jpg",
            alt: "Children in a church holding Christingles beside an Advent wreath",
            text: [
              "Christians follow Jesus. At Christmas, on 25 December, they celebrate his birth in Bethlehem.",
              "In the Bible, Jesus says 'I am the light of the world'. Christians believe he brings hope and shows people the way to God, like a light in the dark.",
            ],
          },
          {
            heading: "Advent",
            text: [
              "Advent is the time of getting ready for Christmas. It starts four Sundays before Christmas Day.",
              "Many churches and homes have an Advent wreath: a ring of evergreen leaves with four candles. One more candle is lit each Sunday. Sometimes a fifth candle in the middle is lit on Christmas Day for Jesus.",
            ],
          },
          {
            heading: "Christingle",
            text: [
              "Many churches hold a Christingle service near Christmas. Children make a Christingle from an orange.",
              "The orange stands for the world. A red ribbon around it stands for Jesus's love. Four sticks with sweets stand for the four seasons and the good things God gives. And a candle on top stands for Jesus, the light of the world.",
            ],
          },
        ],
        words: [
          { word: "Christian", meaning: "someone who follows Jesus" },
          { word: "Bible", meaning: "the Christian holy book" },
          { word: "Advent", meaning: "the four weeks of getting ready for Christmas" },
          { word: "Christingle", meaning: "an orange with a candle on top, a symbol of Jesus as the light of the world" },
        ],
      },
      practice: {
        intro: "Christingle symbols.",
        questions: [
          {
            type: "match",
            q: "Match each part of a Christingle to what it stands for.",
            pairs: [["Orange", "The world"], ["Red ribbon", "Jesus's love"], ["Candle", "Jesus, the light of the world"], ["Four sticks", "The four seasons"]],
          },
        ],
      },
      task: {
        title: "Make a Christingle",
        intro: "Make your own Christingle and explain what each part means.",
        need: ["An orange", "A strip of red ribbon or red tape", "Four cocktail sticks", "Small sweets or raisins", "A battery tea light, or a small candle a grown-up lights"],
        steps: [
          "Wrap the red ribbon around the middle of the orange and tape it in place.",
          "Push sweets or raisins onto the four cocktail sticks and push them into the orange.",
          "Ask your grown-up to make a small hole in the top and stand the tea light in it.",
          "Explain to your family what each part of your Christingle stands for.",
        ],
      },
      exit: [
        { type: "choice", q: "What do Christians celebrate at Christmas?", options: ["The birth of Jesus", "The harvest", "A new year"], answer: 0 },
        { type: "choice", q: "Who said 'I am the light of the world'?", options: ["Jesus", "Rama", "The Maccabees"], answer: 0 },
        { type: "choice", q: "What is Advent?", options: ["The four weeks of getting ready for Christmas", "A kind of cake"], answer: 0 },
        { type: "choice", q: "How many candles are around the Advent wreath?", options: ["Four", "Eight", "Ten"], answer: 0 },
        { type: "choice", q: "In a Christingle, the orange stands for...", options: ["the world", "the sun", "a fruit bowl"], answer: 0 },
        { type: "gap", q: "Fill the gaps.", text: "Christmas is on ___ December. Christians celebrate the birth of Jesus in ___.", bank: ["25", "13", "Bethlehem", "Jerusalem"], answers: ["25", "Bethlehem"] },
      ],
      grownUp: {
        need: ["An orange, red ribbon, cocktail sticks, sweets", "A battery tea light, or a candle you light"],
        tips: [
          "Help with the cocktail sticks and the hole for the candle. If you use a real candle, it's for grown-ups to light and watch.",
          "Christingle services are often held in local churches in December. Families are usually very welcome.",
        ],
        younger: "Make the Christingle together and talk about the light on top.",
        older: "Find out where the Christingle tradition came from (the Moravian Church in Germany, in 1747).",
      },
    },
    {
      slug: "festivals-of-light-5",
      title: "St Lucia's Day",
      emoji: "👑",
      minutes: 40,
      goal: "I can describe how St Lucia's Day is celebrated and explain what it means.",
      starter: [
        { type: "choice", q: "What do Christians call Jesus?", options: ["The light of the world", "The king of the sea"], answer: 0 },
        { type: "choice", q: "In a Christingle, what does the orange stand for?", options: ["The world", "The moon"], answer: 0 },
        { type: "choice", q: "Advent is...", options: ["the time of getting ready for Christmas", "a summer holiday"], answer: 0 },
        { type: "choice", q: "When is Christmas Day?", options: ["13 December", "25 December", "1 January"], answer: 1 },
        { type: "choice", q: "How many candles are around the Advent wreath?", options: ["Two", "Six", "Four"], answer: 2 },
        { type: "choice", q: "In a Christingle, what does the red ribbon stand for?", options: ["Jesus's love", "The sun"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Who was St Lucia?",
            picture: "/lessons/festivals-of-light/lesson-5.jpg",
            alt: "A St Lucia's Day procession in a snowy Swedish village, led by a girl with a crown of candles",
            text: [
              "Lucia was a young Christian woman who lived in Sicily, in Italy, about 1,700 years ago.",
              "Stories say she brought food to Christians hiding in dark tunnels. To keep her hands free, she wore a crown of candles on her head to light the way.",
              "Her name comes from 'lux', the Latin word for light.",
            ],
          },
          {
            heading: "13 December",
            text: [
              "St Lucia's Day is on 13 December. It's especially loved in Sweden, Norway and Finland, where winter days are very short and dark.",
              "Early in the morning, a girl dressed in a white dress with a red sash, wearing a crown of candles, leads a procession singing the Lucia song.",
            ],
          },
          {
            heading: "Lussekatter",
            text: [
              "People eat saffron buns called lussekatter, shaped like an S, with raisins for eyes.",
              "The festival brings light, music and kindness into the darkest part of the year.",
            ],
          },
        ],
        words: [
          { word: "saint", meaning: "a person Christians remember for being very good and holy" },
          { word: "procession", meaning: "people walking together in a line, often at a celebration" },
          { word: "Scandinavia", meaning: "the countries of northern Europe, including Sweden and Norway" },
        ],
      },
      practice: {
        intro: "St Lucia's Day.",
        questions: [
          { type: "choice", q: "When is St Lucia's Day?", options: ["13 December", "25 December", "1 January"], answer: 0 },
          { type: "choice", q: "What does 'lux' mean in Latin?", options: ["Light", "Crown", "Bread"], answer: 0 },
        ],
      },
      task: {
        title: "A crown of light",
        intro: "Make a paper candle crown and hold your own Lucia procession.",
        need: ["A strip of card long enough to go round your head", "Green paper for leaves, and white and yellow paper for candles and flames", "Glue, tape and scissors"],
        steps: [
          "Make the card strip into a band that fits your head, and tape it.",
          "Glue green paper leaves all round it.",
          "Stick four or five paper candles standing up around the band, with yellow paper flames on top.",
          "Wear your crown and lead a procession around your home, carrying a battery tea light and singing a song.",
        ],
      },
      exit: [
        { type: "choice", q: "Where did St Lucia live?", options: ["Sicily, in Italy", "Sweden", "Scotland"], answer: 0 },
        { type: "choice", q: "What did Lucia wear on her head in the story?", options: ["A crown of candles", "A hat", "A helmet"], answer: 0 },
        { type: "choice", q: "Where is St Lucia's Day especially loved?", options: ["Sweden, Norway and Finland", "Egypt"], answer: 0 },
        { type: "choice", q: "What are lussekatter?", options: ["Saffron buns", "Candles", "Songs"], answer: 0 },
        { type: "choice", q: "What is a saint?", options: ["A person Christians remember for being very good and holy", "A kind of king"], answer: 0 },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Procession", "People walking together in a line"], ["Lussekatter", "S-shaped saffron buns"], ["Scandinavia", "Countries of northern Europe, like Sweden and Norway"]] },
      ],
      grownUp: {
        need: ["Card strip, green, white and yellow paper", "Glue, tape, scissors", "A battery tea light"],
        tips: [
          "Search for 'St Lucia procession' to watch a short video of the singing together. It's very beautiful.",
          "If you like baking, simple saffron bun recipes are easy to find. Turmeric gives a similar colour if you don't have saffron.",
        ],
        younger: "Make the crown together and walk round the house singing.",
        older: "Find out how the winter day length in Stockholm compares with where you live. Why might light matter so much there?",
      },
    },
    {
      slug: "festivals-of-light-6",
      title: "Comparing festivals of light",
      emoji: "✨",
      minutes: 40,
      goal: "I can compare festivals of light, saying what's the same and what's different.",
      starter: [
        { type: "choice", q: "When is St Lucia's Day?", options: ["13 December", "5 November"], answer: 0 },
        { type: "choice", q: "What is a hanukkiah?", options: ["The candlestick lit at Hanukkah", "A lamp lit at Diwali"], answer: 0 },
        { type: "choice", q: "What is a diya?", options: ["A clay lamp lit at Diwali", "An Advent candle"], answer: 0 },
        { type: "choice", q: "What did Lucia wear on her head in the story?", options: ["A helmet", "A crown of candles", "A hat"], answer: 1 },
        { type: "choice", q: "Where is St Lucia's Day especially loved?", options: ["Egypt", "Australia", "Sweden, Norway and Finland"], answer: 2 },
        { type: "choice", q: "What are lussekatter?", options: ["Saffron buns", "Candles"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "What's the same?",
            picture: "/lessons/festivals-of-light/lesson-6.jpg",
            alt: "Children sharing festival foods and crafts: a diya, a paper hanukkiah, a Christingle and a candle crown",
            text: [
              "All the festivals in this unit use light to stand for something good: goodness winning over evil, a miracle, hope, or God's love.",
              "They all bring families and communities together, with special food, songs, stories and decorations.",
            ],
          },
          {
            heading: "What's different?",
            text: [
              "Each one belongs to a different religion and remembers a different story: Rama and Sita, the oil in the Temple, the birth of Jesus, or St Lucia's kindness.",
              "They use light in different ways: rows of diyas, the hanukkiah's eight nights, Advent candles counting down, and a crown of candles.",
            ],
          },
          {
            heading: "Respecting each other",
            text: [
              "Learning about each other's festivals helps us understand and respect people who believe different things from us.",
              "Many people in the UK celebrate more than one festival, or join in with their friends' and neighbours' celebrations.",
            ],
          },
        ],
        words: [
          { word: "compare", meaning: "to look at what's the same and what's different" },
          { word: "community", meaning: "a group of people who live near each other or share something" },
          { word: "belief", meaning: "something a person holds to be true" },
        ],
      },
      practice: {
        intro: "Which festival?",
        questions: [
          {
            type: "match",
            q: "Match each festival to its religion.",
            pairs: [["Diwali", "Hindu"], ["Hanukkah", "Jewish"], ["Christmas", "Christian"], ["Bandi Chhor Divas", "Sikh"]],
          },
          {
            type: "match",
            q: "Match each festival to its light.",
            pairs: [["Diwali", "Diyas"], ["Hanukkah", "The hanukkiah"], ["Advent", "A wreath with four candles"], ["St Lucia's Day", "A crown of candles"]],
          },
        ],
      },
      task: {
        title: "Festivals of light fact file",
        intro: "Make a fact file comparing the festivals.",
        need: ["Paper and pens", "Your crafts from this unit"],
        steps: [
          "Draw a table with columns for Diwali, Hanukkah, Christmas and St Lucia's Day.",
          "Add rows for: religion, when it is, the story, how light is used, and special food.",
          "Fill it in using what you've learned.",
          "Underneath, write two things all the festivals share, and which one you'd most like to see and why.",
        ],
      },
      exit: [
        { type: "choice", q: "Which festival remembers oil that lasted eight days?", options: ["Hanukkah", "Diwali", "Christmas"], answer: 0 },
        { type: "choice", q: "Which festival remembers Rama and Sita?", options: ["Diwali", "St Lucia's Day", "Hanukkah"], answer: 0 },
        { type: "choice", q: "What do all these festivals use light to stand for?", options: ["Something good, like hope", "Being scared"], answer: 0 },
        { type: "choice", q: "Christmas is a festival for...", options: ["Christians", "Hindus", "Jews"], answer: 0 },
        { type: "choice", q: "Why is it good to learn about other people's festivals?", options: ["It helps us understand and respect each other", "It isn't"], answer: 0 },
        { type: "match", q: "Match each festival to the story it remembers.", pairs: [["Diwali", "Rama and Sita"], ["Hanukkah", "The oil in the Temple"], ["Christmas", "The birth of Jesus"], ["St Lucia's Day", "Lucia's kindness"]] },
      ],
      grownUp: {
        need: ["Paper and pens", "Crafts from the unit"],
        tips: [
          "Ask your child which festival they'd most like to experience, and why. There's no right answer.",
          "If your family celebrates a festival of light that isn't in this unit, add it to the fact file.",
        ],
        younger: "Lay out the crafts from the unit and name the festival each one belongs to.",
        older: "Write a short piece answering: 'Why do so many religions use light as a symbol?'",
      },
    },
  ],
};
