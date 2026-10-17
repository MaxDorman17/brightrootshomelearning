"""Turn picture files dropped into the site's picture folders into the small JPGs the site uses.

Activity pictures: save each one with its activity's file name (for example little-story-stones.png)
in frontend/public/make-photos. It is cropped square, resized to 900 x 900 and saved as <name>.jpg.

Lesson pictures: save them all, with the file names from the prompts file, in
frontend/public/lessons/new. A unit cover (for example counting-to-20.png) becomes a 900 x 900
lessons/units/counting-to-20.jpg; a Learn card (for example counting-to-20-lesson-1-2.png) becomes a
1200 x 800 lessons/counting-to-20/lesson-1-2.jpg.

Push and the GitHub action of the same name runs this, or run it by hand with
`python scripts/convert_make_photos.py`. The originals are removed once converted.
"""
import re
from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "frontend" / "public"
FOLDER = PUBLIC / "make-photos"
LESSONS = PUBLIC / "lessons"
DROP = LESSONS / "new"
SIZE = 900
PICTURES = {".png", ".jpeg", ".jpg", ".webp"}
CARD = re.compile(r"^(?P<unit>[a-z0-9-]+)-(?P<card>lesson-\d+-\d+)$")


def convert(path: Path, out: Path | None = None, size: tuple[int, int] = (SIZE, SIZE)) -> Path:
    """Crops the middle of the picture to the shape of `size`, resizes it and saves it as a JPG."""
    out = out or path.with_suffix(".jpg")
    with Image.open(path) as im:
        im = im.convert("RGB")
        w, h = im.size
        want = size[0] / size[1]
        cw, ch = (w, round(w / want)) if w / h < want else (round(h * want), h)
        left, top = (w - cw) // 2, (h - ch) // 2
        im = im.crop((left, top, left + cw, top + ch)).resize(size, Image.LANCZOS)
        out.parent.mkdir(parents=True, exist_ok=True)
        im.save(out, quality=85)
    if path != out:
        path.unlink()
    return out


def lesson_target(path: Path) -> tuple[Path, tuple[int, int]]:
    """Where a dropped lesson picture goes: a Learn card if it ends in lesson-<n>-<m>, otherwise a unit cover."""
    m = CARD.match(path.stem.lower())
    if m:
        return LESSONS / m["unit"] / f"{m['card']}.jpg", (1200, 800)
    return LESSONS / "units" / f"{path.stem.lower()}.jpg", (SIZE, SIZE)


def main() -> None:
    files = sorted(p for p in FOLDER.iterdir() if p.suffix.lower() in PICTURES - {".jpg"})
    for path in files:
        print(f"{path.name} -> {convert(path).name}")
    lesson_files = sorted(p for p in DROP.iterdir() if p.suffix.lower() in PICTURES) if DROP.is_dir() else []
    for path in lesson_files:
        out, size = lesson_target(path)
        print(f"{path.name} -> {convert(path, out, size).relative_to(LESSONS)}")
    print(f"Converted {len(files) + len(lesson_files)} picture(s).")


if __name__ == "__main__":
    main()
