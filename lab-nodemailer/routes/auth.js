const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../helpers/mailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 8;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});
  
router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/profile',(req,res) => {
  User.findById(req.user.id)
    .then((user) => {
      res.render('profile', {user})
    })
  
})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashName = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashName
    });

    newUser .save()
            .then(() => {
              let options = {username, email, hashName};
              options.filename = `verify`;
              mailer.send(options);
              res.redirect("/auth/login");
              })
            .catch(err => {
              res.render("auth/signup", { message: "Something went wrong" });
              console.log(err);
            });
  });
}); 
  

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/profile/:id', (req,res) => {
  User.findById(req.params.id)
    .then(user => {
        res.render('profile', {user})
    })
    .catch (err => {
      console.log(err)
    })
})

router.get(`/confirm`,(req,res) => {
  let confirmCode = req.query.code;
  User.findOne({"confirmationCode": confirmCode})
      .then(user => {
        User.updateOne({_id: user._id}, {$set : {status: "Active"}})
            .then(() => {
              res.render(`confirmation`, {user});
            })
      })
      .catch (err => {
        console.log(err)
      });
});


module.exports = router;
