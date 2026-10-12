import type { LessonUnit } from "@/lib/lessons";

/**
 * Body systems, for ages 11 to 14 (KS3 biology). The skeleton and joints, antagonistic muscles, digestion and enzymes,
 * breathing and gas exchange, the heart and blood vessels, and how the systems work together during exercise.
 * Practicals use card, string, crackers, jelly and pineapple, a bottle and bowl of water, a funnel and tube, and a timer.
 */
export const bodySystems: LessonUnit = {
  slug: "body-systems",
  title: "Body systems",
  short: "Body systems",
  subject: "Science",
  ages: "11 to 14",
  emoji: "🫀",
  color: "#8A4F57",
  summary: "Six lessons on the skeleton and joints, muscles working in antagonistic pairs, the digestive system and enzymes, breathing and gas exchange, the heart and blood vessels, and how the body's systems work together during exercise.",
  cover: "/lessons/units/body-systems.jpg",
  lessons: [
    {
      slug: "body-systems-1",
      title: "The skeleton and joints",
      emoji: "🦴",
      minutes: 60,
      goal: "I can describe the four main functions of the skeleton and explain how different types of joint allow different movements.",
      starter: [
        { type: "choice", q: "What is the skeleton mainly made of?", options: ["Muscle", "Bone", "Skin"], answer: 1 },
        { type: "choice", q: "Which organ does the skull protect?", options: ["The heart", "The lungs", "The brain"], answer: 2 },
        { type: "pick", q: "Which of these animals have a skeleton inside their body? There is more than one.", options: ["A cat", "A snail", "A frog", "A salmon"], answers: [0, 2, 3] },
        { type: "choice", q: "What are the bones that form a cage around your heart and lungs called?", options: ["The ribs", "The spine", "The pelvis"], answer: 0 },
        { type: "type", q: "What is the name of the column of bones running down the middle of your back?", answer: ["spine", "the spine", "backbone", "spinal column", "vertebral column"] },
        { type: "choice", q: "Which helps you stay healthy as you grow?", options: ["Eating only one type of food", "A balanced diet and regular exercise", "Sitting still as much as possible"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What the skeleton does",
            text: [
              "An adult human skeleton has 206 bones. A newborn baby has around 300 pieces of bone and cartilage, and many of these fuse together as the child grows. The skeleton is not just a frame: it is living tissue with its own blood supply, nerves and cells that constantly break down old bone and build new bone.",
              "Biologists describe four main functions of the skeleton. First, support: it holds the body upright and gives it shape. Second, protection: the skull surrounds the brain, the ribs guard the heart and lungs, and the vertebrae of the spine enclose the spinal cord. Third, movement: muscles are attached to bones, and when muscles pull, bones move at joints.",
              "The fourth function is making blood cells. Inside some bones, such as the femur (thigh bone), the pelvis and the sternum (breastbone), there is a soft tissue called red bone marrow. It produces red blood cells, white blood cells and platelets, millions every second.",
              "Bone is strong because it combines a hard mineral, mostly calcium phosphate, with a flexible protein called collagen. The mineral resists squashing and the collagen stops bone from being brittle. This is why a diet with enough calcium and vitamin D matters while bones are growing.",
            ],
          },
          {
            heading: "Types of joint",
            text: [
              "A joint is a place where two or more bones meet. Different joints allow different amounts and directions of movement, and their shape explains why.",
              "Hinge joints, such as the elbow and knee, work like the hinge of a door: they let the bones move back and forth in one plane only. Ball and socket joints, found at the shoulder and hip, have a rounded end of one bone sitting in a cup-shaped hollow in another. They allow movement in almost every direction, including rotation. The shoulder's socket is shallow, giving a huge range of movement but making it easier to dislocate; the hip's socket is deep, making it more stable.",
              "Some joints allow little or no movement. The bones of the skull are joined by fixed joints called sutures. The vertebrae of the spine are separated by discs of cartilage that allow a small amount of movement each, which adds up to a flexible back.",
            ],
          },
          {
            heading: "Inside a moving joint",
            text: [
              "Most of the joints we move freely are synovial joints. They have several parts that work together to let bones move smoothly without wearing away.",
              "The ends of the bones are covered in cartilage, a smooth, tough and slightly squashy tissue that reduces friction and absorbs shock. Between them is synovial fluid, an oily liquid that lubricates the joint, held in by a membrane.",
              "Bones are held together at a joint by ligaments: strong, slightly stretchy bands of tissue. Muscles are attached to bones by tendons, which are tough and do not stretch much, so the pull of a muscle is passed straight to the bone. A useful way to remember: ligaments link bone to bone; tendons tie muscle to bone.",
              "When cartilage wears away over many years, bone can rub on bone, causing pain and stiffness. This condition, osteoarthritis, is common in older people, and badly affected hips and knees can be replaced with artificial joints made of metal, plastic or ceramic.",
            ],
          },
        ],
        words: [
          { word: "bone marrow", meaning: "soft tissue inside some bones; red marrow makes blood cells" },
          { word: "joint", meaning: "a place where two or more bones meet" },
          { word: "hinge joint", meaning: "a joint that allows movement back and forth in one plane, like the elbow or knee" },
          { word: "ball and socket joint", meaning: "a joint where a rounded bone end sits in a cup, allowing movement in many directions, like the hip or shoulder" },
          { word: "ligament", meaning: "a strong band of tissue that holds bones together at a joint" },
          { word: "tendon", meaning: "a tough cord of tissue that attaches a muscle to a bone" },
        ],
      },
      practice: {
        intro: "Functions of the skeleton and how joints work.",
        questions: [
          {
            type: "match",
            q: "Match each bone or set of bones to what it protects.",
            pairs: [["Skull", "Brain"], ["Ribs", "Heart and lungs"], ["Vertebrae", "Spinal cord"]],
          },
          {
            type: "pick",
            q: "Which are functions of the skeleton? There is more than one.",
            options: ["Support", "Digesting food", "Protection", "Making blood cells", "Movement"],
            answers: [0, 2, 3, 4],
          },
          {
            type: "choice",
            q: "Why does the shoulder allow a greater range of movement than the elbow?",
            options: ["The shoulder has more muscles attached to it", "The shoulder is a ball and socket joint, the elbow is a hinge joint", "The shoulder has no ligaments"],
            answer: 1,
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "___ attach muscles to bones. ___ hold bones together. ___ covers the ends of bones and reduces friction.",
            bank: ["Tendons", "Ligaments", "Cartilage", "Marrow"],
            answers: ["Tendons", "Ligaments", "Cartilage"],
          },
          {
            type: "choice",
            q: "A tendon that stretched a lot would be a problem. Which best explains why?",
            options: ["The muscle's pull would not be passed fully to the bone", "The bone would stop making blood cells", "The joint would become fixed"],
            answer: 0,
          },
        ],
      },
      task: {
        title: "A joint survey",
        intro: "Investigate the joints in your own body, classify them by the movement they allow, and explain the link between structure and function.",
        need: ["Paper and a pencil", "A ruler", "Optional: a cooked chicken wing or leg bone, cleaned, from a meal"],
        steps: [
          "Draw a table with four columns: Joint, Movements possible, Type of joint, Example of an everyday action that uses it.",
          "Test at least eight joints: shoulder, elbow, wrist, knuckles, hip, knee, ankle and neck. For each one, try bending, straightening, moving side to side and rotating. Record what is possible.",
          "Classify each joint as hinge, ball and socket, or 'other'. The wrist, ankle and neck are not simple hinges, so describe what you notice about them.",
          "Optional: if a grown-up agrees, look closely at a cleaned chicken bone left over from a meal. Find the smooth, shiny cartilage at the end and any tough white tendons. Wash your hands well afterwards.",
          "Write a paragraph explaining why a hinge joint is a better design for the knee, which carries your weight, than a ball and socket joint would be.",
        ],
      },
      exit: [
        { type: "type", q: "How many bones are there in a typical adult human skeleton?", answer: ["206"] },
        { type: "choice", q: "Where in the body are blood cells made?", options: ["In the cartilage", "In the ligaments", "In the red bone marrow"], answer: 2 },
        {
          type: "match",
          q: "Match each joint to its type.",
          pairs: [["Hip", "Ball and socket"], ["Knee", "Hinge"], ["Skull", "Fixed"]],
        },
        { type: "choice", q: "What attaches a muscle to a bone?", options: ["A tendon", "A ligament", "Synovial fluid"], answer: 0 },
        { type: "choice", q: "What is the job of synovial fluid?", options: ["To make bones harder", "To lubricate the joint so bones move smoothly", "To carry oxygen to the bone"], answer: 1 },
        {
          type: "choice",
          q: "The hip has a deep socket and the shoulder a shallow one. Which statement is supported by this?",
          options: ["The shoulder is less likely to dislocate than the hip", "The hip and shoulder allow exactly the same movements", "The hip is more stable but the shoulder has a greater range of movement"],
          answer: 2,
        },
      ],
      grownUp: {
        need: ["Paper, pencil and ruler", "Optional: a cleaned, cooked chicken bone from a meal"],
        tips: [
          "Chicken bones are a good look at real cartilage and tendons, but only use cooked bones from a meal, and make sure hands and surfaces are washed afterwards. Never use raw chicken.",
          "The numbers 206 (adult) and about 300 (newborn) are standard textbook figures; the newborn figure varies by source because it depends on how cartilage pieces are counted.",
          "Learners often mix up ligaments and tendons. The memory hook 'ligaments link bone to bone' helps.",
        ],
        younger: "Focus on two joint types only. Bend an elbow and swing an arm round at the shoulder, and talk about a door hinge versus a joystick.",
        older: "Research how an artificial hip replacement is designed and which materials are used, and explain why each material was chosen for its properties.",
      },
    },
    {
      slug: "body-systems-2",
      title: "Muscles in antagonistic pairs",
      emoji: "💪",
      minutes: 60,
      goal: "I can explain how muscles contract and relax in antagonistic pairs to move bones at joints, and name the three types of muscle tissue.",
      starter: [
        { type: "choice", q: "What attaches a muscle to a bone?", options: ["A ligament", "A tendon", "Cartilage"], answer: 1 },
        { type: "choice", q: "What type of joint is the elbow?", options: ["Hinge", "Ball and socket", "Fixed"], answer: 0 },
        { type: "pick", q: "Which are functions of the skeleton? There is more than one.", options: ["Protection", "Making blood cells", "Absorbing food", "Support"], answers: [0, 1, 3] },
        { type: "type", q: "What holds bones together at a joint?", answer: ["ligament", "ligaments", "a ligament"] },
        { type: "choice", q: "What does cartilage at the end of bones do?", options: ["Makes red blood cells", "Attaches muscle to bone", "Reduces friction and absorbs shock"], answer: 2 },
        { type: "choice", q: "Which is a ball and socket joint?", options: ["The knee", "The shoulder", "The joints of the skull"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Muscles can only pull",
            text: [
              "Skeletal muscles are made of long cells called muscle fibres, bundled together. When a muscle receives a signal from a nerve, its fibres contract: they get shorter and fatter, and the muscle pulls on the tendon attached to the bone.",
              "When the signal stops, the muscle relaxes. It does not push; it simply stops pulling and can be stretched back to its original length. This is the key idea of the lesson: muscles can only pull, never push.",
              "Contracting needs energy, which muscle cells release from glucose by respiration. That is why active muscles need a good supply of blood bringing glucose and oxygen, and why they get warm: some of the energy is transferred to the surroundings by heating.",
            ],
          },
          {
            heading: "Antagonistic pairs",
            text: [
              "Because a muscle can only pull in one direction, moving a bone back again needs a second muscle pulling the opposite way. Two muscles that work against each other at a joint are called an antagonistic pair.",
              "The classic example is the upper arm. The biceps, on the front, is attached to the forearm below the elbow. When the biceps contracts, it pulls the forearm up and the arm bends. At the same time the triceps, on the back of the upper arm, relaxes.",
              "To straighten the arm, the triceps contracts and pulls the forearm down, while the biceps relaxes. So in every movement one muscle is contracting and its partner is relaxing.",
              "The legs work the same way. The quadriceps on the front of the thigh straighten the knee, and the hamstrings on the back bend it. The muscle doing the main work in a movement is sometimes called the agonist and the relaxing one the antagonist; they swap roles when the movement reverses.",
            ],
          },
          {
            heading: "Three types of muscle",
            text: [
              "Skeletal muscle is attached to bones and moves the skeleton. It is under voluntary control: you decide when to use it. It can contract strongly and quickly but tires with long use.",
              "Smooth muscle is found in the walls of organs such as the stomach, intestines, bladder and blood vessels. It contracts slowly and automatically, without you thinking about it. In the gut, waves of smooth muscle contraction called peristalsis push food along.",
              "Cardiac muscle is found only in the heart. It contracts rhythmically, around 60 to 100 times a minute at rest, for your whole life, and does not tire in the way skeletal muscle does.",
              "Muscles can be trained. Regular exercise makes skeletal muscle fibres larger and stronger, and improves the blood supply to them, so they can work for longer before tiring.",
            ],
          },
        ],
        words: [
          { word: "contract", meaning: "when a muscle shortens and pulls on a bone" },
          { word: "relax", meaning: "when a muscle stops pulling and can be stretched back to its full length" },
          { word: "antagonistic pair", meaning: "two muscles that work against each other at a joint, so one contracts while the other relaxes" },
          { word: "biceps", meaning: "the muscle on the front of the upper arm that bends the elbow" },
          { word: "triceps", meaning: "the muscle on the back of the upper arm that straightens the elbow" },
          { word: "voluntary", meaning: "under your conscious control, like skeletal muscle" },
        ],
      },
      practice: {
        intro: "Contracting, relaxing and pairs of muscles.",
        questions: [
          {
            type: "choice",
            q: "You bend your arm to lift a cup. What are the biceps and triceps doing?",
            options: ["Both contracting", "Biceps contracting, triceps relaxing", "Biceps relaxing, triceps contracting"],
            answer: 1,
          },
          {
            type: "choice",
            q: "Why do muscles need to work in pairs?",
            options: ["A muscle can only pull, so another muscle is needed to pull the bone back", "One muscle would get too tired on its own", "Muscles are too weak to move a bone alone"],
            answer: 0,
          },
          {
            type: "match",
            q: "Match each type of muscle to where it is found.",
            pairs: [["Skeletal muscle", "Attached to bones"], ["Smooth muscle", "Walls of the stomach and intestines"], ["Cardiac muscle", "The heart"]],
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "To straighten the knee, the ___ contract and the ___ relax.",
            bank: ["quadriceps", "hamstrings", "biceps", "triceps"],
            answers: ["quadriceps", "hamstrings"],
          },
          {
            type: "pick",
            q: "Which statements about a contracting muscle are true? There is more than one.",
            options: ["It gets shorter", "It pushes the bone away", "It needs energy from respiration", "It pulls on a tendon"],
            answers: [0, 2, 3],
          },
        ],
      },
      task: {
        title: "Build a model arm",
        intro: "Make a working model of the arm to show how an antagonistic pair moves the forearm, then use it to explain what each muscle does.",
        need: ["Thin card, such as a cereal box", "A paper fastener (split pin)", "Two pieces of string or wool, each about 40 cm", "Sticky tape", "Scissors (ask a grown-up first)", "A hole punch or a sharp pencil"],
        steps: [
          "Cut two strips of card about 20 cm by 4 cm. One is the upper arm (humerus), the other the forearm (radius and ulna).",
          "Overlap the ends by 2 cm, make a hole through both and join them with the paper fastener. This is the elbow, a hinge joint.",
          "Tape one end of a string to the front of the upper arm near the shoulder end, then run it down and tape it to the front of the forearm just below the elbow. This is the biceps. Tape the second string along the back in the same way, fixing it just past the elbow on the forearm. This is the triceps.",
          "Hold the upper arm still. Pull the biceps string gently: what happens? Now pull the triceps string. Notice that you can only make each 'muscle' work by pulling, never by pushing.",
          "Draw a labelled diagram of your model in each position. Add arrows and write which muscle is contracting and which is relaxing.",
          "Write three sentences explaining one way your model is like a real arm and two ways it is different (think about what real muscles look like and how they get shorter).",
        ],
      },
      exit: [
        { type: "choice", q: "What happens to a muscle when it contracts?", options: ["It gets shorter and pulls", "It gets longer and pushes", "It stays the same length"], answer: 0 },
        { type: "type", q: "What is the name for two muscles that work against each other at a joint?", answer: ["antagonistic pair", "an antagonistic pair", "antagonistic pairs", "antagonistic muscles"] },
        {
          type: "choice",
          q: "Which muscle contracts to straighten the arm at the elbow?",
          options: ["Biceps", "Hamstrings", "Triceps"],
          answer: 2,
        },
        { type: "choice", q: "Which type of muscle is under voluntary control?", options: ["Cardiac", "Skeletal", "Smooth"], answer: 1 },
        { type: "choice", q: "What is peristalsis?", options: ["Waves of smooth muscle contraction that push food through the gut", "The heart's regular beat", "A muscle relaxing after exercise"], answer: 0 },
        {
          type: "choice",
          q: "A student says 'the triceps pushes the arm straight'. Which best explains what is wrong with this?",
          options: ["The biceps straightens the arm", "Muscles cannot push; the triceps contracts and pulls the forearm", "The triceps is not attached to the forearm"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Thin card, a paper fastener, string or wool, tape", "Scissors and a hole punch or sharp pencil"],
        tips: [
          "Supervise or help with scissors and with pushing a hole through the card.",
          "The most common misconception is that muscles push. Ask your teenager to feel their upper arm while bending and straightening it: the biceps hardens and bulges as it contracts.",
          "If the model arm flops, a second paper fastener or a stiffer card for the upper arm helps.",
        ],
        younger: "Feel the biceps and triceps while bending and straightening the arm, and say aloud which one is 'working' each time before building the model.",
        older: "Research how the forearm and upper arm act as a lever, with the elbow as the pivot, and explain why the biceps must pull with a much larger force than the weight held in the hand.",
      },
    },
    {
      slug: "body-systems-3",
      title: "Digestion and enzymes",
      emoji: "🍽️",
      minutes: 60,
      goal: "I can describe the journey of food through the digestive system and explain how enzymes break large food molecules into small ones that can be absorbed.",
      starter: [
        { type: "choice", q: "What do muscles do when they contract?", options: ["Push", "Get longer", "Shorten and pull"], answer: 2 },
        { type: "choice", q: "Which muscle bends the arm at the elbow?", options: ["Biceps", "Triceps", "Quadriceps"], answer: 0 },
        { type: "match", q: "Match each muscle type to where it is found.", pairs: [["Cardiac", "Heart"], ["Smooth", "Gut wall"], ["Skeletal", "Attached to bones"]] },
        { type: "type", q: "What is the name for the waves of muscle contraction that push food along the gut?", answer: ["peristalsis"] },
        { type: "choice", q: "In an antagonistic pair, what is the second muscle doing when the first contracts?", options: ["Also contracting", "Relaxing", "Pushing"], answer: 1 },
        { type: "choice", q: "Where do muscles get the energy they need to contract?", options: ["From respiration of glucose", "From the bones", "From the air directly"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Why we digest food",
            text: [
              "Much of the food we eat is made of large, insoluble molecules: starch (a carbohydrate), proteins and lipids (fats and oils). These molecules are far too big to pass through the wall of the gut into the blood.",
              "Digestion is the process of breaking these large molecules into small, soluble ones. Starch is broken down into sugars such as glucose. Proteins are broken into amino acids. Lipids are broken into fatty acids and glycerol.",
              "Digestion happens in two ways. Mechanical digestion is physical: teeth chew food into smaller pieces and the stomach churns it, increasing the surface area. Chemical digestion uses enzymes to break the bonds inside the molecules themselves.",
              "Once food molecules are small enough, they are absorbed into the blood and carried to cells all over the body, where they are used for energy, growth and repair.",
            ],
          },
          {
            heading: "The journey through the gut",
            text: [
              "In the mouth, teeth break food up and saliva moistens it. Saliva contains an enzyme, amylase, which starts digesting starch. The tongue rolls the food into a ball, which is swallowed down the oesophagus (gullet), pushed along by peristalsis.",
              "The stomach is a muscular bag that churns food with gastric juice. This contains hydrochloric acid, which kills most bacteria in food and gives the right conditions for a protease enzyme that starts digesting protein.",
              "The small intestine, about 6 metres long when relaxed, is where most digestion and absorption happens. The pancreas releases more enzymes into it, and the liver makes bile, stored in the gall bladder, which breaks fats into tiny droplets and neutralises stomach acid. The inner wall is covered in millions of finger-like villi, giving a huge surface area, a thin wall and a rich blood supply so small molecules can be absorbed quickly.",
              "What is left, mostly water and fibre that we cannot digest, passes into the large intestine. Here much of the water is absorbed back into the body. The remaining waste, faeces, is stored in the rectum and leaves through the anus.",
            ],
          },
          {
            heading: "Enzymes: biological catalysts",
            text: [
              "Enzymes are proteins that act as biological catalysts: they speed up chemical reactions without being used up. Without digestive enzymes, breaking down a meal would take far too long to keep us alive.",
              "Each enzyme has a special shape with a region called the active site. Only a molecule with the matching shape, the substrate, fits into it, rather like a key in a lock. This means each enzyme works on just one kind of substance.",
              "Carbohydrases such as amylase break starch into sugars. Proteases break proteins into amino acids. Lipases break lipids into fatty acids and glycerol.",
              "Enzymes work best at a particular temperature and pH. Human enzymes work best at about 37 °C, body temperature. If they get too hot, the active site changes shape permanently and the enzyme stops working. This is called denaturing.",
            ],
          },
        ],
        words: [
          { word: "digestion", meaning: "breaking large, insoluble food molecules into small, soluble molecules that can be absorbed" },
          { word: "enzyme", meaning: "a protein that speeds up a chemical reaction in living things without being used up" },
          { word: "amylase", meaning: "a carbohydrase enzyme in saliva and the small intestine that breaks starch into sugars" },
          { word: "protease", meaning: "an enzyme that breaks proteins into amino acids" },
          { word: "villi", meaning: "tiny finger-like folds lining the small intestine that give a large surface area for absorption" },
          { word: "denatured", meaning: "describes an enzyme whose active site has changed shape, for example by heating, so it no longer works" },
        ],
      },
      practice: {
        intro: "Organs, enzymes and the products of digestion.",
        questions: [
          {
            type: "order",
            q: "Put these parts of the digestive system in the order food passes through them.",
            items: ["Mouth", "Oesophagus", "Stomach", "Small intestine", "Large intestine", "Rectum"],
          },
          {
            type: "match",
            q: "Match each enzyme to the product it makes.",
            pairs: [["Amylase", "Sugars"], ["Protease", "Amino acids"], ["Lipase", "Fatty acids and glycerol"]],
          },
          {
            type: "choice",
            q: "Which best explains why the small intestine is good at absorbing food molecules?",
            options: ["It contains strong acid", "It has villi giving a large surface area, a thin wall and a good blood supply", "It is the first part of the gut food reaches"],
            answer: 1,
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "Bile is made in the ___ and stored in the ___. Most water is absorbed in the ___.",
            bank: ["liver", "gall bladder", "large intestine", "stomach", "mouth"],
            answers: ["liver", "gall bladder", "large intestine"],
          },
          {
            type: "choice",
            q: "Why does an enzyme only work on one type of substance?",
            options: ["Its active site only fits molecules of one shape", "It is used up after one reaction", "It only works in the stomach"],
            answer: 0,
          },
        ],
      },
      task: {
        title: "Enzymes at work in the kitchen",
        intro: "Carry out two simple investigations into enzymes: amylase in your saliva, and a protease found in fresh pineapple. Write each up like a scientist.",
        need: ["A plain cracker or a small piece of white bread", "A timer", "A packet of jelly made with gelatine (not a vegetarian agar jelly)", "Fresh pineapple and tinned pineapple (a few small pieces of each)", "Three small cups or ramekins, labelled", "A kettle, a jug and a spoon (a grown-up handles the hot water)"],
        steps: [
          "Saliva test: put a piece of plain cracker in your mouth and chew it slowly without swallowing for about one minute. Note how the taste changes. Explain your observation using the words amylase, starch and sugar.",
          "Jelly test: ask a grown-up to make up the jelly with hot water as the packet says, then let it cool a little. Pour it into three cups.",
          "Put a few pieces of fresh pineapple in cup A, the same amount of tinned pineapple in cup B, and nothing in cup C. Cup C is your control.",
          "Before you put them in the fridge, write a prediction for each cup. Gelatine is a protein, and fresh pineapple contains a protease called bromelain.",
          "After a few hours, check which cups have set. Record your results in a table.",
          "Write a conclusion: explain the result in cup A, then explain why tinned pineapple behaves differently. (Hint: tinned fruit is heated during canning. What happens to an enzyme when it is heated?)",
        ],
      },
      exit: [
        { type: "choice", q: "What is an enzyme?", options: ["A type of sugar", "A biological catalyst that speeds up reactions", "An organ of the digestive system"], answer: 1 },
        { type: "choice", q: "What are proteins broken down into?", options: ["Glucose", "Fatty acids and glycerol", "Amino acids"], answer: 2 },
        { type: "type", q: "Which enzyme in saliva starts the digestion of starch?", answer: ["amylase", "salivary amylase"] },
        {
          type: "choice",
          q: "In which organ does most absorption of digested food into the blood take place?",
          options: ["The small intestine", "The stomach", "The large intestine"],
          answer: 0,
        },
        {
          type: "pick",
          q: "Which statements about the stomach are true? There is more than one.",
          options: ["It contains hydrochloric acid", "It absorbs most of the water from food", "Its acid kills many bacteria", "It churns food with muscular walls"],
          answers: [0, 2, 3],
        },
        {
          type: "choice",
          q: "Fresh pineapple stops gelatine jelly setting but tinned pineapple does not. Which best explains this?",
          options: ["Tinned pineapple contains more sugar", "Heating during canning denatures the protease in the pineapple", "Fresh pineapple is colder"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Plain crackers or white bread", "Gelatine jelly, fresh and tinned pineapple, three cups", "A kettle (adult use only)"],
        tips: [
          "Please handle the boiling water for the jelly yourself and let it cool before your teenager pours it.",
          "The jelly must contain gelatine (an animal protein). Vegetarian jellies set with agar, a carbohydrate, so the pineapple protease will not affect them. If your family avoids gelatine, the cracker test alone still shows an enzyme at work.",
          "Kiwi fruit and papaya also contain proteases and give the same result as fresh pineapple, if you want to extend the investigation.",
          "Bodily topics such as faeces are covered matter-of-factly; there is no need to dwell on them.",
        ],
        younger: "Do just the cracker test and talk about how the taste changes, then trace the path of food through the body with a finger on a diagram.",
        older: "Research how temperature affects the rate of an enzyme-controlled reaction, sketch the shape of the graph, and explain it using the words active site, collisions and denature.",
      },
    },
    {
      slug: "body-systems-4",
      title: "Breathing and gas exchange",
      emoji: "🫁",
      minutes: 60,
      goal: "I can describe the structure of the respiratory system, explain how breathing moves air in and out, and explain how the alveoli are adapted for gas exchange.",
      starter: [
        { type: "choice", q: "What does an enzyme do?", options: ["Speeds up a reaction without being used up", "Stores food", "Carries oxygen"], answer: 0 },
        { type: "match", q: "Match each enzyme to what it breaks down.", pairs: [["Amylase", "Starch"], ["Protease", "Protein"], ["Lipase", "Fats and oils"]] },
        { type: "choice", q: "Where are most digested food molecules absorbed?", options: ["The stomach", "The small intestine", "The oesophagus"], answer: 1 },
        { type: "type", q: "What is the name of the finger-like folds lining the small intestine?", answer: ["villi", "villus"] },
        { type: "choice", q: "What happens to an enzyme if it is heated too much?", options: ["It works faster forever", "It turns into sugar", "It is denatured and stops working"], answer: 2 },
        { type: "choice", q: "What is the main job of the large intestine?", options: ["Absorbing water", "Making bile", "Digesting protein"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "The respiratory system",
            text: [
              "Air enters through the nose or mouth. In the nose, hairs and sticky mucus trap dust and microbes, and the air is warmed and moistened. It then passes down the trachea (windpipe), a tube held open by C-shaped rings of cartilage.",
              "The trachea divides into two bronchi, one to each lung. Each bronchus branches again and again into thousands of narrower tubes called bronchioles. At the end of the bronchioles are clusters of tiny air sacs called alveoli. Adult lungs contain several hundred million of them.",
              "The lungs sit inside the chest cavity, protected by the ribs. Between the ribs are the intercostal muscles, and under the lungs is a dome-shaped sheet of muscle called the diaphragm, which separates the chest from the abdomen.",
              "Breathing and respiration are not the same thing. Breathing (ventilation) is moving air in and out of the lungs. Respiration is the chemical reaction in every cell that releases energy from glucose: glucose + oxygen → carbon dioxide + water.",
            ],
          },
          {
            heading: "How breathing works",
            text: [
              "Breathing works by changing the volume of the chest, which changes the pressure inside it. Air always moves from a region of higher pressure to a region of lower pressure.",
              "Breathing in (inhaling): the intercostal muscles contract, pulling the ribs up and out. The diaphragm contracts and flattens. The volume of the chest increases, so the pressure inside falls below the air pressure outside, and air rushes into the lungs.",
              "Breathing out (exhaling): the intercostal muscles relax and the ribs move down and in. The diaphragm relaxes and moves back up into its dome shape. The volume of the chest decreases, the pressure inside rises above the pressure outside, and air is pushed out.",
              "Scientists often model this with a bell jar or a plastic bottle, with balloons as lungs and a rubber sheet as the diaphragm. Models are useful but limited: the model's 'chest wall' cannot move like real ribs, and real lungs are not two empty bags but spongy tissue full of tubes and air sacs.",
            ],
          },
          {
            heading: "Gas exchange in the alveoli",
            text: [
              "Each alveolus is surrounded by a network of tiny blood vessels called capillaries. Here oxygen moves from the air in the alveolus into the blood, and carbon dioxide moves from the blood into the alveolus to be breathed out.",
              "The gases move by diffusion: the overall movement of particles from a region of higher concentration to a region of lower concentration. Air in the alveoli has more oxygen than the blood arriving at the lungs, so oxygen diffuses in; the blood has more carbon dioxide than the air, so carbon dioxide diffuses out.",
              "The alveoli are adapted for fast diffusion. Together they have a huge surface area, roughly the size of a tennis court in an adult. Their walls, and the capillary walls, are only one cell thick, so gases travel a very short distance. They are moist, so gases dissolve. And a rich blood supply keeps carrying oxygen away and bringing carbon dioxide, keeping the concentration difference high.",
              "This is why the air you breathe out is different from the air you breathe in. Inhaled air is about 21% oxygen and 0.04% carbon dioxide; exhaled air is about 16% oxygen and 4% carbon dioxide, and it is warmer and contains more water vapour. Smoking damages the alveoli and the cilia that keep the airways clean, which is one reason it causes serious lung disease.",
            ],
          },
        ],
        words: [
          { word: "trachea", meaning: "the windpipe, a tube held open by rings of cartilage that carries air to the lungs" },
          { word: "bronchiole", meaning: "one of the many narrow branching tubes in the lungs that lead to the alveoli" },
          { word: "alveoli", meaning: "tiny air sacs in the lungs where gas exchange happens" },
          { word: "diaphragm", meaning: "a dome-shaped sheet of muscle under the lungs that contracts and flattens when you breathe in" },
          { word: "diffusion", meaning: "the overall movement of particles from a region of higher concentration to lower concentration" },
          { word: "gas exchange", meaning: "oxygen moving into the blood and carbon dioxide moving out, across the walls of the alveoli" },
        ],
      },
      practice: {
        intro: "The airways, breathing and gas exchange.",
        questions: [
          {
            type: "order",
            q: "Put these in the order air passes through them when you breathe in.",
            items: ["Nose or mouth", "Trachea", "Bronchus", "Bronchiole", "Alveolus"],
          },
          {
            type: "gap",
            q: "Fill in the gaps about breathing in.",
            text: "The intercostal muscles ___ and the ribs move up and out. The diaphragm contracts and ___. The volume of the chest ___ and air moves in.",
            bank: ["contract", "flattens", "increases", "relax", "decreases", "domes"],
            answers: ["contract", "flattens", "increases"],
          },
          {
            type: "pick",
            q: "Which features help the alveoli carry out gas exchange quickly? There is more than one.",
            options: ["Walls one cell thick", "A large surface area", "Rings of cartilage", "A rich blood supply", "A moist surface"],
            answers: [0, 1, 3, 4],
          },
          {
            type: "choice",
            q: "Why does oxygen diffuse from the alveoli into the blood?",
            options: ["The blood pumps it in", "There is a higher concentration of oxygen in the alveoli than in the blood", "Oxygen is heavier than carbon dioxide"],
            answer: 1,
          },
          {
            type: "choice",
            q: "Which best describes the difference between breathing and respiration?",
            options: ["They are two words for the same process", "Respiration only happens in the lungs", "Breathing moves air in and out of the lungs; respiration releases energy from glucose in cells"],
            answer: 2,
          },
        ],
      },
      task: {
        title: "Measure your lung volume",
        intro: "Measure how much air you can breathe out in one breath (your vital capacity) by displacing water from an upturned bottle, then compare repeat readings.",
        need: ["A clean, empty 2-litre plastic drinks bottle with its lid", "A washing-up bowl or the kitchen sink", "A measuring jug", "A permanent marker", "A bendy straw or a length of clean flexible tubing (your own, not shared)", "A towel for drips"],
        steps: [
          "Calibrate the bottle: pour in 250 ml of water at a time from the jug and mark the level each time on the side of the bottle, up to 2 litres. Then fill it to the top.",
          "Half-fill the bowl with water. Put the lid on the full bottle, turn it upside down into the bowl, and take the lid off under the water so the bottle stays full. Ask someone to hold it steady.",
          "Push one end of the straw or tubing up into the neck of the bottle.",
          "Take the deepest breath you can, then breathe out steadily through the tube in one long breath. Air will push water out of the bottle. Read the volume of air from your marks.",
          "Refill the bottle and repeat twice more, resting in between. Record all three readings in a table and calculate the mean.",
          "Evaluate: why might your readings differ? Is your result an accurate measure of your whole lung volume? (Hint: some air always stays in the lungs.) If anyone else in the household takes part, give them their own straw and compare results.",
        ],
      },
      exit: [
        { type: "type", q: "What are the tiny air sacs in the lungs where gas exchange happens called?", answer: ["alveoli", "alveolus", "air sacs"] },
        { type: "choice", q: "What happens to the diaphragm when you breathe in?", options: ["It relaxes and domes upwards", "It contracts and flattens", "It does not move"], answer: 1 },
        { type: "choice", q: "By what process do oxygen and carbon dioxide move across the alveolus wall?", options: ["Diffusion", "Digestion", "Peristalsis"], answer: 0 },
        {
          type: "match",
          q: "Match each part to its feature.",
          pairs: [["Trachea", "Held open by rings of cartilage"], ["Alveoli", "Walls one cell thick"], ["Intercostal muscles", "Found between the ribs"]],
        },
        {
          type: "choice",
          q: "Exhaled air contains about how much carbon dioxide?",
          options: ["0.04%", "21%", "4%"],
          answer: 2,
        },
        {
          type: "choice",
          q: "When you breathe in, why does air move into the lungs?",
          options: ["The chest volume increases so the pressure inside falls below the pressure outside", "The lungs suck air in by themselves", "The alveoli push air in"],
          answer: 0,
        },
      ],
      grownUp: {
        need: ["A 2-litre plastic bottle, a washing-up bowl, a measuring jug", "A clean bendy straw or tubing for each person", "A permanent marker and a towel"],
        tips: [
          "Each person needs their own clean straw or tube. Don't share mouthpieces.",
          "If your teenager has asthma or any breathing condition, the lung volume task is usually fine at a gentle pace, but they should stop if they feel dizzy or short of breath. Use their own judgement and any medical advice you've been given.",
          "Lung volume measured this way is usually 2 to 4 litres for this age, and a 2-litre bottle may overflow. That's a useful talking point about the limits of the equipment: two bottles, or a bigger container, can fix it.",
          "The lesson mentions smoking factually as damaging the lungs. It's a natural opening if your teenager wants to talk about it.",
        ],
        younger: "Place a hand on the ribs and another on the tummy while breathing slowly, and describe what moves in and what moves out. Then just do one lung volume reading.",
        older: "Research how emphysema or asthma affects gas exchange or airflow, and explain the effect using the adaptations of the alveoli from the lesson.",
      },
    },
    {
      slug: "body-systems-5",
      title: "The heart and blood vessels",
      emoji: "❤️",
      minutes: 60,
      goal: "I can describe the structure of the heart and the double circulation, and compare the structure and function of arteries, veins and capillaries.",
      starter: [
        { type: "choice", q: "Where in the lungs does gas exchange take place?", options: ["The trachea", "The alveoli", "The bronchi"], answer: 1 },
        { type: "choice", q: "What do the intercostal muscles do when you breathe in?", options: ["Contract and pull the ribs up and out", "Relax and let the ribs fall", "Push air out of the lungs"], answer: 0 },
        { type: "type", q: "Name the process by which oxygen moves from the alveoli into the blood.", answer: ["diffusion"] },
        { type: "pick", q: "Which are adaptations of the alveoli? There is more than one.", options: ["Large surface area", "Thick muscular walls", "Thin walls", "Good blood supply"], answers: [0, 2, 3] },
        { type: "choice", q: "Which gas is there more of in exhaled air than in inhaled air?", options: ["Oxygen", "Nitrogen", "Carbon dioxide"], answer: 2 },
        { type: "choice", q: "What is respiration?", options: ["Breathing air in and out", "A reaction in cells that releases energy from glucose", "Moving blood round the body"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The heart: a double pump",
            text: [
              "The heart is a muscular organ, about the size of your fist, made of cardiac muscle. Its job is to pump blood around the body, carrying oxygen and glucose to cells and taking carbon dioxide and other wastes away.",
              "The heart has four chambers. The two upper chambers are the atria (singular: atrium), which receive blood coming in. The two lower chambers are the ventricles, which pump blood out. A wall of muscle, the septum, separates the right side from the left.",
              "The right side of the heart receives deoxygenated blood from the body and pumps it to the lungs, where it picks up oxygen and gets rid of carbon dioxide. The left side receives the oxygenated blood back from the lungs and pumps it out to the rest of the body.",
              "Because blood passes through the heart twice on each complete trip round the body, humans have a double circulatory system. The wall of the left ventricle is much thicker than the right, because it has to pump blood all round the body rather than just to the lungs next door.",
            ],
          },
          {
            heading: "Valves and the route of blood",
            text: [
              "Valves inside the heart act like one-way doors. They open to let blood through when a chamber squeezes, then snap shut to stop it flowing backwards. The 'lub-dub' sound of a heartbeat is the sound of the valves closing.",
              "Follow the route: blood from the body enters the right atrium through the vena cava, a large vein. It passes into the right ventricle, which pumps it through the pulmonary artery to the lungs. Oxygenated blood returns through the pulmonary vein to the left atrium, flows into the left ventricle, and is pumped out through the aorta, the body's largest artery.",
              "Notice an important exception: the pulmonary artery carries deoxygenated blood and the pulmonary vein carries oxygenated blood. Arteries and veins are named by the direction they carry blood, not by how much oxygen it contains.",
              "Blood itself is made of plasma, a yellowish liquid carrying dissolved food, carbon dioxide and other substances; red blood cells, which contain haemoglobin to carry oxygen; white blood cells, which defend against disease; and platelets, which help blood clot.",
            ],
          },
          {
            heading: "Arteries, veins and capillaries",
            text: [
              "Arteries carry blood away from the heart. Blood in them is at high pressure, pulsing with each heartbeat, so arteries have thick walls with layers of muscle and elastic fibres that stretch and recoil. You can feel this surge as your pulse where an artery runs close to the skin, such as at the wrist or neck.",
              "Veins carry blood back towards the heart at low pressure. They have thinner walls and a wider space inside (the lumen). Many veins, especially in the legs, have valves to stop blood flowing backwards. Squeezing by nearby skeletal muscles helps push the blood along.",
              "Capillaries are the tiniest vessels, linking arteries to veins. Their walls are only one cell thick, so substances can diffuse easily between the blood and the body's cells: oxygen and glucose out to the cells, carbon dioxide and waste back into the blood. Every living cell is close to a capillary.",
              "The structure of each vessel fits its function. This idea, that structure is linked to function, is one of the biggest themes in biology, and you have now seen it in bones, joints, muscles, the gut, the lungs and the blood vessels.",
            ],
          },
        ],
        words: [
          { word: "atrium", meaning: "an upper chamber of the heart that receives blood (plural: atria)" },
          { word: "ventricle", meaning: "a lower chamber of the heart that pumps blood out" },
          { word: "valve", meaning: "a flap that lets blood flow one way only and stops it flowing backwards" },
          { word: "artery", meaning: "a thick-walled blood vessel that carries blood away from the heart at high pressure" },
          { word: "vein", meaning: "a thinner-walled blood vessel with valves that carries blood back to the heart at low pressure" },
          { word: "capillary", meaning: "a tiny blood vessel with walls one cell thick, where substances are exchanged with cells" },
        ],
      },
      practice: {
        intro: "The heart, the circulation and blood vessels.",
        questions: [
          {
            type: "order",
            q: "Put these in the order blood passes through them, starting from the body.",
            items: ["Vena cava", "Right atrium", "Right ventricle", "Pulmonary artery", "Lungs", "Pulmonary vein", "Left atrium", "Left ventricle", "Aorta"],
          },
          {
            type: "match",
            q: "Match each vessel to its key feature.",
            pairs: [["Artery", "Thick muscular, elastic wall"], ["Vein", "Valves and a wide lumen"], ["Capillary", "Wall one cell thick"]],
          },
          {
            type: "choice",
            q: "Why is the wall of the left ventricle thicker than the wall of the right ventricle?",
            options: ["It pumps blood all round the body, which needs more force", "It holds more blood", "It receives blood from the lungs"],
            answer: 0,
          },
          {
            type: "pick",
            q: "Which statements are true? There is more than one.",
            options: ["The pulmonary artery carries deoxygenated blood", "All arteries carry oxygenated blood", "Valves stop blood flowing backwards", "Red blood cells contain haemoglobin"],
            answers: [0, 2, 3],
          },
          {
            type: "choice",
            q: "Which evidence best supports the idea that veins carry blood at low pressure?",
            options: ["Veins look red", "Veins have thinner walls and need valves to stop backflow", "Veins are found in the arms"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Find your pulse and hear your heart",
        intro: "Measure your resting pulse accurately, make a simple stethoscope, and draw a labelled flow diagram of the double circulation.",
        need: ["A timer or a watch with a second hand", "A kitchen funnel and about 50 cm of clean plastic tubing, or a cardboard kitchen-roll tube", "Paper, pencil and coloured pens (red and blue)"],
        steps: [
          "Find your pulse: place two fingers (not your thumb, which has its own pulse) gently on the inside of your wrist, below the base of your thumb. Or try the side of your neck, just beside the windpipe; press gently.",
          "Sit still for two minutes. Count the beats for 30 seconds and multiply by 2 to get beats per minute. Repeat three times and calculate the mean.",
          "Make a stethoscope: push the tubing firmly onto the narrow end of the funnel. Hold the wide end on the left side of your chest (or someone's who agrees) and put the end of the tube to your ear, without pushing it in. A kitchen-roll tube held to the chest works too.",
          "Listen for the 'lub-dub'. Explain in a sentence what makes each sound.",
          "Draw a flow diagram of the double circulation: body, heart (right side), lungs, heart (left side), body. Colour oxygenated blood red and deoxygenated blood blue (real blood is always red, just darker when deoxygenated), and label the four chambers and four main vessels.",
        ],
      },
      exit: [
        { type: "choice", q: "Which chambers of the heart pump blood out of the heart?", options: ["The atria", "The ventricles", "The valves"], answer: 1 },
        { type: "choice", q: "What do arteries do?", options: ["Carry blood away from the heart", "Carry blood back to the heart", "Exchange substances with cells"], answer: 0 },
        { type: "type", q: "Which blood vessel carries oxygenated blood from the left ventricle to the body?", answer: ["aorta", "the aorta"] },
        {
          type: "choice",
          q: "Why do humans have a 'double' circulatory system?",
          options: ["They have two hearts", "Blood flows in two directions in each vessel", "Blood passes through the heart twice on one complete circuit"],
          answer: 2,
        },
        {
          type: "gap",
          q: "Fill in the gaps.",
          text: "Capillaries have walls one cell thick so substances can ___ easily. Veins have ___ to stop blood flowing backwards.",
          bank: ["diffuse", "valves", "cartilage", "contract"],
          answers: ["diffuse", "valves"],
        },
        {
          type: "choice",
          q: "Which part of the blood carries oxygen?",
          options: ["Platelets", "White blood cells", "Red blood cells"],
          answer: 2,
        },
      ],
      grownUp: {
        need: ["A timer", "A funnel and clean plastic tubing, or a kitchen-roll tube", "Red and blue pens"],
        tips: [
          "A resting heart rate of roughly 60 to 100 beats per minute is typical for this age; very fit young people can be lower. Don't be concerned by small differences, but if a reading seems unusual or your teenager feels unwell, speak to your GP rather than worrying over a home measurement.",
          "Remind your teenager not to push the tube into their ear, and to press gently on the neck pulse.",
          "Diagrams show deoxygenated blood in blue as a convention only; veins look blue through skin because of how light passes through it. Blood is never blue.",
        ],
        younger: "Focus on finding the pulse and on the simple loop: heart to lungs, back to heart, out to body. Use the stethoscope just to listen.",
        older: "Research coronary heart disease: what the coronary arteries do, what happens when they narrow, and how a stent works. Write a short, factual explanation.",
      },
    },
    {
      slug: "body-systems-6",
      title: "Systems working together in exercise",
      emoji: "🏃",
      minutes: 60,
      goal: "I can plan and carry out an investigation into how exercise affects pulse and breathing rate, and explain the results by linking the muscular, respiratory and circulatory systems.",
      starter: [
        { type: "choice", q: "Which side of the heart pumps blood to the lungs?", options: ["The right side", "The left side", "Both sides equally"], answer: 0 },
        { type: "choice", q: "Which vessels have valves and carry blood at low pressure?", options: ["Arteries", "Capillaries", "Veins"], answer: 2 },
        { type: "type", q: "What are the tiny blood vessels with walls one cell thick called?", answer: ["capillaries", "capillary"] },
        { type: "choice", q: "What can you feel when you take your pulse at the wrist?", options: ["Air moving in the lungs", "An artery stretching with each heartbeat", "A muscle contracting"], answer: 1 },
        { type: "match", q: "Match each part of the blood to its job.", pairs: [["Red blood cells", "Carry oxygen"], ["White blood cells", "Fight disease"], ["Platelets", "Help blood clot"]] },
        { type: "choice", q: "What makes the 'lub-dub' sound of the heart?", options: ["Valves closing", "Blood hitting the ribs", "Air in the lungs"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Why exercise changes your body",
            text: [
              "When you exercise, your skeletal muscles contract more often and more strongly. That takes more energy, which muscle cells release by respiration. So the rate of respiration in the muscles rises sharply.",
              "Aerobic respiration needs a steady supply of glucose and oxygen, and it produces carbon dioxide that must be removed: glucose + oxygen → carbon dioxide + water. Working muscles need much more oxygen and glucose delivered, and much more carbon dioxide taken away, than resting ones.",
              "No single system can manage this alone. The respiratory system brings in oxygen and gets rid of carbon dioxide. The circulatory system carries these gases, and glucose, between the lungs, gut and muscles. The muscular and skeletal systems produce the movement. They are controlled and coordinated by the nervous system.",
            ],
          },
          {
            heading: "Heart rate and breathing rate",
            text: [
              "During exercise your heart rate increases, and each beat pumps out more blood. This delivers oxygen and glucose to the muscles faster and removes carbon dioxide faster. Blood flow is also directed towards the working muscles and away from organs such as the gut.",
              "Your breathing rate increases and each breath gets deeper. More air reaches the alveoli each minute, so more oxygen diffuses into the blood and more carbon dioxide diffuses out.",
              "In very hard exercise, the heart and lungs cannot supply oxygen fast enough. Muscles then also use anaerobic respiration, which releases energy without oxygen: glucose → lactic acid. It releases much less energy than aerobic respiration, and lactic acid building up contributes to muscle fatigue.",
              "After exercise, heart rate and breathing rate stay high for a while. The extra oxygen taken in, sometimes called the oxygen debt, is used to break down lactic acid. The time taken to return to resting levels is the recovery time, and it is shorter in people who are fitter.",
            ],
          },
          {
            heading: "Investigating exercise like a scientist",
            text: [
              "A good investigation starts with a question, such as 'How does the length of time I exercise affect my pulse rate?' The variable you change is the independent variable (exercise time); the one you measure is the dependent variable (pulse rate).",
              "Everything else should be kept the same, so the test is fair. These are control variables: the type of exercise, how hard you work, the same person, the same method of measuring the pulse, and the same rest beforehand.",
              "Measurements of pulse and breathing vary naturally, so repeat each reading and calculate a mean. Look out for anomalous results that don't fit the pattern, and think about why they happened.",
              "Present results in a table with units in the headings, then draw a line graph with time on the x-axis and pulse rate on the y-axis. Your conclusion should describe the pattern using data and explain it using science: for example, why the pulse rose, and why it fell back afterwards.",
            ],
          },
        ],
        words: [
          { word: "aerobic respiration", meaning: "respiration using oxygen: glucose + oxygen → carbon dioxide + water, releasing energy" },
          { word: "anaerobic respiration", meaning: "respiration without oxygen; in muscles it turns glucose into lactic acid and releases less energy" },
          { word: "recovery time", meaning: "the time it takes for heart rate and breathing rate to return to resting levels after exercise" },
          { word: "independent variable", meaning: "the variable a scientist deliberately changes in an investigation" },
          { word: "dependent variable", meaning: "the variable a scientist measures in an investigation" },
          { word: "control variable", meaning: "a variable kept the same so that the test is fair" },
        ],
      },
      practice: {
        intro: "Linking the systems, and planning a fair investigation.",
        questions: [
          {
            type: "order",
            q: "Put these in order to explain why heart rate rises during exercise.",
            items: ["Muscles contract more", "Muscles need more energy", "Rate of respiration increases", "More oxygen and glucose are needed", "Heart beats faster to deliver more blood"],
          },
          {
            type: "match",
            q: "In an investigation into exercise time and pulse rate, match each variable to its type.",
            pairs: [["Exercise time", "Independent variable"], ["Pulse rate", "Dependent variable"], ["Type of exercise", "Control variable"]],
          },
          {
            type: "choice",
            q: "Why does breathing rate increase during exercise?",
            options: ["To cool the lungs down", "To take in more oxygen and remove more carbon dioxide", "To make the heart beat faster"],
            answer: 1,
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "In very hard exercise, muscles use ___ respiration, which produces ___ and releases less energy.",
            bank: ["anaerobic", "lactic acid", "aerobic", "oxygen"],
            answers: ["anaerobic", "lactic acid"],
          },
          {
            type: "choice",
            q: "A student's pulse readings after one minute of star jumps were 118, 121 and 156 beats per minute. What should they do?",
            options: ["Use 156 because it is the highest", "Treat 156 as anomalous, check it, and find the mean of the others or repeat", "Ignore all three readings"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Exercise investigation",
        intro: "Investigate how exercise affects your pulse rate and breathing rate, and how long you take to recover. Write it up in full: question, prediction, method, results, graph, conclusion and evaluation.",
        need: ["A timer or a phone stopwatch", "Space indoors or in a garden to do star jumps or step-ups safely", "A sturdy bottom stair or low step, if doing step-ups", "Paper and pencil, or a free spreadsheet in the browser for the graph"],
        steps: [
          "Write your question and a prediction with a scientific reason, for example: 'I predict my pulse will rise because...'",
          "Sit quietly for five minutes. Measure your resting pulse (beats in 30 seconds × 2) and your resting breathing rate (breaths in one minute; it is easier if someone else counts, as thinking about breathing changes it). Do this twice and find the means.",
          "Do one minute of steady exercise, such as star jumps or stepping up and down the bottom stair. Work at a pace you can keep up, not flat out.",
          "Immediately sit down and measure your pulse and breathing rate. Then measure them again every minute until they are back to your resting values. Record everything in a table with units.",
          "Draw a line graph of pulse rate against time, starting with your resting value. Mark where the exercise happened. Add breathing rate on a second graph, or on the same axes in a different colour.",
          "Write a conclusion that quotes data from your results and explains the pattern using the words respiration, oxygen, carbon dioxide, heart and lungs. Finish with an evaluation: what made your results less reliable, and how would you improve the method?",
        ],
      },
      exit: [
        { type: "choice", q: "What happens to heart rate during exercise?", options: ["It increases", "It decreases", "It stays the same"], answer: 0 },
        {
          type: "choice",
          q: "Why do working muscles need more oxygen?",
          options: ["To make lactic acid", "To store it for later", "For increased aerobic respiration to release more energy"],
          answer: 2,
        },
        { type: "type", q: "What substance builds up in muscles during anaerobic respiration?", answer: ["lactic acid"] },
        {
          type: "choice",
          q: "In an investigation, the variable you measure is called the...",
          options: ["Independent variable", "Dependent variable", "Control variable"],
          answer: 1,
        },
        {
          type: "pick",
          q: "Which systems work together to supply working muscles with oxygen? There is more than one.",
          options: ["Respiratory system", "Digestive system", "Circulatory system"],
          answers: [0, 2],
        },
        {
          type: "choice",
          q: "Two learners do the same exercise. Learner A recovers in 3 minutes, learner B in 7 minutes. Which conclusion is best supported?",
          options: ["Learner B has a stronger heart", "Learner A is probably fitter", "Both are equally fit"],
          answer: 1,
          why: "A shorter recovery time usually means a fitter person, whose heart and lungs return to resting levels more quickly. With only one test each, it's a likely conclusion rather than a certain one.",
        },
      ],
      grownUp: {
        need: ["A timer", "Safe space for star jumps or a sturdy bottom stair", "Optional: a computer with a free browser spreadsheet for graphs"],
        tips: [
          "Moderate exercise for one minute is safe for most healthy teenagers. If your teenager has a heart condition, asthma, an injury or any medical advice about exercise, check before they start and keep the exercise gentle. They should stop at once if they feel dizzy, faint, unwell or have chest pain.",
          "Keep the exercise steady rather than flat out; the point is a clear, repeatable change, not a test of fitness. Clear the space of trip hazards first.",
          "Counting breathing rate is easier for a second person, as people change their breathing when they think about it. If you can, be the counter.",
          "If they want to use a spreadsheet for the graph, free browser-based tools work well; check with you before signing up to anything.",
        ],
        younger: "Measure the pulse just three times: at rest, straight after exercise, and two minutes later. Talk through why it went up and came down.",
        older: "Repeat the investigation with three different exercise durations (for example 30, 60 and 90 seconds), plot all three recovery curves on one graph, and discuss whether the data support a clear relationship.",
      },
    },
  ],
};
