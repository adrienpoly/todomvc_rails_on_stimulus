# A TodoMVC built with Rails, Turbolinks and boosted with Stimulus

This is a **modest** attempt to create a TodoMVC with Rails, Turbolinks and boost it a bit with Stimulus.
This project was inspired by [this project](https://github.com/nateberkopec/todomvc-turbolinks) : a TodoMVC built with Rails and Turbolinks 3

## The concept behind

The goal of this project was primarily to get more familiar and practice with the new [Stimulus](https://github.com/stimulusjs/stimulus) framework.
The approach taken in this project is to make most of the actions on the todolist client side with Stimulus controller **to get this crisp and fast feeling of client side rendering**.
This Todolist preserves the data in a database within the backend. Each action is therefore linked to a call to the backend to update the content in the database. Those calls are ajax calls using Rails UJS `Rails.ajax`.

## Demo

A live demo is available at: https://todomvc-rails-on-stimulus.herokuapp.com/

As a comparison you can also test the Turbolink 3 only: https://todomvc-turbolinks.herokuapp.com/

## Todo

🚧 WORK IN PROGRESS

* [x] Fix Turbolinks blinks and path change
* [x] We are talking about speed here, score a 100 at Google page speed 💯
* [ ] Add tests
* [ ] Add a new todo client side
* [ ] Split the Todo controller in smaller controllers that communicate between each others (wait for 1.1)

## Disclaimer

This is not intended to be a perfect example of how to use Stimulus, Rails and Turbolinks in a production environment. This is solely an exercise to practice this new Framework and to confirm how well it pairs with Rails and Turbolinks.

## Credits

Lots of inspiration from this great project that got me started
[A Turbolinks 3 TodoMVC](https://github.com/nateberkopec/todomvc-turbolinks)

Many thanks for all Q&A in the Stimulus [issues](https://github.com/stimulusjs/stimulus/issues?q=is%3Aissue+is%3Aclosed)

[@nowhereman](https://github.com/nowhereman) : for sending a nice [PR](https://github.com/adrienpoly/todomvc_rails_on_stimulus/pull/4) . While it hasn't been merged it helped me a lot understanding how Turbolinks, Rails-ujs plays all together
