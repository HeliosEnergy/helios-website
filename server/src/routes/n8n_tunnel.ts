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
       console.log("====  OAuth Redirect Request  ====");
       console.log("Full URL:", request.protocol + '://' + request.get('host') + request.originalUrl);
       console.log("Query:", JSON.stringify(request.query));
       
       // Don't modify or reconstruct the query string - use it exactly as received
       const originalQueryString = request.originalUrl.includes('?') 
           ? request.originalUrl.substring(request.originalUrl.indexOf('?')) 
           : '';
           
       const clientRedirectURL = `${process.env.N8N_PROTOCOL}://${process.env.N8N_HOST}:${process.env.N8N_PORT}/rest/oauth2-credential/callback${originalQueryString}`;
       console.log("Redirecting to:", clientRedirectURL);

       // For OAuth flows, preserve the exact request method and parameters
       const n8n_response = await fetch(clientRedirectURL, {
        method: request.method,
        headers: {
            // Only pass minimal required headers
            'Accept': request.headers.accept || '*/*',
            'User-Agent': request.headers['user-agent'] || '',
            'Content-Type': request.headers['content-type'] || 'application/json'
        },
        // Let fetch handle redirects automatically
        redirect: 'follow'
       });
       
       console.log(`N8N Response: ${n8n_response.status} ${n8n_response.statusText}`);
       
       const body = await n8n_response.text();
       return response.status(n8n_response.status).send(body);
    }
}
