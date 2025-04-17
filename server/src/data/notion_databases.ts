import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notionClient } from "./notion";




export type NotionContact = {
	id: string;
	name: string;
}

export type NotionContactHistory = {
	id: string;
	contactId: string;
	date: string;
	notes: string;
	contact?: NotionContact;
}




type NotionCompanyPageRaw = {
	object: 'page';
	id: string;
	created_time: string;
	last_edited_time: string;
	created_by: {
		object: 'user';
		id: string;
	};
	last_edited_by: {
		object: 'user';
		id: string;
	};
	cover: null;
	icon: null;
	parent: {
		type: 'database_id';
		database_id: string;
	};
	archived: boolean;
	in_trash: boolean;
	properties: {
		Priority: {
			id: string;
			type: 'select';
			select: null;
		};
		Status: {
			id: string;
			type: 'status';
			status: {
				id: string;
				name: string;
				color: string;
			};
		};
		'Account Owner': {
			id: string;
			type: 'people';
			people: [];
		};
		Relevancy: {
			id: string;
			type: 'number';
			number: number;
		};
		'Expected Close': {
			id: string;
			type: 'date';
			date: null;
		};
		'📜 Contact History': {
			id: string;
			type: 'relation';
			relation: [];
			has_more: boolean;
		};
		Difficulty: {
			id: string;
			type: 'number';
			number: number;
		};
		Added: {
			id: string;
			type: 'created_time';
			created_time: string;
		};
		Text: {
			id: string;
			type: 'rich_text';
			rich_text: [];
		};
		'Compliance Frameworks': {
			id: string;
			type: 'multi_select';
			multi_select: [];
		};
		Acceleator: {
			id: string;
			type: 'select';
			select: {
				id: string;
				name: string;
				color: string;
			};
		};
		'Estimated Valuation': {
			id: string;
			type: 'number';
			number: null;
		};
		'Contacted button': {
			id: string;
			type: 'button';
			button: {};
		};
		Contacts: {
			id: string;
			type: 'relation';
			relation: [];
			has_more: boolean;
		};
		Company: {
			id: string;
			type: 'title';
			title: Array<{
				type: 'text';
				text: {
					content: string;
					link: null;
				};
				annotations: {
					bold: boolean;
					italic: boolean;
					strikethrough: boolean;
					underline: boolean;
					code: boolean;
					color: string;
				};
				plain_text: string;
				href: null;
			}>;
		};
		'Last Contact': {
			id: string;
			type: 'date';
			date: null;
		};
	};
	url: string;
	public_url: null;
}


export type NotionCompany = {
	id: string;
	name: string;
	priority: string;
	status: string;
	relevancy: number;
	expectedClose: string;
	contactHistory: NotionContactHistory[];
	difficulty: number;
	added: string;
	text: string;
	complianceFrameworks: string[];
	acceleator: string;
	estimatedValuation: number;
	contactedButton: boolean;
	contactIds: string[];
	contacts?: {[id: string]: NotionContact};
	lastContact: string;
	accountOwner: string;
}


export type GetCompanyQuery = {

}

export async function notionGetCompanies(options: GetCompanyQuery): Promise<NotionCompany[]> {
	const notion = notionClient();
	const databaseId = '1d3d8fcace7281a78cf7e704f94548f2';

	const response = await notion.databases.query({
		database_id: databaseId,
	});

	return (response.results as PageObjectResponse[]).map((result) => {
		const page = result as NotionCompanyPageRaw;
		return {
			id: page.id,
			name: page.properties.Company.title[0].plain_text,
		} as NotionCompany;
	});

}
