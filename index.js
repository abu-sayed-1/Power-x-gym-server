// const express = require('express');
// const cors = require('cors');
// const bodyParser = require("body-parser");
// const MongoClient = require('mongodb').MongoClient;
// require("dotenv").config();
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj2jz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const homePageDataCollections = client.db("power-x_gym").collection("homePageAllData");
//     const trainingData = client.db("power-x_gym").collection("trainingData");
//     const coursesList = client.db("power-x_gym").collection("coursesList");
//     const chooseCourseAndPricing = client.db("power-x_gym").collection("chooseCourseAndPricing");
//     const usersRegistrationData = client.db("power-x_gym").collection("usersRegistrationData");
//     // Post Home Page All Data
//     app.post('/homePageData', (req, res) => {
//         const homeData = req.body;
//         homePageDataCollections.insertMany(homeData)
//             .then(result => {
//                 res.send(result.insertedCount > 0)
//             })
//             .catch(function (err) {
//                 res.send({ message: err.message });
//             });
//     });
//     // get Home Page All Data
//     app.get('/homePageAllData', (req, res) => {
//         homePageDataCollections.find({})
//             .toArray((err, document) => {
//                 res.send(document)
//             });
//     });

//     // Post Courses List all Data 
//     app.post('/coursesList', (req, res) => {
//         const coursesListData = req.body;
//         coursesList.insertMany(coursesListData)
//             .then(result => res.send(result.insertedCount > 0))
//             .catch(function (err) {
//                 res.send({ message: err.message })
//             })
//     });

//     // get Courses List all Data
//     app.get('/coursesByData', (req, res) => {
//         coursesList.find({})
//             .toArray((err, document) => {
//                 res.send(document)
//             })
//     })

//     // Post Training Data  
//     app.post('/trainingData', (req, res) => {
//         const training = req.body;
//         trainingData.insertMany(training)
//             .then(result => res.send(result.insertedCount > 0))
//             .catch(function (err) {
//                 res.send({ message: err.message })
//             })

//     });

//     app.get('/checkout:id', (req, res) => {
//         const classSchedule = req.params.id;
//         console.log(classSchedule, 'my  id ');
//         trainingData.find({ id: classSchedule })
//             .toArray((err, document) => {
//                 res.send(document);
//             })

//     });

//     //Choose Course And Pricing Plans
//     app.post('/pricingPlans', (req, res) => {
//         const chooseCourse = req.body;
//         chooseCourseAndPricing.insertMany(chooseCourse)
//             .then(result => res.send(result.insertedCount > 0))
//             .catch(function (err) {
//                 res.send({ message: err.message })
//             })
//     });

//     //get Choose Course And Pricing Plans
//     app.get('/chooseCourseData', (req, res) => {
//         chooseCourseAndPricing.find({})
//             .toArray((err, document) => {
//                 res.send(document)
//             })
//     });

//     // Post users Registration Data 
//     app.post('/personalDetail', (req, res) => {
//         const userData = req.body;
//         console.log(req, 'personalDetail')
//         usersRegistrationData.insertOne(userData)
//             .then(result => {
//                 res.send(result.insertedCount > 0)
//             })
//     })
//     // stripe payment getWay========>
    
// });

// app.get('/', (req, res) => {
//     res.send('hello world')
// })

// app.listen(4000); 








































const express = require("express");
const app = express();
// require("dotenv").config();
const stripe = require("stripe")("sk_test_51HaKX2FWzFyXdW5K1iC3AltgEwZPKgnRludp0SBWuCZHDXyH3X5eaYbpm3lt9HJl1bbYuFcevSlbwpGEtaVzpqTc00nomsTcpv");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/stripe/charge", cors(), async (req, res) => {
  console.log("stripe-routes.js 9 | route reached", req.body);
  let { amount, id } = req.body;
  console.log("stripe-routes.js 10 | amount and id", amount, id);
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});
// const PORT = 4000;

app.listen(process.env.PORT || 8080, () => {
  console.log("Server started...");
});
