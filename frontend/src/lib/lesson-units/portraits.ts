import type { LessonUnit } from "@/lib/lessons";

/** Portraits and self-portraits, for ages 9 to 11. Uses pencils, paper, a mirror, old magazines and household craft bits. */
export const portraits: LessonUnit = {
  slug: "portraits",
  title: "Portraits and self-portraits",
  short: "Portraits",
  subject: "Art & Design",
  ages: "9 to 11",
  emoji: "🧑‍🎨",
  color: "#8C5A6B",
  summary: "Six lessons on reading portraits, the proportions of the face, drawing features, self-portraits from a mirror, expression and emotion, and artists from Rembrandt, Van Gogh and Frida Kahlo to Chila Kumari Singh Burman, ending with a mixed-media self-portrait.",
  cover: "/lessons/units/portraits.jpg",
  lessons: [
    {
      slug: "portraits-1",
      title: "What does a portrait tell us?",
      emoji: "🖼️",
      minutes: 50,
      goal: "I can explain what a portrait is and read the clues in a portrait to work out what it tells us about the sitter.",
      starter: [
        { type: "choice", q: "What is a portrait?", options: ["A picture of a landscape", "A picture of a person", "A picture of a bowl of fruit"], answer: 1 },
        { type: "choice", q: "What do we call a portrait an artist makes of themselves?", options: ["A self-portrait", "A still life", "A seascape"], answer: 0 },
        { type: "pick", q: "Which of these could be used to make a portrait? There is more than one.", options: ["Paint", "A camera", "Pencil", "Clay"], answers: [0, 1, 2, 3] },
        { type: "choice", q: "Before cameras were invented, how did people get a picture of what someone looked like?", options: ["They couldn't, there were no pictures at all", "An artist drew, painted or carved them", "They printed one from a computer"], answer: 1 },
        { type: "type", q: "What do you look into to see your own face?", answer: ["mirror", "a mirror", "the mirror"] },
        { type: "choice", q: "Which of these is a famous portrait painted by Leonardo da Vinci?", options: ["The Mona Lisa", "The Sunflowers", "The Starry Night"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Portraits and sitters",
            text: [
              "A portrait is a picture of a particular person, made so that we can recognise them. It might be a painting, a drawing, a photograph, a sculpture or even a collage. The person in a portrait is called the sitter, because for hundreds of years people had to sit still, sometimes for many hours, while an artist worked.",
              "A self-portrait is a portrait an artist makes of themselves. To see their own face, artists usually work from a mirror, or today from a photograph.",
              "Portraits come in different sizes and views. A head-and-shoulders portrait shows just the face and top of the body. A half-length portrait goes down to about the waist, and a full-length portrait shows the whole person. The face might look straight out at us (a front view), be turned slightly (a three-quarter view), or be seen from the side (a profile).",
            ],
          },
          {
            heading: "Why people had portraits made",
            text: [
              "The first practical cameras appeared around 1839. Before that, the only way to keep a picture of someone's face was to have an artist make one. Painted portraits were slow and expensive, so for centuries they were mostly made for kings, queens and wealthy families.",
              "A portrait was a way to be remembered after you died, to show people far away what you looked like, and to show off. Rulers had portraits painted to look powerful, and rich families hung portraits of their ancestors on their walls to show how important and long-standing their family was.",
              "In 1856 the National Portrait Gallery opened in London, one of the first galleries in the world just for portraits. Today it holds portraits of famous and everyday people from Tudor monarchs to modern scientists, sports stars and musicians.",
            ],
          },
          {
            heading: "Being a portrait detective",
            text: [
              "A portrait is never just a face. Artists and sitters choose every part of it carefully, so it is full of clues. A good way to read a portrait is to look at five things: the face and expression, the pose, the clothes, the background, and any objects.",
              "The expression and pose can suggest personality: a straight back and a steady stare can look confident or proud; a relaxed, slumped pose can look friendly or tired. Clothes tell us about the time and the person's wealth, job or culture.",
              "Objects in a portrait are often symbols, things that stand for an idea. In the 'Armada Portrait' of Queen Elizabeth I, painted around 1588, she rests her hand on a globe. It suggests that her power reached across the world. A book might suggest someone is clever, and a musical instrument might show a love of music.",
              "When you read a portrait, back up each idea with evidence: 'I think she is wealthy because she is wearing pearls and a silk dress.'",
            ],
          },
        ],
        words: [
          { word: "portrait", meaning: "a picture of a particular person" },
          { word: "self-portrait", meaning: "a portrait an artist makes of themselves" },
          { word: "sitter", meaning: "the person shown in a portrait" },
          { word: "pose", meaning: "the way a person sits or stands in a picture" },
          { word: "profile", meaning: "a view of a face from the side" },
          { word: "symbol", meaning: "an object or picture that stands for an idea" },
        ],
      },
      practice: {
        intro: "Read the clues.",
        questions: [
          {
            type: "match",
            q: "Match each type of portrait to what it shows.",
            pairs: [["Head and shoulders", "The face and the top of the body"], ["Half-length", "The person down to about the waist"], ["Full-length", "The whole person from head to toe"], ["Profile", "The face seen from the side"]],
          },
          { type: "choice", q: "A queen is painted with her hand on a globe. What is the globe most likely to be?", options: ["A toy she liked", "A symbol of her power across the world", "Something the artist added to fill a gap"], answer: 1 },
          { type: "choice", q: "Why were most portraits before about 1840 of rich and powerful people?", options: ["Ordinary people weren't allowed to look at paintings", "Painted portraits took a long time and cost a lot of money", "Only rich people had faces worth painting"], answer: 1 },
          {
            type: "pick",
            q: "A man is painted in a lab coat, holding a test tube, with shelves of jars behind him. Which are sensible conclusions? There is more than one.",
            options: ["He is probably a scientist", "He is probably a king", "The setting shows where he works", "He hated science"],
            answers: [0, 2],
          },
          { type: "gap", q: "Fill in the gaps.", text: "The person in a portrait is called the ___. An object that stands for an idea is called a ___.", bank: ["sitter", "symbol", "frame", "easel"], answers: ["sitter", "symbol"] },
        ],
      },
      task: {
        title: "Portrait detective",
        intro: "Read a real portrait closely, then make a quick portrait of your own that is full of clues.",
        need: [
          "A portrait to study: a family photo, a picture in a book or magazine, or a portrait in an online gallery with a grown-up",
          "Paper and a pencil",
          "Coloured pencils (optional)",
        ],
        steps: [
          "Choose one portrait. If you look online, ask a grown-up to help you search a gallery such as the National Portrait Gallery's website.",
          "Write five headings: face and expression, pose, clothes, background, objects. Under each, write what you notice and what you think it tells you.",
          "Write three 'I think... because...' sentences about the sitter, using evidence from the picture.",
          "Now plan a portrait of someone in your home. Decide on two or three objects that would tell a stranger something about them, such as a football, a favourite mug or a book.",
          "Draw a quick head-and-shoulders sketch of them with those objects around them. Ask them to guess what each object says about them.",
        ],
      },
      exit: [
        { type: "choice", q: "What do we call the person shown in a portrait?", options: ["The sitter", "The artist", "The model maker"], answer: 0 },
        { type: "choice", q: "What is a profile view?", options: ["A face looking straight out at us", "A face seen from the side", "A face seen from above"], answer: 1 },
        { type: "pick", q: "Which of these are clues a portrait detective looks at? There is more than one.", options: ["Clothes", "Objects", "The price of the frame", "Background", "Pose"], answers: [0, 1, 3, 4] },
        { type: "type", q: "What word means an object that stands for an idea, like a globe standing for power?", answer: ["symbol", "a symbol"] },
        { type: "choice", q: "Why did rich families hang portraits of their ancestors on their walls?", options: ["To cover damp patches", "To show how important and long-standing their family was", "Because the law said they must"], answer: 1 },
        { type: "choice", q: "Which is the best 'portrait detective' sentence?", options: ["She is nice.", "I like the colours.", "I think she plays music because she is holding a violin."], answer: 2 },
      ],
      grownUp: {
        need: ["A family photo or a book with portraits in it", "Paper, pencil and coloured pencils", "Optional: supervised access to an online gallery"],
        tips: [
          "Push for evidence every time: 'What in the picture makes you think that?' That habit is the heart of art appreciation.",
          "The National Portrait Gallery and Art UK websites let you browse thousands of portraits for free. Stay with your child while they search.",
          "Family photos are portraits too. Talk about how someone chose the pose, the setting and what to wear.",
        ],
        younger: "Just compare two portraits and spot three differences in the clothes, pose and background.",
        older: "Compare an old painted portrait with a modern celebrity photo. What has changed in the way people want to be seen, and what has stayed the same?",
      },
    },
    {
      slug: "portraits-2",
      title: "The proportions of the face",
      emoji: "📐",
      minutes: 50,
      goal: "I can use guidelines to place the eyes, nose, mouth and ears in the right proportions on a face.",
      starter: [
        { type: "choice", q: "What is the person in a portrait called?", options: ["The sitter", "The frame", "The curator"], answer: 0 },
        { type: "choice", q: "What is a symbol in a portrait?", options: ["The artist's signature", "An object that stands for an idea", "The colour of the background"], answer: 1 },
        { type: "match", q: "Match each view to its meaning.", pairs: [["Profile", "From the side"], ["Front view", "Looking straight out"], ["Full-length", "The whole body"]] },
        { type: "pick", q: "Which of these did portrait detectives look at last lesson? There is more than one.", options: ["Pose", "Clothes", "Background", "The weight of the canvas"], answers: [0, 1, 2] },
        { type: "type", q: "What do we call a portrait an artist makes of themselves?", answer: ["self-portrait", "a self-portrait", "self portrait", "a self portrait"] },
        { type: "choice", q: "Why were most early portraits of wealthy people?", options: ["They were expensive and slow to make", "Poor people were not allowed to sit still"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Proportion",
            text: [
              "Proportion means how big the parts of something are compared with each other and with the whole. When the proportions of a face are right, a drawing looks like a real person, even if it is simple.",
              "Everybody's face is different, but almost all faces follow the same rough plan. Artists have studied this plan for hundreds of years. Learning it gives you a framework to build on, and then you look carefully at your sitter to see how their face is special.",
              "Start with the shape of the head. From the front, a head is roughly an egg shape: a little wider at the top, around the skull, and narrower at the chin. It is taller than it is wide.",
            ],
          },
          {
            heading: "Eyes halfway down",
            text: [
              "Here is the surprise that changes most people's drawings: the eyes are about halfway down the head. Draw a light line across the middle of your egg, from side to side. The eyes sit on this line.",
              "Most people draw the eyes much too high, because we think of the forehead as small. In fact the top half of the head holds the forehead, the hair and the skull, which keeps our brain safe.",
              "The face is about five eyes wide. There is one eye-width between the two eyes, and about one eye-width from each eye to the edge of the face. Mark five equal spaces along your eye line and draw the eyes in the second and fourth spaces.",
              "Draw a light line straight down the middle of the face too. This centre line helps you keep the face balanced, with the nose and mouth in the middle.",
            ],
          },
          {
            heading: "Nose, mouth and ears",
            text: [
              "The bottom of the nose is roughly halfway between the eye line and the chin. The line where the lips meet is about a third of the way down from the nose to the chin.",
              "If you draw straight lines down from the centres of the eyes (the pupils), they usually land near the corners of the mouth. The nostrils line up with the inside corners of the eyes.",
              "The ears are on the sides of the head, between two guidelines: the top of the ear is about level with the eyebrows, and the bottom is about level with the bottom of the nose. That makes ears much bigger than most people expect!",
              "The neck is not a thin stick. It starts just below the ears and is nearly as wide as the jaw. Draw all your guidelines very lightly, so you can rub them out at the end.",
            ],
          },
        ],
        words: [
          { word: "proportion", meaning: "how big the parts of something are compared with each other and the whole" },
          { word: "guideline", meaning: "a light line drawn to help place things, rubbed out later" },
          { word: "eye line", meaning: "the line halfway down the head where the eyes sit" },
          { word: "centre line", meaning: "a line down the middle of the face that keeps it balanced" },
          { word: "framework", meaning: "a basic plan or structure you build a drawing on" },
        ],
      },
      practice: {
        intro: "Where does everything go?",
        questions: [
          { type: "choice", q: "Where are the eyes on a head seen from the front?", options: ["About a quarter of the way down", "About halfway down", "About three quarters of the way down"], answer: 1 },
          {
            type: "order",
            q: "Put these in order from the top of the head to the bottom.",
            items: ["Hairline", "Eyebrows", "Eye line", "Bottom of the nose", "Line between the lips", "Chin"],
          },
          { type: "type", q: "A face is about how many eyes wide? Type a number.", answer: ["5", "five"] },
          { type: "choice", q: "The top of the ear is about level with the eyebrows. Where is the bottom of the ear?", options: ["Level with the chin", "Level with the bottom of the nose", "Level with the eyes"], answer: 1 },
          { type: "choice", q: "Why do most people draw the eyes too high?", options: ["Eyes really are near the top of the head", "They forget how much space the forehead, hair and skull take up", "Pencils make lines go upwards"], answer: 1 },
        ],
      },
      task: {
        title: "Build a face",
        intro: "Use guidelines to draw a face with believable proportions, then check them on a real face.",
        need: ["Paper", "A pencil (a soft one, like 2B, if you have it)", "A rubber", "A ruler", "A grown-up or a photo of a face from a magazine"],
        steps: [
          "Draw a large egg shape, wider at the top, filling most of your page. Press very lightly.",
          "Draw a light centre line down the middle and a line across the middle. That is your eye line.",
          "Divide the eye line into five equal spaces with small marks. Draw an almond-shaped eye in the second and fourth spaces.",
          "Mark the bottom of the nose halfway between the eye line and the chin. Mark the line of the mouth a third of the way from the nose to the chin. Draw lines down from the pupils to find the corners of the mouth.",
          "Add the ears between the eyebrow level and the bottom of the nose, then the neck and the hair, which sits on top of the skull, not inside it.",
          "Now test the rules: gently measure a grown-up's face with your fingers, or rule lines across a magazine photo. Are the eyes really halfway? Write down one way their face follows the rules and one way it is special.",
        ],
      },
      exit: [
        { type: "choice", q: "What does proportion mean?", options: ["How bright the colours are", "How big parts are compared with each other and the whole", "How long a drawing takes"], answer: 1 },
        { type: "choice", q: "Where do the eyes go on a face seen from the front?", options: ["About halfway down the head", "Right at the top of the head", "Just above the mouth"], answer: 0 },
        { type: "gap", q: "Fill in the gaps.", text: "A face is about ___ eyes wide, with one eye-width ___ the two eyes.", bank: ["five", "between", "three", "above"], answers: ["five", "between"] },
        { type: "choice", q: "Where is the bottom of the nose?", options: ["Level with the eyes", "Touching the chin", "About halfway between the eye line and the chin"], answer: 2 },
        { type: "pick", q: "Which are true about ears on a front-view face? There is more than one.", options: ["The top is about level with the eyebrows", "They are tiny, about the size of a pea", "The bottom is about level with the bottom of the nose"], answers: [0, 2] },
        { type: "type", q: "What do we call the light lines that help you place features and get rubbed out later?", answer: ["guidelines", "guideline", "guide lines", "construction lines"] },
      ],
      grownUp: {
        need: ["Paper, pencil, rubber, ruler", "A magazine with a large face photo (optional)"],
        tips: [
          "Insist on very light guidelines. Many children press hard and then can't rub them out, which puts them off.",
          "The 'eyes halfway' rule is often the biggest single improvement. Let your child measure your face with their fingers: it convinces them.",
          "Stress that the rules are a starting point. Real faces vary, and noticing how a face differs from the plan is what makes a likeness.",
        ],
        younger: "Use a paper plate as the head, fold it in half to find the eye line, and stick on cut-out features in the right places.",
        older: "Try a profile view: the eye line is still halfway, and the ear sits just behind the middle of the head. Compare it with your front view.",
      },
    },
    {
      slug: "portraits-3",
      title: "Drawing eyes, noses and mouths",
      emoji: "👁️",
      minutes: 50,
      goal: "I can draw facial features by looking carefully at their real shapes and using tone, instead of drawing symbols.",
      starter: [
        { type: "choice", q: "Where do the eyes sit on the head?", options: ["About halfway down", "Near the top"], answer: 0 },
        { type: "type", q: "A face is about how many eyes wide?", answer: ["5", "five"] },
        { type: "choice", q: "The top of the ear lines up with...", options: ["the chin", "the eyebrows", "the mouth"], answer: 1 },
        { type: "choice", q: "If you draw lines straight down from the pupils, where do they usually land?", options: ["Near the corners of the mouth", "On the ears", "On the tip of the nose"], answer: 0 },
        { type: "choice", q: "What shape is a head from the front, roughly?", options: ["A perfect circle", "An egg shape, wider at the top", "A square"], answer: 1 },
        { type: "gap", q: "Fill in the gap.", text: "How big parts are compared with each other is called ___.", bank: ["proportion", "texture", "colour"], answers: ["proportion"] },
      ],
      learn: {
        cards: [
          {
            heading: "Draw what you see, not what you know",
            text: [
              "When we are little, we learn to draw faces with symbols: a circle with a dot for an eye, a triangle or an 'L' for a nose, a curved line for a smile. Symbols are quick, but they don't look like anybody in particular.",
              "To draw a real face, you need to look as if you have never seen a face before. Spend more time looking than drawing. Look, draw a little, look again.",
              "Real features are made of soft shapes and changes of tone, which means how light or dark something is. Very few parts of a face have hard outlines. Using a soft pencil, like a 2B or 4B, lets you press lightly for pale tones and harder for dark ones.",
            ],
          },
          {
            heading: "Eyes",
            text: [
              "An eye is not a circle. It is shaped more like an almond or a lemon on its side, often slightly pointier at the inner corner, where there is a small pink tear duct.",
              "The coloured part, the iris, is a circle, but the top lid almost always covers a little of it, and the bottom lid often just touches it. If you draw the whole iris as a full circle, the eye looks startled. In the middle is the dark pupil.",
              "Leave a tiny white dot on the iris or pupil where light reflects. This highlight makes an eye look shiny and alive. The upper lid line is usually darker and thicker than the lower one, because of the lashes and the shadow they cast.",
              "Eyelashes don't stick out like spikes. Show them with a dark, slightly thicker upper lid line and a few curved flicks at the outer corner. Eyebrows sit on the bony ridge above the eye; draw them with short strokes in the direction the hairs grow.",
            ],
          },
          {
            heading: "Noses, mouths, ears and hair",
            text: [
              "A nose has almost no outline from the front. Draw the nostrils, which are dark curved shapes, and the round tip between them. Then shade softly down one side of the nose and under the tip, where shadow falls. The tone does the work, not a line.",
              "For the mouth, the darkest line is where the lips meet, and it is wavy, not straight. The top lip faces downwards, so it is usually in shadow and looks darker. The bottom lip faces up and catches the light, so show it mainly with a small shadow underneath.",
              "Ears look like a curvy 'C' or a question mark with an inner fold. Hair grows in clumps and in a direction. Draw the big shapes of the hair first, then add strokes that follow the way it falls. Shade darker near the parting and underneath, where less light reaches.",
            ],
          },
        ],
        words: [
          { word: "tone", meaning: "how light or dark something is" },
          { word: "iris", meaning: "the coloured circle of the eye" },
          { word: "pupil", meaning: "the black centre of the eye that lets light in" },
          { word: "highlight", meaning: "the lightest spot, where light reflects" },
          { word: "observe", meaning: "to look very carefully and closely" },
          { word: "symbol drawing", meaning: "a quick, simple shape we use instead of drawing what we really see" },
        ],
      },
      practice: {
        intro: "Look closely at features.",
        questions: [
          { type: "choice", q: "What shape is an eye, seen from the front?", options: ["A circle", "A square", "An almond or lemon shape"], answer: 2 },
          {
            type: "match",
            q: "Match each part to the right drawing tip.",
            pairs: [["Iris", "Partly hidden by the top lid"], ["Highlight", "Leave a tiny white spot"], ["Nose", "Draw the nostrils and shade, don't outline"], ["Mouth", "Darkest where the lips meet"]],
          },
          { type: "choice", q: "Why is the top lip usually darker than the bottom lip?", options: ["It faces downwards, so it is in shadow", "It is always painted with lipstick", "It is bigger"], answer: 0 },
          { type: "pick", q: "Which of these are symbol drawings rather than observed drawings? There is more than one.", options: ["A circle with a dot for an eye", "An 'L' shape for a nose", "Soft shading beside the nose", "A banana-shaped smile line"], answers: [0, 1, 3] },
          { type: "type", q: "What is the word for how light or dark something is?", answer: ["tone", "tones"] },
        ],
      },
      task: {
        title: "Feature studies",
        intro: "Fill a page with careful studies of eyes, noses and mouths, looking at a real face or a magazine photo.",
        need: ["Paper or a sketchbook", "Pencils, ideally an HB and a soft 2B or 4B", "A rubber", "A mirror, or a large face photo from a magazine"],
        steps: [
          "Fold your paper into six boxes. Label nothing: this page is for looking.",
          "In the first box, draw one eye, life-size or bigger, from the mirror or photo. Start with the almond shape, then the iris tucked under the top lid, the pupil and a white highlight.",
          "In the second box, draw the same eye again, but add tone: darken the upper lid line, shade the iris and add soft shadow in the corner.",
          "Use the next two boxes for the nose. Draw the nostrils and the shadows only, with no outline down the sides. Squint to see where the dark parts are.",
          "Use the last two boxes for the mouth. Start with the wavy line where the lips meet, then shade the top lip and add a shadow under the bottom lip.",
          "Look back at your page. Circle your best study and write one sentence explaining what makes it look real.",
        ],
      },
      exit: [
        { type: "choice", q: "What is the iris?", options: ["The coloured circle of the eye", "The eyebrow", "The tear duct"], answer: 0 },
        { type: "choice", q: "Why do artists leave a small white highlight in an eye?", options: ["They ran out of pencil", "It shows light reflecting, which makes the eye look shiny and alive", "Real eyes have a white dot painted on them"], answer: 1 },
        { type: "choice", q: "What is the best way to draw a nose from the front?", options: ["A strong outline down both sides", "A triangle", "Nostrils and soft shading where shadow falls"], answer: 2 },
        { type: "gap", q: "Fill in the gaps.", text: "On a mouth, the darkest line is where the lips ___. The ___ lip is usually in shadow.", bank: ["meet", "top", "bottom", "open"], answers: ["meet", "top"] },
        { type: "pick", q: "Which tips help when drawing hair? There is more than one.", options: ["Draw the big shapes first", "Draw every single hair one by one", "Follow the direction it grows", "Shade darker underneath and near the parting"], answers: [0, 2, 3] },
        { type: "choice", q: "Why does a whole circle for the iris make an eye look startled?", options: ["Because normally the top lid covers a little of the iris", "Because circles are scary", "Because irises are square"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper, HB and soft pencils, rubber", "A mirror or magazine photos"],
        tips: [
          "Children aged 9 to 11 often get frustrated that their drawings look 'babyish'. This lesson is the fix: name the symbol habit kindly and show them the alternative.",
          "Squinting at the face blurs the detail and shows the light and dark shapes clearly. Try it together.",
          "Big studies are easier than small ones. Encourage eyes drawn at least as big as real life.",
        ],
        younger: "Focus only on the eye: almond shape, iris under the lid, highlight. Three drawings of one eye is plenty.",
        older: "Draw the same feature lit from one side with a torch or lamp, and notice how the shadows change shape.",
      },
    },
    {
      slug: "portraits-4",
      title: "Self-portraits with a mirror",
      emoji: "🪞",
      minutes: 50,
      goal: "I can draw a self-portrait from a mirror, and explain how Rembrandt and Van Gogh used self-portraits.",
      starter: [
        { type: "choice", q: "What shape is an eye?", options: ["An almond or lemon shape", "A circle", "A triangle"], answer: 0 },
        { type: "type", q: "What is the coloured part of the eye called?", answer: ["iris", "the iris"] },
        { type: "choice", q: "What makes an eye look shiny and alive in a drawing?", options: ["A thick black outline", "A small white highlight", "Lots of eyelash spikes"], answer: 1 },
        { type: "choice", q: "On a mouth, where is the darkest line?", options: ["Around the outside", "Where the lips meet", "On the bottom lip"], answer: 1 },
        { type: "pick", q: "Which are good ways to draw a nose from the front? There is more than one.", options: ["Draw the nostrils", "Shade where shadow falls", "Draw a big 'L'"], answers: [0, 1] },
        { type: "choice", q: "What does 'draw what you see, not what you know' mean?", options: ["Copy someone else's drawing", "Look closely at real shapes instead of using symbols", "Draw with your eyes shut"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Rembrandt: a life in self-portraits",
            text: [
              "Rembrandt van Rijn (1606 to 1669) was a Dutch painter, born in Leiden, who spent most of his working life in Amsterdam. He is one of the most famous artists who ever lived, and he made about 80 self-portraits in paintings, drawings and etchings: more than almost any artist before him.",
              "As a young man he used a mirror to study his own face pulling expressions, such as surprise or a frown, to practise for his story paintings. Later his self-portraits became a record of his whole life, from a confident young man in fancy clothes to an old man with a lined face and a tired, thoughtful look.",
              "Rembrandt was a master of light and shadow. He often lit one side of his face and let the rest fall into deep darkness, so the face seems to glow out of the picture. He painted himself honestly, wrinkles and all. You can see two of his self-portraits, painted at the ages of 34 and 63, in the National Gallery in London.",
            ],
          },
          {
            heading: "Van Gogh and his mirror",
            text: [
              "Vincent van Gogh (1853 to 1890) was also Dutch. He painted more than 35 self-portraits, most of them between 1886 and 1889, while he lived in Paris and then in the south of France.",
              "One reason was money. Van Gogh was poor and could rarely afford to pay a model to sit for him. In a letter to his brother Theo, he wrote that he had bought a good mirror on purpose, so he could paint himself when he had no model.",
              "His self-portraits were a way to practise colour and brushwork. He tried out bright, contrasting colours and short, energetic strokes, with the marks swirling or rippling in the background around his head. Each one shows his face looking intently back at us, because that is exactly what he was doing: staring hard into the mirror.",
            ],
          },
          {
            heading: "How to draw yourself",
            text: [
              "Prop a mirror up on a table so you can see your whole face without moving your head, about an arm's length away. Sit by a window or a lamp, with the light coming from one side. Side light makes shadows that show the shape of your face, just as Rembrandt liked.",
              "A mirror flips you left to right. If your hair is parted on your left, the mirror shows it on the right. A self-portrait drawn from a mirror shows you as the mirror sees you, which is why some people's self-portraits look slightly 'wrong' to their friends.",
              "Warm up with a blind contour drawing: look only at your face in the mirror, never at the paper, and slowly follow its edges with one continuous pencil line. It looks funny, but it trains your eye to look properly.",
              "Then build your real self-portrait: light egg shape and guidelines, eyes halfway, features placed with the rules you know, and then lots of looking. Your face won't keep perfectly still, so choose one expression and come back to it each time you look up.",
            ],
          },
        ],
        words: [
          { word: "self-portrait", meaning: "a portrait an artist makes of themselves" },
          { word: "etching", meaning: "a print made from a metal plate with lines scratched and eaten into it by acid" },
          { word: "reflection", meaning: "the image you see in a mirror, flipped left to right" },
          { word: "blind contour", meaning: "a drawing made while looking only at the subject, not the paper" },
          { word: "light source", meaning: "where the light is coming from, such as a window or lamp" },
        ],
      },
      practice: {
        intro: "Two Dutch masters and a mirror.",
        questions: [
          {
            type: "match",
            q: "Match each fact to the right artist.",
            pairs: [["Lived from 1606 to 1669", "Rembrandt"], ["Lived from 1853 to 1890", "Van Gogh"]],
          },
          { type: "choice", q: "Why did Van Gogh paint so many self-portraits?", options: ["He was not allowed to paint other people", "He often couldn't afford to pay a model", "He didn't like painting outdoors"], answer: 1 },
          { type: "choice", q: "What do Rembrandt's self-portraits show over the years?", options: ["Exactly the same young face every time", "His face changing from a young man to an old man", "Only his hands"], answer: 1 },
          { type: "choice", q: "Your hair is parted on your left. Where will the parting be in the mirror?", options: ["On the left", "On the right", "In the middle"], answer: 1 },
          { type: "pick", q: "Which help you draw a good self-portrait? There is more than one.", options: ["A mirror you don't have to hold", "Light from one side", "Looking at the mirror often", "Drawing from memory with your eyes closed"], answers: [0, 1, 2] },
        ],
      },
      task: {
        title: "My self-portrait",
        intro: "Draw a careful self-portrait from a mirror, using everything you have learnt about proportion and features.",
        need: ["A mirror that can stand up or be propped against books", "Paper", "HB and soft pencils", "A rubber", "A window or a lamp"],
        steps: [
          "Set up your mirror at arm's length with light coming from one side. Handle the mirror carefully; ask a grown-up to help prop up a glass one safely.",
          "Warm up: do a two-minute blind contour drawing of your face. Look only in the mirror. Laugh at it, then put it aside.",
          "On a fresh page, draw a light egg shape and guidelines. Check: are your eyes halfway down?",
          "Draw your features one at a time, looking more than you draw. Keep the same expression each time you look up.",
          "Add tone: find the shadow side of your face and shade it softly, darker under the nose, chin and hair. Leave the highlights white.",
          "Write the date on the back. Like Rembrandt, keep it, and draw yourself again in a year to see how you have changed.",
        ],
      },
      exit: [
        { type: "choice", q: "Which country were Rembrandt and Van Gogh both from?", options: ["Spain", "The Netherlands", "France"], answer: 1 },
        { type: "choice", q: "About how many self-portraits did Rembrandt make in paintings, drawings and etchings?", options: ["About 5", "About 1,000", "About 80"], answer: 2 },
        { type: "choice", q: "What was Rembrandt especially famous for in his portraits?", options: ["Light and shadow", "Neon lights", "Cut-up photographs"], answer: 0 },
        { type: "type", q: "What did Van Gogh buy so he could paint himself when he had no model?", answer: ["mirror", "a mirror", "a good mirror"] },
        { type: "choice", q: "Why does a self-portrait from a mirror sometimes look slightly 'wrong' to your friends?", options: ["A mirror flips your face left to right", "Mirrors make you look older", "Mirrors change your eye colour"], answer: 0 },
        { type: "choice", q: "What is a blind contour drawing?", options: ["A drawing in the dark", "A drawing made while looking only at the subject, not the paper", "A drawing with no face"], answer: 1 },
      ],
      grownUp: {
        need: ["A stable mirror (a bathroom cabinet mirror or a propped-up one)", "Paper, pencils, rubber", "A lamp or a sunny window"],
        tips: [
          "If you use a glass mirror, prop it securely against books or a wall, and keep it away from table edges.",
          "Self-portraits can make some children self-conscious. Keep the talk on looking and drawing, not on looks, and praise effort and observation.",
          "Searching for Rembrandt's and Van Gogh's self-portraits online is very worthwhile; do it together. The National Gallery, Kenwood House and the Van Gogh Museum all show them.",
        ],
        younger: "Draw just the eyes and eyebrows from the mirror, then build the rest of the face more simply.",
        older: "Compare an early and a late Rembrandt self-portrait and write a paragraph on how he shows his age and mood.",
      },
    },
    {
      slug: "portraits-5",
      title: "Expression, emotion and Frida Kahlo",
      emoji: "🌺",
      minutes: 50,
      goal: "I can show emotion in a portrait through the eyebrows, eyes and mouth, and explain how Frida Kahlo used symbols to show her feelings.",
      starter: [
        { type: "choice", q: "Why did Van Gogh paint so many self-portraits?", options: ["He often had no money for a model", "He was told to by a king"], answer: 0 },
        { type: "choice", q: "What did Rembrandt's self-portraits record?", options: ["His face from youth to old age", "Only his pets", "Famous battles"], answer: 0 },
        { type: "choice", q: "What does a mirror do to your face?", options: ["Flips it upside down", "Flips it left to right", "Makes it bigger"], answer: 1 },
        { type: "type", q: "Which Dutch painter lived from 1606 to 1669?", answer: ["Rembrandt", "Rembrandt van Rijn", "rembrandt"] },
        { type: "pick", q: "Which help when drawing a self-portrait? There is more than one.", options: ["Light from one side", "A propped-up mirror", "Never looking at the mirror"], answers: [0, 1] },
        { type: "choice", q: "What kind of drawing do you make while looking only at your subject?", options: ["A blind contour drawing", "A collage", "A symbol drawing"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "How faces show feelings",
            text: [
              "Our faces have over 40 small muscles that pull the skin into different shapes. Tiny changes around the eyebrows, eyes and mouth show other people how we feel, often before we say a word.",
              "Eyebrows are very expressive. Raised high, they show surprise. Pulled down and together, they show anger or concentration. When the inner ends lift up, a face looks sad or worried.",
              "In a real smile, the corners of the mouth lift, the cheeks push up and the eyes crinkle at the corners. A smile with no change around the eyes can look forced. In sadness, the corners of the mouth drop; in fear, the eyes open very wide and the eyebrows lift and pull together.",
            ],
          },
          {
            heading: "Frida Kahlo",
            text: [
              "Frida Kahlo (1907 to 1954) was a Mexican painter, born in Coyoacán, which is now part of Mexico City. When she was 18, she was very badly hurt in an accident when the bus she was riding in crashed into a tram. She had to spend months lying in bed to recover.",
              "To help, her mother had a special easel made that she could use lying down, and a mirror fixed above her bed. Frida began to paint, and the face she saw most was her own. Of her roughly 140 paintings, about 55 are self-portraits. She once said that she painted herself because she was so often alone, and because she was the subject she knew best.",
              "She painted herself honestly, including her joined eyebrows and the faint hair on her top lip. She often wore traditional Tehuana dresses from southern Mexico, with flowers and ribbons in her hair, to celebrate Mexican culture.",
            ],
          },
          {
            heading: "Feelings through symbols",
            text: [
              "Here is something surprising about Frida Kahlo's self-portraits: her face is nearly always calm and serious, looking straight at us. She rarely smiles or frowns. Instead, she shows her feelings through what she puts around herself.",
              "She filled her pictures with symbols: monkeys, parrots, her dogs, a deer, hummingbirds, butterflies, thorns, leaves and tropical plants. Some stand for her love of Mexico and nature, and some show pain or sadness, like a necklace of thorns. Sometimes she painted small tears on her steady face.",
              "This gives artists two ways to show emotion. You can show it in the face itself, through the eyebrows, eyes and mouth. Or, like Kahlo, you can keep the face still and let the colours, background and objects tell the story. Many of the strongest portraits do a little of both.",
            ],
          },
        ],
        words: [
          { word: "expression", meaning: "the look on someone's face that shows a feeling" },
          { word: "emotion", meaning: "a strong feeling, like joy, anger, sadness or fear" },
          { word: "exaggerate", meaning: "to make something bigger or stronger than it really is" },
          { word: "symbol", meaning: "an object or picture that stands for an idea or feeling" },
          { word: "Tehuana dress", meaning: "a traditional style of colourful clothing from southern Mexico" },
        ],
      },
      practice: {
        intro: "Read the faces.",
        questions: [
          {
            type: "match",
            q: "Match each face to the emotion it most likely shows.",
            pairs: [["Eyebrows raised high, mouth open", "Surprise"], ["Eyebrows pulled down and together", "Anger"], ["Inner ends of eyebrows lifted, mouth corners down", "Sadness"], ["Cheeks pushed up, eyes crinkled, mouth corners up", "Happiness"]],
          },
          { type: "choice", q: "How did Frida Kahlo usually show her feelings in her self-portraits?", options: ["With a huge grin or a scowl", "Through symbols, colours and the background, with a calm face", "By leaving her face blank"], answer: 1 },
          { type: "choice", q: "Why did Frida Kahlo start painting herself?", options: ["She was recovering in bed after an accident and had a mirror above her", "She was asked to by a museum", "She had never seen anyone else"], answer: 0 },
          { type: "type", q: "Which country was Frida Kahlo from?", answer: ["Mexico", "mexico"] },
          { type: "gap", q: "Fill in the gaps.", text: "In a real smile, the cheeks push up and the ___ crinkle. In surprise, the ___ are raised high.", bank: ["eyes", "eyebrows", "ears", "chin"], answers: ["eyes", "eyebrows"] },
        ],
      },
      task: {
        title: "Faces of feeling",
        intro: "Draw your own face showing four emotions, then design a Kahlo-style portrait where symbols tell the story.",
        need: ["A mirror", "Paper", "Pencils and coloured pencils or felt tips"],
        steps: [
          "Fold a sheet into four. In the mirror, pull a happy face, a surprised face, an angry face and a worried face.",
          "Draw a quick sketch of each one, focusing on the eyebrows, eyes and mouth. Exaggerate a little so the feeling is clear.",
          "Show your four sketches to someone at home. Can they guess each emotion? Which parts of the face gave it away?",
          "On a new page, draw a head-and-shoulders portrait of yourself with a calm face looking straight out, like Frida Kahlo.",
          "Choose a feeling, such as calm, proud, excited or homesick. Surround yourself with three or four symbols, colours and a background that show it without changing your face.",
          "Write a short paragraph explaining each symbol and why you chose it.",
        ],
      },
      exit: [
        { type: "choice", q: "What do eyebrows pulled down and together usually show?", options: ["Surprise", "Anger or concentration", "Joy"], answer: 1 },
        { type: "choice", q: "In a real smile, what happens to the eyes?", options: ["They crinkle at the corners", "They close completely", "Nothing changes"], answer: 0 },
        { type: "choice", q: "When did Frida Kahlo live?", options: ["1606 to 1669", "1853 to 1890", "1907 to 1954"], answer: 2 },
        { type: "pick", q: "Which things did Frida Kahlo often paint around herself? There is more than one.", options: ["Monkeys and parrots", "Racing cars", "Flowers and plants", "Thorns"], answers: [0, 2, 3] },
        { type: "choice", q: "Why could a portrait with a calm face still show strong feelings?", options: ["It can't: only the face shows feelings", "Symbols, colours and the background can show feelings too", "Calm faces are always happy"], answer: 1 },
        { type: "type", q: "What word means making something bigger or stronger than it really is?", answer: ["exaggerate", "exaggerating", "exaggeration"] },
      ],
      grownUp: {
        need: ["A mirror", "Paper, pencils, coloured pencils or felt tips"],
        tips: [
          "Kahlo's story includes a serious accident and lifelong pain. The lesson mentions it calmly; follow your child's lead if they want to know more, and focus on how she turned a hard time into art.",
          "Some of Kahlo's paintings show surgery or injury. If you look her up online together, choose self-portraits with animals and flowers, such as her 1940 'Self-Portrait with Thorn Necklace and Hummingbird'.",
          "Pulling faces in the mirror is great fun and genuinely useful. Join in, and let your child draw you too.",
        ],
        younger: "Draw four circle faces and change only the eyebrows and mouth to show four feelings.",
        older: "Write a short comparison of Rembrandt and Kahlo: how does each artist use their own face to tell the viewer about their life?",
      },
    },
    {
      slug: "portraits-6",
      title: "A mixed-media self-portrait",
      emoji: "✂️",
      minutes: 55,
      goal: "I can plan, make and evaluate a mixed-media self-portrait inspired by Chila Kumari Singh Burman.",
      starter: [
        { type: "choice", q: "What do raised eyebrows usually show?", options: ["Surprise", "Tiredness", "Anger"], answer: 0 },
        { type: "type", q: "Which Mexican artist painted about 55 self-portraits?", answer: ["Frida Kahlo", "Kahlo", "Frida", "frida kahlo"] },
        { type: "choice", q: "How did Frida Kahlo usually show feelings in her self-portraits?", options: ["Through symbols and backgrounds around a calm face", "By always smiling widely"], answer: 0 },
        { type: "choice", q: "What is an expression?", options: ["The look on a face that shows a feeling", "The frame around a portrait", "A type of pencil"], answer: 0 },
        { type: "pick", q: "Which are signs of a real smile? There is more than one.", options: ["Cheeks push up", "Eyes crinkle", "Eyebrows pull down hard", "Mouth corners lift"], answers: [0, 1, 3] },
        { type: "choice", q: "What is a symbol?", options: ["Something that stands for an idea or feeling", "A kind of paintbrush"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Chila Kumari Singh Burman",
            text: [
              "Chila Kumari Singh Burman is a British artist, born in 1957 in Bootle, near Liverpool, to a Punjabi Indian family. Her dad sold ice cream from a van, and memories of her childhood and family often appear in her art.",
              "She is famous for being bold, bright and playful. She mixes drawing, printmaking, painting, photographs, collage, glitter, sequins, jewels and bindis, and even neon lights. In 2020 she covered the front of Tate Britain, a large art gallery in London, in glowing neon lights and pictures for winter and Diwali.",
              "Many of her artworks are self-portraits. She puts images of herself among things that matter to her: Indian and British pop culture, Bollywood films, Hindu goddesses, her family and her home city. Her self-portraits celebrate having more than one culture and say, loudly and joyfully, 'This is who I am.'",
            ],
          },
          {
            heading: "What is mixed media?",
            text: [
              "Media are the materials an artist uses: pencil, paint, pastel, paper and so on. Mixed media means using more than one in the same artwork. Collage is a technique where you cut or tear paper and other flat things and stick them down to build a picture.",
              "A collage portrait can be made from cut-up magazine pages chosen for their colours and textures, rather than for what they show. A patch of blue sky might become a shirt; a page of brown text might become hair. From a distance the shapes join up into a face.",
              "Mixed media lets you add layers of meaning, just as Burman and Kahlo do. Pictures, words, patterns or objects that matter to you, such as a bus ticket, a sweet wrapper, a piece of fabric from an old top or a pattern you love, can become part of your portrait and tell people about your life.",
            ],
          },
          {
            heading: "Planning, making and evaluating",
            text: [
              "Artists rarely jump straight into a final piece. Start with a plan: a quick sketch of your layout and a list of the materials and symbols you will use. Decide whether your face will be drawn, collaged, or a mix of both. Many artists draw the face in pencil and use collage for the background, hair and clothes.",
              "Work from big to small. Lay down the background first, then the large shapes of the head, hair and shoulders, then the features, and finally the small details and sparkly bits. Arrange your cut pieces before you glue them, so you can change your mind.",
              "When you finish, evaluate your work, which means judging it fairly. Ask: Does it look like me? Are the proportions right? What do the materials and symbols say about me? What would I change next time? Artists improve by reflecting honestly, not by expecting perfection.",
            ],
          },
        ],
        words: [
          { word: "mixed media", meaning: "using more than one material in the same artwork" },
          { word: "collage", meaning: "a picture made by sticking down pieces of paper, fabric and other flat things" },
          { word: "texture", meaning: "how something feels, or looks as if it would feel" },
          { word: "layer", meaning: "one level of material placed on top of another" },
          { word: "evaluate", meaning: "to judge how well something has worked and how to improve it" },
          { word: "identity", meaning: "the things that make you who you are" },
        ],
      },
      practice: {
        intro: "Mixed media and Burman.",
        questions: [
          { type: "choice", q: "What does mixed media mean?", options: ["Using only one kind of paint", "Using more than one material in the same artwork", "Showing a picture on a screen"], answer: 1 },
          {
            type: "pick",
            q: "Which of these has Chila Kumari Singh Burman used in her art? There is more than one.",
            options: ["Neon lights", "Glitter and bindis", "Collage", "Marble statues of Roman emperors"],
            answers: [0, 1, 2],
          },
          {
            type: "order",
            q: "Put the steps for a collage portrait in a sensible order.",
            items: ["Sketch a plan", "Collect materials", "Make the background", "Add the big shapes of the head and hair", "Add the features and details", "Evaluate the finished piece"],
          },
          { type: "choice", q: "Why might a collage artist choose a magazine page for its colour rather than what it shows?", options: ["Because the colours and textures build the picture when seen from a distance", "Because pictures in magazines are not allowed", "Because colour doesn't matter"], answer: 0 },
          { type: "type", q: "Which city did Chila Kumari Singh Burman grow up near?", answer: ["Liverpool", "liverpool", "Bootle"] },
        ],
      },
      task: {
        title: "My mixed-media self-portrait",
        intro: "Make a final self-portrait that mixes drawing and collage, filled with colours and symbols that show who you are.",
        need: [
          "Thick paper or card, at least A4",
          "Your self-portrait sketches from earlier lessons and a mirror",
          "Old magazines, catalogues, wrapping paper, tissue paper",
          "Bits that mean something to you: tickets, wrappers, fabric scraps, buttons, stickers",
          "Scissors and a glue stick or PVA glue",
          "Pencils, felt tips, and glitter or sequins if you have them",
        ],
        steps: [
          "Plan: sketch your layout. Mark where your face will go and list three to five things about you that you want to show, and a symbol or material for each.",
          "Collect: hunt through magazines and scraps for colours, patterns and textures. Tear or cut out more than you need. Use scissors carefully, with a grown-up nearby.",
          "Background: cover the card with a background that shows something about you, such as a favourite colour, a pattern from your culture, or a place you love.",
          "Face: draw your face from the mirror using guidelines, either straight onto the card or on paper you cut out and stick on. Keep your eyes halfway down!",
          "Build: collage the hair, clothes and shoulders, then add your symbols and finishing touches like glitter, sequins or patterned borders. Arrange first, then glue.",
          "Evaluate: write four sentences. What looks like you? What do your symbols say? Which artist inspired you and how? What would you change next time?",
        ],
      },
      exit: [
        { type: "choice", q: "What is a collage?", options: ["A picture made by sticking down pieces of paper and other flat things", "A drawing made with only one line", "A type of sculpture"], answer: 0 },
        { type: "choice", q: "Where was Chila Kumari Singh Burman born?", options: ["Mexico City", "Bootle, near Liverpool", "Amsterdam"], answer: 1 },
        { type: "choice", q: "In 2020, what did Burman cover the front of Tate Britain with?", options: ["Neon lights and pictures", "Giant oil paintings", "Flowers and moss"], answer: 0 },
        { type: "gap", q: "Fill in the gaps.", text: "Using more than one material in an artwork is called ___ media. Judging how well your work has gone is called ___.", bank: ["mixed", "evaluating", "single", "framing"], answers: ["mixed", "evaluating"] },
        { type: "choice", q: "Why do artists usually work from big to small?", options: ["Big shapes and the background set up the picture, and details sit on top", "Small things are boring", "Glue only works on big pieces"], answer: 0 },
        { type: "pick", q: "Which are good questions to ask when you evaluate your portrait? There is more than one.", options: ["Are the proportions right?", "What do my symbols say about me?", "How much did the glue cost?", "What would I change next time?"], answers: [0, 1, 3] },
      ],
      grownUp: {
        need: ["Card or thick paper", "Old magazines, catalogues, scraps and keepsakes", "Scissors, glue, felt tips", "Glitter or sequins (optional)"],
        tips: [
          "This is a two-session piece for many children. It's fine to plan and collect today and build tomorrow.",
          "Supervise scissors, and use PVA sparingly; a thin layer dries faster and stops paper wrinkling.",
          "Burman's work celebrates identity, culture and family. Encourage your child to include things that are genuinely theirs, whatever those are, and to talk about them.",
          "Display the finished portrait with their earlier sketches from the unit, so they can see how far they have come.",
        ],
        younger: "Collage a face on a paper plate using magazine colours, and add one or two symbols around the edge.",
        older: "Write a short gallery label for your portrait: title, materials, and a paragraph explaining your choices and the artists who inspired you.",
      },
    },
  ],
};
