/**
 * @author Andro
 */

function addText(message) {
	console.log('add text');

	var textBox = new Kinetic.Shape(function() {
		var context = this.getContext();
		context.font = this.fontSize + 'px Harabara, serif';
		context.textBaseline = 'middle';
		var messageMeasure = context.measureText(message);

		context.beginPath();
		context.rect(0, 0, messageMeasure.width + 36, parseInt(this.fontSize) + parseInt(this.fontSize) / 6);
		context.lineWidth = 0.5;
		context.strokeStyle = this.boundingBox;
		context.stroke();
		context.closePath();

		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 10;
		context.shadowColor = "rgba(0, 0, 0, 0.5)";

		context.textBaseline = "top";
		context.font = this.fontSize + "px Harabara, serif";

		var gradient = context.createLinearGradient(0, 0, 0, 150);
		gradient.addColorStop(0, this.color);
		gradient.addColorStop(1, this.color);

		context.fillStyle = gradient;
		context.fillText(message, 18, 0);
	});
	// enable drag and drop
	textBox.draggable(true);

	textBox.boundingBox = 'rgba(255, 255, 255, 0)';
	textBox.color = 'rgba(255, 255, 255, 0.75)';
	textBox.fontSize = '50';

	textBox.on('mouseover', function() {
		// add cursor styling
		document.body.style.cursor = "pointer";
	});

	textBox.on('mouseout', function() {
		document.body.style.cursor = "default";
		isElementAction = false;
	});

	textBox.on('mousedown touchstart', function() {
		isElementAction = true;
		selTextIndex = this.index;
		showTextControls();
		this.boundingBox = 'rgba(255, 255, 255, 0.5)';
		stage.draw();
		for(var i = 0; i < aText.length; i++) {
			if(i == this.index) {
				continue;
			}
			var tb = aText[i];
			tb.boundingBox = 'rgba(255, 255, 0, 0)';
			stage.draw();
		}
	});

	textBox.on('mouseup touchend', function() {

	});

	textBox.on("dblclick dbltap", function() {

	});

	stage.add(textBox);
	aText.push(textBox);
	textBox.index = aText.length - 1;

}

function clearBoundingBox() {
	hideTextControls();
	for(var i = 0; i < aText.length; i++) {
		var tb = aText[i];
		tb.boundingBox = 'rgba(255, 255, 0, 0)';
		stage.draw();
	}
}


$('#addtext').click(function() {
	var message = $('input#message').val();
	console.log('message: ' + message);
	if(message.length > 0) {
		$('input#message').val('');
		addText(message);
	}
	clearBoundingBox();
});

$('#removetext').click(function() {
	stage.remove(aText[selTextIndex]);
	stage.draw();
	aText.splice(selTextIndex, 1);
	isElementAction = false;
	console.log(isElementAction);
	console.log(aText.length);
	hideTextControls();
});

$('#holder').click(function() {
	if(!isElementAction) {
		clearBoundingBox();
	}
});
function showTextControls() {
	$('#fontsize').show();
	$('#fontsizelabel').show();
	$('#removetext').show();
}

function hideTextControls() {
	$('#fontsize').hide();
	$('#fontsizelabel').hide();
	$('#removetext').hide();
}