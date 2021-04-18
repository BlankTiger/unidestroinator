import React from 'react';
import './App.global.css';
import { Link } from 'react-router-dom';
import Button from './components/Button';
import Header from './components/Header';

const Settings = () => {
	return (
		<div className="SettingsPage">
			<Link to="/">
				<Button className="linkBtn" text="Back" />
			</Link>
			<Header text="Settings" />
		</div>
	);
};

export default Settings;
