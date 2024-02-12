const express = require("express");
const passport = require("passport");
const path = require("path");
const session = require("express-session");
require("./passportSetup");
require("dotenv").config()

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.sendStatus(401);
	}
};

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.json({ message: "You are not logged in" });
});

app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["email", "profile"],
	})
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: "/auth/success",
		failureRedirect: "/auth/google/failure",
	})
);

app.get("/auth/failure", (req, res) => {
	res.send("failure");
});

app.get("/auth/success", isLoggedIn, (req, res) => {
	const name = req?.user?.displayName;
	res.send(`Hello there!! ${name}`);
});

app.get("/logout", (req, res) => {
	// req.session = null;
	// req.logout();
	res.redirect("/");
});

app.listen(port, () => console.log("server running on port" + port));
