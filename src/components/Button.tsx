import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ id = '', text = '', onClick = () => {} }) => {
	return (
		<button id={id} onClick={onClick} type="button">
			{text}
		</button>
	);
};

Button.propTypes = {
	id: PropTypes.string,
	text: PropTypes.string,
	onClick: PropTypes.func,
};

Button.defaultProps = {
	id: '',
	text: 'BtnText',
	onClick: () => {},
};

export default Button;
