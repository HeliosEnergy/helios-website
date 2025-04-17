import { notionGetCompanies } from "../data/notion_databases";
import { Request, Response } from "express";

export async function getCompanies(request: Request, response: Response) {
	try {
		const companies = await notionGetCompanies({
			
		});
		response.json(companies);
	} catch (error) {
		console.error('Failed to get companies:', error);
		response.status(500).json({ error: 'Failed to get companies' });
	}
}
