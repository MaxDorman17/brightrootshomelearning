/** Free learning websites we recommend to every family. All checked as live in September 2026. */
export type StarterResource = { title: string; url: string; note: string; ages: string; forParents?: boolean };
export type StarterGroup = { subject: string; emoji: string; items: StarterResource[] };

export const STARTER_RESOURCES: StarterGroup[] = [
  {
    subject: "All subjects",
    emoji: "🌳",
    items: [
      { title: "Oak National Academy", url: "https://www.thenational.academy/", note: "Free video lessons, quizzes and worksheets for every subject, following the national curriculum.", ages: "4–16" },
      { title: "BBC Bitesize (primary)", url: "https://www.bbc.co.uk/bitesize/primary", note: "Short videos, games and quizzes for every primary subject.", ages: "4–11" },
      { title: "BBC Bitesize", url: "https://www.bbc.co.uk/bitesize", note: "Revision guides and videos for KS3, GCSE and beyond.", ages: "11–16" },
      { title: "Khan Academy", url: "https://www.khanacademy.org/", note: "Free step-by-step lessons and practice, especially strong for maths and science.", ages: "6–16" },
    ],
  },
  {
    subject: "Maths",
    emoji: "➗",
    items: [
      { title: "NRICH", url: "https://nrich.maths.org/", note: "Rich maths problems and games from the University of Cambridge.", ages: "5–16" },
      { title: "White Rose Maths", url: "https://www.whiterosemaths.com/", note: "The small-steps maths scheme many UK schools use, with free home learning videos.", ages: "4–14" },
      { title: "Topmarks", url: "https://www.topmarks.co.uk/", note: "Quick, colourful maths games for times tables, number bonds and more.", ages: "3–11" },
      { title: "Maths is Fun", url: "https://www.mathsisfun.com/", note: "Clear explanations of maths ideas with puzzles and worksheets.", ages: "7–16" },
      { title: "Corbettmaths", url: "https://corbettmaths.com/", note: "Videos, worksheets and daily \"5-a-day\" practice up to GCSE.", ages: "9–16" },
    ],
  },
  {
    subject: "English & reading",
    emoji: "📚",
    items: [
      { title: "Oxford Owl", url: "https://home.oxfordowl.co.uk/", note: "A free library of reading-scheme eBooks and phonics help (free sign-up).", ages: "3–11" },
      { title: "Phonics Play", url: "https://www.phonicsplay.co.uk/", note: "Phonics games organised by phase.", ages: "3–7" },
      { title: "BookTrust", url: "https://www.booktrust.org.uk/", note: "Book lists by age, reading tips and free stories.", ages: "0–14" },
      { title: "Words for Life", url: "https://wordsforlife.org.uk/", note: "Reading, writing and talking activities from the National Literacy Trust.", ages: "0–12" },
      { title: "Storyline Online", url: "https://storylineonline.net/", note: "Picture books read aloud by actors, with activity guides.", ages: "3–9" },
    ],
  },
  {
    subject: "Science & nature",
    emoji: "🔬",
    items: [
      { title: "Explorify", url: "https://explorify.uk/", note: "Short, curious science activities that get children talking and thinking.", ages: "5–11" },
      { title: "NASA Space Place", url: "https://spaceplace.nasa.gov/", note: "Space and Earth science games, crafts and explainers.", ages: "6–13" },
      { title: "National Geographic Kids", url: "https://www.natgeokids.com/uk/", note: "Animals, science, history and geography articles and quizzes.", ages: "6–14" },
      { title: "Natural History Museum", url: "https://www.nhm.ac.uk/discover.html", note: "Articles, videos and quizzes on dinosaurs, wildlife and the planet.", ages: "7–16" },
      { title: "RSPB fun and learning", url: "https://www.rspb.org.uk/fun-and-learning", note: "Bird ID, nature activities and wildlife challenges.", ages: "4–14" },
      { title: "Isaac Physics", url: "https://isaacphysics.org/", note: "Free physics problem-solving from the University of Cambridge.", ages: "13–18" },
      { title: "Free Science Lessons", url: "https://www.freesciencelessons.co.uk/", note: "Clear video lessons covering the whole GCSE science course.", ages: "13–16" },
    ],
  },
  {
    subject: "History & geography",
    emoji: "🌍",
    items: [
      { title: "British Museum learning", url: "https://www.britishmuseum.org/learn/schools", note: "Resources and virtual visits exploring world history through real objects.", ages: "7–16" },
      { title: "Seterra", url: "https://www.seterra.com/", note: "Map quiz games for countries, capitals, flags and UK counties.", ages: "7–16" },
      { title: "Google Earth", url: "https://earth.google.com/", note: "Fly anywhere on the planet, with guided Voyager tours.", ages: "6–16" },
    ],
  },
  {
    subject: "Computing",
    emoji: "💻",
    items: [
      { title: "Scratch", url: "https://scratch.mit.edu/", note: "Make games and animations with drag-and-drop code.", ages: "7–16" },
      { title: "Code.org", url: "https://code.org/", note: "Step-by-step coding courses and the Hour of Code.", ages: "4–16" },
      { title: "Blockly Games", url: "https://blockly.games/", note: "Puzzle games that build up to real programming.", ages: "7–14" },
      { title: "Raspberry Pi projects", url: "https://projects.raspberrypi.org/", note: "Free guided projects in Scratch, Python, web design and more.", ages: "8–16" },
    ],
  },
  {
    subject: "Languages",
    emoji: "🗣️",
    items: [
      { title: "Duolingo", url: "https://www.duolingo.com/", note: "Bite-sized daily lessons in dozens of languages.", ages: "7–16" },
    ],
  },
  {
    subject: "Art & music",
    emoji: "🎨",
    items: [
      { title: "Tate Kids", url: "https://www.tate.org.uk/kids", note: "Art activities, games and artist profiles from the Tate.", ages: "5–13" },
      { title: "Art for Kids Hub", url: "https://www.artforkidshub.com/", note: "Follow-along drawing videos for all abilities.", ages: "4–12" },
      { title: "BBC Ten Pieces", url: "https://www.bbc.co.uk/teach/ten-pieces", note: "Classical music films with creative activities.", ages: "7–14" },
      { title: "Chrome Music Lab", url: "https://musiclab.chromeexperiments.com/", note: "Play with rhythm, melody and sound in the browser.", ages: "4–14" },
    ],
  },
  {
    subject: "PE & wellbeing",
    emoji: "🧘",
    items: [
      { title: "Cosmic Kids Yoga", url: "https://www.youtube.com/@CosmicKidsYoga", note: "Story-based yoga and mindfulness videos.", ages: "3–9" },
    ],
  },
  {
    subject: "For parents",
    emoji: "🧑‍🏫",
    items: [
      { title: "GOV.UK: educating your child at home", url: "https://www.gov.uk/home-education", note: "The official guidance on home education in England.", ages: "All", forParents: true },
      { title: "Education Otherwise", url: "https://www.educationotherwise.org/", note: "A UK home education charity with advice and support.", ages: "All", forParents: true },
      { title: "STEM Learning", url: "https://www.stem.org.uk/", note: "Free science, maths and computing teaching resources.", ages: "All", forParents: true },
    ],
  },
];
