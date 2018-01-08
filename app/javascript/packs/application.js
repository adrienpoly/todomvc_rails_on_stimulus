import { Application } from "stimulus";
import { autoload } from "stimulus/webpack-helpers";
import "./stylesheets/todomvc.scss";
const application = Application.start();
const context = require.context("./controllers", true, /\.js$/);

autoload(context, application);
Rails.start();
Turbolinks.start();
