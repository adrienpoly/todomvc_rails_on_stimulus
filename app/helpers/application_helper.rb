module ApplicationHelper

  # add a hidden field to pass the filter value to preserve it when refreshing the page after an action
  def completed_filter_field
    path = request.fullpath
    params = path.match("completed=false") ? false : path.match("completed=true") ? true : nil
    hidden_field_tag "completed_filter", params
  end
end
