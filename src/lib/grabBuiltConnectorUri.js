import grabConnectorIds from "./grabConnectorIds";

export default async (env, accessToken, uriParams, connectorType) => {
	const connectorResponse = await grabConnectorIds(env, accessToken);
	const connectorID = connectorResponse.find(item => item.target.toLowerCase() === connectorType);
	const url = `${env.LOGTO_DOMAIN}/api/connectors/${connectorID.id}/authorization-uri`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify(uriParams);
	const response = await fetch(url, { method: 'POST', headers, body });
	if (!response.ok) {
		throw { message: 'Failed to access resource - ERR 29034', status: response.status };
	}
	return response;
}
