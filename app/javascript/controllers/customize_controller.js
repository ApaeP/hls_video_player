import { Controller } from "@hotwired/stimulus"

class CustomizablePlayer {
  constructor(element, options = {}) {
    this.playerComponent = element
    this.playerContainer = this.playerComponent.querySelector('.video-player-container')
    this.player = this.playerContainer.querySelector('div[data-video-player-target="player"]')
    this.mediaPlayer = this.player.querySelector('media-player')
    this.video = this.mediaPlayer.querySelector('video')
    this.videoPoster = this.playerContainer.querySelector('.video-poster')
    this.videoPosterImage = this.videoPoster.querySelector('img')
    this.videoControls = this.playerContainer.querySelector('.video-controls')
    this.videoBackfill = this.playerContainer.querySelector('.video-backfill')

    this.setOptions(options)
  }

  setOptions(options) {
    const optionNames = [
      'borderRadius',
      'overlayColor',
      'aspectRatio',
      'borderWidth',
      'borderOffset',
      'borderColor',
      'backgroundColor',
    ]

    Object.keys(options).forEach(option => {
      if (optionNames.includes(option)) {
        this[option.toString()] = options[option]
      }
    })
  }

  setBorderRadius(value) {
    this.borderRadius = value
    this.playerContainer.style.borderRadius = value
    this.player.style.borderRadius = value
    this.mediaPlayer.style.borderRadius = value
    this.videoPosterImage.style.borderRadius = value
    this.videoControls.style.borderRadius = value
    this.videoBackfill.style.borderRadius = value
  }

  setOverlayColor(value) {
    this.overlayColor = value
    this.videoControls.style.backgroundColor = value
  }

  setRatio(value) {
    this.aspectRatio = value
    this.playerContainer.style.aspectRatio = value
    this.video.style.aspectRatio = value
  }

  setBorderWidth(value) {
    this.borderWidth = value
    this.playerComponent.style.padding = `calc(${value} + ${this.borderOffset})`
    this.videoBackfill.style.outlineWidth = value
  }

  setBorderOffset(value) {
    this.borderOffset = value
    this.playerComponent.style.padding = `calc(${this.borderWidth} + ${value})`
    this.videoBackfill.style.outlineOffset = value
  }

  setBorderColor(value) {
    this.videoBackfill.style.outlineColor = value
  }

  setBackgroundColor(value) {
    this.videoBackfill.style.backgroundColor = value
  }
}

// Connects to data-controller="customize"
export default class extends Controller {
  static targets = [
    "player",
    "style",
    "form",
    "borderRadiusInput",
    "controlsBackgroundColorInput",
    "aspectRatioInput",
    "borderWidthInput",
    "borderOffsetInput",
    "borderColorInput",
    "backgroundColorInput"
  ]
  static values = {
    borderRadius: String,
    overlayColor: String,
    aspectRatio: String,
    borderWidth: String,
    borderOffset: String,
    borderColor: String,
    backgroundColor: String
  }

  connect() {
    document.addEventListener('video-player:loaded', () => {
      const defaultOptions = {
        borderRadius: this.borderRadiusValue,
        overlayColor: this.overlayColorValue,
        aspectRatio: this.aspectRatioValue,
        borderWidth: this.borderWidthValue,
        borderOffset: this.borderOffsetValue,
        borderColor: this.borderColorValue,
        backgroundColor: this.backgroundColorValue
      }
      this.customizablePlayer = new CustomizablePlayer(this.element.querySelector('.video-player-component'), defaultOptions)
      this.bindCustomizablePlayerToForm(this.customizablePlayer)
    })
  }

  reinjectScss() {
    this.styleTarget.innerHTML = this.scssValue
  }

  bindCustomizablePlayerToForm(player) {
    const inputMappings = {
      borderRadiusInputTarget: ['setBorderRadius', 'border-radius'],
      controlsBackgroundColorInputTarget: ['setOverlayColor', 'overlay-color'],
      aspectRatioInputTarget: ['setRatio', 'video-ratio'],
      borderWidthInputTarget: ['setBorderWidth', 'border-width'],
      borderOffsetInputTarget: ['setBorderOffset', 'border-offset'],
      borderColorInputTarget: ['setBorderColor', 'border-color'],
      backgroundColorInputTarget: ['setBackgroundColor', 'background-color']
    }

    Object.keys(inputMappings).forEach(inputTarget => {
      this[inputTarget].addEventListener('input', (event) => {
        player[inputMappings[inputTarget][0]](event.target.value)
        this.updateStyle(inputMappings[inputTarget][1], event.target.value)
      })
    })
  }

  updateStyle(prop, value) {
    this.styleTarget.innerText.split(/\n+/).forEach((line) => {
      if (line.includes(prop)) {
        const newLine = line.replace(/(?<=:\s).+(?=;)/, value)
        this.styleTarget.innerText = this.styleTarget.innerText.replace(line, newLine)
      }
    });
  }
}
