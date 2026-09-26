Put your downloaded trailer files here as plain .mp4 files.

Naming rule: the filename must match the trailer's "youtubeId" value
from data/trailers.json (or js/hero-slider.js for the homepage slider),
with a .mp4 extension.

Example — data/trailers.json has:
  "youtubeId": "Way9Dexny3w"   (Dune: Part Two)

So the file must be:
  videos/Way9Dexny3w.mp4

That's it — no backend, no YouTube, just static files served by the
website itself. If a file is missing, that trailer's player will
simply show a blank/broken video with no source (add the file and
reload).
