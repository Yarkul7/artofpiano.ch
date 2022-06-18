/*jshint ignore:start */
document.documentElement.className += ' js_active ';
document.documentElement.className += 'ontouchstart' in document.documentElement ? ' vc_mobile ' : ' vc_desktop ';
(function () {
    var prefix = ['-webkit-', '-o-', '-moz-', '-ms-', ""];
    for (var i in prefix) {
        if (prefix[i] + 'transform' in document.documentElement.style) document.documentElement.className += " vc_transform ";
    }
})();
/*
 On document ready jQuery will fire set of functions.
 If you want to override function behavior then copy it to your theme js file
 with the same name.
 */

var vc_js = function () {
    vc_twitterBehaviour();
    vc_toggleBehaviour();
    vc_tabsBehaviour();
    vc_accordionBehaviour();
    vc_teaserGrid();
    vc_carouselBehaviour();
    vc_slidersBehaviour();
    vc_prettyPhoto();
    vc_googleplus();
    vc_pinterest();
    vc_progress_bar();
    vc_plugin_flexslider();
    vc_google_fonts();
    window.setTimeout(vc_waypoints, 1500);
};
jQuery(document).ready(function ($) {
    //window.vc_js();
}); // END jQuery(document).ready

if (typeof window['vc_plugin_flexslider'] !== 'function') {
    function vc_plugin_flexslider($parent) {
        var $slider = $parent ? $parent.find('.wpb_flexslider') : jQuery('.wpb_flexslider');
        $slider.each(function () {
            var this_element = jQuery(this);
            var sliderSpeed = 800,
                sliderTimeout = parseInt(this_element.attr('data-interval')) * 1000,
                sliderFx = this_element.attr('data-flex_fx'),
                slideshow = true;
            if (sliderTimeout == 0) slideshow = false;

            this_element.is(':visible') && this_element.flexslider({
                animation:sliderFx,
                slideshow:slideshow,
                slideshowSpeed:sliderTimeout,
                sliderSpeed:sliderSpeed,
                smoothHeight:true
            });
        });
    }
}

/* Twitter
 ---------------------------------------------------------- */
if (typeof window['vc_twitterBehaviour'] !== 'function') {
    function vc_twitterBehaviour() {
        jQuery('.wpb_twitter_widget .tweets').each(function (index) {
            var this_element = jQuery(this),
                tw_name = this_element.attr('data-tw_name');
            tw_count = this_element.attr('data-tw_count');

            this_element.tweet({
                username:tw_name,
                join_text:"auto",
                avatar_size:0,
                count:tw_count,
                template:"{avatar}{join}{text}{time}",
                auto_join_text_default:"",
                auto_join_text_ed:"",
                auto_join_text_ing:"",
                auto_join_text_reply:"",
                auto_join_text_url:"",
                loading_text:'<span class="loading_tweets">loading tweets...</span>'
            });
        });
    }
}

/* Google plus
 ---------------------------------------------------------- */
if (typeof window['vc_googleplus'] !== 'function') {
    function vc_googleplus() {
        if (jQuery('.wpb_googleplus').length > 0) {
            (function () {
                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = 'https://apis.google.com/js/plusone.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            })();
        }
    }
}


/* Pinterest
 ---------------------------------------------------------- */
if (typeof window['vc_pinterest'] !== 'function') {
    function vc_pinterest() {
        if (jQuery('.wpb_pinterest').length > 0) {
            (function () {
                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = 'https://assets.pinterest.com/js/pinit.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
                //<script type="text/javascript" src="//assets.pinterest.com/js/pinit.js"></script>
            })();
        }
    }
}


/* Progress bar PIRENKO
 ---------------------------------------------------------- */
if (typeof window['vc_progress_bar'] !== 'function') {
    function vc_progress_bar() {
        if (typeof jQuery.fn.waypoint !== 'undefined') {
            //NO ANIMS ON MOBILE
            if (is_mobile() && theme_options.css_enable!=="1") {
                jQuery('.vc_progress_bar').find('.vc_single_bar').each(function() {
                    var $this = jQuery(this),
                        bar = $this.find('.vc_bar'),
                        val = bar.data('percentage-value');
                    $this.css({'opacity':'1'});
                    bar.css({"width" : val+'%'});
                });
            }
            else {
                jQuery('.vc_progress_bar').each(function() {
                    var $this_el=jQuery(this);
                    if($this_el.attr('id')===undefined) {
                        $this_el.attr('id','wayp-'+Math.floor(Math.random() * 10000));
                    }
                    $this_el.waypoint(function() {
                        $this_el.find('.vc_single_bar').each(function(index) {
                            var $this = jQuery(this),
                                bar = $this.find('.vc_bar'),
                                val = bar.data('percentage-value');
                            setTimeout(function(){
                                $this.css({'opacity':'1'});
                                bar.css({"width" : val+'%'}); }, index*200);
                        });
                    }, { offset: '95%' });
                });
            }
        }
    }
}

function numberWithCommas (x,separator) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/* Waypoints magic PIRENKO
---------------------------------------------------------- */
if ( typeof window['vc_waypoints'] !== 'function' ) {
    function vc_waypoints() {
        if (typeof jQuery.fn.waypoint !== 'undefined') {
            //NO ANIMS ON MOBILE
            if (is_mobile() && theme_options.css_enable!=="1") {
                jQuery('.wpb_animate_when_almost_visible').removeClass('wpb_animate_when_almost_visible');
                //THEME COUNTER
                jQuery('.pulse_counter').each(function() {
                    var $this_el=jQuery(this);
                    if ($this_el.attr('data-thousands')===undefined) {
                        $this_el.attr('data-thousands','');
                    }
                    $this_el.counter({
                        autoStart: true, // true/false, default: true
                        duration: parseInt($this_el.attr('data-duration'),10), // milliseconds, default: 1500
                        countFrom: $this_el.attr('data-origin'),// start counting at this number, default: 0
                        countTo: $this_el.attr('data-counter'),// count to this number, default: 0
                        runOnce: true,// only run the counter once, default: false
                        placeholder: "", // replace the number with this before counting,
                        easing: "easeOutCubic", // easing effects
                        onStart: function() {}, // callback on start of the counting
                        onComplete: function() {}, // callback on completion of the counting
                        numberFormatter: // function used to format the displayed numbers.
                            function(number) {
                                return $this_el.attr('data-prefix')+numberWithCommas(Math.ceil(number),$this_el.attr('data-thousands'))+$this_el.attr('data-suffix');
                            }
                    });
                });
            }
            else {
                jQuery('.wpb_animate_when_almost_visible:not(.wpb_start_animation,.pls_manual_anim)').each(function() {
                    var $this_el=jQuery(this);
                    if($this_el.attr('id')===undefined) {
                        $this_el.attr('id','wayp-'+Math.floor(Math.random() * 10000));
                    }
                    $this_el.waypoint(function() {
                        if (!$this_el.is('[class*="delay-"]')) {
                            setTimeout(function() {
                                $this_el.addClass('wpb_start_animation');
                            },parseInt(delayer,10)+300);
                        }
                        else {
                            var classes = $this_el.attr("class").split(" ");
                            var delayer=0;
                            for (var i = 0; i < classes.length; i++) {
                                if ( classes[i].substr(0,6) === "delay-" ) {
                                    delayer=classes[i].substr(6,classes[i].length);
                                    break;
                                }
                            }
                            setTimeout(function() {
                                $this_el.addClass('wpb_start_animation');
                            },parseInt(delayer,10)+100);
                        }
                    }, { offset: '90%' });
                });
                //THEME COUNTER
                jQuery('.pulse_counter').each(function() {
                    var $this_el=jQuery(this);
                    $this_el.waypoint(function() {
                        if ($this_el.attr('data-thousands')===undefined) {
                            $this_el.attr('data-thousands','');
                        }
                        $this_el.counter({
                            autoStart: true, // true/false, default: true
                            duration: parseInt($this_el.attr('data-duration'),10), // milliseconds, default: 1500
                            countFrom: $this_el.attr('data-origin'),// start counting at this number, default: 0
                            countTo: $this_el.attr('data-counter'),// count to this number, default: 0
                            runOnce: true,// only run the counter once, default: false
                            placeholder: "", // replace the number with this before counting,
                            easing: "easeOutCubic", // easing effects
                            onStart: function() {}, // callback on start of the counting
                            onComplete: function() {}, // callback on completion of the counting
                            numberFormatter: // function used to format the displayed numbers.
                                function(number) {
                                    return $this_el.attr('data-prefix')+numberWithCommas(Math.ceil(number),$this_el.attr('data-thousands'))+$this_el.attr('data-suffix');
                                }
                        });
                    }, { offset: '85%' });
                });
            }
        }
    }
}

/* Toggle
 ---------------------------------------------------------- */
if (typeof window['vc_toggleBehaviour'] !== 'function') {
    function vc_toggleBehaviour() {
        jQuery(".wpb_toggle").unbind('click').click(function (e) {
            if (jQuery(this).next().is(':animated')) {
                return false;
            }
            if (jQuery(this).hasClass('wpb_toggle_title_active')) {
                jQuery(this).removeClass('wpb_toggle_title_active').next().slideUp(500);
            } else {
                jQuery(this).addClass('wpb_toggle_title_active').next().slideDown(500);
            }
        });
        jQuery('.wpb_toggle_content').each(function (index) {
            if (jQuery(this).next().is('h4.wpb_toggle') == false) {
                jQuery('<div class="last_toggle_el_margin"></div>').insertAfter(this);
            }
        });
    }
}

/* Tabs + Tours PIRENKO
 ---------------------------------------------------------- */
if (typeof window['vc_tabsBehaviour'] !== 'function') {
    function vc_tabsBehaviour() {
        jQuery(function($){$(document.body).off('click.preview', 'a')});
        jQuery('.wpb_tabs, .wpb_tour').each(function(index) {
            var $tabs,
                interval = jQuery(this).attr("data-interval"),
                tabs_array = [];
            //
            $tabs = jQuery(this).find('.wpb_tour_tabs_wrapper').tabs({
                show: function(event, ui) {},
                beforeActivate: function(event, ui) {
                    var panel = ui.panel || ui.newPanel;
                },
                activate: function(event, ui) {
                    var panel = ui.panel || ui.newPanel;
                }
            });
            jQuery(this).find('.wpb_tab').each(function(){ tabs_array.push(this.id); });
        });
    }
}

/* Tabs + Tours PIRENKO
 ---------------------------------------------------------- */
if (typeof window['vc_accordionBehaviour'] !== 'function') {
    function vc_accordionBehaviour() {
        jQuery('.wpb_accordion').each(function(index) {
            var $tabs,
                interval = jQuery(this).attr("data-interval"),
                active_tab = !isNaN(jQuery(this).data('active-tab')) && parseInt(jQuery(this).data('active-tab')) >  0 ? parseInt(jQuery(this).data('active-tab'))-1 : false,
                collapsible =  active_tab === false || jQuery(this).data('collapsible') === 'yes';
            var ac_icons = {
                header: "pulse_fa-plus",
                activeHeader: "pulse_fa-minus"
            };
            $tabs = jQuery(this).find('.wpb_accordion_wrapper').accordion({
                header: "> div > h3",
                icons: ac_icons,
                autoHeight: false,
                heightStyle: "content",
                active: active_tab,
                collapsible: collapsible,
                navigation: true,
                activate: function(event, ui){
                    vc_carouselBehaviour();
                    var panel = ui.panel || ui.newPanel;
                }
            });
            //.tabs().tabs('rotate', interval*1000, true);
        });
    }
}

/* Teaser grid: isotope
 ---------------------------------------------------------- */
if (typeof window['vc_teaserGrid'] !== 'function') {
    function vc_teaserGrid() {
        var layout_modes = {
            fitrows:'fitRows',
            masonry:'masonry'
        }
        jQuery('.wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)').each(function () {
            var $container = jQuery(this);
            var $thumbs = $container.find('.wpb_thumbnails');
            var layout_mode = $thumbs.attr('data-layout-mode');
            $thumbs.isotope({
                // options
                itemSelector:'.isotope-item',
                layoutMode:(layout_modes[layout_mode] == undefined ? 'fitRows' : layout_modes[layout_mode])
            });
            $container.find('.categories_filter a').data('isotope', $thumbs).click(function (e) {
                e.preventDefault();
                var $thumbs = jQuery(this).data('isotope');
                jQuery(this).parent().parent().find('.active').removeClass('active');
                jQuery(this).parent().addClass('active');
                $thumbs.isotope({filter:jQuery(this).attr('data-filter')});
            });
            jQuery(window).bind('load resize', function () {
                $thumbs.isotope("layout");
            });
        });

        /*
         var isotope = jQuery('.wpb_grid ul.thumbnails');
         if ( isotope.length > 0 ) {
         isotope.isotope({
         // options
         itemSelector : '.isotope-item',
         layoutMode : 'fitRows'
         });
         jQuery(window).load(function() {
         isotope.isotope("layout");
         });
         }
         */
    }
}

if (typeof window['vc_carouselBehaviour'] !== 'function') {
    function vc_carouselBehaviour($parent) {
        var $carousel = $parent ? $parent.find(".wpb_carousel") : jQuery(".wpb_carousel");
        $carousel.each(function () {
            var $this = jQuery(this);
            if ($this.data('carousel_enabled') !== true && $this.is(':visible')) {
                $this.data('carousel_enabled', true);
                var carousel_width = jQuery(this).width(),
                    visible_count = getColumnsCount(jQuery(this)),
                    carousel_speed = 500;
                if (jQuery(this).hasClass('columns_count_1')) {
                    carousel_speed = 900;
                }
                /* Get margin-left value from the css grid and apply it to the carousele li items (margin-right), before carousele initialization */
                var carousele_li = jQuery(this).find('.wpb_thumbnails-fluid li');
                carousele_li.css({"margin-right":carousele_li.css("margin-left"), "margin-left":0 });

                jQuery(this).find('.wpb_wrapper:eq(0)').jCarouselLite({
                    btnNext:jQuery(this).find('.next'),
                    btnPrev:jQuery(this).find('.prev'),
                    visible:visible_count,
                    speed:carousel_speed
                })
                    .width('100%');//carousel_width

                var fluid_ul = jQuery(this).find('ul.wpb_thumbnails-fluid');
                fluid_ul.width(fluid_ul.width() + 300);

                jQuery(window).resize(function () {
                    var before_resize = screen_size;
                    screen_size = getSizeName();
                    if (before_resize != screen_size) {
                        window.setTimeout('location.reload()', 20);
                    }
                });
            }

        });
        /*
         if(jQuery.fn.bxSlider !== undefined ) {
         jQuery('.bxslider').each(function(){
         var $slider = jQuery(this);
         $slider.bxSlider($slider.data('settings'));
         });
         }
         */

        /*if (window.Swiper !== undefined) {

          jQuery('.swiper-container').each(function () {
            var $this = jQuery(this),
              my_swiper,
              max_slide_size = 0,
              options = jQuery(this).data('settings');

            if (options.mode === 'vertical') {
              $this.find('.swiper-slide').each(function () {
                var height = jQuery(this).outerHeight(true);
                if (height > max_slide_size) max_slide_size = height;
              });
              $this.height(max_slide_size);
              $this.css('overflow', 'hidden');
            }
            jQuery(window).resize(function () {
              $this.find('.swiper-slide').each(function () {
                var height = jQuery(this).outerHeight(true);
                if (height > max_slide_size) max_slide_size = height;
              });
              $this.height(max_slide_size);
            });
            my_swiper = jQuery(this).swiper(jQuery.extend(options, {
              onFirstInit:function (swiper) {
                if (swiper.slides.length < 2) {
                  $this.find('.vc_arrow-left,.vc_arrow-right').hide();
                } else if (swiper.activeIndex === 0 && swiper.params.loop !== true) {
                  $this.find('.vc_arrow-left').hide();
                } else {
                  $this.find('.vc_arrow-left').show();
                }
              },
              onSlideChangeStart:function (swiper) {
                if (swiper.slides.length > 1 && swiper.params.loop !== true) {
                  if (swiper.activeIndex === 0) {
                    $this.find('.vc_arrow-left').hide();
                  } else {
                    $this.find('.vc_arrow-left').show();
                  }
                  if (swiper.slides.length - 1 === swiper.activeIndex) {
                    $this.find('.vc_arrow-right').hide();
                  } else {
                    $this.find('.vc_arrow-right').show();
                  }
                }
              }
            }));
            $this.find('.vc_arrow-left').click(function (e) {
              e.preventDefault();
              my_swiper.swipePrev();
            });
            $this.find('.vc_arrow-right').click(function (e) {
              e.preventDefault();
              my_swiper.swipeNext();
            });
            my_swiper.reInit();
          });

        }*/

    }
}

if (typeof window['vc_slidersBehaviour'] !== 'function') {
    function vc_slidersBehaviour() {
        //var sliders_count = 0;
        jQuery('.wpb_gallery_slides').each(function (index) {
            var this_element = jQuery(this);
            var ss_count = 0;

            if (this_element.hasClass('wpb_image_grid')) {
                var isotope = this_element.find('.wpb_image_grid_ul');
                isotope.isotope({
                    // options
                    itemSelector:'.isotope-item',
                    layoutMode:'fitRows'
                });
                jQuery(window).load(function () {
                    isotope.isotope("layout");
                });
            }
        });
    }
}

if (typeof window['vc_prettyPhoto'] !== 'function') {
    function vc_prettyPhoto() {
        //PIRENKO
    }
}


if ( typeof window['vc_google_fonts'] !== 'function' ) {
    function vc_google_fonts() {
        return;
    }
}
/* Helper
 ---------------------------------------------------------- */
function getColumnsCount(el) {
    var find = false,
        i = 1;

    while (find == false) {
        if (el.hasClass('columns_count_' + i)) {
            find = true;
            return i;
        }
        i++;
    }
}

var screen_size = getSizeName();
function getSizeName() {
    var screen_size = '',
        screen_w = jQuery(window).width();

    if (screen_w > 1170) {
        screen_size = "desktop_wide";
    }
    else if (screen_w > 960 && screen_w < 1169) {
        screen_size = "desktop";
    }
    else if (screen_w > 768 && screen_w < 959) {
        screen_size = "tablet";
    }
    else if (screen_w > 300 && screen_w < 767) {
        screen_size = "mobile";
    }
    else if (screen_w < 300) {
        screen_size = "mobile_portrait";
    }
    return screen_size;
}


function loadScript(url, $obj, callback) {

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        /*
         script.onload = function(){

         callback();
         };
         */
    }

    script.src = url;
    $obj.get(0).appendChild(script);
}

/**
 * Prepare html to correctly display inside tab container
 *
 * @param event - ui tab event 'show'
 * @param ui - jquery ui tabs object
 */

function wpb_prepare_tab_content(event, ui) {
    var panel = ui.panel || ui.newPanel,
        $pie_charts = panel.find('.vc_pie_chart:not(.vc_ready)'),
        $carousel = panel.find('[data-ride="vc_carousel"]'),
        $ui_panel, $google_maps;
    vc_carouselBehaviour();
    vc_plugin_flexslider(panel);
    $pie_charts.length && jQuery.fn.vcChat && $pie_charts.vcChat();
    $carousel.length && jQuery.fn.carousel && $carousel.carousel('resizeAction');
    $ui_panel = panel.find('.isotope');
    $google_maps = panel.find('.wpb_gmaps_widget');
    if ($ui_panel.length > 0) {
        $ui_panel.isotope("layout");
    }
    if ($google_maps.length && !$google_maps.is('.map_ready')) {
        var $frame = $google_maps.find('iframe');
        $frame.attr('src', $frame.attr('src'));
        $google_maps.addClass('map_ready');
    }
    if(panel.parents('.isotope').length) {
        panel.parents('.isotope').each(function(){
            jQuery(this).isotope("layout");
        });
    }
}
/*var vc_accordionActivate = function(event, ui) {
  var $pie_charts = ui.newPanel.find('.vc_pie_chart:not(.vc_ready)'),
    $carousel = ui.newPanel.find('[data-ride="vc_carousel"]');
  if (jQuery.fn.isotope != undefined) {
    ui.newPanel.find('.isotope').isotope("layout");
  }
  vc_carouselBehaviour(ui.newPanel);
  vc_plugin_flexslider(ui.newPanel);
  $pie_charts.length && jQuery.fn.vcChat && $pie_charts.vcChat();
  $carousel.length && jQuery.fn.carousel && $carousel.carousel('resizeAction');
  if(ui.newPanel.parents('.isotope').length) {
    ui.newPanel.parents('.isotope').each(function(){
      jQuery(this).isotope("layout");
    });
  }
}*/
/* =========================================================
 * vc-accordion.js v1.0.0
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * WPBakery Page Builder accordion
 * ========================================================= */
+ function ( $ ) {
    'use strict';

    var Accordion, clickHandler, old, hashNavigation;

    // Accordion plugin definition
    // ==========================
    function Plugin( action, options ) {
        var args;

        args = Array.prototype.slice.call( arguments, 1 );
        return this.each( function () {
            var $this, data;

            $this = $( this );
            data = $this.data( 'vc.accordion' );
            if ( ! data ) {
                data = new Accordion( $this, $.extend( true, {}, options ) );
                $this.data( 'vc.accordion', data );
            }
            if ( 'string' === typeof(action) ) {
                data[ action ].apply( data, args );
            }
        } );
    }

    /**
     * Accordion object definition
     * @param $element
     * @constructor
     */
    Accordion = function ( $element, options ) {
        this.$element = $element;
        this.activeClass = 'vc_active';
        this.animatingClass = 'vc_animating';
        // cached vars
        this.useCacheFlag = undefined;
        this.$target = undefined;
        this.$targetContent = undefined;
        this.selector = undefined;
        this.$container = undefined;
        this.animationDuration = undefined;
        this.index = 0;
    };

    /**
     * Get supported transition event
     * @returns {*}
     */
    Accordion.transitionEvent = function () {
        var transition, transitions, el;
        el = document.createElement( 'vcFakeElement' );
        transitions = {
            'transition': 'transitionend',
            'MSTransition': 'msTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for ( transition in
            transitions ) {
            if ( 'undefined' !== typeof(el.style[ transition ]) ) {
                return transitions[ transition ];
            }
        }
    };

    /**
     * Emulate transition end
     * @param $el
     * @param duration
     */
    Accordion.emulateTransitionEnd = function ( $el, duration ) {
        var callback, called;
        called = false;
        if ( ! duration ) {
            duration = 250;
        }

        $el.one( Accordion.transitionName, function () {
            called = true;
        } );
        callback = function () {
            if ( ! called ) {
                $el.trigger( Accordion.transitionName );
            }
        };
        setTimeout( callback, duration );
    };

    Accordion.DEFAULT_TYPE = 'collapse';
    Accordion.transitionName = Accordion.transitionEvent();

    /**
     * Accordion controller
     * @param action
     */
    Accordion.prototype.controller = function ( action ) {
        var $this;
        $this = this.$element;

        if ( 'string' !== typeof(action) ) {
            action = $this.data( 'vcAction' ) || this.getContainer().data( 'vcAction' );
        }
        if ( 'undefined' === typeof(action) ) {
            action = Accordion.DEFAULT_TYPE;
        }

        if ( 'string' === typeof(action) ) {
            Plugin.call( $this, action );
        }
    };

    /**
     * Is cache used
     * @returns {boolean}
     */
    Accordion.prototype.isCacheUsed = function () {
        var useCache, that;
        that = this;
        useCache = function () {
            return false !== that.$element.data( 'vcUseCache' );
        };

        if ( 'undefined' === typeof(this.useCacheFlag) ) {
            this.useCacheFlag = useCache();
        }

        return this.useCacheFlag;
    };

    /**
     * Get selector
     * @returns {*}
     */
    Accordion.prototype.getSelector = function () {
        var findSelector, $this;

        $this = this.$element;

        findSelector = function () {
            var selector;

            selector = $this.data( 'vcTarget' );
            if ( ! selector ) {
                selector = $this.attr( 'href' );
            }

            return selector;
        };

        if ( ! this.isCacheUsed() ) {
            return findSelector();
        }

        if ( 'undefined' === typeof(this.selector) ) {
            this.selector = findSelector();
        }

        return this.selector;
    };

    /**
     * Find container
     * @returns {window.jQuery}
     */
    Accordion.prototype.findContainer = function () {
        var $container;
        $container = this.$element.closest( this.$element.data( 'vcContainer' ) );
        if ( ! $container.length ) {
            $container = $( 'body' );
        }
        return $container;
    };

    /**
     * Get container
     * @returns {*|Number}
     */
    Accordion.prototype.getContainer = function () {
        if ( ! this.isCacheUsed() ) {
            return this.findContainer();
        }

        if ( 'undefined' === typeof(this.$container) ) {
            this.$container = this.findContainer();
        }

        return this.$container;
    };

    /**
     * Get target
     * @returns {*}
     */
    Accordion.prototype.getTarget = function () {
        var selector, that, getTarget;
        that = this;
        selector = that.getSelector();
        getTarget = function () {
            var element;
            element = that.getContainer().find( selector );
            if ( ! element.length ) {
                element = that.getContainer().filter( selector );
            }
            return element;
        };

        if ( ! this.isCacheUsed() ) {
            return getTarget();
        }

        if ( 'undefined' === typeof(this.$target) ) {
            this.$target = getTarget();
        }

        return this.$target;
    };

    /**
     * Get target content
     * @returns {*}
     */
    Accordion.prototype.getTargetContent = function () {
        var $target, $targetContent;
        $target = this.getTarget();
        if ( ! this.isCacheUsed() ) {
            if ( $target.data( 'vcContent' ) ) {
                $targetContent = $target.find( $target.data( 'vcContent' ) );
                if ( $targetContent.length ) {
                    return $targetContent;
                }
            }
            return $target;
        }

        if ( 'undefined' === typeof(this.$targetContent) ) {
            $targetContent = $target;
            if ( $target.data( 'vcContent' ) ) {
                $targetContent = $target.find( $target.data( 'vcContent' ) );
                if ( ! $targetContent.length ) {
                    $targetContent = $target;
                }
            }
            this.$targetContent = $targetContent;
        }

        return this.$targetContent;
    };

    /**
     * Get triggers
     * @returns {*}
     */
    Accordion.prototype.getTriggers = function () {
        var i;
        i = 0;
        return this.getContainer().find( '[data-vc-accordion]' ).each( function () {
            var accordion, $this;
            $this = $( this );
            accordion = $this.data( 'vc.accordion' );
            if ( 'undefined' === typeof(accordion) ) {
                $this.vcAccordion();
                accordion = $this.data( 'vc.accordion' );
            }
            accordion && accordion.setIndex && accordion.setIndex( i ++ );
        } );
    };

    /**
     * Set the position index in getTriggers
     * @param index
     */
    Accordion.prototype.setIndex = function ( index ) {
        this.index = index;
    };

    /**
     * Get the position index in getTriggers
     */
    Accordion.prototype.getIndex = function () {
        return this.index;
    };

    /**
     * Trigger event
     * @param event
     */
    Accordion.prototype.triggerEvent = function ( event ) {
        var $event;
        if ( 'string' === typeof(event) ) {
            $event = $.Event( event );
            this.$element.trigger( $event );
        }
    };

    /**
     * Get active triggers
     * @returns {*}
     */
    Accordion.prototype.getActiveTriggers = function () {
        var $triggers;

        $triggers = this.getTriggers().filter( function () {
            var $this, accordion;
            $this = $( this );
            accordion = $this.data( 'vc.accordion' );

            return accordion.getTarget().hasClass( accordion.activeClass );
        } );
        return $triggers;
    };

    /**
     * change document location hash
     */
    Accordion.prototype.changeLocationHash = function () {
        var id, $target;

        $target = this.getTarget();
        if ( $target.length ) {
            id = $target.attr( 'id' );
        }
        if ( id ) {
            if ( history.pushState ) {
                history.pushState( null, null, '#' + id );
            }
            else {
                location.hash = '#' + id;
            }
        }
    };

    /**
     * is active
     * @returns {boolean}
     */
    Accordion.prototype.isActive = function () {

        return this.getTarget().hasClass( this.activeClass );
    };

    /**
     * Get animation duration
     * @returns {*|Number}
     */
    Accordion.prototype.getAnimationDuration = function () {
        var findAnimationDuration, that;
        that = this;

        findAnimationDuration = function () {
            var $targetContent, duration;

            if ( 'undefined' === typeof(Accordion.transitionName) ) {
                return '0s';
            }

            $targetContent = that.getTargetContent();
            duration = $targetContent.css( 'transition-duration' );
            duration = duration.split( ',' )[ 0 ];
            return duration;
        };

        if ( ! this.isCacheUsed() ) {
            return findAnimationDuration();
        }

        if ( 'undefined' === typeof(this.animationDuration) ) {
            this.animationDuration = findAnimationDuration();
        }
        return this.animationDuration;
    };

    /**
     * Get animation duration in milliseconds
     * @returns {*|Number}
     */
    Accordion.prototype.getAnimationDurationMilliseconds = function () {
        var duration;
        duration = this.getAnimationDuration();

        if ( 'ms' === duration.substr( - 2 ) ) {
            return parseInt( duration );
        }

        if ( 's' === duration.substr( - 1 ) ) {
            return Math.round( parseFloat( duration ) * 1000 )
        }
    };

    /**
     * Has animation
     * @returns {boolean}
     */
    Accordion.prototype.isAnimated = function () {
        return parseFloat( this.getAnimationDuration() ) > 0;
    };

    /**
     * Show accordion panel
     */
    Accordion.prototype.show = function () {
        var $target, that, $targetContent;

        that = this;
        $target = that.getTarget();
        $targetContent = that.getTargetContent();

        // if showed no need to do anything
        if ( that.isActive() ) {
            return;
        }

        if ( that.isAnimated() ) {
            that.triggerEvent( 'beforeShow.vc.accordion' );
            $target
                .queue( function ( next ) {
                    $targetContent.one( Accordion.transitionName, function () {
                        $target.removeClass( that.animatingClass );
                        $targetContent.attr( 'style', '' );
                        that.triggerEvent( 'afterShow.vc.accordion' );
                    } );
                    Accordion.emulateTransitionEnd( $targetContent, that.getAnimationDurationMilliseconds() + 100 );
                    next();
                } )
                .queue( function ( next ) {
                    $targetContent.attr( 'style', '' );
                    $targetContent.css( {
                        position: 'absolute', // Optional if #myDiv is already absolute
                        visibility: 'hidden',
                        display: 'block'
                    } );
                    var height = $targetContent.height();
                    $targetContent.data( 'vcHeight', height );
                    $targetContent.attr( 'style', '' );
                    next();
                } )
                .queue( function ( next ) {
                    $targetContent.height( 0 );
                    $targetContent.css( {
                        'padding-top': 0,
                        'padding-bottom': 0
                    } );
                    next();
                } )
                .queue( function ( next ) {
                    $target.addClass( that.animatingClass );
                    $target.addClass( that.activeClass );
                    that.changeLocationHash();
                    that.triggerEvent( 'show.vc.accordion' );
                    next();
                } )
                .queue( function ( next ) {
                    var height = $targetContent.data( 'vcHeight' );
                    $targetContent.animate( { 'height': height }, {
                        duration: that.getAnimationDurationMilliseconds(),
                        complete: function () {
                            //PIRENKO
                            jQuery('.pulse_iso_gallery').isotope('layout');
                            if (!$targetContent.data('events')) {
                                $targetContent.attr( 'style', '' );
                            }
                        }
                    } );
                    $targetContent.css( {
                        'padding-top': '',
                        'padding-bottom': ''
                    } );
                    next();
                } );
        } else {
            $target.addClass( that.activeClass );
            that.triggerEvent( 'show.vc.accordion' );
        }
    };

    /**
     * Hide accordion panel
     */
    Accordion.prototype.hide = function () {
        var $target, that, $targetContent;

        that = this;
        $target = that.getTarget();
        $targetContent = that.getTargetContent();

        // if hidden no need to do anything
        if ( ! that.isActive() ) {
            return;
        }

        if ( that.isAnimated() ) {
            that.triggerEvent( 'beforeHide.vc.accordion' );
            $target
                .queue( function ( next ) {
                    $targetContent.one( Accordion.transitionName, function () {
                        $target.removeClass( that.animatingClass );
                        $targetContent.attr( 'style', '' );
                        that.triggerEvent( 'afterHide.vc.accordion' );
                    } );
                    Accordion.emulateTransitionEnd( $targetContent, that.getAnimationDurationMilliseconds() + 100 );
                    next();
                } )
                .queue( function ( next ) {
                    $target.addClass( that.animatingClass );
                    $target.removeClass( that.activeClass );
                    that.triggerEvent( 'hide.vc.accordion' );
                    next();
                } )
                .queue( function ( next ) {
                    var height = $targetContent.height();
                    $targetContent.height( height );
                    next();
                } )
                .queue( function ( next ) {
                    $targetContent.animate( { 'height': 0 }, that.getAnimationDurationMilliseconds() );
                    $targetContent.css( {
                        'padding-top': 0,
                        'padding-bottom': 0
                    } );
                    next();
                } );
        } else {
            $target.removeClass( that.activeClass );
            that.triggerEvent( 'hide.vc.accordion' );
        }
    };

    /**
     * Accordion type: toggle
     */
    Accordion.prototype.toggle = function () {
        var $this;

        $this = this.$element;

        if ( this.isActive() ) {
            Plugin.call( $this, 'hide' );
        } else {
            Plugin.call( $this, 'show' );
        }
    };

    /**
     * Accordion type: dropdown
     */
    Accordion.prototype.dropdown = function () {
        var $this, that;
        that = this;
        $this = this.$element;

        if ( this.isActive() ) {
            Plugin.call( $this, 'hide' );
        } else {
            Plugin.call( $this, 'show' );
            $( document ).on( 'click.vc.accordion.data-api.dropdown', function ( e ) {
                var isTarget;
                isTarget = $( e.target ).closest( that.getTarget() ).length;
                if ( ! isTarget ) {
                    Plugin.call( $this, 'hide' );
                    $( document ).off( e );
                }
            } );
        }
    };

    /**
     * Accordion type: collapse
     */
    Accordion.prototype.collapse = function () {
        var $this,
            $triggers;

        $this = this.$element;
        $triggers = this.getActiveTriggers().filter( function () {
            return $this[ 0 ] !== this;
        } );

        if ( $triggers.length ) {
            Plugin.call( $triggers, 'hide' );
        }
        Plugin.call( $this, 'show' );
    };

    /**
     * Accordion type: collapse all
     */
    Accordion.prototype.collapseAll = function () {
        var $this,
            $triggers;

        $this = this.$element;
        $triggers = this.getActiveTriggers().filter( function () {
            return $this[ 0 ] !== this;
        } );

        if ( $triggers.length ) {
            Plugin.call( $triggers, 'hide' );
        }
        Plugin.call( $this, 'toggle' );
    };

    Accordion.prototype.showNext = function () {
        var $triggers,
            $activeTriggers,
            activeIndex;

        $triggers = this.getTriggers();
        $activeTriggers = this.getActiveTriggers();
        if ( $triggers.length ) {
            if ( $activeTriggers.length ) {
                var lastActiveAccordion;
                lastActiveAccordion = $activeTriggers.eq( $activeTriggers.length - 1 ).vcAccordion().data( 'vc.accordion' );
                if ( lastActiveAccordion && lastActiveAccordion.getIndex ) {
                    activeIndex = lastActiveAccordion.getIndex();
                }
            }
            if ( - 1 < activeIndex ) {
                if ( activeIndex + 1 < $triggers.length ) {
                    Plugin.call( $triggers.eq( activeIndex + 1 ), 'controller' );
                } else {
                    // we are in the end so next is first
                    Plugin.call( $triggers.eq( 0 ), 'controller' );
                }
            } else {
                // no one is active let's activate first
                Plugin.call( $triggers.eq( 0 ), 'controller' );
            }
        }
    };

    Accordion.prototype.showPrev = function () {
        var $triggers,
            $activeTriggers,
            activeIndex;

        $triggers = this.getTriggers();
        $activeTriggers = this.getActiveTriggers();
        if ( $triggers.length ) {
            if ( $activeTriggers.length ) {
                var lastActiveAccordion;
                lastActiveAccordion = $activeTriggers.eq( $activeTriggers.length - 1 ).vcAccordion().data( 'vc.accordion' );
                if ( lastActiveAccordion && lastActiveAccordion.getIndex ) {
                    activeIndex = lastActiveAccordion.getIndex();
                }
            }
            if ( - 1 < activeIndex ) {
                if ( 0 <= activeIndex - 1 ) {
                    Plugin.call( $triggers.eq( activeIndex - 1 ), 'controller' );
                } else {
                    // we are in the end so next is first
                    Plugin.call( $triggers.eq( $triggers.length - 1 ), 'controller' );
                }
            } else {
                // no one is active let's activate first
                Plugin.call( $triggers.eq( 0 ), 'controller' );
            }
        }
    };

    Accordion.prototype.showAt = function ( index ) {
        var $triggers;

        $triggers = this.getTriggers();
        if ( $triggers.length && index && index < $triggers.length ) {
            Plugin.call( $triggers.eq( index ), 'controller' );
        }
    };

    old = $.fn.vcAccordion;

    $.fn.vcAccordion = Plugin;
    $.fn.vcAccordion.Constructor = Accordion;

    // Accordion no conflict
    // ==========================
    $.fn.vcAccordion.noConflict = function () {
        $.fn.vcAccordion = old;
        return this;
    };

    // Accordion data-api
    // =================
    clickHandler = function ( e ) {
        var $this;
        $this = $( this );
        e.preventDefault();
        Plugin.call( $this, 'controller' );
    };

    hashNavigation = function () {
        var hash, $targetElement, $accordion, offset, delay, speed;
        offset = 0.3;
        delay = 300;
        speed = 0;

        hash = window.location.hash;
        if ( hash ) {
            $targetElement = $( hash );
            if ( $targetElement.length && $targetElement.hasClass('vc_tta-panel')) {//PIRENKO FIX
                $accordion = $targetElement.find('[data-vc-accordion]');
                if ( $accordion.length ) {
                    setTimeout( function () {
                        $( 'html, body' ).animate( {
                            scrollTop: $targetElement.offset().top - $( window ).height() * offset
                        }, speed );
                    }, delay );
                    $accordion.trigger( 'click' );
                }
            }
        }
    };

    $( document ).on( 'click.vc.accordion.data-api', '[data-vc-accordion]', clickHandler );
    $( document ).ready( hashNavigation );
}( window.jQuery );
/* =========================================================
 * vc-tabs.js v1.0.0
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * WPBakery Page Builder Tabs
 * ========================================================= */
+ function ( $ ) {
    'use strict';

    var Tabs, old, clickHandler, changeHandler;

    /**
     * Tabs object definition
     * @param element
     * @constructor
     */
    Tabs = function ( element, options ) {
        this.$element = $( element );
        this.activeClass = 'vc_active';
        this.tabSelector = '[data-vc-tab]';

        // cached vars
        this.useCacheFlag = undefined;
        this.$target = undefined;
        this.selector = undefined;
        this.$targetTab = undefined;
        this.$relatedAccordion = undefined;
        this.$container = undefined;
    };

    /**
     * Is cache used
     * @returns {boolean}
     */
    Tabs.prototype.isCacheUsed = function () {
        var useCache, that;
        that = this;
        useCache = function () {
            return false !== that.$element.data( 'vcUseCache' );
        };

        if ( undefined === this.useCacheFlag ) {
            this.useCacheFlag = useCache();
        }

        return this.useCacheFlag;
    };

    /**
     * Get container
     * @returns {*|Number}
     */
    Tabs.prototype.getContainer = function () {
        if ( ! this.isCacheUsed() ) {
            return this.findContainer();
        }

        if ( undefined === this.$container ) {
            this.$container = this.findContainer();
        }

        return this.$container;
    };

    /**
     * Find container
     * @returns {window.jQuery}
     */
    Tabs.prototype.findContainer = function () {
        var $container;
        $container = this.$element.closest( this.$element.data( 'vcContainer' ) );
        if ( ! $container.length ) {
            $container = $( 'body' );
        }
        return $container;
    };

    /**
     * Get container accordions
     * @returns {*}
     */
    Tabs.prototype.getContainerAccordion = function () {
        return this.getContainer().find( '[data-vc-accordion]' );
    };

    /**
     * Get selector
     * @returns {*}
     */
    Tabs.prototype.getSelector = function () {
        var findSelector, $this;

        $this = this.$element;
        findSelector = function () {
            var selector;

            selector = $this.data( 'vcTarget' );
            if ( ! selector ) {
                selector = $this.attr( 'href' );
            }

            return selector;
        };

        if ( ! this.isCacheUsed() ) {
            return findSelector();
        }

        if ( undefined === this.selector ) {
            this.selector = findSelector();
        }

        return this.selector;
    };

    /**
     * Get target
     * @returns {*}
     */
    Tabs.prototype.getTarget = function () {
        var selector;
        selector = this.getSelector();

        if ( ! this.isCacheUsed() ) {
            return this.getContainer().find( selector );
        }

        if ( undefined === this.$target ) {
            this.$target = this.getContainer().find( selector );
        }

        return this.$target;
    };

    /**
     * Get related accordion
     * @returns {*}
     */
    Tabs.prototype.getRelatedAccordion = function () {
        var tab, filterElements;

        tab = this;

        filterElements = function () {
            var $elements;

            $elements = tab.getContainerAccordion().filter( function () {
                var $that, accordion;
                $that = $( this );

                accordion = $that.data( 'vc.accordion' );

                if ( undefined === accordion ) {
                    $that.vcAccordion();
                    accordion = $that.data( 'vc.accordion' );
                }

                return tab.getSelector() === accordion.getSelector();
            } );

            if ( $elements.length ) {
                return $elements;
            }

            return undefined;
        };
        if ( ! this.isCacheUsed() ) {
            return filterElements();
        }

        if ( undefined === this.$relatedAccordion ) {
            this.$relatedAccordion = filterElements();
        }

        return this.$relatedAccordion;
    };

    /**
     * Trigger event
     * @param event
     */
    Tabs.prototype.triggerEvent = function ( event ) {
        var $event;
        if ( 'string' === typeof event ) {
            $event = $.Event( event );
            this.$element.trigger( $event );
        }
    };

    /**
     * Get target tab
     * @returns {*|Number}
     */
    Tabs.prototype.getTargetTab = function () {
        var $this;
        $this = this.$element;

        if ( ! this.isCacheUsed() ) {
            return $this.closest( this.tabSelector );
        }

        if ( undefined === this.$targetTab ) {
            this.$targetTab = $this.closest( this.tabSelector );
        }

        return this.$targetTab;
    };

    /**
     * Tab Clicked
     */
    Tabs.prototype.tabClick = function () {

        this.getRelatedAccordion().trigger( 'click' );
    };

    /**
     * Tab Show
     */
    Tabs.prototype.show = function () {
        // if showed no need to do anything
        if ( this.getTargetTab().hasClass( this.activeClass ) ) {
            return;
        }

        this.triggerEvent( 'show.vc.tab' );
        //PIRENKO
        jQuery('.pulse_iso_gallery').isotope('layout');
        setTimeout(function() {
            jQuery(window).trigger("debouncedresize");
            jQuery('.masonry_blog').each(function() {
                var $inner_blog=jQuery(this);
                $inner_blog.isotope('layout');
            });
        },100);
        this.getTargetTab().addClass( this.activeClass );
    };

    /**
     * Tab Hide
     */
    Tabs.prototype.hide = function () {
        // if showed no need to do anything
        if ( ! this.getTargetTab().hasClass( this.activeClass ) ) {
            return;
        }

        this.triggerEvent( 'hide.vc.tab' );

        this.getTargetTab().removeClass( this.activeClass );
    };

    //Tabs.prototype

    // Tabs plugin definition
    // ==========================
    function Plugin( action, options ) {
        var args;

        args = Array.prototype.slice.call( arguments, 1 );
        return this.each( function () {
            var $this, data;

            $this = $( this );
            data = $this.data( 'vc.tabs' );
            if ( ! data ) {
                data = new Tabs( $this, $.extend( true, {}, options ) );
                $this.data( 'vc.tabs', data );
            }
            if ( 'string' === typeof action ) {
                data[ action ].apply( data, args );
            }
        } );
    }

    old = $.fn.vcTabs;

    $.fn.vcTabs = Plugin;
    $.fn.vcTabs.Constructor = Tabs;

    // Tabs no conflict
    // ==========================
    $.fn.vcTabs.noConflict = function () {
        $.fn.vcTabs = old;
        return this;
    };

    // Tabs data-api
    // =================

    clickHandler = function ( e ) {
        var $this;
        $this = $( this );
        e.preventDefault();
        Plugin.call( $this, 'tabClick' );
    };

    changeHandler = function ( e ) {
        var caller;
        caller = $( e.target ).data( 'vc.accordion' );

        if ( undefined === caller.getRelatedTab ) {
            /**
             * Get related tab from accordion
             * @returns {*}
             */
            caller.getRelatedTab = function () {
                var findTargets;

                findTargets = function () {
                    var $targets;
                    $targets = caller.getContainer().find( '[data-vc-tabs]' ).filter( function () {
                        var $this, tab;
                        $this = $( this );

                        tab = $this.data( 'vc.accordion' );
                        if ( undefined === tab ) {
                            $this.vcAccordion();
                        }
                        tab = $this.data( 'vc.accordion' );

                        return tab.getSelector() === caller.getSelector();
                    } );

                    return $targets;
                };

                if ( ! caller.isCacheUsed() ) {
                    return findTargets();
                }

                if ( undefined === caller.relatedTab ) {
                    caller.relatedTab = findTargets();
                }

                return caller.relatedTab;
            };
        }

        Plugin.call( caller.getRelatedTab(), e.type );
    };

    $( document ).on( 'click.vc.tabs.data-api', '[data-vc-tabs]', clickHandler );
    $( document ).on( 'show.vc.accordion hide.vc.accordion', changeHandler );
}( window.jQuery );
/* =========================================================
 * vc-tta-autoplay.js v1.0.0
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * WPBakery Page Builder tabs, tours, accordion auto play
 * ========================================================= */
+ function ( $ ) {
    'use strict';

    var Plugin, TtaAutoPlay, old;

    Plugin = function ( action, options ) {
        var args;

        args = Array.prototype.slice.call( arguments, 1 );
        return this.each( function () {
            var $this, data;

            $this = $( this );
            data = $this.data( 'vc.tta.autoplay' );
            if ( ! data ) {
                data = new TtaAutoPlay( $this,
                    $.extend( true, {}, TtaAutoPlay.DEFAULTS, $this.data( 'vc-tta-autoplay' ), options ) );
                $this.data( 'vc.tta.autoplay', data );
            }
            if ( 'string' === typeof action ) {
                data[ action ].apply( data, args );
            } else {
                data.start( args ); // start the auto play by default
            }
        } );
    };

    /**
     * AutoPlay constuctor
     * @param $element
     * @param options
     * @constructor
     */
    TtaAutoPlay = function ( $element, options ) {
        this.$element = $element;
        this.options = options;
    };

    TtaAutoPlay.DEFAULTS = {
        delay: 5000,
        pauseOnHover: true,
        stopOnClick: true
    };

    /**
     * Method called on timeout hook call
     */
    TtaAutoPlay.prototype.show = function () {
        this.$element.find( '[data-vc-accordion]:eq(0)' ).vcAccordion( 'showNext' );
    };

    /**
     * Check is container has set window.setInterval
     *
     * @returns {boolean}
     */
    TtaAutoPlay.prototype.hasTimer = function () {
        return undefined !== this.$element.data( 'vc.tta.autoplay.timer' );
    };

    /**
     * Set for container window.setInterval and save it in data-attribute
     *
     * @param windowInterval
     */
    TtaAutoPlay.prototype.setTimer = function ( windowInterval ) {
        this.$element.data( 'vc.tta.autoplay.timer', windowInterval );
    };

    /**
     * Get containers timer from data-attributes
     *
     * @returns {*|Number}
     */
    TtaAutoPlay.prototype.getTimer = function () {
        return this.$element.data( 'vc.tta.autoplay.timer' );
    };

    /**
     * Removes from container data-attributes timer
     */
    TtaAutoPlay.prototype.deleteTimer = function () {
        this.$element.removeData( 'vc.tta.autoplay.timer' );
    };

    /**
     * Starts the autoplay timer with multiple call preventions
     */
    TtaAutoPlay.prototype.start = function () {
        var $this,
            that;

        $this = this.$element;
        that = this;

        /**
         * Local method called when accordion title being clicked
         * Used to stop autoplay
         *
         * @param e {jQuery.Event}
         */
        function stopHandler( e ) {
            e.preventDefault && e.preventDefault();

            if ( that.hasTimer() ) {
                Plugin.call( $this, 'stop' );
            }
        }

        /**
         * Local method called when mouse hovers a [data-vc-tta-autoplay] element( this.$element )
         * Used to pause/resume autoplay
         *
         * @param e {jQuery.Event}
         */
        function hoverHandler( e ) {
            e.preventDefault && e.preventDefault();

            if ( that.hasTimer() ) {
                Plugin.call( $this, 'mouseleave' === e.type ? 'resume' : 'pause' );
            }
        }

        if ( ! this.hasTimer() ) {
            this.setTimer( window.setInterval( this.show.bind( this ), this.options.delay ) );

            // On switching tab by click it stop/clears the timer
            this.options.stopOnClick && $this.on( 'click.vc.tta.autoplay.data-api',
                '[data-vc-accordion]',
                stopHandler );

            // On hover it pauses/resumes the timer
            this.options.pauseOnHover && $this.hover( hoverHandler );
        }
    };

    /**
     * Resumes the paused autoplay timer
     */
    TtaAutoPlay.prototype.resume = function () {
        if ( this.hasTimer() ) {
            this.setTimer( window.setInterval( this.show.bind( this ), this.options.delay ) );
        }
    };

    /**
     * Stop the autoplay timer
     */
    TtaAutoPlay.prototype.stop = function () {
        this.pause();
        this.deleteTimer();
        // Remove bind events in TtaAutoPlay.prototype.start method
        this.$element.off( 'click.vc.tta.autoplay.data-api mouseenter mouseleave' );
    };

    /**
     * Pause the autoplay timer
     */
    TtaAutoPlay.prototype.pause = function () {
        var timer;

        timer = this.getTimer();
        if ( undefined !== timer ) {
            window.clearInterval( timer );
        }
    };

    old = $.fn.vcTtaAutoPlay;

    $.fn.vcTtaAutoPlay = Plugin;

    $.fn.vcTtaAutoPlay.Constructor = TtaAutoPlay;

    /**
     * vcTtaAutoPlay no conflict
     * @returns {$.fn.vcTtaAutoPlay}
     */
    $.fn.vcTtaAutoPlay.noConflict = function () {
        $.fn.vcTtaAutoPlay = old;
        return this;
    };

    /**
     * Find all autoplay elements and start the timer
     */
    function startAutoPlay() {
        $( '[data-vc-tta-autoplay]' ).each( function () {
            $( this ).vcTtaAutoPlay();
        } );
    }

    /**
     *
     */
    $( document ).ready( startAutoPlay );
}( window.jQuery );

/* jshint ignore:end */