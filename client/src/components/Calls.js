import axios from "axios";

const base = "http://localhost:4000";
// axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";

export async function getUser() {
	try {
		let user = await axios.get(base + "/user/loggedInUser");
		console.log(user);
		return user;
	} catch (e) {
		console.log(e);
	}
}

export async function getChat(id) {
	try {
		let channels = await axios.get(base + "/channels/" + id);
		console.log(channels);
		if (channels.data && channels.data.messages) {
			return channels.data.messages;
		} else {
			return [];
		}
	} catch (e) {
		console.log(e);
	}
}

//All channels for testing
export async function getUserChannels(user) {
	try {
		let channels = await axios.get(
			base + "/channels/byUser/" + String(user._id)
		);
		return channels.data;
	} catch (e) {
		console.log(e);
	}
}
