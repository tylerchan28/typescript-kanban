// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require('express');
const path = require('path');
const { Client } = require('pg');
const next = require('next');
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");

// consider using Sequelize ORM

const server = express();
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// See request info
// server.use((req, res, next) => {
//   console.log(req.url);
//   console.log(req.body);
//   console.log(req.method);
//   next();
// })

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
  server.use(bodyParser.json());
  // Google Authentication
  const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
  server.use(session({ secret: "cats", resave: true, saveUninitialized: true }));
  server.use(passport.initialize())
  server.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
  ));

  server.get('/auth/google',
    passport.authenticate('google', { scope:
      [ 'openid', 'email', 'profile' ] }
  ));

  server.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/error',
    }),
    function (req, res) {
      client.query('INSERT INTO users (email) VALUES ($1) ON CONFLICT DO NOTHING', [req.user.email], (err, results) => {
        if (err) throw err;
        res.redirect("/projects");
      })
    }
  )

  server.post("/add-project", (req, res) => {
    const { user_id, project_name } = req.body;
    client.query('INSERT INTO projects (user_id, project_name) VALUES ($1, $2)', [user_id, project_name], (err, results) => {
      if (err) throw err;
      console.log("added project")
    })
  })
  
  server.get("/success", (req, res) => {
    client.query('SELECT user_id FROM users WHERE email = ($1)', [req.user.email], (err, results) => {
      if (err) throw err;
      res.json(results.rows)
    })
  })
  
  server.get('/user-projects/:user_id', (req, res) => {
    client.query('SELECT project_id FROM projects WHERE user_id = ($1)', [req.params.user_id], (err, results) => {
      if (err) throw err;
      res.json(results.rows);
    })
  })

  server.get('/error', (req, res) => res.json("error logging in"));
  
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
});

