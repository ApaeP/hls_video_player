class PagesController < ApplicationController
  URL = "https://deliverys5.quanteec.com/contents/encodings/live/ffd2c10a-e812-4729-3930-3130-6d61-63-a799-247bcd11ebafd/master.m3u8"
  before_action :set_url, only: [:home, :customize]

  def home
  end

  def customize
    @scss = File.read(Rails.root.join('app', 'assets', 'stylesheets', 'components', '_video_player.scss'))
    @scss_variables = @scss.lines.take_while { |e| e.starts_with?('$') }.unshift("// app/assets/stylesheets/components/_video_player.scss\n").join("\n")
    @javascript = File.read(Rails.root.join('app', 'javascript', 'controllers', 'video_player_controller.js'))
  end

  private

  def set_url
    @url = URL
  end
end
