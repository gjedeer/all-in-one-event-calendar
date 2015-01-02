timely.define(["jquery_timely","domReady","ai1ec_config","scripts/add_new_event/event_location/gmaps_helper","scripts/add_new_event/event_location/input_coordinates_event_handlers","scripts/add_new_event/event_location/input_coordinates_utility_functions","scripts/add_new_event/event_date_time/date_time_event_handlers","scripts/add_new_event/event_cost_helper","external_libs/jquery.calendrical_timespan","external_libs/jquery.inputdate","external_libs/jquery.tools","external_libs/ai1ec_datepicker","external_libs/bootstrap_datepicker","external_libs/bootstrap/transition","external_libs/bootstrap/collapse","external_libs/bootstrap/modal","external_libs/bootstrap/alert","external_libs/bootstrap/tab","external_libs/select2"],function(e,t,n,r,i,s,o,u,a){var f=function(){var t=new Date(n.now*1e3),r={allday:"#ai1ec_all_day_event",start_date_input:"#ai1ec_start-date-input",start_time_input:"#ai1ec_start-time-input",start_time:"#ai1ec_start-time",end_date_input:"#ai1ec_end-date-input",end_time_input:"#ai1ec_end-time-input",end_time:"#ai1ec_end-time",date_format:n.date_format,month_names:n.month_names,day_names:n.day_names,week_start_day:n.week_start_day,twentyfour_hour:n.twentyfour_hour,now:t};e.timespan(r);var i=e("#ai1ec_exdate").val(),s=null,o;if(i.length>=8){s=[];var u=[];e.each(i.split(","),function(e,t){var r=t.slice(0,8),i=r.substr(0,4),o=r.substr(4,2),f=r.substr(6,2),o=o.charAt(0)==="0"?"0"+(parseInt(o.charAt(1),10)-1):parseInt(o,10)-1;s.push(new Date(i,o,f)),u.push(a.formatDate(new Date(i,o,f),n.date_format,!0))}),e("#ai1ec_exclude-dates-input").text(u.join(", "))}else e("#ai1ec_exclude-dates-input").text(e("#ai1ec_exclude-dates-input").data("placeholder"));var f=e("#ai1ec_widget_calendar");f.datepicker({multidate:!0,weekStart:n.week_start_day}),s&&(s.unshift("setDates"),f.datepicker.apply(f,s)),f.on("changeDate",function(t){var r=[],i=[];for(var s=0;s<t.dates.length;s++){var o=new Date(t.dates[s]),u=""+o.getFullYear()+("0"+(o.getMonth()+1)).slice(-2)+("0"+o.getDate()).slice(-2)+"T000000Z",f=a.formatDate(o,n.date_format,!0);r.push(u),i.push(f)}e("#ai1ec_exclude-dates-input").text(i.join(", ")),e("#ai1ec_exdate").val(r.join(","))}),e(document).on("mousedown.exclude",function(t){var n=e("#ai1ec_widget_calendar"),r=e("#ai1ec_exclude-dates-input");!n.is(t.target)&&!r.is(t.target)&&0===n.has(t.target).length&&e("#ai1ec_widget_calendar").hide()})},l=function(){e(".ai1ec-panel-collapse").on("hide",function(){e(this).parent().removeClass("ai1ec-overflow-visible")}),e(".ai1ec-panel-collapse").on("shown",function(){var t=e(this);window.setTimeout(function(){t.parent().addClass("ai1ec-overflow-visible")},350)})},c=function(){f(),timely.require(["libs/gmaps"],function(e){e(r.init_gmaps)})},h=function(t,n){var r=null;"[object Array]"===Object.prototype.toString.call(n)?r=n.join("<br>"):r=n,e("#ai1ec_event_inline_alert").html(r),e("#ai1ec_event_inline_alert").removeClass("ai1ec-hidden"),t.preventDefault(),e("#publish, #ai1ec_bottom_publish").removeClass("button-primary-disabled"),e("#publish, #ai1ec_bottom_publish").removeClass("disabled"),e("#publish, #ai1ec_bottom_publish").siblings("#ajax-loading, .spinner").css("visibility","hidden")},p=function(t){s.ai1ec_check_lat_long_fields_filled_when_publishing_event(t)===!0&&(s.ai1ec_convert_commas_to_dots_for_coordinates(),s.ai1ec_check_lat_long_ok_for_search(t));var r=!1,i=[];e("#ai1ec_ticket_url, #ai1ec_contact_url").each(function(){var t=this.value;e(this).removeClass("ai1ec-input-warn"),e(this).closest(".ai1ec-panel-collapse").parent().find(".ai1ec-panel-heading .ai1ec-fa-warning").addClass("ai1ec-hidden").parent().css("color","");if(""!==t){var s=/(http|https):\/\//;if(!s.test(t)){e(this).closest(".ai1ec-panel-collapse").parent().find(".ai1ec-panel-heading .ai1ec-fa-warning").removeClass("ai1ec-hidden").parent().css("color","rgb(255, 79, 79)"),r||e(this).closest(".ai1ec-panel-collapse").collapse("show"),r=!0;var o=e(this).attr("id")+"_not_valid";i.push(n[o]),e(this).addClass("ai1ec-input-warn")}}}),r&&(i.push(n.general_url_not_valid),h(t,i))},d=function(){e("#ai1ec_google_map").click(i.toggle_visibility_of_google_map_on_click),e("#ai1ec_input_coordinates").change(i.toggle_visibility_of_coordinate_fields_on_click),e("#post").submit(p),e("input.coordinates").blur(i.update_map_from_coordinates_on_blur),e("#ai1ec_bottom_publish").on("click",o.trigger_publish),e(document).on("change","#ai1ec_end",o.show_end_fields).on("click","#ai1ec_repeat_apply",o.handle_click_on_apply_button).on("click","#ai1ec_repeat_cancel",o.handle_click_on_cancel_modal).on("click","#ai1ec_monthly_type_bymonthday, #ai1ec_monthly_type_byday",o.handle_checkbox_monthly_tab_modal).on("click",".ai1ec-btn-group-grid a",o.handle_click_on_toggle_buttons),e("#ai1ec_repeat_box").on("hidden.bs.modal",o.handle_modal_hide),o.execute_pseudo_handlers(),e("#widgetField > a").on("click",o.handle_animation_of_calendar_widget),e("#ai1ec_is_free").on("change",u.handle_change_is_free),e(document).on("click",".ai1ec-set-banner-image",v),e(document).on("click",".ai1ec-remove-banner",m)},v=function(){var t={};return t._frame=wp.media({state:"featured-image",states:[new wp.media.controller.FeaturedImage,new wp.media.controller.EditImage]}),t._frame.open(),e(".media-frame:last ").addClass("ai1ec-banner-image-frame"),e(".media-frame-title:last h1").text(e(".ai1ec-set-banner-block .ai1ec-set-banner-image").text()),e(".media-frame-toolbar:last").append(e(".ai1ec-media-toolbar").clone().removeClass("ai1ec-media-toolbar ai1ec-hidden")),e(".ai1ec-save-banner-image").off().on("click",function(){var n=e(".attachments:visible li.selected img").attr("src"),r=e(".attachment-details:visible input[type=text]").val();return n&&r&&e("#ai1ec_event_banner .inside").find(".ai1ec-banner-image-block").removeClass("ai1ec-hidden").find("img").attr("src",n).end().find("input").val(r).end().end().find(".ai1ec-set-banner-block").addClass("ai1ec-hidden").end().find(".ai1ec-remove-banner-block").removeClass("ai1ec-hidden"),t._frame.close(),!1}),!1},m=function(){return e("#ai1ec_event_banner .inside").find(".ai1ec-remove-banner-block").addClass("ai1ec-hidden").end().find(".ai1ec-banner-image-block").addClass("ai1ec-hidden").find("input").val("").end().find("img").attr("src","").end().end().find(".ai1ec-set-banner-block").removeClass("ai1ec-hidden"),!1},g=function(){e("#ai1ec_event").insertAfter("#ai1ec_event_inline_alert"),e("#post").addClass("ai1ec-visible")},y=function(){e("#timezone-select").select2()},b=function(){c(),t(function(){l(),g(),d(),y()})};return{start:b}});