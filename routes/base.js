const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
router.get('/add-new', function(req,res){
  res.sendFile(__dirname+"/add-new.html");
})
app.post("/add-new", function(req, res){
  console.log(test);
})




module