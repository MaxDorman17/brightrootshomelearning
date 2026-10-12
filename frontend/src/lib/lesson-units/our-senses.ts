import type { LessonUnit } from "@/lib/lessons";

/** Our senses, for ages 5 to 7. The parts of the body and the five senses, with lots of looking, listening, touching, smelling and tasting. */
export const ourSenses: LessonUnit = {
  slug: "our-senses",
  title: "Our senses",
  short: "Senses",
  subject: "Science",
  ages: "5 to 7",
  emoji: "👀",
  color: "#7FA88B",
  summary: "Six lessons: naming the parts of your body, then seeing, hearing, touching, smelling and tasting, and a senses walk using all five.",
  cover: "/lessons/units/our-senses.jpg",
  lessons: [
    {
      slug: "our-senses-1",
      title: "My body and my eyes",
      emoji: "👀",
      minutes: 30,
      goal: "I can name parts of my body and say that I see with my eyes.",
      starter: [
        { type: "choice", q: "What do you use to see?", options: ["Your eyes", "Your toes"], answer: 0 },
        { type: "choice", q: "What is on top of your neck?", options: ["Your knee", "Your head", "Your foot"], answer: 1 },
        { type: "choice", q: "How many hands do you have?", options: ["One", "Three", "Two"], answer: 2 },
        {
          type: "pick",
          q: "Which of these are parts of your body? There is more than one.",
          options: ["Arm", "Spoon", "Leg", "Nose"],
          answers: [0, 2, 3],
        },
        { type: "match", q: "Match each thing to the body part we use.", pairs: [["Kicking a ball", "Foot"], ["Clapping", "Hands"], ["Nodding", "Head"]] },
        { type: "choice", q: "Can you see in a very dark room with no light at all?", options: ["Yes, easily", "No, not really"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Your amazing body",
            text: [
              "Your body has lots of parts. Your head sits on your neck. Your arms hang from your shoulders.",
              "Your arms bend at your elbows. Your legs bend at your knees. You have fingers on your hands and toes on your feet.",
              "Let's play! Touch your head, then your shoulders, then your knees, then your toes.",
            ],
          },
          {
            heading: "Five senses",
            text: [
              "Your body has five special ways to find out about the world. We call them the five senses.",
              "They are seeing, hearing, touching, smelling and tasting. Each one uses a different part of your body.",
            ],
          },
          {
            heading: "Seeing with your eyes",
            text: [
              "You see with your eyes. They show you colours, shapes and things moving.",
              "Your eyes need light to see. In the dark, it is hard to see anything at all.",
              "Keep your eyes safe. Never look straight at the Sun. It is too bright and can hurt your eyes.",
            ],
          },
        ],
        words: [
          { word: "body parts", meaning: "the pieces that make up your body, like arms and legs" },
          { word: "senses", meaning: "the ways your body finds out about the world" },
          { word: "sight", meaning: "seeing with your eyes" },
        ],
      },
      practice: {
        intro: "Let's name some body parts and think about seeing.",
        questions: [
          { type: "match", q: "Match each body part to where it bends or is found.", pairs: [["Elbow", "In your arm"], ["Knee", "In your leg"], ["Toes", "On your feet"]] },
          { type: "choice", q: "Which sense uses your eyes?", options: ["Hearing", "Seeing", "Tasting"], answer: 1 },
          { type: "order", q: "Put these from the top of your body to the bottom.", items: ["Head", "Shoulders", "Knees", "Toes"] },
          {
            type: "pick",
            q: "Which can your eyes tell you about? There is more than one.",
            options: ["Colours", "Shapes", "How a song sounds", "Things moving"],
            answers: [0, 1, 3],
          },
        ],
      },
      task: {
        title: "Draw your body",
        intro: "Make a big picture of you, and play a looking game.",
        need: ["A big piece of paper (or some taped together)", "Crayons or felt pens", "A grown-up to help"],
        steps: [
          "Lie down on the paper. Ask your grown-up to draw around you.",
          "Colour in your picture. Add your eyes, nose, mouth and hair.",
          "Point to the head, arms, hands, legs and feet. Say each name out loud.",
          "Play I Spy with your grown-up. Use your eyes to find something red, then something round.",
        ],
      },
      exit: [
        { type: "choice", q: "What do you see with?", options: ["Your ears", "Your eyes"], answer: 1 },
        { type: "choice", q: "Where do your legs bend?", options: ["At your knees", "At your elbows", "At your neck"], answer: 0 },
        { type: "type", q: "How many senses do you have?", answer: ["5", "five"] },
        { type: "choice", q: "What do your eyes need to see?", options: ["Light", "Water", "Sound"], answer: 0 },
        { type: "choice", q: "Is it safe to look straight at the Sun?", options: ["Yes", "No"], answer: 1 },
        { type: "match", q: "Match each body part.", pairs: [["Fingers", "On your hands"], ["Toes", "On your feet"], ["Head", "On your neck"]] },
      ],
      grownUp: {
        need: ["A large sheet of paper (lining paper or taped-together sheets)", "Crayons or felt pens"],
        tips: [
          "Sing 'Head, shoulders, knees and toes' together. It is a great way to fix the names, and it gets everyone moving.",
          "The five senses are seeing, hearing, touching, smelling and tasting. You will meet one each lesson, so there is no need to learn them all today.",
        ],
        younger: "Just name head, arms, hands, legs and feet, and play I Spy with colours instead of letters.",
        older: "Add trickier parts to the drawing: wrist, ankle, heel, elbow, chin and eyebrows.",
      },
    },
    {
      slug: "our-senses-2",
      title: "Listening with my ears",
      emoji: "👂",
      minutes: 30,
      goal: "I can say that I hear with my ears and tell loud sounds from quiet ones.",
      starter: [
        { type: "choice", q: "What do you see with?", options: ["Your eyes", "Your nose"], answer: 0 },
        { type: "type", q: "How many senses do you have?", answer: ["5", "five"] },
        { type: "choice", q: "Where do your arms bend?", options: ["At your knees", "At your elbows"], answer: 1 },
        { type: "choice", q: "What do your eyes need to see?", options: ["Sound", "Light"], answer: 1 },
        { type: "order", q: "Put these from the top of your body to the bottom.", items: ["Head", "Shoulders", "Knees", "Toes"] },
        {
          type: "pick",
          q: "Which are senses? There is more than one.",
          options: ["Seeing", "Jumping", "Hearing", "Tasting"],
          answers: [0, 2, 3],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Hearing with your ears",
            text: [
              "You hear with your ears. You have two, one on each side of your head.",
              "Your ears catch sounds all day long: voices, birds, cars, music and more.",
            ],
          },
          {
            heading: "Loud and quiet",
            text: [
              "Some sounds are loud, like a drum or a fire engine. Some sounds are quiet, like a whisper or a ticking clock.",
              "When a sound is far away, it sounds quieter. As it comes closer, it gets louder.",
            ],
          },
          {
            heading: "Look after your ears",
            text: [
              "Very loud sounds can hurt your ears. If something is too loud, cover your ears or move away.",
              "Never put anything inside your ears. Your ears are clever and look after themselves.",
            ],
          },
        ],
        words: [
          { word: "hearing", meaning: "finding out about sounds with your ears" },
          { word: "loud", meaning: "a big sound that is easy to hear" },
          { word: "quiet", meaning: "a small, soft sound that is hard to hear" },
        ],
      },
      practice: {
        intro: "Let's think about sounds.",
        questions: [
          { type: "choice", q: "Which is louder?", options: ["A whisper", "A drum"], answer: 1 },
          {
            type: "pick",
            q: "Which sounds are quiet? There is more than one.",
            options: ["A ticking clock", "A fire engine", "A mouse squeak", "A whisper"],
            answers: [0, 2, 3],
          },
          { type: "match", q: "Match each thing to its sound.", pairs: [["A dog", "Woof"], ["A cat", "Miaow"], ["A duck", "Quack"]] },
          { type: "order", q: "Put these from quietest to loudest.", items: ["A whisper", "Talking", "Shouting"] },
        ],
      },
      task: {
        title: "Sound shakers",
        intro: "Make shakers and listen to their sounds.",
        need: ["Three small pots with lids, or plastic tubs", "Dried rice, dried pasta and a few buttons or paper clips", "A grown-up to help"],
        steps: [
          "Put a little rice in one pot, pasta in the next and buttons in the last.",
          "Ask your grown-up to put the lids on tight.",
          "Shake each one. Which is loudest? Which is quietest?",
          "Close your eyes. Your grown-up shakes one. Can you guess which it is just by listening?",
        ],
      },
      exit: [
        { type: "choice", q: "What do you hear with?", options: ["Your ears", "Your eyes", "Your hands"], answer: 0 },
        { type: "type", q: "How many ears do you have?", answer: ["2", "two"] },
        { type: "choice", q: "Which sound is quiet?", options: ["A fire engine", "A whisper"], answer: 1 },
        { type: "choice", q: "A sound is far away. How does it sound?", options: ["Quieter", "Louder"], answer: 0 },
        { type: "choice", q: "Something is much too loud. What should you do?", options: ["Get closer", "Cover your ears or move away"], answer: 1 },
        { type: "choice", q: "Should you put things inside your ears?", options: ["Yes", "No"], answer: 1 },
      ],
      grownUp: {
        need: ["Three small pots or tubs with lids", "Dried rice, pasta and buttons or paper clips"],
        tips: [
          "Tape the lids on if they might pop off. Small items like buttons are a choking risk, so stay close.",
          "Try a listening minute: sit very still with eyes closed and count how many different sounds you can hear.",
        ],
        younger: "Just compare two shakers, rice and buttons, and talk about which is louder.",
        older: "Try the shakers in different rooms, or from near and far away, and say what changes.",
      },
    },
    {
      slug: "our-senses-3",
      title: "Touching with my skin",
      emoji: "✋",
      minutes: 30,
      goal: "I can say that I feel things with my skin and use words like soft, hard and bumpy.",
      starter: [
        { type: "choice", q: "What do you hear with?", options: ["Your nose", "Your ears"], answer: 1 },
        { type: "choice", q: "Which sound is loud?", options: ["A drum", "A whisper"], answer: 0 },
        { type: "choice", q: "A sound comes closer. How does it sound?", options: ["Quieter", "Louder"], answer: 1 },
        { type: "choice", q: "Something is much too loud. What should you do?", options: ["Cover your ears or move away", "Turn it up"], answer: 0 },
        { type: "order", q: "Put these from quietest to loudest.", items: ["A whisper", "Talking", "Shouting"] },
        { type: "type", q: "How many ears do you have?", answer: ["2", "two"] },
      ],
      learn: {
        cards: [
          {
            heading: "Feeling with your skin",
            text: [
              "You feel things with your skin. Skin covers your whole body, from your head to your toes.",
              "Your fingertips are extra good at feeling. That is why we often touch things with our hands.",
            ],
          },
          {
            heading: "Lots of ways things feel",
            text: [
              "Things can feel soft, like a teddy, or hard, like a stone. They can be smooth, like a spoon, or rough, like a brick.",
              "Some things feel bumpy, some feel fluffy, and some feel squishy.",
            ],
          },
          {
            heading: "Hot and cold",
            text: [
              "Your skin can feel hot and cold too. An ice cube feels cold. A warm bath feels warm.",
              "Your skin tells you when something is too hot, so you can pull away. Never touch an oven, a kettle or a hot pan.",
            ],
          },
        ],
        words: [
          { word: "touch", meaning: "feeling things with your skin" },
          { word: "skin", meaning: "the soft covering all over your body" },
          { word: "rough", meaning: "bumpy and scratchy, not smooth" },
          { word: "smooth", meaning: "flat and even, with no bumps" },
        ],
      },
      practice: {
        intro: "How do these things feel?",
        questions: [
          { type: "match", q: "Match each thing to how it feels.", pairs: [["A teddy", "Soft"], ["A stone", "Hard"], ["An ice cube", "Cold"]] },
          { type: "choice", q: "Which feels rough?", options: ["A spoon", "A brick", "A teddy"], answer: 1 },
          {
            type: "pick",
            q: "Which things feel soft? There is more than one.",
            options: ["A pillow", "A feather", "A rock", "A woolly hat"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "Which part of you is extra good at feeling?", options: ["Your elbows", "Your fingertips"], answer: 1 },
        ],
      },
      task: {
        title: "A feely bag",
        intro: "Guess what is in the bag just by touching it.",
        need: ["A pillowcase or cloth bag", "Five things with different feels, like a sponge, a spoon, a pine cone, a sock and an apple", "A grown-up to help"],
        steps: [
          "Your grown-up hides the things in the bag. No peeking!",
          "Put your hand in and feel one thing.",
          "Say how it feels. Is it soft or hard? Smooth or bumpy?",
          "Guess what it is, then pull it out to check. Take turns with your grown-up.",
        ],
      },
      exit: [
        { type: "choice", q: "What do you feel things with?", options: ["Your skin", "Your ears"], answer: 0 },
        { type: "choice", q: "Where is your skin?", options: ["Only on your hands", "All over your body"], answer: 1 },
        { type: "choice", q: "Which feels smooth?", options: ["A brick", "A spoon"], answer: 1 },
        { type: "match", q: "Match each thing to how it feels.", pairs: [["A pillow", "Soft"], ["A brick", "Rough"], ["A warm bath", "Warm"]] },
        { type: "choice", q: "Is it safe to touch a hot pan?", options: ["Yes", "No"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "Your ___ are extra good at feeling things.", bank: ["fingertips", "knees", "ears"], answers: ["fingertips"] },
      ],
      grownUp: {
        need: ["A pillowcase or cloth bag", "Five everyday objects with different textures"],
        tips: [
          "Avoid sharp or very small objects in the feely bag.",
          "Help your child find words beyond 'nice' and 'yucky': soft, hard, smooth, rough, bumpy, cold, squishy, fluffy.",
        ],
        younger: "Use just three very different things, like a teddy, a spoon and a sponge.",
        older: "Make a texture collage: stick on scraps of fabric, foil, sandpaper and cotton wool, and label each with a word.",
      },
    },
    {
      slug: "our-senses-4",
      title: "Smelling with my nose",
      emoji: "👃",
      minutes: 30,
      goal: "I can say that I smell with my nose and talk about nice and nasty smells.",
      starter: [
        { type: "choice", q: "What do you feel things with?", options: ["Your skin", "Your eyes"], answer: 0 },
        { type: "choice", q: "Which feels rough?", options: ["A brick", "A spoon"], answer: 0 },
        { type: "choice", q: "Which feels soft?", options: ["A stone", "A teddy"], answer: 1 },
        { type: "choice", q: "Is it safe to touch a hot oven?", options: ["No", "Yes"], answer: 0 },
        { type: "match", q: "Match each thing to how it feels.", pairs: [["An ice cube", "Cold"], ["A pine cone", "Bumpy"], ["A feather", "Soft"]] },
        { type: "choice", q: "Which part of you is extra good at feeling?", options: ["Your knees", "Your ears", "Your fingertips"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Smelling with your nose",
            text: [
              "You smell with your nose. When you sniff, you breathe in tiny bits of smell from the air.",
              "Your nose can find out about things you cannot see, like toast cooking in another room.",
            ],
          },
          {
            heading: "Nice smells and nasty smells",
            text: [
              "Some smells are lovely, like flowers, fresh bread or an orange.",
              "Some smells are nasty, like a smelly bin or old socks. People like different smells, and that is fine.",
            ],
          },
          {
            heading: "Smells that keep us safe",
            text: [
              "Your nose helps keep you safe. Food that has gone bad often smells horrid, which tells you not to eat it.",
              "If you smell smoke or burning, tell a grown-up straight away.",
            ],
          },
        ],
        words: [
          { word: "smell", meaning: "finding out about things with your nose" },
          { word: "sniff", meaning: "breathe in quickly through your nose to smell" },
          { word: "scent", meaning: "a smell, often a nice one" },
        ],
      },
      practice: {
        intro: "Let's think about smells.",
        questions: [
          { type: "choice", q: "Which sense uses your nose?", options: ["Smelling", "Hearing"], answer: 0 },
          {
            type: "pick",
            q: "Which smells do lots of people like? There is more than one.",
            options: ["Flowers", "A smelly bin", "Fresh bread", "An orange"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "You smell smoke. What should you do?", options: ["Hide", "Tell a grown-up straight away", "Ignore it"], answer: 1 },
          { type: "match", q: "Match each body part to its sense.", pairs: [["Eyes", "Seeing"], ["Ears", "Hearing"], ["Nose", "Smelling"]] },
        ],
      },
      task: {
        title: "Smelly pots",
        intro: "Guess the smell with your eyes closed.",
        need: ["Four cups or pots", "Four things with strong smells, like a slice of orange, a squeeze of lemon, a little coffee and a sprig of mint", "A grown-up to help"],
        steps: [
          "Your grown-up puts one smelly thing in each cup.",
          "Close your eyes, or wear a scarf over them.",
          "Sniff each cup gently. Do you like the smell?",
          "Guess what it is, then open your eyes to see if you were right.",
        ],
      },
      exit: [
        { type: "choice", q: "What do you smell with?", options: ["Your mouth", "Your nose"], answer: 1 },
        { type: "choice", q: "What does sniff mean?", options: ["Breathe in quickly through your nose", "Shout very loudly"], answer: 0 },
        { type: "choice", q: "Can your nose tell you about things you cannot see?", options: ["No", "Yes"], answer: 1 },
        { type: "choice", q: "Food that has gone bad often smells...", options: ["horrid", "lovely"], answer: 0 },
        { type: "choice", q: "You smell burning. What should you do?", options: ["Keep playing", "Hide under the bed", "Tell a grown-up straight away"], answer: 2 },
        { type: "choice", q: "Does everyone like the same smells?", options: ["Yes, always", "No, people like different smells"], answer: 1 },
      ],
      grownUp: {
        need: ["Four cups or pots", "Four strong-smelling household things, like orange, lemon, coffee, mint, vanilla or cinnamon"],
        tips: [
          "Show your child how to waft or sniff gently rather than sticking their nose right in. Avoid cleaning products, perfumes and anything with strong fumes.",
          "Smell and memory are closely linked. Ask what each smell reminds them of.",
        ],
        younger: "Use just two very different smells, like orange and mint, and let them look first, then try with eyes closed.",
        older: "Add trickier smells like cinnamon or garlic, and sort the pots into 'like' and 'don't like'.",
      },
    },
    {
      slug: "our-senses-5",
      title: "Tasting with my tongue",
      emoji: "👅",
      minutes: 30,
      goal: "I can say that I taste with my tongue and name sweet, salty and sour tastes.",
      starter: [
        { type: "choice", q: "What do you smell with?", options: ["Your nose", "Your ears"], answer: 0 },
        { type: "choice", q: "Which smell do lots of people like?", options: ["A smelly bin", "Fresh bread"], answer: 1 },
        { type: "choice", q: "You smell smoke. What should you do?", options: ["Tell a grown-up straight away", "Ignore it"], answer: 0 },
        { type: "choice", q: "What does sniff mean?", options: ["Clap your hands", "Breathe in quickly through your nose"], answer: 1 },
        { type: "match", q: "Match each body part to its sense.", pairs: [["Nose", "Smelling"], ["Skin", "Touching"], ["Ears", "Hearing"]] },
        { type: "choice", q: "Food that has gone bad often smells...", options: ["lovely", "horrid"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Tasting with your tongue",
            text: [
              "You taste with your tongue, inside your mouth. Look in a mirror and you will see it is covered in tiny bumps.",
              "Those bumps help you taste your food.",
            ],
          },
          {
            heading: "Sweet, salty and sour",
            text: [
              "Foods have different tastes. Honey and strawberries taste sweet. Crisps taste salty. Lemons taste sour.",
              "Some foods taste bitter, like dark chocolate. Lots of children don't like bitter tastes, and that is OK.",
            ],
          },
          {
            heading: "Your nose helps you taste",
            text: [
              "Your nose and tongue work together. When you have a cold and a blocked nose, food tastes of less.",
              "Only taste things a grown-up says are safe to eat. Never taste things you find.",
            ],
          },
        ],
        words: [
          { word: "taste", meaning: "finding out about food with your tongue" },
          { word: "tongue", meaning: "the soft, bendy part inside your mouth" },
          { word: "sweet", meaning: "a sugary taste, like honey" },
          { word: "sour", meaning: "a sharp taste, like lemon" },
        ],
      },
      practice: {
        intro: "Let's think about tastes.",
        questions: [
          { type: "match", q: "Match each food to its taste.", pairs: [["Honey", "Sweet"], ["Crisps", "Salty"], ["Lemon", "Sour"]] },
          { type: "choice", q: "Which part of you tastes food?", options: ["Your tongue", "Your elbow"], answer: 0 },
          {
            type: "pick",
            q: "Which foods taste sweet? There is more than one.",
            options: ["Strawberries", "Banana", "Lemon", "Honey"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "You find a berry in the park. Should you taste it?", options: ["Yes", "No, only taste what a grown-up says is safe"], answer: 1 },
        ],
      },
      task: {
        title: "A taste test",
        intro: "Try tiny tastes and say what each one is like.",
        need: ["A few small bits of food your grown-up has chosen, like a piece of apple, a cracker, a slice of lemon and a little cheese", "A cup of water", "A grown-up to help"],
        steps: [
          "Wash your hands.",
          "Take a tiny taste of one food. Is it sweet, salty or sour?",
          "Have a sip of water before the next one.",
          "Now hold your nose and taste a piece of apple. Let go. Does it taste different?",
        ],
      },
      exit: [
        { type: "choice", q: "What do you taste with?", options: ["Your tongue", "Your nose", "Your fingers"], answer: 0 },
        { type: "choice", q: "What taste does a lemon have?", options: ["Sweet", "Sour"], answer: 1 },
        { type: "choice", q: "What taste do crisps have?", options: ["Salty", "Sour"], answer: 0 },
        { type: "choice", q: "Which part of you helps your tongue to taste?", options: ["Your knees", "Your nose"], answer: 1 },
        { type: "choice", q: "Should you taste things you find?", options: ["No", "Yes"], answer: 0 },
        { type: "gap", q: "Fill the gap.", text: "Honey tastes ___.", bank: ["sweet", "salty", "sour"], answers: ["sweet"] },
      ],
      grownUp: {
        need: ["Small pieces of safe foods your child already eats, like apple, cracker, lemon and cheese", "A cup of water"],
        tips: [
          "Allergy note: only use foods you know your child can safely eat. Check for allergies and intolerances first, and avoid nuts and any choking hazards. Cut food into small pieces.",
          "There is no 'tongue map'. All parts of the tongue can taste every taste.",
          "Never force a taste. Licking or smelling counts too.",
        ],
        younger: "Just compare two tastes, like sweet apple and sour lemon, and talk about the faces you make.",
        older: "Make a simple chart with columns for sweet, salty, sour and bitter, and sort five foods into it.",
      },
    },
    {
      slug: "our-senses-6",
      title: "A senses walk",
      emoji: "🚶",
      minutes: 30,
      goal: "I can use all five senses to find out about the world around me.",
      starter: [
        { type: "choice", q: "What do you taste with?", options: ["Your tongue", "Your ears"], answer: 0 },
        { type: "choice", q: "What taste does a lemon have?", options: ["Sour", "Sweet"], answer: 0 },
        { type: "choice", q: "Which part of you helps your tongue to taste?", options: ["Your elbow", "Your nose"], answer: 1 },
        { type: "match", q: "Match each food to its taste.", pairs: [["Strawberries", "Sweet"], ["Crisps", "Salty"], ["Lemon", "Sour"]] },
        { type: "choice", q: "Should you taste things you find?", options: ["Yes", "No"], answer: 1 },
        {
          type: "pick",
          q: "Which foods taste sweet? There is more than one.",
          options: ["Honey", "Crisps", "Banana", "Strawberries"],
          answers: [0, 2, 3],
        },
      ],
      learn: {
        cards: [
          {
            heading: "All five together",
            text: [
              "You have five senses: seeing, hearing, touching, smelling and tasting.",
              "You use your eyes, ears, skin, nose and tongue. Most of the time, they all work together.",
            ],
          },
          {
            heading: "Senses at breakfast",
            text: [
              "Think about eating toast. You see it go golden. You smell it cooking. You hear the crunch.",
              "You feel it warm in your hands, and you taste it on your tongue. That is all five senses at once!",
            ],
          },
          {
            heading: "Going on a senses walk",
            text: [
              "On a senses walk, you go slowly and notice things. What can you see, hear, smell and touch?",
              "Stay with your grown-up the whole time. Outside, we don't taste anything. We save tasting for safe food at home.",
            ],
          },
        ],
        words: [
          { word: "five senses", meaning: "seeing, hearing, touching, smelling and tasting" },
          { word: "notice", meaning: "see, hear or feel something and think about it" },
          { word: "explore", meaning: "look around to find out new things" },
        ],
      },
      practice: {
        intro: "Which senses are you using?",
        questions: [
          { type: "match", q: "Match each body part to its sense.", pairs: [["Eyes", "Seeing"], ["Tongue", "Tasting"], ["Skin", "Touching"]] },
          { type: "choice", q: "You hear a bird singing. Which sense is that?", options: ["Smelling", "Hearing", "Tasting"], answer: 1 },
          { type: "choice", q: "You stroke a soft cat. Which sense is that?", options: ["Touching", "Seeing"], answer: 0 },
          { type: "choice", q: "You smell flowers. Which body part are you using?", options: ["Your ears", "Your nose", "Your tongue"], answer: 1 },
        ],
      },
      task: {
        title: "Go on a senses walk",
        intro: "Walk slowly with your grown-up and notice things with your senses.",
        need: ["A grown-up to go with you", "Paper and a pencil, or a clipboard", "Coats and shoes for outside"],
        steps: [
          "Go outside with your grown-up, to the garden, the park or along your street.",
          "Stop and look. Find three things you can see.",
          "Close your eyes and listen. What can you hear?",
          "Gently touch a leaf, some bark or a wall. How does it feel?",
          "Have a sniff. Can you smell anything?",
          "At home, draw one thing for each sense you used.",
        ],
      },
      exit: [
        { type: "type", q: "How many senses do you have?", answer: ["5", "five"] },
        {
          type: "pick",
          q: "Which are the five senses? Pick them all.",
          options: ["Seeing", "Hearing", "Running", "Touching", "Smelling", "Tasting"],
          answers: [0, 1, 3, 4, 5],
        },
        { type: "match", q: "Match each sense to its body part.", pairs: [["Hearing", "Ears"], ["Smelling", "Nose"], ["Tasting", "Tongue"]] },
        { type: "choice", q: "You hear the crunch of toast. Which sense is that?", options: ["Hearing", "Touching"], answer: 0 },
        { type: "choice", q: "On a senses walk outside, should you taste things?", options: ["Yes", "No"], answer: 1 },
        { type: "choice", q: "Do your senses often work together?", options: ["No, only one at a time", "Yes, they often work together"], answer: 1 },
      ],
      grownUp: {
        need: ["Somewhere safe to walk: a garden, park or quiet street", "Paper and a pencil"],
        tips: [
          "Stay with your child throughout the walk and keep them away from roads. Agree that nothing found outside goes in mouths, and wash hands when you get home.",
          "Go slowly. Stopping for one full minute of silent listening often surprises children with how much they hear.",
        ],
        younger: "Just pick two senses for the walk, like seeing and hearing, and talk about what you notice rather than drawing.",
        older: "Make a five-column chart before you go, with a column for each sense, and fill it in as you walk.",
      },
    },
  ],
};
