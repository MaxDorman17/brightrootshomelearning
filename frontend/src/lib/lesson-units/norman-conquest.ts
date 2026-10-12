import type { LessonUnit } from "@/lib/lessons";

/**
 * The Norman Conquest, for ages 11 to 14 (KS3). The succession crisis, the battles of 1066, interpretations of why
 * William won, how the Normans took control, the Domesday Book, and the Bayeux Tapestry as a source. The Harrying of the
 * North is covered factually and without graphic detail.
 */
export const normanConquest: LessonUnit = {
  slug: "norman-conquest",
  title: "The Norman Conquest",
  short: "Normans",
  subject: "History",
  ages: "11 to 14",
  emoji: "🏰",
  color: "#6B5B4B",
  summary: "Six lessons on 1066 and after: the succession crisis and its claimants, Stamford Bridge and Hastings, why William won, castles, rebellion and the Harrying of the North, the feudal system and the Domesday Book, and the Bayeux Tapestry as evidence of change and continuity.",
  cover: "/lessons/units/norman-conquest.jpg",
  lessons: [
    {
      slug: "norman-conquest-1",
      title: "1066: a crown up for grabs",
      emoji: "👑",
      minutes: 60,
      goal: "I can explain why the death of Edward the Confessor caused a succession crisis and compare the claims of Harold Godwinson, William of Normandy and Harald Hardrada.",
      starter: [
        { type: "choice", q: "Which people ruled most of England in the centuries before 1066?", options: ["The Romans", "The Tudors", "The Stuarts", "The Anglo-Saxons"], answer: 3 },
        { type: "type", q: "In which year was the Battle of Hastings fought?", answer: "1066" },
        { type: "choice", q: "The Vikings came from Scandinavia. Which modern country was one of their homelands?", options: ["Portugal", "Greece", "Norway", "Ireland"], answer: 2 },
        { type: "choice", q: "What is a monarch?", options: ["A king or queen who rules a country", "A bishop who leads the Church", "An elected leader of Parliament", "A soldier who guards a castle"], answer: 0 },
        { type: "pick", q: "Which of these are primary sources for a historian studying 1066? There is more than one.", options: ["A chronicle written by a monk in the 1060s", "A modern textbook", "An embroidery made in the 1070s", "A film made in the 2000s"], answers: [0, 2] },
        { type: "order", q: "Put these periods in chronological order, earliest first.", items: ["Roman Britain", "Anglo-Saxon and Viking England", "Norman England", "Tudor England"] },
      ],
      learn: {
        cards: [
          {
            heading: "The death of a childless king",
            text: [
              "On 5 January 1066 King Edward of England died in London. He was later made a saint and is remembered as Edward the Confessor because of his reputation for piety. Edward had ruled since 1042, but he and his wife Edith had no children. In a hereditary monarchy, where the crown normally passes to the king's eldest son, a childless king creates a serious problem: a succession crisis.",
              "England in 1066 was one of the richest and best-organised kingdoms in Europe. It was divided into shires, each with a sheriff who collected taxes and kept order for the king. The king could raise a national land tax called the geld, and a skilled system of mints produced silver pennies. Whoever won the crown would win great wealth and power, which is exactly why several men were prepared to fight for it.",
              "There was no single written rule about who should become king. Several factors mattered: being related to the royal family (blood), being named by the dying king (nomination), being accepted by the Witan, the council of leading nobles and churchmen who advised the king, and, in the end, having the military strength to hold on to the throne.",
              "The person with the strongest blood claim was Edgar Ætheling, Edward's great-nephew. However, he was a teenager with little land, wealth or military support, and in a dangerous year the Witan wanted an experienced war leader. Edgar's claim was set aside, though he remained important later in the story.",
            ],
          },
          {
            heading: "Harold Godwinson and William of Normandy",
            text: [
              "Harold Godwinson was Earl of Wessex, the most powerful noble in England, and the brother of Queen Edith. He was an experienced soldier who had led successful campaigns in Wales. Harold claimed that, on his deathbed, Edward had named him as his successor, and the Witan accepted him. He was crowned in Westminster Abbey on 6 January 1066, the day after Edward died. Speed mattered: by acting quickly, Harold made himself the anointed king before any rival could act.",
              "William, Duke of Normandy, ruled a powerful duchy in northern France. He was a distant cousin of Edward: Edward's mother, Emma, was William's great-aunt, and Edward had spent many years in exile in Normandy. William claimed that Edward had promised him the throne in about 1051, when Edward was in conflict with Harold's family.",
              "William also claimed that in about 1064 Harold had visited Normandy, been helped by William after a shipwreck, and sworn a solemn oath on holy relics to support William's claim. To Normans, breaking such an oath was a terrible sin. English sources say less about this visit, and historians debate whether Harold swore willingly, under pressure, or at all. William persuaded Pope Alexander II to support his invasion, and the Pope sent a papal banner, which helped to present the invasion as a holy cause.",
            ],
          },
          {
            heading: "Harald Hardrada and weighing the claims",
            text: [
              "Harald Hardrada, King of Norway, was perhaps the most feared warrior in Europe. His nickname means 'hard ruler'. As a young man he had served in the elite Varangian Guard of the Byzantine emperor in Constantinople. His claim came from an agreement said to have been made between his nephew, King Magnus of Norway, and Harthacnut, who ruled England and Denmark until 1042: whichever of them died first would leave his kingdom to the other.",
              "Hardrada was encouraged by Tostig Godwinson, Harold's own brother. Tostig had been Earl of Northumbria until 1065, when the Northumbrians rebelled against his harsh rule and Harold agreed to his exile. Tostig wanted revenge and his earldom back, and he could offer Hardrada local knowledge and support.",
              "Historians weigh each claim against the same criteria. Harold had nomination, the support of the Witan and the fact of being crowned, but only a weak blood link. William had a distant blood link, an earlier promise, the alleged oath and papal support. Hardrada's claim was the weakest legally, but he had a large army, a fleet and a tradition of Scandinavian kings ruling England, including Cnut, who had been king from 1016 to 1035.",
              "Notice that much of the evidence for William's claim comes from Norman writers, such as William of Poitiers, William's own chaplain, who wrote in the 1070s to justify the conquest. When a source was written by a supporter of one side after that side had won, a historian must ask whether it is telling the whole story.",
            ],
          },
        ],
        words: [
          { word: "succession crisis", meaning: "a dispute over who should inherit the throne, usually after a monarch dies without a clear heir" },
          { word: "claimant", meaning: "a person who says they have a right to something, here the throne" },
          { word: "Witan", meaning: "the council of leading nobles and churchmen who advised the Anglo-Saxon king and helped choose a new one" },
          { word: "earl", meaning: "a powerful Anglo-Saxon noble who governed a large region, such as Wessex or Northumbria, for the king" },
          { word: "duchy", meaning: "a territory ruled by a duke, such as Normandy" },
          { word: "papal banner", meaning: "a flag sent by the Pope to show the Church's blessing on a cause" },
        ],
      },
      practice: {
        intro: "Sort out the claimants and the evidence for their claims.",
        questions: [
          {
            type: "match",
            q: "Match each claimant to the main basis of his claim.",
            pairs: [
              ["Harold Godwinson", "Named by Edward on his deathbed and chosen by the Witan"],
              ["William of Normandy", "An earlier promise from Edward and an oath sworn on relics"],
              ["Harald Hardrada", "An agreement between Magnus of Norway and Harthacnut"],
              ["Edgar Ætheling", "The closest blood relative of Edward"],
            ],
          },
          { type: "choice", q: "Why did the Witan pass over Edgar Ætheling, who had the strongest blood claim?", options: ["He was not related to Edward at all", "He lived in Norway", "He was young and lacked the wealth and military support to defend the kingdom", "He refused the crown"], answer: 2 },
          { type: "gap", q: "Fill in the gaps.", text: "Edward the Confessor died on 5 January 1066. Harold was crowned the next day in ___ Abbey. William won the support of Pope Alexander II, who sent a papal ___.", bank: ["Westminster", "Canterbury", "banner", "crown", "letter"], answers: ["Westminster", "banner"] },
          { type: "choice", q: "Which best explains why a historian should be cautious about William of Poitiers' account of Harold's oath?", options: ["He wrote in Latin", "He was William's chaplain, writing after the conquest to justify it", "He was writing hundreds of years later", "He was a Viking"], answer: 1, why: "Provenance matters: a supporter writing after victory had reasons to make William's claim look strong and Harold look like an oath-breaker." },
          { type: "pick", q: "Which factors could help a claimant become king in 1066? There is more than one.", options: ["Blood relationship to the royal family", "Being named by the dying king", "Winning an election by all adults", "Acceptance by the Witan", "Military strength"], answers: [0, 1, 3, 4] },
        ],
      },
      task: {
        title: "The 1066 claimants: a case file",
        intro: "Act as a historian advising the Witan. Build a case file on the claimants, then reach and justify a judgement.",
        need: ["Paper or a notebook", "Pens in three colours", "Optional: the internet, with a grown-up's permission"],
        steps: [
          "Draw a table with four rows (Harold, William, Hardrada, Edgar) and five columns: Blood, Nomination or promise, Support (Witan, Pope, allies), Military strength, Weaknesses.",
          "Fill in the table from the Learn cards. If you have permission to research online, add one extra fact about each man, noting the website you used.",
          "Score each claimant from 0 to 3 in each column. Use one colour for legal claims (blood, nomination) and another for practical power (support, military strength).",
          "Write a paragraph of about 150 words answering: 'Who had the strongest claim to the throne in January 1066?' Make a clear judgement in your first sentence, support it with evidence, and explain why you rejected at least one other claimant.",
          "Finally, in a third colour, write one sentence on whether the strongest legal claim and the strongest practical position belonged to the same person. What does that suggest about how 1066 was likely to be decided?",
        ],
      },
      exit: [
        { type: "choice", q: "Why did the death of Edward the Confessor cause a succession crisis?", options: ["He had several sons who argued", "He had been overthrown by the Normans", "He chose to abdicate", "He died without children, so there was no clear heir"], answer: 3 },
        { type: "type", q: "What was the name of the council of nobles and churchmen that accepted Harold as king?", answer: ["Witan", "the Witan", "witan", "Witenagemot", "witenagemot"] },
        { type: "choice", q: "Which claimant said that Harold had sworn an oath on holy relics to support him?", options: ["Harald Hardrada", "Edgar Ætheling", "Tostig", "William of Normandy"], answer: 3 },
        { type: "choice", q: "Why did Tostig support Harald Hardrada?", options: ["He had been exiled from his earldom of Northumbria and wanted revenge and power", "He was Hardrada's son", "He was paid by the Pope", "He wanted William to be king"], answer: 0 },
        { type: "pick", q: "Which were strengths of Harold Godwinson's position in January 1066? There is more than one.", options: ["He had been crowned king", "He was accepted by the Witan", "He had the closest blood link to Edward", "He was an experienced military leader"], answers: [0, 1, 3] },
        { type: "choice", q: "Which statement about the evidence for William's claim is most accurate?", options: ["Much of it comes from Norman writers who supported William", "It comes equally from English and Norman writers", "It was all written by Harold", "There is no evidence for it at all"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and pens in three colours", "Optional internet access for research"],
        tips: [
          "The key skill here is weighing claims against criteria rather than simply describing them. Ask 'What makes that claim strong?' and 'Who tells us that?'",
          "The exact details of Harold's visit to Normandy, usually dated to 1064 or 1065, are uncertain and largely come from Norman sources and the Bayeux Tapestry. It is fine to say historians disagree.",
          "Learners are often surprised that Edgar Ætheling had the best blood claim. This is a good way into the idea that in 1066 power and support mattered as much as birth.",
        ],
        younger: "Make one simple card for each claimant with a picture, where he came from, and one reason he thought he should be king. Then put the cards in order from strongest to weakest claim and say why.",
        older: "Read short extracts from the Anglo-Saxon Chronicle and William of Poitiers about Harold's succession (both are easily found online) and write a paragraph comparing how each presents Harold. This is the kind of source comparison GCSE History expects.",
      },
    },
    {
      slug: "norman-conquest-2",
      title: "Two invasions, three battles",
      emoji: "⚔️",
      minutes: 60,
      goal: "I can describe the events of Fulford, Stamford Bridge and Hastings in the right order and explain how the timing of the two invasions affected Harold.",
      starter: [
        { type: "choice", q: "On what date did Edward the Confessor die?", options: ["25 December 1066", "14 October 1066", "5 January 1066", "6 January 1066"], answer: 2 },
        { type: "match", q: "Match each claimant to where he came from.", pairs: [["Harold Godwinson", "Wessex, England"], ["William", "Normandy, France"], ["Harald Hardrada", "Norway"]] },
        { type: "choice", q: "What is the Witan?", options: ["An army of Norman knights", "A type of castle", "A tax on land", "The council of nobles and churchmen who advised the king"], answer: 3 },
        { type: "choice", q: "Who was Tostig?", options: ["Harold's exiled brother, who supported Hardrada", "William's half-brother", "The Pope", "Edward's son"], answer: 0 },
        { type: "type", q: "Who had the strongest blood claim to the throne but was passed over because he was young? (Edgar ...)", answer: ["Ætheling", "Aetheling", "aetheling", "ætheling", "Edgar Aetheling", "Edgar Ætheling", "Atheling", "atheling"] },
        { type: "choice", q: "What did Pope Alexander II send William to show his support?", options: ["A papal banner", "A fleet of ships", "A crown", "An army of knights"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Waiting for the invasion",
            text: [
              "Harold expected William to invade, so through the summer of 1066 he kept an army and a fleet on watch along the south coast. His army had two main parts. The housecarls were professional, well-armed full-time soldiers who fought with large two-handed axes. The fyrd was made up of part-time soldiers called up from the shires for a limited period, who also needed to return home to farm.",
              "Meanwhile William was preparing a huge invasion force at the mouth of the River Dives in Normandy. He gathered knights from Normandy and beyond, built or collected hundreds of ships, and transported warhorses, which was a major feat of organisation. Yet for weeks his fleet did not sail. The traditional explanation is that the wind was against him; some historians argue that William was also waiting deliberately until Harold's army had to break up.",
              "By 8 September Harold's food supplies were running out and the fyrd's period of service was over, so he sent them home and returned to London. The south coast was now largely undefended.",
            ],
          },
          {
            heading: "Fulford and Stamford Bridge",
            text: [
              "In September Harald Hardrada sailed to England with around 300 ships and was joined by Tostig. They landed in Yorkshire and on 20 September defeated the northern earls Edwin and Morcar at the Battle of Fulford, just outside York. York then surrendered to them.",
              "When news reached Harold in London, he moved with remarkable speed. He gathered his housecarls and summoned more troops as he travelled, covering roughly 185 miles north in about four or five days. On 25 September he caught the Norwegians by surprise at Stamford Bridge, east of York. According to later accounts, many of them had left their armour with the ships at Riccall because it was a hot day and they were not expecting a battle.",
              "The Battle of Stamford Bridge was long and hard fought, but it ended in a decisive English victory. Both Hardrada and Tostig were killed. The Anglo-Saxon Chronicle suggests the Norwegian survivors needed only about 24 ships to return home. Historians often treat this battle as the end of the Viking Age in England. But Harold's army had suffered losses and was exhausted.",
            ],
          },
          {
            heading: "The Battle of Hastings, 14 October 1066",
            text: [
              "On 28 September, three days after Stamford Bridge, William landed unopposed at Pevensey on the Sussex coast. He moved to Hastings, built a wooden castle, and raided the surrounding land, which was part of Harold's own family estates. This put pressure on Harold to respond quickly. Harold marched back south, gathering troops in London, and took up position on a ridge, now called Senlac Hill, about seven miles from Hastings.",
              "Each army may have had around 7,000 men, although numbers are estimates. Harold's men formed a shield wall along the top of the ridge: a line of overlapping shields that was very hard to break. William's army had three types of soldier: archers, foot soldiers and mounted knights. The battle began in the morning and lasted most of the day, which was unusually long for a medieval battle.",
              "At first the shield wall held. At one point William's Breton troops on the left retreated, and a rumour spread that William had been killed; William lifted his helmet to show his face and rally his men. Some English soldiers broke ranks to chase the retreating Normans and were cut down. Norman sources say William's knights then used feigned retreats, pretending to flee to draw more English soldiers out of the shield wall.",
              "Late in the day Harold was killed, along with his brothers Gyrth and Leofwine. How exactly Harold died is debated, as you will see later. Without its leader the English army collapsed. William did not take the crown immediately: he moved carefully around London, receiving the surrender of leading English nobles and churchmen, and was crowned in Westminster Abbey on Christmas Day 1066.",
            ],
          },
        ],
        words: [
          { word: "housecarl", meaning: "a professional, full-time Anglo-Saxon soldier who served the king or an earl" },
          { word: "fyrd", meaning: "part-time soldiers called up from the shires to serve for a limited time" },
          { word: "shield wall", meaning: "a defensive line of soldiers standing close together with overlapping shields" },
          { word: "feigned retreat", meaning: "a tactic of pretending to run away in order to draw the enemy out of position" },
          { word: "cavalry", meaning: "soldiers who fight on horseback, such as Norman knights" },
        ],
      },
      practice: {
        intro: "Check your understanding of the events and how they connect.",
        questions: [
          { type: "order", q: "Put these events of 1066 in chronological order.", items: ["Harold sends the fyrd home", "Battle of Fulford", "Battle of Stamford Bridge", "William lands at Pevensey", "Battle of Hastings", "William is crowned"] },
          { type: "gap", q: "Fill in the gaps.", text: "At Hastings the English formed a ___ wall on top of a ridge. The Normans used ___ retreats to draw English soldiers down the hill.", bank: ["shield", "stone", "feigned", "sudden", "naval"], answers: ["shield", "feigned"] },
          { type: "choice", q: "Why did William's raiding around Hastings put pressure on Harold?", options: ["It was raiding Harold's own lands and people, challenging his duty and reputation as king", "It was destroying the Witan's meeting hall", "It cut off Harold's supply of ships from Norway", "It meant William had run out of food"], answer: 0 },
          { type: "match", q: "Match each type of soldier to its description.", pairs: [["Housecarl", "Professional English soldier with a two-handed axe"], ["Fyrd", "Part-time English soldier called up from the shires"], ["Knight", "Norman soldier fighting on horseback"], ["Archer", "Soldier attacking from a distance with a bow"]] },
          { type: "choice", q: "Which statement best explains why the timing of the invasions was a problem for Harold?", options: ["Both invasions arrived on the same day in the same place", "William arrived first, so Harold could not fight Hardrada", "The invasions happened in winter", "He had to defeat one invasion in the north and then march south to face another within three weeks"], answer: 3, why: "Stamford Bridge was on 25 September, William landed on 28 September, and Hastings was on 14 October." },
        ],
      },
      task: {
        title: "Mapping the campaign of 1066",
        intro: "Make an annotated campaign map and use simple data to work out how fast armies moved.",
        need: ["An outline map of England and northern France (draw one, print one, or trace from an atlas)", "Coloured pens", "A calculator"],
        steps: [
          "Mark and label these places on your map: York, Fulford, Stamford Bridge, London, Pevensey, Hastings, and the mouth of the River Dives in Normandy. Add Norway with an arrow off the map.",
          "Draw Hardrada's route in one colour, William's in another, and Harold's marches in a third. Add the date beside each event.",
          "Use the data: London to York is roughly 185 miles, and London to Hastings is roughly 60 miles. If Harold covered 185 miles in 5 days, what was his average distance per day? Show your working. (One mile is about 1.6 km, so also convert your answer to kilometres.)",
          "Calculate how many days passed between Stamford Bridge (25 September) and Hastings (14 October). Write two sentences explaining what Harold's army had to do in that time.",
          "Add a key and a title. Then write a short caption (about 80 words) for the map explaining why the order of the two invasions mattered.",
        ],
      },
      exit: [
        { type: "choice", q: "Where did Harold defeat Harald Hardrada and Tostig?", options: ["Fulford", "Hastings", "Stamford Bridge", "Pevensey"], answer: 2 },
        { type: "type", q: "On what day and month in 1066 was the Battle of Hastings fought? (For example: 1 May)", answer: ["14 October", "14th October", "October 14", "14 october", "14 Oct", "October 14th"] },
        { type: "choice", q: "Why had Harold sent the fyrd home on 8 September?", options: ["He had already defeated William", "Their service period was over and food supplies were running out", "They had refused to fight Vikings", "The Pope ordered him to"], answer: 1 },
        { type: "choice", q: "What was the shield wall?", options: ["A stone wall around London", "A wooden castle built by William", "A row of ships", "A line of soldiers with overlapping shields"], answer: 3 },
        { type: "pick", q: "Which of these happened at the Battle of Hastings? There is more than one.", options: ["A rumour spread that William had been killed", "Harald Hardrada was killed", "English soldiers broke ranks to chase retreating Normans", "Harold was killed late in the day"], answers: [0, 2, 3] },
        { type: "choice", q: "When was William crowned king?", options: ["Christmas Day 1066", "6 January 1066", "14 October 1066", "Easter 1067"], answer: 0 },
      ],
      grownUp: {
        need: ["An outline map of England and northern France", "Coloured pens and a calculator"],
        tips: [
          "This is a battle lesson, but the focus is on sequence, decisions and consequences. The lesson does not describe injuries.",
          "Numbers for armies, ships and distances in 1066 are estimates. Encourage your learner to use words like 'around' and 'about' and to notice which numbers come from medieval writers.",
          "Strong answers link events: 'Because Harold had to fight at Stamford Bridge, his army was...'. Praise causal language.",
        ],
        younger: "Use five sticky notes, one for each main event, and arrange them in order on a wall map. Talk through each move before writing anything.",
        older: "Research how historians reconstruct the site of the Battle of Hastings. Some have suggested the fighting took place somewhere other than the traditional site at Battle Abbey. Write a paragraph on what kinds of evidence (written, archaeological, landscape) would settle the question.",
      },
    },
    {
      slug: "norman-conquest-3",
      title: "Why did William win?",
      emoji: "⚖️",
      minutes: 60,
      goal: "I can explain different factors behind William's victory, compare historians' interpretations, and reach a supported judgement on the most important reason.",
      starter: [
        { type: "choice", q: "Where did William land on 28 September 1066?", options: ["York", "Dover", "Pevensey", "London"], answer: 2 },
        { type: "order", q: "Put these in order, earliest first.", items: ["Battle of Fulford", "Battle of Stamford Bridge", "Battle of Hastings"] },
        { type: "choice", q: "What were housecarls?", options: ["Norman archers", "Part-time soldiers from the shires", "Viking sailors", "Professional, full-time English soldiers"], answer: 3 },
        { type: "choice", q: "What is a feigned retreat?", options: ["Pretending to run away to draw the enemy out", "Running away to surrender", "Building a castle quickly", "Attacking at night"], answer: 0 },
        { type: "type", q: "What was the name of the defensive line of overlapping shields used by the English at Hastings? (The shield ...)", answer: ["wall", "shield wall", "Shield wall", "Wall"] },
        { type: "choice", q: "Who was killed at the Battle of Stamford Bridge along with Harald Hardrada?", options: ["Edgar Ætheling", "Tostig", "William", "Harold"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Skill, luck or mistakes?",
            text: [
              "Historians usually group the reasons for William's victory into three broad factors. The first is William's leadership and his army. He planned the invasion carefully, built a fleet, brought horses across the Channel, gained the Pope's backing, and won over knights from beyond Normandy with the promise of land. On the battlefield he used a combined army of archers, infantry and cavalry, and he kept control when panic spread.",
              "The second is luck. The wind delayed William, which turned out to be fortunate: he crossed after Harold had dismissed the fyrd and just after Hardrada had invaded the north. The invasions fell in the worst possible order for Harold. Even at Hastings, chance played its part: had Harold not been killed, the English might have held the ridge until nightfall and gathered reinforcements.",
              "The third is Harold's own decisions. He rushed south instead of waiting in London for more troops to arrive, so some of his soldiers were tired and some were missing. Some historians think he was trying to surprise William as he had surprised Hardrada. Others argue that he had to act quickly to protect his people in Sussex and to show he was a strong king.",
            ],
          },
          {
            heading: "Interpretations: why historians disagree",
            text: [
              "An interpretation is a view of the past constructed by a historian, writer or film-maker from the evidence. Interpretations of 1066 differ because the evidence is limited and often partial, because writers ask different questions, and because they bring different ideas about what matters in history.",
              "Writers in the generations after the Conquest tended to explain it as God's judgement. Norman writers such as William of Poitiers presented William as a righteous duke punishing Harold, the oath-breaker. Some English writers saw the defeat as God's punishment for the sins of the English. In the Victorian period, some historians argued about whether the Normans had destroyed ancient English freedoms or brought energy and order to a weaker kingdom.",
              "Modern historians tend to emphasise how close the result was. Many point out that Harold came within hours of holding his position, so they give a large role to luck and to the events of the day. Others stress William's long preparation and ruthless determination, arguing that he would have kept trying even if he had been held at Hastings. Both sides use the same core evidence but weigh it differently.",
            ],
          },
          {
            heading: "Building a historical argument",
            text: [
              "A good historical explanation does not just list reasons. It shows how factors connect and makes a judgement about which mattered most. For example, luck over the timing of the invasions made Harold's decision to rush south more risky, and William's leadership allowed him to make the most of that luck.",
              "To judge importance, historians ask questions such as: Without this factor, would the outcome have changed? Did this factor make others possible? Is the evidence for it strong, or does it rely on one biased source? A factor that was necessary for the result is usually more significant than one that just made it a little easier.",
              "Strong writing uses a clear structure. A common pattern is point, evidence, explanation, link: state your point, support it with precise evidence, explain how it caused William's victory, then link it back to the question or to another factor. Your conclusion should give an overall judgement and explain why the deciding factor outweighs the others.",
            ],
          },
        ],
        words: [
          { word: "factor", meaning: "one of the causes or influences that helped to bring about an event" },
          { word: "interpretation", meaning: "a view or account of the past constructed by a historian or other writer from the evidence" },
          { word: "significance", meaning: "how important something was, judged by its effects and consequences" },
          { word: "judgement", meaning: "a reasoned conclusion that weighs evidence and arguments" },
          { word: "partial", meaning: "favouring one side, or giving only part of the picture" },
        ],
      },
      practice: {
        intro: "Sort the evidence and test the arguments.",
        questions: [
          { type: "match", q: "Match each piece of evidence to the factor it best supports.", pairs: [["The wind delayed William until after the fyrd went home", "Luck"], ["William brought archers, infantry and cavalry", "William's leadership and army"], ["Harold marched south without waiting for more troops", "Harold's decisions"], ["William gained a papal banner", "William's preparation and support"]] },
          { type: "choice", q: "Why did Norman writers like William of Poitiers emphasise Harold's oath?", options: ["To show that William's invasion was a just cause and Harold was an oath-breaker", "Because Harold wrote about it himself", "To criticise William", "Because the oath was recorded in the Domesday Book"], answer: 0 },
          { type: "pick", q: "Which are good questions for judging how important a factor was? There is more than one.", options: ["Would the outcome have been different without it?", "Did it make other factors possible?", "Is it the longest paragraph in the textbook?", "Is the evidence for it reliable?"], answers: [0, 1, 3] },
          { type: "choice", q: "Which statement is an interpretation rather than a fact?", options: ["The Battle of Hastings was fought on 14 October 1066", "Harold was killed at Hastings", "William won mainly because of luck", "William was crowned on Christmas Day 1066"], answer: 2, why: "A fact can be checked against the evidence; an interpretation is a judgement that people can reasonably argue about." },
          { type: "gap", q: "Fill in the gaps.", text: "A strong paragraph makes a point, gives precise ___, explains how it caused the result, and ___ back to the question.", bank: ["evidence", "opinions", "links", "jumps", "pictures"], answers: ["evidence", "links"] },
        ],
      },
      task: {
        title: "Extended writing: luck, skill or mistakes?",
        intro: "Write a structured essay answering the question: 'William won the Battle of Hastings mainly because of luck.' How far do you agree?",
        need: ["Paper or a laptop", "Three colours of highlighter or pen", "Your notes from lessons 1 to 3"],
        steps: [
          "Make three columns headed Luck, William's leadership and Harold's decisions. Add at least three pieces of precise evidence to each, with dates or names.",
          "Draw arrows between columns where one factor links to another, and write a few words on each arrow explaining the connection.",
          "Decide your overall argument. Write it as one sentence that answers 'how far', for example 'to some extent' or 'only to a limited extent', and gives your main reason.",
          "Write an introduction (2 to 3 sentences), three paragraphs using point, evidence, explanation, link, and a conclusion. Aim for about 500 to 600 words.",
          "Highlight your work in three colours: evidence in one, explanation in another, judgement in the third. If one colour is missing from a paragraph, improve that paragraph.",
        ],
      },
      exit: [
        { type: "choice", q: "Which is an example of luck helping William?", options: ["He gained the Pope's support", "He used archers and cavalry", "He built a fleet", "His crossing was delayed until after the fyrd went home and Hardrada had invaded"], answer: 3 },
        { type: "type", q: "What word do historians use for a view of the past constructed from the evidence?", answer: ["interpretation", "an interpretation", "Interpretation"] },
        { type: "choice", q: "Why might Harold have marched south so quickly?", options: ["To protect his lands and people from William's raiding and to try to surprise him", "Because William had already captured London", "Because the Witan ordered him to stay away", "Because he had heard William had gone home"], answer: 0 },
        { type: "pick", q: "Why do interpretations of 1066 differ? There is more than one.", options: ["The evidence is limited and often partial", "Historians ask different questions", "Historians weigh the same evidence differently", "Nobody knows who won"], answers: [0, 1, 2] },
        { type: "choice", q: "How did writers soon after the Conquest often explain William's victory?", options: ["As the result of better weather forecasts", "As a result of economic changes", "As God's judgement", "As an accident nobody could explain"], answer: 2 },
        { type: "choice", q: "Which makes a factor most significant in a historical argument?", options: ["It is mentioned first in the sources", "It was necessary for the outcome and made other factors possible", "It is the most exciting", "It happened last"], answer: 1 },
      ],
      grownUp: {
        need: ["Notes from the first three lessons", "Highlighters or coloured pens"],
        tips: [
          "This is the key extended-writing lesson of the unit, and the essay may take longer than an hour. It is fine to plan in this session and write in the next.",
          "Push for a real judgement. 'All the factors were important' is a weak conclusion; 'Luck created the opportunity, but William's leadership turned it into victory' is a strong one.",
          "Read the essay aloud together. Hearing it often reveals where an explanation is missing.",
        ],
        younger: "Use sentence starters: 'One reason William won was...', 'This helped him because...', 'The most important reason was... because...'. Aim for three good paragraphs rather than a long essay.",
        older: "Find two short modern interpretations of why William won (for example from a reputable history website or a museum) and write a paragraph explaining how and why they differ. Comparing interpretations is a GCSE assessment objective.",
      },
    },
    {
      slug: "norman-conquest-4",
      title: "Castles, rebellion and the Harrying of the North",
      emoji: "🏯",
      minutes: 60,
      goal: "I can explain how William used castles and force to take control of England, and describe the causes and consequences of the Harrying of the North.",
      starter: [
        { type: "pick", q: "Which three broad factors do historians use to explain William's victory? There is more than one.", options: ["Luck", "William's leadership and army", "Harold's decisions", "The Domesday Book"], answers: [0, 1, 2] },
        { type: "choice", q: "What is an interpretation?", options: ["A view of the past constructed from the evidence", "A primary source", "A date in a timeline", "A type of battle tactic"], answer: 0 },
        { type: "choice", q: "Why did William's crossing come at a fortunate time?", options: ["Harold was abroad", "The English had no king", "It was winter", "The fyrd had gone home and Hardrada had just invaded the north"], answer: 3 },
        { type: "choice", q: "Which writer was William's chaplain and wrote in support of him?", options: ["Orderic Vitalis", "Alcuin", "William of Poitiers", "Bede"], answer: 2 },
        { type: "type", q: "Where was William crowned on Christmas Day 1066? (... Abbey)", answer: ["Westminster", "Westminster Abbey", "westminster", "westminster abbey"] },
        { type: "choice", q: "Which is the strongest conclusion to an essay on why William won?", options: ["All the factors were important.", "Luck created the opportunity, but William's leadership turned it into victory.", "William won the battle.", "There were lots of reasons."], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "A small army in a large country",
            text: [
              "Being crowned did not mean William controlled England. He had perhaps 10,000 followers, far fewer than the English population of around two million, and many English nobles were still powerful. William's challenge was to turn a single victory into lasting control.",
              "At first William tried to work with the English elite. Some earls, such as Edwin and Morcar, kept their lands, and English officials such as sheriffs continued in office. But William also confiscated the lands of those who had fought against him at Hastings and gave them to his followers, and he imposed heavy taxes.",
              "Resistance broke out in many places between 1067 and 1071. Exeter rebelled in 1068 and was besieged. In the north, rebels supported by a Danish fleet captured York in 1069. In the Fens of East Anglia, an English thegn called Hereward, later known as Hereward the Wake, held out at Ely until 1071. Each rebellion was put down, and each failure led to more land passing to Normans.",
            ],
          },
          {
            heading: "Castles: controlling the land",
            text: [
              "The Normans' most important tool of control was the castle. Castles had been rare in England before 1066, but the Normans built them rapidly: by around 1100 there were perhaps 500. Most early castles were motte and bailey castles. The motte was a large earth mound with a wooden tower on top, and the bailey was an enclosed yard below, protected by a ditch and a wooden fence called a palisade, where soldiers, horses and stores were kept.",
              "Motte and bailey castles could be built in a few weeks using local labour, often forced. They were placed at strategic points: in towns, at river crossings and along main roads, so that small Norman garrisons could watch the population, collect taxes and launch mounted patrols. In towns such as York and Lincoln, English houses were demolished to make room for them.",
              "As control became more secure, many wooden castles were rebuilt in stone. Great stone keeps, such as the White Tower at the Tower of London, begun in the 1070s, were designed to impress as well as defend. They were permanent reminders, visible for miles, of who now held power.",
            ],
          },
          {
            heading: "The Harrying of the North, 1069 to 1070",
            text: [
              "The north of England had a strong regional identity, close links with Scandinavia and a history of resisting southern kings. In 1069 rebels, supported by Edgar Ætheling and a Danish fleet, attacked York and killed the Norman garrison. William marched north, retook York, and then, over the winter of 1069 to 1070, carried out a deliberate campaign to stop the north from ever rebelling again. It became known as the Harrying of the North.",
              "William's soldiers destroyed villages, crops, farm animals, ploughs and stored food across large areas of Yorkshire and beyond. Without food or the means to grow it, many people died in the famine that followed, and others fled as refugees. This was a scorched-earth policy: it targeted the land that supported the population, not just armed rebels.",
              "Orderic Vitalis, a monk born in England in 1075 to a Norman father and an English mother, wrote about these events in the early twelfth century. He estimated that over 100,000 people died and criticised William severely, even though he generally admired the Normans. Historians treat his figure with caution, as medieval writers often used large round numbers and he was writing about 50 years later.",
              "Other evidence supports the scale of the damage. In 1086 the Domesday Book recorded many places in Yorkshire as 'waste', meaning they produced little or no value. Historians debate how much of this was caused by the Harrying and how much by other factors, but most agree it was one of the harshest acts of William's reign. The north did not rebel against him again.",
            ],
          },
        ],
        words: [
          { word: "rebellion", meaning: "an organised, armed attempt to resist or overthrow a ruler" },
          { word: "motte and bailey", meaning: "an early Norman castle made of an earth mound with a tower (motte) and an enclosed yard (bailey)" },
          { word: "garrison", meaning: "a group of soldiers stationed in a castle or town to defend and control it" },
          { word: "keep", meaning: "the strong main tower of a castle, often rebuilt in stone" },
          { word: "harrying", meaning: "laying waste to an area to destroy its ability to resist" },
          { word: "scorched earth", meaning: "a policy of destroying crops, animals and resources so that people in an area cannot survive or resist" },
        ],
      },
      practice: {
        intro: "Analyse how William secured his control.",
        questions: [
          { type: "match", q: "Match each part of a motte and bailey castle to its description.", pairs: [["Motte", "A large earth mound with a tower on top"], ["Bailey", "An enclosed yard for soldiers, horses and stores"], ["Palisade", "A wooden fence protecting the castle"], ["Keep", "The strong main tower, later often built in stone"]] },
          { type: "order", q: "Put these events in chronological order.", items: ["William is crowned", "Exeter rebels and is besieged", "Rebels and a Danish fleet capture York", "The Harrying of the North", "Hereward holds out at Ely until defeat"] },
          { type: "choice", q: "Why were motte and bailey castles so effective in the years after 1066?", options: ["They were quick to build and let small garrisons control towns, roads and river crossings", "They were impossible to attack", "They were built by English nobles", "They were made entirely of stone"], answer: 0 },
          { type: "choice", q: "Which evidence best supports the claim that the Harrying caused long-term damage?", options: ["Many Yorkshire places were recorded as 'waste' in the Domesday Book in 1086", "William was crowned at Westminster", "The Bayeux Tapestry shows the Battle of Hastings", "Orderic Vitalis had a Norman father"], answer: 0, why: "Domesday, compiled 16 years later, gives independent evidence of damage, though historians debate all its causes." },
          { type: "pick", q: "Why should historians treat Orderic Vitalis' figure of over 100,000 deaths with caution? There is more than one.", options: ["He wrote about 50 years after the events", "Medieval writers often used large round numbers", "He was William's chaplain", "There was no census to count the dead"], answers: [0, 1, 3] },
        ],
      },
      task: {
        title: "Design and evaluate a Norman castle",
        intro: "Plan a motte and bailey castle for a real place, then evaluate how castles helped William control England.",
        need: ["Paper, a pencil and a ruler", "Optional: modelling materials such as card, clay or sand", "Optional: the internet, with a grown-up's permission"],
        steps: [
          "Choose a site: a town near you, or one of these Norman castle towns: York, Lincoln, Durham, Norwich or Exeter. If you have permission to research online, find out whether a Norman castle was built there and when.",
          "Draw a labelled plan of your castle, showing the motte, tower, bailey, ditch, palisade and gate. Add notes explaining why you chose the position (river, road, high ground, town).",
          "If you like, build a small model, for example a mound of sand or clay with a card tower and a fence of lolly sticks.",
          "Write a short report (about 250 words) answering: 'How did castles help the Normans control England?' Include at least two of these: speed of building, location, garrisons, symbolism of power, and later rebuilding in stone.",
          "End with one sentence comparing castles with the Harrying of the North as methods of control: which was more effective in the long term, and at what cost?",
        ],
      },
      exit: [
        { type: "choice", q: "What was the motte of a motte and bailey castle?", options: ["The enclosed yard", "The water-filled ditch", "A large earth mound with a tower on top", "The castle gate"], answer: 2 },
        { type: "pick", q: "Which were places of rebellion against William between 1067 and 1071? There is more than one.", options: ["Exeter", "York", "Ely", "Bayeux"], answers: [0, 1, 2] },
        { type: "choice", q: "Which best describes the Harrying of the North?", options: ["A single battle near York", "A peaceful treaty with northern rebels", "A deliberate campaign of destroying villages, crops and animals to stop rebellion", "A tax survey of northern England"], answer: 2 },
        { type: "type", q: "Which monk, writing in the early twelfth century, estimated that over 100,000 people died as a result of the Harrying? (Orderic ...)", answer: ["Vitalis", "Orderic Vitalis", "vitalis", "orderic vitalis"] },
        { type: "choice", q: "What did the Domesday Book record about many places in Yorkshire in 1086?", options: ["That they were the richest in England", "That they had stone castles", "That they had rebelled again", "That they were 'waste', producing little or no value"], answer: 3 },
        { type: "choice", q: "Why did William build castles in towns and at river crossings?", options: ["So small garrisons could control people and movement and collect taxes", "To give English nobles somewhere to live", "Because the Pope told him to", "To store the Domesday Book"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and pencil", "Optional modelling materials", "Optional internet access"],
        tips: [
          "The Harrying of the North caused great suffering, including famine. The lesson is factual and avoids graphic detail. If your learner wants to talk about how people can carry out such acts, it is a worthwhile conversation about power and violence in history.",
          "Orderic Vitalis' figure of over 100,000 deaths is widely quoted but cannot be verified; most historians accept the devastation was severe while treating the number cautiously.",
          "If you visit a castle site, many Norman mottes still survive as grassy mounds, and many are free to visit. Ask your learner to work out where the bailey was.",
        ],
        younger: "Focus on the castle: draw and label a motte and bailey, then write three sentences on how it helped a small number of Normans control a town.",
        older: "Research one rebellion in depth (Exeter 1068, York 1069 or Hereward at Ely) and write an analytical paragraph on why it failed. Consider leadership, geography, timing and William's response.",
      },
    },
    {
      slug: "norman-conquest-5",
      title: "Land, lords and the Domesday Book",
      emoji: "📜",
      minutes: 60,
      goal: "I can explain how the feudal system and the Domesday Book helped William control England, and use Domesday as historical evidence.",
      starter: [
        { type: "choice", q: "What was the bailey of a motte and bailey castle?", options: ["A stone tower", "An earth mound", "A moat full of water", "An enclosed yard for soldiers, horses and stores"], answer: 3 },
        { type: "choice", q: "When did the Harrying of the North take place?", options: ["Summer 1066", "Winter 1069 to 1070", "1086", "1100"], answer: 1 },
        { type: "type", q: "What word means a group of soldiers stationed in a castle?", answer: ["garrison", "a garrison", "Garrison"] },
        { type: "choice", q: "Who held out against the Normans at Ely until 1071?", options: ["Tostig", "Harold", "Edgar Ætheling", "Hereward"], answer: 3 },
        { type: "choice", q: "What is a scorched-earth policy?", options: ["Building castles out of burnt wood", "Destroying crops, animals and resources so people cannot survive or resist", "Farming land after a fire", "Collecting taxes in coal"], answer: 1 },
        { type: "pick", q: "Why should historians be cautious about Orderic Vitalis' death toll for the Harrying? There is more than one.", options: ["He wrote about 50 years later", "Medieval writers often used large round numbers", "He was a Viking", "There was no census to count the dead"], answers: [0, 1, 3] },
      ],
      learn: {
        cards: [
          {
            heading: "The feudal system",
            text: [
              "After the Conquest, William claimed that all the land in England belonged to the king. He kept a large share for himself and granted the rest to his leading followers, the tenants-in-chief: barons and senior churchmen such as bishops and abbots. In return, they swore homage and fealty, a solemn promise of loyalty, and agreed to provide the king with a set number of knights when needed.",
              "The tenants-in-chief in turn granted parts of their land to knights, who promised military service in return. At the bottom were the peasants, the great majority of the population, who worked the land. Many were villeins, unfree peasants who held land from their lord in return for working on his land for part of the week and paying dues, and who could not leave the manor without permission.",
              "Historians use the term 'feudal system' as a model to describe this web of land and obligations. It is a simplification: the arrangements were messier in practice, and similar relationships of lordship existed in England before 1066. But the Normans tied landholding and military service together more systematically, and the result was a powerful network of loyalty to the king.",
              "The change at the top was dramatic. By 1086 the English held only a small fraction of the land, perhaps about 5 per cent, and almost all the great landholders were Norman or French. At the Oath of Salisbury in 1086, William also had major landholders, including those below the tenants-in-chief, swear loyalty directly to him.",
            ],
          },
          {
            heading: "Why William ordered the Domesday survey",
            text: [
              "At Christmas 1085, while at Gloucester, William held what the Anglo-Saxon Chronicle calls a 'deep speech' with his council and ordered a survey of England. At the time he faced a threatened invasion from King Cnut IV of Denmark and had brought a large army of mercenaries to England, which he needed to pay and feed.",
              "In 1086 royal commissioners travelled around England in groups, each covering a circuit of several counties. In each area, juries of local people, both Norman and English, answered questions under oath: who held this land in 1066, and who holds it now? How many ploughs, villagers, mills, fishponds and woods are there? What is it worth now, and what was it worth before?",
              "The survey had several likely purposes: to know how much tax, especially the geld, could be raised; to record who held what, settling disputes over land; and to understand the military resources of the kingdom. It also had a political message: the new regime could see and record every manor.",
            ],
          },
          {
            heading: "Domesday as evidence",
            text: [
              "The results were written up in Latin in two volumes, Great Domesday and Little Domesday (covering Essex, Norfolk and Suffolk in more detail). Together they record over 13,000 places. The name 'Domesday' was used by the twelfth century, a reference to the Day of Judgement, because its verdict was final. William died in 1087, before the work was completely finished. The volumes are kept today at The National Archives in Kew, London.",
              "For historians, Domesday is an extraordinary source, giving a detailed snapshot of England in 1086 and, through its comparisons, in 1066. It allows historians to measure the replacement of the English landholding class, the scale of destruction in the north, the number of mills and ploughs, and the presence of enslaved people, who made up roughly a tenth of the recorded population.",
              "It also has limits. Some areas were left out, including most of the far north (such as Northumberland and County Durham) and the cities of London and Winchester. It counts mainly heads of household, so historians must multiply its figures to estimate the total population, at perhaps between 1.5 and 2.5 million. It records what the king's officials wanted to know, not everything about people's lives. Like every source, it must be read with its purpose in mind.",
            ],
          },
        ],
        words: [
          { word: "feudal system", meaning: "a historians' model of medieval society in which land was granted in return for loyalty and service" },
          { word: "tenant-in-chief", meaning: "a baron or senior churchman who held land directly from the king" },
          { word: "homage and fealty", meaning: "a ceremony and oath in which a person promised loyalty to their lord" },
          { word: "villein", meaning: "an unfree peasant who held land from a lord in return for labour and dues" },
          { word: "manor", meaning: "an estate held by a lord, with its village, fields and peasants" },
          { word: "geld", meaning: "a national land tax collected by English kings before and after 1066" },
        ],
      },
      practice: {
        intro: "Test your understanding of land, power and evidence.",
        questions: [
          { type: "order", q: "Put these groups in order from the top of the feudal system to the bottom.", items: ["The king", "Tenants-in-chief (barons and bishops)", "Knights", "Peasants"] },
          { type: "match", q: "Match each person to what they owed in return for land.", pairs: [["A baron", "A set number of knights for the king's army"], ["A knight", "Military service to his lord"], ["A villein", "Labour on the lord's land and dues"]] },
          { type: "pick", q: "Which were likely purposes of the Domesday survey? There is more than one.", options: ["To work out how much tax could be raised", "To record who held land and settle disputes", "To understand the military resources of the kingdom", "To count the number of castles in France"], answers: [0, 1, 2] },
          { type: "gap", q: "Fill in the gaps.", text: "William ordered the survey at Christmas 1085 at ___. The results were written in ___ and are kept today at The National Archives.", bank: ["Gloucester", "Hastings", "Latin", "French", "English"], answers: ["Gloucester", "Latin"] },
          { type: "choice", q: "Which is a limitation of the Domesday Book as evidence?", options: ["It was written after the Battle of Hastings", "It was written by the Vikings", "It has no information about land", "It leaves out some areas, including London and much of the far north, and counts mainly heads of household"], answer: 3, why: "A limitation is something that restricts what a source can tell us. Knowing these helps historians use Domesday carefully." },
        ],
      },
      task: {
        title: "Investigate your area in Domesday",
        intro: "Use a free online version of the Domesday Book to investigate a place near you and turn its entry into data.",
        need: ["A computer, tablet or phone with internet access, with a grown-up's permission", "The free Open Domesday website (opendomesday.org), which works in a browser", "Paper and a pencil"],
        steps: [
          "With a grown-up's permission, open opendomesday.org and search for your town or a village near you. If your place is not listed, try a nearby village, or choose any place in England. (Scotland and Wales, and some northern English counties, are not covered.)",
          "Record the data for your place in a table: who held the land in 1066 and in 1086, the number of households, ploughlands or ploughs, any mills, woodland or other resources, and its value in 1066 and 1086.",
          "Analyse the data. Was the lord in 1086 English or Norman? Did the value go up, down or stay the same? What might explain the change?",
          "If you have time, compare your place with a village in Yorkshire, for example one recorded as waste. What does the comparison suggest about the effects of the Harrying of the North?",
          "Write about 200 words on: 'What can the Domesday entry tell us about the effects of the Norman Conquest on this place, and what can it not tell us?'",
        ],
      },
      exit: [
        { type: "choice", q: "Who was at the top of the feudal system?", options: ["The Pope", "The tenants-in-chief", "The king", "The sheriffs"], answer: 2 },
        { type: "type", q: "What name is given to an unfree peasant who held land from a lord in return for labour?", answer: ["villein", "a villein", "Villein", "villeins"] },
        { type: "choice", q: "When was the Domesday survey carried out?", options: ["1066", "1070", "1086", "1100"], answer: 2 },
        { type: "pick", q: "Which questions did the Domesday commissioners ask? There is more than one.", options: ["Who held this land in 1066?", "Who holds it now?", "What is it worth?", "Which claimant did you support in 1066?"], answers: [0, 1, 2] },
        { type: "choice", q: "Why is the feudal system described as a model?", options: ["Because it is a simplified description historians use for a messier reality", "Because it was built from clay", "Because it was invented in 2000", "Because only the king understood it"], answer: 0 },
        { type: "choice", q: "What does the Domesday Book show about English landholders by 1086?", options: ["They held almost all the land", "They held about half the land", "They held only a small fraction of the land", "They held all the land in the north"], answer: 2 },
      ],
      grownUp: {
        need: ["Internet access for the Open Domesday website (free, browser-based)", "Paper and pencil"],
        tips: [
          "Open Domesday (opendomesday.org) is a free academic resource and needs no account. Please supervise internet use as you normally would.",
          "Domesday entries are short and use terms such as hides, ploughlands and villans. The site has a glossary; encourage your learner to look up unfamiliar terms rather than guess.",
          "The lesson mentions enslaved people recorded in Domesday. Slavery existed in Anglo-Saxon England and declined in the decades after the Conquest. It is worth pausing on this if your learner is curious.",
        ],
        younger: "Use the feudal pyramid: draw it and add one sentence at each level about what that person gave and received. Then look at one Domesday entry together and find three facts in it.",
        older: "Compare the values in 1066 and 1086 for five places in different counties and calculate the percentage change for each. Write a paragraph explaining what the pattern suggests, and what other evidence you would need to be sure.",
      },
    },
    {
      slug: "norman-conquest-6",
      title: "The Bayeux Tapestry and the legacy of 1066",
      emoji: "🧵",
      minutes: 60,
      goal: "I can analyse the Bayeux Tapestry as a historical source and reach a judgement on how much England changed, and stayed the same, after 1066.",
      starter: [
        { type: "order", q: "Put these groups in order from the top of the feudal system to the bottom.", items: ["The king", "Tenants-in-chief", "Knights", "Peasants"] },
        { type: "choice", q: "What was homage and fealty?", options: ["A tax on land", "A type of castle", "A ceremony and oath of loyalty to a lord", "A court for settling disputes"], answer: 2 },
        { type: "type", q: "In which year was the Domesday survey carried out?", answer: "1086" },
        { type: "choice", q: "In which language was the Domesday Book written?", options: ["English", "Latin", "French", "Old Norse"], answer: 1 },
        { type: "pick", q: "Which places were left out of the Domesday Book? There is more than one.", options: ["London", "Winchester", "Most of the far north of England", "Yorkshire"], answers: [0, 1, 2] },
        { type: "choice", q: "Where did William order the Domesday survey at Christmas 1085?", options: ["Westminster", "York", "Bayeux", "Gloucester"], answer: 3 },
      ],
      learn: {
        cards: [
          {
            heading: "What is the Bayeux Tapestry?",
            text: [
              "The Bayeux Tapestry is one of the most famous objects from medieval Europe. Strictly speaking it is not a tapestry, which is woven, but an embroidery: coloured woollen threads stitched onto long strips of linen. It is about 70 metres long and about 50 centimetres high, and it tells the story of 1066 in more than 50 scenes, from Harold's journey to Normandy to the Battle of Hastings.",
              "It was probably made in the 1070s, within a few years of the events it shows. Most historians think it was commissioned by Bishop Odo of Bayeux, William's half-brother, who appears prominently in it and who fought at Hastings. Many think it was stitched in England, perhaps at Canterbury, by skilled English embroiderers. It has been kept in Bayeux, in Normandy, for most of its history.",
              "The scenes have short Latin captions and borders filled with animals, fables and, in the battle scenes, fallen soldiers and weapons. It shows ships being built, horses being transported, a feast, Halley's Comet (which appeared in April 1066), and the battle itself. The final section is missing, so we do not know exactly how it originally ended.",
            ],
          },
          {
            heading: "Reading the Tapestry as a source",
            text: [
              "Historians assess any source by asking about its provenance (who made it, when and why), its content (what it shows) and its context. The Tapestry was made for a Norman patron soon after the Conquest, so it largely tells the story from the Norman point of view: Harold swears an oath on holy relics, becomes king, and is defeated, which presents the conquest as justified.",
              "Yet it is not simply propaganda. It shows Harold as brave, rescuing Norman soldiers from quicksand during a campaign in Brittany, and it is ambiguous at key moments. For example, it does not make clear exactly what Edward said on his deathbed. Some historians suggest the English embroiderers may have included subtle details that an English viewer would read differently from a Norman one.",
              "The most famous debate concerns Harold's death. A figure under the words 'Harold the king is killed' appears to hold an arrow near his eye, and the next figure is struck down by a mounted knight. Historians disagree about whether Harold is the first figure, the second, or both shown in sequence. The Tapestry was also repaired and restored in the eighteenth and nineteenth centuries, and some think the arrow may have been altered then. Early sources disagree too, so the story of the arrow in the eye is uncertain.",
            ],
          },
          {
            heading: "Change and continuity after 1066",
            text: [
              "The Conquest brought major changes. A new ruling class of Norman and French barons replaced the English nobility almost completely. Hundreds of castles changed the landscape. The Church was reorganised: William replaced English bishops and abbots with Normans, such as Lanfranc, who became Archbishop of Canterbury in 1070, and great new cathedrals in the Romanesque style, such as Durham, were begun. French became the language of the court and the elite, and Latin replaced English in most official documents.",
              "But there was also important continuity. Most people were still English peasants, farming the same fields in the same villages, and the yearly rhythm of rural life carried on. William kept the shires, the sheriffs, the local courts, the geld and the system of minting coins, because they worked well and helped him rule. English remained the everyday language of the vast majority.",
              "Some changes developed over a longer time. English absorbed thousands of French words, which is why English often has pairs like 'cow' and 'beef', 'pig' and 'pork', and 'sheep' and 'mutton': the animals kept English names, while the meat served at Norman tables took French ones. Slavery, recorded in Domesday, declined in the decades after the Conquest.",
              "Historians judge change and continuity by asking: change for whom, how quickly, and how deeply? For a great English landholder, 1066 was a catastrophe. For a peasant in a village untouched by rebellion, daily life may have looked much the same, though with a new lord and perhaps heavier demands. For people in the north, the Harrying brought devastating change.",
            ],
          },
        ],
        words: [
          { word: "embroidery", meaning: "decoration made by stitching coloured threads onto fabric" },
          { word: "provenance", meaning: "the origin of a source: who made it, when, where and why" },
          { word: "propaganda", meaning: "information designed to persuade people to support a particular side or view" },
          { word: "ambiguous", meaning: "open to more than one interpretation" },
          { word: "continuity", meaning: "things that stayed the same over a period of time" },
          { word: "patron", meaning: "a person who pays for and commissions a work of art" },
        ],
      },
      practice: {
        intro: "Analyse the Tapestry and weigh up the changes.",
        questions: [
          { type: "choice", q: "Why is the Bayeux Tapestry not strictly a tapestry?", options: ["It is painted", "It is an embroidery, stitched rather than woven", "It is made of paper", "It was made in the twentieth century"], answer: 1 },
          { type: "pick", q: "Which are examples of continuity after 1066? There is more than one.", options: ["Shires and sheriffs", "Most people remained English peasants farming the land", "A new Norman ruling class", "The geld land tax"], answers: [0, 1, 3] },
          { type: "match", q: "Match each change to the area of life it affected.", pairs: [["Lanfranc becomes Archbishop of Canterbury", "The Church"], ["French spoken at court", "Language"], ["Motte and bailey castles built", "The landscape and control"], ["Norman barons replace English earls", "Landholding and power"]] },
          { type: "choice", q: "Which statement best describes the Bayeux Tapestry as a source?", options: ["It is completely unreliable because it is Norman", "It was made by Harold's family", "It is neutral and shows every side equally", "It is mostly from the Norman point of view but is ambiguous in places and still very useful"], answer: 3, why: "A source can be one-sided and still be valuable, especially for showing how the victors wanted the story told." },
          { type: "gap", q: "Fill in the gaps.", text: "The Tapestry was probably commissioned by Bishop ___ of Bayeux, William's half-brother. It includes Halley's ___, which appeared in April 1066.", bank: ["Odo", "Lanfranc", "Comet", "Moon", "Star"], answers: ["Odo", "Comet"] },
        ],
      },
      task: {
        title: "Source analysis and a final judgement",
        intro: "Analyse three scenes from the Bayeux Tapestry, then write a judgement on change and continuity after 1066.",
        need: ["Images of the Bayeux Tapestry: online with a grown-up's permission (the Bayeux Museum website shows the whole Tapestry for free in a browser) or in a library book", "Paper and pens"],
        steps: [
          "Find three scenes: Harold swearing an oath on relics, Halley's Comet with Harold on his throne, and the death of Harold. For each, describe what you see in two or three sentences.",
          "For each scene, write what message a Norman viewer was meant to take from it, and whether an English viewer might have read it differently.",
          "Write a paragraph answering: 'How useful is the Bayeux Tapestry to a historian studying 1066?' Comment on its provenance, its content and its limitations, including the debate about Harold's death.",
          "Draw a two-column table, Change and Continuity. Add at least five points to each, using evidence from the whole unit (castles, Domesday, the Church, language, government, peasants' lives).",
          "Finish with a conclusion of about 150 words: 'How far did the Norman Conquest change England?' Consider change for whom, how quickly and how deeply.",
        ],
      },
      exit: [
        { type: "choice", q: "Who most likely commissioned the Bayeux Tapestry?", options: ["Harold Godwinson", "Bishop Odo of Bayeux", "Edward the Confessor", "Harald Hardrada"], answer: 1 },
        { type: "type", q: "What word means the origin of a source: who made it, when and why?", answer: ["provenance", "Provenance"] },
        { type: "choice", q: "Why is the story of Harold being killed by an arrow in the eye uncertain?", options: ["The Tapestry does not show Harold at all", "Harold survived the battle", "The Tapestry says he died at Stamford Bridge", "The figures are hard to identify, the Tapestry was restored later, and early sources disagree"], answer: 3 },
        { type: "pick", q: "Which were major changes after 1066? There is more than one.", options: ["A new Norman ruling class", "Castles built across England", "Norman bishops and abbots replaced English ones", "Shires and sheriffs were abolished"], answers: [0, 1, 2] },
        { type: "choice", q: "Why does English have pairs of words like 'cow' and 'beef'?", options: ["The animals kept English names, while the meat served at Norman tables took French names", "The Vikings used one and the Romans the other", "They were invented by the Domesday commissioners", "They come from Latin and Greek"], answer: 0 },
        { type: "choice", q: "Which best sums up change and continuity after 1066?", options: ["Everything changed for everyone overnight", "Nothing changed at all", "The ruling class changed completely, while much of daily life and government continued", "Only the language changed"], answer: 2 },
      ],
      grownUp: {
        need: ["Access to images of the Bayeux Tapestry, online or in a book", "Paper and pens"],
        tips: [
          "The full Tapestry can be viewed free online, and there is a full-size Victorian replica at Reading Museum. Seeing the whole sequence helps learners understand it as a story told by one side.",
          "The battle scenes and lower border show fallen soldiers in a stylised way. Most learners find this unproblematic, but preview the images if you are unsure.",
          "Encourage nuance in the final judgement. 'It changed a lot for some people and much less for others' is a strong starting point, as long as it is backed with evidence.",
        ],
        younger: "Choose one Tapestry scene and draw your own version of it in a comic-strip panel, then write one sentence on what it shows and one on whose side it seems to take.",
        older: "Write a full source-utility answer in GCSE style: 'How useful is the Bayeux Tapestry for an enquiry into the death of Harold?' Use the provenance, the content and your own contextual knowledge, and compare it with one written source such as William of Poitiers or the Anglo-Saxon Chronicle.",
      },
    },
  ],
};
