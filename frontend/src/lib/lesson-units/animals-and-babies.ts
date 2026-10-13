import type { LessonUnit } from "@/lib/lessons";

/** Animals and their babies, for ages 5 to 7. A grown-up reads the screen aloud. Animal groups, food, babies, life cycles, needs and pets. */
export const animalsAndBabies: LessonUnit = {
  slug: "animals-and-babies",
  title: "Animals and their babies",
  short: "Animal babies",
  subject: "Science",
  ages: "5 to 7",
  emoji: "🐣",
  color: "#C9A27A",
  summary: "Six playful lessons about animal groups, what animals eat, baby animals, life cycles, what living things need and caring for pets.",
  cover: "/lessons/units/animals-and-babies.jpg",
  lessons: [
    {
      slug: "animals-and-babies-1",
      title: "Fur, feathers and fins",
      emoji: "🐶",
      minutes: 30,
      goal: "I can sort animals into mammals, birds and fish.",
      starter: [
        { type: "choice", q: "Which of these is an animal?", options: ["A tree", "A rabbit", "A rock"], answer: 1 },
        { type: "choice", q: "Which animal can fly?", options: ["A robin", "A cow"], answer: 0 },
        { type: "choice", q: "Where does a fish live?", options: ["In a tree", "Under the ground", "In water"], answer: 2 },
        { type: "pick", q: "Which animals have fur? There is more than one.", options: ["A cat", "A goldfish", "A dog", "A duck"], answers: [0, 2] },
        { type: "match", q: "Match each animal to the sound it makes.", pairs: [["Cow", "Moo"], ["Dog", "Woof"], ["Duck", "Quack"]] },
        { type: "choice", q: "Are you an animal too?", options: ["Yes", "No"], answer: 0, why: "People are animals too. We are mammals!" },
      ],
      learn: {
        cards: [
          {
            heading: "Mammals",
            picture: "/lessons/animals-and-babies/lesson-1-1.jpg",
            alt: "A boy stroking a dog, with a cow and a horse in a field",
            text: [
              "Mammals have hair or fur on their bodies.",
              "Mammal babies drink milk from their mums.",
              "Dogs, cats, cows and horses are mammals. You are a mammal too!",
            ],
          },
          {
            heading: "Birds",
            picture: "/lessons/animals-and-babies/lesson-1-2.jpg",
            alt: "A robin, a duck and a hen standing on the grass",
            text: [
              "Birds have feathers, two wings and a beak.",
              "Birds lay eggs with hard shells.",
              "Robins, ducks, hens and owls are all birds.",
            ],
          },
          {
            heading: "Fish",
            picture: "/lessons/animals-and-babies/lesson-1-3.jpg",
            alt: "Goldfish and a salmon swimming in clear water",
            text: [
              "Fish live in water. They have fins to help them swim.",
              "Most fish have scales on their skin. They breathe under water with gills.",
              "Goldfish, salmon and sharks are all fish.",
            ],
          },
        ],
        words: [
          { word: "mammal", meaning: "an animal with hair or fur whose babies drink milk" },
          { word: "bird", meaning: "an animal with feathers, wings and a beak" },
          { word: "fish", meaning: "an animal that lives in water and has fins" },
          { word: "feathers", meaning: "the soft covering on a bird" },
        ],
      },
      practice: {
        intro: "Can you sort the animals?",
        questions: [
          { type: "match", q: "Match each animal to its group.", pairs: [["Dog", "Mammal"], ["Robin", "Bird"], ["Goldfish", "Fish"]] },
          { type: "choice", q: "What does a bird have?", options: ["Fur", "Fins", "Feathers"], answer: 2 },
          { type: "pick", q: "Which animals are mammals? There is more than one.", options: ["A horse", "An owl", "A cat", "A shark"], answers: [0, 2] },
          { type: "choice", q: "What helps a fish swim?", options: ["Fins", "Wings"], answer: 0 },
        ],
      },
      task: {
        title: "Animal sorting hoops",
        intro: "Sort your toy animals into groups.",
        need: ["Toy animals or pictures of animals", "Three pieces of string, scarves or hoops"],
        steps: [
          "Make three big circles on the floor.",
          "Call one circle Mammals, one Birds and one Fish.",
          "Pick up an animal. Does it have fur, feathers or fins?",
          "Put it in the right circle.",
          "Now move like each group. Gallop, flap and swim!",
        ],
      },
      exit: [
        { type: "choice", q: "What does a mammal have on its body?", options: ["Feathers", "Hair or fur", "Fins"], answer: 1 },
        { type: "choice", q: "What do mammal babies drink?", options: ["Milk", "Juice"], answer: 0 },
        { type: "choice", q: "Which animal is a bird?", options: ["A duck", "A cow", "A goldfish"], answer: 0 },
        { type: "choice", q: "Where do fish live?", options: ["In nests", "In water"], answer: 1 },
        { type: "match", q: "Match each group to what it has.", pairs: [["Mammal", "Fur"], ["Bird", "Feathers"], ["Fish", "Fins"]] },
        { type: "pick", q: "Which animals are fish? There is more than one.", options: ["A salmon", "A rabbit", "A shark", "An owl"], answers: [0, 2] },
      ],
      grownUp: {
        need: ["Toy animals or animal pictures", "String, scarves or hoops"],
        tips: [
          "Keep it simple: fur, feathers or fins. Body coverings are the easiest way in for this age.",
          "Children may say a whale or dolphin is a fish. They are mammals, but you can save that surprise for later.",
        ],
        younger: "Sort animals into just two groups: ones that fly and ones that don't.",
        older: "Find one animal for each group that lives in your country, and one that lives far away.",
      },
    },
    {
      slug: "animals-and-babies-2",
      title: "Scaly reptiles and slimy amphibians",
      emoji: "🐸",
      minutes: 30,
      goal: "I can tell a reptile from an amphibian.",
      starter: [
        { type: "choice", q: "What do birds have?", options: ["Feathers", "Fur", "Fins"], answer: 0 },
        { type: "choice", q: "A dog is a...", options: ["fish", "bird", "mammal"], answer: 2 },
        { type: "choice", q: "What do mammal babies drink?", options: ["Water from a pond", "Milk"], answer: 1 },
        { type: "match", q: "Match each animal to its group.", pairs: [["Cat", "Mammal"], ["Owl", "Bird"], ["Shark", "Fish"]] },
        { type: "choice", q: "What helps a fish swim?", options: ["Fins", "A beak"], answer: 0 },
        { type: "pick", q: "Which of these are birds? There is more than one.", options: ["A hen", "A robin", "A horse"], answers: [0, 1] },
      ],
      learn: {
        cards: [
          {
            heading: "Reptiles",
            picture: "/lessons/animals-and-babies/lesson-2-1.jpg",
            alt: "A lizard, a tortoise and a snake on sunny rocks",
            text: [
              "Reptiles have dry skin covered in scales.",
              "Most reptiles lay eggs on land.",
              "Snakes, lizards, tortoises and crocodiles are reptiles.",
            ],
          },
          {
            heading: "Amphibians",
            picture: "/lessons/animals-and-babies/lesson-2-2.jpg",
            alt: "A frog, a toad and a newt by a pond",
            text: [
              "Amphibians have smooth, damp skin. They have no scales.",
              "They start their lives in water. When they grow up, they can live on land too.",
              "Frogs, toads and newts are amphibians.",
            ],
          },
          {
            heading: "Five animal groups",
            picture: "/lessons/animals-and-babies/lesson-2-3.jpg",
            alt: "A girl with a magnifying glass looking at five different animals",
            text: [
              "Now you know five animal groups: mammals, birds, fish, reptiles and amphibians.",
              "Scientists sort animals by looking closely at their bodies.",
              "Ask: does it have fur, feathers, fins, dry scales or damp skin?",
            ],
          },
        ],
        words: [
          { word: "reptile", meaning: "an animal with dry, scaly skin" },
          { word: "amphibian", meaning: "an animal with damp skin that starts life in water" },
          { word: "scales", meaning: "small hard pieces that cover the skin" },
        ],
      },
      practice: {
        intro: "Reptile or amphibian?",
        questions: [
          { type: "choice", q: "A snake is a...", options: ["reptile", "amphibian"], answer: 0 },
          { type: "choice", q: "A frog is a...", options: ["reptile", "amphibian"], answer: 1 },
          { type: "match", q: "Match each animal to its group.", pairs: [["Tortoise", "Reptile"], ["Newt", "Amphibian"], ["Horse", "Mammal"]] },
          { type: "choice", q: "What is a reptile's skin like?", options: ["Smooth and damp", "Soft and furry", "Dry and scaly"], answer: 2 },
        ],
      },
      task: {
        title: "Mystery animal game",
        intro: "Play a guessing game about animal groups.",
        need: ["Toy animals or animal pictures", "A cloth or bag to hide them in"],
        steps: [
          "Your grown-up hides one animal in the bag.",
          "Ask questions. Does it have fur? Does it have scales?",
          "Your grown-up can only say yes or no.",
          "Guess the group, then guess the animal!",
          "Swap over. Now you hide one.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a reptile's skin like?", options: ["Dry and scaly", "Soft and furry"], answer: 0 },
        { type: "choice", q: "Where do amphibians start their lives?", options: ["In a nest", "In water", "In a tree"], answer: 1 },
        { type: "choice", q: "Which animal is a reptile?", options: ["A frog", "A cat", "A crocodile"], answer: 2 },
        { type: "choice", q: "Which animal is an amphibian?", options: ["A toad", "A lizard"], answer: 0 },
        { type: "pick", q: "Which animals are reptiles? There is more than one.", options: ["A snake", "A newt", "A tortoise", "A duck"], answers: [0, 2] },
        { type: "gap", q: "Fill the gap.", text: "A frog has smooth, ___ skin.", bank: ["damp", "furry", "feathery"], answers: ["damp"] },
      ],
      grownUp: {
        need: ["Toy animals or animal pictures", "A cloth or bag"],
        tips: [
          "Reptiles and amphibians are the groups children mix up most. Damp skin versus dry scales is the key difference.",
          "If you see a frog in a garden or park, look but don't pick it up. Our warm, dry hands can hurt its skin.",
        ],
        younger: "Just compare a frog and a snake. Talk about how each one looks and moves.",
        older: "Draw a simple sorting tree: 'Does it have fur?' Yes leads to mammal. No leads to the next question.",
      },
    },
    {
      slug: "animals-and-babies-3",
      title: "What's for dinner?",
      emoji: "🥕",
      minutes: 30,
      goal: "I can say if an animal eats plants, meat or both.",
      starter: [
        { type: "choice", q: "A snake is a...", options: ["reptile", "mammal"], answer: 0 },
        { type: "choice", q: "What is a frog's skin like?", options: ["Dry and scaly", "Smooth and damp"], answer: 1 },
        { type: "choice", q: "Which animal is an amphibian?", options: ["A lizard", "A robin", "A newt"], answer: 2 },
        { type: "match", q: "Match each animal to its group.", pairs: [["Crocodile", "Reptile"], ["Toad", "Amphibian"], ["Hen", "Bird"]] },
        { type: "choice", q: "How many animal groups did we learn?", options: ["Two", "Five", "Ten"], answer: 1 },
        { type: "pick", q: "Which animals are mammals? There is more than one.", options: ["A cow", "A goldfish", "A dog"], answers: [0, 2] },
      ],
      learn: {
        cards: [
          {
            heading: "Herbivores eat plants",
            picture: "/lessons/animals-and-babies/lesson-3-1.jpg",
            alt: "A rabbit eating a carrot and a sheep eating grass",
            text: [
              "A herbivore only eats plants.",
              "Cows and sheep munch grass. Rabbits nibble leaves and carrots.",
            ],
          },
          {
            heading: "Carnivores eat meat",
            picture: "/lessons/animals-and-babies/lesson-3-2.jpg",
            alt: "A lion resting under a tree with an owl above",
            text: [
              "A carnivore eats meat. Meat comes from other animals.",
              "Lions, tigers, sharks and owls are carnivores.",
              "Carnivores often have sharp teeth or claws to help them catch food.",
            ],
          },
          {
            heading: "Omnivores eat both",
            picture: "/lessons/animals-and-babies/lesson-3-3.jpg",
            alt: "A bear eating berries and a pig eating vegetables",
            text: [
              "An omnivore eats plants and meat.",
              "Pigs and bears are omnivores. Many people are omnivores too.",
              "Some people choose not to eat meat. That's fine. They eat lots of plant foods instead.",
            ],
          },
        ],
        words: [
          { word: "herbivore", meaning: "an animal that only eats plants" },
          { word: "carnivore", meaning: "an animal that eats meat" },
          { word: "omnivore", meaning: "an animal that eats plants and meat" },
        ],
      },
      practice: {
        intro: "Who eats what?",
        questions: [
          { type: "choice", q: "A rabbit eats only plants. It is a...", options: ["carnivore", "herbivore", "omnivore"], answer: 1 },
          { type: "choice", q: "A lion eats meat. It is a...", options: ["carnivore", "herbivore"], answer: 0 },
          { type: "match", q: "Match each animal to what it eats.", pairs: [["Cow", "Grass"], ["Owl", "Mice"], ["Bear", "Berries and fish"]] },
          { type: "pick", q: "Which animals are herbivores? There is more than one.", options: ["A shark", "A sheep", "A cow", "A tiger"], answers: [1, 2] },
        ],
      },
      task: {
        title: "Animal café",
        intro: "Open a café for toy animals and give each one the right food.",
        need: ["Three toy animals or pictures: one herbivore, one carnivore, one omnivore", "Paper plates or pieces of paper", "Crayons"],
        steps: [
          "Put your three animals at the café table.",
          "Draw some food on each plate.",
          "Draw leaves or grass for the herbivore.",
          "Draw meat or fish for the carnivore.",
          "Draw a bit of both for the omnivore.",
          "Serve dinner! Tell your grown-up why each animal got its food.",
        ],
      },
      exit: [
        { type: "choice", q: "What does a herbivore eat?", options: ["Only plants", "Only meat"], answer: 0 },
        { type: "choice", q: "What does a carnivore eat?", options: ["Grass", "Meat", "Leaves"], answer: 1 },
        { type: "choice", q: "What does an omnivore eat?", options: ["Only plants", "Only meat", "Plants and meat"], answer: 2 },
        { type: "match", q: "Match each animal to its word.", pairs: [["Sheep", "Herbivore"], ["Tiger", "Carnivore"], ["Pig", "Omnivore"]] },
        { type: "choice", q: "Which animal is a carnivore?", options: ["A rabbit", "A shark"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "A cow eats grass, so it is a ___.", bank: ["herbivore", "carnivore", "omnivore"], answers: ["herbivore"] },
      ],
      grownUp: {
        need: ["Three toy animals or pictures", "Paper and crayons"],
        tips: [
          "The words are long. Break them up: herb-i-vore, carn-i-vore, omn-i-vore. Clap the parts.",
          "Talk about meat as 'food from animals' in a calm, matter-of-fact way. Keep the focus on the café game, not on hunting.",
          "Pet dogs and cats eat food from a tin or bag, which is fine to mention if it comes up.",
        ],
        younger: "Just sort food into two piles: food from plants and food from animals.",
        older: "Think of three foods you ate today. Did they come from plants, animals or both? Are you an omnivore?",
      },
    },
    {
      slug: "animals-and-babies-4",
      title: "Baby animals",
      emoji: "🐑",
      minutes: 30,
      goal: "I can name some baby animals and say that babies grow into adults.",
      starter: [
        { type: "choice", q: "What does a herbivore eat?", options: ["Only plants", "Only meat"], answer: 0 },
        { type: "choice", q: "A lion is a...", options: ["herbivore", "carnivore"], answer: 1 },
        { type: "choice", q: "An animal that eats plants and meat is an...", options: ["omnivore", "amphibian", "owl"], answer: 0 },
        { type: "match", q: "Match each animal to what it eats.", pairs: [["Rabbit", "Carrots"], ["Shark", "Fish"], ["Cow", "Grass"]] },
        { type: "pick", q: "Which animals are herbivores? There is more than one.", options: ["A sheep", "A tiger", "A cow"], answers: [0, 2] },
        { type: "choice", q: "What is a pig?", options: ["A carnivore", "An omnivore", "A herbivore"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "All animals have babies",
            picture: "/lessons/animals-and-babies/lesson-4-1.jpg",
            alt: "A cow and her calf in a field, watched by a girl and her mum",
            text: [
              "All animals have babies.",
              "The babies grow up into adults. Then the adults can have babies of their own.",
              "You were a baby once. Now you are growing up!",
            ],
          },
          {
            heading: "Baby animal names",
            picture: "/lessons/animals-and-babies/lesson-4-2.jpg",
            alt: "A lamb, a kitten, a chick and a lion cub on the grass",
            text: [
              "Lots of baby animals have special names.",
              "A baby cow is a calf. A baby sheep is a lamb. A baby cat is a kitten.",
              "A baby chicken is a chick. A baby lion or bear is a cub. A baby frog is a tadpole.",
            ],
          },
          {
            heading: "Just like mum, or not?",
            picture: "/lessons/animals-and-babies/lesson-4-3.jpg",
            alt: "A sheep with its lamb, and a frog with tadpoles in a pond",
            text: [
              "Many babies look like small adults. A lamb looks like a little sheep.",
              "Some babies look very different. A tadpole has a tail and no legs. It looks nothing like a frog yet!",
            ],
          },
        ],
        words: [
          { word: "baby", meaning: "a very young animal or person" },
          { word: "adult", meaning: "an animal or person who is fully grown" },
          { word: "calf", meaning: "a baby cow" },
          { word: "cub", meaning: "a baby lion, bear or fox" },
        ],
      },
      practice: {
        intro: "Find the baby for each grown-up animal.",
        questions: [
          { type: "match", q: "Match each adult to its baby.", pairs: [["Sheep", "Lamb"], ["Cat", "Kitten"], ["Cow", "Calf"]] },
          { type: "choice", q: "What is a baby chicken called?", options: ["A cub", "A chick", "A lamb"], answer: 1 },
          { type: "choice", q: "What is a baby frog called?", options: ["A kitten", "A tadpole"], answer: 1 },
          { type: "type", q: "A baby dog is called a ...", answer: ["puppy", "pup"] },
        ],
      },
      task: {
        title: "Baby animal snap",
        intro: "Make a matching game of adults and babies.",
        need: ["8 small pieces of card or paper", "Crayons or pencils"],
        steps: [
          "Pick four animals, like a sheep, a cat, a cow and a hen.",
          "Draw each adult animal on one card.",
          "Draw its baby on another card.",
          "Mix up the cards and lay them face down.",
          "Turn over two. Is it a mum and her baby? Keep the pair!",
          "Say the baby's name each time you find a pair.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a baby sheep called?", options: ["A lamb", "A calf", "A chick"], answer: 0 },
        { type: "choice", q: "What is a baby cat called?", options: ["A cub", "A kitten"], answer: 1 },
        { type: "choice", q: "What is a baby lion called?", options: ["A tadpole", "A lamb", "A cub"], answer: 2 },
        { type: "match", q: "Match each baby to its adult.", pairs: [["Calf", "Cow"], ["Chick", "Chicken"], ["Tadpole", "Frog"]] },
        { type: "choice", q: "What do baby animals grow into?", options: ["Adults", "Plants"], answer: 0 },
        { type: "choice", q: "Which baby looks very different from its adult?", options: ["A lamb", "A tadpole", "A kitten"], answer: 1 },
      ],
      grownUp: {
        need: ["8 small pieces of card", "Crayons"],
        tips: [
          "Look at baby photos of your child, or of yourself. It makes 'babies grow into adults' real.",
          "A calf can also be a baby elephant or whale, and a cub can be a baby fox or tiger. Some names are shared.",
        ],
        younger: "Play 'mummy and baby' with toy animals. Say 'Where's the lamb's mummy?' and let them find the sheep.",
        older: "Learn three more baby names: a foal (horse), a duckling (duck) and a joey (kangaroo).",
      },
    },
    {
      slug: "animals-and-babies-5",
      title: "From egg to chicken, from tadpole to frog",
      emoji: "🥚",
      minutes: 30,
      goal: "I can put the stages of a chicken's and a frog's life in order.",
      starter: [
        { type: "choice", q: "What is a baby cow called?", options: ["A calf", "A cub"], answer: 0 },
        { type: "choice", q: "What is a baby frog called?", options: ["A chick", "A tadpole", "A kitten"], answer: 1 },
        { type: "choice", q: "What do babies grow into?", options: ["Eggs", "Adults"], answer: 1 },
        { type: "match", q: "Match each adult to its baby.", pairs: [["Chicken", "Chick"], ["Sheep", "Lamb"], ["Bear", "Cub"]] },
        { type: "choice", q: "Which baby looks like a small adult?", options: ["A lamb", "A tadpole"], answer: 0 },
        { type: "type", q: "A baby cat is called a ...", answer: ["kitten", "kitty"] },
      ],
      learn: {
        cards: [
          {
            heading: "A life cycle",
            picture: "/lessons/animals-and-babies/lesson-5-1.jpg",
            alt: "A hen, an egg and a chick arranged in a circle",
            text: [
              "A life cycle shows how an animal grows and changes.",
              "It goes round and round like a circle. Adults have babies, and the babies grow into adults.",
            ],
          },
          {
            heading: "Egg to chicken",
            picture: "/lessons/animals-and-babies/lesson-5-2.jpg",
            alt: "A chick hatching from an egg in a nest",
            text: [
              "A hen lays an egg. She sits on it to keep it warm.",
              "After about three weeks, a fluffy chick pecks its way out. This is called hatching.",
              "The chick eats and grows. It becomes an adult chicken.",
            ],
          },
          {
            heading: "Tadpole to frog",
            picture: "/lessons/animals-and-babies/lesson-5-3.jpg",
            alt: "Frogspawn, tadpoles and a frog in a pond",
            text: [
              "A frog lays lots of jelly eggs in a pond. This is called frogspawn.",
              "A tadpole wriggles out of each egg. It has a tail for swimming.",
              "The tadpole grows legs and loses its tail. Now it is a frog and can hop onto land.",
            ],
          },
        ],
        words: [
          { word: "life cycle", meaning: "how an animal grows and changes, round and round" },
          { word: "hatch", meaning: "when a baby comes out of its egg" },
          { word: "frogspawn", meaning: "lots of frog eggs in jelly" },
        ],
      },
      practice: {
        intro: "Put the life cycles in order.",
        questions: [
          { type: "order", q: "Put the chicken's life cycle in order.", items: ["Egg", "Chick", "Chicken"] },
          { type: "order", q: "Put the frog's life cycle in order.", items: ["Frogspawn", "Tadpole", "Tadpole with legs", "Frog"] },
          { type: "choice", q: "Where does a frog lay its eggs?", options: ["In a nest", "In a pond", "In a tree"], answer: 1 },
          { type: "choice", q: "Why does a hen sit on her egg?", options: ["To keep it warm", "To hide it from the rain"], answer: 0 },
        ],
      },
      task: {
        title: "Life cycle wheel",
        intro: "Make a wheel that shows a life cycle going round and round.",
        need: ["A paper plate or a circle of card", "Crayons", "A grown-up to help"],
        steps: [
          "Choose the chicken or the frog.",
          "Ask your grown-up to draw lines to split the plate into parts, like a pizza. Three parts for a chicken, four for a frog.",
          "Draw the first stage in one part.",
          "Go round the plate and draw the next stages.",
          "Draw arrows between them to show it goes round.",
          "Turn your wheel and tell the story of the life cycle.",
        ],
      },
      exit: [
        { type: "order", q: "Put the chicken's life cycle in order.", items: ["Egg", "Chick", "Chicken"] },
        { type: "order", q: "Put the frog's life cycle in order.", items: ["Frogspawn", "Tadpole", "Frog"] },
        { type: "choice", q: "What is frogspawn?", options: ["Frog eggs in jelly", "A baby chicken", "A frog's home"], answer: 0 },
        { type: "choice", q: "What does hatch mean?", options: ["A baby comes out of its egg", "An animal goes to sleep"], answer: 0 },
        { type: "choice", q: "What does a tadpole lose as it grows into a frog?", options: ["Its legs", "Its tail"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "A life cycle goes round and round like a ___.", bank: ["circle", "line", "square"], answers: ["circle"] },
      ],
      grownUp: {
        need: ["A paper plate or card circle", "Crayons"],
        tips: [
          "In spring, you might spot frogspawn in a pond. Look together, but leave it where it is. Hold hands near water.",
          "Children sometimes think all eggs hatch. Shop eggs won't hatch, so there's no need to worry about breakfast!",
        ],
        younger: "Act out the chicken life cycle: curl up small as an egg, pop out as a chick, then strut about as a chicken.",
        older: "Add 'froglet' to the frog life cycle: a tiny frog that still has a bit of tail.",
      },
    },
    {
      slug: "animals-and-babies-6",
      title: "What living things need, and caring for pets",
      emoji: "🐹",
      minutes: 30,
      goal: "I can say what animals and people need to live, and how to look after a pet.",
      starter: [
        { type: "order", q: "Put the chicken's life cycle in order.", items: ["Egg", "Chick", "Chicken"] },
        { type: "choice", q: "What is frogspawn?", options: ["A pond plant", "Frog eggs in jelly"], answer: 1 },
        { type: "choice", q: "What does a tadpole have for swimming?", options: ["A tail", "Wings", "Fur"], answer: 0 },
        { type: "choice", q: "What does hatch mean?", options: ["A baby comes out of its egg", "A baby goes to sleep"], answer: 0 },
        { type: "match", q: "Match each word to what it means.", pairs: [["Hatch", "Come out of an egg"], ["Frogspawn", "Frog eggs"], ["Life cycle", "How an animal grows"]] },
        { type: "choice", q: "Where does a frog lay eggs?", options: ["In a nest", "In a field", "In a pond"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "What we all need",
            picture: "/lessons/animals-and-babies/lesson-6-1.jpg",
            alt: "A boy breathing fresh air in a garden with water and an apple",
            text: [
              "All animals need food, water and air to stay alive.",
              "People are animals too, so we need them as well.",
              "Take a big breath in. That's air!",
            ],
          },
          {
            heading: "A safe place",
            picture: "/lessons/animals-and-babies/lesson-6-2.jpg",
            alt: "A bird in its nest and a rabbit in its burrow",
            text: [
              "Animals also need shelter. Shelter is a safe place to rest and keep warm.",
              "A bird has a nest. A rabbit has a burrow. You have a home.",
            ],
          },
          {
            heading: "Caring for pets",
            picture: "/lessons/animals-and-babies/lesson-6-3.jpg",
            alt: "A girl filling a dog's water bowl",
            text: [
              "A pet needs us to look after it every day.",
              "Pets need the right food, fresh water, a clean, cosy bed and lots of kindness.",
              "Dogs need walks. When a pet is poorly, a vet helps to make it better.",
            ],
          },
        ],
        words: [
          { word: "air", meaning: "what we breathe in" },
          { word: "shelter", meaning: "a safe place to rest and keep warm" },
          { word: "pet", meaning: "an animal that lives with people and is cared for" },
          { word: "vet", meaning: "an animal doctor" },
        ],
      },
      practice: {
        intro: "What do living things need?",
        questions: [
          { type: "pick", q: "What do all animals need to live? There is more than one.", options: ["Food", "Toys", "Water", "Air"], answers: [0, 2, 3] },
          { type: "match", q: "Match each animal to its shelter.", pairs: [["Bird", "Nest"], ["Rabbit", "Burrow"], ["Person", "House"]] },
          { type: "choice", q: "Who helps a poorly pet get better?", options: ["A vet", "A baker"], answer: 0 },
          { type: "choice", q: "Which is a kind way to treat a pet?", options: ["Shouting at it", "Stroking it gently", "Forgetting its water"], answer: 1 },
        ],
      },
      task: {
        title: "Pet care poster",
        intro: "Make a poster to show how to look after a pet.",
        need: ["A big piece of paper", "Crayons or pens"],
        steps: [
          "Pick a pet. It can be real or one you wish you had.",
          "Draw your pet in the middle of the paper.",
          "Draw its food bowl and water bowl.",
          "Draw its bed or home.",
          "Draw one more thing it needs, like a walk or a cuddle.",
          "Show your poster and tell your grown-up how you would care for it.",
        ],
      },
      exit: [
        { type: "pick", q: "What do people need to live? There is more than one.", options: ["Water", "Air", "A bike", "Food"], answers: [0, 1, 3] },
        { type: "choice", q: "What is shelter?", options: ["A safe place to rest and keep warm", "A kind of food"], answer: 0 },
        { type: "choice", q: "What is a vet?", options: ["A pet shop", "An animal doctor", "A kind of dog"], answer: 1 },
        { type: "match", q: "Match each animal to its shelter.", pairs: [["Bird", "Nest"], ["Rabbit", "Burrow"], ["Fish", "Pond"]] },
        { type: "choice", q: "How often does a pet need looking after?", options: ["Once a year", "Every day"], answer: 1 },
        { type: "gap", q: "Fill the gaps.", text: "A pet needs fresh ___ and the right ___.", bank: ["water", "food", "toys", "sweets"], answers: ["water", "food"] },
      ],
      grownUp: {
        need: ["A big piece of paper", "Crayons or pens"],
        tips: [
          "If you have a pet, let your child help with one small job today, like filling the water bowl.",
          "Remind them to wash their hands after touching any animal, and to ask before stroking someone else's pet.",
        ],
        younger: "Feed a teddy pretend food and water, tuck it into a bed, and give it a cuddle.",
        older: "Pick a pet and find out one extra thing it needs. For example, hamsters sleep in the day and wake up at night.",
      },
    },
  ],
};
