import { Controller } from "@hotwired/stimulus"
import { VidstackPlayer } from 'vidstack';

// Connects to data-controller="video-player"
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
      mute: true,
      playsinline: true
    })
    this.player.addEventListener('loaded-data', () => {
      document.dispatchEvent(new CustomEvent('video-player:loaded'));
      this.element.classList.remove('loading') }
    );
    this.player.addEventListener('play',        () => this.element.classList.add('playing') );
    this.player.addEventListener('pause',       () => this.element.classList.remove('playing') );
  }

  playPause() {
    this.player.paused ? this.player.play() : this.player.pause();
  }
}
