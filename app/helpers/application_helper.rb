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

  def editable_field(object, method, options = {})
    form_html_options = {
      data: {
        controller: "editable",
        "editable-id": object.id
        }
    }

    label_html_options = {
      class: "toggle-me",
      data: {
        target: "editable.title",
        action: "dblclick->editable#edit"
      }
    }



    content_tag :div, form_html_options do
      concat content_tag :label, raw(object.send(method)), label_html_options
      concat form(object, method)
    end
  end

  private

  def form(object, method)
    form_html = {
      data: {
        target: "editable.inputForm"
      },
      html: {
        class: "toggle-me todo-title",
        style: "display: none"
      }
    }

    text_field_html_options = {
      class: "edit",
      data: {
        action: 'blur->editable#submit keydown->editable#keydown',
        target: "editable.input"
      }
    }

    form_with model: object, **form_html do |form|
      form.text_field(method, text_field_html_options)
    end
  end
end

# <div data-controller="editable" data-editable-id="<%= todo.id %>">
# <label class="toggle-me" data-target="editable.title" data-action=" dblclick->editable#edit"><%= raw todo.title %></label>
# <%= form_with model: todo,
#               data: {
#                 target: "editable.inputForm"
#               },
#               html: {
#                 class: "toggle-me todo-title",
#                 style: "display: none" } do |f|%>
#
#     <%= f.text_field :title,
#         class: "edit",
#         data: {
#           action: 'blur->editable#submit keydown->editable#keydown',
#           target: "editable.input"
#         },
#         autocomplete: "off" %>
# <% end %>
