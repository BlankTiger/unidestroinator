import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ id = '', text = '' }) => {
	return (
		<div id={id} className="CenterElement">
			<h1>{text}</h1>
		</div>
	);
};

Header.propTypes = {
	id: PropTypes.string,
	text: PropTypes.string,
};

Header.defaultProps = {
	id: '',
	text: '',
};
export default Header;
