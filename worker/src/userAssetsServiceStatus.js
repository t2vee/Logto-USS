// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


/*
{
"status":"ready",
"allowUploadMimeTypes":
["image/jpeg",
"image/png",
"image/gif",
"image/vnd.microsoft.icon",
"image/x-icon",
"image/svg+xml",
"image/tiff",
"image/webp",
"image/bmp"],
"maxUploadFileSize":8388608}
*/

export default async (request, env) => {
		const url = `${env.LOGTO_DOMAIN}/api/user-assets/service-status`;
		const headers = {
			'Authorization': `Bearer ${request.accesstoken}`,
			'Content-Type': 'application/json',
		};
		const response = await fetch(url, { method: 'GET', headers });
		if (!response.ok) {
			console.error('Error accessing resource:', response.statusText);
			throw { message: 'Failed to access resource - ERR 845679', status: response.status };
		}
		return response;
}
