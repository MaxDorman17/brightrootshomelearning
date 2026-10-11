import type { LessonUnit } from "@/lib/lessons";

/** Colour and great artists, for ages 7 to 11. Only paints, pencils, paper and scissors. No paintings are shown on the page; grown-ups look them up together. */
export const colourAndArtists: LessonUnit = {
  slug: "colour-and-artists",
  title: "Colour and great artists",
  short: "Colour and artists",
  subject: "Art & Design",
  ages: "7 to 11",
  emoji: "🎨",
  color: "#B0457B",
  summary: "Six lessons: mixing colours, warm and cool colours, then Van Gogh, Kandinsky and Matisse, and finally your own gallery.",
  cover: "/lessons/units/colour-and-artists.jpg",
  lessons: [
    {
      slug: "colour-and-artists-1",
      title: "Mixing colours",
      emoji: "🖌️",
      minutes: 45,
      goal: "I can name the primary and secondary colours and mix secondary colours from primaries.",
      starter: [
        { type: "choice", q: "What colour is the sky on a sunny day?", options: ["Blue", "Green", "Orange"], answer: 0 },
        { type: "choice", q: "What do artists use to paint with?", options: ["A brush", "A fork", "A spoon"], answer: 0 },
        { type: "choice", q: "Which colour is a banana?", options: ["Yellow", "Purple", "Red"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Primary colours",
            picture: "/lessons/colour-and-artists/lesson-1.jpg",
            alt: "A girl mixing red, yellow and blue paint on a palette, with a colour wheel on an easel",
            text: [
              "Red, yellow and blue are the primary colours.",
              "You can't make them by mixing other paints together. But you can mix them to make lots of other colours.",
            ],
          },
          {
            heading: "Secondary colours",
            text: [
              "Mix two primary colours and you get a secondary colour.",
              "Red and yellow make orange. Yellow and blue make green. Blue and red make purple.",
            ],
          },
          {
            heading: "The colour wheel",
            text: [
              "Artists arrange colours in a circle called a colour wheel: red, orange, yellow, green, blue, purple, and back to red.",
              "Each secondary colour sits between the two primary colours that make it.",
              "Colours opposite each other on the wheel, like red and green, are called complementary colours. Side by side, they make each other look brighter.",
            ],
          },
        ],
        words: [
          { word: "primary colours", meaning: "red, yellow and blue: you can't mix them from other colours" },
          { word: "secondary colours", meaning: "orange, green and purple: made by mixing two primary colours" },
          { word: "colour wheel", meaning: "a circle showing how colours are related" },
          { word: "complementary colours", meaning: "colours opposite each other on the colour wheel" },
        ],
      },
      practice: {
        intro: "Colour sums.",
        questions: [
          {
            type: "match",
            q: "Match each mix to the colour it makes.",
            pairs: [["Red + yellow", "Orange"], ["Yellow + blue", "Green"], ["Blue + red", "Purple"]],
          },
          {
            type: "pick",
            q: "Which are primary colours? There is more than one.",
            options: ["Red", "Green", "Yellow", "Blue", "Orange"],
            answers: [0, 2, 3],
          },
        ],
      },
      task: {
        title: "Paint a colour wheel",
        intro: "Make your own colour wheel using only three paints.",
        need: ["Red, yellow and blue paint", "A brush and a pot of water", "Paper and a plate to mix on", "Something round to draw around, like a small plate"],
        steps: [
          "Draw around the plate to make a big circle. Divide it into six slices, like a pizza.",
          "Paint red, yellow and blue in every other slice.",
          "Mix each pair of primaries on your plate and paint the secondary colour in the slice between them.",
          "Try mixing a little more yellow or a little more red into your orange. How many different oranges can you make?",
        ],
      },
      exit: [
        { type: "choice", q: "Which is NOT a primary colour?", options: ["Red", "Green", "Blue"], answer: 1 },
        { type: "choice", q: "What do yellow and blue make?", options: ["Green", "Purple", "Orange"], answer: 0 },
        { type: "choice", q: "What do red and blue make?", options: ["Orange", "Purple", "Brown"], answer: 1 },
        { type: "choice", q: "Secondary colours are made by...", options: ["mixing two primary colours", "adding water"], answer: 0 },
        { type: "choice", q: "Which colour is opposite red on the colour wheel?", options: ["Green", "Orange", "Yellow"], answer: 0 },
      ],
      grownUp: {
        need: ["Red, yellow and blue paint (poster or ready-mix paint is fine)", "Brush, water pot, paper, a plate"],
        tips: [
          "If you only have felt pens or crayons, layer one colour over another to mix them.",
          "Rinse the brush between colours, or everything turns brown. That's a good lesson in itself!",
        ],
        younger: "Mix just one secondary colour, with your help, and paint a picture using it.",
        older: "Mix all three primaries together. What do you get? Then try making a colour wheel with 12 slices, adding in-between colours.",
      },
    },
    {
      slug: "colour-and-artists-2",
      title: "Warm and cool colours",
      emoji: "🌅",
      minutes: 45,
      goal: "I can sort warm and cool colours, make tints and shades, and use colour to show a mood.",
      starter: [
        { type: "choice", q: "What do red and yellow make?", options: ["Orange", "Green"], answer: 0 },
        { type: "choice", q: "Which is a primary colour?", options: ["Blue", "Purple"], answer: 0 },
        { type: "choice", q: "What are colours opposite each other on the wheel called?", options: ["Complementary", "Primary"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Warm colours",
            picture: "/lessons/colour-and-artists/lesson-2.jpg",
            alt: "A girl painting a picture that is a warm sunset on one side and a cool blue sea on the other",
            text: [
              "Red, orange and yellow are warm colours. They remind us of fire and sunshine.",
              "Warm colours can make a picture feel happy, exciting or even angry.",
            ],
          },
          {
            heading: "Cool colours",
            text: [
              "Blue, green and purple are cool colours. They remind us of water, ice and grass.",
              "Cool colours can make a picture feel calm, peaceful, or sometimes sad.",
            ],
          },
          {
            heading: "Tints and shades",
            text: [
              "Add white to a colour and it gets lighter. This is called a tint. Pink is a tint of red.",
              "Add black to a colour and it gets darker. This is called a shade. Navy is a shade of blue.",
              "Artists use tints and shades to make things look 3D, with light and shadow.",
            ],
          },
        ],
        words: [
          { word: "warm colours", meaning: "red, orange and yellow" },
          { word: "cool colours", meaning: "blue, green and purple" },
          { word: "tint", meaning: "a colour mixed with white to make it lighter" },
          { word: "shade", meaning: "a colour mixed with black to make it darker" },
          { word: "mood", meaning: "the feeling a picture gives you" },
        ],
      },
      practice: {
        intro: "Warm or cool?",
        questions: [
          {
            type: "match",
            q: "Match each colour to warm or cool.",
            pairs: [["Orange", "Warm, like fire"], ["Blue", "Cool, like water"], ["Yellow", "Warm, like sunshine"], ["Green", "Cool, like grass"]],
          },
          { type: "choice", q: "Red mixed with white makes...", options: ["pink, a tint", "maroon, a shade"], answer: 0 },
        ],
      },
      task: {
        title: "Two moods, one picture",
        intro: "Paint the same simple picture twice, once warm and once cool.",
        need: ["Paints, including white and black", "Two sheets of paper", "A pencil"],
        steps: [
          "Draw the same simple scene on both sheets: maybe a house, a tree and the sky.",
          "Paint the first one using only warm colours.",
          "Paint the second one using only cool colours.",
          "Add a tint (with white) and a shade (with black) somewhere in each picture.",
          "Put them side by side. How does each one make you feel?",
        ],
      },
      exit: [
        {
          type: "pick",
          q: "Which are warm colours? There is more than one.",
          options: ["Red", "Blue", "Orange", "Yellow", "Green"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Cool colours often make a picture feel...", options: ["calm", "hot and exciting"], answer: 0 },
        { type: "choice", q: "What is a tint?", options: ["A colour with white added", "A colour with black added"], answer: 0 },
        { type: "choice", q: "What is a shade?", options: ["A colour with white added", "A colour with black added"], answer: 1 },
        { type: "choice", q: "Pink is a tint of...", options: ["red", "green", "blue"], answer: 0 },
      ],
      grownUp: {
        need: ["Paints including white and black", "Two sheets of paper"],
        tips: [
          "A tiny bit of black goes a long way. Add it a drop at a time.",
          "There are no wrong answers about how a picture feels. Ask 'why do you think that?'",
        ],
        younger: "Sort felt pens or crayons into a warm pile and a cool pile, then draw with just one pile.",
        older: "Paint a strip going from white, through tints, to a pure colour, then through shades to nearly black. How many steps can you make?",
      },
    },
    {
      slug: "colour-and-artists-3",
      title: "Vincent van Gogh",
      emoji: "🌻",
      minutes: 50,
      goal: "I can describe Van Gogh's style and use thick, swirling brushstrokes in my own painting.",
      starter: [
        { type: "choice", q: "Which are cool colours?", options: ["Blue, green and purple", "Red, orange and yellow"], answer: 0 },
        { type: "choice", q: "Adding black to a colour makes a...", options: ["shade", "tint"], answer: 0 },
        { type: "choice", q: "Warm colours remind us of...", options: ["fire and sunshine", "ice and water"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Who was Van Gogh?",
            text: [
              "Vincent van Gogh was a painter from the Netherlands. He lived from 1853 to 1890.",
              "He painted for only about ten years but made over 800 paintings. He sold very few while he was alive. Today his paintings are some of the most famous in the world.",
            ],
          },
          {
            heading: "His style",
            text: [
              "Van Gogh used bright, bold colours and thick paint.",
              "You can see every brushstroke in his paintings: short dashes, dots and swirls that make everything look alive and moving.",
            ],
          },
          {
            heading: "The Starry Night and Sunflowers",
            text: [
              "In The Starry Night (1889), the sky swirls with stars and a glowing moon above a sleepy village.",
              "He also painted a famous series of sunflowers in a vase, in every shade of yellow. One of them hangs in the National Gallery in London.",
            ],
          },
        ],
        words: [
          { word: "brushstroke", meaning: "a mark made by one movement of a paintbrush" },
          { word: "style", meaning: "the way an artist usually makes their art" },
          { word: "artist study", meaning: "looking closely at an artist's work and learning from it" },
        ],
      },
      practice: {
        intro: "Van Gogh facts.",
        questions: [
          { type: "choice", q: "Which country was Van Gogh from?", options: ["The Netherlands", "Italy", "Scotland"], answer: 0 },
          { type: "choice", q: "What is special about his brushstrokes?", options: ["You can see them, in dashes and swirls", "They're completely smooth and invisible"], answer: 0 },
        ],
      },
      task: {
        title: "Your own starry night",
        intro: "Look at Van Gogh's paintings, then paint a sky full of movement.",
        need: ["Paints, especially blues and yellows", "A thick brush, or a cotton bud or the end of a pencil", "Paper or card"],
        steps: [
          "With your grown-up, look up The Starry Night and Sunflowers online. What shapes and colours can you see?",
          "Paint the sky over your house or street at night. Use short dashes and swirls, not smooth strokes.",
          "Add glowing stars and a moon with dabs of yellow and white. Try not to mix the colours too much on the paper.",
          "Give your painting a title, just like Van Gogh did.",
        ],
      },
      exit: [
        { type: "choice", q: "What did Van Gogh paint in a vase?", options: ["Roses", "Sunflowers", "Tulips"], answer: 1 },
        { type: "choice", q: "Which painting has a swirling night sky?", options: ["The Starry Night", "The Snail", "The Mona Lisa"], answer: 0 },
        { type: "choice", q: "Van Gogh's paint was usually...", options: ["thick, with bold colours", "thin and pale"], answer: 0 },
        { type: "choice", q: "Did Van Gogh sell lots of paintings while he was alive?", options: ["Yes, hundreds", "No, very few"], answer: 1 },
        { type: "choice", q: "What is a brushstroke?", options: ["A mark made by one movement of a brush", "A kind of paint"], answer: 0 },
      ],
      grownUp: {
        need: ["Paints, a thick brush or cotton buds", "Paper or card"],
        tips: [
          "Search for 'The Starry Night Van Gogh' and 'Van Gogh Sunflowers National Gallery' to look at them together. Zoom in on the brushstrokes.",
          "Van Gogh had times of being very unwell in his mind. If your child asks, it's fine to say he was sometimes very poorly and sad, and that painting helped him.",
        ],
        younger: "Paint sunflowers with thick yellow dabs, or fingerprint the petals.",
        older: "Paint one object in the style of Van Gogh, then the same object in a smooth, careful style. Which do you prefer and why?",
      },
    },
    {
      slug: "colour-and-artists-4",
      title: "Wassily Kandinsky",
      emoji: "⭕",
      minutes: 45,
      goal: "I can describe abstract art and make a Kandinsky-style picture of circles and shapes.",
      starter: [
        { type: "choice", q: "Which country was Van Gogh from?", options: ["The Netherlands", "Russia"], answer: 0 },
        { type: "choice", q: "What did Van Gogh paint in a vase?", options: ["Sunflowers", "Apples"], answer: 0 },
        { type: "choice", q: "Complementary colours are...", options: ["opposite each other on the colour wheel", "the same colour"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Who was Kandinsky?",
            text: [
              "Wassily Kandinsky was a Russian artist who lived from 1866 to 1944.",
              "He was one of the first artists to make abstract art: pictures that don't show real things, just colours, lines and shapes.",
            ],
          },
          {
            heading: "Seeing music",
            text: [
              "Kandinsky loved music. He said colours were like musical notes and could make you feel things, just like a song.",
              "He sometimes named his paintings like pieces of music, such as 'Composition' or 'Improvisation'.",
            ],
          },
          {
            heading: "Circles in squares",
            text: [
              "One of his most famous pictures is a grid of squares, each with circles inside circles in different colours.",
              "Each square has its own colour mix. Some colours seem to glow next to each other, and some seem to fight!",
            ],
          },
        ],
        words: [
          { word: "abstract", meaning: "art that uses colours, lines and shapes instead of showing real things" },
          { word: "concentric circles", meaning: "circles inside each other, sharing the same middle" },
          { word: "composition", meaning: "how the parts of a picture are arranged" },
        ],
      },
      practice: {
        intro: "What do you know about Kandinsky?",
        questions: [
          { type: "choice", q: "What is abstract art?", options: ["Art made of colours, lines and shapes, not real things", "A photograph of a person"], answer: 0 },
          { type: "choice", q: "Kandinsky said colours were like...", options: ["musical notes", "numbers", "letters"], answer: 0 },
        ],
      },
      task: {
        title: "Circles in squares, with music",
        intro: "Make your own Kandinsky grid while listening to music.",
        need: ["A sheet of paper or card", "Felt pens, crayons, paints or pastels", "Cups or lids of different sizes to draw around (optional)", "Some music to listen to"],
        steps: [
          "With your grown-up, look up Kandinsky's 'Squares with Concentric Circles'.",
          "Fold your paper into eight or twelve squares and open it out.",
          "In each square, draw circles inside circles. Use a different background colour for every square.",
          "Put on a piece of music while you colour. Does fast music make you pick different colours from slow music?",
        ],
      },
      exit: [
        { type: "choice", q: "Which country was Kandinsky from?", options: ["Russia", "France", "The Netherlands"], answer: 0 },
        { type: "choice", q: "Abstract art shows...", options: ["colours, lines and shapes", "only real people"], answer: 0 },
        { type: "choice", q: "What are concentric circles?", options: ["Circles inside each other", "Squares in a row"], answer: 0 },
        { type: "choice", q: "What else did Kandinsky love?", options: ["Music", "Football", "Cooking"], answer: 0 },
        { type: "choice", q: "Kandinsky was one of the first artists to make...", options: ["abstract art", "photographs", "films"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper or card", "Felt pens, crayons, paints or pastels", "Music to play"],
        tips: [
          "Search for 'Kandinsky Squares with Concentric Circles' to look at it together.",
          "Classical music with big changes, like Holst's 'Mars' then 'Venus' from The Planets, works well for the music part.",
        ],
        younger: "Draw around cups to make circles inside circles, and colour each ring a different colour.",
        older: "Paint a whole abstract picture to one piece of music. Can someone else guess whether the music was happy or sad?",
      },
    },
    {
      slug: "colour-and-artists-5",
      title: "Henri Matisse",
      emoji: "✂️",
      minutes: 45,
      goal: "I can describe Matisse's cut-outs and make a collage by 'drawing with scissors'.",
      starter: [
        { type: "choice", q: "What is abstract art?", options: ["Colours, lines and shapes, not real things", "A painting of a bowl of fruit"], answer: 0 },
        { type: "choice", q: "Which country was Kandinsky from?", options: ["Russia", "Spain"], answer: 0 },
        { type: "choice", q: "Which artist painted swirling stars?", options: ["Van Gogh", "Kandinsky"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Who was Matisse?",
            text: [
              "Henri Matisse was a French artist who lived from 1869 to 1954. He was famous for paintings full of bright, bold colour.",
            ],
          },
          {
            heading: "Drawing with scissors",
            text: [
              "When Matisse was old, he became too ill to stand at an easel and paint for long.",
              "So he found a new way to make art. His helpers painted big sheets of paper in bright colours, and Matisse cut shapes out of them with scissors, sitting in a wheelchair or in bed.",
              "He called it 'drawing with scissors'. His helpers pinned the shapes to the wall where he told them.",
            ],
          },
          {
            heading: "The Snail",
            text: [
              "One of his most famous cut-outs is called The Snail. It's made of coloured paper shapes arranged in a spiral, like a snail's shell.",
              "It's huge, nearly three metres tall, and hangs at Tate Modern in London.",
            ],
          },
        ],
        words: [
          { word: "collage", meaning: "a picture made by sticking pieces of paper or other materials onto a background" },
          { word: "cut-out", meaning: "a shape cut out of paper" },
          { word: "organic shape", meaning: "a curvy, natural shape, like a leaf or a wave" },
        ],
      },
      practice: {
        intro: "Matisse facts.",
        questions: [
          { type: "choice", q: "What did Matisse call his cut-outs?", options: ["Drawing with scissors", "Painting with feet"], answer: 0 },
          {
            type: "match",
            q: "Match each artist to their country.",
            pairs: [["Van Gogh", "The Netherlands"], ["Kandinsky", "Russia"], ["Matisse", "France"]],
          },
        ],
      },
      task: {
        title: "Make a Matisse collage",
        intro: "Paint your own coloured paper, then draw with scissors.",
        need: ["Paper or old magazines", "Paints or felt pens (to colour plain paper)", "Child's scissors", "Glue and a big sheet of paper for the background"],
        steps: [
          "With your grown-up, look up Matisse's The Snail and his cut-outs of leaves and seaweed.",
          "Colour some sheets of paper in bold, bright colours. Let them dry. (Or use coloured magazine pages.)",
          "Cut out shapes straight away, without drawing them first. Try curvy leaf and wave shapes as well as squares.",
          "Move the shapes around on your background until you like how they look. Then glue them down.",
        ],
      },
      exit: [
        { type: "choice", q: "Which country was Matisse from?", options: ["France", "Russia", "Italy"], answer: 0 },
        { type: "choice", q: "Why did Matisse start making cut-outs?", options: ["He was too ill to stand and paint for long", "He ran out of paint"], answer: 0 },
        { type: "choice", q: "What is a collage?", options: ["A picture made by sticking pieces onto a background", "A type of brush"], answer: 0 },
        { type: "choice", q: "What is The Snail made of?", options: ["Paper shapes", "Clay", "Metal"], answer: 0 },
        { type: "choice", q: "Where can you see The Snail?", options: ["Tate Modern in London", "The Eiffel Tower"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper or magazines, paints or felt pens", "Child's scissors, glue, a big backing sheet"],
        tips: [
          "Search for 'Matisse The Snail Tate' to look at it together.",
          "Cutting without drawing first feels strange at first. Encourage your child to just go for it: there's no wrong shape.",
        ],
        younger: "Tear shapes instead of cutting, and stick them down to make a picture.",
        older: "Make a collage that tells a story, like Matisse's book 'Jazz', which was full of circus pictures.",
      },
    },
    {
      slug: "colour-and-artists-6",
      title: "Our family gallery",
      emoji: "🖼️",
      minutes: 45,
      goal: "I can talk about art using the right words, and display and explain my own work.",
      starter: [
        { type: "choice", q: "Who called his art 'drawing with scissors'?", options: ["Matisse", "Van Gogh"], answer: 0 },
        { type: "choice", q: "Who loved music and made abstract art?", options: ["Kandinsky", "Matisse"], answer: 0 },
        { type: "choice", q: "Who painted The Starry Night?", options: ["Van Gogh", "Kandinsky"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Talking about art",
            picture: "/lessons/colour-and-artists/lesson-6.jpg",
            alt: "A family in their hallway looking at children's paintings on the wall, a girl pointing at hers",
            text: [
              "When you look at a piece of art, try three questions: What can I see? How does it make me feel? What do I think the artist was trying to do?",
              "Use the words you've learned: primary, secondary, warm, cool, tint, shade, brushstroke, abstract, collage.",
            ],
          },
          {
            heading: "Galleries",
            text: [
              "A gallery is a place where art is shown so people can look at it. Many galleries in the UK are free to visit.",
              "Every piece in a gallery has a small label beside it with its title, the artist, the year, and sometimes a few words about it.",
            ],
          },
          {
            heading: "Being an artist",
            text: [
              "Artists often look back at their work and think: what went well? What would I do differently next time?",
              "There's no such thing as a 'wrong' painting. Remember, very few people bought Van Gogh's paintings while he was alive!",
            ],
          },
        ],
        words: [
          { word: "gallery", meaning: "a place where art is shown" },
          { word: "label", meaning: "a small card next to art with its title, artist and year" },
          { word: "evaluate", meaning: "to think about what went well and what you would change" },
        ],
      },
      practice: {
        intro: "Use your art words.",
        questions: [
          {
            type: "match",
            q: "Match each word to its meaning.",
            pairs: [["Tint", "A colour with white added"], ["Abstract", "Shapes and colours, not real things"], ["Collage", "Pieces stuck onto a background"], ["Brushstroke", "A mark from one brush movement"]],
          },
        ],
      },
      task: {
        title: "Put on an exhibition",
        intro: "Turn a wall or a door into your own gallery.",
        need: ["Your artwork from this unit", "Small cards or sticky notes for labels", "Blu Tack or tape"],
        steps: [
          "Choose your favourite three or four pieces from this unit.",
          "Write a label for each one: a title, your name as the artist, today's date, and one sentence about it.",
          "Put them up on a wall or door, with the labels beside them.",
          "Invite your family to a gallery opening. Show them round and explain how you made each piece.",
          "Tell them which piece you're proudest of, and one thing you'd do differently next time.",
        ],
      },
      exit: [
        {
          type: "match",
          q: "Match each artist to their famous work.",
          pairs: [["Van Gogh", "The Starry Night"], ["Kandinsky", "Squares with Concentric Circles"], ["Matisse", "The Snail"]],
        },
        { type: "choice", q: "What is a gallery?", options: ["A place where art is shown", "A kind of paint"], answer: 0 },
        { type: "choice", q: "What goes on a gallery label?", options: ["The title, artist and year", "The price of a ticket"], answer: 0 },
        { type: "choice", q: "Which are the secondary colours?", options: ["Orange, green and purple", "Red, yellow and blue"], answer: 0 },
        { type: "choice", q: "To evaluate your work means to...", options: ["think about what went well and what you'd change", "throw it away"], answer: 0 },
      ],
      grownUp: {
        need: ["Your child's artwork from the unit", "Small cards, Blu Tack or tape"],
        tips: [
          "Make the gallery opening a little occasion: a drink and a snack, and the whole family looking round.",
          "If you can, visit a free gallery near you. Seeing real paintings, especially brushstrokes up close, is unforgettable.",
        ],
        younger: "Put up one or two pieces and help your child tell the family about them.",
        older: "Write a short gallery guide for your exhibition, explaining which artist inspired each piece.",
      },
    },
  ],
};
