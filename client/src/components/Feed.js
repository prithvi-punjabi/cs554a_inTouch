import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import Channel from "./Channel.js";
import { getUserChannels } from "./Calls.js";
// import io from "socket.io-client";

const Feed = () => {
	const [userChannels, setUserChannels] = useState([]);
	const location = useLocation();
	const socketRef = useRef();
	useEffect(() => {
		// console.log(props.user);
		async function fetchData() {
			try {
				let uc = await getUserChannels(location.state);
				setUserChannels(uc);
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
		// socketRef.current = io("/");
		// socketRef.current.emit("add-user", location.state._id);
		// return () => {
		// 	socketRef.current.disconnect();
		// };
	}, [location.state]);
	return (
		<div>
			<p>Welcome</p>
			<p>{location.state.name}</p>
			<Channel
				user={location.state}
				userChannels={userChannels}
				socketRef={socketRef}
			>
				Channel
			</Channel>
		</div>
	);
};

export default Feed;
