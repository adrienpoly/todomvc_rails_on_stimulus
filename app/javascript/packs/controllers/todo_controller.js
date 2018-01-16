import { Controller } from "stimulus";
import pluralize from "pluralize";
import Rails from "rails-ujs";
import createDOMPurify from "dompurify";

const ALL = "all";
const COMPLETED = "completed";
const ACTIVE = "active";

export default class extends Controller {
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

  toggle(_event, form) {
    const todo = form.closest("li");
    Rails.fire(form, "submit");
    todo.classList.toggle("completed");
    this.setActiveNumber();
    this.renderTodos();
  }

  destroy(_event, form) {
    const todo = form.closest("li");
    todo.classList.add("hidden", "completed");
    this.setActiveNumber();
  }

  toggleAll(_event, form) {
    Rails.fire(form, "submit");
    this.isToggleAll = !this.isToggleAll;
    this.taskElements.forEach(task => {
      task.classList.toggle("completed", this.isToggleAll);
      task.querySelector(".toggle").checked = this.isToggleAll;
    });
    this.setActiveNumber();
  }

  destroyAll() {
    this.completedTaskElements.forEach(task => {
      task.classList.add("hidden");
    });
  }

  selectFilter(event, target) {
    this.filter = target.name;
    this.renderTodos();
    this.renderFilters();
  }

  private;

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
    this.data.set("toggle-all", bool);
  }

  get isToggleAll() {
    return this.data.get("toggle-all") === "true";
  }

  get filter() {
    if (this.data.has("filter")) {
      return this.data.get("filter");
    } else {
      return;
    }
  }

  get displayActive() {
    return this.targets.find("active-number");
  }

  get active() {
    return this.activeTaskElements.length;
  }

  get taskElements() {
    return this.targets.findAll("task");
  }

  get filterElements() {
    return this.targets.findAll("filter");
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
