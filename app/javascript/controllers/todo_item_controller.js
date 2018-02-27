import { ApplicationController } from "../support/application-controller";
import safetext from "../support/safetext";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class extends ApplicationController {
  static targets = ["inputForm", "input", "title"];

  submit(event) {
    this.element.classList.remove("editing");

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
    this.input = this.title;
    this.element.classList.add("editing");
    this.inputTarget.focus();
  }

  toggle(event) {
    this.element.classList.toggle("completed");
    this.railsUpdate(`${this.id}`, "todo[completed]", event.target.checked);
    this.updateList();
  }

  destroy(event) {
    this.element.remove();
    this.railsDelete(`${this.id}`).catch(err => {
      this.element.classList.remove("hidden");
    });
    this.updateList();
  }

  handleSubmit() {
    this.element.classList.remove("editing");
    this.railsUpdate(`${this.id}`, "todo[title]", this.input).catch(error => {
      this.edit();
    });
  }

  updateList() {
    const todoController = this.getControllerByIdentifier("todo-list");
    todoController.render();
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
