import { Controller } from "stimulus";
import Rails from "rails-ujs";
import safetext from "../support/safetext";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class extends Controller {
  static targets = ["inputForm", "input", "title"];

  submit(event) {
    this.element.closest("li").classList.remove("editing");
    this.inputFormTarget.style.display = "none";

    if (this.isCanceled) {
      this.input = this.title;
      return;
    }

    this.title = this.input;
    this.handleSubmit();
  }

  keydown(event) {
    this.isCanceled = event.keyCode === ESCAPE_KEY;
    if (this.isCanceled || event.keyCode === ENTER_KEY) {
      event.preventDefault();
      this.inputTarget.blur();
    }
  }

  edit() {
    this.element.closest("li").classList.add("editing");
    this.inputFormTarget.style.display = "block";
    this.inputTarget.focus();
  }

  handleSubmit() {
    this.element.closest("li").classList.remove("editing");
    this.inputFormTarget.style.display = "none";

    const data = new FormData();
    data.append("todo[title]", this.input);

    Rails.ajax({
      url: `${this.id}`,
      type: "PATCH",
      data,
      error: error => {
        this.edit();
      }
    });
  }

  // GETTERS AND SETTERS

  get isCanceled() {
    return this.data.get("isCanceled") === "true";
  }

  set isCanceled(bool) {
    this.data.set("isCanceled", bool);
  }

  get id() {
    return this.data.get("id");
  }

  get input() {
    return safetext(this.inputTarget.value);
  }

  set input(text) {
    this.inputTarget.value = text;
  }

  get title() {
    return this.titleTarget.innerHTML;
  }

  set title(text) {
    this.titleTarget.innerHTML = text;
  }
}
