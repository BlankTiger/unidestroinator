import settings from 'electron-settings';

export default async function settingsDefault() {
	if (!(await settings.has('windowDetails'))) {
		await settings.set('windowDetails', {
			width: 1024,
			height: 800,
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
}
