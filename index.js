import express from "express";
import routes from "./src/routes/crmRoutes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jsonwebtoken from "jsonwebtoken";
import helmet from "helmet";
// import csp from "helmet-csp";
const xss = require("xss-clean");
import RateLimit from "express-rate-limit";
const hsts = require("hsts");
import http from "http";
const express_enforces_ssl = require("express-enforces-ssl");

const app = express();
const PORT = 4001;

// helmet setup
//Helmet is a collection of 12 middleware functions to help set some HTTP response headers.
app.use(helmet());

// This simple module enforces HTTPS connections on any incoming requests.
// app.use(express_enforces_ssl());

app.use(helmet.frameguard({ action: "deny" }));

// This middleware adds the Strict-Transport-Security header to the response.
// const hstsMiddleware = hsts({
//   maxAge: 31536000, // 1 year
//   preload: true,
// });
// app.use((req, res, next) => {
//   if (req.secure) {
//     hstsMiddleware(req, res, next);
//   } else {
//     next();
//   }
// });

app.use(
  hsts({
    maxAge: 31536000, // Must be at least 1 year to be approved
    includeSubDomains: true, // Must be enabled to be approved
    preload: true,
  })
);
//In short: the CSP module sets the Content-Security-Policy header which can help protect against malicious
//injection of JavaScript, CSS, plugins, and more.
// app.use(
//   csp({
//     directives: {
//       defaultSrc: ["'self'", "default.com"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       sandbox: ["allow-forms", "allow-scripts"],
//       reportUri: "/report-violation",
//       objectSrc: ["'none'"],
//       upgradeInsecureRequests: true,
//       workerSrc: false,
//     },
//   })
// );

// Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
app.use(helmet.frameguard({ action: "DENY" }));
app.use(frameguard({ action: "deny" }));
// const allowCrossDomain = (req, res, next) => {
//   res.header("Access-Control-Allow-Origin");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, X-Requested-With, Authorization"
//   );
//   if (req.method === "OPTIONS") res.send(200);
//   else next();
// };
// app.use(allowCrossDomain);

//Prevent XSS attacks
app.use(xss());

//Rate Limit setup (Minimize DoS Attack) Denial of Service
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //limit of number of request per IP
  delayMs: 0, //disable delays
});

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
    //with jasonwebtoken we validate all of it and verufy the signature.
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
  // res.set("X-Frame-Options", value);
  res.send(`Node and express server running on port ${PORT}`);
});

// imolementation for CSP
// http
//   .createServer((req, res) => {
//     req
//       .on("error", (err) => {
//         console.error(err);
//       })
//       .on("error", (err) => {
//         console.error(err);
//       });
//     //In short: the CSP module sets the Content-Security-Policy header which can help protect against malicious
//     //injection of JavaScript, CSS, plugins, and more.
//     res.writeHead(200, {
//       "Content-Security-Policy": "default-src 'self'",
//     });
//   })
//   .listen(PORT, () => {
//     console.log(`Your server is running on port ${PORT}`);
//   });
app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});

// http.createServer(app).listen(app.get("port"), function () {
//   console.log("Express server listening on port " + app.get("port"));
// });
