import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ id = '', className = '', text = '', onClick = () => {} }) => {
	return (
		<button id={id} className={className} onClick={onClick} type="button">
			{text}
		</button>
	);
};

Button.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	text: PropTypes.string,
	onClick: PropTypes.func,
};

Button.defaultProps = {
	id: '',
	className: '',
	text: 'BtnText',
	onClick: () => {},
};

export default Button;
