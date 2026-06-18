export interface Env {
	SLACK_WEBHOOK_URL?: string;
	SLACK_BOT_TOKEN?: string;
	SLACK_SIGNING_SECRET?: string;
	SLACK_CHANNEL_ID?: string;
	AWS_REGION?: string;
	AWS_SQS_QUEUE_URL?: string;
	AWS_ACCESS_KEY_ID?: string;
	AWS_SECRET_ACCESS_KEY?: string;
	AWS_SESSION_TOKEN?: string;
}

type ServiceKey =
	| "clusters"
	| "baremetal"
	| "coloc"
	| "inference"
	| "training"
	| "startup_program"
	| "partnership"
	| "general";

interface ContactFormData {
	name?: string;
	email?: string;
	company?: string;
	message?: string;
	inquiryType?: string;
	clusterDetails?: {
		types?: string;
		unit?: string;
		nodeCountMin?: number;
		nodeCountMax?: number;
		gpuCountMin?: number;
		gpuCountMax?: number;
	};
	colocationDetails?: {
		types?: string;
		[key: string]: unknown;
	};
	inferenceDetails?: {
		models?: Array<{
			name?: string;
			category?: string;
			estimation?: string;
		}>;
	};
	partnershipDetails?: string;
	startupApplication?: {
		companyName?: string;
		website?: string;
		fundingStage?: string;
		teamSize?: string;
		useCase?: string;
		monthlyUsage?: string;
		pitchDeck?: string;
		[key: string]: unknown;
	};
	gpuDetails?: {
		model?: string;
		count?: number;
		memory?: string;
		specs?: string;
		vram?: string;
		hoursPerMonth?: number;
		reservationPeriod?: string;
		discount?: number;
		totalCost?: number;
		baseCost?: number;
		discountAmount?: number;
		effectiveRate?: number;
	};
	[key: string]: unknown;
}

interface LeadEvent {
	event_id: string;
	type: "lead.created";
	created_at: string;
	lead: {
		lead_id: string;
		source: "helios-website";
		name: string | null;
		email: string;
		company: string | null;
		service_key: ServiceKey;
		inquiry_type: string;
		message: string | null;
		details: Record<string, unknown>;
	};
	slack?: {
		channel_id?: string;
		message_ts?: string;
		thread_ts?: string;
	};
}

interface SlackPostResult {
	ok: boolean;
	channel?: string;
	ts?: string;
	error?: string;
}

interface SlackActionEvent {
	event_id: string;
	type: "email.approve" | "email.edit_approve" | "email.reject" | "email.regenerate";
	created_at: string;
	lead_id: string;
	draft_id?: number;
	subject?: string;
	body_text?: string;
	slack: {
		user_id?: string;
		channel_id?: string;
		message_ts?: string;
		thread_ts?: string;
		response_url?: string;
	};
}

const jsonHeaders = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
};

const textEncoder = new TextEncoder();

const serviceAliases: Record<string, ServiceKey> = {
	cluster: "clusters",
	clusters: "clusters",
	"gpu cluster": "clusters",
	"gpu clusters": "clusters",
	baremetal: "baremetal",
	"bare metal": "baremetal",
	coloc: "coloc",
	colocation: "coloc",
	inference: "inference",
	training: "training",
	partnership: "partnership",
	partner: "partnership",
	"startup program application": "startup_program",
	"startup program": "startup_program",
	startup: "startup_program",
	others: "general",
	other: "general",
	general: "general",
};

const serviceLabels: Record<ServiceKey, string> = {
	clusters: "Clusters",
	baremetal: "Baremetal",
	coloc: "Colocation",
	inference: "Inference",
	training: "Training",
	startup_program: "Startup Program",
	partnership: "Partnership",
	general: "General",
};

const serviceEmoji: Record<ServiceKey, string> = {
	clusters: "🖥️",
	baremetal: "🔧",
	coloc: "🏗️",
	inference: "🤖",
	training: "⚙️",
	startup_program: "🚀",
	partnership: "🤝",
	general: "💬",
};

function responseJson(body: unknown, init: ResponseInit = {}) {
	return new Response(JSON.stringify(body), {
		...init,
		headers: { ...jsonHeaders, ...(init.headers || {}) },
	});
}

function handleOptions(request: Request) {
	const headers = request.headers;
	if (
		headers.get("Origin") !== null &&
		headers.get("Access-Control-Request-Method") !== null &&
		headers.get("Access-Control-Request-Headers") !== null
	) {
		return new Response(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	}
	return new Response(null, { headers: { Allow: "POST, OPTIONS" } });
}

function cleanText(value: unknown): string | null {
	if (typeof value !== "string") {
		return null;
	}
	const trimmed = value.trim();
	if (!trimmed || trimmed.toLowerCase() === "not specified" || trimmed.toLowerCase() === "no message provided") {
		return null;
	}
	return trimmed;
}

export function normalizeServiceKey(inquiryType?: string): ServiceKey {
	const normalized = (inquiryType || "").trim().toLowerCase();
	return serviceAliases[normalized] || "general";
}

function compactRecord(value: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => {
			if (entry === null || entry === undefined) {
				return false;
			}
			if (typeof entry === "string" && !entry.trim()) {
				return false;
			}
			if (Array.isArray(entry) && entry.length === 0) {
				return false;
			}
			if (typeof entry === "object" && !Array.isArray(entry) && Object.keys(entry as object).length === 0) {
				return false;
			}
			return true;
		}),
	);
}

function detailsForPayload(formData: ContactFormData, serviceKey: ServiceKey): Record<string, unknown> {
	const details: Record<string, unknown> = {};
	if (formData.clusterDetails) {
		details.cluster = compactRecord({
			types: cleanText(formData.clusterDetails.types),
			unit: cleanText(formData.clusterDetails.unit),
			node_count_min: formData.clusterDetails.nodeCountMin,
			node_count_max: formData.clusterDetails.nodeCountMax,
			gpu_count_min: formData.clusterDetails.gpuCountMin,
			gpu_count_max: formData.clusterDetails.gpuCountMax,
		});
	}
	if (formData.colocationDetails) {
		details.colocation = compactRecord({
			...formData.colocationDetails,
			types: cleanText(formData.colocationDetails.types),
		});
	}
	if (formData.inferenceDetails?.models?.length) {
		details.inference = {
			models: formData.inferenceDetails.models.map((model) =>
				compactRecord({
					name: cleanText(model.name),
					category: cleanText(model.category),
					estimation: cleanText(model.estimation),
				}),
			),
		};
	}
	if (formData.partnershipDetails) {
		details.partnership = { summary: cleanText(formData.partnershipDetails) };
	}
	if (formData.startupApplication) {
		details.startup_application = compactRecord({
			...formData.startupApplication,
			companyName: cleanText(formData.startupApplication.companyName),
			website: cleanText(formData.startupApplication.website),
			fundingStage: cleanText(formData.startupApplication.fundingStage),
			teamSize: cleanText(formData.startupApplication.teamSize),
			useCase: cleanText(formData.startupApplication.useCase),
			monthlyUsage: cleanText(formData.startupApplication.monthlyUsage),
			pitchDeck: cleanText(formData.startupApplication.pitchDeck),
		});
	}
	if (formData.gpuDetails) {
		details.gpu = compactRecord({ ...formData.gpuDetails });
	}
	if (serviceKey === "training" && !details.cluster) {
		details.training = { summary: cleanText(formData.message) };
	}
	return compactRecord(details);
}

export function normalizeLeadEvent(formData: ContactFormData, now = new Date()): LeadEvent {
	const inquiryType = cleanText(formData.inquiryType) || "General";
	const serviceKey = normalizeServiceKey(inquiryType);
	const details = detailsForPayload(formData, serviceKey);
	const email = cleanText(formData.email);
	if (!email) {
		throw new Error("Email is required.");
	}
	return {
		event_id: crypto.randomUUID(),
		type: "lead.created",
		created_at: now.toISOString(),
		lead: {
			lead_id: crypto.randomUUID(),
			source: "helios-website",
			name: cleanText(formData.name),
			email,
			company: cleanText(formData.company) || cleanText(formData.startupApplication?.companyName),
			service_key: serviceKey,
			inquiry_type: inquiryType,
			message: cleanText(formData.message) || cleanText(formData.partnershipDetails),
			details,
		},
	};
}

function field(label: string, value: string | number | null | undefined) {
	return { type: "mrkdwn", text: `*${label}:*\n${value === null || value === undefined || value === "" ? "Not provided" : value}` };
}

function addDetailBlocks(blocks: unknown[], leadEvent: LeadEvent) {
	const { details } = leadEvent.lead;
	if (details.cluster && typeof details.cluster === "object") {
		const cluster = details.cluster as Record<string, unknown>;
		blocks.push({ type: "divider" });
		blocks.push({ type: "section", text: { type: "mrkdwn", text: "*Cluster / Baremetal Requirements*" } });
		blocks.push({
			type: "section",
			fields: [
				field("GPU Types", cluster.types as string),
				field("GPU Range", `${cluster.gpu_count_min || "?"} - ${cluster.gpu_count_max || "?"} GPUs`),
				field("Node Range", cluster.node_count_min && cluster.node_count_max ? `${cluster.node_count_min} - ${cluster.node_count_max}` : null),
				field("Sizing Unit", cluster.unit as string),
			],
		});
	}
	if (details.colocation && typeof details.colocation === "object") {
		const coloc = details.colocation as Record<string, unknown>;
		blocks.push({ type: "divider" });
		blocks.push({ type: "section", text: { type: "mrkdwn", text: "*Colocation Requirements*" } });
		blocks.push({ type: "section", fields: [field("Hardware / GPUs", coloc.types as string)] });
	}
	if (details.inference && typeof details.inference === "object") {
		const models = (details.inference as { models?: Array<Record<string, unknown>> }).models || [];
		if (models.length) {
			blocks.push({ type: "divider" });
			blocks.push({ type: "section", text: { type: "mrkdwn", text: "*Inference Requirements*" } });
			for (const model of models.slice(0, 8)) {
				blocks.push({
					type: "section",
					fields: [field("Model", model.name as string), field("Estimated Usage", model.estimation as string)],
				});
			}
		}
	}
	if (details.startup_application && typeof details.startup_application === "object") {
		const startup = details.startup_application as Record<string, unknown>;
		blocks.push({ type: "divider" });
		blocks.push({ type: "section", text: { type: "mrkdwn", text: "*Startup Application*" } });
		blocks.push({
			type: "section",
			fields: [
				field("Website", startup.website as string),
				field("Funding Stage", startup.fundingStage as string),
				field("Team Size", startup.teamSize as string),
				field("Monthly Usage", startup.monthlyUsage as string),
			],
		});
	}
}

export function buildSlackLeadMessage(leadEvent: LeadEvent) {
	const label = serviceLabels[leadEvent.lead.service_key];
	const emoji = serviceEmoji[leadEvent.lead.service_key];
	const blocks: unknown[] = [
		{ type: "header", text: { type: "plain_text", text: `${emoji} New ${label} Inquiry` } },
		{
			type: "section",
			fields: [
				field("Name", leadEvent.lead.name),
				field("Email", `<mailto:${leadEvent.lead.email}|${leadEvent.lead.email}>`),
				field("Organization", leadEvent.lead.company),
				field("Interest", leadEvent.lead.inquiry_type),
			],
		},
	];
	addDetailBlocks(blocks, leadEvent);
	if (leadEvent.lead.message) {
		blocks.push({ type: "divider" });
		blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Additional Notes:*\n>>>${leadEvent.lead.message}` } });
	}
	blocks.push({
		type: "context",
		elements: [{ type: "plain_text", text: `Lead ID ${leadEvent.lead.lead_id} · Received at ${new Date(leadEvent.created_at).toUTCString()}` }],
	});
	return { text: `New ${label} inquiry from ${leadEvent.lead.email}`, blocks };
}

async function slackApi(method: string, token: string, payload: unknown) {
	const response = await fetch(`https://slack.com/api/${method}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify(payload),
	});
	return response.json() as Promise<Record<string, unknown>>;
}

async function postLeadToSlack(env: Env, leadEvent: LeadEvent): Promise<SlackPostResult> {
	const message = buildSlackLeadMessage(leadEvent);
	if (env.SLACK_BOT_TOKEN && env.SLACK_CHANNEL_ID) {
		const result = await slackApi("chat.postMessage", env.SLACK_BOT_TOKEN, {
			channel: env.SLACK_CHANNEL_ID,
			...message,
		});
		if (result.ok === true) {
			return { ok: true, channel: String(result.channel || env.SLACK_CHANNEL_ID), ts: String(result.ts || "") };
		}
		return { ok: false, error: String(result.error || "slack_api_failed") };
	}
	if (env.SLACK_WEBHOOK_URL) {
		const response = await fetch(env.SLACK_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(message),
		});
		return response.ok ? { ok: true } : { ok: false, error: await response.text() };
	}
	return { ok: false, error: "slack_not_configured" };
}

function byteToHex(byte: number) {
	return byte.toString(16).padStart(2, "0");
}

function toHex(buffer: ArrayBuffer) {
	return [...new Uint8Array(buffer)].map(byteToHex).join("");
}

async function hmac(key: ArrayBuffer | Uint8Array, data: string) {
	const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
	return crypto.subtle.sign("HMAC", cryptoKey, textEncoder.encode(data));
}

async function sha256Hex(data: string) {
	return toHex(await crypto.subtle.digest("SHA-256", textEncoder.encode(data)));
}

async function awsSigningKey(secret: string, dateStamp: string, region: string) {
	const kDate = await hmac(textEncoder.encode(`AWS4${secret}`), dateStamp);
	const kRegion = await hmac(kDate, region);
	const kService = await hmac(kRegion, "sqs");
	return hmac(kService, "aws4_request");
}

function isoAmzDate(date: Date) {
	return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

async function sendSqsEvent(env: Env, event: LeadEvent | SlackActionEvent): Promise<boolean> {
	if (!env.AWS_SQS_QUEUE_URL || !env.AWS_REGION || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
		console.warn("SQS not configured; skipping event enqueue", event.event_id);
		return false;
	}
	const now = new Date();
	const amzDate = isoAmzDate(now);
	const dateStamp = amzDate.slice(0, 8);
	const queueUrl = new URL(env.AWS_SQS_QUEUE_URL);
	const body = new URLSearchParams({
		Action: "SendMessage",
		Version: "2012-11-05",
		MessageBody: JSON.stringify(event),
	}).toString();
	const payloadHash = await sha256Hex(body);
	const canonicalHeaderRows = [
		["content-type", "application/x-www-form-urlencoded"],
		["host", queueUrl.host],
		["x-amz-date", amzDate],
	];
	if (env.AWS_SESSION_TOKEN) {
		canonicalHeaderRows.push(["x-amz-security-token", env.AWS_SESSION_TOKEN]);
	}
	const canonicalHeaders = canonicalHeaderRows.map(([key, value]) => `${key}:${value}`).join("\n") + "\n";
	const signedHeaders = canonicalHeaderRows.map(([key]) => key).join(";");
	const canonicalRequest = ["POST", queueUrl.pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
	const credentialScope = `${dateStamp}/${env.AWS_REGION}/sqs/aws4_request`;
	const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, await sha256Hex(canonicalRequest)].join("\n");
	const signingKey = await awsSigningKey(env.AWS_SECRET_ACCESS_KEY, dateStamp, env.AWS_REGION);
	const signature = toHex(await hmac(signingKey, stringToSign));
	const authorization = [
		`AWS4-HMAC-SHA256 Credential=${env.AWS_ACCESS_KEY_ID}/${credentialScope}`,
		`SignedHeaders=${signedHeaders}`,
		`Signature=${signature}`,
	].join(", ");
	const headers: Record<string, string> = {
		Authorization: authorization,
		"Content-Type": "application/x-www-form-urlencoded",
		"X-Amz-Date": amzDate,
	};
	if (env.AWS_SESSION_TOKEN) {
		headers["X-Amz-Security-Token"] = env.AWS_SESSION_TOKEN;
	}
	const response = await fetch(env.AWS_SQS_QUEUE_URL, { method: "POST", headers, body });
	if (!response.ok) {
		console.error("SQS enqueue failed", response.status, await response.text());
		return false;
	}
	return true;
}

function timingSafeEqual(a: string, b: string) {
	if (a.length !== b.length) {
		return false;
	}
	let result = 0;
	for (let i = 0; i < a.length; i += 1) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
}

export async function verifySlackSignature(request: Request, signingSecret: string, body: string, nowSeconds = Math.floor(Date.now() / 1000)) {
	const timestamp = request.headers.get("X-Slack-Request-Timestamp") || "";
	const signature = request.headers.get("X-Slack-Signature") || "";
	const timestampNumber = Number(timestamp);
	if (!timestampNumber || Math.abs(nowSeconds - timestampNumber) > 60 * 5) {
		return false;
	}
	const base = `v0:${timestamp}:${body}`;
	const expected = `v0=${toHex(await hmac(textEncoder.encode(signingSecret), base))}`;
	return timingSafeEqual(expected, signature);
}

function parseActionValue(value: unknown): Record<string, unknown> {
	if (typeof value !== "string" || !value.trim()) {
		return {};
	}
	try {
		const parsed = JSON.parse(value);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch (_error) {
		return {};
	}
}

function valuesFromView(view: Record<string, any>) {
	const values = view.state?.values || {};
	let subject = "";
	let bodyText = "";
	for (const block of Object.values(values) as Array<Record<string, any>>) {
		for (const action of Object.values(block) as Array<Record<string, any>>) {
			if (action.action_id === "subject") {
				subject = String(action.value || "").trim();
			}
			if (action.action_id === "body_text") {
				bodyText = String(action.value || "").trim();
			}
		}
	}
	return { subject, bodyText };
}

function modalMetadata(payload: Record<string, any>, actionData: Record<string, unknown>) {
	return {
		lead_id: String(actionData.lead_id || ""),
		draft_id: Number(actionData.draft_id || 0) || undefined,
		channel_id: payload.channel?.id || payload.container?.channel_id,
		message_ts: payload.container?.message_ts,
		thread_ts: payload.message?.thread_ts || payload.container?.thread_ts || payload.container?.message_ts,
	};
}

async function openEditModal(env: Env, payload: Record<string, any>, actionData: Record<string, unknown>) {
	if (!env.SLACK_BOT_TOKEN) {
		return;
	}
	const metadata = modalMetadata(payload, actionData);
	await slackApi("views.open", env.SLACK_BOT_TOKEN, {
		trigger_id: payload.trigger_id,
		view: {
			type: "modal",
			callback_id: "email.edit_approve",
			private_metadata: JSON.stringify(metadata),
			title: { type: "plain_text", text: "Edit email" },
			submit: { type: "plain_text", text: "Send" },
			close: { type: "plain_text", text: "Cancel" },
			blocks: [
				{
					type: "input",
					block_id: "subject_block",
					label: { type: "plain_text", text: "Subject" },
					element: {
						type: "plain_text_input",
						action_id: "subject",
						initial_value: String(actionData.subject || "").slice(0, 150),
					},
				},
				{
					type: "input",
					block_id: "body_block",
					label: { type: "plain_text", text: "Body" },
					element: {
						type: "plain_text_input",
						action_id: "body_text",
						multiline: true,
						initial_value: String(actionData.body_text || "").slice(0, 2800),
					},
				},
			],
		},
	});
}

async function handleSlackAction(request: Request, env: Env) {
	if (!env.SLACK_SIGNING_SECRET) {
		return responseJson({ error: "Slack signing secret missing" }, { status: 500 });
	}
	const rawBody = await request.text();
	const verified = await verifySlackSignature(request, env.SLACK_SIGNING_SECRET, rawBody);
	if (!verified) {
		return responseJson({ error: "Invalid signature" }, { status: 401 });
	}
	const form = new URLSearchParams(rawBody);
	const payload = JSON.parse(form.get("payload") || "{}") as Record<string, any>;

	if (payload.type === "view_submission" && payload.view?.callback_id === "email.edit_approve") {
		const metadata = JSON.parse(payload.view.private_metadata || "{}");
		const { subject, bodyText } = valuesFromView(payload.view);
		if (!subject || !bodyText) {
			return responseJson({
				response_action: "errors",
				errors: {
					subject_block: subject ? undefined : "Subject is required.",
					body_block: bodyText ? undefined : "Body is required.",
				},
			});
		}
		const event: SlackActionEvent = {
			event_id: crypto.randomUUID(),
			type: "email.edit_approve",
			created_at: new Date().toISOString(),
			lead_id: String(metadata.lead_id || ""),
			draft_id: Number(metadata.draft_id || 0) || undefined,
			subject,
			body_text: bodyText,
			slack: {
				user_id: payload.user?.id,
				channel_id: metadata.channel_id,
				message_ts: metadata.message_ts,
				thread_ts: metadata.thread_ts,
			},
		};
		await sendSqsEvent(env, event);
		return responseJson({ response_action: "clear" });
	}

	const action = payload.actions?.[0];
	const actionId = action?.action_id;
	if (!["email.approve", "email.edit", "email.reject", "email.regenerate"].includes(actionId)) {
		return responseJson({});
	}
	const actionData = parseActionValue(action.value);
	if (actionId === "email.edit") {
		await openEditModal(env, payload, actionData);
		return responseJson({});
	}
	const event: SlackActionEvent = {
		event_id: crypto.randomUUID(),
		type: actionId,
		created_at: new Date().toISOString(),
		lead_id: String(actionData.lead_id || ""),
		draft_id: Number(actionData.draft_id || 0) || undefined,
		slack: {
			user_id: payload.user?.id,
			channel_id: payload.channel?.id || payload.container?.channel_id,
			message_ts: payload.container?.message_ts,
			thread_ts: payload.message?.thread_ts || payload.container?.thread_ts || payload.container?.message_ts,
			response_url: payload.response_url,
		},
	};
	await sendSqsEvent(env, event);
	return responseJson({ text: "Queued." });
}

async function handleLeadPost(request: Request, env: Env) {
	try {
		const formData = (await request.json()) as ContactFormData;
		const leadEvent = normalizeLeadEvent(formData);
		const slackResult = await postLeadToSlack(env, leadEvent);
		if (slackResult.ok) {
			leadEvent.slack = {
				channel_id: slackResult.channel,
				message_ts: slackResult.ts,
				thread_ts: slackResult.ts,
			};
		} else {
			console.error("Slack post skipped or failed", slackResult.error);
		}
		await sendSqsEvent(env, leadEvent);
		return responseJson({ success: true, lead_id: leadEvent.lead.lead_id });
	} catch (error) {
		console.error("Worker error:", error);
		if (error instanceof Error && error.message === "Email is required.") {
			return responseJson({ error: "Email is required." }, { status: 400 });
		}
		return responseJson({ success: true });
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === "OPTIONS") {
			return handleOptions(request);
		}
		const url = new URL(request.url);
		if (request.method === "POST" && url.pathname === "/slack/actions") {
			return handleSlackAction(request, env);
		}
		if (request.method === "POST") {
			return handleLeadPost(request, env);
		}
		return new Response("Method Not Allowed", { status: 405 });
	},
};
