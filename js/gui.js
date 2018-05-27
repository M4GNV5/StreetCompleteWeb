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
	questWindowShown = false;
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

let tile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 20,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
})
tile.addTo(ll_map);

function showQuestDetails(quest)
{
	quest.showDetails(document.getElementById("div_details"));

	questWindowShown = true;
	handleResize();
}

function removeQuestMarkers()
{
	ll_map.eachLayer(function(layer)
	{
		if(layer.is_quest && layer.is_quest_marker == true)
		{
			ll_map.removeLayer(layer);
		}
	});
}
var cnt = 0;
function refreshQuests()
{
	if(ll_map.getZoom() > 12){
		let bbox = ll_map.getBounds();
		bbox = `${bbox.getSouth()},${bbox.getWest()},${bbox.getNorth()},${bbox.getEast()}`;
		findQuests(bbox).then(function(quests)
		{
			removeQuestMarkers();
			for(let quest of quests)
			{
				let layer = quest.render();
				layer.addTo(ll_map);

				let marker = L.marker(layer.getCenter(), {icon: quest.icon});
				marker.is_quest_marker = true;
				marker.addTo(ll_map);

				let showQuest = showQuestDetails.bind(null, quest);
				layer.on("click", showQuest);
				marker.on("click", showQuest);
			}
		});
	}
	else
	{
		removeQuestMarkers();
	}
}
ll_map.on("moveend", refreshQuests);
refreshQuests();

var pos_marker;
var pos_radius;
function update_location(position)
{
	// var radius = pos.accuracy / 2;
	var latlng = [position.coords.latitude,  position.coords.longitude];
	var pos_marker_new = L.marker(latlng).addTo(ll_map);
	var  pos_radius_new = L.circle(latlng, {
		color: 'blue',
		fillColor: '#4c70ff',
		fillOpacity: 0.5,
		radius: position.coords.accuracy
	}).addTo(ll_map);
	ll_map.setView(latlng, ll_map.getZoom());
	if(pos_marker){
		pos_marker.remove();
		pos_radius.remove();
	}
	pos_marker = pos_marker_new;
	pos_radius = pos_radius_new;
}
watchId = navigator.geolocation.watchPosition(
	update_location,
	// Optional settings below
	function()
	{
		alert("Failed to aquire location. Enable GPS or try a different browser");
	},
	{
		timeout: 0,
		enableHighAccuracy: true,
		maximumAge: Infinity
	}
);
