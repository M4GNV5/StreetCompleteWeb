var ll_map = L.map('div_map').setView([51.505, -0.09], 13);
var div_map = document.getElementById('div_map');
var questWindowShown = false;

function handleResize()
{
	document.getElementById('div_fullscreen').style.height = window.innerHeight +'px';
	if(window.innerHeight > window.innerWidth * 0.65){
		//portrait
		div_map.style.width = "100%";
		if(questWindowShown){
			div_map.style.height = "65%";
		}
		else{
			div_map.style.height = "100%";
		}
	}
	else{
		//landscape	
		div_map.style.height = "100%";
		if(questWindowShown){
			div_map.style.width = "65%";
		}
		else{
			div_map.style.width = "100%";
		}		
	}
}
window.addEventListener("resize", handleResize);
handleResize();

//quest gui test
function onClick(e)
{
	questWindowShown = !questWindowShown;	
	handleResize();
}
ll_map.on("click", onClick);

function hideAddressBar(){
	if(document.documentElement.scrollHeight<window.outerHeight/window.devicePixelRatio){
		document.documentElement.style.height = (window.outerHeight / window.devicePixelRatio) + 'px';
	}
	setTimeout(window.scrollTo(1, 1), 0);
}
window.addEventListener("load", hideAddressBar);
window.addEventListener("orientationchange", hideAddressBar);

//Leaflet test
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(ll_map);

L.marker([51.5, -0.09]).addTo(ll_map);

L.circle([51.508, -0.11], {
	color: 'red',
	fillColor: '#f03',
	fillOpacity: 0.5,
	radius: 500
}).addTo(ll_map);

L.polygon([
	[51.509, -0.08],
	[51.503, -0.06],
	[51.51, -0.047]
]).addTo(ll_map);

