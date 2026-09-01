from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
TARGET_SIZE = (400, 640)


def corner_color(frame: Image.Image) -> tuple[int, int, int]:
    rgb = frame.convert("RGB")
    points = ((2, 2), (rgb.width - 3, 2), (2, rgb.height - 3), (rgb.width - 3, rgb.height - 3))
    return tuple(sum(rgb.getpixel(point)[channel] for point in points) // len(points) for channel in range(3))


def split_sheet(filename: str) -> list[Image.Image]:
    sheet = Image.open(ROOT / filename).convert("RGB")
    cell_w, cell_h = sheet.width // 3, sheet.height // 2
    return [
        sheet.crop((column * cell_w + 4, row * cell_h + 4, (column + 1) * cell_w - 4, (row + 1) * cell_h - 4))
        for row, column in ((0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2))
    ]


def portrait(frame: Image.Image, inset_x: int = 86, inset_top: int = 0) -> Image.Image:
    crop = frame.crop((inset_x, inset_top, frame.width - inset_x, frame.height))
    return ImageOps.fit(crop, TARGET_SIZE, Image.Resampling.LANCZOS)


def landscape(frame: Image.Image, vertical_center: float = .58) -> Image.Image:
    return ImageOps.pad(
        frame,
        TARGET_SIZE,
        Image.Resampling.LANCZOS,
        color=corner_color(frame),
        centering=(.5, vertical_center),
    )


def save_animation(frames: list[Image.Image], filename: str, durations: list[int]) -> None:
    frames[0].save(
        ROOT / filename,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=90,
        method=6,
    )


stepback = split_sheet("challenge-burpee-stepback-sequence-v103.png")
stepback_frames = [
    portrait(stepback[0], 96),
    portrait(stepback[1], 72, 70),
    landscape(stepback[2], .58),
    landscape(stepback[3], .58),
    portrait(stepback[4], 72, 70),
    portrait(stepback[5], 96),
]
save_animation(stepback_frames, "challenge-burpee-stepback-animated-v103.webp", [320, 190, 220, 250, 200, 310])

pushup = split_sheet("challenge-burpee-pushup-sequence-v103.png")
pushup_frames = [
    portrait(pushup[0], 96),
    portrait(pushup[1], 72, 70),
    landscape(pushup[2], .58),
    landscape(pushup[3], .58),
    portrait(pushup[4], 72, 70),
    portrait(pushup[5], 96),
]
save_animation(pushup_frames, "challenge-burpee-pushup-animated-v103.webp", [300, 170, 210, 300, 180, 300])

preview = Image.new("RGB", (6 * 160, 2 * 256), (241, 246, 250))
for row, frames in enumerate((stepback_frames, pushup_frames)):
    for column, frame in enumerate(frames):
        preview.paste(frame.resize((160, 256), Image.Resampling.LANCZOS), (column * 160, row * 256))
preview.save(ROOT / "work-burpee-variants-v103-preview.png", optimize=True)

print("Created two v103 400x640 animated WebP burpee variants and a contact preview.")
