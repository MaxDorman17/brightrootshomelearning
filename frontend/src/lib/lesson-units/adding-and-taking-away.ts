import type { LessonUnit } from "@/lib/lessons";

/** Adding and taking away, for ages 5 to 7. Putting groups together, the + and = signs, number bonds to 10, taking away, counting back on a number line and missing number puzzles, mostly within 10 with some to 20. */
export const addingAndTakingAwayUnit: LessonUnit = {
  slug: "adding-and-taking-away",
  title: "Adding and taking away",
  short: "Adding",
  subject: "Maths",
  ages: "5 to 7",
  emoji: "➕",
  color: "#2F5D3A",
  summary: "Six lessons: putting groups together, the plus and equals signs, number bonds to 10, taking away, counting back on a number line, and missing number puzzles.",
  cover: "/lessons/units/adding-and-taking-away.jpg",
  lessons: [
    {
      slug: "adding-and-taking-away-1",
      title: "Putting groups together",
      emoji: "🍎",
      minutes: 30,
      goal: "I can put two groups together and count how many there are altogether.",
      starter: [
        { type: "type", q: "How many dots are in the ten frame?", visual: { kind: "tenframe", filled: 4 }, answer: ["4", "four"] },
        { type: "choice", q: "What number comes after 5?", options: ["4", "6", "7"], answer: 1 },
        { type: "type", q: "How many dots can you see?", visual: { kind: "dots", rows: 2, cols: 3 }, answer: ["6", "six"] },
        { type: "order", q: "Put these numbers in order, smallest first.", items: ["2", "3", "5", "8"] },
        { type: "choice", q: "Which is more?", options: ["3 apples", "7 apples"], answer: 1 },
        { type: "choice", q: "You have 2 socks. You get 1 more. Do you have more or fewer now?", options: ["More", "Fewer"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Two groups",
            picture: "/lessons/adding-and-taking-away/lesson-1-1.jpg",
            alt: "A child with a small pile of conkers in each hand",
            text: [
              "Here are some conkers. There are 3 in one hand and 2 in the other hand.",
              "Each pile is called a group. We have two groups of conkers.",
            ],
          },
          {
            heading: "Putting them together",
            picture: "/lessons/adding-and-taking-away/lesson-1-2.jpg",
            alt: "A child tipping two piles of conkers into one bowl",
            text: [
              "Now tip both groups into one bowl. Count them all: 1, 2, 3, 4, 5.",
              "There are 5 conkers altogether. When we put groups together, we are adding.",
            ],
          },
          {
            heading: "Counting on",
            picture: "/lessons/adding-and-taking-away/lesson-1-3.jpg",
            alt: "A child pointing at apples on a table while counting",
            text: [
              "There is a quicker way. Start with the bigger group. Say that number in your head.",
              "Then count on for the other group. For 4 apples and 2 more, say 4, then count 5, 6.",
              "There are 6 apples altogether. Counting on saves you counting everything again.",
            ],
          },
        ],
        words: [
          { word: "group", meaning: "some things that go together" },
          { word: "altogether", meaning: "how many there are when you count them all" },
          { word: "add", meaning: "put groups together to find how many" },
        ],
      },
      practice: {
        intro: "Let's put some groups together.",
        questions: [
          { type: "type", q: "There are 3 leaves and 2 more leaves. How many leaves altogether?", answer: ["5", "five"] },
          { type: "type", q: "Count all the dots. How many altogether?", visual: { kind: "tenframe", filled: 7 }, answer: ["7", "seven"] },
          { type: "choice", q: "4 buttons and 4 more buttons. How many altogether?", options: ["7", "8", "9"], answer: 1 },
          {
            type: "pick",
            q: "Which make 6 altogether? There is more than one.",
            options: ["3 toys and 3 toys", "5 toys and 1 toy", "2 toys and 2 toys", "4 toys and 2 toys"],
            answers: [0, 1, 3],
          },
        ],
      },
      task: {
        title: "Conker groups",
        intro: "Make two groups, then put them together and count.",
        need: ["About 10 small things, like conkers, buttons, pasta shapes or toy cars", "Two bowls or plates", "A grown-up to help"],
        steps: [
          "Put some things in one bowl and some in the other.",
          "Count each group. Say the numbers out loud.",
          "Tip them into one bowl. How many are there altogether?",
          "Try again with different groups. Can you count on from the bigger group?",
        ],
      },
      exit: [
        { type: "type", q: "2 apples and 3 apples. How many altogether?", answer: ["5", "five"] },
        { type: "type", q: "How many dots altogether?", visual: { kind: "dots", rows: 2, cols: 4 }, answer: ["8", "eight"] },
        { type: "choice", q: "What does altogether mean?", options: ["How many when you count them all", "How many are left"], answer: 0 },
        { type: "choice", q: "5 conkers and 1 more conker. How many altogether?", options: ["4", "6", "7"], answer: 1 },
        { type: "choice", q: "To count on, which group do you start with?", options: ["The bigger group", "The smaller group"], answer: 0 },
        { type: "type", q: "6 socks and 3 more socks. How many altogether?", answer: ["9", "nine"] },
      ],
      grownUp: {
        need: ["About 10 small objects, like conkers, buttons or pasta", "Two bowls or plates"],
        tips: [
          "Let your child touch and move each object as they count. Real things come first; numbers on paper come later.",
          "Counting on from the bigger group is a big step. If it is tricky, counting everything from one is fine for now.",
        ],
        younger: "Keep the totals to 5, and use things they love, like toy animals or cars.",
        older: "Make totals up to 10, then try adding three small groups together.",
      },
    },
    {
      slug: "adding-and-taking-away-2",
      title: "The plus and equals signs",
      emoji: "➕",
      minutes: 30,
      goal: "I can read and write an adding sum using + and =.",
      starter: [
        { type: "type", q: "3 conkers and 2 more conkers. How many altogether?", answer: ["5", "five"] },
        { type: "type", q: "How many dots altogether?", visual: { kind: "tenframe", filled: 6 }, answer: ["6", "six"] },
        { type: "choice", q: "What does altogether mean?", options: ["How many are left", "How many when you count them all"], answer: 1 },
        { type: "choice", q: "To count on, which group do you start with?", options: ["The smaller group", "The bigger group"], answer: 1 },
        { type: "choice", q: "4 apples and 3 more apples. How many altogether?", options: ["6", "7", "8"], answer: 1 },
        {
          type: "pick",
          q: "Which make 5 altogether? There is more than one.",
          options: ["4 and 1", "2 and 2", "3 and 2", "5 and 1"],
          answers: [0, 2],
        },
      ],
      learn: {
        cards: [
          {
            heading: "The plus sign",
            picture: "/lessons/adding-and-taking-away/lesson-2-1.jpg",
            alt: "A child laying two crossed sticks on the ground between two groups of leaves",
            text: [
              "When we add, we can write a sign that looks like a little cross: +",
              "We call it plus. It means add, or put together.",
              "3 + 2 means 3 add 2. You say it like this: three plus two.",
            ],
          },
          {
            heading: "The equals sign",
            picture: "/lessons/adding-and-taking-away/lesson-2-2.jpg",
            alt: "A child placing two straight sticks side by side next to a pile of leaves",
            text: [
              "This sign has two lines: =",
              "We call it equals. It means is the same as.",
              "3 + 2 = 5 means 3 add 2 is the same as 5.",
            ],
          },
          {
            heading: "Writing a number sentence",
            picture: "/lessons/adding-and-taking-away/lesson-2-3.jpg",
            alt: "A child with a grown-up at a table, one group of buttons next to another",
            text: [
              "A sum like 4 + 1 = 5 is called a number sentence. It tells a little story.",
              "There were 4 buttons. 1 more came. Now there are 5 buttons.",
              "You can swap the numbers you add. 4 + 1 and 1 + 4 both make 5.",
            ],
          },
        ],
        words: [
          { word: "plus", meaning: "the sign + that means add" },
          { word: "equals", meaning: "the sign = that means is the same as" },
          { word: "number sentence", meaning: "a sum written with numbers and signs, like 2 + 3 = 5" },
        ],
      },
      practice: {
        intro: "Let's read and finish some number sentences.",
        questions: [
          { type: "match", q: "Match each sign to what it means.", pairs: [["+", "Add"], ["=", "Is the same as"]] },
          { type: "type", q: "2 + 4 = ?", visual: { kind: "dots", rows: 1, cols: 6 }, answer: ["6", "six"] },
          { type: "choice", q: "Which number sentence shows 5 leaves and 2 more leaves?", options: ["5 + 2 = 7", "5 + 2 = 8", "5 + 3 = 7"], answer: 0 },
          { type: "gap", q: "Fill the gaps.", text: "3 ___ 3 ___ 6", bank: ["+", "=", "6"], answers: ["+", "="] },
        ],
      },
      task: {
        title: "Sum story cards",
        intro: "Make your own number sentences with real things.",
        need: ["Some small things, like buttons, pasta or toy bricks", "Paper and a pencil", "Two straws or lolly sticks"],
        steps: [
          "Make a group of things, then a second group.",
          "Put one straw across another to make a plus sign between the groups.",
          "Lay two straws side by side to make an equals sign, then count them all.",
          "Write your number sentence on paper, like 3 + 4 = 7. Read it out loud to your grown-up.",
        ],
      },
      exit: [
        { type: "choice", q: "What does + mean?", options: ["Add", "Take away"], answer: 0 },
        { type: "choice", q: "What does = mean?", options: ["Is the same as", "Is bigger than"], answer: 0 },
        { type: "type", q: "1 + 3 = ?", answer: ["4", "four"] },
        { type: "type", q: "5 + 3 = ?", visual: { kind: "tenframe", filled: 8 }, answer: ["8", "eight"] },
        { type: "choice", q: "2 + 5 is the same as...", options: ["5 + 2", "5 + 3", "2 + 2"], answer: 0 },
        { type: "choice", q: "Which number sentence is right?", options: ["4 + 2 = 5", "4 + 2 = 6", "4 + 2 = 7"], answer: 1 },
      ],
      grownUp: {
        need: ["Small objects to count", "Paper and pencil", "Two straws or lolly sticks"],
        tips: [
          "Read sums out loud in words: 'three plus two equals five' and 'three add two is the same as five'. Both are useful.",
          "Children often think = means 'the answer comes next'. Saying 'is the same as' helps it mean balance, which matters later on.",
        ],
        younger: "Keep totals within 5, and you write the numbers while your child makes the groups and says the sum.",
        older: "Try sums up to 10, and show that the answer can go first too: 7 = 4 + 3.",
      },
    },
    {
      slug: "adding-and-taking-away-3",
      title: "Number bonds to 10",
      emoji: "🔟",
      minutes: 30,
      goal: "I can find pairs of numbers that make 10.",
      starter: [
        { type: "choice", q: "What does + mean?", options: ["Take away", "Add"], answer: 1 },
        { type: "choice", q: "What does = mean?", options: ["Is the same as", "Is smaller than"], answer: 0 },
        { type: "type", q: "3 + 2 = ?", answer: ["5", "five"] },
        { type: "type", q: "4 + 4 = ?", visual: { kind: "dots", rows: 2, cols: 4 }, answer: ["8", "eight"] },
        { type: "choice", q: "1 + 6 is the same as...", options: ["6 + 1", "6 + 2"], answer: 0 },
        { type: "match", q: "Match each sum to its answer.", pairs: [["2 + 1", "3"], ["3 + 3", "6"], ["5 + 4", "9"]] },
      ],
      learn: {
        cards: [
          {
            heading: "The ten frame",
            picture: "/lessons/adding-and-taking-away/lesson-3-1.jpg",
            alt: "A child placing conkers into the ten cups of an egg box",
            text: [
              "A ten frame has 10 spaces, in two rows of 5. An egg box with 10 cups works the same way.",
              "When every space is full, there are 10.",
            ],
          },
          {
            heading: "Full and empty",
            picture: "/lessons/adding-and-taking-away/lesson-3-2.jpg",
            alt: "An egg box with some cups holding conkers and some cups empty",
            text: [
              "Put 7 conkers in the ten frame. How many spaces are empty? There are 3.",
              "7 and 3 make 10. We write 7 + 3 = 10.",
              "Two numbers that make 10 are called a number bond to 10.",
            ],
          },
          {
            heading: "All the bonds to 10",
            picture: "/lessons/adding-and-taking-away/lesson-3-3.jpg",
            alt: "Two children holding up their fingers, some up and some folded down",
            text: [
              "Here are the pairs that make 10: 0 and 10, 1 and 9, 2 and 8, 3 and 7, 4 and 6, 5 and 5.",
              "You have 10 fingers. Fold some down. The ones up and the ones down always make 10.",
            ],
          },
        ],
        words: [
          { word: "ten frame", meaning: "a box with 10 spaces, in two rows of 5" },
          { word: "number bond", meaning: "two numbers that go together to make a number" },
          { word: "pair", meaning: "two things that go together" },
        ],
      },
      practice: {
        intro: "Let's find pairs that make 10.",
        questions: [
          { type: "type", q: "How many empty spaces are there?", visual: { kind: "tenframe", filled: 6 }, answer: ["4", "four"] },
          { type: "match", q: "Match the numbers that make 10.", pairs: [["1", "9"], ["2", "8"], ["3", "7"]] },
          { type: "choice", q: "5 + ? = 10", options: ["4", "5", "6"], answer: 1 },
          {
            type: "pick",
            q: "Which pairs make 10? There is more than one.",
            options: ["6 and 4", "5 and 4", "8 and 2", "7 and 3"],
            answers: [0, 2, 3],
          },
        ],
      },
      worksheet: "number-bonds-to-10",
      task: {
        title: "Egg box bonds",
        intro: "Use an egg box as a ten frame to find all the bonds to 10.",
        need: ["An egg box with 10 cups (or draw two rows of 5 boxes on paper)", "10 small things, like conkers, buttons or dried pasta", "Paper and a pencil"],
        steps: [
          "Put some things in the egg box cups.",
          "Count how many are full. Count how many are empty.",
          "Write your bond, like 6 + 4 = 10.",
          "Try to find every bond to 10. Can you find all six?",
        ],
      },
      exit: [
        { type: "type", q: "How many more to make 10?", visual: { kind: "tenframe", filled: 8 }, answer: ["2", "two"] },
        { type: "type", q: "3 + ? = 10", answer: ["7", "seven"] },
        { type: "choice", q: "Which pair makes 10?", options: ["4 and 5", "4 and 6", "4 and 7"], answer: 1 },
        { type: "choice", q: "How many spaces does a ten frame have?", options: ["5", "10", "12"], answer: 1 },
        { type: "match", q: "Match the numbers that make 10.", pairs: [["9", "1"], ["5", "5"], ["6", "4"]] },
        { type: "type", q: "You have 10 fingers. You fold down 2. How many are still up?", answer: ["8", "eight"] },
      ],
      grownUp: {
        need: ["An egg box with 10 cups, or a hand-drawn ten frame", "10 small objects"],
        tips: [
          "Number bonds to 10 are worth knowing by heart. Little and often works best: a quick 'what goes with 7?' in the car or at bath time.",
          "Show that 3 + 7 and 7 + 3 are the same bond, so there are fewer to learn than it seems.",
        ],
        younger: "Start with bonds to 5 using one hand, then move on to 10 with both hands.",
        older: "Try bonds to 20 using two egg boxes: if 3 + 7 = 10, then 13 + 7 = 20.",
      },
    },
    {
      slug: "adding-and-taking-away-4",
      title: "Taking away",
      emoji: "🍂",
      minutes: 30,
      goal: "I can take some away from a group and say how many are left.",
      starter: [
        { type: "type", q: "6 + ? = 10", answer: ["4", "four"] },
        { type: "type", q: "How many more to make 10?", visual: { kind: "tenframe", filled: 5 }, answer: ["5", "five"] },
        { type: "match", q: "Match the numbers that make 10.", pairs: [["2", "8"], ["3", "7"], ["1", "9"]] },
        { type: "choice", q: "Which pair makes 10?", options: ["6 and 3", "6 and 4"], answer: 1 },
        { type: "type", q: "2 + 5 = ?", answer: ["7", "seven"] },
        { type: "choice", q: "What does + mean?", options: ["Add", "Take away"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Some go away",
            picture: "/lessons/adding-and-taking-away/lesson-4-1.jpg",
            alt: "A child eating one apple from a plate of apples",
            text: [
              "There are 5 apples on a plate. You eat 1 apple.",
              "Now there are 4 apples left. Some went away, so there are fewer.",
              "This is called taking away.",
            ],
          },
          {
            heading: "The minus sign",
            picture: "/lessons/adding-and-taking-away/lesson-4-2.jpg",
            alt: "A child laying one straight stick flat between a pile of leaves and a smaller pile",
            text: [
              "Taking away has its own sign. It is one short line: -",
              "We call it minus, or take away. 5 - 1 = 4 means 5 take away 1 is the same as 4.",
            ],
          },
          {
            heading: "Crossing out",
            picture: "/lessons/adding-and-taking-away/lesson-4-3.jpg",
            alt: "A child at a table drawing circles on paper and crossing some out",
            text: [
              "You can draw to help. For 7 - 3, draw 7 circles.",
              "Cross out 3 of them. Count the ones that are left. There are 4.",
              "So 7 - 3 = 4.",
            ],
          },
        ],
        words: [
          { word: "take away", meaning: "remove some from a group" },
          { word: "minus", meaning: "the sign - that means take away" },
          { word: "left", meaning: "how many are still there" },
        ],
      },
      practice: {
        intro: "Let's take some away.",
        questions: [
          { type: "type", q: "There are 6 leaves. The wind blows 2 away. How many are left?", answer: ["4", "four"] },
          { type: "type", q: "There are 9 dots. Take away 4. How many are left?", visual: { kind: "tenframe", filled: 9 }, answer: ["5", "five"] },
          { type: "choice", q: "What does - mean?", options: ["Add", "Take away", "Is the same as"], answer: 1 },
          { type: "choice", q: "Which number sentence shows 8 conkers, then 3 rolled away?", options: ["8 + 3 = 11", "8 - 3 = 5", "8 - 3 = 4"], answer: 1 },
        ],
      },
      task: {
        title: "Teddy's snack",
        intro: "Act out taking away with a toy and some snacks.",
        need: ["A teddy or toy", "Up to 10 small snacks, like raisins, crackers or pieces of apple, or pretend food", "A plate"],
        steps: [
          "Put some snacks on the plate. Count them.",
          "Teddy eats some! Take them off the plate.",
          "Count how many are left.",
          "Say the number sentence, like 'Six take away two is four'. Swap so you are Teddy next time.",
        ],
      },
      exit: [
        { type: "type", q: "5 - 2 = ?", answer: ["3", "three"] },
        { type: "type", q: "There are 8 dots. Take away 5. How many are left?", visual: { kind: "dots", rows: 2, cols: 4 }, answer: ["3", "three"] },
        { type: "choice", q: "You take some away. Are there more or fewer left?", options: ["More", "Fewer"], answer: 1 },
        { type: "choice", q: "10 - 1 = ?", options: ["9", "11", "8"], answer: 0 },
        { type: "match", q: "Match each sign to what it means.", pairs: [["+", "Add"], ["-", "Take away"], ["=", "Is the same as"]] },
        { type: "type", q: "There are 7 buttons. You lose 3. How many are left?", answer: ["4", "four"] },
      ],
      grownUp: {
        need: ["A teddy or toy", "Small snacks or pretend food", "A plate"],
        tips: [
          "Check for allergies first, and keep pieces small for little ones. Pretend food or toy bricks work just as well.",
          "Use the words 'take away', 'minus' and 'how many left'. Hearing different words for the same idea helps later.",
        ],
        younger: "Start with 5 things and take away 1 or 2 at a time.",
        older: "Try starting numbers up to 20, and write each number sentence as you go.",
      },
    },
    {
      slug: "adding-and-taking-away-5",
      title: "Counting back on a number line",
      emoji: "🐸",
      minutes: 30,
      goal: "I can count back on a number line to take away.",
      starter: [
        { type: "type", q: "6 - 2 = ?", answer: ["4", "four"] },
        { type: "choice", q: "What does - mean?", options: ["Take away", "Add"], answer: 0 },
        { type: "type", q: "There are 10 dots. Take away 3. How many are left?", visual: { kind: "tenframe", filled: 10 }, answer: ["7", "seven"] },
        { type: "choice", q: "You take some away. Are there more or fewer left?", options: ["Fewer", "More"], answer: 0 },
        { type: "type", q: "4 + 6 = ?", answer: ["10", "ten"] },
        { type: "match", q: "Match each sum to its answer.", pairs: [["5 - 1", "4"], ["9 - 2", "7"], ["3 - 3", "0"]] },
      ],
      learn: {
        cards: [
          {
            heading: "A number line",
            picture: "/lessons/adding-and-taking-away/lesson-5-1.jpg",
            alt: "A row of leaves laid out in a straight line along a garden path",
            text: [
              "A number line shows numbers in order along a line. Small numbers are at one end. Big numbers are at the other.",
              "Going forward makes the number bigger. Going back makes it smaller.",
            ],
          },
          {
            heading: "Jumping back",
            picture: "/lessons/adding-and-taking-away/lesson-5-2.jpg",
            alt: "A child hopping backwards along a row of chalk squares in a garden",
            text: [
              "To work out 7 - 3, put your finger on 7.",
              "Jump back 3 times: 6, 5, 4. You land on 4.",
              "So 7 - 3 = 4. Count the jumps, not the number you start on.",
            ],
          },
          {
            heading: "Jumping forward",
            picture: "/lessons/adding-and-taking-away/lesson-5-3.jpg",
            alt: "A child hopping forwards along chalk squares while a grown-up watches",
            text: [
              "You can add on a number line too. For 5 + 3, start on 5 and jump forward 3: 6, 7, 8.",
              "Forward is adding. Back is taking away.",
            ],
          },
        ],
        words: [
          { word: "number line", meaning: "a line with numbers in order along it" },
          { word: "count back", meaning: "say the numbers going down, like 5, 4, 3" },
          { word: "jump", meaning: "move along the number line one step at a time" },
        ],
      },
      practice: {
        intro: "Let's jump along the number line.",
        questions: [
          { type: "type", q: "Start on 6. Jump back 2. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [6, 4] }, answer: ["4", "four"] },
          { type: "order", q: "Count back from 9. Put these in order.", items: ["9", "8", "7", "6"] },
          { type: "type", q: "Start on 3. Jump forward 4. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [3, 7] }, answer: ["7", "seven"] },
          { type: "choice", q: "10 - 4 = ?", visual: { kind: "numberline", from: 0, to: 10 }, options: ["5", "6", "7"], answer: 1 },
        ],
      },
      worksheet: "adding-and-taking-away-to-20",
      task: {
        title: "Hop back",
        intro: "Make a big number line and jump along it.",
        need: ["11 pieces of paper, or chalk for outside", "A pen", "Space to jump"],
        steps: [
          "Write 0 to 10 on the pieces of paper, one number on each. Lay them in a line on the floor, or chalk them outside.",
          "Your grown-up says a take away, like 8 - 3.",
          "Stand on 8. Hop back 3 times, counting each hop.",
          "Say where you landed. Then try some forward hops for adding.",
        ],
      },
      exit: [
        { type: "type", q: "Start on 9. Jump back 3. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [9, 6] }, answer: ["6", "six"] },
        { type: "type", q: "8 - 2 = ?", answer: ["6", "six"] },
        { type: "choice", q: "To take away on a number line, which way do you jump?", options: ["Forward", "Back"], answer: 1 },
        { type: "order", q: "Count back from 5.", items: ["5", "4", "3", "2", "1"] },
        { type: "type", q: "Start on 15. Jump back 3. Where do you land?", visual: { kind: "numberline", from: 10, to: 20, jump: [15, 12] }, answer: ["12", "twelve"] },
        { type: "choice", q: "4 + 5 = ?", visual: { kind: "numberline", from: 0, to: 10 }, options: ["8", "9", "10"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and a pen, or chalk", "Space to hop"],
        tips: [
          "A common slip is counting the starting number as the first jump. Say 'jump, then count' to help: from 7, the first jump lands on 6.",
          "Keep the floor number line out for a few days. Short, bouncy practice sticks well.",
        ],
        younger: "Use a number line to 5, and only jump back 1 or 2.",
        older: "Make a number line to 20 and try take aways like 17 - 5.",
      },
    },
    {
      slug: "adding-and-taking-away-6",
      title: "Missing number puzzles",
      emoji: "🧩",
      minutes: 30,
      goal: "I can find the missing number in an adding or taking away sum.",
      starter: [
        { type: "type", q: "Start on 8. Jump back 3. Where do you land?", visual: { kind: "numberline", from: 0, to: 10, jump: [8, 5] }, answer: ["5", "five"] },
        { type: "type", q: "9 - 4 = ?", answer: ["5", "five"] },
        { type: "choice", q: "To take away on a number line, which way do you jump?", options: ["Back", "Forward"], answer: 0 },
        { type: "order", q: "Count back from 10.", items: ["10", "9", "8", "7"] },
        { type: "type", q: "2 + 6 = ?", answer: ["8", "eight"] },
        { type: "match", q: "Match the numbers that make 10.", pairs: [["4", "6"], ["7", "3"], ["8", "2"]] },
      ],
      learn: {
        cards: [
          {
            heading: "A number is hiding",
            picture: "/lessons/adding-and-taking-away/lesson-6-1.jpg",
            alt: "A child peeking under a cup to find conkers hidden beneath it",
            text: [
              "Sometimes a number in a sum is missing. We put a box or a question mark where it goes.",
              "4 + ? = 6. What is hiding? We need to find out.",
            ],
          },
          {
            heading: "Count on to find it",
            picture: "/lessons/adding-and-taking-away/lesson-6-2.jpg",
            alt: "A child adding conkers one at a time to a small pile",
            text: [
              "For 4 + ? = 6, start on 4 and count on until you reach 6: 5, 6.",
              "That is 2 counts, so the missing number is 2. Check it: 4 + 2 = 6.",
            ],
          },
          {
            heading: "Hiding in a take away",
            picture: "/lessons/adding-and-taking-away/lesson-6-3.jpg",
            alt: "A grown-up hiding some buttons in their hand while a child counts the rest",
            text: [
              "8 - ? = 5. Eight buttons, and some are hidden. Five are left.",
              "Count back from 8 to 5: 7, 6, 5. That is 3 jumps, so 3 are hidden.",
              "Always check: 8 - 3 = 5. Yes!",
            ],
          },
        ],
        words: [
          { word: "missing", meaning: "not there, so we have to find it" },
          { word: "puzzle", meaning: "a problem you work out" },
          { word: "check", meaning: "look again to make sure you are right" },
        ],
      },
      practice: {
        intro: "Can you find the hiding numbers?",
        questions: [
          { type: "type", q: "3 + ? = 5", answer: ["2", "two"] },
          { type: "type", q: "? + 4 = 10", visual: { kind: "tenframe", filled: 4 }, answer: ["6", "six"] },
          { type: "choice", q: "7 - ? = 4", visual: { kind: "numberline", from: 0, to: 10, jump: [7, 4] }, options: ["2", "3", "4"], answer: 1 },
          { type: "gap", q: "Fill the gaps.", text: "5 + ___ = 9 and 6 - ___ = 1", bank: ["4", "5", "3"], answers: ["4", "5"] },
        ],
      },
      worksheet: "adding-and-taking-away-to-20",
      task: {
        title: "Hide and seek conkers",
        intro: "Play a hiding game to find the missing number.",
        need: ["10 small things, like conkers, buttons or toy bricks", "A cup or bowl to hide them under", "A grown-up to play with"],
        steps: [
          "Count out some things together, like 8. Close your eyes.",
          "Your grown-up hides some under the cup.",
          "Open your eyes and count the ones you can see.",
          "How many are hiding? Say your guess, then lift the cup to check. Take turns to hide.",
        ],
      },
      exit: [
        { type: "type", q: "2 + ? = 7", answer: ["5", "five"] },
        { type: "type", q: "10 - ? = 8", answer: ["2", "two"] },
        { type: "type", q: "How many more to make 10?", visual: { kind: "tenframe", filled: 3 }, answer: ["7", "seven"] },
        { type: "choice", q: "? + 3 = 6", options: ["2", "3", "9"], answer: 1 },
        { type: "choice", q: "You find a missing number. What should you do next?", options: ["Check it in the sum", "Rub it out"], answer: 0 },
        { type: "type", q: "10 + ? = 15", visual: { kind: "blocks", tens: 1, ones: 5 }, answer: ["5", "five"] },
      ],
      grownUp: {
        need: ["10 small objects", "A cup or bowl"],
        tips: [
          "Missing number sums are a big step. Real objects and the hiding game make them much easier to picture.",
          "Use bonds to 10 to help: if your child knows 3 + 7 = 10, then 3 + ? = 10 is quick.",
        ],
        younger: "Play the hiding game with just 5 things, and skip writing the sums.",
        older: "Try puzzles to 20, like 12 + ? = 15 or 18 - ? = 14, and write your own for your grown-up to solve.",
      },
    },
  ],
};
