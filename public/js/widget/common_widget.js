timely.require(["scripts/calendar","scripts/calendar/load_views","scripts/event","scripts/common_scripts/frontend/common_frontend","domReady","jquery_timely","ai1ec_calendar","ai1ec_config","libs/utils","libs/gmaps"],function(e,t,n,r,i,s,o,u,a){if(window.timely.js_widgets_inited)return;window.timely.js_widgets_inited=1;var f='<h2 class="ai1ec-widget-loading ai1ec-text-center"><small>			<i class="ai1ec-fa ai1ec-fa-lg ai1ec-fa-fw ai1ec-fa-spin				ai1ec-fa-spinner"></i> '+u.calendar_loading+"</small></h2>",l=function(e){e.find(".ai1ec-widget-loading").fadeOut("slow",function(){s(this).remove()})},c=function(e){var t=u.javascript_widgets[e.widget];if(!t)return!1;var n=(e.widget.match(/superwidget/)?o.calendar_url:u.site_url)+"?ai1ec_js_widget="+e.widget+"&render=true";s.each(t,function(t,r){undefined!==e[t]&&(n+="&"+t+"="+e[t])});var r=location.hash.match(/view\|(.+)/);return r&&e.widget.match(/superwidget/)&&(n=o.calendar_url+r[1].replace(/\|/g,"/"),history.pushState(null,document.title,location.pathname)),n},h=function(e,t,n,r){var i=s(this),t=t||i.attr("href"),o="jsonp",u=i.closest(".timely"),c={request_type:o,ai1ec_doing_ajax:!0,ai1ec:a.create_ai1ec_to_send(u)},h=s("#ai1ec-event-modal"),p=i.closest(".ai1ec-event").length?i.closest(".ai1ec-event"):i,n=n||p.attr("class").match(/ai1ec-event-instance-id-(\d+)/)[1],r=r||function(){var e=t.match(/\/event\/([\w-]+)/);return e||(e=t.match(/\?ai1ec_event=([\w-]+)&/)),e?e[1]:undefined},d="#event|"+r()+"|"+n;return h.modal("show").find(".ai1ec-modal-body").html(f),s(".ai1ec-popup").hide(),location.hash!=d&&History.pushState(n,r,d),s.ajax({url:t,dataType:o,data:c,method:"get",crossDomain:!0,success:function(e){h.modal("show").find(".ai1ec-modal-body").append(e.html),s(".ai1ec-subscribe-container",h).hide(),s("a.ai1ec-category, a.ai1ec-tag",h).each(function(){s(this).removeAttr("href")}),s(".ai1ec-calendar-link",h).attr("data-dismiss","ai1ec-modal"),timely.require(["scripts/event"],function(e){e.start()})},complete:function(){l(h)}}),!1},p=function(){s(".ai1ec-load-view, .ai1ec-clear-filter").each(function(){var e=s(this),t=e.closest(".timely-widget").attr("data-widget-type"),n=e.attr("href")||e.attr("data-href"),r=a.add_query_arg(n,["ai1ec_source",t]);e.attr({href:r,"data-href":r})})};i(function(){s("#ai1ec-event-modal").length||s("body").append('<div id="ai1ec-event-modal" class="timely ai1ec-modal ai1ec-fade"					role="dialog" aria-hidden="true" tabindex="-1">					<div class="ai1ec-modal-dialog">						<div class="ai1ec-modal-content">							<button data-dismiss="ai1ec-modal" class="ai1ec-close ai1ec-pull-right">&times;</button>							<div class="ai1ec-modal-body ai1ec-clearfix single-ai1ec_event">							</div>						</div>					</div>				</div>');var t=s('[data-widget^="ai1ec"]').not("[data-added]").map(function(t,n){var r=s(n),i=r.data("widget"),o=s("<div />",{"class":"timely timely-widget"+(i.match(/ai1ec(_|-)superwidget/)?" timely-calendar":"")}).attr("data-widget-type",i).html(f).insertAfter(r),u=c(r.data()),p={ai1ec_doing_ajax:!0,request_type:"jsonp",ai1ec:a.create_ai1ec_to_send(n),ai1ec_source:i};return!1===u?(r.remove(),o.remove(),!1):(o.on("click",".ai1ec-cog-item-name a",h),s.ajax({url:u,dataType:"jsonp",data:p,success:function(t){o.append(t.html),r.attr("data-added",1),e.initialize_view(o.find(".ai1ec-calendar"))},error:function(){o.append("<p>An error occurred while retrieving the data.</p>")},complete:function(){l(o)}}))}).get();s.when.apply(s,t).done(function(){r.are_event_listeners_attached()||r.start(),s.each(o.extension_urls,function(e,t){timely.require([t.url])}),p(),top.postMessage("ai1ec-widget-loaded",top.document.URL),s(document).trigger("page_ready.ai1ec").data("ai1ec-widget-loaded",1)});var n=document.title;s(document).on("click","a.ai1ec-load-event",h).on("initialize_view.ai1ec",p).on("hide.bs.modal","#ai1ec-event-modal",function(){location.hash&&history.pushState(null,n,location.pathname)});var i=function(){var e=view_hash=location.hash;e=e.match(/event\|([\w-]+)\|(\d+)/),view_hash=view_hash.match(/view\|(.+)/),e?(event_name=function(){return e[1]},instance_id=e[2],o.permalinks_structure?href=u.site_url+"event/"+event_name()+"/?instance_id="+instance_id:href=u.site_url+"?ai1ec_event="+event_name()+"&instance_id="+instance_id,h(null,href,instance_id,event_name)):view_hash||s("#ai1ec-event-modal").modal("hide")};i(),History.Adapter.bind(window,"popstate",function(e){e.originalEvent&&i()})})});