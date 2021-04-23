/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useEffect } from 'react';
import '../App.global.css';
import { Link } from 'react-router-dom';
import settings from 'electron-settings';
import Button from './Button';
import Header from './Header';

const Settings = () => {
	const deleteFileCheckboxRef = useRef<HTMLInputElement>(null);
	const resolutionDropdownRef = useRef<HTMLSelectElement>(null);
	const windowWidthRef = useRef<HTMLInputElement>(null);
	const windowHeightRef = useRef<HTMLInputElement>(null);
	const appNameVisibleRef = useRef<HTMLInputElement>(null);

	const loadSettings = async () => {
		if (
			deleteFileCheckboxRef.current !== null &&
			resolutionDropdownRef.current !== null &&
			windowWidthRef.current !== null &&
			windowHeightRef.current !== null &&
			appNameVisibleRef.current !== null
		) {
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
		}
	};

	const saveSettings = async () => {
		if (
			deleteFileCheckboxRef.current !== null &&
			resolutionDropdownRef.current !== null &&
			windowWidthRef.current !== null &&
			windowHeightRef.current !== null &&
			appNameVisibleRef.current !== null
		) {
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
			});

			await settings.set('delete', {
				onConverted: deleteFileCheckboxRef.current.checked,
			});

			const selectedResolution = await settings.get(
				'recordingResolution.value'
			);
			const windowWidth = await settings.get('windowDetails.width');
			const windowHeight = await settings.get('windowDetails.height');
			const deleteOnCoverted = await settings.get('delete.onConverted');
			const showAppName = await settings.get(
				'windowDetails.appNameOnHomepage'
			);

			console.log(
				`${selectedResolution}, ${windowWidth}x${windowHeight}, ${deleteOnCoverted}, ${showAppName}`
			);
		}
	};

	useEffect(() => {
		loadSettings();
	});
	return (
		<div className="SettingsPage">
			<div className="CenterElement">
				<Header text="Settings" />
			</div>
			<hr />
			<form id="SettingsForm">
				<div>
					<label>Recording resolution:</label>
					<select ref={resolutionDropdownRef}>
						<option value="1280">1280x720</option>
						<option value="1024">1024x768</option>
						<option value="852">852x480</option>
					</select>
				</div>
				<div>
					<label>Window size at the start of the program</label>
				</div>
				<div>
					<label>Width:</label>
					<input
						ref={windowWidthRef}
						type="number"
						defaultValue={1024}
					/>
				</div>
				<div>
					<label>Height:</label>
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
				<div id="CenterForm">
					<Button
						id="CenterFormBtn"
						onClick={saveSettings}
						text="Save"
					/>
					<Link id="CenterFormBtn" to="/">
						<Button className="linkBtn" text="Back" />
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Settings;
