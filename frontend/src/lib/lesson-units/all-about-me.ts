import type { LessonUnit } from "@/lib/lessons";

/** All about me and my feelings, for ages 5 to 7. Gentle, playful lessons a grown-up reads aloud with the child. */
export const allAboutMe: LessonUnit = {
  slug: "all-about-me",
  title: "All about me and my feelings",
  short: "All about me",
  subject: "RSHE (PSHE)",
  ages: "5 to 7",
  emoji: "🌟",
  color: "#C98A6B",
  summary: "Six gentle lessons: what makes me special, naming feelings, feelings in faces and bodies, calming down, talking to someone I trust, and being kind.",
  cover: "/lessons/units/all-about-me.jpg",
  lessons: [
    {
      slug: "all-about-me-1",
      title: "I am special",
      emoji: "🌟",
      minutes: 30,
      goal: "I can say what makes me special and that everyone is different.",
      starter: [
        { type: "choice", q: "Do you have a favourite food?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "Does everyone look the same?", options: ["Yes", "No"], answer: 1 },
        { type: "choice", q: "What colour are your eyes? Look in a mirror. Is that OK?", options: ["Every eye colour is OK", "Only one eye colour is OK"], answer: 0 },
        { type: "pick", q: "Which of these are things you can be good at? There is more than one.", options: ["Drawing", "Running", "A spoon", "Singing"], answers: [0, 1, 3] },
        { type: "match", q: "Match each part of you to what it does.", pairs: [["Eyes", "See"], ["Ears", "Hear"], ["Hands", "Hold"]] },
        { type: "choice", q: "Is there anyone else exactly like you?", options: ["Yes, lots", "No, you are the only you"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "There is only one you",
            picture: "/lessons/all-about-me/lesson-1-1.jpg",
            alt: "A girl smiling at her reflection in a mirror",
            text: [
              "There is nobody in the whole world exactly like you.",
              "You have your own face, your own voice and your own laugh. That makes you special.",
            ],
          },
          {
            heading: "Things I like and things I can do",
            picture: "/lessons/all-about-me/lesson-1-2.jpg",
            alt: "A boy building a block tower and a girl painting",
            text: [
              "You have things you like. Maybe a colour, a game, a food or an animal.",
              "You have things you are good at too. Maybe jumping, building, helping or making people laugh.",
              "You are learning new things all the time!",
            ],
          },
          {
            heading: "Everyone is different",
            picture: "/lessons/all-about-me/lesson-1-3.jpg",
            alt: "Six different children waving together in a park",
            text: [
              "People have different hair, skin, eyes and sizes. People like different things too.",
              "Being different is a good thing. It would be boring if we were all the same!",
            ],
          },
        ],
        words: [
          { word: "special", meaning: "there is nobody else quite like you" },
          { word: "different", meaning: "not the same" },
          { word: "talent", meaning: "something you are good at" },
        ],
      },
      practice: {
        intro: "Let's think about you!",
        questions: [
          { type: "choice", q: "Is it OK to like different things from your friend?", options: ["Yes", "No"], answer: 0 },
          { type: "pick", q: "Which of these could be different from person to person? There is more than one.", options: ["Hair", "Favourite game", "Eye colour"], answers: [0, 1, 2] },
          { type: "match", q: "Match each child to what they love.", pairs: [["Ava loves to paint", "Brushes"], ["Sam loves football", "A ball"], ["Mia loves books", "Stories"]] },
          { type: "choice", q: "What is a talent?", options: ["Something you eat", "Something you are good at"], answer: 1 },
        ],
      },
      task: {
        title: "My special me picture",
        intro: "Draw a picture all about you.",
        need: ["A sheet of paper", "Crayons or felt pens", "A mirror"],
        steps: [
          "Look in the mirror. What colour are your eyes and hair?",
          "Draw your face in the middle of the paper.",
          "Around it, draw three things you like.",
          "Draw one thing you are good at.",
          "Show your grown-up and tell them about your picture.",
        ],
      },
      exit: [
        { type: "choice", q: "Is there anyone else exactly like you?", options: ["No", "Yes"], answer: 0 },
        { type: "choice", q: "What does different mean?", options: ["The same", "Not the same"], answer: 1 },
        { type: "choice", q: "Is being different a good thing?", options: ["Yes", "No"], answer: 0 },
        { type: "pick", q: "Which of these make you special? There is more than one.", options: ["Your laugh", "Your voice", "Your face"], answers: [0, 1, 2] },
        { type: "choice", q: "Are you learning new things all the time?", options: ["No", "Yes"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "A ___ is something you are good at.", bank: ["talent", "table"], answers: ["talent"] },
      ],
      grownUp: {
        need: ["Paper and crayons", "A mirror"],
        tips: [
          "Praise effort and kindness as well as looks: 'You are so good at helping' means a lot.",
          "If your child talks about not liking how they look, listen kindly and point out things that make them wonderful.",
        ],
        younger: "Play 'I like...' in turns: you say something you like, then your child does.",
        older: "Make an 'All about me' booklet with a page each for likes, talents, family and what I want to learn next.",
      },
    },
    {
      slug: "all-about-me-2",
      title: "Naming my feelings",
      emoji: "😊",
      minutes: 30,
      goal: "I can name some feelings, like happy, sad and angry.",
      starter: [
        { type: "choice", q: "Is there anyone else exactly like you?", options: ["No", "Yes"], answer: 0 },
        { type: "choice", q: "What does different mean?", options: ["The same", "Not the same"], answer: 1 },
        { type: "choice", q: "What is a talent?", options: ["Something you are good at", "A kind of food"], answer: 0 },
        { type: "choice", q: "Is being different a good thing?", options: ["No", "Yes"], answer: 1 },
        { type: "pick", q: "Which of these can be different from person to person? There is more than one.", options: ["Hair", "Favourite colour", "Skin"], answers: [0, 1, 2] },
        { type: "choice", q: "Is it OK to like different things from your friend?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "We all have feelings",
            picture: "/lessons/all-about-me/lesson-2-1.jpg",
            alt: "A grown-up and two children on a sofa showing different feelings",
            text: [
              "Feelings are what is happening inside us. Everyone has them, grown-ups too.",
              "Feelings can change a lot, even in one day.",
            ],
          },
          {
            heading: "Feeling words",
            picture: "/lessons/all-about-me/lesson-2-2.jpg",
            alt: "Paper plates with happy, sad, angry, scared, worried and excited faces",
            text: [
              "Here are some feeling words: happy, sad, angry, scared, worried and excited.",
              "You might feel happy playing with a friend. You might feel sad if your toy breaks.",
              "You might feel excited before a party, or worried about something new.",
            ],
          },
          {
            heading: "All feelings are OK",
            picture: "/lessons/all-about-me/lesson-2-3.jpg",
            alt: "A grown-up gently hugging a sad young child",
            text: [
              "There are no bad feelings. It is OK to feel sad or angry sometimes.",
              "Saying the name of a feeling helps other people understand you.",
            ],
          },
        ],
        words: [
          { word: "feeling", meaning: "what is happening inside you, like happy or sad" },
          { word: "worried", meaning: "thinking something might go wrong" },
          { word: "excited", meaning: "really looking forward to something" },
        ],
      },
      practice: {
        intro: "How might they feel?",
        questions: [
          { type: "match", q: "Match each thing to a feeling.", pairs: [["Your ice cream falls on the floor", "Sad"], ["It is your birthday tomorrow", "Excited"], ["Someone knocks your tower down", "Angry"]] },
          { type: "choice", q: "Is it OK to feel angry sometimes?", options: ["No", "Yes"], answer: 1 },
          { type: "pick", q: "Which of these are feelings? There is more than one.", options: ["Happy", "Chair", "Scared", "Worried"], answers: [0, 2, 3] },
          { type: "choice", q: "Lily is starting a new club. She thinks it might go wrong. How might she feel?", options: ["Sleepy", "Worried", "Hungry"], answer: 1 },
        ],
      },
      task: {
        title: "Feelings faces game",
        intro: "Make feelings faces and play a guessing game.",
        need: ["Six paper plates or circles of card", "Crayons or felt pens"],
        steps: [
          "Draw a happy face on one plate.",
          "Draw sad, angry, scared, worried and excited faces on the others.",
          "Your grown-up says a feeling. Hold up the right face!",
          "Now swap. You say a feeling and your grown-up holds up the face.",
          "Tell your grown-up one thing that makes you feel happy.",
        ],
      },
      exit: [
        { type: "choice", q: "Does everyone have feelings?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "Are there any bad feelings?", options: ["No, all feelings are OK", "Yes"], answer: 0 },
        { type: "pick", q: "Which are feeling words? There is more than one.", options: ["Sad", "Excited", "Spoon"], answers: [0, 1] },
        { type: "choice", q: "What does excited mean?", options: ["Very tired", "Really looking forward to something"], answer: 1 },
        { type: "match", q: "Match each thing to a feeling.", pairs: [["Playing with a friend", "Happy"], ["Your toy breaks", "Sad"], ["Something new tomorrow", "Worried"]] },
        { type: "choice", q: "Can feelings change in one day?", options: ["Yes", "No"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper plates or card", "Crayons"],
        tips: [
          "Use feeling words in everyday life: 'I feel excited about going to the park.'",
          "Name your child's feelings for them: 'You look a bit worried. Is that right?'",
        ],
        younger: "Stick to three feelings: happy, sad and angry.",
        older: "Add more words, like proud, lonely and calm, and talk about when you might feel each one.",
      },
    },
    {
      slug: "all-about-me-3",
      title: "Feelings in my face and body",
      emoji: "🪞",
      minutes: 30,
      goal: "I can show how feelings look in my face and body.",
      starter: [
        { type: "choice", q: "Are all feelings OK?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "What does worried mean?", options: ["Thinking something might go wrong", "Really looking forward to something"], answer: 0 },
        { type: "pick", q: "Which are feelings? There is more than one.", options: ["Happy", "Scared", "Teapot", "Angry"], answers: [0, 1, 3] },
        { type: "match", q: "Match each thing to a feeling.", pairs: [["A party tomorrow", "Excited"], ["Your balloon pops", "Sad"], ["A friend shares a toy", "Happy"]] },
        { type: "choice", q: "Do grown-ups have feelings too?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "What does excited mean?", options: ["Really looking forward to something", "Feeling poorly"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Feelings in faces",
            picture: "/lessons/all-about-me/lesson-3-1.jpg",
            alt: "Three faces: smiling, crying and frowning",
            text: [
              "Our faces show how we feel.",
              "A happy face often has a big smile. A sad face might have a wobbly mouth or tears. An angry face might frown.",
            ],
          },
          {
            heading: "Feelings in bodies",
            picture: "/lessons/all-about-me/lesson-3-2.jpg",
            alt: "A boy jumping for joy and a girl stamping her foot",
            text: [
              "We feel feelings in our bodies too.",
              "When you are excited, you might want to jump. When you are worried, you might get a funny feeling in your tummy.",
              "When you are angry, you might feel hot and want to stamp your feet.",
            ],
          },
          {
            heading: "Look for clues",
            picture: "/lessons/all-about-me/lesson-3-3.jpg",
            alt: "A child with a magnifying glass looking kindly at a sad friend",
            text: [
              "Faces and bodies give us clues about how someone feels.",
              "If we look carefully, we can guess how a friend feels. Then we can ask them.",
            ],
          },
        ],
        words: [
          { word: "frown", meaning: "when your eyebrows go down and together" },
          { word: "clue", meaning: "something that helps you work things out" },
          { word: "angry", meaning: "very cross" },
        ],
      },
      practice: {
        intro: "Be a feelings detective!",
        questions: [
          { type: "match", q: "Match each clue to a feeling.", pairs: [["A big smile", "Happy"], ["Tears", "Sad"], ["Stamping feet", "Angry"]] },
          { type: "choice", q: "Joe is jumping up and down. It is nearly time for his party. How might he feel?", options: ["Bored", "Excited", "Sad"], answer: 1 },
          { type: "choice", q: "Where might you get a funny feeling when you are worried?", options: ["In your tummy", "In your hair"], answer: 0 },
          { type: "choice", q: "Can a face give a clue about how someone feels?", options: ["No", "Yes"], answer: 1 },
        ],
      },
      task: {
        title: "Mirror faces and statues",
        intro: "Use your face and body to show feelings.",
        need: ["A mirror", "Some music"],
        steps: [
          "Look in the mirror. Make a happy face. Now a sad face.",
          "Make an angry face, a scared face and an excited face.",
          "Your grown-up plays music. Dance around!",
          "When the music stops, your grown-up says a feeling. Freeze like a statue showing that feeling.",
          "Swap, and guess your grown-up's statue feeling.",
        ],
      },
      exit: [
        { type: "choice", q: "What might a happy face have?", options: ["A big smile", "A frown"], answer: 0 },
        { type: "choice", q: "Do we feel feelings in our bodies too?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "When you are excited, you might want to...", options: ["jump", "sleep"], answer: 0 },
        { type: "match", q: "Match each clue to a feeling.", pairs: [["Tears", "Sad"], ["A frown and stamping", "Angry"], ["A big smile", "Happy"]] },
        { type: "choice", q: "What is a clue?", options: ["A kind of fruit", "Something that helps you work things out"], answer: 1 },
        { type: "choice", q: "You think your friend looks sad. What could you do?", options: ["Ask them how they feel", "Laugh at them"], answer: 0 },
      ],
      grownUp: {
        need: ["A mirror", "Music to dance to"],
        tips: [
          "Pause a picture book and ask: 'How do you think they feel? What clues can you see?'",
          "Remind your child that clues are a good guess, and asking is the best way to know.",
        ],
        younger: "Just do the mirror faces with happy, sad and angry, and name each one together.",
        older: "Draw a body outline and colour where you feel worried, angry and excited.",
      },
    },
    {
      slug: "all-about-me-4",
      title: "Calming big feelings",
      emoji: "🌬️",
      minutes: 30,
      goal: "I can use a way to calm down when I have a big feeling.",
      starter: [
        { type: "choice", q: "What might a sad face have?", options: ["A big smile", "Tears"], answer: 1 },
        { type: "choice", q: "Do we feel feelings in our bodies?", options: ["Yes", "No"], answer: 0 },
        { type: "match", q: "Match each clue to a feeling.", pairs: [["Jumping up and down", "Excited"], ["A funny tummy", "Worried"], ["A frown", "Angry"]] },
        { type: "choice", q: "What is a clue?", options: ["A kind of hat", "Something that helps you work things out"], answer: 1 },
        { type: "choice", q: "When you are angry, you might feel...", options: ["hot", "cold"], answer: 0 },
        { type: "choice", q: "What is the best way to know how a friend feels?", options: ["Ignore them", "Ask them"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Big feelings",
            picture: "/lessons/all-about-me/lesson-4-1.jpg",
            alt: "A child with a storm cloud shrinking into a small white cloud",
            text: [
              "Sometimes a feeling gets really big. You might want to shout, cry or hide.",
              "That happens to everyone. There are things we can do to help a big feeling get smaller.",
            ],
          },
          {
            heading: "Slow breathing and counting",
            picture: "/lessons/all-about-me/lesson-4-2.jpg",
            alt: "A girl smelling a flower and blowing out a pretend candle",
            text: [
              "Try 'smell the flower, blow out the candle'. Breathe in slowly through your nose. Blow out slowly through your mouth.",
              "You can also count slowly to ten. Slow breathing and counting help your body feel calm.",
            ],
          },
          {
            heading: "A calm corner",
            picture: "/lessons/all-about-me/lesson-4-3.jpg",
            alt: "A child resting in a cosy calm corner with cushions and a teddy",
            text: [
              "A calm corner is a cosy, quiet place to go when feelings get big.",
              "It might have a cushion, a soft toy and a book. You can rest there until you feel better.",
            ],
          },
        ],
        words: [
          { word: "calm", meaning: "quiet and peaceful inside" },
          { word: "breathe", meaning: "take air in and let it out" },
          { word: "calm corner", meaning: "a cosy, quiet place to feel better" },
        ],
      },
      practice: {
        intro: "What helps?",
        questions: [
          { type: "pick", q: "Which could help a big feeling get smaller? There is more than one.", options: ["Slow breathing", "Throwing toys", "Counting to ten", "Hugging a soft toy"], answers: [0, 2, 3] },
          { type: "order", q: "Put 'smell the flower, blow out the candle' in order.", items: ["Breathe in slowly through your nose", "Blow out slowly through your mouth", "Do it again"] },
          { type: "choice", q: "What might be in a calm corner?", options: ["A soft cushion", "A loud drum"], answer: 0 },
          { type: "type", q: "Count slowly to calm down. What number do you count to?", answer: ["10", "ten"] },
        ],
      },
      task: {
        title: "Make a calm corner",
        intro: "Make a cosy calm corner at home.",
        need: ["A quiet corner", "Cushions or a blanket", "A soft toy", "A favourite book"],
        steps: [
          "With your grown-up, choose a quiet corner.",
          "Make it cosy with cushions or a blanket.",
          "Add a soft toy and a book.",
          "Sit in your calm corner. Smell the flower, blow out the candle, five times.",
          "Count slowly to ten. How do you feel now?",
        ],
      },
      exit: [
        { type: "choice", q: "Does everyone have big feelings sometimes?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "Smell the flower: you breathe in through your...", options: ["nose", "mouth"], answer: 0 },
        { type: "choice", q: "Blow out the candle: you breathe out through your...", options: ["ears", "mouth"], answer: 1 },
        { type: "pick", q: "Which are good ways to calm down? There is more than one.", options: ["Counting slowly", "Slow breathing", "Shouting louder"], answers: [0, 1] },
        { type: "choice", q: "What is a calm corner?", options: ["A cosy, quiet place to feel better", "A place to play loud games"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Slow breathing helps your body feel ___.", bank: ["calm", "cross"], answers: ["calm"] },
      ],
      grownUp: {
        need: ["Cushions, a blanket, a soft toy and a book"],
        tips: [
          "Practise breathing when your child is already calm, so it is easy to remember when a feeling is big.",
          "The calm corner should feel like a kind place, never a punishment.",
        ],
        younger: "Use a real flower or wiggle a finger as a pretend candle to blow out.",
        older: "Make a small card with pictures of three calming ideas to keep in the calm corner.",
      },
    },
    {
      slug: "all-about-me-5",
      title: "Talking about feelings",
      emoji: "💬",
      minutes: 30,
      goal: "I can tell someone I trust how I feel.",
      starter: [
        { type: "choice", q: "What could help a big feeling get smaller?", options: ["Shouting", "Slow breathing"], answer: 1 },
        { type: "choice", q: "What is a calm corner?", options: ["A cosy, quiet place", "A busy road"], answer: 0 },
        { type: "order", q: "Put 'smell the flower, blow out the candle' in order.", items: ["Breathe in through your nose", "Blow out through your mouth", "Do it again"] },
        { type: "type", q: "What number can you count slowly to when you need to calm down?", answer: ["10", "ten"] },
        { type: "pick", q: "Which could go in a calm corner? There is more than one.", options: ["A cushion", "A soft toy", "A loud whistle"], answers: [0, 1] },
        { type: "choice", q: "Does everyone have big feelings sometimes?", options: ["No", "Yes"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Talking helps",
            picture: "/lessons/all-about-me/lesson-5-1.jpg",
            alt: "A child talking to a grown-up who is listening",
            text: [
              "When you have a big feeling, talking about it can help.",
              "Telling someone how you feel can make a worry feel smaller.",
            ],
          },
          {
            heading: "People I trust",
            picture: "/lessons/all-about-me/lesson-5-2.jpg",
            alt: "A child surrounded by trusted grown-ups",
            text: [
              "Someone you trust is a person who is kind, listens and helps you.",
              "It might be a mum, dad, carer, grandparent or another grown-up you know well.",
            ],
          },
          {
            heading: "How to start",
            picture: "/lessons/all-about-me/lesson-5-3.jpg",
            alt: "A boy asking his grandparent to listen",
            text: [
              "You can say, 'I feel sad because...' or 'Can I tell you something?'",
              "If the first person is busy, try again later or ask another grown-up you trust. Keep telling until someone helps.",
            ],
          },
        ],
        words: [
          { word: "trust", meaning: "know someone will be kind and help you" },
          { word: "listen", meaning: "pay attention to what someone says" },
          { word: "share", meaning: "tell someone, or let them have some too" },
        ],
      },
      practice: {
        intro: "Who can help?",
        questions: [
          { type: "pick", q: "Who could be a grown-up you trust? There is more than one.", options: ["Mum or dad", "A grandparent", "Someone you have never met"], answers: [0, 1] },
          { type: "choice", q: "Can talking make a worry feel smaller?", options: ["Yes", "No"], answer: 0 },
          { type: "gap", q: "Fill the gap.", text: "I feel ___ because my friend moved away.", bank: ["sad", "spoon"], answers: ["sad"] },
          { type: "choice", q: "Your grown-up is busy on the phone. What could you do?", options: ["Never tell anyone", "Try again later or tell another grown-up you trust"], answer: 1 },
        ],
      },
      task: {
        title: "My helping hand",
        intro: "Make a hand full of people you can talk to.",
        need: ["A sheet of paper", "A pencil", "Crayons"],
        steps: [
          "Put your hand flat on the paper.",
          "Your grown-up helps you draw around it.",
          "On each finger, draw or write a person you trust.",
          "Colour your helping hand.",
          "Practise saying, 'I feel ... because ...' to your grown-up.",
        ],
      },
      exit: [
        { type: "choice", q: "Can talking about feelings help?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "Someone you trust is...", options: ["someone you don't know", "kind, listens and helps you"], answer: 1 },
        { type: "choice", q: "What could you say to start?", options: ["'Can I tell you something?'", "Nothing at all"], answer: 0 },
        { type: "choice", q: "If the first person is busy, what should you do?", options: ["Give up", "Try again or tell another grown-up you trust"], answer: 1 },
        { type: "choice", q: "What does listen mean?", options: ["Pay attention to what someone says", "Run away"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Telling someone can make a worry feel ___.", bank: ["smaller", "bigger"], answers: ["smaller"] },
      ],
      grownUp: {
        need: ["Paper, a pencil and crayons"],
        tips: [
          "Bedtime and car journeys are good times for chats. Children often open up when they don't have to look at you.",
          "Thank your child for telling you things, even small things. It shows them it is safe to talk.",
          "If something your child says worries you, stay calm and follow it up, getting help if you need it.",
        ],
        younger: "Just name two people your child can talk to, and practise 'I feel sad' and 'I feel happy'.",
        older: "Role-play telling a grown-up about a worry, then swap so your child is the listener.",
      },
    },
    {
      slug: "all-about-me-6",
      title: "Being kind",
      emoji: "💛",
      minutes: 30,
      goal: "I can notice how others feel and be kind.",
      starter: [
        { type: "choice", q: "Can talking about feelings help?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "Someone you trust is...", options: ["kind, listens and helps you", "someone you have never met"], answer: 0 },
        { type: "pick", q: "Who could be a grown-up you trust? There is more than one.", options: ["A carer", "A grandparent", "A stranger"], answers: [0, 1] },
        { type: "choice", q: "What does listen mean?", options: ["Close your eyes", "Pay attention to what someone says"], answer: 1 },
        { type: "choice", q: "If the first grown-up is busy, what can you do?", options: ["Try again or tell another grown-up", "Keep it secret forever"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "I feel ___ because I lost my teddy.", bank: ["sad", "sock"], answers: ["sad"] },
      ],
      learn: {
        cards: [
          {
            heading: "Noticing feelings",
            picture: "/lessons/all-about-me/lesson-6-1.jpg",
            alt: "A child noticing another child sitting alone on a bench",
            text: [
              "Other people have feelings too, just like you.",
              "Look at faces and bodies for clues. Is someone sitting alone? Do they look sad?",
            ],
          },
          {
            heading: "Ways to be kind",
            picture: "/lessons/all-about-me/lesson-6-2.jpg",
            alt: "Two children sharing crayons and colouring together",
            text: [
              "Being kind means doing nice things for others.",
              "You can share, take turns, help, say something nice, or ask, 'Are you OK?'",
              "You can ask someone who is on their own to play.",
            ],
          },
          {
            heading: "Kindness feels good",
            picture: "/lessons/all-about-me/lesson-6-3.jpg",
            alt: "Two happy children holding hands and skipping in a park",
            text: [
              "Being kind makes other people feel happy. It can make you feel happy too!",
              "You can be kind to yourself as well. Say, 'I can do it!' when things are tricky.",
            ],
          },
        ],
        words: [
          { word: "kind", meaning: "caring and helpful to others" },
          { word: "notice", meaning: "see something" },
          { word: "take turns", meaning: "first one person has a go, then the other" },
        ],
      },
      practice: {
        intro: "Kind or not kind?",
        questions: [
          { type: "pick", q: "Which of these are kind? There is more than one.", options: ["Sharing your crayons", "Pushing in", "Asking, 'Are you OK?'", "Helping tidy up"], answers: [0, 2, 3] },
          { type: "choice", q: "Ben is sitting on his own and looks sad. What could you do?", options: ["Walk away", "Ask him to play"], answer: 1 },
          { type: "match", q: "Match each problem to a kind thing to do.", pairs: [["A friend falls over", "Help them up"], ["A friend has no snack", "Share yours"], ["A friend feels sad", "Give a hug if they want one"]] },
          { type: "choice", q: "How can being kind make you feel?", options: ["Happy", "Cross"], answer: 0 },
        ],
      },
      task: {
        title: "Kindness jar",
        intro: "Fill a jar with kind things to do.",
        need: ["A clean jar or box", "Small pieces of paper", "Crayons"],
        steps: [
          "With your grown-up, think of kind things to do, like helping set the table.",
          "Draw each one on a small piece of paper.",
          "Fold the papers and put them in the jar.",
          "Each day, pick one and do it!",
          "Tell your grown-up how it felt to be kind.",
        ],
      },
      exit: [
        { type: "choice", q: "Do other people have feelings too?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "What does kind mean?", options: ["Caring and helpful to others", "Cross and grumpy"], answer: 0 },
        { type: "pick", q: "Which are kind things to do? There is more than one.", options: ["Taking turns", "Snatching a toy", "Saying something nice"], answers: [0, 2] },
        { type: "choice", q: "Someone is sitting alone and looks sad. What could you ask?", options: ["'Why are you here?'", "'Are you OK?'"], answer: 1 },
        { type: "choice", q: "Can you be kind to yourself?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What does notice mean?", options: ["Forget something", "See something"], answer: 1 },
      ],
      grownUp: {
        need: ["A jar or box", "Small pieces of paper", "Crayons"],
        tips: [
          "Point out kindness when you see it: 'That was kind of you to share.'",
          "Talk about how kindness made someone feel, not just what was done.",
        ],
        younger: "Do one kind thing together each day and talk about it at bedtime.",
        older: "Keep a kindness diary for a week, drawing one kind thing you did and one kind thing someone did for you.",
      },
    },
  ],
};
