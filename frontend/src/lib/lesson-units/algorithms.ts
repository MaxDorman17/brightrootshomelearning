import type { LessonUnit } from "@/lib/lessons";

/** Algorithms: giving instructions, for ages 7 to 9. Mostly unplugged: paper, pens, household objects and the floor. */
export const algorithms: LessonUnit = {
  slug: "algorithms",
  title: "Algorithms: giving instructions",
  short: "Algorithms",
  subject: "Computing",
  ages: "7 to 9",
  emoji: "🤖",
  color: "#4F6FA8",
  summary: "Six screen-light lessons about giving clear instructions: algorithms, sequencing, debugging, loops, and programming a 'robot' around a grid on the floor.",
  cover: "/lessons/units/algorithms.jpg",
  lessons: [
    {
      slug: "algorithms-1",
      title: "What is an algorithm?",
      emoji: "📋",
      minutes: 45,
      goal: "I can explain that an algorithm is a set of clear, step-by-step instructions.",
      starter: [
        { type: "choice", q: "What does a recipe tell you?", options: ["How to make some food, step by step", "What the weather will be", "What time it is"], answer: 0 },
        { type: "choice", q: "Can a computer think for itself like a person?", options: ["Yes, it always knows what you mean", "No, it only does what its instructions say"], answer: 1 },
        { type: "pick", q: "Which of these follow instructions? There is more than one.", options: ["A washing machine", "A pebble", "A games console", "A leaf"], answers: [0, 2] },
        { type: "choice", q: "What do we call someone who writes instructions for computers?", options: ["A builder", "A programmer", "A painter"], answer: 1 },
        { type: "choice", q: "Which word means 'in the right order'?", options: ["Muddled", "Upside down", "In sequence"], answer: 2 },
        { type: "type", q: "Have a guess! Which word, starting with 'a', means a set of step-by-step instructions?", answer: ["algorithm", "an algorithm", "algorithms"] },
      ],
      learn: {
        cards: [
          {
            heading: "Instructions everywhere",
            picture: "/lessons/algorithms/lesson-1-1.jpg",
            alt: "A girl and her dad following a recipe step by step, measuring flour into a bowl",
            text: [
              "An algorithm is a set of step-by-step instructions to do a job. A recipe is an algorithm. So are the steps for brushing your teeth.",
              "You follow algorithms every day, often without noticing. Getting dressed, crossing the road safely and playing a board game all have steps.",
            ],
          },
          {
            heading: "Computers need algorithms",
            picture: "/lessons/algorithms/lesson-1-2.jpg",
            alt: "A boy looking at his sister dressed as a cardboard-box robot, waiting for an instruction",
            text: [
              "Computers, tablets and robots can't guess what you mean. They only do exactly what their instructions say.",
              "When we turn an algorithm into instructions a computer can follow, it becomes a program. People who write programs are called programmers.",
            ],
          },
          {
            heading: "Clear and precise",
            picture: "/lessons/algorithms/lesson-1-3.jpg",
            alt: "A dad walking stiffly like a robot towards a cup on a chair while a boy gives instructions",
            text: [
              "A good algorithm is precise. That means every step is clear and exact, so there's only one way to follow it.",
              "'Make some toast' isn't precise. 'Put one slice of bread in the toaster and push the lever down' is much better.",
            ],
          },
        ],
        words: [
          { word: "algorithm", meaning: "a set of clear, step-by-step instructions to do a job" },
          { word: "precise", meaning: "clear and exact, with nothing left to guess" },
          { word: "program", meaning: "an algorithm written so a computer can follow it" },
          { word: "programmer", meaning: "a person who writes programs" },
        ],
      },
      practice: {
        intro: "Spot the algorithms and the precise instructions.",
        questions: [
          { type: "choice", q: "Which of these is an algorithm?", options: ["A red ball", "The steps to plant a seed", "A happy feeling"], answer: 1 },
          { type: "choice", q: "Which instruction is more precise?", options: ["Walk a bit", "Walk three steps forward"], answer: 1 },
          {
            type: "pick",
            q: "Which of these are algorithms? There is more than one.",
            options: ["A cake recipe", "A shoe", "Instructions for building a toy", "The rules of a game"],
            answers: [0, 2, 3],
          },
          { type: "gap", q: "Fill in the gaps.", text: "An algorithm is a set of ___ instructions. A computer only does ___ what it is told.", bank: ["step-by-step", "exactly", "secret", "nearly"], answers: ["step-by-step", "exactly"] },
        ],
      },
      task: {
        title: "Be a robot",
        intro: "Your grown-up is a robot. Robots only do exactly what they're told!",
        need: ["A grown-up to be the robot", "A cup and a chair in the same room"],
        steps: [
          "Put a cup on a chair across the room. Your robot stands by the door.",
          "Give your robot instructions, one at a time, to walk over and pick up the cup. The robot must follow your words exactly and not guess.",
          "If you say 'go to the cup', the robot can say 'Does not compute!' Use precise words like 'take two steps forward'.",
          "Swap over. Now you are the robot and your grown-up gives the instructions.",
          "Talk about it: which instructions worked best? Why did vague ones go wrong?",
        ],
      },
      exit: [
        { type: "choice", q: "What is an algorithm?", options: ["A type of computer", "A set of step-by-step instructions", "A robot's name"], answer: 1 },
        { type: "choice", q: "What does precise mean?", options: ["Quick and messy", "Clear and exact", "Long and funny"], answer: 1 },
        { type: "choice", q: "Can a computer guess what you meant to say?", options: ["Yes", "No"], answer: 1 },
        { type: "choice", q: "Which instruction is the most precise?", options: ["Go over there", "Move a little", "Take four steps forward"], answer: 2 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Algorithm", "Step-by-step instructions"], ["Program", "An algorithm a computer can follow"], ["Programmer", "A person who writes programs"]] },
        { type: "pick", q: "Which of these are algorithms? There is more than one.", options: ["A recipe for pancakes", "A pencil", "Steps for washing your hands"], answers: [0, 2] },
      ],
      grownUp: {
        need: ["A cup and a chair", "Some space to walk around"],
        tips: [
          "Ham it up as the robot. Follow vague instructions in silly but safe ways, like walking into a wall gently, so your child sees why precision matters.",
          "Point out algorithms in daily life: the washing machine's settings, a recipe, the steps for a board game.",
        ],
        younger: "Keep to just two kinds of instruction, 'step forward' and 'pick up', and help them count the steps.",
        older: "Ask them to write the instructions down first, then test them on you without changing a word. How many attempts did it take?",
      },
    },
    {
      slug: "algorithms-2",
      title: "Getting the order right",
      emoji: "🔢",
      minutes: 45,
      goal: "I can put instructions in the right order and explain why order matters.",
      starter: [
        { type: "choice", q: "What is an algorithm?", options: ["A set of step-by-step instructions", "A kind of robot", "A computer game"], answer: 0 },
        { type: "choice", q: "What does precise mean?", options: ["Funny", "Clear and exact", "Very fast"], answer: 1 },
        { type: "choice", q: "What do we call an algorithm a computer can follow?", options: ["A poem", "A picture", "A program"], answer: 2 },
        { type: "choice", q: "Which instruction is more precise?", options: ["Turn the tap", "Turn the cold tap on a little"], answer: 1 },
        { type: "type", q: "What do we call a person who writes programs?", answer: ["programmer", "a programmer", "coder", "a coder"] },
        { type: "choice", q: "If a robot hears 'go over there', what does it do?", options: ["It knows exactly where to go", "It can't work out what you mean"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Sequence",
            picture: "/lessons/algorithms/lesson-2-1.jpg",
            alt: "A boy laughing as he holds up a trainer with a sock pulled over it",
            text: [
              "A sequence is a set of steps in a particular order. In an algorithm, the order of the steps really matters.",
              "Think about getting dressed. You put your socks on before your shoes. Swap them, and you get shoes with socks on top!",
            ],
          },
          {
            heading: "When order goes wrong",
            picture: "/lessons/algorithms/lesson-2-2.jpg",
            alt: "A girl putting picture strips of her morning routine in order on the floor",
            text: [
              "Computers follow steps in order, from the top to the bottom. They do step 1, then step 2, then step 3.",
              "If two steps are in the wrong order, the computer still does them. It doesn't notice that something silly is happening.",
            ],
          },
          {
            heading: "Does every step need an order?",
            picture: "/lessons/algorithms/lesson-2-3.jpg",
            alt: "Two children laying a table, one placing a fork and one a knife at the same time",
            text: [
              "Sometimes order doesn't matter. When you lay the table, it doesn't matter if the fork or the knife goes down first.",
              "But often it does. You must open the door before you walk through it. Good programmers check which steps have to come first.",
            ],
          },
        ],
        words: [
          { word: "sequence", meaning: "steps that happen in a particular order" },
          { word: "order", meaning: "which step comes first, next and last" },
          { word: "step", meaning: "one single instruction in an algorithm" },
        ],
      },
      practice: {
        intro: "Put the steps in order.",
        questions: [
          { type: "order", q: "Put these steps for brushing your teeth in order.", items: ["Pick up your toothbrush", "Squeeze on some toothpaste", "Brush all your teeth", "Rinse your toothbrush"] },
          { type: "order", q: "Put these steps for planting a seed in order.", items: ["Fill a pot with soil", "Make a small hole in the soil", "Drop the seed in the hole", "Cover it with soil", "Water it"] },
          { type: "choice", q: "Which must come first?", options: ["Put on your shoes", "Put on your socks"], answer: 1 },
          { type: "choice", q: "A computer follows a sequence...", options: ["in any order it likes", "from the first step to the last"], answer: 1 },
        ],
      },
      task: {
        title: "Morning muddle",
        intro: "Cut up a morning routine, muddle it, and put it back in sequence.",
        need: ["Paper and a pencil", "Scissors"],
        steps: [
          "Write or draw six things you do in the morning, each on its own strip of paper. For example: wake up, get out of bed, get dressed.",
          "Muddle the strips up and give them to your grown-up. Can they put them back in order?",
          "Swap two strips on purpose. Read the new sequence aloud. What silly thing would happen?",
          "Find two steps where the order doesn't matter, like brushing your hair and putting on your watch.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a sequence?", options: ["Steps in a particular order", "A kind of computer", "A mistake"], answer: 0 },
        { type: "choice", q: "How does a computer follow a sequence?", options: ["It picks its favourite step first", "It does each step in order", "It skips the hard steps"], answer: 1 },
        { type: "order", q: "Put these steps for making a cup of squash in order.", items: ["Get a cup", "Pour in a little squash", "Add water", "Stir it", "Drink it"] },
        { type: "choice", q: "If steps are in the wrong order, what does a computer do?", options: ["Fixes them by itself", "Follows them anyway"], answer: 1 },
        { type: "choice", q: "In which job does the order NOT matter?", options: ["Putting a fork and a knife on the table", "Opening a door and walking through it", "Putting on socks and shoes"], answer: 0 },
        { type: "gap", q: "Fill in the gaps.", text: "In an algorithm, the ___ of the steps matters. You must open the door ___ you walk through it.", bank: ["order", "before", "colour", "after"], answers: ["order", "before"] },
      ],
      grownUp: {
        need: ["Paper strips", "Scissors"],
        tips: [
          "Acting out a muddled sequence is the quickest way to make the idea stick. Try 'pour the cereal, then get the bowl'.",
          "Writing is optional: drawings on the strips work just as well.",
        ],
        younger: "Use four strips instead of six, with pictures only.",
        older: "Ask them to write a sequence of ten steps, then find every pair of steps that could swap places without causing a problem.",
      },
    },
    {
      slug: "algorithms-3",
      title: "The sandwich challenge",
      emoji: "🥪",
      minutes: 45,
      goal: "I can write a clear, precise algorithm for an everyday task.",
      starter: [
        { type: "choice", q: "What is a sequence?", options: ["A mistake", "Steps in a particular order", "A type of robot"], answer: 1 },
        { type: "order", q: "Put these steps for washing your hands in order.", items: ["Turn on the tap", "Wet your hands", "Rub with soap", "Rinse off the soap", "Dry your hands"] },
        { type: "choice", q: "Which must come first?", options: ["Walk through the door", "Open the door"], answer: 1 },
        { type: "choice", q: "If steps are in the wrong order, a computer...", options: ["follows them anyway", "puts them right"], answer: 0 },
        { type: "choice", q: "Does it matter if you put the fork or knife on the table first?", options: ["No", "Yes"], answer: 0 },
        { type: "type", q: "What word means steps in a particular order?", answer: ["sequence", "a sequence"] },
      ],
      learn: {
        cards: [
          {
            heading: "Everyday algorithms",
            picture: "/lessons/algorithms/lesson-3-1.jpg",
            alt: "A boy thinking over bread, a jam jar and a blunt knife, with paper and a pencil",
            text: [
              "Writing an algorithm for an everyday job is harder than it sounds. We do lots of small steps without thinking about them.",
              "Making a jam sandwich seems easy. But how do you open the jar? Which side of the bread gets the jam? Where does the knife go?",
            ],
          },
          {
            heading: "Leave nothing out",
            picture: "/lessons/algorithms/lesson-3-2.jpg",
            alt: "A mum as a robot pushing a knife against the lid of a closed jam jar while her daughter laughs",
            text: [
              "A person can guess a missing step. A computer can't. If you forget 'take the lid off the jar', a robot will try to spread jam through the lid!",
              "Good algorithms break a job into small, clear steps. Each step does one thing.",
            ],
          },
          {
            heading: "Words that help",
            picture: "/lessons/algorithms/lesson-3-3.jpg",
            alt: "A girl spreading jam on bread while her brother holds up two fingers",
            text: [
              "Precise words make instructions easier to follow. Use exact amounts, like 'two slices' or 'one spoonful'.",
              "Say which one, like 'the left hand' or 'the top slice'. Use clear action words, like pick up, put down, open, spread and press.",
            ],
          },
        ],
        words: [
          { word: "precise", meaning: "clear and exact" },
          { word: "instruction", meaning: "a step that tells someone what to do" },
          { word: "action word", meaning: "a word that says what to do, like pick up, open or spread" },
        ],
      },
      practice: {
        intro: "Make the instructions precise.",
        questions: [
          { type: "choice", q: "Which is the best instruction?", options: ["Get some bread", "Take two slices of bread out of the bag", "Bread please"], answer: 1 },
          {
            type: "pick",
            q: "Which of these are action words? There is more than one.",
            options: ["Spread", "Jam", "Open", "Bread", "Pick up"],
            answers: [0, 2, 4],
          },
          { type: "choice", q: "Someone forgot 'take the lid off the jar'. What might a robot do?", options: ["Take the lid off anyway", "Try to scoop jam with the lid still on"], answer: 1 },
          { type: "order", q: "Put these jam sandwich steps in order.", items: ["Put two slices of bread on a plate", "Take the lid off the jam jar", "Spread jam on one slice with a knife", "Put the other slice on top"] },
        ],
      },
      task: {
        title: "The sandwich robot",
        intro: "Write an algorithm for a sandwich, then test it on a very literal robot: your grown-up!",
        need: ["Paper and a pencil", "Bread on a plate", "A spread such as jam or butter, in a pot with a lid", "A blunt knife"],
        steps: [
          "Write your algorithm for making a sandwich. Number every step.",
          "Read it aloud, one step at a time. Your grown-up follows each step exactly, even if it goes wrong.",
          "Every time something silly happens, stop. Change that step, or add a new one.",
          "Read the whole algorithm again from the start. Keep going until your robot makes a proper sandwich.",
          "Count how many steps your final algorithm has. Was it more than you expected?",
        ],
      },
      exit: [
        { type: "choice", q: "Why is writing an everyday algorithm tricky?", options: ["We do lots of small steps without thinking", "Everyday jobs have no steps"], answer: 0 },
        { type: "choice", q: "What can't a computer do with a missing step?", options: ["Guess it", "Read it"], answer: 0 },
        { type: "choice", q: "Which is the most precise?", options: ["Put some jam on", "Spread one spoonful of jam on the top slice", "Do the jam bit"], answer: 1 },
        { type: "pick", q: "Which are action words? There is more than one.", options: ["Press", "Plate", "Pick up", "Knife"], answers: [0, 2] },
        { type: "choice", q: "A good algorithm breaks a job into...", options: ["one big step", "small, clear steps"], answer: 1 },
        { type: "gap", q: "Fill in the gaps.", text: "Each step should do ___ thing. Use exact amounts like ___ slices.", bank: ["one", "two", "lots", "some"], answers: ["one", "two"] },
      ],
      grownUp: {
        need: ["Bread", "A spread in a lidded pot", "A blunt knife", "A plate", "A wipeable surface"],
        tips: [
          "This is the classic 'exact instructions' game. Be a very literal robot: if they say 'put the jam on the bread', put the whole pot on the loaf.",
          "Keep it safe: use a blunt knife and keep the silliness gentle. Check for allergies first.",
          "Celebrate each fix. Changing the algorithm is exactly what real programmers do.",
        ],
        younger: "Let them say the steps aloud while you write them down, then test them together.",
        older: "Challenge them to write an algorithm for a harder job, like tying a shoelace or folding a paper aeroplane, for someone else to follow.",
      },
    },
    {
      slug: "algorithms-4",
      title: "Bug hunters",
      emoji: "🐞",
      minutes: 45,
      goal: "I can find and fix mistakes in an algorithm.",
      starter: [
        { type: "choice", q: "Why can't a robot make a sandwich if you forget a step?", options: ["It can't guess the missing step", "It doesn't like sandwiches"], answer: 0 },
        { type: "choice", q: "Which is more precise?", options: ["Get some bread", "Take two slices of bread"], answer: 1 },
        { type: "pick", q: "Which are action words? There is more than one.", options: ["Open", "Jar", "Spread", "Lid"], answers: [0, 2] },
        { type: "choice", q: "A good algorithm breaks a job into...", options: ["small, clear steps", "one big step", "no steps"], answer: 0 },
        { type: "type", q: "How many things should each step do?", answer: ["1", "one"] },
        { type: "choice", q: "What should you do if your robot does something silly?", options: ["Give up", "Change the instructions and try again"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is a bug?",
            picture: "/lessons/algorithms/lesson-4-1.jpg",
            alt: "A boy with a magnifying glass looking at a drawn ladybird bug on his instructions",
            text: [
              "A bug is a mistake in an algorithm or program. Bugs stop it working the way we want.",
              "Everyone makes bugs, even expert programmers. Finding them is a normal part of the job.",
            ],
          },
          {
            heading: "Three kinds of bug",
            picture: "/lessons/algorithms/lesson-4-2.jpg",
            alt: "A child with shoes on before socks, an unopened jam jar, and a child turning the wrong way",
            text: [
              "A step might be missing, like forgetting to open the jar.",
              "Steps might be in the wrong order, like putting shoes on before socks.",
              "A step might be wrong, like 'turn left' when it should say 'turn right', or '3 steps' when it should be 2.",
            ],
          },
          {
            heading: "Debugging",
            picture: "/lessons/algorithms/lesson-4-3.jpg",
            alt: "A girl crossing out a step on her instructions, with a toy treasure under a cushion behind her",
            text: [
              "Finding and fixing bugs is called debugging. Go through the algorithm one step at a time and check what happens after each step.",
              "When you spot where it goes wrong, fix that step. Then test the whole algorithm again from the start to check it works.",
            ],
          },
        ],
        words: [
          { word: "bug", meaning: "a mistake in an algorithm or program" },
          { word: "debug", meaning: "to find and fix the mistakes" },
          { word: "test", meaning: "to try out an algorithm to see if it works" },
        ],
      },
      practice: {
        intro: "Find the bugs.",
        questions: [
          {
            type: "choice",
            q: "Going to bed: 1. Get into bed. 2. Put on your pyjamas. 3. Brush your teeth. What is the bug?",
            options: ["A step is missing", "The steps are in the wrong order", "Nothing is wrong"],
            answer: 1,
            why: "You'd get into bed before putting on pyjamas and brushing your teeth. Getting into bed should be last.",
          },
          {
            type: "choice",
            q: "Making toast: 1. Take one slice of bread. 2. Butter the toast. 3. Eat it. What is the bug?",
            options: ["The steps are in the wrong order", "Nothing is wrong", "A step is missing"],
            answer: 2,
            why: "Nobody toasted the bread! 'Put the bread in the toaster' is missing.",
          },
          {
            type: "match",
            q: "Match each bug to its kind.",
            pairs: [["Shoes on before socks", "Wrong order"], ["Forgot to open the jar", "Missing step"], ["Turn left instead of right", "Wrong step"]],
          },
          { type: "order", q: "Put these debugging steps in order.", items: ["Test the algorithm", "Spot where it goes wrong", "Fix that step", "Test it again"] },
        ],
      },
      task: {
        title: "Debug the treasure hunt",
        intro: "Your grown-up hides a treasure and writes a buggy algorithm to find it. Can you debug it?",
        need: ["A small 'treasure', like a toy or a coin", "Paper and a pencil", "A grown-up to write the buggy instructions"],
        steps: [
          "Your grown-up hides the treasure and writes instructions to reach it, with one or two bugs hidden inside.",
          "Follow the instructions exactly, step by step. Don't guess!",
          "When it goes wrong, stop. Which step is the bug? Is it missing, in the wrong order, or just wrong?",
          "Cross out the bug and write the fix. Start again from the beginning and test it.",
          "Now you hide the treasure and write instructions with a bug for your grown-up to debug.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a bug?", options: ["A mistake in an algorithm", "A kind of computer", "A finished program"], answer: 0 },
        { type: "choice", q: "What does debugging mean?", options: ["Writing a new program", "Finding and fixing mistakes", "Switching a computer off"], answer: 1 },
        { type: "choice", q: "Do expert programmers make bugs?", options: ["No, never", "Yes, everyone does"], answer: 1 },
        {
          type: "choice",
          q: "Planting a seed: 1. Fill a pot with soil. 2. Water it. 3. Put the pot on a sunny windowsill. What is the bug?",
          options: ["Nothing is wrong", "The steps are in the wrong order", "A step is missing"],
          answer: 2,
          why: "Nobody planted the seed! 'Push a seed into the soil' is missing.",
        },
        { type: "choice", q: "After you fix a bug, what should you do?", options: ["Test the whole algorithm again", "Nothing"], answer: 0 },
        { type: "pick", q: "Which are kinds of bug? There is more than one.", options: ["A missing step", "Steps in the wrong order", "A step that is too precise", "A wrong step"], answers: [0, 1, 3] },
      ],
      grownUp: {
        need: ["A small object to hide", "Paper and a pencil"],
        tips: [
          "Keep your hidden bugs fair: one missing step and one wrong turn or number is plenty.",
          "Praise the hunt, not just the answer. Saying 'step 3 is where it goes wrong' is the key debugging skill.",
          "Talk about how getting things wrong is normal and useful. It's how every program gets better.",
        ],
        younger: "Use just one bug, and read the instructions aloud for them as they walk.",
        older: "Hide three bugs, one of each kind. Can they name the kind of bug as well as fix it?",
      },
    },
    {
      slug: "algorithms-5",
      title: "Round and round: loops",
      emoji: "🔁",
      minutes: 45,
      goal: "I can use a loop to repeat instructions and make an algorithm shorter.",
      starter: [
        { type: "choice", q: "What is a bug?", options: ["A mistake in an algorithm", "A step that works well"], answer: 0 },
        { type: "type", q: "What do we call finding and fixing bugs?", answer: ["debugging", "debug"] },
        { type: "match", q: "Match each bug to its kind.", pairs: [["Get into bed, then put on pyjamas", "Wrong order"], ["Forgot to toast the bread", "Missing step"]] },
        { type: "choice", q: "After fixing a bug, you should...", options: ["test the algorithm again", "throw it away"], answer: 0 },
        { type: "choice", q: "Do expert programmers make bugs?", options: ["No, never", "Yes, everyone does"], answer: 1 },
        { type: "choice", q: "To debug, you go through an algorithm...", options: ["one step at a time", "all at once, very fast"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Doing it again",
            picture: "/lessons/algorithms/lesson-5-1.jpg",
            alt: "A boy climbing the stairs one step at a time, repeating the same movement",
            text: [
              "Lots of jobs have steps that repeat. When you climb the stairs, you do 'step up' again and again.",
              "Writing 'step up' twelve times is slow and boring. And it's easy to make a mistake, like writing it eleven times.",
            ],
          },
          {
            heading: "Loops",
            picture: "/lessons/algorithms/lesson-5-2.jpg",
            alt: "A girl drawing a big looping arrow around a picture of a footstep",
            text: [
              "A loop tells a computer to repeat some steps. Instead of twelve lines, you write: 'Repeat 12 times: step up'.",
              "Loops make algorithms shorter and easier to read. They are also easier to change: to climb 14 stairs, you change just one number.",
            ],
          },
          {
            heading: "Spotting patterns",
            picture: "/lessons/algorithms/lesson-5-3.jpg",
            alt: "Two children and a grown-up doing a clapping and stomping dance",
            text: [
              "To use a loop, look for a pattern of steps that repeats. Clap, stomp, clap, stomp, clap, stomp is 'Repeat 3 times: clap, stomp'.",
              "You can repeat more than one step inside a loop. Everything inside the loop is done in order, and then the loop starts again.",
            ],
          },
        ],
        words: [
          { word: "repeat", meaning: "to do something again" },
          { word: "loop", meaning: "an instruction that repeats some steps" },
          { word: "pattern", meaning: "something that happens again and again in the same way" },
        ],
      },
      practice: {
        intro: "Spot the patterns and use loops.",
        questions: [
          { type: "choice", q: "Which loop means jump, jump, jump, jump?", options: ["Repeat 2 times: jump", "Repeat 4 times: jump", "Repeat 4 times: clap"], answer: 1 },
          { type: "choice", q: "What does 'Repeat 3 times: clap, stomp' do?", options: ["Clap, stomp, clap, stomp, clap, stomp", "Clap, clap, clap, stomp", "Clap, stomp"], answer: 0 },
          { type: "type", q: "Hop, hop, hop, hop, hop. Finish the loop: Repeat ___ times: hop", answer: ["5", "five"] },
          { type: "pick", q: "Why are loops useful? There is more than one.", options: ["They make algorithms shorter", "They make the computer go wrong", "They are easier to change"], answers: [0, 2] },
          { type: "gap", q: "Fill in the gaps.", text: "Pat head, pat head, pat head, pat head is: Repeat ___ times: pat ___.", bank: ["4", "3", "head", "knees"], answers: ["4", "head"] },
        ],
      },
      task: {
        title: "Loop dance",
        intro: "Make up a dance using loops, then teach it to your family.",
        need: ["Paper and a pencil", "Some space to move", "Music, if you like"],
        steps: [
          "Pick three or four dance moves, like clap, jump, spin and wiggle.",
          "Write a dance algorithm with at least two loops. For example: 'Repeat 4 times: clap. Repeat 2 times: jump, spin.'",
          "Perform your dance. Count each repeat out loud to check the loops work.",
          "Teach it to your grown-up by reading out the algorithm. Do they do the moves the right number of times?",
          "Change one number in a loop. How does the dance change?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a loop?", options: ["An instruction that repeats some steps", "A mistake in a program", "The last step"], answer: 0 },
        { type: "choice", q: "Which is the same as 'Repeat 3 times: wave'?", options: ["Wave", "Wave, wave, wave", "Wave, wave"], answer: 1 },
        { type: "type", q: "Stomp, stomp, stomp, stomp, stomp, stomp. Finish the loop: Repeat ___ times: stomp", answer: ["6", "six"] },
        { type: "choice", q: "What does 'Repeat 2 times: jump, clap' do?", options: ["Jump, jump, clap, clap", "Jump, clap", "Jump, clap, jump, clap"], answer: 2 },
        { type: "choice", q: "To climb 14 stairs instead of 12 with a loop, what do you change?", options: ["Just the number", "Every line"], answer: 0 },
        { type: "pick", q: "Which could be written as a loop? There is more than one.", options: ["Clap, clap, clap, clap", "Wake up, eat, sleep", "Hop, spin, hop, spin, hop, spin"], answers: [0, 2] },
      ],
      grownUp: {
        need: ["Space to move", "Paper and a pencil"],
        tips: [
          "Children often get confused when a loop has two steps inside. Act it out slowly: 'Repeat 2 times: jump, clap' is jump, clap, jump, clap.",
          "Drums, claps and stomps are a great way to hear the pattern in a loop.",
        ],
        younger: "Stick to loops with one move inside, like 'Repeat 5 times: clap', and count together.",
        older: "Try a loop inside a loop: 'Repeat 2 times: (Repeat 3 times: clap), jump'. How many claps is that altogether?",
      },
    },
    {
      slug: "algorithms-6",
      title: "Program a floor robot",
      emoji: "🧭",
      minutes: 45,
      goal: "I can program a route on a grid using forward, turn left and turn right, and predict where it ends.",
      starter: [
        { type: "choice", q: "What is a loop?", options: ["An instruction that repeats steps", "A bug", "A type of robot"], answer: 0 },
        { type: "choice", q: "What does 'Repeat 2 times: hop, clap' do?", options: ["Hop, hop, clap, clap", "Hop, clap, hop, clap", "Hop, clap"], answer: 1 },
        { type: "type", q: "Spin, spin, spin. Finish the loop: Repeat ___ times: spin", answer: ["3", "three"] },
        { type: "choice", q: "Why are loops useful?", options: ["They make algorithms shorter", "They make lots of bugs"], answer: 0 },
        { type: "pick", q: "Which could be a loop? There is more than one.", options: ["Jump, jump, jump", "Eat, sleep, read", "Wave, nod, wave, nod"], answers: [0, 2] },
        { type: "choice", q: "To change how many times a loop repeats, you change...", options: ["every step", "the number"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Floor robots",
            picture: "/lessons/algorithms/lesson-6-1.jpg",
            alt: "A small toy robot on a masking-tape grid on the floor, with two children kneeling beside it",
            text: [
              "Some schools use little floor robots that you program by pressing arrow buttons. They move around a grid of squares on the floor.",
              "You don't need a real robot. A toy, or even a person, can be the robot on a grid drawn on paper or marked out on the floor.",
            ],
          },
          {
            heading: "Forward, left, right",
            picture: "/lessons/algorithms/lesson-6-2.jpg",
            alt: "A boy on a chalk grid turning a quarter turn on the spot with his arms out",
            text: [
              "'Forward' moves the robot one square in the direction it is facing.",
              "'Turn left' and 'turn right' make the robot turn a quarter turn on the spot. It doesn't move to a new square, it just faces a new way.",
              "Left and right are from the robot's point of view, not yours. Imagine you are the robot.",
            ],
          },
          {
            heading: "Predict, then test",
            picture: "/lessons/algorithms/lesson-6-3.jpg",
            alt: "A girl tracing a route with her finger across a paper grid from a toy car to a treasure",
            text: [
              "Before you run a program, predict where the robot will end up. Trace the route with your finger, one instruction at a time.",
              "Then run it and see if you were right. If not, there's a bug to find. You can use loops here too: 'Repeat 3 times: forward'.",
            ],
          },
        ],
        words: [
          { word: "grid", meaning: "a pattern of squares, in rows and columns" },
          { word: "direction", meaning: "the way something is facing or moving" },
          { word: "quarter turn", meaning: "a turn to face left or right, without moving to a new square" },
          { word: "predict", meaning: "to say what you think will happen before it happens" },
        ],
      },
      practice: {
        intro: "Think like a robot. Use your finger to help.",
        questions: [
          { type: "choice", q: "A robot is facing the door. You say 'forward'. What happens?", options: ["It turns around", "It moves one square towards the door", "It turns left"], answer: 1 },
          { type: "choice", q: "A robot is told 'turn right'. Does it move to a new square?", options: ["No, it just faces a new way", "Yes, one square to the right"], answer: 0 },
          {
            type: "choice",
            q: "A robot faces north. It does: turn right, forward, forward. Which way is it facing now?",
            options: ["North", "South", "East"],
            answer: 2,
            why: "Turning right from north makes it face east. Going forward doesn't change which way it faces.",
          },
          { type: "type", q: "How many squares does 'Repeat 4 times: forward' move the robot?", answer: ["4", "four"] },
          { type: "choice", q: "A robot faces north and does 'turn left, turn left'. Which way is it facing?", options: ["West", "North", "South"], answer: 2, why: "Two quarter turns make a half turn, so it now faces the opposite way." },
        ],
      },
      task: {
        title: "Grid robot game",
        intro: "Make a grid on the floor and program a 'robot' to reach a treasure.",
        need: ["Masking tape or chalk to make a grid, or a large sheet of paper with squares drawn on it", "A small toy to be the robot", "A small 'treasure' and a few 'rocks' (cushions or cups) to avoid", "Paper and a pencil"],
        steps: [
          "Make a grid about 5 squares by 5 squares. Big ones on the floor, or small ones on paper.",
          "Put the robot in one corner, facing a direction. Put the treasure in another square and a few rocks to steer around.",
          "Write a program to reach the treasure using only: forward, turn left, turn right. Use a loop if you can.",
          "Predict: trace the route with your finger. Will it reach the treasure?",
          "Run the program. Move the robot (or walk it yourself!) one instruction at a time. If it goes wrong, debug it.",
          "Swap jobs. Your grown-up writes a program and you predict where it ends.",
        ],
      },
      exit: [
        { type: "choice", q: "What does 'forward' do?", options: ["Turns the robot round", "Moves the robot one square the way it is facing", "Moves the robot two squares"], answer: 1 },
        { type: "choice", q: "When a robot turns left, does it move to a new square?", options: ["Yes", "No, it turns on the spot"], answer: 1 },
        { type: "choice", q: "Whose left and right do you use?", options: ["The robot's", "Yours"], answer: 0 },
        { type: "choice", q: "What does predict mean?", options: ["To fix a mistake", "To say what you think will happen before it happens", "To repeat a step"], answer: 1 },
        {
          type: "choice",
          q: "A robot faces the window. It does: turn right, turn right. Which way is it facing now?",
          options: ["Towards the window", "Away from the window", "It has moved two squares"],
          answer: 1,
          why: "Two quarter turns make a half turn, so it faces the opposite way. Turns don't move it to a new square.",
        },
        { type: "type", q: "A robot does 'Repeat 3 times: forward'. How many squares does it move?", answer: ["3", "three"] },
      ],
      grownUp: {
        need: ["Masking tape, chalk or a large sheet of paper", "A small toy", "A few cushions or cups"],
        tips: [
          "Left and right from the robot's view is the hardest part. Let your child stand on the grid and turn their own body, or hold the toy and turn it.",
          "If you'd like a screen extension, free online block-coding sites for children (no sign-up needed) let them program a character around a grid. It's optional: the floor game teaches the same thing.",
          "To finish the unit, ask your child to explain to someone what an algorithm, a bug and a loop are.",
        ],
        younger: "Use a 3 by 3 grid and only 'forward' and 'turn right' to start with. Let them walk the route themselves.",
        older: "Add rules: the shortest program wins, or the robot must visit two treasures. Can they use a loop to draw a square: 'Repeat 4 times: forward, turn right'?",
      },
    },
  ],
};
