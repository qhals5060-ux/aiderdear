from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
GENERATED_BURPEE = Path(
    r"C:\Users\김보민\.codex\generated_images\01a05ba3-1c66-7e83-b809-6349e8c6f653\exec-c128d7b5-2347-4dc7-82db-2ba65b047cf1.png"
)
TARGET_SIZE = (400, 640)
SOURCE_FILES = [
    "challenge-lunge-forward-animated-v95.webp",
    "challenge-lunge-reverse-animated-v95.webp",
    "challenge-lunge-side-animated-v95.webp",
    "challenge-squat-basic-animated-v95.webp",
    "challenge-squat-wide-animated-v95.webp",
    "challenge-squat-side-animated-v95.webp",
    "challenge-plank-forearm-animated-v95.webp",
    "challenge-plank-high-animated-v95.webp",
    "challenge-plank-side-animated-v95.webp",
]


def corner_color(frame: Image.Image) -> tuple[int, int, int]:
    rgb = frame.convert("RGB")
    samples = [
        rgb.getpixel((2, 2)),
        rgb.getpixel((rgb.width - 3, 2)),
        rgb.getpixel((2, rgb.height - 3)),
        rgb.getpixel((rgb.width - 3, rgb.height - 3)),
    ]
    return tuple(sum(pixel[channel] for pixel in samples) // len(samples) for channel in range(3))


def normalize_animated(source: Path, destination: Path) -> None:
    image = Image.open(source)
    frames: list[Image.Image] = []
    durations: list[int] = []
    for index in range(getattr(image, "n_frames", 1)):
        image.seek(index)
        frame = image.convert("RGB")
        frames.append(
            ImageOps.pad(
                frame,
                TARGET_SIZE,
                method=Image.Resampling.LANCZOS,
                color=corner_color(frame),
                centering=(0.5, 0.5),
            )
        )
        durations.append(int(image.info.get("duration", 420)))
    frames[0].save(
        destination,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=88,
        method=6,
    )


def build_burpee() -> None:
    sheet = Image.open(GENERATED_BURPEE).convert("RGB")
    sheet.copy().save(ROOT / "challenge-burpee-sequence-v100.png", optimize=True)
    cell_w, cell_h = sheet.width // 3, sheet.height // 2
    panels = []
    for row, column in ((0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)):
        left, top = column * cell_w + 4, row * cell_h + 4
        right, bottom = (column + 1) * cell_w - 4, (row + 1) * cell_h - 4
        panels.append(sheet.crop((left, top, right, bottom)))

    # Vertical poses fill the same 400×640 stage as the lunge assets. Horizontal
    # poses retain the complete hands-to-shoes silhouette and are letterboxed.
    standing_box = (96, 0, panels[0].width - 96, panels[0].height)
    squat_box = (72, 82, panels[1].width - 72, panels[1].height)
    jump_box = (96, 0, panels[5].width - 96, panels[5].height)
    prepared = [
        ImageOps.fit(panels[0].crop(standing_box), TARGET_SIZE, Image.Resampling.LANCZOS),
        ImageOps.fit(panels[1].crop(squat_box), TARGET_SIZE, Image.Resampling.LANCZOS),
        ImageOps.pad(panels[2], TARGET_SIZE, Image.Resampling.LANCZOS, color=corner_color(panels[2]), centering=(0.5, 0.58)),
        ImageOps.pad(panels[3], TARGET_SIZE, Image.Resampling.LANCZOS, color=corner_color(panels[3]), centering=(0.5, 0.58)),
        ImageOps.fit(panels[4].crop(squat_box), TARGET_SIZE, Image.Resampling.LANCZOS),
        ImageOps.fit(panels[5].crop(jump_box), TARGET_SIZE, Image.Resampling.LANCZOS),
    ]
    durations = [320, 180, 180, 260, 190, 300]
    prepared[0].save(
        ROOT / "challenge-burpee-animated-v100.webp",
        save_all=True,
        append_images=prepared[1:],
        duration=durations,
        loop=0,
        quality=90,
        method=6,
    )
    preview = Image.new("RGB", (6 * 200, 320), (245, 245, 242))
    for index, frame in enumerate(prepared):
        preview.paste(frame.resize((200, 320), Image.Resampling.LANCZOS), (index * 200, 0))
    preview.save(ROOT / "work-burpee-v100-preview.png", optimize=True)


for filename in SOURCE_FILES:
    normalize_animated(ROOT / filename, ROOT / filename.replace("-v95.webp", "-v100.webp"))

build_burpee()
print("Created 10 normalized 400x640 animated WebP assets and the v100 burpee source sheet.")
