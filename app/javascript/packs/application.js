import { Application } from "stimulus";
// import { autoload } from "stimulus/webpack-helpers";
import { definitionsFromContext } from "stimulus/webpack-helpers"
import Turbolinks from "turbolinks";
import Rails from "rails-ujs";
import "../stylesheets/todomvc.scss";
import "../images/index";
const application = Application.start();
const context = require.context("../controllers", true, /\.js$/);
application.load(definitionsFromContext(context))

Rails.start();
Turbolinks.start();
