import settings from 'electron-settings';
import settingsDefault from './settings-default';

export default async function loadSettings() {
	await settingsDefault();
	const appNameOnHomepage = ((await settings.get(
		'windowDetails.appNameOnHomepage'
	)) as unknown) as boolean;

	const deleteFileOnConverted = ((await settings.get(
		'delete.onConverted'
	)) as unknown) as boolean;

	return new Promise<{
		appNameOnHomepage: boolean;
		deleteFileOnConverted: boolean;
	}>((resolve) => {
		resolve({ appNameOnHomepage, deleteFileOnConverted });
	});
}
