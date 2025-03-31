import * as repl from 'repl';
import { Browser, Page } from 'puppeteer';
import { prettyPrint } from 'html';

/* global pause */
export let paused = false;
export function setPaused(p: boolean) {
	paused = p;
}
export function getPaused() {
	return paused;
}


export async function cleanAndGetContent(page: Page, selector: string) {
	const content = await page.$eval(selector, (el) => {
		el.querySelectorAll('img').forEach((img: any) => img.remove());
		el.querySelectorAll('svg').forEach((svg: any) => svg.remove());
		el.querySelectorAll('style').forEach((style: any) => style.remove());
		el.querySelectorAll('script').forEach((script: any) => script.remove());

		el.querySelectorAll('*').forEach((element: any) => {
			element.removeAttribute('style');
			element.removeAttribute('href');
			
			// Clean up class names
			const classAttr = element.getAttribute('class');
			if (classAttr) {
				const classes = classAttr.split(' ');
				const filteredClasses = classes.filter((cls: string) => !cls.startsWith('css-'));
				if (filteredClasses.length > 0) {
					element.setAttribute('class', filteredClasses.join(' '));
				} else {
					element.removeAttribute('class');
				}
			}
		});
		
		return el.innerHTML;
	});

	// Remove HTML comments
	const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
	
	return prettyPrint(cleanContent, {
		indent_size: 1,
		indent_char: '\t',
	});
}

export function multilineTrim(content: string) {
	const lines = content.split('\n');
	const trimmedLines = lines.map(line => line.trim());
	return trimmedLines.join('\n');
}

export type ScriptArgs = {
	repl?: repl.REPLServer
	browser: Browser
	page: Page
}

export async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}