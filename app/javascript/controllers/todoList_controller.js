import { ApplicationController } from "../support/application-controller";
import pluralize from "pluralize";
import safetext from "../support/safetext";

const ALL = "all";
const COMPLETED = "completed";
const ACTIVE = "active";

export default class extends ApplicationController {
  static targets = [
    "filter",
    "task",
    "activeNumber",
    "toggleAll",
    "clearCompleted",
    "footer",
    "input",
    "alert"
  ];

  connect() {
    this.initializeFilter();
    this.render();
    this.hideAlert();
  }

  toggleAll(event) {
    const toggle = this.isToggleAll;
    this.railsUpdate("update_many", "toggle", toggle);
    this.taskTargets.forEach(task => {
      task.classList.toggle("completed", toggle);
      task.querySelector(".toggle").checked = toggle;
    });
    this.isToggleAll = !toggle;
    this.render();
  }

  destroyAll() {
    this.completedTaskElements.forEach(task => {
      task.remove();
    });
    this.railsDelete("destroy_many");
    this.render();
  }

  render() {
    this.setActiveNumber();
    this.renderClearCompleted();
    this.renderFooter();
    this.renderTodos();
    this.renderFilters();
    this.inputTarget.focus();
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

  selectFilter(event) {
    this.filter = event.target.name;
    this.renderTodos();
    this.renderFilters();
  }

  setActiveNumber() {
    const activeNumberStr = `${this.active} ${pluralize(
      "item",
      this.active
    )} left`;
    this.displayActive.innerHTML = safetext(activeNumberStr);
  }

  hideAlert() {
    if (this.hasAlertTarget) {
      window.setTimeout(() => {
        this.alertTarget.remove();
      }, 6000);
    }
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

  renderFooter() {
    this.footerTarget.classList.toggle(
      "hidden",
      this.taskElements.length === 0
    );
  }

  renderFilters() {
    this.filterElements.forEach(filter => {
      filter.classList.toggle("selected", filter.name === this.filter);
    });
  }

  renderClearCompleted() {
    this.clearCompletedTarget.classList.toggle(
      "hidden",
      this.completedTaskElements.length === 0
    );
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
    if (this.data.has("toggleAll")) {
      return this.data.get("toggleAll") === "true";
    } else if (this.completedTaskElements.length === this.taskElements.length) {
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
