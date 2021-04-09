import React from 'react';
import PropTypes from 'prop-types';

const Video = ({ id = '' }) => {
	return <video autoPlay id={id} muted />;
};

Video.propTypes = {
	id: PropTypes.string,
};

Video.defaultProps = {
	id: '',
};

export default Video;
