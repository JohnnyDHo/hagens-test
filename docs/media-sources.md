# Media source ledger

All production media must have a recorded origin. Local filenames below are the frozen copies used by the site.

## Hagens Berman Racing Seattle

The current team site and its public Mason Lake 2026 galleries are the source of truth. The gallery states that visitors may download and use its photos and asks that `@hagensbermancycling` be tagged. Preserve a visible gallery credit where practical.

- `public/media/team.webp` — current homepage team photo: https://www.hbsccycling.com/
- `public/media/race-01.webp` through `race-06.webp` — Mason Lake 2026 gallery: https://www.hbsccycling.com/2026-mason-lake-1
- `public/media/mason-01.webp` through `mason-06.webp` — Mason Lake 2026 gallery: https://www.hbsccycling.com/2026-mason-lake-1
- `public/media/action-01.webp` through `action-07.webp` — Mason Lake 2026 gallery, source files N25B7204, N25B7216, N25B7231, N25B7233, N25B7258, N25B7263, and N25B7282.
- `public/media/partner-hagens-berman.webp`, `partner-smith.webp`, `partner-skratch.webp`, `partner-specialized.webp`, and `partner-silca.webp` — current partner page: https://www.hbsccycling.com/partners

## Hero footage

- `public/media/hero.mp4` and `public/media/hero-poster.jpg` — “Cyclists race around a curve in an urban park setting,” video 18701796 by Albert Patten on Pexels: https://www.pexels.com/video/a-group-of-cyclists-are-riding-on-a-road-18701796/
- Pexels marks the clip “Free to use.” The deployed video is a 5.208-second, muted, 1280×720 H.264/yuv420p derivative with its opening and closing 0.8 seconds cyclically dissolved for a smooth repeat. It is encoded without audio and with MP4 fast-start metadata; the poster is a frame from the source clip.
- The derived output is frozen in the media-use ledger as `.media/video/video_001.mp4`; provenance points back to the deployed `public/media/hero.mp4` copy.

## Discipline reference studies

These four images are clearly captioned as reference imagery in the race atlas;
they do not depict HBR riders or team results. The local WebP files are resized,
compressed derivatives of the licensed originals.

- `public/media/discipline-gravel.webp` — “Cyclist on gravel bike descending Eldridge Grade,” by Drakepirates, Wikimedia Commons, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Cyclist_on_gravel_bike_descending_Eldridge_Grade.jpg
- `public/media/discipline-cyclocross.webp` — “Jeremy Powers at Cyclocross National Championships,” by Roxanne King, Wikimedia Commons, CC BY 2.0: https://commons.wikimedia.org/wiki/File:JeremyPowersCXNats.jpg
- `public/media/discipline-track.webp` — “A person riding a bike on a track,” by Vitalii Khodzinskyi, free to use under the Unsplash License: https://unsplash.com/photos/a-person-riding-a-bike-on-a-track-QvN9oEvvdm4
- `public/media/discipline-mtb.webp` — “Man Using a Mountain Bike in the Forest,” by Jonathan Cooper, free to use under the Pexels License: https://www.pexels.com/photo/man-using-a-mountain-bike-in-the-forest-11715051/
