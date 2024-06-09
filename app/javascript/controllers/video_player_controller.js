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
      controls: true
    })
  }
}
