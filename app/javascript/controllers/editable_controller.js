import { Controller } from "stimulus";
import Rails from "rails-ujs";

export default class extends Controller {
  submitOnBlur(event) {
    const form = event.target.closest("form");
    Rails.fire(form, "submit");
    event.target.closest("li").classList.remove("editing");
    this.targets.find("input-form").style.display = "none";
  }

  closeOnEsc(event) {
    if (event.target.keyCode === 27) {
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
}
