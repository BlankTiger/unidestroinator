/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useEffect } from 'react';
import './App.global.css';
import { Link } from 'react-router-dom';
import settings from 'electron-settings';
import Button from './components/Button';
import Header from './components/Header';

const Settings = () => {
	const deleteFileCheckboxRef = useRef<HTMLInputElement>(null);
	const framerateRef = useRef<HTMLInputElement>(null);
	const resolutionDropdownRef = useRef<HTMLSelectElement>(null);
	const windowWidthRef = useRef<HTMLInputElement>(null);
	const windowHeightRef = useRef<HTMLInputElement>(null);
	const appNameVisibleRef = useRef<HTMLInputElement>(null);
	const menuBarVisibleRef = useRef<HTMLInputElement>(null);

	const loadSettings = async () => {
		if (
			deleteFileCheckboxRef.current !== null &&
			framerateRef.current !== null &&
			resolutionDropdownRef.current !== null &&
			windowWidthRef.current !== null &&
			windowHeightRef.current !== null &&
			appNameVisibleRef.current !== null &&
			menuBarVisibleRef.current !== null
		) {
			framerateRef.current.value = (await settings.get(
				'framerate.value'
			)) as string;

			resolutionDropdownRef.current.selectedIndex = (await settings.get(
				'recordingResolution.index'
			)) as number;

			windowHeightRef.current.value = (await settings.get(
				'windowDetails.height'
			)) as string;

			windowWidthRef.current.value = (await settings.get(
				'windowDetails.width'
			)) as string;

			deleteFileCheckboxRef.current.defaultChecked = (await settings.get(
				'delete.onConverted'
			)) as boolean;

			appNameVisibleRef.current.defaultChecked = (await settings.get(
				'windowDetails.appNameOnHomepage'
			)) as boolean;

			menuBarVisibleRef.current.defaultChecked = (await settings.get(
				'windowDetails.menuBarVisible'
			)) as boolean;
		}
	};

	const saveSettings = async () => {
		if (
			deleteFileCheckboxRef.current !== null &&
			framerateRef.current !== null &&
			resolutionDropdownRef.current !== null &&
			windowWidthRef.current !== null &&
			windowHeightRef.current !== null &&
			appNameVisibleRef.current !== null &&
			menuBarVisibleRef.current !== null
		) {
			await settings.set('framerate', {
				value: framerateRef.current.value,
			});

			await settings.set('recordingResolution', {
				value:
					resolutionDropdownRef.current.options[
						resolutionDropdownRef.current.selectedIndex
					].value,
				index: resolutionDropdownRef.current.selectedIndex,
			});

			await settings.set('windowDetails', {
				height: windowHeightRef.current.value,
				width: windowWidthRef.current.value,
				appNameOnHomepage: appNameVisibleRef.current.checked,
				menuBarVisible: menuBarVisibleRef.current.checked,
			});

			await settings.set('delete', {
				onConverted: deleteFileCheckboxRef.current.checked,
			});

			const framerateValue = await settings.get('framerate.value');
			const selectedResolution = await settings.get(
				'recordingResolution.value'
			);
			const windowWidth = await settings.get('windowDetails.width');
			const windowHeight = await settings.get('windowDetails.height');
			const deleteOnCoverted = await settings.get('delete.onConverted');
			const showAppName = await settings.get(
				'windowDetails.appNameOnHomepage'
			);
			const menuBarVisible = await settings.get(
				'windowDetails.menuBarVisible'
			);

			console.log(
				`${framerateValue}, ${selectedResolution}, ${windowWidth}x${windowHeight}, ${deleteOnCoverted}, ${showAppName}, ${menuBarVisible}`
			);
		}
	};

	useEffect(() => {
		loadSettings();
	});
	return (
		<div className="SettingsPage">
			<div className="CenterElement">
				<Link className="ToTheLeftElement" to="/">
					<Button className="linkBtn" text="Back" />
				</Link>
				<Header text="Settings" />
			</div>
			<form id="SettingsForm">
				<div>
					<label>Recording framerate:</label>
					<input ref={framerateRef} type="number" defaultValue="25" />
				</div>
				<div>
					<label>Recording resolution:</label>
					<select ref={resolutionDropdownRef}>
						<option value="1280">1280x720</option>
						<option value="1024">1024x768</option>
						<option value="852">852x480</option>
					</select>
				</div>
				<div>
					<label>Window size at the start: </label>
					<label>width</label>
					<input
						ref={windowWidthRef}
						type="number"
						defaultValue={1024}
					/>
					<label>height</label>
					<input
						ref={windowHeightRef}
						type="number"
						defaultValue={728}
					/>
				</div>
				<div>
					<label>Delete webm file after conversion:</label>
					<input ref={deleteFileCheckboxRef} type="checkbox" />
				</div>
				<div>
					<label>Show app name on homepage:</label>
					<input ref={appNameVisibleRef} type="checkbox" />
				</div>
				<div>
					<label>Show menu bar:</label>
					<input ref={menuBarVisibleRef} type="checkbox" />
				</div>
				<Button
					className="CenterElement"
					onClick={saveSettings}
					text="Save"
				/>
			</form>
		</div>
	);
};

export default Settings;
