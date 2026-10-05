"""Little Roots: short, playful activities for 3 and 4 year olds, done by a grown-up with the child.
Written for Bright Roots.

The category is the area of learning. The areas loosely follow Realising the Ambition (Scotland) and
the EYFS: Talk, Early maths, Letters and sounds, Moving, Creating and The world around us. The words
are our own; only the headings are borrowed.
"""
from make_starters import _item

TALK = "Talk"
MATHS = "Early maths"
SOUNDS = "Letters and sounds"
MOVING = "Moving"
CREATING = "Creating"
WORLD = "The world around us"


def _little(slug, title, emoji, category, minutes, summary, materials, steps, talk, more, easier, safety):
    data = _item("little", slug, title, emoji, category, minutes, "easy", 3, None, summary, materials, steps, safety)
    data.update({"talk": talk, "more": more, "easier": easier})
    return data


LITTLE_ROOTS = [
    _little(
        "little-teddys-tea-party", "Teddy's tea party", "🍪", MATHS, 15,
        "Lay a tea party for the soft toys and share things out: one for you, one for you.",
        [("3", "soft toys"), ("3", "plastic cups or bowls"), ("3", "spoons"),
         ("a small tub of", "dry cereal pieces or crackers broken into bits"), ("1", "tea towel for a tablecloth")],
        ["Spread the tea towel on the floor and sit the toys round it. Let your child choose who is coming.",
         "Ask them to give each guest one cup, then one spoon each.",
         "Share out the snack: \"one for Teddy, one for Bunny, one for Duck\", then round again.",
         "Count each guest's pile together, touching each piece as you count.",
         "Make a mistake on purpose (\"Oh no, Duck has none!\") and let them fix it."],
        ["How many friends are at the party?",
         "Does everyone have a cup? How do you know?",
         "Who has more? Who has fewer? How can we make it fair?"],
        "A surprise guest arrives: \"Now there are 4 friends. Do we need more cups?\" Or count to 5 for each guest.",
        "Just lay the table together and say \"one each\" as you go. That's the whole skill.",
        "Stay with them while there's food out. No whole nuts, popcorn, whole grapes or hard sweets for under 5s. "
        "Check for allergies if anyone else joins in.",
    ),
    _little(
        "little-mystery-bag", "The mystery bag", "🎁", SOUNDS, 10,
        "Feel a hidden object, guess what it is, then hear the sound its name starts with.",
        [("1", "pillowcase or cloth bag"),
         ("5", "familiar things that start with a clear sound, e.g. a sock, spoon, teddy, cup and brush")],
        ["Without them looking, put the objects in the bag.",
         "Let them put a hand in, feel one thing and guess before pulling it out.",
         "When it comes out, say its name slowly and stretch the first sound: \"sssss-ock\".",
         "Ask them to say it with you, then put it in a line on the floor.",
         "At the end, point along the line and say each one together."],
        ["What can you feel? Is it soft or hard? Bumpy or smooth?",
         "What do you think it is?",
         "Listen: sssss-ock. What sound does sock start with?"],
        "Ask them to find something else in the room that starts with the same sound (\"s, s, sofa!\"). "
        "Or let them fill the bag for you to guess.",
        "Skip the sounds. Just feel, guess and name. Describing words count as learning too.",
        "Only use things bigger than a toilet roll tube is wide, so nothing can be swallowed. No coins, button "
        "batteries, magnets, balloons or anything sharp. Keep the bag out of reach afterwards and don't let them "
        "put it over their head.",
    ),
    _little(
        "little-animal-moves", "Animal moves", "🐱", MOVING, 15,
        "Hop like a frog, waddle like a penguin and freeze like a statue when the music stops.",
        [("", "a clear space indoors or outside"), ("", "music on a phone (optional)")],
        ["Clear a space together and check the floor. Bare feet are best on a slippy floor.",
         "Take turns choosing an animal and moving like it. Frog: crouch and jump forwards. Bear: walk on hands "
         "and feet. Flamingo: stand on one leg and count to 3. Snake: slither on your tummy. Penguin: feet "
         "together, tiny waddling steps.",
         "Play Freeze: move like an animal while the music plays or while you sing. When it stops, everyone "
         "freezes like a statue.",
         "Finish lying down as a sleepy cat, breathing slowly while you count to 5 together."],
        ["Can you be a big frog? Now a tiny frog?",
         "Which animal is fastest? Which is slowest?",
         "Can you be a flamingo for longer than me?"],
        "Make a little obstacle path: hop like a frog to the cushion, crawl like a bear under the table, waddle "
        "back. Or let them invent an animal and teach you its move.",
        "Just play Freeze with any wiggly dancing. Stopping on a signal is the skill.",
        "Move furniture with sharp corners out of the way, and keep away from stairs, fireplaces and open doors. "
        "Bare feet or grippy socks, not plain socks on hard floors. Under the table only if it's sturdy.",
    ),
]
