import type { LessonUnit } from "@/lib/lessons";

/** UK landscapes, for ages 11 to 14 (KS3 / S1 to S3 geography). Relief, rocks, weathering, glaciation, coasts and national parks, with examples from all four countries of the UK. */
export const ukLandscapes: LessonUnit = {
  slug: "uk-landscapes",
  title: "UK landscapes",
  short: "UK landscapes",
  subject: "Geography",
  ages: "11 to 14",
  emoji: "🏞️",
  color: "#5B6E4F",
  summary: "Six lessons on how the UK's landscapes were made and how they are used: relief and the upland/lowland divide, igneous, sedimentary and metamorphic rocks, weathering and erosion, glaciated uplands, coastal landforms, and managing national parks.",
  cover: "/lessons/units/uk-landscapes.jpg",
  lessons: [
    // ---------- Lesson 1 ----------
    {
      slug: "uk-landscapes-1",
      title: "Relief: the UK's uplands and lowlands",
      emoji: "⛰️",
      minutes: 60,
      goal: "I can describe the pattern of relief across the UK, explain the upland/lowland divide, and use data to show how relief affects climate and land use.",
      starter: [
        { type: "choice", q: "Which four countries make up the United Kingdom?", options: ["England, Scotland, Wales and Northern Ireland", "England, Scotland, Wales and Ireland", "Great Britain, England, Scotland and Wales"], answer: 0 },
        { type: "choice", q: "Which is the highest mountain in the UK?", options: ["Yr Wyddfa (Snowdon)", "Scafell Pike", "Ben Nevis", "Slieve Donard"], answer: 2 },
        { type: "pick", q: "Which of these are capital cities of countries in the UK? There is more than one.", options: ["Cardiff", "Manchester", "Edinburgh", "Belfast", "Birmingham"], answers: [0, 2, 3] },
        { type: "type", q: "On a map, lines that join places of the same height above sea level are called ___ lines.", answer: ["contour", "contours", "contour lines"] },
        { type: "choice", q: "Which range of hills is often called 'the backbone of England'?", options: ["The Cotswolds", "The Chilterns", "The Grampians", "The Pennines"], answer: 3 },
        { type: "choice", q: "Heights on UK maps are measured in metres above...", options: ["the nearest river", "sea level", "the ground floor of the nearest building"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Reading the relief of the UK",
            text: [
              "Relief means the shape and height of the land: its hills, mountains, valleys and plains. Geographers describe relief using altitude, which is height above sea level. In Great Britain, the Ordnance Survey measures height from the average sea level recorded at Newlyn in Cornwall between 1915 and 1921, so every spot height on an OS map is compared with that one fixed level.",
              "Each country of the UK has its own highest point. Ben Nevis in the Scottish Highlands is the highest in the UK at 1,345 m. Yr Wyddfa (Snowdon) in Eryri is the highest in Wales at 1,085 m, Scafell Pike in the Lake District is the highest in England at 978 m, and Slieve Donard in the Mourne Mountains is the highest in Northern Ireland at 850 m. By world standards these are modest mountains, but they are steep, exposed and often dangerous in bad weather.",
              "At the other extreme, parts of the Fens in East Anglia lie below sea level. Holme Fen in Cambridgeshire, at about 2.75 m below sea level, is usually given as the lowest point on land in Great Britain. The Fens were once marshland, drained from the 1600s onwards; as the peat soil dried out it shrank, and the land surface sank.",
              "On maps, relief is shown in several ways: contour lines (close together for steep slopes, far apart for gentle ones), spot heights, triangulation pillars, and layer colouring, where low land is shaded green and high land brown or purple. Learning to read these quickly lets you 'see' a landscape in three dimensions from a flat sheet of paper.",
            ],
          },
          {
            heading: "The Tees–Exe line",
            text: [
              "If you look at a relief map of Great Britain, a clear pattern appears. Most of the high land is in the north and west; most of the low land is in the south and east. Geographers summarise this with the Tees–Exe line, an imaginary line drawn from the mouth of the River Tees in north-east England to the mouth of the River Exe in Devon.",
              "The main reason for the pattern is geology. North and west of the line, the rocks are mostly older and harder: igneous rocks such as granite, metamorphic rocks such as slate and schist, and tough older sedimentary rocks such as Carboniferous limestone and gritstone. These resist erosion, so they stand up as uplands like the Highlands, the Southern Uplands, the Lake District, the Pennines, Eryri and Dartmoor. South and east of the line, the rocks are mostly younger and softer sedimentary rocks such as chalk and clay, which form lower, gentler landscapes.",
              "The line is a generalisation, not a rule. There are lowlands in the north and west, such as the Cheshire Plain and Scotland's Central Lowlands, and there are hills in the south and east, such as the chalk of the North and South Downs, though these rarely rise above 300 m.",
              "Scotland is often split into three relief regions: the Highlands, the Central Lowlands and the Southern Uplands, separated by two great faults in the Earth's crust, the Highland Boundary Fault and the Southern Upland Fault. Wales is mostly upland, from Eryri in the north, through the Cambrian Mountains, to Bannau Brycheiniog (the Brecon Beacons) in the south. Northern Ireland has a ring of uplands, including the granite Mourne Mountains, the Sperrins and the basalt Antrim Plateau, around a lowland basin holding Lough Neagh, the largest lake in the UK by area.",
            ],
          },
          {
            heading: "Why relief matters",
            text: [
              "Relief shapes climate. The UK's prevailing winds blow from the south-west, bringing moist air off the Atlantic Ocean. When this air meets high ground in the west, it is forced to rise. As it rises it cools, the water vapour condenses into cloud, and rain falls. This is relief (or orographic) rainfall. By the time the air sinks down the eastern side, it has lost much of its moisture and warms up again, creating a drier rain shadow.",
              "The data show the effect clearly. Fort William, at the foot of Ben Nevis, gets roughly 2,000 mm of rain a year, and parts of the Lake District get over 3,000 mm. Cambridge, in the lowland east, gets only about 560 mm. Temperature also falls with height, by roughly 6 to 7 °C for every 1,000 m, so summits are much colder and windier than the valleys below them.",
              "Relief and climate together affect how land is used. Uplands have steep slopes, thin and often acidic soils and a short growing season, so they are mostly used for sheep and some cattle grazing, forestry, reservoirs, wind energy and tourism. Few people live there. Lowlands have gentler slopes, deeper, more fertile soils and a drier, sunnier climate, so they hold most of the UK's arable farming (wheat, barley, oilseed rape and sugar beet, especially in East Anglia), most of its large towns and cities, and its main roads and railways.",
              "When you describe a pattern on a map or graph, a good geographer gives the general trend, quotes data as evidence, and mentions any anomalies, the places that do not fit.",
            ],
          },
        ],
        words: [
          { word: "relief", meaning: "the shape and height of the land surface" },
          { word: "altitude", meaning: "height above sea level, usually measured in metres" },
          { word: "Tees–Exe line", meaning: "an imaginary line from the mouth of the River Tees to the mouth of the River Exe, roughly dividing upland Britain (north and west) from lowland Britain (south and east)" },
          { word: "prevailing wind", meaning: "the direction the wind blows from most often; in the UK, the south-west" },
          { word: "relief (orographic) rainfall", meaning: "rain formed when moist air is forced to rise over high ground, cools and condenses" },
          { word: "rain shadow", meaning: "a drier area on the sheltered side of high ground, where descending air has already lost much of its moisture" },
        ],
      },
      practice: {
        intro: "Test your understanding of the UK's relief and what it means for climate and land use.",
        questions: [
          {
            type: "match",
            q: "Match each mountain to the country where it is the highest point.",
            pairs: [
              ["Ben Nevis", "Scotland"],
              ["Yr Wyddfa (Snowdon)", "Wales"],
              ["Scafell Pike", "England"],
              ["Slieve Donard", "Northern Ireland"],
            ],
          },
          {
            type: "order",
            q: "Put these mountains in order of height, highest first.",
            items: ["Ben Nevis (1,345 m)", "Yr Wyddfa (1,085 m)", "Scafell Pike (978 m)", "Slieve Donard (850 m)"],
          },
          {
            type: "choice",
            q: "Which best explains why western Britain is generally wetter than eastern Britain?",
            options: [
              "The west is closer to the North Pole",
              "Moist south-westerly winds from the Atlantic are forced to rise over western uplands, cool and release rain",
              "The east has more cities, which stop clouds forming",
              "Rivers in the west evaporate more water",
            ],
            answer: 1,
            why: "Relief rainfall: the prevailing wind brings moist Atlantic air, which rises over the hills in the west, cools and condenses. The east lies in a rain shadow.",
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "The Tees–Exe line runs from the mouth of the River ___ in north-east England to the mouth of the River ___ in Devon. Most land to the north and west of it is ___, made of older, harder rocks.",
            bank: ["Tees", "Exe", "upland", "lowland", "Thames", "Severn"],
            answers: ["Tees", "Exe", "upland"],
          },
          {
            type: "pick",
            q: "Which land uses are typical of UK uplands? There is more than one.",
            options: ["Sheep grazing", "Forestry", "Large fields of wheat and sugar beet", "Reservoirs", "Large city centres"],
            answers: [0, 1, 3],
          },
        ],
      },
      task: {
        title: "Map and graph the UK's relief and rainfall",
        intro: "Make a relief map of the UK, then use rainfall data to describe and explain a geographical pattern in writing, as a geographer would.",
        need: [
          "An outline map of the UK (traced from an atlas, or printed with permission)",
          "An atlas, or an online map with a relief or terrain layer (ask a grown-up first)",
          "Graph paper or squared paper, a ruler, a pencil and coloured pencils",
        ],
        steps: [
          "On your outline map, use an atlas to shade land over about 200 m in brown and lower land in green. Draw the Tees–Exe line in a bold colour.",
          "Label at least four upland areas (for example the Highlands, Southern Uplands, Pennines, Lake District, Eryri, Mourne Mountains) and three lowland areas (for example the Central Lowlands, the Fens, the Lough Neagh basin, the London Basin). Mark and name the highest point of each country.",
          "Draw a bar chart of rounded average yearly rainfall: Fort William about 2,000 mm, Cardiff about 1,150 mm, Belfast about 950 mm, Edinburgh about 700 mm, London about 600 mm, Cambridge about 560 mm. If you can, check these against the Met Office climate averages online (with permission) and correct any that differ.",
          "Mark the six places on your map. Colour-code each by its rainfall so the pattern is visible on the map itself.",
          "Write a paragraph of 150 to 200 words. First describe the pattern (where is wettest and driest, with figures). Then explain it using the words prevailing wind, relief rainfall and rain shadow. Finally, suggest how the rainfall pattern might affect farming in the east and west.",
        ],
      },
      exit: [
        { type: "choice", q: "What does 'relief' mean in geography?", options: ["Help given after a disaster", "The amount of rain an area gets", "The shape and height of the land", "The type of rock under the soil"], answer: 2 },
        { type: "choice", q: "Which is the highest mountain in Wales?", options: ["Scafell Pike", "Ben Nevis", "Yr Wyddfa (Snowdon)", "Slieve Donard"], answer: 2 },
        { type: "pick", q: "Which statements are generally true of land north and west of the Tees–Exe line? There is more than one.", options: ["It is mostly upland", "It is mostly made of young, soft chalk and clay", "It is made of older, harder rocks", "It tends to be wetter"], answers: [0, 2, 3] },
        { type: "type", q: "What kind of rainfall forms when moist air is forced to rise over high ground? (Give one word.)", answer: ["relief", "orographic", "relief rainfall", "orographic rainfall", "Relief", "Orographic"] },
        { type: "choice", q: "What is a rain shadow?", options: ["A drier area on the sheltered side of high ground", "The dark cloud that comes before a storm", "An area that gets rain every day", "A valley filled with mist"], answer: 0 },
        { type: "choice", q: "Which evidence best supports the claim 'western Britain is wetter than eastern Britain'?", options: ["Ben Nevis is the UK's highest mountain", "Cambridge has more people than Fort William", "Fort William gets about 2,000 mm of rain a year, but Cambridge gets about 560 mm", "The Fens are below sea level"], answer: 2 },
      ],
      grownUp: {
        need: ["An atlas or online map (supervise internet use)", "Squared paper, ruler and coloured pencils"],
        tips: [
          "The rainfall figures in the task are rounded long-term averages; checking them on the Met Office website is a good research habit, and small differences are fine.",
          "Encourage the 'describe, then explain' structure: describing says what the pattern is, with data; explaining says why. Many learners mix the two.",
          "Yr Wyddfa and Eryri are the Welsh names for Snowdon and Snowdonia, and Bannau Brycheiniog for the Brecon Beacons. The national park authorities now use the Welsh names first.",
        ],
        younger: "Focus on the map: shade upland and lowland, add the Tees–Exe line and the four highest peaks, then write three sentences using 'because'.",
        older: "Draw a cross-section from west to east across northern England or Scotland using contour heights from an atlas, and annotate it to explain relief rainfall and the rain shadow. Find out what the 'environmental lapse rate' is.",
      },
    },

    // ---------- Lesson 2 ----------
    {
      slug: "uk-landscapes-2",
      title: "Rocks: igneous, sedimentary and metamorphic",
      emoji: "🪨",
      minutes: 60,
      goal: "I can explain how igneous, sedimentary and metamorphic rocks form, identify their properties, and name examples found in the UK.",
      starter: [
        { type: "choice", q: "What is the Tees–Exe line?", options: ["A railway from Teesside to Exeter", "The border between England and Scotland", "A fault line that causes earthquakes", "An imaginary line roughly dividing upland and lowland Britain"], answer: 3 },
        { type: "choice", q: "From which direction does the UK's prevailing wind usually blow?", options: ["North-east", "South-east", "South-west", "North-west"], answer: 2 },
        { type: "type", q: "What is the highest mountain in the UK?", answer: ["Ben Nevis", "ben nevis", "Ben nevis"] },
        { type: "pick", q: "Which are common land uses in the UK's uplands? There is more than one.", options: ["Sheep grazing", "Reservoirs", "Forestry", "Sugar beet farming"], answers: [0, 1, 2] },
        { type: "choice", q: "Why do uplands tend to be colder than lowlands?", options: ["Temperature falls with height, by roughly 6 to 7 °C per 1,000 m", "Uplands are further from the Sun", "Uplands have more people", "Uplands have no soil"], answer: 0 },
        { type: "choice", q: "Why are most of the UK's uplands found in the north and west?", options: ["Because more rain fell there long ago", "Because the rocks there are generally older and harder, so they resist erosion", "Because people built them up", "Because of the Gulf Stream"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Igneous rocks: made from molten rock",
            text: [
              "Igneous rocks form when molten rock cools and solidifies. Molten rock underground is called magma; when it reaches the surface it is called lava. Igneous rocks are made of interlocking crystals, which makes them hard and generally impermeable, meaning water cannot pass through the rock itself (though it can run along cracks called joints).",
              "How quickly the molten rock cools controls the size of the crystals. Intrusive igneous rocks cool slowly, deep underground, so their crystals have time to grow large enough to see. Granite is the classic example: you can spot pale quartz, pink or white feldspar and dark mica. Dartmoor, the Cairngorms, the Mourne Mountains and the Isle of Arran are all built largely of granite.",
              "Extrusive igneous rocks cool quickly at or near the surface, so their crystals are tiny. Basalt is the classic example. Around 60 million years ago, as the North Atlantic Ocean was opening, huge lava flows poured out across what is now County Antrim and the west of Scotland. As the thick lava cooled and shrank, it cracked into the famous columns of the Giant's Causeway in Northern Ireland and Fingal's Cave on Staffa.",
              "Even Edinburgh is built on a volcano. Castle Rock and Arthur's Seat are the eroded remains of volcanic activity about 350 million years ago.",
            ],
          },
          {
            heading: "Sedimentary rocks: layers of time",
            text: [
              "Sedimentary rocks form from sediment: fragments of other rocks, or the shells and skeletons of living things. The process has several stages. Rock is weathered and eroded, the pieces are transported by rivers, wind, ice or the sea, then deposited in layers, usually under water. Over millions of years the layers are compacted by the weight above and cemented together by minerals. The layers are called strata, and sedimentary rocks are the only kind likely to contain fossils.",
              "Chalk is made from the microscopic shells of plankton that settled on the floor of a warm sea between about 100 and 66 million years ago. It forms the White Cliffs of Dover, the Seven Sisters and the rolling hills of the South Downs. Carboniferous limestone, about 350 million years old, formed from shells and coral in shallow tropical seas when the land that is now Britain lay near the equator. It forms the Yorkshire Dales, the White Peak in the Peak District and the Mendip Hills.",
              "Other sedimentary rocks include sandstone (cemented sand grains, such as the Old Red Sandstone of Orkney and Bannau Brycheiniog), clay and mudstone (very fine particles, as in the London Clay), and coal, formed from the remains of swamp forests.",
              "Many sedimentary rocks are permeable, letting water soak into tiny gaps between grains (porous rocks such as chalk and sandstone) or flow through joints and cracks (as in limestone). Clay is the important exception: it is impermeable, which is why clay areas often have wet, heavy soils and lots of surface streams.",
            ],
          },
          {
            heading: "Metamorphic rocks and the rock cycle",
            text: [
              "Metamorphic rocks are existing rocks that have been changed by intense heat, pressure, or both, without melting. This usually happens deep in the crust when continents collide and mountains are pushed up. Much of the Scottish Highlands and north Wales was folded and squeezed in such a collision between about 490 and 390 million years ago, in a mountain-building event called the Caledonian orogeny.",
              "Mudstone and shale become slate, which splits into thin, flat sheets. North-west Wales was once the world's leading slate producer, and its slate landscape became a UNESCO World Heritage Site in 2021. Limestone becomes marble. With even more heat and pressure, slate becomes schist and then gneiss, with minerals arranged in bands. The Lewisian gneiss of the Outer Hebrides and north-west Highlands is around 3 billion years old, among the oldest rock in Europe.",
              "Metamorphic rocks are usually very hard, with crystals often lined up in layers or bands because of the pressure they were under. They are generally impermeable.",
              "No rock lasts for ever. The rock cycle links the three types: rocks at the surface are weathered and eroded into sediment that becomes sedimentary rock; buried rocks can be heated and squeezed into metamorphic rock; rock that melts becomes magma, which cools into new igneous rock; and uplift brings rock back to the surface to start again. Each step can take millions of years. In 1815 the geologist William Smith published the first geological map of a whole country, showing the rocks of England and Wales, and the British Geological Survey still maps the UK's rocks today.",
            ],
          },
        ],
        words: [
          { word: "igneous rock", meaning: "rock formed when magma or lava cools and solidifies, made of interlocking crystals" },
          { word: "intrusive / extrusive", meaning: "igneous rock that cooled slowly underground with large crystals (intrusive) or quickly at the surface with small crystals (extrusive)" },
          { word: "sedimentary rock", meaning: "rock formed from layers of sediment that have been compacted and cemented over time" },
          { word: "metamorphic rock", meaning: "rock that has been changed by heat and/or pressure without melting" },
          { word: "permeable", meaning: "allowing water to pass through, either through pores or along cracks; impermeable rock does not" },
          { word: "rock cycle", meaning: "the continuous processes by which rocks are formed, broken down and re-formed over millions of years" },
        ],
      },
      practice: {
        intro: "Sort, sequence and explain the three types of rock.",
        questions: [
          {
            type: "match",
            q: "Match each rock to how it formed.",
            pairs: [
              ["Granite", "Magma cooled slowly underground"],
              ["Basalt", "Lava cooled quickly at the surface"],
              ["Chalk", "Tiny plankton shells settled on a sea floor"],
              ["Slate", "Mudstone changed by heat and pressure"],
            ],
          },
          {
            type: "order",
            q: "Put the stages in forming a sedimentary rock in order.",
            items: ["Weathering and erosion break up rock", "Sediment is transported", "Sediment is deposited in layers", "Layers are compacted and cemented"],
          },
          {
            type: "choice",
            q: "Granite has large crystals but basalt has tiny ones. Which best explains why?",
            options: [
              "Basalt is younger, so its crystals have not grown yet",
              "Granite cooled slowly underground, giving crystals time to grow; basalt cooled quickly at the surface",
              "Granite was squeezed by pressure, which made its crystals bigger",
              "Basalt was eroded by the sea, which wore its crystals down",
            ],
            answer: 1,
            why: "Cooling rate controls crystal size: slow cooling underground gives large crystals, quick cooling at the surface gives small ones.",
          },
          {
            type: "pick",
            q: "Which of these are sedimentary rocks? There is more than one.",
            options: ["Granite", "Limestone", "Sandstone", "Gneiss", "Chalk"],
            answers: [1, 2, 4],
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "Metamorphic rocks form when rock is changed by heat and ___ without melting. Limestone changes into ___, and mudstone changes into ___.",
            bank: ["pressure", "marble", "slate", "water", "granite", "chalk"],
            answers: ["pressure", "marble", "slate"],
          },
        ],
      },
      task: {
        title: "Investigate rock samples",
        intro: "Carry out a series of simple tests to describe and identify rock samples, record your results in a table, and draw conclusions like a geologist.",
        need: [
          "4 to 6 different rock samples: garden stones, building or paving offcuts, a slate coaster, a granite or marble offcut, or a cheap rock kit",
          "A magnifying glass if you have one",
          "A copper coin and a steel teaspoon",
          "A small cup of water and a teaspoon or dropper",
          "White vinegar in a small dish",
          "Kitchen scales (optional) and kitchen paper",
        ],
        steps: [
          "Draw a results table with a row for each sample and columns for: colour, crystals or grains, hardness, permeability, reaction to vinegar, and your identification.",
          "Look closely at each sample, with a magnifying glass if you have one. Can you see interlocking crystals (likely igneous or metamorphic), rounded grains (likely sedimentary), layers or bands, or fossils?",
          "Test hardness: try to scratch each sample with your fingernail, then the copper coin, then the steel teaspoon. Record the first one that leaves a scratch. Softer rocks scratch more easily.",
          "Test permeability: put five drops of water on each sample and time how long they take to soak in. If you have scales, weigh a dry sample, soak it in water for ten minutes, pat it dry and weigh it again: a gain in mass shows the rock is porous.",
          "Test for calcium carbonate: put a few drops of vinegar on each sample. Fizzing shows calcium carbonate, found in limestone, chalk and marble. (Blackboard chalk is often made of gypsum instead and may not fizz.)",
          "Use your results to identify each sample as igneous, sedimentary or metamorphic. Write a conclusion of about 150 words explaining which evidence was most useful and which tests were least reliable, and why.",
        ],
      },
      exit: [
        { type: "choice", q: "How do igneous rocks form?", options: ["From molten rock that cools and solidifies", "From layers of sediment pressed together", "From rock changed by heat and pressure", "From the remains of plants"], answer: 0 },
        { type: "choice", q: "Which rock forms the columns of the Giant's Causeway?", options: ["Chalk", "Granite", "Slate", "Basalt"], answer: 3 },
        { type: "pick", q: "Which features suggest a rock is sedimentary? There is more than one.", options: ["It contains fossils", "It has layers (strata)", "It has large interlocking crystals", "It is made of rounded grains"], answers: [0, 1, 3] },
        { type: "type", q: "What metamorphic rock forms from mudstone or shale and splits into thin sheets?", answer: ["slate", "Slate"] },
        { type: "choice", q: "A rock sample fizzes when vinegar is dropped on it. What does this suggest?", options: ["It is granite", "It contains calcium carbonate, so it could be limestone, chalk or marble", "It is impermeable", "It formed from lava"], answer: 1 },
        { type: "choice", q: "Chalk was formed mainly from...", options: ["microscopic plankton shells on a sea floor", "cooled lava", "squashed slate", "swamp forests"], answer: 0 },
      ],
      grownUp: {
        need: ["Assorted rock samples", "A copper coin, steel teaspoon, white vinegar, water and kitchen paper", "Kitchen scales (optional)"],
        tips: [
          "Please don't collect stones from beaches, nature reserves or protected sites; taking material from some beaches is against the law. Garden stones, builders' offcuts and inexpensive rock kits work well.",
          "Vinegar is a weak acid and safe to use, but keep it away from eyes and wash hands afterwards. A real geologist uses dilute hydrochloric acid; vinegar works more slowly, so watch closely for small bubbles.",
          "Many kitchen worktops are granite or quartz composite; composites are man-made, which is a useful discussion point.",
        ],
        younger: "Use three clearly different samples (for example slate, a pebble of granite, and a piece of limestone or chalk) and do just the look, scratch and vinegar tests.",
        older: "Draw a fully labelled rock cycle diagram that names the processes on every arrow (weathering, erosion, transport, deposition, compaction, cementation, heat and pressure, melting, cooling, uplift). Then find out what the Mohs scale of hardness is and where your samples might sit on it.",
      },
    },

    // ---------- Lesson 3 ----------
    {
      slug: "uk-landscapes-3",
      title: "Weathering, erosion and rock landscapes",
      emoji: "🌧️",
      minutes: 60,
      goal: "I can explain the difference between weathering and erosion, describe the main types of weathering, and explain how different rocks create different UK landscapes.",
      starter: [
        { type: "choice", q: "Which type of rock forms when magma cools slowly underground, giving large crystals?", options: ["Extrusive igneous", "Sedimentary", "Intrusive igneous", "Metamorphic"], answer: 2 },
        { type: "match", q: "Match each rock to its type.", pairs: [["Granite", "Igneous"], ["Chalk", "Sedimentary"], ["Marble", "Metamorphic"]] },
        { type: "choice", q: "What does 'permeable' mean?", options: ["Lets water pass through", "Very hard", "Made of crystals", "Easily melted"], answer: 0 },
        { type: "type", q: "Which rock type is the only one likely to contain fossils?", answer: ["sedimentary", "Sedimentary", "sedimentary rock"] },
        { type: "choice", q: "Carboniferous limestone formed in which kind of environment?", options: ["A cold desert", "Shallow tropical seas", "Inside a volcano", "Under a glacier"], answer: 1 },
        { type: "choice", q: "What turns rock into metamorphic rock?", options: ["Wind and rain", "Being covered by plants", "Cooling quickly at the surface", "Heat and/or pressure without melting"], answer: 3 },
      ],
      learn: {
        cards: [
          {
            heading: "Weathering: breaking rock where it stands",
            text: [
              "Weathering is the breakdown of rock in situ, which means in its original place. Nothing carries it away. Erosion is different: it is the wearing away and removal of rock by a moving force such as a river, a glacier, waves or the wind. Weathering often prepares rock for erosion by loosening it first.",
              "Mechanical (physical) weathering breaks rock into smaller pieces without changing its chemistry. In the UK the most important type is freeze-thaw weathering. Rainwater seeps into a crack in the rock. At night the temperature drops below 0 °C and the water freezes; as it turns to ice it expands by about 9%, pushing on the sides of the crack. In the day the ice melts and the water seeps deeper. After many cycles, pieces break off. Piles of these angular fragments, called scree, lie beneath crags in mountain areas, such as the great screes that drop into Wast Water in the Lake District.",
              "Biological weathering is caused by living things: plant roots growing into cracks and widening them, burrowing animals, and lichens and mosses that release weak acids onto the rock surface.",
              "Chemical weathering changes the minerals in the rock. Rainwater is naturally slightly acidic, because it dissolves a little carbon dioxide from the air to form weak carbonic acid. This slowly dissolves calcium carbonate, so limestone and chalk are especially vulnerable; this process is called carbonation. In the past, acid rain from burning coal damaged many stone buildings in UK cities, though it has fallen sharply since sulphur emissions were cut.",
            ],
          },
          {
            heading: "Erosion and mass movement",
            text: [
              "Once rock is weakened, it can be eroded and transported. The four main agents of erosion are rivers, ice, the sea and the wind. Each picks up loose material and uses it to wear away more rock, then carries it away and eventually deposits it somewhere else, often to become future sedimentary rock.",
              "Gravity also moves material downhill directly. This is called mass movement. It can be very slow, like soil creep, where soil particles edge downslope a few millimetres a year (look for curved tree trunks or leaning walls). It can also be sudden, like rockfalls from cliffs, or slumping and landslides, where saturated soil or soft rock such as clay slides down a curved surface after heavy rain.",
              "The speed of weathering and erosion depends on rock type, climate and relief. Freeze-thaw is most active where temperatures often cross 0 °C, as on Scottish and Welsh mountains in winter. Chemical weathering works faster where there is plenty of rainfall. Steep slopes speed up mass movement and river erosion.",
              "People also cause erosion. On popular mountain paths, thousands of boots wear away vegetation, and rain then washes the exposed soil away, cutting deep scars into the hillside. You will look at how this is managed in lesson 6.",
            ],
          },
          {
            heading: "How geology shapes the landscape",
            text: [
              "Different rocks respond differently to weathering and erosion, so each creates its own kind of landscape. Where hard and soft rocks lie side by side, the softer rock is worn away faster and the harder rock is left standing as hills, ridges or headlands. This is called differential erosion.",
              "Granite: on Dartmoor, granite was intruded around 280 million years ago. Its joints were weathered deep underground, and when the softer surrounding material was later stripped away, blocks of solid granite were left standing as tors, such as Haytor. Because granite is impermeable, Dartmoor is covered in boggy moorland and peat, and its valleys hold reservoirs.",
              "Carboniferous limestone: in the Yorkshire Dales, rainwater dissolves the limestone along its joints, creating a karst landscape. At Malham, a curved cliff about 80 m high, Malham Cove, is topped by a limestone pavement: flat blocks called clints separated by deep cracks called grykes. Streams vanish down swallow holes such as Gaping Gill, flow through cave systems, and reappear lower down, so many valleys are dry.",
              "Chalk forms rolling hills called downs, with steep escarpments and dry valleys, as in the South Downs and the Chilterns. Because chalk is permeable, rain soaks in and springs appear at its base, along a 'spring line' where villages often grew up. Clay, which is soft and impermeable, is easily eroded into low, flat vales and basins, such as the London Basin, with heavy, wet soils and many streams.",
            ],
          },
        ],
        words: [
          { word: "weathering", meaning: "the breakdown of rock in its original place, by mechanical, chemical or biological processes" },
          { word: "erosion", meaning: "the wearing away and removal of rock by a moving force such as rivers, ice, waves or wind" },
          { word: "freeze-thaw", meaning: "mechanical weathering where water in cracks freezes, expands by about 9% and widens the crack over repeated cycles" },
          { word: "carbonation", meaning: "chemical weathering where weak carbonic acid in rainwater dissolves calcium carbonate in limestone and chalk" },
          { word: "mass movement", meaning: "the downhill movement of rock and soil under gravity, such as soil creep, rockfall or slumping" },
          { word: "clints and grykes", meaning: "the blocks (clints) and the deep cracks between them (grykes) on a limestone pavement" },
        ],
      },
      practice: {
        intro: "Apply what you know about weathering, erosion and rock landscapes.",
        questions: [
          {
            type: "match",
            q: "Match each process to the type of weathering.",
            pairs: [
              ["Ice expanding in a crack", "Mechanical"],
              ["Rainwater dissolving limestone", "Chemical"],
              ["Tree roots widening a joint", "Biological"],
            ],
          },
          {
            type: "order",
            q: "Put the stages of freeze-thaw weathering in order.",
            items: ["Water seeps into a crack", "The temperature drops below 0 °C and the water freezes", "The ice expands and pushes on the crack", "The ice melts and water seeps deeper", "After many cycles, a piece of rock breaks off"],
          },
          {
            type: "choice",
            q: "Which statement correctly explains the difference between weathering and erosion?",
            options: [
              "Weathering happens only in cold places; erosion happens only in hot places",
              "Weathering breaks rock down where it is; erosion wears rock away and removes it",
              "Weathering is caused by people; erosion is natural",
              "They mean exactly the same thing",
            ],
            answer: 1,
          },
          {
            type: "pick",
            q: "Which features would you expect to find in a Carboniferous limestone landscape such as the Yorkshire Dales? There is more than one.",
            options: ["Limestone pavements", "Swallow holes", "Tors", "Dry valleys", "Large surface lakes on boggy peat"],
            answers: [0, 1, 3],
          },
          {
            type: "choice",
            q: "Why do chalk hills such as the South Downs have very few surface streams?",
            options: [
              "It almost never rains there",
              "Chalk is permeable, so rain soaks into the rock instead of running over the surface",
              "Farmers have filled in all the streams",
              "Chalk is impermeable, so water evaporates quickly",
            ],
            answer: 1,
            why: "Chalk is porous and permeable. Water soaks in and comes out lower down as springs, often along a spring line at the foot of the hills.",
          },
        ],
      },
      task: {
        title: "Investigate weathering",
        intro: "Model the force behind freeze-thaw weathering, then carry out a short weathering survey of real stonework, collecting and presenting data to test a hypothesis.",
        need: [
          "A small, clean plastic tub or plastic bottle with a lid (never glass)",
          "Water, a marker pen and a ruler",
          "Use of a freezer overnight",
          "A notebook, pencil and a phone or camera (optional)",
          "A grown-up to come with you for the survey",
        ],
        steps: [
          "Part A: fill the plastic tub right to the brim with water, or fill the bottle completely and screw the lid on. Mark the water level and measure its height. Put it in the freezer overnight.",
          "Next day, measure how far the ice has risen above the rim, or describe how the bottle has bulged. Write two or three sentences explaining what this shows about the force of freezing water in a crack in rock.",
          "Part B: with a grown-up, visit somewhere with old stonework you can examine closely, such as walls, old buildings, a war memorial or, if appropriate and you behave respectfully, a churchyard where gravestones show dates.",
          "Write a hypothesis before you start, for example: 'Older stones will be more weathered than newer ones' or 'Limestone and marble will be more weathered than granite.'",
          "Survey at least eight stones. For each, record the date (if shown), the type of stone if you can tell, and a weathering score from 1 (sharp, clear, smooth) to 5 (crumbling, blurred, eaten away). Note any lichen, cracks or flaking.",
          "Back home, plot a scatter graph of age against weathering score. Write a conclusion: was your hypothesis supported? What other factors (rock type, which way the stone faces, shelter from rain) might explain anomalies? How could you make the survey more reliable?",
        ],
      },
      exit: [
        { type: "choice", q: "What is weathering?", options: ["The removal of rock by rivers and waves", "The breakdown of rock in its original place", "The deposition of sediment", "The movement of glaciers"], answer: 1 },
        { type: "type", q: "By about what percentage does water expand when it freezes?", answer: ["9", "9%", "nine", "about 9", "about 9%"], after: "%" },
        { type: "choice", q: "Rainwater dissolving limestone is an example of...", options: ["mechanical weathering", "biological weathering", "chemical weathering", "mass movement"], answer: 2 },
        { type: "pick", q: "Which are types of mass movement? There is more than one.", options: ["Soil creep", "Slumping", "Carbonation", "Rockfall"], answers: [0, 1, 3] },
        { type: "choice", q: "What are the blocks on a limestone pavement called?", options: ["Grykes", "Tors", "Clints", "Screes"], answer: 2 },
        { type: "choice", q: "Which best explains why granite tors stand up above Dartmoor's moorland?", options: ["They were built by people long ago", "They were pushed up by glaciers", "Less-jointed blocks of hard granite survived while the more weathered material around them was stripped away", "They are made of soft chalk"], answer: 2 },
      ],
      grownUp: {
        need: ["A plastic tub or bottle (not glass) and freezer space", "Notebook and pencil for the survey"],
        tips: [
          "Glass containers can shatter in the freezer; use plastic only.",
          "The weathering survey needs an adult present. If you visit a churchyard or memorial, talk first about behaving quietly and respectfully, not touching fragile stones, and not standing on graves. Old walls and public buildings work just as well.",
          "The survey is a real fieldwork method used at GCSE. The scoring is subjective, so discussing how to make it fairer (for example, two people scoring independently) is valuable.",
        ],
        younger: "Do Part A, then look at just four stones and describe which is most and least weathered and why you think so.",
        older: "Research how the Dartmoor tors formed (the 'two-stage' theory of deep weathering then stripping) and write a paragraph evaluating the evidence. Find out why Carboniferous limestone is described as permeable but not porous.",
      },
    },

    // ---------- Lesson 4 ----------
    {
      slug: "uk-landscapes-4",
      title: "Glaciated uplands",
      emoji: "🏔️",
      minutes: 60,
      goal: "I can explain how glaciers erode and deposit material, and how landforms such as corries, arêtes, U-shaped valleys and ribbon lakes formed in the UK's uplands.",
      starter: [
        { type: "choice", q: "What is the difference between weathering and erosion?", options: ["Weathering breaks rock down in place; erosion wears it away and removes it", "Weathering moves rock; erosion does not", "There is no difference", "Erosion only happens at the coast"], answer: 0 },
        { type: "order", q: "Put the stages of freeze-thaw in order.", items: ["Water enters a crack", "Water freezes and expands", "Ice melts and water seeps deeper", "Rock fragment breaks off"] },
        { type: "type", q: "What name is given to the pile of angular rock fragments that collects below a crag?", answer: ["scree", "Scree", "screes"] },
        { type: "choice", q: "Which rock forms limestone pavements with clints and grykes?", options: ["Granite", "Carboniferous limestone", "Chalk", "Slate"], answer: 1 },
        { type: "pick", q: "Which are types of weathering? There is more than one.", options: ["Mechanical", "Chemical", "Biological", "Longshore"], answers: [0, 1, 2] },
        { type: "choice", q: "What is differential erosion?", options: ["Erosion that only happens in winter", "Erosion caused by people", "Softer rock eroding faster than harder rock, leaving the hard rock standing out", "Erosion by the wind"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Britain under ice",
            text: [
              "For the last 2.6 million years or so, the Earth's climate has swung between cold glacial periods, when ice sheets spread, and warmer interglacials like today. The most recent glacial period in Britain is often called the Devensian. At its peak, roughly 27,000 to 20,000 years ago, an ice sheet covered almost all of Scotland, Northern Ireland, Wales and northern England, and was well over a kilometre thick in places above the Scottish Highlands.",
              "The ice melted back as the climate warmed. There was one last cold snap, about 12,900 to 11,700 years ago, when small glaciers formed again in the Highlands and in the corries of the Lake District and Eryri. Since then, Britain has been ice-free, but the landscape is still shaped by what the ice did.",
              "A glacier is a large, slow-moving mass of ice. It forms where more snow falls in winter than melts in summer. Over years the snow is buried and compacted, first into grainy firn and then into dense glacier ice. Gravity makes the ice move downhill, partly by sliding over the bed on a thin layer of meltwater and partly by the ice itself slowly deforming.",
              "Glaciers erode, transport and deposit enormous amounts of rock. A valley glacier can carry boulders the size of houses, and the landforms it leaves are often much bigger and more dramatic than those made by rivers.",
            ],
          },
          {
            heading: "Erosion by ice: corries, arêtes and pyramidal peaks",
            text: [
              "Glaciers erode in two main ways. Plucking happens when meltwater freezes onto the rock beneath and around the glacier; as the ice moves on, it tears loose blocks away. Abrasion happens when rocks frozen into the base of the glacier scrape over the bedrock like sandpaper, smoothing it and leaving scratches called striations.",
              "A corrie is an armchair-shaped hollow high on a mountainside. In Scotland it is called a corrie (from the Gaelic coire), in Wales a cwm, and elsewhere a cirque. Corries usually face north or north-east, where the slope gets less sun, so snow lasts longer. The snow builds up in a hollow and turns to ice. Plucking and freeze-thaw steepen the back wall, while the ice moves in a rotational slip, abrading and deepening the floor. A ridge of rock or moraine called a lip forms at the front. When the ice melts, a small lake called a tarn may fill the hollow, such as Red Tarn below Helvellyn or Llyn Idwal in Cwm Idwal, Eryri.",
              "When two corries form back to back, the ridge between them is sharpened into a knife-edge called an arête. Striding Edge on Helvellyn and Crib Goch on Yr Wyddfa are famous examples, and both are serious scrambles that demand care.",
              "When three or more corries cut into one mountain, they leave a sharp, pointed summit called a pyramidal peak. The summit of Yr Wyddfa is often given as a UK example; the Matterhorn in the Alps is the most famous in the world.",
            ],
          },
          {
            heading: "Glacial troughs and deposition",
            text: [
              "Valley glaciers flowing from the corries took over existing river valleys. Rivers carve narrow V-shaped valleys with interlocking spurs, but the much larger and more powerful ice deepened, widened and straightened them into U-shaped valleys, also called glacial troughs, with steep sides and flat floors. The ends of the spurs were sliced off, leaving truncated spurs. Examples include Glen Coe in the Highlands, Nant Ffrancon in Eryri and Great Langdale in the Lake District.",
              "Smaller side glaciers did not erode as deeply as the main glacier, so when the ice melted their valleys were left 'hanging' above the main valley floor. Streams now plunge from these hanging valleys as waterfalls. Where the glacier carved a deeper section into softer or more jointed rock, a long, narrow ribbon lake formed after the ice melted. Windermere, about 18 km long, is the largest natural lake in England. Many of the sea lochs of western Scotland are glacial troughs that were flooded by the sea as sea level rose.",
              "Glaciers also deposit material, especially as they melt. Moraine is rock debris carried and dumped by a glacier: lateral moraine along the sides, terminal moraine at the furthest point the ice reached. Till (also called boulder clay) is an unsorted mix of clay, sand and boulders. Drumlins are smooth, egg-shaped hills of till, moulded under moving ice; County Down in Northern Ireland has so many that it is described as a 'basket of eggs' landscape, and some in Strangford Lough are partly drowned to form islands. Erratics are boulders carried far from where they formed, such as the Norber erratics in the Yorkshire Dales, dark boulders resting on paler limestone.",
              "Today, these glaciated uplands are some of the UK's most valued landscapes. They supply water (Thirlmere and Haweswater in the Lake District feed Manchester), attract millions of walkers and climbers, and support sheep farming and forestry.",
            ],
          },
        ],
        words: [
          { word: "plucking", meaning: "glacial erosion where ice freezes onto rock and tears pieces away as it moves" },
          { word: "abrasion", meaning: "erosion where rocks carried by ice (or water) scrape and wear away the surface beneath, like sandpaper" },
          { word: "corrie (cwm, cirque)", meaning: "an armchair-shaped hollow on a mountainside, carved by a small glacier" },
          { word: "arête", meaning: "a sharp, knife-edged ridge between two corries" },
          { word: "U-shaped valley (glacial trough)", meaning: "a steep-sided, flat-floored valley deepened and widened by a glacier" },
          { word: "moraine", meaning: "rock debris carried and deposited by a glacier" },
        ],
      },
      practice: {
        intro: "Check your understanding of glacial processes and landforms.",
        questions: [
          {
            type: "match",
            q: "Match each landform to its UK example.",
            pairs: [
              ["Arête", "Striding Edge"],
              ["Ribbon lake", "Windermere"],
              ["Tarn in a corrie", "Red Tarn"],
              ["U-shaped valley", "Glen Coe"],
            ],
          },
          {
            type: "order",
            q: "Put the stages of corrie formation in order.",
            items: [
              "Snow collects in a north-facing hollow",
              "Snow is compacted into firn and then ice",
              "Plucking steepens the back wall and abrasion deepens the floor",
              "The ice melts, and a tarn may fill the hollow",
            ],
          },
          {
            type: "choice",
            q: "Why do most corries in the UK face north or north-east?",
            options: [
              "The prevailing wind blows from the north-east",
              "These slopes get less sunshine, so snow and ice last longer and build up",
              "The rock is always softer on those sides",
              "Glaciers can only move north",
            ],
            answer: 1,
            why: "In the northern hemisphere, north-facing slopes are shaded from the Sun, so snow accumulates and survives the summer more easily.",
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "When rocks frozen into a glacier scrape the bedrock, this is called ___. It leaves scratches called ___. A side valley left high above the main valley is a ___ valley.",
            bank: ["abrasion", "striations", "hanging", "plucking", "drumlins", "dry"],
            answers: ["abrasion", "striations", "hanging"],
          },
          {
            type: "pick",
            q: "Which of these are landforms of glacial deposition? There is more than one.",
            options: ["Drumlin", "Arête", "Terminal moraine", "Erratic", "Pyramidal peak"],
            answers: [0, 2, 3],
          },
        ],
      },
      task: {
        title: "Model abrasion and explain a glacial landscape",
        intro: "Use a simple model to see how abrasion works, then sketch and annotate a glaciated landscape and write an extended explanation.",
        need: [
          "An ice cube tray or two small plastic tubs, and freezer space",
          "Water, plus a spoonful of sand and some small gravel",
          "A bar of soap or a slab of modelling clay, on a tray",
          "A photo of a glaciated valley (from a book, or online with permission), for example Great Langdale, Nant Ffrancon or Glen Coe",
          "Paper and pencil",
        ],
        steps: [
          "Freeze two sets of ice: one of plain water, and one with sand and gravel mixed in (pour the grit into the bottom of the tray, then add water).",
          "Rub the plain ice firmly across the soap or clay 20 times in one direction. Then do the same with the gritty ice on a fresh area. Compare the marks. Which made deeper scratches? Link this to abrasion and striations.",
          "Write a short evaluation: in what ways is your model like a real glacier, and in what ways is it different (think about scale, time, weight and movement)?",
          "Draw a field sketch of your glaciated valley photo: a simple line drawing showing the main shapes, not a detailed picture. Annotate at least four landforms, such as the U-shaped valley, truncated spurs, a hanging valley, a corrie, an arête or a ribbon lake.",
          "Write an extended answer of 250 to 300 words: 'Explain how a corrie and an arête are formed.' Use the key words plucking, abrasion, freeze-thaw and rotational slip, and sequence words such as first, then, as a result and eventually. Add a labelled diagram.",
        ],
      },
      exit: [
        { type: "choice", q: "What is plucking?", options: ["Ice freezing onto rock and tearing pieces away as it moves", "Rocks in the ice scraping the bedrock", "Snow turning into firn", "A glacier melting at its front"], answer: 0 },
        { type: "choice", q: "What is the Welsh name for a corrie?", options: ["Tarn", "Cwm", "Llyn", "Glen"], answer: 1 },
        { type: "choice", q: "What forms when two corries erode back to back?", options: ["A drumlin", "A ribbon lake", "An arête", "A hanging valley"], answer: 2 },
        { type: "pick", q: "Which features are typical of a glacial trough? There is more than one.", options: ["Steep sides", "A flat floor", "Interlocking spurs", "Truncated spurs"], answers: [0, 1, 3] },
        { type: "type", q: "What is the largest natural lake in England, a ribbon lake in the Lake District?", answer: ["Windermere", "windermere", "Lake Windermere", "lake windermere"] },
        { type: "choice", q: "A large boulder of a rock type not found locally sits on a limestone hillside in the Yorkshire Dales. Which best explains how it got there?", options: ["It was thrown out of a volcano", "A river rolled it uphill", "It formed there from limestone", "It was carried there by a glacier and left behind when the ice melted"], answer: 3 },
      ],
      grownUp: {
        need: ["Ice cube tray or small plastic tubs, sand and gravel", "Soap or modelling clay", "Internet access with supervision if finding a photo online"],
        tips: [
          "The abrasion model needs the ice to be frozen solid; make it the night before. Have a towel ready, as it gets wet.",
          "Field sketches are about selecting and labelling key features, not artistic skill. Encourage clear outlines and arrows pointing to features.",
          "If the learner is interested in walking these landscapes, Striding Edge and Crib Goch are genuinely dangerous in poor weather and need experience and proper kit.",
        ],
        younger: "Focus on three landforms: a corrie, an arête and a U-shaped valley. Draw and label one simple diagram of each and write one sentence about how each formed.",
        older: "Use an Ordnance Survey map of an area such as Helvellyn or Cwm Idwal (online, with permission) to identify a corrie, arête and ribbon lake from contour patterns, giving six-figure grid references. Research the difference between warm-based and cold-based glaciers.",
      },
    },

    // ---------- Lesson 5 ----------
    {
      slug: "uk-landscapes-5",
      title: "Coastal landscapes and landforms",
      emoji: "🌊",
      minutes: 60,
      goal: "I can explain how waves erode, transport and deposit material, and how headlands, bays, cliffs, caves, arches and stacks form on UK coasts.",
      starter: [
        { type: "choice", q: "What is abrasion?", options: ["Rocks carried by ice or water scraping and wearing away a surface", "Ice freezing onto rock", "Rock dissolving in rainwater", "Rock breaking because it is heated"], answer: 0 },
        { type: "match", q: "Match each glacial landform to its description.", pairs: [["Corrie", "Armchair-shaped hollow"], ["Arête", "Knife-edged ridge"], ["Drumlin", "Egg-shaped hill of till"]] },
        { type: "choice", q: "Why are U-shaped valleys deeper and wider than V-shaped river valleys?", options: ["Rivers were bigger in the past", "Glaciers are much larger and more powerful than rivers and eroded the valleys", "People dug them out", "They are made of softer rock"], answer: 1 },
        { type: "type", q: "What name is given to a small lake in a corrie?", answer: ["tarn", "Tarn", "a tarn", "llyn", "lochan"] },
        { type: "pick", q: "Which of these are glaciated areas of the UK? There is more than one.", options: ["The Lake District", "The Scottish Highlands", "Eryri (Snowdonia)", "The Fens"], answers: [0, 1, 2] },
        { type: "choice", q: "About when did the last ice sheet over Britain reach its peak?", options: ["About 2,000 years ago", "About 66 million years ago", "Roughly 27,000 to 20,000 years ago", "About 3 billion years ago"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Waves and coastal processes",
            text: [
              "Waves are made by wind blowing over the surface of the sea. Their size depends on the wind's strength, how long it blows, and the fetch, which is the distance of open water it blows over. Coasts in south-west England, western Wales, western Scotland and the north coast of Northern Ireland face the Atlantic, with a fetch of thousands of kilometres, so they receive some of the most powerful waves in Europe.",
              "Geographers describe two types of wave. Destructive waves are tall, steep and frequent, with a strong backwash (the water running back down the beach) that drags material away; they erode coasts, especially in storms. Constructive waves are low and gentle, with a strong swash (the water running up the beach) that pushes material onto the shore; they build beaches.",
              "Waves erode in four main ways. Hydraulic action is the force of water, and air trapped and compressed in cracks, blasting rock apart. Abrasion is waves hurling sand and pebbles against the cliff. Attrition is rocks knocking against each other, becoming smaller and rounder. Solution (corrosion) is seawater slowly dissolving rocks such as chalk and limestone.",
              "Waves also move material along the coast by longshore drift. Waves approach the beach at an angle, following the prevailing wind, so the swash carries sand and shingle up the beach diagonally; the backwash pulls it straight back down under gravity. The material zigzags along the shore. Where the coastline changes direction or the water is sheltered, it is deposited, building spits such as Spurn Head at the mouth of the Humber, and features like Chesil Beach in Dorset, a shingle barrier about 29 km long linking the Isle of Portland to the mainland.",
            ],
          },
          {
            heading: "Headlands, bays and retreating cliffs",
            text: [
              "Where bands of hard and soft rock meet the sea at right angles, the coast is called discordant. The softer rock, such as clay or sand, is eroded faster and forms bays. The harder rock, such as chalk or limestone, resists erosion and is left jutting out as headlands. Once formed, headlands take the full force of the waves, while bays become sheltered, so beaches build up in them. The coast near Swanage in Dorset is a classic example: Studland Bay and Swanage Bay are cut into softer sands and clays, with the chalk headland of Ballard Down between them.",
              "Where the rock bands run parallel to the coast, it is concordant. A short way along the Dorset coast, at Lulworth Cove, the sea broke through a narrow band of hard Portland limestone, then rapidly eroded the softer rocks behind it into an almost circular cove.",
              "Cliffs retreat in a predictable way. Waves attack the base of the cliff between high and low tide, cutting a wave-cut notch. As the notch deepens, the rock above is left overhanging until it collapses. The cliff retreats inland, leaving behind a gently sloping, rocky wave-cut platform that is exposed at low tide.",
              "Soft rock retreats fastest. The Holderness coast in East Yorkshire is made of soft till left by glaciers, and it is retreating on average by around 2 m a year, one of the fastest rates in Europe. Many villages recorded there in the Middle Ages have since been lost to the sea, and decisions about whether to protect this coast are difficult and controversial.",
            ],
          },
          {
            heading: "Caves, arches, stacks and stumps",
            text: [
              "Headlands are eroded too, and in a recognisable sequence. Waves attack weaknesses such as joints and faults in the rock. Hydraulic action and abrasion widen a crack until it becomes a cave.",
              "If the cave is eroded right through the headland, or two caves on opposite sides meet, an arch forms. Durdle Door in Dorset is a famous limestone arch, and the Green Bridge of Wales in Pembrokeshire is another.",
              "The base of the arch keeps being eroded, while weathering such as freeze-thaw and rain weakens the roof from above. Eventually the roof collapses, leaving a tall pillar of rock standing apart from the headland: a stack. Examples include Old Harry in Dorset (chalk), Elegug Stacks in Pembrokeshire (limestone), the Duncansby Stacks near John o' Groats, and the Old Man of Hoy in Orkney, a sandstone stack about 137 m tall, one of the tallest in the UK.",
              "Waves continue to undercut the stack until it falls, leaving a low stump that may be covered at high tide. Old Harry once had a neighbouring stack known as Old Harry's Wife, which collapsed in 1896 and is now a stump. Along the Causeway Coast in Northern Ireland, the sea has exposed and sculpted the basalt columns of the Giant's Causeway, a UNESCO World Heritage Site since 1986. In 2001 the Dorset and East Devon coast, the 'Jurassic Coast', became England's first natural World Heritage Site.",
            ],
          },
        ],
        words: [
          { word: "fetch", meaning: "the distance of open water over which the wind blows to create waves" },
          { word: "hydraulic action", meaning: "erosion by the sheer force of water, and compressed air in cracks, breaking rock apart" },
          { word: "longshore drift", meaning: "the zigzag movement of sand and shingle along a coast by swash and backwash" },
          { word: "discordant coast", meaning: "a coast where bands of hard and soft rock meet the sea at right angles, forming headlands and bays" },
          { word: "wave-cut platform", meaning: "a gently sloping rocky surface left at the foot of a retreating cliff, exposed at low tide" },
          { word: "stack", meaning: "an isolated pillar of rock left standing in the sea after an arch collapses" },
        ],
      },
      practice: {
        intro: "Test your knowledge of coastal processes and landforms.",
        questions: [
          {
            type: "order",
            q: "Put these coastal landforms in the order they form from a headland.",
            items: ["Crack", "Cave", "Arch", "Stack", "Stump"],
          },
          {
            type: "match",
            q: "Match each process of wave erosion to its description.",
            pairs: [
              ["Hydraulic action", "Force of water and compressed air in cracks"],
              ["Abrasion", "Sand and pebbles hurled at the cliff"],
              ["Attrition", "Rocks knocking together and becoming rounder"],
              ["Solution", "Seawater dissolving chalk and limestone"],
            ],
          },
          {
            type: "choice",
            q: "On a discordant coast, why do headlands form where the rock is hard?",
            options: [
              "Hard rock attracts more sand",
              "Hard rock resists erosion, so it is left sticking out while softer rock is worn back into bays",
              "Waves never reach hard rock",
              "Hard rock is pushed upwards by the sea",
            ],
            answer: 1,
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "Waves cut a wave-cut ___ at the base of a cliff. The rock above collapses and the cliff ___, leaving a wave-cut ___ exposed at low tide.",
            bank: ["notch", "retreats", "platform", "advances", "arch", "spit"],
            answers: ["notch", "retreats", "platform"],
          },
          {
            type: "pick",
            q: "Which features describe destructive waves? There is more than one.",
            options: ["Tall and steep", "Strong backwash", "Strong swash that builds beaches", "Frequent", "Low and gentle"],
            answers: [0, 1, 3],
          },
        ],
      },
      task: {
        title: "Explain a coastline and make a management decision",
        intro: "Show how a headland is eroded over time, then use evidence to recommend how one of the UK's fastest-eroding coastlines should be managed.",
        need: [
          "Paper, a pencil and coloured pencils",
          "Internet access for research (with a grown-up's permission), or the information below",
        ],
        steps: [
          "Draw a four-stage diagram showing a headland being eroded into a cave, an arch, a stack and a stump. Annotate each stage with the processes involved (hydraulic action, abrasion, weathering, collapse). Name a real UK example for the arch and the stack.",
          "Read about the options for managing the Holderness coast. Hard engineering uses structures: sea walls, rock armour (large boulders at the cliff foot) and groynes (barriers that trap sand moving by longshore drift). Soft engineering works with nature, for example beach nourishment (adding sand to a beach). Managed retreat means allowing the coast to erode and helping people and buildings move back.",
          "Consider the evidence: in 1991, about £2 million was spent on two rock groynes and rock armour to protect the village of Mappleton. The beach there grew and the village was protected, but because the groynes trapped sediment, less sand reached the coast to the south, and erosion there increased.",
          "Think about different stakeholders: homeowners, farmers whose fields are disappearing, caravan park owners, the local council, taxpayers, and people living further along the coast.",
          "Write a recommendation of 300 to 400 words: 'Should the whole Holderness coast be protected?' Explain the problem, compare at least two options with their advantages and disadvantages, refer to Mappleton as evidence, and reach a justified conclusion. Remember there is no single right answer; marks at GCSE go to well-supported arguments.",
        ],
      },
      exit: [
        { type: "choice", q: "What is fetch?", options: ["The height of a wave", "The distance of open water the wind blows over", "The time between two waves", "The sand carried by a wave"], answer: 1 },
        { type: "order", q: "Put these in the order they form.", items: ["Cave", "Arch", "Stack", "Stump"] },
        { type: "choice", q: "Which coastal landform is Durdle Door?", options: ["A stack", "A spit", "An arch", "A wave-cut platform"], answer: 2 },
        { type: "type", q: "What is the name for the movement of material along a coast in a zigzag by swash and backwash?", answer: ["longshore drift", "Longshore drift", "longshore", "long shore drift"] },
        { type: "pick", q: "Which are features of constructive waves? There is more than one.", options: ["Low and gentle", "Strong swash", "Strong backwash that drags material away", "They build beaches"], answers: [0, 1, 3] },
        { type: "choice", q: "Why is the Holderness coast retreating so quickly?", options: ["It is made of soft till (boulder clay) that waves erode easily", "It is made of very hard granite", "It faces away from the sea", "It has no waves"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and coloured pencils", "Supervised internet access for research (optional)"],
        tips: [
          "Coastal management is a GCSE favourite because it involves weighing up evidence and viewpoints. Ask 'who wins and who loses?' about each option.",
          "If you visit a coast, keep well back from cliff edges and away from the cliff foot, where rockfalls happen without warning. Check tide times before walking on beaches or wave-cut platforms.",
          "Old Harry's Wife fell in 1896; Old Harry himself will eventually become a stump too. Coastal change is ongoing, which makes it real for learners.",
        ],
        younger: "Complete the four-stage headland diagram with one sentence per stage, and write a short paragraph saying whether you would protect a village on a crumbling cliff, and why.",
        older: "Research the Shoreline Management Plan for the Holderness coast and explain what 'hold the line', 'managed realignment' and 'no active intervention' mean. Evaluate the idea that protecting one place can shift the problem elsewhere.",
      },
    },

    // ---------- Lesson 6 ----------
    {
      slug: "uk-landscapes-6",
      title: "National parks: managing land use and tourism",
      emoji: "🥾",
      minutes: 60,
      goal: "I can explain what national parks are for, describe conflicts over land use, and evaluate how tourism is managed in a UK national park.",
      starter: [
        { type: "order", q: "Put these in the order they form from a headland.", items: ["Cave", "Arch", "Stack", "Stump"] },
        { type: "choice", q: "On a discordant coast, what forms where the rock is soft?", options: ["Headlands", "Stacks", "Arches", "Bays"], answer: 3 },
        { type: "match", q: "Match each landform to its UK example.", pairs: [["Arch", "Durdle Door"], ["Stack", "Old Man of Hoy"], ["Spit", "Spurn Head"]] },
        { type: "type", q: "Which wave erosion process uses the force of water and air compressed in cracks? (Two words.)", answer: ["hydraulic action", "Hydraulic action", "Hydraulic Action"] },
        { type: "choice", q: "What is rock armour?", options: ["Large boulders placed at the foot of a cliff to absorb wave energy", "A type of metamorphic rock", "Sand added to a beach", "A sea stack"], answer: 0 },
        { type: "choice", q: "What happened further south along the coast after rock groynes were built at Mappleton?", options: ["Erosion stopped everywhere", "Erosion increased because less sediment reached the beaches there", "A new spit formed at Mappleton", "Nothing changed"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What national parks are for",
            text: [
              "There are 15 national parks in the UK: 10 in England (counting the Broads, which has equivalent status), 3 in Wales and 2 in Scotland. Northern Ireland has none, although it has protected Areas of Outstanding Natural Beauty such as the Mourne and the Causeway Coast and Glens, and there has been a long debate about creating a Mourne national park.",
              "The movement for national parks grew from a demand for public access to the countryside. On 24 April 1932, several hundred walkers took part in the mass trespass on Kinder Scout in the Peak District, then closed to the public as a private grouse moor; five were jailed. After the Second World War, the National Parks and Access to the Countryside Act 1949 was passed, and the Peak District became the first national park in 1951, followed the same year by the Lake District, Snowdonia (Eryri) and Dartmoor. Scotland's two parks are more recent: Loch Lomond and The Trossachs (2002) and the Cairngorms (2003), which is the UK's largest.",
              "In England and Wales, national parks have two purposes: to conserve and enhance their natural beauty, wildlife and cultural heritage, and to promote opportunities for people to understand and enjoy them. When the two clash, conservation is given priority; this is known as the Sandford Principle. Scotland's parks have four aims, including the sustainable economic and social development of local communities.",
              "Crucially, UK national parks are not wilderness owned by the state. They are living landscapes where people live and work. Most of the land is privately owned, by farmers, estates, water companies and charities such as the National Trust. A national park authority plans and manages each park, balancing the needs of residents, visitors, businesses and the environment.",
            ],
          },
          {
            heading: "Land use and conflict",
            text: [
              "National parks contain many land uses: hill farming (mostly sheep), forestry, reservoirs, quarrying, military training, tourism and housing, alongside conservation projects such as peat bog restoration and woodland planting. Because space is limited and many groups want different things, conflicts arise. The people and groups with an interest in a decision are called stakeholders.",
              "Water supply is one example. In the 1930s the valley of Mardale in the Lake District was flooded to create Haweswater reservoir for Manchester, and the village of Mardale Green was lost beneath the water. The Peak District's Ladybower reservoir also drowned two villages in the 1940s. Reservoirs provide water to millions of people, but they change landscapes and communities for ever.",
              "Quarrying is another. The Peak District's limestone is valuable for cement and construction, and quarries provide local jobs. But they also create dust, noise, heavy lorry traffic and visible scars on the landscape. Walkers and farmers can clash too: dogs that are not kept under control can worry or injure sheep, gates left open let livestock stray, and trampled paths and walls cost farmers money.",
              "Housing is a growing concern. In popular parks such as the Lake District, many houses in some villages are second homes or holiday lets. This pushes house prices beyond the reach of many young local people, so they move away, and village schools, shops and bus services can struggle as the year-round population falls.",
            ],
          },
          {
            heading: "Tourism: benefits, pressures and management",
            text: [
              "Tourism brings huge benefits. The Lake District, which became a UNESCO World Heritage Site in 2017, has around 40,000 residents but receives an estimated 18 million or so visitors a year. Tourism is its biggest employer, supporting hotels, cafés, outdoor centres, shops and transport, and visitor spending helps fund conservation.",
              "But visitors are not spread evenly. They crowd into honeypot sites, places that attract large numbers of people, such as Bowness-on-Windermere and Keswick in the Lake District, Malham Cove in the Yorkshire Dales, Castleton in the Peak District and the summit of Yr Wyddfa, which is climbed or reached by train by hundreds of thousands of people a year. The pressures include traffic congestion and illegal parking on narrow roads, litter, noise, disturbance to wildlife, wildfires started by barbecues or campfires on dry moorland, and footpath erosion, where trampling kills vegetation and rain washes away the soil, widening paths into deep scars.",
              "Park authorities use many strategies. Footpaths are repaired and 'stone-pitched' with locally sourced rock, as in the Lake District's long-running Fix the Fells project. Park-and-ride schemes and buses such as the Snowdon Sherpa in Eryri reduce cars. Car park charges, clear signs and ranger patrols manage behaviour, and campaigns spread visitors to less busy places and times. The Countryside Code (in England and Wales) and the Scottish Outdoor Access Code set out how to enjoy the countryside responsibly; in Scotland, the law gives a right of responsible access to most land.",
              "The aim is sustainable tourism: meeting the needs of today's visitors and residents without damaging the landscape for future generations. When you evaluate a strategy, ask how well it works, who benefits, who pays, and whether it just moves the problem somewhere else.",
            ],
          },
        ],
        words: [
          { word: "national park", meaning: "a large area of protected countryside, managed to conserve its landscape, wildlife and heritage and to help people enjoy it" },
          { word: "Sandford Principle", meaning: "the rule that, when conservation and recreation clash in a national park, conservation takes priority" },
          { word: "stakeholder", meaning: "a person or group with an interest in a decision or place" },
          { word: "honeypot site", meaning: "a place that attracts very large numbers of visitors" },
          { word: "footpath erosion", meaning: "the wearing away of paths by trampling, which kills vegetation and lets rain wash soil away" },
          { word: "sustainable tourism", meaning: "tourism that meets the needs of visitors and residents today without damaging the environment for the future" },
        ],
      },
      practice: {
        intro: "Apply what you know about national parks, land use and tourism.",
        questions: [
          {
            type: "match",
            q: "Match each country to the number of national parks it has.",
            pairs: [
              ["England", "10"],
              ["Wales", "3"],
              ["Scotland", "2"],
              ["Northern Ireland", "0"],
            ],
          },
          {
            type: "match",
            q: "Match each problem to a strategy that could manage it.",
            pairs: [
              ["Footpath erosion", "Stone-pitching paths"],
              ["Traffic congestion", "Park-and-ride buses"],
              ["Dogs worrying sheep", "Signs asking for dogs on leads near livestock"],
              ["Local people priced out of housing", "Limits on new second homes"],
            ],
          },
          {
            type: "choice",
            q: "A plan to build a large car park would bring more visitors but damage a wildflower meadow in a national park in England. Using the Sandford Principle, what should happen?",
            options: [
              "The car park should be built, because recreation comes first",
              "Conservation should take priority, so the meadow should be protected",
              "The decision should be made by the visitors who want to park",
              "Both purposes are ignored",
            ],
            answer: 1,
          },
          {
            type: "pick",
            q: "Which are pressures caused by tourism at honeypot sites? There is more than one.",
            options: ["Footpath erosion", "Traffic congestion", "More jobs in cafés and hotels", "Litter", "Wildfires from barbecues"],
            answers: [0, 1, 3, 4],
            why: "More jobs is a benefit of tourism, not a pressure.",
          },
          {
            type: "gap",
            q: "Fill in the gaps.",
            text: "The mass trespass on Kinder Scout took place in ___. The first UK national park, the ___ District, was created in ___.",
            bank: ["1932", "Peak", "1951", "Lake", "1066", "2003"],
            answers: ["1932", "Peak", "1951"],
          },
        ],
      },
      task: {
        title: "Write a national park management report",
        intro: "Research one UK national park and write a short report, as if for its national park authority, on a land use conflict and how tourism there should be managed.",
        need: [
          "Internet access for research (ask a grown-up first); national park authority websites are a good starting point",
          "Paper or a free, browser-based word processor",
          "An outline map of the UK",
        ],
        steps: [
          "Choose a national park, for example the Lake District, Peak District, Eryri, Bannau Brycheiniog, the Cairngorms or Loch Lomond and The Trossachs. Mark all 15 UK national parks on your outline map and highlight your chosen one.",
          "Write a park profile: location, area, approximate population and visitor numbers, the main rock types and landscapes (link back to lessons 2 to 5), and why it is valued.",
          "Describe one land use conflict in your park. Identify at least three stakeholders and explain each one's point of view in a short table.",
          "Identify one honeypot site and describe the pressures tourism puts on it, using data where you can find it.",
          "Evaluate two management strategies used in your park: how they work, how successful they seem, who benefits and who pays, and any drawbacks.",
          "Finish with a recommendation of about 150 words: what should the park authority do next, and why? Make sure it balances conservation, the local community and visitors. Note down the websites you used, and think about how reliable each one is.",
        ],
      },
      exit: [
        { type: "type", q: "How many national parks are there in the UK altogether?", answer: ["15", "fifteen", "Fifteen"] },
        { type: "choice", q: "Which was the first national park in the UK, created in 1951?", options: ["The Cairngorms", "The South Downs", "The Peak District", "The New Forest"], answer: 2 },
        { type: "choice", q: "What is a honeypot site?", options: ["A place where bees are kept", "A protected nature reserve with no visitors", "A place that attracts very large numbers of visitors", "A farm that sells local food"], answer: 2 },
        { type: "pick", q: "Which strategies are used to reduce footpath erosion or traffic in national parks? There is more than one.", options: ["Stone-pitching footpaths", "Park-and-ride buses", "Building more roads to every summit", "Car park charges"], answers: [0, 1, 3] },
        { type: "choice", q: "Why can second homes cause problems in villages in national parks?", options: ["They are always built on reservoirs", "They raise house prices and reduce the year-round population, so young local people and services can struggle", "They cause footpath erosion", "They are not allowed in national parks"], answer: 1 },
        { type: "choice", q: "Which statement about UK national parks is correct?", options: ["All the land is owned by the government", "Nobody is allowed to live in them", "People live and work in them, and most of the land is privately owned", "They are only found in Scotland"], answer: 2 },
      ],
      grownUp: {
        need: ["Supervised internet access", "Paper or a free online word processor", "An outline map of the UK"],
        tips: [
          "The national park authority websites are reliable and have 'facts and figures' pages. Encourage the learner to note where each figure comes from and how recent it is, as visitor numbers vary between sources and years.",
          "The number of national parks can change: Scotland has considered designating a third, and campaigners have long called for one in the Mournes. If the learner finds newer information, that is a good research point to discuss.",
          "If you can visit a national park, a short 'honeypot' observation (counting cars, noting litter, path condition and signs) makes excellent real fieldwork. Follow the Countryside Code or the Scottish Outdoor Access Code.",
        ],
        younger: "Write the park profile and describe one problem and one solution, using a simple table of stakeholders with one sentence for each.",
        older: "Compare the aims of national parks in Scotland with those in England and Wales, and evaluate whether the Sandford Principle should apply everywhere. Research the 'rewilding' debate in one park and present arguments for and against.",
      },
    },
  ],
};
