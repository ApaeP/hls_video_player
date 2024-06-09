import { Controller } from "@hotwired/stimulus"
import { VidstackPlayer } from 'vidstack';

// Connects to data-controller="hls-player"
export default class extends Controller {
  static targets = ["player"]
  static values = { url: String }

  connect() {
    this.player = this.buildPlayer();
  }

  async buildPlayer() {
    this.player = await VidstackPlayer.create({
      target: this.playerTarget,
      title: 'Livefeed',
      src: this.urlValue,
      controls: false,
      mute: true
    })
  }

  playPause() {
    if (this.player.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.player.play();
    this.element.classList.add('playing');
  }

  pause() {
    this.player.pause();
    this.element.classList.remove('playing');
  }
}
