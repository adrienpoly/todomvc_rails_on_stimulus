import { Controller } from "stimulus";

export default class extends Controller {
  submit_on_change(_event, form) {
    Rails.fire(form, "submit");
  }

  submit_on_blur(_event, form) {
    Rails.fire(form, "submit");
  }

  edit_on_dbClick(event, target) {
    console.log("edit_onDBCLICK", target);
    const task = this.targets.find("task");
    console.log("task", task);
  }
}
