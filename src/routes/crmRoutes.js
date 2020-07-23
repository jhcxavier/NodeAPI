import {
  addNewContact,
  getContact,
  getContactById,
  updateContact,
  deleteContact,
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
    .put(updateContact)
    .delete(deleteContact);
};

export default routes;
