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
    const trainingData = client.db("power-x_gym").collection("trainingData");
    const coursesList = client.db("power-x_gym").collection("coursesList");
    const chooseCourseAndPricing = client.db("power-x_gym").collection("chooseCourseAndPricing");
    // Post Home Page All Data
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
    // get Home Page All Data
    app.get('/homePageAllData', (req, res) => {
        homePageDataCollections.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    });

    // Post Courses List all Data 
    app.post('/coursesList', (req, res) => {
        const coursesListData = req.body;
        coursesList.insertMany(coursesListData)
            .then(result => res.send(result.insertedCount > 0))
            .catch(function (err) {
                res.send({ message: err.message })
            })
    });

    // get Courses List all Data
    app.get('/coursesByData', (req, res) => {
        coursesList.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    // Post Training Data  
    app.post('/trainingData', (req, res) => {
        console.log(req)
        const training = req.body;
        trainingData.insertMany(training)
            .then(result => res.send(result.insertedCount > 0))
            .catch(function (err) {
                res.send({ message: err.message })
            })

    });

    app.get('/checkoutId', (req, res) => {
        const classSchedule = req.body;
        console.log(req);
        trainingData.findOne({ id: classSchedule })
            .toArray((err, document) => {
                res.send(document)
            })
            .catch(function (err) {
                res.send({ message: err.message })
            })
    })

    //Choose Course And Pricing Plans
    app.post('/pricingPlans', (req, res) => {
        const chooseCourse = req.body;
        chooseCourseAndPricing.insertMany(chooseCourse)
            .then(result => res.send(result.insertedCount > 0))
            .catch(function (err) {
                res.send({ message: err.message })
            })

    })
});

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(4000); 