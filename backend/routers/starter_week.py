"""A ready-made sample week, so a new family's planner isn't empty on day one.

Two versions: one for younger children and one for teenagers. Every lesson is an ordinary lesson in the
family's own list, so they can change it, move it or delete it like anything else they plan.
"""
import json
from datetime import date, timedelta
from typing import Optional

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


# Monday to Friday, a few lessons a day.
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


# Other names a family's timetable might use for the subjects in the starter week.
ALIASES = {
    "Art": ["Art & Design", "Art and Design", "Arts and Crafts", "Craft"],
    "PE": ["P.E.", "Physical Education", "Sport", "PE & Sport"],
    "Outdoor Learning": ["Outdoors", "Forest School", "Nature", "Science"],
    "Computing": ["Coding", "ICT", "Computer Science"],
    "Life Skills": ["Cooking", "Home Economics", "PSHE"],
    "English": ["Literacy", "English Language", "Reading"],
    "Maths": ["Mathematics", "Numeracy", "Math"],
}


def _timetable_name(subject: str, day_subjects: list[str]) -> str:
    """Use the family's own name for a subject, so the lesson lands in the right row of the planner."""
    lower = {s.lower(): s for s in day_subjects}
    for name in [subject, *ALIASES.get(subject, [])]:
        if name.lower() in lower:
            return lower[name.lower()]
    return subject


class StarterWeekIn(BaseModel):
    child_ids: list[int]
    level: Optional[str] = None  # "young" or "teen"; picked from the first child's setting if left out
    start_date: Optional[date] = None  # the Monday to start on; this week's Monday if left out


@router.post("", status_code=201)
def add_starter_week(body: StarterWeekIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    children = _clean_child_ids(db, current_user.id, body.child_ids)
    if not children:
        raise HTTPException(status_code=400, detail="Pick at least one child")
    level = body.level
    if level not in ("young", "teen"):
        first = _family_children(db, current_user.id)[children[0]]
        level = "teen" if first.activity_level == "teen" else "young"
    start = body.start_date or date.today()
    start -= timedelta(days=start.weekday())  # always start on a Monday
    week = TEEN_WEEK if level == "teen" else YOUNG_WEEK

    timetable = _get_config(db, current_user.id).config
    count = 0
    for offset, lessons in enumerate(week):
        day = start + timedelta(days=offset)
        day_subjects = list(timetable.get(day.strftime("%A"), []))
        for item in lessons:
            subject = _timetable_name(item["subject"], day_subjects)
            if subject in day_subjects:
                day_subjects.remove(subject)  # one starter lesson per timetable slot
            lesson = Lesson(
                title=item["title"],
                subject=subject,
                description=item["description"],
                steps=json.dumps(item["steps"]),
                duration_minutes=item["minutes"],
                created_by=current_user.id,
            )
            db.add(lesson)
            db.flush()
            for child_id in children:
                db.add(PlannerEntry(lesson_id=lesson.id, assigned_to=child_id, scheduled_date=day))
                count += 1
    db.commit()
    return {"lessons": count, "level": level, "start_date": start.isoformat()}
