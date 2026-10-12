import type { LessonUnit } from "@/lib/lessons";

/**
 * Energy, for ages 11 to 14 (KS3 physics). Energy stores and transfers, conservation of energy, efficiency, power and
 * the cost of electricity, energy in food, and energy resources. Practicals use a bouncing ball, a toy car on a ramp,
 * appliance rating labels and food labels.
 */
export const energyStores: LessonUnit = {
  slug: "energy-stores",
  title: "Energy",
  short: "Energy",
  subject: "Science",
  ages: "11 to 14",
  emoji: "⚡",
  color: "#8A6D2F",
  summary: "Six KS3 physics lessons on energy stores and transfers, the law of conservation of energy, useful and wasted energy and efficiency, power and the cost of electricity, energy in food, and the renewable and non-renewable resources we use to generate electricity.",
  cover: "/lessons/units/energy-stores.jpg",
  lessons: [
    {
      slug: "energy-stores-1",
      title: "Energy stores and transfers",
      emoji: "🔋",
      minutes: 60,
      goal: "I can name the main energy stores, describe the ways energy is transferred between them, and describe the energy changes in everyday events.",
      starter: [
        { type: "choice", q: "What does a battery need to be connected into to make a bulb light up?", options: ["A complete circuit", "A magnet", "A glass of water"], answer: 0 },
        { type: "pick", q: "Which of these give out light? There is more than one.", options: ["The Sun", "A lit candle", "The Moon", "A torch that is switched on"], answers: [0, 1, 3], why: "The Moon does not give out its own light: it reflects light from the Sun." },
        { type: "choice", q: "Why do we need to eat food?", options: ["Only to keep our teeth strong", "To give us energy and materials to grow and repair", "To keep our blood cold"], answer: 1 },
        { type: "choice", q: "When you rub your hands together quickly, they get warmer. Which force is acting between them?", options: ["Magnetism", "Upthrust", "Friction"], answer: 2 },
        { type: "type", q: "What is the name of the force that pulls objects down towards the Earth?", answer: ["gravity", "weight", "gravitational force"] },
        { type: "choice", q: "Which of these makes electricity using the wind?", options: ["A solar panel", "A wind turbine", "A battery"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is energy?",
            text: [
              "Energy is one of the most important ideas in science, but it is also one of the slipperiest. You cannot see, touch or pour energy. Instead, physicists think of energy as a quantity that we can keep track of, a bit like money in a set of bank accounts. Whenever anything happens, from a ball rolling to a star shining, energy moves from one account to another.",
              "Energy is measured in joules (J). One joule is a small amount: it is roughly the energy needed to lift an apple one metre off the ground. Because everyday amounts are often much bigger, we also use kilojoules (kJ, 1,000 joules) and megajoules (MJ, 1,000,000 joules).",
              "The 'accounts' that energy is kept in are called energy stores. Saying that an object 'has energy' really means that energy is held in one or more of its stores. When something happens, energy is transferred from one store to another, and the total amount stays the same.",
              "This way of thinking replaces an older idea you may have met at primary school, of 'types of energy' such as light energy or sound energy. Light and sound are not stores: they are ways that energy is carried from one place to another.",
            ],
          },
          {
            heading: "The energy stores",
            text: [
              "The kinetic store is energy an object has because it is moving. The faster it moves and the greater its mass, the more energy is in its kinetic store. A lorry on the motorway has a huge kinetic store; a parked lorry has none.",
              "The gravitational potential store is energy an object has because of its height above the ground (strictly, its position in a gravitational field). Lifting a bag onto a shelf fills its gravitational potential store. The heavier the object and the higher it is lifted, the more energy is stored.",
              "The elastic potential store is energy held in an object that has been stretched, squashed or bent, such as a stretched elastic band, a compressed spring or a bent diving board. The chemical store is energy held in the bonds between atoms in substances such as food, fuels and the chemicals in a battery; it is released by chemical reactions such as burning or respiration.",
              "The thermal store (sometimes called the internal store) is energy an object has because of the movement of its particles. The hotter an object is, the faster its particles vibrate or move around, and the fuller its thermal store. There are also magnetic, electrostatic and nuclear stores, which you will meet in more detail at GCSE.",
            ],
          },
          {
            heading: "How energy is transferred",
            text: [
              "Energy moves between stores along four main pathways. Mechanically: when a force moves an object, such as your hand pushing a door or gravity pulling a falling ball, energy is transferred. Scientists call this 'doing work'. Electrically: when an electric current flows, it carries energy from a battery or power station to a device.",
              "By heating: energy is transferred from a hotter object to a cooler one, by conduction through solids, or by convection in liquids and gases. By radiation: energy is carried by waves, such as light and infrared radiation from the Sun or a fire. Sound waves also carry energy away from vibrating objects, and that energy soon spreads out into the surroundings.",
              "We can describe any event as a chain of stores and transfers. When you switch on a torch, energy is transferred from the chemical store of the battery, electrically to the bulb, and then by light radiation (and some heating) to the thermal store of the surroundings.",
              "A good energy description always names a starting store, the pathway, and an end store. For example: 'As the skydiver falls, energy is transferred mechanically from her gravitational potential store to her kinetic store.' Practise this style of sentence: it is exactly what examiners look for at GCSE.",
            ],
          },
        ],
        words: [
          { word: "energy", meaning: "a quantity that is transferred between stores whenever something happens; it is measured in joules" },
          { word: "joule (J)", meaning: "the unit of energy; 1 kilojoule (kJ) is 1,000 joules" },
          { word: "energy store", meaning: "a way that energy is held, such as kinetic, thermal, chemical, gravitational potential or elastic potential" },
          { word: "energy transfer", meaning: "the movement of energy from one store to another, mechanically, electrically, by heating or by radiation" },
          { word: "kinetic store", meaning: "the energy an object has because it is moving" },
          { word: "gravitational potential store", meaning: "the energy an object has because of its height in a gravitational field" },
        ],
      },
      practice: {
        intro: "Name the stores and trace the transfers.",
        questions: [
          {
            type: "match",
            q: "Match each example to the store that is filling up.",
            pairs: [
              ["A bike speeding up", "Kinetic store"],
              ["A kettle of water warming", "Thermal store"],
              ["A bow string being pulled back", "Elastic potential store"],
              ["A lift carrying people upwards", "Gravitational potential store"],
              ["A phone battery charging", "Chemical store"],
            ],
          },
          {
            type: "choice",
            q: "Why is 'light energy' not an energy store?",
            options: ["Light is too fast to measure", "Light is a way of transferring energy, not a way of holding it", "Light has no energy at all", "Light only exists during the day"],
            answer: 1,
          },
          {
            type: "order",
            q: "A torch is switched on. Put the energy story in order.",
            items: ["Chemical store of the battery", "Transferred electrically to the bulb", "Carried away by light and by heating", "Thermal store of the surroundings"],
          },
          {
            type: "pick",
            q: "Which are pathways for transferring energy? There is more than one.",
            options: ["By heating", "Kinetic", "Electrically", "By radiation", "Chemical"],
            answers: [0, 2, 3],
            why: "Kinetic and chemical are stores. Heating, electrical work, radiation and mechanical work are the pathways between them.",
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "When a stretched elastic band is let go, energy is transferred from its ___ store to its ___ store. Energy is measured in ___.",
            bank: ["elastic potential", "kinetic", "joules", "chemical", "newtons", "watts"],
            answers: ["elastic potential", "kinetic", "joules"],
          },
        ],
      },
      task: {
        title: "Energy detective around the home",
        intro: "Find ten everyday events in your home and describe each one using stores and pathways, in the style a scientist would use.",
        need: ["A notebook or paper and a pen", "A ruler for drawing a table"],
        steps: [
          "Draw a table with four columns: Event, Starting store, How energy is transferred, End store(s).",
          "Walk around your home and find ten events. Try to include something moving, something heating up, something lit, something stretched or squashed, and something falling. Do not touch anything hot or switch on appliances without asking a grown-up.",
          "Fill in a row for each event. For example: 'Toaster: energy transferred electrically from the mains to the thermal store of the heating element, then by heating and radiation to the thermal store of the bread.'",
          "For three of your events, draw a simple energy flow diagram: a box for each store and a labelled arrow for each transfer.",
          "Look back at your table. Which store appears most often as an end store? Write two or three sentences suggesting why.",
          "Challenge: think about a person climbing the stairs. Trace the energy back as far as you can: from the stairs to the person, to their food, to plants, and further. Where does it all start?",
        ],
      },
      exit: [
        { type: "choice", q: "What is the unit of energy?", options: ["Newton", "Joule", "Watt", "Metre"], answer: 1 },
        { type: "choice", q: "A roller coaster car is pulled slowly to the top of the first hill. Which store is filling up?", options: ["Elastic potential", "Chemical", "Gravitational potential", "Nuclear"], answer: 2 },
        { type: "pick", q: "Which of these are energy stores? There is more than one.", options: ["Thermal", "Sound", "Chemical", "Light", "Kinetic"], answers: [0, 2, 4] },
        {
          type: "choice",
          q: "Which statement best describes what happens when you strike a match?",
          options: [
            "Energy is created by the flame",
            "Energy is transferred from the chemical store of the match, by heating and radiation, to the thermal store of the surroundings",
            "Energy is transferred from the kinetic store of the flame to the chemical store of the air",
            "Light energy turns into sound energy",
          ],
          answer: 1,
        },
        { type: "type", q: "How many joules are there in 5 kilojoules?", answer: ["5000", "5,000"], after: "J" },
        {
          type: "match",
          q: "Match each pathway to an example.",
          pairs: [
            ["Mechanically", "A foot kicking a football"],
            ["Electrically", "A current flowing to a lamp"],
            ["By heating", "A hot drink warming your hands"],
            ["By radiation", "Sunlight reaching a solar panel"],
          ],
        },
      ],
      grownUp: {
        need: ["Paper, a pen and a ruler"],
        tips: [
          "KS3 science in England now uses 'stores and pathways' rather than 'forms of energy' (light energy, sound energy and so on). If your own schooling used the older language, that's fine: the key shift is that light, sound and electricity are ways energy travels, not places it is kept.",
          "Ask your learner to say their energy descriptions aloud in full sentences, naming a starting store, a pathway and an end store. This habit pays off directly at GCSE.",
          "Remind them not to switch on or touch hot appliances during the energy hunt without checking with you.",
        ],
        younger: "Focus on five stores only (kinetic, thermal, chemical, gravitational potential and elastic) and give a list of six household events to describe, rather than asking them to find ten.",
        older: "Introduce the GCSE equations for two stores: kinetic energy = ½ × mass × speed², and gravitational potential energy = mass × gravitational field strength × height (with g = 9.8 N/kg on Earth). Ask them to work out the energy in the gravitational potential store of a 0.5 kg bag lifted 2 m (about 9.8 J).",
      },
    },
    {
      slug: "energy-stores-2",
      title: "Conservation of energy",
      emoji: "♻️",
      minutes: 60,
      goal: "I can state the law of conservation of energy, use it to explain energy changes, and explain why moving objects slow down and stop.",
      starter: [
        { type: "choice", q: "What is the unit of energy?", options: ["Watt", "Joule", "Kilogram"], answer: 1 },
        { type: "choice", q: "Which store holds the energy of a moving object?", options: ["Kinetic", "Thermal", "Elastic potential"], answer: 0 },
        { type: "pick", q: "Which of these are energy stores? There is more than one.", options: ["Gravitational potential", "Electrical", "Chemical", "Light"], answers: [0, 2], why: "Electricity and light are ways of transferring energy, not stores." },
        { type: "choice", q: "Food, fuels and batteries all hold energy in which store?", options: ["Thermal", "Chemical", "Kinetic"], answer: 1 },
        {
          type: "match",
          q: "Match each pathway to an example.",
          pairs: [
            ["Mechanically", "Gravity pulling a falling apple"],
            ["By heating", "A radiator warming a room"],
            ["By radiation", "Light from a lamp"],
          ],
        },
        { type: "type", q: "A spring is squashed. Which store fills up? Type the two words.", answer: ["elastic potential", "elastic"] },
      ],
      learn: {
        cards: [
          {
            heading: "Energy cannot be created or destroyed",
            text: [
              "The law of conservation of energy is one of the most important rules in all of science. It states that energy cannot be created or destroyed; it can only be transferred from one store to another. In any event, the total amount of energy before is exactly the same as the total amount of energy afterwards.",
              "This law was worked out in the 1840s by several scientists, including James Prescott Joule, an English brewer and physicist from Salford. In a famous experiment, he used a falling weight to turn a paddle wheel in a container of water. He showed that the water warmed up by an amount that matched the energy lost from the weight's gravitational potential store. The unit of energy is named after him.",
              "Scientists have tested the law in countless experiments, from tiny particles to exploding stars, and it has never been broken. That is why we can use it as a tool: if we know how much energy went in, we know exactly how much must come out, even if some of it is hard to find.",
              "So when people say a device 'uses up' energy or 'makes' energy, they are speaking loosely. A phone does not destroy energy: it transfers energy from its battery's chemical store, and most of it ends up in the thermal store of the surroundings.",
            ],
          },
          {
            heading: "Following energy through a journey",
            text: [
              "Think about a toy car released at the top of a ramp. At the top, it is still and has energy in its gravitational potential store. As it rolls down, gravity does work on it, and energy is transferred from the gravitational potential store to the kinetic store. The car gets faster as it gets lower.",
              "If there were no friction or air resistance at all, every joule lost from the gravitational potential store would end up in the kinetic store. In reality, some energy is transferred by friction between the wheels and axles and between the car and the ramp, and by air resistance. This warms the car, the ramp and the air very slightly.",
              "A pendulum is another good example. At the top of each swing it stops for a moment: its kinetic store is empty and its gravitational potential store is at its fullest. At the bottom, the opposite is true. Energy swaps back and forth between the two stores with every swing.",
              "We can show these changes with a bar chart for each moment of the journey, sometimes called an energy bar chart. The bars change size, but if you add up all the bars at any moment, including the thermal store of the surroundings, the total is always the same.",
            ],
          },
          {
            heading: "Where does the energy go?",
            text: [
              "If energy is conserved, why does a bouncing ball bounce lower each time, and why does a pendulum eventually stop? The energy has not vanished. Each time the ball hits the floor it squashes and stretches, making a sound and warming up slightly. Air resistance also acts on it as it moves.",
              "These processes transfer energy to the thermal store of the ball, the floor and the air around them. The energy spreads out among a huge number of particles, so the temperature rise is far too small to notice. Scientists say the energy has been dissipated.",
              "Dissipated energy is still there, but it is spread so thinly that it is almost impossible to collect and use again. That is why a ball dropped from one metre can never bounce back higher than one metre: it would need more energy in its gravitational potential store than it started with, and that energy would have to come from nowhere.",
              "So the law of conservation of energy is not just a rule about totals: it helps us to explain and predict what we see. Whenever something seems to 'lose' energy, ask yourself which store it went into. The answer is very often the thermal store of the surroundings.",
            ],
          },
        ],
        words: [
          { word: "law of conservation of energy", meaning: "energy cannot be created or destroyed; it can only be transferred from one store to another" },
          { word: "work done", meaning: "energy transferred when a force moves an object" },
          { word: "friction", meaning: "a force that acts between surfaces that slide or try to slide over each other, transferring energy to thermal stores" },
          { word: "air resistance", meaning: "a type of friction that acts on objects moving through air" },
          { word: "dissipated", meaning: "spread out into the surroundings, usually into thermal stores, so it is hard to use again" },
        ],
      },
      practice: {
        intro: "Use the law of conservation of energy to explain what happens.",
        questions: [
          {
            type: "choice",
            q: "A ball has 10 J in its gravitational potential store at the top of a drop. Just before it hits the ground, 9 J is in its kinetic store. What has happened to the other 1 J?",
            options: ["It has been destroyed", "It has been transferred to thermal stores by air resistance", "It has stayed in the gravitational potential store", "It has turned into extra mass"],
            answer: 1,
          },
          {
            type: "order",
            q: "A pendulum is let go from one side. Put the moments in order.",
            items: [
              "Held still at the top: gravitational potential store at its fullest",
              "Swinging down: energy moving to the kinetic store",
              "At the bottom: kinetic store at its fullest",
              "Swinging up the other side: energy moving back to the gravitational potential store",
            ],
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "Energy cannot be ___ or ___. It can only be ___ from one store to another.",
            bank: ["created", "destroyed", "transferred", "measured", "stored"],
            answers: ["created", "destroyed", "transferred"],
          },
          {
            type: "type",
            q: "An electric motor is given 200 J. It transfers 150 J to the kinetic store of a fan. How many joules are transferred to other stores?",
            answer: ["50"],
            after: "J",
          },
          {
            type: "choice",
            q: "Which evidence best supports the idea that some energy is dissipated when a ball bounces?",
            options: ["The ball is round", "Each bounce is lower than the one before", "The ball falls faster as it drops", "The ball stops moving at the top of each bounce"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "The toy car ramp investigation",
        intro: "Investigate how the height of a ramp affects how far a toy car travels along the floor, and use the law of conservation of energy to explain your results.",
        need: [
          "A toy car that rolls freely",
          "A long, stiff board, tray or large hardback book to use as a ramp",
          "A pile of books of similar thickness",
          "A tape measure or metre ruler",
          "Paper and a pen for a results table",
          "A clear stretch of smooth floor",
        ],
        steps: [
          "Write a prediction: how will raising the ramp change the distance the car travels after it leaves the ramp? Give a reason using energy stores.",
          "Set up the ramp on one book. Measure the height of the top of the ramp from the floor. Mark a start line at the top of the ramp so you always release the car from the same place.",
          "Let the car go (do not push it) and measure how far it travels along the floor from the bottom of the ramp. Repeat three times and work out the mean distance.",
          "Add one book at a time and repeat, until you have results for at least five heights. Keep everything else the same: the same car, the same release point and the same floor. These are your control variables.",
          "Plot a line graph with ramp height on the x-axis and mean distance on the y-axis. Describe the pattern.",
          "Write a conclusion explaining your results using the words gravitational potential store, kinetic store, friction and dissipated. Why did the car eventually stop each time, and where did its energy go?",
        ],
      },
      exit: [
        {
          type: "choice",
          q: "Which statement is the law of conservation of energy?",
          options: [
            "Energy is used up when things move",
            "Energy cannot be created or destroyed, only transferred between stores",
            "Energy is always transferred to the kinetic store",
            "Energy can be made by burning fuels",
          ],
          answer: 1,
        },
        {
          type: "choice",
          q: "A toy car rolls down a ramp. Which energy transfer is the main one?",
          options: ["Kinetic store to gravitational potential store", "Chemical store to elastic potential store", "Gravitational potential store to kinetic store", "Thermal store to kinetic store"],
          answer: 2,
        },
        { type: "type", q: "A kettle is given 1,000 J. 900 J goes into the thermal store of the water. How many joules go elsewhere?", answer: ["100"], after: "J" },
        {
          type: "choice",
          q: "Why can a ball dropped from 1 metre never bounce higher than 1 metre on its own?",
          options: [
            "Gravity gets stronger after each bounce",
            "It would need more energy than it started with, and energy cannot be created",
            "The floor absorbs all of its energy",
            "Balls are too light to bounce high",
          ],
          answer: 1,
        },
        { type: "type", q: "What word describes energy that has spread out into the surroundings so it is hard to use again?", answer: ["dissipated", "dissipation", "wasted"] },
        {
          type: "pick",
          q: "A pendulum gradually stops swinging. Which are true? There is more than one.",
          options: ["Energy has been destroyed", "Air resistance transferred energy to the thermal store of the air", "The total energy is still the same", "The pendulum's gravitational potential store keeps growing"],
          answers: [1, 2],
        },
      ],
      grownUp: {
        need: ["A toy car", "A board, tray or hardback book as a ramp", "A pile of books", "A tape measure", "Some clear floor space"],
        tips: [
          "A common misconception is that energy is 'used up' or 'lost'. Gently push back each time: 'Where did it go?' The answer is almost always the thermal store of the surroundings.",
          "Repeating each measurement three times and taking a mean is a key KS3 skill. Ask your learner to spot and discuss any result that looks odd (an anomaly) rather than just ignoring it.",
          "If the car veers off sideways, a pair of rulers or books along the sides of the floor track can guide it.",
        ],
        younger: "Use just three ramp heights and focus on the idea: higher start, more energy in the gravitational potential store, more in the kinetic store at the bottom, so it goes further.",
        older: "Measure the mass of the car on kitchen scales and calculate the energy in its gravitational potential store at each height using GPE = m × g × h (g = 9.8 N/kg). Plot distance against GPE and comment on whether the relationship looks proportional.",
      },
    },
    {
      slug: "energy-stores-3",
      title: "Useful and wasted energy",
      emoji: "📊",
      minutes: 60,
      goal: "I can identify useful and wasted energy transfers, draw a Sankey diagram, and calculate efficiency as a percentage.",
      starter: [
        { type: "choice", q: "What does the law of conservation of energy say?", options: ["Energy is used up over time", "Energy cannot be created or destroyed", "Energy always ends up in the kinetic store"], answer: 1 },
        { type: "choice", q: "A toy car rolls down a ramp. Which store empties as it rolls?", options: ["Kinetic", "Gravitational potential", "Elastic potential"], answer: 1 },
        { type: "type", q: "A motor is given 500 J and transfers 400 J to its kinetic store. How many joules go to other stores?", answer: ["100"], after: "J" },
        { type: "choice", q: "Why does a bouncing ball bounce lower each time?", options: ["Energy is destroyed at each bounce", "Some energy is dissipated to thermal stores and by sound", "Gravity gets weaker"], answer: 1 },
        { type: "type", q: "Which force between surfaces transfers energy to thermal stores when things rub?", answer: ["friction"] },
        { type: "choice", q: "Where does dissipated energy usually end up?", options: ["In the chemical store of the object", "In the thermal store of the surroundings", "Back in the battery"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Useful and wasted energy",
            text: [
              "Every device is designed to transfer energy to a particular store. A kettle should transfer energy to the thermal store of the water; a fan should transfer energy to the kinetic store of its blades and the air. Energy that ends up where we want it is called useful energy.",
              "No real device is perfect. Some energy always ends up in stores we did not want, most often the thermal store of the device and its surroundings. A laptop gets warm, a car engine gets hot, and a phone charger feels warm to the touch. This is called wasted energy.",
              "Wasted energy is not destroyed: by the law of conservation of energy, useful energy + wasted energy = total energy supplied. Wasted energy is usually dissipated, spreading out into the surroundings, where it cannot easily be used again.",
              "Whether energy counts as useful or wasted depends on the job. A traditional filament light bulb transfers most of its energy by heating rather than as light, so for lighting it is very wasteful. But in an electric heater, energy transferred by heating is exactly what we want.",
            ],
          },
          {
            heading: "Sankey diagrams",
            text: [
              "A Sankey diagram is a picture of where energy goes. It is drawn as a thick arrow that starts on the left with the total energy supplied. The arrow then splits: the useful energy carries straight on to the right, and the wasted energy bends away, usually downwards.",
              "The key rule is that the width of each arrow is proportional to the amount of energy it represents. If 100 J goes in and 25 J comes out as useful light, the light arrow must be a quarter of the width of the input arrow. The widths of the output arrows always add up to the width of the input arrow, because energy is conserved.",
              "Sankey diagrams are named after Matthew Sankey, an Irish engineer, who drew one in 1898 to show how much of the energy from a steam engine's fuel was wasted. They are still used today by governments and engineers to show energy flows across whole countries.",
              "When you draw one on squared paper, choose a scale, such as one square for every 10 J, and label every arrow with its store and the number of joules.",
            ],
          },
          {
            heading: "Calculating efficiency",
            text: [
              "Efficiency tells us what fraction of the energy supplied to a device is transferred usefully. It is calculated with this equation: efficiency = (useful energy output ÷ total energy input) × 100. The answer is a percentage.",
              "For example, a lamp is supplied with 200 J of energy and gives out 40 J as light. Its efficiency = (40 ÷ 200) × 100 = 20%. The other 160 J, or 80%, is wasted, mostly by heating the lamp and the room.",
              "Because energy cannot be created, no device can ever be more than 100% efficient. Most real devices are much less: modern LED bulbs are several times more efficient at producing light than old filament bulbs, which transfer only about 5% of their energy as light. Large electric motors can reach over 90%.",
              "Engineers increase efficiency by reducing wasted transfers: oiling moving parts (lubrication) to reduce friction, shaping vehicles to reduce air resistance (streamlining), and using insulation to reduce unwanted heating of the surroundings. More efficient devices need less energy for the same job, which saves money and reduces the fuel burned in power stations.",
            ],
          },
        ],
        words: [
          { word: "useful energy", meaning: "energy transferred to the store we want, such as the thermal store of the water in a kettle" },
          { word: "wasted energy", meaning: "energy transferred to stores we do not want, usually the thermal store of the surroundings" },
          { word: "Sankey diagram", meaning: "a diagram of energy transfers in which the width of each arrow is proportional to the amount of energy" },
          { word: "efficiency", meaning: "the proportion of the energy supplied that is transferred usefully, often given as a percentage" },
          { word: "lubrication", meaning: "adding oil or grease between moving parts to reduce friction" },
          { word: "insulation", meaning: "a material that reduces energy transfer by heating" },
        ],
      },
      practice: {
        intro: "Useful, wasted, and how efficient.",
        questions: [
          {
            type: "match",
            q: "Match each device to its useful energy transfer.",
            pairs: [
              ["Electric kettle", "Thermal store of the water"],
              ["Electric fan", "Kinetic store of the blades and air"],
              ["Loudspeaker", "Carried away by sound waves"],
              ["Electric lift", "Gravitational potential store of the passengers"],
            ],
          },
          { type: "type", q: "A motor is supplied with 400 J and transfers 300 J usefully. What is its efficiency?", answer: ["75", "75%"], after: "%" },
          {
            type: "choice",
            q: "On a Sankey diagram, the input arrow is 10 squares wide. The useful arrow is 3 squares wide. How wide is the wasted arrow?",
            options: ["3 squares", "7 squares", "10 squares", "13 squares"],
            answer: 1,
          },
          {
            type: "choice",
            q: "A company claims its new motor is 110% efficient. Which statement best explains why this must be wrong?",
            options: [
              "Motors cannot be more than 50% efficient",
              "It would have to give out more energy than it was given, which breaks the law of conservation of energy",
              "Efficiency is never written as a percentage",
              "Motors only waste energy as sound",
            ],
            answer: 1,
          },
          {
            type: "pick",
            q: "Which changes would make a bicycle more efficient? There is more than one.",
            options: ["Oiling the chain", "Pumping the tyres up properly", "Riding with brakes slightly on", "Wearing a tight-fitting jacket to reduce air resistance"],
            answers: [0, 1, 3],
          },
        ],
      },
      task: {
        title: "How efficient is a bouncing ball?",
        intro: "When a ball is dropped, it starts with energy in its gravitational potential store. The height of its bounce tells you how much is still in that store afterwards. You will use this to calculate the efficiency of a bounce for different balls or surfaces.",
        need: [
          "Two or three different balls, such as a tennis ball, a rubber bouncy ball and a ping-pong ball",
          "A metre ruler or tape measure, fixed upright against a wall with sticky tack or tape",
          "A hard floor, and a rug or carpet to compare",
          "A helper, or a phone to film the bounce in slow motion (ask a grown-up first)",
          "Paper and a pen",
        ],
        steps: [
          "Because the energy in the gravitational potential store depends on height, for the same ball: efficiency of a bounce = (bounce height ÷ drop height) × 100.",
          "Drop the first ball from 100 cm, measured from the bottom of the ball. Let it go without throwing it. Your helper reads the height the bottom of the ball reaches on the first bounce. Filming in slow motion makes this much more accurate.",
          "Repeat three times and calculate the mean bounce height. Then work out the efficiency of the bounce as a percentage.",
          "Repeat for your other balls, and then for one ball on a different surface, such as a carpet. Record all your results in a table.",
          "Draw a Sankey diagram for your most efficient bounce, using one square for every 10% of the energy.",
          "Write a conclusion: which ball and which surface gave the most efficient bounce? Where did the wasted energy go? Suggest one source of error in your method and how you could reduce it.",
        ],
      },
      exit: [
        { type: "choice", q: "What is the useful energy transfer in a toaster?", options: ["Kinetic store of the toaster", "Thermal store of the bread", "Sound from the pop-up spring", "Light from the glowing wires"], answer: 1 },
        { type: "type", q: "A lamp is supplied with 100 J and gives out 15 J as light. What is its efficiency?", answer: ["15", "15%"], after: "%" },
        { type: "type", q: "A heater is supplied with 2,000 J and is 90% efficient. How many joules are transferred usefully?", answer: ["1800", "1,800"], after: "J" },
        {
          type: "choice",
          q: "On a Sankey diagram, what does the width of an arrow show?",
          options: ["How fast the energy moves", "The amount of energy transferred", "The temperature of the device", "How long the device has been on"],
          answer: 1,
        },
        {
          type: "choice",
          q: "Why does a more efficient appliance save money?",
          options: [
            "It needs less energy supplied to do the same useful job",
            "It creates extra energy for free",
            "It never gets warm, so it lasts forever",
            "It runs on light instead of electricity",
          ],
          answer: 0,
        },
        { type: "pick", q: "Which are ways to reduce wasted energy? There is more than one.", options: ["Lubrication", "Streamlining", "Adding more friction", "Insulation"], answers: [0, 1, 3] },
      ],
      grownUp: {
        need: ["Two or three different balls", "A metre ruler or tape measure", "Sticky tack or tape", "A phone for slow-motion filming (optional)"],
        tips: [
          "The bounce-height method works because, for the same ball, the energy in the gravitational potential store is proportional to height. It ignores the energy in the ball's kinetic store at the very top (which is zero) so it is a fair method.",
          "Reading a moving ball by eye is hard. Slow-motion phone video is a real scientific improvement; encourage your learner to explain why in their evaluation.",
          "Check the efficiency calculations together. A common slip is dividing the total by the useful amount instead of the other way round: the answer must always be below 100%.",
        ],
        younger: "Give the equation with the numbers already in place for the first example, and use drop heights of 100 cm so the bounce height in cm is the efficiency in percent.",
        older: "Ask them to drop the ball from several heights (50, 100, 150 cm) and check whether the efficiency stays the same. Then calculate the energy in the ball's gravitational potential store before and after the bounce using GPE = m × g × h, with the ball's mass from kitchen scales.",
      },
    },
  ],
};
