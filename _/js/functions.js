/**
 * @author Andro
 */

// remap jQuery to $
(function($) {
})(window.jQuery);

var state = document.getElementById('status');
var holder = document.getElementById('holder');
var stage = new Kinetic.Stage("holder", 250, 300);
var aText = new Array();
var selTextIndex = 0;
var isElementAction = false;

//global setup
document.ondblclick = function DoubleClick(evt) {
	if(window.getSelection)
		window.getSelection().removeAllRanges();
	else if(document.selection)
		document.selection.empty();
}
holder.onselectstart = function() {
	return false;
}
disable('#export');
disable('#message');
disable('#addtext');
disable('#facebook');

// init event handlers
var bdy = document.getElementById('sfbody');
bdy.addEventListener("dragenter", enter, false);
bdy.addEventListener("dragleave", exit, false);
bdy.addEventListener("dragover", noop, false);
bdy.addEventListener("drop", drop, false);

/* trigger when page is ready */
$(document).ready(function() {

});
function noop(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

function enter(evt) {
	this.className = 'hover';
}

function exit(evt) {
	this.className = '';
}

function drop(evt) {
	this.className = '';
	var files = evt.dataTransfer.files;
	var count = files.length;
	if(count > 0) {
		handleFiles(files);
	}
}

function handleFiles(files) {
	var imageType = /image.*/;
	var file = files[0], reader = new FileReader();
	//reader event handler
	reader.onload = handleReaderLoad;
	if(!file.type.match(imageType)) {
		alert('not an image!');
		return false;
	} else {
		reader.readAsDataURL(file);
		$('#instructions').hide();
		enable('#export');
		enable('#message');
		enable('#addtext');
		enable('#facebook');
	}
}

var bgImage;
function handleReaderLoad(evt) {
	var img = new Image();
	img.onload = function() {

		holder.style.height = this.height + 'px';
		holder.style.width = this.width + 'px';
		stage.setSize(this.width, this.height);
		bgImage = new Kinetic.Image({
			image : this,
			x : 0,
			y : 0
		});

		var context = stage.getContext();
		context.drawImage(this, 0, 0);
	}
	img.src = evt.target.result;
}

$('#export').click(function() {
	clearBoundingBox();
	stage.toDataURL(function(dataUrl) {
		var image = document.getElementById("preview_image");
		image.src = dataUrl;
		showModal('image');
	
/**	//save image in the server
	var postData = "canvasData="+dataUrl;	  
	var ajax = new XMLHttpRequest();
	document.body.style.cursor = 'wait';
	// Create a function that will receive data sent from the server
	ajax.onreadystatechange = function(){
		if(ajax.readyState == 4 && ajax.status == 200){
			rand =  ajax.responseText;
			document.body.style.cursor = 'default';
			showModal('image');
			enable('#facebook');
		}
	};
	//specify our php processing page
	ajax.open("POST",'save_image.php',true);
	//set the mime type so the image goes through as base64
	ajax.setRequestHeader('Content-Type', 'canvas/upload');
	ajax.send(postData);**/
	});
});

$('#fontsize').bind('input', function() {
	var tb = aText[selTextIndex];
	tb.fontSize = $('#fontsize').val();
	stage.draw()
});

$('#fakephoto').click(function() {
	clearBoundingBox();
	$('#photo').trigger('click');
});

$('#photo').css("visibility", "hidden");

function disable(bid) {
	$(bid).attr('disabled', true);
	$(bid).toggleClass('disabled');
}

function enable(bid) {
	$(bid).removeAttr('disabled');
	$(bid).toggleClass('disabled');
}

$.fn.center = function() {
	this.css("position", "absolute");
	this.css("top", "200px");
	this.css("left", (jQuery(window).width() - this.width() ) / 2 + jQuery(window).scrollLeft() + "px");
	jQuery(window).scrollTop();
	return this;
}
//modals
$('#modal .content .modalhelp').hide();
$('#modal .content .modalabout').hide();
$('#modal .content .modalimage').hide();
$('#modal-screenblock').css("height", jQuery(document).height());

$('#help').click(function() {
	showModal('help');
});
$('#about').click(function() {
	showModal('about');
});


$('#modal .linkish.close').click(function() {
	$('#modal').fadeOut("slow");
	$('#modal-screenblock').fadeOut("slow");
})

$('#modal-screenblock').click(function() {
	$('#modal').fadeOut("slow");
	$('#modal-screenblock').fadeOut("slow");
})

function showModal(content){
	$("#modal").center();
	$('#modal').fadeIn("slow");
	$('#modal-screenblock').fadeTo("slow", .9);
	switch(content){
		case 'help': {
			$('#modal .content .modalhelp').show();
			$('#modal .content .modalabout').hide();
			$('#modal .content .modalimage').hide();
			break;
		}
		case 'about': {
			$('#modal .content .modalimage').hide();
			$('#modal .content .modalhelp').hide();
			$('#modal .content .modalabout').show();
			break;
		}
		case 'image': {
			$('#modal .content .modalhelp').hide();
			$('#modal .content .modalabout').hide();
			$('#modal .content .modalimage').show();
			break;
		}
	}
}
