import { Controller } from "stimulus";

export class ApplicationController extends Controller {
  getControllerByIdentifier(identifier) {
    return this.application.controllers.find(controller => {
      return controller.context.identifier === identifier;
    });
  }
}
