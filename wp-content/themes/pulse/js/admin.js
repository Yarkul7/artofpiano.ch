/* jshint ignore:start */
jQuery(document).ready(function() {

	jQuery('#pirenko_verify_form.themed').on('submit', function (e) {
	    e.preventDefault();
	    var pirenko_purchase_key = jQuery('#pirenko_purchase_key').val();
	    var pirenko_path = jQuery('#pirenko_verify_form').attr('data-path');
        var force_refresh = 1 + Math.floor(Math.random() * 5000);
	    jQuery('#pirenko_verify_form').addClass('prk_reading');
	    jQuery.ajax({
	        type : "get",  
	        url: 'https://www.pirenko.com/licenses/wp-json/check_license/prk_core?prk_key='+pirenko_purchase_key+'&prk_domain='+pirenko_path+'&prk_theme_id='+jQuery('#pirenko_verify_form').attr('data-theme')+'&ref='+force_refresh,
	        success:function(data) {
	            jQuery('#pirenko_verify_form').removeClass('prk_reading');
	            jQuery('#pirenko_verify_form').addClass('prk_got_answer');
	            if (data==="OK") {
	                jQuery('#pirenko_verify_form-output').html('Your license was validated! Thanks for purchasing - you will be redirected in a couple of seconds...');
	                window.location=jQuery('#pirenko_verify_form').attr('data-admin')+pirenko_purchase_key;
	            }
	            else {
	                jQuery('#pirenko_verify_form-output').html(data);
	            }
	        },
	        error: function(errorThrown) {
	            jQuery('#pirenko_verify_form').removeClass('prk_reading');
	            jQuery('#pirenko_verify_form-output').html(errorThrown);
	        }
	    }); 
	});

	//ONE CLICK PRELOADER
	jQuery('.pls_one_form .button-primary').click(function() {
		jQuery('body').append('<div id="pls_demo_loader_wrap"><div id="pls_demo_loader"></div></div>');
	});

	//WIDGETS HIGHLIGHT
	if (jQuery('#widget-list').length) {
		jQuery('#widget-list').find("div[id*='pirenko']").addClass('pulse_widget');
		jQuery('#widget-list').find("div[id*='prk']").addClass('pulse_widget');
		jQuery('#widget-list').find("div[id*='pulse']").addClass('pulse_widget');
		jQuery('#widget-list').find("div[id*='decent_comments']").addClass('pulse_widget');
	}


	/*
	Live Modal
	*/
	jQuery(document).ajaxComplete(function(event, xhr, settings) {
		if (jQuery('.pulse_icon_selector').length) {
			jQuery('.wpb_edit_form_elements').addClass('prkadmin-theme-icon');
		}
		if (jQuery(".vc_ui-panel.vc_active").length) {
			var classes = jQuery(".vc_ui-panel.vc_active").attr("class").split(' ');
			jQuery.each(classes, function(i, c) {
			    if (c.indexOf("pls_") === 0) {
			        jQuery(".vc_ui-panel.vc_active").removeClass(c);
			    }
			});
			jQuery('.vc_ui-panel.vc_active .vc_shortcode-param').each(function() {
				if (jQuery(this).attr('data-vc-shortcode-param-name')!==undefined) {
					jQuery(this).addClass('pls_'+jQuery(this).attr('data-vc-shortcode-param-name'));
				}
			});
			if (jQuery('.vc_ui-panel.vc_active').attr('data-vc-shortcode')!==undefined) {
				jQuery('.vc_ui-panel.vc_active').addClass('pls_'+jQuery('.vc_ui-panel.vc_active').attr('data-vc-shortcode'));
			}
		}
	});
	jQuery('#pls_toggle_all').click(function() {
		if (jQuery(this).is(":checked")) {
			jQuery('.pls_check').prop('checked', true); 
		}
		else {
			jQuery('.pls_check').prop('checked', false); 
		}
	});

	//REDUX STUFF
	jQuery('#vrv_one_click #redux-header .notice').slideDown();
	//REMOVE VC REQUEST
	jQuery('.wp-list-table.plugins #the-list tr').each(function() {
		if (jQuery(this).attr('data-slug')==="wpbakery-visual-composer" && jQuery(this).find('.row-actions>.update').length===0) {
			jQuery(this).removeClass('update');
		}
		if (jQuery(this).attr('data-slug')==="pulse-framework" && jQuery(this).find('.row-actions>.update').length===1) {
			jQuery(this).addClass('update');
		}
	});

});
/* jshint ignore:end */