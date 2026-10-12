import type { LessonUnit } from "@/lib/lessons";

/**
 * Scotland's wars of independence, for ages 11 to 14 (KS3; Scottish S1 to S3). From the death of Alexander III in 1286
 * to the Treaty of Edinburgh–Northampton in 1328, with a steady focus on sources, interpretations and myth. War and
 * executions are covered calmly and without graphic detail.
 */
export const scottishIndependenceWars: LessonUnit = {
  slug: "scottish-independence-wars",
  title: "Scotland's wars of independence",
  short: "Wars of independence",
  subject: "History",
  ages: "11 to 14",
  emoji: "⚔️",
  color: "#4A5D78",
  summary: "Six lessons on the succession crisis after Alexander III, Edward I and the Great Cause, William Wallace and Stirling Bridge, Robert the Bruce and Bannockburn, the Declaration of Arbroath as a source, and the Treaty of Edinburgh–Northampton, with a close look at myth versus history.",
  cover: "/lessons/units/scottish-independence-wars.jpg",
  lessons: [
    {
      slug: "scottish-independence-wars-1",
      title: "A kingdom without a king",
      emoji: "👑",
      minutes: 60,
      goal: "I can explain how the deaths of Alexander III and the Maid of Norway created a succession crisis in Scotland between 1286 and 1290.",
      starter: [
        { type: "choice", q: "Which country shares a land border with Scotland?", options: ["Wales", "Ireland", "England"], answer: 2 },
        { type: "choice", q: "Roughly when were the Middle Ages (the medieval period) in Britain?", options: ["About 1066 to 1500", "About 43 to 410", "About 1700 to 1900"], answer: 0 },
        { type: "type", q: "What word means a king or queen who rules a country?", answer: ["monarch", "a monarch", "sovereign"] },
        { type: "pick", q: "Which of these are kinds of historical source? There is more than one.", options: ["A letter written at the time", "A chronicle written by a monk", "A film made in the 1990s", "A charter with a wax seal"], answers: [0, 1, 3], why: "A modern film is an interpretation of the past, not a source from the time." },
        { type: "choice", q: "What does it mean for a country to be independent?", options: ["It has no army", "It rules itself and is not controlled by another country", "It has no king or queen"], answer: 1 },
        { type: "choice", q: "In the Middle Ages, how did someone usually become king?", options: ["By winning a public vote", "By inheriting the crown from a parent or close relative", "By passing an exam"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Scotland in 1286",
            text: [
              "In the 1280s Scotland was an established kingdom with its own king, laws, church and nobility. Alexander III had ruled since 1249, when he became king at the age of seven. His kingdom mixed Gaelic, Scots, Norse and Anglo-Norman traditions, and its nobles often held land in both Scotland and England.",
              "Alexander's reign was largely peaceful. After the Battle of Largs in 1263, the Treaty of Perth (1266) transferred the Western Isles and the Isle of Man from Norway to Scotland. Relations with England were mostly friendly: Alexander had married Margaret, the daughter of Henry III of England, so Edward I of England was his brother-in-law.",
              "There was one long-running question. English kings sometimes claimed to be the overlords of Scotland, meaning that the Scottish king owed them loyalty. Alexander was careful. When he paid homage to Edward I in 1278 for lands he held in England, he insisted that 'nobody has a right to homage for my kingdom of Scotland save God alone'.",
              "Later Scottish writers looked back on Alexander's reign as a golden age of peace and plenty. Historians treat that picture with some caution, because it was shaped by the years of war that followed: a peaceful past looked even better from a time of conflict.",
            ],
          },
          {
            heading: "A fall in the dark",
            text: [
              "On the stormy night of 18 to 19 March 1286, Alexander III rode from Edinburgh towards Kinghorn in Fife to join his new wife, Yolande de Dreux. In the dark he became separated from his companions, and he was found dead the next morning at the foot of a steep bank, apparently after a fall from his horse. He was 44.",
              "His death was a disaster for the kingdom because all three of his children had died before him: David in 1281, Margaret in 1283 and Alexander in January 1284. The only direct heir was a small child, Margaret, the daughter of Alexander's daughter Margaret and King Eric II of Norway. She was born in 1283 and is known as the Maid of Norway.",
              "In April 1286 the leading nobles and bishops met at Scone and chose six Guardians of Scotland to govern on behalf of 'the community of the realm' until the new ruler could take over. This showed something important: Scotland's leaders saw the kingdom as a community that existed even when there was no king on the throne.",
              "The situation was still tense. A child ruler living overseas was a weak position, and rival noble families had their own ambitions. Later in 1286, the Bruce family, who believed they had a claim to the throne, seized royal castles in the south-west before order was restored.",
            ],
          },
          {
            heading: "Birgham and Orkney",
            text: [
              "The Guardians looked for a way to protect the young queen and keep the peace. Edward I proposed that Margaret should marry his son and heir, Edward of Caernarfon. In July 1290 the Treaty of Birgham agreed the marriage, but also set out guarantees: Scotland would remain 'separate and divided from England' and 'free in itself and without subjection', with its own laws and customs.",
              "A marriage like this, a dynastic marriage, was a normal way of joining royal families. If it had happened, the same royal family would eventually have ruled both kingdoms, but the treaty tried to make sure Scotland kept its own government.",
              "In autumn 1290 Margaret sailed from Norway, but she fell ill on the voyage and died in Orkney, probably in late September. She was about seven years old and had never set foot on the Scottish mainland.",
              "Now there was no obvious heir at all, and several nobles began to gather support. In October 1290 William Fraser, Bishop of St Andrews and one of the Guardians, wrote to Edward I asking him to come to the border to help prevent bloodshed. Asking a powerful neighbour to help settle a dispute seemed sensible at the time, but it opened the door to English intervention.",
            ],
          },
        ],
        words: [
          { word: "succession", meaning: "the process by which one ruler follows another; a succession crisis happens when it is unclear who should rule next" },
          { word: "heir", meaning: "the person who has the right to inherit a title, throne or property" },
          { word: "Guardians of Scotland", meaning: "the nobles and bishops chosen to govern Scotland when there was no adult monarch able to rule" },
          { word: "community of the realm", meaning: "the idea that the kingdom's leading people (nobles, bishops and landholders) together represented Scotland" },
          { word: "overlord", meaning: "a ruler to whom another ruler owes loyalty and service" },
          { word: "dynastic marriage", meaning: "a marriage arranged to join or strengthen royal or noble families and their lands" },
        ],
      },
      practice: {
        intro: "Check your understanding of how the crisis developed between 1286 and 1290.",
        questions: [
          {
            type: "order",
            q: "Put these events in chronological order, earliest first.",
            items: ["The Treaty of Perth gives Scotland the Western Isles", "Alexander III dies near Kinghorn", "Six Guardians are chosen at Scone", "The Treaty of Birgham is agreed", "The Maid of Norway dies in Orkney"],
          },
          { type: "choice", q: "Which best explains why Alexander III's death caused a crisis?", options: ["He had made enemies of every noble family", "All his children had died, leaving only a young granddaughter living in Norway", "He had no laws or government in place"], answer: 1, why: "A succession crisis is about who should rule next. With Alexander's children dead, the only heir was a small child abroad." },
          { type: "gap", q: "Fill in the gaps.", text: "The Treaty of ___ (1290) agreed that Margaret would marry Edward I's son, but promised Scotland would stay ___ and divided from England.", bank: ["Birgham", "Perth", "separate", "united", "Northampton"], answers: ["Birgham", "separate"] },
          {
            type: "match",
            q: "Match each person to their role.",
            pairs: [
              ["Alexander III", "King of Scots who died in 1286"],
              ["Margaret, Maid of Norway", "Child heir who died in Orkney in 1290"],
              ["Edward I", "King of England who proposed a royal marriage"],
              ["William Fraser", "Bishop and Guardian who wrote to the English king"],
            ],
          },
          { type: "choice", q: "A Scottish poem written over a century later calls Alexander's reign a time of 'love and law'. Why should a historian be cautious about this?", options: ["Poems are never useful as evidence", "It was written after years of war, so the past may have been made to look better than it was", "It was written in English"], answer: 1 },
        ],
      },
      task: {
        title: "A briefing for the Guardians",
        intro: "Imagine it is October 1290 and the Maid of Norway has just died. You are an adviser to the Guardians. Write a clear, persuasive briefing on the danger facing the kingdom.",
        need: ["Paper or a document on a computer", "A pencil and coloured pens", "Optional: a library book or website on medieval Scotland (ask permission before going online)"],
        steps: [
          "Draw a simple family tree showing Alexander III, his three children and his granddaughter Margaret. Cross through those who had died by 1290. What does the tree show about the problem?",
          "Make a timeline from 1263 to 1290 with at least six events from this lesson.",
          "Write a briefing of about 300 words with three headings: 'What has happened', 'The dangers we face' and 'Should we ask Edward I for help?'. Give at least two arguments for and two against involving Edward.",
          "Finish with your own recommendation and one sentence explaining why the Guardians might have trusted Edward in 1290.",
          "Read your briefing back. Have you used the words succession, heir and Guardians accurately?",
        ],
      },
      exit: [
        { type: "choice", q: "In which year did Alexander III die?", options: ["1263", "1286", "1290"], answer: 1 },
        { type: "choice", q: "Who was the Maid of Norway?", options: ["Alexander III's granddaughter and heir", "Edward I's daughter", "Alexander III's second wife"], answer: 0 },
        { type: "type", q: "What were the six nobles and bishops chosen to govern Scotland in 1286 called? (The ... of Scotland)", answer: ["Guardians", "guardians", "the Guardians", "Guardians of Scotland"] },
        { type: "pick", q: "Which were terms of the Treaty of Birgham (1290)? There is more than one.", options: ["Margaret would marry Edward I's son", "Scotland would become part of England", "Scotland would remain separate, with its own laws", "Edward I would become King of Scots"], answers: [0, 2] },
        { type: "choice", q: "Where did the Maid of Norway die?", options: ["Edinburgh", "Bergen", "Orkney"], answer: 2 },
        { type: "choice", q: "Which statement best explains why Edward I became involved in Scottish affairs in 1290?", options: ["He invaded as soon as Alexander III died", "With no clear heir, a Scottish bishop asked him to help prevent civil war", "The Pope ordered him to rule Scotland"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper or a computer for writing", "Optional: access to a library or the internet, with your permission"],
        tips: [
          "The unit asks learners to treat dates precisely. 1286 and 1290 are the anchor dates for this lesson; it is worth checking they can say what happened in each.",
          "The quotation from Alexander III in 1278 comes from a record of the homage ceremony. It is a good early example of the overlordship question that runs through the whole unit.",
          "A family tree drawn freehand is fine. The point is to see visually why the line of succession broke.",
        ],
        younger: "Focus on the family tree and three key dates (1286, 1290 and the Treaty of Birgham), then talk through the briefing aloud before writing a shorter version.",
        older: "Read about the 'community of the realm' and write a paragraph on how the Guardians' government suggests that Scotland's leaders saw the kingdom as more than just the king. This idea becomes important in National 5 and GCSE study.",
      },
    },
    {
      slug: "scottish-independence-wars-2",
      title: "Edward I and the Great Cause",
      emoji: "⚖️",
      minutes: 60,
      goal: "I can explain how Edward I judged the Great Cause, why John Balliol became king, and how the conflict led to the English invasion of 1296.",
      starter: [
        { type: "choice", q: "In which year did Alexander III die?", options: ["1290", "1286", "1296"], answer: 1 },
        { type: "choice", q: "Why did the death of the Maid of Norway leave Scotland in crisis?", options: ["There was no obvious heir to the throne", "England had already invaded", "The Guardians had resigned"], answer: 0 },
        { type: "type", q: "Which English king did Bishop Fraser write to in 1290? (Give his name and number)", answer: ["Edward I", "Edward 1", "Edward the First", "King Edward I"] },
        { type: "choice", q: "What is an overlord?", options: ["A ruler who has lost his kingdom", "A ruler to whom another ruler owes loyalty and service", "A judge in a church court"], answer: 1 },
        { type: "choice", q: "What did the Treaty of Birgham promise?", options: ["Scotland would join with Norway", "Scotland would stay separate from England, with its own laws", "The Guardians would rule for ever"], answer: 1 },
        { type: "pick", q: "Which words describe the situation in Scotland in late 1290? There is more than one.", options: ["Succession crisis", "Rival claimants", "Settled peace", "Fear of civil war"], answers: [0, 1, 3] },
      ],
      learn: {
        cards: [
          {
            heading: "Thirteen claimants and an umpire",
            text: [
              "After Margaret's death, thirteen men put forward claims to the Scottish throne. This contest is known as the Great Cause. The two strongest claimants were John Balliol, Lord of Galloway, and Robert Bruce, Lord of Annandale (grandfather of the future King Robert). Both were descended from David, Earl of Huntingdon, a younger brother of King William the Lion.",
              "Their claims rested on different principles. Balliol was the grandson of David's eldest daughter, so he came from the senior line. This is primogeniture, the right of the eldest line to inherit. Bruce was the son of David's second daughter, so he was one generation closer to the royal line. He argued that nearness of blood should count for more.",
              "Edward I agreed to judge the case, but at Norham, on the River Tweed, in May 1291 he demanded that the claimants first recognise him as overlord of Scotland. The Scottish community argued that only a king could answer such a demand, but the claimants, each hoping for Edward's favour, accepted it. Edward also took control of royal castles in Scotland while the case was heard.",
              "A court of 104 auditors heard the case: 40 chosen by Balliol, 40 by Bruce and 24 by Edward. The process took more than a year and was carefully recorded, which made Edward's judgement look legal and fair, as well as confirming his claim to authority over Scotland.",
            ],
          },
          {
            heading: "King John and the overlord",
            text: [
              "On 17 November 1292, at Berwick, Edward gave judgement in favour of John Balliol. By the rules of inheritance most lawyers followed at the time, Balliol had the stronger claim, and many historians think the decision was legally correct. He was inaugurated as King of Scots at Scone on 30 November 1292, and in December he paid homage to Edward for the kingdom of Scotland.",
              "Edward then treated Scotland as a dependent territory. He allowed Scots who lost cases in Scottish courts to appeal to him in England, and he summoned King John to appear before English courts as if he were an ordinary lord. In 1294, when war broke out with France, Edward demanded that John and the Scottish nobles provide military service.",
              "For Scotland's leaders this went too far. In 1295 a council of twelve took control of government from John, whom they saw as too weak to resist. In October 1295 they agreed an alliance with Philip IV of France, in which each kingdom promised to support the other against England. This was the beginning of what became known as the Auld Alliance, which lasted, on and off, for more than 250 years.",
              "To Edward, the alliance with his enemy was rebellion by a vassal. To the Scots, it was the act of an independent kingdom defending itself.",
            ],
          },
          {
            heading: "1296: conquest",
            text: [
              "In March 1296 Edward invaded. His army stormed Berwick, then Scotland's wealthiest trading town, and a great many of its inhabitants were killed. On 27 April 1296 the Scottish army was defeated at the Battle of Dunbar, and many leading nobles were captured.",
              "In July 1296 King John surrendered. He gave up his kingdom and was stripped of his royal insignia, including the royal arms on his surcoat. This led to his mocking nickname 'Toom Tabard', meaning 'empty coat'. He was taken to England as a prisoner and later allowed to go into exile in France.",
              "Edward set out to remove the symbols of Scottish kingship. He took the Stone of Destiny (the Stone of Scone), on which Scottish kings had been inaugurated, to Westminster Abbey, along with royal records and relics. In August 1296 nearly 2,000 Scottish landholders swore loyalty to him at Berwick; their sealed oaths are known as the Ragman Roll. Scotland was to be governed by English officials.",
              "Historians interpret Edward's actions differently. Some see a ruthless opportunist who used the succession crisis to conquer a neighbour. Others stress that he genuinely believed in an English overlordship going back centuries, and that he acted by the legal standards of his time. Most agree that his demands on King John made war far more likely.",
            ],
          },
        ],
        words: [
          { word: "the Great Cause", meaning: "the legal contest of 1291 to 1292 to decide who should be King of Scots" },
          { word: "claimant", meaning: "a person who says they have a right to something, such as a throne" },
          { word: "primogeniture", meaning: "the rule that the eldest child, or the eldest line of a family, inherits first" },
          { word: "homage", meaning: "a formal ceremony in which a person promises loyalty to a lord or overlord" },
          { word: "Auld Alliance", meaning: "the alliance between Scotland and France against England, first agreed in 1295" },
          { word: "Ragman Roll", meaning: "the sealed oaths of loyalty to Edward I sworn by Scottish landholders in 1296" },
        ],
      },
      practice: {
        intro: "Test your grasp of the Great Cause and the road to war.",
        questions: [
          { type: "choice", q: "On what principle did John Balliol mainly base his claim?", options: ["Nearness of blood to the royal line", "Being chosen by the Pope", "Descent from the senior (eldest) line"], answer: 2 },
          {
            type: "order",
            q: "Put these events in order, earliest first.",
            items: ["Claimants accept Edward as overlord at Norham", "Edward judges in favour of Balliol at Berwick", "Scotland agrees an alliance with France", "The Battle of Dunbar", "King John surrenders and gives up his kingdom"],
          },
          { type: "pick", q: "Which actions by Edward I after 1292 angered Scotland's leaders? There is more than one.", options: ["Hearing appeals from Scottish courts in England", "Returning the Stone of Destiny", "Demanding military service against France", "Summoning King John to English courts"], answers: [0, 2, 3] },
          { type: "gap", q: "Fill in the gaps.", text: "King John was nicknamed '___ Tabard', meaning empty coat. Edward took the Stone of ___ to Westminster Abbey.", bank: ["Toom", "Royal", "Destiny", "Arbroath", "Empty"], answers: ["Toom", "Destiny"] },
          { type: "choice", q: "Which evidence best supports the view that Edward wanted the Great Cause to strengthen his own power?", options: ["He demanded recognition as overlord before judging the case", "He chose a claimant from the senior line", "The court had 104 auditors"], answer: 0, why: "Making the claimants accept his overlordship first meant that whoever won would rule under him." },
        ],
      },
      task: {
        title: "How far was Edward I to blame?",
        intro: "Plan and write an extended answer to the question: 'How far was Edward I responsible for the outbreak of war in 1296?'",
        need: ["Paper or a computer", "Two colours of pen or highlighter"],
        steps: [
          "List at least six factors that led to war in 1296. Include actions by Edward I and factors that were not his doing, such as the deaths of 1286 and 1290, the claimants' choices and the Scottish alliance with France.",
          "Highlight factors that were Edward's responsibility in one colour and other factors in another.",
          "Write an introduction that answers the question in one or two sentences, for example 'Edward was largely responsible because… although…'.",
          "Write two paragraphs, one on Edward's responsibility and one on other factors. Use the Point, Evidence, Explain structure, and include at least three accurate dates.",
          "Write a conclusion that makes a clear judgement: was Edward mainly responsible, partly responsible, or not really responsible? Explain which factor you think mattered most and why. Aim for 400 to 500 words in total.",
        ],
      },
      exit: [
        { type: "choice", q: "What was the Great Cause?", options: ["The legal contest to decide who should be King of Scots", "A crusade to the Holy Land", "The rebellion led by William Wallace"], answer: 0 },
        { type: "choice", q: "Who won the Great Cause in 1292?", options: ["Robert Bruce, Lord of Annandale", "John Balliol", "Edward of Caernarfon"], answer: 1 },
        { type: "type", q: "Which country did Scotland make an alliance with in 1295?", answer: ["France", "france"] },
        { type: "match", q: "Match each term to its meaning.", pairs: [["Homage", "A ceremony promising loyalty to a lord"], ["Primogeniture", "The eldest line inherits first"], ["Ragman Roll", "Oaths of loyalty sworn to Edward in 1296"], ["Toom Tabard", "Mocking nickname for King John"]] },
        { type: "choice", q: "Which battle in April 1296 ended Scottish resistance to Edward's invasion that year?", options: ["Stirling Bridge", "Bannockburn", "Dunbar"], answer: 2 },
        { type: "choice", q: "Why did Edward take the Stone of Destiny to Westminster?", options: ["To sell it", "To remove a powerful symbol of Scottish kingship", "Because the Scots asked him to keep it safe"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper or a computer", "Highlighters"],
        tips: [
          "The extended answer mirrors the 'how far' questions used at GCSE and National 5. A clear judgement in the introduction and conclusion matters more than length.",
          "The storming of Berwick involved a large loss of life among townspeople. The lesson states this plainly without detail; let your teenager's questions guide any further discussion.",
          "Some books say 13 claimants, some 14, depending on how they count. The unit uses 13, which is the more common figure.",
        ],
        younger: "Reduce the essay to three paragraphs: one cause that was Edward's fault, one that was not, and a one-sentence judgement. A writing frame with sentence starters helps.",
        older: "Research the case of Macduff of Fife, who appealed to Edward against King John's court, and explain how it shows the problem of overlordship. Try weighing the two historians' views in the third card using the phrase 'this interpretation is convincing because'.",
      },
    },
    {
      slug: "scottish-independence-wars-3",
      title: "William Wallace and Stirling Bridge",
      emoji: "🌉",
      minutes: 60,
      goal: "I can explain why the Scots won at Stirling Bridge in 1297, describe what happened to Wallace afterwards, and evaluate the sources about him.",
      starter: [
        { type: "choice", q: "Who won the Great Cause in 1292?", options: ["John Balliol", "Robert Bruce, Lord of Annandale", "Edward I"], answer: 0 },
        { type: "type", q: "In which year did Edward I invade Scotland and force King John to give up his kingdom?", answer: ["1296"] },
        { type: "choice", q: "What was the Auld Alliance?", options: ["An alliance between Scotland and Norway", "An alliance between Scotland and France against England", "A peace treaty between England and Scotland"], answer: 1 },
        { type: "choice", q: "What did Edward demand at Norham in 1291?", options: ["That the claimants recognise him as overlord", "That the Scots pay him £20,000", "That Balliol marry his daughter"], answer: 0 },
        { type: "pick", q: "Which did Edward take or do in 1296? There is more than one.", options: ["Took the Stone of Destiny to Westminster", "Collected oaths of loyalty in the Ragman Roll", "Made Robert the Bruce king", "Won the Battle of Dunbar"], answers: [0, 1, 3] },
        { type: "choice", q: "What does the nickname 'Toom Tabard' mean?", options: ["Brave heart", "Empty coat", "Hammer of the Scots"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The rising of 1297",
            text: [
              "English rule after 1296 was unpopular. English officials collected heavy taxes and demanded that Scots serve in Edward's wars in France. In 1297 resistance broke out in several places at once, which suggests widespread discontent rather than the work of one man.",
              "In the north, Andrew Murray (also spelled Moray), the son of a powerful lord, led a rising that drove the English out of many castles. In the south-west and centre, William Wallace emerged as a leader. In May 1297 Wallace and his followers killed William Heselrig, the English sheriff of Lanark, which made him an outlaw and a rallying point for resistance.",
              "We know little for certain about Wallace's early life. He was probably born in the early 1270s, the younger son of a minor landowning family. His father may have been Alan Wallace, a tenant of the king in Ayrshire, though some traditions name Malcolm Wallace of Elderslie in Renfrewshire. Either way, he was neither a great noble nor a poor peasant.",
              "Some Scottish nobles also rebelled in 1297, but many surrendered to the English at Irvine in July. That left Wallace and Murray as the leading commanders, and they joined forces in the summer of 1297.",
            ],
          },
          {
            heading: "Stirling Bridge, 11 September 1297",
            text: [
              "Stirling controlled the main crossing of the River Forth, the gateway between southern and northern Scotland. An English army led by John de Warenne, Earl of Surrey, and Hugh de Cressingham, Edward's treasurer in Scotland, marched north to crush the rising. To reach the Scots they had to cross a narrow wooden bridge, wide enough for perhaps two horsemen side by side.",
              "Wallace and Murray placed their army on high ground near the Abbey Craig, overlooking a loop of the river where the land was soft and marshy. They waited while part of the English army crossed. When enough men were over the bridge to be defeated, but not enough to fight effectively, the Scots attacked and seized the end of the bridge, cutting the English force in two.",
              "The English troops on the north bank were trapped between the Scots and the river. Many were killed, including Cressingham. Warenne, watching from the south bank, could not send help across, and he retreated to Berwick. It was a heavy defeat for an experienced army.",
              "Historians explain the victory by combining several factors: the Scots' choice of ground, their timing and discipline, and the English commanders' poor decisions, including ignoring advice to cross further upstream at a ford. Andrew Murray was badly wounded and died some weeks later. Wallace was knighted and became Guardian of Scotland, ruling in the name of the absent King John.",
            ],
          },
          {
            heading: "Falkirk, capture and the sources",
            text: [
              "In 1298 Edward I led a large army north himself. At the Battle of Falkirk on 22 July 1298, the Scots fought in schiltrons, tightly packed formations of spearmen. English longbowmen shot into the schiltrons until they broke, and English cavalry finished the defeat. Wallace resigned as Guardian soon afterwards and went to France, and possibly to Rome, to seek support for Scotland.",
              "By 1304 most Scottish nobles had submitted to Edward, but Wallace refused. In August 1305 he was captured near Glasgow by men serving Sir John Menteith, a Scottish lord loyal to Edward. He was taken to London, tried for treason in Westminster Hall on 23 August 1305 and executed the same day. He denied that he was a traitor, because he had never sworn loyalty to Edward.",
              "Very few sources about Wallace come from his own lifetime. One is a letter of 11 October 1297, issued by Andrew Murray and William Wallace to the merchants of Lübeck and Hamburg, telling them that Scotland's ports were open for trade again because the kingdom had been 'recovered by war'. Another is the record of his trial. English chroniclers of the time wrote about him, but they described him as a brutal bandit.",
              "Much of the popular story comes from The Wallace, a long poem written around the 1470s by a poet known as Blind Harry, about 170 years after Wallace's death. It is a heroic, patriotic work that includes many episodes no earlier source mentions. Historians value it as evidence of how Scots remembered Wallace in the 1400s, but not as a reliable record of what he actually did.",
            ],
          },
        ],
        words: [
          { word: "outlaw", meaning: "a person declared to be outside the protection of the law, often for rebellion" },
          { word: "schiltron", meaning: "a tightly packed formation of soldiers armed with long spears, used by Scottish armies" },
          { word: "longbow", meaning: "a tall, powerful bow that allowed English archers to shoot quickly and over long distances" },
          { word: "treason", meaning: "the crime of betraying your ruler or country" },
          { word: "chronicle", meaning: "a written record of events, usually in date order, often kept by monks" },
          { word: "reliability", meaning: "how far a source can be trusted to give an accurate account" },
        ],
      },
      practice: {
        intro: "Analyse the battle and weigh up the sources about Wallace.",
        questions: [
          { type: "choice", q: "Why was the bridge at Stirling so important to the outcome of the battle?", options: ["It was too narrow for the English army to cross quickly, so it could be split in two", "It was made of stone and could not be crossed", "It was the only bridge in Scotland"], answer: 0 },
          {
            type: "pick",
            q: "Which factors help to explain the Scottish victory at Stirling Bridge? There is more than one.",
            options: ["Choice of high ground above marshy land", "Help from a French army", "Attacking when only part of the English army had crossed", "English commanders ignoring advice to use a ford"],
            answers: [0, 2, 3],
          },
          {
            type: "match",
            q: "Match each source to the best description.",
            pairs: [
              ["The Lübeck letter (1297)", "A document issued by Wallace and Murray during the war"],
              ["English chronicles", "Written at the time but hostile to Wallace"],
              ["Blind Harry's The Wallace", "A heroic poem written about 170 years later"],
            ],
          },
          { type: "order", q: "Put these events in order, earliest first.", items: ["Wallace kills the sheriff of Lanark", "The Battle of Stirling Bridge", "The Battle of Falkirk", "Wallace is captured near Glasgow", "Wallace is executed in London"] },
          { type: "choice", q: "Which statement best describes how historians use Blind Harry's poem?", options: ["As the most reliable account of Wallace's life", "As useless, because poems tell us nothing", "As evidence of how Wallace was remembered in the 1400s, rather than of what he did"], answer: 2 },
        ],
      },
      task: {
        title: "Why did the Scots win at Stirling Bridge?",
        intro: "Draw a battle plan and write a causal explanation of the Scottish victory.",
        need: ["Plain paper, a pencil and coloured pens", "Optional: an online map of Stirling (ask permission first)"],
        steps: [
          "Sketch a plan of the battlefield: the loop of the River Forth, the narrow bridge, the Abbey Craig, the marshy ground, the Scottish position and the English army on both banks. Use a key rather than writing on the picture itself.",
          "Write each cause of the victory on a separate slip of paper: ground, timing, discipline and leadership, English mistakes, and the bridge itself. Rank them from most to least important.",
          "Write an answer of about 400 words to the question 'Why did the Scots win at Stirling Bridge?'. Use a paragraph for each of your top three causes, and explain how each one helped bring about the result.",
          "Add a final paragraph that links the causes together, for example 'The choice of ground mattered only because…'. Historians earn credit for showing how causes connect.",
          "Finish with a sentence on the limits of our evidence: what kinds of sources do we have for the battle, and who wrote them?",
        ],
      },
      exit: [
        { type: "type", q: "In which year was the Battle of Stirling Bridge fought?", answer: ["1297"] },
        { type: "choice", q: "Which Scottish leader commanded alongside Wallace at Stirling Bridge and died of his wounds afterwards?", options: ["Robert the Bruce", "Andrew Murray", "John Comyn"], answer: 1 },
        { type: "choice", q: "What happened at the Battle of Falkirk in 1298?", options: ["The Scots won a great victory", "Edward I was killed", "Longbowmen broke the Scottish schiltrons and the Scots were defeated"], answer: 2 },
        { type: "gap", q: "Fill in the gaps.", text: "Wallace was tried for ___ in London in 1305. He denied the charge because he had never sworn ___ to Edward.", bank: ["treason", "theft", "loyalty", "revenge"], answers: ["treason", "loyalty"] },
        { type: "choice", q: "Why is the Lübeck letter of 1297 valuable to historians?", options: ["It was written during the war by Wallace and Murray themselves", "It describes Wallace's childhood in detail", "It was written by Blind Harry"], answer: 0 },
        { type: "choice", q: "Which best explains why Blind Harry's poem is not a reliable record of Wallace's life?", options: ["It was written in Latin", "It was written around 170 years after his death and set out to celebrate him as a hero", "It was written by an English monk"], answer: 1 },
      ],
      grownUp: {
        need: ["Plain paper and coloured pens", "Optional: internet access for maps, with your permission"],
        tips: [
          "Wallace's execution in 1305 was brutal. The lesson states only that he was executed. If your teenager finds details elsewhere, it may help to talk about why medieval governments made punishments for treason so public.",
          "Wallace's birthplace and family are genuinely uncertain. A seal on a 1297 document suggests his father was called Alan, which challenges the older tradition of Malcolm of Elderslie.",
          "If you visit Stirling, the battle site and the National Wallace Monument (built in the 1860s) are a good illustration of the difference between history and later memory.",
        ],
        younger: "Use toy figures or coins on a table to act out the battle, with a ruler as the bridge, and then explain the victory in three sentences.",
        older: "Research the English chronicler Walter of Guisborough's account of Stirling Bridge and consider how his purpose and audience might shape what he says. Link causes explicitly, as in an exam 'explain why' answer.",
      },
    },
    {
      slug: "scottish-independence-wars-4",
      title: "Robert the Bruce and Bannockburn",
      emoji: "🛡️",
      minutes: 60,
      goal: "I can explain how Robert the Bruce seized the throne in 1306, how he gained control of Scotland, and why he won at Bannockburn in 1314.",
      starter: [
        { type: "choice", q: "When was the Battle of Stirling Bridge?", options: ["11 September 1297", "22 July 1298", "24 June 1314"], answer: 0 },
        { type: "choice", q: "What was a schiltron?", options: ["A type of castle", "A tightly packed formation of spearmen", "A Scottish coin"], answer: 1 },
        { type: "type", q: "In which year was William Wallace captured and executed?", answer: ["1305"] },
        { type: "choice", q: "Which weapon helped the English defeat the Scots at Falkirk in 1298?", options: ["The cannon", "The crossbow", "The longbow"], answer: 2 },
        { type: "choice", q: "Why do historians treat Blind Harry's The Wallace with caution?", options: ["It was written long after the events to celebrate Wallace as a hero", "It was written by Edward I", "It is too short"], answer: 0 },
        { type: "pick", q: "Which of these were Scottish leaders in 1297? There is more than one.", options: ["William Wallace", "Andrew Murray", "Hugh de Cressingham", "John de Warenne"], answers: [0, 1], why: "Cressingham and Warenne commanded the English army." },
      ],
      learn: {
        cards: [
          {
            heading: "Murder at Dumfries and a crown at Scone",
            text: [
              "Robert Bruce was born on 11 July 1274. He was Earl of Carrick and the grandson of the Robert Bruce who had lost the Great Cause. His family had never accepted John Balliol as king. During the years of war Bruce changed sides more than once: he joined the rising of 1297, served as a joint Guardian of Scotland from 1298, but submitted to Edward I in 1302.",
              "His great rival was John Comyn, Lord of Badenoch, known as the Red Comyn. Comyn was King John's nephew and head of the most powerful noble family in Scotland. On 10 February 1306 the two men met in the church of the Greyfriars in Dumfries. They quarrelled, and Bruce and his companions killed Comyn in the church.",
              "Killing a man in a church was sacrilege, and the Pope later excommunicated Bruce. It also made the Comyns and their allies his bitter enemies. Bruce now had little choice but to act quickly. With the support of senior churchmen such as Robert Wishart, Bishop of Glasgow, he was crowned King of Scots at Scone on 25 March 1306.",
              "Historians still debate whether the killing was planned or happened in a moment of anger. Either way, it turned a war against England into a civil war in Scotland as well.",
            ],
          },
          {
            heading: "From outlaw to master of Scotland",
            text: [
              "Bruce's reign began disastrously. In June 1306 an English force defeated him at Methven, near Perth, and he became a fugitive, probably hiding in the islands of the west. His wife, daughter and sisters were captured and imprisoned, and three of his brothers were executed by the English. Bruce had lost almost everything.",
              "In early 1307 he returned to his own earldom of Carrick and fought a guerrilla war, using ambushes, raids and surprise attacks rather than risking open battles. He won small but important victories at Glen Trool and Loudoun Hill in 1307. Then, on 7 July 1307, Edward I died near Carlisle while marching north. His son, Edward II, was a far less determined war leader.",
              "Bruce turned on his Scottish enemies first. In 1308 he defeated the Comyns and laid waste to their lands in Buchan. He then captured English-held castles one by one, including Perth in 1313 and Roxburgh and Edinburgh in 1314, and often destroyed them so they could not be used against him again. This is called slighting a castle.",
              "You may know the story of Bruce watching a spider try again and again to spin its web, and deciding to try once more himself. It is a much later legend: no source from Bruce's lifetime mentions it. It shows how stories gather around famous people.",
            ],
          },
          {
            heading: "Bannockburn, 23 to 24 June 1314",
            text: [
              "By 1314 Stirling Castle was one of the last major English strongholds. Its commander agreed to surrender if an English army had not come to relieve it by midsummer. Edward II brought a large army north, probably about twice the size of Bruce's, though medieval numbers are very uncertain.",
              "On the first day, 23 June, an English knight, Henry de Bohun, charged at Bruce in front of the armies. Bruce dodged the charge and killed him with a blow of his axe. Scottish spearmen also drove back English cavalry. The English then spent the night on low, cramped ground between the Bannock Burn and boggy land beside the River Forth.",
              "On 24 June the Scots did something surprising: their schiltrons advanced and attacked. The English cavalry could not manoeuvre on the narrow ground, and their archers were driven off by a small force of Scottish horsemen. The English army was pushed back, and many men drowned trying to cross the Bannock Burn. Edward II escaped to Dunbar and returned to England by sea.",
              "The victory confirmed Bruce's authority in Scotland, and important English prisoners were exchanged for his captive family. But it did not end the war. England still refused to recognise him as king, and the Pope did not either. Peace would take another 14 years.",
            ],
          },
        ],
        words: [
          { word: "sacrilege", meaning: "treating a holy place or object with disrespect, such as committing violence in a church" },
          { word: "excommunication", meaning: "being officially cut off from the Church by the Pope or a bishop" },
          { word: "civil war", meaning: "a war between groups within the same country" },
          { word: "guerrilla warfare", meaning: "fighting using small-scale raids, ambushes and surprise rather than large open battles" },
          { word: "slighting", meaning: "deliberately damaging a castle so an enemy cannot use it" },
        ],
      },
      practice: {
        intro: "Practise explaining Bruce's rise and the victory at Bannockburn.",
        questions: [
          { type: "order", q: "Put these events in order, earliest first.", items: ["Bruce kills John Comyn in Dumfries", "Bruce is crowned at Scone", "Bruce is defeated at Methven", "Edward I dies", "The Battle of Bannockburn"] },
          { type: "choice", q: "Why did killing John Comyn create problems for Bruce in Scotland as well as with England?", options: ["Comyn was English", "It made the powerful Comyn family and their allies his enemies, starting a civil war", "It meant Bruce could never be crowned"], answer: 1 },
          { type: "gap", q: "Fill in the gaps.", text: "After 1307 Bruce fought a ___ war of raids and ambushes. He often destroyed captured castles, which is called ___.", bank: ["guerrilla", "naval", "slighting", "sieging"], answers: ["guerrilla", "slighting"] },
          { type: "pick", q: "Which factors help explain the Scottish victory at Bannockburn? There is more than one.", options: ["The English camped on cramped, boggy ground", "Scottish schiltrons attacked rather than waiting", "The Scots had many more soldiers", "English archers were driven off by Scottish horsemen"], answers: [0, 1, 3] },
          { type: "choice", q: "Which evidence best supports the view that Bannockburn did NOT end the war?", options: ["Edward II escaped by sea", "England and the Pope still refused to recognise Bruce as king", "Henry de Bohun was killed on the first day"], answer: 1 },
        ],
      },
      task: {
        title: "Hero or ruthless politician?",
        intro: "Robert the Bruce is often remembered as a national hero. Some historians emphasise his ruthlessness and his changes of side. Weigh up the evidence and reach your own judgement.",
        need: ["Paper or a computer", "A ruler"],
        steps: [
          "Draw a table with two columns: 'Evidence that Bruce was a heroic leader' and 'Evidence that Bruce was a ruthless or self-interested politician'.",
          "Fill in at least four pieces of evidence in each column from this lesson, such as his changes of side, the killing of Comyn, his survival after Methven, his tactics and Bannockburn. Some evidence may fit both columns.",
          "Next to each piece of evidence, give it a score from 1 to 3 for how strongly it supports that view.",
          "Write a balanced answer of about 400 words to the question: 'Robert the Bruce was more of a ruthless politician than a national hero. How far do you agree?' Make sure both sides are covered before your conclusion.",
          "In your conclusion, consider whether the two views really contradict each other. Could a medieval king be both?",
        ],
      },
      exit: [
        { type: "choice", q: "Whom did Robert the Bruce kill in Dumfries in February 1306?", options: ["John Balliol", "John Comyn", "Henry de Bohun"], answer: 1 },
        { type: "type", q: "Where was Bruce crowned King of Scots in March 1306?", answer: ["Scone", "scone"] },
        { type: "choice", q: "What is guerrilla warfare?", options: ["Fighting with raids, ambushes and surprise attacks", "Fighting only at sea", "Fighting a single large battle"], answer: 0 },
        { type: "choice", q: "On which dates was the Battle of Bannockburn fought?", options: ["10 to 11 February 1306", "11 to 12 September 1297", "23 to 24 June 1314"], answer: 2 },
        { type: "match", q: "Match each person to what they did.", pairs: [["Edward I", "Died near Carlisle in 1307"], ["Edward II", "Escaped by sea after Bannockburn"], ["Henry de Bohun", "Charged at Bruce on the first day of Bannockburn"], ["Robert Wishart", "Bishop who supported Bruce's coronation"]] },
        { type: "choice", q: "Why do historians treat the story of Bruce and the spider as a legend?", options: ["Spiders did not live in Scotland then", "It appears in no source from Bruce's lifetime", "Bruce wrote that it never happened"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper or a computer", "A ruler"],
        tips: [
          "The lesson mentions the execution of Bruce's brothers and the imprisonment of the women of his family. This is stated factually; there is no graphic detail.",
          "The 'how far do you agree' task rewards a balanced argument and a clear, supported conclusion. Encourage your teenager to use 'however' and 'on the other hand' to move between views.",
          "Army sizes at Bannockburn are guesses. Historians commonly suggest roughly 15,000 to 20,000 English and 5,000 to 8,000 Scots, but the figures are disputed, so the lesson avoids exact numbers.",
        ],
        younger: "Focus on a timeline from 1306 to 1314 and choose one piece of evidence for each side of the table, then talk through your judgement before writing a short paragraph.",
        older: "Research how Bruce's propaganda, including John Barbour's poem The Brus (written around 1375), shaped his reputation, and explain how this affects our view of him.",
      },
    },
    {
      slug: "scottish-independence-wars-5",
      title: "The Declaration of Arbroath",
      emoji: "📜",
      minutes: 60,
      goal: "I can explain why the Declaration of Arbroath was written in 1320 and evaluate how useful it is as a historical source.",
      starter: [
        { type: "choice", q: "In which year was the Battle of Bannockburn?", options: ["1306", "1314", "1328"], answer: 1 },
        { type: "choice", q: "Why was Robert the Bruce excommunicated?", options: ["He killed John Comyn in a church", "He lost the Battle of Methven", "He refused to pay taxes"], answer: 0 },
        { type: "type", q: "Which English king fled after Bannockburn? (Give his name and number)", answer: ["Edward II", "Edward 2", "Edward the Second", "King Edward II"] },
        { type: "choice", q: "What is 'slighting' a castle?", options: ["Building a new tower", "Deliberately damaging it so an enemy cannot use it", "Surrounding it with soldiers"], answer: 1 },
        { type: "pick", q: "Which were results of Bannockburn? There is more than one.", options: ["Bruce's authority in Scotland was confirmed", "England recognised Bruce as king at once", "Bruce's family were exchanged for English prisoners", "The war ended"], answers: [0, 2] },
        { type: "choice", q: "Which of these best describes guerrilla warfare?", options: ["Long sieges of big cities", "Raids and ambushes avoiding open battle", "Fighting with cannons"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Why write to the Pope?",
            text: [
              "In the Middle Ages the Pope was the most important authority in Western Christendom. Kings wanted papal recognition because it gave their rule legitimacy. Pope John XXII had excommunicated Robert the Bruce and refused to call him king, addressing him only as 'governor of the kingdom of Scotland'. The English king, Edward II, used his influence at the papal court to keep it that way.",
              "In 1320 the Scots sent three letters to the Pope: one from the king, one from the bishops, and one in the name of the barons and 'the whole community of the realm of Scotland'. Only the barons' letter survives. It is dated at Arbroath Abbey on 6 April 1320 and is now known as the Declaration of Arbroath.",
              "The letter was written in Latin, the language of the Church and diplomacy. It was probably drafted in the king's writing office, which was run by Bernard, Abbot of Arbroath, the king's chancellor, though we cannot be sure who wrote it. It carried the seals of eight earls and around forty barons. The copy we have is a file copy kept in Scotland; the version actually sent to the Pope at Avignon is lost.",
              "The surviving document is held by the National Records of Scotland. It is damaged and some of its seals are missing, but it is one of the most famous documents in Scottish history.",
            ],
          },
          {
            heading: "What does it say?",
            text: [
              "The Declaration begins with a history of the Scots. It claims they came from Greater Scythia, travelled through Spain, and settled in Scotland, where 113 kings of their own royal line had reigned 'without the intrusion of a single foreigner'. Historians see this origin story as legend, but in 1320 it served a purpose: a long line of independent kings strengthened Scotland's claim to be a separate kingdom.",
              "It then describes Edward I's invasion and its suffering, and praises Robert the Bruce as the leader who delivered the people from their enemies. In a remarkable passage, the barons say that if Robert ever tried to make Scotland subject to England, they would drive him out as an enemy and choose another king.",
              "Its most famous lines, in a well-known English translation, say: 'for, as long as but a hundred of us remain alive, never will we on any conditions be brought under English rule. It is in truth not for glory, nor riches, nor honours that we are fighting, but for freedom, for that alone, which no honest man gives up but with life itself.'",
              "The letter ends by asking the Pope to persuade the English king to leave the Scots in peace, and warns that if he does not, the bloodshed that follows will be on the Pope's conscience.",
            ],
          },
          {
            heading: "Reading it as a historian",
            text: [
              "To judge a source, historians look at its provenance (who made it, when and where), its purpose and its intended audience. The Declaration was a carefully crafted piece of diplomacy, written to persuade one powerful reader, the Pope. Its high-flown language and its history were chosen to win his support, not to give a balanced account.",
              "The clause about removing the king has been read in different ways. Some have seen it as an early idea of government by consent of the people. Many historians argue that it was a way of presenting Bruce, who had seized the throne after a killing, as king by the choice of the community. It may also have been a warning to nobles who still doubted him. Either way, the 'community of the realm' meant the nobles, churchmen and landholders, not every Scot.",
              "Context matters too. Later in 1320 a plot against Bruce was uncovered, led by William de Soules, and some of the nobles linked to the Declaration were involved. So the letter's united front may have hidden real divisions. The famous line about freedom also borrows from the Roman writer Sallust, showing the education of whoever drafted it.",
              "The Declaration did not win immediate recognition, though the Pope urged Edward II to make peace. In later centuries it became a powerful symbol of Scottish identity. Some have claimed it influenced the American Declaration of Independence of 1776, but historians have found no direct evidence for that link.",
            ],
          },
        ],
        words: [
          { word: "provenance", meaning: "the origin of a source: who made it, when, where and how it has survived" },
          { word: "purpose", meaning: "the reason a source was created, such as to persuade, record or inform" },
          { word: "audience", meaning: "the person or people a source was made for" },
          { word: "legitimacy", meaning: "being accepted as lawful and rightful, for example as a rightful king" },
          { word: "diplomacy", meaning: "managing relations between rulers or countries by negotiation and letters" },
          { word: "propaganda", meaning: "information designed to persuade people to support a particular cause or view" },
        ],
      },
      practice: {
        intro: "Think carefully about the Declaration as a piece of evidence.",
        questions: [
          { type: "choice", q: "Who was the intended audience of the Declaration of Arbroath?", options: ["The people of Scotland", "Edward II of England", "Pope John XXII"], answer: 2 },
          { type: "gap", q: "Fill in the gaps.", text: "The Declaration was dated at Arbroath on 6 April ___. It was written in ___, the language of the Church and diplomacy.", bank: ["1314", "1320", "Latin", "Gaelic", "French"], answers: ["1320", "Latin"] },
          { type: "pick", q: "Which statements about the Declaration are accurate? There is more than one.", options: ["It was sealed by earls and barons", "The copy sent to the Pope survives in Rome", "It says the barons would replace Robert if he submitted to England", "It was signed by every person in Scotland"], answers: [0, 2] },
          {
            type: "match",
            q: "Match each question a historian asks to the answer for the Declaration.",
            pairs: [
              ["Who made it?", "Barons and the king's writing office"],
              ["When?", "6 April 1320"],
              ["Why?", "To persuade the Pope to recognise Scottish independence"],
              ["For whom?", "Pope John XXII"],
            ],
          },
          { type: "choice", q: "Which evidence best supports the view that the Declaration exaggerated Scottish unity?", options: ["Some nobles linked to it were involved in a plot against Bruce later in 1320", "It was written in Latin", "It mentions 113 kings"], answer: 0 },
        ],
      },
      task: {
        title: "How useful is the Declaration of Arbroath?",
        intro: "Write a source evaluation, the kind of extended answer historians and exam boards expect, on the question: 'How useful is the Declaration of Arbroath as evidence of Scottish attitudes to independence in 1320?'",
        need: ["Paper or a computer", "Optional: the full English translation of the Declaration from the National Records of Scotland website (ask permission before going online)"],
        steps: [
          "If you can, read the full translation (it takes about ten minutes). Otherwise use the quotations and summaries in this lesson.",
          "Make notes under four headings: Provenance (who, when, where), Purpose and audience, Content (what it tells us), and Limitations (what it does not tell us, or may distort).",
          "Choose two short quotations that show Scottish attitudes to independence, and explain what each one suggests.",
          "Write an answer of 400 to 500 words. Explain how the source is useful, then explain its limitations, using its purpose, its audience and the Soules plot as evidence. Remember that a source can be useful even when it is biased: the question is what it is useful for.",
          "End with a judgement: is it more useful as evidence of what all Scots thought, or of how Scotland's leaders wanted their kingdom to be seen?",
        ],
      },
      exit: [
        { type: "type", q: "In which year was the Declaration of Arbroath written?", answer: ["1320"] },
        { type: "choice", q: "To whom was the Declaration addressed?", options: ["Edward II", "Pope John XXII", "The King of France"], answer: 1 },
        { type: "choice", q: "What was the main purpose of the Declaration?", options: ["To record the Battle of Bannockburn", "To persuade the Pope to accept Bruce as king and Scotland as independent", "To announce a new tax"], answer: 1 },
        { type: "choice", q: "What did the barons say they would do if Robert submitted to England?", options: ["Follow him anyway", "Drive him out and choose another king", "Ask the Pope to choose for them"], answer: 1 },
        { type: "pick", q: "Which are limitations of the Declaration as evidence of what all Scots thought? There is more than one.", options: ["It was written to persuade, not to give a balanced view", "It reflects the views of nobles and churchmen, not ordinary people", "It was written in 1320", "Some of its supporters later plotted against Bruce"], answers: [0, 1, 3] },
        { type: "choice", q: "What does 'provenance' mean?", options: ["Where, when and by whom a source was made", "How long a source is", "Whether a source is true"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper or a computer", "Optional: internet access to read the full translation, with your permission"],
        tips: [
          "The National Records of Scotland publishes images of the Declaration and a full English translation. Reading the whole text together is worthwhile and takes about ten minutes.",
          "Source usefulness questions are central to National 5 and GCSE History. The key habit is to tie every comment to provenance, purpose, content or what is missing.",
          "The idea that the Declaration inspired the American Declaration of Independence is popular but unproven. It is a good example to discuss how claims about the past spread.",
        ],
        younger: "Focus on three questions: who wrote it, who it was for, and why. Then pick one quotation and explain in your own words what the writers wanted the Pope to think.",
        older: "Compare the Declaration with the letter to Lübeck and Hamburg from 1297 (lesson 3). What does each tell us about how Scottish leaders presented their cause to the outside world?",
      },
    },
    {
      slug: "scottish-independence-wars-6",
      title: "Peace, myth and memory",
      emoji: "🎬",
      minutes: 60,
      goal: "I can explain the terms and significance of the Treaty of Edinburgh–Northampton (1328) and separate history from myth in later portrayals such as Braveheart.",
      starter: [
        { type: "choice", q: "To whom was the Declaration of Arbroath addressed?", options: ["Edward II", "Pope John XXII", "Robert the Bruce"], answer: 1 },
        { type: "type", q: "In which year was the Declaration of Arbroath written?", answer: ["1320"] },
        { type: "choice", q: "What does 'provenance' mean?", options: ["Where, when and by whom a source was made", "The length of a source", "How many copies exist"], answer: 0 },
        { type: "choice", q: "Why did the Scots want the Pope's support?", options: ["Papal recognition would make Bruce's rule more legitimate", "The Pope had an army", "The Pope lived in Scotland"], answer: 0 },
        { type: "pick", q: "Which are reasons to be cautious about the Declaration as evidence? There is more than one.", options: ["It was written to persuade", "Its origin story is legendary", "It was written in 1320", "It speaks for nobles rather than all Scots"], answers: [0, 1, 3] },
        { type: "choice", q: "What did the Declaration say would happen if Bruce submitted to England?", options: ["The barons would replace him", "The Pope would crown him again", "Nothing"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "The road to peace",
            text: [
              "After Bannockburn, Bruce tried to force England to make peace. Scottish forces raided deep into northern England, collecting payments from communities in return for leaving them alone. In 1315 Bruce's brother Edward invaded Ireland, hoping to open a second front against England, but he was killed at the Battle of Faughart in 1318. In the same year the Scots recaptured Berwick.",
              "In 1323 the two kingdoms agreed a 13-year truce, but England still refused to recognise Bruce as king. The real change came from events inside England. In January 1327 Edward II was deposed by his wife, Queen Isabella, and her ally Roger Mortimer. His son, Edward III, was only fourteen, so Isabella and Mortimer governed in his name.",
              "Their government was weak and short of money. A Scottish raid in 1327 led to an expensive English campaign in Weardale that failed to bring the Scots to battle. Isabella and Mortimer decided that peace was the better option.",
            ],
          },
          {
            heading: "The Treaty of Edinburgh–Northampton, 1328",
            text: [
              "The treaty was agreed at Edinburgh on 17 March 1328 and ratified by the English parliament at Northampton in May 1328, which is why it carries both names. Its main terms were that England recognised Scotland as a fully independent kingdom, with the border as it had been in Alexander III's time, and recognised Robert as its king. The English crown gave up all claims to overlordship.",
              "In return, the Scots agreed to pay £20,000, a very large sum. The peace was sealed with a dynastic marriage: Bruce's son and heir, David, then aged four, married Edward III's sister Joan, aged seven, at Berwick in July 1328. Later in 1328 the Pope lifted Bruce's excommunication, and in 1329 he granted Scottish kings the right to be anointed at their coronation, a sign of full royal status.",
              "Robert the Bruce died on 7 June 1329 at Cardross, near Dumbarton, aged 54. His body was buried at Dunfermline Abbey. His heart was carried on crusade by his friend Sir James Douglas, who was killed in Spain in 1330; the heart was brought back and buried at Melrose Abbey.",
              "Many in England called the treaty a 'shameful peace', and Edward III never really accepted it. In 1332 Edward Balliol, son of King John, invaded with English support, starting a second war of independence that lasted until 1357. Scotland nevertheless survived as an independent kingdom. The Stone of Destiny, which had been promised back in 1328, stayed in England until 1996, when it was returned to Scotland.",
            ],
          },
          {
            heading: "Myth and history: Braveheart",
            text: [
              "The film Braveheart (1995), directed by and starring Mel Gibson, made William Wallace famous around the world and won five Academy Awards, including Best Picture. Its story draws heavily on Blind Harry's poem from the 1470s, and it changes or invents a great deal.",
              "Some examples: the Battle of Stirling Bridge is shown without a bridge, even though the bridge was the key to the battle. The Scots wear belted plaids and blue face paint, but the belted plaid dates from the 1500s and face paint belongs to a much earlier time. The film shows Wallace having a relationship with Isabella of France, but she was a small child living in France at the time of Falkirk and did not marry Edward II until 1308, three years after Wallace died. It also shows Bruce betraying Wallace at Falkirk, for which there is no evidence, and Edward I dying at the moment of Wallace's execution, though Edward actually died in 1307.",
              "A myth is a story that is widely believed but not supported by evidence. Myths grow because they meet a need: a film needs clear heroes and villains, a nation may want inspiring founders, and simple stories are easier to remember than complicated ones. Monuments such as the National Wallace Monument near Stirling, opened in 1869, show how Victorian Scots used Wallace to express their own identity.",
              "Historians do not simply dismiss myths. They ask where a story came from, why people believed it, and what it tells us about the time that created it. Braveheart is poor evidence about 1297, but good evidence about how the wars of independence were imagined in 1995.",
            ],
          },
        ],
        words: [
          { word: "treaty", meaning: "a formal written agreement between rulers or states" },
          { word: "ratify", meaning: "to give formal approval to an agreement so that it becomes valid" },
          { word: "recognition", meaning: "formal acceptance by another ruler that a state or king is legitimate" },
          { word: "myth", meaning: "a story that is widely believed but not supported by reliable evidence" },
          { word: "anachronism", meaning: "something placed in the wrong historical period, such as a costume from a later century" },
          { word: "interpretation", meaning: "a later account or explanation of the past, such as a history book, film or monument" },
        ],
      },
      practice: {
        intro: "Check the terms of the peace and test your myth-busting skills.",
        questions: [
          {
            type: "pick",
            q: "Which were terms of the Treaty of Edinburgh–Northampton? There is more than one.",
            options: ["England recognised Scotland as independent", "Scotland paid £20,000", "Scotland returned Berwick to England", "Bruce's son David married Edward III's sister Joan"],
            answers: [0, 1, 3],
          },
          { type: "choice", q: "Which best explains why England agreed to peace in 1328?", options: ["The Pope ordered it after Bannockburn", "Isabella and Mortimer's government was weak and short of money after a failed campaign", "Edward I had died the year before"], answer: 1 },
          {
            type: "match",
            q: "Match each scene in Braveheart to the historical problem.",
            pairs: [
              ["Stirling Bridge with no bridge", "The bridge was central to the real battle"],
              ["Wallace and Isabella of France", "She was a child in France at the time"],
              ["Scots in belted plaids", "An anachronism from the 1500s"],
              ["Edward I dies as Wallace is executed", "Edward died two years later, in 1307"],
            ],
          },
          { type: "order", q: "Put these events in order, earliest first.", items: ["Edward Bruce is killed at Faughart", "A 13-year truce is agreed", "Edward II is deposed", "The Treaty of Edinburgh–Northampton", "Robert the Bruce dies"] },
          { type: "choice", q: "Which statement best describes how historians treat Braveheart?", options: ["As poor evidence about 1297, but useful evidence about how the past was imagined in the 1990s", "As a reliable documentary", "As completely worthless"], answer: 0 },
        ],
      },
      task: {
        title: "Myth versus history: a guide",
        intro: "Create a short myth-busting guide to the wars of independence for other learners your age, then answer a big question about the whole unit.",
        need: ["Paper or a computer (a free browser-based document or slide tool works well)", "Your notes from the whole unit", "Optional: books or websites for research (ask permission before going online)"],
        steps: [
          "Choose five popular claims about the wars, for example from Braveheart, the spider legend, Blind Harry, the idea that Wallace was a poor peasant, or the claim that the Declaration of Arbroath inspired the American Declaration of Independence.",
          "For each one, write the claim, what the evidence actually shows, and why the myth might have grown. Keep each entry to about 80 words.",
          "Design your guide as a leaflet, a poster or a few slides. Use headings and your own simple drawings rather than copying pictures.",
          "Then write an answer of about 300 words to the question: 'Was the Treaty of Edinburgh–Northampton the end of the wars of independence?' Use evidence from before and after 1328.",
          "Finally, look back at the whole unit. In two or three sentences, explain which turning point between 1286 and 1328 you think mattered most, and why.",
        ],
      },
      exit: [
        { type: "type", q: "In which year was the Treaty of Edinburgh–Northampton agreed?", answer: ["1328"] },
        { type: "choice", q: "What did England recognise in the treaty?", options: ["Edward Balliol as King of Scots", "Scotland as an independent kingdom with Robert as king", "English overlordship of Scotland"], answer: 1 },
        { type: "choice", q: "What does 'ratify' mean?", options: ["To tear up a treaty", "To give formal approval so an agreement becomes valid", "To translate a treaty into Latin"], answer: 1 },
        { type: "gap", q: "Fill in the gaps.", text: "To seal the peace, Bruce's son ___ married Joan, the sister of ___.", bank: ["David", "Edward", "Edward III", "Edward I"], answers: ["David", "Edward III"] },
        { type: "choice", q: "Which is an anachronism in the film Braveheart?", options: ["Scottish spearmen", "English cavalry", "Scots wearing belted plaids from the 1500s"], answer: 2 },
        { type: "choice", q: "Why was the 1328 peace not the end of conflict?", options: ["Robert the Bruce broke it immediately", "Edward Balliol invaded with English support in 1332, starting a second war", "The Pope cancelled it"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper or a computer", "Notes from the earlier lessons"],
        tips: [
          "Braveheart is rated 15 by the BBFC and contains strong battle violence. The lesson does not require watching it; decide for yourself whether any clips are suitable.",
          "Dates for the treaty: it was agreed at Edinburgh on 17 March 1328, and the English parliament at Northampton ratified it in May 1328. Some books give 1 May, some 4 May.",
          "The Stone of Destiny returned to Scotland in 1996 and was kept at Edinburgh Castle. In 2024 it moved to the new Perth Museum, near Scone, where you can see it.",
        ],
        younger: "Pick three myths for the guide and write them as 'Myth' and 'Fact' boxes. For the big question, a short paragraph using 'yes, because' and 'no, because' is enough.",
        older: "Research the Second War of Independence (1332 to 1357) and explain whether the 1328 treaty should be seen as a lasting achievement or a temporary truce. Compare two interpretations of Wallace or Bruce, for example a Victorian monument and a modern historian, and explain why they differ.",
      },
    },
  ],
};
