import { Controller } from "stimulus";
import pluralize from "pluralize";
import Rails from "rails-ujs";
import createDOMPurify from "dompurify";

const ALL = "all";
const COMPLETED = "completed";
const ACTIVE = "active";

export default class extends Controller {
  static targets = ["filter", "task", "activeNumber", "toggleAll"];

  connect() {
    this.initializeFilter();
    this.renderTodos();
    this.renderFilters();
  }

  initializeFilter() {
    const completedParam = new URLSearchParams(window.location.search).get(
      "completed"
    );

    this.filter =
      completedParam === null
        ? ALL
        : completedParam === "true" ? COMPLETED : ACTIVE;
  }

  toggle(event) {
    const todo = event.target.closest("li");
    const form = event.target.closest("form");
    Rails.fire(form, "submit");
    todo.classList.toggle("completed");
    this.setActiveNumber();
    this.renderTodos();
  }

  destroy(event) {
    const todo = event.target.closest("li");
    todo.classList.add("hidden", "completed");
    this.setActiveNumber();
  }

  toggleAll(event) {
    const form = event.target.closest("form");
    Rails.fire(form, "submit");
    const toggle = this.isToggleAll;
    this.taskTargets.forEach(task => {
      task.classList.toggle("completed", toggle);
      task.querySelector(".toggle").checked = toggle;
    });
    this.isToggleAll = !toggle;
    this.setActiveNumber();
  }

  destroyAll() {
    this.completedTaskElements.forEach(task => {
      task.classList.add("hidden");
    });
  }

  selectFilter(event) {
    this.filter = event.target.name;
    this.renderTodos();
    this.renderFilters();
  }

  setActiveNumber() {
    const DOMPurify = createDOMPurify(window);
    const activeNumberStr = `${this.active} ${pluralize(
      "item",
      this.active
    )} left`;
    this.displayActive.innerHTML = DOMPurify.sanitize(activeNumberStr);
  }

  renderTodos() {
    this.taskElements.forEach(element => {
      if (this.filter === ALL) {
        element.classList.remove("hidden");
      } else if (this.filter === COMPLETED) {
        element.classList.toggle(
          "hidden",
          !element.classList.contains("completed")
        );
      } else {
        element.classList.toggle(
          "hidden",
          element.classList.contains("completed")
        );
      }
    });
  }

  renderFilters() {
    this.filterElements.forEach(filter => {
      filter.classList.toggle("selected", filter.name === this.filter);
    });
  }

  set active(value) {
    this.data.set("active", value);
  }

  set filter(name) {
    this.data.set("filter", name);
  }

  set isToggleAll(bool) {
    this.data.set("toggleAll", bool);
  }

  get isToggleAll() {
    if (this.data.has("toggleAll"))
      return this.data.get("toggleAll") === "true";

    if (this.completedTaskElements.length === this.taskElements.length) {
      return false;
    } else {
      return true;
    }
  }

  get filter() {
    if (this.data.has("filter")) {
      return this.data.get("filter");
    } else {
      return;
    }
  }

  get displayActive() {
    return this.activeNumberTarget;
  }

  get active() {
    return this.activeTaskElements.length;
  }

  get taskElements() {
    return this.taskTargets;
  }

  get filterElements() {
    return this.filterTargets;
  }

  get completedTaskElements() {
    return this.taskElements.filter(task => {
      return task.classList.contains("completed");
    });
  }

  get activeTaskElements() {
    return this.taskElements.filter(task => {
      return !task.classList.contains("completed");
    });
  }
}
