timely.define(["jquery_timely","scripts/calendar_feeds/ics/ics_ajax_handlers","libs/utils","ai1ec_config","external_libs/select2"],function(e,t,n,r){var i=n.get_ajax_url(),s=function(){var s=e(this),o=e("#ai1ec_feed_url"),u=o.val().replace("webcal://","http://"),a=e("#ai1ec_feed_id").val(),f=!1,l;e(".ai1ec-feed-url, #ai1ec_feed_url").css("border-color","#DFDFDF"),e("#ai1ec-feed-error").remove(),a||e(".ai1ec-feed-url").each(function(){this.value===u&&(e(this).css("border-color","#FF0000"),f=!0,l=r.duplicate_feed_message)}),n.isUrl(u)||(f=!0,l=r.invalid_url_message);if(f)o.addClass("input-error").focus().before(n.make_alert(l,"error"));else{s.button("loading");var c=e("#ai1ec_comments_enabled").is(":checked")?1:0,h=e("#ai1ec_map_display_enabled").is(":checked")?1:0,p=e("#ai1ec_add_tag_categories").is(":checked")?1:0,d=e("#ai1ec_keep_old_events").is(":checked")?1:0,v=e("#ai1ec_feed_import_timezone").is(":checked")?1:0,m={action:"ai1ec_add_ics",nonce:r.calendar_feeds_nonce,feed_url:u,feed_category:e("#ai1ec_feed_category").val(),feed_tags:e("#ai1ec_feed_tags").val(),comments_enabled:c,map_display_enabled:h,keep_tags_categories:p,keep_old_events:d,feed_import_timezone:v};e(".ai1ec-feed-field").each(function(){var t=e(this).val();"checkbox"===e(this).attr("type")&&!e(this).prop("checked")&&(t=0),m[e(this).attr("name")]=t}),a&&(m.feed_id=a),e.post(i,m,t.handle_add_new_ics,"json")}},o=function(){var t=e(this),n=t.closest(".ai1ec-feed-container"),r=e("#ai1ec-feeds-after"),i=e("#ai1ec_ics_add_new, #ai1ec_add_new_ics > i"),s=e("#ai1ec_ics_update"),o=(e(".ai1ec-feed-category",n).data("ids")||"").toString(),u=(e(".ai1ec-feed-tags",n).data("ids")||"").toString(),a=e(".ai1ec-cfg-feed",n),f=[];a.each(function(){var t=e(this);f[t.attr("data-group_name")]=t.attr("data-terms")}),e("#ai1ec_feed_url").val(e(".ai1ec-feed-url",n).val()).prop("readonly",!0),e("#ai1ec_comments_enabled").prop("checked",e(".ai1ec-feed-comments-enabled",n).data("state")),e("#ai1ec_map_display_enabled").prop("checked",e(".ai1ec-feed-map-display-enabled",n).data("state")),e("#ai1ec_add_tag_categories").prop("checked",e(".ai1ec-feed-keep-tags-categories",n).data("state")),e("#ai1ec_keep_old_events").prop("checked",e(".ai1ec-feed-keep-old-events",n).data("state")),e("#ai1ec_feed_import_timezone").prop("checked",e(".ai1ec-feed-import-timezone",n).data("state")),i.addClass("ai1ec-hidden"),s.removeClass("ai1ec-hidden"),e('<input type="hidden" id="ai1ec_feed_id" name="ai1ec_feed_id">').val(e(".ai1ec_feed_id",n).val()).appendTo(r),e("#ai1ec_feed_category").select2("val",o.split(",")),e("#ai1ec_feed_tags").select2("val",u.split(","));for(var l in f)e('[id="ai1ec_feed_cfg_'+l.toLowerCase()+'"]').select2("val",f[l].split(",")||f[l]);window.scroll(0,r.offset().top-40)},u=function(n){n.preventDefault();var r=e(this).hasClass("remove")?!0:!1,s=e(e(this).data("el")),o=s.closest(".ai1ec-feed-container"),u=e(".ai1ec_feed_id",o).val(),a={action:"ai1ec_delete_ics",ics_id:u,remove_events:r};s.button("loading"),e("#ai1ec-ics-modal").modal("hide"),e.post(i,a,t.handle_delete_ics,"json")},a=function(){e("#ai1ec-ics-modal .ai1ec-btn").data("el",this),e("#ai1ec-ics-modal").modal({backdrop:"static"})},f=function(){var n=e(this),r=n.closest(".ai1ec-feed-container"),s=e(".ai1ec_feed_id",r).val(),o={action:"ai1ec_update_ics",ics_id:s};n.button("loading"),e.post(i,o,t.handle_update_ics,"json")},l=function(){var t=e(this).val(),n=/.google./i;n.test(t)&&e("#ai1ec_feed_import_timezone").prop("checked",!0)};return{add_new_feed:s,submit_delete_modal:u,open_delete_modal:a,update_feed:f,edit_feed:o,feed_url_change:l}});