/*
Error Handling:
Make sure popup.js is capable of continuing its processes if an error is encountered or the program stops mid process for any reason
*/


//#######################################################################################

/*
	Get the list of mineral names and request a url for each name, each time you receive a message add the message data to the aggregate mineral object 
*/

function one(){
	console.log("one")
	window.mineral_names_index = 0;
	console.log("mineral_names_index:",mineral_names_index)
	const mineral_names_url = chrome.runtime.getURL("IMA_Mineral_Names.txt");
	fetch(mineral_names_url).then(function(response){
		response.json().then(function(mineral_names){
			two(mineral_names)
			three(mineral_names);
		})
	})
}

function two(mineral_names){
	console.log("two")
	window.aggregate_mineral_data = {};
	console.log("aggregate_mineral_data:",aggregate_mineral_data)
	chrome.runtime.onMessage.addListener(function(message){
		console.log("message received:",message);
		// three(mineral_names);
		// const current_mineral = mineral_names[window.mineral_names_index];
		window.aggregate_mineral_data[window.current_mineral] = message;
		if(message != "continuing"){window.mineral_names_index += 1};
		console.log("new index:",mineral_names_index)
		three(mineral_names);
	})
}

function three(mineral_names){
	console.log("three")
	console.log("mineral_names:",mineral_names)
	window.current_mineral = mineral_names[window.mineral_names_index];
	if(!current_mineral){return false};
	console.log("current_mineral:",current_mineral)
	// if(message == "start"){return false};
	// window.aggregate_mineral_data[current_mineral] = message;
	chrome.tabs.query({}).then(function(tabs){ // get list of tabs and pass them to function
		let updating = chrome.tabs.update(tabs[0].id,{active:true,url:`https://www.mindat.org/search.php?search=${current_mineral}`});
		// window.mineral_names_index += 1;
	})
}

one();

//#######################################################################################

// console.log(chrome)
// async function getCurrentTab(){
// 	let tab = await chrome.tabs.query({active:true,lastfocusedwindow:true});
// 	return tab
// }

// let tab = getCurrentTab();
// console.log(tab)

// chrome.tabs.getAllInWindow(function(tabs){
// 	for(let i=0;i<tabs.length;i++){
// 		let tab = tabs[i];
// 		console.log(tab);
// 		chrome.tabs.update(tabs[tab].id,{
// 			"url":"https://mindat.org"
// 		})
// 	}
// })
// const mineral_names_url = chrome.runtime.getURL(`IMA_Mineral_Names.txt`);
// const mineral_names_file = fetch(mineral_names_url).then(function(response){
// 	response.json().then(function(mineral_names){
// 		console.log("mineral_names:",mineral_names);

// 		// console.log("mineral_names_file:",mineral_names_file)

// 		// const mineral_names = ["Abellaite","Zýkaite","Gold","Quartz","Wulfenite"];
// 		// console.log('mineral_names:',mineral_names)
// 		let i = 0;

// 		const aggregate_mineral_data = {};
// 		console.log("aggregate_mineral_data:",aggregate_mineral_data);

// 		function logTabs(tabs) {
// 			let updating = chrome.tabs.update(tabs[0].id, {
// 				active: true,
// 				url: `https://www.mindat.org/search.php?search=${mineral_names[i]}`,
// 				// url:"https://nytimes.com"
// 			});

// 			updating.then(function(){
// 				console.log('finished');
// 			})
// 			console.log(updating)
// 		  // for (const tab of tabs) {
// 		// 	// tab.url requires the `tabs` permission or a matching host permission.
// 		// 	console.log(tab.url);
// 		// 	let updating = chrome.tabs.update(tab.id, {
// 		// 		active: true,
// 		// 		url: "https://mindat.org",
// 		// 	});
// 		  // }
// 		}

// 		function onError(error) {
// 		  console.error(`Error: ${error}`);
// 		}

// 		chrome.tabs.query({}).then(logTabs, onError);

// 		console.log("listener:",chrome.runtime.onMessage.addListener)
// 		chrome.runtime.onMessage.addListener(function(message){
// 			console.log("message received")
// 			console.log("message received:",message);
// 			aggregate_mineral_data[mineral_names[i]] = message;
// 			i+=1;
// 			if(!mineral_names[i]){
// 				// chrome.runtime.getURL(`chrome-extension://${chrome.runtime.id}/IMA_Mineral_Names.txt`)
// 				return false
// 			};
// 			chrome.tabs.query({}).then(logTabs,onError);
// 		})


// 	})
// })
