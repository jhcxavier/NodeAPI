import {
  addNewContact,
  getContact,
  getContactById,
} from "../controllers/crmControllers";

const routes = (app) => {
  app
    .route("/contact")
    .get((req, res, next) => {
      //middleware
      console.log(`Request from ${req.originalUrl}`);
      console.log(`Request type ${req.method}`);
      next();
    }, getContact)
    .post(addNewContact);

  app
    .route("/contact/:contactID")
    .get(getContactById)
    .put((req, res) => res.send("PUT request successful!"))
    .delete((req, res) => res.send("DELETE request successful!"));
};

export default routes;
