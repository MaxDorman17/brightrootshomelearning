import type { LessonUnit } from "@/lib/lessons";

/**
 * Tectonic hazards, for ages 11 to 14 (KS3 geography). The structure of the Earth, Wegener and plate tectonics, plate
 * boundaries, volcanoes, earthquakes, and a comparison of Japan 2011 and Haiti 2010. Disasters are handled calmly and
 * factually; models use kitchen and stationery items only.
 */
export const tectonicHazards: LessonUnit = {
  slug: "tectonic-hazards",
  title: "Tectonic hazards",
  short: "Tectonics",
  subject: "Geography",
  ages: "11 to 14",
  emoji: "🌋",
  color: "#8A5A44",
  summary: "Six lessons on the structure of the Earth, Wegener and the evidence for plate tectonics, plate boundaries, volcanoes and why people live near them, earthquakes and how they are measured, and a comparison of the 2011 Japan and 2010 Haiti earthquakes.",
  cover: "/lessons/units/tectonic-hazards.jpg",
  lessons: [
    {
      slug: "tectonic-hazards-1",
      title: "Inside the Earth",
      emoji: "🌍",
      minutes: 60,
      goal: "I can describe the layers of the Earth and explain how heat from the core drives convection currents that move the tectonic plates.",
      starter: [
        { type: "choice", q: "What is a volcano?", options: ["A mountain made entirely of ice", "An opening in the Earth's surface where molten rock, ash and gas escape", "A deep valley carved by a river"], answer: 1 },
        { type: "choice", q: "What is an earthquake?", options: ["A sudden shaking of the ground", "A very strong wind", "A huge wave caused by the Moon"], answer: 0 },
        { type: "pick", q: "Which of these are types of rock you may have learned about at primary school? There is more than one.", options: ["Igneous", "Sedimentary", "Metamorphic", "Magnetic"], answers: [0, 1, 2] },
        { type: "type", q: "What is the name for melted rock when it is underground?", answer: ["magma"] },
        { type: "choice", q: "Which statement about the Earth's surface is true?", options: ["It has stayed exactly the same since the Earth formed", "It only changes when people build on it", "It changes slowly over millions of years"], answer: 2 },
        { type: "choice", q: "Igneous rock forms when…", options: ["layers of sand are squashed together", "molten rock cools and hardens", "shells pile up on the sea bed"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The layers of the Earth",
            text: [
              "The Earth is about 6,370 kilometres from its surface to its centre, and it is made of layers, a little like the layers of a peach. On the outside is the crust, a thin skin of solid rock. Under the crust is the mantle, then the outer core, and at the very centre the inner core.",
              "The crust comes in two kinds. Continental crust, which makes up the land, is usually 30 to 50 kilometres thick and can reach about 70 kilometres under high mountains. It is old and relatively light (less dense). Oceanic crust, under the oceans, is only about 5 to 10 kilometres thick, but it is younger and denser, made mainly of a dark rock called basalt.",
              "The mantle is about 2,900 kilometres thick, making it by far the largest layer. It is made of hot rock. Most of it is solid, but it is so hot that over long periods of time it can flow very slowly, rather like extremely stiff toffee.",
              "The core is made mostly of iron and nickel. The outer core is liquid metal; its movement is thought to create the Earth's magnetic field. The inner core is solid, despite temperatures of around 5,000 to 6,000°C, because the enormous pressure of all the rock above stops the metal from melting.",
            ],
          },
          {
            heading: "How do we know what is inside?",
            text: [
              "Nobody has ever drilled through the crust. The deepest hole ever drilled, the Kola Superdeep Borehole in Russia, reached just over 12 kilometres, which is less than 0.2% of the way to the centre of the Earth.",
              "Instead, geologists use seismic waves, the vibrations that travel through the Earth after an earthquake. These waves change speed and direction when they pass from one material into another. Seismometers all over the world record when and where the waves arrive.",
              "One kind of wave, the S wave, cannot travel through liquids. Because S waves do not arrive on the far side of the Earth from a large earthquake, scientists worked out that part of the core must be liquid. This is a good example of how scientists use indirect evidence to understand something they cannot see.",
            ],
          },
          {
            heading: "Plates and convection currents",
            text: [
              "The crust and the rigid top part of the mantle together form the lithosphere. The lithosphere is broken into large pieces called tectonic plates, which fit together like a cracked eggshell. There are seven major plates, such as the Pacific Plate and the Eurasian Plate, and many smaller ones. The UK sits on the Eurasian Plate.",
              "Beneath the lithosphere is a softer, partly molten part of the upper mantle called the asthenosphere. The plates rest on it and move very slowly, usually a few centimetres a year, roughly the speed your fingernails grow.",
              "For a long time geographers explained this movement mainly through convection currents. Heat from the core warms the rock of the lower mantle. Hot rock is less dense, so it rises slowly; near the top it spreads out sideways, cools, becomes denser and sinks again. These slow circular currents drag on the plates above.",
              "Scientists now think two other forces are also very important. Slab pull happens where the cold, dense edge of a plate sinks into the mantle and pulls the rest of the plate behind it. Ridge push happens at mid-ocean ridges, where new, raised crust slides away downhill under its own weight. Together, these processes keep the plates on the move.",
            ],
          },
        ],
        words: [
          { word: "crust", meaning: "the thin, solid, outer layer of the Earth; continental crust is thicker and less dense than oceanic crust" },
          { word: "mantle", meaning: "the thickest layer of the Earth, made of hot rock that can flow very slowly" },
          { word: "core", meaning: "the centre of the Earth, made mostly of iron and nickel: a liquid outer core and a solid inner core" },
          { word: "lithosphere", meaning: "the crust and rigid upper mantle, broken into tectonic plates" },
          { word: "tectonic plate", meaning: "a large, rigid slab of the lithosphere that moves slowly over the mantle" },
          { word: "convection current", meaning: "a circular flow in which hot material rises, spreads, cools and sinks" },
        ],
      },
      practice: {
        intro: "Layers, evidence and moving plates.",
        questions: [
          { type: "order", q: "Put the layers in order from the surface to the centre.", items: ["Crust", "Mantle", "Outer core", "Inner core"] },
          {
            type: "match",
            q: "Match each layer to its description.",
            pairs: [
              ["Crust", "Thin, solid rock; 5 to 70 km thick"],
              ["Mantle", "Hot rock that flows very slowly; about 2,900 km thick"],
              ["Outer core", "Liquid iron and nickel"],
              ["Inner core", "Solid iron and nickel under huge pressure"],
            ],
          },
          {
            type: "choice",
            q: "Which of these best explains why the inner core is solid even though it is extremely hot?",
            options: ["It is made of ice", "The pressure is so great that the metal cannot melt", "It is cooled by the oceans", "It is much colder than the outer core"],
            answer: 1,
          },
          {
            type: "gap",
            q: "Fill in the gaps to describe a convection current.",
            text: "Rock heated by the core becomes less ___ and rises. Near the top of the mantle it spreads out, ___ and sinks again.",
            bank: ["dense", "cools", "heavy", "melts"],
            answers: ["dense", "cools"],
          },
          {
            type: "choice",
            q: "Which evidence suggests that part of the Earth's core is liquid?",
            options: ["Volcanoes erupt liquid lava", "The deepest borehole reached liquid rock", "S waves from large earthquakes do not pass through it", "The Earth spins once a day"],
            answer: 2,
            why: "S waves cannot travel through liquids, so the 'shadow' where they never arrive shows there is a liquid layer.",
          },
        ],
      },
      task: {
        title: "Model the Earth and a convection current",
        intro: "Build a scale diagram of the Earth's layers, then watch a convection current in action in a glass of water.",
        need: [
          "A large sheet of paper, a pencil, a ruler and string",
          "Coloured pencils",
          "A clear heatproof glass or jug of cold water",
          "A mug of hot (not boiling) water from the tap or kettle",
          "Food colouring and a teaspoon",
        ],
        steps: [
          "Scale diagram: let 1 cm stand for 100 km. The Earth's radius is about 6,370 km, so draw a circle (or a quarter circle, to save space) with a radius of 63.7 cm using a pencil tied to string. A quarter circle from one corner of the paper works well.",
          "The inner core has a radius of about 1,220 km and the outer core reaches out to about 3,480 km. Draw arcs at 12.2 cm and 34.8 cm from the centre.",
          "The mantle stretches from the outer core to the base of the crust, on average about 35 km below the surface. On your scale that is just 3.5 mm from the edge, so the crust is barely thicker than a pencil line! (Tape two sheets together if your paper is too small.) Colour and label each layer, and write one fact about each.",
          "Convection: stand the glass of cold water inside a bowl, then carefully lower the mug of hot water into the bowl so it warms one side of the glass. Ask an adult to help with the hot water.",
          "Drop one or two drops of food colouring gently into the water near the warm side. Watch closely for 3 to 5 minutes and sketch the path the colour takes.",
          "Write a paragraph explaining what you saw, using the words 'dense', 'rises', 'cools', 'sinks' and 'mantle'. Then explain one way your model is not like the real mantle.",
        ],
      },
      exit: [
        { type: "choice", q: "Which is the thickest layer of the Earth?", options: ["The crust", "The inner core", "The mantle"], answer: 2 },
        { type: "choice", q: "Compared with continental crust, oceanic crust is…", options: ["thinner and denser", "thicker and less dense", "the same thickness but older"], answer: 0 },
        { type: "type", q: "What name is given to the crust and rigid upper mantle together?", answer: ["lithosphere", "the lithosphere"] },
        { type: "pick", q: "Which processes help to move tectonic plates? There is more than one.", options: ["Convection currents in the mantle", "Slab pull", "Ocean tides", "Ridge push"], answers: [0, 1, 3] },
        { type: "choice", q: "What are the Earth's core layers made of?", options: ["Mostly granite", "Mostly iron and nickel", "Mostly water and ice"], answer: 1 },
        {
          type: "choice",
          q: "Why do geologists rely on seismic waves to study the inside of the Earth?",
          options: ["Seismic waves are easy to see with the naked eye", "No one has drilled beyond about 12 km, so direct samples are impossible", "Seismic waves only travel through the crust"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Large paper, string, ruler, coloured pencils", "A clear glass, a bowl, a mug of hot tap or kettle water, food colouring"],
        tips: [
          "Supervise the hot water in the convection demo; hot tap water is usually enough and avoids scald risk.",
          "A common misconception is that the mantle is a sea of liquid lava. It is mostly solid rock that flows extremely slowly. Gently challenge this if it comes up.",
          "The scale diagram is a powerful moment: the crust, where all life and all hazards happen, is thinner than a pencil line.",
        ],
        younger: "Use a peach or a hard-boiled egg cut in half to show crust (skin or shell), mantle (flesh or white) and core (stone or yolk). Focus on the four layer names and one fact for each.",
        older: "Research the Lehmann discontinuity: how did Inge Lehmann use P waves in 1936 to show that the inner core is solid? Write a short explanation of her reasoning.",
      },
    },
    {
      slug: "tectonic-hazards-2",
      title: "Wegener and moving continents",
      emoji: "🧩",
      minutes: 60,
      goal: "I can explain Wegener's theory of continental drift, evaluate his evidence, and explain how sea-floor spreading led to the theory of plate tectonics.",
      starter: [
        { type: "order", q: "Put the Earth's layers in order from the centre outwards.", items: ["Inner core", "Outer core", "Mantle", "Crust"] },
        { type: "choice", q: "Which layer of the Earth is liquid?", options: ["The inner core", "The crust", "The outer core"], answer: 2 },
        { type: "type", q: "What is the name for the large slabs that the lithosphere is broken into?", answer: ["tectonic plates", "plates", "tectonic plate"] },
        { type: "choice", q: "Roughly how fast do tectonic plates usually move?", options: ["A few centimetres a year", "A few metres a day", "A few kilometres a year"], answer: 0 },
        { type: "gap", q: "Fill in the gaps.", text: "In a convection current, hot rock ___ because it is less dense; cooler, denser rock ___.", bank: ["rises", "sinks", "melts", "freezes"], answers: ["rises", "sinks"] },
        { type: "choice", q: "Which plate is the UK on?", options: ["The Pacific Plate", "The Eurasian Plate", "The African Plate"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Alfred Wegener's big idea",
            text: [
              "In 1912 a German scientist called Alfred Wegener put forward a bold idea: the continents had once been joined together in one giant supercontinent, which he called Pangaea (meaning 'all lands'). Over millions of years, he argued, the continents had slowly drifted apart to where they are today. He called this continental drift and set it out in his book The Origin of Continents and Oceans in 1915.",
              "Wegener was a meteorologist and polar explorer, not a geologist, and his idea went against what most scientists believed at the time. Many thought the continents were fixed, and that similar animals on different continents had crossed long-lost 'land bridges' that had since sunk.",
              "We now know Pangaea existed from roughly 335 to 200 million years ago, before it began to break up. Wegener died on an expedition in Greenland in 1930, long before his central idea was accepted.",
            ],
          },
          {
            heading: "The evidence",
            text: [
              "The jigsaw fit: the east coast of South America and the west coast of Africa fit together remarkably well, especially if you use the edge of the continental shelf under the sea rather than the coastline.",
              "Fossils: remains of Mesosaurus, a small freshwater reptile, are found in both Brazil and southern Africa. It could not have swum across a salty ocean. Fossils of a fern-like plant called Glossopteris are found in South America, Africa, India, Australia and Antarctica.",
              "Rocks and mountains: rock types and mountain chains match up across oceans. For example, mountains in the Scottish Highlands and Scandinavia are made of the same rocks, formed at the same time, as the Appalachian Mountains of North America.",
              "Climate clues: there are coal deposits in Antarctica, which form from tropical swamp plants, and scratches left by ancient glaciers in hot countries such as India. These continents must once have been in very different positions on the globe.",
            ],
          },
          {
            heading: "From drift to plate tectonics",
            text: [
              "Wegener's evidence was strong, but his theory had one big weakness: he could not explain what force could move whole continents. His suggestions, such as the spin of the Earth, were shown to be far too weak, so most geologists rejected his idea for decades.",
              "After the Second World War, scientists mapped the ocean floor using sonar. They found an enormous underwater mountain range running down the middle of the Atlantic: the Mid-Atlantic Ridge. In 1962 the American geologist Harry Hess proposed sea-floor spreading: new crust forms at the ridges, where magma rises, and moves outwards on both sides.",
              "In 1963 Fred Vine and Drummond Matthews, working in Cambridge, provided the evidence. The Earth's magnetic field flips direction every so often, and as new basalt cools it records the direction of the field at that time. The ocean floor has matching stripes of magnetism on either side of the ridges, like a barcode mirrored down the middle, and the rocks get older the further they are from the ridge.",
              "By the late 1960s these ideas had been combined into the theory of plate tectonics, which is now accepted by nearly all geologists. It is a good example of how science works: an idea backed by evidence is tested, a missing piece is found, and an old theory is replaced.",
            ],
          },
        ],
        words: [
          { word: "continental drift", meaning: "Wegener's theory that the continents have slowly moved across the Earth's surface" },
          { word: "Pangaea", meaning: "the supercontinent that existed roughly 335 to 200 million years ago" },
          { word: "fossil", meaning: "the preserved remains or traces of an ancient living thing in rock" },
          { word: "sea-floor spreading", meaning: "the process in which new oceanic crust forms at a mid-ocean ridge and moves away on both sides" },
          { word: "mid-ocean ridge", meaning: "an underwater mountain range where plates move apart and new crust forms" },
          { word: "plate tectonics", meaning: "the theory that the lithosphere is split into plates that move, explaining earthquakes, volcanoes and mountains" },
        ],
      },
      practice: {
        intro: "Weighing up Wegener's evidence.",
        questions: [
          {
            type: "match",
            q: "Match each piece of evidence to the type of evidence it is.",
            pairs: [
              ["Mesosaurus remains in Brazil and southern Africa", "Fossil evidence"],
              ["South America and Africa fit together", "Jigsaw fit"],
              ["Coal found in Antarctica", "Climate evidence"],
              ["Matching rocks in Scotland and the Appalachians", "Geological evidence"],
            ],
          },
          {
            type: "choice",
            q: "Why is Mesosaurus such strong evidence for continental drift?",
            options: ["It was a large sea creature that swam between continents", "It lived in fresh water, so it could not have crossed a salty ocean", "It was the first animal to live on land", "It is still alive today in Brazil"],
            answer: 1,
          },
          {
            type: "choice",
            q: "Which best explains why most scientists rejected Wegener's theory at first?",
            options: ["He had no evidence at all", "He could not explain what force moved the continents", "He said the continents were fixed in place", "Nobody had ever seen a map of Africa"],
            answer: 1,
          },
          {
            type: "order",
            q: "Put these events in order, earliest first.",
            items: ["Pangaea begins to break up", "Wegener proposes continental drift", "Hess proposes sea-floor spreading", "Vine and Matthews publish the magnetic stripe evidence"],
          },
          {
            type: "pick",
            q: "What do scientists find as they move away from a mid-ocean ridge? There is more than one.",
            options: ["The rocks of the sea floor get older", "Matching magnetic stripes on each side", "The sea floor becomes younger", "The crust is made of coal"],
            answers: [0, 1],
          },
        ],
      },
      task: {
        title: "Rebuild Pangaea and judge the evidence",
        intro: "Recreate Wegener's jigsaw and then write a balanced judgement of his theory, as a geologist in the 1920s and as one in the 1960s.",
        need: ["A printed or traced world map (an atlas page to trace from is fine)", "Scissors", "Coloured pencils", "Glue and a sheet of paper", "Lined paper"],
        steps: [
          "Trace or print an outline map of the continents. Cut out South America, Africa, Antarctica, India, Australia and North America.",
          "Colour a small symbol onto each continent where the evidence is found: Mesosaurus (Brazil and southern Africa), Glossopteris (South America, Africa, India, Australia, Antarctica) and coal in Antarctica.",
          "Arrange the pieces to rebuild Pangaea so that the fossil areas line up. Glue them down and add a key.",
          "Write a short paragraph as a geologist in 1925: what is convincing about Wegener's idea, and why might you still reject it?",
          "Write a second paragraph as a geologist in 1968: what new evidence has changed your mind?",
          "Finish with a sentence or two answering: 'Was Wegener right?' Use the word 'mechanism' in your answer.",
        ],
      },
      exit: [
        { type: "type", q: "What name did Wegener give to the supercontinent?", answer: ["Pangaea", "Pangea"] },
        { type: "choice", q: "In which year did Wegener first put forward his idea of continental drift?", options: ["1812", "1912", "1962"], answer: 1 },
        {
          type: "pick",
          q: "Which of these did Wegener use as evidence? There is more than one.",
          options: ["The fit of South America and Africa", "Magnetic stripes on the sea floor", "Matching fossils on different continents", "Coal in Antarctica"],
          answers: [0, 2, 3],
          why: "Magnetic stripes were discovered in the 1960s, decades after Wegener died.",
        },
        { type: "choice", q: "What was the main weakness of Wegener's theory?", options: ["It did not mention fossils", "He could not explain the mechanism that moved the continents", "It only applied to Europe"], answer: 1 },
        { type: "choice", q: "What happens at a mid-ocean ridge?", options: ["New oceanic crust forms as the plates move apart", "Old crust is destroyed", "Continents collide"], answer: 0 },
        {
          type: "choice",
          q: "Which evidence best supports sea-floor spreading?",
          options: ["Mountains in Scotland", "The jigsaw fit of the continents", "Mirror-image magnetic stripes either side of a ridge"],
          answer: 2,
        },
      ],
      grownUp: {
        need: ["An atlas or printed world outline", "Scissors, glue, coloured pencils"],
        tips: [
          "This lesson is as much about how science works as about geography: an idea with good evidence was rejected because it lacked a mechanism, then accepted when new evidence arrived.",
          "Encourage your learner to say how convincing each piece of evidence is, not just to list it. The jigsaw fit on its own could be coincidence; fossils, rocks and climate together are much stronger.",
          "A free outline world map can be found by searching for 'blank world map printable'; supervise internet use as usual.",
        ],
        younger: "Focus on two pieces of evidence (the jigsaw fit and Mesosaurus) and do the cutting-out activity together. A single paragraph explaining 'Why did people not believe Wegener?' is enough.",
        older: "Research Arthur Holmes, who suggested in the late 1920s that convection currents in the mantle could move continents. Why was his idea also largely ignored until the 1960s?",
      },
    },
    {
      slug: "tectonic-hazards-3",
      title: "Plate boundaries",
      emoji: "🗺️",
      minutes: 60,
      goal: "I can describe and explain what happens at constructive, destructive and conservative plate boundaries, using real examples.",
      starter: [
        { type: "type", q: "What did Wegener call the supercontinent?", answer: ["Pangaea", "Pangea"] },
        { type: "choice", q: "Why was Mesosaurus important evidence?", options: ["It lived in fresh water but is found on two continents", "It was the largest dinosaur", "It could fly between continents"], answer: 0 },
        { type: "choice", q: "What new evidence in the 1960s supported moving plates?", options: ["Coal in Antarctica", "Magnetic stripes on the ocean floor", "The shape of Africa"], answer: 1 },
        { type: "type", q: "What is the name of the underwater mountain range down the middle of the Atlantic?", answer: ["Mid-Atlantic Ridge", "the Mid-Atlantic Ridge", "mid atlantic ridge"] },
        { type: "choice", q: "Which word describes the 'missing piece' in Wegener's theory?", options: ["Evidence", "Mechanism", "Fossil"], answer: 1 },
        { type: "pick", q: "Which continents have Glossopteris fossils? There is more than one.", options: ["Antarctica", "Australia", "Europe", "South America"], answers: [0, 1, 3] },
      ],
      learn: {
        cards: [
          {
            heading: "Constructive boundaries",
            text: [
              "A plate boundary, or plate margin, is where two plates meet. Most earthquakes and volcanoes happen along plate boundaries, because this is where the plates push, pull and grind against each other.",
              "At a constructive (or divergent) boundary, two plates move apart. As they separate, pressure on the mantle beneath is released and some of the hot rock melts to form magma, which rises to fill the gap. It cools to form new crust, so crust is being 'constructed'.",
              "The Mid-Atlantic Ridge is a constructive boundary between the North American and Eurasian plates in the north, and the South American and African plates in the south. The Atlantic Ocean is widening by about 2.5 centimetres a year. Iceland sits right on top of the ridge, so the island is slowly being pulled apart.",
              "The volcanoes at constructive boundaries usually erupt runny basalt lava fairly gently, and the earthquakes are usually small and shallow.",
            ],
          },
          {
            heading: "Destructive boundaries",
            text: [
              "At a destructive (or convergent) boundary, two plates move towards each other. Where oceanic crust meets continental crust, the denser oceanic plate is forced down underneath. This is called subduction, and the area where it happens is a subduction zone. A deep ocean trench forms where the plate bends down.",
              "As the oceanic plate sinks into the hot mantle, it melts and releases water, forming magma that rises through the continental crust. This creates chains of explosive volcanoes and fold mountains. The Andes in South America formed where the Nazca Plate is subducted beneath the South American Plate. Japan lies above a subduction zone where the Pacific Plate sinks beneath the plate Japan sits on.",
              "Friction between the plates means they can lock together. Pressure builds up for years or centuries and is then suddenly released, causing very powerful earthquakes, sometimes with tsunamis.",
              "Where two continental plates collide, neither is dense enough to sink. The crust crumples and is pushed upwards. The Himalayas, including Mount Everest, are still rising as the Indo-Australian Plate pushes into the Eurasian Plate. This is called a collision boundary: there are strong earthquakes but no volcanoes.",
            ],
          },
          {
            heading: "Conservative boundaries",
            text: [
              "At a conservative (or transform) boundary, two plates slide past each other, either in opposite directions or in the same direction at different speeds. Crust is neither created nor destroyed, so it is 'conserved'.",
              "The plates do not slide smoothly. Friction makes them stick, pressure builds up, and then the rocks suddenly slip, sending out seismic waves. Conservative boundaries can have powerful, shallow earthquakes, but there are no volcanoes because no magma is created.",
              "The best-known example is the San Andreas Fault in California, where the Pacific Plate and North American Plate slide past each other. It caused the San Francisco earthquake of 1906. The 2010 Haiti earthquake happened on a similar sideways-moving fault on the boundary between the Caribbean and North American plates.",
              "On a world map, the boundaries around the Pacific Ocean form the Ring of Fire. About three quarters of the world's active volcanoes and around 90% of its earthquakes occur along it.",
            ],
          },
        ],
        words: [
          { word: "plate boundary", meaning: "the place where two tectonic plates meet; also called a plate margin" },
          { word: "constructive boundary", meaning: "where plates move apart and new crust is formed" },
          { word: "destructive boundary", meaning: "where plates move towards each other and oceanic crust is destroyed by subduction" },
          { word: "subduction", meaning: "the process in which a denser oceanic plate sinks beneath another plate into the mantle" },
          { word: "conservative boundary", meaning: "where plates slide past each other and crust is neither made nor destroyed" },
          { word: "Ring of Fire", meaning: "the chain of plate boundaries around the Pacific Ocean with many volcanoes and earthquakes" },
        ],
      },
      practice: {
        intro: "What happens where?",
        questions: [
          {
            type: "match",
            q: "Match each boundary to its example.",
            pairs: [
              ["Constructive", "Mid-Atlantic Ridge"],
              ["Destructive (subduction)", "The Andes"],
              ["Collision", "The Himalayas"],
              ["Conservative", "San Andreas Fault"],
            ],
          },
          {
            type: "choice",
            q: "At a destructive boundary, why does the oceanic plate sink beneath the continental plate?",
            options: ["It is moving faster", "It is thicker", "It is denser", "It is hotter"],
            answer: 2,
          },
          {
            type: "pick",
            q: "Which boundaries can produce volcanoes? There is more than one.",
            options: ["Constructive", "Conservative", "Destructive (subduction)", "Collision"],
            answers: [0, 2],
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "At a conservative boundary, plates slide ___ each other. There are no volcanoes because no ___ is formed.",
            bank: ["past", "magma", "towards", "ice"],
            answers: ["past", "magma"],
          },
          {
            type: "choice",
            q: "The Himalayas have strong earthquakes but no volcanoes. Which best explains this?",
            options: ["Two continental plates collide and neither sinks, so no magma forms", "The plates are moving apart", "The area is too cold for volcanoes", "The plates there do not move"],
            answer: 0,
          },
        ],
      },
      task: {
        title: "Model the three boundaries",
        intro: "Use food or stationery to model each type of boundary, then produce a labelled annotated diagram for each.",
        need: [
          "Two slices of bread or two pieces of thick card",
          "Two chocolate bars with a soft centre, or two pieces of modelling clay",
          "Paper, pencil and coloured pencils",
          "An atlas or online plate boundary map, with permission",
        ],
        steps: [
          "Constructive: hold two pieces of soft chocolate bar or clay side by side and slowly pull them apart. Notice the gap and the soft 'mantle' showing through. Sketch and label it.",
          "Destructive: lay one piece of card on the table and push a second, thinner piece underneath it. Which represents the oceanic plate and why? Sketch and label the trench, the subducting plate and a volcano.",
          "Collision: push two thick slices of bread together and watch them crumple upwards into 'fold mountains'. Sketch it.",
          "Conservative: hold the two pieces of card edge to edge and slide them past each other while pressing them together. Feel them stick and then jump. Sketch it with arrows.",
          "Under each sketch, write two or three sentences explaining what happens, and name one real example.",
          "Using an atlas or a plate boundary map, find three countries on the Ring of Fire and write which boundary type is nearest to each.",
        ],
      },
      exit: [
        { type: "choice", q: "At a constructive boundary, the plates…", options: ["slide past each other", "move towards each other", "move apart"], answer: 2 },
        { type: "type", q: "What is the name of the process in which one plate sinks beneath another?", answer: ["subduction"] },
        { type: "choice", q: "Which is an example of a conservative boundary?", options: ["The San Andreas Fault", "The Mid-Atlantic Ridge", "The Andes"], answer: 0 },
        {
          type: "order",
          q: "Put these steps at an ocean-continent destructive boundary in order.",
          items: ["The plates move towards each other", "The denser oceanic plate sinks", "The sinking plate melts in the mantle", "Magma rises and a volcano forms"],
        },
        {
          type: "choice",
          q: "Why are there no volcanoes at conservative boundaries?",
          options: ["The earthquakes stop them", "Crust is neither made nor destroyed, so no magma forms", "They are always under the sea"],
          answer: 1,
        },
        { type: "choice", q: "About what proportion of the world's earthquakes happen around the Ring of Fire?", options: ["About 10%", "About 50%", "About 90%"], answer: 2 },
      ],
      grownUp: {
        need: ["Two slices of bread, card or modelling clay", "Atlas or a plate boundary map"],
        tips: [
          "The terms have two names each (constructive/divergent, destructive/convergent, conservative/transform). UK exam boards use both, so it is worth learning both.",
          "Ask your learner to explain each model aloud before writing. If they can explain why something happens, not just what, they have understood.",
          "Some geography courses list collision boundaries as a type of destructive boundary; others treat them separately. Either is fine.",
        ],
        younger: "Focus on the three main types with one hand movement each: hands apart, hands together, hands sliding. Draw one simple diagram for each.",
        older: "Research why Iceland has both a constructive boundary and a hotspot beneath it, and why that makes it unusually volcanic. Compare it with Hawaii, which is far from any plate boundary.",
      },
    },
    {
      slug: "tectonic-hazards-4",
      title: "Volcanoes and living with them",
      emoji: "🌋",
      minutes: 60,
      goal: "I can compare shield and composite volcanoes, describe volcanic hazards, and explain why many people choose to live near volcanoes.",
      starter: [
        { type: "choice", q: "At which boundary do plates move apart?", options: ["Destructive", "Conservative", "Constructive"], answer: 2 },
        { type: "type", q: "What is the name of the process where a denser plate sinks beneath another?", answer: ["subduction"] },
        { type: "choice", q: "Which is an example of a collision boundary?", options: ["The Himalayas", "Iceland", "The San Andreas Fault"], answer: 0 },
        {
          type: "match",
          q: "Match each boundary to what the plates do.",
          pairs: [
            ["Constructive", "Move apart"],
            ["Destructive", "Move together"],
            ["Conservative", "Slide past each other"],
          ],
        },
        { type: "choice", q: "Why are there no volcanoes at conservative boundaries?", options: ["No magma is formed there", "They are too deep", "The plates are too cold"], answer: 0 },
        { type: "choice", q: "What is the Ring of Fire?", options: ["A chain of volcanoes in Africa", "The plate boundaries around the Pacific Ocean", "The hot outer core"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Two kinds of volcano",
            text: [
              "A volcano forms where magma reaches the surface through a vent. Once it erupts, magma is called lava. How a volcano behaves depends mainly on its magma, especially how viscous (thick and sticky) it is and how much gas it contains.",
              "Shield volcanoes have gentle slopes and a wide base. They are made of runny basalt lava, which is low in silica and flows a long way before it cools. Gas escapes easily, so eruptions are fairly frequent but usually gentle. They are found at constructive boundaries, such as in Iceland, and over hotspots: Mauna Loa in Hawaii is the largest active volcano on Earth.",
              "Composite volcanoes (also called stratovolcanoes) are steep-sided cones made of alternating layers of ash and lava. Their magma is viscous and rich in silica, so gas becomes trapped and pressure builds. When they erupt, they can be violently explosive, although eruptions may be many years apart. They are found at destructive boundaries: Mount Fuji in Japan and Mount St Helens in the USA are examples.",
              "Volcanoes can be described as active (erupted recently and likely to erupt again), dormant (not erupted for a long time but could do so again) or extinct (not expected ever to erupt again). Edinburgh Castle stands on the plug of an extinct volcano.",
            ],
          },
          {
            heading: "Volcanic hazards",
            text: [
              "Lava flows are usually slow enough for people to walk away from, but they destroy buildings, roads and farmland in their path. Pyroclastic flows are far more dangerous: avalanches of hot gas, ash and rock that rush down the slopes at over 100 kilometres per hour, often hotter than 500°C.",
              "Ash clouds can travel thousands of kilometres. Ash makes breathing difficult, collapses roofs when it builds up, damages crops, and can stop aircraft engines. In 2010, ash from Eyjafjallajökull in Iceland closed much of Europe's airspace for several days, cancelling around 100,000 flights.",
              "Lahars are mudflows made when ash mixes with rain or melted snow and ice. They can flow down river valleys far from the volcano. Volcanic gases, such as sulphur dioxide and carbon dioxide, can also be harmful.",
              "Geographers often sort effects into primary effects (caused directly by the eruption, such as buildings destroyed by lava) and secondary effects (that happen as a result, such as lahars, lost jobs or disrupted travel).",
            ],
          },
          {
            heading: "Why live near a volcano?",
            text: [
              "Roughly 800 million people around the world live within 100 kilometres of an active volcano. That can seem surprising, but there are good reasons.",
              "Fertile soil: volcanic ash breaks down into soils rich in minerals, which are excellent for farming. The slopes of Mount Etna in Sicily are covered in vineyards, orchards and olive groves, and much of Indonesia's rice is grown on volcanic soils.",
              "Energy and resources: in Iceland, geothermal energy (heat from underground) generates around a quarter of the country's electricity and heats about nine out of ten homes. Volcanic areas can also provide valuable minerals and building stone.",
              "Tourism: volcanoes attract visitors, creating jobs in hotels, guiding and transport. Other reasons are human: many people have lived in the same place for generations, may not be able to afford to move, or trust that scientists will give them warning. Modern monitoring of ground swelling, small earthquakes and gas emissions means many eruptions can now be forecast days or weeks ahead.",
            ],
          },
        ],
        words: [
          { word: "magma", meaning: "molten rock beneath the Earth's surface" },
          { word: "lava", meaning: "molten rock that has erupted onto the Earth's surface" },
          { word: "viscous", meaning: "thick and sticky, so it flows slowly" },
          { word: "shield volcano", meaning: "a wide, gently sloping volcano made of runny basalt lava, with mostly gentle eruptions" },
          { word: "composite volcano", meaning: "a steep cone of layered ash and lava with viscous magma and explosive eruptions" },
          { word: "pyroclastic flow", meaning: "a fast-moving avalanche of hot gas, ash and rock" },
        ],
      },
      practice: {
        intro: "Comparing volcanoes and weighing up risks.",
        questions: [
          {
            type: "match",
            q: "Match each feature to the type of volcano.",
            pairs: [
              ["Gentle slopes and runny basalt lava", "Shield volcano"],
              ["Steep sides and layers of ash and lava", "Composite volcano"],
              ["Not erupted for a long time but could again", "Dormant volcano"],
            ],
          },
          {
            type: "choice",
            q: "Why are composite volcanoes more explosive than shield volcanoes?",
            options: ["Their lava is runnier", "Their viscous magma traps gas, so pressure builds up", "They are always under the sea", "They are much older"],
            answer: 1,
          },
          {
            type: "pick",
            q: "Which of these are secondary effects of an eruption? There is more than one.",
            options: ["A lahar after heavy rain on ash", "Flights cancelled across Europe", "A house destroyed by a lava flow", "Tourism falling for several years"],
            answers: [0, 1, 3],
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "Iceland uses ___ energy to heat most homes. Volcanic ash weathers into ___ soils that are good for farming.",
            bank: ["geothermal", "fertile", "solar", "sandy"],
            answers: ["geothermal", "fertile"],
          },
          {
            type: "choice",
            q: "Which volcanic hazard is usually the most dangerous to life?",
            options: ["A slow lava flow", "A pyroclastic flow", "A small steam vent", "Fertile soil"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Should they stay? An extended answer",
        intro: "Write a balanced extended answer to the question: 'The benefits of living near a volcano outweigh the risks.' How far do you agree?",
        need: ["Paper or a notebook", "Coloured pencils", "An atlas or internet access, with permission, for research"],
        steps: [
          "Choose one volcano to focus on: Mount Etna (Italy), Mount Merapi (Indonesia), Mount Fuji (Japan) or one you have researched yourself.",
          "Draw a labelled cross-section of a composite volcano: magma chamber, main vent, crater, layers of ash and lava, and an ash cloud.",
          "Draw a two-column table: 'Benefits' and 'Risks'. Add at least four points to each, using what you learned and your research.",
          "Plan your answer: introduction, a paragraph on benefits, a paragraph on risks, and a paragraph on how monitoring and planning can reduce the risks.",
          "Write about 300 to 400 words. Use at least four key words from this lesson and give specific examples.",
          "Finish with a clear conclusion that answers 'how far do you agree?' and explains why. It is fine to say 'it depends on…', as long as you explain what it depends on.",
        ],
      },
      exit: [
        { type: "choice", q: "Which type of volcano has gentle slopes and runny lava?", options: ["Composite", "Shield", "Extinct"], answer: 1 },
        { type: "type", q: "What word describes magma that is thick and sticky?", answer: ["viscous"] },
        { type: "choice", q: "What is a lahar?", options: ["A mudflow of ash mixed with water", "A cloud of gas", "A type of shield volcano"], answer: 0 },
        { type: "choice", q: "Mount Fuji is an example of a…", options: ["shield volcano", "conservative boundary", "composite volcano"], answer: 2 },
        {
          type: "pick",
          q: "Which are reasons people live near volcanoes? There is more than one.",
          options: ["Fertile soils", "Geothermal energy", "Volcanoes never erupt", "Jobs from tourism"],
          answers: [0, 1, 3],
        },
        {
          type: "choice",
          q: "A house is destroyed by lava; months later, local farmers lose income because ash has damaged crops. Which statement is correct?",
          options: ["Both are primary effects", "The house is a primary effect; the lost income is a secondary effect", "Both are secondary effects"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Paper and coloured pencils", "An atlas or supervised internet access"],
        tips: [
          "The extended answer mirrors GCSE 'how far do you agree' questions. Praise a clear judgement backed by reasons more than a long list of facts.",
          "If your learner researches online, good starting points are the British Geological Survey, the Smithsonian Global Volcanism Program and BBC Bitesize.",
          "Talking about disasters can worry some young people. It helps to stress that most volcanoes are monitored closely and that many eruptions are now forecast in time to evacuate.",
        ],
        younger: "Reduce the extended answer to a table of three benefits and three risks, then one sentence: 'I think… because…'.",
        older: "Research the Volcanic Explosivity Index (VEI). Find the VEI of Eyjafjallajökull 2010 and Mount St Helens 1980, and explain why a scale like this is useful but also limited.",
      },
    },
    {
      slug: "tectonic-hazards-5",
      title: "Earthquakes and measuring them",
      emoji: "📈",
      minutes: 60,
      goal: "I can explain what causes earthquakes and tsunamis, describe how earthquakes are measured, and interpret magnitude data.",
      starter: [
        { type: "choice", q: "Which type of volcano has viscous magma and explosive eruptions?", options: ["Shield", "Composite", "Extinct"], answer: 1 },
        { type: "type", q: "What do we call molten rock once it has reached the surface?", answer: ["lava"] },
        { type: "choice", q: "What is a pyroclastic flow?", options: ["A gentle river of lava", "A fast avalanche of hot gas, ash and rock", "A mudflow of ash and rain"], answer: 1 },
        { type: "pick", q: "Which are reasons people live near volcanoes? There is more than one.", options: ["Fertile soil", "Tourism jobs", "Geothermal energy", "Lower risk of earthquakes"], answers: [0, 1, 2] },
        { type: "choice", q: "Which country uses geothermal energy to heat about nine in ten homes?", options: ["Iceland", "Italy", "Indonesia"], answer: 0 },
        { type: "choice", q: "Flights cancelled because of an ash cloud are an example of…", options: ["a primary effect", "a secondary effect", "a constructive boundary"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What causes an earthquake?",
            text: [
              "An earthquake is a sudden shaking of the ground. Most are caused by the movement of tectonic plates. As plates move, friction can make them stick. Stress builds up in the rocks, sometimes for hundreds of years, until the rocks suddenly break or slip along a fault (a crack in the crust). The stored energy is released as seismic waves.",
              "The point underground where the rocks slip is called the focus (or hypocentre). The point on the surface directly above it is the epicentre. Shaking is usually strongest near the epicentre and weakens with distance. Shallow-focus earthquakes, close to the surface, tend to cause more damage than deep ones of the same size.",
              "There are three main types of seismic wave. P waves (primary waves) are the fastest and arrive first; they push and pull the rock. S waves (secondary waves) arrive next and shake the ground from side to side. Surface waves arrive last and travel along the surface; they usually cause the most damage.",
              "Earthquakes occur at all types of plate boundary, but the most powerful are at destructive boundaries, where plates can lock together over huge areas.",
            ],
          },
          {
            heading: "Measuring earthquakes",
            text: [
              "Earthquakes are recorded by seismometers, which detect the vibrations. The record they produce is called a seismogram: a line that wiggles more strongly the harder the ground shakes.",
              "The Richter scale, developed by Charles Richter in 1935, measures an earthquake's magnitude: the size of the seismic waves. Today scientists mostly use the moment magnitude scale, which works better for very large earthquakes, but the numbers are similar and news reports often still say 'Richter scale'.",
              "Magnitude scales are logarithmic. Each step of one whole number means the ground shaking is 10 times larger and about 32 times more energy is released. So a magnitude 7 releases about 32 times the energy of a magnitude 6, and a magnitude 9 releases about 1,000 times the energy of a magnitude 7.",
              "The Modified Mercalli Intensity scale is different: it describes the effects of an earthquake at a particular place, from I (not felt) to XII (total destruction), based on what people felt and the damage seen. One earthquake has a single magnitude but different intensities in different places.",
            ],
          },
          {
            heading: "Tsunamis and prediction",
            text: [
              "When an earthquake happens under the sea, especially at a subduction zone, the sea floor can be suddenly pushed up, lifting the whole column of water above it. This creates a tsunami: a series of waves that can cross an ocean at the speed of a jet aircraft. In deep water the waves may be less than a metre high, but as they reach shallow water near the coast they slow down and grow much taller.",
              "A warning sign of a tsunami can be the sea drawing back a long way from the shore. Anyone who sees this, or feels a strong earthquake at the coast, should move to high ground immediately rather than wait for an official warning.",
              "Scientists cannot yet predict exactly when an earthquake will happen. They can, however, forecast which areas are at risk and how likely a large earthquake is over the coming decades, by studying fault lines and past earthquakes.",
              "Some countries, including Japan and Mexico, have earthquake early warning systems. Sensors detect the first, fast P waves and send automatic alerts before the slower, more damaging waves arrive. This may give only seconds to a minute of warning, but that is enough to stop trains, shut off gas supplies and let people take cover.",
            ],
          },
        ],
        words: [
          { word: "focus", meaning: "the point underground where an earthquake starts; also called the hypocentre" },
          { word: "epicentre", meaning: "the point on the Earth's surface directly above the focus" },
          { word: "seismic waves", meaning: "waves of energy that travel through the Earth from an earthquake" },
          { word: "magnitude", meaning: "a measure of the size and energy of an earthquake" },
          { word: "logarithmic scale", meaning: "a scale on which each whole number step is ten times larger than the one before" },
          { word: "tsunami", meaning: "a series of large sea waves usually caused by an undersea earthquake" },
        ],
      },
      practice: {
        intro: "Causes, scales and data.",
        questions: [
          {
            type: "order",
            q: "Put these in the order they usually happen.",
            items: ["Plates move but stick because of friction", "Stress builds up in the rocks", "The rocks suddenly slip along a fault", "Seismic waves spread out from the focus"],
          },
          {
            type: "match",
            q: "Match each term to its meaning.",
            pairs: [
              ["Focus", "Where the rocks slip underground"],
              ["Epicentre", "The point on the surface above the focus"],
              ["Seismometer", "An instrument that detects vibrations"],
              ["Mercalli scale", "Measures the effects at a place"],
            ],
          },
          {
            type: "choice",
            q: "How much more energy does a magnitude 8 earthquake release than a magnitude 7?",
            options: ["About 2 times", "About 10 times", "About 32 times", "About 1,000 times"],
            answer: 2,
          },
          {
            type: "choice",
            q: "Which seismic waves arrive first at a seismometer?",
            options: ["Surface waves", "S waves", "P waves", "Tsunami waves"],
            answer: 2,
          },
          {
            type: "choice",
            q: "Which best explains how an earthquake early warning system works?",
            options: ["It predicts earthquakes days in advance", "It detects fast P waves and sends alerts before slower, damaging waves arrive", "It measures changes in the weather", "It watches animals for strange behaviour"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Earthquake data investigation",
        intro: "Use real earthquake data to look for patterns, then build a simple model seismometer.",
        need: [
          "Internet access with permission (the British Geological Survey or USGS 'latest earthquakes' pages are free)",
          "Graph paper or a free spreadsheet such as Google Sheets in a browser",
          "For the seismometer: a cardboard box, string, a felt-tip pen, sticky tape, a small weight such as a lump of modelling clay, and a long strip of paper",
        ],
        steps: [
          "With permission, open a 'latest earthquakes' map from the USGS or the British Geological Survey. Record ten earthquakes from the past week with magnitude 4.5 or above: location, magnitude and depth.",
          "Plot them on a blank world map or note which plate boundary each is near. What pattern do you notice?",
          "Draw a bar chart of their magnitudes. Work out the mean, median and range of magnitude.",
          "For your largest and smallest earthquakes, calculate roughly how many times more energy the larger one released (use about 32 times per whole step).",
          "Build a model seismometer: hang the felt-tip pen from string inside the box, weighted with clay so its tip just touches a paper strip on the base. Slowly pull the paper through while someone gently taps or shakes the table, then compare gentle and strong shaking.",
          "Write a short conclusion: what does your data show about where earthquakes happen, and how does a real seismometer improve on your model?",
        ],
      },
      exit: [
        { type: "type", q: "What is the name of the point on the surface directly above the focus?", answer: ["epicentre", "the epicentre", "epicenter"] },
        { type: "choice", q: "Which type of seismic wave usually causes the most damage?", options: ["P waves", "S waves", "Surface waves"], answer: 2 },
        { type: "choice", q: "What does the Mercalli scale measure?", options: ["The effects and damage at a particular place", "The temperature of magma", "The width of a fault"], answer: 0 },
        {
          type: "choice",
          q: "A magnitude 9 earthquake releases roughly how much more energy than a magnitude 7?",
          options: ["2 times", "64 times", "About 1,000 times"],
          answer: 2,
          why: "About 32 × 32, which is roughly 1,000.",
        },
        {
          type: "gap",
          q: "Fill in the gaps.",
          text: "A tsunami is usually caused when an undersea earthquake suddenly pushes up the sea ___. The waves grow taller as they reach ___ water.",
          bank: ["floor", "shallow", "surface", "deep"],
          answers: ["floor", "shallow"],
        },
        {
          type: "choice",
          q: "Which statement about predicting earthquakes is accurate?",
          options: ["Scientists can predict the exact day of an earthquake", "Scientists can identify areas at risk but cannot predict exactly when an earthquake will happen", "Earthquakes only happen at night, so they are easy to predict"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Internet access (supervised) or printed earthquake data", "Cardboard box, string, felt-tip pen, tape, modelling clay, strip of paper"],
        tips: [
          "If you cannot get online, make up a table of ten earthquakes together from an atlas or newspaper, or use the practice data your learner already has.",
          "The logarithmic scale is a genuinely tricky idea. Building up '×32, then ×32 again' step by step helps.",
          "Keep the seismometer shaking gentle: tapping the table is enough.",
          "Some young people find earthquake news unsettling. Reassure them that the UK has small earthquakes only rarely, because it is far from a plate boundary.",
        ],
        younger: "Skip the energy calculation. Focus on focus and epicentre, plotting a few earthquakes on a map, and noticing they cluster along plate boundaries.",
        older: "Find out how the triangulation method uses the time gap between P and S waves at three seismometers to locate an epicentre. Try a worked example and explain each step.",
      },
    },
    {
      slug: "tectonic-hazards-6",
      title: "Japan 2011 and Haiti 2010",
      emoji: "⚖️",
      minutes: 60,
      goal: "I can compare the causes, effects and responses of earthquakes in a richer and a poorer country, and explain how prediction, protection and planning reduce risk.",
      starter: [
        { type: "type", q: "What is the name of the point underground where an earthquake starts?", answer: ["focus", "the focus", "hypocentre", "hypocenter"] },
        { type: "choice", q: "Which seismic waves arrive first?", options: ["P waves", "S waves", "Surface waves"], answer: 0 },
        { type: "choice", q: "A magnitude 7 earthquake releases about how much more energy than a magnitude 6?", options: ["10 times", "32 times", "100 times"], answer: 1 },
        { type: "choice", q: "What usually causes a tsunami?", options: ["Strong winds over the ocean", "An undersea earthquake pushing up the sea floor", "The pull of the Moon"], answer: 1 },
        { type: "choice", q: "What does an earthquake early warning system detect?", options: ["The first, fast P waves", "Changes in the weather", "Rising sea levels"], answer: 0 },
        { type: "choice", q: "What does the Mercalli scale measure?", options: ["Magnitude", "Depth of the focus", "Effects at a particular place"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Japan, 11 March 2011",
            text: [
              "Japan is one of the world's richest countries, and one of the most earthquake-prone. It lies where four plates meet. On 11 March 2011, the Pacific Plate suddenly slipped beneath the plate Japan sits on, about 70 kilometres off the north-east coast of the Tōhoku region. The result was a magnitude 9.0 earthquake (some measurements give 9.1), the most powerful ever recorded in Japan.",
              "Japan's strict building codes worked well: most buildings withstood several minutes of intense shaking, and the early warning system stopped high-speed trains and sent alerts to phones and television. The far greater danger was the tsunami that followed. Waves reached the coast within about 30 minutes to an hour, and in some places the water ran up to around 40 metres above sea level, overtopping sea walls.",
              "About 15,900 people died and around 2,500 more were never found, most of them drowned by the tsunami. Several hundred thousand people had to leave their homes. The tsunami also flooded the Fukushima Daiichi nuclear power plant, causing meltdowns in three reactors and the evacuation of a wide surrounding area.",
              "The World Bank estimated the damage at around US$235 billion, making it the most expensive natural disaster in recorded history. Japan was able to fund rebuilding, clear debris quickly and reopen most transport within weeks to months, although recovery in the worst-hit towns took many years.",
            ],
          },
          {
            heading: "Haiti, 12 January 2010",
            text: [
              "Haiti, on the Caribbean island of Hispaniola, was then the poorest country in the Americas. On 12 January 2010, a magnitude 7.0 earthquake struck on a fault close to the boundary between the Caribbean and North American plates. Its epicentre was only about 25 kilometres from the capital, Port-au-Prince, and its focus was shallow, about 13 kilometres deep.",
              "Many buildings were made of poorly built concrete without steel reinforcement, and building codes were not enforced. Vast numbers of homes, schools and hospitals collapsed, along with the Presidential Palace and the main port. Around 1.5 million people were left homeless, many living for months or years in tented camps.",
              "Death toll figures vary widely, which is itself something geographers must think about. The Haitian government gave a figure of over 300,000; some independent studies estimated far fewer. Many sources use a figure of around 220,000. Whichever estimate is used, it was one of the deadliest earthquakes of modern times.",
              "Secondary effects added to the disaster. Damaged roads, the port and the airport slowed the arrival of aid. In October 2010 cholera broke out and spread through the camps, eventually causing nearly 10,000 deaths over the following years. Haiti depended heavily on international aid, and rebuilding was slow.",
            ],
          },
          {
            heading: "Why the difference? Prediction, protection and planning",
            text: [
              "Japan's earthquake released roughly 1,000 times more energy than Haiti's, yet far fewer people died. The main reason is not the physical hazard but a country's vulnerability: how well people, buildings and services can resist and recover. Wealth, governance, building standards and preparation all matter.",
              "Prediction: earthquakes cannot be predicted precisely, but hazards can be monitored. Japan has a dense network of seismometers, tsunami warning buoys and an early warning system. Haiti had very little monitoring. For volcanoes, scientists measure ground swelling, small earthquakes and gas emissions to forecast eruptions.",
              "Protection: aseismic buildings are designed to withstand shaking, using deep foundations, steel frames, cross-bracing, rubber shock absorbers in the foundations (base isolation) and weights or dampers that counteract swaying. Older buildings can be strengthened (retrofitted). Sea walls and tsunami shelters protect coasts, although 2011 showed they can be overtopped.",
              "Planning: hazard maps show which areas are most at risk, so planners can keep hospitals and schools away from the most dangerous land. In Japan, people take part in regular earthquake drills, schools practise 'drop, cover, hold on', many families keep emergency kits, and tsunami evacuation routes are signposted. Planning costs money, which is one reason poorer countries are often more vulnerable, and why international support for preparation, not just emergency aid, matters.",
            ],
          },
        ],
        words: [
          { word: "vulnerability", meaning: "how likely people and places are to be harmed by a hazard, and how well they can cope" },
          { word: "primary effect", meaning: "an effect caused directly by the hazard, such as collapsed buildings" },
          { word: "secondary effect", meaning: "an effect that follows later as a result, such as disease or loss of jobs" },
          { word: "aseismic building", meaning: "a building designed to withstand earthquake shaking" },
          { word: "hazard map", meaning: "a map showing which areas are most at risk from a hazard" },
          { word: "retrofitting", meaning: "strengthening an existing building so it can better withstand earthquakes" },
        ],
      },
      practice: {
        intro: "Comparing the two earthquakes.",
        questions: [
          {
            type: "match",
            q: "Match each fact to the right earthquake.",
            pairs: [
              ["Magnitude 9.0 earthquake followed by a tsunami", "Japan, 2011"],
              ["Magnitude 7.0 earthquake with a shallow focus", "Haiti, 2010"],
              ["Damage of about US$235 billion", "The most expensive natural disaster recorded"],
              ["Around 1.5 million people made homeless", "Tented camps around Port-au-Prince"],
            ],
          },
          {
            type: "choice",
            q: "What caused most of the deaths in Japan in 2011?",
            options: ["Buildings collapsing during the shaking", "The tsunami", "Volcanic eruptions", "Cholera"],
            answer: 1,
          },
          {
            type: "pick",
            q: "Which factors made Haiti more vulnerable than Japan? There is more than one.",
            options: ["Building codes were not enforced", "The epicentre was close to the capital and the focus was shallow", "Haiti had a larger magnitude earthquake", "Little money for monitoring and preparation"],
            answers: [0, 1, 3],
          },
          {
            type: "match",
            q: "Match each measure to one of the three Ps.",
            pairs: [
              ["Seismometers and tsunami buoys", "Prediction"],
              ["Base isolation in foundations", "Protection"],
              ["Earthquake drills in schools", "Planning"],
            ],
          },
          {
            type: "choice",
            q: "Why do estimates of the Haiti death toll vary so much?",
            options: ["Nobody died, so the figures are guesses", "Records were destroyed, many people were buried quickly, and different groups used different methods", "The earthquake happened too long ago to study", "Japan's figures were used by mistake"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Compare and judge: a geography report",
        intro: "Write a comparison report answering: 'Why did the Haiti earthquake cause far more deaths than the Japan earthquake, even though it was much smaller?'",
        need: ["Paper or a computer with a free word processor in a browser", "Ruler and coloured pencils", "Optional internet access, with permission, for further research"],
        steps: [
          "Make a comparison table with two columns (Japan 2011, Haiti 2010) and rows for: date, magnitude, plate boundary, depth and distance from cities, deaths, homeless or evacuated, economic cost, primary effects, secondary effects, short-term responses and long-term responses.",
          "Fill it in using this lesson. If you research more, note where each figure comes from, and notice where sources disagree.",
          "Draw a simple bar chart comparing the deaths in each earthquake. For Haiti, show the range of estimates with a line rather than one exact bar.",
          "Write your report in four paragraphs: the physical causes; the effects; the responses; and why the impacts were so different, using the words 'vulnerability', 'prediction', 'protection' and 'planning'.",
          "End with a conclusion of two or three sentences: was the main difference the hazard itself, or the country's level of development? Justify your view.",
          "Finally, design a one-page 'Be prepared' leaflet for a family living in an earthquake zone. Use pictures and simple shapes, and keep it calm and practical.",
        ],
      },
      exit: [
        { type: "choice", q: "What was the magnitude of the 2010 Haiti earthquake?", options: ["7.0", "9.0", "5.0"], answer: 0 },
        { type: "choice", q: "In which year did the Tōhoku earthquake and tsunami hit Japan?", options: ["2004", "2010", "2011"], answer: 2 },
        { type: "type", q: "What word describes how likely people and places are to be harmed by a hazard, and how well they cope?", answer: ["vulnerability"] },
        {
          type: "choice",
          q: "Which is an example of protection?",
          options: ["A school earthquake drill", "Building with base isolators and cross-bracing", "Recording seismic waves with seismometers"],
          answer: 1,
        },
        {
          type: "pick",
          q: "Which were secondary effects of the Haiti earthquake? There is more than one.",
          options: ["A cholera outbreak", "Aid delayed by the damaged port and airport", "Buildings collapsing during the shaking", "Hundreds of thousands living in camps for months"],
          answers: [0, 1, 3],
        },
        {
          type: "choice",
          q: "Which statement best explains why Japan had fewer deaths despite a far stronger earthquake?",
          options: ["Japan's earthquake happened far out at sea, so nobody felt it", "Japan was less vulnerable, with strict building codes, warning systems and regular drills", "Japan's earthquake was smaller in energy than Haiti's"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Paper, ruler, coloured pencils", "Optional supervised internet access"],
        tips: [
          "These were real disasters in which many people died, and some learners may have family connections to Japan or Haiti. Keep the tone calm and respectful, and focus on understanding and what reduces harm.",
          "The Haiti death toll is genuinely disputed. Treating it as a range, and discussing why figures differ, is good geographical practice, not a weakness.",
          "If your learner becomes upset, it can help to talk about how much safer buildings and warning systems have made many places, and how people help each other after disasters.",
          "The 'Be prepared' leaflet is a good way to end on something practical and empowering.",
        ],
        younger: "Use a simple two-column table with five rows (magnitude, deaths, main cause of deaths, one primary effect, one secondary effect), then finish the sentence: 'Fewer people died in Japan because…'.",
        older: "Research the 2023 Turkey–Syria earthquakes and add them to your comparison. How far does the evidence support the claim that 'earthquakes don't kill people; buildings do'?",
      },
    },
  ],
};
