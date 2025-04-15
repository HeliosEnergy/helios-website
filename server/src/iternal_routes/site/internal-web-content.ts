import { Request, Response } from 'express';
import path from 'path';

export function internSiteRoot(_: Request, response: Response) {
    return response.sendFile(path.join(__dirname, "../../../html/index.html"));
}

export function internSiteAssets(request: Request, response: Response) {
    // intentionally parse the path to get the file name
    const fileName = request.originalUrl.split("/assets/")[1];
    return response.sendFile(path.join(__dirname, "../../../html/assets", fileName));
}



