$(function(){

$(document).ready(function(){

	var domain = 'http://kalyani-foundation.com/';

	$('#ham').click(function(e){
		e.stopPropagation();
		$('.hamburger').toggleClass('is-active');
		$('#menu').toggleClass('menu-is-active');


		$(document).click(function(){
			$('.hamburger').removeClass('is-active');
			$('#menu').removeClass('menu-is-active');
			$(this).unbind('click');
		});
	});


	$('.gallery img').click(function(e){
		e.preventDefault();

		$('.gallery img').removeClass('opened');

		$(this).addClass('opened');

		var imgSrc = $(this).attr('src');

		//var originalName = getName(imgSrc);

		$('.popupContainer').remove();


		$('body').append('<div class="popupContainer x"><div class="popHtmlContainer x"><div class="popItemContainer x"><img class="workImg" src="'+imgSrc+'"></div><div class="popItemContainer arrowContainer leftArrow"><img src="'+domain+'assets/images/arrow.png"></div><div class="popItemContainer arrowContainer rightArrow"><img src="'+domain+'assets/images/arrow.png"></div><div class="close"><img src="'+domain+'assets/images/close.png" class="x"></div></div>');

		$('.popupContainer').fadeIn();


		$(document).on('click', '.arrowContainer', function(e){
			changeImage(e);
		});

		$(document).on('keyup', function(e){
			changeImage(e);
		});

		closePopup();

	});

	function closePopup(){
		$(document).on('click', function(e){
			if ($(e.target).hasClass('x') == true) {
				$('.gallery img').removeClass('opened');
				$('.popupContainer').fadeOut();
				setTimeout(function(){
					$('.popupContainer').remove();
				},1000);
				$(document).unbind('click');
				$(document).unbind('keyup');
			}
		});
	}

	function changeImage(e){

		e.preventDefault();

		var opened = $('.opened'),
			images = $('.gallery img'),
			index = images.index(opened);

		images.removeClass('opened');

		if (($(e.target).hasClass('rightArrow') == true || $(e.target).parent().hasClass('rightArrow') == true) || (e.keyCode == 39)) {

			if (index + 1 == images.length) {
				images.eq(0).addClass('opened');
			}else{
				images.eq(index + 1).addClass('opened');
			}
		}

		if (($(e.target).hasClass('leftArrow') == true || $(e.target).parent().hasClass('leftArrow') == true) || (e.keyCode == 37)) {
			images.eq(index - 1).addClass('opened');
		}

		var newImgSrc = $('.opened').attr('src');

		$('.workImg').attr('src', newImgSrc);
	}



	function showError(input, message){
		var parent = input.parent();

		input.css('border', '2px solid #ff6798');
		parent.append('<div class="error">'+message+'</div>');

		$('.error').fadeIn();

		$('.error').animate({
			'height' : '24px',
			'opacity' : '1',
			'margin-top': '10px'
		});
	};


	function validation(field){

		if ($.trim(field.val()) != '') {

			if (field.attr('type') == 'text') {
				field.css('border', '2px solid #2edec6');
			}

			var name = field.attr('name'),
				value = $.trim(field.val());

			if (name == 'email/number' && value != '') {
				field.next('.error').remove();

				var reg = /^[0-9১২৩৪৫৬৭৮৯০१२३४५६७८९०]*$/;

				if (reg.test(value) == true) {
					if (value.length != 10) {
						showError(field, 'Invalid Number');
						return true;
					}
				}
				if (isNaN(value) == true) {
					if (value.includes('@') == false || value.includes('.') == false) {
						showError(field, 'Invalid Email / Number');
						return true;
					}
				}
			}
		}else{
			field.css('border', 'none');
		}
	}

	$('#contact-form input[type="text"], textarea').focusout(function(){

		validation($(this));

	});

	$('#contact-form input[type="text"], textarea').focus(function(){

		$(this).css('border', '2px solid #6f7284');

		var e = $(this).next('.error');
		e.animate({
			'height' : '0',
			'opacity' : '0',
			'margin-top': '0'
		}, 200);
		setTimeout(function(){
			e.remove();
        }, 200);
	});


	$(".ajax-form").submit(function(e){
        e.preventDefault();
        var href = 'https://formcarry.com/s/sVZyDpxyUuK';

        var error = false,
			numEmail = false;

        $('.error').remove();
        $('.popBox').remove();

        $(this).find('[name]').each(function(){
        	var input = $(this),
				name = input.attr('name'),
				value = $.trim(input.val());

			//input.css('border-bottom', '2px solid #6f7284');

			if (name != '_gotcha') {
				if (value == '') {
					input.val('');
					showError(input, 'Left empty');
					error = true;
					return;
				}
			}

			if (name == 'email/number') {
				numEmail = validation($(this));
			}

        });

		var url = $(location).attr('href'),
			urlParams = url.split('/'),
			lang = urlParams[urlParams.length - 2];

		var sucMsg = 'We\'ll contact you regarding this.',
			errMsg = 'An error occured. Please try again later.';

		if (lang == 'ben') {
			var sucMsg = 'আমরা এই বিষয়ে আপনার সাথে যোগাযোগ করব।',
				errMsg = 'একটি এরর ঘটেছে, পরে আবার চেষ্টা করুন।';
		}
		if (lang == 'hin') {
			var sucMsg = 'हम आपसे इस संबंध में संपर्क करेंगे।',
				errMsg = 'एक त्रुटि हुई, बाद में पुन: प्रयास करें।';
		}



        if (error != true && numEmail != true) {

        	$.ajax({
	            type: "POST",
	            url: href,
	            data: new FormData(this),
	            dataType: "json",
	            processData: false,
	            contentType: false,
	            success: function(response){
	                if(response.status == "success"){
	                	$(this).trigger('reset');
	                    $('body').append('<div class="ajaxPopup bounceInDown animated text-cen"><div><img src="'+domain+'assets/images/received.png" width="50px"></div><div class="navy">'+ sucMsg+ '</div></div>');
	                }else{
	                    $('body').append('<div class="ajaxPopup bounceInDown animated text-cen"><div><img src="'+domain+'assets/images/connection-error.png" width="50px"></div><div class="red">'+ errMsg +'</div></div>');
	                }

	                setTimeout(function(){
			        	$('.ajaxPopup').fadeOut(200);
			        }, 5000);
	            },
	            error: function(error){
	            	$('body').append('<div class="ajaxPopup bounceInDown animated text-cen"><div><img src="'+domain+'assets/images/connection-error.png" width="50px"></div><div class="red">'+ errMsg +'</div></div>');
	            	/*setTimeout(function(){
			        	$('.ajaxPopup').fadeOut(200);
			        }, 3000);*/
	            }
	        });
        }

    });


    $('#language li').click(function(){

    	var url = $(location).attr('href'),
    		urlParams = url.split('/'),
    		page = urlParams[urlParams.length - 1];

    	var language = $(this).data('name');

    	if (language == 'en') {
    		window.location = domain+page;
    	}else{
	    	window.location = domain+language+'/'+page;
    	}
    });


    $(document).on('click', '#whatsapp, #c-whatsapp', function(e) {
		e.preventDefault();

		var text = 'Hi! I want to talk about a patient.';
		var url = 'https://api.whatsapp.com/send?phone=919830189189&text='+encodeURIComponent(text);

		//window.location.href = url;

		window.open(url,'_blank');
	});


});

});



/*$('#contact-form input[type="text"], textarea').focusout(function(){

	if ($.trim($(this).val()) != '') {

	if ($(this).attr('type') == 'text') {
		$(this).css('border', '2px solid #2edec6');
	}

	var name = $(this).attr('name'),
		value = $.trim($(this).val());

	if (name == 'email/number' && value != '') {
		$(this).next('.error').remove();

		var reg = /^[0-9১২৩৪৫৬৭৮৯০१२३४५६७८९०]*$/;

		if (reg.test(value) == true) {
			if (value.length != 10) {
				showError($(this), 'Invalid Number');
			}
		}
		if (isNaN(value) == true) {
			if (value.includes('@') == false || value.includes('.') == false) {
				showError($(this), 'Invalid Email Format');
			}
		}
	}
}else{
	$(this).css('border', 'none');
}
});
*/
