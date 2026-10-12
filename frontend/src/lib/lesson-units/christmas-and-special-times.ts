import type { LessonUnit } from "@/lib/lessons";

/** Christmas and special times, for ages 5 to 7. Family celebrations, harvest, Advent, the Christmas story, Christmas symbols, and Diwali and Hanukkah. Good for October to December. */
export const christmasAndSpecialTimes: LessonUnit = {
  slug: "christmas-and-special-times",
  title: "Christmas and special times",
  short: "Special times",
  subject: "Religious Education",
  ages: "5 to 7",
  emoji: "🎄",
  color: "#A8746B",
  summary: "Six gentle lessons on special times: family celebrations, harvest, Advent, the Christmas story, Christmas symbols, and festivals our friends enjoy.",
  cover: "/lessons/units/christmas-and-special-times.jpg",
  lessons: [
    {
      slug: "christmas-and-special-times-1",
      title: "Special times in my family",
      emoji: "🎂",
      minutes: 30,
      goal: "I can talk about a special time in my family.",
      starter: [
        { type: "choice", q: "What do we often put on a birthday cake?", options: ["Socks", "Candles", "Stones"], answer: 1 },
        { type: "choice", q: "How do you feel on your birthday?", options: ["Happy and excited", "Cross"], answer: 0 },
        {
          type: "pick",
          q: "Which of these can be special times? There is more than one.",
          options: ["A birthday", "A wedding", "Brushing your teeth"],
          answers: [0, 1],
        },
        { type: "choice", q: "Who do you often see at a party?", options: ["Nobody", "Family and friends"], answer: 1 },
        { type: "choice", q: "What do we sing at a birthday?", options: ["Happy Birthday", "Twinkle Twinkle", "Baa Baa Black Sheep"], answer: 0 },
        { type: "type", q: "How old are you? Type the number.", answer: ["4", "5", "6", "7", "8", "four", "five", "six", "seven", "eight"] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a special time?",
            text: [
              "A special time is a day that is not like other days. It feels different and exciting.",
              "We might dress up, eat special food or see people we love.",
            ],
          },
          {
            heading: "Birthdays",
            text: [
              "A birthday is a special time for one person. It shows how much they have grown.",
              "We might have a cake with candles. We sing and give cards and presents.",
            ],
          },
          {
            heading: "Family celebrations",
            text: [
              "Families celebrate lots of things. A new baby. A wedding. Moving to a new home.",
              "Every family has its own special times. Some families also have special times that belong to their religion.",
            ],
          },
        ],
        words: [
          { word: "special", meaning: "not like every day" },
          { word: "celebrate", meaning: "do happy things to show a day matters" },
          { word: "family", meaning: "the people who love and look after you" },
        ],
      },
      practice: {
        intro: "Let's think about special times.",
        questions: [
          { type: "choice", q: "Is a birthday a special time?", options: ["No", "Yes"], answer: 1 },
          {
            type: "match",
            q: "Match each special time to something we do.",
            pairs: [["A birthday", "Blow out candles"], ["A wedding", "Wear smart clothes"], ["A new baby", "Send a card to say welcome"]],
          },
          {
            type: "pick",
            q: "What might we do at a celebration? There is more than one.",
            options: ["Eat special food", "See people we love", "Go to bed early and do nothing"],
            answers: [0, 1],
          },
          { type: "choice", q: "Do all families have the same special times?", options: ["Yes, all the same", "No, every family is different"], answer: 1 },
        ],
      },
      task: {
        title: "My special time picture",
        intro: "Draw a special time in your family.",
        need: ["Paper", "Crayons or felt pens", "Family photos, if you have them"],
        steps: [
          "Look at some photos of a special time with your grown-up.",
          "Choose one special time.",
          "Draw who was there.",
          "Draw what you ate or did.",
          "Tell your grown-up how it made you feel.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a special time?", options: ["A day just like every other day", "A day that feels different and exciting"], answer: 1 },
        { type: "choice", q: "What does celebrate mean?", options: ["Do happy things to show a day matters", "Tidy your room"], answer: 0 },
        { type: "choice", q: "A birthday is a special time for...", options: ["everybody in the world", "one person", "a cat only"], answer: 1 },
        {
          type: "pick",
          q: "Which are family celebrations? There is more than one.",
          options: ["A wedding", "A new baby", "Washing up"],
          answers: [0, 1],
        },
        { type: "choice", q: "Some special times belong to a...", options: ["religion", "shoe"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "On a birthday we blow out the ___.", bank: ["candles", "lights", "trees"], answers: ["candles"] },
      ],
      grownUp: {
        need: ["Paper and crayons", "A few family photos"],
        tips: [
          "Family photos are the best way in. Children love seeing themselves as babies or at a past party.",
          "Every family is different. Some children won't celebrate birthdays, or will have a very small family. Keep it about what your family does, with no right answer.",
        ],
        younger: "Have a pretend birthday party for a teddy, with a play-dough cake and a song.",
        older: "Make a 'special times calendar' with your family's celebrations drawn in the right months.",
      },
    },
    {
      slug: "christmas-and-special-times-2",
      title: "Harvest: saying thank you",
      emoji: "🍎",
      minutes: 30,
      goal: "I can say why Christians say thank you at harvest.",
      starter: [
        { type: "choice", q: "What does celebrate mean?", options: ["Do happy things to show a day matters", "Go to sleep"], answer: 0 },
        { type: "choice", q: "A birthday is a special time for...", options: ["one person", "nobody"], answer: 0 },
        {
          type: "pick",
          q: "Which are special times? There is more than one.",
          options: ["A wedding", "A birthday", "Putting on your shoes"],
          answers: [0, 1],
        },
        { type: "choice", q: "Do all families have the same special times?", options: ["Yes", "No"], answer: 1 },
        { type: "match", q: "Match each special time to something we do.", pairs: [["A birthday", "Blow out candles"], ["A wedding", "Wear smart clothes"], ["A new baby", "Send a welcome card"]] },
        { type: "gap", q: "Fill the gap.", text: "On a birthday we sing Happy ___.", bank: ["Birthday", "Monday", "Christmas"], answers: ["Birthday"] },
      ],
      learn: {
        cards: [
          {
            heading: "What is harvest?",
            text: [
              "Harvest is when farmers pick the food they have grown. It happens at the end of summer and in autumn.",
              "Apples, potatoes, wheat and pumpkins are all picked at harvest time.",
            ],
          },
          {
            heading: "Harvest festival",
            text: [
              "Christians believe God made the world and gives us good things to eat.",
              "At harvest festival, Christians say thank you to God. They sing songs and say prayers in church or at school.",
            ],
          },
          {
            heading: "Sharing with others",
            text: [
              "Christians often bring tins and packets of food to harvest festival.",
              "The food is given to people who need it, like a food bank. Saying thank you and sharing go together.",
            ],
          },
        ],
        words: [
          { word: "harvest", meaning: "picking the food that has grown" },
          { word: "thank you", meaning: "words that show we are glad for something" },
          { word: "prayer", meaning: "talking to God" },
          { word: "share", meaning: "give some of what you have to others" },
        ],
      },
      practice: {
        intro: "Let's talk about harvest.",
        questions: [
          { type: "choice", q: "When is harvest?", options: ["In spring", "In autumn"], answer: 1 },
          {
            type: "pick",
            q: "Which foods might be picked at harvest? There is more than one.",
            options: ["Apples", "Potatoes", "Sweets", "Pumpkins"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "Who do Christians say thank you to at harvest festival?", options: ["The shopkeeper", "Their teddy", "God"], answer: 2 },
          { type: "order", q: "Put the bread story in order.", items: ["The farmer plants wheat", "The wheat grows in the sun and rain", "The wheat is harvested", "The baker makes bread"] },
        ],
      },
      task: {
        title: "A thank-you harvest basket",
        intro: "Make a pretend harvest basket and say thank you.",
        need: ["A box or basket", "Some tins, fruit or vegetables from the kitchen", "Paper and crayons"],
        steps: [
          "Find some food in the kitchen with your grown-up.",
          "Put it in your basket.",
          "Say what each food is.",
          "Draw a picture of your basket.",
          "Say thank you for one thing you love to eat.",
        ],
      },
      exit: [
        { type: "choice", q: "What is harvest?", options: ["Picking the food that has grown", "Building a house"], answer: 0 },
        { type: "choice", q: "What do Christians believe about the world?", options: ["God made it", "It is made of cheese"], answer: 0 },
        { type: "choice", q: "What do Christians do at harvest festival?", options: ["Say thank you to God", "Open presents", "Light fireworks"], answer: 0 },
        { type: "choice", q: "Where does harvest food often go?", options: ["In the bin", "To people who need it"], answer: 1 },
        { type: "choice", q: "What is a prayer?", options: ["A kind of fruit", "Talking to God"], answer: 1 },
        { type: "gap", q: "Fill the gaps.", text: "At harvest we say thank ___ and we ___ with others.", bank: ["you", "share", "shout", "me"], answers: ["you", "share"] },
      ],
      grownUp: {
        need: ["A box or basket", "A few food items"],
        tips: [
          "Many schools and churches hold harvest festivals in September or October. If there is a local food bank collection, giving a tin together makes the 'sharing' part real.",
          "You don't need to share a faith to teach it. 'Christians believe...' keeps it accurate and respectful.",
        ],
        younger: "Sort real fruit and vegetables into 'grows on a tree' and 'grows in the ground'.",
        older: "Write a short thank-you prayer or poem for food, for anyone who would like to say it.",
      },
    },
    {
      slug: "christmas-and-special-times-3",
      title: "Advent: waiting for Christmas",
      emoji: "🕯️",
      minutes: 30,
      goal: "I can say what Advent is and how Christians get ready for Christmas.",
      starter: [
        { type: "choice", q: "What is harvest?", options: ["Picking the food that has grown", "A kind of hat"], answer: 0 },
        { type: "choice", q: "Who do Christians thank at harvest festival?", options: ["God", "The postman"], answer: 0 },
        { type: "choice", q: "When is harvest?", options: ["In spring", "In autumn"], answer: 1 },
        {
          type: "pick",
          q: "Which foods are picked at harvest? There is more than one.",
          options: ["Apples", "Wheat", "Chocolate bars"],
          answers: [0, 1],
        },
        { type: "choice", q: "Where can harvest food go?", options: ["To a food bank", "Under the bed"], answer: 0 },
        { type: "type", q: "What do we say when someone gives us something? Type two words.", answer: ["thank you", "Thank you", "thankyou", "Thank You"] },
      ],
      learn: {
        cards: [
          {
            heading: "Waiting for something special",
            text: [
              "Waiting can be hard! Think about waiting for your birthday.",
              "Before Christmas there is a special time of waiting. It is called Advent.",
            ],
          },
          {
            heading: "What is Advent?",
            text: [
              "Advent starts four Sundays before Christmas. Advent means 'coming'.",
              "Christians get ready to remember the birth of Jesus. They believe Jesus is God's Son.",
            ],
          },
          {
            heading: "Calendars and candles",
            text: [
              "An Advent calendar has a little door for each day. It helps us count down to Christmas.",
              "Some Christians light an Advent wreath. It has four candles, one for each Sunday. Many wreaths have a fifth candle in the middle for Christmas Day.",
            ],
          },
        ],
        words: [
          { word: "Advent", meaning: "the time of waiting and getting ready for Christmas" },
          { word: "Jesus", meaning: "the baby born at Christmas. Christians believe he is God's Son" },
          { word: "wreath", meaning: "a ring of green leaves" },
        ],
      },
      practice: {
        intro: "Let's get ready for Christmas.",
        questions: [
          { type: "choice", q: "What does Advent mean?", options: ["Going", "Coming", "Sleeping"], answer: 1 },
          { type: "choice", q: "How many Sunday candles are on an Advent wreath?", options: ["Four", "Ten"], answer: 0 },
          {
            type: "match",
            q: "Match each thing to what it does.",
            pairs: [["Advent calendar", "Counts the days"], ["Advent wreath", "Has candles for Sundays"], ["Christmas Day", "Remembers Jesus being born"]],
          },
          {
            type: "pick",
            q: "How might people get ready for Christmas? There is more than one.",
            options: ["Open an Advent calendar door", "Put up decorations", "Go to the beach for a swim"],
            answers: [0, 1],
          },
        ],
      },
      task: {
        title: "A paper chain countdown",
        intro: "Make a chain to count down the days.",
        need: ["Strips of coloured paper", "Glue stick or sticky tape", "Child-safe scissors", "A grown-up to help cut"],
        steps: [
          "Ask your grown-up to help you cut strips of paper.",
          "Make one strip into a loop and stick it.",
          "Push the next strip through the loop and stick it too.",
          "Keep going until your chain is long.",
          "Take off one loop each day of Advent.",
        ],
      },
      exit: [
        { type: "choice", q: "What is Advent?", options: ["A time of waiting for Christmas", "A summer holiday"], answer: 0 },
        { type: "choice", q: "Advent means...", options: ["going", "coming"], answer: 1 },
        { type: "choice", q: "Whose birth do Christians remember at Christmas?", options: ["Jesus", "The King", "Father Christmas"], answer: 0 },
        { type: "choice", q: "What does an Advent calendar help us do?", options: ["Count down to Christmas", "Tell the time"], answer: 0 },
        { type: "choice", q: "An Advent wreath has a candle for each...", options: ["Monday", "Sunday", "birthday"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "Christians believe Jesus is God's ___.", bank: ["Son", "friend", "dog"], answers: ["Son"] },
      ],
      grownUp: {
        need: ["Coloured paper strips", "Glue or tape", "Child-safe scissors"],
        tips: [
          "Advent begins on the fourth Sunday before Christmas Day, so it is usually late November or early December. Many Advent calendars start on 1 December.",
          "If you have an Advent calendar or wreath, look at it together. If not, the paper chain works just as well.",
        ],
        younger: "Count the loops on the chain together, and count down from five to one.",
        older: "Find out what the Advent candles stand for in some churches: hope, peace, joy and love.",
      },
    },
    {
      slug: "christmas-and-special-times-4",
      title: "The Christmas story",
      emoji: "⭐",
      minutes: 30,
      goal: "I can retell the Christmas story from the Bible.",
      starter: [
        { type: "choice", q: "What is Advent?", options: ["A time of waiting for Christmas", "A kind of cake"], answer: 0 },
        { type: "choice", q: "Advent means...", options: ["coming", "jumping"], answer: 0 },
        { type: "choice", q: "How many Sunday candles are on an Advent wreath?", options: ["Two", "Four", "Twelve"], answer: 1 },
        { type: "choice", q: "What does an Advent calendar help us do?", options: ["Count down to Christmas", "Find our shoes"], answer: 0 },
        { type: "choice", q: "Whose birth do Christians remember at Christmas?", options: ["A snowman", "Jesus"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "An Advent wreath is a ring of green ___.", bank: ["leaves", "socks", "sand"], answers: ["leaves"] },
      ],
      learn: {
        cards: [
          {
            heading: "Mary and the angel",
            text: [
              "The Christmas story is in the Bible, the Christians' holy book.",
              "An angel called Gabriel visited a young woman called Mary. He said, 'You will have a baby. He will be God's Son. Call him Jesus.'",
              "Mary was going to marry Joseph, a carpenter.",
            ],
          },
          {
            heading: "A baby in Bethlehem",
            text: [
              "Mary and Joseph went on a long journey to a town called Bethlehem.",
              "The town was busy. There was no room for them to stay. Baby Jesus was born, and Mary laid him in a manger, a box for animals' food.",
            ],
          },
          {
            heading: "Shepherds and wise men",
            text: [
              "Angels told some shepherds on a hill the happy news. The shepherds hurried to see the baby.",
              "Later, wise men followed a bright star. They brought gifts of gold, frankincense and myrrh.",
            ],
          },
        ],
        words: [
          { word: "Bible", meaning: "the holy book of Christians" },
          { word: "angel", meaning: "a messenger from God" },
          { word: "manger", meaning: "a box that holds food for animals" },
          { word: "shepherd", meaning: "a person who looks after sheep" },
        ],
      },
      practice: {
        intro: "Let's remember the story.",
        questions: [
          { type: "choice", q: "Who visited Mary?", options: ["A shepherd", "The angel Gabriel", "A king"], answer: 1 },
          { type: "choice", q: "Which town was Jesus born in?", options: ["Bethlehem", "London"], answer: 0 },
          {
            type: "match",
            q: "Match each person to what they did.",
            pairs: [["Mary", "Laid baby Jesus in a manger"], ["The shepherds", "Heard the news from angels"], ["The wise men", "Followed a star"]],
          },
          {
            type: "order",
            q: "Put the story in order.",
            items: ["The angel visits Mary", "Mary and Joseph go to Bethlehem", "Jesus is born", "The wise men bring gifts"],
          },
        ],
      },
      task: {
        title: "Act out the Christmas story",
        intro: "Use toys or dress up to tell the story.",
        need: ["Toys or soft toys for the people and animals", "A tea towel or blanket for dressing up", "A small box for a manger"],
        steps: [
          "Choose a toy or person for Mary, Joseph and baby Jesus.",
          "Choose toys for the angel, the shepherds and the wise men.",
          "Make a manger from a small box.",
          "Act out the story with your grown-up.",
          "Tell it again, all by yourself!",
        ],
      },
      exit: [
        { type: "choice", q: "Where is the Christmas story written?", options: ["In the Bible", "On a cereal box"], answer: 0 },
        { type: "choice", q: "What was the angel's name?", options: ["Joseph", "Gabriel"], answer: 1 },
        { type: "choice", q: "What is a manger?", options: ["A bed with pillows", "A box for animals' food", "A kind of boat"], answer: 1 },
        { type: "choice", q: "Who told the shepherds the news?", options: ["Angels", "A wise man"], answer: 0 },
        { type: "choice", q: "What did the wise men follow?", options: ["A river", "A map", "A star"], answer: 2 },
        { type: "gap", q: "Fill the gaps.", text: "Jesus was born in ___. His mother was ___.", bank: ["Bethlehem", "Mary", "Paris", "Gabriel"], answers: ["Bethlehem", "Mary"] },
      ],
      grownUp: {
        need: ["Toys, a tea towel and a small box"],
        tips: [
          "The story comes from two Gospels: Luke (the angel, Bethlehem, the manger, the shepherds) and Matthew (the star and the wise men). The Bible doesn't say there were three wise men, only three gifts.",
          "The Bible doesn't mention an innkeeper or a donkey by name, though they're often in school nativities. It's fine to include them as part of how the story is usually told.",
        ],
        younger: "Read a picture-book version of the nativity and point to each person.",
        older: "Talk about how each person might have felt: Mary when the angel came, the shepherds on the hill.",
      },
    },
    {
      slug: "christmas-and-special-times-5",
      title: "Christmas symbols",
      emoji: "🎁",
      minutes: 30,
      goal: "I can say what some Christmas symbols mean to Christians.",
      starter: [
        { type: "choice", q: "Which town was Jesus born in?", options: ["Bethlehem", "Edinburgh"], answer: 0 },
        { type: "choice", q: "What was baby Jesus laid in?", options: ["A cot", "A manger"], answer: 1 },
        { type: "choice", q: "What did the wise men follow?", options: ["A star", "A cat", "A bus"], answer: 0 },
        { type: "choice", q: "Who visited Mary?", options: ["The angel Gabriel", "A shepherd"], answer: 0 },
        { type: "match", q: "Match each person to what they did.", pairs: [["Mary", "Laid Jesus in a manger"], ["The shepherds", "Heard news from angels"], ["The wise men", "Brought gifts"]] },
        { type: "order", q: "Put the story in order.", items: ["The angel visits Mary", "Jesus is born in Bethlehem", "The shepherds visit"] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a symbol?",
            text: [
              "A symbol is a thing that stands for something else. A red heart can stand for love.",
              "At Christmas we see lots of symbols. Each one helps Christians remember part of the Christmas story.",
            ],
          },
          {
            heading: "Star and light",
            text: [
              "A star on top of a tree reminds Christians of the star the wise men followed.",
              "Christians call Jesus 'the light of the world'. Candles and fairy lights remind them that Jesus brings light and hope.",
            ],
          },
          {
            heading: "Crib and gifts",
            text: [
              "A crib is a small model of the Christmas story. It shows baby Jesus in the manger, with Mary, Joseph and the animals.",
              "Gifts remind Christians of the wise men's gifts. They also believe Jesus was God's gift to the world.",
            ],
          },
        ],
        words: [
          { word: "symbol", meaning: "a thing that stands for something else" },
          { word: "crib", meaning: "a model of baby Jesus in the manger" },
          { word: "gift", meaning: "a present" },
        ],
      },
      practice: {
        intro: "What does it mean?",
        questions: [
          {
            type: "match",
            q: "Match each symbol to what it reminds Christians of.",
            pairs: [["A star", "The star the wise men followed"], ["A candle", "Jesus, the light of the world"], ["A gift", "The wise men's presents"]],
          },
          { type: "choice", q: "What does a crib show?", options: ["A snowman", "Baby Jesus in the manger", "A football match"], answer: 1 },
          {
            type: "pick",
            q: "Which are Christmas symbols? There is more than one.",
            options: ["A star", "A crib", "A sandcastle", "Candles"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "What do Christians call Jesus?", options: ["The light of the world", "The king of the sea"], answer: 0 },
        ],
      },
      task: {
        title: "Make a Christmas star",
        intro: "Make a star to hang up.",
        need: ["Card or thick paper", "Child-safe scissors", "Crayons, glitter or stickers", "String or ribbon", "A grown-up to help cut"],
        steps: [
          "Ask your grown-up to draw a big star on the card.",
          "Cut it out with your grown-up's help.",
          "Decorate your star.",
          "Ask your grown-up to make a small hole and add string.",
          "Hang it up. Tell someone what the star means.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a symbol?", options: ["A thing that stands for something else", "A kind of drum"], answer: 0 },
        { type: "choice", q: "A star reminds Christians of...", options: ["the moon", "the star the wise men followed"], answer: 1 },
        { type: "choice", q: "Why do Christians light candles at Christmas?", options: ["To remember Jesus as the light of the world", "To keep warm"], answer: 0 },
        { type: "choice", q: "What is a crib?", options: ["A model of baby Jesus in the manger", "A Christmas cake", "A sledge"], answer: 0 },
        { type: "choice", q: "Gifts remind Christians of the presents from...", options: ["the shepherds", "the wise men"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "Christians believe Jesus was God's ___ to the world.", bank: ["gift", "letter", "song"], answers: ["gift"] },
      ],
      grownUp: {
        need: ["Card, scissors, decorations and string"],
        tips: [
          "Go on a 'symbol hunt' around the house or on a walk past decorated windows. Ask, 'What could this remind a Christian of?'",
          "Children will also mention Father Christmas, reindeer and snowmen. That's fine: say these are fun parts of Christmas, but they aren't in the Bible story.",
        ],
        younger: "Sort pictures or decorations into 'in the Christmas story' and 'not in the story'.",
        older: "Draw three symbols and write one sentence under each about what it means to Christians.",
      },
    },
    {
      slug: "christmas-and-special-times-6",
      title: "Special times our friends celebrate",
      emoji: "🪔",
      minutes: 30,
      goal: "I can name a special time that other people celebrate.",
      starter: [
        { type: "choice", q: "What is a symbol?", options: ["A thing that stands for something else", "A kind of sock"], answer: 0 },
        { type: "choice", q: "What does a crib show?", options: ["A dog in a basket", "Baby Jesus in the manger"], answer: 1 },
        { type: "choice", q: "What do Christians call Jesus?", options: ["The light of the world", "The king of the jungle"], answer: 0 },
        { type: "match", q: "Match each symbol to what it reminds Christians of.", pairs: [["A star", "The wise men's star"], ["A candle", "Jesus, the light of the world"], ["A gift", "The wise men's presents"]] },
        {
          type: "pick",
          q: "Which are Christmas symbols? There is more than one.",
          options: ["A bucket and spade", "A star", "A crib"],
          answers: [1, 2],
        },
        { type: "choice", q: "Who brought gifts to baby Jesus?", options: ["The shepherds", "The angel", "The wise men"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Lots of special times",
            text: [
              "Christmas is a special time for Christians. People of other religions have their own special times too.",
              "Two of them are Diwali and Hanukkah. Like Christmas, they both use light.",
            ],
          },
          {
            heading: "Diwali",
            text: [
              "Diwali is the festival of lights. Hindus and Sikhs celebrate it in autumn.",
              "People light little clay lamps called diyas. They share sweets, see family and watch fireworks.",
            ],
          },
          {
            heading: "Hanukkah",
            text: [
              "Hanukkah is a Jewish festival in winter. It lasts for eight nights.",
              "Families light candles on a special candlestick called a menorah. They add one more candle each night. They eat food cooked in oil, like doughnuts and potato pancakes.",
            ],
          },
        ],
        words: [
          { word: "Diwali", meaning: "the festival of lights for Hindus and Sikhs" },
          { word: "diya", meaning: "a little clay lamp" },
          { word: "Hanukkah", meaning: "a Jewish festival of light that lasts eight nights" },
          { word: "menorah", meaning: "a special candlestick for Hanukkah" },
        ],
      },
      practice: {
        intro: "Let's learn about our friends' special times.",
        questions: [
          {
            type: "match",
            q: "Match each festival to the people who celebrate it.",
            pairs: [["Christmas", "Christians"], ["Diwali", "Hindus and Sikhs"], ["Hanukkah", "Jewish people"]],
          },
          { type: "choice", q: "What is a diya?", options: ["A kind of cake", "A little clay lamp"], answer: 1 },
          { type: "choice", q: "How many nights does Hanukkah last?", options: ["Two", "Five", "Eight"], answer: 2 },
          {
            type: "pick",
            q: "What do Christmas, Diwali and Hanukkah all have? There is more than one.",
            options: ["Lights", "Time with family", "Snowballs"],
            answers: [0, 1],
          },
        ],
      },
      task: {
        title: "Make a play-dough diya",
        intro: "Make a little lamp like the ones used at Diwali.",
        need: ["Play dough or air-dry clay", "A tealight or battery candle", "Beads or sequins to decorate"],
        steps: [
          "Roll a ball of dough.",
          "Press your thumb in the middle to make a little cup.",
          "Pinch one side to make a point.",
          "Decorate it with beads or patterns.",
          "Put a battery candle beside it. A grown-up must help with a real flame.",
        ],
      },
      exit: [
        { type: "choice", q: "Who celebrates Diwali?", options: ["Hindus and Sikhs", "Only Christians"], answer: 0 },
        { type: "choice", q: "Diwali is the festival of...", options: ["snow", "lights", "flowers"], answer: 1 },
        { type: "choice", q: "Hanukkah is a festival for...", options: ["Jewish people", "Sikhs"], answer: 0 },
        { type: "choice", q: "What is lit at Hanukkah?", options: ["A bonfire", "Candles on a menorah"], answer: 1 },
        { type: "type", q: "How many nights does Hanukkah last? Type the number.", answer: ["8", "eight", "Eight"] },
        { type: "gap", q: "Fill the gap.", text: "At Diwali people light little clay lamps called ___.", bank: ["diyas", "cribs", "stars"], answers: ["diyas"] },
      ],
      grownUp: {
        need: ["Play dough or air-dry clay", "A battery tealight"],
        tips: [
          "Diwali usually falls in October or November and Hanukkah in late November or December; the dates move each year. Jains celebrate Diwali too.",
          "A Hanukkah menorah (often called a hanukiah) has nine branches: eight candles plus a helper candle used to light the others. Use a battery tealight for the diya unless you are right beside your child.",
        ],
        younger: "Turn off the big light and switch on a battery candle. Talk about how light makes a room feel cosy and happy.",
        older: "Draw a Christmas, Diwali and Hanukkah light side by side and say one thing that is the same and one that is different.",
      },
    },
  ],
};
