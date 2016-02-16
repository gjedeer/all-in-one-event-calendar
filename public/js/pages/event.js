/**
 * @license RequireJS domReady 2.0.0 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */

timely.define("domReady",[],function(){function u(e){var t;for(t=0;t<e.length;t++)e[t](n)}function a(){var e=r;t&&e.length&&(r=[],u(e))}function f(){t||(t=!0,o&&clearInterval(o),a())}function c(e){return t?e(n):r.push(e),c}var e=typeof window!="undefined"&&window.document,t=!e,n=e?document:null,r=[],i,s,o;if(e){if(document.addEventListener)document.addEventListener("DOMContentLoaded",f,!1),window.addEventListener("load",f,!1);else if(window.attachEvent){window.attachEvent("onload",f),s=document.createElement("div");try{i=window.frameElement===null}catch(l){}s.doScroll&&i&&window.external&&(o=setInterval(function(){try{s.doScroll(),f()}catch(e){}},30))}(document.readyState==="complete"||document.readyState==="interactive")&&f()}return c.version="2.0.0",c.load=function(e,t,n,r){r.isBuild?n(null):c(n)},c}),timely.define("scripts/event/gmaps_helper",["jquery_timely"],function(e){var t=function(){var t=e("#ai1ec-gmap-address")[0].value.split(","),n=parseFloat(t[0]),r=parseFloat(t[1]),i=new google.maps.LatLng(n,r),s={zoom:14,mapTypeId:google.maps.MapTypeId.ROADMAP,scrollwheel:!1},o=new google.maps.Map(e("#ai1ec-gmap-canvas")[0],s),u=new google.maps.Marker({map:o}),a=new google.maps.Geocoder;n&&r&&i?(o.setCenter(i),u.setPosition(i)):a.geocode({address:e("#ai1ec-gmap-address")[0].value},function(e,t){t===google.maps.GeocoderStatus.OK&&(o.setCenter(e[0].geometry.location),u.setPosition(e[0].geometry.location))})},n=function(){var t=e(".ai1ec-gmap-container-hidden:first");e(this).remove(),t.hide(),t.removeClass("ai1ec-gmap-container-hidden"),t.fadeIn()};return{handle_show_map_when_clicking_on_placeholder:n,init_gmaps:t}}),timely.define("scripts/event",["jquery_timely","domReady","ai1ec_config","scripts/event/gmaps_helper"],function(e,t,n,r){var i=function(){e("#ai1ec-gmap-canvas").length>0&&timely.require(["libs/gmaps"],function(e){e(r.init_gmaps)})},s=function(){e(".ai1ec-gmap-placeholder:first").click(r.handle_show_map_when_clicking_on_placeholder),e(document).on("click","#ai1ec_tickets_submit",function(){return e(this).closest("form").submit(),!1})},o=function(){e("img[data-ai1ec-hidden]","#timely-description, #ai1ec-event-modal").each(function(){var t=e(this),n=e("#timely-event-poster img").attr("src");t.attr("src")!=n&&t.removeAttr("data-ai1ec-hidden")})},u=function(){t(function(){i(),s(),o(),e(document).trigger("event_page_ready.ai1ec"),e("body").addClass("ai1ec-event-details-ready")})};return{start:u}}),timely.require(["scripts/event"],function(e){e.start()}),timely.define("pages/event",function(){});