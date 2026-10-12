import type { LessonUnit } from "@/lib/lessons";

/**
 * Light and waves, for ages 11 to 14 (KS3 physics). Practicals use a mirror, a glass of water, a torch, a slinky or
 * rope and other household things. Learners are reminded throughout never to look at the Sun.
 */
export const lightAndWaves: LessonUnit = {
  slug: "light-and-waves",
  title: "Light and waves",
  short: "Light",
  subject: "Science",
  ages: "11 to 14",
  emoji: "🌈",
  color: "#4A5D8C",
  summary: "Six KS3 physics lessons on transverse and longitudinal waves, how light travels, reflection, refraction and lenses, the eye, and colour and the electromagnetic spectrum, with practical investigations using a mirror, a torch and a glass of water.",
  cover: "/lessons/units/light-and-waves.jpg",
  lessons: [
    {
      slug: "light-and-waves-1",
      title: "What is a wave?",
      emoji: "🌊",
      minutes: 60,
      goal: "I can describe transverse and longitudinal waves, label amplitude, wavelength and frequency, and use the wave equation.",
      starter: [
        { type: "choice", q: "Which of these is a source of light?", options: ["The Moon", "A mirror", "A candle flame", "A white wall"], answer: 2 },
        { type: "choice", q: "How is a shadow formed?", options: ["An opaque object blocks light", "Light bends round an object", "A mirror reflects darkness", "Light is soaked up by the air"], answer: 0 },
        { type: "pick", q: "Which of these do we hear because of vibrations? There is more than one.", options: ["A plucked guitar string", "A drum being hit", "A torch beam", "Someone speaking"], answers: [0, 1, 3] },
        { type: "choice", q: "Why must you never look straight at the Sun, even with sunglasses?", options: ["It makes you sneeze", "Its light can permanently damage your eyes", "It is too faint to see", "It makes shadows disappear"], answer: 1 },
        { type: "type", q: "What do we call a material that lets almost all light pass straight through it, like clear glass?", answer: ["transparent"] },
        { type: "choice", q: "Which travels faster through air?", options: ["Sound", "Light", "They travel at the same speed"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Waves carry energy, not stuff",
            text: [
              "A wave is a disturbance that transfers energy from one place to another without transferring matter. Drop a stone into a pond and ripples spread outwards, but a leaf floating on the surface only bobs up and down; it is not carried to the edge. The energy travels, the water mostly stays where it is.",
              "Physicists sort waves into two families. Mechanical waves, such as sound, water waves and seismic waves from earthquakes, need a medium (a solid, liquid or gas) to travel through, because they pass from particle to particle. Electromagnetic waves, such as light, do not need a medium at all. That is why sunlight can cross the near-empty vacuum of space but sound cannot.",
              "The particles in a medium vibrate about a fixed position as the wave passes. Each particle nudges its neighbours, which nudge theirs, and the energy is handed along the line. Think of a Mexican wave in a stadium: the wave sweeps round the stands, but every spectator stays in their own seat.",
            ],
          },
          {
            heading: "Transverse and longitudinal",
            text: [
              "In a transverse wave, the vibrations are at right angles (perpendicular) to the direction the energy travels. Shake one end of a rope up and down and humps travel along it sideways. Ripples on water behave in a similar way, and all electromagnetic waves, including light, are transverse.",
              "In a longitudinal wave, the vibrations are parallel to the direction the energy travels. Push and pull one end of a slinky spring along its length and you will see bunched-up regions called compressions and stretched-out regions called rarefactions travelling down the spring. Sound is a longitudinal wave: a loudspeaker cone pushes air particles together and pulls them apart, sending compressions and rarefactions through the air to your ear.",
              "A useful test is to ask 'which way are the particles moving compared with the wave?' If they move across it, it is transverse. If they move back and forth along it, it is longitudinal.",
              "Some waves are both. Earthquakes send out longitudinal P-waves and transverse S-waves. S-waves cannot travel through liquids, and the fact that they do not pass through the Earth's core was key evidence that the outer core is liquid.",
            ],
          },
          {
            heading: "Measuring a wave",
            text: [
              "The amplitude of a wave is the maximum distance a point moves from its rest (undisturbed) position. On a diagram of a transverse wave, it is measured from the middle line to the top of a crest, not from crest to trough. A bigger amplitude means more energy: a louder sound or a brighter light.",
              "The wavelength is the distance from one point on a wave to the same point on the next wave, for example crest to crest or compression to compression. Its symbol is the Greek letter lambda (λ) and it is measured in metres.",
              "The frequency is the number of complete waves passing a point each second. It is measured in hertz (Hz): 1 Hz means one wave per second. The time for one complete wave to pass is called the period. A high-pitched sound has a high frequency; a deep, low sound has a low frequency.",
              "These quantities are linked by the wave equation: wave speed = frequency × wavelength, or v = f × λ. For example, a sound wave with a frequency of 340 Hz and a wavelength of 1 m travels at 340 × 1 = 340 metres per second, which is roughly the speed of sound in air. If the speed stays the same and the frequency goes up, the wavelength must get shorter.",
            ],
          },
        ],
        words: [
          { word: "wave", meaning: "a disturbance that transfers energy from place to place without transferring matter" },
          { word: "transverse wave", meaning: "a wave in which the vibrations are at right angles to the direction of energy transfer, such as light" },
          { word: "longitudinal wave", meaning: "a wave in which the vibrations are parallel to the direction of energy transfer, such as sound" },
          { word: "amplitude", meaning: "the maximum distance a point on a wave moves from its rest position" },
          { word: "wavelength", meaning: "the distance from one point on a wave to the same point on the next wave, in metres" },
          { word: "frequency", meaning: "the number of complete waves passing a point each second, measured in hertz (Hz)" },
        ],
      },
      practice: {
        intro: "Sort the waves, name the parts and try the wave equation.",
        questions: [
          {
            type: "match",
            q: "Match each word to its meaning.",
            pairs: [["Amplitude", "Maximum distance from the rest position"], ["Wavelength", "Distance from one crest to the next"], ["Frequency", "Number of waves passing a point each second"], ["Compression", "A region where particles are squashed together"]],
          },
          {
            type: "pick",
            q: "Which of these are transverse waves? There is more than one.",
            options: ["Light", "Sound in air", "Ripples on a pond", "Radio waves"],
            answers: [0, 2, 3],
          },
          {
            type: "choice",
            q: "A wave has a frequency of 50 Hz and a wavelength of 2 m. What is its speed?",
            options: ["25 m/s", "52 m/s", "100 m/s", "48 m/s"],
            answer: 2,
            why: "v = f × λ = 50 × 2 = 100 m/s.",
          },
          {
            type: "choice",
            q: "Which best explains why sound cannot travel through space but light can?",
            options: ["Space is too cold for sound", "Sound needs particles to pass vibrations along; light does not need a medium", "Light is louder than sound", "Sound is a transverse wave"],
            answer: 1,
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "In a ___ wave the particles vibrate parallel to the direction the energy travels. The stretched-out regions are called ___.",
            bank: ["longitudinal", "transverse", "rarefactions", "crests"],
            answers: ["longitudinal", "rarefactions"],
          },
        ],
      },
      task: {
        title: "Make waves and measure them",
        intro: "Use a slinky (or a long rope or skipping rope) to make both kinds of wave, then measure real ripples in a tray of water and calculate a wave speed.",
        need: ["A slinky spring, or a long rope or skipping rope", "A helper", "A baking tray or roasting tin", "A jug of water", "A ruler", "A phone or watch with a stopwatch", "Paper and pencil"],
        steps: [
          "Stretch the slinky along a smooth floor with a helper holding the far end (or tie a rope to a door handle). Move your end quickly from side to side once. Sketch what you see and label it 'transverse'.",
          "Now push your end forwards and pull it back once, along the line of the spring. Watch the compression travel. Sketch it and label a compression and a rarefaction. If you only have a rope, you can't make a longitudinal wave with it, so write a sentence explaining why.",
          "Make a steady transverse wave. Then shake faster without changing how far you move your hand. What happens to the wavelength? Then shake further each time at the same speed. What changes now? Record both results.",
          "Pour about 1 cm of water into the tray and let it settle. Tap one end gently with a pencil, once. Time how long the ripple takes to reach the other end and measure the tray's length. Repeat three times and find the mean time.",
          "Calculate the speed of the ripple: speed = distance ÷ time. Give your answer in cm per second.",
          "Write a short conclusion: what did changing the frequency do to the wavelength, and why does the wave equation predict this? Mention one source of error in your timing and how you could reduce it.",
        ],
      },
      exit: [
        { type: "choice", q: "What does a wave transfer from place to place?", options: ["Matter", "Air", "Energy", "Water"], answer: 2 },
        { type: "choice", q: "Sound is an example of which kind of wave?", options: ["Transverse", "Electromagnetic", "Longitudinal"], answer: 2 },
        { type: "type", q: "What is the unit of frequency?", answer: ["hertz", "Hz", "hz", "Hertz"] },
        {
          type: "choice",
          q: "On a diagram of a transverse wave, where is the amplitude measured?",
          options: ["From a crest down to the next trough", "From one crest to the next crest", "From the rest line up to the top of a crest", "Along the whole length of the wave"],
          answer: 2,
        },
        {
          type: "type",
          q: "A wave has a frequency of 10 Hz and a wavelength of 3 m. What is its speed in m/s?",
          answer: ["30", "30 m/s", "30m/s"],
          after: "m/s",
          why: "v = f × λ = 10 × 3 = 30 m/s.",
        },
        {
          type: "choice",
          q: "A wave's speed stays the same but its frequency doubles. What happens to its wavelength?",
          options: ["It halves", "It doubles", "It stays the same", "It becomes zero"],
          answer: 0,
          why: "v = f × λ. If v is fixed and f doubles, λ must halve.",
        },
      ],
      grownUp: {
        need: ["A slinky or long rope", "A baking tray and water", "A ruler and a stopwatch (a phone is fine)"],
        tips: [
          "Learners often confuse amplitude with the full crest-to-trough height. Ask them to point to the rest line first, then measure from it.",
          "The wave equation is the first piece of real physics algebra in this unit. Encourage them always to write the equation, then substitute the numbers, then give the unit.",
          "Wipe up any spilled water from the floor straight away, especially on hard surfaces.",
        ],
        younger: "Focus on the two kinds of wave with the slinky and the 'Mexican wave' idea. Draw one transverse wave together and label just the wavelength and amplitude, and skip the calculation if it causes stress.",
        older: "Rearrange v = f × λ to find f and λ. Then research why the speed of sound is faster in water and steel than in air, using ideas about particles.",
      },
    },
    {
      slug: "light-and-waves-2",
      title: "How light travels",
      emoji: "🔦",
      minutes: 60,
      goal: "I can explain that light travels in straight lines at very high speed, use ray diagrams, and describe how a pinhole camera forms an image.",
      starter: [
        { type: "choice", q: "What does a wave transfer?", options: ["Particles", "Water", "Heat only", "Energy"], answer: 3 },
        { type: "choice", q: "In a transverse wave, how do the vibrations compare with the direction of energy transfer?", options: ["Parallel", "At right angles", "Opposite", "There are no vibrations"], answer: 1 },
        { type: "type", q: "What is the unit of frequency?", answer: ["hertz", "Hz", "hz", "Hertz"] },
        { type: "choice", q: "What is the wave equation?", options: ["v = f + λ", "v = f ÷ λ", "v = f × λ", "v = λ ÷ f"], answer: 2 },
        { type: "pick", q: "Which of these need a medium to travel through? There is more than one.", options: ["Sound", "Light", "Water waves", "Seismic waves"], answers: [0, 2, 3] },
        { type: "choice", q: "What is the distance from one crest to the next called?", options: ["Amplitude", "Frequency", "Period", "Wavelength"], answer: 3 },
      ],
      learn: {
        cards: [
          {
            heading: "Luminous and non-luminous",
            text: [
              "A luminous object gives out its own light: the Sun and other stars, flames, light bulbs and screens. A non-luminous object does not; we see it only because light from a luminous source bounces off it and into our eyes. The Moon is non-luminous. Moonlight is sunlight reflected from the Moon's rocky surface.",
              "When light reaches a material, three things can happen. It can be transmitted (pass through), reflected (bounce off) or absorbed (taken in, usually warming the material). Most materials do a mixture of all three.",
              "Transparent materials, such as clear glass and water, transmit light in straight lines, so you can see clearly through them. Translucent materials, such as frosted glass or tracing paper, transmit light but scatter it, so you see only blurred shapes. Opaque materials, such as wood and metal, transmit no light, which is why they cast shadows.",
            ],
          },
          {
            heading: "Straight lines and ray diagrams",
            text: [
              "In a uniform material, light travels in straight lines. You can see this in a sunbeam through a dusty window or a torch beam in fog: the edges are sharp and straight. The sharp edges of shadows are more evidence; if light curved round objects easily, shadows would be fuzzy blobs.",
              "Physicists model light with rays: straight lines with an arrow showing the direction the light travels. A ray diagram is a model, not a picture. Real light spreads out in all directions from a source, but we draw just the few rays we need to explain what is happening. Always use a ruler, and always put the arrows on.",
              "A pinhole camera is a strong test of the straight-line idea. Light from the top of an object travels in a straight line through a tiny hole and lands at the bottom of a screen; light from the bottom lands at the top. So the image is inverted (upside down) and also reversed left to right. Moving the screen further from the hole makes the image bigger but dimmer, because the same light is spread over a larger area.",
              "A bigger hole lets in more light, so the image is brighter, but it is also blurrier, because light from each point on the object can now land on a small patch of the screen instead of a single point. This trade-off between brightness and sharpness is one reason real cameras use lenses.",
            ],
          },
          {
            heading: "The fastest thing there is",
            text: [
              "Light travels through a vacuum at about 300,000 kilometres per second (3 × 10⁸ m/s). Nothing carries energy or information faster. In one second, light could travel round the Earth about seven and a half times.",
              "Light is slightly slower in air, and noticeably slower in water (about 225,000 km/s) and glass (about 200,000 km/s). This change of speed between materials causes refraction, which you will study in lesson 4.",
              "Sound, by comparison, crawls along at about 340 metres per second in air, roughly a million times slower. That is why you see lightning before you hear thunder. Count the seconds between the flash and the rumble and divide by three to estimate the distance in kilometres.",
              "Because space is so vast, astronomers measure distance in light years: the distance light travels in one year, about 9.5 million million kilometres. Light from the Sun takes about 8 minutes to reach us, and light from the nearest other star, Proxima Centauri, takes over 4 years. When you look at the night sky, you are seeing stars as they were when their light set off.",
            ],
          },
        ],
        words: [
          { word: "luminous", meaning: "giving out its own light, like a star, a flame or a bulb" },
          { word: "transparent", meaning: "transmitting light in straight lines, so you can see clearly through it" },
          { word: "translucent", meaning: "transmitting light but scattering it, so you cannot see clearly through it" },
          { word: "opaque", meaning: "not transmitting any light; an opaque object casts a shadow" },
          { word: "ray", meaning: "a straight line with an arrow, used to model the path and direction of light" },
          { word: "light year", meaning: "the distance light travels in one year, about 9.5 million million kilometres; a distance, not a time" },
        ],
      },
      practice: {
        intro: "Materials, rays and the speed of light.",
        questions: [
          {
            type: "match",
            q: "Match each material to how it treats light.",
            pairs: [["Clear window glass", "Transparent"], ["Tracing paper", "Translucent"], ["A wooden door", "Opaque"]],
          },
          {
            type: "choice",
            q: "Which observation is the best evidence that light travels in straight lines?",
            options: ["Light is very fast", "Shadows have sharp edges", "The Sun is hot", "Mirrors are shiny"],
            answer: 1,
          },
          {
            type: "pick",
            q: "Which of these are luminous? There is more than one.",
            options: ["A candle flame", "The Moon", "A phone screen that is switched on", "A bicycle reflector"],
            answers: [0, 2],
          },
          {
            type: "choice",
            q: "You see lightning and hear the thunder 6 seconds later. About how far away is the storm?",
            options: ["About 6 km", "About 2 km", "About 18 km", "About 0.5 km"],
            answer: 1,
            why: "Sound travels about 1 km every 3 seconds, so 6 ÷ 3 = 2 km.",
          },
          {
            type: "order",
            q: "Put these in order of the speed light travels through them, fastest first.",
            items: ["A vacuum", "Water", "Glass"],
          },
        ],
      },
      task: {
        title: "Build a pinhole camera",
        intro: "Make a pinhole camera from a tube or box and use it to test predictions about how light travels.",
        need: ["A cardboard crisp tube, a long box or a kitchen-roll tube", "Kitchen foil", "Greaseproof or tracing paper", "Sticky tape and an elastic band", "A drawing pin or sewing pin (with a grown-up)", "Scissors (with a grown-up)", "Black paper or a dark tea towel", "Three index cards, a hole punch and some modelling clay"],
        steps: [
          "Straight-line test first: punch a hole in the same place on three cards. Stand them up in modelling clay in a row and shine a torch through the holes onto a wall. Now slide the middle card sideways by 1 cm. Record what happens and explain it with a ray diagram.",
          "For the camera, with a grown-up, cut the tube in two about 5 cm from the closed end. Tape greaseproof paper across the cut end of the short piece to make a screen, then tape the two pieces back together with the screen in the middle.",
          "Cover the open end with foil and hold it tight with an elastic band. With a grown-up, make one small, neat hole in the centre of the foil with a pin.",
          "Wrap black paper or a towel round the end you look through to keep out stray light. Point the camera at a bright window or lamp from indoors, never at the Sun, and look at the screen. Draw what you see. Which way up is the image?",
          "Predict, then test: what happens to the image if you make the hole bigger? Make a second, larger hole beside the first and compare by covering each in turn. Record brightness and sharpness.",
          "Draw a ray diagram, with a ruler, showing why the image is upside down. Write a paragraph explaining your results using the words 'straight lines', 'inverted' and 'ray'.",
        ],
      },
      exit: [
        { type: "choice", q: "Why can we see the Moon?", options: ["It gives out its own light", "It is made of glass", "It glows because it is hot", "It reflects light from the Sun"], answer: 3 },
        { type: "type", q: "A material that lets no light through is called ___.", answer: ["opaque"] },
        { type: "choice", q: "About how fast does light travel through a vacuum?", options: ["340 m/s", "300 km/s", "300,000 km/s", "3,000,000 km/h"], answer: 2 },
        {
          type: "choice",
          q: "Why is the image in a pinhole camera upside down?",
          options: ["Light travels in straight lines, so rays from the top cross over to the bottom", "The pinhole flips the light like a mirror", "The screen is upside down", "Light slows down in the tube"],
          answer: 0,
        },
        {
          type: "choice",
          q: "What happens to a pinhole camera image if you make the hole bigger?",
          options: ["Brighter but blurrier", "Dimmer and sharper", "It turns the right way up", "Nothing changes"],
          answer: 0,
        },
        {
          type: "choice",
          q: "What does a light year measure?",
          options: ["Time", "Distance", "Speed", "Brightness"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["A crisp tube or box, foil, greaseproof paper, tape", "A pin and scissors (supervise both)", "Three index cards, a hole punch and modelling clay", "A torch"],
        tips: [
          "Supervise the cutting and pin-pricking. A craft knife is not needed; scissors are enough for a cardboard tube.",
          "The camera works best pointing at a bright window from inside a dim room. Repeat firmly: never point it at the Sun or look at the Sun.",
          "'A light year is a time' is a very common mistake. Keep asking 'how far does light go in a year?'",
        ],
        younger: "Do the three-card test together and talk through the result, then build the camera and simply describe what is upside down. Draw one ray from the top of the object through the hole together.",
        older: "Calculate how long light takes to travel from the Moon (384,000 km) and from the Sun (150 million km) using time = distance ÷ speed. Then find out how Ole Rømer first estimated the speed of light in the 1670s from the moons of Jupiter.",
      },
    },
    {
      slug: "light-and-waves-3",
      title: "Reflection",
      emoji: "🪞",
      minutes: 60,
      goal: "I can state the law of reflection, draw accurate ray diagrams for a plane mirror, and explain the difference between specular and diffuse reflection.",
      starter: [
        { type: "choice", q: "Which of these is luminous?", options: ["The Moon", "A mirror", "A lit candle", "A white page"], answer: 2 },
        { type: "type", q: "What do we call a material that scatters light so you can't see clearly through it?", answer: ["translucent"] },
        { type: "choice", q: "About how fast does light travel in a vacuum?", options: ["340 m/s", "300,000 km/s", "3,000 km/s", "30 km/s"], answer: 1 },
        { type: "choice", q: "What does a ray diagram use to show the direction light travels?", options: ["A wavy line", "A dotted line", "An arrow on a straight line", "A circle"], answer: 2 },
        { type: "pick", q: "What can happen to light when it reaches a material? There is more than one.", options: ["It is reflected", "It is absorbed", "It is transmitted", "It turns into sound"], answers: [0, 1, 2] },
        { type: "choice", q: "Why do you see lightning before you hear the thunder?", options: ["Light travels much faster than sound", "Thunder happens later", "Your eyes work faster than your ears", "Sound travels in curves"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "The law of reflection",
            text: [
              "When light hits a smooth, shiny surface such as a mirror, it bounces off in a predictable way. To describe it, physicists draw the normal: a dashed line at right angles (90°) to the surface at the point where the ray hits.",
              "The ray arriving at the mirror is the incident ray, and the angle between it and the normal is the angle of incidence (i). The ray leaving the mirror is the reflected ray, and the angle between it and the normal is the angle of reflection (r).",
              "The law of reflection states that the angle of incidence equals the angle of reflection: i = r. The incident ray, the reflected ray and the normal also all lie in the same flat plane.",
              "Always measure the angles from the normal, not from the mirror surface. A ray that hits a mirror at 30° to the surface has an angle of incidence of 60°, because 90° − 30° = 60°. Getting this wrong is the most common mistake in reflection questions.",
            ],
          },
          {
            heading: "Specular and diffuse reflection",
            text: [
              "When parallel rays hit a very smooth surface such as a mirror, still water or polished metal, every ray meets the surface at the same angle, so they all reflect at the same angle and stay parallel. This is specular reflection, and it produces a clear image.",
              "Most surfaces, such as paper, skin, wood and painted walls, look smooth but are rough on a microscopic scale. Parallel rays hit tiny bumps facing in many different directions. Each ray still obeys the law of reflection, but the normals point every which way, so the reflected rays scatter in all directions. This is diffuse reflection, and it produces no image.",
              "Diffuse reflection is actually how we see almost everything around us. Light from a lamp scatters off this page, a face or a chair in all directions, so some of it reaches your eyes wherever you stand. If everything reflected like a mirror, you would see reflections of the lamp, not the objects themselves.",
            ],
          },
          {
            heading: "Images in a plane mirror",
            text: [
              "A plane mirror is a flat mirror. When you look into one, your brain assumes light has travelled to your eye in a straight line, so it traces the reflected rays straight backwards. They seem to come from a point behind the mirror. That is where you see the image.",
              "The image in a plane mirror is the same size as the object, the same distance behind the mirror as the object is in front, and upright. It is also laterally inverted: left and right appear swapped, which is why the word AMBULANCE is printed backwards on the front of ambulances, so drivers read it correctly in their mirrors.",
              "The image is called a virtual image, because no light actually travels to the place behind the mirror where it seems to be. You cannot catch a virtual image on a screen. A real image, like the one in a pinhole camera, is formed where light rays actually meet, and it can be projected onto a screen.",
              "Mirrors are used in periscopes, car wing mirrors and dentists' tools. A periscope uses two plane mirrors, each at 45°, to turn light through 90° twice, so you can see over a wall.",
            ],
          },
        ],
        words: [
          { word: "normal", meaning: "an imaginary line drawn at 90° to a surface where a ray hits it; angles are measured from it" },
          { word: "angle of incidence", meaning: "the angle between the incident ray and the normal" },
          { word: "angle of reflection", meaning: "the angle between the reflected ray and the normal" },
          { word: "specular reflection", meaning: "reflection from a smooth surface, where parallel rays stay parallel and an image forms" },
          { word: "diffuse reflection", meaning: "reflection from a rough surface, where light scatters in many directions and no image forms" },
          { word: "virtual image", meaning: "an image that light rays only appear to come from; it cannot be shown on a screen" },
        ],
      },
      practice: {
        intro: "Angles, surfaces and images.",
        questions: [
          {
            type: "type",
            q: "A ray hits a plane mirror with an angle of incidence of 35°. What is the angle of reflection?",
            answer: ["35", "35°", "35 degrees"],
            after: "°",
          },
          {
            type: "choice",
            q: "A ray strikes a mirror at 20° to the mirror's surface. What is the angle of incidence?",
            options: ["20°", "40°", "70°", "90°"],
            answer: 2,
            why: "Angles are measured from the normal, which is at 90° to the surface: 90° − 20° = 70°.",
          },
          {
            type: "match",
            q: "Match each surface to the type of reflection.",
            pairs: [["A bathroom mirror", "Specular"], ["A sheet of paper", "Diffuse"]],
          },
          {
            type: "pick",
            q: "Which describe the image in a plane mirror? There is more than one.",
            options: ["Same size as the object", "Upside down", "Virtual", "Laterally inverted"],
            answers: [0, 2, 3],
          },
          {
            type: "choice",
            q: "Which best explains why you can't see your reflection in a white wall?",
            options: ["The wall absorbs all the light", "The wall's rough surface scatters reflected light in all directions", "Walls do not obey the law of reflection", "The wall is transparent"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Testing the law of reflection",
        intro: "Investigate whether the angle of incidence really equals the angle of reflection, using a torch, a mirror and a protractor.",
        need: ["A small flat mirror", "A torch", "Thick card and scissors, or a comb", "Sticky tape", "A protractor and a ruler", "Plain A4 paper and a sharp pencil", "Modelling clay or a book to prop the mirror", "A dim room"],
        steps: [
          "Make a narrow beam: cut a thin slit (about 2 mm wide) in a piece of card and tape it over the torch, or shine the torch through the gaps in a comb and use one ray. Ask a grown-up to help with the cutting.",
          "Draw a straight line across the middle of your paper and stand the mirror upright along it. Use the protractor to draw a normal at 90° to the line, from the middle of the mirror.",
          "Draw lines from the point where the normal meets the mirror at 15°, 30°, 45°, 60° and 75° to the normal. These are your incident rays.",
          "In a dim room, shine the beam along each line in turn so it hits the mirror where the normal starts. Mark two dots along the reflected beam, then remove the mirror and join the dots with a ruler.",
          "Measure each angle of reflection from the normal and record your results in a table with columns for angle of incidence and angle of reflection. Draw a scatter graph with angle of incidence on the x-axis.",
          "Write a conclusion: does your data support the law of reflection? Suggest why some results are a degree or two out (think about the width of the beam and reading the protractor) and one way to improve accuracy.",
        ],
      },
      exit: [
        { type: "choice", q: "What does the law of reflection state?", options: ["The angle of incidence is double the angle of reflection", "The angle of incidence equals the angle of reflection", "Light always reflects at 90°", "The reflected ray goes back the way it came"], answer: 1 },
        { type: "choice", q: "From which line are the angles of incidence and reflection measured?", options: ["The mirror surface", "The incident ray", "The normal", "The floor"], answer: 2 },
        { type: "type", q: "A ray hits a mirror at 25° to the surface. What is the angle of reflection?", answer: ["65", "65°", "65 degrees"], after: "°" },
        {
          type: "choice",
          q: "What type of reflection lets you see a clear image?",
          options: ["Diffuse", "Specular", "Absorbed", "Transmitted"],
          answer: 1,
        },
        {
          type: "choice",
          q: "You stand 2 m in front of a plane mirror. Where does your image appear?",
          options: ["On the surface of the mirror", "1 m behind the mirror", "2 m behind the mirror", "4 m behind the mirror"],
          answer: 2,
        },
        {
          type: "choice",
          q: "Why is the image in a plane mirror called virtual?",
          options: ["It is upside down", "It is smaller than the object", "It only appears on screens", "Light does not actually come from where the image seems to be, so it can't be shown on a screen"],
          answer: 3,
        },
      ],
      grownUp: {
        need: ["A small flat mirror", "A torch and card or a comb", "A protractor and ruler"],
        tips: [
          "A dim room makes the narrow beam much easier to see. A phone torch works if it is covered with a card slit.",
          "Check that angles are measured from the normal every time. If results come out as roughly 90° minus the expected value, that is what has gone wrong.",
          "Handle the mirror carefully; a mirror tile or make-up mirror with no sharp edges is safest.",
        ],
        younger: "Do just three angles (20°, 40°, 60°) and focus on spotting that the two angles match. Practise drawing the normal before measuring anything.",
        older: "Find out how a concave mirror (like a shaving mirror) can form a real, upside-down image, and why satellite dishes and car headlights use curved reflectors.",
      },
    },
    {
      slug: "light-and-waves-4",
      title: "Refraction and lenses",
      emoji: "🔍",
      minutes: 60,
      goal: "I can explain refraction as a change in speed, predict which way light bends, and describe how convex and concave lenses change rays of light.",
      starter: [
        { type: "choice", q: "What is the normal?", options: ["A line at 90° to a surface where a ray hits", "A ray that reflects back", "The surface of the mirror", "The brightest ray"], answer: 0 },
        { type: "type", q: "If the angle of incidence is 50°, what is the angle of reflection?", answer: ["50", "50°", "50 degrees"], after: "°" },
        { type: "choice", q: "Which type of reflection happens from a sheet of paper?", options: ["Specular", "Diffuse", "Virtual", "Total"], answer: 1 },
        { type: "choice", q: "You stand 3 m from a mirror. How far from you is your image?", options: ["3 m", "1.5 m", "9 m", "6 m"], answer: 3 },
        { type: "pick", q: "Which describe the image in a plane mirror? There is more than one.", options: ["Virtual", "Inverted (upside down)", "Same size", "Laterally inverted"], answers: [0, 2, 3] },
        { type: "choice", q: "In which material does light travel slowest?", options: ["A vacuum", "Air", "Glass"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Why light bends",
            text: [
              "Refraction is the change in direction of light as it passes from one transparent material into another at an angle. It happens because light travels at different speeds in different materials: fastest in a vacuum, almost as fast in air, slower in water and slower still in glass.",
              "Picture a toy car rolling at an angle from a smooth floor onto a carpet. One front wheel reaches the carpet first and slows down while the other is still moving quickly, so the car swings round. A wavefront of light does the same thing at the boundary between air and glass.",
              "Rule one: when light slows down, going from air into glass or water, it bends towards the normal. Rule two: when light speeds up, going from glass or water into air, it bends away from the normal. Rule three: a ray that hits the boundary along the normal (at 90° to the surface) changes speed but does not change direction.",
              "Refraction also changes wavelength. The frequency of light stays the same when it enters a new material, so if its speed goes down, its wavelength must get shorter, just as the wave equation v = f × λ predicts.",
            ],
          },
          {
            heading: "Refraction in everyday life",
            text: [
              "Put a pencil in a glass of water and look from the side: it seems bent or broken at the surface. Light from the underwater part of the pencil bends away from the normal as it leaves the water, and your brain traces it back in a straight line to a place where the pencil isn't.",
              "For the same reason, swimming pools and ponds look shallower than they really are. Light from the bottom bends away from the normal as it leaves the water, so the bottom appears raised. This misjudgement has led to accidents, which is one reason never to dive into water you don't know.",
              "Light passing through a rectangular glass block bends towards the normal on the way in and away from it by the same amount on the way out, so it leaves parallel to how it entered, just shifted sideways. A triangular prism is different: both bends turn the light the same way, so it comes out travelling in a new direction.",
            ],
          },
          {
            heading: "Convex and concave lenses",
            text: [
              "A lens is a shaped piece of transparent material that refracts light to form an image. A convex (converging) lens is thicker in the middle than at the edges. It bends parallel rays inwards so they meet at a point called the principal focus or focal point. The distance from the centre of the lens to the focal point is the focal length.",
              "A fatter, more curved convex lens bends light more strongly, so it has a shorter focal length. Convex lenses are used in magnifying glasses, cameras, projectors and the human eye. Used close to an object, a convex lens makes a magnified, upright, virtual image; used to focus light from a distant object, it makes a real, inverted image that can be caught on a screen.",
              "A concave (diverging) lens is thinner in the middle than at the edges. It spreads parallel rays out so they seem to come from a focal point on the same side as the light arrived from. Concave lenses always form smaller, upright, virtual images, and they are used to correct short sight.",
              "A round glass of water acts like a convex lens in one direction. Place a drawing of an arrow behind it and move it back: at a certain distance the arrow suddenly appears to flip. That flip is the real, inverted image forming once the object is beyond the focal point.",
            ],
          },
        ],
        words: [
          { word: "refraction", meaning: "the change in direction of light as it passes from one material to another at an angle, caused by a change in speed" },
          { word: "convex lens", meaning: "a lens thicker in the middle that converges parallel rays to a focal point" },
          { word: "concave lens", meaning: "a lens thinner in the middle that makes parallel rays diverge" },
          { word: "focal point", meaning: "the point where parallel rays meet, or seem to come from, after passing through a lens" },
          { word: "focal length", meaning: "the distance from the centre of a lens to its focal point" },
          { word: "real image", meaning: "an image formed where light rays actually meet; it can be projected onto a screen" },
        ],
      },
      practice: {
        intro: "Predict the bend and choose the lens.",
        questions: [
          {
            type: "choice",
            q: "A ray of light passes at an angle from air into water. Which way does it bend?",
            options: ["Away from the normal, because it speeds up", "Towards the normal, because it slows down", "It doesn't bend", "Back the way it came"],
            answer: 1,
          },
          {
            type: "choice",
            q: "A ray hits a glass block along the normal. What happens?",
            options: ["It bends towards the normal", "It bends away from the normal", "It changes speed but carries straight on", "It is all reflected"],
            answer: 2,
          },
          {
            type: "match",
            q: "Match each lens to its description.",
            pairs: [["Convex lens", "Thicker in the middle; converges light"], ["Concave lens", "Thinner in the middle; diverges light"]],
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "When light enters glass from air its speed ___ and its frequency ___, so its wavelength gets shorter.",
            bank: ["decreases", "increases", "stays the same", "doubles"],
            answers: ["decreases", "stays the same"],
          },
          {
            type: "choice",
            q: "Which best explains why a pond looks shallower than it really is?",
            options: ["Water magnifies everything", "Light from the bottom bends away from the normal as it leaves the water, so the bottom appears higher", "Light reflects off the surface", "Water absorbs red light"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Kitchen refraction lab",
        intro: "Four short investigations with water and glass. Record each prediction before you test it, then explain the result using the words 'speed', 'normal' and 'refraction'.",
        need: ["A clear, straight-sided glass or jar", "Water", "A pencil", "A coin and an opaque mug", "A piece of paper and a felt-tip pen", "A magnifying glass if you have one", "A torch and a sheet of white paper", "A ruler"],
        steps: [
          "Bent pencil: stand a pencil in a glass half full of water. Look from the side, slightly above the water level. Sketch what you see and add a ray diagram showing light from the pencil bending as it leaves the water.",
          "Appearing coin: put a coin in the bottom of an empty mug. Move your head back until the coin just disappears behind the rim. Keep still while a helper slowly pours in water. Explain why the coin reappears.",
          "Flipping arrow: draw a bold arrow pointing right on paper. Hold it close behind a full round glass of water, then slowly move it further away. Record the distance at which the arrow appears to flip, and explain what kind of lens the glass is acting as.",
          "Focal length: in a dim room, hold a magnifying glass between a bright window and a sheet of white paper. Move it until you see a sharp, upside-down image of the window on the paper. Measure the distance from lens to paper with a ruler; this is roughly its focal length. Never use a lens to focus sunlight or point it at the Sun.",
          "Write up each test in a table: what you predicted, what you observed, and the scientific explanation.",
        ],
      },
      exit: [
        { type: "type", q: "What is the name for the bending of light as it passes from one material into another?", answer: ["refraction"] },
        { type: "choice", q: "What causes refraction?", options: ["Light changing speed", "Light changing colour", "Light reflecting off atoms", "The material being hot"], answer: 0 },
        { type: "choice", q: "Light passes at an angle from glass into air. Which way does it bend?", options: ["Towards the normal", "Away from the normal", "It doesn't bend", "It always goes along the surface"], answer: 1 },
        {
          type: "choice",
          q: "Which lens brings parallel rays of light together at a focal point?",
          options: ["Concave", "Convex", "A flat sheet of glass", "Any lens"],
          answer: 1,
        },
        {
          type: "choice",
          q: "Two convex lenses are made of the same glass. Lens A is much more curved than lens B. Which is true?",
          options: ["A has a shorter focal length", "A has a longer focal length", "They have the same focal length", "A is a concave lens"],
          answer: 0,
        },
        {
          type: "choice",
          q: "Why does a pencil look broken where it enters a glass of water?",
          options: ["The water bends the pencil", "The glass is curved like a mirror", "Water reflects all the light", "Light from the underwater part refracts as it leaves the water, so the pencil appears to be in a different place"],
          answer: 3,
        },
      ],
      grownUp: {
        need: ["A straight-sided glass and water", "A coin and a mug", "A magnifying glass if you have one"],
        tips: [
          "Magnifying glasses can focus sunlight enough to start a fire or damage eyes. Use them only indoors with window light or a lamp, and never let anyone aim one at the Sun or look at the Sun through one.",
          "The 'towards / away from the normal' rule is easiest remembered as 'slow down, bend towards'. Ask learners to say which material is slower before predicting.",
          "The safety point about ponds and pools looking shallower is worth a short conversation.",
        ],
        younger: "Do the bent pencil and appearing coin first and simply describe what happens, then link it to the toy-car-onto-carpet idea. One ray diagram is plenty.",
        older: "Research refractive index and Snell's law (n₁ sin θ₁ = n₂ sin θ₂). Then find out what total internal reflection is and how optical fibres use it to carry broadband signals.",
      },
    },
    {
      slug: "light-and-waves-5",
      title: "The eye and how we see",
      emoji: "👁️",
      minutes: 60,
      goal: "I can name the parts of the eye and their functions, explain how an image forms on the retina, and describe how glasses correct short and long sight.",
      starter: [
        { type: "choice", q: "What causes refraction?", options: ["A change in the speed of light", "Light reflecting", "Light being absorbed", "Light changing colour"], answer: 0 },
        { type: "choice", q: "Light goes from air into glass at an angle. Which way does it bend?", options: ["Away from the normal", "Towards the normal", "It doesn't bend"], answer: 1 },
        { type: "match", q: "Match each lens to what it does.", pairs: [["Convex", "Converges light"], ["Concave", "Diverges light"]] },
        { type: "type", q: "What is the distance from the centre of a lens to its focal point called?", answer: ["focal length", "the focal length"] },
        { type: "choice", q: "Which kind of image can be projected onto a screen?", options: ["A virtual image", "A real image", "Both", "Neither"], answer: 1 },
        { type: "choice", q: "A ray enters a glass block along the normal. What happens?", options: ["It bends towards the normal", "It bends away from the normal", "It carries straight on", "It reflects back"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Inside the eye",
            text: [
              "Your eye is a fluid-filled ball about 2.5 cm across. Light enters through the cornea, the clear, curved window at the front. The cornea does most of the refracting, bending light inwards as it enters the eye.",
              "Behind the cornea is the iris, the coloured ring of muscle, with a hole in the middle called the pupil. The pupil looks black because light goes in but very little comes back out. In bright light the iris makes the pupil smaller to protect the retina; in dim light it widens the pupil to let more light in. This is a reflex: it happens automatically, without you deciding.",
              "Next is the lens, a flexible, transparent convex lens. Ciliary muscles around it change its shape to fine-tune the focus. To focus on something near, the lens becomes fatter and more curved; to focus on something far away, it becomes thinner. This is called accommodation.",
              "At the back of the eye is the retina, a layer of light-sensitive cells. They change light energy into electrical impulses, which travel along the optic nerve to the brain. Where the optic nerve leaves the eye there are no light-sensitive cells at all, which creates a blind spot in each eye. You don't usually notice it because your brain fills in the gap.",
            ],
          },
          {
            heading: "From light to sight",
            text: [
              "The cornea and lens together act as a converging lens system, focusing light from an object onto the retina. Just as in a pinhole camera, rays from the top of the object land at the bottom of the retina, so the image on the retina is real, inverted and much smaller than the object.",
              "We don't see the world upside down because the brain processes the signals from the retina. Seeing is not just the eye recording a picture: the brain combines information from both eyes, fills in the blind spot and compares what it sees with what it expects. That is why optical illusions can trick us.",
              "The retina has two kinds of receptor cell. Rods are very sensitive to dim light but cannot detect colour, which is why everything looks grey in moonlight. Cones work in brighter light and detect colour. Most people have three types of cone, most sensitive to red, green and blue light, and the brain mixes their signals to make every colour we see. Colour blindness happens when one type of cone is missing or works differently.",
              "The eye and a camera are similar. Both have an aperture that controls how much light enters (the pupil and iris, or the camera's aperture), a lens to focus, and a light-sensitive surface (the retina, or a digital sensor).",
            ],
          },
          {
            heading: "Short sight, long sight and protecting your eyes",
            text: [
              "In short sight (myopia), a person sees near objects clearly but distant objects look blurred. The eyeball is too long, or the lens and cornea refract too strongly, so light from distant objects focuses in front of the retina. A concave lens in glasses or contact lenses spreads the rays out slightly first, so they focus on the retina.",
              "In long sight (hyperopia), distant objects are clear but near objects are blurred. The eyeball is too short, or the eye refracts too weakly, so light from near objects would focus behind the retina. A convex lens adds extra converging power so the rays focus on the retina. Many people become longer-sighted with age as the eye's lens becomes stiffer.",
              "Regular eye tests matter, because vision problems can creep up slowly. In the UK, eye tests are free on the NHS for under-16s and for under-19s in full-time education.",
              "Never look directly at the Sun, even briefly, with sunglasses, or during an eclipse. The cornea and lens focus the Sun's light onto a tiny spot on the retina, and that concentrated energy, including invisible ultraviolet and infrared, can burn the retina and cause permanent damage. The retina has no pain receptors, so you would not feel it happening.",
            ],
          },
        ],
        words: [
          { word: "cornea", meaning: "the clear, curved front of the eye, which does most of the refracting of light" },
          { word: "iris", meaning: "the coloured ring of muscle that changes the size of the pupil to control how much light enters" },
          { word: "lens", meaning: "the flexible convex lens inside the eye that changes shape to focus light on the retina" },
          { word: "retina", meaning: "the layer of light-sensitive cells (rods and cones) at the back of the eye" },
          { word: "optic nerve", meaning: "the nerve that carries electrical impulses from the retina to the brain" },
          { word: "accommodation", meaning: "the changing of the shape of the eye's lens to focus on near or distant objects" },
        ],
      },
      practice: {
        intro: "Parts, jobs and sight problems.",
        questions: [
          {
            type: "match",
            q: "Match each part of the eye to its job.",
            pairs: [["Cornea", "Does most of the refracting"], ["Iris", "Controls the size of the pupil"], ["Retina", "Contains rods and cones"], ["Optic nerve", "Carries impulses to the brain"]],
          },
          {
            type: "order",
            q: "Put these in the order light passes through them on its way into the eye.",
            items: ["Cornea", "Pupil", "Lens", "Retina"],
          },
          {
            type: "choice",
            q: "You walk from a dark room into bright sunshine. What does your iris do?",
            options: ["Makes the pupil larger", "Makes the pupil smaller", "Makes the lens fatter", "Nothing"],
            answer: 1,
          },
          {
            type: "choice",
            q: "Someone with short sight sees distant objects as blurred. Which best explains why, and how it is corrected?",
            options: ["Light focuses behind the retina; a concave lens", "Light focuses in front of the retina; a concave lens", "Light focuses in front of the retina; a convex lens", "The pupil is too small; a convex lens"],
            answer: 1,
          },
          {
            type: "pick",
            q: "Which statements about rods and cones are true? There is more than one.",
            options: ["Rods work well in dim light", "Rods detect colour", "Most people have three types of cone", "Cones are found in the optic nerve"],
            answers: [0, 2],
          },
        ],
      },
      task: {
        title: "Investigating your own eyes",
        intro: "Three safe experiments on your own eyes: find your blind spot, watch your pupil reflex, and test where in your vision you can see colour.",
        need: ["A sheet of white card or paper", "A thick black pen", "A ruler", "A mirror", "A room with a light you can switch on and off", "A helper", "Some coloured pens or pencils"],
        steps: [
          "Blind spot: draw a bold cross on the left of a card and a solid dot about 8 cm to its right, both about 5 mm across. Hold the card at arm's length, close your left eye and stare at the cross with your right eye. Slowly bring the card towards you. Measure the distance from your eye to the card when the dot vanishes. Repeat three times and find the mean.",
          "Explain in two sentences why the dot disappears and what your brain puts in its place.",
          "Pupil reflex: stand at a mirror in a dim room for a minute, then have a helper switch the main light on while you watch your pupils. Never shine a torch straight into an eye. Describe what happens and explain why it is useful.",
          "Colour vision: stare at a fixed point on the wall. Without moving your eyes, have a helper slowly bring a coloured pen in from the side of your head towards the front. Say 'now' when you can see the pen, and again when you can tell its colour. Try several colours.",
          "Use what you learned about rods and cones to explain why you can see movement at the edge of your vision before you can tell the colour. (Cones are packed tightly in the centre of the retina; the edges are mostly rods.)",
          "Draw and label a cross-section of the eye from memory, then check it against the Learn cards and correct it in a different colour.",
        ],
      },
      exit: [
        { type: "choice", q: "Which part of the eye contains light-sensitive cells?", options: ["Cornea", "Iris", "Retina", "Pupil"], answer: 2 },
        { type: "type", q: "Which nerve carries signals from the eye to the brain?", answer: ["optic nerve", "the optic nerve", "optic"] },
        { type: "choice", q: "What is the image on the retina like?", options: ["Upright and bigger than the object", "Inverted and smaller than the object", "Virtual and upright", "The same size as the object"], answer: 1 },
        {
          type: "choice",
          q: "Why does each eye have a blind spot?",
          options: ["The iris covers part of the retina", "The cornea is cloudy there", "There are no light-sensitive cells where the optic nerve leaves the eye", "The lens is too thin there"],
          answer: 2,
        },
        {
          type: "choice",
          q: "Which type of lens corrects long sight?",
          options: ["Concave", "Convex", "A flat lens", "A tinted lens"],
          answer: 1,
        },
        {
          type: "choice",
          q: "Why is looking at the Sun so dangerous to the eye?",
          options: ["The eye focuses the Sun's light onto a tiny spot on the retina, which can burn it", "The Sun's light makes the pupil too big", "Sunlight cools the cornea", "It only causes harm if you blink"],
          answer: 0,
        },
      ],
      grownUp: {
        need: ["White card and a black pen", "A mirror", "A helper"],
        tips: [
          "All the experiments here are harmless, but do not let anyone shine a torch or phone light straight into an eye. Switching the room light on is enough to show the pupil reflex.",
          "If the blind-spot test or colour test reveals something surprising, or your child mentions headaches or blurry vision, book an eye test; they are free for under-16s in the UK.",
          "Repeat the Sun safety message: no direct viewing ever, including during a partial eclipse, unless with proper certified eclipse viewers and adult supervision.",
        ],
        younger: "Focus on the four main parts (cornea, iris, lens, retina) and the blind-spot test. Label a simple diagram together and use the camera comparison.",
        older: "Draw ray diagrams showing short sight and long sight before and after correction. Then research how laser eye surgery reshapes the cornea, and how lens power is measured in dioptres.",
      },
    },
    {
      slug: "light-and-waves-6",
      title: "Colour and the electromagnetic spectrum",
      emoji: "🌈",
      minutes: 60,
      goal: "I can explain how a prism splits white light, predict how coloured filters and objects behave in coloured light, and place visible light in the electromagnetic spectrum.",
      starter: [
        { type: "choice", q: "Which part of the eye controls the size of the pupil?", options: ["Retina", "Cornea", "Optic nerve", "Iris"], answer: 3 },
        { type: "choice", q: "Which cells in the retina detect colour?", options: ["Rods", "Cones", "Nerves", "Lenses"], answer: 1 },
        { type: "type", q: "What is the clear front surface of the eye called?", answer: ["cornea", "the cornea"] },
        { type: "choice", q: "Which lens corrects short sight?", options: ["Convex", "Concave"], answer: 1 },
        { type: "choice", q: "Why do we have a blind spot?", options: ["The pupil is closed there", "The lens blocks it", "The iris is in the way", "No rods or cones where the optic nerve leaves"], answer: 3 },
        { type: "choice", q: "What does the eye's lens do to focus on a near object?", options: ["Gets fatter and more curved", "Gets thinner", "Moves out of the eye", "Turns darker"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Splitting white light",
            text: [
              "In 1666 Isaac Newton let a narrow beam of sunlight into a darkened room and passed it through a glass prism. A band of colours appeared on the opposite wall. He then used a second prism to recombine the colours into white light, showing that the prism was not adding colour to the light; white light is a mixture of colours all along.",
              "The band of colours is called the visible spectrum. In order it runs red, orange, yellow, green, blue, indigo, violet, a sequence often remembered as 'Richard Of York Gave Battle In Vain'. In reality the colours blend smoothly with no sharp edges.",
              "The colours separate because each one travels at a slightly different speed in glass, so each is refracted by a different amount. Violet light, with the shortest wavelength (about 400 nanometres), is refracted most. Red light, with the longest wavelength (about 700 nanometres), is refracted least. This splitting is called dispersion.",
              "A rainbow forms the same way. Sunlight is refracted as it enters raindrops, reflected off the back of each drop, and refracted again as it leaves, so the colours spread out. You only see a rainbow with the Sun behind you.",
            ],
          },
          {
            heading: "Filters and coloured objects",
            text: [
              "A coloured filter transmits light of its own colour and absorbs the rest. Shine white light through a red filter and only red light comes out; the other colours have been absorbed, not changed into red. Shine that red light at a blue filter and nothing gets through, because the blue filter absorbs red.",
              "Opaque objects have colour because they reflect some colours and absorb others. A green leaf in white light reflects green and absorbs most other colours. A white object reflects all colours equally; a black object absorbs nearly all of them, which is why dark clothes warm up quickly in sunshine.",
              "So the colour an object appears depends on the light shining on it. A red football shirt in white light looks red. Under pure blue light there is no red to reflect, so the shirt absorbs the blue and looks black. A white shirt under blue light looks blue, because it reflects whatever colour arrives.",
              "Light colours also add together. The primary colours of light are red, green and blue. Red and green light together look yellow, red and blue look magenta, green and blue look cyan, and all three together look white. Every screen you use makes all its colours from tiny red, green and blue dots. This is additive mixing, and it is different from mixing paints, which works by absorbing colours.",
            ],
          },
          {
            heading: "The electromagnetic spectrum",
            text: [
              "Visible light is only a small part of a much bigger family called the electromagnetic (EM) spectrum. All EM waves are transverse, can travel through a vacuum, and travel at the same speed in a vacuum: about 300,000 km/s. They differ in wavelength and frequency.",
              "In order of increasing frequency and decreasing wavelength, the spectrum runs: radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays. Radio waves can have wavelengths of many metres or even kilometres; gamma rays have wavelengths smaller than an atom. Higher frequency means each wave carries more energy.",
              "Each part has uses. Radio waves carry broadcasts; microwaves heat food and carry mobile phone and satellite signals; infrared is used in remote controls and thermal cameras; ultraviolet makes security marks glow; X-rays image bones; gamma rays sterilise medical equipment and treat some cancers.",
              "The higher-frequency waves can also be harmful. Ultraviolet from the Sun can cause sunburn, damage the eyes and increase the risk of skin cancer, which is why sunscreen, sunglasses and never looking at the Sun all matter. X-rays and gamma rays are ionising radiation that can damage cells, so their use in hospitals is carefully controlled and radiographers stand behind shielding.",
            ],
          },
        ],
        words: [
          { word: "spectrum", meaning: "the band of colours (or range of waves) produced when white light is split, from red to violet" },
          { word: "dispersion", meaning: "the splitting of white light into colours because each colour is refracted by a different amount" },
          { word: "filter", meaning: "a transparent coloured material that transmits its own colour of light and absorbs the others" },
          { word: "primary colours of light", meaning: "red, green and blue; mixed in different amounts they make all the colours we see, and together make white" },
          { word: "electromagnetic spectrum", meaning: "the family of transverse waves, from radio waves to gamma rays, that all travel at the speed of light in a vacuum" },
        ],
      },
      practice: {
        intro: "Spectra, filters and the EM family.",
        questions: [
          {
            type: "order",
            q: "Put the colours of the visible spectrum in order, starting with red.",
            items: ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
          },
          {
            type: "choice",
            q: "White light shines through a green filter. What comes out?",
            options: ["White light", "Green light", "All colours except green", "No light"],
            answer: 1,
          },
          {
            type: "choice",
            q: "A red apple is lit only by green light. What colour does it appear?",
            options: ["Red", "Green", "Black", "Yellow"],
            answer: 2,
            why: "There is no red light to reflect, and the apple absorbs the green, so almost no light reaches your eye.",
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "When white light passes through a prism, ___ light is refracted the most and ___ light is refracted the least.",
            bank: ["violet", "red", "green", "white"],
            answers: ["violet", "red"],
          },
          {
            type: "order",
            q: "Put these parts of the electromagnetic spectrum in order from lowest to highest frequency.",
            items: ["Radio waves", "Microwaves", "Infrared", "Visible light", "Ultraviolet", "X-rays", "Gamma rays"],
          },
        ],
      },
      task: {
        title: "Making and filtering spectra",
        intro: "Make your own spectrum with water or a CD, then investigate how colour filters and coloured objects behave in coloured light.",
        need: ["A glass of water and a sheet of white paper, or an old CD or DVD", "A torch", "Coloured cellophane or clear coloured sweet wrappers (red, green and blue if possible)", "Sticky tape or elastic bands", "Several small objects of different colours (a red sock, a green leaf, a white sheet of paper, a black pen)", "A dark room", "Card, a pencil and felt-tips for a colour spinner"],
        steps: [
          "Make a spectrum: on a sunny day, stand a glass of water on a windowsill so sunlight passes through it onto white paper on the floor; or in a dark room shine a torch at a CD and look at the reflection on a wall. Never look at the Sun itself, only at the paper or wall. Sketch the order of the colours you see.",
          "Make coloured torches by taping a layer or two of cellophane over the torch. In a dark room, shine red light on each object in turn and record its colour in a table. Repeat with green and blue light.",
          "Before each test, write a prediction using the rule 'an object reflects its own colour and absorbs the others'. Mark where your prediction was right or wrong.",
          "Shine the red torch through a green filter onto white paper, then through a blue filter. Explain your observations using the words 'transmit' and 'absorb'.",
          "Colour spinner: cut a 10 cm card circle, divide it into seven equal sections and colour them red, orange, yellow, green, blue, indigo and violet. Push a pencil through the centre and spin it fast. Describe what you see and link it to Newton's second prism.",
          "Write a paragraph explaining why a stage designer must think about the colour of the stage lights as well as the colour of the costumes.",
        ],
      },
      exit: [
        { type: "choice", q: "What did Newton show with his prism experiments?", options: ["Prisms add colour to light", "Light is a longitudinal wave", "White light is a mixture of colours", "Light travels in curves"], answer: 2 },
        { type: "type", q: "What is the name for the splitting of white light into colours?", answer: ["dispersion"] },
        { type: "choice", q: "A white shirt is lit only by red light. What colour does it appear?", options: ["White", "Black", "Red", "Cyan"], answer: 2 },
        {
          type: "choice",
          q: "Red light shines onto a blue filter. What happens?",
          options: ["Red light passes through", "Blue light comes out", "The filter absorbs the red light, so no light passes through", "Purple light comes out"],
          answer: 2,
        },
        {
          type: "pick",
          q: "Which are true of all electromagnetic waves? There is more than one.",
          options: ["They are transverse", "They travel at the same speed in a vacuum", "They need a medium to travel through", "They all have the same wavelength"],
          answers: [0, 1],
        },
        {
          type: "choice",
          q: "Which part of the electromagnetic spectrum has a higher frequency than visible light and causes sunburn?",
          options: ["Infrared", "Microwaves", "Radio waves", "Ultraviolet"],
          answer: 3,
        },
      ],
      grownUp: {
        need: ["A glass of water or an old CD", "A torch and coloured cellophane or sweet wrappers", "Card and felt-tips"],
        tips: [
          "The window-and-glass spectrum works best in strong low sunlight. Keep reminding your child to look only at the colours on the paper, never towards the Sun.",
          "Sweet wrappers are rarely pure colours, so results may be imperfect, for example a 'red' object looking dark red rather than black. That is a good discussion point about real filters.",
          "Learners often think a filter 'colours' the light. Keep using the words transmit and absorb: filters only ever take colours away.",
        ],
        younger: "Make the spectrum and colour spinner, and test only the red torch on three objects. Focus on 'objects reflect their own colour'.",
        older: "Research how infrared and ultraviolet were discovered (William Herschel in 1800, Johann Ritter in 1801) and write a short account of each experiment. Then explain why the sky is blue using the idea that shorter wavelengths are scattered more.",
      },
    },
  ],
};
