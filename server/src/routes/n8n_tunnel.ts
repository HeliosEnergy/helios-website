import { Request, Response } from "express";

export function httpAnyN8NWebhookTunnel(webhook_path: string): (request: Request, response: Response) => Promise<any> {
    return async function (request: Request, response: Response) {
       // extract url after /tunnel/n8n/webhook
       const reqBody = request.body;
       console.log("====  request  ====");
       console.log(request.originalUrl);
       console.log(webhook_path, request.params[0]);
       console.log(request.params[0].split("/" + webhook_path)[1]);

       // Build query string if present
       const queryString = request.url.includes('?') ? request.url.substring(request.url.indexOf('?')) : '';
       const webhook_url = `${process.env.N8N_PROTOCOL}://${process.env.N8N_HOST}:${process.env.N8N_PORT}/${webhook_path}/${request.params[0]}${queryString}`;
       console.log(webhook_url);
       console.log("Content-Type", request.headers["content-type"]);
       console.log("========================");


       let fixedBody = reqBody;
       if (typeof fixedBody === "object") {
        fixedBody = JSON.stringify(fixedBody);
       }

       const n8n_response = await fetch(webhook_url, {
        method: request.method,
        body: !["GET", "HEAD"].includes(request.method) ? fixedBody : undefined,
        headers: [
            ["Content-Type", request.headers["content-type"] || "application/json"],
            ["Authorization", request.headers["authorization"] || ""]
        ]
       });

       console.log("====  n8n_response  ====");
       console.log(n8n_response.status);
       console.log(n8n_response.statusText);
       console.log(n8n_response.headers);
       console.log(n8n_response.body);
       console.log("========================");
       
       const body = await n8n_response.text();
       return response.status(n8n_response.status).send(body);
    }
}

export function httpAnyN8NClientRedirect(): (request: Request, response: Response) => Promise<any> {
    return async function (request: Request, response: Response) {
       const reqBody = request.body;
       console.log("====  request  ====");
       console.log(request.originalUrl);
       console.log("Content-Type", request.headers["content-type"]);
       console.log("Query Params:", request.query);
       console.log("========================");
       
       // Preserve all query parameters exactly as received
       const queryParams = new URLSearchParams();
       for (const [key, value] of Object.entries(request.query)) {
           if (typeof value === 'string') {
               queryParams.append(key, value);
           } else if (Array.isArray(value)) {
               value.forEach((v) => {
                   if (v !== null && v !== undefined) {
                       queryParams.append(key, v.toString());
                   }
               });
           }
       }
       
       const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
       const clientRedirectURL = `${process.env.N8N_PROTOCOL}://${process.env.N8N_HOST}:${process.env.N8N_PORT}/rest/oauth2-credential/callback${queryString}`;
       console.log("Forwarding to:", clientRedirectURL);

       let fixedBody = reqBody;
       if (typeof fixedBody === "object") {
        fixedBody = JSON.stringify(fixedBody);
       }

       // Preserve all original headers
       const headers = new Headers();
       for (const [key, value] of Object.entries(request.headers)) {
           if (value) headers.append(key, value.toString());
       }

       const n8n_response = await fetch(clientRedirectURL, {
        method: request.method,
        body: !["GET", "HEAD"].includes(request.method) ? fixedBody : undefined,
        headers: headers
       });

       console.log("====  n8n_response  ====");
       console.log(n8n_response.status);
       console.log(n8n_response.statusText);
       console.log(n8n_response.headers);
       console.log(n8n_response.body);
       console.log("========================");
       
       const body = await n8n_response.text();
       return response.status(n8n_response.status).send(body);
    }
}
