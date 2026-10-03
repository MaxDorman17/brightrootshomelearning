"""A ready-made sample week, so a new family's planner isn't empty on day one.

It puts one lesson in every slot of the family's timetable. When the family says which school year a child
is working at, the lessons are real Oak National Academy lessons: the first ones from the first unit of each
subject for that year. Where Oak has nothing (or can't be reached), a short lesson written here is used
instead. Every lesson is an ordinary lesson in the family's own list, so they can change it, move it or
delete it like anything else they plan.
"""
import asyncio
import json
import re
import time
from datetime import date, timedelta
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import require_parent
from database import get_db
from models import Lesson, PlannerEntry, User
from routers.moments import _clean_child_ids, _family_children
from routers.timetable import _get_config

router = APIRouter(prefix="/api/planner/starter-week", tags=["planner"])


def L(subject, title, description, steps, minutes=30):
    return {"subject": subject, "title": title, "description": description, "steps": steps, "minutes": minutes}


# Monday to Friday. These are also what a day gets when the timetable has nothing on it.
YOUNG_WEEK = [
    [
        L("Maths", "Number bonds to 10", "Find all the pairs of numbers that make 10.",
          ["Lay out 10 small objects, such as buttons or pasta.", "Split them into two piles and say the numbers: 7 and 3 make 10.",
           "Find every different pair and write them down.", "Play a quick game: one person says a number, the other says its partner."]),
        L("English", "Story time and talk", "Read a picture book together and talk about it.",
          ["Choose a picture book together.", "Before reading, look at the cover and guess what happens.",
           "Read it together, stopping to ask: what do you think happens next?", "Talk about a favourite part and why."], 20),
        L("Science", "Floating and sinking", "Test which things float and which sink.",
          ["Fill a washing-up bowl with water.", "Collect 8 small things: a cork, a spoon, a leaf, a coin, a toy...",
           "Guess first: will it float or sink?", "Test each one and sort them into two groups.", "Talk about what the floaters have in common."]),
    ],
    [
        L("Maths", "Shape hunt", "Find 2D and 3D shapes around the house.",
          ["Draw a circle, square, triangle and rectangle at the top of a page.", "Hunt around the house for things with each shape.",
           "Draw or tick what you find.", "Find a cube, a cylinder and a sphere too."]),
        L("English", "Write a postcard", "Write a short postcard to someone in the family.",
          ["Draw a picture on one side of a piece of card.", "On the other side, write who it's to.",
           "Write two or three sentences about something you did this week.", "Sign it and post it or hand-deliver it."], 25),
        L("Geography", "Map of my bedroom", "Draw a bird's-eye map of your bedroom.",
          ["Look down at a toy from above. That is a bird's-eye view.", "Draw the outline of your room.",
           "Add the bed, door, window and furniture as simple shapes.", "Make a key to show what each shape means."]),
    ],
    [
        L("Maths", "Counting in 2s, 5s and 10s", "Practise counting in steps with movement and songs.",
          ["Count in 2s while jumping on the spot.", "Count in 10s while clapping, up to 100.",
           "Count in 5s using the fingers on everyone's hands.", "Fill in a number line with the missing numbers."], 20),
        L("English", "Phonics and spelling game", "Practise sounds and spellings with a game.",
          ["Write some letter sounds or this week's spellings on cards.", "Spread them face down and turn two over at a time.",
           "Read or spell each one out loud.", "Keep the pairs you match."], 20),
        L("Art", "Draw your favourite animal", "Look closely and draw an animal, then add colour.",
          ["Find a picture of your favourite animal.", "Look at its shapes: is the body round, long or tall?",
           "Draw it lightly in pencil, starting with the big shapes.", "Add details and colour it in."]),
    ],
    [
        L("Maths", "Measure with hands and feet", "Measure things around the house using your own body.",
          ["Guess how many hand-spans long the table is.", "Measure it and check your guess.",
           "Measure the hallway in footsteps.", "Compare: whose hand or foot gives a bigger number, and why?"]),
        L("English", "Retell a story with puppets", "Use puppets or toys to retell a favourite story.",
          ["Choose a story you know well.", "Pick a toy or make a sock puppet for each character.",
           "Act out the beginning, middle and end.", "Change one thing and see how the story changes."]),
        L("PE", "Garden obstacle course", "Build a course and beat your own time.",
          ["Set up 5 stations: crawl, jump, balance, throw, run.", "Walk the course slowly first.",
           "Run it while someone times you.", "Try again and beat your time."]),
    ],
    [
        L("Maths", "Shop role-play with coins", "Set up a pretend shop and pay with real coins.",
          ["Price some toys or snacks between 1p and 20p.", "Take turns being the shopkeeper and the customer.",
           "Pay with coins and work out the change.", "Try buying two things at once."]),
        L("English", "Choose a new book", "Visit the library or bookshelf and start a new book.",
          ["Choose a new book to read.", "Read the first few pages together.",
           "Add it to your reading log.", "Say what you think will happen."], 20),
        L("Outdoor Learning", "Nature walk and bug hunt", "Walk, look closely and spot minibeasts.",
          ["Take a magnifying glass if you have one.", "Look under logs and leaves, then put them back gently.",
           "Count how many different minibeasts you find.", "Draw your favourite one when you get home."], 45),
    ],
]

TEEN_WEEK = [
    [
        L("Maths", "Fractions, decimals and percentages", "Convert between fractions, decimals and percentages.",
          ["Make a table with columns for fraction, decimal and percentage.", "Fill in common ones: 1/2, 1/4, 3/4, 1/5, 1/10, 1/3.",
           "Work out 15%, 40% and 75% of 60.", "Find three real examples, such as a sale price or a nutrition label."], 45),
        L("English", "Read and summarise a short story", "Read a short story and write a summary.",
          ["Choose a short story you haven't read before.", "Read it once for enjoyment, then again with a pencil.",
           "Write a 100-word summary of what happens.", "Write two sentences on what the writer wanted you to feel."], 45),
        L("Science", "Plant and animal cells", "Draw and label plant and animal cells and compare them.",
          ["Draw an animal cell and label the nucleus, cytoplasm, cell membrane and mitochondria.",
           "Draw a plant cell and add the cell wall, chloroplasts and vacuole.", "Make a table of what's the same and different.",
           "Explain why plant cells need chloroplasts."], 45),
        L("History", "Make a timeline", "Research a decade and make an illustrated timeline.",
          ["Choose a decade that interests you.", "Find eight key events from that time.",
           "Put them on a timeline with dates.", "Add a picture or a one-line explanation for each."], 45),
    ],
    [
        L("Maths", "Solving equations", "Solve one- and two-step linear equations.",
          ["Solve x + 7 = 15 and 3x = 21, and check each answer.", "Solve two-step equations like 2x + 5 = 17.",
           "Try equations with brackets, such as 3(x - 2) = 12.", "Write an equation for a real problem and solve it."], 45),
        L("English", "Write a persuasive letter", "Write a letter persuading someone to change something.",
          ["Choose something you'd like to change, at home or in your area.", "Plan three strong reasons with evidence.",
           "Write the letter using a rhetorical question, a fact and a call to action.", "Read it aloud and improve one paragraph."], 45),
        L("Science", "Friction experiment", "Test how surfaces change how far something slides.",
          ["Make a ramp from a board and some books.", "Slide a toy car down onto three different surfaces: carpet, wood, foil.",
           "Measure how far it travels each time, three times each.", "Draw a bar chart and explain the results."], 50),
        L("Geography", "World climate zones", "Map the world's climate zones and what they're like.",
          ["Find a map of climate zones online or in an atlas.", "Colour a blank world map to show them.",
           "Pick three zones and describe the weather in each.", "Explain how one zone affects how people live there."], 45),
    ],
    [
        L("Maths", "Area and perimeter", "Find the area and perimeter of compound shapes.",
          ["Draw an L-shaped room with measurements.", "Split it into rectangles and find the area.",
           "Work out the perimeter.", "Measure a real room or garden and do the same."], 45),
        L("English", "Analyse a poem", "Read a poem closely and write about how it works.",
          ["Read the poem twice, once aloud.", "Underline words or images that stand out.",
           "Write about the mood and how the poet creates it.", "Say which line you like most and why."], 40),
        L("Science", "Kitchen chemistry", "Spot the signs of a chemical reaction.",
          ["Mix bicarbonate of soda and vinegar in a cup and watch what happens.", "Record what you see, hear and feel.",
           "List the signs of a chemical reaction: gas, colour change, heat.", "Explain why this is a chemical change, not a physical one."], 40),
        L("PE", "Bodyweight circuit", "Six moves, three rounds, no equipment.",
          ["Warm up for 5 minutes.", "Do 40 seconds each: squats, press-ups, lunges, plank, star jumps, glute bridges.",
           "Rest for 2 minutes between rounds.", "Cool down and stretch, and write down your reps."], 30),
    ],
    [
        L("Maths", "Ratio and proportion", "Use ratio to scale a recipe up and down.",
          ["Find a recipe for 4 people.", "Rewrite it for 2 people and for 10 people.",
           "Write each ingredient ratio in its simplest form.", "Solve: if 3 pens cost £2.40, what do 7 cost?"], 45),
        L("English", "Describe a place", "Write a vivid description of a real or imagined place.",
          ["Choose a place: a busy market, a storm at sea, your street at night.", "List what you'd see, hear, smell, touch and taste.",
           "Write 300 words using similes and varied sentence lengths.", "Swap three ordinary words for stronger ones."], 45),
        L("Science", "Electric circuits", "Learn how series and parallel circuits work.",
          ["Draw the circuit symbols for a cell, bulb, switch and wire.", "Draw a series circuit and a parallel circuit.",
           "Explain what happens to the bulbs if one breaks in each.", "Find out what voltage and current measure."], 40),
        L("Life Skills", "Plan and cook a meal", "Plan a meal, check what you need and cook it.",
          ["Choose a simple main meal from the Teens cookbook.", "Check what's in the cupboard and write a shopping list.",
           "Cook it, following the recipe.", "Work out roughly what the meal cost per person."], 60),
    ],
    [
        L("Maths", "Survey and bar charts", "Collect data and present it clearly.",
          ["Write a survey question with four or five answers.", "Ask at least ten people and tally the answers.",
           "Draw a bar chart with labelled axes and a title.", "Write two things the chart shows."], 45),
        L("English", "Reading for pleasure and a review", "Read a book of your choice and review it.",
          ["Read for 30 minutes.", "Write a short review: what it's about without spoilers.",
           "Give it a star rating and say who would enjoy it.", "Add it to your reading log."], 45),
        L("Science", "Weekly science quiz", "Test yourself on this week's science.",
          ["Write ten questions on cells, friction, reactions and circuits.", "Answer them without notes.",
           "Mark them and look up anything you missed.", "Make a flashcard for each one you got wrong."], 30),
        L("Computing", "Make a simple game", "Build a small game in Scratch or Python.",
          ["Plan a simple game: a quiz, a catch game or a maze.", "Build the basic version that works.",
           "Add a score or a timer.", "Ask someone to test it and fix one thing they find."], 50),
    ],
]


# More starter lessons, so every subject on a family's timetable has something to put in its slot.
YOUNG_EXTRA = [
    L("Science", "Living or not living?", "Sort things into living, once living and never living.",
      ["Collect or draw 10 things: a leaf, a stone, a pet, a wooden spoon, a toy...", "Talk about what living things do: grow, eat, move, breathe.",
       "Sort them into living, once living and never living.", "Explain your trickiest choice."]),
    L("Science", "Shadow shapes", "Find out how shadows change.",
      ["On a sunny day, or with a torch, make a shadow with a toy.", "Move the light closer and further away. What happens?",
       "Draw round a shadow in chalk or pencil.", "Come back an hour later and draw it again."]),
    L("Science", "Magnet hunt", "Find out which things a magnet sticks to.",
      ["Find a fridge magnet.", "Guess which things around the house it will stick to.",
       "Test 10 things and make two piles: sticks and doesn't stick.", "What are the sticking things made of?"]),
    L("Science", "Melting race", "Find out what makes ice melt faster.",
      ["Put an ice cube on each of three plates.", "Leave one in a warm place, one in a cool place, and sprinkle salt on the third.",
       "Guess which will melt first.", "Check every five minutes and say what you notice."]),
    L("History", "My family timeline", "Put your own life in order on a timeline.",
      ["Find three or four photos of you at different ages.", "Put them in order from youngest to oldest.",
       "Stick or draw them on a long strip of paper.", "Add what you could do at each age."]),
    L("History", "Toys then and now", "Compare a toy from the past with one of yours.",
      ["Ask a grown-up what toys they played with as a child.", "Look at a picture of an old toy together.",
       "Say what is the same and what is different from your toys.", "Draw both toys side by side."]),
    L("Geography", "Weather diary", "Watch the weather and record it for a week.",
      ["Look out of the window. Is it sunny, cloudy, rainy or windy?", "Draw today's weather in a box.",
       "Make five boxes, one for each day this week.", "At the end of the week, count which weather you had most."], 15),
    L("Computing", "Robot instructions", "Give step-by-step instructions, like a computer program.",
      ["One person is the robot and can only do exactly what they're told.", "Give instructions to get the robot across the room: forward 2 steps, turn left...",
       "If the robot bumps into something, fix your instructions.", "Swap over and try a trickier route."], 20),
    L("Cooking", "Fruit kebabs", "Wash, chop and thread fruit to make a snack.",
      ["Wash your hands and the fruit.", "With help, cut soft fruit like banana and strawberries into chunks.",
       "Thread the pieces onto a skewer in a pattern.", "Say your pattern out loud, then eat it!"]),
    L("Design and Technology", "Build a paper bridge", "Make a bridge strong enough to hold a toy car.",
      ["Put two piles of books a hand-width apart.", "Lay one sheet of paper across. Does it hold a toy car?",
       "Try folding the paper in different ways to make it stronger.", "Which fold held the most? Why do you think that is?"]),
    L("Life Skills", "Lay the table", "Lay the table for a family meal.",
      ["Count how many people are eating.", "Put out a plate, knife, fork and cup for each person.",
       "Knife on the right, fork on the left.", "Clear your own plate after the meal."], 15),
    L("Languages", "Hello around the world", "Learn to say hello in three languages.",
      ["Learn hello in French (bonjour), Spanish (hola) and one more you choose.", "Practise saying each one to someone at home.",
       "Make a card for each with the word and a flag.", "Use one of them every time you say hello today."], 20),
    L("Music", "Kitchen band", "Make rhythms with things from the kitchen.",
      ["Collect a pan, a wooden spoon, a tub of rice and two lids.", "Tap a steady beat and count 1, 2, 3, 4.",
       "Copy each other's rhythms.", "Play along to a favourite song."], 20),
    L("RE", "Special days", "Find out about a celebration and why it matters.",
      ["Choose a special day: a birthday, Diwali, Christmas, Eid or another.", "Find out what people do, eat and wear.",
       "Talk about a special day in your own family.", "Draw a picture of the celebration."]),
    L("PSHE", "Feelings faces", "Name feelings and talk about what helps.",
      ["Draw four faces: happy, sad, cross and worried.", "Talk about a time you felt each one.",
       "For each, say one thing that helps.", "Choose which face you feel like today."], 20),
]

TEEN_EXTRA = [
    L("History", "Compare two sources", "Read two accounts of the same event and compare them.",
      ["Choose an event and find two different accounts of it.", "Note who wrote each one and when.",
       "List where they agree and disagree.", "Explain which you trust more and why."], 45),
    L("Geography", "Grid references", "Use four- and six-figure grid references on a map.",
      ["Find an Ordnance Survey map of your area, on paper or online.", "Give the four-figure reference for five places.",
       "Give six-figure references for three of them.", "Plan a short route and describe it using references."], 45),
    L("Cooking", "Cook a one-pan dinner", "Plan and cook a simple dinner for the family.",
      ["Choose a one-pan recipe from the Teens cookbook.", "Check what you have and write a shopping list.",
       "Cook it, keeping your workspace clean as you go.", "Ask the family for one thing to improve next time."], 60),
    L("Art", "Observational drawing", "Draw an everyday object from life, using tone.",
      ["Choose an object with an interesting shape: a trainer, a plant, a mug.", "Sketch the outline lightly, checking proportions.",
       "Add light, mid and dark tones.", "Write a sentence on what went well and what you'd change."], 45),
    L("Design and Technology", "Design a phone stand", "Design, make and test a phone stand from cardboard.",
      ["Write a short design brief: what must it do?", "Sketch three ideas and pick the best.",
       "Make it from cardboard.", "Test it, then improve one thing."], 50),
    L("Languages", "Introduce yourself", "Introduce yourself in the language you're learning.",
      ["Learn how to say your name, age and where you live.", "Add two things you like and one you don't.",
       "Write it out as a short paragraph.", "Record yourself saying it and listen back."], 40),
    L("Music", "How is this song built?", "Listen closely to a song and map its structure.",
      ["Choose a song you like.", "Listen and mark the intro, verses, chorus and bridge with timings.",
       "Note which instruments come in and when.", "Write what makes the chorus stand out."], 40),
    L("RE", "A big question", "Explore how two worldviews answer an ethical question.",
      ["Choose a question, such as: should we always forgive?", "Find out how two religions or worldviews answer it.",
       "Write a paragraph on each.", "Give your own view, with a reason."], 45),
    L("PSHE", "Online safety check-up", "Review your privacy settings and online habits.",
      ["List the apps and sites you use most.", "Check the privacy settings on two of them.",
       "Write three rules for dealing with messages from people you don't know.", "Talk them through with a grown-up."], 40),
    L("Outdoor Learning", "Plan a walk with a map", "Plan a local walk and lead it.",
      ["Choose a route of two to three miles on a map.", "Work out how long it will take and what to bring.",
       "Lead the walk, navigating yourself.", "Note what you'd change next time."], 90),
]

# Other names a family's timetable might use for a subject.
ALIASES = {
    "Maths": ["Mathematics", "Numeracy", "Math"],
    "English": ["Literacy", "English Language", "English Literature", "Reading", "Writing"],
    "Science": ["Biology", "Chemistry", "Physics"],
    "History": [],
    "Geography": [],
    "Art": ["Art & Design", "Art and Design", "Arts and Crafts", "Craft", "Crafts"],
    "PE": ["P.E.", "Physical Education", "Sport", "PE & Sport", "Games"],
    "Outdoor Learning": ["Outdoors", "Forest School", "Nature"],
    "Computing": ["Coding", "ICT", "Computer Science"],
    "Cooking": ["Food Technology", "Food Tech", "Home Economics", "Baking"],
    "Design and Technology": ["Design & Technology", "D&T", "DT", "Technology"],
    "Life Skills": [],
    "Languages": ["Language", "Modern Languages", "MFL", "French", "Spanish", "German"],
    "Music": [],
    "RE": ["Religious Education", "Religious Studies", "RME"],
    "PSHE": ["Wellbeing", "Health and Wellbeing", "PSE"],
}
_CANONICAL = {name.lower(): subject for subject, names in ALIASES.items() for name in [subject, *names]}


def _bank(level: str) -> dict[str, list[dict]]:
    """Every starter lesson for a level, grouped by subject, in the order they should be used through the week."""
    week, extra = (TEEN_WEEK, TEEN_EXTRA) if level == "teen" else (YOUNG_WEEK, YOUNG_EXTRA)
    bank: dict[str, list[dict]] = {}
    for item in [lesson for day in week for lesson in day] + extra:
        bank.setdefault(item["subject"], []).append(item)
    return bank


def _first_lesson(subject: str) -> dict:
    """For a subject we have no starter lessons for: a simple first lesson the family can make their own."""
    return L(subject, f"Getting started with {subject}", f"A first {subject} lesson to make your own.",
             ["Choose a topic you'd like to begin with.", "Find a video, book or website about it.",
              "Do one activity or make some notes.", "Say or write three things you learned."])


def lessons_for_week(level: str, timetable: dict) -> list[list[dict]]:
    """Monday to Friday: one starter lesson for every slot on the family's timetable, under the family's own subject names."""
    week = TEEN_WEEK if level == "teen" else YOUNG_WEEK
    bank = _bank(level)
    used: dict[str, int] = {}
    days = []
    for offset, day_name in enumerate(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]):
        subjects = [s for s in timetable.get(day_name, []) if isinstance(s, str) and s.strip()]
        if not subjects:
            days.append(list(week[offset]))  # nothing on the timetable for this day: use the ready-made day
            continue
        day = []
        for name in subjects:
            canonical = _CANONICAL.get(name.strip().lower())
            choices = bank.get(canonical or "")
            if choices:
                n = used.get(canonical, 0)
                used[canonical] = n + 1
                item = choices[n % len(choices)]
            else:
                item = _first_lesson(name.strip())
            day.append({**item, "subject": name})
        days.append(day)
    return days


# ---------- Oak National Academy lessons ----------

OAK_PUPILS = "https://www.thenational.academy/pupils/programmes"
# Oak's name for each subject in its web addresses. Subjects not listed here use our own lessons.
OAK_SUBJECT = {
    "Maths": "maths",
    "English": "english",
    "Science": "science",
    "History": "history",
    "Geography": "geography",
    "Art": "art",
    "PE": "physical-education",
    "Computing": "computing",
    "Cooking": "cooking-nutrition",
    "Design and Technology": "design-technology",
    "Languages": "french",
    "Music": "music",
    "RE": "religious-education",
    "PSHE": "rshe-pshe",
}
OAK_LANGUAGES = {"french": "french", "spanish": "spanish", "german": "german"}
_NEXT_DATA = re.compile(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', re.DOTALL)
_OAK_CACHE: dict[str, tuple[float, list[dict]]] = {}
_OAK_CACHE_SECONDS = 12 * 60 * 60


def _oak_slug(timetable_name: str) -> Optional[str]:
    name = timetable_name.strip().lower()
    if name in OAK_LANGUAGES:
        return OAK_LANGUAGES[name]
    return OAK_SUBJECT.get(_CANONICAL.get(name, ""))


def _oak_programmes(slug: str, year: int) -> list[str]:
    """The Oak programme addresses to try for a subject and year, most likely first."""
    phase = "primary" if year <= 6 else "secondary"
    base = f"{slug}-{phase}-year-{year}"
    if year <= 9:
        return [base]
    # GCSE years are split by tier and exam board. Foundation tier and AQA are used as a sensible start.
    if slug == "maths":
        return [f"{base}-foundation"]
    if slug == "science":
        return [f"combined-science-{phase}-year-{year}-foundation-aqa"]
    return [base, f"{base}-aqa", f"{base}-core", f"{base}-foundation-aqa"]


async def _oak_page(client: httpx.AsyncClient, url: str) -> Optional[dict]:
    try:
        resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (compatible; HomeschoolApp/1.0)"})
    except httpx.RequestError:
        return None
    if resp.status_code != 200:
        return None
    found = _NEXT_DATA.search(resp.text)
    if not found:
        return None
    try:
        return json.loads(found.group(1)).get("props", {}).get("pageProps", {})
    except json.JSONDecodeError:
        return None


async def _oak_lessons(client: httpx.AsyncClient, slug: str, year: int, need: int) -> list[dict]:
    """The first `need` lessons of a subject for a year, in Oak's own order. Empty if Oak has none or is unreachable."""
    key = f"{slug}:{year}"
    cached = _OAK_CACHE.get(key)
    if cached and time.time() - cached[0] < _OAK_CACHE_SECONDS and len(cached[1]) >= need:
        return cached[1][:need]

    lessons: list[dict] = []
    for programme in _oak_programmes(slug, year):
        page = await _oak_page(client, f"{OAK_PUPILS}/{programme}/units")
        sections = (page or {}).get("unitSections") or []
        units = [variants[0] for variants in (sections[0].get("units") or []) if variants] if sections else []
        if not units:
            continue
        for unit in units[:4]:  # a few units is plenty for one week
            unit_slug = unit.get("unitSlug")
            if not unit_slug:
                continue
            unit_page = await _oak_page(client, f"{OAK_PUPILS}/{programme}/units/{unit_slug}/lessons")
            browse = (unit_page or {}).get("browseData") or []
            if not browse:
                continue
            unit_title = (browse[0].get("unitData") or {}).get("title") or (unit.get("unitData") or {}).get("title") or ""
            listed = (browse[0].get("supplementaryData") or {}).get("staticLessonList") or []
            for item in sorted(listed, key=lambda x: x.get("order", 0)):
                if item.get("_state") == "published" and item.get("slug") and item.get("title"):
                    lessons.append({
                        "title": item["title"],
                        "unit": unit_title,
                        "url": f"{OAK_PUPILS}/{programme}/units/{unit_slug}/lessons/{item['slug']}",
                    })
            if len(lessons) >= need:
                break
        if lessons:
            break
    if lessons:
        _OAK_CACHE[key] = (time.time(), lessons)
    return lessons[:need]


async def oak_lessons_for(year: int, needs: dict[str, int]) -> dict[str, list[dict]]:
    """For each Oak subject, the lessons to use this week. Subjects Oak can't supply come back empty."""
    limit = asyncio.Semaphore(5)

    async def one(client, slug, need):
        async with limit:
            try:
                return slug, await _oak_lessons(client, slug, year, need)
            except Exception:
                return slug, []

    async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
        return dict(await asyncio.gather(*(one(client, slug, need) for slug, need in needs.items())))


class StarterWeekIn(BaseModel):
    child_ids: list[int]
    level: Optional[str] = None  # "young" or "teen"; picked from the first child's setting if left out
    start_date: Optional[date] = None  # the Monday to start on; this week's Monday if left out
    # School year (1 to 11) each child is working at, by child id. Children with a year get Oak lessons.
    years: dict[int, int] = {}


def _add_lesson(db: Session, owner: int, item: dict, day: date, children: list[int]) -> int:
    lesson = Lesson(
        title=item["title"][:255],
        subject=item["subject"],
        description=item.get("description"),
        lesson_url=item.get("url"),
        steps=json.dumps(item["steps"]) if item.get("steps") else None,
        duration_minutes=item.get("minutes"),
        created_by=owner,
    )
    db.add(lesson)
    db.flush()
    for child_id in children:
        db.add(PlannerEntry(lesson_id=lesson.id, assigned_to=child_id, scheduled_date=day))
    return len(children)


@router.post("", status_code=201)
async def add_starter_week(body: StarterWeekIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    children = _clean_child_ids(db, current_user.id, body.child_ids)
    if not children:
        raise HTTPException(status_code=400, detail="Pick at least one child")
    family = _family_children(db, current_user.id)
    years = {cid: year for cid, year in body.years.items() if cid in children}
    if any(not 1 <= year <= 11 for year in years.values()):
        raise HTTPException(status_code=400, detail="Choose a year from 1 to 11")
    level = body.level
    if level not in ("young", "teen"):
        level = "teen" if family[children[0]].activity_level == "teen" else "young"
    start = body.start_date or date.today()
    start -= timedelta(days=start.weekday())  # always start on a Monday
    timetable = _get_config(db, current_user.id).config

    # Children working at the same year share their lessons; children with no year share our own lessons.
    groups: dict[Optional[int], list[int]] = {}
    for cid in children:
        groups.setdefault(years.get(cid), []).append(cid)

    count = from_oak = 0
    for year, group in groups.items():
        group_level = level if year is None else ("teen" if year >= 7 else "young")
        week = lessons_for_week(group_level, timetable)
        oak: dict[str, list[dict]] = {}
        if year is not None:
            needs: dict[str, int] = {}
            for item in (i for day in week for i in day):
                slug = _oak_slug(item["subject"])
                if slug:
                    needs[slug] = needs.get(slug, 0) + 1
            oak = {slug: list(found) for slug, found in (await oak_lessons_for(year, needs)).items()}
        for offset, lessons in enumerate(week):
            day = start + timedelta(days=offset)
            for item in lessons:
                queue = oak.get(_oak_slug(item["subject"]) or "")
                if queue:
                    found = queue.pop(0)
                    item = {
                        "title": found["title"],
                        "subject": item["subject"],
                        "description": f"Oak National Academy lesson from the unit “{found['unit']}”." if found["unit"] else "Oak National Academy lesson.",
                        "url": found["url"],
                    }
                    from_oak += len(group)
                count += _add_lesson(db, current_user.id, item, day, group)
    db.commit()
    return {"lessons": count, "from_oak": from_oak, "level": level, "start_date": start.isoformat()}
