import { Controller } from "stimulus";

export default class extends Controller {
  submit_on_blur(_event, target) {
    Rails.fire(target, "submit");
    target.closest("li").classList.remove("editing");
    this.targets.find("input-form").style.display = "none";
  }

  close_on_esc(event, target) {
    if (event.keyCode == 27) {
      target.blur();
      target.closest("li").classList.remove("editing");
      this.targets.find("input-form").style.display = "none";
    }
  }

  edit_on_dbClick(event, target) {
    target.closest("li").classList.add("editing");
    this.targets.find("input-form").style.display = "block";
    this.targets.find("input").focus();
  }
}
