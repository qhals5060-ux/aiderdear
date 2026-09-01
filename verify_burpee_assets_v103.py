from pathlib import Path
from PIL import Image


for filename in (
    "challenge-burpee-animated-v100.webp",
    "challenge-burpee-stepback-animated-v103.webp",
    "challenge-burpee-pushup-animated-v103.webp",
):
    image = Image.open(Path(filename))
    assert image.size == (400, 640), f"{filename}: unexpected size {image.size}"
    assert getattr(image, "n_frames", 1) >= 6, f"{filename}: animation needs at least six frames"
    print(f"{filename}: {image.width}x{image.height}, {image.n_frames} frames")
