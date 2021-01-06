const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://<${process.env.DB_USER}>:<${process.env.DB_PASS}>@cluster0.uj2jz.mongodb.net/<${process.env.DB_NAME}>?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(bodyParser.json());
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collections = client.db("power-x_gym").collection("homePageAllData");

    app.post('/homePageData', (req, res) => {
        console.log(req)
        const homeData = req.body;
        collections.insertMany(homeData)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
            .catch(function (err) {
                res.status(data.status).send({ message: err.message });
            });

    })

});

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(4000); 