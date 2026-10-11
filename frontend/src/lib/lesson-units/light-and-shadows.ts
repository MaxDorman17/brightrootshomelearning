import type { LessonUnit } from "@/lib/lessons";

/** Light and shadows, for ages 7 to 11. Everything needs only a torch and things from around the house. */
export const lightAndShadows: LessonUnit = {
  slug: "light-and-shadows",
  title: "Light and shadows",
  short: "Light and shadows",
  subject: "Science",
  ages: "7 to 11",
  emoji: "🔦",
  color: "#C9A227",
  summary: "Six lessons of experiments with a torch and things from around the house: light sources, reflections, shadows, the sun, and how we see.",
  lessons: [
    {
      slug: "light-and-shadows-1",
      title: "Light and dark",
      emoji: "💡",
      minutes: 40,
      goal: "I can name light sources and explain that we need light to see.",
      starter: [
        { type: "choice", q: "Can you see in a completely dark room?", options: ["No", "Yes"], answer: 0 },
        { type: "choice", q: "What gives us light in the day?", options: ["The sun", "The moon"], answer: 0 },
        { type: "choice", q: "Which of these is shiny?", options: ["A spoon", "A sock"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Light sources",
            text: [
              "A light source is something that makes its own light. The sun, a torch, a candle flame, a lamp, a screen and fire are all light sources.",
              "The sun is our most important light source. It's a star, and it's so bright you must never look straight at it.",
            ],
          },
          {
            heading: "The moon is not a light source",
            text: [
              "The moon looks bright, but it doesn't make its own light. It reflects light from the sun, like a giant mirror.",
              "Shiny things like mirrors, spoons and foil aren't light sources either. They just reflect light really well.",
            ],
          },
          {
            heading: "Dark is the absence of light",
            text: [
              "Darkness isn't a thing. It's what we have when there's no light.",
              "We need light to see. Even cats and owls, which see well at night, need a tiny bit of light. In total darkness, nobody can see anything.",
            ],
          },
        ],
        words: [
          { word: "light source", meaning: "something that makes its own light" },
          { word: "reflect", meaning: "when light bounces off something" },
          { word: "dark", meaning: "when there is no light" },
        ],
      },
      practice: {
        intro: "Light source or not?",
        questions: [
          {
            type: "pick",
            q: "Which are light sources? There is more than one.",
            options: ["The sun", "A torch", "The moon", "A mirror", "A candle flame"],
            answers: [0, 1, 4],
          },
          { type: "choice", q: "Why does the moon look bright?", options: ["It reflects light from the sun", "It is on fire"], answer: 0 },
        ],
      },
      task: {
        title: "The dark den test",
        intro: "Find out what you can see with less and less light.",
        need: ["A large cardboard box, or a blanket over a table", "A torch", "Some objects: a spoon, foil, a white sock, a dark sock, a book"],
        steps: [
          "Make a dark den under a blanket or inside a box.",
          "Take the objects in with you. With the den fully closed, can you see any of them?",
          "Let in a tiny bit of light by lifting a corner. Which objects can you see first?",
          "Now switch on the torch. Write down which objects were easiest to see in dim light. Why do you think that is?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a light source?", options: ["Something that makes its own light", "Anything shiny"], answer: 0 },
        { type: "choice", q: "Is the moon a light source?", options: ["No, it reflects the sun's light", "Yes"], answer: 0 },
        { type: "choice", q: "What is darkness?", options: ["When there is no light", "A kind of shadow"], answer: 0 },
        { type: "choice", q: "Can you see anything in total darkness?", options: ["No", "Yes, if you try hard"], answer: 0 },
        { type: "choice", q: "Should you ever look straight at the sun?", options: ["No, never", "Yes, for a short time"], answer: 0 },
      ],
      grownUp: {
        need: ["A big box or blanket", "A torch", "A few household objects"],
        tips: [
          "Light-coloured and shiny objects are easiest to see in dim light, because they reflect more of it.",
          "Stress sun safety in this unit: never look directly at the sun, even with sunglasses.",
        ],
        younger: "Go on a light source hunt around the house and count how many you find.",
        older: "Sort 15 things around the house into 'light sources' and 'reflectors', and explain any that are tricky.",
      },
    },
    {
      slug: "light-and-shadows-2",
      title: "Reflections",
      emoji: "🪞",
      minutes: 40,
      goal: "I can explain how light reflects off surfaces, and which surfaces reflect best.",
      starter: [
        { type: "choice", q: "What is a light source?", options: ["Something that makes its own light", "A mirror"], answer: 0 },
        { type: "choice", q: "Why does the moon look bright?", options: ["It reflects sunlight", "It makes light"], answer: 0 },
        { type: "choice", q: "What do you see when you look in a mirror?", options: ["Your reflection", "A shadow"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Light travels in straight lines",
            text: [
              "Light travels out from a light source in straight lines, very fast. It's the fastest thing in the universe!",
              "When light hits something, it bounces off. That's reflection.",
            ],
          },
          {
            heading: "Shiny and smooth",
            text: [
              "Smooth, shiny surfaces like mirrors reflect light neatly, so you can see a clear picture, called a reflection.",
              "Rough or dull surfaces, like paper or fabric, scatter light in all directions, so you don't see a clear reflection.",
            ],
          },
          {
            heading: "Reflections keep us safe",
            text: [
              "Reflective strips on bags, coats and road signs bounce car headlights back to the driver, so you can be seen in the dark.",
              "Cat's eyes in the middle of roads reflect headlights to show drivers where the lanes are.",
            ],
          },
        ],
        words: [
          { word: "reflection", meaning: "the picture you see when light bounces off a smooth, shiny surface" },
          { word: "surface", meaning: "the outside or top layer of something" },
          { word: "reflective", meaning: "good at bouncing light back" },
        ],
      },
      practice: {
        intro: "Reflections.",
        questions: [
          { type: "choice", q: "Which surface gives the clearest reflection?", options: ["A mirror", "A towel", "Cardboard"], answer: 0 },
          { type: "choice", q: "How does light travel?", options: ["In straight lines", "In wiggly lines"], answer: 0 },
        ],
      },
      task: {
        title: "Reflection test and mirror writing",
        intro: "Test which things reflect best, then send a mirror message.",
        need: ["A torch", "A mirror", "Foil, a metal spoon, paper, fabric, a plate, a window", "Paper and a pencil"],
        steps: [
          "In a darkish room, shine the torch at each material in turn, at an angle, and see where the light bounces to on the wall.",
          "Rank them from best reflector to worst.",
          "Look at the inside of a spoon, then the back. What happens to your reflection?",
          "Write a short message backwards so it can only be read in a mirror. Give it to someone in your family to read.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a reflection?", options: ["Light bouncing off a smooth, shiny surface", "A light source"], answer: 0 },
        { type: "choice", q: "Which reflects best?", options: ["Foil", "A woolly jumper", "Paper"], answer: 0 },
        { type: "choice", q: "Why do coats have reflective strips?", options: ["So drivers can see you in the dark", "To keep you warm"], answer: 0 },
        { type: "choice", q: "Light travels...", options: ["in straight lines", "slowly", "in circles"], answer: 0 },
        { type: "choice", q: "What do cat's eyes on roads do?", options: ["Reflect headlights to show the lanes", "Make their own light"], answer: 0 },
      ],
      grownUp: {
        need: ["Torch, mirror", "Foil, spoon, paper, fabric", "Paper and pencil"],
        tips: [
          "The spoon is a lovely surprise: the inside (concave) shows you upside down, and the back (convex) shows you the right way up.",
          "Be careful with glass mirrors. A plastic mirror or a phone's selfie camera works too.",
        ],
        younger: "Make funny faces in different shiny things: a spoon, a pan lid, a window at night.",
        older: "Use two mirrors to make a periscope from a cereal box, so you can see over a wall.",
      },
    },
    {
      slug: "light-and-shadows-3",
      title: "How do shadows form?",
      emoji: "👤",
      minutes: 40,
      goal: "I can explain how shadows are made, and sort materials into transparent, translucent and opaque.",
      starter: [
        { type: "choice", q: "How does light travel?", options: ["In straight lines", "Around corners"], answer: 0 },
        { type: "choice", q: "What is a reflection?", options: ["Light bouncing off a surface", "A light source"], answer: 0 },
        { type: "choice", q: "Can you see through a window?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Blocking the light",
            text: [
              "Light travels in straight lines and can't bend around things. When an object blocks light, it leaves a dark area behind it with no light. That's a shadow.",
              "A shadow is the same shape as the outline of the object, but it has no colours or details.",
            ],
          },
          {
            heading: "Transparent, translucent, opaque",
            text: [
              "Transparent materials, like clear glass or cling film, let almost all light through. They make very faint shadows, or none.",
              "Translucent materials, like tissue paper or a plastic bag, let some light through. They make pale shadows.",
              "Opaque materials, like wood, cardboard or metal, let no light through. They make dark shadows.",
            ],
          },
          {
            heading: "Shadow puppets",
            text: [
              "People have used shadows for stories for thousands of years. Shadow puppet theatre is an old tradition in places like China, Indonesia and Turkey.",
              "The puppets are made from opaque card or leather, held between a light and a screen.",
            ],
          },
        ],
        words: [
          { word: "shadow", meaning: "a dark area where an object blocks the light" },
          { word: "transparent", meaning: "lets almost all light through, so you can see clearly through it" },
          { word: "translucent", meaning: "lets some light through, but you can't see clearly through it" },
          { word: "opaque", meaning: "lets no light through" },
        ],
      },
      practice: {
        intro: "Transparent, translucent or opaque?",
        questions: [
          {
            type: "match",
            q: "Match each material to the right word.",
            pairs: [["Clear glass", "Transparent"], ["Tissue paper", "Translucent"], ["Cardboard", "Opaque"]],
          },
          { type: "choice", q: "Which makes the darkest shadow?", options: ["Opaque materials", "Transparent materials"], answer: 0 },
        ],
      },
      task: {
        title: "Shadow puppet show",
        intro: "Test materials, then put on a shadow puppet show.",
        need: ["A torch", "A white wall or sheet", "Card, scissors, tape and straws or sticks", "Cling film, tissue paper, a plastic bag, foil"],
        steps: [
          "Shine the torch at the wall. Hold each material in the beam. Sort them into transparent, translucent and opaque by their shadows.",
          "Draw and cut out two or three puppet characters from card. Tape each to a straw or stick.",
          "Add a window or a detail to one puppet using tissue paper or cling film. What happens to its shadow?",
          "Turn off the lights and put on a short shadow puppet show for your family.",
        ],
      },
      exit: [
        { type: "choice", q: "How is a shadow made?", options: ["An object blocks the light", "Light reflects off a mirror"], answer: 0 },
        { type: "choice", q: "Cardboard is...", options: ["opaque", "transparent", "translucent"], answer: 0 },
        { type: "choice", q: "Tissue paper is...", options: ["translucent", "opaque", "transparent"], answer: 0 },
        { type: "choice", q: "What does a transparent material do?", options: ["Lets almost all light through", "Blocks all light"], answer: 0 },
        { type: "choice", q: "Does a shadow show the colours of the object?", options: ["No, just its outline", "Yes"], answer: 0 },
      ],
      grownUp: {
        need: ["Torch, a pale wall or sheet", "Card, scissors, tape, straws", "Cling film, tissue paper, plastic bag, foil"],
        tips: [
          "Search 'shadow puppet theatre' to show your child some beautiful traditional puppets before they start.",
          "Hand shadows are fun too: a bird, a rabbit, a dog. You can look up how to make them.",
        ],
        younger: "Make hand shadow animals on the wall with a torch.",
        older: "Write a short script for your puppet show, with a beginning, middle and end.",
      },
    },
    {
      slug: "light-and-shadows-4",
      title: "Changing shadows",
      emoji: "📏",
      minutes: 40,
      goal: "I can investigate how the size of a shadow changes when the light moves.",
      starter: [
        { type: "choice", q: "What is an opaque material?", options: ["One that lets no light through", "One you can see through"], answer: 0 },
        { type: "choice", q: "How is a shadow made?", options: ["An object blocks light", "Light bends"], answer: 0 },
        { type: "choice", q: "What do we measure length with?", options: ["A ruler", "A clock"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Closer means bigger",
            text: [
              "If you move an object closer to the light, it blocks more light, so its shadow gets bigger.",
              "If you move the object further from the light, closer to the wall, its shadow gets smaller and sharper.",
            ],
          },
          {
            heading: "A fair test",
            text: [
              "Scientists test one thing at a time. That's called a fair test.",
              "To test how distance changes a shadow's size, you only change the distance. Everything else stays the same: the same object, the same torch, and the same wall.",
            ],
          },
          {
            heading: "Results and predictions",
            text: [
              "Before you test, make a prediction: what do you think will happen?",
              "Record your results in a table. Then look for a pattern, and see if your prediction was right.",
            ],
          },
        ],
        words: [
          { word: "fair test", meaning: "an experiment where you change only one thing" },
          { word: "prediction", meaning: "what you think will happen, before you test it" },
          { word: "results", meaning: "what you found out from your experiment" },
          { word: "pattern", meaning: "something that happens in a regular way" },
        ],
      },
      practice: {
        intro: "Shadow sizes.",
        questions: [
          { type: "choice", q: "You move a toy closer to the torch. What happens to its shadow?", options: ["It gets bigger", "It gets smaller", "It stays the same"], answer: 0 },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "In a fair test you change only ___ thing. What you think will happen is a ___.",
            bank: ["one", "prediction", "three", "shadow"],
            answers: ["one", "prediction"],
          },
        ],
      },
      task: {
        title: "Shadow size investigation",
        intro: "Measure how a shadow changes as the toy moves.",
        need: ["A torch", "A small toy or figure", "A wall, and a sheet of paper taped to it", "A ruler or tape measure", "Paper and pencil for your table"],
        steps: [
          "Put the torch on a table, about 1 metre from the wall, pointing at the paper. Don't move it during the test.",
          "Write a prediction: what will happen to the shadow as the toy moves closer to the torch?",
          "Put the toy 20 cm from the wall. Measure the height of its shadow on the paper. Then try 40 cm, 60 cm and 80 cm.",
          "Record your results in a table. What pattern do you notice? Was your prediction right?",
        ],
      },
      exit: [
        { type: "choice", q: "Moving an object closer to the light makes its shadow...", options: ["bigger", "smaller"], answer: 0 },
        { type: "choice", q: "In a fair test, how many things do you change?", options: ["One", "Everything"], answer: 0 },
        { type: "choice", q: "What is a prediction?", options: ["What you think will happen", "What did happen"], answer: 0 },
        { type: "choice", q: "To test distance fairly, you should keep...", options: ["the same torch and object", "changing the torch"], answer: 0 },
        { type: "choice", q: "Moving the object closer to the wall makes its shadow...", options: ["smaller", "bigger"], answer: 0 },
      ],
      grownUp: {
        need: ["Torch, a small toy", "Paper on a wall, a ruler or tape measure"],
        tips: [
          "Help keep the torch still. Propping it on a pile of books works well.",
          "If your child is ready, draw a simple bar chart of the results together.",
        ],
        younger: "Move a toy towards and away from the torch and say 'bigger' or 'smaller' each time.",
        older: "Try changing a different thing (the torch's height or angle) as a second fair test.",
      },
    },
    {
      slug: "light-and-shadows-5",
      title: "Sun and shadows",
      emoji: "☀️",
      minutes: 45,
      goal: "I can explain how shadows from the sun change during the day.",
      starter: [
        { type: "choice", q: "Closer to the light makes a shadow...", options: ["bigger", "smaller"], answer: 0 },
        { type: "choice", q: "Is the sun a light source?", options: ["Yes", "No"], answer: 0 },
        { type: "choice", q: "Where does the sun rise?", options: ["In the east", "In the north"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "The sun seems to move",
            text: [
              "The sun rises in the east in the morning, is highest in the sky around midday, and sets in the west in the evening.",
              "The sun isn't really moving across the sky. The Earth is spinning, which makes the sun look like it moves.",
            ],
          },
          {
            heading: "Shadows change through the day",
            text: [
              "When the sun is low in the morning and evening, shadows are long.",
              "When the sun is high at midday, shadows are short.",
              "Shadows also point in different directions as the sun moves, always on the opposite side from the sun.",
            ],
          },
          {
            heading: "Sundials",
            text: [
              "Long before clocks, people used shadows to tell the time. A sundial has a stick, called a gnomon, that casts a shadow onto marks for the hours.",
              "The Ancient Egyptians used shadow clocks over 3,000 years ago.",
            ],
          },
        ],
        words: [
          { word: "sundial", meaning: "a clock that uses the sun's shadow to tell the time" },
          { word: "gnomon", meaning: "the part of a sundial that casts the shadow" },
          { word: "rotate", meaning: "to spin around" },
        ],
      },
      practice: {
        intro: "Sun and shadows.",
        questions: [
          { type: "choice", q: "When are shadows shortest?", options: ["Around midday", "Early morning", "Evening"], answer: 0 },
          { type: "order", q: "Put the sun's journey in order.", items: ["Rises in the east", "Highest around midday", "Sets in the west"] },
        ],
      },
      task: {
        title: "Shadow tracking",
        intro: "Track your shadow, or a stick's, through a sunny day.",
        need: ["A sunny day", "Chalk, or a stick pushed into the ground with stones to mark the shadow", "A tape measure (optional)", "A watch or clock"],
        steps: [
          "On a sunny morning, stand on a spot outside (mark it with chalk) and get someone to draw round your shadow. Or push a stick into the ground.",
          "Write the time next to the shadow, or mark its tip with a stone and a label.",
          "Go back to exactly the same spot every hour or two. Draw or mark the new shadow.",
          "At the end of the day: when was the shadow longest? Shortest? Which way did it move?",
        ],
      },
      exit: [
        { type: "choice", q: "Where does the sun set?", options: ["In the west", "In the east"], answer: 0 },
        { type: "choice", q: "Why does the sun seem to move across the sky?", options: ["The Earth is spinning", "The sun is orbiting us"], answer: 0 },
        { type: "choice", q: "When are shadows longest?", options: ["Morning and evening", "Midday"], answer: 0 },
        { type: "choice", q: "What is a sundial?", options: ["A clock that uses shadows", "A kind of torch"], answer: 0 },
        { type: "choice", q: "A shadow is always...", options: ["on the opposite side from the sun", "on the same side as the sun"], answer: 0 },
      ],
      grownUp: {
        need: ["A sunny day", "Chalk, or a stick and stones", "A watch or clock"],
        tips: [
          "This needs a sunny day. If it's cloudy, do the learning and quiz now, and the shadow tracking on the next sunny day.",
          "Remind your child never to look straight at the sun while doing this.",
        ],
        younger: "Play shadow tag outside on a sunny day: tag someone by stepping on their shadow.",
        older: "Make a simple sundial with a paper plate and a pencil, marking the shadow each hour.",
      },
    },
    {
      slug: "light-and-shadows-6",
      title: "How we see",
      emoji: "👁️",
      minutes: 40,
      goal: "I can explain how light travels into our eyes so we can see, and how to protect our eyes.",
      starter: [
        { type: "choice", q: "When are shadows shortest?", options: ["Midday", "Evening"], answer: 0 },
        { type: "choice", q: "How does light travel?", options: ["In straight lines", "In circles"], answer: 0 },
        { type: "choice", q: "What do we see with?", options: ["Our eyes", "Our ears"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Light into our eyes",
            text: [
              "We see things because light travels into our eyes.",
              "Light comes from a light source, bounces off objects, and travels in straight lines into our eyes. Our brain turns it into a picture.",
            ],
          },
          {
            heading: "Inside the eye",
            text: [
              "The pupil is the black hole in the middle of your eye. It lets light in.",
              "The coloured part around it is the iris. It makes the pupil bigger in the dark to let more light in, and smaller in bright light to protect your eye.",
            ],
          },
          {
            heading: "Looking after our eyes",
            text: [
              "Never look directly at the sun. It can damage your eyes forever, even for a short time.",
              "Wear sunglasses marked with UV protection on bright days, and take breaks from screens to rest your eyes.",
            ],
          },
        ],
        words: [
          { word: "pupil", meaning: "the black hole in the middle of the eye that lets light in" },
          { word: "iris", meaning: "the coloured part of the eye" },
          { word: "UV", meaning: "a kind of light from the sun that can harm skin and eyes" },
        ],
      },
      practice: {
        intro: "How we see.",
        questions: [
          { type: "order", q: "Put the steps of seeing in order.", items: ["Light comes from a light source", "Light bounces off an object", "Light travels into your eye", "Your brain makes a picture"] },
          { type: "choice", q: "What happens to your pupil in the dark?", options: ["It gets bigger", "It gets smaller"], answer: 0 },
        ],
      },
      task: {
        title: "Watch your pupils change",
        intro: "See your own eyes react to light, then make a light poster.",
        need: ["A mirror", "A room you can make dim", "Paper and pens"],
        steps: [
          "Sit in a dim room for a minute, then look closely at your pupils in a mirror. Are they big or small?",
          "Turn on a bright light and watch your pupils straight away. What happens?",
          "Draw a diagram showing how we see a book: a light source, arrows to the book, and arrows to an eye.",
          "Add three tips for looking after your eyes to your poster.",
        ],
      },
      exit: [
        { type: "choice", q: "How do we see things?", options: ["Light travels into our eyes", "Our eyes send out light"], answer: 0 },
        { type: "choice", q: "What does the pupil do?", options: ["Lets light into the eye", "Gives the eye its colour"], answer: 0 },
        { type: "choice", q: "What happens to the pupil in bright light?", options: ["It gets smaller", "It gets bigger"], answer: 0 },
        { type: "choice", q: "What is the iris?", options: ["The coloured part of the eye", "A light source"], answer: 0 },
        { type: "choice", q: "Should you look straight at the sun?", options: ["Never", "Only with your eyes half shut"], answer: 0 },
      ],
      grownUp: {
        need: ["A mirror", "A room you can make dim", "Paper and pens"],
        tips: [
          "A common mistake is drawing arrows coming out of the eye. Check the arrows go from the light source, to the object, to the eye.",
          "Round off the unit by asking your child to explain how a shadow is made, using all the words they've learned.",
        ],
        younger: "Look at each other's eyes and name the pupil and the iris, and the colours you can see.",
        older: "Find out how glasses help people who can't see clearly, and what 'long-sighted' and 'short-sighted' mean.",
      },
    },
  ],
};
