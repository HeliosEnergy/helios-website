import { Client } from "@notionhq/client";



export function notionClient() {
	if (!process.env.NOTION_API_KEY) {
		throw new Error("NOTION_API_KEY is not set");
	}
	return new Client({ auth: process.env.NOTION_API_KEY });
}