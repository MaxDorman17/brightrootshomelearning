import type { LessonUnit } from "@/lib/lessons";

/** Before, after and the calendar, for ages 5 to 7. Times of the day, putting things in order with before, after, first, next and last, then the days of the week, the months and seasons, and reading a calendar. */
export const beforeAfterCalendar: LessonUnit = {
  slug: "before-after-and-the-calendar",
  title: "Before, after and the calendar",
  short: "Calendar",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "📅",
  color: "#2F5D3A",
  summary: "Six lessons: morning, afternoon and evening, before and after, first, next and last, the days of the week, the months and seasons, and reading a calendar.",
  cover: "/lessons/units/before-after-and-the-calendar.jpg",
  lessons: [
    {
      slug: "before-after-and-the-calendar-1",
      title: "Morning, afternoon and evening",
      emoji: "🌅",
      minutes: 30,
      goal: "I can say if something happens in the morning, the afternoon or the evening.",
      starter: [
        { type: "choice", q: "When is it dark outside?", options: ["At night", "At lunchtime"], answer: 0 },
        { type: "choice", q: "When do you go to sleep?", options: ["At breakfast time", "At night"], answer: 1 },
        { type: "choice", q: "What do you eat when you first get up?", options: ["Dinner", "Breakfast", "Supper"], answer: 1 },
        {
          type: "pick",
          q: "Which do you do every day? There is more than one.",
          options: ["Brush your teeth", "Fly to the Moon", "Eat", "Sleep"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Where is the Sun in the middle of the day?", options: ["High in the sky", "Hidden under the ground"], answer: 0 },
        { type: "match", q: "Match each meal to its time.", pairs: [["Breakfast", "When you get up"], ["Lunch", "The middle of the day"], ["Dinner", "Later on, before bed"]] },
      ],
      learn: {
        cards: [
          {
            heading: "The morning",
            picture: "/lessons/before-after-and-the-calendar/lesson-1-1.jpg",
            alt: "A child stretching and yawning in bed as the sun peeps through the curtains",
            text: [
              "The day starts in the morning. The Sun comes up and it gets light.",
              "In the morning you wake up, get dressed and eat your breakfast.",
            ],
          },
          {
            heading: "The afternoon",
            picture: "/lessons/before-after-and-the-calendar/lesson-1-2.jpg",
            alt: "Two children kicking through autumn leaves in a park after lunch",
            text: [
              "After lunch it is the afternoon. The Sun is still up and it is light.",
              "In the afternoon you might play outside, go to the park or read a book.",
            ],
          },
          {
            heading: "The evening and the night",
            picture: "/lessons/before-after-and-the-calendar/lesson-1-3.jpg",
            alt: "A child in pyjamas having a bedtime story by a lamp, with a dark window",
            text: [
              "Later on it is the evening. The Sun goes down and it gets dark. In autumn, it gets dark early.",
              "In the evening you have dinner, a bath and a story. Then it is night, and time to sleep.",
            ],
          },
        ],
        words: [
          { word: "morning", meaning: "the start of the day, when you wake up" },
          { word: "afternoon", meaning: "the part of the day after lunch" },
          { word: "evening", meaning: "the end of the day, when it gets dark" },
        ],
      },
      practice: {
        intro: "When do these things happen?",
        questions: [
          { type: "match", q: "Match each thing to its time of day.", pairs: [["Eating breakfast", "Morning"], ["Playing after lunch", "Afternoon"], ["A bedtime story", "Evening"]] },
          { type: "order", q: "Put the parts of the day in order.", items: ["Morning", "Afternoon", "Evening", "Night"] },
          {
            type: "choice",
            q: "You get up at this time. Is it morning or evening?",
            visual: { kind: "clock", hour: 7, minute: 0 },
            options: ["Morning", "Evening"],
            answer: 0,
          },
          {
            type: "pick",
            q: "Which happen in the morning? There is more than one.",
            options: ["Waking up", "Getting dressed", "Going to sleep", "Eating breakfast"],
            answers: [0, 1, 3],
          },
        ],
      },
      task: {
        title: "My day in pictures",
        intro: "Draw your day from morning to night.",
        need: ["A piece of paper", "Crayons or felt pens", "A grown-up to help"],
        steps: [
          "Fold the paper in half, then in half again. Open it out. You have four boxes.",
          "In the first box, draw something you do in the morning.",
          "In the next boxes, draw something you do in the afternoon, then the evening.",
          "In the last box, draw yourself asleep at night.",
          "Tell your grown-up about your day, box by box.",
        ],
      },
      exit: [
        { type: "choice", q: "When do you eat breakfast?", options: ["In the morning", "In the evening"], answer: 0 },
        { type: "choice", q: "What part of the day comes after lunch?", options: ["The morning", "The afternoon", "The night"], answer: 1 },
        { type: "choice", q: "When does it get dark?", options: ["In the morning", "In the evening"], answer: 1 },
        { type: "order", q: "Put the parts of the day in order.", items: ["Morning", "Afternoon", "Evening"] },
        { type: "match", q: "Match each thing to its time of day.", pairs: [["Waking up", "Morning"], ["Having a bath before bed", "Evening"], ["Sleeping", "Night"]] },
        { type: "gap", q: "Fill the gap.", text: "The day starts in the ___.", bank: ["morning", "evening", "night"], answers: ["morning"] },
      ],
      grownUp: {
        need: ["A piece of paper", "Crayons or felt pens"],
        tips: [
          "Talk about the time of day as you go about your day: 'It's the morning, so we're having breakfast.' Little and often fixes the words.",
          "Children often mix up afternoon and evening. A good rule of thumb is that lunch starts the afternoon and dinner starts the evening.",
        ],
        younger: "Just use morning and night, with two boxes: one for getting up and one for going to bed.",
        older: "Add the clock: show 8 o'clock for breakfast and talk about how 8 o'clock comes twice a day, once in the morning and once in the evening.",
      },
    },
    {
      slug: "before-after-and-the-calendar-2",
      title: "Before and after",
      emoji: "⏪",
      minutes: 30,
      goal: "I can use the words before and after to talk about things that happen.",
      starter: [
        { type: "choice", q: "When do you wake up?", options: ["In the morning", "In the evening"], answer: 0 },
        { type: "choice", q: "What part of the day comes after lunch?", options: ["The afternoon", "The morning"], answer: 0 },
        { type: "order", q: "Put the parts of the day in order.", items: ["Morning", "Afternoon", "Evening", "Night"] },
        { type: "choice", q: "When does it get dark?", options: ["In the evening", "In the morning"], answer: 0 },
        { type: "match", q: "Match each thing to its time of day.", pairs: [["Eating breakfast", "Morning"], ["A bedtime story", "Evening"], ["Sleeping", "Night"]] },
        {
          type: "choice",
          q: "You eat lunch at this time. What part of the day is it?",
          visual: { kind: "clock", hour: 12, minute: 0 },
          options: ["The middle of the day", "The middle of the night"],
          answer: 0,
        },
      ],
      learn: {
        cards: [
          {
            heading: "Before",
            picture: "/lessons/before-after-and-the-calendar/lesson-2-1.jpg",
            alt: "A child pulling on socks before putting on wellies by the back door",
            text: [
              "Before means earlier. It is the thing that happens first.",
              "You put your socks on before your shoes. You wash your hands before you eat.",
            ],
          },
          {
            heading: "After",
            picture: "/lessons/before-after-and-the-calendar/lesson-2-2.jpg",
            alt: "A child with muddy hands at a sink after planting bulbs in the garden",
            text: [
              "After means later. It is the thing that happens next.",
              "You dry yourself after your bath. You wash your hands after playing in the mud.",
            ],
          },
          {
            heading: "Before and after with numbers",
            picture: "/lessons/before-after-and-the-calendar/lesson-2-3.jpg",
            alt: "A row of conkers on a table with a child pointing to one in the middle",
            text: [
              "Numbers come before and after too. When we count, 4 comes before 5, and 6 comes after 5.",
              "The number just after is one more. The number just before is one less.",
            ],
          },
        ],
        words: [
          { word: "before", meaning: "earlier, or just in front" },
          { word: "after", meaning: "later, or just behind" },
        ],
      },
      practice: {
        intro: "What comes before, and what comes after?",
        questions: [
          { type: "choice", q: "What do you put on before your shoes?", options: ["Your hat", "Your socks"], answer: 1 },
          { type: "choice", q: "What do you do after your bath?", options: ["Dry yourself", "Get in the bath"], answer: 0 },
          {
            type: "type",
            q: "Which number comes just after 6?",
            visual: { kind: "numberline", from: 0, to: 10, jump: [6, 7] },
            answer: ["7", "seven"],
          },
          {
            type: "type",
            q: "Which number comes just before 4?",
            visual: { kind: "numberline", from: 0, to: 10 },
            answer: ["3", "three"],
          },
        ],
      },
      task: {
        title: "Before and after cards",
        intro: "Draw four pictures and play a before and after game.",
        need: ["Four small pieces of paper", "Crayons or felt pens", "A grown-up to play with"],
        steps: [
          "Draw a seed on one piece of paper and a flower on another.",
          "Draw a whole apple on the next one, and an apple core on the last one.",
          "Mix up your cards. Can you find which picture comes before and which comes after?",
          "Now play with your grown-up. They say something you do, like 'brush my teeth'. You say what you do before it, or after it.",
        ],
      },
      exit: [
        { type: "choice", q: "What does before mean?", options: ["Earlier", "Later"], answer: 0 },
        { type: "choice", q: "What do you do before you eat?", options: ["Wash your hands", "Go to sleep"], answer: 0 },
        { type: "choice", q: "What happens after a seed is planted and watered?", options: ["It grows", "It goes back in the packet"], answer: 0 },
        {
          type: "type",
          q: "Which number comes just after 8?",
          visual: { kind: "numberline", from: 0, to: 10, jump: [8, 9] },
          answer: ["9", "nine"],
        },
        { type: "type", q: "Which number comes just before 10?", answer: ["9", "nine"] },
        { type: "gap", q: "Fill the gaps.", text: "I put my coat on ___ I go outside. I take it off ___ I come in.", bank: ["before", "after"], answers: ["before", "after"] },
      ],
      grownUp: {
        need: ["Four small pieces of paper", "Crayons or felt pens"],
        tips: [
          "Use before and after all day: 'Before lunch we'll tidy up. After lunch we'll go out.' Children learn these words best from real life.",
          "Counting along a row of real objects, like conkers or buttons, helps children see that the number after is one more and the number before is one less.",
        ],
        younger: "Stick to things your child does every day, like socks before shoes, and numbers up to 5.",
        older: "Try numbers up to 20: what comes just before 15? Just after 19? Then try two steps: what comes two after 8?",
      },
    },
    {
      slug: "before-after-and-the-calendar-3",
      title: "First, next, last",
      emoji: "🥇",
      minutes: 30,
      goal: "I can put things in order and use the words first, next and last.",
      starter: [
        { type: "choice", q: "What do you put on before your shoes?", options: ["Your socks", "Your scarf"], answer: 0 },
        { type: "choice", q: "What does after mean?", options: ["Earlier", "Later"], answer: 1 },
        { type: "type", q: "Which number comes just after 5?", answer: ["6", "six"] },
        {
          type: "type",
          q: "Which number comes just before 7?",
          visual: { kind: "numberline", from: 0, to: 10 },
          answer: ["6", "six"],
        },
        { type: "choice", q: "What do you do after your bath?", options: ["Run the water", "Dry yourself"], answer: 1 },
        { type: "order", q: "Put the parts of the day in order.", items: ["Morning", "Afternoon", "Evening", "Night"] },
      ],
      learn: {
        cards: [
          {
            heading: "First",
            picture: "/lessons/before-after-and-the-calendar/lesson-3-1.jpg",
            alt: "Three children in a line at a garden gate, the child at the front holding it open",
            text: [
              "First is the very start. It is the thing at the front, or the thing you do before anything else.",
              "When we make toast, first we put the bread in the toaster.",
            ],
          },
          {
            heading: "Next and then",
            picture: "/lessons/before-after-and-the-calendar/lesson-3-2.jpg",
            alt: "A child and a grown-up buttering toast at a kitchen table",
            text: [
              "Next is what comes after. We also say then.",
              "Next, the toast pops up. Then we spread on the butter.",
            ],
          },
          {
            heading: "Last",
            picture: "/lessons/before-after-and-the-calendar/lesson-3-3.jpg",
            alt: "A child taking a big bite of a slice of toast",
            text: [
              "Last is the very end. Nothing comes after it.",
              "Last of all, we eat the toast! In a line, the last person is at the back.",
              "First, next, then, last. These words help us tell things in the right order.",
            ],
          },
        ],
        words: [
          { word: "first", meaning: "at the very start or the front" },
          { word: "next", meaning: "straight after" },
          { word: "last", meaning: "at the very end or the back" },
        ],
      },
      practice: {
        intro: "Let's put things in order.",
        questions: [
          { type: "order", q: "Put the steps for making toast in order.", items: ["Put the bread in the toaster", "The toast pops up", "Spread on the butter", "Eat the toast"] },
          { type: "order", q: "Put the steps for planting a seed in order.", items: ["Fill a pot with soil", "Push in the seed", "Water it", "Watch it grow"] },
          { type: "choice", q: "In a line, where is the first person?", options: ["At the front", "At the back"], answer: 0 },
          {
            type: "type",
            q: "Count the dots. Is the last one number 4, 5 or 6?",
            visual: { kind: "dots", rows: 1, cols: 5 },
            answer: ["5", "five"],
          },
        ],
      },
      task: {
        title: "A toy race",
        intro: "Race your toys and say who came first, next and last.",
        need: ["Three or four toy cars, balls or teddies", "A tray, a big book or a cushion to make a slope", "A grown-up to help"],
        steps: [
          "Make a slope by leaning a tray or big book on a cushion.",
          "Let your toys roll or slide down, one at a time or all together.",
          "Line them up in the order they finished.",
          "Say who came first, who came next and who came last.",
          "Race again. Did the same toy come first?",
        ],
      },
      exit: [
        { type: "choice", q: "Which word means at the very end?", options: ["First", "Last"], answer: 1 },
        { type: "choice", q: "Which word means at the very start?", options: ["First", "Next", "Last"], answer: 0 },
        { type: "order", q: "Put these in order.", items: ["First", "Next", "Last"] },
        { type: "order", q: "Put the steps for getting dressed in order.", items: ["Put on your pants", "Put on your trousers", "Put on your shoes"] },
        { type: "choice", q: "In a line, where is the last person?", options: ["At the front", "At the back"], answer: 1 },
        { type: "gap", q: "Fill the gaps.", text: "___ we plant the seed. ___ we water it.", bank: ["First", "Next"], answers: ["First", "Next"] },
      ],
      grownUp: {
        need: ["Three or four toy cars, balls or teddies", "A tray or big book and a cushion"],
        tips: [
          "Say first, next, then and last out loud when you do jobs together, like cooking or getting ready to go out. It is great for maths and for story writing too.",
          "First, second and third are the counting words for order. Bring them in gently once first, next and last feel easy.",
        ],
        younger: "Use just two or three steps and stick to first and last.",
        older: "Race five toys and use first, second, third, fourth and fifth. Then tell the steps of a favourite story in order.",
      },
    },
    {
      slug: "before-after-and-the-calendar-4",
      title: "Days of the week",
      emoji: "🗓️",
      minutes: 30,
      goal: "I can say the days of the week in order.",
      starter: [
        { type: "choice", q: "Which word means at the very start?", options: ["Last", "First"], answer: 1 },
        { type: "order", q: "Put these in order.", items: ["First", "Next", "Last"] },
        { type: "choice", q: "In a line, where is the last person?", options: ["At the back", "At the front"], answer: 0 },
        { type: "order", q: "Put the steps for making toast in order.", items: ["Put the bread in the toaster", "The toast pops up", "Spread on the butter", "Eat the toast"] },
        { type: "type", q: "Which number comes just after 6?", answer: ["7", "seven"] },
        { type: "choice", q: "What does before mean?", options: ["Later", "Earlier"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Seven days",
            picture: "/lessons/before-after-and-the-calendar/lesson-4-1.jpg",
            alt: "A child pointing at a row of seven blank paper squares pegged on a string",
            text: [
              "A week has seven days. Each day has its own name.",
              "They always come in the same order: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.",
            ],
          },
          {
            heading: "Round and round",
            picture: "/lessons/before-after-and-the-calendar/lesson-4-2.jpg",
            alt: "Children holding hands in a circle in an autumn garden",
            text: [
              "After Sunday, a new week starts, and it is Monday again.",
              "The days go round and round, like a circle that never ends.",
            ],
          },
          {
            heading: "The weekend",
            picture: "/lessons/before-after-and-the-calendar/lesson-4-3.jpg",
            alt: "A family making pancakes together in a sunny kitchen on a slow morning",
            text: [
              "Saturday and Sunday are called the weekend. Lots of people have a rest or do something fun.",
              "The other five days are weekdays. Many children go to school and many grown-ups go to work on weekdays.",
            ],
          },
        ],
        words: [
          { word: "week", meaning: "seven days, from Monday to Sunday" },
          { word: "weekend", meaning: "Saturday and Sunday" },
          { word: "weekday", meaning: "Monday, Tuesday, Wednesday, Thursday or Friday" },
        ],
      },
      practice: {
        intro: "Let's practise the days of the week.",
        questions: [
          { type: "order", q: "Put the days in order.", items: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
          {
            type: "type",
            q: "Each dot is one day. How many days are in a week?",
            visual: { kind: "dots", rows: 1, cols: 7 },
            answer: ["7", "seven"],
          },
          { type: "choice", q: "Which day comes after Sunday?", options: ["Saturday", "Monday", "Friday"], answer: 1 },
          {
            type: "pick",
            q: "Which days are the weekend? There is more than one.",
            options: ["Monday", "Saturday", "Wednesday", "Sunday"],
            answers: [1, 3],
          },
        ],
      },
      task: {
        title: "A days of the week washing line",
        intro: "Make a washing line of days and keep track of the week.",
        need: ["Seven socks, or seven pieces of paper", "A piece of string or ribbon", "Pegs or sticky tape", "A grown-up to help"],
        steps: [
          "Ask your grown-up to tie the string up low, between two chairs.",
          "Peg up seven socks, one for each day. Say the name of each day as you peg it up.",
          "Make the last two socks special. Turn them inside out to show they are the weekend.",
          "Point to the sock for today. Which sock is tomorrow?",
          "Each morning this week, move a peg along to the new day.",
        ],
      },
      exit: [
        { type: "type", q: "How many days are in a week?", answer: ["7", "seven"] },
        { type: "choice", q: "Which day comes after Monday?", options: ["Tuesday", "Sunday", "Friday"], answer: 0 },
        { type: "choice", q: "Which day comes before Saturday?", options: ["Sunday", "Friday"], answer: 1 },
        { type: "order", q: "Put the days in order.", items: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
        { type: "choice", q: "What do we call Saturday and Sunday?", options: ["The weekend", "The morning"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "After Sunday comes ___.", bank: ["Monday", "Saturday", "Friday"], answers: ["Monday"] },
      ],
      grownUp: {
        need: ["Seven socks or pieces of paper", "String or ribbon", "Pegs or sticky tape"],
        tips: [
          "Singing the days to a tune you know helps them stick. Say the day each morning at breakfast: 'Today is Tuesday.'",
          "Link days to things that happen in your home, like swimming on Wednesday or a family visit on Sunday. Real events make the days easier to tell apart.",
        ],
        younger: "Focus on today, and on the weekend days. Saying the whole list together is enough for now.",
        older: "Write the names of the days on the paper squares, and talk about yesterday, today and tomorrow.",
      },
    },
    {
      slug: "before-after-and-the-calendar-5",
      title: "Months and seasons",
      emoji: "🍂",
      minutes: 30,
      goal: "I can name the four seasons and know that there are twelve months in a year.",
      starter: [
        { type: "type", q: "How many days are in a week?", answer: ["7", "seven"] },
        { type: "choice", q: "Which day comes after Sunday?", options: ["Monday", "Saturday"], answer: 0 },
        { type: "choice", q: "Which day comes before Thursday?", options: ["Friday", "Wednesday"], answer: 1 },
        { type: "order", q: "Put the days in order.", items: ["Monday", "Tuesday", "Wednesday", "Thursday"] },
        {
          type: "pick",
          q: "Which days are the weekend? There is more than one.",
          options: ["Saturday", "Tuesday", "Sunday", "Friday"],
          answers: [0, 2],
        },
        { type: "choice", q: "Which word means at the very end?", options: ["Last", "First"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Twelve months",
            picture: "/lessons/before-after-and-the-calendar/lesson-5-1.jpg",
            alt: "Twelve blank paper squares in three rows on a wall, each with a small picture sticker",
            text: [
              "A year is a long time. We split it into twelve months.",
              "They go in order: January, February, March, April, May, June, July, August, September, October, November, December.",
              "After December, a new year starts with January.",
            ],
          },
          {
            heading: "Four seasons",
            picture: "/lessons/before-after-and-the-calendar/lesson-5-2.jpg",
            alt: "One tree shown four times: with blossom, with green leaves, with orange leaves and bare with snow",
            text: [
              "A year also has four seasons: spring, summer, autumn and winter.",
              "In spring, plants start to grow. Summer is warm and sunny. In autumn, leaves fall. Winter is cold and dark.",
            ],
          },
          {
            heading: "Autumn is now",
            picture: "/lessons/before-after-and-the-calendar/lesson-5-3.jpg",
            alt: "A child in a woolly hat collecting conkers and red leaves in a basket",
            text: [
              "September, October and November are autumn months.",
              "In autumn, leaves turn red and orange, conkers fall from trees and the days get shorter. Next comes winter.",
            ],
          },
        ],
        words: [
          { word: "month", meaning: "one of the twelve parts of a year" },
          { word: "season", meaning: "one of the four parts of a year with its own weather" },
          { word: "year", meaning: "twelve months, or four seasons" },
        ],
      },
      practice: {
        intro: "Let's think about the year.",
        questions: [
          { type: "order", q: "Put the seasons in order, starting with spring.", items: ["Spring", "Summer", "Autumn", "Winter"] },
          {
            type: "type",
            q: "Each dot is one month. How many months are in a year?",
            visual: { kind: "dots", rows: 3, cols: 4 },
            answer: ["12", "twelve"],
          },
          { type: "match", q: "Match each season to what you might see.", pairs: [["Spring", "Baby lambs and blossom"], ["Summer", "Hot sun and paddling pools"], ["Autumn", "Falling leaves and conkers"], ["Winter", "Frost and snow"]] },
          { type: "choice", q: "Which month comes first in the year?", options: ["December", "January", "March"], answer: 1 },
        ],
      },
      task: {
        title: "A seasons tree",
        intro: "Make a picture of one tree in all four seasons.",
        need: ["A piece of paper", "Crayons or felt pens", "Some fallen leaves from outside (optional)", "Glue (optional)", "A grown-up to help"],
        steps: [
          "Fold your paper into four boxes.",
          "Draw the same tree in each box. Just a trunk and branches.",
          "In the first box, add pink blossom for spring. In the next, add green leaves for summer.",
          "In the third box, add red and orange leaves for autumn. You can glue on real leaves.",
          "In the last box, leave the branches bare and add snow for winter.",
        ],
      },
      exit: [
        { type: "type", q: "How many seasons are in a year?", answer: ["4", "four"] },
        { type: "type", q: "How many months are in a year?", answer: ["12", "twelve"] },
        { type: "choice", q: "Which season comes after autumn?", options: ["Spring", "Winter", "Summer"], answer: 1 },
        { type: "choice", q: "Which month comes after December?", options: ["January", "November"], answer: 0 },
        {
          type: "pick",
          q: "Which are autumn months? There is more than one.",
          options: ["September", "October", "May", "November"],
          answers: [0, 1, 3],
        },
        { type: "match", q: "Match each season to its weather.", pairs: [["Summer", "Warm and sunny"], ["Winter", "Cold and frosty"], ["Autumn", "Windy, with falling leaves"]] },
      ],
      grownUp: {
        need: ["A piece of paper and crayons", "A few fallen leaves (optional)"],
        tips: [
          "In the UK, spring is usually March to May, summer June to August, autumn September to November and winter December to February.",
          "Talk about the month your child's birthday is in, and which season that is. It gives them a hook for the whole year.",
        ],
        younger: "Focus on the four seasons and what they look like. The twelve months can come later.",
        older: "Say the months in order together, and sort them into the four seasons.",
      },
    },
    {
      slug: "before-after-and-the-calendar-6",
      title: "Reading a calendar",
      emoji: "📆",
      minutes: 30,
      goal: "I can use a calendar to find today, yesterday and tomorrow.",
      starter: [
        { type: "type", q: "How many months are in a year?", answer: ["12", "twelve"] },
        { type: "order", q: "Put the seasons in order, starting with spring.", items: ["Spring", "Summer", "Autumn", "Winter"] },
        { type: "choice", q: "Which season comes after autumn?", options: ["Winter", "Summer"], answer: 0 },
        { type: "choice", q: "Which month comes first in the year?", options: ["January", "December"], answer: 0 },
        { type: "type", q: "How many days are in a week?", answer: ["7", "seven"] },
        { type: "match", q: "Match each season to what you might see.", pairs: [["Autumn", "Falling leaves"], ["Winter", "Snow"], ["Spring", "Blossom"]] },
      ],
      learn: {
        cards: [
          {
            heading: "What is a calendar?",
            picture: "/lessons/before-after-and-the-calendar/lesson-6-1.jpg",
            alt: "A grown-up and child looking at a big wall calendar of blank squares, some with stickers",
            text: [
              "A calendar shows the days of a month. Each square is one day.",
              "Each row is one week. The days go along the row, then down to the next row.",
              "Each day has a number called the date. The dates count up: 1, 2, 3 and so on.",
            ],
          },
          {
            heading: "Yesterday, today and tomorrow",
            picture: "/lessons/before-after-and-the-calendar/lesson-6-2.jpg",
            alt: "A child pointing at a calendar square with a star sticker on it",
            text: [
              "Today is the day it is now. Yesterday was the day before today. Tomorrow is the day after today.",
              "If today is the 5th, yesterday was the 4th and tomorrow is the 6th. It works just like counting.",
            ],
          },
          {
            heading: "Counting down to a special day",
            picture: "/lessons/before-after-and-the-calendar/lesson-6-3.jpg",
            alt: "Two children colouring in calendar squares, with a birthday cake drawn a few squares ahead",
            text: [
              "We use a calendar to see when special days are coming, like a birthday or a trip.",
              "Count the squares after today, up to and including the special day. That tells you how many days you have to wait.",
            ],
          },
        ],
        words: [
          { word: "calendar", meaning: "a chart that shows the days, weeks and months" },
          { word: "date", meaning: "the number of the day in the month" },
          { word: "tomorrow", meaning: "the day after today" },
        ],
      },
      practice: {
        intro: "Let's use a calendar.",
        questions: [
          { type: "choice", q: "Today is Tuesday. What day is tomorrow?", options: ["Monday", "Wednesday", "Sunday"], answer: 1 },
          { type: "choice", q: "Today is Friday. What day was yesterday?", options: ["Thursday", "Saturday"], answer: 0 },
          {
            type: "type",
            q: "Today is the 5th. What date is it in two days?",
            visual: { kind: "numberline", from: 1, to: 10, jump: [5, 7] },
            answer: ["7", "7th", "seven", "seventh"],
          },
          {
            type: "type",
            q: "Each dot is a day to wait for a party. How many days do you have to wait?",
            visual: { kind: "dots", rows: 1, cols: 4 },
            answer: ["4", "four"],
          },
        ],
      },
      task: {
        title: "Make a countdown calendar",
        intro: "Make a calendar to count down to something special.",
        need: ["A piece of paper", "A pencil and crayons", "Stickers, or a crayon to colour with", "A grown-up to help"],
        steps: [
          "Choose something special with your grown-up, like a visit, a birthday or Bonfire Night.",
          "Ask your grown-up to help you draw one square for each day you have to wait.",
          "Draw a picture of the special thing in the last square.",
          "Each day, put a sticker on or colour in one square.",
          "Count the squares that are left. How many more days to wait?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a calendar for?", options: ["Showing the days and dates", "Cooking dinner"], answer: 0 },
        { type: "choice", q: "On a calendar, what does one square show?", options: ["One day", "One year"], answer: 0 },
        { type: "choice", q: "Today is Sunday. What day is tomorrow?", options: ["Saturday", "Monday"], answer: 1 },
        { type: "choice", q: "Today is Wednesday. What day was yesterday?", options: ["Tuesday", "Thursday"], answer: 0 },
        {
          type: "type",
          q: "Today is the 8th. What date was it yesterday?",
          visual: { kind: "numberline", from: 1, to: 10 },
          answer: ["7", "7th", "seven", "seventh"],
        },
        { type: "gap", q: "Fill the gaps.", text: "The day before today is ___. The day after today is ___.", bank: ["yesterday", "tomorrow"], answers: ["yesterday", "tomorrow"] },
      ],
      grownUp: {
        need: ["A piece of paper, a pencil and crayons", "Stickers (optional)"],
        tips: [
          "If you have a family calendar, look at it together each morning. Find today, and talk about what is coming up this week.",
          "Real calendars are full of words and numbers, so take it slowly. Pointing and counting squares is the main skill for now.",
        ],
        younger: "Keep the countdown short, about three to five days, and just talk about today and tomorrow.",
        older: "Look at a real calendar for this month. Find the day of the week for a date, and count how many days are in the month.",
      },
    },
  ],
};
