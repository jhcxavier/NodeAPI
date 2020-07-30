import {
  addNewContact,
  getContact,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/crmControllers";
import helmet from "helmet";
import { login, register, loginRequire } from "../controllers/userControllers";

const routes = (app) => {
  app.use(helmet.frameguard({ action: "DENY" }));
  app
    .route("/contact")
    .get(
      (req, res, next) => {
        //middleware
        console.log(`Request from ${req.originalUrl}`);
        console.log(`Request type ${req.method}`);
        next();
      },
      loginRequire,
      getContact
    )
    //post endpoint
    .post(loginRequire, addNewContact);

  app
    .route("/contact/:contactID")
    //get specific contact
    .get(loginRequire, getContactById)
    //Update contact
    .put(loginRequire, updateContact)
    //delete contact
    .delete(loginRequire, deleteContact);

  //registration route
  app.route("/auth/register").post(register);
  // login route
  app.route("/login").post(login);
};

export default routes;
