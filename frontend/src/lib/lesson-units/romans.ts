import type { LessonUnit } from "@/lib/lessons";

/** All about the Romans, for ages 7 to 11. Goes with the Romans topic pack, and uses its pictures. */
export const romansLessons: LessonUnit = {
  slug: "romans",
  title: "All about the Romans",
  short: "Romans",
  subject: "History",
  ages: "7 to 9",
  emoji: "🏛️",
  color: "#B5523B",
  summary: "Six lessons: who the Romans were, the invasion, the army, Boudica, the walls and Roman life.",
  topicPack: "romans",
  lessons: [
    {
      slug: "romans-1",
      title: "Who were the Romans?",
      emoji: "🗺️",
      minutes: 45,
      goal: "I can say where the Romans came from, what an empire is, and put Roman dates in order.",
      starter: [
        { type: "choice", q: "Which country is Rome in?", options: ["France", "Italy", "Egypt"], answer: 1 },
        { type: "choice", q: "History is about...", options: ["the past", "the future", "outer space"], answer: 0 },
        { type: "choice", q: "Which is bigger, a town or a country?", options: ["A town", "A country"], answer: 1 },
        { type: "pick", q: "Which of these do you think the Romans had? There is more than one.", options: ["Roads", "Soldiers", "Mobile phones", "Coins"], answers: [0, 1, 3] },
        { type: "choice", q: "Who was born longest ago?", options: ["You", "Your grown-up", "Your grandparent"], answer: 2 },
        { type: "choice", q: "Is Britain an island, with sea all around it?", options: ["Yes", "No"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "A small town in Italy",
            picture: "/topics/romans/lesson-1.jpg",
            alt: "A Roman family looking at a map of Italy and the Roman Empire",
            text: [
              "Nearly 3,000 years ago, Rome was a small town in Italy.",
              "The Romans told a legend that it was started in 753 BC by twin brothers called Romulus and Remus, who were looked after by a wolf when they were babies.",
            ],
          },
          {
            heading: "The town that grew into an empire",
            text: [
              "Rome's army conquered the lands around it, one after another.",
              "In the end the Roman Empire stretched all the way from Britain to Egypt and the Middle East. Tens of millions of people lived in it.",
              "An empire is lots of lands and peoples ruled by one ruler or country. The ruler of the Roman Empire was called the emperor.",
            ],
          },
          {
            heading: "BC and AD",
            text: [
              "We count years from when Jesus was thought to have been born.",
              "BC years count down towards that year. AD years count up from it.",
              "So 55 BC is a long time before AD 43, and 753 BC is even longer ago.",
            ],
          },
          {
            heading: "Romans in Britain",
            text: [
              "The Romans first came to Britain in 55 BC. They took over in AD 43, and stayed for nearly 400 years, until about AD 410.",
              "400 years is about 16 grandparents' lifetimes back to back. That's a long time!",
            ],
          },
        ],
        words: [
          { word: "empire", meaning: "lots of lands and peoples ruled by one ruler or country" },
          { word: "emperor", meaning: "the ruler of the Roman Empire" },
          { word: "BC and AD", meaning: "BC years count down to the year 1, and AD years count up from it" },
        ],
      },
      practice: {
        intro: "Check you've got it before the hands-on part.",
        questions: [
          { type: "choice", q: "What is an empire?", options: ["One big city", "Lots of lands ruled by one ruler or country", "A kind of army"], answer: 1 },
          { type: "choice", q: "Which was longer ago?", options: ["55 BC", "AD 43"], answer: 0, why: "BC years are before AD years." },
          { type: "order", q: "Put these in order. Tap the oldest first.", items: ["753 BC", "55 BC", "AD 43", "AD 410"] },
        ],
      },
      task: {
        title: "Make a washing-line timeline",
        intro: "Make a timeline you can hang up and look at for the whole topic.",
        need: ["String and pegs, or a long strip of paper", "Six cards or bits of paper", "Pens"],
        steps: [
          "Write one date and what happened on each card: 753 BC Rome begins, 55 BC Julius Caesar comes, AD 43 the Romans invade, AD 60 Boudica fights back, AD 122 Hadrian's Wall, AD 410 the Romans leave.",
          "Peg them up in order, oldest first.",
          "Add a card at the end for the year you were born. How far away is it from the Romans?",
        ],
      },
      exit: [
        { type: "choice", q: "Where did the Romans come from?", options: ["Rome, in Italy", "London, in England", "Athens, in Greece"], answer: 0 },
        { type: "choice", q: "What was the ruler of the Roman Empire called?", options: ["The king", "The emperor", "The captain"], answer: 1 },
        { type: "type", q: "In which year AD did the Romans invade Britain? AD...", answer: "43" },
        { type: "choice", q: "Which year is the oldest?", options: ["AD 122", "55 BC", "AD 43"], answer: 1 },
        { type: "choice", q: "About how long did the Romans stay in Britain?", options: ["40 years", "400 years", "4,000 years"], answer: 1 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "An ___ is lots of lands and peoples ruled by one ruler. The Roman ruler was called the ___.",
          bank: ["empire", "emperor", "town", "king"],
          answers: ["empire", "emperor"],
        },
      ],
      grownUp: {
        need: ["A map of Europe or a globe", "String and pegs, or a long strip of paper", "Cards and pens"],
        tips: [
          "Find Rome, then Britain, on a map before you start. Tracing the journey a soldier would make helps the empire feel real.",
          "BC and AD is the tricky part. Counting down to a rocket launch and then up again afterwards is a good way to explain it.",
        ],
        younger: "Use four cards with a picture on each: Rome begins, the Romans arrive, the wall is built, the Romans leave.",
        older: "Make the timeline to scale: 10 centimetres for every 100 years. Where are the biggest gaps?",
      },
    },
    {
      slug: "romans-2",
      title: "The Romans come to Britain",
      emoji: "⛵",
      minutes: 45,
      goal: "I can describe Britain before the Romans and give two reasons the Romans invaded.",
      starter: [
        { type: "choice", q: "Where did the Romans come from?", options: ["Rome, in Italy", "Spain", "Scotland"], answer: 0 },
        { type: "choice", q: "What is an empire?", options: ["A type of boat", "Lots of lands ruled by one ruler or country", "A Roman food"], answer: 1 },
        { type: "choice", q: "Which was longer ago?", options: ["55 BC", "AD 43"], answer: 0 },
        { type: "choice", q: "What was the ruler of the Roman Empire called?", options: ["The captain", "The king", "The emperor"], answer: 2 },
        { type: "order", q: "Put these in order. Tap the oldest first.", items: ["753 BC", "55 BC", "AD 43"] },
        { type: "type", q: "Which city did the Romans come from?", answer: ["Rome"] },
      ],
      learn: {
        cards: [
          {
            heading: "Britain before the Romans",
            picture: "/topics/romans/lesson-2.jpg",
            alt: "Roman soldiers wading ashore from their ships below white cliffs, with a roundhouse on the hill above",
            text: [
              "Before the Romans came, Britain was in the Iron Age. People lived in tribes, each with its own leader.",
              "They farmed, kept animals, made iron tools and beautiful jewellery, and lived in round houses with thatched roofs. We often call them Celts or Britons.",
            ],
          },
          {
            heading: "Julius Caesar visits",
            text: [
              "In 55 BC a Roman general called Julius Caesar sailed across the sea to Britain. He fought some of the tribes, then went home.",
              "He came back the next year, in 54 BC, and went home again.",
            ],
          },
          {
            heading: "The invasion of AD 43",
            text: [
              "Almost 100 years later, in AD 43, Emperor Claudius sent about 40,000 soldiers.",
              "They landed in Kent and fought their way across the south. They captured Camulodunum, which we now call Colchester. It became the first capital of the new Roman province of Britannia.",
            ],
          },
          {
            heading: "Why did they want Britain?",
            text: [
              "Britain had metals like tin, lead, silver and gold, and good farmland for growing grain.",
              "And conquering a new land made an emperor look strong and powerful back in Rome.",
              "Some tribes fought the Romans. Others made deals with them and became their friends.",
            ],
          },
        ],
        words: [
          { word: "invade", meaning: "to go into another country with an army to take it over" },
          { word: "tribe", meaning: "a group of families with the same leader, like the Iceni" },
          { word: "province", meaning: "a part of the empire, like Britannia" },
          { word: "roundhouse", meaning: "a round home with a thatched roof, built by Iron Age Britons" },
        ],
      },
      practice: {
        intro: "Sort out what you know.",
        questions: [
          {
            type: "pick",
            q: "Which of these were reasons the Romans wanted Britain? There is more than one.",
            options: ["Metals like tin and silver", "Good farmland", "To make the emperor look powerful", "To go on holiday"],
            answers: [0, 1, 2],
          },
          {
            type: "match",
            q: "Match each one to what it is.",
            pairs: [["Claudius", "The emperor who invaded"], ["Julius Caesar", "Came twice but went home"], ["Camulodunum", "Colchester"]],
          },
        ],
      },
      task: {
        title: "Britons and Romans chart, and a roundhouse",
        intro: "Start a chart you'll add to in later lessons, then build an Iron Age home.",
        need: ["Paper folded into two columns", "A paper cup or card tube, card and glue", "Straw, wool or brown tissue paper"],
        steps: [
          "Write 'Britons' at the top of one column and 'Romans' at the top of the other.",
          "Fill in what you know so far about their homes, clothes and weapons. Keep the chart in your topic book.",
          "Make a roundhouse: the cup or tube is the walls, and a cone of card is the roof. Cover the roof with straw, wool or scrunched tissue paper for thatch.",
        ],
      },
      exit: [
        { type: "choice", q: "What were Britain's people living in before the Romans came?", options: ["Tower blocks", "Roundhouses with thatched roofs", "Castles"], answer: 1 },
        { type: "choice", q: "Which emperor invaded Britain in AD 43?", options: ["Hadrian", "Claudius", "Julius Caesar"], answer: 1 },
        { type: "choice", q: "What happened when Julius Caesar came to Britain?", options: ["He stayed and ruled", "He fought some tribes, then went home", "He built a wall"], answer: 1 },
        { type: "choice", q: "What did the Romans call Britain?", options: ["Britannia", "Caledonia", "Londinium"], answer: 0 },
        {
          type: "pick",
          q: "Tap two reasons the Romans invaded.",
          options: ["Metals and farmland", "To see the seaside", "To make the emperor look powerful"],
          answers: [0, 2],
        },
        { type: "type", q: "What do we call Camulodunum today?", answer: ["Colchester"] },
      ],
      grownUp: {
        need: ["Paper folded into two columns", "A paper cup or card tube, card, glue", "Straw, wool or brown tissue paper"],
        tips: [
          "Britons weren't 'wild' before the Romans. They farmed, traded with Europe and made their own coins. It's worth saying, as many books make them sound primitive.",
          "Ask: if you were a tribe's leader, would you fight the Romans or make friends? There's no wrong answer, as long as there's a reason.",
        ],
        younger: "Just make the roundhouse, and talk about where you would cook and sleep in it.",
        older: "Most of what we know about the invasion was written by Romans. Why might that be a problem? What might a Briton have said instead?",
      },
    },
    {
      slug: "romans-3",
      title: "The Roman army",
      emoji: "🛡️",
      minutes: 45,
      goal: "I can explain how the Roman army was organised and why it was so hard to beat.",
      starter: [
        { type: "choice", q: "In which year did Claudius invade Britain?", options: ["AD 43", "AD 410", "55 BC"], answer: 0 },
        { type: "choice", q: "About how many soldiers did Claudius send?", options: ["400", "4,000", "40,000"], answer: 2 },
        { type: "choice", q: "What is a tribe?", options: ["A group of families with the same leader", "A Roman soldier", "A kind of boat"], answer: 0 },
        { type: "type", q: "Which emperor invaded Britain in AD 43?", answer: ["Claudius"] },
        {
          type: "pick",
          q: "Why did the Romans want Britain? There is more than one.",
          options: ["Metals like tin and silver", "Good farmland", "The sunny weather"],
          answers: [0, 1],
        },
        { type: "choice", q: "What did Iron Age Britons live in?", options: ["Villas", "Roundhouses", "Tents"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Full-time soldiers",
            picture: "/topics/romans/lesson-3.jpg",
            alt: "Roman legionaries marching along a straight road, led by a centurion",
            text: [
              "The Roman army was made of full-time soldiers who trained every day.",
              "A soldier called a legionary signed up for about 25 years.",
            ],
          },
          {
            heading: "Legions and centuries",
            text: [
              "A legion had about 5,000 soldiers.",
              "It was split into centuries of 80 soldiers, each led by an officer called a centurion.",
              "'Centum' means 100 in Latin, but a century had 80!",
            ],
          },
          {
            heading: "What a soldier carried",
            text: [
              "A metal helmet, armour made from metal strips, a big curved shield called a scutum, a short sword called a gladius, and a throwing spear called a pilum.",
              "Their sandals had iron nails in the soles. On the march they also carried tools, food and cooking pots.",
            ],
          },
          {
            heading: "The tortoise",
            text: [
              "In battle, soldiers could lock their shields together over their heads and around the sides, like the shell of a tortoise.",
              "They called this the testudo, which means tortoise.",
              "Soldiers also built forts, bridges and long straight roads, so the army could move quickly.",
            ],
          },
        ],
        words: [
          { word: "legion", meaning: "a group of about 5,000 Roman soldiers" },
          { word: "legionary", meaning: "a Roman soldier in a legion" },
          { word: "centurion", meaning: "the officer in charge of a century, about 80 soldiers" },
          { word: "fort", meaning: "a strong, walled camp for soldiers" },
        ],
      },
      practice: {
        intro: "Kit check!",
        questions: [
          {
            type: "match",
            q: "Match each Latin name to what it is.",
            pairs: [["scutum", "shield"], ["gladius", "short sword"], ["pilum", "throwing spear"], ["testudo", "tortoise"]],
          },
          { type: "choice", q: "Who was in charge of a century?", options: ["The emperor", "A centurion", "A legion"], answer: 1 },
        ],
      },
      task: {
        title: "Make a shield and march like a legionary",
        intro: "Get kitted out, then get marching.",
        need: ["A big piece of cardboard", "Red and yellow paint or felt pens", "Somewhere to march, inside or out"],
        steps: [
          "Cut a big rectangle from the cardboard and bend it gently so it curves.",
          "Paint it red, with yellow lightning bolts or wings.",
          "March, counting 'sinister, dexter', which is Latin for 'left, right'.",
          "A Roman mile was 1,000 paces, and a pace was two steps. Count out 100 paces. How far would 1,000 be?",
        ],
      },
      exit: [
        { type: "choice", q: "About how many soldiers were in a legion?", options: ["50", "500", "5,000"], answer: 2 },
        { type: "choice", q: "About how many soldiers were in a century?", options: ["8", "80", "100"], answer: 1, why: "Even though 'centum' means 100!" },
        { type: "choice", q: "What was the testudo?", options: ["A Roman food", "Shields locked together like a tortoise shell", "A type of boat"], answer: 1 },
        { type: "choice", q: "How long did a legionary sign up for?", options: ["About 2 years", "About 25 years", "For the rest of his life"], answer: 1 },
        {
          type: "pick",
          q: "What else did Roman soldiers do apart from fight? There is more than one.",
          options: ["Build roads", "Build forts", "Build bridges", "Fly planes"],
          answers: [0, 1, 2],
        },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "A ___ was a short sword, and a ___ was a throwing spear.",
          bank: ["gladius", "pilum", "scutum", "testudo"],
          answers: ["gladius", "pilum"],
        },
      ],
      grownUp: {
        need: ["A big piece of cardboard", "Red and yellow paint or felt pens"],
        tips: [
          "The pace-counting is a good maths link. Let your child work out the 1,000 paces themselves.",
          "Ask why soldiers built roads as well as fighting. The answer (to move the army fast) explains a lot about how Rome kept control.",
        ],
        younger: "Decorate a paper plate as a shield and practise marching while counting to ten.",
        older: "Write a diary for one day in the life of a legionary. What do they do, eat and worry about?",
      },
    },
    {
      slug: "romans-4",
      title: "Boudica fights back",
      emoji: "⚔️",
      minutes: 45,
      goal: "I can tell the story of Boudica's revolt and explain why it matters who tells a story.",
      starter: [
        { type: "choice", q: "What was a centurion?", options: ["An officer in charge of about 80 soldiers", "An emperor", "A Roman road"], answer: 0 },
        { type: "choice", q: "What does invade mean?", options: ["To go into a country with an army to take it over", "To go on holiday", "To trade"], answer: 0 },
        { type: "choice", q: "Some tribes made friends with the Romans. True or false?", options: ["True", "False"], answer: 0 },
        { type: "choice", q: "About how many soldiers were in a legion?", options: ["50", "5,000", "500"], answer: 1 },
        {
          type: "match",
          q: "Match each Latin name to what it is.",
          pairs: [["scutum", "shield"], ["gladius", "short sword"], ["testudo", "tortoise"]],
        },
        { type: "choice", q: "Why did Roman soldiers build long straight roads?", options: ["To play games on", "So the army could move quickly", "To keep the rain off"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The Iceni",
            picture: "/topics/romans/lesson-4.jpg",
            alt: "Queen Boudica riding her chariot at the head of her army",
            text: [
              "The Iceni were a tribe living in what is now Norfolk. Their king, Prasutagus, had made friends with the Romans.",
              "When he died, around AD 60, he left half his kingdom to the emperor and half to his daughters, hoping that would keep his family safe.",
            ],
          },
          {
            heading: "Boudica is furious",
            text: [
              "It didn't keep them safe. The Romans took everything, and they treated his wife, Queen Boudica, and their daughters very cruelly.",
              "Boudica led the Iceni and their neighbours, the Trinovantes, in a huge revolt.",
            ],
          },
          {
            heading: "Three towns burn",
            text: [
              "Boudica's army destroyed three Roman towns: Camulodunum (Colchester), Londinium (London) and Verulamium (St Albans).",
              "Archaeologists still find a red and black layer of burnt ground under these towns from the fires.",
            ],
          },
          {
            heading: "The end of the revolt, and who tells the story",
            text: [
              "The Roman governor, Suetonius Paulinus, marched his army back from Wales and beat Boudica's much bigger army. Boudica died soon afterwards.",
              "Everything we know about Boudica was written by two Roman writers, years later. None of the Iceni wrote down their side of the story.",
            ],
          },
        ],
        words: [
          { word: "revolt", meaning: "when people fight back against the people ruling them" },
          { word: "source", meaning: "anything that tells us about the past, like a letter, a coin or a ruin" },
        ],
      },
      practice: {
        intro: "Get the story straight.",
        questions: [
          {
            type: "order",
            q: "Put the story in order. Tap what happened first.",
            items: ["King Prasutagus dies", "The Romans treat Boudica cruelly", "Boudica's army burns three towns", "The Romans win the big battle"],
          },
          {
            type: "match",
            q: "Match the Roman town to its name today.",
            pairs: [["Camulodunum", "Colchester"], ["Londinium", "London"], ["Verulamium", "St Albans"]],
          },
        ],
      },
      task: {
        title: "The Britannia Times",
        intro: "Write the front page of a newspaper on the day Londinium burns.",
        need: ["Paper and pens", "A scarf or cloak for dressing up (if you like)"],
        steps: [
          "First, be Boudica while your grown-up asks you questions. Why are you so angry? What do you want?",
          "Now write the front page: a big headline, a picture, and a short report.",
          "Decide: is your newspaper on the Romans' side or the Britons' side? How does that change your headline?",
        ],
      },
      exit: [
        { type: "choice", q: "Who was Boudica?", options: ["A Roman emperor", "Queen of the Iceni tribe", "A Roman soldier"], answer: 1 },
        { type: "choice", q: "What is a revolt?", options: ["When people fight back against the people ruling them", "A Roman party", "A kind of shield"], answer: 0 },
        {
          type: "pick",
          q: "Which towns did Boudica's army destroy? There is more than one.",
          options: ["Londinium", "Camulodunum", "Verulamium", "Rome"],
          answers: [0, 1, 2],
        },
        { type: "choice", q: "Who won the big battle at the end?", options: ["Boudica", "The Romans"], answer: 1 },
        {
          type: "choice",
          q: "Why do we have to be careful with the story of Boudica?",
          options: ["It was all written by Romans, not by the Iceni", "It happened yesterday", "Boudica wrote it herself"],
          answer: 0,
        },
        {
          type: "choice",
          q: "Which of these is a source that tells us about the past?",
          options: ["A story you made up", "A Roman coin found in a field", "A dream"],
          answer: 1,
          why: "A source is anything that tells us about the past, like a letter, a coin or a ruin.",
        },
      ],
      grownUp: {
        need: ["Paper and pens", "A scarf or cloak (optional)"],
        tips: [
          "Boudica's story starts with cruelty. 'The Romans treated Boudica and her daughters very cruelly' is enough detail for most children.",
          "The big question is: hero or rebel? Let your child argue both sides. It depends on who you ask, and that's the point of the lesson.",
        ],
        younger: "Tell the story in four pictures, like a comic strip: the king dies, the Romans are cruel, Boudica fights back, the big battle.",
        older: "A Roman writer described Boudica as very tall and frightening, with long red-gold hair. He never met her. Why might he describe her like that?",
      },
    },
    {
      slug: "romans-5",
      title: "Walls at the edge of the empire",
      emoji: "🧱",
      minutes: 45,
      goal: "I can explain why Hadrian's Wall and the Antonine Wall were built, and what life was like at a fort.",
      starter: [
        { type: "choice", q: "Who was Boudica?", options: ["Queen of the Iceni", "A Roman governor", "An emperor"], answer: 0 },
        { type: "choice", q: "What is a fort?", options: ["A strong, walled camp for soldiers", "A market", "A Roman bath"], answer: 0 },
        { type: "choice", q: "What did the Romans call Britain?", options: ["Britannia", "Italy", "Gaul"], answer: 0 },
        {
          type: "match",
          q: "Match the Roman town to its name today.",
          pairs: [["Camulodunum", "Colchester"], ["Londinium", "London"], ["Verulamium", "St Albans"]],
        },
        { type: "choice", q: "What is a revolt?", options: ["A Roman road", "When people fight back against the people ruling them", "A party"], answer: 1 },
        { type: "choice", q: "Who won the big battle at the end of Boudica's revolt?", options: ["Boudica", "The Romans"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The land the Romans never took",
            picture: "/topics/romans/lesson-5.jpg",
            alt: "A woman writing a letter at a fort, with Hadrian's Wall stretching over the hills behind her",
            text: [
              "The Romans never conquered most of the land we now call Scotland. They called it Caledonia.",
              "The tribes there often raided the Roman lands to the south.",
            ],
          },
          {
            heading: "Hadrian's Wall",
            text: [
              "Emperor Hadrian visited Britain in AD 122 and ordered a wall from coast to coast, about 73 miles long.",
              "There were big forts along it, a small fort called a milecastle every Roman mile, and lookout towers in between.",
              "The wall had gates. It let the Romans control who came and went, and make traders pay taxes.",
            ],
          },
          {
            heading: "The Antonine Wall",
            text: [
              "About 20 years later, the next emperor, Antoninus Pius, pushed further north and built another wall across central Scotland, between the Forth and the Clyde.",
              "It was made of turf on a stone base, with a deep ditch in front. The army only stayed there for about 20 years.",
            ],
          },
          {
            heading: "Letters from the fort",
            text: [
              "At a fort called Vindolanda, near Hadrian's Wall, archaeologists found hundreds of letters written in ink on thin pieces of wood.",
              "One is a birthday party invitation from a woman called Claudia Severa to her friend. Others ask for socks, underpants and more beer!",
            ],
          },
        ],
        words: [
          { word: "fort", meaning: "a strong, walled camp for soldiers" },
          { word: "milecastle", meaning: "a small fort on Hadrian's Wall, one every Roman mile" },
          { word: "Caledonia", meaning: "the Roman name for Scotland" },
        ],
      },
      practice: {
        intro: "Which wall is which?",
        questions: [
          {
            type: "match",
            q: "Match each wall to its facts.",
            pairs: [["Hadrian's Wall", "Begun in AD 122, about 73 miles long"], ["Antonine Wall", "Further north, made of turf on stone"]],
          },
          { type: "choice", q: "Which wall is further north?", options: ["Hadrian's Wall", "The Antonine Wall"], answer: 1 },
        ],
      },
      task: {
        title: "Build a wall, then write a Vindolanda letter",
        intro: "Be a guard at the edge of the empire.",
        need: ["Building blocks, Lego or small boxes", "A strip of card and a pen"],
        steps: [
          "Build a stretch of wall with a gate and a lookout tower.",
          "Play guards: who is allowed through, and what do they have to pay?",
          "Write a Vindolanda letter on a long strip of card. Invite a friend to your birthday party, or write home asking for something you need at the fort.",
        ],
      },
      exit: [
        { type: "choice", q: "Which emperor ordered a wall in AD 122?", options: ["Claudius", "Hadrian", "Antoninus Pius"], answer: 1 },
        { type: "choice", q: "What was a milecastle?", options: ["A small fort every Roman mile", "A castle a mile high", "A Roman road"], answer: 0 },
        {
          type: "choice",
          q: "Why did the wall have gates?",
          options: ["To control who came and went, and to tax traders", "Because the Romans forgot to finish it", "For decoration"],
          answer: 0,
        },
        { type: "choice", q: "Where is the Antonine Wall?", options: ["Across central Scotland", "In London", "In Italy"], answer: 0 },
        { type: "choice", q: "What were the Vindolanda tablets?", options: ["Medicine", "Letters written on thin pieces of wood", "Stone statues"], answer: 1 },
        { type: "type", q: "What did the Romans call Scotland?", answer: ["Caledonia"] },
      ],
      grownUp: {
        need: ["Building blocks, Lego or small boxes", "A map of Britain", "A strip of card"],
        tips: [
          "If you can, look up the Vindolanda birthday invitation on the British Museum website together. Seeing the real handwriting is a great moment.",
          "In Scotland, the Antonine Wall is a local link worth making. Rough Castle and Bar Hill are good to visit.",
        ],
        younger: "Build the wall and the gate, then play guards together.",
        older: "If you walked 12 miles a day, how many days would it take to walk the 73 miles of Hadrian's Wall?",
      },
    },
    {
      slug: "romans-6",
      title: "Roman life and what they left behind",
      emoji: "🏛️",
      minutes: 45,
      goal: "I can describe Roman towns, homes and baths, and spot Roman things that are still around today.",
      starter: [
        { type: "choice", q: "Which emperor built a wall across northern England?", options: ["Hadrian", "Claudius", "Boudica"], answer: 0 },
        { type: "choice", q: "What language did the Romans speak?", options: ["French", "Latin", "English"], answer: 1 },
        { type: "choice", q: "What was a villa?", options: ["A large Roman house in the countryside", "A soldier", "A boat"], answer: 0 },
        { type: "type", q: "What did the Romans call Scotland?", answer: ["Caledonia"] },
        { type: "choice", q: "What was a milecastle?", options: ["A Roman road", "A castle a mile high", "A small fort every Roman mile"], answer: 2 },
        {
          type: "pick",
          q: "What did people at Vindolanda ask for in their letters? There is more than one.",
          options: ["Socks", "Video games", "Underpants"],
          answers: [0, 2],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Roman towns",
            text: [
              "The Romans built towns with straight streets, a forum (a market square), temples and public baths.",
              "Many of our towns began as Roman ones: London was Londinium, York was Eboracum, Chester was Deva and Bath was Aquae Sulis.",
              "Towns ending in -chester, -caster or -cester, like Manchester and Gloucester, usually come from 'castra', the Latin for a camp or fort.",
            ],
          },
          {
            heading: "Villas and mosaics",
            picture: "/topics/romans/lesson-6.jpg",
            alt: "A Roman family in their villa, with a dolphin mosaic on the floor",
            text: [
              "Rich Romans lived in villas with mosaic floors: pictures made from thousands of tiny squares of stone called tesserae.",
              "Some had underfloor heating called a hypocaust. Hot air from a fire flowed under the floor.",
            ],
          },
          {
            heading: "At the baths",
            text: [
              "At the baths, people went from a warm room to a hot room, then into a cold pool.",
              "Instead of soap, they rubbed oil on their skin and scraped it off with a curved metal tool called a strigil.",
            ],
          },
          {
            heading: "Still here today",
            text: [
              "Lots of Roman things are still around us: roads that follow Roman ones, Latin words in English, and Roman numerals on clocks.",
              "Even the months July and August are named after Julius Caesar and the Emperor Augustus.",
            ],
          },
        ],
        words: [
          { word: "forum", meaning: "the main square and market place in a Roman town" },
          { word: "mosaic", meaning: "a picture made from lots of tiny pieces of stone or tile" },
          { word: "hypocaust", meaning: "Roman underfloor heating, using hot air from a fire" },
          { word: "Latin", meaning: "the language the Romans spoke and wrote" },
        ],
      },
      practice: {
        intro: "Be a Latin detective.",
        questions: [
          {
            type: "match",
            q: "Match the Latin word to the English word that comes from it.",
            pairs: [["aqua (water)", "aquarium"], ["centum (hundred)", "century"], ["manus (hand)", "manual"], ["audio (I hear)", "audience"]],
          },
          {
            type: "gap",
            q: "Fill the gaps.",
            text: "Rich Romans lived in a ___ with ___ floors made from tiny squares of stone.",
            bank: ["roundhouse", "villa", "carpet", "mosaic"],
            answers: ["villa", "mosaic"],
          },
        ],
      },
      task: {
        title: "Make a paper mosaic",
        intro: "Make your own Roman floor picture, then go on a Roman numerals hunt.",
        need: ["Coloured paper cut into small squares", "Glue and a sheet of card", "A pencil"],
        steps: [
          "Draw a simple design on the card: a dolphin, a flower or your first initial.",
          "Fill it with small squares of coloured paper, leaving tiny gaps between them, like real tesserae.",
          "Hunt for Roman numerals around the house and outside: clocks, watches, and old buildings.",
        ],
      },
      exit: [
        { type: "choice", q: "What was a hypocaust?", options: ["Underfloor heating", "A Roman soldier", "A market"], answer: 0 },
        { type: "choice", q: "What did Romans use instead of soap?", options: ["Mud", "Oil and a scraper called a strigil", "Nothing"], answer: 1 },
        {
          type: "match",
          q: "Match the Roman name to the place today.",
          pairs: [["Londinium", "London"], ["Eboracum", "York"], ["Aquae Sulis", "Bath"]],
        },
        { type: "choice", q: "Which month is named after Julius Caesar?", options: ["March", "July", "December"], answer: 1 },
        {
          type: "pick",
          q: "Which Roman things are still around today? There is more than one.",
          options: ["Latin words in English", "Roman numerals on clocks", "Roads that follow Roman ones", "Roman emperors"],
          answers: [0, 1, 2],
        },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "The ___ was the market square in a Roman town, and a ___ was a picture made from tiny squares of stone.",
          bank: ["forum", "mosaic", "strigil", "villa"],
          answers: ["forum", "mosaic"],
        },
      ],
      grownUp: {
        need: ["Coloured paper cut into small squares", "Glue and card", "A pencil"],
        tips: [
          "Finish the topic with the Big Romans Quiz in the Romans topic pack. It's a good way to see how much has stuck.",
          "A good last question: did the Romans make life better or worse for the people of Britain? Who was it better for?",
        ],
        younger: "Make a mosaic with bigger squares and a simple shape like a sun or a fish.",
        older: "Hold a debate: 'The Romans were good for Britain.' Find three reasons for and three against.",
      },
    },
  ],
};
