const videoElement = document.querySelector('video');
const recordBtn = document.getElementById('recordBtn');
const settingsBtn = document.getElementById('settingsBtn');
const selectSourceBtn = document.getElementById('selectSourceBtn');

const { desktopCapturer, remote } = require('electron');

const { Menu } = remote;

async function getVideoSources() {
	selectSourceBtn.onClick = getVideoSources;
	const inputSources = await desktopCapturer.getSources({
		types: ['window', 'screen'],
	});

	const videoOptionsMenu = Menu.buildFromTemplate(
		inputSources.map((source) => {
			return {
				label: source.name,
				click: () => selectSourceBtn(source),
			};
		})
	);

	videoOptionsMenu.popup();
}
