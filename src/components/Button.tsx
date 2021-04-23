import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
	id = '',
	className = '',
	text = '',
	onClick = () => {},
	disabled = false,
}) => {
	return (
		<button
			id={id}
			className={className}
			onClick={onClick}
			disabled={disabled}
			type="button"
		>
			{text}
		</button>
	);
};

Button.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	text: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};

Button.defaultProps = {
	id: '',
	className: '',
	text: 'BtnText',
	onClick: () => {},
	disabled: false,
};

export default Button;
