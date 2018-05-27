var questWindowShown = false;

function handleResize()
{
	document.getElementById('div_fullscreen').style.height = window.innerHeight + 'px';
	if(window.innerHeight > window.innerWidth * 0.65)
	{
		//portrait
		div_map.style.width = "100%";
		if(questWindowShown)
		{
			div_map.style.height = "65%";
		}
		else
		{
			div_map.style.height = "100%";
		}
	}
	else
	{
		//landscape	
		div_map.style.height = "100%";
		if(questWindowShown)
		{
			div_map.style.width = "65%";
		}
		else
		{
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

function hideAddressBar()
{
	if(document.documentElement.scrollHeight < window.outerHeight / window.devicePixelRatio)
	{
		document.documentElement.style.height = (window.outerHeight / window.devicePixelRatio) + 'px';
	}
	setTimeout(window.scrollTo(1, 1), 0);
}
window.addEventListener("load", hideAddressBar);
window.addEventListener("orientationchange", hideAddressBar);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(ll_map);

let quests = [];
function refreshQuests()
{
	let bbox = ll_map.getBounds();
	bbox = `${bbox.getSouth()},${bbox.getWest()},${bbox.getNorth()},${bbox.getEast()}`;
	findQuests(bbox).then(function(_quests)
	{
		quests = _quests;
		quests.map((q) => q.render(ll_map));
	});
}
ll_map.on("moveend", refreshQuests);
refreshQuests();
