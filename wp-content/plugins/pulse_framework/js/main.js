jQuery(document).ready(function ($) {
    $('#pirenko_verify_form.plugined').on('submit', function (e) {
        e.preventDefault();
        var pirenko_purchase_key = $('#pirenko_purchase_key').val();
        var pirenko_path = $('#pirenko_verify_form').attr('data-path');
        $('#pirenko_verify_form').addClass('prk_reading');
        $.ajax({
            type : "get",  
            url: 'https://www.pirenko.com/licenses/wp-json/check_license/prk_core?prk_key='+pirenko_purchase_key+'&prk_domain='+pirenko_path+'&prk_theme_id='+$('#pirenko_verify_form').attr('data-theme'),
            success:function(data) {
                $('#pirenko_verify_form').removeClass('prk_reading');
                $('#pirenko_verify_form').addClass('prk_got_answer');
                if (data==="OK") {
                    $('#pirenko_verify_form-output').html('Your license was validated! Thanks for purchasing - you will be redirected in a couple of seconds...');
                    window.location=$('#pirenko_verify_form').attr('data-admin')+pirenko_purchase_key;
                }
                else {
                    $('#pirenko_verify_form-output').html(data);
                }
            },
            error: function(errorThrown) {
                $('#pirenko_verify_form').removeClass('prk_reading');
                $('#pirenko_verify_form-output').html(errorThrown);
            }
        }); 
    });
});