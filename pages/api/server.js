// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require('express');
const path = require('path');
const { Client } = require('pg');
const next = require('next');
const passport = require('passport');

const server = express();
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  });  
  client.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to PostgreSQL');
    }
  });
 
  // Google Authentication
  var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
  // server.use(passport.initialize())
  // server.use(passport.session())
  
  // passport.serializeUser(function(user, done) {;
  //   return done(null, user.id);
  // });
  // passport.serializeUser(function(id, done) {
  //   console.log('Serialize user called.');
  //   return done(null, { User: user });
  // });

  let userProfile;


  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  // passport.deserializeUser(function(id, done) {
  //   console.log('Deserialize user called.');
  //   return done(null, { firstName: 'Foo', lastName: 'Bar' });
  // });

  // passport.deserializeUser(function(id, done) {
  //   return done(null, user.id);
  // });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
    ;
  }
  ));

  // server.use(cors({
  //   origin: "http://localhost:3000",
  //   credentials: true,
  // }))


  server.get('/auth/google',
    passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
  ));

  server.get('/auth/google/callback', (req, res) => {
    passport.authenticate('google', { failureRedirect: '/error' }, res.redirect('/success')
  )});
    // passport.authenticate( 'google', 
    // { failureRedirect: '/failure' },
    // function(req, res) {
    //   res.json(userProfile)
    // }
    // ));

  server.get("/success", (req, res) => {
    res.json('success');
    console.log('success');
  })
  
  server.get('/error', (req, res) => res.json("error logging in"));

  server.get("/test", (req, res) => {
    console.log("connected")
    res.json("logs on client")
  });
  
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });

});


