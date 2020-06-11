const funcitons = require('firebase-admin')
var express = require('express');
var bodyParser = require('body-parser');
//const cors = require('cors');

var app = express();
app.use(bodyParser.json());
//app.use( cors ({origin:true}));


//Authantication
var serviceAccount = require("./admission-to-uni-db-firebase-adminsdk-5k49n-590d725f3e.json");

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://admission-to-uni-db.firebaseio.com"
});

const db = admin.firestore();

//Routes
//---------

//Create students or teachers
//Post
var ID= 4;
const createEntry = async (collectionName,firstName,lastName) => {
  try {
    await db.collection(collectionName).doc('/' + ID+ "/") //creating a doc with an id from the req       
      .create({ 
        ID:ID,
        firstName: firstName,
        lastName: lastName
      })
    ID = ID +1;
    return true;

  }
  catch (error) {
    console.log(error);
    return false;
  }
}

app.post("/createStudent", async(req, res) => {
  var result = await createEntry("Students",req.body.firstName,req.body.lastName)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
});

app.post("/createTeacher", async(req, res) => {
  var result = await createEntry("Teacher",req.body.firstName,req.body.lastName)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
});

// create grade
const createGrade = async (collectionName,ID,grade) => {
  try {
    await db.collection(collectionName).doc('/' + ID+ "/")   
      .create({ 
        ID:ID,
        grade: grade
      })
    return true;

  }
  catch (error) {
    console.log(error);
    return false;
  }
}

app.post("/createGrade/:id", async(req, res) => {
  var result = await createGrade("Grades",req.params.id,req.body.grade)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
});

//Read a student or Teacher or grade
//get

const readUser = async (collectionName,id) => {
  try {
      const document = db.collection(collectionName).doc(id);//we request to get the doc with an id
      let user = await document.get(); // variable that holds a student
      let response = user.data(); // getting the data from the student
      return {status:200,result:response}; // if everything goes well send the data 
  }
  catch (error) {
    console.log(error);
    return {status:500,resulterror};
  }
}

app.get("/readStudent/:id",async(req, res) => {
  var {status,result} = await readUser("Students",req.params.id)
  console.log(status)
  return res.status(status).send(result)

});

app.get("/readTeacher/:id",async(req, res) => {
  var {status,result} = await readUser("Teacher",req.params.id,res)
  return res.status(status).send(result)
});

app.get("/readGrade/:id",async(req, res) => {
  var {status,result} = await readUser("Grades",req.params.id,res)
  return res.status(status).send(result)
});

//Update student or teacher or grade
//Put

const updateUser = async (collectionName,id,firstName,lastName) => {
  try {
    const document = db.collection(collectionName).doc(id);
    await document.update({
      firstName:firstName,
      lastName:lastName
    })
    return true;
       
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

app.put("/updateStudent/:id", async(req, res) => {
  var result = await updateUser("Students",req.params.id,req.body.firstName,req.body.lastName)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
});

app.put("/updateTeacher/:id", async(req, res) => {
  var result = await updateUser("Teacher",req.params.id,req.body.firstName,req.body.lastName)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
});

const updateGrade = async (collectionName,id,grade) => {
  try {
    const document = db.collection(collectionName).doc(id);
    await document.update({
      grade:grade
    })
    return true;
       
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

app.put("/updateGrade/:id", async(req, res) => {
  var result = await updateGrade("Grades",req.params.id,req.body.grade)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
});


//Delete student or teacher or grade
//delete

const deleteUser = async (collectionName,id)=> {
  try {
    const document = db.collection(collectionName).doc(id);
    await document.delete();
    return true;
       
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

app.delete("/deleteStudent/:id", async(req, res) => {
  var result = await deleteUser("Students",req.params.id)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
  
});

app.delete("/deleteTeacher/:id", async(req, res) => {
  var result = await deleteUser("Teacher",req.params.id)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
  
});

app.delete("/deleteGrade/:id", async(req, res) => {
  var result = await deleteUser("Grades",req.params.id)
  if (result){
    res.status(200).send();
  }
  else {
    res.status(500).send();
  }
  
});


app.listen(3000, function () {
  console.log("Listening on port 3000");
});