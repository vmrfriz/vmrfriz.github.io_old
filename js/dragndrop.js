document.addEventListener("DOMContentLoaded", function(){
	let draggableElements = document.querySelectorAll('[data-drag]');

	for(let i = 0; i < draggableElements.length; i++) {
		let that = document.getElementById( draggableElements[i].getAttribute('data-drag') );

		draggableElements[i].onmousedown = function(e) {
			let elementStyles = that.currentStyle || window.getComputedStyle(that);
			let clickX = e.pageX - that.offsetLeft + parseInt(elementStyles.marginLeft);
			let clickY = e.pageY - that.offsetTop + parseInt(elementStyles.marginTop);
			let maxX = document.documentElement.clientWidth - that.offsetWidth;
			let maxY = document.documentElement.clientHeight - that.offsetHeight;
			that.classList.add('moved', 'drag');

			function moveAt(e) {
				let newX = Math.max(0, e.pageX - clickX);
				let newY = Math.max(0, e.pageY - clickY);
				that.style.left = Math.min(newX, maxX) + 'px';
				that.style.top  = Math.min(newY, maxY) + 'px';
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