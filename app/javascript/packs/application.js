import "todomvc-app-css";
import "todomvc-common/base.css";

import { Application } from "stimulus";
import { definitionsFromContext } from "stimulus/webpack-helpers";
import Turbolinks from "turbolinks";
import Rails from "rails-ujs";
import "../stylesheets/main.scss";

import "../images/index";
const application = Application.start();
const context = require.context("../controllers", true, /\.js$/);
application.load(definitionsFromContext(context));

Rails.start();
Turbolinks.start();
