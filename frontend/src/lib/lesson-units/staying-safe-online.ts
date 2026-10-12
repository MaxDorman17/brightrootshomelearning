import type { LessonUnit } from "@/lib/lessons";

/**
 * Staying safe online, for ages 9 to 11. Builds on "Using a computer safely" (ages 7 to 9) without repeating it.
 * Calm and reassuring throughout. Every task is unplugged or done side by side with a grown-up; no sign-ups needed.
 */
export const stayingSafeOnline: LessonUnit = {
  slug: "staying-safe-online",
  title: "Staying safe online",
  short: "Online safety",
  subject: "Computing",
  ages: "9 to 11",
  emoji: "🔒",
  color: "#4E7A72",
  summary: "Six lessons: your digital footprint, privacy settings and age limits, spotting fake news and misleading adverts, online friendships, kindness and unkindness online, and seeing through scams and phishing.",
  cover: "/lessons/units/staying-safe-online.jpg",
  lessons: [
    {
      slug: "staying-safe-online-1",
      title: "Your digital footprint",
      emoji: "👣",
      minutes: 50,
      goal: "I can explain what a digital footprint is and think carefully before I share something online.",
      starter: [
        {
          type: "pick",
          q: "Which of these are personal information? There is more than one.",
          options: ["Your home address", "Your favourite planet", "Your school's name", "Your date of birth"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "Once you send a photo to someone online, can you be sure who else will see it?", options: ["Yes, always", "No, they could copy or forward it"], answer: 1 },
        { type: "type", q: "If something online worries you, who should you tell? A trusted...", answer: ["adult", "grown-up", "grownup", "grown up"] },
        { type: "choice", q: "Which password is the strongest?", options: ["Max2015", "TulipRocketGravy!8", "password1"], answer: 1 },
        {
          type: "match",
          q: "Match each word to its meaning.",
          pairs: [["Online", "Using the internet"], ["Private", "Not shared with everyone"], ["Account", "Your own space in an app that you log in to"]],
        },
        { type: "choice", q: "Do you think a comment posted online can still be found years later?", options: ["Never", "Sometimes, yes"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "The trail you leave behind",
            text: [
              "When you walk across a sandy beach, you leave footprints. When you use the internet, you leave a trail too. It is called your digital footprint.",
              "Your digital footprint is made of everything you post, share, like, comment on, upload and search for. It also includes things other people post about you, such as a photo a friend shares or a comment that mentions your name.",
              "Some of it you leave on purpose, like a picture you choose to post. Some of it is collected quietly in the background: apps and websites record what you click, how long you watch, and sometimes where your device is.",
              "Having a digital footprint is normal. Almost everyone who uses the internet has one. The aim is not to be scared of it, but to be in charge of it.",
            ],
          },
          {
            heading: "Why it lasts",
            text: [
              "Footprints in sand wash away with the tide. Digital footprints are much harder to rub out.",
              "Anything you share can be copied, saved as a screenshot or forwarded in a second, and you cannot always see who has done it. Even messages that say they 'disappear' can be captured before they go.",
              "Deleting a post removes it from your account, but you cannot be sure every copy has gone. That is why the best moment to think is before you press send, not afterwards.",
            ],
          },
          {
            heading: "Think before you post",
            text: [
              "A helpful habit is to ask yourself a few quick questions first. Is it true? Is it kind? Would I be happy for my teacher, my grandparent or a future friend to see it? Does it give away personal information, like my school uniform, my street sign or my house number?",
              "Remember other people's footprints too. Ask before you share a photo of a friend, and respect it if they say no.",
              "A digital footprint can be a good thing. A footprint full of kind comments, things you have made and projects you are proud of tells a positive story about you.",
            ],
          },
        ],
        words: [
          { word: "digital footprint", meaning: "the trail of information you leave behind when you use the internet" },
          { word: "screenshot", meaning: "a picture of what is on a screen, saved by the device" },
          { word: "upload", meaning: "to send something from your device onto the internet" },
          { word: "permanent", meaning: "lasting for a very long time, or for ever" },
          { word: "consent", meaning: "giving permission for something" },
        ],
      },
      practice: {
        intro: "Footprints: on purpose, in the background, or by someone else?",
        questions: [
          {
            type: "pick",
            q: "Which of these become part of your digital footprint? There is more than one.",
            options: ["A comment you write under a video", "A drawing you keep in a sketchbook", "A photo of you that a friend posts", "The searches you type in"],
            answers: [0, 2, 3],
          },
          {
            type: "choice",
            q: "Why is it hard to completely delete something once it is posted?",
            options: ["Because the delete button never works", "Because other people may already have copied, saved or forwarded it", "Because only adults can delete things"],
            answer: 1,
          },
          {
            type: "match",
            q: "Match each example to the kind of footprint it is.",
            pairs: [
              ["Posting a picture of your model volcano", "Left on purpose"],
              ["An app noting how long you watched a video", "Collected in the background"],
              ["Your cousin tagging you in a party photo", "Added by someone else"],
            ],
          },
          {
            type: "gap",
            q: "Fill the gaps.",
            text: "Before I post, I ask: is it ___, is it ___, and would I be happy for anyone to see it?",
            bank: ["true", "kind", "funny", "secret"],
            answers: ["true", "kind"],
          },
          {
            type: "choice",
            q: "Mia wants to post a photo of herself outside her house. The house number is easy to read. What is the best choice?",
            options: ["Post it, nobody looks closely", "Choose a different photo, or check with a grown-up first", "Post it, then delete it later"],
            answer: 1,
          },
        ],
      },
      task: {
        title: "Footprint map",
        intro: "Map out your own digital footprint on paper, then decide what kind of footprint you want to leave.",
        need: ["A large sheet of paper", "Felt pens or coloured pencils", "Sticky notes (optional)", "A grown-up to talk it through with"],
        steps: [
          "Draw around one of your feet (or draw a big footprint) in the middle of the paper.",
          "Around the outside, write or draw everything that might be part of your digital footprint: games you play, videos you watch, messages to family, photos others have taken of you, searches for homework.",
          "Colour code them: one colour for things you chose to share, another for things collected in the background, a third for things other people shared about you.",
          "Talk with your grown-up. Is there anything on your map that you'd rather wasn't there? What could you do about it?",
          "Inside the footprint, write three things you would like your footprint to show about you in the future, like 'kind', 'creative' or 'helpful'.",
          "Extra challenge: write a short paragraph explaining to a younger child why a digital footprint is like footprints in wet cement, not sand.",
        ],
      },
      exit: [
        { type: "choice", q: "What is a digital footprint?", options: ["A picture of your shoe", "The trail of information you leave when you use the internet", "A type of computer virus"], answer: 1 },
        {
          type: "pick",
          q: "Which of these can add to your digital footprint? There is more than one.",
          options: ["Things you post", "Things others post about you", "Things you only say out loud in your kitchen", "Things apps record about what you click"],
          answers: [0, 1, 3],
        },
        {
          type: "choice",
          q: "Why should you think before you post, rather than after?",
          options: ["Because it may be copied or shared before you can delete it", "Because posting is always against the rules", "Because thinking is slower afterwards"],
          answer: 0,
        },
        { type: "type", q: "What do we call a saved picture of what is on a screen?", answer: ["screenshot", "a screenshot", "screen shot", "screengrab", "screen grab"] },
        { type: "choice", q: "You want to share a photo of your friend. What should you do first?", options: ["Ask them if they are happy for you to share it", "Nothing, it's your photo", "Add a funny caption"], answer: 0 },
        { type: "choice", q: "Can a digital footprint be a good thing?", options: ["No, never", "Yes, if it shows kind and positive things"], answer: 1 },
      ],
      grownUp: {
        need: ["Large paper and pens"],
        tips: [
          "Keep this lesson positive. The message is 'you're in charge of your footprint', not 'the internet remembers everything you do wrong'.",
          "If you post photos of your child, this is a good moment to ask how they feel about it and to agree some family rules together. Children notice when we ask their permission.",
          "The 'would I be happy for Grandma to see it?' test is simple and sticks well at this age.",
        ],
        younger: "Focus on one idea: anything you share online can be copied, so always ask a grown-up before posting.",
        older: "With your grown-up, search your family surname plus your town and see what comes up. Talk about what a stranger could learn from a footprint.",
      },
    },
    {
      slug: "staying-safe-online-2",
      title: "Privacy settings and age limits",
      emoji: "🔒",
      minutes: 50,
      goal: "I can explain what privacy settings do and why apps have age limits.",
      starter: [
        { type: "choice", q: "What is a digital footprint?", options: ["The trail you leave online", "A shoe size", "A type of password"], answer: 0 },
        {
          type: "pick",
          q: "Which of these add to your digital footprint? There is more than one.",
          options: ["A comment you post", "A photo a friend shares of you", "A dream you had last night", "Your searches"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "Why is it hard to fully delete something you posted?", options: ["It might already have been copied or shared", "Deleting costs money", "Only teachers can delete posts"], answer: 0 },
        { type: "type", q: "What word means giving permission for something? It starts with c.", answer: ["consent", "consenting"] },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "Before you share a photo of a friend, you should ___ them first.",
          bank: ["ask", "tag", "copy"],
          answers: ["ask"],
        },
        { type: "choice", q: "Which is the best moment to think about whether to share something?", options: ["Before you press send", "A week later"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Who can see what?",
            text: [
              "Most apps, games and websites have privacy settings. These are choices that control who can see your posts, who can send you messages, and what information about you is shown.",
              "A public account can be seen by anyone in the world. A private account can only be seen by people you have accepted. Some apps also let you turn off location sharing, hide your online status, or stop strangers from messaging you.",
              "Many apps start with settings that share more than you might expect. That is why it is worth checking the settings with a grown-up when you first start using something, and again every now and then, because apps often update.",
            ],
          },
          {
            heading: "Why apps have age limits",
            text: [
              "Most social media apps say you must be at least 13 to have an account, and some set their limit higher. This is written in their rules, called terms of service, which you agree to when you sign up.",
              "The limit of 13 comes mainly from laws about how companies are allowed to collect and use children's personal information. Apps for older users also contain content and features, like chatting with strangers, that are designed for teenagers and adults.",
              "Age limits are not a judgement about how sensible you are. They are there to protect you. If you join an app before you are old enough, the safety features made for children may not be switched on for you.",
            ],
          },
          {
            heading: "Apps made for your age",
            text: [
              "Lots of games and apps are made for children, with extra protections such as no chat with strangers, or chat that grown-ups can manage. Your grown-up can also set up parental controls, which can limit content, spending and screen time.",
              "Games and films have age ratings too. In the UK and Europe, games carry a PEGI rating, such as PEGI 3, 7, 12, 16 or 18. These tell you what age the content is suitable for, not how difficult the game is.",
              "If a friend has an app you are not old enough for, you have not missed out. It's fine to say, 'I'm not allowed that one yet', and lots of people your age are saying the same.",
            ],
          },
        ],
        words: [
          { word: "privacy settings", meaning: "choices in an app that control who can see and contact you" },
          { word: "public", meaning: "able to be seen by anyone" },
          { word: "terms of service", meaning: "the rules you agree to when you sign up to an app or website" },
          { word: "age rating", meaning: "a label showing which ages content is suitable for" },
          { word: "parental controls", meaning: "settings a grown-up uses to keep a device or app suitable for a child" },
          { word: "location sharing", meaning: "a setting that shows other people where your device is" },
        ],
      },
      practice: {
        intro: "Settings and sensible choices.",
        questions: [
          {
            type: "match",
            q: "Match each setting to what it does.",
            pairs: [
              ["Private account", "Only people you accept can see your posts"],
              ["Location sharing off", "Others can't see where your device is"],
              ["Messages from friends only", "Strangers can't message you"],
            ],
          },
          { type: "choice", q: "What is the minimum age for most social media apps?", options: ["8", "10", "13"], answer: 2 },
          {
            type: "choice",
            q: "Why do apps have age limits?",
            options: ["To protect children's information and keep content suitable", "Because children are bad at typing", "So that adults can have more fun"],
            answer: 0,
          },
          {
            type: "pick",
            q: "Which of these are good habits? There is more than one.",
            options: ["Checking privacy settings with a grown-up", "Making every account public", "Checking settings again after an update", "Using apps made for your age"],
            answers: [0, 2, 3],
          },
          { type: "type", q: "What is the name of the age rating system used for games in the UK? Four letters.", answer: ["PEGI", "pegi"] },
        ],
      },
      task: {
        title: "Design your own safe app",
        intro: "Plan an app for children your age, with privacy settings built in from the start.",
        need: ["Paper and pencils", "A ruler", "Felt pens", "A grown-up (and, if you like, one of their apps to look at together)"],
        steps: [
          "Decide what your app is for: sharing drawings, a pet club, a book review club, anything you like.",
          "Draw the app's home screen inside a phone-shaped rectangle.",
          "Draw a second screen called Settings. List at least five privacy settings, with a switch for each, like 'Who can message me', 'Show my location' and 'Who can see my posts'.",
          "Decide whether each switch starts on or off for a new user, and explain why next to it. (Hint: the safest choice should be the starting one.)",
          "Write your app's age rating and two or three rules for users.",
          "With your grown-up, look at the privacy settings on an app or game they use. Did the real app make the same choices as yours?",
        ],
      },
      exit: [
        { type: "choice", q: "What do privacy settings control?", options: ["How fast the app runs", "Who can see your information and contact you", "The colour of the screen"], answer: 1 },
        { type: "choice", q: "What is the minimum age for most social media apps?", options: ["13", "9", "11"], answer: 0 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "A ___ account can be seen by anyone. A ___ account can only be seen by people you accept.",
          bank: ["public", "private", "secret", "loud"],
          answers: ["public", "private"],
        },
        {
          type: "choice",
          q: "Why should you check your settings again after an app updates?",
          options: ["Updates can change settings or add new ones", "Updates always delete your account", "You don't need to"],
          answer: 0,
        },
        { type: "type", q: "What are the rules you agree to when you sign up to an app called? Terms of...", answer: ["service", "terms of service", "use", "terms of use"] },
        { type: "choice", q: "What does a game's age rating tell you?", options: ["How hard the game is", "What age the content is suitable for", "How long it takes to finish"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper, pens and a ruler", "A device with an app or game you use, to look at the settings together (optional)"],
        tips: [
          "State age limits as plain facts. Most major social media platforms set 13 as the minimum in their terms; in the UK this links to data protection law, which sets 13 as the age a child can agree to their data being used.",
          "If your child already uses an app aimed at older users, don't make them feel they've done wrong. Use the lesson to check its settings together.",
          "The UK Safer Internet Centre and Internet Matters both have clear, step-by-step guides to parental controls on popular devices and apps.",
        ],
        younger: "Just compare 'public' and 'private' using a noticeboard in the street versus a letter in a sealed envelope.",
        older: "Read a short section of an app's terms of service or privacy policy together. Can they summarise it in three sentences?",
      },
    },
    {
      slug: "staying-safe-online-3",
      title: "Fake news and misleading pictures",
      emoji: "🔎",
      minutes: 50,
      goal: "I can check whether something online is reliable and spot misleading pictures and adverts.",
      starter: [
        { type: "choice", q: "What do privacy settings control?", options: ["Who can see and contact you", "The volume", "Battery life"], answer: 0 },
        { type: "choice", q: "What is the minimum age for most social media apps?", options: ["10", "13", "7"], answer: 1 },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Public", "Anyone can see it"], ["Private", "Only people you accept can see it"], ["Age rating", "Shows which ages content suits"]] },
        { type: "type", q: "What do we call settings a grown-up uses to keep a device suitable for a child? Parental...", answer: ["controls", "parental controls", "control"] },
        {
          type: "choice",
          q: "Why do apps have age limits?",
          options: ["To protect children's information and keep content suitable", "To make apps more popular", "Because of the weather"],
          answer: 0,
        },
        {
          type: "pick",
          q: "Which settings help keep you safe? There is more than one.",
          options: ["A private account", "Location sharing on for everyone", "Messages from friends only", "Location sharing off"],
          answers: [0, 2, 3],
        },
      ],
      learn: {
        cards: [
          {
            heading: "Not everything is what it seems",
            text: [
              "Fake news is false or misleading information made to look like real news. Some is made up to trick people, some to make money from clicks, and some is a mistake that gets shared again and again.",
              "Misinformation is false information shared by someone who believes it is true. Disinformation is false information shared on purpose to mislead.",
              "False stories often spread faster than true ones, because they are designed to be surprising, scary or funny, which makes people want to share them straight away. Pausing before you share is one of the most powerful things you can do.",
            ],
          },
          {
            heading: "Check the source",
            text: [
              "The source is where the information comes from. Ask: who made this, and do they know what they are talking about? A well-known news organisation, a museum or a government website is usually more reliable than an anonymous post.",
              "Look for clues. Is there a date? Is the web address odd, or a copy of a famous one with a small change? Is the headline in capital letters with lots of exclamation marks? Does it try to make you feel angry or panicky?",
              "Then cross-check: do two or three other reliable sources say the same thing? If no trusted source is reporting a big story, that is a warning sign. When you are unsure, ask a grown-up and don't share it.",
            ],
          },
          {
            heading: "Pictures and adverts can mislead",
            text: [
              "Photos can be edited to change colours, remove things or add things that were never there. Filters can make faces and bodies look different from real life. Some pictures and videos are now made entirely by computers using AI, and can look very real.",
              "A real photo can mislead too, if it is cropped to hide part of the scene or shared with the wrong caption, such as an old picture claimed to show something that happened today.",
              "Adverts want you to buy or click. On websites they may say 'Ad' or 'Sponsored'. In the UK, when online creators are paid to promote something, they are meant to label it clearly, for example with '#ad'. Always ask: who made this, and what do they want me to do?",
            ],
          },
        ],
        words: [
          { word: "fake news", meaning: "false or misleading information made to look like real news" },
          { word: "misinformation", meaning: "false information shared by someone who thinks it is true" },
          { word: "disinformation", meaning: "false information shared on purpose to mislead" },
          { word: "source", meaning: "where a piece of information comes from" },
          { word: "reliable", meaning: "able to be trusted to be accurate" },
          { word: "sponsored", meaning: "paid for by a company to advertise something" },
        ],
      },
      practice: {
        intro: "Be a fact detective.",
        questions: [
          {
            type: "pick",
            q: "Which of these are warning signs that a story might be fake? There is more than one.",
            options: ["No other trusted source is reporting it", "It has a clear date and author", "The headline is in capitals with lots of !!!", "It tries to make you feel panicky"],
            answers: [0, 2, 3],
          },
          {
            type: "match",
            q: "Match each word to its meaning.",
            pairs: [
              ["Misinformation", "False, but the sharer believes it"],
              ["Disinformation", "False, shared on purpose to mislead"],
              ["Source", "Where information comes from"],
            ],
          },
          {
            type: "order",
            q: "You see a surprising story online. Put these steps in a sensible order.",
            items: ["Pause, don't share it yet", "Check who made it and when", "See if other reliable sources agree", "Decide whether to trust or share it"],
          },
          {
            type: "choice",
            q: "A famous person posts about a brilliant new trainer, with '#ad' at the end. What does '#ad' tell you?",
            options: ["They were paid or rewarded to promote it", "The trainers are free", "It is a news story"],
            answer: 0,
          },
          {
            type: "choice",
            q: "Why do false stories often spread faster than true ones?",
            options: ["They are designed to be surprising, so people share them quickly", "The internet prefers lies", "True stories are not allowed online"],
            answer: 0,
          },
        ],
      },
      task: {
        title: "Real or fake? Newsroom",
        intro: "Become a newsroom editor: check some headlines, then write a guide to help others spot fake news.",
        need: ["Paper and pens", "A grown-up to write the headlines", "A newspaper, magazine or leaflet with adverts (optional)", "A device for checking, with your grown-up (optional)"],
        steps: [
          "Your grown-up writes six short headlines on separate slips of paper. Some are true and some are made up, like 'Scientists find a new species of frog' or 'SCHOOLS CANCELLED FOR EVER!!!'.",
          "For each one, write down: who might the source be? What clues make it seem reliable or unreliable? Sort them into Trust, Check further and Don't trust.",
          "If you like, check two of them together on a device using trusted news or science websites. Were you right?",
          "Look through a magazine or leaflet for adverts. For each one, write what it wants you to do and one trick it uses, like a smiling celebrity, the word 'free' or a countdown.",
          "Finally, write a 'Fake News Spotter's Guide' with your five best tips, in your own words. Explain why each tip works.",
        ],
      },
      exit: [
        { type: "choice", q: "What does 'source' mean?", options: ["Where information comes from", "A type of sauce", "The last line of a story"], answer: 0 },
        {
          type: "choice",
          q: "What is the difference between misinformation and disinformation?",
          options: [
            "There is no difference",
            "Misinformation is shared by mistake; disinformation is shared on purpose to mislead",
            "Misinformation is always true",
          ],
          answer: 1,
        },
        {
          type: "pick",
          q: "Which are good ways to check a story? There is more than one.",
          options: ["See if other reliable sources agree", "Check the date", "Share it to see what people say", "Ask a grown-up"],
          answers: [0, 1, 3],
        },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "A real photo can still mislead if it is ___ to hide part of the scene, or has the wrong ___.",
          bank: ["cropped", "caption", "coloured", "camera"],
          answers: ["cropped", "caption"],
        },
        { type: "type", q: "What label might a website put on a paid-for search result? It starts with S.", answer: ["sponsored", "Sponsored"] },
        { type: "choice", q: "You're not sure if a story is true. What should you do?", options: ["Share it anyway", "Don't share it, and check or ask a grown-up", "Change a few words and post it"], answer: 1 },
      ],
      grownUp: {
        need: ["Slips of paper with six headlines you have written", "A magazine or leaflet with adverts (optional)", "A device for checking (optional)"],
        tips: [
          "Make your made-up headlines silly rather than alarming. The skill being practised is checking, not worrying.",
          "If you check online, use well-known sites such as BBC Newsround, which is written for this age group, and keep safe search on.",
          "Talk about AI-made pictures calmly. The useful takeaway is 'pictures can be made or changed, so check where they came from', not that nothing can be trusted.",
        ],
        younger: "Play 'real or silly?' with a few headlines, and talk about how they decided.",
        older: "Find one news story covered by two different news organisations. Compare the headlines and pictures. What is the same, and what is different?",
      },
    },
    {
      slug: "staying-safe-online-4",
      title: "Online friendships and strangers",
      emoji: "🤝",
      minutes: 50,
      goal: "I can tell the difference between healthy and worrying online contact, and I know how and when to get help.",
      starter: [
        { type: "choice", q: "What is a source?", options: ["Where information comes from", "A kind of password", "A games console"], answer: 0 },
        {
          type: "pick",
          q: "Which are warning signs a story might be fake? There is more than one.",
          options: ["No trusted source reports it", "It makes you feel panicky", "It has a clear author and date", "Lots of capitals and !!!"],
          answers: [0, 1, 3],
        },
        { type: "type", q: "What label do UK online creators use when they are paid to promote something? Hashtag...", answer: ["ad", "#ad", "advert", "#advert"] },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Reliable", "Can be trusted to be accurate"], ["Sponsored", "Paid for to advertise"], ["Disinformation", "False on purpose"]] },
        { type: "choice", q: "Can a photo be edited to show something that never happened?", options: ["No, photos are always real", "Yes"], answer: 1 },
        { type: "gap", q: "Fill the gap.", text: "If you're not sure a story is true, don't ___ it.", bank: ["share", "read", "trust me"], answers: ["share"] },
      ],
      learn: {
        cards: [
          {
            heading: "Friends you know, and people you don't",
            text: [
              "Lots of people your age play games and chat online. Most of the time that means messaging friends and family they already know in real life, and that can be a lovely way to stay in touch.",
              "Online, though, you can't see who you are really talking to. A username and a profile picture can be anything. Someone who says they are 10 and loves the same game as you could be telling the truth, or not.",
              "That's why it's sensible to keep chat to people you know offline, and to treat anyone you only know online as a stranger, however friendly they seem. Being careful is not rude; it's smart.",
            ],
          },
          {
            heading: "Spotting when something isn't right",
            text: [
              "Healthy online contact feels relaxed. You can say no, log off, or tell your grown-up about it, and nobody minds.",
              "Some things are signs that a conversation is not OK, even if the person seems nice. Someone you don't know well might ask lots of personal questions, offer gifts or game credits, ask for photos, ask to move to a private chat or a different app, ask to meet up, or tell you to keep your chats a secret.",
              "A real friend would never pressure you or ask you to keep secrets from your grown-ups. If something makes you feel uncomfortable, confused or worried, that feeling is worth listening to. You don't need to be certain something is wrong to ask for help.",
            ],
          },
          {
            heading: "How to get help",
            text: [
              "If anything worries you, stop replying and tell a trusted adult as soon as you can. You won't be in trouble, even if you've already replied or shared something. Adults would much rather know.",
              "Most apps and games have tools to block someone, so they can't contact you, and to report them, so the company can check and take action. A grown-up can help you use these. It's a good idea to save a screenshot first, in case it's needed.",
              "In the UK, there is also a service called CEOP, run by the police, where children and grown-ups can report worries about someone's behaviour online. Childline can be contacted free on 0800 1111 if you want to talk to someone in confidence.",
            ],
          },
        ],
        words: [
          { word: "username", meaning: "the name someone uses on an app or game, which may not be their real name" },
          { word: "stranger", meaning: "someone you don't know in real life" },
          { word: "block", meaning: "to stop someone from contacting you on an app" },
          { word: "report", meaning: "to tell the app, game or a service about a problem so they can act" },
          { word: "pressure", meaning: "pushing someone to do something they don't want to do" },
        ],
      },
      practice: {
        intro: "OK, or time to tell?",
        questions: [
          {
            type: "pick",
            q: "Which of these are warning signs from someone online? There is more than one.",
            options: ["Asking you to keep your chat a secret", "Saying 'good game' at the end of a match", "Offering you free game credits", "Asking to move to a private chat"],
            answers: [0, 2, 3],
          },
          {
            type: "choice",
            q: "Someone you only know from a game asks which school you go to. What is the best response?",
            options: ["Tell them, they seem friendly", "Don't share it, and tell a trusted adult", "Give them a friend's school instead"],
            answer: 1,
          },
          {
            type: "match",
            q: "Match each word to what it does.",
            pairs: [["Block", "Stops someone contacting you"], ["Report", "Tells the app so it can act"], ["Screenshot", "Saves a picture of what happened"]],
          },
          {
            type: "order",
            q: "Something someone says online worries you. Put these steps in order.",
            items: ["Stop replying", "Save a screenshot if you can", "Tell a trusted adult", "Block and report, with your grown-up's help"],
          },
          {
            type: "choice",
            q: "Why is it sensible to treat someone you only know online as a stranger?",
            options: ["Because you can't be sure who they really are", "Because everyone online is unkind", "Because games are not allowed"],
            answer: 0,
          },
        ],
      },
      task: {
        title: "Traffic-light chat cards",
        intro: "Sort online messages into green, amber and red, then make a help card to keep near where you play.",
        need: ["12 slips of paper", "Green, orange and red pens or paper", "A small card or sheet of paper", "A grown-up"],
        steps: [
          "Your grown-up writes a different online message on each slip, like 'Good game, see you tomorrow!' (from a classmate), 'What's your address?', 'Want some free gems? Don't tell your mum' or 'Can you help me with level 4?'.",
          "Make three piles: green (fine), amber (be careful, check with a grown-up), and red (stop and tell a trusted adult straight away).",
          "For each slip, explain your choice out loud. Does it matter whether the sender is someone you know in real life?",
          "Make a help card. Write three trusted adults you could tell, the steps 'Stop, save, tell, block, report', and Childline's number: 0800 1111.",
          "Write a short paragraph: what would you say to a friend who was worried they'd be in trouble for telling? Use what you've learned to reassure them.",
        ],
      },
      exit: [
        {
          type: "choice",
          q: "Who is it safest to chat with online?",
          options: ["Anyone who plays the same game", "People you know in real life", "Anyone with a friendly profile picture"],
          answer: 1,
        },
        {
          type: "pick",
          q: "Which of these should you tell a trusted adult about? There is more than one.",
          options: ["Someone asking to meet up", "Someone asking for photos of you", "A friend from school saying 'well played'", "Someone telling you to keep a secret"],
          answers: [0, 1, 3],
        },
        { type: "choice", q: "If you've already replied to someone worrying, will you be in trouble for telling?", options: ["Yes", "No, adults would much rather know"], answer: 1 },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "To stop someone contacting you, you can ___ them. To tell the app about them, you can ___ them.",
          bank: ["block", "report", "follow", "like"],
          answers: ["block", "report"],
        },
        { type: "type", q: "What is Childline's free phone number?", answer: ["0800 1111", "08001111"] },
        {
          type: "choice",
          q: "Why might someone online ask you to keep your chats a secret?",
          options: ["Because they know a grown-up would stop it", "Because secrets make friendships stronger", "Because chats are always private anyway"],
          answer: 0,
        },
      ],
      grownUp: {
        need: ["Slips of paper and coloured pens"],
        tips: [
          "Keep this calm and practical. Most online contact is with people children already know. The aim is to give them clear signals and a clear plan, not to frighten them.",
          "Say clearly that they won't lose their device for telling you. Fear of losing access is the most common reason children don't speak up.",
          "CEOP (the Child Exploitation and Online Protection Command, part of the National Crime Agency) has a reporting button on its website for worries about someone's behaviour towards a child. In an emergency, always call 999.",
          "Childline (0800 1111) is free and confidential, and calls don't show on phone bills.",
        ],
        younger: "Use just two piles, 'fine' and 'tell a grown-up', and keep the messages simple.",
        older: "Look together at the block and report tools in a game or app your child uses, so they know exactly where they are.",
      },
    },
    {
      slug: "staying-safe-online-5",
      title: "Kindness and unkindness online",
      emoji: "💬",
      minutes: 50,
      goal: "I can be kind online, recognise online bullying and know what to do if it happens to me or someone else.",
      starter: [
        { type: "choice", q: "Who is it safest to chat with online?", options: ["People you know in real life", "Anyone in a game"], answer: 0 },
        {
          type: "pick",
          q: "Which are warning signs from someone online? There is more than one.",
          options: ["Asking to meet up", "Offering free gifts", "Saying 'well played'", "Asking you to keep a secret"],
          answers: [0, 1, 3],
        },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Block", "Stop someone contacting you"], ["Report", "Tell the app about a problem"], ["Stranger", "Someone you don't know in real life"]] },
        { type: "type", q: "What is Childline's free phone number?", answer: ["0800 1111", "08001111"] },
        { type: "choice", q: "Will you be in trouble for telling a trusted adult about something online?", options: ["No", "Yes"], answer: 0 },
        { type: "order", q: "Put these steps in order.", items: ["Stop replying", "Save a screenshot", "Tell a trusted adult"] },
      ],
      learn: {
        cards: [
          {
            heading: "Why words online can hurt more",
            text: [
              "Online, you can't see someone's face or hear their voice. A joke that would be obviously friendly in person can read as mean on a screen, and you might not notice that someone is upset.",
              "Because people can't see each other, some say things online they would never say face to face. Messages can also be shared with lots of people very quickly, and they can follow someone home, onto their phone or tablet, at any time.",
              "That's why a little extra care goes a long way. Before you send, read it back as if you were the person receiving it.",
            ],
          },
          {
            heading: "What online bullying looks like",
            text: [
              "Online bullying, sometimes called cyberbullying, is when someone uses technology to hurt, embarrass or upset another person on purpose, usually again and again.",
              "It can include sending nasty messages, posting unkind comments or embarrassing photos, spreading rumours, pretending to be someone else, or deliberately leaving someone out of a group chat or game.",
              "One unkind comment or a falling-out between friends is not always bullying, but it still matters and is still worth talking about. Nobody deserves to be treated unkindly, and if it happens to you, it is never your fault.",
            ],
          },
          {
            heading: "What you can do",
            text: [
              "If it happens to you: don't reply, because that's often what the person wants. Save screenshots as evidence, block the person, use the report tool, and tell a trusted adult. Look after yourself: take a break from the screen and do something you enjoy.",
              "If you see it happening to someone else, you can be an upstander rather than a bystander. That might mean sending the person a kind private message, not liking or sharing the unkind post, reporting it, and telling a grown-up.",
              "And you can fill the internet with kindness: give genuine compliments, include people in games, and if you get something wrong, say sorry. Kind words are part of your digital footprint too.",
            ],
          },
        ],
        words: [
          { word: "cyberbullying", meaning: "using technology to hurt or upset someone on purpose, usually again and again" },
          { word: "bystander", meaning: "someone who sees something wrong happening but does nothing" },
          { word: "upstander", meaning: "someone who sees something wrong and safely helps" },
          { word: "rumour", meaning: "a story passed around that may not be true" },
          { word: "evidence", meaning: "something that shows what really happened, like a screenshot" },
        ],
      },
      practice: {
        intro: "Bystander or upstander?",
        questions: [
          {
            type: "pick",
            q: "Which of these could be online bullying? There is more than one.",
            options: ["Posting an embarrassing photo of someone to laugh at them", "Saying 'happy birthday' in a group chat", "Spreading a rumour about someone", "Leaving someone out of a group chat on purpose"],
            answers: [0, 2, 3],
          },
          {
            type: "choice",
            q: "Why can a joke sound unkind in a message when it wouldn't face to face?",
            options: ["You can't see the person's face or hear their tone of voice", "Messages use smaller letters", "Phones change the words"],
            answer: 0,
          },
          {
            type: "match",
            q: "Match each word to its meaning.",
            pairs: [["Upstander", "Safely helps when something is wrong"], ["Bystander", "Sees it but does nothing"], ["Evidence", "Shows what really happened"]],
          },
          {
            type: "choice",
            q: "Someone in your class is being sent unkind messages in a group chat. Which is the upstander choice?",
            options: ["Add a laughing emoji", "Leave the chat and forget about it", "Send them a kind message, don't join in, and tell a grown-up"],
            answer: 2,
          },
          { type: "type", q: "What is another word for online bullying?", answer: ["cyberbullying", "cyber bullying", "cyber-bullying"] },
        ],
      },
      task: {
        title: "Kindness campaign",
        intro: "Rewrite unkind messages, then design a poster to make your corner of the internet a kinder place.",
        need: ["Paper and felt pens", "A large sheet for a poster", "A grown-up to talk it through with"],
        steps: [
          "Your grown-up writes three messages that could be read as unkind, like 'lol your drawing is so weird' or 'why are you even in this game'.",
          "For each one, write how it might make someone feel. Then rewrite it so it's kind and honest, like 'Your drawing is so different, how did you do that?'.",
          "Think of a time someone was kind to you, online or off. What did they do? How did it feel?",
          "Design a poster for a kindness campaign. Give it a slogan, three things an upstander can do, and a reminder of where to get help.",
          "Choose one real kind thing to do this week, like sending a family member a lovely message with your grown-up's help.",
        ],
      },
      exit: [
        {
          type: "choice",
          q: "What is cyberbullying?",
          options: ["One friendly joke", "Using technology to hurt or upset someone on purpose, usually again and again", "Playing a game online"],
          answer: 1,
        },
        {
          type: "order",
          q: "Someone is being unkind to you online. Put these steps in order.",
          items: ["Don't reply", "Save screenshots", "Block and report", "Tell a trusted adult"],
        },
        {
          type: "choice",
          q: "Why is it best not to reply to someone being unkind?",
          options: ["Replying is often what they want, and it can make things worse", "Replying breaks your device", "You should always reply"],
          answer: 0,
        },
        {
          type: "pick",
          q: "Which of these are upstander actions? There is more than one.",
          options: ["Reporting the unkind post", "Sharing the post with friends", "Sending a kind private message", "Telling a grown-up"],
          answers: [0, 2, 3],
        },
        {
          type: "gap",
          q: "Fill the gaps.",
          text: "If you are bullied online, it is never your ___. Screenshots can be useful ___.",
          bank: ["fault", "evidence", "idea", "game"],
          answers: ["fault", "evidence"],
        },
        { type: "choice", q: "Before sending a message, it helps to read it back as if you were...", options: ["a robot", "the person receiving it", "a teacher marking spelling"], answer: 1 },
      ],
      grownUp: {
        need: ["Paper and felt pens"],
        tips: [
          "If your child tells you about unkindness online, stay calm, thank them for telling you, and avoid taking their device away. Help them save evidence and block and report together.",
          "If it involves classmates, your child's school will want to know. Schools in the UK must have an anti-bullying policy, and it usually covers online bullying.",
          "Anti-Bullying Alliance and Childline both have helpful pages for children and families.",
        ],
        younger: "Focus on 'kind or unkind?' sorting, and practise saying 'Stop, I don't like that' and telling a grown-up.",
        older: "Talk about group chats: what makes them friendly, and what could you do if a group chat started to turn unkind?",
      },
    },
    {
      slug: "staying-safe-online-6",
      title: "Scams, phishing and protecting your information",
      emoji: "🎣",
      minutes: 50,
      goal: "I can spot the signs of a scam or phishing message and explain how to protect my personal information.",
      starter: [
        { type: "choice", q: "What is an upstander?", options: ["Someone who safely helps when something is wrong", "Someone who stands on a chair", "Someone who watches and does nothing"], answer: 0 },
        { type: "type", q: "What is another word for online bullying?", answer: ["cyberbullying", "cyber bullying", "cyber-bullying"] },
        {
          type: "pick",
          q: "Which should you do if someone is unkind to you online? There is more than one.",
          options: ["Save screenshots", "Reply with something worse", "Block and report", "Tell a trusted adult"],
          answers: [0, 2, 3],
        },
        { type: "choice", q: "If you are bullied online, is it your fault?", options: ["Sometimes", "Never"], answer: 1 },
        { type: "match", q: "Match each word to its meaning.", pairs: [["Evidence", "Shows what really happened"], ["Rumour", "A story that may not be true"], ["Bystander", "Sees it but does nothing"]] },
        {
          type: "gap",
          q: "Fill the gap.",
          text: "Before sending a message, read it back as if you were the person ___ it.",
          bank: ["receiving", "deleting", "printing"],
          answers: ["receiving"],
        },
      ],
      learn: {
        cards: [
          {
            heading: "What is a scam?",
            text: [
              "A scam is a trick to get something from you, such as money, your password, your personal information, or control of your game account.",
              "Scammers are often very good at looking genuine. They might pretend to be a bank, a delivery company, a famous game, a well-known shop, or even a friend whose account has been taken over.",
              "Scams in games are common. You might see offers of free skins, coins or gems, or a website that promises to 'generate' game currency if you just log in. Real games don't give away free items through strange websites.",
            ],
          },
          {
            heading: "Phishing: don't take the bait",
            text: [
              "Phishing (said like 'fishing') is a kind of scam where a message tries to get you to click a link, open an attachment or type in your details. Like a fisherman with bait, the scammer hopes you'll bite.",
              "Phishing messages can arrive by email, text, in a game chat or on social media. Warning signs include: it's urgent ('Act now or lose your account!'), it's too good to be true ('You've won a free tablet!'), it asks for a password or code, the sender's address looks slightly wrong, or there are odd spelling mistakes.",
              "Genuine companies will never ask you to send your password in a message. If something seems off, don't click, don't reply, and show a grown-up.",
            ],
          },
          {
            heading: "Protecting your information",
            text: [
              "Keep your personal information and passwords to yourself, and use a different, strong password for each account. Many accounts also offer two-step verification, where you need a code from another device as well as your password. A grown-up can help set this up.",
              "Never share a code that is sent to you by text or email, even with someone who says they are a friend or from the company. Those codes are how accounts get taken over.",
              "If you think you've clicked a bad link or shared something you shouldn't, tell a grown-up straight away. It is fixable: passwords can be changed and accounts can be recovered, and the sooner you speak up, the easier it is. Scammers trick adults too, so nobody should feel silly.",
            ],
          },
        ],
        words: [
          { word: "scam", meaning: "a trick to get money, information or something else from you" },
          { word: "phishing", meaning: "a message that tries to trick you into clicking a link or giving away details" },
          { word: "link", meaning: "words or a button you click that takes you to another web page" },
          { word: "attachment", meaning: "a file sent along with an email or message" },
          { word: "two-step verification", meaning: "logging in with a password plus a code from another device" },
          { word: "genuine", meaning: "real, and what it says it is" },
        ],
      },
      practice: {
        intro: "Scam or genuine?",
        questions: [
          {
            type: "pick",
            q: "Which of these are warning signs of a phishing message? There is more than one.",
            options: ["It says you must act right now", "It asks for your password", "It's from your grown-up, sitting next to you", "It offers a prize that's too good to be true"],
            answers: [0, 1, 3],
          },
          {
            type: "choice",
            q: "A message says: 'Your game account will be DELETED in 1 hour! Log in here to save it.' What should you do?",
            options: ["Click quickly before time runs out", "Don't click, and show a grown-up", "Forward it to your friends to warn them"],
            answer: 1,
          },
          {
            type: "choice",
            q: "Why do scam messages often try to make you hurry?",
            options: ["So you act before you have time to think or check", "Because the internet is fast", "Because real companies are always in a rush"],
            answer: 0,
          },
          {
            type: "gap",
            q: "Fill the gaps.",
            text: "Phishing messages try to get you to click a ___ or give away your ___.",
            bank: ["link", "password", "lunch", "shoe"],
            answers: ["link", "password"],
          },
          { type: "type", q: "A friend messages: 'I sent you a code by mistake, can you send it to me?' Should you send it? Type yes or no.", answer: ["no"] },
        ],
      },
      task: {
        title: "Spot the phish",
        intro: "Investigate some made-up messages like a cyber security expert, then make a guide for your family.",
        need: ["Paper and pens", "A highlighter or coloured pencil", "A grown-up to write the messages"],
        steps: [
          "Your grown-up writes five short pretend messages on paper. Some are genuine (like a reminder from the library) and some are scams (like 'U have won a FREE games console!! Click here and enter your password').",
          "Read each one carefully. Highlight every warning sign you can find: urgency, prizes, requests for passwords or codes, strange addresses or spelling mistakes.",
          "Decide for each: genuine or scam? Write one sentence explaining your reasoning.",
          "Now design your own 'Scam Spotter' leaflet for your family, with the five warning signs and what to do if you're not sure.",
          "Talk with your grown-up: has anyone in your family ever received a scam message? How did they spot it?",
          "Extra challenge: write a short story about a character who receives a phishing message, spots the signs and gets help. Keep it hopeful!",
        ],
      },
      exit: [
        { type: "choice", q: "What is phishing?", options: ["A hobby by the river", "A message that tries to trick you into clicking a link or giving away details", "A type of game"], answer: 1 },
        {
          type: "pick",
          q: "Which of these are warning signs of a scam? There is more than one.",
          options: ["Something too good to be true", "A demand to act immediately", "A request for your password", "A message from your grown-up about tea time"],
          answers: [0, 1, 2],
        },
        { type: "choice", q: "Will a genuine company ever ask you to send your password in a message?", options: ["Yes, often", "No"], answer: 1 },
        {
          type: "match",
          q: "Match each word to its meaning.",
          pairs: [["Scam", "A trick to get something from you"], ["Attachment", "A file sent with a message"], ["Two-step verification", "Password plus a code"]],
        },
        { type: "choice", q: "Why should you never share a code sent to you by text?", options: ["It could let someone take over your account", "It costs money to share", "It will break your phone"], answer: 0 },
        {
          type: "choice",
          q: "You think you've clicked a scam link. What should you do?",
          options: ["Keep it secret and hope for the best", "Tell a grown-up straight away so it can be fixed", "Click it again to check"],
          answer: 1,
        },
      ],
      grownUp: {
        need: ["Paper and pens", "Five pretend messages you have written"],
        tips: [
          "Write the pretend messages yourself rather than showing real scam messages, so there are no live links.",
          "In the UK, suspicious emails can be forwarded to report@phishing.gov.uk and scam texts to 7726, both run with the National Cyber Security Centre and phone networks.",
          "Children's game accounts are a common target. Turning on two-step verification and keeping payment details off children's accounts both help a lot.",
          "End the unit on a confident note: your child now knows the warning signs and knows that telling a grown-up is always the right move.",
        ],
        younger: "Focus on one rule: if a message offers a prize or asks for a password, show a grown-up before doing anything.",
        older: "Look at the security settings on a family account together and turn on two-step verification if it isn't already.",
      },
    },
  ],
};
