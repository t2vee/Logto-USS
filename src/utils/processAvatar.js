export default async (env, imageData) => {
	const url = `${env.AVATAR_API}/avatar-service/v1/avatar/preprocess`;
	const uploadFormData = new FormData();
	uploadFormData.append('file', imageData);
	const response = await fetch(url, {
		method: 'POST',
		body: uploadFormData
	});
	if (!response.ok) {
		if (response.status === 406) {
			console.warn('Unsupported File Type');
			return false;
		}
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - Trace ID: 659347', status: response.status };
	}
	const data = await response.formData();
	return data ? data.get('image') : false;
}
