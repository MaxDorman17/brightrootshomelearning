"""Builds the printable word searches for the Colouring page.

Each word search is one of Max's picture frames (frames/wNN.png, a black-and-white border with an
empty box in the middle) with a letter grid, the word list and the title printed into the box.
For each one it writes, into public/colouring/<theme>/:
  <slug>.pdf          the A4 sheet to print
  <slug>-answers.pdf  the same sheet with the words circled, for grown-ups
  <slug>.jpg          the small picture shown on the page (needs pdftoppm; skipped without it)

The grids are made by code, not by the picture tool, so every word is really there, spelled right,
and only once. Each grid is seeded by its slug, so running this again gives the same puzzle.

To add one: put its frame in frames/, add a line to PUZZLES, run
    python3 scripts/wordsearches/make_wordsearches.py
from the frontend folder, then add the sheet to lib/colouring.ts (kind: "word-search") and
lib/newContent.ts. Puzzles whose frame isn't in yet are skipped.
"""
import random
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, black, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent.parent / "public" / "colouring"

pdfmetrics.registerFont(TTFont("Nunito", str(HERE / "fonts" / "Nunito-800.ttf")))
pdfmetrics.registerFont(TTFont("Atkinson", str(HERE / "fonts" / "Atkinson-700.ttf")))

# Easy: across and down only. Tricky: also diagonally, but never backwards.
LEVELS = {
    "easy": {"size": 10, "dirs": [(1, 0), (0, 1)], "how": "Words go across and down."},
    "tricky": {"size": 13, "dirs": [(1, 0), (0, 1), (1, 1), (1, -1)], "how": "Words go across, down and diagonally."},
}

# frame, slug, title, theme, level, words
PUZZLES = [
    ("w01", "woodland-animals-word-search", "Woodland Animals", "woodland-friends", "easy",
     ["FOX", "OWL", "BADGER", "RABBIT", "DEER", "MOUSE", "SQUIRREL", "HEDGEHOG"]),
    ("w02", "into-the-forest-word-search", "Into the Forest", "woodland-friends", "tricky",
     ["OAK", "ACORN", "MUSHROOM", "FERN", "MOSS", "PINECONE", "BRANCH", "LOG", "BURROW", "NEST", "LEAVES", "TREEHOUSE"]),
    ("w03", "farm-animals-word-search", "Farm Animals", "farmyard-fun", "easy",
     ["COW", "PIG", "HEN", "DUCK", "SHEEP", "GOAT", "HORSE", "DOG"]),
    ("w04", "down-on-the-farm-word-search", "Down on the Farm", "farmyard-fun", "tricky",
     ["TRACTOR", "BARN", "FARMER", "HAY", "FIELD", "GATE", "EGGS", "MILK", "SCARECROW", "CHICKS", "PADDOCK", "ORCHARD"]),
    ("w05", "sea-creatures-word-search", "Sea Creatures", "under-the-sea", "easy",
     ["FISH", "CRAB", "WHALE", "SEAL", "SHARK", "OCTOPUS", "TURTLE", "DOLPHIN"]),
    ("w06", "ocean-explorer-word-search", "Ocean Explorer", "under-the-sea", "tricky",
     ["CORAL", "SEAWEED", "STARFISH", "JELLYFISH", "SEAHORSE", "SHELL", "PEARL", "WAVES", "SUBMARINE", "ANCHOR", "LOBSTER", "TREASURE"]),
    ("w07", "dinosaurs-word-search", "Dinosaurs", "dinosaur-world", "easy",
     ["DINO", "EGG", "ROAR", "CLAW", "TAIL", "BONE", "FOSSIL", "TREX"]),
    ("w08", "dino-discovery-word-search", "Dino Discovery", "dinosaur-world", "tricky",
     ["VOLCANO", "JUNGLE", "HERBIVORE", "CARNIVORE", "SPIKES", "FOOTPRINT", "SWAMP", "HATCH", "STEGOSAURUS", "RAPTOR", "NEST", "EXTINCT"]),
    ("w09", "into-space-word-search", "Into Space", "space-adventure", "easy",
     ["SUN", "MOON", "STAR", "ROCKET", "PLANET", "ALIEN", "COMET", "ROBOT"]),
    ("w10", "space-explorers-word-search", "Space Explorers", "space-adventure", "tricky",
     ["ASTRONAUT", "GALAXY", "ORBIT", "SATELLITE", "TELESCOPE", "GRAVITY", "CRATER", "METEOR", "EARTH", "MARS", "SATURN", "SPACESUIT"]),
    ("w11", "in-the-garden-word-search", "In the Garden", "garden-and-growing", "easy",
     ["SEED", "SOIL", "RAIN", "SUN", "ROOT", "LEAF", "BUD", "FLOWER"]),
    ("w12", "mini-beasts-word-search", "Mini Beasts", "garden-and-growing", "tricky",
     ["LADYBIRD", "BEETLE", "SPIDER", "WORM", "SNAIL", "BUTTERFLY", "CATERPILLAR", "ANT", "BEE", "WOODLOUSE", "DRAGONFLY", "GRASSHOPPER"]),
    ("w13", "fruit-and-veg-word-search", "Fruit and Veg", "garden-and-growing", "easy",
     ["APPLE", "PEAR", "PLUM", "BEAN", "PEA", "CARROT", "POTATO", "BERRY"]),
    ("w14", "spring-and-summer-word-search", "Spring and Summer", "seasonal-fun", "easy",
     ["LAMB", "CHICK", "DAISY", "BEACH", "SUNNY", "KITE", "PICNIC", "ICE CREAM"]),
    ("w15", "autumn-and-winter-word-search", "Autumn and Winter", "seasonal-fun", "tricky",
     ["CONKER", "PUMPKIN", "ACORN", "SCARF", "WELLIES", "PUDDLE", "SNOWMAN", "SLEDGE", "MITTENS", "ICICLE", "FROST", "HIBERNATE"]),
    ("w16", "fairy-tale-friends-word-search", "Fairy-Tale Friends", "fairy-tale-adventures", "easy",
     ["KING", "QUEEN", "FAIRY", "DRAGON", "WAND", "CROWN", "FROG", "CASTLE"]),
    ("w17", "once-upon-a-time-word-search", "Once Upon a Time", "fairy-tale-adventures", "tricky",
     ["UNICORN", "GIANT", "BEANSTALK", "WITCH", "WIZARD", "KNIGHT", "PRINCESS", "GOBLIN", "TROLL", "POTION", "SPELL", "MAGIC"]),
    ("w18", "things-that-go-word-search", "Things That Go", "vehicles-and-building", "easy",
     ["CAR", "BUS", "VAN", "TRAIN", "PLANE", "BOAT", "BIKE", "TRUCK"]),
    ("w19", "building-site-word-search", "On the Building Site", "vehicles-and-building", "tricky",
     ["DIGGER", "CRANE", "BRICKS", "CEMENT", "HELMET", "BUILDER", "DUMPER", "LADDER", "HAMMER", "TOOLBOX", "SCAFFOLD", "BULLDOZER"]),
    ("w20", "emergency-heroes-word-search", "Emergency Heroes", "vehicles-and-building", "tricky",
     ["AMBULANCE", "POLICE", "FIRE ENGINE", "SIREN", "HOSE", "LADDER", "RESCUE", "HELICOPTER", "DOCTOR", "NURSE", "LIFEBOAT", "HELPER"]),
]

# Filler letters never spell these in any direction, so a random grid can't hide anything unkind.
AVOID = ["POO", "WEE", "BUM", "FART", "PANTS", "DUMB", "FAT", "UGLY", "HATE", "KILL", "DIE", "DEAD", "SEX",
         "ASS", "ARSE", "CRAP", "PISS", "SHIT", "FUCK", "TIT", "WANK", "COCK", "CUNT", "DICK", "NOB", "GAY", "SUCK"]
FILL = "ABCDEFGHIJKLMNOPRSTUVWY"  # leave out Q, X and Z, which stand out too much as filler


def all_lines(grid):
    """Every row, column and diagonal of the grid, both ways round, as (letters, cells)."""
    n = len(grid)
    starts = [((0, y), (1, 0)) for y in range(n)] + [((x, 0), (0, 1)) for x in range(n)]
    starts += [((x, 0), (1, 1)) for x in range(n)] + [((0, y), (1, 1)) for y in range(1, n)]
    starts += [((x, n - 1), (1, -1)) for x in range(n)] + [((0, y), (1, -1)) for y in range(n - 1)]
    lines = []
    for (x, y), (dx, dy) in starts:
        cells = []
        while 0 <= x < n and 0 <= y < n:
            cells.append((x, y))
            x, y = x + dx, y + dy
        lines.append(("".join(grid[cy][cx] for cx, cy in cells), cells))
    return lines + [(t[::-1], c[::-1]) for t, c in lines]


def where(word, lines):
    """Every place the word can be read in the grid, as a list of cells."""
    found = []
    for text, cells in lines:
        i = text.find(word)
        while i != -1:
            found.append(cells[i:i + len(word)])
            i = text.find(word, i + 1)
    return found


def problems(grid, placed, filler):
    """Filler cells that make a word turn up a second time, or spell something on the AVOID list."""
    lines = all_lines(grid)
    bad = set()
    for w in placed:
        for spot in where(w, lines):
            # Fine where we put it, or inside a longer word (like BEE in BEETLE).
            if spot != placed[w] and not any(set(spot) <= set(placed[o]) for o in placed if o != w):
                bad |= set(spot) & filler
    for word in AVOID:
        for spot in where(word, lines):
            bad |= set(spot) & filler
    return bad


def make_grid(slug, level, words):
    rng = random.Random(slug)
    size, dirs = LEVELS[level]["size"], LEVELS[level]["dirs"]
    clean = [w.replace(" ", "") for w in words]
    for _ in range(5000):
        grid = [[""] * size for _ in range(size)]
        placed = {}
        for w in sorted(clean, key=len, reverse=True):
            spots = []
            for dx, dy in dirs:
                for x in range(size):
                    for y in range(size):
                        ex, ey = x + dx * (len(w) - 1), y + dy * (len(w) - 1)
                        if not (0 <= ex < size and 0 <= ey < size):
                            continue
                        cells = [(x + dx * i, y + dy * i) for i in range(len(w))]
                        if all(grid[cy][cx] in ("", w[i]) for i, (cx, cy) in enumerate(cells)):
                            overlap = sum(grid[cy][cx] == w[i] for i, (cx, cy) in enumerate(cells))
                            spots.append((overlap, rng.random(), cells))
            if not spots:
                break
            # Share a letter now and then, but mostly spread out so the grid isn't one tangle.
            spots.sort(key=lambda s: (s[0] if rng.random() < 0.3 else 0, s[1]), reverse=True)
            cells = spots[0][2]
            for i, (cx, cy) in enumerate(cells):
                grid[cy][cx] = w[i]
            placed[w] = cells
        else:
            if len({d for d in dirs}) > 2 and len({(c[1][0] - c[0][0], c[1][1] - c[0][1]) for c in placed.values()}) < 3:
                continue  # a tricky grid should use the diagonals
            filler = {(x, y) for y in range(size) for x in range(size) if not grid[y][x]}
            for x, y in filler:
                grid[y][x] = rng.choice(FILL)
            # Re-roll filler letters until no word turns up twice and nothing unkind is spelled.
            for _ in range(200):
                bad = problems(grid, placed, filler)
                if not bad:
                    return grid, placed
                for x, y in bad:
                    grid[y][x] = rng.choice(FILL)
    sys.exit(f"Couldn't fit the words for {slug}. Try fewer or shorter words.")


def find_box(img, score):
    """The clear space in the frame's middle box, in pixels: (left, top, right, bottom).

    Some characters lean into the box (the badger in Woodland Animals), so this looks at every clear
    rectangle inside it and keeps the one score() likes best, i.e. the one that fits the biggest grid."""
    g = img.convert("L")
    w, h = g.size
    px = g.load()
    cx, cy = w // 2, h // 2

    def scan(x, y, dx, dy):
        while 0 < x < w - 1 and 0 < y < h - 1 and px[x, y] > 128:
            x, y = x + dx, y + dy
        return x if dx else y

    def middle(vals):
        return sorted(vals)[len(vals) // 2]

    rows = [cy + k * h // 20 for k in range(-3, 4)]
    cols = [cx + k * w // 20 for k in range(-3, 4)]
    left = middle([scan(cx, y, -1, 0) for y in rows]) + 6
    right = middle([scan(cx, y, 1, 0) for y in rows]) - 6
    top = middle([scan(x, cy, 0, -1) for x in cols]) + 6
    bottom = middle([scan(x, cy, 0, 1) for x in cols]) - 6

    # Worked out on 4px blocks, a block being blocked if any of it is dark.
    step = 4
    nx, ny = (right - left) // step, (bottom - top) // step
    blocked = [[any(px[left + i * step + a, top + j * step + b] < 160 for a in range(step) for b in range(step))
                for i in range(nx)] for j in range(ny)]
    best, heights = (float("-inf"), left, top, right, bottom), [0] * nx
    for j in range(ny):
        heights = [0 if blocked[j][i] else h + 1 for i, h in enumerate(heights)]
        stack = []
        for i in range(nx + 1):
            h = heights[i] if i < nx else 0
            start = i
            while stack and stack[-1][1] >= h:
                start, sh = stack.pop()
                rect = (left + start * step, top + (j - sh + 1) * step, left + i * step, top + (j + 1) * step)
                # Keep it near the middle of the box when that costs nothing.
                value = score(*rect) - abs((rect[0] + rect[2]) - (left + right)) * 5e-4 if sh else float("-inf")
                if value > best[0]:
                    best = (value, *rect)
            stack.append((start, h))
    return best[1:]


def fit(text, font, size, width):
    while pdfmetrics.stringWidth(text, font, size) > width and size > 6:
        size -= 0.5
    return size


def draw_sheet(path, frame_path, title, level, words, grid, placed, answers):
    img = Image.open(frame_path)
    iw, ih = img.size
    pw, ph = A4
    margin = 14
    scale = min((pw - 2 * margin) / iw, (ph - 2 * margin) / ih)
    ox, oy = (pw - iw * scale) / 2, (ph - ih * scale) / 2
    pad = 8
    n = len(grid)
    ncol = 2 if len(words) <= 8 else 3
    nrow = -(-len(words) // ncol)
    row_h = 17
    list_h = nrow * row_h + 10
    list_w = ncol * (max(pdfmetrics.stringWidth(w, "Nunito", 10) for w in words) + 26)  # words can shrink to 10pt

    def grid_cell(l, t, r, b):
        """How big each grid square could be in this rectangle (0 if the word list won't fit)."""
        w, h = (r - l) * scale - 2 * pad, (b - t) * scale - 2 * pad
        if w < list_w:
            return 0
        # Squares stop growing at 34pt; past that, prefer the roomier rectangle.
        return min(w / n, (h - 58 - list_h - 10) / n, 34) + w * h * 1e-7

    l, t, r, b = find_box(img, grid_cell)
    # The box in page points (PDF y goes up from the bottom).
    bx0, bx1 = ox + l * scale + pad, ox + r * scale - pad
    by_top, by_bot = ph - (oy + t * scale) - pad, ph - (oy + b * scale) + pad
    bw = bx1 - bx0

    c = canvas.Canvas(str(path), pagesize=A4)
    c.setTitle(f"{title} word search{' answers' if answers else ''} | Bright Roots")
    c.setAuthor("Bright Roots Home Learning")
    c.drawImage(ImageReader(img), ox, oy, iw * scale, ih * scale)

    # Heading, grid and word list as one block, in the middle of the clear space.
    cell = min(bw / n, (by_top - by_bot - 58 - 14 - list_h) / n, 34)
    slack = (by_top - by_bot) - (58 + cell * n + 14 + list_h)

    # Title and how to play
    c.setFillColor(black)
    y = by_top - slack / 2 - 26
    heading = f"{title}: answers" if answers else title
    size = fit(heading, "Nunito", 26, bw)
    c.setFont("Nunito", size)
    c.drawCentredString((bx0 + bx1) / 2, y, heading)
    y -= 18
    c.setFont("Nunito", 11)
    c.setFillColor(Color(0.3, 0.3, 0.3))
    c.drawCentredString((bx0 + bx1) / 2, y, f"Find all {len(words)} words. {LEVELS[level]['how']}")
    c.setFillColor(black)
    y -= 14

    gx0 = (bx0 + bx1 - cell * n) / 2
    gy_top = y
    list_top = gy_top - cell * n - 14  # 2 columns of words for easy, 3 for tricky
    c.setStrokeColor(Color(0.55, 0.55, 0.55))
    c.setLineWidth(1)
    c.roundRect(gx0 - 4, gy_top - cell * n - 4, cell * n + 8, cell * n + 8, 8)

    if answers:
        c.setStrokeColor(Color(0.55, 0.67, 0.5, alpha=0.55))  # sage, see-through so letters still show
        c.setLineCap(1)
        c.setLineWidth(cell * 0.78)
        for cells in placed.values():
            (x0, y0), (x1, y1) = cells[0], cells[-1]
            c.line(gx0 + (x0 + 0.5) * cell, gy_top - (y0 + 0.5) * cell, gx0 + (x1 + 0.5) * cell, gy_top - (y1 + 0.5) * cell)

    letter = cell * 0.58
    c.setFont("Atkinson", letter)
    for gy, row in enumerate(grid):
        for gx, ch in enumerate(row):
            c.drawCentredString(gx0 + (gx + 0.5) * cell, gy_top - (gy + 0.5) * cell - letter * 0.35, ch)

    # Word list with a tick box each
    col_w = bw / ncol
    word_size = min(15, min(fit(w, "Nunito", 15, col_w - 26) for w in words))
    for i, w in enumerate(words):
        col, row = i // nrow, i % nrow
        x = bx0 + col * col_w + 6
        wy = list_top - 10 - row * row_h - word_size * 0.8
        c.setStrokeColor(black)
        c.setLineWidth(1.2)
        c.setFillColor(white)
        c.roundRect(x, wy - 1, 12, 12, 3, fill=1)
        c.setFillColor(black)
        if answers:
            c.setLineWidth(2)
            c.line(x + 2.5, wy + 5, x + 5, wy + 2)
            c.line(x + 5, wy + 2, x + 10, wy + 9.5)
        c.setFont("Nunito", word_size)
        c.drawString(x + 18, wy, w)

    c.showPage()
    c.save()


def thumbnail(pdf, jpg):
    if not shutil.which("pdftoppm"):
        print(f"  (no pdftoppm, so no picture for {jpg.name})")
        return
    stem = jpg.with_suffix("")
    subprocess.run(["pdftoppm", "-jpeg", "-gray", "-singlefile", "-scale-to-x", "414", "-scale-to-y", "-1", str(pdf), str(stem)], check=True)


def main():
    made = 0
    for frame, slug, title, theme, level, words in PUZZLES:
        frame_path = HERE / "frames" / f"{frame}.png"
        if not frame_path.exists():
            continue
        grid, placed = make_grid(slug, level, words)
        out = PUBLIC / theme
        out.mkdir(parents=True, exist_ok=True)
        draw_sheet(out / f"{slug}.pdf", frame_path, title, level, words, grid, placed, answers=False)
        draw_sheet(out / f"{slug}-answers.pdf", frame_path, title, level, words, grid, placed, answers=True)
        thumbnail(out / f"{slug}.pdf", out / f"{slug}.jpg")
        print(f"{frame}  {theme}/{slug}")
        made += 1
    print(f"Made {made} word searches.")


if __name__ == "__main__":
    main()
