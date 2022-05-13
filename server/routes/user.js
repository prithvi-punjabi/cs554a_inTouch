const express = require("express");
const router = express.Router();
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const { ErrorMessage, MyError, SuccessMessage } = require("../helper/message");
const userData = require("../data").userData;
const { ObjectId } = require("mongodb");
const { errorCode } = require("../helper/common");
const { delFriend } = require("../data/user");

router.get("/loggedInUser", async (req, res) => {
	try {
		console.log(req.session);
		res.json(req.session);
	} catch (e) {
		console.log(e);
	}
});

router.get("/:userId", async (req, res) => {
	try {
		validator.checkNonNull(req.params.userId);
		validator.checkString(req.params.userId);
		validator.checkObjectID(req.params.userId, "User ID");
		let userId = req.params.userId;

		const thisUser = await userData.getUser(userId);

		return res.json(thisUser);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.post("/create", async (req, res) => {
	try {
		let accessKey = req.body.accessKey;
		let userName = req.body.userName;
		let password = req.body.password;
		let gender = req.body.gender;
		let contactNum = req.body.contactNo;
		let dob = req.body.dob;
		const [year, month, day] = dob.split("-");
		const switchedDob = [month, day, year].join("/");
		validator.checkNonNull(accessKey);
		validator.checkNonNull(userName);
		validator.checkNonNull(password);
		validator.checkNonNull(gender);
		validator.checkNonNull(contactNum);
		validator.checkNonNull(dob);
		validator.checkString(accessKey, "Access Key");
		validator.checkString(userName, "Access Key");
		validator.checkPassword(password, "Password");
		validator.checkPhoneNumber(contactNum);
		validator.checkDate(switchedDob);

		// ALL VALUES HAVE TO BE TAKEN FROM THE USER
		// let password = "Password123!";
		// let userName = "User name";
		// let pronouns = "He/him";
		// let gender = 0;
		// let contactNum = "000-000-0000";
		// let dob = "09/08/1997";

		const courses = await userData.fetchCourses(accessKey);
		const thisUser = await userData.fetchUser(accessKey);
		const addedUser = await userData.create(
			thisUser.name,
			thisUser.email,
			password,
			thisUser.profilePicture,
			userName,
			thisUser.bio,
			courses,
			gender,
			contactNum,
			switchedDob
		);
		return res.json(addedUser);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		console.log(e);
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.post("/addFriend/:friendId", async (req, res) => {
	try {
		validator.checkNonNull(friendId);
		validator.checkString(friendId);
		validator.checkObjectID(friendId, "Friend ID");
		let friendId = req.params.friendId;

		// User ID will be populated from session of logged in user
		let userId = "abcd";

		const addFriend = await userData.addFriend(userId, friendId);

		return res.json(addFriend);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.post("/delFriend/:friendId", async (req, res) => {
	try {
		validator.checkNonNull(friendId);
		validator.checkString(friendId);
		validator.checkObjectID(friendId, "Friend ID");
		let friendId = req.params.friendId;

		// User ID will be populated from session of logged in user
		let userId = "abcd";

		const addFriend = await userData.delFriend(userId, friendId);

		return res.json(delFriend);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.post("/login", async (req, res) => {
	try {
		let email = req.body.email;
		let password = req.body.password;
		validator.checkNonNull(email);
		validator.checkNonNull(password);
		validator.checkEmail(email);
		validator.checkPassword(password);

		const loggedIn = await userData.loginUser(email, password);
		req.session.user = loggedIn;
		return res.json(loggedIn);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

module.exports = router;
