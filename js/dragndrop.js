document.addEventListener("DOMContentLoaded", function(){
	let draggableElements = document.querySelectorAll('[data-drag]');

	for(let i = 0; i < draggableElements.length; i++) {
		let that = document.getElementById( draggableElements[i].getAttribute('data-drag') );

		draggableElements[i].onmousedown = function(e) {
			let elementStyles = that.currentStyle || window.getComputedStyle(that);
			let clickX = e.pageX - that.offsetLeft + parseInt(elementStyles.marginLeft);
			let clickY = e.pageY - that.offsetTop + parseInt(elementStyles.marginTop);
			let documentWidth = document.documentElement.clientWidth;
			let documentHeight = document.documentElement.clientHeight;
			let maxX = documentWidth - that.offsetWidth;
			let maxY = documentHeight - that.offsetHeight;
			that.classList.add('moved', 'drag');

			function moveAt(e) {
				let newX = Math.max(0, e.pageX - clickX);
				let newY = Math.max(0, e.pageY - clickY);
				that.style.left = Math.min(newX, maxX) / documentWidth * 100 + '%';
				that.style.top  = Math.min(newY, maxY) / documentHeight * 100 + '%';
			}
			moveAt(e);

			document.onmousemove = function(e) {
				moveAt(e);
			}

			// End of drag'n'drop
			document.onmouseup = function() {
				document.onmousemove = null;
				draggableElements[i].onmouseup = null;
				that.classList.remove('drag');
			}
		};
	}

});