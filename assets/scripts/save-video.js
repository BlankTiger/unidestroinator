const { writeFile, readFile, unlink } = require('fs').promises;
const webmToMp4 = require('./webm-to-mp4');

onmessage = async (e) => {
	const blob = new Blob(e.data[1], {
		type: 'video/webm; codecs=H264',
	});

	const buffer = Buffer.from(await blob.arrayBuffer());

	if (e.data[0] !== '') {
		await writeFile(e.data[0], Buffer.from(buffer))
			.then(async () => {
				await writeFile(
					`${e.data[0].replace('.webm', '_correct.mp4')}`,
					Buffer.from(webmToMp4(await readFile(e.data[0])))
				);
				return 0;
			})
			.then(async () => {
				if (e.data[2]) {
					await unlink(e.data[0]);
				}
				return 0;
			});
	}
	postMessage('done');
};
