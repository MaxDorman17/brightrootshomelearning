import type { LessonUnit } from "@/lib/lessons";

/** Ancient Egypt, for ages 7 to 11. */
export const ancientEgypt: LessonUnit = {
  slug: "ancient-egypt",
  title: "Ancient Egypt",
  short: "Ancient Egypt",
  subject: "History",
  ages: "7 to 11",
  emoji: "🏺",
  color: "#B8862B",
  summary: "Six lessons: the River Nile, pharaohs, pyramids, mummies, hieroglyphs, and gods and everyday life.",
  cover: "/lessons/units/ancient-egypt.jpg",
  lessons: [
    {
      slug: "ancient-egypt-1",
      title: "The gift of the Nile",
      emoji: "🌊",
      minutes: 45,
      goal: "I can find Egypt on a map and explain why the River Nile was so important to the Ancient Egyptians.",
      starter: [
        { type: "choice", q: "What is a desert?", options: ["A very dry place with little rain", "A thick forest"], answer: 0 },
        { type: "choice", q: "Which continent is Egypt in?", options: ["Africa", "Europe", "South America"], answer: 0 },
        { type: "choice", q: "What do plants need to grow?", options: ["Water and light", "Only sand"], answer: 0 },
        { type: "choice", q: "Which of these was built in Ancient Egypt?", options: ["The Eiffel Tower", "The pyramids", "Big Ben"], answer: 1 },
        { type: "pick", q: "What might you find in Egypt? There is more than one.", options: ["Desert", "Pyramids", "Penguins", "Camels"], answers: [0, 1, 3] },
        { type: "choice", q: "What is the weather usually like in Egypt?", options: ["Cold and snowy", "Hot and sunny"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "A long time ago",
            picture: "/lessons/ancient-egypt/lesson-1.jpg",
            alt: "The River Nile winding through the desert, with farmers in green fields and sailing boats on the water",
            text: [
              "Ancient Egypt began about 5,000 years ago, and lasted for around 3,000 years. That's far longer than the Romans ruled Britain.",
              "Egypt is in the north-east of Africa. Most of it is hot, dry desert.",
            ],
          },
          {
            heading: "The River Nile",
            text: [
              "The Nile is one of the longest rivers in the world. It flows north through Egypt into the Mediterranean Sea.",
              "Almost everyone in Ancient Egypt lived along its banks, because that's where the water was.",
            ],
          },
          {
            heading: "The flood",
            text: [
              "Every summer the Nile flooded. When the water went down, it left behind thick, black, rich mud called silt.",
              "Farmers grew wheat, barley, vegetables and flax in the silt. The Egyptians called their land Kemet, 'the black land', because of it.",
              "The Nile also gave them fish, drinking water, papyrus reeds for paper and boats, and a road for travel and trade. That's why Egypt is called 'the gift of the Nile'.",
            ],
          },
        ],
        words: [
          { word: "ancient", meaning: "from a very long time ago" },
          { word: "civilisation", meaning: "a large group of people with towns, rulers, laws and ways of life" },
          { word: "silt", meaning: "rich mud left behind by a flood, good for growing crops" },
          { word: "papyrus", meaning: "a tall reed that grows by the Nile, used to make paper" },
        ],
      },
      practice: {
        intro: "The Nile.",
        questions: [
          { type: "order", q: "Put the farming year in order, starting with the flood.", items: ["The Nile floods", "The water goes down and leaves silt", "Farmers plant seeds", "Crops are harvested"] },
          {
            type: "pick",
            q: "What did the Nile give the Egyptians? There is more than one.",
            options: ["Water to drink", "Fish", "Papyrus reeds", "Snow"],
            answers: [0, 1, 2],
          },
        ],
      },
      task: {
        title: "Map the Nile",
        intro: "Draw a map of Ancient Egypt.",
        need: ["Paper", "Blue, green, yellow and brown pencils", "An atlas or online map"],
        steps: [
          "With your grown-up, find Egypt and the River Nile on an atlas or online map.",
          "Draw the Nile as a long blue line from the bottom of your page to the top, splitting into lots of little rivers at the top (that's the delta).",
          "Colour a thin green strip along each side of the river for the farmland, and colour the rest yellow for the desert.",
          "Label: River Nile, Mediterranean Sea, desert, farmland, delta. Add a pyramid near the top.",
        ],
      },
      exit: [
        { type: "choice", q: "Which continent is Egypt in?", options: ["Africa", "Asia", "Europe"], answer: 0 },
        { type: "choice", q: "Why did most Egyptians live by the Nile?", options: ["That's where the water was", "It was cooler in the desert"], answer: 0 },
        { type: "choice", q: "What did the Nile flood leave behind?", options: ["Rich mud called silt", "Sand", "Gold"], answer: 0 },
        { type: "choice", q: "What was papyrus used for?", options: ["Making paper and boats", "Building pyramids"], answer: 0 },
        { type: "choice", q: "About how long ago did Ancient Egypt begin?", options: ["5,000 years ago", "500 years ago", "50 years ago"], answer: 0 },
        { type: "gap", q: "Fill in the gaps.", text: "Every summer the Nile ___. When the water went down, it left rich mud called ___.", bank: ["flooded", "froze", "silt", "sand"], answers: ["flooded", "silt"] },
      ],
      grownUp: {
        need: ["Paper and coloured pencils", "An atlas or online map"],
        tips: [
          "Satellite maps show the Nile really clearly: a thin green ribbon through yellow desert. It's worth a look together.",
          "Compare the timeline: Ancient Egypt began around 3100 BC, and the Romans came to Britain in AD 43.",
        ],
        younger: "Colour the map together, and talk about why people would want to live by the river.",
        older: "Find out how the Aswan Dam changed the Nile's floods in the 1960s.",
      },
    },
    {
      slug: "ancient-egypt-2",
      title: "Pharaohs",
      emoji: "👑",
      minutes: 45,
      goal: "I can explain who the pharaohs were and describe a famous pharaoh.",
      starter: [
        { type: "choice", q: "What did the Nile flood leave behind?", options: ["Silt", "Ice"], answer: 0 },
        { type: "choice", q: "What is papyrus?", options: ["A reed used to make paper", "A kind of fish"], answer: 0 },
        { type: "choice", q: "Who rules a kingdom?", options: ["A king or queen", "A farmer"], answer: 0 },
        { type: "choice", q: "Which way does the Nile flow through Egypt?", options: ["South", "North"], answer: 1 },
        { type: "type", q: "What did the Egyptians call their land, meaning 'the black land'?", answer: ["Kemet"] },
        { type: "pick", q: "What did farmers grow in the silt? There is more than one.", options: ["Wheat", "Barley", "Bananas", "Flax"], answers: [0, 1, 3] },
      ],
      learn: {
        cards: [
          {
            heading: "The pharaoh",
            picture: "/lessons/ancient-egypt/lesson-2.jpg",
            alt: "A young pharaoh on a golden throne holding a crook and flail, with servants and a scribe",
            text: [
              "The ruler of Ancient Egypt was called the pharaoh. The pharaoh made the laws, led the army and owned all the land.",
              "Egyptians believed the pharaoh was part god, and spoke to the gods for everyone.",
              "Pharaohs wore a crown, held a crook and flail as symbols of power, and often wore a false beard, even the women!",
            ],
          },
          {
            heading: "Famous pharaohs",
            text: [
              "Hatshepsut was one of the few women pharaohs. She ruled for about 20 years and sent traders on expeditions to faraway lands.",
              "Ramesses II, or Ramesses the Great, ruled for 66 years and built huge temples like Abu Simbel.",
              "Cleopatra VII was the last pharaoh of Ancient Egypt. After her, Egypt became part of the Roman Empire.",
            ],
          },
          {
            heading: "Tutankhamun",
            text: [
              "Tutankhamun became pharaoh when he was only about nine years old, and died at about 19.",
              "He wasn't very important while he lived, but he's famous now because his tomb was found almost untouched in 1922 by Howard Carter. It was full of treasure, including a solid gold mask.",
            ],
          },
        ],
        words: [
          { word: "pharaoh", meaning: "a king or queen of Ancient Egypt" },
          { word: "tomb", meaning: "a room or building where a dead person is buried" },
          { word: "archaeologist", meaning: "someone who digs up and studies things from the past" },
          { word: "dynasty", meaning: "a family of rulers, one after another" },
        ],
      },
      practice: {
        intro: "Famous pharaohs.",
        questions: [
          {
            type: "match",
            q: "Match each pharaoh to a fact.",
            pairs: [["Tutankhamun", "Became pharaoh at about nine"], ["Hatshepsut", "One of the few women pharaohs"], ["Ramesses II", "Ruled for 66 years"], ["Cleopatra VII", "The last pharaoh"]],
          },
          { type: "type", q: "In what year did Howard Carter find Tutankhamun's tomb?", answer: "1922" },
        ],
      },
      task: {
        title: "Pharaoh fact file",
        intro: "Make a fact file about one pharaoh.",
        need: ["Paper and pens", "Gold or yellow pencil", "Books or a website about your pharaoh"],
        steps: [
          "Pick a pharaoh from today's lesson.",
          "Draw them in the middle of your page, with their crown, crook and flail.",
          "Around the picture, write: their name, when they ruled, what they're famous for, and one surprising fact.",
          "If you were pharaoh for a day, what would you build or change? Write one sentence at the bottom.",
        ],
      },
      exit: [
        { type: "choice", q: "What was the ruler of Ancient Egypt called?", options: ["The pharaoh", "The emperor", "The chief"], answer: 0 },
        { type: "choice", q: "Egyptians believed the pharaoh was...", options: ["part god", "just an ordinary person"], answer: 0 },
        { type: "choice", q: "Why is Tutankhamun so famous today?", options: ["His tomb was found full of treasure", "He ruled for 66 years"], answer: 0 },
        { type: "choice", q: "Who was the last pharaoh?", options: ["Cleopatra VII", "Tutankhamun", "Ramesses II"], answer: 0 },
        { type: "choice", q: "What is an archaeologist?", options: ["Someone who digs up and studies the past", "A kind of pharaoh"], answer: 0 },
        { type: "type", q: "Who found Tutankhamun's tomb in 1922?", answer: ["Howard Carter", "Carter"] },
      ],
      grownUp: {
        need: ["Paper and pens", "A book or website about one pharaoh"],
        tips: [
          "The British Museum's website has great pictures of Egyptian objects. Many museums have Egyptian galleries if you can visit one.",
          "Hatshepsut is a good example of a woman in power in history. Ask your child why she might have worn a false beard.",
        ],
        younger: "Make a paper pharaoh crown and pretend to be pharaoh for the afternoon.",
        older: "Find out about the curse of Tutankhamun and decide whether you think it's true. Give reasons.",
      },
    },
    {
      slug: "ancient-egypt-3",
      title: "Pyramids",
      emoji: "🔺",
      minutes: 45,
      goal: "I can explain why the pyramids were built and how people think they were made.",
      starter: [
        { type: "choice", q: "Who was the pharaoh?", options: ["The ruler of Egypt", "A farmer"], answer: 0 },
        { type: "choice", q: "What is a tomb?", options: ["A place where someone is buried", "A kind of boat"], answer: 0 },
        { type: "choice", q: "How many sides does a triangle have?", options: ["Three", "Four"], answer: 0 },
        { type: "type", q: "About how old was Tutankhamun when he became pharaoh?", answer: ["9", "nine"], after: "years old" },
        { type: "choice", q: "What did pharaohs hold as symbols of power?", options: ["A sword and shield", "A crook and flail", "A pen and paper"], answer: 1 },
        { type: "choice", q: "Which pharaoh ruled for 66 years?", options: ["Tutankhamun", "Cleopatra VII", "Ramesses II"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Tombs for pharaohs",
            picture: "/lessons/ancient-egypt/lesson-3.jpg",
            alt: "Workers dragging a huge stone block on a sledge towards a half-built pyramid, one pouring water on the sand",
            text: [
              "The pyramids were huge tombs for pharaohs. Egyptians believed the pharaoh would need a safe resting place for their journey to the afterlife.",
              "Their shape may have stood for the rays of the sun, or a staircase to the sky.",
            ],
          },
          {
            heading: "The Great Pyramid",
            text: [
              "The biggest is the Great Pyramid of Giza, built for the pharaoh Khufu about 4,500 years ago.",
              "It was made of over two million stone blocks, some heavier than a car, and for nearly 4,000 years it was the tallest building in the world.",
              "Nearby is the Great Sphinx, a giant statue with a lion's body and a human head.",
            ],
          },
          {
            heading: "Who built them, and how?",
            text: [
              "The pyramids weren't built by slaves, as people once thought. They were built by thousands of paid workers who lived in a village nearby.",
              "Blocks were cut with copper tools, floated down the Nile on boats, then dragged up ramps on sledges. Workers poured water on the sand in front of the sledges to make them slide more easily.",
            ],
          },
        ],
        words: [
          { word: "pyramid", meaning: "a building with a square base and four triangular sides that meet at a point" },
          { word: "afterlife", meaning: "life after death, which the Egyptians believed in" },
          { word: "sphinx", meaning: "a statue with a lion's body and a human head" },
          { word: "ramp", meaning: "a slope used to move heavy things up" },
        ],
      },
      practice: {
        intro: "Pyramid facts.",
        questions: [
          { type: "order", q: "Put the building of a pyramid in order.", items: ["Cut stone blocks in a quarry", "Float them down the Nile", "Drag them on sledges", "Pull them up ramps into place"] },
          { type: "choice", q: "What shape is the base of a pyramid?", options: ["Square", "Circle", "Triangle"], answer: 0 },
        ],
      },
      task: {
        title: "Build a pyramid",
        intro: "Make a pyramid and test the sledge trick.",
        need: ["Card or a cereal box", "Ruler, pencil, scissors and tape", "A small heavy book, a tray of sand or soil (optional), and a cup of water"],
        steps: [
          "Draw a square about 10 cm wide on card, then a triangle on each side of it with all edges 10 cm. Cut it out as one piece.",
          "Fold up the triangles and tape them together to make your pyramid.",
          "Sledge test: put a book on a piece of card and drag it across dry sand, or a rough surface. Then wet the surface and try again. Which is easier?",
          "Write one sentence explaining why the Egyptian workers poured water in front of their sledges.",
        ],
      },
      exit: [
        { type: "choice", q: "What were the pyramids?", options: ["Tombs for pharaohs", "Houses for farmers", "Temples for fish"], answer: 0 },
        { type: "choice", q: "Which pharaoh was the Great Pyramid built for?", options: ["Khufu", "Cleopatra", "Tutankhamun"], answer: 0 },
        { type: "choice", q: "Who built the pyramids?", options: ["Thousands of paid workers", "Robots", "The Romans"], answer: 0 },
        { type: "choice", q: "What is the Sphinx?", options: ["A statue with a lion's body and human head", "A pyramid"], answer: 0 },
        { type: "choice", q: "Why did workers pour water on the sand?", options: ["To help the sledges slide", "To cool their feet"], answer: 0 },
        { type: "pick", q: "How were the stone blocks moved? There is more than one.", options: ["Floated down the Nile on boats", "Dragged on sledges", "Carried by elephants", "Pulled up ramps"], answers: [0, 1, 3] },
      ],
      grownUp: {
        need: ["Card, ruler, scissors, tape", "A book and a tray of sand or soil (optional)"],
        tips: [
          "Help measure the net so the triangles meet neatly. Equilateral triangles make a steep pyramid, which is fine.",
          "The water-on-sand trick is backed by a 2014 study, and there's a wall painting showing a worker pouring water in front of a statue on a sledge.",
        ],
        younger: "Build a pyramid out of building blocks or sugar cubes.",
        older: "The Great Pyramid was about 146 m tall. Find a building near you and compare its height.",
      },
    },
    {
      slug: "ancient-egypt-4",
      title: "Mummies and the afterlife",
      emoji: "⚱️",
      minutes: 45,
      goal: "I can explain why and how the Egyptians made mummies.",
      starter: [
        { type: "choice", q: "What is the afterlife?", options: ["Life after death", "The afternoon"], answer: 0 },
        { type: "choice", q: "Who were the pyramids built for?", options: ["Pharaohs", "Cats"], answer: 0 },
        { type: "choice", q: "What does salt do to food?", options: ["Helps it keep for longer", "Makes it go mouldy"], answer: 0 },
        { type: "type", q: "Which pharaoh was the Great Pyramid built for?", answer: ["Khufu"] },
        { type: "choice", q: "What tools did workers use to cut the stone blocks?", options: ["Plastic tools", "Copper tools", "Steel saws"], answer: 1 },
        { type: "gap", q: "Fill in the gaps.", text: "The Great ___ has a lion's body and a human ___.", bank: ["Sphinx", "Pyramid", "head", "tail"], answers: ["Sphinx", "head"] },
      ],
      learn: {
        cards: [
          {
            heading: "Why make a mummy?",
            picture: "/lessons/ancient-egypt/lesson-4.jpg",
            alt: "A tomb with a golden sarcophagus, canopic jars and a statue of Anubis",
            text: [
              "Egyptians believed that after death you went on a journey to the afterlife, and you'd need your body there.",
              "So they preserved bodies to stop them rotting. A preserved body is called a mummy.",
            ],
          },
          {
            heading: "How it was done",
            text: [
              "Embalmers took out the organs, like the liver and lungs, and put them in special containers called canopic jars. The heart was left in.",
              "The body was covered in a salt called natron for 40 days to dry it out.",
              "Then it was wrapped in hundreds of metres of linen bandages, with lucky charms called amulets tucked inside, and placed in a coffin called a sarcophagus.",
            ],
          },
          {
            heading: "Weighing of the heart",
            text: [
              "Egyptians believed that in the afterlife, the god Anubis weighed your heart against a feather.",
              "If you'd lived a good life your heart was light, and you could go on to paradise, the Field of Reeds.",
              "Tombs were filled with things for the afterlife: food, furniture, games and little model servants called shabtis.",
            ],
          },
        ],
        words: [
          { word: "mummy", meaning: "a body that has been preserved, dried and wrapped" },
          { word: "preserve", meaning: "to stop something rotting or decaying" },
          { word: "canopic jar", meaning: "a jar that held a mummy's organs" },
          { word: "sarcophagus", meaning: "a stone coffin" },
          { word: "amulet", meaning: "a lucky charm" },
        ],
      },
      practice: {
        intro: "Making a mummy.",
        questions: [
          { type: "order", q: "Put mummy-making in order.", items: ["Take out the organs", "Cover the body in natron salt", "Wrap it in linen bandages", "Place it in a sarcophagus"] },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "The organs went into ___ jars. The body was dried with ___ for 40 days.",
            bank: ["canopic", "natron", "sugar", "glass"],
            answers: ["canopic", "natron"],
          },
        ],
      },
      task: {
        title: "Mummify an apple",
        intro: "Do the Egyptians' drying trick on an apple slice.",
        need: ["An apple", "Salt and bicarbonate of soda (or just salt)", "Two small pots or cups", "A knife (for your grown-up)"],
        steps: [
          "Ask your grown-up to cut two equal slices of apple.",
          "Put one slice in an empty pot. Put the other in a pot and cover it completely with salt (mixed with bicarbonate of soda if you have it). This is your natron.",
          "Leave both somewhere dry for a week.",
          "After a week, take them out and compare. Which one rotted? Which one dried out? Draw and write what you find.",
        ],
      },
      exit: [
        { type: "choice", q: "Why did Egyptians make mummies?", options: ["They believed the body was needed in the afterlife", "To scare people"], answer: 0 },
        { type: "choice", q: "What were canopic jars for?", options: ["Holding the organs", "Holding water"], answer: 0 },
        { type: "choice", q: "What was natron used for?", options: ["Drying out the body", "Painting tombs"], answer: 0 },
        { type: "choice", q: "Which organ was left in the body?", options: ["The heart", "The brain", "The lungs"], answer: 0 },
        { type: "choice", q: "In the afterlife, the heart was weighed against...", options: ["a feather", "a stone", "gold"], answer: 0 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Canopic jar", "Held the organs"], ["Natron", "Salt that dried the body"], ["Amulet", "A lucky charm"], ["Shabti", "A little model servant"]] },
      ],
      grownUp: {
        need: ["An apple, salt, two pots", "Bicarbonate of soda (optional)"],
        tips: [
          "Some children find death and bodies upsetting. Keep the tone factual, and focus on what the Egyptians believed and why.",
          "The apple experiment needs a week. Set a reminder to look at it together next week.",
        ],
        younger: "Wrap a doll or teddy in toilet roll 'bandages' and make a box sarcophagus.",
        older: "Design and label your own sarcophagus, with hieroglyphs of your name and things you'd want in your tomb.",
      },
    },
    {
      slug: "ancient-egypt-5",
      title: "Hieroglyphs",
      emoji: "📜",
      minutes: 45,
      goal: "I can explain what hieroglyphs are and how the Rosetta Stone helped people read them.",
      starter: [
        { type: "choice", q: "What is papyrus?", options: ["A reed used to make paper", "A kind of salt"], answer: 0 },
        { type: "choice", q: "What were canopic jars for?", options: ["Holding organs", "Holding paint"], answer: 0 },
        { type: "choice", q: "What is an alphabet?", options: ["The set of letters used to write a language", "A kind of book"], answer: 0 },
        { type: "type", q: "What is a preserved body called?", answer: ["mummy", "a mummy"] },
        { type: "choice", q: "What is a sarcophagus?", options: ["A lucky charm", "A stone coffin", "A kind of salt"], answer: 1 },
        { type: "pick", q: "What did Egyptians put in tombs for the afterlife? There is more than one.", options: ["Food", "Games", "Shabtis", "Bicycles"], answers: [0, 1, 2] },
      ],
      learn: {
        cards: [
          {
            heading: "Picture writing",
            picture: "/lessons/ancient-egypt/lesson-5.jpg",
            alt: "A scribe writing hieroglyphs on papyrus beside a stone carved with three kinds of writing",
            text: [
              "The Ancient Egyptians wrote using hieroglyphs: more than 700 little pictures and symbols.",
              "Some hieroglyphs stood for sounds, like our letters. Others stood for whole words or ideas.",
              "They could be written left to right, right to left, or top to bottom. You read towards the faces of the people and animals!",
            ],
          },
          {
            heading: "Scribes",
            text: [
              "Only a few people could read and write. They were called scribes, and it took years of school to learn.",
              "Scribes wrote on papyrus with reed pens and ink, and carved hieroglyphs on temple and tomb walls.",
              "A pharaoh's name was written inside an oval shape called a cartouche, to protect it.",
            ],
          },
          {
            heading: "The Rosetta Stone",
            text: [
              "After Ancient Egypt ended, people forgot how to read hieroglyphs for over 1,400 years.",
              "In 1799, a stone was found at Rosetta in Egypt. It had the same message written three ways: in hieroglyphs, in another Egyptian script, and in Ancient Greek.",
              "People could still read Greek, so they used it to work out the hieroglyphs. A Frenchman called Jean-François Champollion cracked the code in 1822. The Rosetta Stone is now in the British Museum.",
            ],
          },
        ],
        words: [
          { word: "hieroglyphs", meaning: "the picture writing of Ancient Egypt" },
          { word: "scribe", meaning: "a person whose job was to read and write" },
          { word: "cartouche", meaning: "an oval with a pharaoh's name written inside" },
          { word: "decode", meaning: "to work out what a secret code means" },
        ],
      },
      practice: {
        intro: "Writing and the Rosetta Stone.",
        questions: [
          {
            type: "pick",
            q: "Which scripts are on the Rosetta Stone? There is more than one.",
            options: ["Hieroglyphs", "Ancient Greek", "English", "Another Egyptian script"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "Why was Ancient Greek on the stone so useful?", options: ["People could still read it", "It was the prettiest"], answer: 0 },
        ],
      },
      task: {
        title: "Write your name in a cartouche",
        intro: "Make a cartouche with your name in hieroglyphs.",
        need: ["Paper or card", "Pens or pencils", "A hieroglyph alphabet (search 'hieroglyph alphabet for kids')"],
        steps: [
          "With your grown-up, find a hieroglyph alphabet chart online or in a book.",
          "Draw a big oval on your card, with a line across the bottom. This is your cartouche.",
          "Write your name inside, one hieroglyph for each sound.",
          "Write a secret message in hieroglyphs for someone in your family to decode.",
        ],
      },
      exit: [
        { type: "choice", q: "What are hieroglyphs?", options: ["Ancient Egyptian picture writing", "A kind of pyramid"], answer: 0 },
        { type: "choice", q: "What was a scribe?", options: ["A person who could read and write", "A pharaoh's pet"], answer: 0 },
        { type: "choice", q: "What is a cartouche?", options: ["An oval with a pharaoh's name inside", "A coffin"], answer: 0 },
        { type: "choice", q: "What helped people read hieroglyphs again?", options: ["The Rosetta Stone", "The Great Pyramid", "The Sphinx"], answer: 0 },
        { type: "choice", q: "Who cracked the code in 1822?", options: ["Jean-François Champollion", "Howard Carter", "Ramesses II"], answer: 0 },
        { type: "gap", q: "Fill in the gaps.", text: "The Rosetta Stone was found in ___. It had the same message in hieroglyphs, another Egyptian script and Ancient ___.", bank: ["1799", "1922", "Greek", "English"], answers: ["1799", "Greek"] },
      ],
      grownUp: {
        need: ["Paper or card, pens", "A hieroglyph alphabet chart (easy to find online)"],
        tips: [
          "Kids' hieroglyph alphabets are simplified, since the Egyptians didn't write vowels in the same way we do. That's fine for this activity.",
          "You can see a picture of the Rosetta Stone on the British Museum website.",
        ],
        younger: "Make up your own picture symbols for five words, and write a simple picture message.",
        older: "Write a short message in English, Greek letters and hieroglyphs, like your own Rosetta Stone.",
      },
    },
    {
      slug: "ancient-egypt-6",
      title: "Gods and everyday life",
      emoji: "🐈",
      minutes: 45,
      goal: "I can describe some Egyptian gods and what everyday life was like.",
      starter: [
        { type: "choice", q: "What is a cartouche?", options: ["An oval with a pharaoh's name", "A boat"], answer: 0 },
        { type: "choice", q: "Who weighed hearts in the afterlife?", options: ["Anubis", "Cleopatra"], answer: 0 },
        { type: "choice", q: "What did farmers grow in the silt?", options: ["Wheat and barley", "Bananas"], answer: 0 },
        { type: "choice", q: "Where is the Rosetta Stone now?", options: ["Inside a pyramid", "In the British Museum", "At the bottom of the Nile"], answer: 1 },
        { type: "type", q: "What were the people who could read and write called?", answer: ["scribes", "scribe", "a scribe"] },
        { type: "choice", q: "About how many hieroglyphs were there?", options: ["About 26", "More than 700", "Exactly 10"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Many gods",
            picture: "/lessons/ancient-egypt/lesson-6.jpg",
            alt: "An Egyptian family on their roof at sunset, the children playing Senet with a cat beside them",
            text: [
              "The Egyptians believed in hundreds of gods and goddesses, who looked after different parts of life. Many had animal heads.",
              "Ra was the sun god, who sailed across the sky in a boat each day. Anubis, with a jackal's head, looked after the dead. Isis was a mother goddess. Horus, with a falcon's head, protected the pharaoh.",
              "Bastet was a cat goddess. Cats were loved and protected, and some were even mummified.",
            ],
          },
          {
            heading: "Everyday life",
            text: [
              "Most people were farmers. Others were craftspeople, builders, fishermen, scribes or priests.",
              "Houses were made of mud bricks, with flat roofs where families slept on hot nights.",
              "People ate bread, onions, beans, fish and fruit, and drank beer made from barley, even the children, as it was safer than water.",
            ],
          },
          {
            heading: "Fun and games",
            text: [
              "Children played with balls, spinning tops and wooden toys, and swam in the Nile.",
              "A popular board game was Senet, played on a board of 30 squares. It's one of the oldest board games in the world.",
              "Both men and women wore make-up, especially black eyeliner called kohl, which also protected their eyes from the sun.",
            ],
          },
        ],
        words: [
          { word: "god or goddess", meaning: "a being people worship, believed to have special powers" },
          { word: "priest", meaning: "a person who looks after a temple and leads worship" },
          { word: "mud brick", meaning: "a brick made from mud and straw dried in the sun" },
          { word: "Senet", meaning: "an Ancient Egyptian board game" },
        ],
      },
      practice: {
        intro: "Gods and goddesses.",
        questions: [
          {
            type: "match",
            q: "Match each god to what they looked after.",
            pairs: [["Ra", "The sun"], ["Anubis", "The dead"], ["Bastet", "Cats and the home"], ["Horus", "Protecting the pharaoh"]],
          },
        ],
      },
      task: {
        title: "Play Senet",
        intro: "Make and play an Ancient Egyptian board game.",
        need: ["Paper or card", "Ruler and pen", "5 counters each in two colours (coins, buttons or pasta)", "4 lolly sticks coloured on one side, or a dice"],
        steps: [
          "Draw a grid of 3 rows of 10 squares. The path snakes: left to right on the top row, right to left in the middle, left to right on the bottom.",
          "Put the counters on the first 10 squares, alternating colours.",
          "Take turns throwing the sticks: count the coloured sides facing up and move that many squares (all four plain sides up means 5). Or roll a dice.",
          "You can't land on your own counter. Land on your opponent's and you swap places. The first to get all their counters off the end wins!",
        ],
      },
      exit: [
        { type: "choice", q: "Who was Ra?", options: ["The sun god", "A pharaoh", "A scribe"], answer: 0 },
        { type: "choice", q: "Which animal was sacred to Bastet?", options: ["Cats", "Dogs", "Fish"], answer: 0 },
        { type: "choice", q: "What were most Egyptian houses made of?", options: ["Mud bricks", "Stone blocks", "Wood"], answer: 0 },
        { type: "choice", q: "What was most people's job?", options: ["Farmer", "Pharaoh", "Scribe"], answer: 0 },
        { type: "choice", q: "What was Senet?", options: ["A board game", "A god", "A kind of bread"], answer: 0 },
        { type: "pick", q: "What did Egyptian children play with? There is more than one.", options: ["Balls", "Spinning tops", "Video games", "Wooden toys"], answers: [0, 1, 3] },
      ],
      grownUp: {
        need: ["Card, ruler, pen", "10 counters in two colours", "4 lolly sticks or a dice"],
        tips: [
          "Nobody knows Senet's exact rules, so these are a modern version. Feel free to make up your own.",
          "To round off the unit, ask your child: would you rather have lived in Ancient Egypt or Roman Britain? Why?",
        ],
        younger: "Draw your favourite animal-headed god and give them a name and a power.",
        older: "Write a diary entry for a day in the life of an Egyptian child, a farmer's son or a scribe's daughter.",
      },
    },
  ],
};
