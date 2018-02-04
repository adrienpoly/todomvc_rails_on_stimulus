import { Controller } from "stimulus";

export class ApplicationController extends Controller {
  handleRemote(element, successCallback) {
    if (successCallback && typeof successCallback === "function") {
      const success = event => {
        successCallback(event, this);
      };
      element.addEventListener("ajax:success", success, {once: true});
    }
  }

  getControllerByIdentifier(identifier) {
    return this.application.controllers.find(controller => {
      return controller.context.identifier === identifier;
    });
  }
}
