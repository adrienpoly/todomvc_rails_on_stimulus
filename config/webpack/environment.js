const { environment } = require("@rails/webpacker");
const webpack = require("webpack");

environment.plugins.set(
  "Provide",
  new webpack.ProvidePlugin({
    Rails: "rails-ujs",
    Turbolinks: "turbolinks"
  })
);

module.exports = environment;
