import express from "express";
import UserManager from "../dao/manager_mongo/userManager.js";

const um = new UserManager();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, age, email, password, confirm } = req.body;
  if (!first_name || !last_name || !age || !email || !password || !confirm) {
    res.redirect("/register");
  } else {
    if (password === confirm) {
      const exists = await um.getUser(email);
      if (exists) {
        res.redirect("/register");
      } else {
        const user = { first_name, last_name, age, email, password, is_admin: false };
        const addUser = await um.addUser(user);
        if (addUser) {
          req.session.user = user;
          res.redirect("/products");
        }
      }
    } else {
      res.redirect("/register");
    }
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const user = await um.getUser(email);
  if (user) {
    const userCred = await um.getUserByCreds(email, password);
    if (userCred) {
      req.session.user = user;
      res.redirect("/products");
    } else {
      let msg = "Constraseña incorrecta";
      res.render("login", { msg });
    }
  } else {
    res.redirect("/register");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    let msg = "Se cerró la sesión";
    res.render("login", { msg });
  });
});

export default router;
