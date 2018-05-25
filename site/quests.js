function findQuestsOfType(bbox, type)
{
	var query = type.getOverpassQuery(bbox);

	return new Promise((resolve, reject) => {
		var req = new XMLHttpRequest();
		req.onload = () => resolve(new type(req.responseText));
		req.onerror = reject;

		req.open("POST", "https://lz4.overpass-api.de/api/interpreter");
		req.send(query);
	});
	
}

let questTypes = [];
async function findQuests(bbox)
{
	let quests = await Promise.all(questTypes.map((type) => findQuestsOfType(bbox, type)));
	console.log(quests);
	return Array.prototype.concat.apply([], quests);
}

class Quest
{
	//create a new quest
	//	`source` is the response of the overpass API
	constructor(source)
	{
	}

	//get the quest icon
	get icon()
	{
		throw new Error("Not implemented");
	}

	//get the overpass query code
	//	`pos` location where to search
	static getOverpassQuery(pos)
	{
		throw new Error("Not implemented");
	}

	//render the quest to the map
	//	`map` is the leaflet map object
	render(map)
	{
		throw new Error("Not implemented");
	}

	//show the quest GUI
	//	`element` is a HTMLElement which shall hold the quest
	showDetails(element)
	{
		throw new Error("Not implemented");
	}
}

class HouseNumberQuest extends Quest
{
	constructor(source)
	{
		super();

		console.log(JSON.parse(source));
		//TODO...
	}

	static getOverpassQuery(bbox)
	{
		bbox = `${bbox.lat}, ${bbox.long}, ${bbox.lat + bbox.width}, ${bbox.long + bbox.height}`;
		return `[out:json][timeout:25];
				(
					way["building"~"house|residential|apartments|detached|terrace|hotel|dormitory|houseboat|school|civic|college|university|public|hospital|kindergarten|train_station|retail|commercial"]["addr:housenumber"!~".*"]["addr:housename"!~".*"](${bbox});
					relation["building"~"house|residential|apartments|detached|terrace|hotel|dormitory|houseboat|school|civic|college|university|public|hospital|kindergarten|train_station|retail|commercial"]["addr:housenumber"!~".*"]["addr:housename"!~".*"](${bbox});
				);
				out body;
				>;
				out skel qt;`;
	}

	render(map)
	{
		//TODO...
	}

	showDetails(element)
	{
		//TODO...
	}
}
questTypes.push(HouseNumberQuest);
