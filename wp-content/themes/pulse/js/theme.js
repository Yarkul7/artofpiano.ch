/* jshint ignore:start */

//OLDER BROWSERS CONSOLE SUPPORT
if(!(window.console && console.log)) {
    console = {
        log: function(){},
        debug: function(){},
        info: function(){},
        warn: function(){},
        error: function(){}
    };
}

//GLOBAL VARIABLES DECLARATION
var loading_page=true;
var current_URL=jQuery(location).attr('href');
var loaded_google_maps=false;
var first_load=true;
var admin_bar_height=0;
var mn_collapsed=0;
if (jQuery('.pulse_theme.admin-bar').length) {
    admin_bar_height=32;
}
function pulse_init() {
    "use strict";
    var stop_verification=false;
    var on_top=true;
    var height_fix=0;
    pirenko_resize();
    var menu_is_open=false;
    var sidebar_is_open=false;
    var hiddenbar_is_open=false;
    var mn_normal=theme_options.menu_vertical;
    mn_collapsed=theme_options.collapsed_menu_vertical;
    var ajax_calls = theme_options.ajax_calls==="1" ? true : false;
    var rows_offset=parseInt(theme_options.collapsed_menu_vertical,10)+4;
    var ls_pos=0;
    var ns_pos=0;
    if (theme_options.header_opacity_after=="0" || theme_options.menu_hide_flag=="1" || theme_options.menu_display=="st_hidden_menu") {
        mn_collapsed=0;
    }
    if (theme_options.menu_collapse_flag=="0" && theme_options.menu_display!="st_hidden_menu") {
        mn_collapsed=theme_options.menu_vertical;
    }
    var hide_onscroll=false;
    if (theme_options.menu_hide_flag==="1") {
        hide_onscroll=true;
    }
    var pulse_on_mobile = is_mobile()===true ? true : false;
    var pulse_is_iPad = navigator.userAgent.match(/iPad/i) != null;
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
        pulse_is_iPad=true;
    }
    if (pulse_on_mobile || pulse_is_iPad) {
        jQuery('html').addClass('pulse_on_mobile');
        //jQuery('.slider_scroll_button').remove();
    }
    else {
        jQuery('html').addClass('pulse_on_desktop');
    }
    jQuery('#prk_blocks_wrapper').on('click',function() {
        jQuery('#prk_blocks_wrapper').removeClass('hover_trigger');
        if (!jQuery('html').hasClass('menu_at_top')) {
            prk_toggle_menu();
        }
        else {
            prk_toggle_hidden();
        }
    });
    jQuery('#prk_sidebar_trigger').on('click',function() {
        prk_toggle_sidebar();
    });
    //FIX FOR MEDIA QUERIES ON SOME BROWSERS
    var scrollbar_width=window.innerWidth-jQuery("body").width();
    var ua = navigator.userAgent.toLowerCase(); ;
    var msie = ua.indexOf('msie');
    var trident = ua.indexOf('trident/');
    if (msie > 0 || trident > 0) {
        scrollbar_width=scrollbar_width+1;
    }

    //MENU FUNCTIONS
    jQuery('#pulse_main_menu').attr('data-width',jQuery('#pulse_main_menu .pulse-menu-ul').width());
    var resp_width=theme_options.resp_break;
    function deactivate_menu_links(new_link) {
        //console.log("SHUT DOWN");
        jQuery("#pulse_main_menu .pulse-menu-ul li,.mobile-menu-ul li,#prk_hidden_bar_inner .menu li").removeClass('active');
        jQuery("#pulse_main_menu .pulse-menu-ul li,.mobile-menu-ul li,#prk_hidden_bar_inner .menu li").removeClass('active_parent');
    }
    function close_mobile_submenus() {
        jQuery('.mobile-menu-ul li.menu-item-has-children').each(function() {
            if (!jQuery(this).hasClass('active_parent')) {
                jQuery(this).find('.sub-menu').slideUp({
                    'duration':0,
                    easing:'easeOutExpo',
                    step: function(now, fx) {},
                    complete:function() {}
                });
            }
        });
    }
    //ADD SPECIAL CLASSES
    jQuery("#prk_hidden_menu_page .widget_nav_menu>.menu").addClass('prk_popper_menu header_font prk_menu_sized');
    jQuery('.mobile-menu-ul').addClass('prk_popper_menu');
    jQuery('.prk_popper_menu a,#pulse_main_menu ul.pulse-menu-ul a').each(function() {
        jQuery(this).addClass('pulse_anchor');
    });
    //MAIN MENU
    jQuery('#pulse_main_menu ul.pulse-menu-ul').superfish({
        hoverClass:'pulse_hover_sub',
        delay:200,//DELAY BEFORE HIDING
        animation: {height:'show'},
        cssArrows:    false,
        speed:         300,
        speedOut:      100,
        dropShadows:   false,
    });

    jQuery(document).on('click','.pulse_maps', function(event) {
        jQuery('.pulse_maps iframe').css("pointer-events", "auto");
    });
    jQuery(document).on('mouseleave','.pulse_maps', function(event) {
        jQuery('.pulse_maps iframe').css("pointer-events", "none");
    });
    //MENU LIKE LINKS
    jQuery(document).on('click',"a.pulse_anchor,.pulse_anchor a", function(event) {
        if (jQuery(this).attr("target")==="_blank" || jQuery(this).parent().hasClass('regular_load') || event.metaKey) {
            //OPEN LINK NORMALLY - TODO?
        }
        else {
            event.preventDefault();
            if(pulse_on_mobile && jQuery(this).hasClass('pls_touch') && !jQuery(this).parents('.portfolio_entry_li.hover_trigger').length) {
                jQuery(this).parent().parent().find('.portfolio_entry_li').removeClass('hover_trigger');
                jQuery(this).parent().addClass('hover_trigger');
                return;
            }
            var offsetter="";
            var fragment=jQuery(this).attr('href').split('#');
            jQuery(this).parent().children('.sub-menu').slideToggle({
                'duration':500,
                easing:'easeOutExpo'
            });
            //return true;
            //console.log(fragment[0]);
            if ((jQuery(this).attr('href')==="#" || fragment[1]==="") && fragment[0]===current_URL)  {
                offsetter=0;
            }
            else {
                var target = this.hash;
                var $target = jQuery(target);
                //IS IT AN ANCHOR LINK
                if (target!=="") {
                    //IS IT AN EXISITNG ID
                    if ($target.offset()!==undefined) {
                        offsetter=$target.offset().top;
                    }
                }
            }
            if (offsetter!=="") {
                if(!jQuery('#prk_custom_folio').length) {
                    jQuery('html,body').stop().animate({
                            'scrollTop': offsetter-admin_bar_height-mn_collapsed
                        },
                        1200,
                        'easeInOutExpo'
                    );
                }
                else {
                    jQuery('html,body').stop().animate({
                            'scrollTop': offsetter-admin_bar_height
                        },
                        1200,
                        'easeInOutExpo'
                    );
                }
            }
            if (menu_is_open===true) {
                prk_toggle_menu();
            }
            if (ajax_calls && !jQuery('.pulse_theme.admin-bar').length) {
                if (loading_page===false && jQuery(this).attr("href")!=="#" && offsetter==="") {
                    var next_page=jQuery(this).attr("href");
                    loading_page=true;
                    jQuery('#pulse_main_menu .pulse-menu-ul>li.pulse_hover_sub').superfish('hide');
                    deactivate_menu_links(next_page);
                    if (jQuery(this).attr('id')!=="pls_home_link") {
                        jQuery(this).parent().addClass('active');
                        if (jQuery(this).parent().parent().hasClass('sub-menu')) {
                            jQuery(this).parent().parent().parent().addClass('active_parent');
                        }
                    }
                    else {
                        jQuery('#pulse_main_menu .pulse-menu-ul>li>a').each(function() {
                            if (jQuery(this).attr('href')===next_page) {
                                jQuery(this).parent().addClass('active');
                            }
                        });
                    }
                    jQuery('#pulse_main_menu .pulse-menu-ul>li').removeClass('pulse_hover_sub');
                    jQuery('#pulse_main_wrapper').addClass('prk_loading_page');
                    jQuery('#pulse_main_wrapper').addClass('prk_wait');
                    setTimeout(function() {
                        load_ajax_page(next_page,true);
                        if (hiddenbar_is_open===true) {
                            prk_toggle_hidden();
                            close_mobile_submenus();
                        }
                    },350);
                }
                else {
                    if (hiddenbar_is_open===true && jQuery(this).attr("href")!=="#") {
                        prk_toggle_hidden();
                        close_mobile_submenus();
                    }
                }
            }
            else {
                if (offsetter==="") {
                    window.location=jQuery(this).attr("href");
                }
                else {
                    if (hiddenbar_is_open===true && jQuery(this).attr("href")!=="#") {
                        prk_toggle_hidden();
                        close_mobile_submenus();
                    }
                }
            }
        }
    });
    function prk_toggle_menu() {
        if (menu_is_open===false) {
            jQuery('#prk_blocks_wrapper').removeClass('hover_trigger');
            menu_is_open=true;
            jQuery('body').addClass('pulse_showing_menu');
            jQuery('#body_hider,#prk_hidden_menu,#prk_blocks_wrapper').addClass('pulse_second_menu_anims');
            jQuery('#body_hider').stop();
            //CHECK FOR FIXED POSITION FOOTER
            if (jQuery('#prk_footer_mirror').length) {
                jQuery('#body_hider').css({'height':'0px','z-index':'992'});
            }
            else {
                jQuery('#body_hider').css({'height':'0px','z-index':'992'});//WAS 991
            }
            jQuery('#body_hider').animate({
                    height:jQuery(window).height()-admin_bar_height
                },
                {
                    easing:'easeOutExpo',
                    duration:400
                }
            );
            jQuery('#prk_hidden_menu').stop();
            jQuery('#prk_hidden_menu').css({'visibility':'visible','opacity':'0'});
            setTimeout(function() {
                jQuery('#prk_hidden_menu').animate({
                        opacity:1
                    },
                    {
                        easing:'linear',
                        duration:200
                    }
                );
            },300);
        }
        else {
            menu_is_open=false;
            jQuery('#prk_hidden_menu,#prk_blocks_wrapper').removeClass('pulse_second_menu_anims');
            jQuery('#body_hider').stop();
            jQuery('#prk_hidden_menu').stop();
            jQuery('#prk_hidden_menu').animate({
                    opacity:0
                },
                {
                    easing:'linear',
                    duration:200
                }
            );
            setTimeout(function() {
                jQuery('#body_hider').animate({
                        height:0
                    },
                    {
                        easing:'easeOutExpo',
                        duration:400
                    }
                );
            },250);
            setTimeout(function() {
                jQuery('body').removeClass('pulse_showing_menu');
                jQuery('#body_hider').removeClass('pulse_second_menu_anims');
                jQuery('#prk_hidden_menu').css({'opacity':'','visibility':''});
                jQuery('#body_hider').css({'height':'','z-index':''});
            },700);
        }
    }
    function prk_toggle_hidden() {
        if (hiddenbar_is_open===true) {
            hiddenbar_is_open=false;
            jQuery('#body_hider').stop().animate({
                    opacity:0
                },
                {
                    easing:'linear',
                    duration:200
                }
            );
            setTimeout(function(){
                jQuery('body').removeClass('prk_shifted');
                jQuery('body').removeClass('pulse_showing_mobile');
            },150);
            setTimeout(function(){
                //document.removeEventListener( 'click', click_on_body );
                jQuery('#body_hider').css({'visibility':'','opacity':''});
                jQuery('body').removeClass('second_anims');
                jQuery('#body_hider').removeClass('second_anims');
                jQuery('#body_hider').removeClass('prk_shifted_hider');
            },500);
        }
        else {
            hiddenbar_is_open=true;
            jQuery('body').addClass('second_anims prk_shifted pulse_showing_mobile');
            jQuery('#body_hider').css({'visibility':'visible'});
            jQuery('#body_hider').addClass('prk_shifted_hider second_anims');
            setTimeout(function(){
                jQuery('#body_hider').stop().animate({
                        opacity:1
                    },
                    {
                        easing:'linear',
                        duration:200
                    }
                );
            },600);
        }
    }
    function check_top_menu(resize_flag) {
        if (theme_options.menu_collapse_flag==="1") {
            if(jQuery(window).scrollTop()>=theme_options.menu_collapse_pixels || resize_flag===true) {
                if (on_top===true || resize_flag===true) {
                    on_top=false;
                    jQuery('#pulse_header_background,#pulse_header_inner,#pulse_main_menu,#prk_menu_loupe,#menu_social_nets,#nav-main,#pls_side_menu').addClass('pulse_collapsed_menu');
                }
            }
            else {
                if (on_top===false) {
                    on_top=true;
                    jQuery('#pulse_header_background,#pulse_header_inner,#pulse_main_menu,#prk_menu_loupe,#menu_social_nets,#nav-main,#pls_side_menu').removeClass('pulse_collapsed_menu');
                }
            }
        }
    }

    //HIDDEN SIDEBAR FUNCTIONS
    jQuery('#body_hider').on('click',function() {
        if (sidebar_is_open===true) {
            prk_toggle_sidebar();
        }
        if (hiddenbar_is_open===true) {
            prk_toggle_hidden();
        }
    });
    function prk_toggle_sidebar() {
        if (sidebar_is_open===false) {
            jQuery('#prk_sidebar_trigger').removeClass('hover_trigger');
            sidebar_is_open=true;
            jQuery('body').addClass('pulse_showing_sidebar');
            jQuery('#pulse_ajax_container,#pulse_header_section,#body_hider,#pulse_header_background,#prk_footer_outer,#prk_hidden_bar').addClass('pulse_second_sidebar_anims');
            setTimeout(function() {
                jQuery('#body_hider').css({'z-index':'1000'});
                jQuery('#body_hider').stop().animate({
                        opacity:1
                    },
                    {
                        easing:'linear',
                        duration:200
                    }
                );
            },600);
        }
        else {
            sidebar_is_open=false;
            jQuery('#pulse_ajax_container,#pulse_header_section,#pulse_header_background,#prk_footer_outer,#prk_hidden_bar').removeClass('pulse_second_sidebar_anims');
            jQuery('#body_hider').stop().animate({
                    opacity:0
                },
                {
                    easing:'linear',
                    duration:200
                }
            );
            setTimeout(function() {
                jQuery('body').removeClass('pulse_showing_sidebar');
                jQuery('#body_hider').removeClass('pulse_second_sidebar_anims');
                jQuery('#body_hider').css({'opacity':'','z-index':''});
            },350);
        }
    }
    jQuery("#prk_hidden_bar_scroller").mCustomScrollbar({
        scrollInertia:450,
        autoHideScrollbar:true,
        scrollButtons:{
            enable:false
        },
    });
    jQuery("#prk_mobile_bar_scroller").mCustomScrollbar({
        scrollInertia:450,
        autoHideScrollbar:true,
        setTop: '0px',
        scrollButtons:{
            enable:false
        },
    });

    function is_on_viewport(elem) {
        if (!jQuery(elem).length) {
            return false;
        }
        else {
            var docViewTop = jQuery(window).scrollTop();
            var docViewBottom = docViewTop + jQuery(window).height();
            var elemTop = jQuery(elem).offset().top;
            var elemBottom = elemTop + jQuery(elem).height();
            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
        }
    }

    //SHARING FUNCTIONS
    function prk_init_sharrre() {
        jQuery('.prk_sharrre_twitter').sharrre({
            share: {
                twitter: true
            },
            template: '<a class="box social_tipped" href="#" data-color="#43b3e5"><div class="share"><i class="pulse_fa-twitter"></i></div></a><div class="count prk_sharrre_count" href="#">{total}</div>',
            enableHover: false,
            enableTracking: false,
            //buttons: { twitter: {via: 'username'}},
            click: function(api) {
                api.simulateClick();
                api.openPopup('twitter');
            },
            render: function(api){
            }
        });
        jQuery('.prk_sharrre_facebook').sharrre({
            share: {
                facebook: true
            },
            template: '<a class="box social_tipped" href="#" data-color="#1f69b3"><div class="share"><i class="pulse_fa-facebook"></i></div></a><div class="count prk_sharrre_count" href="#">{total}</div>',
            enableHover: false,
            enableTracking: false,
            click: function(api) {
                api.simulateClick();
                api.openPopup('facebook');
            },
            render: function(api){
            }
        });
        jQuery('.prk_sharrre_google').sharrre({
            share: {
                googlePlus: true
            },
            template: '<a class="box social_tipped" href="#" data-color="#222222"><div class="share"><i class="pulse_fa-google-plus"></i></div></a><div class="count prk_sharrre_count" href="#">{total}</div>',
            enableHover: false,
            enableTracking: false,
            click: function(api) {
                api.simulateClick();
                api.openPopup('googlePlus');
            },
            render: function(api){
            }
        });
        var pinterestMedia="";
        jQuery('.prk_sharrre_pinterest').sharrre({
            share: {
                pinterest: true
            },
            buttons: {
                pinterest: {
                    media: pinterestMedia,
                    description: ''
                }
            },
            template: '<a class="box social_tipped" href="#" data-color="#df2126"><div class="share"><i class="pulse_fa-pinterest-p"></i></div></a><div class="count prk_sharrre_count" href="#">{total}</div>',
            enableHover: false,
            enableTracking: false,
            click: function(api) {
                api.simulateClick();
                api.openPopup('pinterest');
            },
            render: function(api){
            }
        });
        jQuery('.prk_sharrre_pinterest').on({
            mouseenter:function() {
                jQuery('#prk_pint').attr('data-desc','');
                jQuery('#prk_pint').attr('data-media',jQuery(this).attr('data-media'));
                if (jQuery('#folio_ttl').length) {
                    jQuery('#prk_pint').attr('data-desc',jQuery('#folio_ttl').html());
                }
                else if(jQuery('#single_blog_title').length) {
                    jQuery('#prk_pint').attr('data-desc',jQuery('#single_blog_title').html());
                }
            },
        });
    }
    //END - SHARING FUNCTIONS


    //ANIMATED HEADLINES FUNCTIONS
    //set animation timing
    var animationDelay = 2500,
        //loading bar effect
        barAnimationDelay = 3800,
        barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
        //letters effect
        lettersDelay = 50,
        //type effect
        typeLettersDelay = 150,
        selectionDuration = 500,
        typeAnimationDelay = selectionDuration + 800,
        //clip effect
        revealDuration = 600,
        revealAnimationDelay = 1500;

    function initHeadline() {
        jQuery('.prk_text_rotator.per_init').each(function() {
            var $thisi=jQuery(this);
            $thisi.removeClass('per_init');
            //insert <i> element for each letter of a changing word
            singleLetters($thisi.find('.cd-headline.letters').find('b'));
            //initialise headline animation
            animateHeadline($thisi.find('.cd-headline'));
        });
        /* PIRENKO PREVIEWS
        setTimeout(function(){
            jQuery('.prk_text_rotator.per_init').each(function() {
                var $thisi=jQuery(this);
                $thisi.removeClass('per_init');
                //insert <i> element for each letter of a changing word
                singleLetters($thisi.find('.cd-headline.letters').find('b'));
                //initialise headline animation
                animateHeadline($thisi.find('.cd-headline'));
            });
          },1400);
        //END */
    }

    function singleLetters($words) {
        $words.each(function(){
            var word = jQuery(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            var i="";
            for (i in letters) {
                //if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                if (letters[i]===" ") {

                    letters[i] = (selected) ? '<i class="in hidenize">i</i>':'<i class="hidenize">i</i>';
                }
                else {
                    letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
                }
            }
            var newLetters = letters.join('');
            word.html(newLetters);
        });
    }

    function animateHeadline($headlines) {
        $headlines.each(function(){
            var headline = jQuery(this);
            //console.log(jQuery(this).attr('data-speed'));
            var duration = jQuery(this).attr('data-speed');
            if(headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
            } else if (headline.hasClass('clip')){
                var spanWrapper = headline.find('.cd-words-wrapper'),
                    newWidth = spanWrapper.width() + 10
                spanWrapper.css('width', newWidth);
            } else if (!headline.hasClass('type') ) {
                //assign to .cd-words-wrapper the width of its longest word
                var words = headline.find('.cd-words-wrapper b'),
                    width = 0;
                words.each(function(){
                    var wordWidth = jQuery(this).width();
                    if (wordWidth > width) width = wordWidth;
                });
                headline.find('.cd-words-wrapper').css('width', width);
            };

            //trigger animation
            setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);
        var custom_delay=animationDelay;
        if ($word.parents('.cd-headline').attr('data-speed')!==undefined) {
            custom_delay=$word.parents('.cd-headline').attr('data-speed');
        }
        if($word.parents('.cd-headline').hasClass('type')) {
            var parentSpan = $word.parent('.cd-words-wrapper');
            parentSpan.addClass('selected').removeClass('waiting');
            setTimeout(function(){
                parentSpan.removeClass('selected');
                $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
            }, selectionDuration);
            setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

        } else if($word.parents('.cd-headline').hasClass('letters')) {
            var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
            hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

        }  else if($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
                switchWord($word, nextWord);
                showWord(nextWord);
            });

        } else if ($word.parents('.cd-headline').hasClass('loading-bar')){
            $word.parents('.cd-words-wrapper').removeClass('is-loading');
            switchWord($word, nextWord);
            setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
            setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

        } else {
            switchWord($word, nextWord);
            setTimeout(function(){ hideWord(nextWord) }, custom_delay);
        }
    }

    function showWord($word, $duration) {
        if($word.parents('.cd-headline').hasClass('type')) {
            showLetter($word.find('i').eq(0), $word, false, $duration);
            $word.addClass('is-visible').removeClass('is-hidden');

        }  else if($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
                setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
            });
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');

        if(!$letter.is(':last-child')) {
            setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else if($bool) {
            setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
        }

        if($letter.is(':last-child') && jQuery('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');

        if(!$letter.is(':last-child')) {
            setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else {
            if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
            if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }
    //END ANIMATED HEADLINES FUNCTIONS

    //FOOTER
    var widgets_counter=0;
    jQuery('#prk_footer_inner>.row>.widget').each(function() {
        jQuery(this).addClass(theme_options.widgets_nr);
        widgets_counter++;
        if (widgets_counter>1 && widgets_counter===(12/parseInt(jQuery('#prk_footer').attr('data-layout').replace('small-',''),10))) {
            jQuery(this).after('<div class="clearfix bt_2x"></div>');
            widgets_counter=0;
        }
    });

    //TOGGLE HOVER FUNCTIONS
    jQuery('#prk_blocks_wrapper,#prk_sidebar_trigger').on({
        mouseenter:function() {
            jQuery(this).addClass('hover_trigger');
        },
        mouseleave:function() {
            jQuery(this).removeClass('hover_trigger');
        }
    });

    //MODAL POPUPS
    var closeFn;
    function closeShowingModal() {
        var showingModal = document.querySelector('.modal.show');
        if (!showingModal) return;
        showingModal.classList.remove('show');
        document.body.classList.remove('disable-mouse');
        if (closeFn) {
            closeFn();
            closeFn = null;
        }
    }
    //BLOG ISOTOPE FUNCTIONS
    function load_more_posts(parent_wrapper) {
        var $newEls = [];
        var $appender=jQuery(parent_wrapper).children('.blog_appender');
        if (jQuery(parent_wrapper).children('.masonry_blog').length) {
            var $appended=jQuery(parent_wrapper).children('.masonry_blog');
        }
        else {
            var $appended=jQuery(parent_wrapper).children('.blog_entries');
        }
        jQuery(parent_wrapper).append('<div id="dumper"></div>');
        var $dumper=jQuery('#dumper');
        var pos=1;
        while (pos<=jQuery(parent_wrapper).attr('data-items')) {
            $appender.children('.blog_entry_li:nth-child('+1+')').find('.grid_image').each(function() {
                if (jQuery(this).attr('data-src')!==undefined) {
                    jQuery(this).attr('src',jQuery(this).attr('data-src'));
                }
            });
            $appender.children('.blog_entry_li:nth-child('+1+')').find('.blog_top_image').each(function() {
                if (jQuery(this).attr('data-src')!==undefined) {
                    jQuery(this).css({'background':'url('+jQuery(this).attr('data-src')+')'});
                }
            });
            $dumper.append($appender.children('.blog_entry_li:nth-child('+1+')'));
            pos++;
        }
        $newEls=$dumper.children();
        setTimeout(function() {
            var img_load=imagesLoaded($dumper);
            img_load.on('always', function() {
                $appended.append($newEls).isotope('appended',$newEls);
                $appended.fitVids();
                $appended.find('.blog_entry_li').each(function() {
                    var $new_item=jQuery(this);
                    $new_item.addClass('animate');
                });
                setTimeout(function() {
                    jQuery('#ajax_spinner.spinner-icon').removeClass('prk_first_anim');
                    $appended.isotope('layout');
                    //MANAGE COLORS
                    jQuery('.blog_entries').each(function() {
                        var $inner_blog=jQuery(this);
                        $inner_blog.find('.featured_color').each(function() {
                            jQuery(this).find('.squared_date.colorized,.not_zero_color,a.not_zero_color').css({'color':jQuery(this).attr('data-color')});
                            jQuery(this).find('.zero_color a,a.zero_color,.body_colored a,.small_headings_color a').attr('data-color',jQuery(this).attr('data-color'));
                            jQuery(this).find('.soundcloud-container,.video-container,.blog_top_image').css({'border-top-color':jQuery(this).attr('data-color')});
                            jQuery(this).find('.blog_fader_grid').css({'background-color':hex2rgb(jQuery(this).attr('data-color'),theme_options.custom_opacity)});
                            jQuery(this).find('.pls_colored_link>a').attr('data-forced-color',jQuery(this).attr('data-color'));
                            jQuery(this).find('.pulse_date_box').css({'background-color':jQuery(this).attr('data-color')});
                        });
                    });
                    jQuery('.masonry_blog').each(function() {
                        var $inner_blog=jQuery(this);
                        $inner_blog.find('.featured_color').each(function() {
                            jQuery(this).find('a.not_zero_color,span.not_zero_color').css({'color':jQuery(this).attr('data-color')});
                            jQuery(this).find('.masonry_inner').css({'border-top-color':jQuery(this).attr('data-color')});
                            jQuery(this).find('a.zero_color,.zero_color a,.small_headings_color a,a.small_headings_color,.blog_categories a').attr('data-color',jQuery(this).attr('data-color'));
                            jQuery(this).find('.pls_colored_link>a').attr('data-forced-color',jQuery(this).attr('data-color'));
                            jQuery(this).find('.blog_fader_grid').not('.pls_gridy').stop().css({'background-color':hex2rgb(jQuery(this).attr('data-color'),theme_options.custom_opacity)});
                        });
                        $inner_blog.fitVids();
                    });
                    //UPDATE CONTENT
                    thumbs_update();
                    jQuery(parent_wrapper).find('.blog_load_more').removeClass('loading_posts');
                    jQuery('#dumper').remove();
                    if($appender.is(':empty')) {
                        setTimeout(function(){
                            jQuery(parent_wrapper).find('.blog_load_more').addClass("pls_button_off");
                            var stringer=jQuery(parent_wrapper).find('.blog_load_more').attr("data-no_more");
                            jQuery(parent_wrapper).find('.blog_load_more>a').html(stringer);
                            setTimeout(function(){stop_verification=false;},1000);
                        },1200);
                    }
                    setTimeout(function(){stop_verification=false;},1000);
                },50);
            });
        },10);
    }
    //MEMBER FUNCTIONS
    function init_member() {
        if (jQuery('#member_full_row').attr('data-color')!=="default") {
            var faster_color=jQuery('#member_full_row').attr('data-color');
            jQuery('#member_full_row .prk_button_like,#member_full_row .prk_blockquote.colored_background').css({'background-color':faster_color});
            jQuery('#member_full_row .pulse_navigation_singles a').attr({'data-color':faster_color});
            jQuery('#member_full_row').find('.prk_blockquote.plain').css('border-color',faster_color);
        }
    }
    //BLOG FUNCTIONS
    function init_blog() {
        jQuery('.blog_entries').each(function() {
            var $inner_blog=jQuery(this);
            $inner_blog.find('.blog_top_image').each(function() {
                if (jQuery(this).attr('data-src')!==undefined) {
                    jQuery(this).css({'background-image':'url('+jQuery(this).attr('data-src')+')'});
                }
            });
            jQuery(this).parent().find('.filter_blog .b_filter>a').on('click',function(e) {
                e.preventDefault();
                jQuery(this).parent().parent().children('.b_filter').removeClass('active');
                curr_filter_blog = jQuery(this).attr('data-filter').split(' ');
                jQuery(this).parent().addClass('active');
                setTimeout(function(){jQuery(window).trigger("smartresize");},5);
                $inner_blog.isotope({
                    filter: '.'+curr_filter_blog
                });
            });
            $inner_blog.find('.featured_color').each(function() {
                jQuery(this).find('.squared_date.colorized,.not_zero_color,a.not_zero_color').css({'color':jQuery(this).attr('data-color')});
                jQuery(this).find('.zero_color a,a.zero_color,.body_colored a,.small_headings_color a').attr('data-color',jQuery(this).attr('data-color'));
                jQuery(this).find('.blog_fader_grid').css({'background-color':hex2rgb(jQuery(this).attr('data-color'),theme_options.custom_opacity)});
                jQuery(this).find('.soundcloud-container,.video-container,.blog_top_image').css({'border-top-color':jQuery(this).attr('data-color')});
                jQuery(this).find('.pls_colored_link>a').attr('data-forced-color',jQuery(this).attr('data-color'));
                jQuery(this).find('.pulse_date_box').css({'background-color':jQuery(this).attr('data-color')});
            });
            $inner_blog.fitVids();
            $inner_blog.addClass('prk_first_anim');
            var img_load=imagesLoaded($inner_blog);
            img_load.on('always', function() {
                $inner_blog.isotope({
                    itemSelector : '.blog_entry_li',
                    masonry:{columnWidth:'.grid-sizer'},
                    transitionDuration:'0.6s'
                });
                setTimeout(function() {
                    $inner_blog.isotope('layout');
                },30);
            });
        });
        jQuery('.masonry_blog').each(function() {
            var $inner_blog=jQuery(this);
            var $custom_selector=$inner_blog.parent().find('.pulse_blog_filter');
            jQuery(this).parent().find('.filter_blog .b_filter>a').on('click',function(e) {
                e.preventDefault();
                jQuery(this).parent().parent().children('.b_filter').removeClass('active');
                curr_filter_blog = jQuery(this).attr('data-filter').split(' ');
                jQuery(this).parent().addClass('active');
                setTimeout(function() {
                    jQuery(window).trigger("smartresize");
                },5);
                $inner_blog.isotope({
                    filter: '.'+curr_filter_blog
                });
            });
            $inner_blog.find('.featured_color').each(function() {
                jQuery(this).find('a.not_zero_color,span.not_zero_color').css({'color':jQuery(this).attr('data-color')});
                jQuery(this).find('.masonry_inner').css({'border-top-color':jQuery(this).attr('data-color')});
                jQuery(this).find('a.zero_color,.zero_color a,.small_headings_color a,a.small_headings_color,.blog_categories a').attr('data-color',jQuery(this).attr('data-color'));
                jQuery(this).find('.pls_colored_link>a').attr('data-forced-color',jQuery(this).attr('data-color'));
                jQuery(this).find('.blog_fader_grid').not('.pls_gridy').stop().css({'background-color':hex2rgb(jQuery(this).attr('data-color'),theme_options.custom_opacity)});
            });
            $inner_blog.fitVids();
            var img_load=imagesLoaded($inner_blog);
            img_load.on('always', function() {
                jQuery("#pulse_wrap,#prk_footer_wrapper").addClass('prk_first_anim');
                jQuery('#main_loader').addClass('prk_tweaked');
                setTimeout(function(){
                    jQuery('#main_loader').addClass('prk_hidden_loader');
                },300);
                $inner_blog.removeClass('per_init');
                if ($inner_blog.hasClass('templated')) {
                    $inner_blog.addClass('trigger_anim');
                    $inner_blog.removeClass('templated');
                    scroll_listener();
                }
                $inner_blog.isotope({
                    itemSelector : '.blog_entry_li',
                    masonry:{columnWidth:'.grid-sizer'},
                    transitionDuration:'0.6s'
                });
                setTimeout(function() {
                    $inner_blog.isotope('layout');
                    $inner_blog.find('.centerized_child_blog').each(function() {
                        jQuery(this).css({'margin-top':-Math.round(jQuery(this).height()/2)});
                    });
                },30);
                $inner_blog.isotope('on','layoutComplete',function() {
                    $inner_blog.find('.centerized_child_blog').each(function() {
                        jQuery(this).css({'margin-top':-Math.round(jQuery(this).height()/2)});
                    });
                });
            });
        });
        jQuery('.recentposts_ul_slider,.recentposts_ul_wp').each(function() {
            var $inner_blog=jQuery(this);
            $inner_blog.fitVids();
            $inner_blog.find('.featured_color').each(function() {
                jQuery(this).find('a.not_zero_color,span.not_zero_color').css({'color':jQuery(this).attr('data-color')});
                jQuery(this).find('.masonry_inner').css({'border-top-color':jQuery(this).attr('data-color')});
                jQuery(this).find('a.zero_color,.zero_color a,.small_headings_color a,a.small_headings_color,.blog_categories a').attr('data-color',jQuery(this).attr('data-color'));
                jQuery(this).find('.pls_colored_link>a').attr('data-forced-color',jQuery(this).attr('data-color'));
                jQuery(this).find('.blog_fader_grid').not('.pls_gridy').stop().css({'background-color':hex2rgb(jQuery(this).attr('data-color'),theme_options.custom_opacity)});
            });
        });
        if (jQuery('.pls_blog_single').length) {
            jQuery('.pls_blog_single').fitVids();
            jQuery('.pls_blog_single.featured_color').each(function() {
                var faster_color=jQuery(this).attr('data-color');
                jQuery('#pulse_content').find('.not_zero_color,.not_zero_color a').not('#pulse_related_grid a').css({'color':faster_color});
                jQuery('#pulse_content').find('#submit_comment_div>a,.pls_lback').css({'background-color':faster_color});
                jQuery('#pulse_content').find('.comments_meta_wrapper .not_zero_color a,.pirenko_highlighted,.theme_button a,.zero_color a,a.zero_color,.body_colored a,.small_headings_color a,#pls_right_sidebar li a,#submit_comment_div>a').not('#pulse_related_grid a').attr('data-color',faster_color);
                jQuery('.pulse_read a,#single_blog_meta a').attr('data-color',faster_color);
                jQuery('#pulse_content').find('.prk_blockquote.plain').css('border-color',faster_color);
                jQuery('#submit_comment_div>a').css({'border-color':faster_color});
            });
        }
    }

    //PORTFOLIO FUNCTIONS
    var curr_filter="p_all";
    var curr_filter_blog="b_all";
    function init_portfolio() {
        jQuery('.pulse_folio_filter .p_filter>a').on('click',function(e) {
            e.preventDefault();
            jQuery(this).parent().parent().children('.p_filter').removeClass('active');
            curr_filter = jQuery(this).attr('data-filter').split(' ');
            jQuery(this).parent().addClass('active');
            setTimeout(function(){
                jQuery(window).trigger("smartresize");
            },5);
            var $thisa=jQuery(this).parent().parent().parent().parent().parent().children('.folio_masonry');
            $thisa.isotope({
                filter: '.'+curr_filter
            });
            setTimeout(function() {
                var elems = $thisa.isotope('getFilteredItemElements');
                jQuery($thisa).find('.portfolio_entry_li').removeClass('pulse_inactive');
                jQuery($thisa).find('.portfolio_entry_li').not(jQuery(elems)).addClass('pulse_inactive');
                //console.log (jQuery($thisa).find('.portfolio_entry_li').not(jQuery(elems)));
            },5);
        });
        jQuery('#not_slider').fitVids();
        jQuery('#pulse_related_grid').find('.grid_image').each(function() {
            jQuery(this).attr('src',jQuery(this).attr('data-src'));
        });
        var img_load=imagesLoaded('#pulse_related_grid');
        img_load.on('always', function() {
            jQuery('#pulse_related_grid').find('.centerized_father').each(function() {
                jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").innerHeight());
            });
            jQuery('#pulse_related_grid').find('.pulse_video-bg').each(function() {
                var $par_video=jQuery(this);
                $par_video.on("play", function () {
                    $par_video.css({'width':''});
                    $par_video.css({'height':''});
                    $par_video.css({'width':$par_video.parent().width()});
                    if ($par_video.height()<$par_video.parent().outerHeight()) {
                        $par_video.css({'width':''});
                        $par_video.css({'height':$par_video.parent().outerHeight()});
                    }
                });
            });
            setTimeout(function(){
                jQuery(window).trigger("debouncedresize");
            },5);
        });
        jQuery('.folio_masonry.per_init').each(function() {
            var $container = jQuery(this);
            $container.removeClass('per_init');
            $container.fitVids({ customSelector: "iframe[src^='https://media.flixel.com']"});
            $container.find('.centerized_father').each(function() {
                jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").height());
            });

            //Make sure thumbs without links behave well on mobile mode
            if (pulse_on_mobile && $container.hasClass('pls_unlinked')) {
                $container.find('.portfolio_entry_li').each(function() {
                    jQuery(this).on('click',function(e) {
                        if (!jQuery(this).hasClass('hover_trigger')) {
                            $container.find('.portfolio_entry_li').removeClass('hover_trigger')
                        }
                        jQuery(this).toggleClass('hover_trigger');
                    });
                });
            }
            $container.find('video').each(function() {
                var $par_video=jQuery(this);
                $par_video.on("play", function () {
                    $par_video.css({'width':''});
                    $par_video.css({'height':''});
                    $par_video.css({'width':$par_video.parent().width()});
                    if ($par_video.height()<$par_video.parent().outerHeight()) {
                        $par_video.css({'width':''});
                        $par_video.css({'height':$par_video.parent().outerHeight()});
                    }
                });
            });
            var img_load=imagesLoaded($container);
            img_load.on('always', function() {
                if (!$container.hasClass('default_colored_th')) {
                    jQuery('.portfolio_entry_li').each(function() {
                        if (jQuery(this).attr('data-color')!==undefined && jQuery(this).attr('data-color')!=="default" ) {
                            jQuery(this).find('.grid_colored_block').css({'background-color':hex2rgb(jQuery(this).attr('data-color'),theme_options.custom_opacity_folio)});
                            jQuery(this).find('.lone_linker a').css({'color':hex2rgb(jQuery(this).attr('data-color'),theme_options.custom_opacity_folio)});
                            jQuery(this).find('.lone_linker a').attr('data-color',jQuery(this).attr('data-color'));
                            jQuery(this).find('.pls_thumb_tag').css({'background-color':jQuery(this).attr('data-color')});
                        }
                    });
                }
                $container.css({'display':'block'});
                $container.isotope({
                    itemSelector : '.portfolio_entry_li',
                    masonry:{columnWidth:'.grid-sizer'},
                    transitionDuration:'0.6s'
                });
                $container.find('.centerized_father').each(function() {
                    jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").height());
                });
                $container.isotope('on','layoutComplete',function() {
                    $container.find('.centerized_father').each(function() {
                        jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").height());
                    });
                });
                setTimeout(function() {
                    jQuery(window).trigger("debouncedresize");
                    $container.isotope('layout');
                    //scroll_listener();
                },30);
            });
            jQuery(window).on("debouncedresize", function( event ) {
                if ($container.width() % $container.attr('data-columns') !== 0) {
                    var temp=Math.ceil($container.width() / $container.attr('data-columns')) * $container.attr('data-columns');
                    $container.width(temp);
                }
            });
            jQuery(window).trigger("debouncedresize");
        });
        jQuery('#pls_close_portfolio').attr({'data-color':'default'});
        jQuery('.pirenko_portfolios.featured_color').each(function() {
            var faster_color=jQuery(this).attr('data-color');
            jQuery(this).find('#half-entry-right a').not(jQuery(this).find('#half-entry-right #single_folio_sharer a,#half-entry-right .body_colored a,.theme_button a,.colored_theme_button a')).css({'color':faster_color});
            jQuery(this).find('#single_meta_header a,.pirenko_highlighted,.theme_button a,#single_meta_header .prk_prev_folio,#single_meta_header .prk_next_folio,.colored_theme_button a,#half-entry-right .body_colored a').attr('data-color',faster_color);
            jQuery('#prk_full_folio.featured_color #single_entry_content a,#single_blog_meta a,.pulse_info_block a.pls_ext').css({'color':faster_color});
            jQuery('#pls_close_portfolio').attr({'data-color':faster_color});
            jQuery('#half-entry-right').find('.colored_theme_button a').css({'background-color':faster_color,'border-color':faster_color});
            /*jQuery('#after_single_folio p>a').css({'color':faster_color});
            jQuery('#after_single_folio .simple_line.active_colored').css({'border-bottom-color':faster_color});
            jQuery('#after_single_folio').find('a,.pirenko_highlighted').attr('data-color',faster_color);
            jQuery('#top_bar_wrapper_inner').css({'background-color':faster_color});
            if (jQuery('#pulse_wrapper').hasClass('solid_buttons')) {
                jQuery('#after_single_folio').find('.theme_button a').css({'background-color':faster_color});
            }
            else {
                jQuery('#after_single_folio').find('.theme_button a').css({'border-color':faster_color,'color':faster_color});
            }*/
        });
        if (jQuery('#pulse_main_wrapper').hasClass('pls_showing_ajax')) {
            jQuery('#single_meta_header a,#pulse_related_grid a').addClass('overlayed_anchor per_init');
        }
        else {
            jQuery('#single_meta_header a,#pulse_related_grid a,#pulse_to_parent a').addClass('pulse_anchor');
        }

        jQuery('.pulse_iso_gallery.per_init').each(function() {
            var $container_gals = jQuery(this);
            var iso_gallery_gutter=parseInt($container_gals.attr('data-margin'),10);
            $container_gals.children('.portfolio_entry_li').find('.grid_image').each(function(){
                jQuery(this).attr('src',jQuery(this).attr('data-src'));
            });
            setTimeout(function() {
                var img_load=imagesLoaded($container_gals);
                img_load.on('always', function() {
                    $container_gals.removeClass('per_init');
                    if (iso_gallery_gutter!==0) {
                        $container_gals.css({'margin-right':-iso_gallery_gutter});
                    }
                    else {
                        $container_gals.css({'margin-right':''});
                    }
                    if (!jQuery('#filter_top').length) {
                        $container_gals.css({'margin-top':iso_gallery_gutter});
                    }
                    //$container_gals.find('.portfolio_entry_li').css({'margin-bottom':iso_gallery_gutter});
                    $container_gals.find('.centerized_father').each(function() {
                        jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").height());
                    });
                    $container_gals.isotope({
                        itemSelector : '.portfolio_entry_li',
                        masonry:{columnWidth:'.grid-sizer'},
                        transitionDuration:'0.6s'
                    });
                    $container_gals.find('.centerized_father').each(function() {
                        jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").height());
                    });
                    $container_gals.isotope('on', 'layoutComplete',function() {
                        $container_gals.find('.centerized_father').each(function() {
                            jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").height());
                        });
                    });
                    setTimeout(function() {
                        $container_gals.isotope('layout');
                        //scroll_listener();
                    },30);
                });
            },15);
        });
    }
    function load_more_portfolios(parent_wrapper) {
        //console.log("LOAD MORE PORTFOLIOS");
        var $newEls = [];
        var $appender=jQuery(parent_wrapper).children('.folio_appender');
        var $appended=jQuery(parent_wrapper).children('.folio_masonry');
        jQuery(parent_wrapper).append('<div id="dumper"></div>');
        var $dumper=jQuery('#dumper');
        var pos=1;
        while (pos<=jQuery(parent_wrapper).attr('data-items')) {
            $appender.children('.portfolio_entry_li:nth-child('+1+')').find('.grid_image').each(function(){
                jQuery(this).attr('src',jQuery(this).attr('data-src'));
            });
            $dumper.append($appender.children('.portfolio_entry_li:nth-child('+1+')'));
            pos++;
        }
        $newEls=$dumper.children();
        setTimeout(function() {
            var img_load=imagesLoaded($dumper);
            img_load.on('always', function() {
                $appended.append($newEls).isotope('appended',$newEls);
                $appended.isotope('layout');
                var ctr=1;
                var counter=100;
                setTimeout(function() {
                    $appended.find('.portfolio_entry_li').each(function() {
                        var $current_child=jQuery(this);
                        $current_child.addClass('animate');
                        setTimeout(function() {
                            $current_child.addClass('animate');
                        },counter);
                        counter=counter+200;
                    });
                },10);
                setTimeout(function(){stop_verification=false;},1000);
                //UPDATE CONTENT
                //jQuery('#folio_father').addClass('dyn_loaded');
                thumbs_update();
                jQuery(parent_wrapper).find('.pf_load_more').removeClass('loading_posts');
                jQuery('#dumper').remove();
                if($appender.is(':empty')) {
                    setTimeout(function(){
                        jQuery(parent_wrapper).find('.pf_load_more').addClass("pls_button_off");
                        var stringer=jQuery(parent_wrapper).find('.pf_load_more').attr("data-no_more");
                        jQuery(parent_wrapper).find('.pf_load_more>a').html(stringer);
                        setTimeout(function(){stop_verification=false;},1000);
                    },1200);
                }
            });
        },10);
    }
    //END - PORTFOLIO FUNCTIONS

    //AJAX EMAIL SEND
    function email_ajax_submit() {
        var prk_form_content = jQuery('.pls_sending_email').serialize();
        var data = {
            action: 'mail_before_submit',
            email_wrap: prk_form_content,
            _ajax_nonce:ajax_var.nonce
        };
        jQuery.post(ajax_var.url, data, function(response) {
            jQuery(".pls_sending_email #contact_ok").removeClass('flash');
            jQuery(".pls_sending_email #contact_ok").addClass('forced_opacity');
            if(response === 'sent0') {
                jQuery(".pls_sending_email #contact_ok").html(jQuery('.pls_sending_email').attr('data-ok'));
            }
            else {
                jQuery(".pls_sending_email #contact_ok").html(response);
            }
            jQuery('.pls_sending_email').removeClass('pls_sending_email');
        });
        return false;
    }

    //AJAX PORTFOLIO LOAD FUNCTIONS
    var pulse_ajax_folio=jQuery("#pls_ajax_pf_inner");
    function show_new_entry(ajax_page,text) {
        pulse_ajax_folio.html('');
        var loaded_html = jQuery(text);
        var new_inner = loaded_html.find('#pulse_ajax_inner');
        pulse_ajax_folio.append(new_inner);
        jQuery('body,html').animate({scrollTop:0},0);
        jQuery('#pulse_main_wrapper').removeClass('prk_wait');
        jQuery('#pulse_main_wrapper').removeClass('prk_load_folio');
        jQuery('#pulse_main_wrapper').addClass('pls_showing_ajax');
        ended_loading();
    }
    function load_ajax_link(ajax_page,change_history) {
        jQuery('#pulse_main_wrapper').addClass('prk_wait');
        jQuery.ajax({
            url: ajax_page,
            dataType: 'html',
            async: true,
            success: function (text) {
                //CHANGE HISTORY IF NEEDED
                if (change_history===true && window.history.pushState) {
                    var pageurl = ajax_page;
                    if (pageurl !== window.location) {
                        window.history.pushState({
                            path: pageurl
                        }, '', pageurl);
                    }
                }
                //console.log(text);
                show_new_entry(ajax_page,text);
            },
            error: function () {
                //SHOW 404 ERROR PAGE IF NEEDED
                window.location.replace(ajax_page);
            }
        });
    }

    //AJAX PAGES LOAD FUNCTIONS
    //WINDOW HISTORY MANAGEMENT
    if (ajax_calls && window.history.pushState) {
        jQuery(window).on({
            popstate:function () {
                if (current_URL!==jQuery(location).attr('href') && first_load===false && location.href.indexOf("#")===-1) {
                    var next_page=jQuery(location).attr('href');
                    window.location=next_page;
                }
            },
        });
    }
    function update_page_meta(text) {
        var new_title = text.find('#pls_ajax_title').text();
        document.title = new_title;
        jQuery('body').removeClass();
        jQuery('body').addClass(text.find('#pls_ajax_classes').attr('class'));
    }
    function show_new_page(ajax_page,text) {
        prk_page_content.html('');
        var loaded_html = jQuery(text);
        var new_inner = loaded_html.find('#pulse_ajax_inner');
        current_URL=jQuery(location).attr('href');
        if (current_URL.substr(-1) === "#") {
            current_URL=current_URL.slice(0,-1);
        }
        //clearTimeout(delayed_anim);
        prk_page_content.append(new_inner);
        update_page_meta(loaded_html);
        ended_loading();
    }
    function load_ajax_page(ajax_page,change_history) {
        console.log("STARTED LOADING PAGE");
        jQuery('body,html').animate({scrollTop:0},0);
        jQuery('#prk_main_loader').removeClass('prk_tweaked');
        jQuery('#prk_main_loader').removeClass('prk_hidden_loader');
        jQuery('#pulse_main_wrapper').removeClass('pulse_forced_menu');
        jQuery.ajax({
            url: ajax_page,
            dataType: 'html',
            async: true,
            success: function (text) {
                //CHANGE HISTORY IF NEEDED
                if (change_history===true && window.history.pushState) {
                    var pageurl = ajax_page;
                    if (pageurl !== window.location) {
                        window.history.pushState({
                            path: pageurl
                        }, '', pageurl);
                    }
                }
                show_new_page(ajax_page,text);
            },
            error: function () {
                //SHOW 404 ERROR PAGE IF NEEDED
                window.location.replace(ajax_page);
            }
        });
    }


    function scroll_listener() {
        //LOAD MORE CONTENT
        if (jQuery('.folio_masonry.shortcoded').length && (is_on_viewport(jQuery('.folio_masonry.shortcoded')) || pulse_on_mobile)) {
            var $elemeter=jQuery('.folio_masonry.shortcoded');
            if (!$elemeter.hasClass('pulse_effect')) {
                $elemeter.addClass('pulse_effect')
                var counter=100;
                $elemeter.find('.portfolio_entry_li').each(function() {
                    var $new_item=jQuery(this);
                    setTimeout(function() {
                        $new_item.addClass('animate');
                    },counter);
                    counter=counter+150;
                });
            }
        }
        if (jQuery('.masonry_blog.trigger_anim').length && (is_on_viewport(jQuery('.masonry_blog.trigger_anim')) || pulse_on_mobile)) {
            var $elemeter=jQuery('.masonry_blog.trigger_anim');
            if (!$elemeter.hasClass('pulse_effect')) {
                $elemeter.addClass('pulse_effect')
                var counter=100;
                $elemeter.find('.blog_entry_li').each(function() {
                    var $new_item=jQuery(this);
                    setTimeout(function() {
                        $new_item.addClass('animate');
                    },counter);
                    counter=counter+150;
                });
            }
        }
        //END - LOAD MORE CONTENT
    }
    //THUMBS AND BUTTON FUNTIONS
    function thumbs_update() {
        jQuery('.portfolio_entry_li,.pf_load_more,.blog_load_more,.blog_hover').on({
            mouseenter:function() {
                if (!pulse_on_mobile) {
                    jQuery(this).addClass('hover_trigger');
                }
            },
            mouseleave:function() {
                if (!pulse_on_mobile) {
                    jQuery(this).removeClass('hover_trigger');
                }

            }
        });
        jQuery('.member_colored_block').on({
            mouseenter:function() {
                if (!pulse_on_mobile) {
                    jQuery(this).addClass('hover_trigger');
                }
                jQuery(this).find('.sh_member_desc').css({'margin-top':-Math.ceil(jQuery(this).find('.sh_member_desc').height()/2)});
            },
            mouseleave:function() {
                if (!pulse_on_mobile) {
                    jQuery(this).removeClass('hover_trigger');
                }
            },
        });
        jQuery('.pirenko_portfolios.featured_color a.pls_colored_link,.pirenko_portfolios.featured_color .pls_colored_link>a,.pls_blog_single.featured_color .pls_colored_link>a,a.zero_color,.zero_color a,a.small_headings_color,.small_headings_color a,.pirenko_social a,a.body_colored,.body_colored>a').on({
            mouseenter:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-color')!==undefined && jQuery(this).attr('data-color')!=="default") {
                    jQuery(this).css({'color':jQuery(this).attr('data-color')});
                }
            },
            mouseleave:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-forced-color')!==undefined) {
                    jQuery(this).css({'color':jQuery(this).attr('data-forced-color')});
                }
                else {
                    jQuery(this).css({'color':''});
                }
            }
        });
        jQuery('.social_links_shortcode a').on({
            mouseenter:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-color')!==undefined && jQuery(this).attr('data-color')!=="default") {
                    jQuery(this).css({'color':jQuery(this).attr('data-color')});
                    jQuery(this).find('.pulse_inner_social').css({'border-color':jQuery(this).attr('data-color')});
                }
            },
            mouseleave:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-up-color')!==undefined && jQuery(this).attr('data-up-color')!=="default") {
                    jQuery(this).css({'color':jQuery(this).attr('data-up-color')});
                    jQuery(this).find('.pulse_inner_social').css({'border-color':jQuery(this).attr('data-up-color')});
                }
            },
        });
        jQuery('.theme_button a').on({
            mouseenter:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-color')!==undefined && jQuery(this).attr('data-color')!=="default") {
                    jQuery(this).css({'background-color':jQuery(this).attr('data-color'),'border-color':jQuery(this).attr('data-color')});
                }
            },
            mouseleave:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-color')!==undefined && jQuery(this).attr('data-color')!=="default") {
                    jQuery(this).css({'background-color':'','border-color':''});
                }
            },
        });
        jQuery('.ghost_theme_button a').on({
            mouseenter:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-color')!==undefined && jQuery(this).attr('data-color')!=="default") {
                    jQuery(this).css({'background-color':jQuery(this).attr('data-color'),'color':theme_options.theme_buttons_color});
                }
            },
            mouseleave:function() {
                if (!pulse_on_mobile) {
                    jQuery(this).css({'background-color':'','color':jQuery(this).attr('data-color')});
                }
            },
        });
        jQuery('.colored_theme_button a').on({
            mouseenter:function() {
                if (!pulse_on_mobile) {
                    jQuery(this).css({'background-color':'','border-color':''});
                }
            },
            mouseleave:function() {
                if (!pulse_on_mobile && jQuery(this).attr('data-color')!==undefined && jQuery(this).attr('data-color')!=="default") {
                    jQuery(this).css({'background-color':jQuery(this).attr('data-color'),'border-color':jQuery(this).attr('data-color')});
                }
            },
        });
        jQuery('.prk_service').on({
            mouseenter:function() {
                if (jQuery(this).attr('data-color')!=="default") {
                    jQuery(this).find('.colored_link_icon').css({'color':jQuery(this).attr('data-color')});
                }
            },
            mouseleave:function() {
                if (jQuery(this).attr('data-default')!=="default") {
                    jQuery(this).find('.colored_link_icon').css({'color':jQuery(this).attr('data-default')});
                }
                else {
                    jQuery(this).find('.colored_link_icon').css({'color':''});
                }
            },
        });
        jQuery('.pls_lback.per_init').each(function() {
            jQuery(this).removeClass('per_init');
            jQuery(this).on('click',function(e) {
                jQuery(this).parent().parent().submit();
            });
        });
        //PORTFOLIO AJAX LINKS
        jQuery("a.overlayed_anchor.per_init").each(function() {
            jQuery(this).removeClass('per_init');
            jQuery(this).on('click',function(e) {
                if (jQuery(this).attr('target')==="_blank") {
                }
                else {
                    //console.log(e);
                    e.preventDefault();
                    if(pulse_on_mobile && jQuery(this).hasClass('pls_touch') && !jQuery(this).parents('.portfolio_entry_li.hover_trigger').length) {
                        jQuery(this).parent().parent().find('.portfolio_entry_li').removeClass('hover_trigger');
                        jQuery(this).parent().addClass('hover_trigger');
                        return;
                    }
                    var target=jQuery(this).find('.grid_colored_block').get(0);
                    var next_page=jQuery(this).attr("href");
                    //CTA ANIMATION?
                    if (target!==undefined && !jQuery('#pulse_main_wrapper').hasClass('pls_showing_ajax')) {
                        jQuery(this).addClass('pls_active_fl');
                        if (jQuery(this).parent().attr('data-color')!==undefined && jQuery(this).parent().attr('data-color')!=="default") {
                            jQuery('#pls_overlayer').css({'background-color':jQuery(this).parent().attr('data-color')});
                        }
                        closeFn=cta(
                            target,
                            document.querySelector('#pls_overlayer'),
                            { duration: 0.5,relativeToWindow: true },
                            function showModal(modal) {
                                modal.classList.add('show');
                                document.body.classList.add('disable-mouse');
                            });
                        setTimeout(function() {
                            load_ajax_link(next_page,false);
                            jQuery('#pls_overlayer').css({'background-color':''});
                        },480);
                    }
                    else {
                        //REGULAR LINKS - INSIDE OVERLAYER ALREADY
                        jQuery('#pulse_main_wrapper').addClass('prk_load_folio');
                        setTimeout(function() {
                            load_ajax_link(next_page,false);
                        },300);
                    }

                }
            });
        });
        jQuery('.pulse_next_arrow').each(function() {
            if (jQuery(this).hasClass('pulse_sp_arrow')) {
                jQuery(this).parent().attr('href','#'+jQuery('#s_sec_inner>.pulse_row').attr('id'));
                if (jQuery(this).parent().attr('data-color')!=="default") {
                    jQuery(this).parent().css({'color':jQuery(this).parent().attr('data-color')});
                }
            }
            else if (!jQuery(this).hasClass('pulse_at_slider')) {
                if (jQuery(this).parent().attr('href')==="") {
                    jQuery(this).parent().attr('href','#'+jQuery(this).parent().parent().next().next().attr('id'));
                }
                jQuery(this).parent().css({'color':jQuery(this).parent().parent().css('color')});
            }
        });
        jQuery(".pulse_members .member_colored_block").each(function() {
            jQuery(this).on('click',function(e) {
                if (jQuery(this).hasClass('pls_linked')) {
                    var next_page = jQuery(this).attr('data-link');
                    if (hasParentClass(e.target, 'member_colored_block_in') || hasParentClass(e.target, 'sh_member_trg')) {
                        if (ajax_calls) {
                            loading_page = true;
                            jQuery('#pulse_main_wrapper').addClass('prk_loading_page');
                            jQuery('#pulse_main_wrapper').addClass('prk_wait');
                            setTimeout(function () {
                                load_ajax_page(next_page, true);
                            }, 350);
                        }
                        else {
                            window.location = next_page;
                        }
                    }
                }
                else {
                    if (pulse_on_mobile) {
                        jQuery(this).closest('.member_colored_block').toggleClass('hover_trigger');
                    }
                }
            });
        });
        jQuery(".pf_load_more a.per_init").each(function() {
            jQuery(this).removeClass('per_init');
            jQuery(this).on('click',function(e) {
                e.preventDefault();
                if (!jQuery(this).hasClass('loading_posts')) {
                    jQuery(this).parent().removeClass('hover_trigger');
                    jQuery(this).parent().addClass('loading_posts');
                    load_more_portfolios(jQuery(this).parent().parent().parent());
                }
            });
        });
        //jQuery(".blog_load_more a.per_init").each(function() {
        //	jQuery(this).removeClass('per_init');
        jQuery('.blog_load_more a').on('click',function(e) {
            e.preventDefault();
            if (!jQuery(this).parent().hasClass('loading_posts')) {
                jQuery(this).parent().addClass('loading_posts');
                jQuery('#ajax_spinner.spinner-icon').addClass('prk_first_anim');
                load_more_posts(jQuery('.blog_load_more').parent().parent());
            }
        });
        //});
        jQuery(".pulse_read a").on('click', function(event) {
            event.preventDefault();
            var offsetter="";
            var fragment=jQuery(this).attr('href').split('#');
            //return true;
            //console.log(fragment[0]);
            if ((jQuery(this).attr('href')==="#" || fragment[1]==="") && fragment[0]===current_URL)  {
                offsetter=0;
            }
            else {
                var target = this.hash;
                var $target = jQuery(target);
                //IS IT AN ANCHOR LINK
                if (target!=="") {
                    //IS IT AN EXISITNG ID
                    if ($target.offset()!==undefined) {
                        offsetter=$target.offset().top;
                    }
                    else {
                        //event.preventDefault();
                    }
                }
            }
            if (offsetter!=="") {
                jQuery('html,body').stop().animate({
                        'scrollTop': offsetter-admin_bar_height-mn_collapsed
                    },
                    1200,
                    'easeInOutExpo');
            }
        });
        jQuery('.folio_masonry.multipled.lightboxed .portfolio_entry_li').each(function() {
            jQuery(this).magnificPopup({
                delegate: '.magnificent',
                src:'data-src',
                type: 'image',
                tLoading: 'Loading image #%curr%...',
                fixedContentPos: false,
                fixedBgPos: true,
                closeOnContentClick: true,
                closeBtnInside: false,
                mainClass: 'mfp-no-margins my-mfp-zoom-in header_font',
                removalDelay: 300,
                closeMarkup:'<button title="%title%" class="mfp-close"><div class="mfp-close_inner"></div></button><div id="mfp-pulse-nav" class="header_font"></div><div id="mfp-pulse-title" class="header_font"></div>',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mdi-chevron-%dir%"></button>',
                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                },
                image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                    titleSrc: function(item) {
                        return item.el.attr('title');
                    }
                },
                iframe: {
                    markup: '<div class="mfp-iframe-scaler">'+
                        '<div class="mfp-close"></div>'+
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                        '<div class="mfp-title">Some caption</div>'+
                        '</div>'
                },
                callbacks: {
                    open: function() {
                        jQuery('html').css({'overflow':'hidden','height':'100%'});
                    },
                    close: function() {
                        jQuery('html').css({'overflow-y':'visible','height':''});
                    },
                    markupParse: function(template, values, item) {
                        values.title = item.el.attr('data-title');
                        setTimeout(function() {
                            jQuery('#mfp-pulse-nav').html(jQuery('.mfp-counter').html());
                            jQuery('#mfp-pulse-title').html(jQuery('.mfp-title').html());
                        },15);
                    }
                }
            });
        });
        
    }
    //END - THUMBS AND BUTTON FUNTIONS
    var prk_page_content;
    function ended_loading() {
        console.log("ENDED LOADING PAGE");
        prk_page_content=jQuery("#pulse_ajax_container");
        var rows = jQuery('#owl-row,#s_sec_inner>.pulse_row');
        var rows_array = [];
        rows.each( function(i,e) {
            rows_array.push(jQuery(e).attr('id'));
        });
        var menu_anchors = jQuery('#pulse_main_menu .pulse-menu-ul li');
        rows.waypoint({
            handler: function(direction) {
                if (!jQuery('html').hasClass('menu_at_top') && this.element!==undefined) {
                    var pos=jQuery.inArray(this.element.id,rows_array);
                    var visible_row = rows.eq(direction === "up" ? pos-1 : pos);
                    if (pos<0) {
                        pos=0;
                    }
                    if (visible_row.attr("id")!==undefined) {
                        if (pos===0 && direction==="up") {
                            if(jQuery('#pulse_main_menu .pulse-menu-ul>li:first-child').length) {
                                var stringah=jQuery('#pulse_main_menu .pulse-menu-ul>li:first-child>a').attr('href');
                                if (stringah.indexOf('#')!==-1) {
                                    var high_link = jQuery('#pulse_main_menu .pulse-menu-ul>li:first-child>a[href$="#"]');
                                }
                            }
                        }
                        else {
                            var high_link = jQuery('#pulse_main_menu .pulse-menu-ul a[href$="#'+visible_row.attr("id")+'"]');
                        }
                        //CHECK IF A MENU BUTTON HAS THIS LINK
                        if (high_link!==undefined && high_link.length) {
                            deactivate_menu_links();
                            high_link.parent().addClass('active');
                        }
                        if (jQuery('#pulse_main_menu ul li.active').length && ((visible_row.attr("id").substring(0,6)==="pulse-" && pos===0) || visible_row.attr("id")==="owl-row" || visible_row.hasClass('pls_first_row'))) {
                            deactivate_menu_links();
                        }
                        //BUG FIX WHEN NOTHING IS HIGHLIGHTED
                        if (!jQuery('#pulse_main_menu ul li.active').length) {
                            var founded=false;
                            jQuery('#pulse_main_menu .pulse-menu-ul>li>a').each(function() {
                                if(window.location.href===jQuery(this).attr('href')) {
                                    high_link=jQuery(this);
                                    founded=true;
                                }
                            });
                            if (founded===false && (pos===0 || visible_row.attr("id")==="owl-row" || visible_row.hasClass('pls_first_row'))) {
                                if(jQuery('#pulse_main_menu .pulse-menu-ul>li:first-child').length) {
                                    var stringah=jQuery('#pulse_main_menu .pulse-menu-ul>li:first-child>a').attr('href');
                                    if (stringah.indexOf('#')!==-1) {
                                        high_link = jQuery('#pulse_main_menu .pulse-menu-ul>li:first-child>a[href$="#"]');
                                    }
                                }
                            }
                            if (high_link!==undefined && high_link.length) {
                                high_link.parent().addClass('active');
                            }
                        }
                    }
                }
            },
            offset: rows_offset+'px'
        });
        //END MINISITE FUNCTIONS
        if (jQuery('#pulse_ajax_container #pulse_ajax_inner.pulse_forced_menu').length) {
            jQuery('#pulse_main_wrapper').addClass('pulse_forced_menu');
        }
        if (jQuery('#s_sec_inner>div:first-child').attr('data-top-bottom')!==undefined) {
            jQuery('#s_sec_inner>div:first-child').attr('data-0-top-top','background-position: 50% 0px');
            jQuery('#s_sec_inner>div:first-child').attr('data-top-bottom','background-position: 50% -300px');
        }
        if (jQuery('#prk_custom_folio>div:first-child').attr('data-top-bottom')!==undefined) {
            jQuery('#prk_custom_folio>div:first-child').attr('data-0-top-top','background-position: 50% 0px');
            jQuery('#prk_custom_folio>div:first-child').attr('data-top-bottom','background-position: 50% -300px');
        }
        if(!jQuery('#owl-row').length) {
            jQuery('#s_sec_inner>div:first-child').addClass('pls_first_row');
            jQuery('#prk_custom_folio>div:first-child').addClass('pls_first_row');
        }
        if (!pulse_on_mobile && theme_options.show_sooner!=="yes") {
            var img_load=imagesLoaded('.pls_preloaded');
            img_load.on('always', function() {
                jQuery('.pls_preloaded').parent().addClass('pls_ready');
                jQuery('#pulse_main_wrapper').addClass('prk_fading_block');
                jQuery('#pulse_main_wrapper').removeClass('prk_loading_page');
                jQuery('#pulse_main_wrapper').removeClass('prk_wait');
                setTimeout(function(){
                    jQuery(window).trigger("debouncedresize");
                    jQuery("#pulse_ajax_container,#prk_footer_outer").addClass('prk_first_anim');
                    jQuery('#prk_main_loader').addClass('prk_tweaked');
                    jQuery('html').addClass('pulse_ready');
                },75);
                setTimeout(function(){
                    jQuery('#prk_main_loader').addClass('prk_hidden_loader');
                },255);
                setTimeout(function() {
                    jQuery('#pulse_main_wrapper').removeClass('prk_fading_block');
                    if (theme_options.active_visual_composer==="1") {
                        vc_waypoints();
                    }
                    Waypoint.refreshAll();
                    stop_verification=false;
                },350);
                //ENSURE THAT EVERYTHING IS PERFECTLY RENDERED
                setTimeout(function() {
                    Waypoint.refreshAll();
                    stop_verification=false;
                },2500);
                //LOAD LAZY IMAGES
                jQuery('.lazy_pulse').each(function() {
                    jQuery(this).attr('src',jQuery(this).attr('data-src'));
                });
            });
        }
        else {
            jQuery('.pls_preloaded').parent().addClass('pls_ready');
            jQuery('#pulse_main_wrapper').addClass('prk_fading_block');
            jQuery('#pulse_main_wrapper').removeClass('prk_loading_page');
            jQuery('#pulse_main_wrapper').removeClass('prk_wait');
            setTimeout(function(){
                jQuery(window).trigger("debouncedresize");
                jQuery("#pulse_ajax_container,#prk_footer_outer").addClass('prk_first_anim');
                jQuery('#prk_main_loader').addClass('prk_tweaked');
                jQuery('html').addClass('pulse_ready');
            },75);
            setTimeout(function(){
                jQuery('#prk_main_loader').addClass('prk_hidden_loader');
            },255);
            setTimeout(function() {
                jQuery('#pulse_main_wrapper').removeClass('prk_fading_block');
                if (theme_options.active_visual_composer==="1") {
                    vc_waypoints();
                }
                Waypoint.refreshAll();
                stop_verification=false;
            },350);
            //ENSURE THAT EVERYTHING IS PERFECTLY RENDERED
            setTimeout(function() {
                Waypoint.refreshAll();
                stop_verification=false;
            },2500);
        }
        //OWL SLIDERS
        if (jQuery('#dotted_navigation').length) {
            jQuery('body').addClass('pulse_dotted_nav');
            jQuery('#dotted_navigation a').each(function() {
                jQuery(this).addClass('pulse_anchor');
            });
            mn_collapsed=0;
        }
        var img_load=imagesLoaded('#not_slider');
        img_load.on('always', function() {
            jQuery('#not_slider').addClass('pls_active_slider');
        });
        jQuery('.pulse_shortcode_slider.super_height.per_init').each(function() {
            //console.log(jQuery(this).attr('id'));
            var $this_id=jQuery(this).attr('id');
            var $this_slider=jQuery(this);
            if ($this_slider.find('.item').length===0) {
                $this_slider.removeClass('per_init');
                $this_slider.parent().addClass('pls_active_slider');
            }
            else {
                $this_slider.removeClass('per_init');
                $this_slider.addClass('just_init');
                jQuery(window).on("debouncedresize", function(event) {
                    pirenko_resize();
                    setTimeout(function() {
                        $this_slider.find('.owl-wrapper-outer,.owl-item').css({'height':height_fix});
                        var min_width=jQuery(window).width();
                        var min_height=height_fix;
                        $this_slider.find('.owl-item img.pulse_vsbl').each(function() {
                            var $this_image=jQuery(this);
                            var or_width=parseInt($this_image.attr('data-or_w'),10);
                            var or_height=parseInt($this_image.attr('data-or_h'),10);
                            var ratio=min_height / or_height;
                            //FILL HEIGHT
                            $this_image.css("height", min_height);
                            $this_image.css("width", or_width * ratio);
                            //UPDATE VARS
                            or_width=$this_image.width();
                            or_height=$this_image.height();
                            //FILL WIDTH IF NEEDED
                            if(or_width<min_width) {
                                ratio=min_width/or_width;
                                $this_image.css("width", min_width);
                                $this_image.css("height", or_height * ratio);
                            }
                            //ADJUST MARGINS
                            $this_image.css({"margin-left":-($this_image.width()-min_width)/2});
                            if (jQuery(window).width()<780) {
                                $this_image.css("margin-top",0);
                            }
                            else {
                                $this_image.css("margin-top",-($this_image.height()-$this_slider.find('.owl-wrapper-outer').height())/2);
                            }
                        });
                        $this_slider.find('.sld_v_center').each(function() {
                            jQuery(this).css({'margin-top':-parseInt(jQuery(this).height()/2,10)});
                        });
                    },50);
                });
                if ($this_slider.find('.item').length>1 && $this_slider.attr('data-autoplay') === "true") {
                    var autoplayer=$this_slider.attr('data-delay')
                }
                else {
                    var autoplayer=false;
                }
                $this_slider.fitVids().owlCarousel({
                    autoPlay:autoplayer,
                    navigation : $this_slider.attr('data-navigation') === "true" ? true : false,
                    navigationText:	['<i class="mdi-chevron-left site_background_colored"></i><div class="pls_naver site_background_colored prk_65_em"></div>','<i class="mdi-chevron-right site_background_colored"></i><div class="pls_naver site_background_colored prk_65_em"></div>'],
                    pagination:$this_slider.attr('data-pagination') === "true" ? true : false,
                    paginationNumbers:true,
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    lazyLoad : true,
                    items : 1,
                    itemsDesktop : false,
                    itemsDesktopSmall : false,
                    itemsTablet: false,
                    itemsMobile : false,
                    itemsScaleUp:true,
                    transitionStyle : is_mobile() === true ? "fade" : $this_slider.attr('data-anim'),
                    touchDrag:false,
                    addClassActive:true,
                    afterInit: function(){
                        var img_load=imagesLoaded($this_slider.find('#pulse_slide_0'));
                        img_load.on('always', function() {
                            $this_slider.parent().addClass('pls_active_slider');
                            setTimeout(function() {
                                singleLetters($this_slider.find('.cd-headline.letters').find('b'));
                                animateHeadline($this_slider.find('.cd-headline'));
                                setTimeout(function() {
                                    $this_slider.find('.sld_v_center').each(function() {
                                        jQuery(this).css({'margin-top':-parseInt(jQuery(this).height()/2,10)});
                                    });
                                },10);
                                //LOAD ALL OTHER IMAGES NOW
                                $this_slider.find('.lazy_pls').each(function() {
                                    jQuery(this).attr('src',jQuery(this).attr('data-src'));
                                    jQuery(this).css({'display':'block'});
                                });
                            },750);
                        });
                        $this_slider.find('.owl-pagination').css({'margin-top':-$this_slider.find('.owl-pagination').height()/2});
                        jQuery(window).trigger("debouncedresize");
                        var izer=0;
                        $this_slider.find('.owl-pagination').find('.owl-numbers').each(function() {
                            var slide_id='#pulse_slide_'+izer;
                            jQuery(this).html($this_slider.find(slide_id).find('.headings_top>div').html());
                            izer++;
                        });
                    },
                    afterAction : function() {
                        $this_slider.find('.headings_top,.headings_body,.slider_action_button,.pulse_at_slider').removeClass('pulse_animate_slide');
                        $this_slider.find('.wpb_animate_when_almost_visible').removeClass('wpb_start_animation');
                        $this_slider.find('.wpb_animate_when_almost_visible').addClass('pls_manual_anim');
                        var slide_id='#pulse_slide_'+this.owl.currentItem;
                        if ($this_slider.hasClass('just_init')) {
                            var in_count=800;
                            $this_slider.removeClass('just_init');
                        }
                        else {
                            var in_count=500;
                        }
                        $this_slider.find('.pls_naver').html(parseInt(this.owl.currentItem+1,10)+' / '+this.owl.owlItems.length);
                        setTimeout(function() {
                            if ($this_slider.find(slide_id).find('.slider_action_button a').attr('data-color')!=="default") {
                                $this_slider.find(slide_id).find('.slider_action_button a').css({'border-color':$this_slider.find(slide_id).find('.slider_action_button a').attr('data-color'),'color':$this_slider.find(slide_id).find('.slider_action_button a').attr('data-color')});
                            }
                            if ($this_slider.find(slide_id).find('.slider_scroll_button a').attr('data-color')!=="default") {
                                $this_slider.find(slide_id).find('.slider_scroll_button a').css({'border-color':$this_slider.find(slide_id).find('.slider_scroll_button a').attr('data-color'),'color':$this_slider.find(slide_id).find('.slider_scroll_button a').attr('data-color')});
                            }
                            $this_slider.find(slide_id).find('.headings_top').addClass('pulse_animate_slide');
                            $this_slider.find(slide_id).find('.headings_body').addClass('pulse_animate_slide');
                            $this_slider.find(slide_id).find('.slider_action_button').addClass('pulse_animate_slide');
                            $this_slider.find(slide_id).find('.pulse_at_slider').addClass('pulse_animate_slide');
                            $this_slider.find(slide_id).find('.wpb_animate_when_almost_visible').each(function() {
                                var $this_el=jQuery(this);
                                if (!$this_el.is('[class*="delay-"]')) {
                                    $this_el.addClass('wpb_start_animation');
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
                            });
                        },in_count);
                    },
                });
            }
        });
        jQuery('.pulse_shortcode_slider.per_init').not(jQuery('.pulse_shortcode_slider.super_height')).each(function() {
            var $this_slider=jQuery(this);
            if ($this_slider.find('.item').length===0) {
                $this_slider.removeClass('per_init');
                $this_slider.parent().addClass('pls_active_slider');
            }
            else {
                if ($this_slider.find('.item').length>1 && $this_slider.attr('data-autoplay') === "true") {
                    var autoplayer=$this_slider.attr('data-delay')
                }
                else {
                    var autoplayer=false;
                }

                $this_slider.fitVids().owlCarousel({
                    autoPlay:autoplayer,
                    navigation : $this_slider.attr('data-navigation') === "true" ? true : false,
                    navigationText:	['<i class="mdi-chevron-left site_background_colored"></i><div class="pls_naver site_background_colored prk_65_em"></div>','<i class="mdi-chevron-right site_background_colored"></i><div class="pls_naver site_background_colored prk_65_em"></div>'],
                    pagination:$this_slider.attr('data-pagination') === "true" ? true : false,
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    lazyLoad : true,
                    items : 1,
                    itemsDesktop : false,
                    itemsDesktopSmall : false,
                    itemsTablet: false,
                    itemsMobile : false,
                    itemsScaleUp:true,
                    transitionStyle : "fade",
                    autoHeight : true,
                    touchDrag:false,
                    addClassActive:true,
                    afterInit: function() {
                        var img_load=imagesLoaded($this_slider.find('#pulse_slide_0'));

                        img_load.on('always', function() {
                            $this_slider.parent().addClass('pls_active_slider');
                        });
                        $this_slider.removeClass('per_init');
                        $this_slider.addClass('just_init');
                        setTimeout(function() {
                            singleLetters($this_slider.find('.cd-headline.letters').find('b'));
                            animateHeadline($this_slider.find('.cd-headline'));
                            setTimeout(function() {
                                $this_slider.find('.sld_v_center').each(function() {
                                    jQuery(this).css({'margin-top':-parseInt(jQuery(this).height()/2,10)});
                                });
                            },10);
                            //LOAD ALL OTHER IMAGES NOW
                            $this_slider.find('.lazy_pls').each(function() {
                                jQuery(this).attr('src',jQuery(this).attr('data-src'));
                                jQuery(this).css({'display':'block'});
                            });
                        },750);
                        $this_slider.find('.owl-pagination').css({'margin-top':-$this_slider.find('.owl-pagination').height()/2});
                        if ($this_slider.attr('data-color')!=undefined && $this_slider.attr('data-color')!="") {
                            $this_slider.find('.owl-next,.owl-prev').attr('data-color',$this_slider.attr('data-color'));
                        }
                        setTimeout(function() {
                            $this_slider.parent().removeClass('prk_first_anim');
                            jQuery(window).trigger("smartresize");
                        },1000);
                        setTimeout(function() {
                            jQuery('#single_spinner.spinner-icon').removeClass('prk_first_anim');
                        },500);
                        jQuery(window).trigger("debouncedresize");
                    },
                    afterAction : function() {
                        $this_slider.find('.headings_top,.headings_body,.slider_action_button,.pulse_at_slider').removeClass('pulse_animate_slide');
                        var slide_id='#pulse_slide_'+this.owl.currentItem;
                        if ($this_slider.hasClass('just_init')) {
                            var in_count=750;
                            $this_slider.removeClass('just_init');
                        }
                        else {
                            var in_count=0;
                        }
                        setTimeout(function() {
                            $this_slider.find(slide_id).find('.headings_top').addClass('pulse_animate_slide');
                            $this_slider.find(slide_id).find('.headings_body').addClass('pulse_animate_slide');
                            $this_slider.find(slide_id).find('.slider_action_button').addClass('pulse_animate_slide');
                            $this_slider.find(slide_id).find('.pulse_at_slider').addClass('pulse_animate_slide');
                        },in_count);
                        $this_slider.find('.pls_naver').html(parseInt(this.owl.currentItem+1,10)+' / '+this.owl.owlItems.length);
                    }
                });
            }
        });
        jQuery('.testimonials_slider.per_init,.comments_slider.per_init,.featured_posts_ul_slider.per_init,.pls_insta_slider .pls_instagram').each(function() {
            var $this_slider=jQuery(this);
            $this_slider.removeClass('per_init');
            if ($this_slider.find('.item').length>1 && $this_slider.attr('data-autoplay') === "true") {
                var autoplayer=$this_slider.attr('data-delay');
            }
            else {
                var autoplayer=false;
            }
            var img_load=imagesLoaded($this_slider);
            img_load.on('always', function() {
                setTimeout(function() {
                    $this_slider.owlCarousel({
                        autoPlay:autoplayer,
                        navigation : $this_slider.attr('data-navigation') === "true" ? true : false,
                        navigationText:	['<i class="mdi-chevron-left"></i>','<i class="mdi-chevron-right"></i>'],
                        pagination:$this_slider.attr('data-pagination') === "true" ? true : false,
                        slideSpeed : 300,
                        paginationSpeed : 400,
                        items : 1,
                        itemsDesktop : false,
                        itemsDesktopSmall : false,
                        itemsTablet: false,
                        itemsMobile : false,
                        itemsScaleUp:true,
                        transitionStyle : is_mobile() === true ? "fade" : $this_slider.attr('data-anim'),
                        autoHeight : false,
                        touchDrag:false,
                        addClassActive:true,
                        afterInit: function() {
                            setTimeout(function() {
                                $this_slider.parent().removeClass('prk_first_anim');
                            },1000);
                        },
                    });
                },25);
            });
        });
        jQuery('.recentposts_ul_slider.per_init,.member_ul_slider.per_init').each(function() {
            var $this_slider=jQuery(this);
            $this_slider.removeClass('per_init');
            $this_slider.owlCarousel({
                navigation : $this_slider.attr('data-navigation') === "true" ? true : false,
                navigationText:	['<i class="mdi-chevron-left"></i>','<i class="mdi-chevron-right"></i>'],
                pagination:false,
                touchDrag:false,
                itemsCustom : [
                    [0, 1],
                    [450, 2],
                    [920, 3],
                    [1080, 4],
                    [1460, 5],
                ],
            });
        });
        jQuery('.twitter_slider.per_init').each(function() {
            var $this_slider=jQuery(this);
            $this_slider.removeClass('per_init');
            $this_slider.owlCarousel({
                autoPlay:6000,
                navigation : true,
                navigationText:	['<i class="mdi-chevron-left"></i>','<i class="mdi-chevron-right"></i>'],
                pagination: false,
                slideSpeed : 300,
                paginationSpeed : 400,
                items : 1,
                itemsDesktop : false,
                itemsDesktopSmall : false,
                itemsTablet: false,
                itemsMobile : false,
                itemsScaleUp:true,
                transitionStyle : 'fade',
                autoHeight : false,
                touchDrag:false,
                addClassActive:true,
                afterInit: function() {
                },
            });
        });
        jQuery('.products_ul_slider').each(function() {
            var $this_slider=jQuery(this);
            $this_slider.removeClass('per_init');
            $this_slider.owlCarousel({
                navigation : $this_slider.attr('data-navigation') === "true" ? true : false,
                navigationText:	['<i class="mdi-chevron-left"></i>','<i class="mdi-chevron-right"></i>'],
                pagination:false,
                touchDrag:$this_slider.attr('data-touch') === "true" ? true : false,
                itemsCustom : [
                    [0, 1],
                    [400, 2],
                    [660, 3],
                    [920, 4],
                ],
            });
        });
        //OWL SLIDERS - END

        //MAILCHIMP, CONTACT FORM 7 && PROTECTED PAGES
        jQuery('#prk_protected input,.mc_input,.wpcf7-form select,.wpcf7-form input[type="date"],.wpcf7-form input[type="password"],.wpcf7-form input[type="tel"],.wpcf7-form input[type="email"],.wpcf7-form input[type="text"],.wpcf7-form textarea').not('.wpcf7-submit').addClass('pirenko_highlighted');
        jQuery('.wpcf7-form select,.wpcf7-form input[type="date"],.wpcf7-form input[type="password"]').not('.wpcf7-submit').addClass('pls_plain');
        jQuery ('.wpcf7-form select').parent().append('<i class="pls_select_arrow fa fa-angle-double-down"></i>');
        //POPUPS
        jQuery('.folio_masonry.lightboxed,.pulse_widget_gallery,.pls_mag_img').not('.folio_masonry.multipled.lightboxed').magnificPopup({
            delegate: '.portfolio_entry_li:not(.pulse_inactive) a.magnificent',
            src:'data-src',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            fixedContentPos: false,
            fixedBgPos: true,
            closeOnContentClick: true,
            closeBtnInside: false,
            mainClass: 'mfp-no-margins my-mfp-zoom-in header_font',
            removalDelay: 300,
            closeMarkup:'<button title="%title%" class="mfp-close"><div class="mfp-close_inner"></div></button><div id="mfp-pulse-nav" class="header_font"></div><div id="mfp-pulse-title" class="header_font"></div>',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mdi-chevron-%dir%"></button>',
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title');
                }
            },
            iframe: {
                markup: '<div class="mfp-iframe-scaler">'+
                    '<div class="mfp-close"></div>'+
                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                    '<div class="mfp-title">Some caption</div>'+
                    '</div>'
            },
            callbacks: {
                open: function() {
                    jQuery('html').css({'overflow':'hidden','height':'100%'});
                },
                close: function() {
                    jQuery('html').css({'overflow-y':'visible','height':''});
                },
                markupParse: function(template, values, item) {
                    values.title = item.el.attr('data-title');
                    setTimeout(function() {
                        jQuery('#mfp-pulse-nav').html(jQuery('.mfp-counter').html());
                        jQuery('#mfp-pulse-title').html(jQuery('.mfp-title').html());
                    },15);
                }
            }
        });
        jQuery('.folio_masonry.multipled.lightboxed .portfolio_entry_li').each(function() {
            jQuery(this).magnificPopup({
                delegate: '.magnificent',
                src:'data-src',
                type: 'image',
                tLoading: 'Loading image #%curr%...',
                fixedContentPos: false,
                fixedBgPos: true,
                closeOnContentClick: true,
                closeBtnInside: false,
                mainClass: 'mfp-no-margins my-mfp-zoom-in header_font',
                removalDelay: 300,
                closeMarkup:'<button title="%title%" class="mfp-close"><div class="mfp-close_inner"></div></button><div id="mfp-pulse-nav" class="header_font"></div><div id="mfp-pulse-title" class="header_font"></div>',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mdi-chevron-%dir%"></button>',
                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                },
                image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                    titleSrc: function(item) {
                        return item.el.attr('title');
                    }
                },
                iframe: {
                    markup: '<div class="mfp-iframe-scaler">'+
                        '<div class="mfp-close"></div>'+
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                        '<div class="mfp-title">Some caption</div>'+
                        '</div>'
                },
                callbacks: {
                    open: function() {
                        jQuery('html').css({'overflow':'hidden','height':'100%'});
                    },
                    close: function() {
                        jQuery('html').css({'overflow-y':'visible','height':''});
                    },
                    markupParse: function(template, values, item) {
                        values.title = item.el.attr('data-title');
                        setTimeout(function() {
                            jQuery('#mfp-pulse-nav').html(jQuery('.mfp-counter').html());
                            jQuery('#mfp-pulse-title').html(jQuery('.mfp-title').html());
                        },15);
                    }
                }
            });
        });

        jQuery('.pulse_gallery').each(function(){
            jQuery(this).magnificPopup({
                delegate: 'div.portfolio_entry_li',
                src:'data-src',
                type: 'image',
                tLoading: 'Loading image #%curr%...',
                fixedContentPos: false,
                fixedBgPos: true,
                closeOnContentClick: true,
                closeBtnInside: false,
                mainClass: 'mfp-no-margins my-mfp-zoom-in header_font',
                removalDelay: 300,
                closeMarkup:'<button title="%title%" class="mfp-close"><div class="mfp-close_inner"></div></button>',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mdi-chevron-%dir%"></button><div id="mfp-pulse-nav" class="header_font"></div><div id="mfp-pulse-title" class="header_font"></div>',
                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                },
                image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                    titleSrc: function(item) {
                        return item.el.attr('title');
                    }
                },
                iframe: {
                    markup: '<div class="mfp-iframe-scaler">'+
                        '<div class="mfp-close"></div>'+
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                        '<div class="mfp-title">Some caption</div>'+
                        '</div>'
                },
                callbacks: {
                    open: function() {
                        jQuery('html').css({'overflow':'hidden','height':'100%'});
                    },
                    close: function() {
                        jQuery('html').css({'overflow-y':'visible','height':''});
                    },
                    markupParse: function(template, values, item) {
                        values.title = item.el.attr('data-title');
                        setTimeout(function() {
                            jQuery('#mfp-pulse-nav').html(jQuery('.mfp-counter').html());
                            jQuery('#mfp-pulse-title').html(jQuery('.mfp-title').html());
                        },15);
                    }
                }
            });
        });

        //BACKGROUND VIDEOS ADJUSTMENTS
        jQuery('.pulse_with_video').each(function() {
            if (pulse_on_mobile) {
                /*
                var $vid_remover=jQuery(this);
                $vid_remover.css("background-image", "url("+$vid_remover.children('.pulse_video-bg').attr('poster')+")");
                $vid_remover.children('.pulse_video-bg').remove();
                */
            }
            else {
                if (jQuery(this).hasClass('forced_row')) {
                    var $video_holder=jQuery(this).find('.pulse_video-bg');
                    jQuery(this).find('video').on("play", function () {

                    });
                }
            }
        });

        //CONVERT TO SVG PATHS ON SERVICES
        jQuery('.pulse_svg img').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.parent().append($svg);

            }, 'xml');

        });

        //FITVIDS
        jQuery('.pls_fitter').fitVids();

        //VIDEO THUMBS REMOVE ON MOBILE
        if (pulse_on_mobile) {
            //jQuery('.portfolio_entry_li .pulse_video-bg').remove();
        }

        //WOOCOMMERCE STUFF
        jQuery('.woocommerce .woocommerce-ordering .orderby,.woocommerce #calc_shipping_country,.pulse_custom_select').selectOrDie({
            onChange: function(){

            }
        });

        //SIDEBAR STUFF
        jQuery('#prk_footer_inner a,#pls_right_sidebar a').not('a.button,.pirenko_social a,#prk_footer_inner .pirenko_recent_posts a,#pls_right_sidebar .pirenko_recent_posts a,.product_list_widget a').addClass('body_colored');
        jQuery('#prk_footer_inner .pirenko_recent_posts a,#pls_right_sidebar .pirenko_recent_posts a').addClass('zero_color');

        //GOOGLE MAPS
        if (jQuery('.google_maps').length) {
            if (loaded_google_maps===false) {
                loaded_google_maps=true;
                var script = document.createElement('script');
                script.type = 'text/javascript';
                if(theme_options.google_maps_key!==undefined && theme_options.google_maps_key!=="") {
                    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=init_map&key='+theme_options.google_maps_key;
                }
                else {
                    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=init_map';
                }
                document.body.appendChild(script);
            }
            else {
                init_map();
            }
        }

        //TEXTFIELDS MANAGEMENT
        jQuery('.pirenko_highlighted').on({
            blur:function() {
                if (jQuery(this).attr('data-bk')!==undefined) {
                    jQuery(this).css({'border':'','outline':'none','color':''});
                    jQuery(this).css({'background-color':jQuery(this).attr('data-bk')});
                }
                else {
                    jQuery(this).css({'border':'','outline':'none','color':'','background-color':''});
                }
            },
        });
        jQuery('.pirenko_highlighted').not('#footer_in .pirenko_highlighted').on({
            focus:function() {
                if (jQuery(this).attr('data-color')!=undefined && jQuery(this).attr('data-color')!="") {
                    jQuery(this).css({'border':'1px solid '+hex2rgb(jQuery(this).attr('data-color'),0.65)+'','color':jQuery(this).attr('data-color'),'background-color':hex2rgb(jQuery(this).attr('data-color'),0.05)});
                }
                if (jQuery(this).attr('data-bk')!==undefined) {
                    jQuery(this).css({'background-color':''});
                }
            },
        });
        //EMAIL SEND FEATURE
        jQuery('#submit_message_div a').on('click',function(e) {
            e.preventDefault();
            var $curr_form=jQuery(this).closest('form');
            //REMOVE PREVIOUS ERRORS IF THEY EXIST
            $curr_form.find(".contact_error").remove();

            //ADD THE TEMPLATE NAME TO THE SUBJECT
            $curr_form.find('#full_subject').attr('value',$curr_form.attr('data-name'));
            var empty_text_error=$curr_form.attr('data-empty');
            var invalid_email_error=$curr_form.attr('data-invalid');
            var value, theID, error, emailReg;
            error = false;
            emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            //DATA VALIDATION
            $curr_form.find('#c_name, #c_email, #c_message').each(function() {
                value = jQuery(this).val();
                theID = jQuery(this).attr('id');
                if(value === '' || value=== jQuery(this).attr('data-original')) {
                    if (theID === 'c_message') {
                        jQuery(this).after('<p class="contact_error pulse_italic prk_heavier_600 header_font at_messa">'+empty_text_error+'</p>');
                    }
                    else {
                        jQuery(this).after('<p class="contact_error pulse_italic prk_heavier_600 header_font">'+empty_text_error+'</p>');
                    }
                    error = true;
                }
                if(theID === 'c_email' && value !== '' && !emailReg.test(value)) {
                    jQuery(this).after('<p class="contact_error pulse_italic prk_heavier_600 header_font">'+invalid_email_error+'</p>');
                    error = true;
                }
                jQuery('.contact_error').addClass('pulse_animated shake');
            });

            //SEND EMAIL IF THERE ARE NO ERRORS
            if(error===false) {
                $curr_form.find("#submit_message_div").addClass("pulse_animated bounceOut");
                setTimeout(function() {
                    $curr_form.find('#contact_ok').addClass('pulse_animated flash');
                    $curr_form.addClass('pls_sending_email');
                    email_ajax_submit();
                    setTimeout(function(){stop_verification=false;},1000);
                },1200);
            }
        });

        //VARIOUS THEME FUNCTIONS
        initHeadline();
        init_member();
        init_blog();
        init_portfolio();
        thumbs_update();
        prk_init_sharrre();

        //Fire custom event. Useful to initialize plugins
        jQuery.event.trigger('pulse_init_plugins');
        //Here's how you can bind this event - replace plugin_function() with whatever is needed
        /*jQuery(document).on("pulse_init_plugins", function(event, data) {
            plugin_function();
        });*/

        //ADD ARROWS
        jQuery('.sitemap_block li a,.widget_rss ul li a, .widget_meta a,.widget_recent_entries a,.widget_categories a,.widget_archive a,.widget_pages a,.widget_links a,.widget_nav_menu a').each(function() {
        });

        //VC STUFF
        if (jQuery.isFunction(window.vc_twitterBehaviour) && theme_options.active_visual_composer==="1") {
            vc_tabsBehaviour();
            vc_twitterBehaviour();
            vc_toggleBehaviour();
            vc_accordionBehaviour();
            vc_teaserGrid();
            vc_carouselBehaviour();
            vc_slidersBehaviour();
            vc_googleplus();
            vc_pinterest();
            vc_progress_bar();
            vc_plugin_flexslider();
            vc_google_fonts();
        }

        //RETINA IMAGES SIZE CHANGE
        jQuery('img.pulse_retina,.pulse_retina img').each(function() {
            var $imager=jQuery(this);
            $imager.parent().imagesLoaded(function() {
                $imager.addClass('prk_first_anim');
                $imager.width($imager.attr('width')/2);
                //$imager.height($imager.attr('height')/2);
            });
        });

        var img_load=imagesLoaded("#pulse_ajax_container");
        img_load.on('always', function() {
            setTimeout(function() {
                jQuery('.pulse_forced_clm').css({'height':''});
                jQuery('#prk_hidden_menu,.forced_row>div,.forced_row>.row,.vertical_forced_row>div').not('.pulse_read').each(function() {
                    jQuery(this).css({'height':''});
                    var compensation=0;
                    if (jQuery(this).attr('data-adjust')!==undefined) {
                        compensation=jQuery(this).attr('data-adjust');
                    }
                    if (jQuery('html').hasClass('menu_at_top')) {
                        jQuery(this).css({'height':jQuery(window).height()-admin_bar_height-compensation-theme_options.collapsed_menu_vertical});
                    }
                    else {
                        jQuery(this).css({'height':jQuery(window).height()-admin_bar_height-compensation});
                    }
                });
                jQuery('.pulse_forced_clm').each(function() {
                    jQuery(this).css({'height':''});
                    jQuery(this).css({'height':jQuery(this).closest(".pls_outer_row").height()});
                });
                //REMOVED, BECAUSE IT WAS A SCROLL ANNOYANCE
                /*if (first_load===true) {
                    go_hash(600,false);
                }
                else {
                    //CHECK IF WE CAME FROM ANOTHER URL TO A RELATIVE ANCHOR
                    if (window.location.hash==="#" || window.location.hash==="") {

                    }
                    else {
                        go_hash(600,false);
                    }
                }*/
                first_load=false;
            },15);
        });

        loading_page=false;
    }
    //END - ended_loading

    //SKROLLR INIT
    if (!pulse_on_mobile) {
        var pulse_skrollr = skrollr.init({
            forceHeight:true,
            smoothScrolling:false
        });
        jQuery(window).trigger("debouncedresize");
    }
    //SCROLLING FUNCTIONS
    /*if (!pulse_on_mobile) {
        jQuery(window).scroll(function() {
            //SKROLLR FIX IF NEEDED
            if (stop_verification===false) {
                stop_verification=true;
                 if (Math.abs(parseInt(jQuery('body')[0].style.height,10)-jQuery('#pulse_main_wrapper').outerHeight())>100) {
                    jQuery(window).trigger("debouncedresize");
                }
            }
        });
    }*/
    jQuery(window).scroll(function() {
        scroll_listener();
        if (hide_onscroll) {
            ns_pos = jQuery(this).scrollTop();
            if (!jQuery('html').hasClass('menu_at_top') && jQuery(window).scrollTop()>=theme_options.menu_hide_pixels && ns_pos > ls_pos){
                jQuery('#pulse_main_wrapper').addClass('pls_hide_nav');
            } else {
                jQuery('#pulse_main_wrapper').removeClass('pls_hide_nav');
            }
            ls_pos=ns_pos;
        }
        //BACK TO TOP BUTTON
        if(jQuery(window).scrollTop() >= 240) {
            jQuery('#pulse_to_top').addClass('pulse_top_shown');
        }
        else {
            jQuery('#pulse_to_top').removeClass('pulse_top_shown');
        }
        check_top_menu(false);
    });

    //CALL A SCROLL EVENT TO INITIALIZE CONTENT
    jQuery(window).scroll();

    //BACK TO TOP BUTTON
    jQuery('#pulse_to_top').on('click',function(e) {
        e.preventDefault();
        jQuery('html,body').stop().animate({
                'scrollTop': 0
            }, 1200, 'easeInOutExpo'
        );
    });

    //CLOSE AJAX PORTFOLIO BUTTON
    jQuery('#pls_close_portfolio').on('click',function(e) {
        jQuery('#pulse_main_wrapper').addClass('pls_closing_ajax');
        jQuery('#pulse_main_wrapper').removeClass('pls_showing_ajax');
        setTimeout(function() {
            jQuery('#pulse_main_wrapper').removeClass('pls_closing_ajax');
            jQuery(window).trigger("debouncedresize");
            jQuery(window).trigger("smartresize");
            jQuery('.folio_masonry').each(function() {
                jQuery(this).isotope('layout');
            });
            Waypoint.refreshAll();
            //GO TO HASHTAG IF POSSIBLE
            go_hash(15,true);
        },300);
        setTimeout(function() {
            Waypoint.refreshAll();
            jQuery('#pls_overlayer').addClass('pls_opacer');
            if (jQuery('.google_maps').length) {
                init_map();
            }
        },450);
        setTimeout(function() {
            jQuery('#pls_overlayer').removeClass('show');
            jQuery('#pls_overlayer').removeClass('pls_opacer');
            pulse_ajax_folio.html('');
        },750);
    });

    //TOP BAR SEARCH FORM
    jQuery('#prk_menu_loupe').on('click',function() {
        jQuery('body').addClass('pulse_showing_search');
        jQuery('body').addClass('pulse_second_menu_search_anims');
        if (!jQuery('html').hasClass('pulse_ie')) {
            jQuery('#searchform_top input').focus();
        }
    });
    function pulse_close_search() {
        jQuery('body').removeClass('pulse_second_menu_search_anims');
        setTimeout(function() {
            jQuery('body').removeClass('pulse_showing_search');
        },300);
    }
    jQuery('#top_form_close').on('click',function() {
        pulse_close_search();
    });

    //FIRST LOAD
    ended_loading(false);
    setTimeout(function(){
        jQuery(window).trigger("debouncedresize");
        jQuery('html').addClass('pulse_ready');
        go_hash(1200,false);
    },300);

    //DELAYED RESIZE LISTENTERS
    jQuery.event.special.debouncedresize.threshold = 100;
    jQuery(window).on("debouncedresize", function() {
        if (!pulse_on_mobile) {
            jQuery('.pulse_video-bg.parallax_video').each(function() {
                var $par_video=jQuery(this);
                var scrolly=$par_video.height()-$par_video.parent().outerHeight();
                $par_video.attr('data-top-bottom',"bottom: -"+scrolly+"px;");
            });
            pulse_skrollr.refresh();
        }
        jQuery('.grid_image_wrapper .pulse_video-bg').each(function() {
            var $par_video=jQuery(this);
            $par_video.css({'width':''});
            $par_video.css({'height':''});
            $par_video.css({'width':$par_video.parent().width()});
            if ($par_video.height()<$par_video.parent().outerHeight()) {
                $par_video.css({'width':''});
                $par_video.css({'height':$par_video.parent().outerHeight()});
            }
        });
        jQuery('#prk_footer_mirror').css({'height':jQuery('#prk_footer').outerHeight()});
        if ((jQuery(window).width())<(resp_width - scrollbar_width) || jQuery(window).width()<(768 - scrollbar_width)) {
            if (!jQuery('html').hasClass('menu_at_top')) {
                jQuery('html').addClass('menu_at_top');
                jQuery('#pulse_main_menu .pulse-menu-ul').css({'display':'none'});
            }
        }
        else {
            if (jQuery('html').hasClass('menu_at_top')) {
                jQuery('html').removeClass('menu_at_top');
                jQuery('#pulse_main_menu .pulse-menu-ul').css({'display':'block'});
            }
        }
        jQuery('.pulse_forced_clm').css({'height':''});
        jQuery('#prk_hidden_menu,.forced_row>div,.forced_row>.row,.vertical_forced_row>div').not('.pulse_read').each(function() {
            jQuery(this).css({'height':''});
            var compensation=0;
            if (jQuery(this).attr('data-adjust')!==undefined) {
                compensation=jQuery(this).attr('data-adjust');
            }
            if (jQuery('html').hasClass('menu_at_top')) {
                jQuery(this).css({'height':jQuery(window).height()-admin_bar_height-compensation-theme_options.collapsed_menu_vertical});
            }
            else {
                jQuery(this).css({'height':jQuery(window).height()-admin_bar_height-compensation});
            }
        });
        jQuery('.pulse_forced_clm').each(function() {
            jQuery(this).css({'height':''});
            jQuery(this).css({'height':jQuery(this).closest(".pls_outer_row").height()});
        });
        jQuery("#prk_hidden_bar_scroller").mCustomScrollbar("update");
        jQuery("#prk_mobile_bar_scroller").mCustomScrollbar("update");
        jQuery('#pulse_related_grid').find('.centerized_father').each(function() {
            jQuery(this).height(jQuery(this).closest(".portfolio_entry_li").innerHeight());
        });
        jQuery('#dotted_navigation').css({'margin-top':-jQuery('#dotted_navigation').height()/2});
        jQuery(".google_maps").height(jQuery(".google_maps").attr('data-map_height'));
        jQuery('.google_maps').css({'max-height':jQuery(window).height()-100});
        jQuery('.cd-words-wrapper').each(function() {
            jQuery(this).css({'width':''});
            jQuery(this).css({'width':jQuery(this).width()});
        });
    });
    //RESIZE LISTENER
    function pirenko_resize() {
        if (jQuery('html').hasClass('pulse_ie') && parseInt(jQuery.browser.version, 10) === 8) {
            height_fix = jQuery(window).height();
        }
        else {
            height_fix = window.innerHeight ? window.innerHeight : jQuery(window).height();
        }
        if (jQuery('#wpadminbar').length) {
            height_fix=height_fix-jQuery('#wpadminbar').height();
        }
        jQuery("#prk_hidden_bar,#prk_hidden_bar_scroller,#prk_mobile_bar_scroller").outerHeight(height_fix);
        if (jQuery('html').hasClass('menu_at_top')) {
            height_fix=height_fix-theme_options.collapsed_menu_vertical;
        }
        jQuery('.folio_masonry').each(function() {
            jQuery(this).width('');
        });
    }
    jQuery(window).resize(function() {
        pirenko_resize();
    });
}
//GLOBAL FUNCTIONS

//SCROLLING FUNCTIONS
function go_hash(timing,closed_folio) {
    var offsetter="";
    //TRY TO MOVE TO PORTFOLIO IF NEEDED AND POSSIBLE
    if (closed_folio) {
        var $target = jQuery('.recentfolio_ul_wp .pls_active_fl');
        if (target!=="") {
            //IS IT AN EXISITNG ID
            if ($target.offset()!==undefined) {
                offsetter=$target.offset().top;
            }
            else {
                //event.preventDefault();
            }
        }
        jQuery('.recentfolio_ul_wp .pls_active_fl').removeClass('pls_active_fl');
    }
    else {
        if (window.location.hash==="#" || window.location.hash==="") {
            //DO NOTHING
        }
        else {
            var target = window.location.hash;
            var $target = jQuery(target);
            //IS IT AN ANCHOR LINK
            if (target!=="") {
                //IS IT AN EXISITNG ID
                if ($target.offset()!==undefined) {
                    offsetter=$target.offset().top;
                }
                else {
                    //event.preventDefault();
                }
            }
        }
    }
    if (offsetter!=="") {
        jQuery('html,body').stop().animate({
                'scrollTop': offsetter-admin_bar_height-mn_collapsed
            },
            timing,
            'easeInOutExpo');
    }
}

// Trouble on page load and scroll feature?
jQuery(window).on('load', function(){
    //go_hash(0,false);
});

/*
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

( function( window ) {

    'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

    function classReg( className ) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ( 'classList' in document.documentElement ) {
        hasClass = function( elem, c ) {
            return elem.classList.contains( c );
        };
        addClass = function( elem, c ) {
            elem.classList.add( c );
        };
        removeClass = function( elem, c ) {
            elem.classList.remove( c );
        };
    }
    else {
        hasClass = function( elem, c ) {
            return classReg( c ).test( elem.className );
        };
        addClass = function( elem, c ) {
            if ( !hasClass( elem, c ) ) {
                elem.className = elem.className + ' ' + c;
            }
        };
        removeClass = function( elem, c ) {
            elem.className = elem.className.replace( classReg( c ), ' ' );
        };
    }

    function toggleClass( elem, c ) {
        var fn = hasClass( elem, c ) ? removeClass : addClass;
        fn( elem, c );
    }

    var classie = {
        // full names
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        // short names
        has: hasClass,
        add: addClass,
        remove: removeClass,
        toggle: toggleClass
    };

// transport
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( classie );
    } else {
        // browser global
        window.classie = classie;
    }

})( window );
function hasParentClass( e, classname ) {
    if(e === document){
        return false;
    }
    if( classie.has( e, classname ) ) {
        return true;
    }
    return e.parentNode && hasParentClass( e.parentNode, classname );
}
//GOOGLE MAPS FUNCTIONS
function init_map() {
    "use strict";
    jQuery('.google_maps').each(function() {
        var $this_map=jQuery(this);
        if ($this_map.attr('data-style')==='subtle_grayscale') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{featureType:"landscape",stylers:[{saturation:-100},{lightness:65},{visibility:"on"}]},{featureType:"poi",stylers:[{saturation:-100},{lightness:51},{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"road.arterial",stylers:[{saturation:-100},{lightness:30},{visibility:"on"}]},{featureType:"road.local",stylers:[{saturation:-100},{lightness:40},{visibility:"on"}]},{featureType:"transit",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"administrative.province",stylers:[{visibility:"off"}]/**/},{featureType:"administrative.locality",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"on"}]/**/},{featureType:"water",elementType:"labels",stylers:[{visibility:"on"},{lightness:-25},{saturation:-100}]},{featureType:"water",elementType:"geometry",stylers:[{hue:"#ffff00"},{lightness:-25},{saturation:-97}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='almost_gray') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='cobalt') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='midnight') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"featureType":"water","stylers":[{"color":"#021019"}]},{"featureType":"landscape","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"transit","stylers":[{"color":"#146474"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='old_timey') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#ff6865"},{"visibility":"on"}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='green') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2ecc71"}]},{"featureType":"poi","stylers":[{"color":"#2ecc71"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-18}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#2ecc71"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='blue_essence') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='theme_special_dk') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":theme_options.active_color},{"lightness":17}]}],
                scrollwheel: false
            };
        }
        else if ($this_map.attr('data-style')==='theme_special') {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":theme_options.active_color},{"visibility":"on"}]}],
                scrollwheel: false
            };
        }
        else {
            var mapOptions = {
                zoom: parseInt($this_map.attr('data-zoom'),10),
                center: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                scrollwheel: false
            };
        }

        var mapElement = document.getElementById($this_map.attr('id'));
        var map = new google.maps.Map(mapElement, mapOptions);
        google.maps.event.addListenerOnce(map, 'idle', function() {

        });
        if ($this_map.attr('data-marker_image_lat')!="" && $this_map.attr('data-marker_image_long')!=""){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($this_map.attr('data-marker_image_lat'), $this_map.attr('data-marker_image_long')),
                map: map,
                icon: $this_map.attr('data-marker'),
                size: new google.maps.Size(40,52),
                clickable: false,
            });
        }
        else {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($this_map.attr('data-lat'), $this_map.attr('data-long')),
                map: map,
                icon: $this_map.attr('data-marker'),
                size: new google.maps.Size(40,52),
                clickable: false,
            });
        }
    });
}
//CONTROL SCROLL ON IFRAMES/MAPS
jQuery('.wpb_raw_html iframe').css("pointer-events", "none");
jQuery('.wpb_raw_html>.wpb_wrapper').on({
    click:function() {
        jQuery(this).find('iframe').css("pointer-events", "auto");
    },
    mouseleave:function() {
        jQuery(this).find('iframe').css("pointer-events", "none");
    }
});
//FUNCTION TO DETECT IF A TOUCH DEVICE IS IN USE
function is_mobile() {
    "use strict";
    var check = false;
    (function(a){
        if((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) || /(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a.toLowerCase())||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4).toLowerCase())){check = true;}})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}
//HEXADECIMAL TO RGB:#CCCCCC=>rgb(204,204,204)
function hex2rgb(hexStr,alpha) {
    "use strict";
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    if (alpha>1) {
        alpha=alpha/100;
    }
    return "rgba("+[r, g, b]+","+alpha+")";
}
function is_retina_device() {
    return window.devicePixelRatio > 1;
}
if (is_retina_device() && !is_mobile()) {
    jQuery('html').addClass('pulse_retina_desktop');
}
//END - GLOBAL FUNCTIONS
jQuery(document).ready(function() {
    if (theme_options.pulse_active_skin!==undefined) {
        jQuery('html').addClass(theme_options.pulse_active_skin);
    }
    if(theme_options.pulse_responsive==="1") {
        jQuery('html').addClass('pulse_responsive');
    }

    var ua = navigator.userAgent.toLowerCase(); ;
    //console.log(ua);
    if (ua.indexOf('edge/') > 0) {
        jQuery('html').addClass('pulse_edge');
    }
    else if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
            jQuery('html').addClass('pulse_chrome');
        } else {
            jQuery('html').addClass('pulse_safari');
        }
    }
    else {
        if (((ua.indexOf('mozilla/5.0') > -1 && ua.indexOf('android ') > -1 && ua.indexOf('applewebkit') > -1))) {
            jQuery('html').addClass('pulse_android');
        }
        else {
            var msie = ua.indexOf('msie');
            var trident = ua.indexOf('trident/');
            if (msie > 0 || trident > 0) {
                jQuery('html').addClass('pulse_ie');
            }
            else if (ua.indexOf('firefox') > -1) {
                jQuery('html').addClass('pulse_mozilla');
            }
        }
    }

    if (theme_options.pulse_current_home!==undefined) {
        jQuery('#pls_home_link').attr('href',theme_options.pulse_current_home);
    }
    var found_url=false;
    if (jQuery('#pulse_main_menu .pulse-menu-ul').length) {
        //jQuery('#pulse_main_menu .pulse-menu-ul li').removeClass('active');
        jQuery('#pulse_main_menu .pulse-menu-ul li').each(function() {
            if (jQuery(this).hasClass('active') && jQuery(this).parent().hasClass('sub-menu')) {
                jQuery(this).parent().parent().addClass('active');
                found_url=true;
            }
        });
        if (found_url===false) {
            //console.log(jQuery("#pulse_main_menu .pulse-menu-ul>li:first-child>a").attr('href'));
            if (window.location.href===jQuery("#pulse_main_menu .pulse-menu-ul>li:first-child>a").attr('href').split('#')[0] && jQuery("#pulse_main_menu .pulse-menu-ul>li:first-child>a").attr('href').split('#')[1]==="") {
                jQuery("#pulse_main_menu .pulse-menu-ul>li:first-child").addClass('active');
            }
        }
    }
    if (jQuery('#pulse_ajax_inner.pulse_forced_menu').length) {
        //jQuery('#pulse_main_wrapper').addClass('pulse_forced_menu');
    }
    jQuery('#pulse_logos_wrapper').css({'min-width':jQuery('#pulse_logo_after>img').attr('data-width')+'px'});
    jQuery('#pulse_main_wrapper').addClass('prk_loading_page');
    if (!jQuery('#pls_side_menu>div').length){
        jQuery('#pls_side_menu').css({'display':'none'});
    }
    if (jQuery('#pulse_full_back').length) {
        jQuery('#pulse_full_back').css({'background-image':'url('+jQuery('#pulse_full_back').attr('data-image')+')'});
        jQuery('#pulse_countdown_wrapper').css({'color':jQuery('#pulse_countdown_wrapper').attr('data-color'),'opacity':1});
        jQuery('html').css({'min-height':'1px'});
    }
    pulse_init();
});

/* jshint ignore:end */