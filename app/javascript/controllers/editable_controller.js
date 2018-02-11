import { ApplicationController } from "stimulus-support";
import Rails from "rails-ujs";

export default class extends ApplicationController {
  static targets = ["inputForm", "input", "title"];

  submitOnBlur(event) {
    if (this.isCanceled) return;

    //setTimeout to prevent bug in Chrome
    setTimeout(() => {
      const form = event.target.closest("form");
      Rails.fire(form, "submit");
    });

    this.element.closest("li").classList.remove("editing");
    this.titleTarget.innerHTML = this.inputTarget.value;
    this.inputFormTarget.style.display = "none";
  }

  update(event) {
    this.handleRemote(this.element, this.replaceTodo);
  }

  closeOnEsc(event) {
    if (event.keyCode === 27) {
      this.data.set("isCanceled", true);
      this.inputTarget.value = this.titleTarget.innerHTML;
      this.element.closest("li").classList.remove("editing");
      this.inputFormTarget.style.display = "none";
    }
  }

  editOnDbClick(event) {
    this.element.closest("li").classList.add("editing");
    this.inputFormTarget.style.display = "block";
    this.inputTarget.focus();
  }

  replaceTodo(event) {
    const todoOld = event.target.closest("li");
    const todoNew = event.detail[0].querySelector("li");
    todoOld.parentNode.replaceChild(todoNew, todoOld);
  }

  get isCanceled() {
    return this.data.set("isCanceled") === "true";
  }
}
