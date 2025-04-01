import { Request, Response } from "express";

// http://API_HOST/api/n8n/webhook
export function httpAnyN8NWebhookTunnel(webhook_path: string): (request: Request, response: Response) => Promise<any> {
    return async function (request: Request, response: Response) {
       // extract url after /tunnel/n8n/webhook
       const reqBody = request.body;
       console.log("====  request  ====");
       console.log(request.originalUrl);
       console.log(webhook_path, request.params[0]);
       console.log(request.params[0].split("/" + webhook_path)[1]);
       const webhook_url = `${process.env.N8N_PROTOCOL}://${process.env.N8N_HOST}:${process.env.N8N_PORT}/${webhook_path}/${request.params[0]}`;
       console.log(webhook_url);
       console.log("========================");
       const n8n_response = await fetch(webhook_url, {
        method: request.method,
        body: !["GET", "HEAD"].includes(request.method) ? reqBody : undefined,
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
