/**
 * @license RequireJS domReady 2.0.0 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */

/**
	 * AJAX result after clicking Dismiss in license warning.
	 * @param  {object} response Data returned by HTTP response
	 */

/**
	 * Dismiss button clicked in invalid license warning.
	 *
	 * @param  {Event} e jQuery event object
	 */

/*
 * The MIT License
 *
 * Copyright (c) 2012 James Allardice
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* ===========================================================
   * bootstrap-tooltip.js v2.0.4
   * http://twitter.github.com/bootstrap/javascript.html#tooltips
   * Inspired by the original jQuery.tipsy by Jason Frame
   * ===========================================================
   * Copyright 2012 Twitter, Inc.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * ========================================================== */

/* ===========================================================
	 * bootstrap-popover.js v2.0.4
	 * http://twitter.github.com/bootstrap/javascript.html#popovers
	 * ===========================================================
	 * Copyright 2012 Twitter, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * =========================================================== */

/* =========================================================
	 * bootstrap-modal.js v2.2.2
	 * http://twitter.github.com/bootstrap/javascript.html#modals
	 * =========================================================
	 * Copyright 2012 Twitter, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * ========================================================= */

timely.define("domReady",[],function(){function u(e){var t;for(t=0;t<e.length;t++)e[t](n)}function a(){var e=r;t&&e.length&&(r=[],u(e))}function f(){t||(t=!0,o&&clearInterval(o),a())}function c(e){return t?e(n):r.push(e),c}var e=typeof window!="undefined"&&window.document,t=!e,n=e?document:null,r=[],i,s,o;if(e){if(document.addEventListener)document.addEventListener("DOMContentLoaded",f,!1),window.addEventListener("load",f,!1);else if(window.attachEvent){window.attachEvent("onload",f),s=document.createElement("div");try{i=window.frameElement===null}catch(l){}s.doScroll&&i&&window.external&&(o=setInterval(function(){try{s.doScroll(),f()}catch(e){}},30))}(document.readyState==="complete"||document.readyState==="interactive")&&f()}return c.version="2.0.0",c.load=function(e,t,n,r){r.isBuild?n(null):c(n)},c}),timely.define("scripts/common_scripts/backend/common_ajax_handlers",["jquery_timely"],function(e){var t=function(t){t&&(typeof t.message!="undefined"?window.alert(t.message):e(".ai1ec-facebook-cron-dismiss-notification").closest(".message").fadeOut())},n=function(t){t.error?window.alert(t.message):e(".ai1ec-dismiss-notification").closest(".message").fadeOut()},r=function(t){t.error?window.alert(t.message):e(".ai1ec-dismiss-intro-video").closest(".message").fadeOut()},i=function(t){t.error?window.alert(t.message):e(".ai1ec-dismiss-license-warning").closest(".message").fadeOut()};return{handle_dismiss_plugins:t,handle_dismiss_notification:n,handle_dismiss_intro_video:r,handle_dismiss_license_warning:i}}),timely.define("scripts/common_scripts/backend/common_event_handlers",["jquery_timely","scripts/common_scripts/backend/common_ajax_handlers"],function(e,t){var n=function(n){var r={action:"ai1ec_facebook_cron_dismiss"};e.post(ajaxurl,r,t.handle_dismiss_plugins,"json")},r=function(n){var r=e(this);r.attr("disabled",!0);var i={action:"ai1ec_disable_notification",note:!1};e.post(ajaxurl,i,t.handle_dismiss_notification)},i=function(n){var r=e(this);r.attr("disabled",!0);var i={action:"ai1ec_disable_intro_video",note:!1};e.post(ajaxurl,i,t.handle_dismiss_intro_video)},s=function(n){var r=e(this);r.attr("disabled",!0);var i={action:"ai1ec_set_license_warning",value:"dismissed"};e.post(ajaxurl,i,t.handle_dismiss_license_warning)},o=function(t){e(this).parent().next(".ai1ec-limit-by-options-container").toggle()};return{dismiss_plugins_messages_handler:n,dismiss_notification_handler:r,dismiss_intro_video_handler:i,dismiss_license_warning_handler:s,handle_multiselect_containers_widget_page:o}}),timely.define("external_libs/Placeholders",[],function(){function e(e,t,n){if(e.addEventListener)return e.addEventListener(t,n,!1);if(e.attachEvent)return e.attachEvent("on"+t,n)}function t(e,t){var n,r;for(n=0,r=e.length;n<r;n++)if(e[n]===t)return!0;return!1}function n(e,t){var n;e.createTextRange?(n=e.createTextRange(),n.move("character",t),n.select()):e.selectionStart&&(e.focus(),e.setSelectionRange(t,t))}function r(e,t){try{return e.type=t,!0}catch(n){return!1}}function P(e){var t;return e.value===e.getAttribute(h)&&e.getAttribute(p)==="true"?(e.setAttribute(p,"false"),e.value="",e.className=e.className.replace(f,""),t=e.getAttribute(d),t&&(e.type=t),!0):!1}function H(e){var t;return e.value===""?(e.setAttribute(p,"true"),e.value=e.getAttribute(h),e.className+=" "+a,t=e.getAttribute(d),t?e.type="text":e.type==="password"&&S.changeType(e,"text")&&e.setAttribute(d,"password"),!0):!1}function B(e,t){var n,r,i,s,o;if(e&&e.getAttribute(h))t(e);else{n=e?e.getElementsByTagName("input"):n,r=e?e.getElementsByTagName("textarea"):r;for(o=0,s=n.length+r.length;o<s;o++)i=o<n.length?n[o]:r[o-n.length],t(i)}}function j(e){B(e,P)}function F(e){B(e,H)}function I(e){return function(){x&&e.value===e.getAttribute(h)&&e.getAttribute(p)==="true"?S.moveCaret(e,0):P(e)}}function q(e){return function(){H(e)}}function R(e){return function(t){N=e.value;if(e.getAttribute(p)==="true")return N!==e.getAttribute(h)||!S.inArray(o,t.keyCode)}}function U(e){return function(){var t;e.getAttribute(p)==="true"&&e.value!==N&&(e.className=e.className.replace(f,""),e.value=e.value.replace(e.getAttribute(h),""),e.setAttribute(p,!1),t=e.getAttribute(d),t&&(e.type=t)),e.value===""&&(e.blur(),S.moveCaret(e,0))}}function z(e){return function(){e===document.activeElement&&e.value===e.getAttribute(h)&&e.getAttribute(p)==="true"&&S.moveCaret(e,0)}}function W(e){return function(){j(e)}}function X(e){e.form&&(O=e.form,O.getAttribute(v)||(S.addEventListener(O,"submit",W(O)),O.setAttribute(v,"true"))),S.addEventListener(e,"focus",I(e)),S.addEventListener(e,"blur",q(e)),x&&(S.addEventListener(e,"keydown",R(e)),S.addEventListener(e,"keyup",U(e)),S.addEventListener(e,"click",z(e))),e.setAttribute(m,"true"),e.setAttribute(h,L),H(e)}var i={Utils:{addEventListener:e,inArray:t,moveCaret:n,changeType:r}},s=["text","search","url","tel","email","password","number","textarea"],o=[27,33,34,35,36,37,38,39,40,8,46],u="#ccc",a="placeholdersjs",f=new RegExp("\\b"+a+"\\b"),l,c,h="data-placeholder-value",p="data-placeholder-active",d="data-placeholder-type",v="data-placeholder-submit",m="data-placeholder-bound",g="data-placeholder-focus",y="data-placeholder-live",b=document.createElement("input"),w=document.getElementsByTagName("head")[0],E=document.documentElement,S=i.Utils,x,T,N,C,k,L,A,O,M,_,D;if(b.placeholder===void 0){l=document.getElementsByTagName("input"),c=document.getElementsByTagName("textarea"),x=E.getAttribute(g)==="false",T=E.getAttribute(y)!=="false",C=document.createElement("style"),C.type="text/css",k=document.createTextNode("."+a+" { color:"+u+"; }"),C.styleSheet?C.styleSheet.cssText=k.nodeValue:C.appendChild(k),w.insertBefore(C,w.firstChild);for(D=0,_=l.length+c.length;D<_;D++)M=D<l.length?l[D]:c[D-l.length],L=M.getAttribute("placeholder"),L&&S.inArray(s,M.type)&&X(M);A=setInterval(function(){for(D=0,_=l.length+c.length;D<_;D++){M=D<l.length?l[D]:c[D-l.length],L=M.getAttribute("placeholder");if(L&&S.inArray(s,M.type)){M.getAttribute(m)||X(M);if(L!==M.getAttribute(h)||M.type==="password"&&!M.getAttribute(d))M.type==="password"&&!M.getAttribute(d)&&S.changeType(M,"text")&&M.setAttribute(d,"password"),M.value===M.getAttribute(h)&&(M.value=L),M.setAttribute(h,L)}}T||clearInterval(A)},100)}return i.disable=j,i.enable=F,i}),timely.define("external_libs/bootstrap_tooltip",["jquery_timely"],function(e){if(!e.fn.tooltip){var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,this.options.trigger!="manual"&&(i=this.options.trigger=="hover"?"mouseenter":"focus",s=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(i,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s,this.options.selector,e.proxy(this.leave,this))),this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,t,this.$element.data()),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)return n.show();clearTimeout(this.timeout),n.hoverState="in",this.timeout=setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip(),this.setContent(),this.options.animation&&e.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,t=/in/.test(s),e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body),n=this.getPosition(t),r=e[0].offsetWidth,i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},isHTML:function(e){return typeof e!="string"||e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3||/^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(e)},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.isHTML(t)?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.remove()})}var t=this,n=this.tip();n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?r():n.remove()},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}},e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0}}}),timely.define("external_libs/bootstrap_popover",["jquery_timely","external_libs/bootstrap_tooltip"],function(e,t){if(!e.fn.popover){var n=function(e,t){this.init("popover",e,t)};n.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:n,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.isHTML(t)?"html":"text"](t),e.find(".popover-content > *")[this.isHTML(n)?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-content")||(typeof n.content=="function"?n.content.call(t[0]):n.content),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip}}),e.fn.popover=function(t){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof t=="object"&&t;i||r.data("popover",i=new n(this,s)),typeof t=="string"&&i[t]()})},e.fn.popover.Constructor=n,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}if(!e.fn.constrained_popover){var r=function(e,t){this.init("constrained_popover",e,t)};r.prototype=e.extend({},e.fn.popover.Constructor.prototype,{constructor:r,show:function(){var e,t,n,r,i,s,o,u,a={};if(this.hasContent()&&this.enabled){e=this.tip(),this.setContent(),this.options.animation&&e.addClass("fade"),o=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,t=/in/.test(o),e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body),n=this.getPosition(t),i=e[0].offsetWidth,s=e[0].offsetHeight;switch(t?o.split(" ")[1]:o){case"left":r=this.defineBounds(n),typeof r.top=="undefined"?a.top=n.top+n.height/2-s/2:a.top=r.top-s/2,typeof r.left=="undefined"?a.left=n.left-i:a.left=r.left-i,u={top:a.top,left:a.left};break;case"right":r=this.defineBounds(n),typeof r.top=="undefined"?a.top=n.top+n.height/2-s/2:a.top=r.top-s/2,typeof r.left=="undefined"?a.left=n.left+n.width:a.left=r.left+n.width,u={top:a.top,left:a.left}}e.css(u).addClass(o).addClass("in")}},defineBounds:function(t){var n,r,i,s,o,u,a={},f=e(this.options.container);return f.length?(r=f.offset(),i=r.top,s=r.left,o=i+f.height(),u=s+f.width(),t.top+t.height/2<i&&(a.top=i),t.top+t.height/2>o&&(a.top=o),t.left-t.width/2<s&&(a.left=s),t.left-t.width/2>u&&(a.left=u),a):!1}}),e.fn.constrained_popover=function(t){return this.each(function(){var n=e(this),i=n.data("constrained_popover"),s=typeof t=="object"&&t;i||n.data("constrained_popover",i=new r(this,s)),typeof t=="string"&&i[t]()})},e.fn.constrained_popover.Constructor=r,e.fn.constrained_popover.defaults=e.extend({},e.fn.popover.defaults,{container:"",content:this.options})}}),timely.define("external_libs/bootstrap_modal",["jquery_timely"],function(e){var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="ai1ec_modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".ai1ec-modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.focus().trigger("shown")}):t.$element.focus().trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(e){this.$element.hide().trigger("hidden"),this.backdrop()},removeBackdrop:function(){this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="ai1ec-modal-backdrop '+r+'" />').appendTo(document.body),this.$backdrop.click(this.options.backdrop=="static"?e.proxy(this.$element[0].focus,this.$element[0]):e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,e.proxy(this.removeBackdrop,this)):this.removeBackdrop()):t&&t()}};var n=e.fn.modal;e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e.fn.modal.noConflict=function(){return e.fn.modal=n,this},e(document).on("click.modal.data-api",'[data-toggle="ai1ec_modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})}),timely.define("libs/modal_helper",["jquery_timely","domReady","external_libs/bootstrap_modal"],function(e,t){t(function(){var t=e("body");t.on("shown",".ai1ec-modal",function(){t.addClass("ai1ec-modal-open")}).on("hidden",".ai1ec-modal",function(){t.removeClass("ai1ec-modal-open")})})}),timely.define("scripts/common_scripts/backend/common_backend",["jquery_timely","domReady","ai1ec_config","scripts/common_scripts/backend/common_event_handlers","external_libs/Placeholders","external_libs/bootstrap_tooltip","external_libs/bootstrap_popover","libs/modal_helper"],function(e,t,n,r){var i=function(){e("#ai1ec-facebook-filter option[value=exportable]:selected").length>0&&e("table.wp-list-table tr.no-items").length===0&&n.facebook_logged_in==="1"&&(e("<option>").val("export-facebook").text("Export to facebook").appendTo("select[name='action']"),e("<option>").val("export-facebook").text("Export to facebook").appendTo("select[name='action2']"))},s=function(){if(n.platform_active==="1"){e("#menu-posts-ai1ec_event li").each(function(){var t=e(this);if(t.has('a[href$="all-in-one-event-calendar-themes"], a[href$="all-in-one-event-calendar-edit-css"], a[href$="all-in-one-event-calendar-settings"]').length){if(t.is(".current")){var n=e("a",t).attr("href");e('#adminmenu a:not(.current)[href="'+n+'"]').parent().andSelf().addClass("current").end().closest("li.menu-top").find("> a.menu-top").andSelf().addClass("wp-has-current-submenu wp-menu-open").removeClass("wp-not-current-submenu"),t.closest("li.menu-top").find("> a.menu-top").andSelf().removeClass("wp-has-current-submenu wp-menu-open").addClass("wp-not-current-submenu")}t.hide()}});if(e("body.options-reading-php").length){var t=function(){e("#page_on_front").attr("disabled","disabled")};t(),e("#front-static-pages input:radio").change(t),e("#page_on_front").after('<span class="description">'+n.page_on_front_description+"</span>")}n.strict_mode==="1"&&(e("#dashboard-widgets .postbox").not("#ai1ec-calendar-tasks, #dashboard_right_now").remove(),e("#adminmenu > li").not(".wp-menu-separator, #menu-dashboard, #menu-posts-ai1ec_event, #menu-media, #menu-appearance, #menu-users, #menu-settings").remove(),e("#menu-appearance > .wp-submenu li, #menu-settings > .wp-submenu li").not(':has(a[href*="all-in-one-event-calendar"])').remove())}},o=function(){e("#ai1ec-video").length&&(e.ajax({cache:!0,async:!0,dataType:"script",url:"//www.youtube.com/iframe_api"}),window.onYouTubeIframeAPIReady=function(){var t=new YT.Player("ai1ec-video",{height:"368",width:"600",videoId:window.ai1ecVideo.youtubeId});e("#ai1ec-video").css("display","block"),e("#ai1ec-video-modal").on("hide",function(){t.stopVideo()})})},u=function(){e(document).on("click",".ai1ec-facebook-cron-dismiss-notification",r.dismiss_plugins_messages_handler).on("click",".ai1ec-dismiss-notification",r.dismiss_notification_handler).on("click",".ai1ec-dismiss-intro-video",r.dismiss_intro_video_handler).on("click",".ai1ec-dismiss-license-warning",r.dismiss_license_warning_handler).on("click",".ai1ec-limit-by-cat, .ai1ec-limit-by-tag, .ai1ec-limit-by-event",r.handle_multiselect_containers_widget_page)},a=function(){e("#ai1ec-support .ai1ec-download a[title]").popover({placement:"left"}),e(".ai1ec-tooltip-toggle").tooltip()};n.page!==""&&(e(".if-js-closed").removeClass("if-js-closed").addClass("closed"),postboxes.add_postbox_toggles(n.page));var f=function(){t(function(){i(),o(),u(),s(),a()})};return{start:f}}),timely.require(["scripts/common_scripts/backend/common_backend"],function(e){e.start()}),timely.define("pages/common_backend",function(){});