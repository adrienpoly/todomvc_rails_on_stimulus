import { ApplicationController } from "stimulus-support";
import Rails from "rails-ujs";

export default class extends ApplicationController {
  submitOnBlur(event) {
    setTimeout(() => {
      if (document.body.contains(event.target)) {
        const form = event.target.closest("form");
        Rails.fire(form, "submit");
      }
    });
    event.target.closest("li").classList.remove("editing");
    this.targets.find("input-form").style.display = "none";
  }

  update(event) {
    this.handleRemote(event.target, this.replaceTodo);
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

  replaceTodo(event) {
    const todoOld = event.target.closest("li");
    const todoNew = event.detail[0].querySelector("li");
    todoOld.parentNode.replaceChild(todoNew, todoOld);
  }
}
