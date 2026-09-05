SFX files: this repo uses placeholders. To add sound effects, create files:
- assets/sfx/click.ogg
- assets/sfx/vehicle_move.ogg
- assets/sfx/build_complete.ogg

Use free sources (freesound.org) or generate short WAV/OGG. Place files under assets/sfx/ and reference them in code:
  const clickAudio = new Audio('assets/sfx/click.ogg');
  clickAudio.play();
