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
			timeline.appendChild( document.createElement('div') );
			workId++;
		}
	}

}

function todoModal(img, heading, description) {
	let modal = document.getElementById('todo');
	modal.querySelector('.section__heading').innerText = heading;
	modal.querySelector('p').innerText = description;
	modal.querySelector('img').setAttribute('src', img);
	modal.querySelector('img').onload = function() {
		window.location.hash = 'todo';
	};
}

// Calculator
function Calc(elem, startPrice) {
	// Calc result area
	//this.elem = elem;
	try {
		if( typeof elem == 'string' || typeof elem == 'object' )
			this.elem = ( typeof elem == 'string' ? document.querySelector(elem) : elem )
		else
			console.warning('Calc.init(element, startPrice = 0): element must be string selector or element object, but present ' + typeof elem);
	} catch( e ) {
		console.log(e);
	}
	this.priceList = document.querySelectorAll('[data-calc="' + this.elem.getAttribute('id') + '"]');
	this.startPrice = parseFloat(startPrice);

	/**
	 * Update calc price area
	 * @return {float} price
	 */
	this.update = function() {
		let finalPrice = this.startPrice;
		for(let i = 0; i < this.priceList.length; i++) {
			if( this.priceList[i].checked ) continue;
			finalPrice += parseFloat( this.priceList[i].getAttribute('data-price') );
		}
		this.elem.innerText = finalPrice + ' руб.';
		return finalPrice;
	};

	this.handleEvent = function(event) {
		switch(event.type) {
			case 'change':
				this.update();
				break;
		}
	};

	// Add listener
	for(let i = 0; i < this.priceList.length; i++ ) {
		this.priceList[i].addEventListener('change', this);
	}

	this.update();
}

function scrollTo(element, to, duration) {
	if(duration == 500) console.log(element);

	if (duration <= 0) return;
	var difference = to - element.scrollTop;
	var perTick = difference / duration * 10;
	console.log(element.scrollTop + ' | ' + to + ' | ' + duration + ' | ' + perTick);

	setTimeout(function() {
		element.scrollTop = element.scrollTop + perTick;
		if (element.scrollTop === to) return;
		scrollTo(element, to, duration - 10);
	}, 10);
}

// Load portfolio
ajax('GET', 'data/portfolio.json', true, updatePortfolio);

// JS 'close' modals
if( window.location.hash == '#todo' ) window.location.hash = '';

// Calculator
let calculator = new Calc('#calc-price', 1000);

document.getElementById('msg').addEventListener('click', function(event) {
	event.preventDefault();

	let c = document.getElementById('contacts');
	c.style.zIndex = "11";
	c.style.position = "relative";

	// Scroll to contacts
	let scrollableElement = document.querySelector('html');
	var scroll = function( step ) {
		let tickDistance = (c.offsetTop - 15 - scrollableElement.scrollTop) / step;
		scrollableElement.scrollTop += tickDistance;
		if(step == 1) return;
		setTimeout(function(){ scroll(step-1) }, 10);
	}
	scroll(50);

	// bg create
	let bg = document.createElement('a');
	bg.setAttribute('href', '#close');
	bg.classList.add('modal-bg');
	document.body.appendChild(bg);

	// bg animation
	bg.style.opacity = 0;
	bg.style.transition = 'all .2s ease-out';
	setTimeout(function(){
		bg.style.opacity = null;
	}, 50);

	// get back
	function getBack() {
		bg.style.opacity = 0;
		let undo = function() {
			bg.parentNode.removeChild(bg);
			document.getElementById('contacts').removeAttribute('style');
		}
		setTimeout(undo, 210);
	}

	let timer = setTimeout(getBack, 10000);

	// bg click event
	bg.addEventListener('click', function(event){
		event.preventDefault();
		clearTimeout(timer);
		getBack();
	});
});
