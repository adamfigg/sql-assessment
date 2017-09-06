const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const mainCtrl = require('./mainCtrl');
const session = require('express-session')

const app = express();

app.use(bodyParser.json())
// app.use(cors({ origin: 'http://localhost:3000'}));

// You need to complete the information below to connect
// to the assessbox database on your postgres server.
const connectionInfo = "postgres://ldmcqotr:N3OiuFu-xtqil_lRVSdQPP_nUowhzo_5@pellefant.db.elephantsql.com:5432/ldmcqotr?ssl=true"
var db = massive.connectSync({
  connectionString: connectionInfo
})
app.set('db', db);

// Initialize user table and vehicle table.
db.init_tables.user_create_seed((err, response) => {
  if (err) console.log(err);
  else console.log('User table init');
})
db.init_tables.vehicle_create_seed((err, response) => {
  if (err) console.log(err);
  else console.log('Vehicles table init');
})


// ===== Build enpoints below ============
//1.
app.get('/api/users', function (req, res, next) {
  db.getAllUsers(function (err, users) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(users)
    }
  })
})

//2.
app.get('/api/vehicles', function (req, res, next) {
  db.getAllVehicles(function (err, cars) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(cars)
    }
  })
})

//3.
app.post('/api/users', (req, res, next) => {
  db.addUser([req.body.name, req.body.email], function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(results)
    }
  })
})

//4.
app.post('/api/vehicles', (req, res, next) => {
  db.addVehicle([req.body.make, req.body.model, req.body.year, req.body.owner_id], function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(results)
    }
  })
})


//5.
app.get('/api/user/:userId/vehiclecount', (req, res, next) => {
  db.countDemVehicles([req.params.userId], function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(results)
    }
  })
})


//6.
app.get('/api/user/:userId/vehicle', (req, res, next) => {
  db.usersVehicles([req.params.userId], function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(results)
    }
  })
})


//7. and 8.

app.get('/api/vehicle', (req, res, next) => {
if(req.query.userEmail){
  db.usersVehiclesByEmail([req.query.userEmail], function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(results)
    }
  })} else {
    db.usersByLetter([req.query.userFirstStart], function (err, results) {
      if (err) {
        console.log(err)
      } else {
        res.status(200).send(results)
      }
    })
  }
})



//9.
app.get('/api/newervehiclesbyyear', (req, res, next) => {
  db.newVBYY(function (err, response) {
    if (!err) {
      res.status(200).send(response);
    } else {
      console.log(err)
    }
  });
})



//10.
app.put('/api/vehicle/:vehicleId/user/:userId', (req, res, next) => {
  db.newOwner([req.params.userId, req.params.vehicleId], function (err, response) {
    if (!err) {
      res.status(200).send(response);
    } else {
      console.log(err)
    }
  })
})


//11.
app.delete('/api/user/:userId/vehicle/:vehicleId', (req, res, next) => {
  db.removeOwner([req.params.vehicleId], function (err, response) {
    if (!err) {
      res.status(200).send(response);
    } else {
      console.log(err)
    }
  })
})



//12.
app.delete('/api/vehicle/:vehicleId', (req, res, next) => {
  db.deleteVehicle([req.params.vehicleId], function (err, response) {
    if (!err) {
      res.status(200).send(response);
    } else {
      console.log(err)
    }
  })
})







// ===== Do not change port ===============
const port = 3000;
app.listen(port, () => {
  console.log('Listening on port: ', port);
})
