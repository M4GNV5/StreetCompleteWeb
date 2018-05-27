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

function refreshQuests()
{
	let bbox = ll_map.getBounds();
	bbox = `${bbox.getSouth()},${bbox.getWest()},${bbox.getNorth()},${bbox.getEast()}`;
	findQuests(bbox).then(function(quests)
	{
		ll_map.eachLayer(function(layer)
		{
			if(layer != tile)
				ll_map.removeLayer(layer);
		});

		for(let quest of quests)
		{
			let layer = quest.render();
			layer.addTo(ll_map);

			let marker = L.marker(layer.getCenter(), {icon: quest.icon});
			marker.addTo(ll_map);

			let showQuest = showQuestDetails.bind(null, quest);
			layer.on("click", showQuest);
			marker.on("click", showQuest);
		}
	});
}
ll_map.on("moveend", refreshQuests);
refreshQuests();
