'use strict';

let dragObject = {};

document.onmousedown = function(e) {

	if (e.which != 1) return;
	var elem = e.target.closest('[data-drag]');
	if (!elem) return;

	dragObject.elem = document.getElementById( elem.getAttribute('data-drag') );

	dragObject.downX = e.pageX;
	dragObject.downY = e.pageY;
}

document.onmousemove = function(e) {
	if (!dragObject.elem) return;

	if ( !dragObject.avatar ) {

		let moveX = e.pageX - dragObject.downX;
		let moveY = e.pageY - dragObject.downY;
		if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
			return;
		}

		dragObject.avatar = createAvatar(e);
		if (!dragObject.avatar) {
			dragObject = {};
			return;
		}

		// Get document width and height
		let documentWidth = document.documentElement.clientWidth;
		let documentHeight = document.documentElement.clientHeight;

		// Get element css style
		let elementStyles = dragObject.avatar.currentStyle || window.getComputedStyle(dragObject.avatar);

		// Get top left position of draggable block
		dragObject.shiftX = dragObject.downX - dragObject.avatar.offsetLeft + parseInt(elementStyles.marginLeft);
		dragObject.shiftY = dragObject.downY - dragObject.avatar.offsetTop  + parseInt(elementStyles.marginTop);

		// Max draggable block top & left position
		dragObject.maxX = documentWidth - dragObject.avatar.offsetWidth;
		dragObject.maxY = documentHeight - dragObject.avatar.offsetHeight;

		// Percent of width/height
		dragObject.percentX = 1 / documentWidth * 100;
		dragObject.percentY = 1 / documentHeight * 100;

		// Add draggable style (css class)
		dragObject.avatar.classList.add('moved', 'drag');
	}

	/**
	 * Возвращает значение, ограниченное максимумом и минимумом
	 * @param  {int} v   Значение, которому нужен лимит
	 * @param  {int} min Минимальный лимит
	 * @param  {int} max Максимальный лимит
	 * @return {int}     v, если оно между min и max
	 */
	function valBetween(v, min, max) {
		return (Math.min(max, Math.max(min, v)));
	}

	// Move block
	dragObject.avatar.style.left = valBetween(e.pageX - dragObject.shiftX, 0, dragObject.maxX) * dragObject.percentX + '%';
	dragObject.avatar.style.top  = valBetween(e.pageY - dragObject.shiftY, 0, dragObject.maxY) * dragObject.percentY + '%';

	return false;
}

document.onmouseup = function(e) {
	dragObject = {};
}

function createAvatar(e) {

	// Remember old values
	var avatar = dragObject.elem;
	var old = {
		parent: avatar.parentNode,
		nextSibling: avatar.nextSibling,
		position: avatar.position || '',
		left: avatar.left || '',
		top: avatar.top || '',
		zIndex: avatar.zIndex || ''
	};

	// Undo
	avatar.rollback = function() {
		old.parent.insertBefore(avatar, old.nextSibling);
		avatar.style.position = old.position;
		avatar.style.left = old.left;
		avatar.style.top = old.top;
		avatar.style.zIndex = old.zIndex
	};

	return avatar;
}
