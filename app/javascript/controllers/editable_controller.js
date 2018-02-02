import { Controller } from "stimulus";
import Rails from "rails-ujs";

export default class extends Controller {
  submitOnBlur(event) {
    const form = event.target.closest("form");
    Rails.fire(form, "submit");
    event.target.closest("li").classList.remove("editing");
    this.targets.find("input-form").style.display = "none";
  }

  update(event) {
    const form = event.target;
    this.handleSubmit(form);
  }

  closeOnEsc(event) {
    if (event.keyCode === 27) {
      event.target.blur();
      event.target.closest("li").classList.remove("editing");
      this.targets.find("input-form").style.display = "none";
    }
  }

  editOnDbClick(event) {
    event.target.closest("li").classList.add("editing");
    this.targets.find("input-form").style.display = "block";
    this.targets.find("input").focus();
  }

  handleSubmit(form, callback = () => {}) {
    const todoController = this.controllerByIdentifier('todo');
    const success = event => {
      const todosOld = document.querySelector("#todos");
      const todosNew = event.detail[0].querySelector("#todos");
      todosOld.parentNode.replaceChild(todosNew, todosOld);

      callback();
      todoController.connect();
      form.removeEventListener("ajax:success", success);
    };
    form.addEventListener("ajax:success", success);
  }

  controllerByIdentifier(identifier) {
    return this.application.controllers.find(controller => {
      return controller.context.identifier === identifier;
    });
  }
}
