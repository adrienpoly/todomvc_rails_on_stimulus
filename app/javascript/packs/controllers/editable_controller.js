import { Controller } from "stimulus";
import Rails from "rails-ujs";

export default class extends Controller {
  submitOnBlur(_event, target) {
    Rails.fire(target, "submit");
    target.closest("li").classList.remove("editing");
    this.targets.find("input-form").style.display = "none";
  }

  closeOnEsc(event, target) {
    if (event.keyCode === 27) {
      target.blur();
      target.closest("li").classList.remove("editing");
      this.targets.find("input-form").style.display = "none";
    }
  }

  editOnDbClick(event, target) {
    target.closest("li").classList.add("editing");
    this.targets.find("input-form").style.display = "block";
    this.targets.find("input").focus();
  }
}
