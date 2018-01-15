import { Controller } from "stimulus";
import pluralize from "pluralize";

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
    const completed = new URLSearchParams(window.location.search).get(
      "completed"
    );

    this.filter =
      completed == null ? ALL : completed == "true" ? COMPLETED : ACTIVE;
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
    todo.classList.add("hidden");
    this.setActiveNumber();
  }

  toggle_all(_event, form) {
    Rails.fire(form, "submit");
    this.toggleAll = !this.toggleAll;
    this.taskElements.forEach(task => {
      task.classList.toggle("completed", this.toggleAll);
      task.querySelector(".toggle").checked = this.toggleAll;
    });
    this.setActiveNumber();
  }

  destroy_all() {
    this.completedTaskElements.forEach(task => {
      task.classList.add("hidden");
    });
  }

  select_filter(event, target) {
    this.filter = target.name;
    this.renderTodos();
    this.renderFilters();
  }

  private;

  setActiveNumber() {
    this.display_active.innerHTML = `${this.active} ${pluralize(
      "item",
      this.active
    )} left`;
  }

  renderTodos() {
    this.taskElements.forEach(element => {
      if (this.filter == ALL) {
        element.classList.remove("hidden");
      } else if (this.filter == COMPLETED) {
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
      filter.classList.toggle("selected", filter.name == this.filter);
    });
  }

  set active(value) {
    this.data.set("active", value);
  }

  set filter(name) {
    this.data.set("filter", name);
  }

  set toggleAll(bool) {
    this.data.set("toggle_all", bool);
  }

  get toggleAll() {
    return this.data.get("toggle_all") == "true";
  }

  get filter() {
    if (this.data.has("filter")) {
      return this.data.get("filter");
    } else {
      return;
    }
  }

  get display_active() {
    return this.targets.find("active_number");
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
