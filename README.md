# Display video player for HLS stream

## Setup

1. Install vidstack:
    1. Manually add the following line in your `config/importmap.rb` file:
        ```ruby
        pin "vidstack", to: "https://cdn.vidstack.io/player@1.11.21"
        ```

    2. Add the following link tags in your `app/views/layouts/application.html.erb` file:
        ```html
        <link rel="stylesheet" href="https://cdn.vidstack.io/player/theme.css@1.11.21" />
        <link rel="stylesheet" href="https://cdn.vidstack.io/player/video.css@1.11.21" />
        ```

2. Display a player:
    1. Get an HLS stream url
        * In your browser, navigate to a website that livestreams something ([example](https://www.biarritz.fr/les-webcams/grande-plage-1))
        * Open the developper tools and go to the **Network** tab
        * Filter the request to display only media requests
        * Clear the tab and reload the page
        * If the livestream does not autoplay, play it
        * Find the first GET request that fetches a file with `.m3u8` extension (*`https://deliverys5.quanteec.com/contents/encodings/live/ffd2c10a-e812-4729-3930-3130-6d61-63-a799-247bcd11ebafdmaster.m3u8`* for the example)
        * `YOUR_URL=` URL of this request
        * Use it to give to the video player
            ```ruby
            # app/controllers/pages_controller.rb
            # ...
                def home
                    @url = YOUR_URL
                end
            # ...
            ```
    2. Build the video player component
        ```html
        <div class="video-player-container"
             data-controller="video-player"
             data-video-player-url-value="<%= @url %>"
        >
          <div data-video-player-target="player"></div>
        </div>
        ```
    3. Connect and setup a stimulus controller
        ```bash
        rails g stimulus video-player
        ```
        then in `javascript/controllers/video_player_controller.js`
        ```javascript
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
              src: this.urlValue
            })
          }
        }
        ```
