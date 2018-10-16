import React from 'react';

const User = props => {
	return(
		<div>
			<p>ID: { props.user.id }</p>
			<p>User: { props.user.username }</p>
		</div>
	);
};

export default User;
