import { Request, Response } from "express";

// http://API_HOST/api/n8n/webhook
export function httpAnyN8NWebhookTunnel(): (request: Request, response: Response) => Promise<any> {
    return async function (request: Request, response: Response) {
       // extract url after /tunnel/n8n/webhook
       console.log(request.url);
       const url = request.url.split("/api/n8n/webhook")[1];
       const n8n_response = await fetch(`${process.env.N8N_HOST}/webhook/${url}`, {
        method: request.method,
        body: request.body,
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
