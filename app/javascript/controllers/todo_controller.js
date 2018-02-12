import { ApplicationController } from "stimulus-support";
import pluralize from "pluralize";
import Turbolinks from "turbolinks";
import Rails from "rails-ujs";
import createDOMPurify from "dompurify";

const ALL = "all";
const COMPLETED = "completed";
const ACTIVE = "active";

export default class extends ApplicationController {
  static targets = [
    "filter",
    "task",
    "activeNumber",
    "toggleAll",
    "updateManyTodos",
    "filtersActions",
    "destroyManyTodos",
    "todos"
  ];

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

  create(event) {
    const form = event.target.closest("form");
    this.handleRemote(form, successEvent => {
      this.replaceTodos(successEvent);
      const todoTitle = this.targets.find("todo-title");
      todoTitle.value = "";
      todoTitle.focus();
      this.filtersActionsTarget.classList.remove("hidden");
    });
  }

  toggle(event) {
    const form = event.target.closest("form");
    this.handleRemote(form, successEvent => {
      const editableController = this.getControllerByIdentifier("editable");
      editableController.replaceTodo(successEvent);
      this.renderTodos();
      this.setActiveNumber();
    });
    Rails.fire(form, "submit");
  }

  destroy(event) {
    const form = event.target;
    const todo = event.target.closest("li");
    this.handleRemote(form, successEvent => {
      todo.remove();
      this.renderSelectAll();
      this.renderClearCompleted();
      this.setActiveNumber();
    });
  }

  toggleAll(event) {
    const form = event.target.closest("form");
    this.handleRemote(form, this.replaceTodos);
    Rails.fire(form, "submit");
  }

  destroyAll() {
    this.completedTaskElements.forEach(task => {
      task.classList.add("hidden");
    });
    Turbolinks.clearCache();
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
    this.renderSelectAll();
    this.renderClearCompleted();
  }

  renderFilters() {
    this.filterElements.forEach(filter => {
      filter.classList.toggle("selected", filter.name === this.filter);
    });
  }

  renderClearCompleted() {
    const form = this.destroyManyTodosTarget;
    this.renderHiddenIds(form, this.completedTaskElements);
  }

  renderSelectAll() {
    this.renderHiddenIds(this.updateManyTodosTarget);
    this.toggleAllTarget.checked =
      this.taskElements.length === this.completedTaskElements.length;
  }

  renderHiddenIds(form, tasks = this.taskElements) {
    const DOMPurify = createDOMPurify(window);
    form.classList.toggle("hidden", tasks.length === 0);
    const oldHiddenIds = form.querySelectorAll(
      "input[type='hidden'][name='ids[]']"
    );
    oldHiddenIds.forEach(hiddenId => hiddenId.remove());

    const hiddenIdTemplate = form.querySelector(
      "input[type='hidden'][name='template_ids[]']"
    );
    tasks.forEach(element => {
      const newHiddenId = hiddenIdTemplate.cloneNode();
      newHiddenId.setAttribute("name", "ids[]");
      newHiddenId.value = DOMPurify.sanitize(element.getAttribute("data-id"));
      form.append(newHiddenId);
    });
    const completedFilter = form.querySelector("[name='completed_filter']");
    let value;
    if (this.filter === COMPLETED) {
      value = true;
    } else if (this.filter === ACTIVE) {
      value = false;
    }
    completedFilter.value = value;
  }

  replaceTodos(event) {
    const todosOld = this.todosTarget;
    const todosNew = event.detail[0].querySelector("#todos");
    todosOld.parentNode.replaceChild(todosNew, todosOld);

    this.connect();
    this.setActiveNumber();
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
    return this.data.get("toggleAll") === "true";
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
