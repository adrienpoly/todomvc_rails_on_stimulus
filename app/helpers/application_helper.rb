module ApplicationHelper

  # add a hidden field to pass the filter value to preserve it when refreshing the page after an action
  def completed_filter_field
    if request.fullpath.match("completed=false")
      params = false
    elsif request.fullpath.match("completed=true")
      params = true
    else
      params = nil
    end
    hidden_field_tag "completed_filter", params
  end
end
