import type { LessonUnit } from "@/lib/lessons";

/**
 * Medieval life and the Black Death, for ages 11 to 14 (KS3). The plague is handled calmly and factually, with the
 * focus on evidence, interpretations and consequences rather than suffering. Sources and historians' debates run
 * through every lesson.
 */
export const medievalLife: LessonUnit = {
  slug: "medieval-life",
  title: "Medieval life and the Black Death",
  short: "Medieval life",
  subject: "History",
  ages: "11 to 14",
  emoji: "🌾",
  color: "#6B5B45",
  summary: "Six lessons on life in medieval England: villages and towns, the power of the Church, medieval medicine, the Black Death of 1348 to 1350, the changes that followed, and the Peasants' Revolt of 1381, all through sources and historians' interpretations.",
  cover: "/lessons/units/medieval-life.jpg",
  lessons: [
    {
      slug: "medieval-life-1",
      title: "Village and town",
      emoji: "🌾",
      minutes: 60,
      goal: "I can explain how the feudal system and the manor shaped life in a medieval village, and how life in a chartered town was different.",
      starter: [
        { type: "choice", q: "In which year did William of Normandy win the Battle of Hastings?", options: ["793", "1066", "1215"], answer: 1 },
        { type: "pick", q: "Which of these groups ruled or settled in parts of Britain before 1066? There is more than one.", options: ["Romans", "Anglo-Saxons", "Vikings", "Tudors"], answers: [0, 1, 2] },
        { type: "choice", q: "What does the word 'medieval' refer to?", options: ["The time of the ancient Greeks", "The Victorian period", "The Middle Ages, roughly AD 500 to 1500"], answer: 2 },
        { type: "type", q: "What is the name of the great survey of England that William the Conqueror ordered in 1086? (The ... Book)", answer: ["Domesday", "Domesday Book", "the Domesday Book", "Doomsday", "Doomsday Book"] },
        { type: "choice", q: "Most people in England in the Middle Ages lived...", options: ["in big cities", "in castles", "in small villages, farming the land"], answer: 2 },
        { type: "choice", q: "Why did the Normans build so many castles after 1066?", options: ["To store grain for the winter", "To control a conquered country and show their power", "Because the Anglo-Saxons asked them to"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Land, loyalty and the feudal system",
            text: [
              "Medieval England was a farming society. Around 1300 there were perhaps five million people in England (historians' estimates range from about four to six million), and roughly nine out of ten lived in the countryside. Land was the main source of wealth and power, so whoever controlled land controlled people.",
              "Historians often use the term 'feudal system' to describe how land and loyalty were linked. In theory, the king owned all the land. He granted large estates to barons and bishops in return for loyalty and knights for his army. They in turn granted land to knights, and at the bottom were the peasants, who worked the land. Each layer owed service to the one above.",
              "Many historians now warn that 'feudal system' makes things sound neater than they were. Arrangements varied from place to place and changed over time, and money rents gradually replaced some kinds of service. The pyramid diagram in many textbooks is a simplified model, not a picture of how every village worked.",
              "The basic unit of rural life was the manor: an estate controlled by a lord, which might be a knight, a baron, a bishop or a monastery. The lord kept some land for himself, called the demesne, and the rest was farmed by the peasants who lived in the village.",
            ],
          },
          {
            heading: "Life on the manor",
            text: [
              "Peasants were not all the same. Free peasants paid rent and could leave the manor. Unfree peasants, called villeins or serfs, were bound to the manor. They had to work on the lord's demesne for a set number of days, often two or three days a week, and needed the lord's permission to leave, to marry off a daughter (a fee called merchet) or to sell an animal. When a villein died, the lord could claim the family's best animal, a payment called a heriot.",
              "Many villages used an open-field system. Two or three huge fields surrounded the village, each divided into long strips. A family's strips were scattered across all the fields, so good and poor soil was shared out. Crops were rotated: one field might grow wheat or rye, another barley, oats, peas or beans, and one was left fallow (resting) each year to recover.",
              "The farming year set the rhythm of life: ploughing with teams of oxen, sowing, weeding, haymaking, the harvest in August and September, and slaughtering animals before winter. Most peasant houses were built of a timber frame with walls of wattle and daub (woven sticks covered in a mix of mud, dung and straw) and a thatched roof. Families ate pottage, a thick stew of vegetables and grain, with dark bread and ale.",
              "Disputes were settled at the manor court, run by the lord's officials. Its records, written in Latin on long parchment rolls, are one of historians' best sources for ordinary lives: they record fines, land deals, inheritances, broken rules and, later, deaths.",
            ],
          },
          {
            heading: "Towns, charters and guilds",
            text: [
              "Towns grew rapidly between about 1100 and 1300. London was by far the largest, with perhaps 70,000 to 80,000 people around 1300; most towns had only a few thousand. They grew up at river crossings, ports, crossroads and around castles and cathedrals, and their weekly markets and yearly fairs connected them to the surrounding villages.",
              "Many towns bought a charter from the king or their lord. A charter was a written document granting rights, such as holding a market, collecting tolls and running their own courts. People who held full rights in a town were called burgesses. A popular saying held that 'town air makes you free': by custom, a villein who lived in a chartered town for a year and a day could claim his freedom.",
              "Trades were organised by guilds. A guild of bakers, weavers or goldsmiths set prices, checked the quality of goods and controlled training. A boy (and occasionally a girl) became an apprentice for about seven years, then a journeyman paid by the day, and might eventually become a master with his own workshop. Guilds also looked after members who were ill and paid for funerals.",
              "Towns could be crowded and dirty, with animals in the streets and waste thrown into ditches, and fire was a constant risk. But towns also passed rules about cleaning streets and dumping rubbish, so the picture of medieval towns as completely filthy is partly a later exaggeration.",
            ],
          },
        ],
        words: [
          { word: "feudal system", meaning: "a historians' model of medieval society in which land was granted in return for loyalty and service" },
          { word: "manor", meaning: "an estate controlled by a lord, usually including a village and its fields" },
          { word: "demesne", meaning: "the part of the manor's land the lord kept to be farmed for his own benefit" },
          { word: "villein (serf)", meaning: "an unfree peasant who was bound to the manor and owed labour to the lord" },
          { word: "charter", meaning: "a written document granting a town or group particular rights" },
          { word: "guild", meaning: "an association of craftspeople or merchants that controlled a trade in a town" },
        ],
      },
      practice: {
        intro: "Check your understanding of village and town life.",
        questions: [
          {
            type: "match",
            q: "Match each term to its meaning.",
            pairs: [
              ["Demesne", "Land the lord kept for himself"],
              ["Merchet", "A fee paid to the lord when a daughter married"],
              ["Heriot", "The best animal, claimed when a villein died"],
              ["Fallow", "Left unplanted for a year to recover"],
            ],
          },
          { type: "choice", q: "Why were a family's strips scattered across several fields?", options: ["So that everyone shared good and poor land fairly", "Because the lord wanted to confuse them", "Because each family only grew one crop"], answer: 0, why: "Scattering strips meant no family got all the best soil or all the worst." },
          { type: "pick", q: "Which of these could a villein NOT usually do without the lord's permission? There is more than one.", options: ["Leave the manor", "Eat pottage", "Arrange a daughter's marriage", "Sell an animal"], answers: [0, 2, 3] },
          { type: "gap", q: "Fill in the gaps.", text: "A town's rights were written in a ___. Each trade was controlled by a ___, and a young person learned the trade as an ___.", bank: ["charter", "guild", "apprentice", "heriot", "demesne"], answers: ["charter", "guild", "apprentice"] },
          { type: "choice", q: "Which statement best explains why some historians criticise the term 'feudal system'?", options: ["The Normans never granted land to anyone", "It suggests a neat, fixed pyramid when real arrangements varied a great deal", "It was invented by peasants to complain"], answer: 1 },
        ],
      },
      task: {
        title: "Map and explain a manor",
        intro: "Design a plan of an imaginary manor around 1300, then use it to write an explanation of how the manor worked.",
        need: ["A large sheet of paper", "A pencil, ruler and coloured pens", "Lined paper for writing"],
        steps: [
          "Draw your village in the centre: the church, the lord's manor house, peasant houses with small garden plots (tofts), a mill and a stream or river.",
          "Around it draw three large open fields. Divide each into long strips and label the crop in each field for one year, including one fallow field. Add common pasture, meadow for hay and woodland.",
          "Choose one peasant family. Colour their strips in one colour so it is clear they are scattered across all three fields. Shade the lord's demesne in another colour.",
          "Add a key and a compass rose. Give your manor a name.",
          "Write three paragraphs (about 300 words in total) answering: 'How did the manor control the lives of villeins?' Use at least four key words from this lesson and give a specific example in each paragraph.",
          "Finish with a sentence comparing your villein's life with that of a burgess in a chartered town. Who had more freedom, and why?",
        ],
      },
      exit: [
        { type: "choice", q: "What was a manor?", options: ["A town with a charter", "An estate controlled by a lord, usually including a village and its fields", "A type of church"], answer: 1 },
        { type: "choice", q: "What was the key difference between a free peasant and a villein?", options: ["Free peasants did not farm", "Villeins lived in towns", "Villeins were bound to the manor and owed labour to the lord"], answer: 2 },
        { type: "type", q: "What name is given to the part of the manor the lord kept for himself?", answer: ["demesne", "Demesne", "the demesne"] },
        { type: "pick", q: "Which of these did guilds do? There is more than one.", options: ["Checked the quality of goods", "Trained apprentices", "Collected tithes for the Pope", "Helped sick members"], answers: [0, 1, 3] },
        { type: "choice", q: "By custom, how could a villein gain freedom by moving to a chartered town?", options: ["By paying one penny", "By living there for a year and a day", "By joining the army"], answer: 1 },
        { type: "choice", q: "Why are manor court rolls valuable to historians?", options: ["They were written by peasants in English", "They record details of ordinary people's lives, such as fines, land and inheritances", "They describe every battle of the period"], answer: 1 },
      ],
      grownUp: {
        need: ["A large sheet of paper and coloured pens"],
        tips: [
          "The 'feudal system' pyramid is useful as a starting model, but KS3 history now encourages learners to question it. Ask: 'What does this diagram leave out?' (women, towns, the Church, free peasants, change over time).",
          "Population figures for medieval England are estimates built from sources such as the Domesday Book and the 1377 poll tax. It is good practice to say 'about' or 'historians estimate'.",
          "The extended writing matters more than the artwork. Look for specific examples and precise vocabulary rather than general statements.",
        ],
        younger: "Use a simple writing frame: 'One way the lord controlled villeins was... For example... This meant that...'. Aim for two paragraphs.",
        older: "Research the deserted village of Wharram Percy in North Yorkshire and explain what archaeology there reveals about peasant houses and diet that written sources do not.",
      },
    },
    {
      slug: "medieval-life-2",
      title: "The power of the Church",
      emoji: "⛪",
      minutes: 60,
      goal: "I can explain why the Church was so powerful in medieval England, linking beliefs about the afterlife to its wealth, influence and authority.",
      starter: [
        { type: "choice", q: "What was a manor?", options: ["An estate controlled by a lord", "A guild of merchants", "A royal palace in London"], answer: 0 },
        { type: "type", q: "What is another name for an unfree peasant bound to the manor? (Begins with v)", answer: ["villein", "villeins", "Villein", "villain"] },
        { type: "choice", q: "What was a town charter?", options: ["A map of the town", "A written document granting a town rights", "A list of taxes owed to the Pope"], answer: 1 },
        { type: "pick", q: "Which of these were part of the open-field system? There is more than one.", options: ["Long strips of land", "A field left fallow", "Hedged private farms for each family", "Crop rotation"], answers: [0, 1, 3] },
        { type: "choice", q: "What did a guild do?", options: ["Ran the manor court", "Controlled a trade in a town", "Collected the king's army"], answer: 1 },
        { type: "choice", q: "Why do some historians criticise the 'feudal system' pyramid?", options: ["It is too complicated", "It makes society look neater and more fixed than it really was", "It leaves out the king"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "One Church across Christendom",
            text: [
              "In medieval England almost everyone was a Christian and belonged to one Church, led by the Pope in Rome. The whole of Catholic western Europe, known as Christendom, shared the same beliefs, services and language of worship, Latin. (There were also Jewish communities in England until Edward I expelled them in 1290.)",
              "The Church was organised as a hierarchy. Below the Pope came archbishops (in England, of Canterbury and York), then bishops, each responsible for a large area called a diocese, and then parish priests. A parish was the area served by one church, usually a single village or a district of a town. The parish church was often the largest and only stone building in a village.",
              "Alongside the parish clergy were monks and nuns, who lived in monasteries and nunneries under a strict rule of prayer, work and study, and friars, who travelled and preached among ordinary people. Monasteries were centres of learning: before printing arrived in England in 1476, most books were copied by hand by clergy.",
              "Because so few people could read, and almost all who could had been taught by the Church, the clergy did much of the writing in medieval England. That means many of our written sources were produced by churchmen, a point worth remembering when you weigh up what they say.",
            ],
          },
          {
            heading: "Heaven, hell and purgatory",
            text: [
              "The Church taught that after death each soul would be judged. The saved went to heaven and the damned to hell. Most people expected to spend time first in purgatory, a place where souls were cleansed of their sins before they could enter heaven. These beliefs were sincerely held and shaped daily life.",
              "To reduce time in purgatory, people tried to live well, confess their sins to a priest, and take part in the sacraments, the Church's seven holy rites, including baptism, confession, Mass and the last rites before death. The wealthy left money for priests to say Masses for their souls after they died, and paid for chantry chapels for this purpose.",
              "Many churches had a 'Doom' painting over the arch between the nave and the chancel, showing the Last Judgement: Christ in judgement, the saved rising to heaven and the damned being led to hell. For people who could not read, such images taught the faith powerfully. Some survive today, for example at St Thomas's Church in Salisbury.",
              "People also went on pilgrimage, journeys to holy places such as Canterbury, where Archbishop Thomas Becket had been murdered in 1170, or Walsingham in Norfolk. Pilgrims prayed at shrines holding the relics of saints, hoping for forgiveness or healing. Geoffrey Chaucer's Canterbury Tales, written in the late 1300s, describes a group of pilgrims on their way to Becket's shrine.",
            ],
          },
          {
            heading: "Wealth, law and influence",
            text: [
              "The Church was enormously wealthy. Every household was expected to pay a tithe, one tenth of its produce or income, to the parish church. People also paid fees for services such as burials, and the Church owned huge estates: some historians estimate it held around a quarter of the land in England. Bishops and abbots were among the richest landowners in the country.",
              "The Church had its own courts, which dealt with matters such as marriage, wills and moral offences. Clergy accused of crimes could claim 'benefit of clergy' and be tried in a church court, where punishments were usually lighter. Proving you were clergy often meant reading a verse of the Bible aloud, so anyone who could read could try to claim it.",
              "Churchmen also held political power. Bishops sat in Parliament alongside the barons and served the king as advisers and officials; the Chancellor, the king's most senior minister, was often a bishop. Clashes between kings and the Church could be serious. Becket's murder by four of Henry II's knights followed years of quarrelling with the king about whether churchmen should be tried in royal courts.",
              "Not everyone accepted the Church's wealth without question. In the later 1300s the Oxford scholar John Wycliffe criticised the riches of the clergy and argued that people should be able to read the Bible in English. His followers were nicknamed Lollards. Chaucer, too, gently mocked greedy churchmen in his tales, which suggests that criticism was widely understood.",
            ],
          },
        ],
        words: [
          { word: "Christendom", meaning: "the Christian countries of medieval Europe, which shared one Church" },
          { word: "parish", meaning: "the area served by one church and its priest" },
          { word: "purgatory", meaning: "in Catholic belief, a place where souls are cleansed of sin before entering heaven" },
          { word: "tithe", meaning: "a payment of one tenth of a person's produce or income to the Church" },
          { word: "pilgrimage", meaning: "a journey to a holy place for religious reasons" },
          { word: "benefit of clergy", meaning: "the right of clergy to be tried in church courts rather than royal courts" },
        ],
      },
      practice: {
        intro: "Analyse the power of the medieval Church.",
        questions: [
          {
            type: "order",
            q: "Put the Church hierarchy in order, from the top down.",
            items: ["Pope", "Archbishop", "Bishop", "Parish priest"],
          },
          { type: "choice", q: "Which best explains why belief in purgatory increased the Church's wealth?", options: ["Purgatory was a tax collected by the king", "Only rich people believed in purgatory", "People gave money for Masses and chantries to shorten their time there"], answer: 2 },
          {
            type: "match",
            q: "Match each source of the Church's power to an example.",
            pairs: [
              ["Wealth", "Tithes of one tenth of produce"],
              ["Law", "Church courts dealing with marriage and wills"],
              ["Politics", "Bishops serving as the king's Chancellor"],
              ["Belief", "Doom paintings of the Last Judgement"],
            ],
          },
          { type: "gap", q: "Fill in the gaps.", text: "Thomas ___ was murdered in Canterbury Cathedral in ___. His shrine became a major site of ___.", bank: ["Becket", "Wycliffe", "1170", "1290", "pilgrimage"], answers: ["Becket", "1170", "pilgrimage"] },
          { type: "choice", q: "A monk wrote a chronicle praising a bishop. Why should a historian be cautious?", options: ["Monks always lied", "The writer belonged to the Church, so he may have been sympathetic to a churchman", "Chronicles were never written in Latin"], answer: 1, why: "Knowing who produced a source and why helps us judge how far to trust it." },
        ],
      },
      task: {
        title: "Reading a Doom painting",
        intro: "Analyse a real medieval Doom painting as a historical source, then write an explanation of the Church's power.",
        need: ["A computer or tablet with internet access (ask an adult first)", "Paper and a pencil"],
        steps: [
          "With an adult's permission, search online for the Doom painting at St Thomas's Church, Salisbury, or another surviving Doom such as the one at St Peter's Church, Wenhaston, in Suffolk. Use a museum, church or heritage website.",
          "Sketch the basic layout in boxes, without detail: where is Christ? Where are the saved? Where are the damned? Note who is shown (kings, bishops, ordinary people).",
          "Answer these source questions in full sentences: What does the painting show? Who would have seen it, and how often? What message was it meant to give? Why might a picture have been more powerful than words in a medieval village?",
          "Notice that bishops and kings sometimes appear among the damned. What does that suggest about the Church's message?",
          "Write an extended answer of about 350 words: 'Why was the Church so powerful in medieval England?' Plan four paragraphs: belief, wealth, law and politics. Finish with a judgement about which factor mattered most, and explain why.",
        ],
      },
      exit: [
        { type: "choice", q: "Who was the head of the Church in medieval western Europe?", options: ["The King of England", "The Archbishop of Canterbury", "The Pope"], answer: 2 },
        { type: "type", q: "What was the name of the payment of one tenth of produce to the Church?", answer: ["tithe", "a tithe", "Tithe", "tithes"] },
        { type: "choice", q: "What did people believe purgatory was?", options: ["A place where souls were cleansed of sin before heaven", "A church court", "A type of pilgrimage"], answer: 0 },
        { type: "pick", q: "Which of these were sources of the Church's power? There is more than one.", options: ["Owning large estates", "Its own courts", "Bishops advising the king", "Control of the army"], answers: [0, 1, 2] },
        { type: "choice", q: "What was the main purpose of a Doom painting?", options: ["To decorate the lord's house", "To teach people about judgement after death", "To record a battle"], answer: 1 },
        { type: "choice", q: "Why might many written sources from this period reflect the Church's point of view?", options: ["Because the king banned other writing", "Because most people who could write were clergy or taught by the Church", "Because peasants wrote only in runes"], answer: 1 },
      ],
      grownUp: {
        need: ["Internet access, supervised, for viewing a Doom painting"],
        tips: [
          "This lesson describes religious belief historically. Medieval beliefs are presented respectfully as sincerely held; if your family has its own faith, it can be a good moment to discuss how belief and practice have changed over time.",
          "Doom paintings include images of hell, but they are stylised and not graphic. Preview the image first if your learner is sensitive.",
          "Encourage a clear judgement in the essay. 'All factors were important' is weaker than 'Belief mattered most because it explains why people accepted the tithe and the courts'.",
        ],
        younger: "Use the four headings (belief, wealth, law, politics) and write two sentences under each, with one example per heading.",
        older: "Research John Wycliffe and the Lollards. Explain why the Church saw an English Bible as a threat to its authority, linking to the role of Latin.",
      },
    },
    {
      slug: "medieval-life-3",
      title: "Medieval medicine",
      emoji: "⚗️",
      minutes: 60,
      goal: "I can explain medieval ideas about the causes of illness, including the four humours, and evaluate how far they were logical for their time.",
      starter: [
        { type: "choice", q: "What was a tithe?", options: ["A type of town charter", "A fee paid when a villein died", "A tenth of produce paid to the Church"], answer: 2 },
        { type: "type", q: "Which language was used for Church services across medieval western Europe?", answer: ["Latin", "latin"] },
        { type: "choice", q: "What was purgatory believed to be?", options: ["A place where souls were cleansed before heaven", "A monastery for nuns", "A tax on pilgrims"], answer: 0 },
        { type: "choice", q: "Which archbishop was murdered in Canterbury Cathedral in 1170?", options: ["John Wycliffe", "Thomas Becket", "Geoffrey Chaucer"], answer: 1 },
        { type: "pick", q: "Which of these gave the Church power? There is more than one.", options: ["Its own courts", "Huge estates", "Tithes", "Its control of the Royal Navy"], answers: [0, 1, 2] },
        { type: "choice", q: "What was 'benefit of clergy'?", options: ["A free meal for priests", "The right of clergy to be tried in church courts", "A payment to monks"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The theory of the four humours",
            text: [
              "The most important medical theory in medieval Europe came from ancient Greece. The physician Hippocrates (around 460 to 370 BC) and later Galen (AD 129 to around 216), a Greek doctor working in the Roman Empire, taught that the body contained four liquids, or humours: blood, phlegm, yellow bile and black bile.",
              "Good health meant the humours were in balance. Illness was caused by having too much or too little of one. Each humour was linked to a season, an element and a set of qualities: blood was hot and moist and linked to spring; phlegm was cold and moist, linked to winter; yellow bile was hot and dry, linked to summer; black bile was cold and dry, linked to autumn.",
              "The theory seemed to fit what people observed. A person with a cold produces phlegm, especially in winter; a fever makes someone hot and flushed. Galen's books were copied and studied for over a thousand years, and medieval university students learned medicine by reading him. Questioning Galen was rare, partly because the Church approved of his ideas, which fitted the belief that the body was designed by God.",
              "Much of this ancient knowledge reached western Europe through Arabic scholars. Works by Islamic physicians such as Ibn Sina (known in Europe as Avicenna), whose Canon of Medicine was completed around 1025, were translated into Latin and became standard textbooks in European universities.",
            ],
          },
          {
            heading: "Healers and treatments",
            text: [
              "Medieval people had several kinds of healer. Physicians were trained at universities over many years and were expensive, so only the wealthy used them. They diagnosed patients by examining urine against a colour chart, taking the pulse and consulting astrological charts. Barber-surgeons performed bloodletting, pulled teeth and set broken bones. Apothecaries mixed and sold remedies.",
              "Most people never saw a physician. They relied on household remedies, local wise women, or the infirmaries and hospitals run by monks and nuns, which cared for the sick and the poor. Women did a large share of everyday healing and almost all midwifery.",
              "Treatments aimed to restore humoral balance. Bloodletting, cutting a vein or applying leeches, was meant to remove excess blood; purging with laxatives or causing vomiting removed other humours. Doctors also recommended changes to diet, rest and exercise, following the idea of 'regimen': keeping the body balanced through a sensible way of life.",
              "Herbal remedies were widely used, and some had real effects: honey has antibacterial properties, and willow bark contains a substance related to aspirin. Other remedies had no effect at all. Medieval surgeons also had genuine skills, such as treating wounds and fractures, and some, like the English surgeon John of Arderne in the 1300s, wrote detailed guides to operations.",
            ],
          },
          {
            heading: "God, the stars and bad air",
            text: [
              "Medieval people believed illness could have several causes at once, and they did not see these as contradictory. Many believed that God sent disease as a punishment for sin or as a test of faith. The response was prayer, confession, fasting and pilgrimage. Some people also believed in the 'royal touch': that the king's touch could cure scrofula, a disease of the glands in the neck.",
              "Astrology was a respected part of medicine. Physicians believed the movements of the planets and stars affected the body and the humours, so they checked astrological charts before treatment. Chaucer's 'Doctor of Physic' in the Canterbury Tales is described as skilled in astronomy, meaning what we would now call astrology.",
              "Another important idea was miasma, the belief that disease spread through bad air from rotting matter, swamps or filth. It was wrong about the cause, but it led to some useful actions, such as cleaning streets and removing rubbish, because people wanted to avoid bad smells.",
              "Historians debate how to judge medieval medicine. One interpretation stresses continuity and lack of progress: Galen's ideas went largely unchallenged for centuries. Another argues that medieval medicine was rational within its own world view, built on careful observation, and that it would be unfair to judge it by modern knowledge of germs, which only came in the 1860s with Louis Pasteur.",
            ],
          },
        ],
        words: [
          { word: "four humours", meaning: "the ancient theory that health depends on a balance of blood, phlegm, yellow bile and black bile" },
          { word: "physician", meaning: "a university-trained doctor who diagnosed illness and recommended treatment" },
          { word: "bloodletting", meaning: "removing blood from a patient to rebalance the humours" },
          { word: "miasma", meaning: "the belief that disease is spread by bad air from rotting or dirty matter" },
          { word: "astrology", meaning: "the belief that the movements of the planets and stars influence human life and health" },
          { word: "continuity", meaning: "when things stay the same over a long period of time" },
        ],
      },
      practice: {
        intro: "Test your understanding of medieval ideas about illness.",
        questions: [
          {
            type: "match",
            q: "Match each humour to its qualities.",
            pairs: [
              ["Blood", "Hot and moist"],
              ["Phlegm", "Cold and moist"],
              ["Yellow bile", "Hot and dry"],
              ["Black bile", "Cold and dry"],
            ],
          },
          { type: "choice", q: "A physician believes a patient with a high fever has too much blood. What treatment is he most likely to recommend?", options: ["A pilgrimage to Rome", "Bloodletting", "Eating more red meat"], answer: 1, why: "Removing blood was meant to restore the balance of the humours." },
          { type: "pick", q: "Which were medieval explanations for what caused illness? There is more than one.", options: ["Imbalance of the humours", "Germs and bacteria", "Bad air (miasma)", "Punishment from God", "The movement of the planets"], answers: [0, 2, 3, 4] },
          { type: "gap", q: "Fill in the gaps.", text: "The four humours theory was developed by Hippocrates and later by ___. Many of these ideas reached Europe through Islamic scholars such as Ibn ___.", bank: ["Galen", "Pasteur", "Sina", "Becket"], answers: ["Galen", "Sina"] },
          { type: "choice", q: "Which evidence best supports the view that medieval medicine was logical for its time?", options: ["Physicians were expensive", "Some remedies had no effect", "The humours theory matched observations such as people producing more phlegm in winter"], answer: 2 },
        ],
      },
      task: {
        title: "Case notes of a medieval physician",
        intro: "Write the case notes a medieval physician might make, then step outside the past and judge medieval medicine as a historian.",
        need: ["Paper and a pencil", "Coloured pens (optional)"],
        steps: [
          "Draw a four-part circle diagram of the humours. In each quarter write the humour, its qualities, its season and its element (air for blood, water for phlegm, fire for yellow bile, earth for black bile).",
          "Invent a patient: a merchant's wife in Winchester in 1340 who has a cough, a runny nose and feels cold. Write the physician's case notes: how he examines her, which humour he thinks is out of balance and why, and the treatment he prescribes (consider diet, warmth, purging and astrology).",
          "Add a short note on what a poorer patient, such as a villein, would probably do instead, and who they might turn to.",
          "Now write an extended answer (about 300 words): 'Medieval medicine was based on nonsense.' How far do you agree? Give evidence for and against, and reach a clear judgement.",
          "Underline the key words you have used. You should have at least five from this lesson.",
        ],
      },
      exit: [
        { type: "pick", q: "Which of these were the four humours? There is more than one.", options: ["Blood", "Phlegm", "Yellow bile", "Black bile", "Water"], answers: [0, 1, 2, 3] },
        { type: "choice", q: "According to humoral theory, what caused illness?", options: ["Germs entering the body", "An imbalance of the humours", "Lack of exercise only"], answer: 1 },
        { type: "type", q: "What was the name for the belief that disease spread through bad air?", answer: ["miasma", "Miasma", "miasma theory"] },
        { type: "choice", q: "Who were the main healers for most ordinary people?", options: ["University-trained physicians", "Family members, wise women and monastery infirmaries", "Royal doctors"], answer: 1 },
        { type: "choice", q: "Why did Galen's ideas stay unchallenged for so long?", options: ["They were respected, studied at universities and supported by the Church", "Nobody could read Latin", "The king made them law"], answer: 0 },
        { type: "choice", q: "What useful action could follow from belief in miasma, even though the theory was wrong?", options: ["Developing vaccines", "Cleaning streets and removing rotting rubbish", "Using antibiotics"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and coloured pens"],
        tips: [
          "A common misconception is that medieval people were simply ignorant. Push your learner to explain why the humours theory seemed sensible at the time; this is a key GCSE skill.",
          "Bloodletting can sound alarming. It is described here without detail; it was usually a small, controlled procedure, and it remained common in Europe until the 1800s.",
          "Ibn Sina's role is a good reminder that medieval learning was international. Medieval Islamic, Jewish and Christian scholars all contributed.",
        ],
        younger: "Focus on the diagram and the case notes. Use the sentence starter: 'The physician thinks she has too much phlegm because...'.",
        older: "GCSE History courses often include 'Medicine through time'. Research the role of the Church in medieval medicine and write a paragraph on whether it helped or hindered progress.",
      },
    },
    {
      slug: "medieval-life-4",
      title: "The Black Death, 1348 to 1350",
      emoji: "🐀",
      minutes: 60,
      goal: "I can explain how the Black Death spread, compare medieval and modern explanations of its cause, and evaluate estimates of the death toll.",
      starter: [
        { type: "choice", q: "According to humoral theory, what caused illness?", options: ["Germs", "An imbalance of the four humours", "Too much exercise"], answer: 1 },
        { type: "type", q: "What was the name for the belief that disease spread through bad air?", answer: ["miasma", "Miasma"] },
        { type: "choice", q: "Which ancient doctor's books were the basis of medieval medical training?", options: ["Pasteur", "Chaucer", "Galen"], answer: 2 },
        { type: "choice", q: "What was bloodletting meant to achieve?", options: ["Restore the balance of the humours", "Kill germs", "Test for poison"], answer: 0 },
        { type: "pick", q: "Which of these were believed to cause illness in medieval times? There is more than one.", options: ["God's punishment", "The planets", "Bacteria", "Bad air"], answers: [0, 1, 3] },
        { type: "choice", q: "Who did most ordinary people turn to when ill?", options: ["Physicians from Oxford", "Family, wise women and monastic infirmaries", "Barons"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "A pandemic travels west",
            text: [
              "The Black Death was a pandemic, a disease outbreak that spread across many countries. Genetic evidence published in 2022 suggests the outbreak began in central Asia, in what is now Kyrgyzstan, in the late 1330s. It travelled west along trade routes, including the Silk Roads that linked China, Persia and the Black Sea.",
              "In 1346 it reached Caffa, a trading port in Crimea run by merchants from Genoa. Italian ships then carried it into the Mediterranean, and it arrived in Messina in Sicily in October 1347. Over the next months it spread through Italy, France and Spain, following the busiest trading routes by sea, river and road.",
              "The disease reached England in the summer of 1348, at the port of Melcombe (now part of Weymouth) in Dorset. It reached London by the autumn of 1348 and spread across England in 1349. It reached Wales and Ireland in 1349 and Scotland in 1349 to 1350. Within about two years it had touched almost every community in Britain.",
              "The name 'Black Death' was not used at the time. People called it 'the great pestilence' or 'the great mortality'. The term 'Black Death' became common in English only centuries later.",
            ],
          },
          {
            heading: "Explaining the pestilence: then and now",
            text: [
              "People at the time used the ideas they had. Many believed the plague was God's punishment for sin, so they prayed, confessed and joined religious processions. Groups of flagellants, who whipped themselves in public as a form of penance, travelled through parts of Europe, though they had little impact in England. In 1348 the medical faculty of the University of Paris blamed a conjunction (alignment) of Saturn, Jupiter and Mars in 1345, which they said had corrupted the air.",
              "Miasma was the most common medical explanation, so people carried sweet-smelling herbs, burned fires to purify the air and avoided bad smells. Physicians recommended bloodletting and careful diet. In some parts of Europe, Jewish communities were falsely accused of poisoning wells and were violently persecuted, despite the Pope condemning these accusations. Historians see this as a terrible example of how fear can turn people against a minority who are wrongly blamed.",
              "Today we know the disease was caused by the bacterium Yersinia pestis. The main form was bubonic plague, spread mainly by fleas that lived on black rats and bit humans; it caused painful swellings called buboes. A pneumonic form infected the lungs and could spread directly from person to person through coughing. Some historians argue that human fleas and lice also spread the disease, which would help explain how quickly it moved.",
              "For a time, some historians questioned whether the Black Death really was plague. That debate was largely settled when scientists extracted DNA from the teeth of people buried in plague cemeteries, including East Smithfield in London, opened in 1348 to 1349, and found Yersinia pestis. This is a good example of science providing new historical evidence.",
            ],
          },
          {
            heading: "How many died?",
            text: [
              "Nobody counted the dead at the time, so historians have to estimate. Most now agree that between about a third and a half of the population of England died between 1348 and 1350, perhaps around two million people. Some historians, such as Ole Benedictow, argue the figure was higher, up to 60 per cent. Across Europe, estimates usually range from a third to a half of the population.",
              "How do historians reach these figures? They use sources such as manor court rolls, which record when tenants died and land passed to heirs, and bishops' registers, which record how many new priests were appointed to replace those who had died. Priests' deaths are useful because records of them were kept carefully. Tax records and the 1377 poll tax also help to estimate population.",
              "Each source has limits. Manor records cover tenants, mostly adult men, not women, children or the poorest. Priests may have died at a higher rate than average because they visited the sick. That is why estimates vary, and why historians give ranges rather than exact numbers.",
              "Chroniclers such as Henry Knighton, a canon in Leicester, described empty villages, crops left unharvested and animals wandering untended. Such accounts are vivid, but chroniclers sometimes exaggerated numbers to express how overwhelming the disaster felt. Historians compare chronicles with records to test them.",
            ],
          },
        ],
        words: [
          { word: "pandemic", meaning: "an outbreak of disease that spreads across many countries" },
          { word: "Yersinia pestis", meaning: "the bacterium that causes plague" },
          { word: "bubonic plague", meaning: "the form of plague spread mainly by flea bites, causing swellings called buboes" },
          { word: "pneumonic plague", meaning: "the form of plague that infects the lungs and spreads through coughing" },
          { word: "flagellant", meaning: "a person who whipped themselves in public as a religious penance" },
          { word: "bishops' registers", meaning: "official records kept by bishops, including appointments of new priests" },
        ],
      },
      practice: {
        intro: "Weigh up the evidence about the Black Death.",
        questions: [
          {
            type: "order",
            q: "Put the spread of the plague in order, earliest first.",
            items: ["Caffa in Crimea (1346)", "Messina in Sicily (October 1347)", "Melcombe in Dorset (summer 1348)", "Scotland (1349 to 1350)"],
          },
          {
            type: "match",
            q: "Match each medieval response to the explanation behind it.",
            pairs: [
              ["Praying and confessing sins", "Plague was God's punishment"],
              ["Carrying sweet-smelling herbs", "Plague spread through bad air"],
              ["Checking the position of the planets", "Plague was caused by the stars"],
            ],
          },
          { type: "choice", q: "Why do historians give a range, such as 'a third to a half', rather than an exact death toll?", options: ["Because nobody died in some years", "Because the surviving sources are incomplete and each has limits", "Because the records were all destroyed in 1381"], answer: 1 },
          { type: "gap", q: "Fill in the gaps.", text: "The plague was caused by the bacterium Yersinia ___. Its bubonic form was spread mainly by ___ living on black rats.", bank: ["pestis", "fleas", "flies", "Galen"], answers: ["pestis", "fleas"] },
          { type: "choice", q: "A bishop's register shows that nearly half the priests in his diocese were replaced in 1349. Why might this overestimate the death rate for everyone?", options: ["Priests never got ill", "Bishops did not write things down", "Priests visited the sick, so they may have caught the disease more often"], answer: 2, why: "A sample of people who were more exposed than average may not represent the whole population." },
        ],
      },
      task: {
        title: "Mapping and measuring the pestilence",
        intro: "Make a timeline map of the plague's spread and use it to write a reasoned answer about the death toll.",
        need: ["A printed or hand-drawn outline map of Europe (or trace one from an atlas)", "Coloured pencils", "Paper and a pencil"],
        steps: [
          "On your map, mark and date these places: Caffa (1346), Messina (October 1347), Marseille (November 1347), Paris (summer 1348), Melcombe in Dorset (summer 1348), London (autumn 1348), Wales and Ireland (1349), Scotland (1349 to 1350), Norway (1349).",
          "Shade areas in different colours for 1347, 1348, 1349 and 1350. Add arrows showing the direction of spread. What do you notice about the routes? Write two sentences linking the spread to trade.",
          "Copy this table of estimated death rates: Europe as a whole, about 33 to 50 per cent; England, about 33 to 50 per cent; the higher estimate by Ole Benedictow, about 60 per cent. Draw a simple bar chart showing the lowest and highest figure in each range.",
          "Write a short answer (about 250 words): 'Why do historians disagree about how many people died in the Black Death?' Refer to at least two types of source and explain a limitation of each.",
          "Finish with one sentence comparing a medieval explanation of the plague with the modern scientific one.",
        ],
      },
      exit: [
        { type: "choice", q: "Where did the Black Death first arrive in England in 1348?", options: ["London", "Melcombe in Dorset", "York"], answer: 1 },
        { type: "type", q: "What is the name of the bacterium that causes plague? (Yersinia ...)", answer: ["pestis", "Yersinia pestis", "yersinia pestis", "Pestis"] },
        { type: "choice", q: "What do most historians estimate as the proportion of England's population that died in 1348 to 1350?", options: ["About one in ten", "Between about a third and a half", "Nearly everyone"], answer: 1 },
        { type: "pick", q: "Which of these were medieval explanations for the plague? There is more than one.", options: ["God's punishment", "Bad air", "A conjunction of planets", "Bacteria carried by fleas"], answers: [0, 1, 2] },
        { type: "choice", q: "How did the plague mainly travel from Asia to Europe?", options: ["Along trade routes by land and sea", "Through the wind", "On migrating birds"], answer: 0 },
        { type: "choice", q: "What evidence largely settled the debate about whether the Black Death was plague?", options: ["A painting of a rat", "DNA from teeth in plague cemeteries", "A letter from the Pope"], answer: 1 },
      ],
      grownUp: {
        need: ["An outline map of Europe or an atlas to trace from", "Coloured pencils"],
        tips: [
          "This is a topic about mass death, and for some learners it may echo recent experiences of pandemic illness or bereavement. The lesson is factual and calm; check in on how your learner is feeling and keep the focus on evidence and explanation.",
          "The persecution of Jewish communities is mentioned briefly and factually. It is worth discussing why blaming a minority is both wrong and a recurring pattern in history.",
          "Arrival dates are approximate. One chronicle gives Melcombe and a date around 24 June 1348; other sources differ slightly, so 'summer 1348' is used.",
        ],
        younger: "Focus on the map and two sentences about trade routes. Then complete: 'Historians disagree about the death toll because...'.",
        older: "Research the East Smithfield plague cemetery and the DNA studies (Bos and colleagues, 2011). Explain how science changed historians' interpretations of the Black Death.",
      },
    },
    {
      slug: "medieval-life-5",
      title: "After the Black Death",
      emoji: "⚖️",
      minutes: 60,
      goal: "I can explain the short- and long-term consequences of the Black Death, including labour shortages, and evaluate how far it changed life for peasants.",
      starter: [
        { type: "choice", q: "In which year did the Black Death reach England?", options: ["1066", "1348", "1381"], answer: 1 },
        { type: "type", q: "Name the bacterium that caused the Black Death. (Yersinia ...)", answer: ["pestis", "Yersinia pestis", "yersinia pestis"] },
        { type: "choice", q: "Which form of plague spread through coughing?", options: ["Bubonic", "Pneumonic", "Septic"], answer: 1 },
        { type: "choice", q: "Roughly what proportion of England's population died?", options: ["A tenth", "A third to a half", "Three quarters or more"], answer: 1 },
        { type: "pick", q: "Which sources help historians estimate the death toll? There is more than one.", options: ["Manor court rolls", "Bishops' registers", "Newspapers", "Chronicles"], answers: [0, 1, 3] },
        { type: "choice", q: "Why did some people carry sweet-smelling herbs during the plague?", options: ["They wanted to attract rats", "It was a law", "They believed it spread through bad air"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "A world short of workers",
            text: [
              "The most immediate economic effect of the Black Death was a severe labour shortage. With perhaps a third to a half of the population gone, there were far fewer people to plough, sow and harvest, but the land was still there. Chroniclers described crops rotting in the fields because there was nobody to gather them.",
              "This changed the balance of power between lords and peasants. Labourers who survived could demand higher wages, and lords competed for workers. Some peasants left their manors, without permission, to work for whoever paid most. Lords who had relied on villeins' labour services found it harder to enforce them.",
              "Land also became easier to obtain. Surviving peasants could take over empty holdings, sometimes on better terms, and many lords switched from demanding labour services to charging money rents. Some landowners turned arable land over to sheep, which needed far fewer workers and produced valuable wool.",
              "Some villages shrank or were eventually abandoned. However, most deserted medieval villages were abandoned gradually over the following century and a half, often because of the switch to sheep farming, rather than because everyone died in 1348 to 1350.",
            ],
          },
          {
            heading: "The government fights back",
            text: [
              "Landowners, who dominated Parliament and the king's government, tried to stop wages rising. In 1349, while the plague was still raging, Edward III issued the Ordinance of Labourers. It ordered that wages should be kept at the levels of 1346, before the plague, and that able-bodied people must accept work when offered.",
              "In 1351 Parliament passed the Statute of Labourers, which repeated these rules and set out punishments, including fines, the stocks and imprisonment, for workers who demanded more or employers who paid more. Thousands of cases were brought to court over the following decades, which shows both that the law was enforced and that it was widely broken.",
              "In 1363 Parliament passed a sumptuary law, which set out what clothes people of different ranks were allowed to wear. Its purpose was to stop ordinary people dressing like their 'betters' as they grew better off. To landowners, the old social order seemed to be slipping away.",
              "These laws created deep resentment. Peasants who had survived the catastrophe found that the government was using the law to hold them down. Many historians see this anger as one of the long-term causes of the Peasants' Revolt of 1381.",
            ],
          },
          {
            heading: "Long-term change and interpretations",
            text: [
              "Plague did not disappear after 1350. It returned in 1361 to 1362, a wave that seems to have hit children especially hard, and again in 1369 and many times over the next three centuries. These repeated outbreaks kept the population low for more than a hundred years, so the labour shortage lasted.",
              "Over the long term, serfdom declined. By around 1500, very few people in England were still villeins. Real wages (what wages could actually buy) rose, and many ordinary people ate better, with more meat and ale, in the 1400s than their ancestors had around 1300. The Victorian historian James Thorold Rogers called the 1400s a 'golden age' for the English labourer.",
              "Not all historians agree with this optimistic view. Some argue that the improvement was slow and uneven, that lords resisted fiercely for decades, and that the trauma of repeated plagues should not be forgotten. Others point out that the decline of serfdom had already begun before 1348, so the Black Death sped up change rather than starting it.",
              "There were cultural changes too. So many clergy died that some parishes were served by less well-trained replacements, and English gradually replaced French in government and the law courts: from 1362 the Statute of Pleading allowed court cases to be conducted in English. When you judge the impact of the Black Death, consider the short term and the long term, and think about change and continuity.",
            ],
          },
        ],
        words: [
          { word: "labour shortage", meaning: "a situation in which there are not enough workers to do the work that needs doing" },
          { word: "Statute of Labourers", meaning: "the 1351 law that tried to keep wages at pre-plague levels" },
          { word: "sumptuary law", meaning: "a law controlling what people of different ranks could wear or spend" },
          { word: "real wages", meaning: "wages measured by what they can actually buy" },
          { word: "consequence", meaning: "a result or effect of an event" },
          { word: "interpretation", meaning: "a historian's view or explanation of the past, based on evidence" },
        ],
      },
      practice: {
        intro: "Analyse the consequences of the Black Death.",
        questions: [
          { type: "choice", q: "Which best explains why wages rose after the Black Death?", options: ["There were fewer workers, so employers had to compete for them", "The king ordered higher wages", "Prices of everything fell to zero"], answer: 0 },
          {
            type: "order",
            q: "Put these in chronological order, earliest first.",
            items: ["Ordinance of Labourers", "Statute of Labourers", "Second major plague outbreak", "Sumptuary law on clothing"],
          },
          {
            type: "match",
            q: "Match each law to its purpose.",
            pairs: [
              ["Statute of Labourers (1351)", "To keep wages at pre-plague levels"],
              ["Sumptuary law (1363)", "To control what people of each rank could wear"],
              ["Statute of Pleading (1362)", "To allow court cases to be conducted in English"],
            ],
          },
          { type: "pick", q: "Which were long-term consequences of the Black Death? There is more than one.", options: ["The decline of serfdom", "Higher real wages for many labourers", "The end of the Church", "More land turned over to sheep"], answers: [0, 1, 3] },
          { type: "choice", q: "Thousands of court cases were brought under the Statute of Labourers. What does this evidence suggest?", options: ["Nobody took any notice of the law", "The law was enforced but also widely broken", "Everyone obeyed it perfectly"], answer: 1, why: "Many prosecutions show the authorities tried hard to enforce it, and that many people defied it." },
        ],
      },
      task: {
        title: "How far did the Black Death change life for peasants?",
        intro: "Plan and write an extended essay, the kind of question you will meet at GCSE, weighing change against continuity.",
        need: ["Paper and a pencil", "Two colours of pen or highlighter"],
        steps: [
          "Draw a two-column table headed 'Change' and 'Continuity (or limits to change)'. Using this lesson, list at least four points in each column. Examples: wages rose; the Statute of Labourers tried to stop them.",
          "Split your points into short term (1348 to about 1360) and long term (up to about 1500) using two colours.",
          "Plan four paragraphs: an introduction that defines what you are judging; a paragraph on changes; a paragraph on limits and continuity; a conclusion with a clear judgement.",
          "Write the essay (about 400 to 500 words). In each paragraph, make a point, support it with specific evidence (dates, laws, figures), and explain how it answers the question.",
          "Include at least one historian's interpretation, such as Thorold Rogers's 'golden age', and say whether you agree with it.",
          "Reread and check for UK spelling, capital letters for names and laws, and accurate dates.",
        ],
      },
      exit: [
        { type: "choice", q: "What was the main economic effect of the Black Death?", options: ["A shortage of land", "Too many peasants", "A shortage of workers"], answer: 2 },
        { type: "type", q: "In which year was the Statute of Labourers passed?", answer: ["1351"] },
        { type: "choice", q: "What did the Statute of Labourers try to do?", options: ["Raise wages", "Keep wages at the levels before the plague", "Abolish serfdom"], answer: 1 },
        { type: "choice", q: "What was a sumptuary law?", options: ["A law controlling what people of each rank could wear", "A tax on food", "A law about church services"], answer: 0 },
        { type: "pick", q: "Which statements are supported by evidence from this lesson? There is more than one.", options: ["Serfdom had largely disappeared by around 1500", "Plague returned in 1361 to 1362", "Every village was deserted by 1350", "Many lords switched to money rents"], answers: [0, 1, 3] },
        { type: "choice", q: "Which interpretation suggests the Black Death sped up change rather than starting it?", options: ["The 1400s were a golden age for labourers", "Serfdom was already declining before 1348", "The plague came from Asia"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and two highlighters"],
        tips: [
          "Learners can find it uncomfortable that a catastrophe had some positive results for survivors. That tension is exactly what historians discuss; it is fine to say so openly.",
          "'How far' questions need a judgement. A strong conclusion weighs both sides and says which is more convincing, and why.",
          "If writing 400 words in one go is too much, split the essay across two sittings: plan and first two paragraphs, then the rest.",
        ],
        younger: "Write three paragraphs using the frame 'One change was... However... Overall I think...'.",
        older: "Read about real wages in the 1400s (for example, summaries of Christopher Dyer's work on living standards) and add a paragraph testing the 'golden age' interpretation against the evidence.",
      },
    },
    {
      slug: "medieval-life-6",
      title: "The Peasants' Revolt, 1381",
      emoji: "🔥",
      minutes: 60,
      goal: "I can explain the causes, events and results of the Peasants' Revolt of 1381, and evaluate how different sources describe it.",
      starter: [
        { type: "choice", q: "What was the main economic effect of the Black Death?", options: ["A surplus of workers", "Lower wages", "A shortage of workers"], answer: 2 },
        { type: "type", q: "In which year was the Statute of Labourers passed?", answer: ["1351"] },
        { type: "choice", q: "What did the Statute of Labourers try to do?", options: ["Keep wages at pre-plague levels", "Give every peasant land", "Ban sheep farming"], answer: 0 },
        { type: "choice", q: "What was the purpose of the 1363 sumptuary law?", options: ["To raise taxes on wool", "To stop ordinary people dressing like those of higher rank", "To allow English in court"], answer: 1 },
        { type: "pick", q: "Which were long-term effects of the Black Death? There is more than one.", options: ["The decline of serfdom", "Higher real wages for many", "A rise in the population straight away"], answers: [0, 1] },
        { type: "choice", q: "Which historian called the 1400s a 'golden age' for the English labourer?", options: ["Thomas Walsingham", "James Thorold Rogers", "Henry Knighton"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Why 1381?",
            text: [
              "The Peasants' Revolt had long-term and short-term causes. In the long term, many peasants resented serfdom and the labour services they still owed, especially as they knew their labour was now valuable. The Statute of Labourers, enforced for thirty years, made that resentment sharper.",
              "Ideas mattered too. A radical priest named John Ball preached that all people were equal in God's eyes, asking: 'When Adam delved and Eve span, who was then the gentleman?' In other words, when Adam dug and Eve spun in the Garden of Eden, there were no lords. The Church authorities had imprisoned him for his preaching.",
              "The war with France, later called the Hundred Years' War, was going badly and was very expensive. The king, Richard II, was only fourteen in 1381, and many people blamed his advisers, such as his uncle John of Gaunt and the Archbishop of Canterbury, Simon Sudbury, who was also Chancellor, for corruption and failure.",
              "The trigger was a series of poll taxes, taxes charged per head. The 1377 tax was 4d (four pence) per person over fourteen; the 1380 tax was 1 shilling (12d) per person over fifteen, three times as much, and it was the same for rich and poor. Many people avoided it, and when commissioners were sent to collect the missing money in Essex in late May 1381, villagers at Fobbing and Brentwood drove them away.",
            ],
          },
          {
            heading: "Ten days in June",
            text: [
              "The rising spread rapidly through Essex and Kent. In Kent the rebels chose Wat Tyler as their leader and freed John Ball from prison in Maidstone. They attacked the houses of unpopular officials and burned manorial records, which recorded their unfree status and their obligations, a clear sign of what they wanted to destroy.",
              "On 13 June 1381 rebels from Kent and Essex entered London, with help from some Londoners. They burned the Savoy Palace, the luxurious home of John of Gaunt. On 14 June Richard II met one group at Mile End and agreed to their demands, including the end of serfdom, issuing charters of freedom. That same day, rebels entered the Tower of London and executed Archbishop Sudbury and the Treasurer, Robert Hales.",
              "On 15 June the king met Wat Tyler and the Kent rebels at Smithfield. The accounts differ, but during the meeting there was a confrontation, and the Mayor of London, William Walworth, struck Tyler, who was then killed. Richard rode towards the rebels and, according to the chroniclers, told them he would be their leader. The crowd dispersed.",
              "Within weeks the king's promises were withdrawn. Richard is reported to have told one group of rebels, 'Serfs you are, and serfs you shall remain'. Rebel leaders were tried and executed, including John Ball at St Albans in July 1381. Risings in other parts of England, such as East Anglia, were also put down.",
            ],
          },
          {
            heading: "Sources, interpretations and results",
            text: [
              "Almost all our accounts of the revolt were written by people hostile to the rebels. Thomas Walsingham, a monk of St Albans Abbey, whose own abbey had been challenged by its townspeople during the revolt, described the rebels as a mob of wild peasants. The French chronicler Jean Froissart, who was not in England at the time, wrote a dramatic account for an aristocratic audience. The Anonimalle Chronicle, written in French by an unknown author, seems to include eyewitness detail from London.",
              "None of these writers were peasants, and the rebels' own voices survive mainly through short letters attributed to John Ball, quoted by hostile chroniclers. Historians therefore read the sources critically, asking who wrote them, when, for whom and why, and compare them with records such as court cases from after the revolt.",
              "Did the revolt fail? In the short term, yes: its leaders were killed, its charters cancelled and serfdom stayed. But many historians argue that in the longer term it had effects. Parliament did not attempt another general poll tax for more than a century, and lords became more cautious about pushing peasants too hard. Serfdom faded away over the next century, though most historians think economic forces after the Black Death mattered more than the revolt itself.",
              "Interpretations have also changed over time. Medieval chroniclers saw the rebels as dangerous rebels against God's order. Later writers, including nineteenth- and twentieth-century radicals and socialists, saw them as early fighters for freedom and equality. Modern historians stress that many rebels were not the poorest peasants but village leaders, craftworkers and townspeople, with clear and organised aims.",
            ],
          },
        ],
        words: [
          { word: "poll tax", meaning: "a tax charged at the same rate on each person, regardless of wealth" },
          { word: "revolt", meaning: "an organised attempt to resist or overthrow those in authority" },
          { word: "trigger", meaning: "the short-term event that sets off a bigger event" },
          { word: "chronicler", meaning: "a writer who recorded events, often year by year" },
          { word: "provenance", meaning: "where a source comes from: who made it, when and why" },
          { word: "radical", meaning: "favouring complete or extreme change to society" },
        ],
      },
      practice: {
        intro: "Work like a historian on the Peasants' Revolt.",
        questions: [
          {
            type: "order",
            q: "Put these events of 1381 in order, earliest first.",
            items: ["Villagers at Fobbing and Brentwood drive away tax collectors", "Rebels enter London and burn the Savoy Palace", "Richard II meets rebels at Mile End", "Wat Tyler is killed at Smithfield", "John Ball is executed at St Albans"],
          },
          {
            type: "match",
            q: "Match each cause to its type.",
            pairs: [
              ["Resentment of serfdom", "Long-term cause"],
              ["The 1380 poll tax", "Short-term trigger"],
              ["John Ball's preaching", "Ideas and beliefs"],
              ["Defeats in the war with France", "Political cause"],
            ],
          },
          { type: "choice", q: "Why did rebels burn manorial records?", options: ["They needed fuel for fires", "The records contained the king's orders", "The records showed their unfree status and the services they owed"], answer: 2 },
          { type: "gap", q: "Fill in the gaps.", text: "The 1380 poll tax was ___ per person. The king, Richard II, was ___ years old at the time of the revolt.", bank: ["1 shilling", "4d", "fourteen", "forty"], answers: ["1 shilling", "fourteen"] },
          { type: "choice", q: "Thomas Walsingham described the rebels as a wild mob. Which fact about him best explains why we should treat his account with caution?", options: ["He was a monk at St Albans Abbey, which itself faced a rising by its townspeople", "He wrote in Latin", "He lived in England"], answer: 0, why: "His abbey was a target of local rebels, so he had strong reasons to be hostile." },
        ],
      },
      task: {
        title: "Investigating the revolt",
        intro: "Compare two interpretations of the Peasants' Revolt and write a source-based judgement.",
        need: ["Paper and a pencil", "Optional: a computer or tablet with internet access, with an adult's permission"],
        steps: [
          "Make a timeline of the revolt from late May to July 1381 with at least six dated events.",
          "Read these two interpretations. A: 'The rebels were a lawless mob, stirred up by a mad priest, who murdered the king's ministers.' (A summary of the view of hostile chroniclers.) B: 'The rebels were organised and had clear aims: the end of serfdom and fair treatment. They were brave pioneers of freedom.' (A summary of later radical writers.)",
          "For each interpretation, list evidence from this lesson that supports it and evidence that challenges it.",
          "Explain why the two interpretations differ. Think about who held them, when, and what they wanted to show.",
          "Write an extended answer (about 400 words): 'Why did the Peasants' Revolt break out in 1381?' Explain at least three causes, then decide which was most important and explain why. Link causes together where you can, for example the Black Death and the Statute of Labourers.",
          "Optional research, with permission: find out what happened in your own county or a nearby town in 1381, using a museum, archive or local history website.",
        ],
      },
      exit: [
        { type: "choice", q: "What was the trigger for the Peasants' Revolt?", options: ["The death of Edward III", "The poll tax and attempts to collect it", "A new plague outbreak"], answer: 1 },
        { type: "type", q: "Who led the Kent rebels in 1381? (Wat ...)", answer: ["Tyler", "Wat Tyler", "tyler", "wat tyler"] },
        { type: "choice", q: "Which radical priest preached that all people were equal?", options: ["Thomas Becket", "John Ball", "Simon Sudbury"], answer: 1 },
        { type: "choice", q: "What happened at Smithfield on 15 June 1381?", options: ["The rebels crowned a new king", "Wat Tyler was killed and the rebels dispersed", "The Savoy Palace was built"], answer: 1 },
        { type: "pick", q: "Which were results of the revolt? There is more than one.", options: ["Richard II's promises were withdrawn", "Rebel leaders were executed", "Serfdom was abolished immediately", "No general poll tax was tried again for more than a century"], answers: [0, 1, 3] },
        { type: "choice", q: "Why must historians read chronicles of the revolt critically?", options: ["They were written by the rebels themselves", "They were written in the twentieth century", "They were written by people hostile to the rebels"], answer: 2 },
      ],
      grownUp: {
        need: ["Paper and a pencil", "Optional supervised internet access"],
        tips: [
          "The revolt involved killings, including the executions of Sudbury and Hales. These are mentioned plainly without detail; you can discuss why violence happened without dwelling on it.",
          "Quotations such as Ball's 'When Adam delved...' and Richard's 'Serfs you are...' come from hostile chroniclers. Encourage your learner to say 'reportedly' or 'according to Walsingham'.",
          "The causation essay is a classic GCSE-style question. Good answers link causes together instead of listing them.",
        ],
        younger: "Pick three causes, write a paragraph on each using 'This caused the revolt because...', then one sentence saying which mattered most.",
        older: "Compare the accounts of the Smithfield meeting in Froissart and the Anonimalle Chronicle (extracts are available on reputable history websites) and explain why they differ.",
      },
    },
  ],
};
