timely.define(["jquery_timely","domReady","ai1ec_config","scripts/add_new_event/event_location/gmaps_helper","scripts/add_new_event/event_location/input_coordinates_event_handlers","scripts/add_new_event/event_location/input_coordinates_utility_functions","scripts/add_new_event/event_date_time/date_time_event_handlers","scripts/add_new_event/event_cost_helper","external_libs/jquery.calendrical_timespan","external_libs/jquery.inputdate","external_libs/jquery.tools","external_libs/jquery.blockui","external_libs/ai1ec_datepicker","external_libs/bootstrap/transition","external_libs/bootstrap/collapse"],function(e,t,n,r,i,s,o,u,a){var f=function(){var t=new Date(n.now*1e3),r={allday:"#ai1ec_all_day_event",start_date_input:"#ai1ec_start-date-input",start_time_input:"#ai1ec_start-time-input",start_time:"#ai1ec_start-time",end_date_input:"#ai1ec_end-date-input",end_time_input:"#ai1ec_end-time-input",end_time:"#ai1ec_end-time",date_format:n.date_format,month_names:n.month_names,day_names:n.day_names,week_start_day:n.week_start_day,twentyfour_hour:n.twentyfour_hour,now:t};e.timespan(r);var i=e("#ai1ec_exdate").val(),s=null,o=!1,u;if(i.length>=8){s=[];var f=[];e.each(i.split(","),function(e,t){var r=t.slice(0,8),i=r.substr(0,4),o=r.substr(4,2);u=r.substr(6,2),o=o.charAt(0)==="0"?"0"+(parseInt(o.charAt(1),10)-1):parseInt(o,10)-1,s.push(new Date(i,o,u)),f.push(a.formatDate(new Date(i,o,u),n.date_format,!0))}),e("#widgetField span:first").html(f.join(", "))}else s=new Date(n.now*1e3),o=!0;e("#widgetCalendar").DatePicker({flat:!0,calendars:3,mode:"multiple",start:1,date:s,onChange:function(t){t=t.toString();if(t.length>=8){var r="",i=[];e.each(t.split(","),function(e,t){i.push(a.formatDate(new Date(t),n.date_format)),r+=t.replace(/-/g,"")+"T000000Z,"}),e("#widgetField span").html(i.join(", ")),r=r.slice(0,r.length-1),e("#ai1ec_exdate").val(r)}else e("#ai1ec_exdate").val("")}}),o&&e("#widgetCalendar").DatePickerClear(),e("#widgetCalendar div.datepicker").css("position","absolute")},l=function(){e(".ai1ec-panel-collapse").on("hide",function(){e(this).removeClass("ai1ec-overflow-visible")}),e(".ai1ec-panel-collapse").on("shown",function(){var t=e(this);window.setTimeout(function(){t.addClass("ai1ec-overflow-visible")},350)})},c=function(){f(),timely.require(["libs/gmaps"],function(e){e(r.init_gmaps)})},h=function(t,n){window.alert(n),t.preventDefault(),e("#publish, #ai1ec_bottom_publish").removeClass("button-primary-disabled"),e("#publish, #ai1ec_bottom_publish").siblings("#ajax-loading, .spinner").css("visibility","hidden")},p=function(t){s.ai1ec_check_lat_long_fields_filled_when_publishing_event(t)===!0&&(s.ai1ec_convert_commas_to_dots_for_coordinates(),s.ai1ec_check_lat_long_ok_for_search(t)),e("#ai1ec_ticket_url, #ai1ec_contact_url").each(function(){var e=this.value;if(""!==e){var r=/(http|https):\/\//;r.test(e)||h(t,n.url_not_valid)}})},d=function(){e("#ai1ec_google_map").click(i.toggle_visibility_of_google_map_on_click),e("#ai1ec_input_coordinates").change(i.toggle_visibility_of_coordinate_fields_on_click),e("#post").submit(p),e("input.coordinates").blur(i.update_map_from_coordinates_on_blur),e("#ai1ec_end").on("change",o.show_end_fields),e("#ai1ec_bottom_publish").on("click",o.trigger_publish),e(".ai1ec_tab").on("click",o.handle_click_on_tab_modal),e(".ai1ec_repeat_apply").on("click",o.handle_click_on_apply_button),e("a.ai1ec_repeat_cancel").on("click",o.handle_click_on_cancel_modal),e("#ai1ec_monthly_type_bymonthday, #ai1ec_monthly_type_byday").on("click",o.handle_checkbox_monthly_tab_modal),e("#widgetField > a, #widgetField > span, #ai1ec_exclude_date_label").on("click",o.handle_animation_of_calendar_widget),e("#ai1ec_weekly_date_select > li, #ai1ec_montly_date_select > li, #ai1ec_yearly_date_select > li").on("click",o.handle_click_on_day_month_in_modal),e("#ai1ec_is_free").on("change",u.handle_change_is_free),o.execute_pseudo_handlers()},v=function(){e("#ai1ec_event").insertAfter("#titlediv"),e("#post").addClass("ai1ec-visible")},m=function(){c(),t(function(){l(),v(),d()})};return{start:m}});