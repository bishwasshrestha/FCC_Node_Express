const LocalStrategy = require("passport-local");
const passport = require('passport');
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

module.exports = function (app, myDataBase) {
  //serializating user id
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  //deserializing user id
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectId(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  //Authentication Strategies
  passport.use(
    new LocalStrategy((username, password, done) => {
      console.log("authenticating user");
      myDataBase.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        // if (password !== user.password) return done(null, false);
        if (!bcrypt.compareSync(password, user.password)) {
          console.log("username or password did not match, plesae try again.");
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
};
