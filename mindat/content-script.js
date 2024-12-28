console.log("Content-Script")
// alert("test")
console.log('chrome:',chrome)

/*
__________                             ___.                 
\______   \ ____   _____   ____   _____\_ |__   ___________ 
 |       _// __ \ /     \_/ __ \ /     \| __ \_/ __ \_  __ \
 |    |   \  ___/|  Y Y  \  ___/|  Y Y  \ \_\ \  ___/|  | \/
 |____|_  /\___  >__|_|  /\___  >__|_|  /___  /\___  >__|   
        \/     \/      \/     \/      \/    \/     \/       
 make sure devtools is open for the extension (inspect popup) to work properly
 Also, you recorded a video demonstrating proper app usage
*/

// setTimeout(function(){
// 	console.log("testing receiving");
// 	// chrome.runtime.sendMessage(chrome.runtime.id,{"one":"two"})
// let continueKeyOne = false;
// let continueKeyTwo = false;

// window.addEventListener("keydown",function(event){
// 	console.log("keydown:",event)
// 	if((event.keyCode == 17)){continueKeyOne = true}
// 	if(event.keyCode == 67){continueKeyTwo = true};
// 	if(continueKeyOne && continueKeyTwo){
// 		chrome.runtime.sendMessage(chrome.runtime.id,"continuing")
// 		console.log("Continuing Scrape");
// 	};
// 	//if keys are one and two post message to onMessage handler to continue at current index
// })

// window.addEventListener("keyup",function(event){
// 	console.log("keyup:",event)
// 	if((event.keyCode == 17)){continueKeyOne = false}
// 	if(event.keyCode == 67){continueKeyTwo = false};
// })
// },5000)


let continueKeyOne = false;
let continueKeyTwo = false;

window.addEventListener("keydown",function(event){ //make sure devtools is open for the extension (inspect popup) to enable this
	console.log("keydown:",event)
	if((event.keyCode == 17)){continueKeyOne = true}
	if(event.keyCode == 67){continueKeyTwo = true};
	if(continueKeyOne && continueKeyTwo){
		chrome.runtime.sendMessage(chrome.runtime.id,"continuing")
		console.log("Continuing Scrape");
	};
	//if keys are one and two post message to onMessage handler to continue at current index
})

window.addEventListener("keyup",function(event){
	console.log("keyup:",event)
	if((event.keyCode == 17)){continueKeyOne = false}
	if(event.keyCode == 67){continueKeyTwo = false};
})


window.onload = function(){
	console.log("window loaded");
	setTimeout(()=>{
		console.log("timeout on content-script");

		// mindat scrape

		var mineral_data = {};
		console.log(mineral_data);
		let name_element = document.querySelector(".mineralheading");
		let name = name_element.innerText;
		mineral_data.Mindat_Name = name;
		let images_element = document.querySelector(".newpicbox");
		console.log("images_element:",images_element)
		if(images_element){
			let images = images_element.querySelectorAll(".userbigpicture.noborder");
			console.log("images:",images);
			mineral_data.Images = [];
			for(let k=0;k<images.length;k++){
				let image = images[k].querySelector("a");
				console.log("image:",image)
				let image_url = image.href;
				console.log("image_url:",image_url)
				mineral_data.Images.push(image_url);	
			}

		}
		let introdata = document.querySelector("#introdata");
		let introdata_children = introdata.children;
		for (let i=0;i<introdata_children.length;i++){
		    const child = introdata_children[i];
		    console.log(child);
		    const key_element = child.children[0];
		    // console.log("key_element:",key_element)
		    const value_element = child.children[1];
		    // console.log("value_element:",value_element)
		    const key = key_element.innerText.substr(0,key_element.innerText.length - 1);
		    const value = value_element.innerText;
		    console.log("key:",key);
		    console.log("value:",value);
		    mineral_data[key] = ((key == "Formula") || (key == "Mindat Formula")) ? value_element.innerHTML : value;
		}

		let data_rows = document.querySelectorAll(".mindatarow");
		for(let i=0;i<=data_rows.length;i++){
			if(i == data_rows.length){
				chrome.runtime.sendMessage(chrome.runtime.id,mineral_data);
				return
			};
		    let data_row = data_rows[i];
		    console.log(data_row)
		    let key_element = data_row.querySelector(".mindatath");
		    let value_element = data_row.querySelector(".mindatam2");
		    if((!key_element) || (!value_element)){continue};
		    // let key_element = data_row.children[0];
		    // let value_element = data_row.children[1];
		    let key = key_element.innerText.substr(0,key_element.innerText.length - 1);
		    if((key == "Reference List") || (key == "")){continue};
		    let value =  value_element.innerText;
		    // mineral_data[key] = value;
		    mineral_data[key] = (key == "Mindat Formula") ? value_element.innerHTML : value;
		    console.log('key:',key);
		    console.log('value:',value);
		}

		// mindat scrape

	},2000);
}