// Import packages
const Datastore = require('nedb'); // a light mongoDB based DB!
const express = require('express');
// Initialize app
const app = express();
// Initialize DB
const dataBase = new Datastore('database.db');
// Run API on server
const port = process.env.PORT || 3030;
app.listen(port, ()=> {
    console.log('Im listening');
    console.log('Go to: localhost:3030 and take a SHOT!');
});
// Start DB
dataBase.loadDatabase();
// Set app usage
app.use(express.static('public'));
app.use(express.json());
// Set get endpoint
app.get('/selfie-api', (request, response) => {
    console.log("There is a get request");
    dataBase.find({}, (err, docs) => {
        if (err) {
            response.end();
            return
        }
        response.json({
            status: "success",
            docs: docs,
        });
    });
})
// Set post endpoint
app.post('/selfie-api', (request, response) => {
    console.log('I have a request!');
    const data = request.body;
    let timestamp = Date.now();
    data.timestamp = timestamp;
    dataBase.insert(data);
    response.json({
        status: "success",
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
        image: data.image,
    })
})
app.post('/delete-api', (request, response) => {
    console.log('they want to delete some queries!')
    const ids = request.body;
    for (const itemId of ids) {
        console.log(itemId);
        dataBase.remove({ _id: itemId }, {}, function (err, numRemoved) {
            console.log(numRemoved);
        });
    }
    response.json({status: "success"});
})