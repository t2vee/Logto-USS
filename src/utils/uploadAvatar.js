import crypto from "node:crypto";

export default async function (env, accessToken, imageData, userId) {
	const url = `${env.LOGTO_DOMAIN}/api/user-assets`;
	const uploadFormData = new FormData();
	uploadFormData.append('file', imageData);
	uploadFormData.set("file", imageData, `${crypto.randomUUID()}__${userId}__${Date.now()}.${imageData.name.split('.').pop()}`);
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
	};
	const response = await fetch(url,
		{
			method: 'POST',
			headers,
			body: uploadFormData
		});
	if (!response.ok) {
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - ERR 023484', status: response.status };
	}
	return await response.json();
}
