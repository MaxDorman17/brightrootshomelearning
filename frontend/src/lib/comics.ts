/**
 * Saplings comics: ten heroes, each with a short comic that teaches one thing, then a fact, a quick quiz
 * and something to try at home. Written for Bright Roots. Pictures live in /public/comics:
 * heroes/<slug>.jpg for the cover and <slug>/<panel number>.jpg for each panel. Until a picture is added,
 * the panel shows the hero's emoji on their colour.
 */
export type ComicBubble = [speaker: string, text: string];
export type ComicPanel = { caption?: string; bubbles: ComicBubble[] };
export type ComicQuiz = { q: string; options: string[]; answer: number };
export type Comic = {
  slug: string;
  title: string;
  emoji: string;
  color: string;
  subject: string;
  topic: string;
  hero: { name: string; power: string };
  panels: ComicPanel[];
  fact: string;
  quiz: ComicQuiz[];
  tryThis: string;
};

export const COMICS: Comic[] = [
  {
    "slug": "captain-ten",
    "title": "The Broken Bridge",
    "emoji": "➕",
    "color": "#E8573C",
    "subject": "Maths",
    "topic": "Number bonds to 10",
    "hero": {
      "name": "Captain Ten",
      "power": "Can spot any two numbers that make 10"
    },
    "panels": [
      {
        "caption": "In the town of Numberton, the old bridge has holes in it!",
        "bubbles": [
          [
            "Milo",
            "Help! I can't get across to school!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Captain Ten",
            "Never fear, Captain Ten is here!"
          ],
          [
            "Captain Ten",
            "Each gap needs planks that make 10."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Captain Ten",
            "This gap has 7 planks. What goes with 7 to make 10?"
          ],
          [
            "Milo",
            "3! Because 7 and 3 make 10!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Milo",
            "This one has 4. So we need 6!"
          ],
          [
            "Captain Ten",
            "Super maths! 4 and 6 make 10."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Captain Ten",
            "5 planks here. What do we need?"
          ],
          [
            "Milo",
            "Another 5! Double five is ten!"
          ]
        ]
      },
      {
        "caption": "And everyone got to school on time.",
        "bubbles": [
          [
            "Captain Ten",
            "Remember the pairs: 1 and 9, 2 and 8, 3 and 7, 4 and 6, 5 and 5!"
          ]
        ]
      }
    ],
    "fact": "Pairs of numbers that make 10 are called number bonds. Knowing them helps you add and take away really quickly.",
    "quiz": [
      {
        "q": "What goes with 8 to make 10?",
        "options": [
          "1",
          "2",
          "3"
        ],
        "answer": 1
      },
      {
        "q": "6 + ? = 10",
        "options": [
          "3",
          "4",
          "5"
        ],
        "answer": 1
      },
      {
        "q": "Which pair makes 10?",
        "options": [
          "5 and 4",
          "7 and 3",
          "6 and 6"
        ],
        "answer": 1
      }
    ],
    "tryThis": "Hold up 10 fingers. Fold some down, then count how many are down and how many are still up. The two numbers always make 10!"
  },
  {
    "slug": "fen-the-fraction-fox",
    "title": "The Pizza Problem",
    "emoji": "🍕",
    "color": "#E58A2E",
    "subject": "Maths",
    "topic": "Halves and quarters",
    "hero": {
      "name": "Fen the Fraction Fox",
      "power": "Shares everything into equal parts"
    },
    "panels": [
      {
        "caption": "It's Fen's birthday picnic in Bramble Wood.",
        "bubbles": [
          [
            "Fen",
            "I've made one big pizza!"
          ],
          [
            "Bo",
            "Yum! But how do we share it?"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Fen",
            "We cut it into 2 equal parts. Each part is one half!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Ruby",
            "Can we have some too?"
          ],
          [
            "Bo",
            "Uh oh. Now there are four of us!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Fen",
            "Cut each half in half again. Now there are 4 equal parts."
          ],
          [
            "Fen",
            "Each one is a quarter!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Ruby",
            "Hey! Bo's piece is bigger than mine!"
          ],
          [
            "Fen",
            "That's not fair. Fractions must be equal parts!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Fen",
            "Two quarters make a half, and four quarters make the whole pizza!"
          ]
        ]
      }
    ],
    "fact": "A fraction is an equal part of a whole thing. A half is one of 2 equal parts. A quarter is one of 4 equal parts.",
    "quiz": [
      {
        "q": "How many halves make a whole?",
        "options": [
          "2",
          "3",
          "4"
        ],
        "answer": 0
      },
      {
        "q": "A pizza is cut into 4 equal parts. Each part is a...",
        "options": [
          "half",
          "quarter",
          "whole"
        ],
        "answer": 1
      },
      {
        "q": "How many quarters make one half?",
        "options": [
          "1",
          "2",
          "4"
        ],
        "answer": 1
      }
    ],
    "tryThis": "Fold a piece of paper in half, then in half again. Open it up. How many quarters can you see? Colour in one half."
  },
  {
    "slug": "clockwork-clara",
    "title": "Late for the Launch",
    "emoji": "⏱",
    "color": "#3F7CC0",
    "subject": "Maths",
    "topic": "Telling the time",
    "hero": {
      "name": "Clockwork Clara",
      "power": "Can read any clock in a flash"
    },
    "panels": [
      {
        "caption": "At Starfield Space Centre, the rocket launches at 3 o'clock.",
        "bubbles": [
          [
            "Clara",
            "Beep! We must not be late!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Clara",
            "When the long hand points to 12 and the short hand points to 3..."
          ],
          [
            "Clara",
            "...it's 3 o'clock!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Zak",
            "The long hand is on 6. What does that mean?"
          ],
          [
            "Clara",
            "It's half past one. The hour is half done: 30 minutes past!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Clara",
            "Now the long hand is on 3. That's quarter past two."
          ],
          [
            "Zak",
            "15 minutes past!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Clara",
            "Long hand on 9: quarter to three!"
          ],
          [
            "Zak",
            "Only 15 minutes left. Run!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Clara",
            "3 o'clock exactly!"
          ],
          [
            "Zak",
            "5, 4, 3, 2, 1... blast off!"
          ]
        ]
      }
    ],
    "fact": "The short hand shows the hour. The long hand shows the minutes, and it goes all the way round the clock once every hour.",
    "quiz": [
      {
        "q": "The long hand is on 12 and the short hand is on 7. What time is it?",
        "options": [
          "7 o'clock",
          "12 o'clock",
          "half past 7"
        ],
        "answer": 0
      },
      {
        "q": "When the long hand points to 6, it is...",
        "options": [
          "o'clock",
          "half past",
          "quarter past"
        ],
        "answer": 1
      },
      {
        "q": "How many minutes are in one hour?",
        "options": [
          "30",
          "60",
          "100"
        ],
        "answer": 1
      }
    ],
    "tryThis": "Draw a clock on a paper plate and make two hands from card, held on with a split pin. Ask a grown-up to call out times for you to make."
  },
  {
    "slug": "full-stop-freya",
    "title": "The Runaway Sentence",
    "emoji": "✍",
    "color": "#7A4FB5",
    "subject": "English",
    "topic": "Capital letters and full stops",
    "hero": {
      "name": "Full Stop Freya",
      "power": "Stops runaway sentences in their tracks"
    },
    "panels": [
      {
        "caption": "In the Story Library, a sentence has escaped!",
        "bubbles": [
          [
            "Sentence",
            "the dog ran into the park and it jumped and it ran and it never stopped"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Freya",
            "Halt! Every sentence must start with a capital letter!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Freya",
            "And it needs a full stop to show it's finished."
          ],
          [
            "Sentence",
            "The dog ran into the park. Phew, I can rest now!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Quinn",
            "What if a sentence asks something, like 'where is the dog'?"
          ],
          [
            "Freya",
            "Then it ends with a question mark: Where is the dog?"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Zing",
            "Look out!"
          ],
          [
            "Freya",
            "Big feelings and shouting get an exclamation mark!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Freya",
            "Capital letter at the start. Full stop, question mark or exclamation mark at the end. Every sentence, every time!"
          ]
        ]
      }
    ],
    "fact": "A sentence starts with a capital letter and ends with a full stop, a question mark or an exclamation mark.",
    "quiz": [
      {
        "q": "Which one is written correctly?",
        "options": [
          "the cat sat.",
          "The cat sat.",
          "The cat sat"
        ],
        "answer": 1
      },
      {
        "q": "What goes at the end of: What is your name",
        "options": [
          "full stop .",
          "question mark ?",
          "exclamation mark !"
        ],
        "answer": 1
      },
      {
        "q": "\"Watch out\" needs which mark at the end?",
        "options": [
          "question mark",
          "exclamation mark",
          "comma"
        ],
        "answer": 1
      }
    ],
    "tryThis": "Open a favourite book. Point to the capital letter at the start of each sentence and the mark at the end. How many question marks can you find?"
  },
  {
    "slug": "wren-the-word-wizard",
    "title": "The Plain Old Story",
    "emoji": "📖",
    "color": "#2E9C8F",
    "subject": "English",
    "topic": "Adjectives",
    "hero": {
      "name": "Wren the Word Wizard",
      "power": "Makes plain words sparkle with adjectives"
    },
    "panels": [
      {
        "caption": "In the village of Blandby, every story was boring.",
        "bubbles": [
          [
            "Storyteller",
            "Once there was a dog. It lived in a house."
          ],
          [
            "Child",
            "Yawn..."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Wren",
            "Boring? Not today! I'll add some adjectives: describing words!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Wren",
            "Once there was a SCRUFFY, BROWN dog!"
          ],
          [
            "Child",
            "Ooh!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Wren",
            "It lived in a TINY, CROOKED house!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Girl",
            "Can I try? The dog found a HUGE, MUDDY bone!"
          ],
          [
            "Wren",
            "Brilliant adjectives!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Wren",
            "Adjectives tell us what something is like: its size, colour, shape or feel. Use them to make your stories sparkle!"
          ]
        ]
      }
    ],
    "fact": "Adjectives are describing words. They tell us more about a noun (a person, place or thing), like big, shiny, soft or green.",
    "quiz": [
      {
        "q": "Which word is an adjective?",
        "options": [
          "jump",
          "fluffy",
          "dog"
        ],
        "answer": 1
      },
      {
        "q": "In \"the red kite\", which word is the adjective?",
        "options": [
          "the",
          "red",
          "kite"
        ],
        "answer": 1
      },
      {
        "q": "Which sentence has the most adjectives?",
        "options": [
          "The cat slept.",
          "The fat, ginger cat slept.",
          "The cat slept on the mat."
        ],
        "answer": 1
      }
    ],
    "tryThis": "Pick something in the room, like a cushion or an apple. How many adjectives can you find to describe it? Try for five!"
  },
  {
    "slug": "doctor-fern",
    "title": "The Wilting Garden",
    "emoji": "🌱",
    "color": "#4E9A3E",
    "subject": "Science",
    "topic": "What plants need to grow",
    "hero": {
      "name": "Doctor Fern",
      "power": "Knows exactly what every plant needs"
    },
    "panels": [
      {
        "caption": "Grandad Joe's sunflowers are drooping.",
        "bubbles": [
          [
            "Amira",
            "Oh no! What's wrong with them?"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Doctor Fern",
            "Plants need light, water, air and warmth to grow."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Doctor Fern",
            "This one was stuck in a dark shed. Plants use light to make their food!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Doctor Fern",
            "The soil is as dry as dust. The roots need to drink!"
          ],
          [
            "Amira",
            "Here you go, little plant."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Doctor Fern",
            "Roots drink water. The stem carries it up. Leaves catch sunlight. The flower makes seeds."
          ]
        ]
      },
      {
        "caption": "One week later...",
        "bubbles": [
          [
            "Grandad",
            "They're taller than me!"
          ],
          [
            "Amira",
            "Thank you, Doctor Fern!"
          ]
        ]
      }
    ],
    "fact": "Plants make their own food in their leaves, using sunlight, water and air.",
    "quiz": [
      {
        "q": "Which part of a plant drinks water from the soil?",
        "options": [
          "the leaves",
          "the roots",
          "the flower"
        ],
        "answer": 1
      },
      {
        "q": "What happens to a plant kept in the dark?",
        "options": [
          "It grows faster",
          "It turns pale and droopy",
          "It turns blue"
        ],
        "answer": 1
      },
      {
        "q": "Which of these does a plant NOT need?",
        "options": [
          "light",
          "water",
          "chocolate"
        ],
        "answer": 2
      }
    ],
    "tryThis": "Grow cress on wet kitchen roll in two pots. Put one on a sunny windowsill and one in a dark cupboard. Check them every day. What happens?"
  },
  {
    "slug": "drip",
    "title": "The Great Water Journey",
    "emoji": "🌈",
    "color": "#2F8FCF",
    "subject": "Science",
    "topic": "The water cycle",
    "hero": {
      "name": "Drip",
      "power": "Travels all round the world as water"
    },
    "panels": [
      {
        "caption": "Meet Drip. Drip is a drop of water.",
        "bubbles": [
          [
            "Drip",
            "Hello! Want to come on an adventure? I travel all over the world!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Drip",
            "The sun warms me up and I turn into water vapour, a gas. Up I float!"
          ],
          [
            "Drip",
            "This is evaporation."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Drip",
            "Brr! Up here it's cold. I turn back into a tiny drop and join my friends to make a cloud."
          ],
          [
            "Drip",
            "This is condensation."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Drip",
            "So many of us! The cloud gets too heavy... Wheee!"
          ],
          [
            "Drip",
            "This is precipitation."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Drip",
            "I run down the hill into a river, and back to the sea."
          ],
          [
            "Drip",
            "This is collection."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Drip",
            "And then it all starts again! That's the water cycle."
          ],
          [
            "Drip",
            "The water you drink might once have splashed in a dinosaur's puddle!"
          ]
        ]
      }
    ],
    "fact": "The Earth keeps using the same water over and over again. It goes round and round in the water cycle.",
    "quiz": [
      {
        "q": "When the sun heats water and it rises into the air, it's called...",
        "options": [
          "evaporation",
          "collection",
          "freezing"
        ],
        "answer": 0
      },
      {
        "q": "Clouds are made of...",
        "options": [
          "cotton wool",
          "tiny drops of water",
          "smoke"
        ],
        "answer": 1
      },
      {
        "q": "Rain, snow and hail are all kinds of...",
        "options": [
          "precipitation",
          "evaporation",
          "condensation"
        ],
        "answer": 0
      }
    ],
    "tryThis": "Breathe on a cold mirror or window. The tiny drops that appear are condensation, just like a cloud forming!"
  },
  {
    "slug": "magna",
    "title": "The Lost Keys",
    "emoji": "⚡",
    "color": "#C0392B",
    "subject": "Science",
    "topic": "Magnets",
    "hero": {
      "name": "Magna",
      "power": "Can feel the pull of every magnet"
    },
    "panels": [
      {
        "caption": "Oh no! Leo's keys have fallen between the decking boards.",
        "bubbles": [
          [
            "Leo",
            "My hand won't fit through the gap!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Magna",
            "Stand back! Magnets attract things made of iron and steel."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Leo",
            "Wow! It picked up a paperclip and a nail too!"
          ],
          [
            "Magna",
            "They're made of steel, just like your keys."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Magna",
            "Plastic, wood and paper aren't magnetic."
          ],
          [
            "Magna",
            "Some metals aren't either, like this drinks can!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Magna",
            "Every magnet has a north pole and a south pole."
          ],
          [
            "Magna",
            "Opposite poles attract. The same poles push apart. That's called repel!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Leo",
            "Thanks, Magna!"
          ],
          [
            "Magna",
            "Magnets are everywhere: on fridge doors, in compasses and inside speakers!"
          ]
        ]
      }
    ],
    "fact": "A magnet pulls on things made of iron, like steel paperclips, nails and keys. This pull is called attraction.",
    "quiz": [
      {
        "q": "Which will a magnet pick up?",
        "options": [
          "a steel paperclip",
          "a wooden spoon",
          "a plastic cup"
        ],
        "answer": 0
      },
      {
        "q": "Two north poles put together will...",
        "options": [
          "attract",
          "repel",
          "melt"
        ],
        "answer": 1
      },
      {
        "q": "Is every metal magnetic?",
        "options": [
          "Yes",
          "No"
        ],
        "answer": 1
      }
    ],
    "tryThis": "With a grown-up, take a fridge magnet round the kitchen. Make two lists: things it sticks to and things it doesn't. (Keep small magnets away from babies and toddlers.)"
  },
  {
    "slug": "compass-kit",
    "title": "Treasure on Puffin Island",
    "emoji": "🌍",
    "color": "#B07A2A",
    "subject": "Geography",
    "topic": "Compass directions and maps",
    "hero": {
      "name": "Compass Kit",
      "power": "Never, ever gets lost"
    },
    "panels": [
      {
        "caption": "Kit and Ollie have found an old map of Puffin Island.",
        "bubbles": [
          [
            "Ollie",
            "There's an X! Treasure!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Kit",
            "This compass needle always points north."
          ],
          [
            "Kit",
            "Remember: Naughty Elephants Squirt Water. North, East, South, West!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Ollie",
            "The map says: start at the lighthouse and walk 5 steps north."
          ],
          [
            "Kit",
            "1, 2, 3, 4, 5!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Kit",
            "Now 3 steps east, towards the sunrise."
          ],
          [
            "Ollie",
            "The sun rises in the east!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Kit",
            "Then 2 steps south... and dig by the big rock!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Ollie",
            "We found it!"
          ],
          [
            "Kit",
            "Maps and compasses help explorers find their way anywhere."
          ]
        ]
      }
    ],
    "fact": "The four main compass points are north, east, south and west. The sun rises in the east and sets in the west.",
    "quiz": [
      {
        "q": "Which way does a compass needle point?",
        "options": [
          "north",
          "south",
          "up"
        ],
        "answer": 0
      },
      {
        "q": "The sun rises in the...",
        "options": [
          "west",
          "east",
          "north"
        ],
        "answer": 1
      },
      {
        "q": "What is opposite north?",
        "options": [
          "east",
          "south",
          "west"
        ],
        "answer": 1
      }
    ],
    "tryThis": "Draw a map of your bedroom or garden. Hide a treasure, then write directions (3 steps north, 2 steps east) for someone else to find it."
  },
  {
    "slug": "time-hopper-tess",
    "title": "The Wall at the Edge of the Empire",
    "emoji": "🏰",
    "color": "#8A5A3C",
    "subject": "History",
    "topic": "The Romans and Hadrian's Wall",
    "hero": {
      "name": "Time-Hopper Tess",
      "power": "Her watch can travel back in time"
    },
    "panels": [
      {
        "caption": "Tess has a watch that can travel through time.",
        "bubbles": [
          [
            "Tess",
            "Let's visit Britain nearly 1,900 years ago!"
          ]
        ]
      },
      {
        "caption": "The year 122.",
        "bubbles": [
          [
            "Marcus",
            "Salve! That means hello in Latin."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Marcus",
            "Emperor Hadrian ordered this wall. It goes from coast to coast, about 73 miles!"
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Tess",
            "What's it for?"
          ],
          [
            "Marcus",
            "It guards the edge of the Roman Empire. We check who comes in and out through the gates."
          ]
        ]
      },
      {
        "bubbles": [
          [
            "Marcus",
            "Soldiers live in forts along the wall. We even have baths and toilets with running water!"
          ],
          [
            "Tess",
            "Cool!"
          ]
        ]
      },
      {
        "caption": "Back in the present day...",
        "bubbles": [
          [
            "Tess",
            "You can still walk along parts of Hadrian's Wall today!"
          ],
          [
            "Tess",
            "Later, the Romans built another wall in Scotland, called the Antonine Wall."
          ]
        ]
      }
    ],
    "fact": "The Romans ruled much of Britain for nearly 400 years. They built roads, towns, baths and walls, and some of them are still there today.",
    "quiz": [
      {
        "q": "Which emperor ordered the wall?",
        "options": [
          "Hadrian",
          "Julius Caesar",
          "Nero"
        ],
        "answer": 0
      },
      {
        "q": "What language did the Romans speak?",
        "options": [
          "French",
          "Latin",
          "Spanish"
        ],
        "answer": 1
      },
      {
        "q": "Can you still see Hadrian's Wall today?",
        "options": [
          "Yes",
          "No"
        ],
        "answer": 0
      }
    ],
    "tryThis": "Build your own wall and fort from blocks, Lego or boxes. Where will the soldiers sleep, eat and keep watch?"
  }
];

export const comicBySlug = (slug: string) => COMICS.find((c) => c.slug === slug);
