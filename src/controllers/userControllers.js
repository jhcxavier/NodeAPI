import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserSchema } from "../models/userModel";

const User = mongoose.model("User", UserSchema);

export const loginRequire = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
};

export const register = (req, res) => {
  const newUser = new User(req.body);
  //On the request body there will be a hashPassword and we will encrypt with "bcrypt" the password
  // to compare with the password at the DB. 10 is the number the hash require to encrypt
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    } else {
      //   If there is no error we want to set the password to undefined, not sending the password
      // as a response to avoid any attack or exposure
      user.hashPassword = undefined;
      return res.json(user);
    }
  });
};

export const login = (req, res) => {
  User.findOne(
    //We will match the email with the email on the DB
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) throw err;
      // If no user we send message
      if (!user) {
        res
          .status(401)
          .json({ message: "Authentication failed. No user found!" });
      } else if (user) {
        // if we find user we compare the password if does not match we return 401
        if (!user.comparePassword(req.body.password, user.hashPassword)) {
          res
            .status(401)
            .json({ message: "Authentication failed. Wrong password" });
        } else {
          // Finally return token if authentication is correct
          return res.json({
            token: jwt.sign(
              { email: user.email, username: user.username, _id: user.id },
              "RESTFULAPIs"
            ),
          });
        }
      }
    }
  );
};
