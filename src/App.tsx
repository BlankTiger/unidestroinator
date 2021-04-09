/* eslint-disable global-require */
import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import Header from './components/Header';
import Button from './components/Button';

const App = () => {
	const [sourceName, setSourceName] = useState('Select video source');
	const [recordBtnText, setRecordBtnText] = useState('Record');
	const [isRecording, setIsRecording] = useState(true);
	const [recorder, setRecorder] = useState<MediaRecorder>();
	const videoRef = useRef<HTMLVideoElement>(null);

	const { desktopCapturer, remote } = require('electron');
	const { writeFile } = require('fs').promises;
	const { dialog, Menu } = remote;
	const webmToMp4 = require('webm-to-mp4');
	let mediaRecorder: MediaRecorder;
	let recordedChunks: BlobPart[] = [];

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
			defaultPath: `vid-${Date.now()}.mp4`,
			filters: [{ name: 'Movies', extensions: ['mp4'] }],
		});

		if (filePath !== '') {
			await writeFile(filePath, Buffer.from(webmToMp4(buffer)));
		}

		recordedChunks = [];
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
						},
					},
				};

				const stream = await navigator.mediaDevices.getUserMedia(
					constraints as MediaStreamConstraints
				);
				if (
					videoRef !== undefined &&
					videoRef.current !== undefined &&
					videoRef !== null &&
					videoRef.current !== null
				) {
					videoRef.current.srcObject = stream;
					videoRef.current.play();
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
			<Header />
			<div className="App">
				<video ref={videoRef} id="videoPreview" muted />
			</div>
			<h5 className="App">{sourceName}</h5>
			<div className="App">
				<Button
					id="recordBtn"
					text={recordBtnText}
					onClick={onRecordClick}
				/>
				<Button id="settingsBtn" text="Settings" />
			</div>
			<div className="App">
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
		<Router>
			<Switch>
				<Route path="/" component={App} />
			</Switch>
		</Router>
	);
}
