# Videos

Place hero and engineering videos here. The site references these exact filenames:

| File | Purpose | Target |
|---|---|---|
| `airborne-phoenix-hero.mp4` | Desktop hero (H.264, 1920×1080, 24–30 fps, 10–20 s loop, no audio) | < 8 MB |
| `airborne-phoenix-hero.webm` | Desktop hero (VP9/AV1 alternative) | < 6 MB |
| `airborne-phoenix-mobile.mp4` | Mobile hero (H.264, 1080×1350 or 1080×1920, 10–15 s) | < 4 MB |
| `engineering/*.mp4` | Below-the-fold clips (CFD, layups, tests). Always provide a poster in `/images/engineering/`. | < 5 MB each |

Encode example: `ffmpeg -i in.mov -an -vf scale=1920:-2 -c:v libx264 -crf 24 -preset slow -movflags +faststart airborne-phoenix-hero.mp4`

Until files exist, the hero falls back to the poster image and an atmospheric sky clip.
