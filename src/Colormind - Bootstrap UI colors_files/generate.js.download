function ready(fn){
	if (document.readyState != 'loading'){
		fn();
	}
	else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

var colors;
var colors_palette;
var main;
var picker;
var joe;
var currentTarget;
var labels;


ready(function(){
	window.addEventListener('scroll', _throttle(scrollcheck, 150));
	window.addEventListener('scroll', _throttle(generate, 400));
	
	main = document.getElementById('main_wrapper');
	colors = document.querySelectorAll('#colors .color');
	picker = document.getElementById('picker');
	labels = document.querySelectorAll('#colors h3');
	
	joe = colorjoe.rgb(picker, false, [
				'currentColor',
				['hex']]);
	
	joe.on("change", function(color) {
		if(currentTarget){
			var hex =  color.hex();
			currentTarget.setAttribute('data-color', hex);
			currentTarget.setAttribute('style', 'background-color: '+hex);
			
			var id = parseInt(currentTarget.getAttribute('data-id'));
			labels[id].innerText = hex.substring(1).toUpperCase();

			var new_palette = [Math.floor(255*color.r()), Math.floor(255*color.g()), Math.floor(255*color.b())]
			
			if(new_palette == colors_palette[id]){
				return false;
			}
			
			colors_palette[id] = new_palette;
			
			var iframe = document.getElementById('subwindow');
			if(iframe && iframe.contentWindow.setPalette && window.colors_palette){
				iframe.contentWindow.setPalette(window.colors_palette);
			}
		}
	});
		
	for(var i=0; i<colors.length; i++){
		var c = colors[i];
		c.onclick = function(e){
			if(!e.target.getAttribute('data-color')){
				currentTarget = e.target.parentNode;
			}
			else{
				// color picker
				currentTarget = e.target;
			}
			showPicker(e);
			return false;
		}
	}
	
	var editbuttons = document.querySelectorAll('.edit');
	for(var i=0; i<editbuttons.length; i++){
		var b = editbuttons[i];
		b.onclick = function(e){
			// color picker
			currentTarget = colors[this];
			showPicker(e);
			return false;
		}.bind(i);
	}
	
	// stop propagation on main tool
	main.onclick = function(event){
		if(event.target.className == 'color'){
			event.stopPropagation();
		}
	}
	
	picker.onclick = function(event){
		event.stopPropagation();
	}
	
	// click away
	document.onclick = clearjoe;
	
	var randbuttons = document.querySelectorAll('.randomize');
	for(i=0; i<randbuttons.length; i++){
		var r = randbuttons[i];
		r.onclick = function(){
			if(this.className.substr(-14) == 'color-progress'){
				return false;
			}
			
			this.className += ' color-progress';
			
			var groups = document.querySelectorAll('.colors');
			for(var i=0; i<groups.length; i++){
				groups[i].className = 'row colors dirty';
			}
			
			generate(this);
			
			return false;
		}.bind(r);
	}
	
	function generate(button){
		// format input
		var data = {};
		
		var input = [];
		var hasinput = false;
		
		for(var j=0; j<colors.length; j++){
			var c = colors[j];
			var rgb = 'N';
			if(c.getAttribute('data-locked') == 'true'){
				rgb = hexToRgb(c.getAttribute('data-color'));
				hasinput = true;
			}
			input.push(rgb);
		}
		
		if(hasinput){
			data.input = input;
		}
		
		var groups = document.querySelectorAll('.dirty');
		
		for(var j=0; j<groups.length; j++){
			var group = groups[j];
			if(inviewport(group) || group.getAttribute('id') == 'colors'){
				group.className = 'row colors';
				if(group.getAttribute('id') == 'colors'){
					data.model = window.model_name || 'default';
				}
				else{
					data.model = group.getAttribute('id');
				}
		
				// post data
				post(data, group, button);
			}
		}
		
	}
	
	function post(data, group, button){
		var http = new XMLHttpRequest();
		var url = "http://colormind.io/api/";
		
		http.open("POST", url, true);

		http.onreadystatechange = function() {
			
			if(http.readyState == 4 && http.status == 200) {
				if(button){
					setTimeout(function(){
					button.className = 'btn btn-default randomize';
					}, 500);
				}
				var palette = JSON.parse(http.responseText).result;
				if(palette.length != 5){
					return false;
				}
				
				colors_palette = palette;
				
				var h3 = document.querySelectorAll('#'+group.getAttribute('id')+' h3');
				var groupcolors = document.querySelectorAll('#'+group.getAttribute('id')+' .color');
				for(var k = 0; k<groupcolors.length; k++){
					var color = groupcolors[k];
					if(color.getAttribute('data-locked') == 'false'){
						var hex = rgbToHex(palette[k]);
						color.setAttribute('data-color', hex);
						
						h3[k].innerText = hex.substring(1).toUpperCase();
						
						var swipe = color.getElementsByClassName("swipe")[0];
						var width = color.clientWidth;
						
						swipe.className == 'swipe';
						swipe.setAttribute('style', 'border-top: '+width+'px solid '+hex+'; border-left: '+width+'px solid '+hex+'; border-bottom: '+width+'px solid transparent; border-right: '+width+'px solid transparent;');
						
						setTimeout(function(){
							var hex = this.getAttribute('data-color');
							this.setAttribute('style', 'background-color: ' + hex);
							var swipe = this.getElementsByClassName("swipe")[0];
							swipe.removeAttribute('style');
						}.bind(color), 1000);
					}
				}
				
				var sponsor = document.getElementById('sponsor');
				if(sponsor && sponsor.className == group.getAttribute('id')){
					sponsor.style.backgroundColor = rgbToHex(palette[0]);
				}
				
				// call iframe functions if any exist
				var iframe = document.getElementById('subwindow');
				
				if(!iframe){
					return;
				}		
					
				if(iframe.contentWindow.setPalette){
					iframe.contentWindow.setPalette(window.colors_palette);
				}
				else{
					iframe.onload = function(){
						iframe.contentWindow.setPalette(window.colors_palette);
					};
				}
				
			}
		}
		
		http.send(JSON.stringify(data));
	}
	
	// toggle lock
	var locks = document.querySelectorAll('#colors .lock');
	for(i=0; i<locks.length; i++){
		var l = locks[i];
		l.onclick = function(e){
			var id = parseInt(e.target.getAttribute('data-id'));
			var c = colors[id];
			if(c.getAttribute('data-locked')=='false'){
				c.setAttribute('data-locked', 'true');
				e.target.className = 'btn btn-circle lock active';
			}
			else{
				c.setAttribute('data-locked', 'false');
				e.target.className = 'btn btn-circle lock';
			}
			
			return false;
		}
	}
	
	// info toggles
	var infobutton = document.querySelectorAll('.info_expand');
	for(i=0; i<infobutton.length; i++){
		infobutton[i].onclick = function(e){
			var info = e.target.parentNode.parentNode.getElementsByClassName("info")[0];
			if(e.target.innerText == '+'){
				e.target.innerText = '-';
				info.className = 'info active';
			}
			else{
				e.target.innerText = '+';
				info.className = 'info';
			}					
		}
	}
	
	// preload images
	/*preload(
		"img/locked.svg"
	)*/
	
	// generate when ready
	generate();
	
	// sort
	var leftbuttons = document.querySelectorAll('.left');
	var rightbuttons = document.querySelectorAll('.right');
	
	for(i=0; i<leftbuttons.length; i++){
		var b = leftbuttons[i];
		b.onclick = function(){
			var index = Number(this.getAttribute('data-id'));
			swapcolors(index, index-1);
			
			return false;
		}.bind(b);
	}
	
	for(i=0; i<rightbuttons.length; i++){
		var b = rightbuttons[i];
		b.onclick = function(){
			var index = Number(this.getAttribute('data-id'));
			swapcolors(index, index+1);
			
			return false;
		}.bind(b);
	}
});

function showPicker(e){
	var current = currentTarget.getAttribute('data-color');
	joe.set(current);
	picker.className = 'colorPicker active';
	picker.setAttribute('style', 'left: '+e.clientX+'px; top : '+e.clientY+'px');
	
	if(e){
		e.stopPropagation();
	}
}

function scrollcheck(){
	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

	if(main.offsetTop < top){
		main.className = 'active container';
	}
	else if(main.offsetTop > top + 1){
		main.className = '';
	}
	
	clearjoe();
}

function clearjoe(){
	picker.className = 'colorPicker';
	picker.removeAttribute('style');
	currentTarget = false;
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
}

function rgbToHex(rgb){
 return "#" +
  ("0" + parseInt(rgb[0]).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[1]).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2]).toString(16)).slice(-2);
}

function preload() {
	var images = new Array();
	for (i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image()
		images[i].src = preload.arguments[i]
	}
}

function swapcolors(i1, i2){
	var tempcolor = colors[i1].getAttribute('data-color');
	var templock = colors[i1].getAttribute('data-locked');
	
	colors[i1].setAttribute('data-color',colors[i2].getAttribute('data-color'));
	colors[i1].setAttribute('data-locked',colors[i2].getAttribute('data-locked'));
	
	colors[i2].setAttribute('data-color',tempcolor);
	colors[i2].setAttribute('data-locked',templock);
	
	var h3 = document.querySelectorAll('#colors h3');
	h3[i1].innerText = colors[i1].getAttribute('data-color').substring(1).toUpperCase();
	h3[i2].innerText = colors[i2].getAttribute('data-color').substring(1).toUpperCase();
	
	colors[i1].setAttribute('style', 'background-color: '+colors[i1].getAttribute('data-color'));
	colors[i2].setAttribute('style', 'background-color: '+colors[i2].getAttribute('data-color'));
	
	var locks = document.querySelectorAll('#colors .lock');
	locks[i1].className = colors[i1].getAttribute('data-locked') == 'true' ? 'btn btn-circle lock active' : 'btn btn-circle lock';
	locks[i2].className = colors[i2].getAttribute('data-locked') == 'true' ? 'btn btn-circle lock active' : 'btn btn-circle lock';
}

function inviewport(element) {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  var viewport = {
		top: scrollTop,
		bottom: scrollTop + window.innerHeight
	};
	
	var bounds = {
		top: element.offsetTop,
		bottom: element.offsetTop+element.clientHeight
	};

	if(viewport.top > bounds.bottom || viewport.bottom < bounds.top){
		return false;
	}
	return true;
}

_now = Date.now || function() {
	return new Date().getTime();
  };

_throttle = function(func, wait, options) {
var context, args, result;
var timeout = null;
var previous = 0;
if (!options) options = {};
var later = function() {
  previous = options.leading === false ? 0 : _now();
  timeout = null;
  result = func.apply(context, args);
  if (!timeout) context = args = null;
};
return function() {
  var now = _now();
  if (!previous && options.leading === false) previous = now;
  var remaining = wait - (now - previous);
  context = this;
  args = arguments;
  if (remaining <= 0 || remaining > wait) {
	if (timeout) {
	  clearTimeout(timeout);
	  timeout = null;
	}
	previous = now;
	result = func.apply(context, args);
	if (!timeout) context = args = null;
  } else if (!timeout && options.trailing !== false) {
	timeout = setTimeout(later, remaining);
  }
  return result;
};
};