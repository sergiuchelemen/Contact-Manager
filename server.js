const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();

// ejs
app.set("view engine", "ejs");
app.set("views", "pages");

// environment variables configuration
dotenv.config();
const PORT = process.env.PORT || 3000;
// database connection
const dbUrl = process.env.MONGODB_URI;
const connectDb = async () => {
	try {
		const connect = await mongoose.connect(dbUrl);
		console.log(
			"Connected to MongoDB ->",
			`Host: ${connect.connection.host},`,
			`Name: ${connect.connection.name}`
		);
	} catch (err) {
		console.log("Error connecting to MongoDB: ", err);
	}
};
connectDb();
// parsing data and cookies middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// root route
app.get("/", (req, res) => {
	// redirecting the root route to the /login route
	res.redirect("/login");
});

// register route
app.use("/register", require("./routes/registerRoute"));

// login route
app.use("/login", require("./routes/loginRoute"));

// main page
app.use("/user", require("./routes/userPage"));

// middlewares for static files such as CSS
app.use("/public/js", express.static(__dirname + "/public/js"));
app.use("/public/css", express.static(__dirname + "/public/css"));
app.use("/public/assets", express.static(__dirname + "/public/assets"));

// run app
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
