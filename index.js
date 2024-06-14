const { config } = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const path = require("path");
const session = require("express-session");
const MainRouter = require("./app/routers");
const errorHandlerMiddleware = require("./app/middlewares/error_middleware");
const whatsapp = require("wa-multi-session");

config();

var app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using https
}));

app.set("view engine", "ejs");
// Public Path
app.use("/p", express.static(path.resolve("public")));
app.use("/p/*", (req, res) => res.status(404).send("Media Not Found"));

// Mock user data for authentication
const users = {
  'admin': 'password123', // Replace with real user data
};

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Route for login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Route for handling login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Route for logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Apply the checkAuth middleware only to the root route
app.get('/', checkAuth, (req, res) => {
  res.render('landing_page'); // Render your main page here
});

app.use(MainRouter);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || "5000";
app.set("port", PORT);
var server = http.createServer(app);
server.on("listening", () => console.log("APP IS RUNNING ON PORT " + PORT));

server.listen(PORT);

whatsapp.onConnected((session) => {
  console.log("connected => ", session);
});

whatsapp.onDisconnected((session) => {
  console.log("disconnected => ", session);
});

whatsapp.onConnecting((session) => {
  console.log("connecting => ", session);
});

whatsapp.loadSessionsFromStorage();
