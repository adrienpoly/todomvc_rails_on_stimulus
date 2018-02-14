import { ApplicationController } from "stimulus-support";
import Rails from "rails-ujs";
import createDOMPurify from "dompurify";

export default class extends ApplicationController {
  static targets = ["inputForm", "input", "title"];

  submitOnBlur(event) {
    if (this.isCanceled) {
      return;
    }

    //setTimeout to prevent bug in Chrome
    setTimeout(() => {
      const form = event.target.closest("form");
      Rails.fire(form, "submit");
    });

    this.element.closest("li").classList.remove("editing");
    const DOMPurify = createDOMPurify(window);
    this.titleTarget.innerHTML = DOMPurify.sanitize(this.inputTarget.value);
    this.inputFormTarget.style.display = "none";
  }

  update(event) {
    const todoOld = event.target.closest("li");
    const todoNew = event.detail[0].querySelector("li");
    todoOld.parentNode.replaceChild(todoNew, todoOld);
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

  get isCanceled() {
    return this.data.get("isCanceled") === "true";
  }
}
