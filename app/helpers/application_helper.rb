# frozen_string_literal: true

module ApplicationHelper
  # add a hidden field to pass the filter value to preserve it when refreshing the page after an action
  def completed_filter_field
    params = if request.fullpath.match?('completed=false')
               false
             elsif request.fullpath.match?('completed=true')
               true
             end
    hidden_field_tag 'completed_filter', params
  end
end
