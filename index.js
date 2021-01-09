const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj2jz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const homePageDataCollections = client.db("power-x_gym").collection("homePageAllData");
    app.post('/homePageData', (req, res) => {
        const homeData = req.body;
        homePageDataCollections.insertMany(homeData)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
            .catch(function (err) {
                res.send({ message: err.message });
            });
    });

    app.get('/workOutData', (req, res) => {
        homePageDataCollections.find({}).limit(3)
            .toArray((err, document) => {
                res.send(document)
            })
    });

    app.get('/ourDream', (req, res) => {
        const ourDreamData = req.query;
        console.log(req)
        homePageDataCollections.find({}).limit(3,4)
        .toArray((err, document) => {
            res.send(document)
        })
    })

});


app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(4000); 