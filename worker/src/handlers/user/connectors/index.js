// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { handler as BuildConnectorURI } from "./buildConnectorAuthUri";
import { handler as LinkConnector } from "./linkConnector";
import { handler as RemoveConnector } from "./removeConnector";

export const ConnectorRouter = Router({ base: '/api/v2/me/connectors' })

ConnectorRouter
	.post('/build-uri/:connector', BuildConnectorURI)
  .post("/link/:connector", LinkConnector)
	.post("/remove/:connector",RemoveConnector )
