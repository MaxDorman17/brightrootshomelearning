"""Turn picture files dropped into frontend/public/make-photos into the small JPGs the site uses.

Save each picture with its activity's file name (for example little-story-stones.png) in
frontend/public/make-photos and push. This script (run by the GitHub action of the same name,
or by hand with `python scripts/convert_make_photos.py`) crops each one square, resizes it to
900 x 900, saves it as <name>.jpg and removes the original.
"""
from pathlib import Path

from PIL import Image

FOLDER = Path(__file__).resolve().parent.parent / "frontend" / "public" / "make-photos"
SIZE = 900


def convert(path: Path) -> Path:
    out = path.with_suffix(".jpg")
    with Image.open(path) as im:
        im = im.convert("RGB")
        w, h = im.size
        side = min(w, h)
        left, top = (w - side) // 2, (h - side) // 2
        im = im.crop((left, top, left + side, top + side)).resize((SIZE, SIZE), Image.LANCZOS)
        im.save(out, quality=85)
    path.unlink()
    return out


def main() -> None:
    files = sorted(p for p in FOLDER.iterdir() if p.suffix.lower() in {".png", ".jpeg", ".webp"})
    for path in files:
        print(f"{path.name} -> {convert(path).name}")
    print(f"Converted {len(files)} picture(s).")


if __name__ == "__main__":
    main()
