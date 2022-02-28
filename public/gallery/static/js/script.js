// This function get selfies with theirs details from DB throw api endpoint
async function getData() {
    // Fetch data from database
    const response = await fetch('/selfie-api');
    const json = await response.json();
    console.log(json);
    // Add data to html document
    const contentBox = document.getElementById('content-box');
    contentBox.innerHTML = "";
    for (const data of json.docs) {
        // Create Nodes
        const content = document.createElement('div');
        const check = document.createElement('input');
        const image = document.createElement('img');
        const detailBox = document.createElement('div');
        const locationBox = document.createElement('p');
        const timeBox = document.createElement('p');
        const id = document.createElement('p');
        // Set attrs.
        // content.className = 'item';
        check.type = 'checkbox';
        check.className = 'checker';
        detailBox.className = 'detail-box';
        locationBox.className = 'location';
        timeBox.className = 'time';
        id.className = 'image-id';
        id.style.display = 'none';
        // Set contents to DOM
        image.src = data.image;
        locationBox.innerHTML = `Longitude: ${data.longitude},`+'<br>'+`Latitude: ${data.latitude}`;
        let time = new Date(data.timestamp).toLocaleString("en-US");
        timeBox.textContent = time;
        id.textContent = data._id;
        // Add to document
        detailBox.append(locationBox, timeBox);
        content.append(check, image, detailBox, id);
        contentBox.appendChild(content);
    }
}
// Show checkboxes
function selection() {
    const checkboxes = document.getElementsByClassName('checker');
    for (const iterator of checkboxes) {
        if (iterator.style.display == 'block') {
            iterator.style.display = 'none';
            iterator.checked = false;
        } else {
            iterator.style.display = 'block';
        }
    }
}
// Delete checked item
function deleteItem() {
    const items = document.querySelectorAll("#content-box div:not(.detail-box)");
    const ids = [];
    for (const iterator of items) {
        const check = iterator.getElementsByClassName('checker');
        if (check[0].checked) {
            const item = iterator.getElementsByClassName('image-id');
            let docId = item[0].textContent;
            ids.push(docId);
        }
    }
    const option = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(ids)
    };
    if (ids.length>0) {
        fetch ('/delete-api', option)
        .then (response => response.json())
        .then (result => console.log(result));
        setTimeout(getData, 1000);
    }
}
// Sort items by time stamp
function sortTime() {
    const frag = document.createDocumentFragment(); // document fragment to save sorted items
    const contentBox = document.querySelector("#content-box"); // parent of all image cards
    const contents = contentBox.querySelectorAll("#content-box div:not(.detail-box)"); // all image cards
    // sort by newest- first turn node list to array due to use sort() method
    const sortedItems = [...contents].sort((a, b) => {
        const c = a.getElementsByClassName("time").item(0).textContent,
              d = b.getElementsByClassName("time").item(0).textContent;
        return Date.parse(c) < Date.parse(d) ? 1 : Date.parse(c) > Date.parse(d) ? -1 : 0;
    })
    for (const item of sortedItems) {
        frag.appendChild(item);
    }
    contentBox.appendChild(frag);
}