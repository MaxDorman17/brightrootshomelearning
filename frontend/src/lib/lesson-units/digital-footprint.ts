import type { LessonUnit } from "@/lib/lessons";

/**
 * Online safety and digital footprint, for ages 11 to 14 (KS3). Goes further than "Staying safe online" (ages 9 to 11):
 * how data is collected and protected, how accounts are attacked and defended, how scams and misinformation work, and
 * how to look after wellbeing online. Calm and practical rather than frightening. Internet tasks need a grown-up's
 * permission; no task asks a learner to sign up for anything or type a real password into a website.
 */
export const digitalFootprint: LessonUnit = {
  slug: "digital-footprint",
  title: "Online safety and digital footprint",
  short: "Digital footprint",
  subject: "Computing",
  ages: "11 to 14",
  emoji: "👣",
  color: "#5B6B8A",
  summary: "Six lessons: your digital footprint and who can see it, privacy and personal data, strong passwords and two-factor authentication, phishing and scams, misinformation and checking sources, and online wellbeing and where to get help.",
  cover: "/lessons/units/digital-footprint.jpg",
  lessons: [
    // ---------------------------------------------------------------- 1
    {
      slug: "digital-footprint-1",
      title: "Your digital footprint and who can see it",
      emoji: "👣",
      minutes: 60,
      goal: "I can explain the difference between an active and a passive digital footprint, and describe who can see the data I leave behind and how long it lasts.",
      starter: [
        { type: "choice", q: "What does the phrase 'digital footprint' mean?", options: ["The trail of information you leave behind when you use the internet", "The size of your computer's hard drive", "A type of computer virus"], answer: 0 },
        { type: "pick", q: "Which of these are personal information that you should think carefully before sharing online? There is more than one.", options: ["Your home address", "Your favourite colour", "Your school's name", "Your phone number"], answers: [0, 2, 3] },
        { type: "choice", q: "If you delete a photo you posted, can you be sure no copy of it exists any more?", options: ["Yes, deleting removes every copy", "No, someone may have saved it or taken a screenshot", "Yes, if you delete it within a day"], answer: 1 },
        { type: "choice", q: "What should you do first if something online worries or upsets you?", options: ["Keep it to yourself", "Tell a trusted adult", "Reply to the person straight away"], answer: 1 },
        { type: "type", q: "Most big social media apps say you must be at least how old to have an account?", answer: ["13", "thirteen"] },
        { type: "choice", q: "Which of these is the safest kind of username?", options: ["Your full name and year of birth", "A made-up name that does not give away who or where you are", "Your school name and your house number"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Active and passive footprints",
            picture: "/lessons/digital-footprint/lesson-1-1.jpg",
            alt: "A teenager's footprints in the sand turning into glowing digital squares",
            text: [
              "Every time you use the internet, you leave a trail of data behind. This trail is your digital footprint. Unlike a footprint in sand, it is not washed away by the next wave: data can be copied, stored and searched for years.",
              "Your active digital footprint is the data you choose to share. Posting a photo, writing a comment, filling in a profile, leaving a product review or joining a group chat all add to it. You can see this part, and you have some control over it.",
              "Your passive digital footprint is the data collected about you without you deliberately sharing it. Websites record which pages you visit and for how long. Apps may log your location, the device you are using and what you tap on. Small files called cookies let sites recognise your browser when you come back, and tracking cookies can follow you across many different sites.",
              "Much of this passive data is used to build a profile of your interests, which is then used to choose what you are shown, from the next video in your feed to the adverts you see. This is why searching for trainers once can mean seeing trainer adverts for weeks.",
              "Neither kind of footprint is bad in itself. A good digital footprint can even help you, for example a portfolio of your artwork or coding projects. The aim is not to vanish from the internet but to make thoughtful choices about what you leave behind.",
            ],
          },
          {
            heading: "Who can see it?",
            picture: "/lessons/digital-footprint/lesson-1-2.jpg",
            alt: "A teenager at the centre of rings showing friends, a wider group and the public",
            text: [
              "It helps to think of your audience in rings. The inner ring is people you choose: friends and family in a private chat. The next ring is friends of friends, who may see things your friends share or comment on. The outer ring is the public: anyone, anywhere, including strangers, search engines and, years from now, people you have not met yet.",
              "The audience you intend is not always the audience you get. A message in a private chat can be screenshotted and forwarded in seconds. A 'disappearing' photo can be captured by another phone. Once something has been copied, you cannot control where the copy goes.",
              "Some organisations look at digital footprints on purpose. Some universities, colleges and employers search for applicants' names, and some sports clubs and scholarship schemes do the same. Most are not looking to catch you out, but a public post that is cruel, illegal or embarrassing can make a poor first impression.",
              "The companies that run apps and websites can usually see far more than other users can, including private messages on some services, your location history and your activity. What they are allowed to do with it is set out in their privacy policy and limited by law, which you will look at next lesson.",
            ],
          },
          {
            heading: "How long does it last?",
            picture: "/lessons/digital-footprint/lesson-1-3.jpg",
            alt: "A photo on a phone with hidden layers of time, device and location data",
            text: [
              "Digital data is persistent, which means it tends to last. Pages are saved by archive services, posts are copied into other people's accounts, and backups keep old versions of files. Something posted at 12 may still be findable at 22.",
              "Pictures can also carry hidden information called metadata. A photo taken on a phone may store the date, the time, the type of phone and, if location is switched on, the exact place it was taken. Many apps strip this out when you post, but not all do, and a photo sent as a file may keep it.",
              "There is some good news. In the UK, data protection law gives you the right to ask organisations to delete personal data about you in many situations, and this right is especially strong for data collected when you were a child. Search engines also have forms for asking them to remove some results about you.",
              "A simple test before you post anything is the 'front page test': would you be comfortable if this appeared on a big screen at school, or in front of your family, or in front of someone interviewing you for a job in five years' time? If the answer is no, pause.",
            ],
          },
        ],
        words: [
          { word: "digital footprint", meaning: "the trail of data a person leaves behind when they use the internet and digital devices" },
          { word: "active footprint", meaning: "data a person deliberately shares, such as posts, comments and profile details" },
          { word: "passive footprint", meaning: "data collected about a person without them deliberately sharing it, such as browsing history and location" },
          { word: "cookie", meaning: "a small file a website stores in your browser so it can recognise you; tracking cookies follow you across sites" },
          { word: "metadata", meaning: "data about data, such as the time, device and location stored inside a photo file" },
          { word: "persistent", meaning: "lasting a long time; digital data is hard to remove completely once shared" },
        ],
      },
      practice: {
        intro: "Sort the evidence: is each trace active or passive, and who might see it?",
        questions: [
          {
            type: "match",
            q: "Match each example to the kind of footprint it creates.",
            pairs: [
              ["Posting a review of a film", "Active footprint"],
              ["A shopping site recording which items you looked at", "Passive footprint"],
            ],
          },
          { type: "pick", q: "Which of these add to your passive digital footprint? There is more than one.", options: ["A map app logging where you have been", "Writing a comment under a video", "A tracking cookie following you between websites", "Uploading a profile picture", "A website recording how long you spent on each page"], answers: [0, 2, 4] },
          { type: "choice", q: "Why might someone see an advert for something they only searched for once?", options: ["Because the advert was chosen at random", "Because their passive footprint was used to build a profile of their interests", "Because someone at the company read their search by hand"], answer: 1, why: "Data such as searches and cookies feeds into a profile, which advertising systems use to choose adverts." },
          { type: "choice", q: "A friend sends a joke photo of you in a private group chat. Which statement is most accurate?", options: ["It can only ever be seen by people in the chat", "It is automatically deleted after a day", "Anyone in the chat could screenshot or forward it, so it could reach a wider audience"], answer: 2 },
          { type: "gap", q: "Fill in the gaps.", text: "Information stored inside a photo, such as where and when it was taken, is called ___. Because digital data tends to last a long time, we say it is ___.", bank: ["metadata", "persistent", "passive", "encrypted", "temporary"], answers: ["metadata", "persistent"] },
        ],
      },
      task: {
        title: "Footprint audit",
        intro: "Investigate your own digital footprint, record what you find, and decide what, if anything, you want to change. Ask a grown-up's permission before going online for this task, and do the search part with them.",
        need: ["Paper and a pen, or a document", "A device with internet access, used with a grown-up's permission"],
        steps: [
          "Draw a table with four columns: Where (which app, site or game), What (the data there), Active or passive, and Who can see it (me, friends, friends of friends, public).",
          "List every app, game and site you use regularly. For each, write what you share actively (photos, comments, profile details) and what you think it collects passively (location, contacts, what you watch).",
          "With your grown-up, search your full name in a search engine in a private browsing window, then try your name with your town or school. Record what you find, including things that are not about you. Many people find very little, and that is a good result.",
          "Colour-code your table: green for things you are happy with, amber for things you want to check, red for things you want to change or remove.",
          "Write a paragraph of about 150 words answering: 'What does my digital footprint say about me, and who could see it?' Use the words active, passive and persistent.",
          "Finish with three actions you will take, for example changing a username, turning off location for an app, or deleting an old account you no longer use.",
        ],
      },
      exit: [
        { type: "choice", q: "Which of these is part of your ACTIVE digital footprint?", options: ["Your location being logged by an app", "A photo you post on your profile", "A cookie stored by a website"], answer: 1 },
        { type: "choice", q: "What is a passive digital footprint?", options: ["Data collected about you without you deliberately sharing it", "Posts you have deleted", "Information only your friends can see"], answer: 0 },
        { type: "type", q: "What is the name for the small files websites store in your browser to recognise you?", answer: ["cookie", "cookies", "a cookie"] },
        { type: "pick", q: "Which of these could be stored as metadata in a photo taken on a phone? There is more than one.", options: ["The date and time", "The location, if location is switched on", "The type of phone", "What the person in the photo was thinking"], answers: [0, 1, 2] },
        { type: "choice", q: "Which best explains why the intended audience of a post may not be its real audience?", options: ["Posts are always public by law", "Content can be screenshotted, saved and forwarded beyond the people you chose", "Only the app company can ever see private messages"], answer: 1 },
        { type: "choice", q: "What does it mean to say digital data is persistent?", options: ["It changes every day", "It tends to last and is hard to remove completely", "It can only be seen on one device"], answer: 1 },
      ],
      grownUp: {
        need: ["A device with internet access for the search step", "Paper or a document for the audit table"],
        tips: [
          "Do the name search together in a private window, so results are not shaped by your own browsing. Finding very little is a good outcome; if something unexpected turns up, stay calm and help them decide what to do.",
          "The audit can feel personal. Let them keep parts of it private if they want to; the aim is reflection, not inspection. The tone of the whole unit is practical rather than alarming.",
          "Passive data collection is normal and mostly harmless, but it is worth understanding. A useful conversation is about trade-offs: what do we get for the data we give?",
        ],
        younger: "Focus on the table only, with five apps or sites. Give them sentence starters such as 'On ___ I share ___ and the app probably collects ___.'",
        older: "Read the 'What data we collect' section of the privacy policy of one app they use. Summarise it in five bullet points and judge whether the data collected is proportionate to what the app does.",
      },
    },
    // ---------------------------------------------------------------- 2
    {
      slug: "digital-footprint-2",
      title: "Privacy settings and personal data",
      emoji: "🔐",
      minutes: 60,
      goal: "I can explain what personal data is, describe the rights UK data protection law gives me, and choose sensible privacy settings for an app.",
      starter: [
        { type: "choice", q: "Which of these is part of your passive digital footprint?", options: ["A comment you write", "A website recording which pages you visit", "A photo you upload"], answer: 1 },
        { type: "type", q: "What word means 'data about data', such as the location stored in a photo?", answer: ["metadata", "meta data", "meta-data"] },
        { type: "choice", q: "Why is it risky to think of a private chat as completely private?", options: ["Messages can be screenshotted and forwarded", "Private chats are always public", "Chats are printed in newspapers"], answer: 0 },
        { type: "pick", q: "Who might look at someone's public online profile? There is more than one.", options: ["Friends", "Strangers", "Some employers and colleges", "Nobody, ever"], answers: [0, 1, 2] },
        { type: "choice", q: "What does it mean that digital data is persistent?", options: ["It tends to last a long time", "It disappears overnight", "It can't be copied"], answer: 0 },
        { type: "choice", q: "What is the 'front page test'?", options: ["Checking a post loads quickly", "Asking whether you'd be comfortable if a post was seen by everyone, now or in future", "Making your post the first thing on your profile"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "What counts as personal data?",
            picture: "/lessons/digital-footprint/lesson-2-1.jpg",
            alt: "Jigsaw pieces of everyday details fitting together into the outline of a person",
            text: [
              "Personal data is any information that relates to an identifiable living person. Your name, home address, email address, phone number, date of birth and photos of your face are obvious examples. Less obvious ones include your location history, your IP address (the number that identifies a device on a network) and the unique ID of your phone.",
              "Some personal data is especially sensitive, so the law calls it special category data. This includes information about health, religion or beliefs, ethnicity, sexual orientation and biometric data such as fingerprints or face scans used to identify someone. It needs extra protection because misuse could cause serious harm or unfair treatment.",
              "Single pieces of information can seem harmless on their own. But combining them can reveal a lot. A first name, a school uniform in a photo, a post about walking the dog in a particular park and a birthday post could together let a stranger work out who you are and where to find you. This is sometimes called the jigsaw effect.",
              "That is why being thoughtful about personal data is not about being secretive. It is about controlling who can put the jigsaw together.",
            ],
          },
          {
            heading: "Your rights under the law",
            picture: "/lessons/digital-footprint/lesson-2-2.jpg",
            alt: "A padlocked filing cabinet beneath a set of scales, standing for data protection law",
            text: [
              "In the UK, personal data is protected by UK GDPR (the UK General Data Protection Regulation) and the Data Protection Act 2018. These laws say organisations must process personal data lawfully, fairly and transparently, collect only what they need for a clear purpose, keep it accurate and secure, and not keep it longer than necessary.",
              "The law also gives you rights. You have the right to be informed about how your data is used, the right to see a copy of the data an organisation holds about you (called a subject access request), the right to have wrong data corrected, and in many cases the right to have your data erased.",
              "In the UK, 13 is the age at which you can agree for yourself to an online service using your data in many situations; below that, a parent or carer's consent is needed. This is one reason many apps set 13 as their minimum age. The Information Commissioner's Office (ICO), which enforces data protection law, also has a code called the Age Appropriate Design Code. It expects services likely to be used by children to have high privacy settings switched on by default.",
              "The Online Safety Act 2023 adds further duties. It requires online platforms to protect children from harmful content and to give users clear ways to report problems. The regulator for this is Ofcom.",
            ],
          },
          {
            heading: "Taking control with privacy settings",
            picture: "/lessons/digital-footprint/lesson-2-3.jpg",
            alt: "Two teenagers checking privacy switches on a phone together",
            text: [
              "Privacy settings let you decide who sees what. Good default choices for most teenagers are: a private account, so only approved followers see your posts; messages only from people you know; location sharing switched off, or shared only with family; and your profile hidden from search engines.",
              "Check app permissions too. Permissions are what an app is allowed to access on your device, such as your camera, microphone, contacts, photos or location. Ask whether each permission makes sense. A torch app does not need your contacts. A map app does need your location, but perhaps only 'while using the app' rather than 'always'.",
              "Apps change their settings and add new features, so privacy is not something you set once. A good habit is a privacy check-up every few months, and whenever an app has a big update.",
              "Remember the limits. Privacy settings control what other users see, not what the company collects. And even a private account cannot stop a follower from screenshotting a post. Settings are a strong first line of defence, and your own judgement is the second.",
            ],
          },
        ],
        words: [
          { word: "personal data", meaning: "any information relating to an identifiable living person" },
          { word: "special category data", meaning: "especially sensitive personal data, such as health, religion or biometric data, which needs extra protection" },
          { word: "UK GDPR", meaning: "the main UK law, alongside the Data Protection Act 2018, setting out how personal data must be handled" },
          { word: "subject access request", meaning: "a request to an organisation for a copy of the personal data it holds about you" },
          { word: "app permissions", meaning: "the parts of a device, such as camera, microphone or location, that an app is allowed to access" },
          { word: "ICO", meaning: "the Information Commissioner's Office, the UK body that enforces data protection law" },
        ],
      },
      practice: {
        intro: "Apply what you know about personal data, your rights and sensible settings.",
        questions: [
          { type: "pick", q: "Which of these are personal data? There is more than one.", options: ["Your email address", "The capital city of France", "Your location history", "A photo of your face", "The rules of football"], answers: [0, 2, 3] },
          {
            type: "match",
            q: "Match each right to what it lets you do.",
            pairs: [
              ["Right of access", "Get a copy of the data held about you"],
              ["Right to rectification", "Have wrong data corrected"],
              ["Right to erasure", "Ask for your data to be deleted"],
              ["Right to be informed", "Be told how your data will be used"],
            ],
          },
          { type: "choice", q: "A drawing app asks for permission to see your contacts and your location 'always'. What is the best response?", options: ["Allow both, since apps need everything", "Deny both, because a drawing app does not need them to work", "Allow both and delete the app later"], answer: 1, why: "Permissions should make sense for what the app does. A drawing app has no clear need for contacts or constant location." },
          { type: "choice", q: "Which best explains the 'jigsaw effect'?", options: ["Separate harmless details can be combined to identify and locate someone", "Apps break your photos into pieces", "Websites load in small parts"], answer: 0 },
          { type: "gap", q: "Fill in the gaps.", text: "In the UK, the ___ enforces data protection law. Ofcom regulates platforms under the Online ___ Act 2023.", bank: ["ICO", "Safety", "BBC", "Privacy", "NHS"], answers: ["ICO", "Safety"] },
        ],
      },
      task: {
        title: "Privacy check-up",
        intro: "Carry out a full privacy check-up on one app or game you use, and write a short guide so a younger friend or relative could do the same. If you do not use any apps, use a grown-up's phone settings menu together, or a family device. Do this with your grown-up's permission and ideally side by side.",
        need: ["A phone, tablet or computer with an app or game you use", "A grown-up nearby", "Paper or a document"],
        steps: [
          "Choose one app or game. Open its settings and find the privacy and security sections.",
          "Record the current setting for each of these: account public or private; who can message you; who can see your friends or followers list; location sharing; whether your profile appears in search engines.",
          "Open your device's settings and look at the permissions this app has: camera, microphone, contacts, photos, location. For each one, write whether it is needed for the app to work.",
          "Decide on the best setting for each item and explain why in one sentence. Change any settings you and your grown-up agree on.",
          "Write a step-by-step guide of 6 to 8 steps called 'How to do a privacy check-up', with a short reason for each step. Use at least three key words from this lesson.",
          "Set a reminder on a calendar for a check-up in three months' time.",
        ],
      },
      exit: [
        { type: "choice", q: "Which of these is an example of special category data?", options: ["Your favourite film", "Information about your health", "The name of a band you like"], answer: 1 },
        { type: "type", q: "What is the name of the request you can make to get a copy of the data an organisation holds about you? (subject ... request)", answer: ["access", "subject access request", "subject access", "a subject access request"] },
        { type: "choice", q: "Which UK body enforces data protection law?", options: ["The Information Commissioner's Office (ICO)", "The Met Office", "The Bank of England"], answer: 0 },
        { type: "choice", q: "A torch app asks for access to your contacts. What is the most sensible decision?", options: ["Allow it, because all apps need contacts", "Deny it, because a torch has no need for your contacts", "Allow it but only on weekends"], answer: 1 },
        { type: "pick", q: "Which are sensible privacy settings for most teenagers? There is more than one.", options: ["A private account", "Location sharing off, or family only", "Messages from anyone in the world", "Profile hidden from search engines"], answers: [0, 1, 3] },
        { type: "choice", q: "Why is a private account not a complete guarantee of privacy?", options: ["Private accounts are visible to everyone", "Approved followers can still screenshot and share posts", "Private accounts are illegal for under-16s"], answer: 1 },
      ],
      grownUp: {
        need: ["A device with an app, game or settings menu to explore together"],
        tips: [
          "Sitting side by side for the check-up works far better than inspecting their phone. Let them drive; you ask questions such as 'Why does it need that?'",
          "The digital age of consent in the UK is 13, which is why many apps set 13 as a minimum. Some apps set 16 or higher in their own terms. It is worth checking the terms for the apps your family uses.",
          "If they do not yet use apps, the task works just as well on a family tablet, a smart speaker app or your own phone's settings.",
        ],
        younger: "Focus on two settings only, public or private and location, and on the question 'Does this app need this?' for each permission.",
        older: "Read the ICO's summary of the Age Appropriate Design Code (the Children's Code) and evaluate one app against three of its standards, giving evidence for each judgement.",
      },
    },
    // ---------------------------------------------------------------- 3
    {
      slug: "digital-footprint-3",
      title: "Strong passwords, passphrases and two-factor authentication",
      emoji: "🗝️",
      minutes: 60,
      goal: "I can explain how passwords are attacked, create a strong passphrase, and describe how two-factor authentication protects an account.",
      starter: [
        { type: "choice", q: "What is personal data?", options: ["Any information relating to an identifiable living person", "Only your name", "Data stored on paper"], answer: 0 },
        { type: "pick", q: "Which rights does UK data protection law give you? There is more than one.", options: ["To get a copy of data held about you", "To have wrong data corrected", "To read anyone else's messages", "To ask for data to be erased in many cases"], answers: [0, 1, 3] },
        { type: "type", q: "What are the initials of the UK body that enforces data protection law?", answer: ["ICO", "ico", "the ICO"] },
        { type: "choice", q: "A game asks to use your microphone, but it has no voice chat. What should you think?", options: ["It must need it to run", "Question it: the permission may not be needed", "Microphones are never used by apps"], answer: 1 },
        { type: "choice", q: "What is the 'jigsaw effect'?", options: ["Small details combining to reveal who and where someone is", "A puzzle game", "A virus that splits files"], answer: 0 },
        { type: "choice", q: "Which regulator oversees online platforms under the Online Safety Act 2023?", options: ["Ofsted", "Ofcom", "Ofgem"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "How passwords get cracked",
            picture: "/lessons/digital-footprint/lesson-3-1.jpg",
            alt: "A robot arm trying a huge ring of keys on a lock",
            text: [
              "Authentication means proving you are who you say you are. A password is the most common way, and it protects everything from your games to your email. Your email is especially important, because it is usually where 'reset your password' links are sent: whoever controls your email can often get into everything else.",
              "Attackers rarely sit and guess passwords one at a time by hand. A brute-force attack uses software to try every possible combination. A dictionary attack tries common words, names and well-known passwords such as 'password1' and '123456', along with common tweaks like swapping 'a' for '@'.",
              "The biggest risk is often credential stuffing. When a website is hacked, lists of email addresses and passwords can leak. Attackers then try those same details on lots of other sites. If you reuse one password everywhere, one leak can unlock many accounts.",
              "Well-run websites do not store your actual password. They store a hash, a scrambled version made by a one-way mathematical function. When you log in, the site hashes what you type and compares the results. This makes leaks less damaging, but weak and common passwords can still be worked out from their hashes.",
            ],
          },
          {
            heading: "Length beats complexity: passphrases",
            picture: "/lessons/digital-footprint/lesson-3-2.jpg",
            alt: "A lantern, a pebble and a planet linked by a glowing chain, like a three-word passphrase",
            text: [
              "Each extra character multiplies the number of possible passwords, so length matters more than anything else. A password of 8 characters using lowercase letters has 26 to the power of 8 possible combinations, about 209 billion, which modern software can try very quickly. Make it 16 lowercase letters and the number becomes so large that brute force is impractical.",
              "The UK's National Cyber Security Centre (NCSC) recommends the 'three random words' method. Pick three words that are random and not connected to you, and put them together, for example 'lanternpebbleorbit'. This is a passphrase: long, so it is hard to crack, but memorable, so you do not need to write it on a sticky note.",
              "Avoid anything an attacker could find in your digital footprint: your pet's name, your football team, your birthday or your street. These are exactly the details in a dictionary attack aimed at you. If a site insists on numbers or symbols, you can add them, but the length is doing most of the work.",
              "Use a different password for every important account, starting with your email. A password manager, an app that stores all your passwords securely behind one strong master password, makes this realistic. Most browsers have one built in. Talk to your grown-up before setting one up.",
            ],
          },
          {
            heading: "Two-factor authentication",
            picture: "/lessons/digital-footprint/lesson-3-3.jpg",
            alt: "A teenager using a phone as a second step to unlock a laptop",
            text: [
              "Authentication factors come in three types: something you know (a password or PIN), something you have (your phone or a security key) and something you are (a fingerprint or face). Two-factor authentication, often shortened to 2FA, asks for two different types.",
              "A common example: you type your password, and then the site asks for a six-digit code from a text message or an authenticator app on your phone. Even if an attacker has stolen your password, they cannot get in without your phone as well.",
              "Authenticator apps are generally safer than text-message codes, because text messages can sometimes be redirected by criminals. But any 2FA is much better than none. The NCSC advises switching it on for important accounts, especially email.",
              "One rule matters above all: a real company will never ask you to read out or send them a 2FA code. If anyone messages asking for 'the code we just sent you', even someone who seems to be a friend, it is almost certainly an attempt to break into your account. Keep the code to yourself.",
            ],
          },
        ],
        words: [
          { word: "authentication", meaning: "proving you are who you claim to be, for example with a password" },
          { word: "brute-force attack", meaning: "using software to try every possible combination until a password is found" },
          { word: "credential stuffing", meaning: "trying leaked usernames and passwords from one site on many other sites" },
          { word: "passphrase", meaning: "a long password made from several words, such as three random words" },
          { word: "two-factor authentication (2FA)", meaning: "logging in with two different types of proof, such as a password and a code from your phone" },
          { word: "password manager", meaning: "an app that securely stores and fills in different passwords for each account" },
        ],
      },
      practice: {
        intro: "Think like a security expert: judge passwords and explain the defences.",
        questions: [
          { type: "order", q: "Put these passwords in order from weakest to strongest.", items: ["password1", "Fluffy2012", "lanternpebbleorbitcanyon"] },
          {
            type: "match",
            q: "Match each attack to its description.",
            pairs: [
              ["Brute force", "Trying every possible combination"],
              ["Dictionary attack", "Trying common words and well-known passwords"],
              ["Credential stuffing", "Using leaked details from one site on others"],
            ],
          },
          { type: "choice", q: "Why is reusing the same password on many sites risky?", options: ["Websites charge more for repeated passwords", "If one site leaks it, attackers can use it to get into your other accounts", "It makes the password shorter"], answer: 1, why: "This is credential stuffing: one leak can unlock every account that shares the password." },
          { type: "pick", q: "Which pairs are genuine TWO-factor authentication, using two different types of factor? There is more than one.", options: ["Password and a code from an authenticator app", "Password and a second password", "PIN and a fingerprint", "Password and a security question"], answers: [0, 2], why: "A second password or a security question is just another 'something you know', so it is not a second type of factor." },
          { type: "type", q: "A password made from 8 lowercase letters has 26 to the power of 8 possible combinations. If you add one more lowercase letter, by how many times does the number of combinations multiply?", answer: ["26", "twenty-six", "twenty six"], after: "times" },
        ],
      },
      task: {
        title: "Password strength investigation",
        intro: "Use maths to investigate why length beats complexity, then design a password plan. Never type a real password into any website or checker for this task. You can do all of it on paper or with a calculator; a free spreadsheet such as Google Sheets in a browser is optional, used with a grown-up's permission.",
        need: ["A calculator, or a free browser spreadsheet", "Paper and a pen"],
        steps: [
          "Make a table with columns: Character set, Set size, Length, Combinations. Use these set sizes: digits only = 10; lowercase letters = 26; upper and lowercase = 52; upper, lower and digits = 62; all keyboard characters = about 95.",
          "Work out the number of combinations (set size to the power of length) for: a 4-digit PIN; 8 lowercase letters; 8 characters from all 95; 16 lowercase letters; 20 lowercase letters.",
          "Suppose an attacker's software tries 10 billion guesses a second. Divide each number of combinations by 10,000,000,000 to find the maximum seconds to crack it. Convert the large answers to years (there are about 31.5 million seconds in a year).",
          "Write a conclusion: which made the bigger difference, adding symbols or adding length? Use your figures as evidence.",
          "Explain in a paragraph why real attacks are often faster than your figures suggest, using the words dictionary attack and credential stuffing.",
          "Make a personal password plan without writing any real passwords: which accounts you will give unique passphrases, where you will switch on 2FA, and whether you will use a password manager, agreed with your grown-up.",
        ],
      },
      exit: [
        { type: "choice", q: "What does the NCSC's 'three random words' advice help you create?", options: ["A short PIN", "A long, memorable passphrase", "A username"], answer: 1 },
        { type: "choice", q: "Which is the strongest password?", options: ["Max2011!", "password123", "violincactusharbour"], answer: 2 },
        { type: "type", q: "What does 2FA stand for? (two-factor ...)", answer: ["authentication", "two-factor authentication", "two factor authentication"] },
        { type: "choice", q: "Someone messages you: 'I sent you a code by mistake, can you send it to me?' What is this most likely to be?", options: ["A genuine mistake you should help with", "An attempt to get your 2FA code and take over your account", "A competition entry"], answer: 1 },
        { type: "choice", q: "Why is your email account especially important to protect?", options: ["It is the most expensive account", "Password reset links are usually sent there, so it can unlock other accounts", "Emails can't be hacked"], answer: 1 },
        { type: "pick", q: "Which should you avoid using in a password? There is more than one.", options: ["Your pet's name", "Your birthday", "Three unrelated random words", "Your football team"], answers: [0, 1, 3] },
      ],
      grownUp: {
        need: ["A calculator (a phone calculator is fine)", "Optional: a free browser spreadsheet"],
        tips: [
          "Make clear that they should never type a real password into a 'password strength checker' website. The maths task makes the point without any risk.",
          "Large numbers will appear. A calculator shows them in standard form, for example 2.09E11 meaning 2.09 × 10¹¹, which is good GCSE preparation.",
          "This is a natural moment to agree as a family whether to use a password manager and to switch on 2FA for email accounts.",
        ],
        younger: "Do only the first two rows of the calculation (a 4-digit PIN and 8 lowercase letters) and compare them. Then practise inventing three-random-word passphrases that are not real passwords.",
        older: "Research entropy, measured in bits, as a way of describing password strength. Calculate the entropy of a three-random-word passphrase chosen from a list of 7,776 words (log base 2 of 7,776 is about 12.9 bits per word) and compare it with an 8-character password from 95 symbols.",
      },
    },
    // ---------------------------------------------------------------- 4
    {
      slug: "digital-footprint-4",
      title: "Phishing and scams",
      emoji: "🎣",
      minutes: 60,
      goal: "I can recognise the signs of phishing and common scams, explain the social engineering tricks they use, and know how to report them.",
      starter: [
        { type: "choice", q: "What is a passphrase?", options: ["A secret handshake", "A one-letter password", "A long password made of several words"], answer: 2 },
        { type: "choice", q: "What is credential stuffing?", options: ["Trying leaked passwords from one site on other sites", "Filling a form with fake data", "Storing passwords in a notebook"], answer: 0 },
        { type: "pick", q: "Which of these are authentication factors of different types? There is more than one.", options: ["Something you know, like a password", "Something you have, like your phone", "Something you are, like a fingerprint", "Something you want, like a new game"], answers: [0, 1, 2] },
        { type: "choice", q: "Should you ever share a 2FA code with someone who messages you for it?", options: ["Yes, if they seem friendly", "No, real companies never ask for it", "Only if they ask twice"], answer: 1 },
        { type: "type", q: "What kind of app stores your passwords securely behind one master password? (a password ...)", answer: ["manager", "password manager", "a password manager"] },
        { type: "choice", q: "Why does length matter so much for password strength?", options: ["Each extra character multiplies the number of possible combinations", "Long passwords look neater", "Short passwords are against the law"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Phishing and social engineering",
            picture: "/lessons/digital-footprint/lesson-4-1.jpg",
            alt: "A fishing hook baited with an envelope and a gift dangling over devices",
            text: [
              "Phishing is a message that pretends to come from someone you trust, such as a bank, a delivery company, a streaming service, a game or a friend, in order to trick you into giving away information, clicking a harmful link or sending money. The name comes from 'fishing': the attacker casts out bait and waits for a bite.",
              "Phishing comes in many forms. By email it is simply called phishing; by text message it is smishing (from SMS); by phone call it is vishing (voice phishing). It also arrives through direct messages in games and social media, and through QR codes. Spear phishing is a message aimed at one particular person, using details from their digital footprint to seem convincing.",
              "Most scams work not by hacking computers but by hacking people. This is called social engineering: using psychology to make someone act without thinking. Scammers use a small set of levers again and again. Urgency ('Your account will be closed in 24 hours'). Fear ('Suspicious activity detected'). Reward ('You've won free in-game currency'). Authority ('This is the police'). And curiosity ('Is this you in this video?').",
              "Strong emotion is the clue. If a message makes you feel panicked, excited or scared and pushes you to act now, that is exactly when to slow down.",
            ],
          },
          {
            heading: "Spotting the signs",
            picture: "/lessons/digital-footprint/lesson-4-2.jpg",
            alt: "A teenager examining an email closely with a magnifying glass",
            text: [
              "Check the sender. A display name can say anything, so look at the actual email address or number. Scammers often use addresses that are close to the real thing, with an extra letter, a swapped character or an unusual ending.",
              "Check links before you click. On a computer, hovering over a link shows where it really goes. Look carefully at the domain name, the main part of the web address. In 'brand.example-login.net' the real domain is 'example-login.net', not 'brand'. When in doubt, do not click: go to the official website or app by typing it yourself.",
              "Look at what is being asked. Genuine organisations do not ask for your full password, PIN or 2FA code by message. Requests to pay with gift cards, to move a conversation to another app, or to keep something secret are strong warning signs. Generic greetings like 'Dear customer' and poor spelling can be clues, but many modern scams are well written, so do not rely on spelling alone.",
              "Scams aimed at young people often involve gaming and shopping: free skins or in-game currency, cheap tickets, 'too good to be true' trainers, fake giveaways from influencers, or a friend's hacked account asking for help. The rule of thumb holds: if it seems too good to be true, it probably is.",
            ],
          },
          {
            heading: "What to do: stop, check, report",
            picture: "/lessons/digital-footprint/lesson-4-3.jpg",
            alt: "A teenager pausing before acting on a message, with an adult beside them",
            text: [
              "If you are unsure about a message, stop and do not reply, click or download anything. Check by contacting the organisation or person in a different way you already trust, such as the official app or a phone number from their real website. If a friend's message seems odd, ask them in person or by another route.",
              "In the UK, you can report suspicious emails by forwarding them to report@phishing.gov.uk, which is run by the National Cyber Security Centre. Suspicious text messages can be forwarded free of charge to 7726, which spells SPAM on a phone keypad. Most apps and games have a 'report' button too.",
              "If you have already clicked, typed a password or sent money, do not panic and do not feel ashamed. Scams fool adults and experts every day. Tell a trusted adult straight away. Change the password on that account and any account using the same password, switch on 2FA, and, if money was involved, contact the bank. Acting quickly limits the damage.",
              "Some scams try to frighten people into paying by threatening to share private information or images. If anything like this ever happens, it is not your fault: do not pay, stop replying, keep the evidence and tell a trusted adult. Organisations such as Childline and CEOP, which you will meet in lesson 6, can help.",
            ],
          },
        ],
        words: [
          { word: "phishing", meaning: "a message pretending to be from someone trusted, designed to trick you into giving information, clicking a link or paying" },
          { word: "smishing", meaning: "phishing by text message (SMS)" },
          { word: "vishing", meaning: "phishing by phone call (voice phishing)" },
          { word: "social engineering", meaning: "using psychology, such as urgency or fear, to manipulate someone into acting without thinking" },
          { word: "spear phishing", meaning: "a phishing message targeted at one person, using details about them to seem believable" },
          { word: "domain name", meaning: "the main part of a web address that identifies the website, such as bbc.co.uk" },
        ],
      },
      practice: {
        intro: "Investigate the evidence like a fraud analyst.",
        questions: [
          {
            type: "match",
            q: "Match each message to the social engineering lever it uses.",
            pairs: [
              ["Act within 1 hour or lose your account!", "Urgency"],
              ["You've been chosen for 10,000 free coins!", "Reward"],
              ["This is the police. Pay this fine now.", "Authority"],
              ["Haha is this you in this video??", "Curiosity"],
            ],
          },
          { type: "pick", q: "An email claims to be from your bank. Which features are warning signs? There is more than one.", options: ["It says 'Dear customer'", "It asks you to reply with your PIN", "It comes from an address ending in a strange domain", "It tells you to use the bank's official app if you have questions"], answers: [0, 1, 2] },
          { type: "choice", q: "A link says 'Log in to GameZone' but hovering shows it goes to gamezone.account-verify.co. What is the real domain?", options: ["gamezone", "account-verify.co", "Log in to GameZone"], answer: 1, why: "The domain is read from the right-hand end of the address; 'gamezone' here is just a label added in front." },
          { type: "choice", q: "Which best explains why scammers create a sense of urgency?", options: ["To be polite", "So people act quickly without stopping to think or check", "Because the law requires deadlines"], answer: 1 },
          { type: "gap", q: "Fill in the gaps.", text: "In the UK you can forward suspicious emails to report@phishing.gov.uk and suspicious texts to ___, which spells SPAM. Phishing by text is called ___.", bank: ["7726", "999", "smishing", "vishing", "spamming"], answers: ["7726", "smishing"] },
        ],
      },
      task: {
        title: "Annotated phishing case study",
        intro: "Create a realistic but entirely fictional phishing message, then annotate it to teach others how to spot it. Work on paper, or in a free browser tool such as Google Docs or Canva with a grown-up's permission. Use made-up company names, not real brands, and never send your message to anyone.",
        need: ["Paper and coloured pens, or a free browser-based document tool", "Your notes from this lesson"],
        steps: [
          "Choose a type: a phishing email, a smishing text, or a game direct message. Invent a fictional company or game, for example 'BrightBox Deliveries' or 'Starfall Arena'.",
          "Write or draw the message so it looks convincing. Include at least five warning signs, such as a suspicious sender address, a disguised link, urgency, a request for a code or password, and a 'too good to be true' offer.",
          "Annotate each warning sign with an arrow and a label. For each, name the trick and explain in a sentence why it works on people, using the term social engineering at least once.",
          "Add a 'What should you do?' box with three clear steps: stop, check another way, and report (include 7726 or report@phishing.gov.uk).",
          "Write a short reflection of about 100 words: which sign do you think is hardest to spot, and why are well-written scams more dangerous than badly written ones?",
        ],
      },
      exit: [
        { type: "choice", q: "What is smishing?", options: ["Phishing by text message", "Phishing by phone call", "A type of strong password"], answer: 0 },
        { type: "choice", q: "What is social engineering?", options: ["Building computers for social media", "Manipulating people psychologically so they act without thinking", "Designing a social network"], answer: 1 },
        { type: "pick", q: "Which requests by message are strong warning signs of a scam? There is more than one.", options: ["Asking for your 2FA code", "Asking you to pay with gift cards", "Asking you to keep it secret", "Reminding you to use the official app"], answers: [0, 1, 2] },
        { type: "type", q: "Which number can you forward suspicious text messages to in the UK?", answer: ["7726"] },
        { type: "choice", q: "You clicked a phishing link and typed your password. What should you do first?", options: ["Hide it and hope nothing happens", "Tell a trusted adult and change the password on that account and any using the same password", "Delete the app and never mention it"], answer: 1 },
        { type: "choice", q: "Why is spelling not a reliable way to spot every scam?", options: ["Many modern scams are well written", "Scams are always perfectly spelled", "Real companies always make spelling mistakes"], answer: 0 },
      ],
      grownUp: {
        need: ["Paper and coloured pens, or a free browser document tool"],
        tips: [
          "Share a scam message you have received yourself, if you have one. Hearing that adults are targeted too removes shame and makes reporting more likely.",
          "Card 3 briefly and calmly mentions threats to share private images (sometimes called sextortion). It is deliberately not detailed. If it prompts questions, keep the key message simple: it is never the young person's fault, do not pay, and tell a trusted adult. The Internet Watch Foundation and Childline run a service called Report Remove for young people under 18 to get nude images of themselves removed from the internet.",
          "Check that their fictional message really does use made-up names, so that it could never be mistaken for a real company's communication.",
        ],
        younger: "Give them a short list of five warning signs to include, and let them annotate a message you write together.",
        older: "Research a well-known real cyber attack that began with phishing and explain, in about 300 words, how social engineering was used and what defences could have stopped it.",
      },
    },
    // ---------------------------------------------------------------- 5
    {
      slug: "digital-footprint-5",
      title: "Misinformation and checking sources",
      emoji: "🔎",
      minutes: 60,
      goal: "I can explain the difference between misinformation and disinformation, describe why false information spreads, and use lateral reading to check a source.",
      starter: [
        { type: "choice", q: "What is phishing?", options: ["A trick message pretending to be from someone trusted", "A type of strong password", "A way of backing up files"], answer: 0 },
        { type: "pick", q: "Which are social engineering levers scammers use? There is more than one.", options: ["Urgency", "Fear", "Reward", "Patience"], answers: [0, 1, 2] },
        { type: "choice", q: "A link reads 'shop.example-deals.biz/login'. What is the real domain?", options: ["shop", "example-deals.biz", "login"], answer: 1 },
        { type: "type", q: "What is phishing by phone call called?", answer: ["vishing", "voice phishing"] },
        { type: "choice", q: "If you are unsure whether a message is genuine, what is the best way to check?", options: ["Reply and ask if it's real", "Contact the organisation another way you already trust", "Click the link to see"], answer: 1 },
        { type: "choice", q: "Where can you forward suspicious emails in the UK?", options: ["report@phishing.gov.uk", "help@internet.com", "Nowhere"], answer: 0 },
      ],
      learn: {
        cards: [
          {
            heading: "Mis-, dis- and malinformation",
            picture: "/lessons/digital-footprint/lesson-5-1.jpg",
            alt: "Three speech bubbles standing for misinformation, disinformation and malinformation",
            text: [
              "Not all false or misleading information is the same, and the differences matter. Misinformation is false or misleading information shared by people who believe it is true. A relative forwarding an inaccurate health tip because they want to help is spreading misinformation.",
              "Disinformation is false information created or shared deliberately to deceive, for example to make money, to damage someone's reputation or to influence how people vote. Malinformation is information that may be true but is shared to cause harm, such as leaking someone's private messages or presenting an old event as if it happened today.",
              "Misleading content takes many forms: a fabricated story; a real photo with a false caption; a quote taken out of context; a misleading graph with a stretched axis; a satire article that people mistake for real news; and manipulated or AI-generated images, audio and video, sometimes called deepfakes.",
              "Thinking about intent helps you respond well. Someone who shared misinformation by mistake is best corrected kindly and privately. Disinformation campaigns are best reported to the platform rather than argued with, because replying can boost them.",
            ],
          },
          {
            heading: "Why false information spreads",
            picture: "/lessons/digital-footprint/lesson-5-2.jpg",
            alt: "A single post multiplying and spreading across a network",
            text: [
              "Studies of social media have found that false news can spread faster and further than accurate news. One reason is that false stories are often more surprising and emotional, and people like sharing things that are new and shocking. Content that makes us angry or afraid gets more reactions, comments and shares.",
              "Recommendation algorithms play a part. Many platforms choose what to show you based on engagement: how likely you are to watch, like, comment or share. This can reward sensational content, true or not. Over time, an algorithm can also create a filter bubble, in which you mostly see content that matches what you already like and believe.",
              "Our own brains contribute too. Confirmation bias is the tendency to accept information that fits what we already think and to doubt information that does not. It affects everyone, including clever and well-informed people. Knowing it exists is the first step to catching it.",
              "Finally, sharing is quick and checking is slow. A false claim can be shared millions of times before a fact-check is published. That is why your few seconds of thought before sharing actually matter.",
            ],
          },
          {
            heading: "Checking sources: SIFT and lateral reading",
            picture: "/lessons/digital-footprint/lesson-5-3.jpg",
            alt: "A teenager comparing several sources side by side on a laptop",
            text: [
              "Professional fact-checkers do not just stare hard at a website to decide whether it looks trustworthy, because a fake site can look very professional. Instead they use lateral reading: they open new tabs and find out what other, independent sources say about the website, the author and the claim.",
              "A simple method called SIFT, developed by the digital literacy researcher Mike Caulfield, gives four moves. Stop: notice your emotional reaction and pause before sharing. Investigate the source: who is behind it, and what is their purpose or expertise? Find better coverage: do trusted news organisations or experts report the same thing? Trace claims, quotes and media to the original context: where did this photo or quote first appear?",
              "Useful tools include a reverse image search, which finds where else a picture has appeared online and often reveals that a 'breaking news' photo is years old, and fact-checking organisations such as Full Fact in the UK and BBC Verify. Primary sources, such as official statistics or the original scientific paper, are stronger evidence than a post about them.",
              "Checking is not about trusting nothing. It is about calibrating your trust: giving more weight to sources with expertise, transparency and a record of correcting their mistakes, and less to anonymous accounts with a reason to mislead.",
            ],
          },
        ],
        words: [
          { word: "misinformation", meaning: "false or misleading information shared by someone who believes it is true" },
          { word: "disinformation", meaning: "false information created or shared deliberately to deceive" },
          { word: "deepfake", meaning: "an image, video or audio clip manipulated or generated by AI to show something that did not happen" },
          { word: "filter bubble", meaning: "a situation where algorithms mostly show you content that matches your existing views and interests" },
          { word: "confirmation bias", meaning: "the tendency to favour information that supports what you already believe" },
          { word: "lateral reading", meaning: "checking a source by leaving it and seeing what other independent sources say about it" },
        ],
      },
      practice: {
        intro: "Apply the vocabulary and the SIFT method to some realistic cases.",
        questions: [
          {
            type: "match",
            q: "Match each example to the right term.",
            pairs: [
              ["Your aunt shares a wrong health tip, believing it's true", "Misinformation"],
              ["A website invents a story to earn money from adverts", "Disinformation"],
              ["Someone leaks a classmate's real private messages to embarrass them", "Malinformation"],
            ],
          },
          { type: "order", q: "Put the four SIFT moves in order.", items: ["Stop", "Investigate the source", "Find better coverage", "Trace claims to the original context"] },
          { type: "choice", q: "A dramatic 'flood today' photo is going viral. Which check would most quickly show whether it is really from today?", options: ["Counting the likes", "A reverse image search to see where it first appeared", "Reading the comments"], answer: 1, why: "A reverse image search often reveals that a photo is old or from a different place." },
          { type: "choice", q: "Which best explains why lateral reading is more reliable than examining a website closely?", options: ["Fake sites can look very professional, so independent sources give better evidence about them", "Lateral reading is quicker to type", "Websites never tell the truth about themselves"], answer: 0 },
          { type: "pick", q: "Which features make a source more trustworthy? There is more than one.", options: ["It names its authors and their expertise", "It corrects mistakes openly", "It uses lots of capital letters and exclamation marks", "Other independent, reputable sources report the same facts"], answers: [0, 1, 3] },
        ],
      },
      task: {
        title: "Fact-check investigation",
        intro: "Become a fact-checker. Choose a claim, investigate it with lateral reading and SIFT, and write a verdict backed by evidence. This uses the internet, so ask a grown-up's permission first and work where they can see. Free tools: any search engine, a reverse image search (built into most search engines) and the Full Fact website.",
        need: ["A device with internet access, used with a grown-up's permission", "Paper or a document for notes"],
        steps: [
          "Choose a claim to check. It could be a 'did you know?' fact you have seen online, a viral photo, or a claim from the Full Fact website that you investigate yourself before reading their verdict. Avoid upsetting topics; something about animals, science, food or sport works well.",
          "Stop: write down the claim exactly, and note your first emotional reaction and whether you want it to be true.",
          "Investigate the source: who first posted it? Open new tabs and find out what others say about that person or organisation.",
          "Find better coverage: search for the claim and record at least three independent sources. For each, write who published it and whether it supports or contradicts the claim.",
          "Trace: if there is a photo, run a reverse image search; if there is a statistic or quote, try to find the original source.",
          "Write a verdict of 200 to 300 words: True, False, Misleading or Unproven. Explain your reasoning, cite your sources, and say how confident you are and why.",
        ],
      },
      exit: [
        { type: "choice", q: "What is the difference between misinformation and disinformation?", options: ["There is no difference", "Misinformation is shared by mistake; disinformation is deliberately deceptive", "Disinformation is always true"], answer: 1 },
        { type: "type", q: "What is the name for the tendency to favour information that fits what you already believe? (confirmation ...)", answer: ["bias", "confirmation bias"] },
        { type: "choice", q: "What is lateral reading?", options: ["Reading a page from left to right", "Leaving a source to check what other independent sources say about it", "Reading only the headline"], answer: 1 },
        { type: "choice", q: "Which best explains how recommendation algorithms can help false information spread?", options: ["They show content based on engagement, which can reward shocking or emotional posts", "They always remove false posts", "They show posts in random order"], answer: 0 },
        { type: "pick", q: "Which are part of the SIFT method? There is more than one.", options: ["Stop", "Share quickly", "Find better coverage", "Trace claims to the original context"], answers: [0, 2, 3] },
        { type: "choice", q: "What is a filter bubble?", options: ["A tool for cleaning screens", "When algorithms mostly show you content matching your existing views", "A type of deepfake"], answer: 1 },
      ],
      grownUp: {
        need: ["A device with internet access for the investigation"],
        tips: [
          "Steer the choice of claim towards calm topics (animals, food, science, sport). The method is what matters, not the topic.",
          "Model the habit yourself: say out loud when you check something before sharing it in a family chat.",
          "The finding that false news spreads faster than true news comes from a well-known 2018 study of Twitter by researchers at MIT. It is a good example of a primary source if they want to trace the claim themselves.",
        ],
        younger: "Use one claim you have chosen in advance and work through only Stop and Find better coverage, comparing two reputable sources.",
        older: "Compare how two different news organisations report the same story. Analyse word choice, images and what is left out, and write about how framing can mislead even when every fact is accurate.",
      },
    },
    // ---------------------------------------------------------------- 6
    {
      slug: "digital-footprint-6",
      title: "Online wellbeing, screen time and getting help",
      emoji: "🌱",
      minutes: 60,
      goal: "I can reflect on how my online life affects my wellbeing, make a balanced plan for my screen use, and know where and how to get help.",
      starter: [
        { type: "choice", q: "What is disinformation?", options: ["False information shared deliberately to deceive", "True information shared by mistake", "A type of password"], answer: 0 },
        { type: "choice", q: "What does the 'S' in SIFT stand for?", options: ["Share", "Stop", "Search"], answer: 1 },
        { type: "type", q: "What kind of search can show where else a picture has appeared online? (a reverse ... search)", answer: ["image", "reverse image", "reverse image search", "picture"] },
        { type: "pick", q: "Which make a source more trustworthy? There is more than one.", options: ["Named authors with expertise", "Openly correcting mistakes", "Anonymous with no sources", "Confirmed by independent reputable sources"], answers: [0, 1, 3] },
        { type: "choice", q: "What is confirmation bias?", options: ["Checking every fact twice", "A bug in an app", "Favouring information that fits what you already believe"], answer: 2 },
        { type: "choice", q: "What is a deepfake?", options: ["A very long video", "AI-made or manipulated media showing something that did not happen", "A secure password"], answer: 1 },
      ],
      learn: {
        cards: [
          {
            heading: "Online life and wellbeing",
            picture: "/lessons/digital-footprint/lesson-6-1.jpg",
            alt: "A teenager between a bright video call with friends and a dim endless scroll",
            text: [
              "Being online brings real benefits for wellbeing: keeping in touch with friends and family, finding people who share your interests, learning new skills, creating things and finding support. For many young people, online spaces are where they feel most understood.",
              "There can also be downsides, and they are often subtle. Social comparison is one: feeds show other people's highlights, often edited or filtered, and comparing your everyday life with someone else's best moments can leave you feeling worse. Remember that what you see is a selection, not the whole picture.",
              "Many apps are designed to hold your attention. Features such as endless scroll, autoplay, streaks, notifications and likes use variable rewards, the same psychology that makes it hard to stop playing a slot machine, because you never know when something good will appear. This is called persuasive design. Feeling pulled back to your phone is not a personal weakness; it is partly what the design is for.",
              "Researchers disagree about how much screen time itself affects wellbeing, and the evidence suggests that what you do online, and what it replaces, matters more than the number of hours. An hour video-calling a friend is very different from an hour of scrolling that leaves you feeling flat.",
            ],
          },
          {
            heading: "Balance and healthy habits",
            picture: "/lessons/digital-footprint/lesson-6-2.jpg",
            alt: "A phone charging in the kitchen at night while a teenager sleeps",
            text: [
              "The UK's Chief Medical Officers have not set a single 'right' number of hours for young people, because the evidence does not support one. Instead, their advice focuses on balance: making sure screens do not crowd out sleep, physical activity, time with family, schoolwork and face-to-face friendships.",
              "Sleep is the clearest case. Most young teenagers need around 9 hours of sleep a night. Using screens late at night can delay sleep, both because the content keeps your brain busy and because notifications interrupt rest. A common, effective habit is to keep phones out of the bedroom overnight, or at least switch on do-not-disturb, and to stop screen use some time before bed.",
              "A useful self-check is to notice how you feel. After using an app, do you feel connected, calm, inspired or informed? Or anxious, envious, tired or annoyed? Your feelings are data. You can mute, unfollow or hide accounts that regularly make you feel worse, and follow ones that make you feel better.",
              "Most phones have built-in tools that show your screen time and let you set limits for particular apps. Turning off non-essential notifications is one of the simplest changes with the biggest effect: you choose when to check, rather than your phone choosing for you.",
            ],
          },
          {
            heading: "Where to get help",
            picture: "/lessons/digital-footprint/lesson-6-3.jpg",
            alt: "A teenager talking with a trusted adult on a park bench",
            text: [
              "Most problems online can be sorted out, and asking for help is a sensible, grown-up thing to do. Start with a trusted adult: a parent or carer, a relative, a teacher or another adult you feel comfortable with. You will not be in trouble for telling someone about something that worried you.",
              "Childline is a free, confidential service for anyone in the UK under 19. You can call 0800 1111, which does not show up on phone bills, or chat online through the Childline website. You can talk to them about anything, big or small, including online worries, friendships, stress or feeling low. Their website also has message boards and tools for calming down.",
              "CEOP, which stands for Child Exploitation and Online Protection, is part of the National Crime Agency. Its job is to keep children safe from sexual abuse and grooming online. If someone online is making you feel uncomfortable, asking for images, or trying to meet up or pressure you, you can report it to CEOP using the CEOP Safety Centre on its website, and a specialist will look at it. Many apps and sites have a CEOP button too.",
              "Other routes include the report and block tools in every app; Report Harmful Content, run by the UK Safer Internet Centre, for harmful content that a platform has not removed; and, in an emergency where someone is in immediate danger, 999. If something serious happens, keep evidence such as screenshots, as long as they do not include sexual images of anyone under 18, and do not share it further. Whatever has happened, it is never too late to tell someone.",
            ],
          },
        ],
        words: [
          { word: "wellbeing", meaning: "feeling healthy, comfortable and able to cope, in both body and mind" },
          { word: "social comparison", meaning: "judging yourself against other people, often against the edited highlights they post online" },
          { word: "persuasive design", meaning: "app features, such as endless scroll and streaks, designed to keep you using them" },
          { word: "Childline", meaning: "a free, confidential UK helpline for under-19s: 0800 1111, or online chat" },
          { word: "CEOP", meaning: "Child Exploitation and Online Protection, part of the National Crime Agency; where you report sexual abuse or grooming online" },
        ],
      },
      practice: {
        intro: "Think about wellbeing and help in realistic situations.",
        questions: [
          {
            type: "match",
            q: "Match each feature to how it keeps people using an app.",
            pairs: [
              ["Endless scroll", "There is never a natural stopping point"],
              ["Autoplay", "The next video starts before you decide"],
              ["Streaks", "You worry about losing a run of days"],
              ["Notifications", "Your phone pulls you back in"],
            ],
          },
          { type: "choice", q: "Which statement best matches the evidence about screen time?", options: ["Any screen time is harmful", "What you do online and what it replaces matters more than the exact number of hours", "Screen time has no effect on anything"], answer: 1 },
          { type: "choice", q: "Someone you met in a game keeps asking you for photos and to move to a private app. Where is the most appropriate place to report this, as well as telling a trusted adult?", options: ["CEOP", "The game's leaderboard", "A comment on a video"], answer: 0, why: "CEOP deals with concerns about sexual abuse and grooming online, including pressure to share images or meet up." },
          { type: "type", q: "What is Childline's free phone number?", answer: ["0800 1111", "08001111"] },
          { type: "pick", q: "Which are healthy habits for online wellbeing? There is more than one.", options: ["Turning off non-essential notifications", "Keeping your phone out of the bedroom overnight", "Scrolling until you fall asleep", "Unfollowing accounts that regularly make you feel worse"], answers: [0, 1, 3] },
        ],
      },
      task: {
        title: "Screen-time study and wellbeing plan",
        intro: "Collect data on your own screen use, analyse it, and turn your findings into a balanced plan and a personal help card. You can use your device's built-in screen-time report, or simply keep a log on paper. A free browser spreadsheet such as Google Sheets is optional, with a grown-up's permission.",
        need: ["Your device's screen-time report, or a paper log of yesterday", "Paper, a ruler and coloured pens, or a free browser spreadsheet"],
        steps: [
          "Collect your data: for one recent day, list each activity you did on screens (for example messaging, video, gaming, homework, music) and the minutes spent on each. Estimate honestly if you have no report.",
          "Beside each activity, write how it usually leaves you feeling, using a scale from 1 (much worse) to 5 (much better).",
          "Draw a bar chart of minutes per activity, colouring each bar by its feelings score. Calculate your total, and the percentage of time spent on activities scored 4 or 5.",
          "Analyse: which activities give you the most benefit for the time? Which take time without making you feel better? Did screens push out anything such as sleep, exercise or seeing friends?",
          "Write a balanced plan with three realistic changes, for example turning off one app's notifications, a phone-free time before bed, or swapping some scrolling for a hobby. Say how you will know if each change is working.",
          "Make a small help card to keep: three trusted adults you could talk to, Childline 0800 1111 and its website, and a reminder that CEOP is where to report anyone making you feel uncomfortable or pressured online.",
        ],
      },
      exit: [
        { type: "type", q: "What is Childline's free phone number?", answer: ["0800 1111", "08001111"] },
        { type: "choice", q: "What is CEOP mainly for?", options: ["Reporting concerns about sexual abuse or grooming of children online", "Fixing broken phones", "Reporting spam emails"], answer: 0 },
        { type: "choice", q: "What is persuasive design?", options: ["Writing a persuasive essay", "A way of making apps load faster", "App features designed to keep you using them"], answer: 2 },
        { type: "choice", q: "Which best explains why social comparison online can make people feel worse?", options: ["Everyone online is unhappy", "Feeds show other people's edited highlights, which we compare with our everyday lives", "Phones make people sad by themselves"], answer: 1 },
        { type: "pick", q: "Which are good places to get help with a worry online? There is more than one.", options: ["A trusted adult", "Childline", "An anonymous stranger who messages you", "The app's report tools"], answers: [0, 1, 3] },
        { type: "choice", q: "What is the UK Chief Medical Officers' advice on screen time for young people?", options: ["Exactly two hours a day", "No single set limit; keep a balance so screens don't crowd out sleep, activity and family time", "No screens at all"], answer: 1 },
      ],
      grownUp: {
        need: ["Their device's screen-time report, if they have one", "Paper and coloured pens"],
        tips: [
          "Approach the screen-time data with curiosity, not judgement. If the conversation turns into a telling-off, they are less likely to be honest, now or when something goes wrong online.",
          "Childline (0800 1111, childline.org.uk) is free and confidential for anyone under 19 in the UK. CEOP's reporting page is on the CEOP website (ceop.police.uk). The NSPCC helpline is for adults who are worried about a child.",
          "If they ever do share a worry, the most helpful first response is calm thanks for telling you. Decisions about devices can come later.",
          "This lesson touches on mental health. If your learner seems persistently low or anxious, a conversation with your GP is a good next step; you don't have to wait for a crisis.",
        ],
        younger: "Skip the percentage calculation; draw the bar chart and choose one change. Help them fill in the help card.",
        older: "Research one persuasive design feature in depth (for example infinite scroll or variable rewards), explain the psychology behind it, and write a 400-word argument on whether platforms should be required to switch such features off by default for under-16s.",
      },
    },
  ],
};
