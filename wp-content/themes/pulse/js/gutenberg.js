/* jshint ignore:start */

jQuery(document).ready(function() {
    jQuery('.acf-postbox').each(function () {
        //console.log(jQuery(this).find('.inside.acf-fields>div').length);

        if (!jQuery(this).find('.inside.acf-fields>div').length) {
            jQuery(this).closest('.postbox.acf-postbox').addClass('gut_forced_hide');
        }
    });
});

/* jshint ignore:end */

