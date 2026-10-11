import type { LessonUnit } from "@/lib/lessons";

/** Feelings and friendships, for ages 7 to 11. Gentle, talk-based lessons a family does together. */
export const feelingsAndFriendships: LessonUnit = {
  slug: "feelings-and-friendships",
  title: "Feelings and friendships",
  short: "Feelings",
  subject: "RSHE (PSHE)",
  ages: "7 to 11",
  emoji: "💛",
  color: "#C7892B",
  summary: "Six lessons: naming feelings, calming big ones, being a good friend, falling out and making up, families, and staying safe online.",
  cover: "/lessons/units/feelings-and-friendships.jpg",
  lessons: [
    {
      slug: "feelings-and-friendships-1",
      title: "All kinds of feelings",
      emoji: "😊",
      minutes: 35,
      goal: "I can name lots of different feelings and notice how they feel in my body.",
      starter: [
        { type: "choice", q: "How might you feel on your birthday?", options: ["Excited", "Bored", "Sleepy"], answer: 0 },
        { type: "choice", q: "Is it OK to feel sad sometimes?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "Who can you talk to about your feelings?", options: ["A grown-up you trust", "Nobody"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Every feeling is OK",
            picture: "/lessons/feelings-and-friendships/lesson-1.jpg",
            alt: "Six children holding coloured cards showing happy, sad, cross, worried, excited and calm faces",
            text: [
              "Everyone has feelings: happy, sad, angry, scared, excited, worried, proud, jealous and lots more.",
              "There are no bad feelings. All feelings are OK. What matters is what we do with them.",
            ],
          },
          {
            heading: "Feelings in your body",
            text: [
              "Feelings don't just happen in your head. You can feel them in your body too.",
              "When you're nervous, you might get butterflies in your tummy. When you're angry, your face might go hot and your fists might clench. When you're happy, you might feel light and bouncy.",
            ],
          },
          {
            heading: "Big and small",
            text: [
              "Feelings come in different sizes. You might be a little bit annoyed, or really, really furious.",
              "Finding the right word helps other people understand you, and helps you understand yourself.",
            ],
          },
        ],
        words: [
          { word: "emotion", meaning: "another word for a feeling" },
          { word: "frustrated", meaning: "cross because something isn't working or going your way" },
          { word: "anxious", meaning: "worried or nervous about what might happen" },
          { word: "proud", meaning: "pleased about something you or someone else has done" },
        ],
      },
      practice: {
        intro: "How might they feel?",
        questions: [
          {
            type: "match",
            q: "Match each situation to a feeling someone might have.",
            pairs: [["Losing a favourite toy", "Sad"], ["Finishing a hard puzzle", "Proud"], ["A loud thunderstorm at night", "Scared"], ["Your tower is knocked over", "Frustrated"]],
          },
          { type: "choice", q: "Are some feelings bad?", options: ["No, all feelings are OK", "Yes, we should never feel angry"], answer: 0 },
        ],
      },
      task: {
        title: "A feelings body map",
        intro: "Show where you feel your feelings.",
        need: ["A big sheet of paper", "Felt pens or crayons", "A grown-up to chat with"],
        steps: [
          "Draw around your body on a big sheet of paper, or draw a gingerbread person outline.",
          "Choose a colour for each of four feelings: happy, angry, worried and excited.",
          "Colour where in your body you feel each one. Butterflies in your tummy? A hot face?",
          "Talk with your grown-up: where do they feel those feelings? Is it the same as you?",
        ],
      },
      exit: [
        { type: "choice", q: "Are all feelings OK?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What does anxious mean?", options: ["Worried or nervous", "Very happy", "Very hungry"], answer: 0 },
        { type: "choice", q: "Where can you feel feelings?", options: ["Only in your head", "In your body too"], answer: 1 },
        { type: "choice", q: "Butterflies in your tummy often mean you feel...", options: ["nervous", "sleepy"], answer: 0 },
        { type: "choice", q: "Why does finding the right feeling word help?", options: ["It helps others and you understand how you feel", "It doesn't help"], answer: 0 },
      ],
      grownUp: {
        need: ["A big sheet of paper and pens"],
        tips: [
          "Share your own feelings too: 'I felt frustrated this morning when...'. Children learn the words by hearing them used.",
          "If something your child says worries you, stay calm, thank them for telling you, and follow up gently later.",
        ],
        younger: "Pull happy, sad, angry and scared faces in a mirror, and name each one.",
        older: "Make a 'feelings thermometer' from 'a little bit' to 'very, very', and place words like annoyed, cross and furious on it.",
      },
    },
    {
      slug: "feelings-and-friendships-2",
      title: "Calming big feelings",
      emoji: "🌬️",
      minutes: 35,
      goal: "I can use some ways to calm down when a feeling gets very big.",
      starter: [
        { type: "choice", q: "Are all feelings OK?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What does frustrated mean?", options: ["Cross because something isn't working", "Very calm"], answer: 0 },
        { type: "choice", q: "Can you feel feelings in your body?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "When feelings get big",
            picture: "/lessons/feelings-and-friendships/lesson-2.jpg",
            alt: "A girl doing belly breathing on a cushion with her eyes closed, beside a grown-up and a calm box",
            text: [
              "Sometimes a feeling gets so big it's hard to think. You might want to shout, cry, or run away.",
              "That happens to everyone, grown-ups too. The good news is there are things that help a big feeling get smaller.",
            ],
          },
          {
            heading: "Breathing",
            text: [
              "Slow breathing tells your body it's safe.",
              "Try 'smell the flower, blow out the candle': breathe in slowly through your nose, then blow out slowly through your mouth. Do it five times.",
            ],
          },
          {
            heading: "Your calm toolkit",
            text: [
              "Other things that help: counting slowly to ten, squeezing a cushion, having a drink of water, going somewhere quiet, moving your body, or talking to someone you trust.",
              "Different things work for different people. It's good to know what works for you.",
            ],
          },
        ],
        words: [
          { word: "calm", meaning: "peaceful and relaxed" },
          { word: "strategy", meaning: "a plan or way of doing something" },
          { word: "trusted adult", meaning: "a grown-up you know will listen and help" },
        ],
      },
      practice: {
        intro: "What could help?",
        questions: [
          {
            type: "pick",
            q: "Which of these could help a big feeling get smaller? There is more than one.",
            options: ["Slow breathing", "Counting to ten", "Hitting someone", "Talking to a trusted adult"],
            answers: [0, 1, 3],
          },
          { type: "order", q: "Put 'smell the flower, blow out the candle' in order.", items: ["Breathe in slowly through your nose", "Breathe out slowly through your mouth", "Do it again, five times"] },
        ],
      },
      task: {
        title: "Make a calm-down kit",
        intro: "Put together a box or a card of things that help you calm down.",
        need: ["A shoebox or a piece of card", "Pens", "Things that help you feel calm, like a soft toy, a stress ball or a favourite photo"],
        steps: [
          "Try three calming ideas now: five slow breaths, counting to ten, and squeezing a cushion. Which felt best?",
          "Draw or write your favourite calming ideas on a card.",
          "Put the card in a box with a few calming things, or pin it up somewhere you'll see it.",
          "Agree with your grown-up on a signal you can use when a feeling is getting too big.",
        ],
      },
      exit: [
        { type: "choice", q: "Do grown-ups get big feelings too?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What does slow breathing tell your body?", options: ["That it's safe", "To run faster"], answer: 0 },
        { type: "choice", q: "What is a trusted adult?", options: ["A grown-up who will listen and help", "Anyone you meet"], answer: 0 },
        {
          type: "pick",
          q: "Which are good calm-down strategies? There is more than one.",
          options: ["A drink of water", "Going somewhere quiet", "Breaking something", "Squeezing a cushion"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "Does the same strategy work for everyone?", options: ["Yes, always", "No, different things work for different people"], answer: 1 },
      ],
      grownUp: {
        need: ["A shoebox or card", "A few calming objects"],
        tips: [
          "Practise calming strategies when your child is already calm. They're much easier to use in the moment if they're familiar.",
          "Using the strategies yourself, out loud ('I'm going to take some deep breaths'), is the best teaching there is.",
        ],
        younger: "Practise 'smell the flower, blow out the candle' together with a real flower or a pretend candle on your finger.",
        older: "Keep a feelings diary for a week. When did a feeling get big, and what helped?",
      },
    },
    {
      slug: "feelings-and-friendships-3",
      title: "Being a good friend",
      emoji: "🤝",
      minutes: 35,
      goal: "I can describe what makes a good friend and how to be one.",
      starter: [
        { type: "choice", q: "Which can help calm a big feeling?", options: ["Slow breathing", "Shouting louder"], answer: 0 },
        { type: "choice", q: "What is a trusted adult?", options: ["A grown-up who will listen and help", "A stranger"], answer: 0 },
        { type: "choice", q: "Are all feelings OK?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "What makes a good friend?",
            picture: "/lessons/feelings-and-friendships/lesson-3.jpg",
            alt: "A boy helping a girl up after she fell off her scooter in the park",
            text: [
              "Good friends are kind. They listen, they share, they take turns, and they make you feel good about yourself.",
              "They're honest with you, and they stick up for you.",
            ],
          },
          {
            heading: "How to make friends",
            text: [
              "You can make friends at clubs, groups, the park, or home-ed meet-ups.",
              "Try smiling, saying hello, asking someone their name, and asking about something they like. 'What's your favourite game?' is a great start.",
            ],
          },
          {
            heading: "Friends can be different",
            text: [
              "Friends don't have to like all the same things or be the same age. Some friends live far away and you talk to them on the phone.",
              "Being different makes friendships more interesting!",
            ],
          },
        ],
        words: [
          { word: "kind", meaning: "caring about others and treating them well" },
          { word: "loyal", meaning: "sticking by someone" },
          { word: "respect", meaning: "treating someone and their feelings as important" },
        ],
      },
      practice: {
        intro: "Good friend or not?",
        questions: [
          {
            type: "pick",
            q: "Which of these are things a good friend does? There is more than one.",
            options: ["Takes turns", "Listens to you", "Leaves you out on purpose", "Is kind"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "Do friends have to like all the same things?", options: ["Yes", "No"], answer: 1 },
        ],
      },
      task: {
        title: "The recipe for a good friend",
        intro: "Write a recipe for a perfect friendship.",
        need: ["Paper and pens"],
        steps: [
          "Write 'Recipe for a good friend' at the top.",
          "List the ingredients, with amounts: '3 spoonfuls of kindness, a cup of listening, a big pinch of sharing...'",
          "Write the method: 'Mix kindness and listening together, add a smile...'",
          "Think of one kind thing you could do for a friend this week, and plan when you'll do it.",
        ],
      },
      exit: [
        { type: "choice", q: "What does loyal mean?", options: ["Sticking by someone", "Telling secrets"], answer: 0 },
        { type: "choice", q: "What's a good way to start making a friend?", options: ["Say hello and ask about something they like", "Ignore them"], answer: 0 },
        { type: "choice", q: "A good friend makes you feel...", options: ["good about yourself", "left out"], answer: 0 },
        { type: "choice", q: "Can friends be different ages?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What does respect mean?", options: ["Treating someone's feelings as important", "Doing whatever they say"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and pens"],
        tips: [
          "Home-educated children often have friends of different ages. It's worth celebrating that as a real strength.",
          "Ask your child about a time a friend was kind to them, and a time they were kind to a friend.",
        ],
        younger: "Draw a picture of a friend and talk about what you like doing together.",
        older: "Think about a book or film character who is a good friend. What do they do that makes them a good friend?",
      },
    },
    {
      slug: "feelings-and-friendships-4",
      title: "Falling out and making up",
      emoji: "🌈",
      minutes: 35,
      goal: "I can sort out a disagreement fairly, and know the difference between falling out and bullying.",
      starter: [
        { type: "choice", q: "What does a good friend do?", options: ["Takes turns and listens", "Leaves you out"], answer: 0 },
        { type: "choice", q: "What does loyal mean?", options: ["Sticking by someone", "Being bossy"], answer: 0 },
        { type: "choice", q: "Can friends be different from each other?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Everyone falls out sometimes",
            picture: "/lessons/feelings-and-friendships/lesson-4.jpg",
            alt: "Two friends making up on the grass, one holding out a hand, with a football between them",
            text: [
              "Even the best of friends disagree. You might both want the same toy, or want to play different games.",
              "Falling out doesn't mean you're not friends any more. It's part of being friends.",
            ],
          },
          {
            heading: "Making up",
            text: [
              "First, calm down. Then each person says how they feel, starting with 'I feel...'. Take turns to listen properly.",
              "Think of a fair answer together, like taking turns or finding a game you both like.",
              "Saying sorry, and meaning it, helps a lot.",
            ],
          },
          {
            heading: "When it's bullying",
            text: [
              "Bullying is different from falling out. It's when someone hurts or upsets another person on purpose, again and again.",
              "Bullying is never OK, and it's never the fault of the person being bullied.",
              "If it happens to you or someone you know, tell a trusted adult. Keep telling until someone helps.",
            ],
          },
        ],
        words: [
          { word: "disagreement", meaning: "when people don't think the same thing" },
          { word: "compromise", meaning: "when each person gives a bit so it's fair for both" },
          { word: "bullying", meaning: "hurting or upsetting someone on purpose, again and again" },
        ],
      },
      practice: {
        intro: "Falling out or bullying?",
        questions: [
          {
            type: "match",
            q: "Match each one to what it is.",
            pairs: [["Two friends both want the swing", "Falling out"], ["Someone is called names every day on purpose", "Bullying"], ["Taking turns on the swing", "Compromise"]],
          },
          { type: "order", q: "Put the steps for making up in order.", items: ["Calm down", "Each say how you feel", "Listen to each other", "Find a fair answer together"] },
        ],
      },
      task: {
        title: "Puppet problem-solving",
        intro: "Act out a falling-out, then fix it.",
        need: ["Two soft toys or puppets (or socks with faces drawn on)", "A grown-up or brother or sister to play with"],
        steps: [
          "Give each puppet a name. Choose a problem: they both want the last biscuit, or they want to play different games.",
          "Act out the falling-out.",
          "Now act out making up: calm down, say 'I feel...', listen, and find a fair answer.",
          "Swap puppets and try a different problem. What compromises did you find?",
        ],
      },
      exit: [
        { type: "choice", q: "Does falling out mean you're not friends any more?", options: ["Yes", "No"], answer: 1 },
        { type: "choice", q: "What is a compromise?", options: ["Each person gives a bit so it's fair", "One person always wins"], answer: 0 },
        { type: "choice", q: "Bullying is when someone...", options: ["hurts or upsets someone on purpose, again and again", "disagrees with you once"], answer: 0 },
        { type: "choice", q: "If someone is being bullied, what should you do?", options: ["Keep it secret", "Tell a trusted adult"], answer: 1 },
        { type: "choice", q: "Is bullying ever the fault of the person being bullied?", options: ["Yes", "No, never"], answer: 1 },
      ],
      grownUp: {
        need: ["Two soft toys or puppets"],
        tips: [
          "Puppets make it easier for children to talk about tricky situations without it feeling personal.",
          "If your child mentions bullying, online or in person, listen calmly and take it seriously, even if it seems small.",
        ],
        younger: "Act out one simple problem with puppets, with you helping them find a fair answer.",
        older: "Write a short comic strip of two characters falling out and making up, using 'I feel...' speech bubbles.",
      },
    },
    {
      slug: "feelings-and-friendships-5",
      title: "All kinds of families",
      emoji: "🏡",
      minutes: 35,
      goal: "I can describe how families are different and what makes a family.",
      starter: [
        { type: "choice", q: "What is a compromise?", options: ["Each person gives a bit", "One person wins"], answer: 0 },
        { type: "choice", q: "If someone is bullied, they should...", options: ["tell a trusted adult", "keep it secret"], answer: 0 },
        { type: "choice", q: "Is it OK to fall out sometimes?", options: ["Yes, it happens to everyone", "No, never"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Every family is different",
            picture: "/lessons/feelings-and-friendships/lesson-5.jpg",
            alt: "Lots of different families: parents and children, a grandmother and grandchild, a dad, two mums, and a big family meal",
            text: [
              "Some children live with a mum and a dad. Some live with one parent, two mums, two dads, grandparents, foster carers, or step-parents.",
              "Some have lots of brothers and sisters, and some have none. Some families live in more than one home.",
            ],
          },
          {
            heading: "What makes a family?",
            text: [
              "What makes a family isn't who is in it. It's how they care for each other.",
              "Families love each other, look after each other, and help each other, even when they get cross with each other sometimes.",
            ],
          },
          {
            heading: "Respecting other families",
            text: [
              "Other people's families might look different from yours. They might have different traditions, eat different food or celebrate different festivals.",
              "All families deserve respect.",
            ],
          },
        ],
        words: [
          { word: "family", meaning: "the people who love and look after each other" },
          { word: "tradition", meaning: "something a family or group does again and again, often at special times" },
          { word: "relative", meaning: "someone in your family, like a cousin, aunt or grandparent" },
        ],
      },
      practice: {
        intro: "Families.",
        questions: [
          { type: "choice", q: "What makes a family?", options: ["How they care for each other", "Having exactly four people"], answer: 0 },
          {
            type: "pick",
            q: "Which of these could be a family? There is more than one.",
            options: ["A mum, a dad and a child", "A grandad and two grandchildren", "Two dads and a baby", "A foster carer and a child"],
            answers: [0, 1, 2, 3],
          },
        ],
      },
      task: {
        title: "Our family traditions",
        intro: "Find out what makes your family special.",
        need: ["Paper and pens", "Family photos (optional)"],
        steps: [
          "Ask your grown-up about one family tradition: something you always do on birthdays, holidays or Sundays.",
          "If you can, phone or ask a grandparent or relative about a tradition from when they were young.",
          "Make a poster called 'Our family' with pictures of everyone (pets count!) and your favourite tradition.",
          "Write one thing your family does to look after each other.",
        ],
      },
      exit: [
        { type: "choice", q: "Are all families the same?", options: ["Yes", "No, every family is different"], answer: 1 },
        { type: "choice", q: "What is a tradition?", options: ["Something a family does again and again at special times", "A kind of food"], answer: 0 },
        { type: "choice", q: "Do all families deserve respect?", options: ["Yes", "Only ones like mine"], answer: 0 },
        { type: "choice", q: "Can a family live in more than one home?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "What is a relative?", options: ["Someone in your family", "A neighbour"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and pens", "Family photos (optional)"],
        tips: [
          "This lesson works best when it's about your own family. Share stories from your childhood.",
          "If your family has been through a change, like a separation or a loss, keep it simple and reassuring, and follow your child's lead.",
        ],
        younger: "Draw your family and talk about what each person does to help.",
        older: "Make a family tree going back to grandparents, or further if you can find out.",
      },
    },
    {
      slug: "feelings-and-friendships-6",
      title: "Staying safe online",
      emoji: "💻",
      minutes: 35,
      goal: "I can explain how to stay safe online and what to do if something worries me.",
      starter: [
        { type: "choice", q: "What makes a family?", options: ["How they care for each other", "Where they live"], answer: 0 },
        { type: "choice", q: "Who should you tell if something is wrong?", options: ["A trusted adult", "Nobody"], answer: 0 },
        { type: "choice", q: "Bullying is...", options: ["never OK", "fine sometimes"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "The internet is brilliant",
            picture: "/lessons/feelings-and-friendships/lesson-6.jpg",
            alt: "A girl using a tablet on the sofa next to her dad, with a friendly shield and padlock above it",
            text: [
              "You can learn, play, watch and talk to family far away online.",
              "But just like crossing the road, there are some rules that keep us safe.",
            ],
          },
          {
            heading: "Keep it private",
            text: [
              "Never share private information online: your full name, address, school or club, phone number, passwords, or photos of yourself, unless your grown-up says it's OK.",
              "People online aren't always who they say they are. Someone who says they're 10 might really be a grown-up.",
            ],
          },
          {
            heading: "If something worries you",
            text: [
              "If you see something that upsets you, or someone asks you to keep a secret or meet up, stop and tell a trusted adult straight away.",
              "You will not be in trouble for telling. Telling is always the right thing to do.",
              "Be kind online too. Only write things you would be happy to say to someone's face.",
            ],
          },
        ],
        words: [
          { word: "private information", meaning: "things about you that should be kept safe, like your address" },
          { word: "password", meaning: "a secret word that keeps your account safe" },
          { word: "online", meaning: "using the internet" },
        ],
      },
      practice: {
        intro: "Safe or not safe?",
        questions: [
          {
            type: "pick",
            q: "Which of these are private information? There is more than one.",
            options: ["Your home address", "Your favourite colour", "Your password", "Your phone number"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "Someone online asks you to keep a secret. What should you do?", options: ["Keep the secret", "Tell a trusted adult"], answer: 1 },
        ],
      },
      task: {
        title: "Our family online rules",
        intro: "Agree some online safety rules together.",
        need: ["Paper and pens"],
        steps: [
          "With your grown-up, talk about which devices and apps you use and what you like about them.",
          "Write down five family online rules together, like 'Never share our address' and 'Tell a grown-up if anything worries me'.",
          "Decorate your rules as a poster and both sign it.",
          "Put it up near where you use screens.",
        ],
      },
      exit: [
        { type: "choice", q: "Should you share your address online?", options: ["Yes", "No"], answer: 1 },
        { type: "choice", q: "Is everyone online who they say they are?", options: ["Yes, always", "No, not always"], answer: 1 },
        { type: "choice", q: "If something online upsets you, you should...", options: ["tell a trusted adult", "hide it"], answer: 0 },
        { type: "choice", q: "Will you be in trouble for telling?", options: ["Yes", "No, telling is always right"], answer: 1 },
        { type: "choice", q: "Being kind online means...", options: ["only writing what you'd say to someone's face", "saying anything you like"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and pens"],
        tips: [
          "Reassure your child often that they won't lose their device or be in trouble for telling you about something online. Fear of that is the main reason children don't tell.",
          "Parental controls on your home internet and devices are worth setting up alongside this lesson.",
        ],
        younger: "Agree two simple rules: 'Ask a grown-up before going online' and 'Tell a grown-up if anything worries me'.",
        older: "Talk about what makes a strong password, and why you should never use the same one everywhere.",
      },
    },
  ],
};
