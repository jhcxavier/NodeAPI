import express from "express";
import routes from "./src/routes/crmRoutes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jsonwebtoken from "jsonwebtoken";
import helmet from "helmet";
import cors from "cors";

// import csp from "helmet-csp";
const xss = require("xss-clean");
// import RateLimit from "express-rate-limit";
const hsts = require("hsts");

const app = express();
const PORT = 4002;

// helmet setup
//Helmet is a collection of 12 middleware functions to help set some HTTP response headers.
app.use(helmet());

//middleware that can be used to enable CORS
app.use(cors())
// This simple module enforces HTTPS connections on any incoming requests.
// app.use(express_enforces_ssl());

// Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
app.use(helmet.frameguard({ action: "deny" }));

// This middleware adds the Strict-Transport-Security header to the response.
app.use(
  hsts({
    maxAge: 31536000, // Must be at least 1 year to be approved
    includeSubDomains: true, // Must be enabled to be approved
    preload: true,
  })
);

//Prevent XSS attacks
app.use(xss());

//Enabling Cors
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/CRMdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//JWT Setup
app.use((req, res, next) => {
  if (
    //Making sure we have headers, then authorization in our headers, finally the JWT request in the headers.
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    //with jasonwebtoken we validate all of it and verify the signature.
    jsonwebtoken.verify(
      //checking the next item in the array and the word should match the same of the login function when return ok.
      // check userControllers.js login function.
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      (err, decode) => {
        //If everting is ok, the next 3 line make sure that we do not pass data back
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

routes(app);

//serving static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(`Node and express server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});
