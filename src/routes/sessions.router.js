import express from "express";
import UserManager from "../dao/manager_mongo/userManager.js";

const um = new UserManager();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, age, email, password, confirm } = req.body;
  if (!first_name || !last_name || !age || !email || !password || !confirm) {
    res.redirect("/api/sessions/register");
  } else {
    if (password === confirm) {
      const exists = await um.getUser(email);
      if (exists) {
        res.redirect("/api/sessions/register");
      } else {
        const user = { first_name, last_name, age, email, password, is_admin: false };
        const addUser = await um.addUser(user);
        if (addUser) {
          req.session.user = user;
          res.redirect("/products");
        }
      }
    } else {
      res.redirect("/api/sessions/register");
    }
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const user = await um.getUserByCreds(email, password);
  if (user) {
    req.session.user = user;
    res.redirect("/products");
  } else {
    res.redirect("/api/sessions/register");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    let msg = "Se cerró la sesión";
    res.render("login", { msg });
  });
});

export default router;
