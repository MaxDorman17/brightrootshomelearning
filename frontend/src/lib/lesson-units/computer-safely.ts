import type { LessonUnit } from "@/lib/lessons";

/**
 * Using a computer safely, for ages 7 to 9. Most tasks are unplugged, with paper and things from around the house.
 * Anything on screen is done with a grown-up and needs no sign-ups or paid software.
 */
export const computerSafely: LessonUnit = {
  slug: "computer-safely",
  title: "Using a computer safely",
  short: "Computers",
  subject: "Computing",
  ages: "7 to 9",
  emoji: "💻",
  color: "#4B6A9B",
  summary: "Six lessons: what a computer is, its parts, keeping safe online, strong passwords, searching the internet sensibly, and healthy screen time.",
  cover: "/lessons/units/computer-safely.jpg",
  lessons: [
    {
      slug: "computer-safely-1",
      title: "What is a computer?",
      emoji: "🖥️",
      minutes: 45,
      goal: "I can explain that a computer takes in input, processes it and gives out output, and find computers around my home.",
      starter: [
        { type: "choice", q: "Which of these is a computer?", options: ["A wooden spoon", "A tablet", "A pillow"], answer: 1 },
        {
          type: "pick",
          q: "Which of these do you think have a computer inside? There is more than one.",
          options: ["A laptop", "A pencil", "A smart TV", "A games console"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Can a computer think and feel just like a person?", options: ["Yes, just like us", "No, it follows instructions"], answer: 1 },
        { type: "type", q: "What do you press on a keyboard to type letters?", answer: ["keys", "key", "the keys", "buttons"] },
        { type: "choice", q: "What do you think we call the instructions that tell a computer what to do?", options: ["A picnic", "A puddle", "A program"], answer: 2 },
        { type: "match", q: "Match each machine to what it does.", pairs: [["A phone", "Calling family"], ["A printer", "Putting pictures onto paper"], ["A games console", "Playing games"]] },
      ],
      learn: {
        cards: [
          {
            heading: "Computers are everywhere",
            text: [
              "A computer is a machine that follows instructions. You probably know laptops and desktop computers.",
              "Tablets, phones, games consoles and smart TVs are computers too. Even microwaves, washing machines and cars have small computers hidden inside them.",
            ],
          },
          {
            heading: "In, think, out",
            text: [
              "Every computer does three jobs. First, information goes in. This is called input. Pressing a key, tapping a screen or speaking are all input.",
              "Next, the computer works on the information. This is called processing.",
              "Last, something comes out. This is called output. A picture on a screen, a sound or a printed page are all output.",
            ],
          },
          {
            heading: "Instructions, not ideas",
            text: [
              "Computers are very, very fast, but they can only do what their instructions tell them. A set of instructions for a computer is called a program. People called programmers write them.",
              "Think about a microwave. You press the buttons for one minute (input). It counts down and switches on the heat (processing). It warms your food and beeps when it's done (output).",
            ],
          },
        ],
        words: [
          { word: "input", meaning: "information that goes into a computer, like a key press or a tap" },
          { word: "processing", meaning: "the computer working on the information, following its instructions" },
          { word: "output", meaning: "what comes out of a computer, like a picture or a sound" },
          { word: "program", meaning: "a set of instructions that tells a computer what to do" },
          { word: "device", meaning: "a machine or gadget, like a tablet or a phone" },
        ],
      },
      practice: {
        intro: "Input, processing or output?",
        questions: [
          {
            type: "match",
            q: "Match each one to its job.",
            pairs: [["Typing on a keyboard", "Input"], ["A picture on the screen", "Output"], ["The computer following its instructions", "Processing"]],
          },
          { type: "choice", q: "A microwave beeps when your food is ready. Is the beep input, processing or output?", options: ["Input", "Processing", "Output"], answer: 2 },
          { type: "order", q: "Put a computer's three jobs in order.", items: ["Information goes in (input)", "The computer works on it (processing)", "Something comes out (output)"] },
          {
            type: "pick",
            q: "Which of these have a small computer inside? There is more than one.",
            options: ["A microwave", "A wooden chair", "A games console", "A digital watch"],
            answers: [0, 2, 3],
          },
          {
            type: "gap",
            q: "Fill the gaps.",
            text: "Speaking to a smart speaker is ___. The music it plays back is ___.",
            bank: ["input", "output", "a program"],
            answers: ["input", "output"],
          },
        ],
      },
      task: {
        title: "Computer hunt",
        intro: "How many computers are hiding in your home? Go on a hunt with your grown-up.",
        need: ["A sheet of paper", "A pencil", "A grown-up to hunt with"],
        steps: [
          "Draw three columns on your paper. Write Device, Input and Output at the top.",
          "Walk around your home with your grown-up. Look for machines with buttons, screens, or ones that beep. Don't switch anything on without asking.",
          "For each one you find, draw it in the first column. Then write or draw its input and its output. A TV remote: you press a button (input), and the TV changes channel (output).",
          "Count up. How many computers did you find? Which one surprised you most?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a computer?", options: ["A machine that follows instructions", "A machine that has its own ideas", "Only a kind of TV"], answer: 0 },
        { type: "order", q: "Put these in order.", items: ["Input", "Processing", "Output"] },
        {
          type: "match",
          q: "Match each one to input, processing or output.",
          pairs: [["Pressing a button on a remote", "Input"], ["Working out what to do", "Processing"], ["A page coming out of a printer", "Output"]],
        },
        { type: "type", q: "What do we call a set of instructions for a computer?", answer: ["program", "a program", "programs", "programme", "a programme"] },
        {
          type: "pick",
          q: "Which of these are outputs? There is more than one.",
          options: ["Sound from a speaker", "Typing on a keyboard", "A picture on a screen", "A printed page"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Who writes the instructions a computer follows?", options: ["The computer itself", "People called programmers", "Nobody"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and a pencil"],
        tips: [
          "This lesson needs no screens at all. The idea of input, processing and output is the foundation for the rest of the unit.",
          "Talk it through when you use devices day to day: 'I'm tapping the screen, that's input. Now the map is showing, that's output.'",
        ],
        younger: "Hunt for three things in the house that beep or light up, and say what makes them do it.",
        older: "At a shop's self-checkout, spot the input (scanning), processing (finding the price) and output (the beep and the price on the screen).",
      },
    },
    {
      slug: "computer-safely-2",
      title: "Parts of a computer",
      emoji: "🖱️",
      minutes: 45,
      goal: "I can name the main parts of a computer and say what each one does.",
      starter: [
        { type: "choice", q: "What does a computer do with input?", options: ["Throws it away", "Processes it", "Eats it"], answer: 1 },
        { type: "match", q: "Match each one to input or output.", pairs: [["Tapping a tablet screen", "Input"], ["Sound from a speaker", "Output"]] },
        { type: "type", q: "What is the word for what comes out of a computer, like a sound or a picture?", answer: ["output", "outputs"] },
        {
          type: "pick",
          q: "Which of these have a computer inside? There is more than one.",
          options: ["A phone", "A microwave", "A cushion", "A smart TV"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "What is a program?", options: ["A kind of cable", "A set of instructions for a computer", "A computer's screen"], answer: 1 },
        { type: "gap", q: "Fill the gaps.", text: "First comes ___, then ___, then output.", bank: ["input", "processing", "printer"], answers: ["input", "processing"] },
      ],
      learn: {
        cards: [
          {
            heading: "Parts you can see",
            text: [
              "The screen, or monitor, shows pictures and words. It's an output. Speakers are outputs too: they play sounds.",
              "The keyboard is for typing, and the mouse or trackpad moves the pointer around the screen. A microphone hears your voice and a camera sees pictures. These are all inputs.",
              "On a tablet or phone, the touchscreen is both: you tap it (input) and it shows you things (output).",
            ],
          },
          {
            heading: "Parts inside",
            text: [
              "Inside is the processor. It's like the computer's brain: it follows the instructions very, very fast.",
              "Memory is like the computer's desk. It holds what the computer is busy with right now. Storage is like a cupboard. It keeps your photos, stories and games saved, even when the computer is switched off.",
              "A battery or a plug gives the computer power. The parts inside are delicate, so only an expert should ever open a computer up.",
            ],
          },
          {
            heading: "Hardware and software",
            text: [
              "The parts of a computer you can touch are called hardware. The programs and apps are called software. You can't touch software, but the computer can't do anything useful without it.",
              "Look after hardware: clean, dry hands, no drinks nearby, and carry it carefully with two hands.",
            ],
          },
        ],
        words: [
          { word: "hardware", meaning: "the parts of a computer you can touch" },
          { word: "software", meaning: "the programs and apps that run on a computer" },
          { word: "processor", meaning: "the part inside that follows the instructions, like a brain" },
          { word: "storage", meaning: "where files are kept saved, even when the computer is off" },
        ],
      },
      practice: {
        intro: "Name that part.",
        questions: [
          {
            type: "match",
            q: "Match each part to its job.",
            pairs: [["Keyboard", "Typing letters"], ["Screen", "Showing pictures"], ["Speakers", "Playing sounds"], ["Mouse", "Moving the pointer"]],
          },
          {
            type: "pick",
            q: "Which of these are inputs? There is more than one.",
            options: ["Microphone", "Speakers", "Keyboard", "Camera"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "Which part is like the computer's brain?", options: ["The mouse", "The speakers", "The processor"], answer: 2 },
          { type: "choice", q: "Is a game app hardware or software?", options: ["Hardware", "Software"], answer: 1 },
          { type: "type", q: "What do we call the parts of a computer you can touch?", answer: ["hardware", "the hardware"] },
        ],
      },
      task: {
        title: "Build a cardboard computer",
        intro: "Make your own model computer from boxes, then give your grown-up a tour.",
        need: ["A cereal box", "A small box, like a matchbox or a tea box", "Paper and felt pens", "Sticky tape or glue", "A piece of string", "Sticky notes or small scraps of paper"],
        steps: [
          "Draw a screen on the front of the cereal box. This is your monitor.",
          "Draw a keyboard on a strip of paper, with rows of little square keys.",
          "Make a mouse from the small box. Tape on a piece of string for its cable.",
          "Draw a processor, memory and storage on a scrap of paper and tuck it inside the cereal box. That's the inside of your computer.",
          "Put a sticky note on each part saying input, output, or inside.",
          "Give your grown-up a tour. What does each part do?",
        ],
      },
      exit: [
        { type: "choice", q: "What does the screen do?", options: ["Lets you type", "Shows pictures and words", "Keeps the computer cool"], answer: 1 },
        {
          type: "pick",
          q: "Which of these are outputs? There is more than one.",
          options: ["Speakers", "Keyboard", "Screen", "Mouse"],
          answers: [0, 2],
        },
        { type: "choice", q: "What does the processor do?", options: ["Follows the instructions very fast", "Plays sounds", "Moves the pointer"], answer: 0 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "The parts you can touch are ___. Programs and apps are ___.",
          bank: ["hardware", "software", "storage"],
          answers: ["hardware", "software"],
        },
        {
          type: "match",
          q: "Match each part to its job.",
          pairs: [["Storage", "Keeps files saved when it's off"], ["Memory", "Holds what it's busy with now"], ["Battery", "Gives the computer power"]],
        },
        { type: "choice", q: "A tablet's touchscreen is...", options: ["only an input", "only an output", "both an input and an output"], answer: 2 },
      ],
      grownUp: {
        need: ["Empty boxes, string, paper, pens and tape"],
        tips: [
          "If you have an old unplugged keyboard or mouse, let your child explore it. Never open up devices or let children handle loose batteries, especially button batteries.",
          "The 'desk and cupboard' idea for memory and storage is a simplification, but it's a helpful one at this age.",
        ],
        younger: "Point to the parts of your own phone, tablet or laptop together and name each one.",
        older: "Sort every part into three groups: input, output, or both. Can they think of a part that fits none of these?",
      },
    },
    {
      slug: "computer-safely-3",
      title: "Keeping safe online",
      emoji: "🛡️",
      minutes: 45,
      goal: "I can keep my personal information private online and I know to tell a trusted adult if something worries me.",
      starter: [
        { type: "choice", q: "The parts of a computer you can touch are called...", options: ["software", "hardware"], answer: 1 },
        { type: "match", q: "Match each part to its job.", pairs: [["Keyboard", "Typing"], ["Screen", "Showing pictures"], ["Speakers", "Playing sounds"]] },
        {
          type: "pick",
          q: "Which of these are inputs? There is more than one.",
          options: ["Camera", "Microphone", "Speakers", "Mouse"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "Which part is the computer's 'brain'? It starts with p.", answer: ["processor", "the processor", "cpu"] },
        { type: "choice", q: "Is a touchscreen an input, an output or both?", options: ["Input", "Output", "Both"], answer: 2 },
        { type: "gap", q: "Fill the gap.", text: "___ keeps your files saved, even when the computer is switched off.", bank: ["Storage", "Speakers", "Software"], answers: ["Storage"] },
      ],
      learn: {
        cards: [
          {
            heading: "Online is part of real life",
            text: [
              "Going online means using the internet. You can watch, play, learn and video-call family far away.",
              "Most of the time it's fun and friendly. Just like crossing the road, a few simple rules keep you safe, and your grown-up is there to help.",
            ],
          },
          {
            heading: "Keep personal information private",
            text: [
              "Personal information is anything that could tell someone who you are or where to find you. That's your full name, address, school or club, phone number, birthday, passwords, and photos of you.",
              "Keep it private online. If a game or website asks for it, stop and ask your grown-up first. Things like your favourite colour are fine to chat about.",
              "Remember, people online aren't always who they say they are.",
            ],
          },
          {
            heading: "Tell someone, and be kind",
            text: [
              "If anything online makes you feel worried, upset or confused, stop. Turn the screen face down or close the lid, and tell a trusted adult. That could be a message, a picture, a pop-up, or someone asking you to keep a secret.",
              "You will not be in trouble for telling. Telling is always the right thing to do.",
              "Be kind online too. Words on a screen can hurt. Only write things you'd be happy to say to someone's face.",
            ],
          },
        ],
        words: [
          { word: "online", meaning: "using the internet" },
          { word: "personal information", meaning: "facts that could tell someone who you are or where to find you" },
          { word: "private", meaning: "kept safe and not shared with everyone" },
          { word: "trusted adult", meaning: "a grown-up you know who will listen and help" },
        ],
      },
      practice: {
        intro: "Private, or OK to share?",
        questions: [
          {
            type: "pick",
            q: "Which of these should you keep private online? There is more than one.",
            options: ["Your home address", "Your favourite animal", "The name of your school", "Your phone number"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "A game asks for your home address. What should you do?", options: ["Type it in", "Stop and ask your grown-up"], answer: 1 },
          { type: "order", q: "Something online worries you. Put what to do in order.", items: ["Stop", "Turn the screen face down or close the lid", "Tell a trusted adult"] },
          {
            type: "choice",
            q: "Someone in a game writes something unkind to you. What is the best thing to do?",
            options: ["Don't reply, and tell a trusted adult", "Write something unkind back", "Keep it a secret"],
            answer: 0,
          },
          { type: "type", q: "If something online worries you, tell a trusted ___.", answer: ["adult", "grown-up", "grownup", "grown up"] },
        ],
      },
      task: {
        title: "Private or OK to share?",
        intro: "A sorting game to play with your grown-up, then a helping hand to remember who you can tell.",
        need: ["12 small pieces of paper", "A pen", "Two bowls or boxes", "A sheet of paper and felt pens"],
        steps: [
          "Your grown-up writes one thing on each piece of paper, like: my full name, my favourite food, my address, my favourite colour, my school, my phone number, a joke, my password, my birthday, my favourite book.",
          "Call one bowl 'Keep private' and the other 'OK to share'.",
          "Take turns to pick a piece of paper and decide which bowl it goes in. Talk about any tricky ones.",
          "Now draw around your hand. On each finger, write or draw a trusted adult you could tell if something online worried you.",
          "Put your helping hand somewhere you'll see it, near where you use screens.",
        ],
      },
      exit: [
        {
          type: "choice",
          q: "What is personal information?",
          options: ["The name of your favourite film", "Facts that could tell someone who you are or where to find you", "Any picture of an animal"],
          answer: 1,
        },
        {
          type: "pick",
          q: "Which of these are personal information? There is more than one.",
          options: ["Your address", "Your birthday", "Your favourite colour", "Your phone number"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "Something online upsets you. What should you do?", options: ["Stop and tell a trusted adult", "Keep watching", "Send it to a friend"], answer: 0 },
        { type: "choice", q: "Will you be in trouble for telling?", options: ["Yes", "No, telling is always the right thing to do"], answer: 1 },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "Only write things online that you would be happy to say to someone's ___.",
          bank: ["face", "dog", "shoe"],
          answers: ["face"],
        },
        { type: "choice", q: "Are people online always who they say they are?", options: ["Yes, always", "No, not always"], answer: 1 },
      ],
      grownUp: {
        need: ["Scraps of paper, a pen, two bowls"],
        tips: [
          "Keep the tone calm and matter-of-fact. The message is 'you can always tell me', not 'the internet is scary'.",
          "Say it often: your child won't lose their device or be in trouble for telling you something. Worry about that is the main reason children keep things to themselves.",
          "Using devices in shared rooms, and setting up parental controls and safe search, sit well alongside this lesson.",
        ],
        younger: "Agree two simple rules: 'Ask a grown-up before going online' and 'Tell a grown-up if anything worries me'.",
        older: "Talk about the difference between a surprise (fine, and soon shared) and a secret someone online asks you to keep (always tell).",
      },
    },
    {
      slug: "computer-safely-4",
      title: "Strong passwords",
      emoji: "🔑",
      minutes: 45,
      goal: "I can explain what a password is for and how to make one strong and keep it secret.",
      starter: [
        {
          type: "pick",
          q: "Which of these should you keep private online? There is more than one.",
          options: ["Your full name", "Your favourite fruit", "Your address", "Your phone number"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Something online worries you. What should you do?", options: ["Hide it", "Keep it a secret", "Tell a trusted adult"], answer: 2 },
        { type: "type", q: "Who should you tell if something online worries you? A trusted...", answer: ["adult", "grown-up", "grownup", "grown up"] },
        { type: "choice", q: "Being kind online means...", options: ["only writing what you'd say to someone's face", "saying anything you like"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Keep your personal information ___ online.", bank: ["private", "loud", "upside down"], answers: ["private"] },
        { type: "choice", q: "Are people online always who they say they are?", options: ["No, not always", "Yes, always"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "What is a password?",
            text: [
              "A password is a secret word or phrase that unlocks something, just like a key unlocks a door.",
              "It stops other people getting into your games, apps or accounts and pretending to be you. Some devices use a PIN, which is a secret number, or your face or fingerprint instead.",
            ],
          },
          {
            heading: "Make it strong",
            text: [
              "A weak password is easy to guess, like your name, your pet's name, 'password' or '12345'.",
              "A strong password is long and hard to guess. A great trick is to pick three random words that don't go together and stick them together. Adding a number or a symbol makes it even stronger.",
              "Never use a password you've seen in a lesson or a book. Make your own with your grown-up.",
            ],
          },
          {
            heading: "Keep it secret",
            text: [
              "Only share your password with your grown-up. Not your best friend, not anyone online, and not anyone who asks nicely.",
              "Don't leave it written where others can see it. If you think someone knows your password, tell your grown-up so they can help you change it.",
              "It's best to use a different password for different things. Your grown-up can help you keep track of them.",
            ],
          },
        ],
        words: [
          { word: "password", meaning: "a secret word or phrase that unlocks something" },
          { word: "PIN", meaning: "a secret number that unlocks a device or card" },
          { word: "account", meaning: "your own space in a game, app or website that you log in to" },
          { word: "log in", meaning: "to use your name and password to get into an account" },
        ],
      },
      practice: {
        intro: "Strong or weak?",
        questions: [
          { type: "choice", q: "Which password is the strongest?", options: ["password", "12345", "CloudTrumpetPebble"], answer: 2 },
          {
            type: "pick",
            q: "Which of these are weak passwords? There is more than one.",
            options: ["Your pet's name", "Three random words stuck together", "12345", "Your own name"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "Who can you share your password with?", options: ["Your best friend", "Your grown-up", "Anyone who asks nicely"], answer: 1 },
          {
            type: "order",
            q: "Put the steps for a strong password in order.",
            items: ["Think of three words that don't go together", "Stick them together", "Add a number or a symbol", "Keep it secret"],
          },
          { type: "type", q: "What do we call a secret number that unlocks a device?", answer: ["PIN", "pin", "a PIN", "a pin", "PIN number", "pin number"] },
        ],
      },
      task: {
        title: "The three-word password game",
        intro: "Find out why random words make strong passwords. These are just for practice, so never use them for real.",
        need: ["About 20 small pieces of paper", "A pen", "A bowl or a hat", "A dice"],
        steps: [
          "Write one word on each piece of paper: animals, foods, colours, objects, anything you like. Fold them up and put them in the bowl.",
          "Pull out three words without looking. Roll the dice to get a number to add on the end.",
          "Draw a silly picture that shows your three words together. A picture helps you remember them.",
          "Now play 'Guess my password'. Your grown-up picks a weak one, like the name of your pet. Can you guess it? Probably quickly!",
          "Next, your grown-up secretly picks three random words from the bowl. Try to guess them. Is it much harder?",
          "Tear up your practice passwords at the end. Real ones are made privately with your grown-up.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a password for?", options: ["To make the screen brighter", "To keep other people out of your account", "To turn up the sound"], answer: 1 },
        { type: "choice", q: "Which password is the strongest?", options: ["fluffy", "1234", "GiraffeKettleRain"], answer: 2 },
        {
          type: "pick",
          q: "Which are good password rules? There is more than one.",
          options: ["Make it long", "Use your own name", "Keep it secret", "Use different passwords for different things"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Who can know your password?", options: ["Only your grown-up", "Your best friend", "Everyone in your class"], answer: 0 },
        { type: "gap", q: "Fill the gaps.", text: "A strong password is ___ and hard to ___.", bank: ["long", "short", "guess", "eat"], answers: ["long", "guess"] },
        {
          type: "choice",
          q: "You think someone knows your password. What should you do?",
          options: ["Do nothing", "Tell your grown-up so it can be changed", "Tell everyone"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Scraps of paper, a pen, a bowl and a dice"],
        tips: [
          "The 'three random words' idea is the advice the UK's National Cyber Security Centre gives to everyone, grown-ups included.",
          "Never use your child's real password as an example, and don't make up real ones during the game. Set up any real password together, privately.",
          "Model it yourself: cover the screen when you type a PIN, and explain why.",
        ],
        younger: "Keep it to one idea: a password is like a key, and we keep keys safe and don't give them away.",
        older: "Talk about why long passwords are harder to guess, and why using the same password everywhere is risky.",
      },
    },
    {
      slug: "computer-safely-5",
      title: "The internet and searching",
      emoji: "🔍",
      minutes: 45,
      goal: "I can explain what the internet is and search for information sensibly with a grown-up.",
      starter: [
        { type: "choice", q: "A password is like a...", options: ["key", "sandwich", "window"], answer: 0 },
        { type: "choice", q: "Which password is the strongest?", options: ["12345", "MoonSpoonRiver", "password"], answer: 1 },
        {
          type: "pick",
          q: "Which of these are weak passwords? There is more than one.",
          options: ["Your name", "password", "Three random words", "Your pet's name"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "What do we call a secret number that unlocks a device?", answer: ["PIN", "pin", "a PIN", "a pin", "PIN number", "pin number"] },
        { type: "choice", q: "Who can you share your password with?", options: ["Your best friend", "Anyone online", "Your grown-up"], answer: 2 },
        { type: "gap", q: "Fill the gap.", text: "Three ___ words stuck together make a strong password.", bank: ["random", "short", "rude"], answers: ["random"] },
      ],
      learn: {
        cards: [
          {
            heading: "A giant web of computers",
            text: [
              "The internet is millions of computers all around the world, joined together. They're linked by cables, some running under the sea, and by signals through the air, like Wi-Fi.",
              "It lets computers send messages, pictures and videos to each other in moments. Websites are pages of information kept on special computers, and you visit them using an app called a web browser.",
            ],
          },
          {
            heading: "Searching sensibly",
            text: [
              "A search engine helps you find websites. You type in a few key words, not a whole sentence. For 'How big is a blue whale?' you could type 'blue whale size'.",
              "You get a list of results. Read the short description under each one before you click. Results marked 'Ad' or 'Sponsored' are adverts trying to sell you things.",
              "Always search with your grown-up beside you.",
            ],
          },
          {
            heading: "Is it true?",
            text: [
              "Anyone can put things on the internet, so not everything you read is true.",
              "Check it: is it a website you can trust, like a museum, a library or a well-known science or news site? Do two or three websites say the same thing? Ask your grown-up what they think.",
              "If you find something that upsets you, stop and tell your grown-up straight away.",
            ],
          },
        ],
        words: [
          { word: "internet", meaning: "millions of computers around the world joined together" },
          { word: "website", meaning: "pages of information you can visit on the internet" },
          { word: "search engine", meaning: "a website that helps you find other websites" },
          { word: "key words", meaning: "the few important words you type in to search" },
          { word: "web browser", meaning: "the app you use to visit websites" },
        ],
      },
      practice: {
        intro: "Smart searching.",
        questions: [
          {
            type: "choice",
            q: "What is the internet?",
            options: ["Millions of computers joined together around the world", "One giant computer in London", "A kind of TV channel"],
            answer: 0,
          },
          { type: "choice", q: "You want to know how many legs a spider has. Which are the best key words?", options: ["legs", "spider legs how many", "I like animals"], answer: 1 },
          {
            type: "pick",
            q: "How can you check if something online is true? There is more than one.",
            options: ["See if two or three websites agree", "Ask your grown-up", "Believe the first thing you read", "Use a website you trust, like a museum's"],
            answers: [0, 1, 3],
          },
          {
            type: "match",
            q: "Match each word to its meaning.",
            pairs: [
              ["Search engine", "Helps you find websites"],
              ["Website", "Pages of information you can visit"],
              ["Advert", "Trying to sell you something"],
              ["Internet", "Computers joined around the world"],
            ],
          },
          { type: "type", q: "Is everything on the internet true? Type yes or no.", answer: ["no"] },
        ],
      },
      task: {
        title: "Be a human search engine",
        intro: "Search through paper 'web pages' just like a search engine does, then try a real search with your grown-up if you like.",
        need: ["8 pieces of card or paper", "A pen", "An animal book, or a grown-up who knows a few animal facts", "A grown-up with a phone, tablet or computer (optional)"],
        steps: [
          "Your grown-up writes a short animal fact on each card, like 'A spider has eight legs'. These are your web pages. One card has a fact that isn't true!",
          "Your grown-up asks a question, like 'How many legs does a spider have?'. Pick out the key words: spider and legs.",
          "Spread the cards out and hunt for ones with your key words on. That's what a search engine does, but millions of times faster.",
          "Check every fact you find against the book or with your grown-up. Can you spot the card that isn't true?",
          "If you like, do one real search together on your grown-up's device, typing two or three key words. Read the results together and find the answer on two different websites.",
        ],
      },
      exit: [
        {
          type: "choice",
          q: "What is the internet?",
          options: ["A single website", "Millions of computers joined together around the world", "A box in your house"],
          answer: 1,
        },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "A ___ engine helps you find websites. You type in a few ___ words.",
          bank: ["search", "fire", "key", "long"],
          answers: ["search", "key"],
        },
        { type: "choice", q: "Is everything on the internet true?", options: ["No, anyone can put things online", "Yes, always"], answer: 0 },
        {
          type: "pick",
          q: "Which are good ways to check a fact? There is more than one.",
          options: ["Check another website you trust", "Ask a grown-up", "Look in a book", "Just guess"],
          answers: [0, 1, 2],
        },
        { type: "choice", q: "Results marked 'Ad' or 'Sponsored' are...", options: ["always the best answers", "secret messages", "adverts trying to sell you things"], answer: 2 },
        { type: "choice", q: "Who should be with you when you search?", options: ["Nobody", "Your grown-up", "Someone you met online"], answer: 1 },
      ],
      grownUp: {
        need: ["Card and a pen", "An animal book", "A device with a web browser (optional)"],
        tips: [
          "If you do the real search, turn on safe search first and sit with your child. No account or sign-up is needed.",
          "Think aloud as you choose results: 'This one is from a museum, so I trust it more' is exactly the habit you're building.",
        ],
        younger: "Do the card search with just four cards, and help them spot the key words.",
        older: "Search for the same question with different key words and compare the results. Which words worked best?",
      },
    },
    {
      slug: "computer-safely-6",
      title: "Healthy screen time",
      emoji: "⏰",
      minutes: 45,
      goal: "I can balance screen time with other things and notice when I need a break.",
      starter: [
        { type: "choice", q: "What is the internet?", options: ["Millions of computers joined together", "One big computer", "A TV channel"], answer: 0 },
        { type: "type", q: "What helps you find websites? A search...", answer: ["engine", "search engine", "an engine"] },
        {
          type: "pick",
          q: "How can you check something online is true? There is more than one.",
          options: ["Believe the first thing you see", "Ask your grown-up", "See if other websites agree", "Look in a book"],
          answers: [1, 2, 3],
        },
        { type: "choice", q: "Which are the best key words for 'What do pandas eat?'", options: ["pandas food eat", "I really like pandas", "eat"], answer: 0 },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Website", "Pages you can visit"], ["Advert", "Trying to sell you something"], ["Web browser", "The app for visiting websites"]] },
        { type: "choice", q: "Is everything on the internet true?", options: ["Yes", "No"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Screens can be great",
            text: [
              "Screens let you learn, make things, play and chat to family far away. Screen time isn't bad.",
              "But time on a screen is time not spent on other things your body and brain need: moving, playing outside, talking with people, reading and sleeping. The trick is balance.",
            ],
          },
          {
            heading: "Listen to your body",
            text: [
              "Your body tells you when you need a break. Tired or sore eyes, a stiff neck, a headache, or feeling grumpy and wound up are all signs.",
              "Every 20 minutes, look at something far away for about 20 seconds to rest your eyes. Sit up comfortably, hold the screen not too close, and get up for a stretch.",
            ],
          },
          {
            heading: "Balance and bedtime",
            text: [
              "Bright screens and exciting games keep your brain awake. Switching off about an hour before bed helps you fall asleep. Children your age need lots of sleep, around ten hours a night.",
              "Devices sleep best outside your bedroom. Stopping can be hard, so use a timer, finish the bit you're on, and have something fun planned for next.",
            ],
          },
        ],
        words: [
          { word: "screen time", meaning: "the time you spend using screens like TVs, tablets and phones" },
          { word: "balance", meaning: "a good mix of different things" },
          { word: "posture", meaning: "how you hold your body when you sit or stand" },
          { word: "screen-free", meaning: "a time or place with no screens" },
        ],
      },
      practice: {
        intro: "Getting the balance right.",
        questions: [
          {
            type: "pick",
            q: "Which are signs you need a screen break? There is more than one.",
            options: ["Sore or tired eyes", "Feeling grumpy", "Feeling fresh and full of energy", "A stiff neck"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "When is a good time to switch screens off before bed?", options: ["About an hour before bed", "Just as you close your eyes"], answer: 0 },
          {
            type: "match",
            q: "Match each activity to what it's good for.",
            pairs: [["Playing outside", "Moving your body"], ["Sleeping", "Resting and growing"], ["A video call with Grandma", "Staying close to family"]],
          },
          {
            type: "order",
            q: "Put a calm way to finish screen time in order.",
            items: ["The timer goes off", "Finish the bit you're on", "Switch off and put the device away", "Start your next activity"],
          },
          { type: "type", q: "Every 20 minutes, look at something far away for about how many seconds?", answer: ["20", "twenty"], after: "seconds" },
        ],
      },
      task: {
        title: "My balanced day plate",
        intro: "Draw a plate that shows a balanced day, then make a family screen plan together.",
        need: ["A paper plate or a big circle drawn on paper", "Felt pens or crayons", "A kitchen timer or a clock"],
        steps: [
          "Draw lines across your plate to split it into pieces, like a pizza. Make each piece a part of your day: sleep, learning, meals, playing, outdoors, and screens.",
          "Make the pieces bigger or smaller to show how much time each one gets. Sleep should be a big piece!",
          "Look at your plate with your grown-up. Is it balanced? Is anything missing?",
          "Around the edge, draw three screen-free things you love doing.",
          "Agree two family screen rules together, like 'No screens at meals' or 'Screens off an hour before bed'.",
          "Set the timer for 20 minutes during your next screen time. When it rings, look out of the window for 20 seconds and have a stretch.",
        ],
      },
      exit: [
        { type: "choice", q: "Why is it good to switch screens off before bed?", options: ["It makes you hungry", "It charges your eyes", "It helps you fall asleep"], answer: 2 },
        {
          type: "pick",
          q: "Which are signs you need a screen break? There is more than one.",
          options: ["A headache", "Tired eyes", "Feeling happy and calm", "Feeling grumpy"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "Where is the best place for devices at night?", options: ["Outside your bedroom", "Under your pillow"], answer: 0 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "Every ___ minutes, look at something far ___ for about 20 seconds.",
          bank: ["20", "2", "away", "close"],
          answers: ["20", "away"],
        },
        { type: "choice", q: "Is all screen time bad?", options: ["Yes", "No, but it's good to balance it with other things"], answer: 1 },
        {
          type: "pick",
          q: "Which of these are screen-free activities? There is more than one.",
          options: ["Building a den", "Reading a book", "Watching cartoons", "Playing football"],
          answers: [0, 1, 3],
        },
      ],
      grownUp: {
        need: ["A paper plate or paper, pens, a timer"],
        tips: [
          "UK health advice doesn't set one right number of hours. It suggests looking at what screens might be crowding out, like sleep, exercise and family time, and agreeing limits together.",
          "Give a warning before screen time ends, and plan what comes next. Stopping is much easier when there's something to go to.",
          "Children copy what they see, so it helps if grown-ups follow the family rules too.",
        ],
        younger: "Use a sand timer or kitchen timer, and let them be the one to say 'time's up'.",
        older: "Keep a screen-time diary for a week, then look at it together. How did they feel after different kinds of screen time?",
      },
    },
  ],
};
