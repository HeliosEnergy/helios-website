import OpenAI from 'openai';
import { GoogleGenAI } from "@google/genai";


console.log("OpenAI base url", process.env['OPENAI_BASE_URL']);
const client = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'] == "" ? undefined : process.env['OPENAI_API_KEY'],
	baseURL: process.env['OPENAI_BASE_URL'] == "" ? undefined : process.env['OPENAI_BASE_URL'],
	defaultHeaders: {
		'Content-Type': 'application/json'
	}
});

const gemini = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });



export async function extractJSONContents(content: string): Promise<string[]> {
	const jsonRegex = /```(?:json)?\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```/g;
	const matches: string[] = [];
	
	let match;
	while ((match = jsonRegex.exec(content)) !== null) {
		//console.log("match", match);
		try {
			const jsonContent = JSON.parse(match[1]);
			matches.push(jsonContent);
		} catch (e) {
			console.warn('Failed to parse JSON content:', e);
			const fixedJSON = await fixJSONFormat(match[1]);
			console.log('Fixed JSON:', fixedJSON);
			try {
				const jsonContent = JSON.parse(fixedJSON);
				matches.push(jsonContent);
			} catch (e) {
				console.warn('Failed to parse *FIXED* JSON content:', e);
			}
		}
	}
	
	return matches;
}

export async function simpleResponse(prompt: string) {
	const chatCompletion = await client.chat.completions.create({
		messages: [{ role: 'user', content: prompt }],
		model: process.env['SERVED_MODEL_NAME'] || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'
	});
	return chatCompletion.choices[0].message.content;
}

export async function extractWebData(prompt: string, webContent: string) {
/* 	const chatCompletion = await client.chat.completions.create({
		messages: [
			{ role: 'user', content: `

			`.trim() + webContent + "\n\n" + prompt },
		],
		model: process.env['SERVED_MODEL_NAME'] || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', // Update this to your actual model
	});
	return chatCompletion.choices[0].message.content || ""; */
	const response = await gemini.models.generateContent({
		model: "gemini-2.0-flash",
		contents: prompt + "\n\n" + webContent,
	});
	console.log("response", response);
	return response.text!;
}

export async function fixJSONFormat(json: string) {
	const chatCompletion = await client.chat.completions.create({
		messages: [
			{ role: 'system', content: `
You are a helpful assistant that fixes JSON format.
You will be given a JSON string, and you need to fix the format of the JSON string.
			`.trim() },
			{ role: 'user', content: "Fix this JSON: \`\`\`json\n" + json + "\n\`\`\`" }],
		model: process.env['SERVED_MODEL_NAME'] || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'
	});
	return chatCompletion.choices[0].message.content || "";
}