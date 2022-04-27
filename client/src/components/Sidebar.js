import React from "react";
import styled from "styled-components";

function Sidebar(props) {
	const setBody = (type) => {
		props.currentBody(type);
	};
	return (
		<SidebarContainer>
			<Sidebarheader>
				<Sidebarinfo>
					<h2>Nirav Patel</h2>
				</Sidebarinfo>
			</Sidebarheader>
			<hr />
			<h4
				onClick={() => {
					setBody("feed");
				}}
			>
				Feed
			</h4>
			<hr />
			<h4>Channels</h4>
			<br></br>
			<h5>channel1 </h5>
		</SidebarContainer>
	);
}

export default Sidebar;

const SidebarContainer = styled.div`
	background-color: var(--intouch-color1);
	flex: 0.9;
	border-top: 1px solid var(--intouch-color1);
	max-width: 260px;
	margin-top: 5%;
	color: white;
`;

const Sidebarheader = styled.div`
	display: flex;
	border-bottom: 1px solid var(--intouch-color1);
	padding: 13px;
`;

const Sidebarinfo = styled.div`
	flex: 1;

	> h2 {
		font-size: 25px;
	}
`;
