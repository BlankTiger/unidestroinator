import settings from 'electron-settings';

export default async function settingsDefault() {
	if (
		!(await settings.has('windowDetails')) &&
		(await settings.get('windowDetails.height')) !== 500
	) {
		await settings.set('windowDetails', {
			width: 800,
			height: 600,
			appNameOnHomepage: false,
		});
	}

	if (
		!(await settings.has('delete')) &&
		(await settings.get('delete')) !== null
	) {
		await settings.set('delete', {
			onConverted: false,
		});
	}

	if (
		!(await settings.has('recordingResolution')) &&
		(await settings.get('recordingResolution')) !== null
	) {
		await settings.set('recordingResolution', {
			index: 1,
		});
	}
}
