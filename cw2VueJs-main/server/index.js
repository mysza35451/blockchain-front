const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();


//Middleware
let demoLogger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    let log = `[${formatted_date}] ${method}:${url} ${status}`;
    console.log(log);
    next();
  };
  
  let imageLogger=(req,res,next)=>{



  };

  app.use(demoLogger);

app.use(bodyParser.json());
app.use(cors());


const products= require("./routes/api/products.js")
app.use('/api/products',products)
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started listening on port ${port}`))