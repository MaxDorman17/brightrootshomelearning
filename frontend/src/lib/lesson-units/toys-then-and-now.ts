import type { LessonUnit } from "@/lib/lessons";

/** Toys then and now: KS1 history, changes within living memory, for ages 5 to 7. A grown-up reads it aloud with the child. */
export const toysThenAndNow: LessonUnit = {
  slug: "toys-then-and-now",
  title: "Toys then and now",
  short: "Toys",
  subject: "History",
  ages: "5 to 7",
  emoji: "🧸",
  color: "#C9A27E",
  summary: "Six playful lessons about toys: our favourites, how to tell old from new, what grown-ups and Victorian children played with, and making an old-fashioned toy.",
  cover: "/lessons/units/toys-then-and-now.jpg",
  lessons: [
    {
      slug: "toys-then-and-now-1",
      title: "My favourite toys",
      emoji: "🧸",
      minutes: 30,
      goal: "I can talk about my favourite toy and sort toys into groups.",
      starter: [
        { type: "choice", q: "What is a toy?", options: ["Something you eat", "Something you play with", "Something you wear"], answer: 1 },
        { type: "pick", q: "Which of these are toys? There is more than one.", options: ["A ball", "A spoon", "A teddy", "A toothbrush"], answers: [0, 2] },
        { type: "choice", q: "Which toy can you cuddle?", options: ["A soft teddy", "A toy car"], answer: 0 },
        { type: "choice", q: "Which toy do you kick?", options: ["A jigsaw", "A doll", "A football"], answer: 2 },
        { type: "match", q: "Match each toy to how you play with it.", pairs: [["Ball", "Throw it"], ["Bricks", "Build with them"], ["Crayons", "Draw with them"]] },
        { type: "choice", q: "Did children long ago have toys too?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Toys we love",
            text: [
              "Everyone has a favourite toy. It might be soft and cuddly. It might be fast, or fun to build with.",
              "What is your favourite toy? Can you say why you like it?",
            ],
          },
          {
            heading: "Sorting toys",
            text: [
              "We can sort toys into groups. Some toys we push or pull, like a toy car.",
              "Some toys we cuddle, like a teddy. Some toys we build with, like bricks.",
              "We can also sort toys by colour, by size, or by what they are made of.",
            ],
          },
          {
            heading: "Toys change",
            text: [
              "When you were a baby, you played with rattles and soft books. Now you play with different toys.",
              "Toys change as we grow. Toys have changed over a long, long time too. That is what we will find out about.",
            ],
          },
        ],
        words: [
          { word: "toy", meaning: "a thing you play with" },
          { word: "favourite", meaning: "the one you like best" },
          { word: "sort", meaning: "put things into groups" },
        ],
      },
      practice: {
        intro: "Let's sort some toys.",
        questions: [
          { type: "pick", q: "Which toys can you push along? There is more than one.", options: ["A toy car", "A teddy", "A toy train", "A book"], answers: [0, 2] },
          { type: "match", q: "Match each toy to its group.", pairs: [["Teddy", "Cuddly toys"], ["Bricks", "Building toys"], ["Toy car", "Push toys"]] },
          { type: "choice", q: "Which toy did you most likely play with as a baby?", options: ["A bike", "A rattle", "A board game"], answer: 1 },
          { type: "choice", q: "Favourite means...", options: ["the one you like best", "the biggest one"], answer: 0 },
        ],
      },
      task: {
        title: "My toy show",
        intro: "Put on a little show of your toys.",
        need: ["Five or six of your toys", "Paper and crayons"],
        steps: [
          "Choose five or six toys and bring them to the table.",
          "Sort them into groups. Cuddly, push, build, or your own idea.",
          "Pick your favourite toy. Tell your grown-up why you love it.",
          "Draw a picture of your favourite toy.",
        ],
      },
      exit: [
        { type: "choice", q: "What does favourite mean?", options: ["The oldest one", "The one you like best", "The smallest one"], answer: 1 },
        { type: "choice", q: "What does sort mean?", options: ["Put things into groups", "Throw things away"], answer: 0 },
        { type: "pick", q: "Which are cuddly toys? There is more than one.", options: ["A toy car", "A teddy", "A soft rabbit", "Bricks"], answers: [1, 2] },
        { type: "choice", q: "Which toy do you build with?", options: ["A teddy", "A ball", "Bricks"], answer: 2 },
        { type: "choice", q: "Do the toys you play with change as you grow?", options: ["Yes", "No"], answer: 0 },
        { type: "match", q: "Match each toy to its group.", pairs: [["Toy train", "Push toys"], ["Soft bear", "Cuddly toys"], ["Blocks", "Building toys"]] },
      ],
      grownUp: {
        need: ["Five or six of your child's toys", "Paper and crayons"],
        tips: [
          "Let your child choose how to sort. There is no wrong answer if they can say why.",
          "Mention a toy your child loved as a baby. It helps them see that toys change over time.",
        ],
        younger: "Sort just two groups: soft toys and hard toys.",
        older: "Sort the same toys two different ways, for example by what they do and then by colour.",
      },
    },
    {
      slug: "toys-then-and-now-2",
      title: "Old or new?",
      emoji: "🔍",
      minutes: 30,
      goal: "I can look for clues to tell if a toy is old or new.",
      starter: [
        { type: "choice", q: "What does favourite mean?", options: ["The one you like best", "The heaviest one"], answer: 0 },
        { type: "choice", q: "What does sort mean?", options: ["Paint things", "Put things into groups", "Hide things"], answer: 1 },
        { type: "choice", q: "Which is a cuddly toy?", options: ["A toy car", "A teddy"], answer: 1 },
        { type: "choice", q: "Which toy did you play with as a baby?", options: ["A scooter", "A board game", "A rattle"], answer: 2 },
        { type: "match", q: "Match each toy to its group.", pairs: [["Bricks", "Building toys"], ["Teddy", "Cuddly toys"], ["Toy car", "Push toys"]] },
        { type: "choice", q: "Do toys change over time?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Toy detectives",
            text: [
              "A detective looks for clues. We can be toy detectives.",
              "We look closely at a toy to work out if it is old or new.",
            ],
          },
          {
            heading: "Clues it is old",
            text: [
              "An old toy might be worn or scratched. The paint might be faded or chipped.",
              "A teddy might be bald in places from lots of cuddles.",
              "Very old toys were often made of wood, metal or cloth.",
            ],
          },
          {
            heading: "Clues it is new",
            text: [
              "A new toy often looks bright and clean. Lots of new toys are made of plastic.",
              "Some new toys need batteries. Some have screens, lights or sounds.",
              "Be careful! Some new toys are made of wood too. So look for lots of clues.",
            ],
          },
        ],
        words: [
          { word: "old", meaning: "made a long time ago" },
          { word: "new", meaning: "made not long ago" },
          { word: "clue", meaning: "something that helps you find out" },
          { word: "worn", meaning: "rubbed and tired from lots of use" },
        ],
      },
      practice: {
        intro: "Look for the clues.",
        questions: [
          { type: "choice", q: "A teddy has bald patches and a faded bow. Is it old or new?", options: ["Old", "New"], answer: 0 },
          { type: "choice", q: "A toy has a screen and needs batteries. Is it more likely old or new?", options: ["Old", "New"], answer: 1 },
          { type: "pick", q: "Which are clues that a toy is old? There is more than one.", options: ["Chipped paint", "Bright and shiny", "Faded colours", "Needs batteries"], answers: [0, 2] },
          { type: "match", q: "Match the clue to old or new.", pairs: [["Scratched and worn", "Probably old"], ["Lights and sounds", "Probably new"], ["Still in its box", "Not played with yet"]] },
        ],
      },
      task: {
        title: "Toy detective",
        intro: "Look closely at some toys and find the clues.",
        need: ["Three or four toys, some old and some new", "A magnifying glass if you have one"],
        steps: [
          "Ask your grown-up for some old toys and some new toys.",
          "Look very closely at each one. Use a magnifying glass if you have one.",
          "Look for scratches, faded paint and worn bits.",
          "Make two piles: old and new.",
          "Tell your grown-up one clue for each toy.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a clue?", options: ["A kind of toy", "Something that helps you find out", "A colour"], answer: 1 },
        { type: "choice", q: "Chipped, faded paint is a clue that a toy is...", options: ["new", "old"], answer: 1 },
        { type: "choice", q: "Which toy is most likely new?", options: ["A scratched wooden horse", "A worn cloth doll", "A robot with lights and sounds"], answer: 2 },
        { type: "pick", q: "Which are clues a toy is new? There is more than one.", options: ["Needs batteries", "Bald patches", "Has a screen", "Chipped paint"], answers: [0, 2] },
        { type: "choice", q: "Can a new toy be made of wood?", options: ["Yes", "No"], answer: 0, why: "Some new toys are made of wood, so we look for lots of clues." },
        { type: "choice", q: "What does worn mean?", options: ["Rubbed and tired from lots of use", "Brand new"], answer: 0 },
      ],
      grownUp: {
        need: ["A mix of old and new toys (an old family toy is perfect)", "A magnifying glass, if you have one"],
        tips: [
          "If you have a toy from your own childhood, this is the lesson to bring it out.",
          "Push for reasons. 'How do you know?' is the key question.",
        ],
        younger: "Hold up one old toy and one new toy. Ask which is old and point to one clue together.",
        older: "Put three toys in order from oldest to newest and explain the clues.",
      },
    },
    {
      slug: "toys-then-and-now-3",
      title: "My grown-ups' toys",
      emoji: "👵",
      minutes: 30,
      goal: "I can ask my family questions about the toys they played with.",
      starter: [
        { type: "choice", q: "What is a clue?", options: ["Something that helps you find out", "A kind of game"], answer: 0 },
        { type: "choice", q: "Faded, chipped paint is a clue a toy is...", options: ["new", "old"], answer: 1 },
        { type: "choice", q: "A toy with a screen is most likely...", options: ["old", "very old", "new"], answer: 2 },
        { type: "pick", q: "Which are clues a toy is old? There is more than one.", options: ["Scratches", "Needs batteries", "Worn patches", "Flashing lights"], answers: [0, 2] },
        { type: "choice", q: "Can a new toy be made of wood?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "What does a detective do?", options: ["Looks for clues", "Bakes cakes", "Drives a bus"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "When grown-ups were small",
            text: [
              "Your grown-ups were children once! Your grandparents were children a long time ago, maybe 50 or 60 years ago.",
              "They can remember what toys they played with. We can ask them.",
            ],
          },
          {
            heading: "Grandparents' toys",
            text: [
              "Many grandparents played with skipping ropes, marbles, yo-yos and toy cars.",
              "They had dolls, board games and building bricks too. There were no tablets or games on phones.",
              "Some of their toys are still played with today. Can you think of one?",
            ],
          },
          {
            heading: "Asking good questions",
            text: [
              "When we ask someone questions to find out about their life, it is called an interview.",
              "Good questions: What was your favourite toy? What was it made of? Where did you play?",
              "Listen carefully to the answers. You are finding out about history!",
            ],
          },
        ],
        words: [
          { word: "grandparent", meaning: "your grown-up's mum or dad" },
          { word: "interview", meaning: "asking someone questions to find out about them" },
          { word: "remember", meaning: "keep something in your mind from before" },
          { word: "history", meaning: "finding out about the past" },
        ],
      },
      practice: {
        intro: "Get ready to be an interviewer.",
        questions: [
          { type: "pick", q: "Which are good questions to ask about toys? There is more than one.", options: ["What was your favourite toy?", "What did you have for breakfast today?", "Where did you play?"], answers: [0, 2] },
          { type: "choice", q: "Which toy did your grandparents NOT have when they were small?", options: ["A skipping rope", "A tablet", "Marbles"], answer: 1 },
          { type: "choice", q: "When someone answers your question, you should...", options: ["listen carefully", "talk over them"], answer: 0 },
          { type: "match", q: "Match the word to what it means.", pairs: [["Interview", "Asking questions"], ["Grandparent", "Your grown-up's mum or dad"], ["History", "Finding out about the past"]] },
        ],
      },
      task: {
        title: "Toy interview",
        intro: "Interview a grown-up about the toys they played with.",
        need: ["A grown-up or grandparent to interview (in person, on the phone or on a video call)", "Paper and crayons"],
        steps: [
          "Choose who to interview. A grandparent is great if you can.",
          "Ask: What was your favourite toy?",
          "Ask: What was it made of?",
          "Ask: Where did you play, and who with?",
          "Draw their favourite toy. Your grown-up can help you write its name.",
        ],
      },
      exit: [
        { type: "choice", q: "What is an interview?", options: ["A kind of toy", "Asking someone questions to find out about them", "A long walk"], answer: 1 },
        { type: "choice", q: "Who is a grandparent?", options: ["Your grown-up's mum or dad", "Your little brother"], answer: 0 },
        { type: "pick", q: "Which toys did many grandparents play with? There is more than one.", options: ["Marbles", "Tablets", "Skipping ropes", "Yo-yos"], answers: [0, 2, 3] },
        { type: "choice", q: "Which is a good interview question?", options: ["What is two add two?", "What was your favourite toy?", "Is it raining?"], answer: 1 },
        { type: "choice", q: "Are some of your grandparents' toys still played with today?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "When you interview someone, you should...", options: ["listen carefully", "walk away"], answer: 0 },
      ],
      grownUp: {
        need: ["A family member to interview (a phone or video call works well)", "Paper and crayons"],
        tips: [
          "Let your child ask the questions, even if they need reminding of the words.",
          "If a grandparent can't take part, share your own childhood toys instead. That still counts as living memory.",
          "Old family photos of toys make this even better.",
        ],
        younger: "Ask just one question: 'What was your favourite toy?' Then draw it together.",
        older: "Make up one more question of their own, and tell someone else what they found out.",
      },
    },
    {
      slug: "toys-then-and-now-4",
      title: "Victorian toys",
      emoji: "🎩",
      minutes: 30,
      goal: "I can name some toys Victorian children played with long ago.",
      starter: [
        { type: "choice", q: "What is an interview?", options: ["Asking someone questions", "A kind of game"], answer: 0 },
        { type: "choice", q: "Who is a grandparent?", options: ["Your best friend", "Your grown-up's mum or dad", "Your teacher"], answer: 1 },
        { type: "pick", q: "Which toys did many grandparents play with? There is more than one.", options: ["Marbles", "Yo-yos", "Tablets"], answers: [0, 1] },
        { type: "choice", q: "Which is a good interview question?", options: ["What was your favourite toy?", "What is your name backwards?"], answer: 0 },
        { type: "choice", q: "History means finding out about...", options: ["the weather", "the past", "space"], answer: 1 },
        { type: "choice", q: "When someone answers your question, you should...", options: ["talk over them", "listen carefully"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Long, long ago",
            text: [
              "Long before your grandparents were born, Queen Victoria was queen. The people who lived then are called Victorians.",
              "That was more than 100 years ago. Nobody alive today was a Victorian child.",
            ],
          },
          {
            heading: "Victorian toys",
            text: [
              "Victorian children played with spinning tops. Some tops were kept spinning with a little whip.",
              "They rolled big hoops along with a stick. They played with marbles and skipping ropes.",
              "Many children had rag dolls made from scraps of cloth.",
            ],
          },
          {
            heading: "Rich and poor",
            text: [
              "Rich children might have a wooden rocking horse, a dolls' house or a wooden Noah's ark with animals.",
              "Poor children had very few toys. Families often made toys at home from wood, pegs and old cloth.",
              "Lots of children played games in the street with their friends.",
            ],
          },
        ],
        words: [
          { word: "Victorians", meaning: "people who lived when Queen Victoria was queen" },
          { word: "hoop", meaning: "a big ring you roll along with a stick" },
          { word: "spinning top", meaning: "a toy that spins round and round" },
          { word: "rag doll", meaning: "a soft doll made from scraps of cloth" },
        ],
      },
      practice: {
        intro: "Which toys are Victorian?",
        questions: [
          { type: "pick", q: "Which toys could a Victorian child have? There is more than one.", options: ["A spinning top", "A tablet", "A hoop and stick", "A rag doll"], answers: [0, 2, 3] },
          { type: "match", q: "Match the toy to how you play with it.", pairs: [["Hoop", "Roll it with a stick"], ["Spinning top", "Make it spin"], ["Rag doll", "Cuddle it"]] },
          { type: "choice", q: "Who was queen when the Victorians lived?", options: ["Queen Victoria", "Queen Elizabeth"], answer: 0 },
          { type: "choice", q: "A rag doll is made from...", options: ["plastic", "metal", "scraps of cloth"], answer: 2 },
        ],
      },
      task: {
        title: "Play like a Victorian",
        intro: "Try some Victorian games. A grown-up helps outdoors.",
        need: ["A hula hoop or bike tyre and a stick, or a skipping rope", "A spinning top, or a coin to spin on a table", "A grown-up to help outside"],
        steps: [
          "Go outside with your grown-up to a safe, flat place.",
          "Try rolling a hoop along. Tap it with a stick or push it with your hand.",
          "Or try skipping with a rope. How many skips can you do?",
          "Back inside, spin a top or a coin on the table. How long can it spin?",
          "Which game did you like best? Would you swap your toys for these?",
        ],
      },
      exit: [
        { type: "choice", q: "Who were the Victorians?", options: ["People who live next door", "People who lived when Queen Victoria was queen", "People in space"], answer: 1 },
        { type: "choice", q: "Were the Victorians alive before or after your grandparents were born?", options: ["Before", "After"], answer: 0 },
        { type: "pick", q: "Which are Victorian toys? There is more than one.", options: ["A hoop and stick", "A games console", "A spinning top", "A rag doll"], answers: [0, 2, 3] },
        { type: "choice", q: "A hoop is...", options: ["a big ring you roll with a stick", "a kind of hat"], answer: 0 },
        { type: "choice", q: "Which toy might a rich Victorian child have?", options: ["A tablet", "A wooden rocking horse", "A remote-control car"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "A rag doll is made from scraps of ___.", bank: ["cloth", "glass", "plastic"], answers: ["cloth"] },
      ],
      grownUp: {
        need: ["A hoop (hula hoop or old bike tyre) and a stick, or a skipping rope", "A spinning top or a coin", "Outdoor space, with you supervising"],
        tips: [
          "Queen Victoria reigned from 1837 to 1901. You don't need the dates; 'more than 100 years ago' is enough.",
          "Toy museums often have Victorian toys on show, and some let children try them.",
          "Supervise outdoor play and keep hoop rolling away from roads.",
        ],
        younger: "Just try spinning a coin or top and talk about how a Victorian child would play.",
        older: "Compare a Victorian toy with a toy of today. What is the same and what is different?",
      },
    },
    {
      slug: "toys-then-and-now-5",
      title: "What are toys made of?",
      emoji: "🪵",
      minutes: 30,
      goal: "I can say what toys were made of long ago and what they are made of now.",
      starter: [
        { type: "choice", q: "Who were the Victorians?", options: ["People who lived when Queen Victoria was queen", "People who live today"], answer: 0 },
        { type: "choice", q: "A hoop is rolled along with a...", options: ["spoon", "stick", "rope"], answer: 1 },
        { type: "pick", q: "Which are Victorian toys? There is more than one.", options: ["Spinning top", "Rag doll", "Tablet", "Marbles"], answers: [0, 1, 3] },
        { type: "choice", q: "A rag doll is made from...", options: ["scraps of cloth", "plastic"], answer: 0 },
        { type: "choice", q: "Did the Victorians live before your grandparents?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "Which might a rich Victorian child have?", options: ["A games console", "A remote-control car", "A rocking horse"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Toys long ago",
            text: [
              "Long ago, most toys were made of wood, metal or cloth.",
              "Some dolls had faces made of china. Marbles were made of clay or glass.",
            ],
          },
          {
            heading: "Toys now",
            text: [
              "Today lots of toys are made of plastic. Plastic is light, bright and easy to shape.",
              "Some toys now have batteries, lights, sounds or screens.",
              "We still have wooden toys and soft cloth toys too.",
            ],
          },
          {
            heading: "Same and different",
            text: [
              "A ball long ago might be made of leather or rubber. Now it might be plastic.",
              "A doll long ago might be cloth or wood. Now it is often plastic.",
              "The toys are the same kind of thing. The material has changed.",
            ],
          },
        ],
        words: [
          { word: "material", meaning: "what something is made of" },
          { word: "wood", meaning: "a material that comes from trees" },
          { word: "plastic", meaning: "a light material used for lots of toys today" },
          { word: "metal", meaning: "a hard, shiny material, like a tin can" },
        ],
      },
      practice: {
        intro: "Then or now?",
        questions: [
          { type: "match", q: "Match each toy to what it is made of.", pairs: [["Rag doll", "Cloth"], ["Rocking horse", "Wood"], ["Building bricks today", "Plastic"]] },
          { type: "choice", q: "Which material was NOT used for toys long ago?", options: ["Wood", "Plastic", "Cloth"], answer: 1, why: "Plastic toys became common long after the Victorians." },
          { type: "pick", q: "Which materials were toys made of long ago? There is more than one.", options: ["Wood", "Metal", "Cloth"], answers: [0, 1, 2] },
          { type: "choice", q: "A toy with batteries and a screen is from...", options: ["long ago", "now"], answer: 1 },
        ],
      },
      task: {
        title: "Materials hunt",
        intro: "Find out what your toys are made of.",
        need: ["Lots of your toys", "Paper and crayons"],
        steps: [
          "Find a toy made of wood. Then plastic. Then cloth. Then metal.",
          "Put them in four groups.",
          "Which group is the biggest?",
          "Which of your toys could a Victorian child have had? Which could they not?",
          "Draw one toy from each group.",
        ],
      },
      exit: [
        { type: "choice", q: "Long ago, most toys were made of...", options: ["wood, metal or cloth", "plastic"], answer: 0 },
        { type: "choice", q: "Today, lots of toys are made of...", options: ["china", "plastic", "clay"], answer: 1 },
        { type: "choice", q: "Wood comes from...", options: ["rocks", "the sea", "trees"], answer: 2 },
        { type: "match", q: "Match each toy to its material.", pairs: [["Rag doll", "Cloth"], ["Rocking horse", "Wood"], ["Toy bricks today", "Plastic"]] },
        { type: "choice", q: "Do we still have wooden toys today?", options: ["Yes", "No"], answer: 0 },
        { type: "type", q: "What material are lots of toys made of today?", answer: ["plastic", "Plastic"] },
      ],
      grownUp: {
        need: ["A selection of your child's toys", "Paper and crayons"],
        tips: [
          "Some toys mix materials, such as a metal car with plastic wheels. Count it as both.",
          "Plastic toys became common in the 1950s and 1960s, so many grandparents grew up with some plastic toys.",
        ],
        younger: "Sort toys into just two groups: plastic and not plastic.",
        older: "Choose one toy and say what it might have been made of in Victorian times.",
      },
    },
    {
      slug: "toys-then-and-now-6",
      title: "Make a toy and a timeline",
      emoji: "🪀",
      minutes: 30,
      goal: "I can make an old-fashioned toy and put toys in order from oldest to newest.",
      starter: [
        { type: "choice", q: "Long ago, most toys were made of...", options: ["plastic", "wood, metal or cloth"], answer: 1 },
        { type: "choice", q: "Today, lots of toys are made of...", options: ["plastic", "clay", "stone"], answer: 0 },
        { type: "choice", q: "Wood comes from...", options: ["the sky", "trees"], answer: 1 },
        { type: "match", q: "Match each toy to its material.", pairs: [["Rag doll", "Cloth"], ["Rocking horse", "Wood"], ["Marbles", "Glass"]] },
        { type: "choice", q: "Which toy needs batteries?", options: ["A spinning top", "A rag doll", "A robot with lights"], answer: 2 },
        { type: "choice", q: "Do we still have wooden toys today?", options: ["No", "Yes"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Cup and ball",
            text: [
              "A cup and ball is a very old toy. Victorian children played with it.",
              "A ball is tied to a cup with string. You swing the ball up and try to catch it in the cup.",
              "It is easy to make one at home.",
            ],
          },
          {
            heading: "A timeline",
            text: [
              "A timeline puts things in order of when they happened.",
              "The oldest thing goes at one end. The newest thing goes at the other end.",
            ],
          },
          {
            heading: "Toys in order",
            text: [
              "First, Victorian children played with hoops and rag dolls.",
              "Then, your grandparents played with marbles and toy cars.",
              "Now, you play with your toys. Some even have screens!",
            ],
          },
        ],
        words: [
          { word: "timeline", meaning: "a line that shows things in order of time" },
          { word: "oldest", meaning: "from the longest time ago" },
          { word: "newest", meaning: "from the shortest time ago" },
        ],
      },
      practice: {
        intro: "Put the toys in order.",
        questions: [
          { type: "order", q: "Put these in order, oldest first.", items: ["A Victorian rag doll", "Grandad's toy car", "Your new tablet game"] },
          { type: "order", q: "Put these people in order, oldest first.", items: ["Grandma", "Your grown-up", "You", "A new baby"] },
          { type: "choice", q: "On a timeline, the Victorians go...", options: ["near the newest end", "near the oldest end"], answer: 1 },
          { type: "choice", q: "How do you play cup and ball?", options: ["Swing the ball up and catch it in the cup", "Roll the cup along the floor"], answer: 0 },
        ],
      },
      task: {
        title: "Make a cup and ball",
        intro: "Make your own old-fashioned toy. A grown-up helps with the scissors.",
        need: ["A paper cup", "A piece of string about as long as your arm", "Some kitchen foil", "Sticky tape", "Scissors (for a grown-up)", "A pencil"],
        steps: [
          "Ask your grown-up to make a small hole in the bottom of the cup with a pencil.",
          "Push one end of the string through the hole. Tie a big knot inside so it can't slip out.",
          "Scrunch some foil into a ball around the other end of the string. Tape it on tight.",
          "Hold the cup. Swing the ball up and try to catch it in the cup!",
          "Then draw a timeline: a Victorian toy, a grandparent's toy, and your toy.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a timeline?", options: ["A line that shows things in order of time", "A kind of rope", "A toy"], answer: 0 },
        { type: "order", q: "Put these toys in order, oldest first.", items: ["A Victorian hoop and stick", "Grandma's skipping rope", "A toy robot with a screen"] },
        { type: "choice", q: "Oldest means...", options: ["from the shortest time ago", "from the longest time ago"], answer: 1 },
        { type: "choice", q: "In cup and ball, you try to...", options: ["kick the cup", "throw the ball away", "catch the ball in the cup"], answer: 2 },
        { type: "order", q: "Put these in order, oldest first.", items: ["Victorian children", "Your grandparents as children", "You"] },
        { type: "choice", q: "Is cup and ball an old toy?", options: ["Yes, Victorian children played with it", "No, it was made last week"], answer: 0 },
      ],
      grownUp: {
        need: ["A paper cup, string, kitchen foil, sticky tape and a pencil", "Scissors (adult use)", "Paper and crayons for the timeline"],
        tips: [
          "Make the hole in the cup yourself and handle the scissors.",
          "Keep the string short (about an arm's length) and the ball light. Play away from faces.",
          "For the timeline, drawings or photos laid along a strip of paper or the floor work well.",
        ],
        younger: "Make the toy together, then put just two toys in order: old and new.",
        older: "Add more toys to the timeline, such as your own baby toy and a grown-up's toy, and explain the order.",
      },
    },
  ],
};
