'use strict';

/**
 * { Create & send ajax request }
 *
 * @param {string}   method
 * @param {string}   path
 * @param {bool}     async
 * @param {function} func
 */
function ajax(method, path, async, func) {
	let ajax = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	ajax.onreadystatechange = function(){
		if (this.readyState != 4 || this.status != 200) return;
		func(this.responseText);
	}
	ajax.open(method, path, async);
	ajax.send();
}

/**
 * { Clear timeline & add portfolio works }
 *
 * @param {json string ||  object} responseText
 */
function updatePortfolio(responseText) {
	document.getElementById('timeline').innerHTML = '';

	let timeline = document.getElementById('timeline');
	let data = (typeof responseText == 'object') ? responseText : JSON.parse(responseText);

	// Helper: create & return DOM element .timeline-date
	function createMonthNode(text) {
		let month = document.createElement('div');
		month.className = 'timeline-date';
		month.innerText = text;
		return month;
	}

	// Helper: create & return DOM element a.news-item
	function createWorkNode(thumb, heading, text) {
		let work = document.createElement('a');
		work.className = 'section news-item';
		work.setAttribute('href', '#todo');
		//work.onclick = function test(){alert('test')};
		work.innerHTML = '<div class="d-flex flex-column flex-sm-row flex-md-column flex-lg-row">\
			<div class="news-item__img"><img alt="" class="img-fluid"></div>\
			<div class="news-item__content">\
				<h3 class="h3"></h3>\
				<p></p>\
			</div>\
		</div>';
		work.querySelector('img').setAttribute('src', thumb);
		work.querySelector('h3').innerText = heading;
		work.querySelector('p').innerText = text;
		return work;
	}

	// Filling area
	let workId = 0;
	for (let cur in data) {

		// Creating month elements
		let month = createMonthNode(cur);
		timeline.appendChild(month);

		// Creating work elements
		for(let i = 0; i < data[cur].length; i++) {
			let that = data[cur][i];
			let work = createWorkNode(that.thumb, that.title, that.description);
			work.onclick = (function(){return function(){ todoModal(that.image, that.title, that.description); return false; }})();
			timeline.appendChild(work);
			workId++;
		}
	}

}

function todoModal(img, heading, description) {
	let modal = document.getElementById('todo');
	todo.querySelector('img').setAttribute('src', img);
	todo.querySelector('.section__heading').innerText = heading;
	todo.querySelector('p').innerText = description;
	window.location.hash = 'todo';
}

ajax('GET', 'data/portfolio.json', true, updatePortfolio);

// JS 'close' modals
if( window.location.hash == '#todo' ) window.location.hash = '';
let homeLinks = document.querySelectorAll('a[href="#"]');
for(let i = 0; i < homeLinks.length; i++) {
	homeLinks[i].onclick = function(e) {
		e.preventDefault();
		window.location.hash = '';
	}
}
