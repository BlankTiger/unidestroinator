/* eslint-disable global-require */
import React, { useRef, useState, useEffect } from 'react';
import { Switch, Route, HashRouter, Link } from 'react-router-dom';

import './App.global.css';
import settings from 'electron-settings';
import Header from './components/Header';
import Button from './components/Button';
import Settings from './Settings';

const App = () => {
	const [sourceName, setSourceName] = useState('Select video source');
	const [recordBtnText, setRecordBtnText] = useState('Record');
	const [isRecording, setIsRecording] = useState(true);
	const [recorder, setRecorder] = useState<MediaRecorder>();
	const [appNameVisible, setAppNameVisible] = useState(false);
	const [deleteFileOnConverted, setDeleteFileOnConverted] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const { desktopCapturer, remote } = require('electron');
	const { writeFile, readFile, unlink } = require('fs').promises;
	const { dialog, Menu } = remote;
	const webmToMp4 = require('webm-to-mp4');
	let mediaRecorder: MediaRecorder;
	let recordedChunks: BlobPart[] = [];

	const loadSettings = async () => {
		setAppNameVisible(
			((await settings.get(
				'windowDetails.appNameOnHomepage'
			)) as unknown) as boolean
		);

		setDeleteFileOnConverted(
			((await settings.get('delete.onConverted')) as unknown) as boolean
		);
	};

	useEffect(() => {
		loadSettings();
	});

	const handleDataAvailable = (e: { data: BlobPart }) => {
		recordedChunks.push(e.data);
	};

	const handleStop = async () => {
		const blob = new Blob(recordedChunks, {
			type: 'video/webm; codecs=H264',
		});

		const buffer = Buffer.from(await blob.arrayBuffer());

		const { filePath } = await dialog.showSaveDialog({
			buttonLabel: 'Save video',
			defaultPath: `vid-${Date.now()}.webm`,
			filters: [{ name: 'Movies', extensions: ['webm'] }],
		});

		if (filePath !== '') {
			await writeFile(filePath, Buffer.from(buffer))
				.then(async () => {
					await writeFile(
						`${filePath.replace('.webm', '_correct.mp4')}`,
						Buffer.from(webmToMp4(await readFile(filePath)))
					);
					return 0;
				})
				.then(async () => {
					if (deleteFileOnConverted) {
						await unlink(filePath);
					}
					recordedChunks = [];
					return 0;
				});
		}
	};

	// function that allows the user to select video source
	const selectVideoSource = async () => {
		async function getVideoSources() {
			const inputSources = await desktopCapturer.getSources({
				types: ['window', 'screen'],
			});

			async function selectSource(source: { name: string; id: string }) {
				setSourceName(source.name);
				const constraints = {
					audio: {
						mandatory: {
							chromeMediaSource: 'desktop' as MediaTrackConstraints,
						},
					},
					video: {
						mandatory: {
							chromeMediaSource: 'desktop' as MediaTrackConstraints,
							chromeMediaSourceId: source.id,
							maxHeight: 720,
							maxWidth: 1280,
						},
						optional: [
							{ minWidth: 320 },
							{ minWidth: 640 },
							{ minWidth: 960 },
							{ minWidth: 1024 },
							{ minWidth: 1280 },
						],
					},
				};

				const stream = await navigator.mediaDevices.getUserMedia(
					constraints as MediaStreamConstraints
				);

				if (
					videoRef !== undefined &&
					videoRef.current !== undefined &&
					videoRef !== null &&
					videoRef.current !== null &&
					videoRef.current.play() !== undefined
				) {
					videoRef.current.srcObject = stream;
					videoRef.current.oncanplay = videoRef.current.play;
				}

				const options = { mimeType: 'video/webm; codecs=H264' };
				mediaRecorder = new MediaRecorder(stream, options);

				mediaRecorder.ondataavailable = handleDataAvailable;
				mediaRecorder.onstop = handleStop;
				setRecorder(mediaRecorder);
			}

			const videoOptionsMenu = Menu.buildFromTemplate(
				inputSources.map((source: { name: string; id: string }) => {
					return {
						label: source.name,
						click: () => selectSource(source),
					};
				})
			);

			videoOptionsMenu.popup();
		}

		getVideoSources();
	};

	const onRecordClick = () => {
		setRecordBtnText(isRecording ? 'Stop' : 'Record');
		setIsRecording(!isRecording);
		if (isRecording && recorder !== undefined) {
			recorder.start(50);
		} else if (recorder !== undefined) {
			recorder.stop();
		}
	};

	return (
		<>
			{appNameVisible ? <Header text="Unidestroinator" /> : null}
			<div className="CenterElement">
				<video ref={videoRef} id="videoPreview" muted />
			</div>
			<h5 className="CenterElement">{sourceName}</h5>
			<div className="CenterElement">
				<Button
					id="recordBtn"
					text={recordBtnText}
					onClick={onRecordClick}
				/>
				<Link to="/settings">
					<Button
						id="settingsBtn"
						className="linkBtn"
						text="Settings"
					/>
				</Link>
			</div>
			<div className="CenterElement">
				<Button
					id="selectSourceBtn"
					text="Select video source"
					onClick={selectVideoSource}
				/>
			</div>
		</>
	);
};

export default function Application() {
	return (
		<HashRouter>
			<Switch>
				<Route path="/settings" component={Settings} />
				<Route path="/" component={App} />
			</Switch>
		</HashRouter>
	);
}
