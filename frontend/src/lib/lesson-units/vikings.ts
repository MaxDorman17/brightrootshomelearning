import type { LessonUnit } from "@/lib/lessons";

/** The Vikings, for ages 9 to 11. Raids are covered calmly; the unit keeps a close eye on where our evidence comes from. */
export const vikings: LessonUnit = {
  slug: "vikings",
  title: "The Vikings",
  short: "Vikings",
  subject: "History",
  ages: "9 to 11",
  emoji: "🛡️",
  color: "#3E5C6E",
  summary: "Six lessons: where the Vikings came from, the raid on Lindisfarne, longships and Atlantic journeys, Alfred the Great, everyday life, gods and sagas, and the clues the Vikings left in York, Scotland and our place names.",
  cover: "/lessons/units/vikings.jpg",
  lessons: [
    {
      slug: "vikings-1",
      title: "Who were the Vikings?",
      emoji: "🗺️",
      minutes: 50,
      goal: "I can explain where the Vikings came from, why some of them left home, and place the Viking Age on a timeline.",
      starter: [
        { type: "choice", q: "Who ruled much of Britain before the Anglo-Saxons arrived?", options: ["The Vikings", "The Romans", "The Normans"], answer: 1 },
        { type: "pick", q: "Which of these words do you think are linked to the Vikings? There is more than one.", options: ["Longship", "Pyramid", "Rune", "Helmet"], answers: [0, 2, 3] },
        { type: "choice", q: "Which part of Europe do you think the Vikings came from?", options: ["The far south, near Greece", "The north, near Norway and Denmark", "The east, near Russia"], answer: 1 },
        { type: "choice", q: "What does AD 793 mean?", options: ["793 years after the year 1", "793 years before the year 1", "793 years ago"], answer: 0 },
        { type: "type", q: "The Vikings travelled across the sea in boats. What is the name of their famous long, narrow boats?", answer: ["longship", "longships", "long ship", "long ships", "a longship"] },
        { type: "choice", q: "Is it true that Vikings wore helmets with horns on them?", options: ["Yes, all of them did", "No, that idea came much later, from artists and plays", "Only on Sundays"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "People from the North",
            text: [
              "The people we call the Vikings came from Scandinavia, the part of northern Europe that is now Norway, Denmark and Sweden. At the time there were no countries with those borders. Instead there were many small kingdoms, each led by a king or a powerful chieftain.",
              "Scandinavia has long, cold winters, thick forests and steep mountains. In Norway especially, there is only a thin strip of good farmland along the coast and the deep sea inlets called fjords. Because travelling over land was so hard, the sea became the main road.",
              "The Vikings did not call themselves 'Vikings'. In their language, Old Norse, to go 'a-viking' meant to sail off on an expedition, often to raid or trade. Historians now use the word for the whole people of Scandinavia in this time, even though most of them were farmers, fishers, traders and craftworkers who never went raiding at all.",
              "The people of Britain had other names for them. The Anglo-Saxons usually called them 'Danes' or 'Northmen', wherever they actually came from.",
            ],
          },
          {
            heading: "Why did they leave home?",
            text: [
              "Historians think there were several reasons, and they probably worked together. One reason was land. As the number of people grew, there was not enough good farmland to go round, and often the eldest son inherited the family farm, so younger sons had to find land elsewhere.",
              "Another reason was wealth. A successful voyage could bring back silver, which gave a person power and respect at home. Traders sold furs, amber, walrus ivory and iron, and brought back silver coins, silk, glass and spices.",
              "A third reason was that they could. Viking shipbuilders made fast, light ships that could cross open sea and travel up shallow rivers. Sailors also brought home news of rich places that were close to the coast and badly defended.",
              "Their journeys took them in every direction: west to Britain, Ireland and far across the Atlantic, south to France and Spain, and east along the great rivers of what is now Russia and Ukraine, as far as Constantinople (modern Istanbul). Silver coins made in the Islamic world, including Baghdad, have been found buried in Scandinavia and Britain.",
            ],
          },
          {
            heading: "The Viking Age",
            text: [
              "Historians call the years from about AD 793 to 1066 the Viking Age. That is long after the Romans left Britain, in around AD 410, and about 1,000 years before you were born.",
              "When the Vikings arrived, Britain was not one country. England was split into Anglo-Saxon kingdoms such as Northumbria, Mercia, East Anglia and Wessex. In the north, the Picts and the Gaels were joining together into the kingdom that would become Scotland, and Wales had its own Welsh kingdoms.",
              "The Viking Age starts with raids, but it does not end with them. Over these 270 years, Vikings came first as raiders, then as armies, then as settlers who farmed, traded, married local people and became part of life in Britain.",
              "It is usually said to end in 1066, when the Norwegian king Harald Hardrada was defeated at the Battle of Stamford Bridge, near York, just a few weeks before the more famous Battle of Hastings.",
            ],
          },
        ],
        words: [
          { word: "Scandinavia", meaning: "the region of northern Europe that is now Norway, Denmark and Sweden" },
          { word: "Old Norse", meaning: "the language the Vikings spoke" },
          { word: "fjord", meaning: "a long, deep, narrow inlet of the sea between steep cliffs" },
          { word: "chieftain", meaning: "the leader of a group or clan" },
          { word: "Anglo-Saxons", meaning: "the people who ruled most of England before and during the Viking Age" },
          { word: "Viking Age", meaning: "the period from about AD 793 to 1066" },
        ],
      },
      practice: {
        intro: "Check what you've found out about the Vikings and their world.",
        questions: [
          {
            type: "pick",
            q: "Which modern countries make up Scandinavia, where the Vikings came from? There is more than one.",
            options: ["Norway", "Spain", "Sweden", "Denmark", "Italy"],
            answers: [0, 2, 3],
          },
          {
            type: "match",
            q: "Match each reason for leaving home to an example.",
            pairs: [
              ["Land", "A younger son with no farm to inherit"],
              ["Wealth", "Bringing home silver to gain respect"],
              ["Good ships", "Sailing up a shallow river to reach a town"],
            ],
          },
          {
            type: "order",
            q: "Put these in order, starting with the earliest.",
            items: ["The Romans leave Britain", "The Viking Age begins", "The Battle of Stamford Bridge", "You are born"],
          },
          { type: "choice", q: "Why was the sea so important to people in Norway?", options: ["Because there were no trees for building", "Because mountains and forests made travel over land very hard", "Because they could not swim"], answer: 1, why: "Steep mountains, thick forests and fjords made the sea the easiest way to get around." },
          { type: "gap", q: "Fill in the gaps.", text: "The Vikings spoke a language called Old ___. To go 'a-___' meant to set off on a sea expedition.", bank: ["Norse", "viking", "English", "Latin", "farming"], answers: ["Norse", "viking"] },
        ],
      },
      task: {
        title: "Make a Viking Age timeline",
        intro: "Build a long timeline that shows how the Viking Age fits into British history, then explain why the Vikings set out.",
        need: ["A long strip of paper (tape a few sheets together end to end)", "A ruler, a pencil and coloured pens", "Sticky tape"],
        steps: [
          "Draw a line along your strip. Mark AD 1 at the left end and 2100 at the right. Use the ruler to space the centuries evenly, every 5 cm for each 100 years works well.",
          "Mark these dates and label each one: around 410, the Romans leave Britain; 793, the Viking Age begins; 1066, the Battle of Stamford Bridge and the Battle of Hastings; the year you were born.",
          "Colour the Viking Age in one colour. How much of the line does it fill? How long ago did it start?",
          "Under the line, write a short paragraph explaining three reasons why Vikings left Scandinavia. Use 'because' and 'so' to explain each reason, for example 'Some Vikings left because...'.",
          "Keep your timeline. You will add more dates to it as the unit goes on.",
        ],
      },
      exit: [
        { type: "choice", q: "Where did the Vikings come from?", options: ["Scandinavia", "Italy", "Egypt"], answer: 0 },
        { type: "choice", q: "Which years do historians usually call the Viking Age?", options: ["About AD 43 to 410", "About AD 793 to 1066", "About AD 1066 to 1485"], answer: 1 },
        { type: "pick", q: "Which were reasons some Vikings left home? There is more than one.", options: ["Not enough good farmland", "To find silver and goods to trade", "To escape the Roman army", "They had fast ships that could reach new places"], answers: [0, 1, 3] },
        { type: "type", q: "What was the name of the language the Vikings spoke? (Old ...)", answer: ["Norse", "Old Norse", "norse", "old norse"] },
        { type: "choice", q: "Were most Vikings raiders?", options: ["Yes, all Vikings were raiders", "No, most were farmers, fishers, traders and craftworkers", "No, most were kings"], answer: 1 },
        { type: "choice", q: "When the Vikings first arrived, England was...", options: ["one country ruled by one king", "part of the Roman Empire", "split into several Anglo-Saxon kingdoms"], answer: 2 },
      ],
      grownUp: {
        need: ["Several sheets of paper taped into a long strip", "A ruler, pencil and coloured pens"],
        tips: [
          "Children often picture the Vikings only as raiders. Keep coming back to the idea that they were also farmers, traders, explorers and settlers. The unit builds that bigger picture.",
          "Horned helmets are a myth from the 1800s, made popular by costumes for operas. Real Viking helmets were simple rounded iron caps, and very few have been found.",
          "The timeline's scale matters more than neatness. If 5 cm a century is too long for your paper, try 2 cm.",
        ],
        younger: "Find Norway, Denmark and Sweden on a map, then trace with a finger the sea journey from Norway to Britain.",
        older: "Research one Viking journey east, to Kyiv or Constantinople, and write a short paragraph on what the travellers traded there.",
      },
    },
    {
      slug: "vikings-2",
      title: "The raid on Lindisfarne",
      emoji: "⛪",
      minutes: 50,
      goal: "I can describe the raid on Lindisfarne in 793, explain why monasteries were targeted, and think about whose point of view our sources show.",
      starter: [
        { type: "choice", q: "Which region did the Vikings come from?", options: ["The Mediterranean", "Scandinavia", "North Africa"], answer: 1 },
        { type: "type", q: "What was the name of the language the Vikings spoke? (Old ...)", answer: ["Norse", "Old Norse", "norse", "old norse"] },
        { type: "choice", q: "Which year is usually given as the start of the Viking Age?", options: ["410", "1066", "793"], answer: 2 },
        { type: "pick", q: "Which were reasons Vikings left home? There is more than one.", options: ["To find land to farm", "To bring home silver", "To visit the pyramids"], answers: [0, 1] },
        { type: "choice", q: "What does it mean to go 'a-viking'?", options: ["To go to sleep", "To set off on a sea expedition", "To build a house"], answer: 1 },
        { type: "choice", q: "What is a fjord?", options: ["A long, deep, narrow inlet of the sea", "A kind of Viking shoe", "A mountain"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "A holy island",
            text: [
              "Lindisfarne is a small island off the coast of Northumberland, in the north-east of England. Twice a day the tide goes out and you can walk or drive across to it. Today it is often called Holy Island.",
              "In AD 635 a monk called Aidan came from the island of Iona, in Scotland, and started a monastery there. A monastery is a place where monks live, work and pray together. Lindisfarne became one of the most important Christian centres in Britain, and the home of St Cuthbert.",
              "The monks of Lindisfarne were skilled scribes and artists. Around the year 700 they made the Lindisfarne Gospels, a beautiful hand-written book decorated with swirling patterns, birds and animals. It still survives and is kept at the British Library in London.",
            ],
          },
          {
            heading: "The raid of 793",
            text: [
              "In 793, ships arrived from the sea and Viking raiders came ashore at Lindisfarne. The raid was sudden and short. The raiders took treasure from the church, such as gold and silver crosses, cups and book covers. Some monks were hurt or killed, and some were taken away.",
              "Why choose a monastery? Monasteries were often wealthy, they were close to the sea, and they had no soldiers to guard them. The monks did not expect anyone to attack a holy place, so they were not ready.",
              "The news shocked Christian Europe. A Northumbrian scholar called Alcuin, who was working at the court of the great Frankish ruler Charlemagne, wrote letters saying that nothing like it had ever been seen in Britain before.",
              "Lindisfarne was the first famous raid, but not the last. Over the next years Vikings raided other monasteries, including Jarrow in 794 and Iona in 795. In 875, the monks of Lindisfarne finally left the island, carrying St Cuthbert's coffin with them. His shrine is now in Durham Cathedral.",
            ],
          },
          {
            heading: "Whose story are we reading?",
            text: [
              "Almost everything we know about the raid was written by Christian monks and scholars. One of the main sources is the Anglo-Saxon Chronicle, a record of events kept by English monks. It describes terrible signs in the sky, such as lightning and 'fiery dragons', before the raiders came.",
              "These writers were on the side of the people who were attacked, so they described the Vikings as cruel and wicked heathens (people who were not Christian). Their accounts are important, but they only show one point of view.",
              "The Vikings themselves did not write long histories at this time. They did carve short messages in runes on stones, and they told stories out loud. Their side of the story comes to us much later, through sagas written down hundreds of years afterwards.",
              "Historians ask questions about every source: who wrote it, when, and why? A source can be biased, meaning it leans towards one side, and still be very useful, as long as we remember whose story it tells.",
            ],
          },
        ],
        words: [
          { word: "monastery", meaning: "a place where monks live, work and pray together" },
          { word: "raid", meaning: "a quick, surprise attack to take goods, followed by a fast escape" },
          { word: "scribe", meaning: "a person whose job was to copy and write books by hand" },
          { word: "source", meaning: "something from the past that tells us about it, like a document or an object" },
          { word: "bias", meaning: "leaning towards one side or point of view" },
          { word: "heathen", meaning: "a word Christians used then for people who did not share their religion" },
        ],
      },
      practice: {
        intro: "Think like a historian about Lindisfarne.",
        questions: [
          {
            type: "pick",
            q: "Why were monasteries like Lindisfarne easy targets? There is more than one.",
            options: ["They held gold and silver treasure", "They were guarded by big armies", "They were close to the sea", "The monks did not expect an attack"],
            answers: [0, 2, 3],
          },
          { type: "choice", q: "Who wrote most of the sources about the raid?", options: ["The Viking raiders", "Christian monks and scholars", "Roman soldiers"], answer: 1 },
          {
            type: "order",
            q: "Put these events in order, earliest first.",
            items: ["Aidan starts the monastery on Lindisfarne", "The Lindisfarne Gospels are made", "Vikings raid Lindisfarne", "The monks leave the island with St Cuthbert's coffin"],
          },
          { type: "choice", q: "The Anglo-Saxon Chronicle calls the raiders wicked. Why should a historian be careful with that?", options: ["Because it was written in the wrong language", "Because it was written by the side that was attacked, so it may be biased", "Because it is too short to read"], answer: 1, why: "A biased source can still be useful, but it shows one side's view of events." },
          { type: "gap", q: "Fill in the gaps.", text: "Lindisfarne is an island off the coast of ___. It was raided in the year ___.", bank: ["Northumberland", "Cornwall", "793", "1066"], answers: ["Northumberland", "793"] },
        ],
      },
      task: {
        title: "Two sides of the story",
        intro: "Write about the raid from two different points of view, then compare them like a historian.",
        need: ["Paper and a pencil", "Coloured pens (optional)"],
        steps: [
          "Imagine you are a young monk who saw the ships arrive at Lindisfarne. Write a short entry for the monastery's record, about 6 to 8 sentences. What did you see? How did you feel? What do you think the raid means?",
          "Now imagine you are a young Norse sailor arriving back home in Norway weeks later. Write what you might tell your family about the voyage. Remember that, to you, this was a chance to bring home wealth.",
          "Underline any words in each piece that show bias, such as words that make one side seem good or bad.",
          "Write two or three sentences answering this question: why might a historian need to read both kinds of source, and why do we only have one of them from 793?",
          "Keep your writing calm and thoughtful. You do not need to describe any fighting.",
        ],
      },
      exit: [
        { type: "choice", q: "In which year did Vikings raid Lindisfarne?", options: ["410", "793", "1066"], answer: 1 },
        { type: "choice", q: "What was Lindisfarne?", options: ["A Viking town", "A Roman fort", "An island with a monastery"], answer: 2 },
        { type: "pick", q: "Why did raiders target monasteries? There is more than one.", options: ["They held treasure", "They were near the coast", "They had no soldiers guarding them", "They sold longships"], answers: [0, 1, 2] },
        { type: "type", q: "What is the name of the record of events kept by English monks? (The Anglo-Saxon ...)", answer: ["Chronicle", "chronicle", "Anglo-Saxon Chronicle", "the Anglo-Saxon Chronicle"] },
        { type: "choice", q: "What does it mean if a source is biased?", options: ["It leans towards one side or point of view", "It is completely made up", "It was written in runes"], answer: 0 },
        { type: "choice", q: "Why do we have very few Viking accounts of the raid?", options: ["The Vikings could not speak", "The Vikings did not write long histories at the time; their stories were told aloud and written down much later", "The monks hid them all"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and a pencil"],
        tips: [
          "The raid involved real violence. The lesson mentions that some monks were hurt, killed or taken away, without detail. Let your child's questions lead, and answer simply and honestly.",
          "The Anglo-Saxon Chronicle dates the raid to 8 June 793, but some historians think the real date was 8 January, so the lesson just says '793'.",
          "The 'two sides' task is about point of view, not taking sides. Praise writing that shows how each person might have felt and thought.",
        ],
        younger: "Draw a picture of the island with its monastery and the ships approaching, and talk about why the monks were surprised.",
        older: "Look up a short extract from the Anglo-Saxon Chronicle entry for 793 with your grown-up, and pick out the words that show the writer's opinion.",
      },
    },
    {
      slug: "vikings-3",
      title: "Longships and great journeys",
      emoji: "⛵",
      minutes: 50,
      goal: "I can explain what made Viking ships so successful and describe the Viking journeys to Iceland, Greenland and North America.",
      starter: [
        { type: "choice", q: "Where is Lindisfarne?", options: ["Off the coast of Northumberland", "In the middle of London", "In Norway"], answer: 0 },
        { type: "choice", q: "What is a monastery?", options: ["A place where soldiers train", "A place where monks live, work and pray", "A kind of Viking ship"], answer: 1 },
        { type: "type", q: "In which year was Lindisfarne raided?", answer: "793" },
        { type: "pick", q: "Why were monasteries targeted? There is more than one.", options: ["They were rich", "They were near the sea", "They had large armies"], answers: [0, 1] },
        { type: "choice", q: "What does 'biased' mean?", options: ["Very old", "Written on stone", "Leaning towards one side"], answer: 2 },
        { type: "choice", q: "Who wrote the Anglo-Saxon Chronicle?", options: ["Viking kings", "English monks", "Roman emperors"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Built for the sea",
            text: [
              "The Vikings were some of the finest shipbuilders of their time. Their famous longships were long, narrow and light, built from overlapping planks of oak held together with iron rivets. This way of building is called clinker building, and it made the hull strong but slightly bendy, so it could flex with the waves.",
              "A longship had a single large square sail, often made of wool, and rows of oars for when the wind dropped or the ship needed to move quickly. It was steered with a large oar fixed to the right-hand side at the back. The Old Norse word for that side, the 'steering board', is where our word 'starboard' comes from.",
              "Longships sat very shallow in the water. They could cross the open sea, then sail up rivers and land right on a beach without needing a harbour. This made surprise raids possible. Settlers and traders used a different ship called a knarr, which was wider and deeper so it could carry cargo, families and animals.",
              "We know so much about these ships because some were buried in the ground, like the Oseberg and Gokstad ships found in Norway. Modern sailors have built copies and sailed them across the North Sea to test how well they work.",
            ],
          },
          {
            heading: "Finding the way",
            text: [
              "Viking sailors had no compass and no maps like ours. Instead, they used knowledge passed down from older sailors and close observation of the world around them.",
              "They watched the sun by day and the stars at night to judge direction. They knew the shapes of coastlines, mountains and islands, and they noticed clues at sea: seabirds flying out to feed and back to land, whales gathering where fish were plentiful, and the colour and feel of the water.",
              "Journeys were often made in summer, when days in the north are long and the weather is calmer. Even so, voyages were dangerous. Storms and fog could blow ships far off course, and some ships were never seen again.",
              "In fact, some new lands were first seen by accident, by sailors who had been blown off course. They came home with stories, and others then set out on purpose to find those lands.",
            ],
          },
          {
            heading: "Across the Atlantic",
            text: [
              "From around the 870s, Norse settlers sailed west to Iceland, an island of volcanoes and glaciers in the North Atlantic. They set up farms, and in 930 they started a great outdoor assembly called the Althing, where free men met to make laws and settle disputes.",
              "In the 980s a man called Erik the Red was sent away from Iceland for three years for killing two men. He sailed west and explored a huge, icy land. According to the sagas, he called it Greenland because a good name would make people want to settle there. Norse farms lasted in Greenland for over 400 years.",
              "Around the year 1000, Erik's son Leif Erikson sailed even further west, to the coast of North America. The sagas call one of the places he found Vinland. For a long time people wondered if these stories were true.",
              "Then, in 1960, archaeologists found the remains of Norse buildings at L'Anse aux Meadows in Newfoundland, Canada. This proved that Vikings reached North America nearly 500 years before Christopher Columbus crossed the Atlantic in 1492. They met the Indigenous people already living there, but they did not stay for long.",
            ],
          },
        ],
        words: [
          { word: "longship", meaning: "a long, narrow, fast Viking ship with a sail and oars" },
          { word: "knarr", meaning: "a wider, deeper Viking ship for carrying cargo, people and animals" },
          { word: "clinker built", meaning: "built with overlapping planks" },
          { word: "navigate", meaning: "to find your way, especially at sea" },
          { word: "Althing", meaning: "the great assembly of Iceland, where laws were made" },
          { word: "Vinland", meaning: "the Norse name for a land on the coast of North America" },
        ],
      },
      practice: {
        intro: "Set sail with these questions.",
        questions: [
          {
            type: "match",
            q: "Match each ship feature to what it was good for.",
            pairs: [
              ["Shallow hull", "Landing on beaches and sailing up rivers"],
              ["Square sail", "Using the wind on long crossings"],
              ["Oars", "Moving when there was no wind"],
              ["Wide, deep knarr", "Carrying families, animals and cargo"],
            ],
          },
          {
            type: "order",
            q: "Put these places in the order the Vikings reached them, starting with the earliest.",
            items: ["Iceland", "Greenland", "Vinland in North America"],
          },
          { type: "pick", q: "Which clues did Viking sailors use to find their way? There is more than one.", options: ["The sun and stars", "Seabirds and whales", "A magnetic compass", "The shapes of coastlines"], answers: [0, 1, 3] },
          { type: "choice", q: "Why did Erik the Red choose the name Greenland, according to the sagas?", options: ["Because it was covered in grass all year", "To make the land sound inviting so people would settle there", "Because he liked the colour green"], answer: 1 },
          { type: "gap", q: "Fill in the gaps.", text: "Remains of Norse buildings were found at L'Anse aux Meadows in ___. This proved Vikings reached North America before ___.", bank: ["Canada", "Columbus", "Iceland", "Alfred"], answers: ["Canada", "Columbus"] },
        ],
      },
      task: {
        title: "Design and test a longship",
        intro: "Use what you know about Viking ships to design one on paper, then test a small model boat in water.",
        need: ["Paper, a pencil and a ruler", "Aluminium foil", "A washing-up bowl or the bath, with a little water", "Coins or dried beans as cargo"],
        steps: [
          "Draw a side view of a longship. Label at least six parts: the hull, overlapping planks, the square sail, the mast, the oars and the steering oar on the starboard (right) side.",
          "Next to it, write three sentences explaining how the shape helped Vikings raid, trade or explore.",
          "Fold two small boats from foil, each from a sheet the same size. Make one long and narrow like a longship and one short and wide like a knarr.",
          "With a grown-up nearby, float each boat in the water. Add cargo one coin or bean at a time until it sinks. Which boat carries more?",
          "Write a conclusion: which shape was better for cargo, and why might raiders still prefer the long, narrow shape?",
        ],
      },
      exit: [
        { type: "choice", q: "Why could longships land right on a beach?", options: ["They had wheels", "They sat very shallow in the water", "They were made of metal"], answer: 1 },
        { type: "choice", q: "Which ship did Viking settlers use to carry families and animals?", options: ["The knarr", "The canoe", "The galleon"], answer: 0 },
        { type: "pick", q: "How did Viking sailors find their way? There is more than one.", options: ["Watching the sun and stars", "Following seabirds", "Using satellite maps", "Knowing the shapes of coastlines"], answers: [0, 1, 3] },
        { type: "type", q: "What was the name of Erik the Red's son, who reached North America around the year 1000?", answer: ["Leif Erikson", "Leif", "Leif Eriksson", "Leif Ericson", "leif erikson", "leif"] },
        { type: "choice", q: "What did archaeologists find at L'Anse aux Meadows in Canada?", options: ["A Roman road", "The remains of Norse buildings", "A pyramid"], answer: 1 },
        { type: "choice", q: "Which comes from the Old Norse word for the side of the ship with the steering oar?", options: ["Port", "Anchor", "Starboard"], answer: 2 },
      ],
      grownUp: {
        need: ["Aluminium foil", "A bowl or bath with a little water", "Coins or dried beans"],
        tips: [
          "Supervise around water, and mop up spills so no one slips.",
          "Erik the Red's exile involved killings. The lesson mentions this briefly as the reason he left Iceland; there is no need to dwell on it.",
          "The foil test works best if both boats use the same amount of foil. That makes it a fair test, a good link to science.",
          "You may hear that Vikings used a 'sunstone' crystal to find the sun on cloudy days. It is an interesting idea that some scientists are testing, but there is little direct evidence, so the lesson leaves it out.",
        ],
        younger: "Make one foil boat and see how many beans it can hold, counting as you go.",
        older: "Measure the straight-line distances from Norway to Iceland, Iceland to Greenland, and Greenland to Newfoundland on a map, and work out the total.",
      },
    },
    {
      slug: "vikings-4",
      title: "Alfred the Great and the struggle for England",
      emoji: "👑",
      minutes: 50,
      goal: "I can explain how Alfred the Great stopped the Viking advance, what the Danelaw was, and how England became one kingdom.",
      starter: [
        { type: "choice", q: "What were Viking longships built from?", options: ["Overlapping oak planks", "Iron sheets", "Woven reeds"], answer: 0 },
        { type: "choice", q: "Which island did Norse settlers reach first?", options: ["Greenland", "Iceland", "Newfoundland"], answer: 1 },
        { type: "type", q: "What name did the sagas give to the land Leif Erikson found in North America?", answer: ["Vinland", "vinland"] },
        { type: "pick", q: "How did Vikings navigate? There is more than one.", options: ["The sun and stars", "Seabirds and whales", "A printed map"], answers: [0, 1] },
        { type: "choice", q: "What was a knarr?", options: ["A Viking helmet", "A Viking god", "A wide cargo ship"], answer: 2 },
        { type: "choice", q: "What did the find at L'Anse aux Meadows prove?", options: ["That Vikings reached North America", "That Vikings had horns on helmets", "That Romans reached Canada"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "The Great Army",
            text: [
              "For about 70 years after Lindisfarne, most Viking attacks on England were raids: ships arrived, took what they could, and left. Then, in 865, something changed. A huge Viking force landed in East Anglia. The Anglo-Saxon Chronicle calls it the 'great army'.",
              "This army did not go home. It stayed in England for years, moving from kingdom to kingdom. In 866 it captured York, the most important city in the north, and the Vikings called it Jorvik. Over the next few years, Northumbria, East Anglia and much of Mercia fell under Viking control.",
              "By the 870s, only one Anglo-Saxon kingdom was still holding out: Wessex, in the south and south-west of England. Its new king, crowned in 871 when he was about 22 years old, was called Alfred.",
            ],
          },
          {
            heading: "Alfred fights back",
            text: [
              "In January 878, a Viking leader called Guthrum made a surprise winter attack on Chippenham, where Alfred was staying. Alfred escaped with a small band of followers and hid in the marshes of Athelney, in Somerset. For a while it looked as though the whole of England might fall.",
              "A famous story says that while he was hiding, Alfred sheltered in a peasant woman's home and, lost in his worries, let her cakes burn. The story was first written down long after Alfred's death, so it is probably a legend, but it shows how low his fortunes had sunk.",
              "In spring 878, Alfred gathered the men of Wessex and defeated Guthrum's army at the Battle of Edington, in Wiltshire. As part of the peace, Guthrum agreed to become a Christian, and Alfred became his godfather.",
              "Alfred then made Wessex harder to attack. He built a network of fortified towns called burhs, so that most people were within a day's walk of safety. He organised his army so half the men could stay home farming while the other half served, and he had bigger ships built to meet the Vikings at sea.",
            ],
          },
          {
            heading: "Sharing England: the Danelaw",
            text: [
              "Alfred and Guthrum agreed a boundary across England. It ran roughly along the River Thames, up the River Lea and then along an old Roman road called Watling Street. To the south and west was Anglo-Saxon land. To the north and east was the area later called the Danelaw, where Viking (Danish) law and customs were followed.",
              "In the Danelaw, many Vikings settled down as farmers and traders, married local people and, over time, became Christian. Alfred also cared about learning. He had important books translated into English, and the Anglo-Saxon Chronicle was begun during his reign. He is the only English king to be called 'the Great'.",
              "After Alfred died in 899, his son Edward and daughter Æthelflæd, the 'Lady of the Mercians', won back much of the Danelaw. In 927, Alfred's grandson Athelstan became the first king to rule all of England. The last Viking king of York, Eric Bloodaxe, was driven out in 954.",
              "Vikings had not gone for good. A Danish king, Cnut, ruled England from 1016 to 1035. In 1066 the Norwegian king Harald Hardrada invaded and was defeated at Stamford Bridge. Weeks later William of Normandy won at Hastings, and his Normans were themselves descended from Vikings who had settled in northern France.",
            ],
          },
        ],
        words: [
          { word: "Wessex", meaning: "the Anglo-Saxon kingdom in the south and south-west of England ruled by Alfred" },
          { word: "Danelaw", meaning: "the part of England to the north and east where Viking law and customs were followed" },
          { word: "burh", meaning: "a fortified town built to protect people from attack" },
          { word: "treaty", meaning: "a formal agreement between rulers" },
          { word: "legend", meaning: "a traditional story that may not be true" },
          { word: "Jorvik", meaning: "the Viking name for York" },
        ],
      },
      practice: {
        intro: "Follow the struggle for England.",
        questions: [
          {
            type: "order",
            q: "Put these events in order, earliest first.",
            items: ["The great army lands in East Anglia", "Alfred becomes king of Wessex", "Alfred wins the Battle of Edington", "Athelstan becomes king of all England", "The Battle of Stamford Bridge"],
          },
          { type: "choice", q: "Why is the story of Alfred and the burnt cakes probably a legend?", options: ["Because there were no cakes in Anglo-Saxon times", "Because it was first written down long after Alfred died", "Because Alfred never went to Somerset"], answer: 1, why: "A story first recorded many years after the events is harder to trust." },
          {
            type: "match",
            q: "Match each person to what they did.",
            pairs: [
              ["Alfred", "Defeated Guthrum at Edington"],
              ["Guthrum", "Agreed to become a Christian"],
              ["Athelstan", "First king of all England"],
              ["Æthelflæd", "Won back land as Lady of the Mercians"],
            ],
          },
          { type: "pick", q: "How did Alfred make Wessex harder to attack? There is more than one.", options: ["Building burhs", "Organising his army so half stayed home farming", "Giving all his land to Guthrum", "Having bigger ships built"], answers: [0, 1, 3] },
          { type: "gap", q: "Fill in the gaps.", text: "The land to the north and east of the boundary was called the ___. The Vikings called York ___.", bank: ["Danelaw", "Jorvik", "Wessex", "Vinland"], answers: ["Danelaw", "Jorvik"] },
        ],
      },
      task: {
        title: "Was Alfred really 'Great'?",
        intro: "Historians gave Alfred the title 'the Great'. Weigh up the evidence and write a short argument of your own.",
        need: ["Paper and a pencil", "A map of England in an atlas or on a screen, with your grown-up (optional)"],
        steps: [
          "Fold a page in half. On one side, list everything Alfred did that might make him 'great': battles, burhs, ships, learning and the treaty with Guthrum.",
          "On the other side, list any reasons to be careful: for example, most stories about him were written by people who worked for him or admired him.",
          "If you have a map, sketch the outline of England and draw the rough boundary of the Danelaw from London along Watling Street towards Chester. Shade the Danelaw in one colour and Alfred's land in another.",
          "Write a paragraph of at least six sentences answering the question 'Did Alfred deserve to be called the Great?' Start with your opinion, give at least two reasons with evidence, mention one point on the other side, and finish with a conclusion.",
          "Add 865, 878 and 927 to your Viking Age timeline.",
        ],
      },
      exit: [
        { type: "choice", q: "In which year did the great Viking army arrive in England?", options: ["793", "865", "1066"], answer: 1 },
        { type: "choice", q: "Which kingdom did Alfred rule?", options: ["Northumbria", "East Anglia", "Wessex"], answer: 2 },
        { type: "type", q: "What was the name of the Viking leader Alfred defeated at Edington in 878?", answer: ["Guthrum", "guthrum"] },
        { type: "choice", q: "What was a burh?", options: ["A fortified town", "A Viking ship", "A kind of cake"], answer: 0 },
        { type: "choice", q: "What was the Danelaw?", options: ["A Viking law court in Norway", "The part of England to the north and east where Viking law and customs were followed", "Alfred's army"], answer: 1 },
        { type: "choice", q: "Who became the first king of all England, in 927?", options: ["Guthrum", "Cnut", "Athelstan"], answer: 2 },
      ],
      grownUp: {
        need: ["Paper and a pencil", "An atlas or online map of England (optional, with supervision)"],
        tips: [
          "This lesson covers a lot of names. A simple family tree, Alfred to Edward and Æthelflæd to Athelstan, can help.",
          "The Treaty of Alfred and Guthrum is usually dated to the 880s, a few years after Edington. The Danelaw boundary was never a fixed wall; people, trade and ideas moved across it.",
          "Encourage a balanced answer in the 'Was Alfred great?' task. There is no single right answer; the quality of reasons is what counts.",
        ],
        younger: "Retell the story of Alfred hiding in the marshes and winning at Edington as a four-picture comic strip.",
        older: "Find out where your nearest Alfredian burh was (such as Winchester, Wallingford, Oxford or Wareham) and how its old street plan or walls can still be seen.",
      },
    },
    {
      slug: "vikings-5",
      title: "Everyday life, gods and sagas",
      emoji: "🔥",
      minutes: 50,
      goal: "I can describe everyday Viking life, name some Norse gods, and explain what sagas and runes tell us.",
      starter: [
        { type: "choice", q: "Who was king of Wessex and defeated Guthrum?", options: ["Athelstan", "Alfred", "Cnut"], answer: 1 },
        { type: "choice", q: "What was a burh?", options: ["A fortified town", "A Norse god", "A Viking farm"], answer: 0 },
        { type: "type", q: "What did the Vikings call York?", answer: ["Jorvik", "jorvik", "Jórvík"] },
        { type: "choice", q: "What was the Danelaw?", options: ["Land where Viking law and customs were followed", "Alfred's palace", "A ship"], answer: 0 },
        { type: "order", q: "Put these in order, earliest first.", items: ["The great army arrives", "The Battle of Edington", "Athelstan rules all England"] },
        { type: "choice", q: "Why is the burnt cakes story probably a legend?", options: ["It was first written down long after Alfred died", "Alfred wrote it himself", "It is carved on a runestone"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Life on a Viking farm",
            text: [
              "Most Vikings lived on farms. A family lived in a longhouse, a long building with thick walls of wood, stone or turf and a roof of thatch or turf. Inside was one main room with a fire burning in a long hearth down the middle, giving heat, light and a place to cook. Smoke escaped through a hole in the roof.",
              "Along the walls were raised wooden platforms used as benches by day and beds at night. In the coldest months, animals were sometimes kept at one end of the house, and their warmth helped to heat it.",
              "Everyone worked. People grew barley, oats and rye, kept cattle, sheep, pigs and chickens, fished, and made almost everything they needed: woollen cloth, leather shoes, wooden bowls and iron tools. They ate porridge, flatbreads, fish, meat, cheese and berries, and stored food for the long winter.",
              "Viking society had different groups. At the top were jarls, the wealthy nobles. Most people were karls, free farmers and craftworkers. At the bottom were thralls, enslaved people who had no freedom; some had been captured in raids. Women ran the household and the farm, often carried the keys to the family's stores, and could own property.",
            ],
          },
          {
            heading: "The Norse gods",
            text: [
              "Before they became Christian, the Vikings believed in many gods and goddesses. Odin was the wise and powerful chief of the gods, who gave up one eye in exchange for wisdom and had two ravens that flew around the world bringing him news.",
              "Thor, the god of thunder, carried a mighty hammer called Mjölnir. He was hugely popular, and many people wore small hammer-shaped pendants. Freyja was the goddess of love and beauty, Frigg was Odin's wife, and Loki was a clever trickster who caused trouble for the other gods.",
              "Vikings believed in nine worlds joined together by a giant ash tree called Yggdrasil. The gods lived in Asgard, and humans lived in Midgard, 'the middle world'. They believed that warriors who died bravely might go to Valhalla, Odin's great hall.",
              "You use these gods' names every week! Tuesday, Wednesday, Thursday and Friday are named after Tiw (Tyr), Woden (Odin), Thor and Frigg, gods the Anglo-Saxons and Vikings shared. From the 900s onwards, more and more Vikings became Christian, and for a time some people wore both a cross and a Thor's hammer.",
            ],
          },
          {
            heading: "Sagas and runes",
            text: [
              "Vikings loved stories and poems. Poets called skalds composed verses praising kings and heroes, and families passed on tales of their ancestors by telling them aloud on long winter evenings.",
              "Many of these stories were written down in Iceland in the 1200s and 1300s as sagas. Some tell of gods and giants. Others, like the sagas of Erik the Red and of the Greenlanders, tell of real families and journeys. Because they were written down 200 years or more after the events, they mix history with storytelling, so historians check them against other evidence.",
              "The Vikings also had their own alphabet of letters called runes. The Viking version had just 16 runes, made mostly of straight lines so they were easy to carve into wood, bone or stone.",
              "Thousands of runestones still stand in Scandinavia, especially in Sweden. Many were put up in memory of family members, and some mention journeys to England or to far-off lands in the east.",
            ],
          },
        ],
        words: [
          { word: "longhouse", meaning: "a long Viking home with one main room and a central fire" },
          { word: "hearth", meaning: "the place where a fire burns inside a home" },
          { word: "jarl", meaning: "a wealthy and powerful Viking noble" },
          { word: "thrall", meaning: "an enslaved person in Viking society" },
          { word: "saga", meaning: "a long story about gods, heroes or families, written down in Iceland" },
          { word: "rune", meaning: "a letter of the Viking alphabet, made for carving" },
        ],
      },
      practice: {
        intro: "Step inside the Viking world.",
        questions: [
          {
            type: "match",
            q: "Match each Norse god to their description.",
            pairs: [
              ["Odin", "Chief of the gods, with two ravens"],
              ["Thor", "God of thunder, with a hammer"],
              ["Loki", "A clever trickster"],
              ["Freyja", "Goddess of love and beauty"],
            ],
          },
          { type: "choice", q: "Why did a longhouse have a hole in the roof?", options: ["To let smoke from the fire escape", "To let birds in", "To collect rainwater"], answer: 0 },
          { type: "pick", q: "Which days of the week are named after gods the Vikings knew? There is more than one.", options: ["Monday", "Wednesday", "Thursday", "Friday"], answers: [1, 2, 3] },
          { type: "choice", q: "Why do historians check sagas against other evidence?", options: ["Because they were written in runes", "Because they were written down hundreds of years after the events and mix history with storytelling", "Because nobody can read them"], answer: 1 },
          { type: "gap", q: "Fill in the gaps.", text: "Humans lived in ___, and the gods lived in ___. The worlds were joined by a great tree called ___.", bank: ["Midgard", "Asgard", "Yggdrasil", "Valhalla", "Jorvik"], answers: ["Midgard", "Asgard", "Yggdrasil"] },
        ],
      },
      task: {
        title: "Tell your own saga",
        intro: "Write a short saga in the Viking style, about a family on a farm, a voyage or a trick played by Loki.",
        need: ["Paper and a pencil", "Coloured pens"],
        steps: [
          "Plan your saga in a story mountain: an opening that introduces your hero and their family, a problem, a journey or challenge, a turning point, and an ending.",
          "Include at least three true details about Viking life from this lesson, such as a longhouse, a hearth, a knarr, a god, or the long winter.",
          "Sagas often begin by naming the hero's family: 'There was a man called Ketil, son of Bjorn, who lived at...'. Begin your saga the same way.",
          "Write your saga, about one side of paper. Use powerful verbs and some short sentences for tension.",
          "Read it aloud to your grown-up by 'firelight', as a skald would, perhaps with the lights dimmed.",
        ],
      },
      exit: [
        { type: "choice", q: "What was in the middle of a longhouse?", options: ["A swimming pool", "A long hearth with a fire", "A ship"], answer: 1 },
        { type: "choice", q: "Who was the chief of the Norse gods?", options: ["Thor", "Loki", "Odin"], answer: 2 },
        { type: "type", q: "Which god carried a hammer called Mjölnir?", answer: ["Thor", "thor"] },
        { type: "pick", q: "Which were groups in Viking society? There is more than one.", options: ["Jarls", "Karls", "Pharaohs", "Thralls"], answers: [0, 1, 3] },
        { type: "choice", q: "Where were most sagas written down?", options: ["Iceland", "Rome", "London"], answer: 0 },
        { type: "choice", q: "Why were runes made mostly of straight lines?", options: ["Because Vikings did not like curves", "So they were easy to carve into wood, bone or stone", "So they could be read in the dark"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and coloured pens"],
        tips: [
          "Thralls are mentioned plainly. If your child asks, explain that slavery existed in many societies in the past, including Anglo-Saxon England, and that it was wrong.",
          "Norse myths can be gory in places. If you read any together, choose a children's retelling.",
          "Friday may be named after Frigg or Freyja; historians disagree, so the lesson uses Frigg, the more usual explanation.",
        ],
        younger: "Draw a cutaway picture of a longhouse showing the hearth, benches, a loom and animals at one end.",
        older: "Find a chart of the Viking 16-rune alphabet (younger futhark) with your grown-up, and write your name and a short memorial message in runes.",
      },
    },
    {
      slug: "vikings-6",
      title: "Jorvik, Viking Scotland and the clues they left",
      emoji: "🔍",
      minutes: 50,
      goal: "I can explain how archaeology, hoards and place names tell us about Viking settlers in York and Scotland.",
      starter: [
        { type: "choice", q: "What was a longhouse?", options: ["A long Viking ship", "A Viking home with one main room", "A Viking church"], answer: 1 },
        { type: "type", q: "Which god of thunder carried a hammer?", answer: ["Thor", "thor"] },
        { type: "choice", q: "What were runes?", options: ["Letters of the Viking alphabet", "Viking coins", "Viking boots"], answer: 0 },
        { type: "match", q: "Match each group to its description.", pairs: [["Jarls", "Wealthy nobles"], ["Karls", "Free farmers and craftworkers"], ["Thralls", "Enslaved people"]] },
        { type: "choice", q: "Which day of the week is named after Thor?", options: ["Tuesday", "Saturday", "Thursday"], answer: 2 },
        { type: "choice", q: "What is a saga?", options: ["A kind of sword", "A story written down in Iceland", "A Viking farm"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Jorvik under the streets",
            text: [
              "From 1976 to 1981, archaeologists dug on a street in York called Coppergate. Several metres under the modern city, they found the Viking town of Jorvik. The ground there was damp and had very little air in it, so things that normally rot away had survived for over 1,000 years.",
              "They uncovered the wooden walls of houses and workshops, and tens of thousands of objects: leather shoes, woollen and silk cloth, wooden bowls and cups, combs made from antler, jewellery, coins and tools. Even seeds, insects and parasites survived, which told scientists what people ate and how healthy they were.",
              "Jorvik was a busy trading town of craftworkers and merchants. The name Coppergate itself comes from Old Norse and means 'street of the cup-makers'. Objects from far away, such as silk from the east and amber from the Baltic, show how widely the Vikings traded.",
              "Do not confuse Jorvik with Sutton Hoo in Suffolk. Sutton Hoo is a famous ship burial, but it is Anglo-Saxon, made around AD 625, more than 150 years before the raid on Lindisfarne. Sorting out which culture an object belongs to is an important part of a historian's job.",
            ],
          },
          {
            heading: "Viking Scotland",
            text: [
              "Norse people from Norway sailed to the north and west of Scotland from around 800. They settled in Orkney and Shetland, in Caithness, and in the Western Isles (the Outer Hebrides), where the sea routes from Norway were short and the land suited farming and fishing.",
              "Orkney became the centre of a powerful earldom ruled by Norse earls, whose story is told in the Orkneyinga saga. At Maeshowe, an ancient tomb in Orkney, Norse visitors in the 1100s carved runes on the walls, and you can still read them today. In the Western Isles, Norse and Gaelic people lived side by side and married each other, mixing their languages and cultures.",
              "The Lewis chessmen, a set of chess pieces carved from walrus ivory in the 1100s, were found on the Isle of Lewis in 1831. They were probably made in Norway, and they show how closely the islands were linked to the Norse world.",
              "These lands stayed Norse for a long time. The Western Isles passed to the Scottish king in 1266, after the Battle of Largs. Orkney and Shetland did not become part of Scotland until 1468 and 1469, and a Norse language called Norn was spoken there for centuries afterwards.",
            ],
          },
          {
            heading: "Clues in names, words and hoards",
            text: [
              "Viking settlers named the places where they lived. In England, towns and villages ending in -by (a farm or village), such as Whitby, Grimsby and Derby, or in -thorpe (a smaller, outlying settlement), such as Scunthorpe and Cleethorpes, usually have Norse names. On a map, these names cluster thickly in the old Danelaw.",
              "In Scotland, -wick comes from the Norse word for a bay, as in Lerwick and Wick, and many island names end in -ay or -a, from the Norse word for an island, such as Stronsay and Sanday in Orkney. Dingwall and Tingwall come from 'thing-field', the place where an assembly met.",
              "Our language is full of Norse words too, including sky, egg, knife, window, husband, take and even they. Window comes from 'wind-eye', a hole in the wall that let wind in.",
              "Hoards are collections of valuable things buried for safe keeping and never collected. The Cuerdale Hoard, found in Lancashire in 1840, held over 8,000 pieces of silver. The Vale of York Hoard (2007) and the Galloway Hoard in Scotland (2014) were found by metal detectorists. Coins in hoards help date them, and objects from many lands show how far the Vikings travelled and traded.",
            ],
          },
        ],
        words: [
          { word: "archaeologist", meaning: "a person who studies the past by digging up and examining remains" },
          { word: "excavation", meaning: "a careful dig to uncover things from the past" },
          { word: "hoard", meaning: "a collection of valuable things buried for safe keeping" },
          { word: "place name", meaning: "the name of a town, village or feature, which can show who named it" },
          { word: "earldom", meaning: "land ruled by an earl" },
          { word: "Norn", meaning: "the Norse language once spoken in Orkney and Shetland" },
        ],
      },
      practice: {
        intro: "Be a Viking detective.",
        questions: [
          {
            type: "pick",
            q: "Which of these place names probably come from Old Norse? There is more than one.",
            options: ["Grimsby", "Scunthorpe", "Portsmouth", "Lerwick", "Chester"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "Why did so many objects survive at Coppergate?", options: ["The ground was damp with very little air, so things did not rot", "The Vikings painted everything gold", "They were kept in a museum the whole time"], answer: 0 },
          {
            type: "match",
            q: "Match each place-name ending to its meaning.",
            pairs: [
              ["-by", "A farm or village"],
              ["-thorpe", "A smaller, outlying settlement"],
              ["-wick", "A bay"],
              ["-ay", "An island"],
            ],
          },
          { type: "choice", q: "A friend says Sutton Hoo is a famous Viking ship burial. What should you tell them?", options: ["They are right", "It is a ship burial, but it is Anglo-Saxon and older than the Viking Age", "It is a Roman fort"], answer: 1, why: "Sutton Hoo was made around AD 625, more than 150 years before Lindisfarne." },
          { type: "order", q: "Put these in order, earliest first.", items: ["Norse settlers arrive in Orkney", "Runes are carved at Maeshowe", "The Western Isles pass to the Scottish king", "Orkney and Shetland become part of Scotland"] },
        ],
      },
      task: {
        title: "Viking place-name hunt and museum label",
        intro: "Hunt for Viking clues on a map, then write a museum label for a Viking find.",
        need: ["A road atlas or online map of Britain, used with your grown-up", "Paper and a pencil", "Coloured pens"],
        steps: [
          "Look at a map of northern and eastern England, or of Orkney, Shetland and the Western Isles. Find at least ten places with Norse endings: -by, -thorpe, -thwaite, -wick or -ay.",
          "Make a tally of each ending. Which area has the most? Write two sentences explaining what this tells us about where Vikings settled.",
          "Choose one Viking find from this lesson: a leather shoe from Coppergate, a piece of silver from a hoard, or a Lewis chess piece. Draw it carefully.",
          "Write a museum label for it of about 60 to 80 words: what it is, where and when it was found, what it was made of, and what it tells us about Viking life.",
          "Finish your Viking Age timeline: add 1266 and 1469. Then write a final paragraph: 'The Vikings were more than raiders because...'",
        ],
      },
      exit: [
        { type: "choice", q: "What did archaeologists find at Coppergate in York?", options: ["A Roman bath", "The Viking town of Jorvik", "A pyramid"], answer: 1 },
        { type: "choice", q: "What does a place name ending in -by usually mean?", options: ["A farm or village", "A river", "A castle"], answer: 0 },
        { type: "pick", q: "Where in Scotland did Norse people settle? There is more than one.", options: ["Orkney", "Shetland", "The Western Isles", "The Scottish Borders only"], answers: [0, 1, 2] },
        { type: "type", q: "What do we call a collection of valuable things buried for safe keeping?", answer: ["hoard", "a hoard", "Hoard", "hoards"] },
        { type: "choice", q: "Is Sutton Hoo a Viking burial?", options: ["Yes, it is the most famous Viking burial", "No, it is Anglo-Saxon and older than the Viking Age", "No, it is Roman"], answer: 1 },
        { type: "choice", q: "When did Orkney and Shetland become part of Scotland?", options: ["In 793", "In 1066", "In 1468 and 1469"], answer: 2 },
      ],
      grownUp: {
        need: ["A road atlas or online map, with supervision", "Paper and coloured pens"],
        tips: [
          "Place names are a great way into local history. If you live in the old Danelaw or in Orkney, Shetland or the Hebrides, look for Norse names close to home.",
          "Not every -by or -wick is Norse: some -wick names, like Warwick, come from an Old English word for a farm or trading place. That is why historians say 'usually' and use several kinds of evidence together.",
          "If you can visit, the Jorvik Viking Centre in York stands on the Coppergate dig site, and National Museums Scotland in Edinburgh displays the Galloway Hoard and some of the Lewis chessmen.",
        ],
        younger: "Play 'spot the Viking name' on a map together, and draw the shoe or chess piece and talk about who might have used it.",
        older: "Research the Galloway Hoard or the Scar boat burial in Orkney, and write a short news report about its discovery.",
      },
    },
  ],
};
