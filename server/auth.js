const { OAuth2Client } = require("google-auth-library");
const { User, NavSettings } = require("./models/user");
const socketManager = require("./server-socket");

// create a new OAuth client used to verify google sign-in
const CLIENT_ID = "105463250048-ijbj257fhgd9gtlrp1lpoa1ffnklsfn1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID, process.env.CLIENT_SECRET, "postmessage");

// accepts a login token from the frontend, and verifies that it's legit
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      requiredAudience: CLIENT_ID, // Sprite - changed the name of the parameter from 'audience' to 'requiredAudience'
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    if (existingUser) {
      if (!existingUser.navsettings) {
        User.updateOne(
          { googleid: user.sub },
          { $set: { navsettings: new NavSettings({ avoidGrass: true, stayIndoor: true }) } }
        ).then(() => {
          console.log("Updated user with missing navsettings");
        });
      }
      return existingUser;
    }

    const newUser = new User({
      name: user.name,
      picture: user.picture,
      googleid: user.sub,
      navsettings: new NavSettings({
        avoidGrass: true,
        stayIndoor: true,
      }),
      savedPlaces: [],
      history: [],
    });

    return newUser.save();
  });
}

function login(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUser(user))
    .then((user) => {
      // persist user in the session
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}

function exchangeToken(req, res) {
  client.getToken(req.body.code).then(({ tokens }) => {
    res.send(tokens);
  });
}

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
  exchangeToken,
};
