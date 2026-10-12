import type { LessonUnit } from "@/lib/lessons";

/**
 * Identity and mental health, for ages 11 to 14 (KS3 RSHE). Calm and non-clinical: the unit treats mental health as
 * something everyone has, teaches everyday coping, and signposts to trusted adults and services for anything serious.
 * It never asks a learner to share their own difficulties on screen.
 */
export const identityAndMentalHealth: LessonUnit = {
  slug: "identity-and-mental-health",
  title: "Identity and mental health",
  short: "Mental health",
  subject: "RSHE (PSHE)",
  ages: "11 to 14",
  emoji: "🌱",
  color: "#5E7F73",
  summary: "Six lessons on what shapes who we are, self-esteem and body image in an edited online world, mental health as something everyone has, healthy ways to cope with stress and worry, and how to get help or support a friend.",
  cover: "/lessons/units/identity-and-mental-health.jpg",
  lessons: [
    {
      slug: "identity-and-mental-health-1",
      title: "Who am I? What shapes identity",
      emoji: "🧩",
      minutes: 60,
      goal: "I can explain what identity means, describe the different influences that shape it, and explain why identity can change over time.",
      starter: [
        { type: "choice", q: "At primary school you may have talked about what makes each person unique. Which of these is the best description of being unique?", options: ["Being better than other people", "Being the only person exactly like you", "Being the same as your friends"], answer: 1 },
        { type: "pick", q: "Which of these are feelings? There is more than one.", options: ["Proud", "Nervous", "Tall", "Excited"], answers: [0, 1, 3] },
        { type: "choice", q: "What does it mean to respect someone who is different from you?", options: ["To agree with everything they say", "To ignore them", "To treat them fairly and value them, even if you see things differently"], answer: 2 },
        { type: "type", q: "What one word describes the feelings, likes, beliefs and experiences that together make you who you are? It begins with i.", answer: ["identity", "Identity", "an identity"] },
        { type: "choice", q: "Moving from primary to secondary school is an example of what?", options: ["A transition, a time of change", "A punishment", "Something that only happens to a few people"], answer: 0 },
        { type: "choice", q: "Which is the most helpful thing to do with a big worry?", options: ["Keep it secret for ever", "Share it with someone you trust", "Pretend it isn't there"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is identity?",
            text: [
              "Your identity is your sense of who you are. It is made of many parts: the things you care about, the people you belong to, the activities you love, your beliefs and values, your heritage, the languages you speak, and the way you see yourself and want others to see you.",
              "Psychologists often split identity into two overlapping parts. Personal identity is what makes you an individual, such as your personality, your sense of humour or your taste in music. Social identity comes from the groups you belong to, such as your family, your faith or culture, your nationality, a team or a group of friends.",
              "Nobody has just one identity. A single person might be a sister, a Muslim, a Liverpool supporter, a gamer, Welsh and a talented baker, all at the same time. Different parts may feel more important in different places: you might feel most like a 'musician' in band practice and most like a 'grandchild' at Sunday lunch.",
              "Some parts of identity are protected by law. In Great Britain, the Equality Act 2010 makes it unlawful to treat people unfairly because of nine protected characteristics, including age, disability, race, religion or belief, sex and sexual orientation. This reflects a simple idea: who you are should never be a reason to be treated worse.",
            ],
          },
          {
            heading: "What shapes who we are?",
            text: [
              "Identity is shaped by an interaction between the things you are born with and the world around you. Some influences are biological, such as your genes and temperament, which is the natural way you tend to react to things, for example being quick to get excited or slow to warm up to new people.",
              "Many influences are social. Family passes on traditions, values, food and language. Friends influence what we find funny, what we wear and what we think is 'normal'. School, faith communities, clubs and the area where we live all give us groups to belong to and people to learn from.",
              "Experiences matter too. Succeeding at something difficult, moving house, a family change or a loss can all change how we see ourselves. So can culture and media: films, music, social media and advertising constantly show us ideas about who we 'should' be.",
              "Not every influence is positive. Stereotypes, which are fixed and oversimplified ideas about a group, can put pressure on people to act in a certain way, such as the idea that 'boys don't cry' or 'girls aren't good at maths'. Spotting these influences gives you more choice about which ones you accept.",
            ],
          },
          {
            heading: "Identity changes, and that's normal",
            text: [
              "Adolescence, roughly the years between about 10 and 19, is a time when identity develops especially quickly. The brain is still changing a great deal during these years, particularly the areas involved in planning, judgement and understanding other people. It is very common to try out new interests, styles and friendship groups, and to question ideas you once took for granted.",
              "Trying things out is part of working out who you are. Changing your mind is not being fake; it is learning. Many adults look back and see that the person they were at 13 was a stage on the way to who they became.",
              "There can be pressure to fit in, and wanting to belong is a normal human need. The challenge is to belong without losing the parts of yourself that matter to you. People who feel accepted for who they are tend to have better wellbeing, which is one reason respecting other people's identities matters too.",
              "Your values, the principles you think are important such as honesty, kindness or fairness, often act like an anchor. Hobbies and friendships may change, but knowing what you value can help you make choices you feel good about.",
            ],
          },
        ],
        words: [
          { word: "identity", meaning: "a person's sense of who they are, made up of many personal and social parts" },
          { word: "personal identity", meaning: "the qualities that make you an individual, such as personality, interests and humour" },
          { word: "social identity", meaning: "the part of identity that comes from the groups you belong to" },
          { word: "stereotype", meaning: "a fixed, oversimplified idea about what a whole group of people are like" },
          { word: "adolescence", meaning: "the stage of life between childhood and adulthood, roughly ages 10 to 19" },
          { word: "values", meaning: "the principles a person believes are important, such as honesty or fairness" },
        ],
      },
      practice: {
        intro: "Check your understanding of identity and the influences that shape it.",
        questions: [
          {
            type: "match",
            q: "Match each example to the kind of influence on identity.",
            pairs: [
              ["Being naturally shy with new people", "Temperament (biological)"],
              ["Celebrating Diwali every year with your grandparents", "Family and culture"],
              ["Copying a style you saw on a video app", "Media"],
              ["Feeling more confident after passing a music grade", "Experience"],
            ],
          },
          { type: "choice", q: "Which statement best explains why nobody has just one identity?", options: ["Because people lie about who they are", "Because identity is decided at birth", "Because each person belongs to many groups and has many personal qualities at once"], answer: 2, why: "Identity is made of many overlapping parts, personal and social." },
          { type: "pick", q: "Which of these are stereotypes? There is more than one.", options: ["'Boys don't cry.'", "'Ali enjoys playing the drums.'", "'Girls aren't good at maths.'", "'Old people can't use technology.'"], answers: [0, 2, 3], why: "A stereotype makes a fixed claim about a whole group. A fact about one person is not a stereotype." },
          { type: "gap", q: "Fill in the gaps.", text: "The part of identity that comes from the groups you belong to is called ___ identity. The stage of life between childhood and adulthood is called ___.", bank: ["social", "personal", "adolescence", "infancy", "fixed"], answers: ["social", "adolescence"] },
          { type: "choice", q: "Jas used to love football but now spends all her free time drawing. What is the most accurate way to describe this?", options: ["She is being fake", "Her identity is developing, which is normal in adolescence", "She has lost her identity"], answer: 1, why: "Trying new interests and changing your mind is a normal part of working out who you are." },
        ],
      },
      task: {
        title: "Map your identity",
        intro: "Make a private identity map showing the different parts of who you are and the influences behind them. You do not have to show it to anyone.",
        need: ["A large sheet of paper", "Coloured pens or pencils"],
        steps: [
          "Write 'Me' in a circle in the centre of the page.",
          "Draw branches out to at least six parts of your identity. Include some personal parts (such as personality, interests, humour) and some social parts (such as family, culture, faith, nationality, friends, teams).",
          "Next to each branch, write or draw one influence that helped shape it, for example a person, a place, an experience or something from the media.",
          "Circle in one colour the parts that feel most important to you right now. In another colour, mark any part you think has changed in the last two years.",
          "Underneath, write a paragraph of at least 100 words answering: 'Which influences have shaped me most, and which do I want to keep shaping me in future? Why?'",
          "Finally, list three values that matter to you, and give one example of how each one shows up in what you do.",
        ],
      },
      exit: [
        { type: "choice", q: "What is identity?", options: ["Your name and date of birth only", "What other people decide about you", "Your sense of who you are, made up of many personal and social parts"], answer: 2 },
        { type: "choice", q: "Being part of a football team is an example of which part of identity?", options: ["Social identity", "Temperament", "A stereotype"], answer: 0 },
        { type: "pick", q: "Which of these are social influences on identity? There is more than one.", options: ["Friends", "Genes", "Family traditions", "Faith community"], answers: [0, 2, 3] },
        { type: "type", q: "What word means a fixed, oversimplified idea about what a whole group of people are like?", answer: ["stereotype", "a stereotype", "stereotypes"] },
        { type: "choice", q: "Which best explains why trying out new interests is common in adolescence?", options: ["Teenagers cannot make decisions", "Identity develops quickly during adolescence, and trying things out is part of working out who you are", "It only happens to people who are unhappy"], answer: 1 },
        { type: "choice", q: "Which law in Great Britain protects people from unfair treatment because of characteristics such as race, religion and disability?", options: ["The Equality Act 2010", "The Data Protection Act 2018", "The Children Act 1989"], answer: 0 },
      ],
      grownUp: {
        need: ["A large sheet of paper and coloured pens"],
        tips: [
          "The identity map is private unless your learner chooses to share it. Showing interest without pressing for details builds trust for the harder topics later in the unit.",
          "Some learners have complicated feelings about family, heritage or belonging, for example if they are adopted, care-experienced or between cultures. Let them choose which parts to include.",
          "If your learner talks about questioning parts of their identity, listen calmly and without judgement. You do not need answers; feeling heard matters most.",
        ],
        younger: "Start the map together by naming three things your learner enjoys and two groups they belong to, then let them carry on.",
        older: "Research the difference between 'nature' and 'nurture' and write a balanced paragraph on which you think plays a bigger part in shaping identity, with reasons.",
      },
    },
    {
      slug: "identity-and-mental-health-2",
      title: "Self-esteem and the inner critic",
      emoji: "💬",
      minutes: 60,
      goal: "I can explain what self-esteem is, what can raise or lower it, and use strategies to challenge unhelpful thoughts about myself.",
      starter: [
        { type: "choice", q: "What is identity?", options: ["A person's sense of who they are", "A type of ID card", "The way other people see you"], answer: 0 },
        { type: "choice", q: "Which part of identity comes from the groups you belong to?", options: ["Personal identity", "Temperament", "Social identity"], answer: 2 },
        { type: "type", q: "What is the stage of life between childhood and adulthood called?", answer: ["adolescence", "Adolescence"] },
        { type: "pick", q: "Which of these are influences on identity? There is more than one.", options: ["Family", "Media", "Experiences", "The weather on one Tuesday"], answers: [0, 1, 2] },
        { type: "choice", q: "'Girls aren't good at maths' is an example of what?", options: ["A value", "A fact", "A stereotype"], answer: 2 },
        { type: "choice", q: "Why can knowing your values be helpful?", options: ["They act as an anchor when other things change", "They stop you ever changing", "They make you more popular"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "What is self-esteem?",
            text: [
              "Self-esteem is how much you value yourself overall: whether you feel you are a worthwhile person who deserves respect. It is different from confidence, which is how sure you feel about being able to do a particular thing. You can have high confidence in a skill, such as maths, but still have low self-esteem overall, or the other way round.",
              "Healthy self-esteem does not mean thinking you are perfect or better than everyone else. It means accepting yourself, including your mistakes and weaknesses, while still feeling you have value. People with healthy self-esteem can say 'I got that wrong' without deciding 'I am useless'.",
              "Self-esteem naturally goes up and down. Most people feel better about themselves on some days than others, and it is common for it to dip in early adolescence, when bodies, friendships and expectations are all changing at once.",
              "Low self-esteem that lasts a long time can affect how people feel, how they treat themselves and what they are willing to try. That is why it is worth understanding what builds it up and what wears it down.",
            ],
          },
          {
            heading: "What raises and lowers it?",
            text: [
              "Things that tend to build self-esteem include feeling accepted by people who matter to you, having relationships where you are treated with respect, getting better at something through effort, helping other people, and being encouraged rather than constantly criticised.",
              "Things that tend to lower it include bullying, harsh criticism, being left out, and constant comparison with other people. Comparison is especially powerful online, where people usually share their best moments, and we end up comparing our ordinary lives with everyone else's highlights.",
              "Basing your worth on just one thing can make self-esteem fragile. If you only feel good about yourself when you win, when you look a certain way or when you get lots of likes, then every setback feels like a judgement on you as a person. Having several sources of worth, such as relationships, values, effort and interests, makes it sturdier.",
              "Psychologist Carol Dweck's research on mindset suggests that people who see ability as something that grows with effort, a growth mindset, tend to cope better with setbacks than people who believe ability is fixed. Mistakes become information rather than proof of failure.",
            ],
          },
          {
            heading: "Talking back to the inner critic",
            text: [
              "Most people have an inner critic, a voice in their head that comments harshly on what they do: 'You always mess up', 'Everyone thinks you're weird'. These automatic thoughts pop up quickly and feel true, but thoughts are not facts.",
              "Some common thinking traps make the critic louder. All-or-nothing thinking sees things as total success or total failure. Mind reading assumes you know what others think of you. Catastrophising jumps to the worst possible outcome. Overgeneralising turns one event into 'always' or 'never'.",
              "A useful strategy, taken from cognitive behavioural approaches, is to catch the thought, check it and change it. Catch it by noticing and writing it down. Check it by asking: what is the evidence for and against this? What would I say to a friend who thought this? Change it by finding a more balanced thought, such as 'I made a mistake in that test, but I did well in the last one and I can ask for help with this topic.'",
              "This is not about pretending everything is fine or forcing positive thinking. It is about being as fair and kind to yourself as you would be to a good friend. That kindness towards yourself is sometimes called self-compassion.",
            ],
          },
        ],
        words: [
          { word: "self-esteem", meaning: "how much a person values themselves overall" },
          { word: "confidence", meaning: "how sure a person feels about being able to do a particular thing" },
          { word: "inner critic", meaning: "the harsh voice in your head that judges what you do" },
          { word: "thinking trap", meaning: "a common pattern of unbalanced thinking, such as catastrophising or mind reading" },
          { word: "growth mindset", meaning: "the belief that abilities can be developed through effort and practice" },
          { word: "self-compassion", meaning: "treating yourself with the same kindness and fairness you would show a friend" },
        ],
      },
      practice: {
        intro: "Practise spotting thinking traps and telling self-esteem apart from confidence.",
        questions: [
          {
            type: "match",
            q: "Match each thought to the thinking trap it shows.",
            pairs: [
              ["'If I don't get full marks, I've failed.'", "All-or-nothing thinking"],
              ["'They're whispering, so they must be talking about me.'", "Mind reading"],
              ["'If I trip on stage, my life is ruined.'", "Catastrophising"],
              ["'I got one question wrong, so I'm never good at anything.'", "Overgeneralising"],
            ],
          },
          { type: "choice", q: "Which of these best describes the difference between self-esteem and confidence?", options: ["They mean exactly the same thing", "Confidence is about a particular skill; self-esteem is how you value yourself overall", "Self-esteem is about sport; confidence is about school"], answer: 1 },
          { type: "order", q: "Put the steps for challenging an unhelpful thought in order.", items: ["Catch the thought and write it down", "Check the evidence for and against it", "Change it to a more balanced thought"] },
          { type: "choice", q: "Which is the most balanced replacement for 'I'm rubbish at everything'?", options: ["'I'm the best at everything.'", "'It doesn't matter, nothing matters.'", "'I find some things hard, like science tests, but I'm good at other things and I can improve with practice.'"], answer: 2, why: "A balanced thought is fair and realistic. It is not the opposite extreme." },
          { type: "pick", q: "Which of these tend to build healthy self-esteem? There is more than one.", options: ["Getting better at something through effort", "Comparing yourself with influencers all day", "Being treated with respect", "Helping other people"], answers: [0, 2, 3] },
        ],
      },
      task: {
        title: "Thought record and strengths file",
        intro: "Practise the catch, check, change method on a made-up example, then start a file of evidence about your strengths.",
        need: ["A notebook or paper", "A pen"],
        steps: [
          "Read this scenario: Sam's friend didn't reply to a message all evening. Sam thinks: 'She's angry with me. Nobody actually likes me.'",
          "Draw a table with four columns: Thought, Thinking trap(s), Evidence for and against, Balanced thought. Fill it in for Sam's thought.",
          "Now think of a time you had an unhelpful thought about yourself, if you feel comfortable, and complete a second row. You can keep this private.",
          "On a new page headed 'My strengths file', write at least eight things you do well, qualities you have, or kind things people have said to you. Include at least two that are not about appearance or results.",
          "For three of them, add a short example as evidence, for example 'Patient: I taught my cousin to ride a bike.'",
          "Write a short paragraph (about 80 words) explaining why having several sources of self-worth makes self-esteem sturdier.",
        ],
      },
      exit: [
        { type: "choice", q: "What is self-esteem?", options: ["How much you value yourself overall", "How good you are at sport", "How popular you are"], answer: 0 },
        { type: "choice", q: "'I made one mistake, so I always get everything wrong' is an example of which thinking trap?", options: ["Mind reading", "Overgeneralising", "Catastrophising"], answer: 1 },
        { type: "gap", q: "Fill in the gaps.", text: "Thoughts are not ___. To challenge an unhelpful thought, catch it, check the ___ and change it.", bank: ["facts", "evidence", "feelings", "time", "rules"], answers: ["facts", "evidence"] },
        { type: "choice", q: "Why can comparing yourself with others online lower self-esteem?", options: ["People usually share their best moments, so you compare your ordinary life with their highlights", "Everything online is always true", "Screens damage your eyesight"], answer: 0 },
        { type: "type", q: "What term describes treating yourself with the same kindness you would show a friend? (self-...)", answer: ["self-compassion", "self compassion", "compassion", "selfcompassion"] },
        { type: "choice", q: "Which is the best example of a growth mindset?", options: ["'I'm just not a maths person.'", "'If I'm not good at it straight away, I should stop.'", "'I can't do this yet, but practice will help me improve.'"], answer: 2 },
      ],
      grownUp: {
        need: ["A notebook and pen"],
        tips: [
          "You can model this lesson yourself: say out loud when you catch your own inner critic, and how you reframe it. Young people learn a lot from watching adults handle mistakes.",
          "Praise effort, strategies and kindness as well as results. This supports self-esteem that does not depend on winning.",
          "The thought record is a self-help tool, not therapy. If your learner's thoughts about themselves are very harsh, persistent, or include not wanting to be here, take it seriously and talk to your GP. See the notes in lesson 6.",
        ],
        younger: "Do Sam's thought record together, talking through each column, and help your learner find their first three strengths.",
        older: "Read about cognitive behavioural therapy (CBT) on the NHS website and explain in a paragraph how the link between thoughts, feelings and behaviour is used to help people.",
      },
    },
    {
      slug: "identity-and-mental-health-3",
      title: "Body image in an edited world",
      emoji: "🪞",
      minutes: 60,
      goal: "I can explain what body image is, describe how images online and in the media are edited, and evaluate how this can affect the way people feel about their bodies.",
      starter: [
        { type: "choice", q: "What is self-esteem?", options: ["How much you value yourself overall", "How sure you are about one skill", "How many friends you have"], answer: 0 },
        { type: "choice", q: "'If I don't get every answer right, I'm a failure' is which thinking trap?", options: ["All-or-nothing thinking", "Mind reading", "Overgeneralising"], answer: 0 },
        { type: "order", q: "Put the steps for challenging an unhelpful thought in order.", items: ["Catch", "Check", "Change"] },
        { type: "choice", q: "Why does having several sources of self-worth help?", options: ["One setback doesn't feel like a judgement on your whole self", "It makes you better than others", "It means you never feel sad"], answer: 0 },
        { type: "type", q: "What kind of mindset is the belief that abilities grow with effort?", answer: ["growth", "growth mindset", "a growth mindset"] },
        { type: "choice", q: "Which statement about the inner critic is true?", options: ["It is always right", "Its thoughts feel true but are not facts", "Only a few people have one"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is body image?",
            text: [
              "Body image is how you think and feel about your body: how you picture it, what you believe about it, and how it makes you feel. It is not the same as how your body actually looks. Two people with very similar bodies can have very different body images.",
              "A positive or healthy body image means being broadly accepting of your body and appreciating what it does for you, even if there are things you would change. A negative body image can involve constantly checking or criticising your appearance, comparing yourself with others, or avoiding things you enjoy because of how you look.",
              "Puberty changes the body a great deal and at very different times for different people. Growth spurts, weight changes, skin changes and new body shapes are all normal, and they can make people more aware of their appearance. Bodies come in a huge natural range of shapes and sizes, and there is no single 'right' one.",
              "Body image affects people of every gender. Pressure on girls is often about being thin; pressure on boys is often about being muscular. Both can affect wellbeing.",
            ],
          },
          {
            heading: "Edited images and the 'ideal'",
            text: [
              "Many images we see are not real in the way they appear. Professional photos in magazines and adverts are carefully lit, posed and then retouched with editing software to smooth skin, change body shapes, whiten teeth or lengthen legs. Even the models often say they do not look like their own pictures.",
              "Filters and editing apps now put the same tools on every phone. Filters can change face shape, enlarge eyes, slim noses or add 'perfect' skin in real time. Posts can also be selected from dozens of attempts, taken at flattering angles and edited before sharing.",
              "Algorithms, the rules that decide what appears in your feed, tend to show you more of whatever you linger on. If someone pauses on images of a particular body type, they may be shown more and more of it, which can make an unrealistic look seem normal.",
              "Rules about this are changing. In 2021 the UK's Advertising Standards Authority ruled that influencers should not use filters in adverts for beauty products if they exaggerate what the product does, and some countries, such as Norway, now require labels on adverts with edited bodies. These rules cover adverts, though, not the everyday posts most people see.",
            ],
          },
          {
            heading: "Building a healthier relationship with your body",
            text: [
              "Research has linked frequent comparison with idealised images to lower body satisfaction and lower mood in young people. Comparison is the key: the more someone measures themselves against edited images, the worse they tend to feel. Being media literate, which means knowing how images are made and asking questions about them, helps to weaken that effect.",
              "Helpful questions include: Who made this image and why? Has it been edited or filtered? Is someone trying to sell me something? How does looking at this make me feel?",
              "You can also curate your feed. Unfollowing or muting accounts that leave you feeling worse, and following accounts about interests, skills, and a wide variety of real bodies, changes what the algorithm shows you.",
              "Focusing on body function rather than appearance can help too: legs that let you walk to see friends, hands that play an instrument, lungs that let you laugh. If worries about appearance, eating or exercise start to take over someone's thoughts or daily life, that is a sign to talk to a trusted adult or a GP, who can help.",
            ],
          },
        ],
        words: [
          { word: "body image", meaning: "how a person thinks and feels about their own body" },
          { word: "retouching", meaning: "editing a photo after it is taken to change how a person or object looks" },
          { word: "filter", meaning: "a digital effect that changes a photo or video, often altering faces or skin" },
          { word: "algorithm", meaning: "a set of rules a platform uses to decide what content to show each user" },
          { word: "media literacy", meaning: "the ability to understand how media is made and to question its purpose and accuracy" },
          { word: "curate", meaning: "to choose carefully what you follow and see" },
        ],
      },
      practice: {
        intro: "Think critically about images and body image.",
        questions: [
          { type: "choice", q: "Which statement about body image is most accurate?", options: ["Body image is the same as how your body looks", "Only girls are affected by body image", "Body image is how you think and feel about your body, which can differ from how it looks"], answer: 2 },
          { type: "pick", q: "Which of these are ways an image might be made to look 'perfect'? There is more than one.", options: ["Retouching software", "Filters", "Choosing the best of many attempts", "Using no lighting at all"], answers: [0, 1, 2] },
          { type: "choice", q: "A study finds that young people who compare themselves often with influencer photos report lower body satisfaction. Which conclusion is best supported?", options: ["Social media is always harmful to everyone", "Frequent comparison with idealised images is linked to feeling worse about your body", "Influencers are all dishonest"], answer: 1, why: "The evidence is about comparison and a link, not about every person or every use of social media." },
          { type: "gap", q: "Fill in the gaps.", text: "An ___ decides what appears in your feed. You can ___ your feed by unfollowing accounts that make you feel worse.", bank: ["algorithm", "curate", "filter", "delete", "advert"], answers: ["algorithm", "curate"] },
          {
            type: "match",
            q: "Match each media literacy question to what it helps you notice.",
            pairs: [
              ["Is someone trying to sell me something?", "The purpose of the image"],
              ["Has it been filtered or edited?", "Whether it is realistic"],
              ["How does this make me feel?", "Its effect on you"],
            ],
          },
        ],
      },
      task: {
        title: "Investigate an edited image",
        intro: "Investigate how images are changed, then create advice for a younger student. You will need internet access, so ask your grown-up first and use a search they are happy with.",
        need: ["Internet access with a grown-up's permission", "Paper and pens, or a free online slide or poster tool such as Google Slides or Canva"],
        steps: [
          "With permission, search for a 'before and after retouching' example or a short video showing how a photo is edited. Choose one that your grown-up agrees is suitable.",
          "List every change you can spot between the original and the edited version.",
          "Find out about one rule on edited images in advertising, for example the 2021 ASA ruling on filters in beauty adverts or Norway's labelling law. Write two or three sentences about what it requires and what it does not cover.",
          "Write a short argument (about 150 words): 'Should all edited images online carry a label?' Give at least one point for, one point against, and your conclusion.",
          "Make a poster or a one-page guide for a Year 6 pupil called 'Five questions to ask about any image'. Use the media literacy questions from the lesson plus one of your own.",
          "Optional: look at your own feed with your grown-up and decide on one account to mute and one positive account to follow.",
        ],
      },
      exit: [
        { type: "choice", q: "What is body image?", options: ["How a person thinks and feels about their own body", "A photo of your body", "Your height and weight"], answer: 0 },
        { type: "type", q: "What word describes editing a photo after it is taken to change how someone looks? (re...)", answer: ["retouching", "retouched", "retouch"] },
        { type: "choice", q: "Why might an algorithm make an unrealistic body type seem normal?", options: ["It shows you more of whatever you linger on", "It deletes realistic images", "It is controlled by doctors"], answer: 0 },
        { type: "pick", q: "Which of these can help build a healthier body image? There is more than one.", options: ["Curating your feed", "Focusing on what your body can do", "Checking your appearance in every reflection", "Asking whether an image has been edited"], answers: [0, 1, 3] },
        { type: "choice", q: "Which is true about UK rules on edited images?", options: ["All edited photos online must be labelled", "Editing photos is illegal", "Advertising rules restrict misleading filters in beauty adverts, but everyday posts are not covered"], answer: 2 },
        { type: "choice", q: "If worries about appearance or eating start to take over someone's daily life, what should they do?", options: ["Keep it to themselves", "Talk to a trusted adult or a GP", "Look at more images online"], answer: 1 },
      ],
      grownUp: {
        need: ["Internet access, supervised", "Paper and pens or a free browser-based design tool"],
        tips: [
          "Preview any before-and-after images or videos first. Some search results show extreme bodies or diet content; choose a neutral, educational source.",
          "Try to avoid commenting on bodies, including your own, in front of your learner, even positively. Talking about what bodies do rather than how they look helps.",
          "If your learner seems preoccupied with weight, food, exercise or appearance, or you notice changes in eating, speak to your GP. Beat (beateatingdisorders.org.uk) has guidance for families.",
        ],
        younger: "Sit together and compare two adverts, one with clearly retouched images and one with natural images, and talk through the media literacy questions.",
        older: "Find and summarise one research study on social media use and body image. Explain the difference between correlation and causation, and whether the study can prove that one causes the other.",
      },
    },
    {
      slug: "identity-and-mental-health-4",
      title: "Mental health: everyone has it",
      emoji: "🧠",
      minutes: 60,
      goal: "I can explain what mental health means, describe the mental health continuum, and explain how stress and anxiety affect the mind and body.",
      starter: [
        { type: "choice", q: "What is body image?", options: ["How you think and feel about your body", "Your reflection in a mirror", "A photo on social media"], answer: 0 },
        { type: "pick", q: "Which of these can make an image look unrealistically 'perfect'? There is more than one.", options: ["Filters", "Retouching", "Flattering angles", "A blurry camera"], answers: [0, 1, 2] },
        { type: "type", q: "What is the name for the set of rules that decides what appears in your social media feed?", answer: ["algorithm", "an algorithm", "algorithms", "the algorithm"] },
        { type: "choice", q: "Which is the best example of media literacy?", options: ["Believing every image you see", "Never using the internet", "Asking who made an image and whether it has been edited"], answer: 2 },
        { type: "choice", q: "What does it mean to curate your feed?", options: ["To choose carefully what you follow and see", "To post more often", "To delete your account"], answer: 0 },
        { type: "choice", q: "Which helps body image most?", options: ["Comparing yourself with edited images", "Appreciating what your body can do", "Using more filters"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What is mental health?",
            text: [
              "Mental health is about how we think, feel and cope with life. Just like physical health, everyone has mental health, all the time. It is not only about illness; it includes feeling able to enjoy things, get on with people, learn, and deal with the ups and downs of everyday life.",
              "The World Health Organization describes good mental health as a state of wellbeing in which a person can cope with the normal stresses of life, realise their abilities, learn and work well, and contribute to their community. Wellbeing is a broader word for feeling good and functioning well.",
              "One helpful way to picture mental health is as a continuum, a scale. At one end, people are thriving: coping well and feeling good. Further along, people may be struggling: stressed, low or worried. At the far end, people may be unwell and need professional help. Everyone moves along this scale at different times in their life, often many times.",
              "Mental health problems are common. NHS surveys in England in 2023 found that about one in five children and young people aged 8 to 16 had a probable mental health condition. Like physical health problems, most can be treated or managed, and many people recover fully.",
            ],
          },
          {
            heading: "Stress and the body",
            text: [
              "Stress is the feeling of being under pressure. A little stress can be useful: it can sharpen your focus before a match or help you revise for a test. Problems arise when stress is very strong or goes on for a long time without a break.",
              "When the brain senses a threat or pressure, it triggers the stress response, often called 'fight or flight'. The body releases hormones such as adrenaline and cortisol. Heart rate and breathing speed up, muscles tense, the mouth can feel dry and digestion slows, which can cause 'butterflies' or a sick feeling. This response evolved to help our ancestors escape danger quickly.",
              "The same response can switch on for modern pressures, such as exams, falling out with friends, family worries or a packed schedule, even though running or fighting won't help. When stress goes on for a long time, people may notice headaches, poor sleep, irritability, difficulty concentrating, or changes in appetite.",
              "Recognising your own signs of stress, in your body, thoughts and behaviour, is the first step to managing it. Lesson 5 looks at coping strategies.",
            ],
          },
          {
            heading: "Worry, anxiety and low mood",
            text: [
              "Anxiety is a feeling of worry, unease or fear, often about something that might happen. Everyone feels anxious sometimes, for example before a performance, a new school or a difficult conversation. It is a normal emotion and usually passes once the situation is over.",
              "Anxiety can become a problem when it is very intense, lasts for weeks, feels out of proportion to the situation, or stops someone doing everyday things such as going to school or seeing friends. Some people experience panic attacks: sudden surges of intense fear with a racing heart, fast breathing and dizziness. They feel frightening but are not dangerous and usually pass within minutes.",
              "Feeling sad or low is also a normal response to disappointments, loss or change. Low mood that lasts most days for more than two weeks, especially if someone loses interest in things they usually enjoy, is a sign to talk to someone and possibly see a GP.",
              "Talking about mental health openly helps. Stigma, meaning negative attitudes or stereotypes about mental health, can stop people asking for help. Using respectful language and treating mental health like physical health makes it easier for everyone to speak up.",
            ],
          },
        ],
        words: [
          { word: "mental health", meaning: "how a person thinks, feels and copes with life; everyone has it" },
          { word: "wellbeing", meaning: "feeling good and functioning well in everyday life" },
          { word: "continuum", meaning: "a scale with no fixed boundaries, along which people can move" },
          { word: "stress response", meaning: "the body's 'fight or flight' reaction to threat or pressure, driven by hormones like adrenaline" },
          { word: "anxiety", meaning: "a feeling of worry, unease or fear, usually about something that might happen" },
          { word: "stigma", meaning: "negative attitudes or stereotypes that make people feel ashamed or judged" },
        ],
      },
      practice: {
        intro: "Check your understanding of mental health, stress and anxiety.",
        questions: [
          { type: "choice", q: "Which statement about mental health is correct?", options: ["Only people with a mental illness have mental health", "Mental health never changes", "Everyone has mental health, just as everyone has physical health"], answer: 2 },
          {
            type: "order",
            q: "Put these positions on the mental health continuum in order, from best to most in need of help.",
            items: ["Thriving: coping well and feeling good", "Struggling: stressed or worried", "Unwell: needs professional help"],
          },
          { type: "pick", q: "Which of these are physical signs of the stress response? There is more than one.", options: ["Faster heart rate", "Tense muscles", "'Butterflies' in the stomach", "Slower breathing"], answers: [0, 1, 2] },
          { type: "choice", q: "Which best explains why we feel 'butterflies' before a test?", options: ["The stress response slows digestion and releases adrenaline", "We have eaten something bad", "Our brain has switched off"], answer: 0, why: "Fight or flight diverts energy away from digestion towards muscles, which can cause a fluttery or sick feeling." },
          { type: "gap", q: "Fill in the gaps.", text: "Two hormones released in the stress response are ___ and cortisol. Negative attitudes that stop people asking for help are called ___.", bank: ["adrenaline", "stigma", "insulin", "wellbeing", "oxygen"], answers: ["adrenaline", "stigma"] },
        ],
      },
      task: {
        title: "My stress signals and a myth-buster",
        intro: "Investigate how stress shows up for you, then create a short myth-busting guide about mental health.",
        need: ["Paper and pens", "Optional: a stopwatch or phone timer"],
        steps: [
          "Draw a simple outline of a person. Around it, label the physical signs of stress you notice in yourself (body), the thoughts you tend to have (mind), and the things you tend to do (behaviour). Aim for at least two of each.",
          "Optional mini-investigation: sit still for one minute and count your breaths. Then think about something mildly stressful, such as an upcoming test, for one minute and count again. Finally, breathe slowly for one minute and count. Record and compare the three numbers. What does this suggest?",
          "Read these myths: 'Mental health problems are rare.' 'People with anxiety are just weak.' 'Talking about it makes it worse.' 'Young people don't get mental health problems.'",
          "For each myth, write the fact that busts it, using evidence from the lesson.",
          "Turn your myth-busters into a leaflet or poster designed to reduce stigma among people your age.",
        ],
      },
      exit: [
        { type: "choice", q: "What is mental health?", options: ["Only having a mental illness", "How we think, feel and cope with life", "Being happy all the time"], answer: 1 },
        { type: "type", q: "What word describes a scale with no fixed boundaries, along which people can move?", answer: ["continuum", "a continuum", "the continuum"] },
        { type: "choice", q: "About how many children and young people aged 8 to 16 in England had a probable mental health condition, according to NHS surveys in 2023?", options: ["About one in 100", "About one in 20", "About one in five"], answer: 2 },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Adrenaline", "A hormone released in the stress response"], ["Anxiety", "A feeling of worry or fear about what might happen"], ["Stigma", "Negative attitudes that make people feel judged"]] },
        { type: "choice", q: "When might anxiety become a problem that needs help?", options: ["Feeling nervous before a performance", "When it is intense, lasts for weeks, or stops someone doing everyday things", "Worrying for a moment about a test"], answer: 1 },
        { type: "choice", q: "Which statement about panic attacks is accurate?", options: ["They feel frightening but are not dangerous and usually pass within minutes", "They are a sign of heart disease", "They last for days"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and pens"],
        tips: [
          "You may find it helpful to share, in an age-appropriate way, a time you felt stressed or anxious and what helped. It shows that these feelings are normal and survivable.",
          "If your learner mentions symptoms that sound like ongoing anxiety or low mood, stay calm and listen. You don't need to diagnose; your GP is the right first step. See the notes in lesson 6.",
          "The breathing count investigation is gentle, but skip the stress part if your learner is currently very anxious.",
        ],
        younger: "Focus on the body outline task. Talk through what happens in the body before something nerve-racking, such as a sports day or a new club.",
        older: "Research the difference between the sympathetic and parasympathetic nervous systems and explain how slow breathing can help calm the stress response.",
      },
    },
    {
      slug: "identity-and-mental-health-5",
      title: "Healthy ways to cope",
      emoji: "🌿",
      minutes: 60,
      goal: "I can explain how sleep, exercise, connection and mindfulness support mental health, tell healthy coping apart from unhelpful coping, and build a personal wellbeing plan.",
      starter: [
        { type: "choice", q: "Who has mental health?", options: ["Only people who are unwell", "Only adults", "Everyone"], answer: 2 },
        { type: "choice", q: "What is the stress response often called?", options: ["Rest and digest", "Fight or flight", "Sleep and dream"], answer: 1 },
        { type: "pick", q: "Which of these are hormones released in the stress response? There is more than one.", options: ["Adrenaline", "Cortisol", "Calcium"], answers: [0, 1] },
        { type: "choice", q: "What is stigma?", options: ["A type of medicine", "A healthy coping strategy", "Negative attitudes that make people feel judged"], answer: 2 },
        { type: "type", q: "What is the name for a feeling of worry or fear about what might happen?", answer: ["anxiety", "Anxiety", "worry"] },
        { type: "choice", q: "Low mood lasting most days for more than how long is a sign to talk to someone and possibly see a GP?", options: ["Two hours", "Two days", "Two weeks"], answer: 2 },
      ],
      learn: {
        cards: [
          {
            heading: "Looking after the basics: sleep and movement",
            text: [
              "Sleep is when the brain processes memories and emotions and the body repairs itself. The NHS advises that teenagers need around 8 to 10 hours of sleep a night, and many get much less. Short sleep is linked to worse mood, poorer concentration, irritability and finding stress harder to manage.",
              "Good sleep habits, sometimes called sleep hygiene, include going to bed and getting up at similar times each day, keeping the bedroom dark and cool, avoiding caffeine (in cola, energy drinks, coffee and tea) later in the day, and putting screens away before bed. Screens are stimulating, and notifications keep the brain alert.",
              "Physical activity releases chemicals such as endorphins that can lift mood and reduce stress, and it improves sleep. The UK Chief Medical Officers recommend that children and young people do an average of at least 60 minutes of moderate or vigorous activity a day. It doesn't have to be sport: walking, dancing, cycling or playing outside all count.",
              "Eating regular, balanced meals and drinking enough water also affect energy and mood. None of these basics is a cure on its own, but together they make a big difference to how well we cope.",
            ],
          },
          {
            heading: "Connection and talking",
            text: [
              "Humans are social. Feeling connected to other people is one of the strongest protective factors for mental health. Spending time with people who care about you, even doing simple things together, helps to buffer stress.",
              "Talking about how you feel can make problems feel more manageable. Putting a feeling into words can reduce its intensity, and the other person may offer support or a new perspective. Talking can be face to face, by phone or message, or while doing something side by side, like walking or cooking, which many people find easier.",
              "The NHS promotes five ways to wellbeing, based on research: connect with other people, be physically active, learn new skills, give to others, and pay attention to the present moment. Helping others, through volunteering or small acts of kindness, often boosts the helper's own mood.",
              "Expressing feelings in other ways can help too: writing in a journal, drawing, making music or playing an instrument.",
            ],
          },
          {
            heading: "Mindfulness, and helpful versus unhelpful coping",
            text: [
              "Mindfulness means paying attention to the present moment, on purpose, without judging it. Instead of being swept along by worries about the future or replays of the past, you notice what is happening now: your breathing, sounds, sensations in your body. Research suggests regular mindfulness practice can help some people reduce stress and anxiety.",
              "Simple techniques include slow breathing, such as breathing in for a count of 4 and out for a count of 6, which helps calm the stress response, and grounding, such as the 5-4-3-2-1 exercise: notice five things you can see, four you can hear, three you can touch, two you can smell and one you can taste.",
              "Coping strategies are things we do to manage difficult feelings. Healthy coping strategies help in the short term and do no harm in the long term. Unhelpful coping strategies might bring quick relief but make things worse over time, for example avoiding every difficult situation, scrolling for hours late at night, bottling feelings up, taking anger out on others, or using alcohol, vapes or other drugs.",
              "Different strategies work for different people and different situations, so it helps to have a toolkit of several. And coping strategies are not a substitute for getting help when a problem is big or won't go away; lesson 6 covers that.",
            ],
          },
        ],
        words: [
          { word: "sleep hygiene", meaning: "habits and surroundings that help people get good quality sleep" },
          { word: "endorphins", meaning: "chemicals released by the body, for example during exercise, that can improve mood" },
          { word: "protective factor", meaning: "something that makes good mental health more likely or helps people cope" },
          { word: "mindfulness", meaning: "paying attention to the present moment, on purpose, without judging it" },
          { word: "grounding", meaning: "a technique that uses the senses to bring attention back to the present" },
          { word: "coping strategy", meaning: "something a person does to manage difficult feelings or situations" },
        ],
      },
      practice: {
        intro: "Sort coping strategies and apply what you know.",
        questions: [
          { type: "pick", q: "Which of these are healthy coping strategies? There is more than one.", options: ["Going for a walk", "Talking to someone you trust", "Bottling feelings up", "Slow breathing", "Scrolling until 2am"], answers: [0, 1, 3] },
          { type: "choice", q: "Why is avoiding every difficult situation described as an unhelpful coping strategy?", options: ["It gives quick relief but can make the worry bigger over time", "It never makes you feel better", "It is against the law"], answer: 0, why: "Avoidance brings short-term relief, but you never learn that you can cope, so the anxiety can grow." },
          {
            type: "match",
            q: "Match each of the five ways to wellbeing to an example.",
            pairs: [
              ["Connect", "Phoning a grandparent for a chat"],
              ["Be active", "Cycling to a friend's house"],
              ["Learn", "Teaching yourself a new song on guitar"],
              ["Give", "Helping a neighbour carry shopping"],
              ["Take notice", "Watching the clouds and noticing your breathing"],
            ],
          },
          { type: "choice", q: "Priya is struggling to sleep because she messages friends in bed until late. Which is the best advice?", options: ["Drink an energy drink in the morning", "Put her phone away from her bed before a set time", "Sleep in until lunchtime at weekends"], answer: 1 },
          { type: "type", q: "How many minutes of moderate or vigorous activity a day, on average, do the UK Chief Medical Officers recommend for young people?", answer: ["60", "sixty", "60 minutes"], after: "minutes" },
        ],
      },
      task: {
        title: "Build a wellbeing plan and track it",
        intro: "Try three coping strategies, track a week of basics, and create a personal wellbeing plan.",
        need: ["A notebook or a simple table on paper", "A timer"],
        steps: [
          "Try each of these for a few minutes and note how you felt before and after: slow breathing (in for 4, out for 6, for two minutes); the 5-4-3-2-1 grounding exercise; a 10-minute walk or dance to two songs.",
          "Draw a tracker table for seven days with columns for: hours of sleep, minutes of activity, time spent with people, and mood on a scale of 1 to 5. Fill it in each day this week.",
          "At the end of the week, look for patterns. Did your mood tend to be better on days with more sleep or activity? Write three sentences about what you notice, and remember that a week is a small sample.",
          "Create your wellbeing plan with four sections: 'Things that help me every day', 'Signs I'm getting stressed', 'Things I can do when I'm stressed', 'People I can talk to'. Include at least three ideas in each.",
          "Keep your plan somewhere you can find it. You'll add helplines to it in the next lesson.",
        ],
      },
      exit: [
        { type: "choice", q: "According to the NHS, about how much sleep do teenagers need each night?", options: ["5 to 6 hours", "Around 8 to 10 hours", "12 to 14 hours"], answer: 1 },
        { type: "type", q: "What word means paying attention to the present moment, on purpose, without judging it?", answer: ["mindfulness", "Mindfulness"] },
        { type: "pick", q: "Which of these are good sleep hygiene habits? There is more than one.", options: ["Regular bedtimes", "Caffeine in the evening", "Putting screens away before bed", "A dark, cool bedroom"], answers: [0, 2, 3] },
        { type: "choice", q: "Which is an unhelpful coping strategy?", options: ["Writing in a journal", "Taking anger out on other people", "Going for a run"], answer: 1 },
        { type: "choice", q: "Why does exercise help mental health?", options: ["It releases endorphins, reduces stress and improves sleep", "It stops you having any feelings", "It replaces the need to sleep"], answer: 0 },
        { type: "order", q: "Put the 5-4-3-2-1 grounding steps in order.", items: ["Five things you can see", "Four things you can hear", "Three things you can touch", "Two things you can smell", "One thing you can taste"] },
      ],
      grownUp: {
        need: ["A notebook", "A timer"],
        tips: [
          "Joining in with the strategies, a walk together or a breathing exercise before bed, makes them feel normal rather than a 'treatment'.",
          "Sleep is often the biggest lever. Agreeing a household rule, such as phones charging outside bedrooms overnight, works better when adults follow it too.",
          "The mood tracker is for your learner's own reflection. Ask what they noticed rather than reading it unless invited.",
        ],
        younger: "Pick just one strategy to practise each day this week and do it together, then make the wellbeing plan as a conversation.",
        older: "Research the evidence for one strategy, such as exercise or mindfulness, and evaluate it: how strong is the evidence, for whom does it work, and what are its limits?",
      },
    },
    {
      slug: "identity-and-mental-health-6",
      title: "Getting help and supporting a friend",
      emoji: "🤝",
      minutes: 60,
      goal: "I can recognise when it is time to get help, name reliable places to go for support, and explain how to support a friend safely.",
      starter: [
        { type: "choice", q: "What does mindfulness mean?", options: ["Thinking hard about the future", "Ignoring all your feelings", "Paying attention to the present moment without judging it"], answer: 2 },
        { type: "pick", q: "Which of these are healthy coping strategies? There is more than one.", options: ["Exercise", "Talking to someone", "Using alcohol", "Slow breathing"], answers: [0, 1, 3] },
        { type: "choice", q: "Which of these is one of the NHS five ways to wellbeing?", options: ["Compete", "Give", "Hide"], answer: 1 },
        { type: "type", q: "What word describes chemicals released during exercise that can lift mood?", answer: ["endorphins", "endorphin", "Endorphins"] },
        { type: "choice", q: "Why is scrolling late at night an unhelpful way to cope?", options: ["It can bring quick relief but harms sleep and mood over time", "It is always helpful", "It makes you fall asleep faster"], answer: 0 },
        { type: "choice", q: "What does the 5-4-3-2-1 exercise use to bring attention to the present?", options: ["Your senses", "Your phone", "Maths problems"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "When is it time to get help?",
            text: [
              "Everyone has hard days, and self-help strategies are often enough. But it is time to talk to someone and get extra support if difficult feelings are very strong, last for more than a couple of weeks, or start getting in the way of everyday life, such as sleeping, eating, going to school, or seeing friends.",
              "Other signs include losing interest in things you usually enjoy, feeling hopeless or worthless, withdrawing from people, big changes in eating or sleeping, or using unhealthy ways to cope. You do not need to wait until things are really bad. Asking for help early is sensible, not weak.",
              "Some situations need help straight away. If someone is thinking about hurting themselves or ending their life, or is in immediate danger, they should tell an adult immediately. In an emergency, call 999 or go to A&E. Talking about these thoughts does not make them more likely; it is the first step to getting support.",
              "It can feel hard to start the conversation. Some people find it easier to write a note, send a message, or say 'I've not been feeling great and I'd like to talk.' You don't have to explain everything at once.",
            ],
          },
          {
            heading: "Where to get help",
            text: [
              "A trusted adult is usually the first step: a parent or carer, another family member, a teacher, a school nurse, a school counsellor, a youth worker or a sports coach. A trusted adult is someone who listens, takes you seriously, and can help you get further support.",
              "A GP (family doctor) can talk through what's going on, offer advice, and refer young people to specialist services such as CAMHS, the Child and Adolescent Mental Health Services, or local support services. You can ask a parent or carer to book an appointment, or in many cases ask to speak to the GP alone for part of it.",
              "Childline is free and confidential for anyone under 19 in the UK. You can call 0800 1111 at any time, day or night, or use the online chat and message boards at childline.org.uk. The call won't show up on a phone bill. YoungMinds (youngminds.org.uk) is a UK charity with clear, reliable information about feelings and mental health for young people and parents, and it points to crisis support: you can text YM to 85258 for free, 24/7 text support from the Shout service.",
              "For urgent advice that isn't an emergency, NHS 111 can help by phone or online. Be careful with random online advice: choose trusted sources such as the NHS, Childline and YoungMinds over anonymous forums or videos, which can be inaccurate or even harmful.",
            ],
          },
          {
            heading: "Supporting a friend",
            text: [
              "If a friend seems to be struggling, you can make a real difference by being there for them. Signs might include seeming withdrawn or quieter than usual, being irritable, missing school, or saying things that suggest they feel hopeless.",
              "Good support starts with listening. Find a private moment, ask open questions such as 'How are you really doing?', and give them time. Try not to judge, interrupt or rush to fix things. Saying 'That sounds really hard' or 'Thanks for telling me' shows you are taking them seriously.",
              "You can encourage them to talk to a trusted adult and offer to go with them, or help them look at Childline or YoungMinds. Keep inviting them to things, even if they say no sometimes, so they don't feel forgotten.",
              "There are limits. You are a friend, not a counsellor, and you should not carry a serious worry on your own. If a friend tells you they are being hurt, are hurting themselves, or are thinking about suicide, you must tell a trusted adult, even if they asked you to keep it secret. That is not betrayal; it is keeping them safe. Look after yourself too, and talk to someone about how you're feeling.",
            ],
          },
        ],
        words: [
          { word: "trusted adult", meaning: "an adult who listens, takes you seriously and can help you get support" },
          { word: "GP", meaning: "general practitioner: a family doctor who can give advice and refer to specialist services" },
          { word: "CAMHS", meaning: "Child and Adolescent Mental Health Services: NHS services for young people with mental health needs" },
          { word: "confidential", meaning: "kept private, unless someone is at risk of serious harm" },
          { word: "signposting", meaning: "pointing someone towards a person or service that can help" },
          { word: "open question", meaning: "a question that can't be answered with just yes or no, such as 'How are you feeling?'" },
        ],
      },
      practice: {
        intro: "Check you know when and where to get help, and how to support a friend.",
        questions: [
          { type: "type", q: "What is Childline's free phone number?", answer: ["0800 1111", "08001111", "0800-1111"] },
          { type: "pick", q: "Which of these are signs it may be time to get extra help? There is more than one.", options: ["Feeling low most days for more than two weeks", "Feeling nervous before one test", "Losing interest in things you usually enjoy", "Feelings getting in the way of school or sleep"], answers: [0, 2, 3] },
          { type: "choice", q: "Your friend says they're thinking about hurting themselves and asks you to promise not to tell anyone. What should you do?", options: ["Keep the promise so they still trust you", "Post about it online to get advice", "Tell a trusted adult straight away, because their safety matters most"], answer: 2, why: "When someone is at risk of harm, telling a trusted adult is how you keep them safe. It isn't a betrayal." },
          {
            type: "match",
            q: "Match each source of help to what it offers.",
            pairs: [
              ["Childline", "Free, confidential phone and online support for under-19s, any time"],
              ["GP", "A doctor who can give advice and refer to specialist services"],
              ["YoungMinds", "Reliable mental health information for young people and parents"],
              ["999", "Emergency help when someone is in immediate danger"],
            ],
          },
          { type: "choice", q: "Which is the best way to start a supportive conversation with a friend?", options: ["'Just cheer up.'", "'How are you really doing? I'm here if you want to talk.'", "'Other people have it much worse.'"], answer: 1 },
        ],
      },
      task: {
        title: "Help card and a supportive conversation",
        intro: "Make a pocket-sized help card, then plan and practise how you would support a friend.",
        need: ["Card or stiff paper", "Pens", "Your wellbeing plan from lesson 5", "Internet access with a grown-up's permission (optional)"],
        steps: [
          "Make a small help card that could fit in a wallet or phone case. On one side, list three trusted adults you could talk to. On the other side, write: Childline 0800 1111 (free, any time); childline.org.uk; YoungMinds youngminds.org.uk; text YM to 85258; NHS 111; 999 in an emergency.",
          "With permission, visit the Childline or YoungMinds website and find one page of useful advice. Write down its title and two things it says.",
          "Read this scenario: Your friend Leo has been quiet for weeks, has stopped coming to football and says 'What's the point?' when you suggest meeting up.",
          "Write a short script of what you could say to Leo. Include an opening, two open questions, one thing you'd say to show you're listening, and how you'd encourage him to talk to a trusted adult.",
          "If you feel comfortable, practise the conversation with your grown-up, taking turns to be Leo.",
          "Write a paragraph (about 100 words) explaining why you should tell a trusted adult if a friend is at risk, even if they asked you to keep it secret. Add the help card details to your wellbeing plan.",
        ],
      },
      exit: [
        { type: "choice", q: "Which of these means it is time to get extra help?", options: ["Feeling a bit nervous before a match", "Being disappointed after losing a game", "Feelings that are very strong, last weeks, or get in the way of everyday life"], answer: 2 },
        { type: "choice", q: "What is Childline's free number?", options: ["0800 1111", "999", "0800 0000"], answer: 0 },
        { type: "type", q: "Fill in the key word: a GP can ___ a young person to specialist services such as CAMHS.", answer: ["refer", "Refer", "referral"] },
        { type: "choice", q: "What should you do if a friend tells you they are thinking about suicide?", options: ["Keep it secret", "Tell a trusted adult straight away", "Wait to see if it passes"], answer: 1 },
        { type: "pick", q: "Which of these are reliable sources of mental health information? There is more than one.", options: ["The NHS", "An anonymous forum", "YoungMinds", "Childline"], answers: [0, 2, 3] },
        { type: "choice", q: "Which is an open question?", options: ["'Are you OK?'", "'Did you go to school today?'", "'How have things been for you lately?'"], answer: 2 },
      ],
      grownUp: {
        need: ["Card or stiff paper and pens", "Internet access, supervised (optional)"],
        tips: [
          "If a young person shares something worrying, stay calm, listen without interrupting, and thank them for telling you. Avoid looking shocked, getting angry or rushing to solutions. Reassure them it is not their fault and that you will help.",
          "Don't promise to keep everything secret. Explain kindly that if they or someone else is at risk of harm, you will need to get help, and that you'll tell them what you're doing.",
          "Asking directly whether someone is thinking about suicide does not put the idea in their head. If they say yes, or you believe they are in immediate danger, call 999 or go to A&E. For urgent advice, call NHS 111 or contact your GP. Papyrus HOPELINE247 (0800 068 4141) advises adults worried about a young person, and the Samaritans (116 123) are free, any time.",
          "If the worry involves abuse or someone harming the child, contact the police or your local council's children's services, or call the NSPCC helpline (0808 800 5000) for advice. Look after yourself afterwards too.",
        ],
        younger: "Make the help card together and role-play the conversation with your learner as the supportive friend, using prompts from the lesson.",
        older: "Research what CAMHS is and how young people are referred in your area, and write a short guide explaining the route from a first conversation to specialist support.",
      },
    },
  ],
};
