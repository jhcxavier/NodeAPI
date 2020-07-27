import mongoose from "mongoose";
import { ContactSchema } from "../models/crmModels";
import validator from "validator";

const Contact = mongoose.model("Contact", ContactSchema);

export const addNewContact = (req, res) => {
  let newContact = new Contact(req.body);

  //validates email format when creating a new contact
  if (validator.isEmail(newContact.email)) {
    newContact.save((err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
      contact = undefined;
    });
  } else {
    res.json({ message: "Email not valid" });
  }
};
export const getContact = (req, res) => {
  Contact.find({}, (err, contact) => {
    if (err) {
      res.send(err);
    }
    res.json(contact);
  });
};
export const getContactById = (req, res) => {
  Contact.findById({ _id: req.params.contactID }, (err, contact) => {
    if (err) {
      res.send(err);
    }
    res.json(contact);
  });
};
export const updateContact = (req, res) => {
  Contact.findOneAndUpdate(
    { _id: req.params.contactID },
    req.body,
    { new: true, useFindAndModify: false },
    (err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    }
  );
};
export const deleteContact = (req, res) => {
  Contact.remove({ _id: req.params.contactID }, (err, contact) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: "Successfully deleted contact" });
  });
};
