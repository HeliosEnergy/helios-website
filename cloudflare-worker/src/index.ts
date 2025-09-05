export interface Env {
	SLACK_WEBHOOK_URL: string;
}

// Define the shape of the incoming form data for type safety
interface ContactFormData {
    name: string;
    email: string;
    company?: string;
    message: string;
    inquiryType: string;
    gpuDetails?: {
        model: string;
        count: number;
    };
}

// Helper to handle CORS preflight requests (OPTIONS)
const handleOptions = (request: Request) => {
	const headers = request.headers;
	if (
		headers.get("Origin") !== null &&
		headers.get("Access-Control-Request-Method") !== null &&
		headers.get("Access-Control-Request-Headers") !== null
	) {
		// Handle CORS preflight requests.
		const respHeaders = {
			"Access-Control-Allow-Origin": "*", // Be more specific in production
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-control-allow-headers": "Content-Type",
		};
		return new Response(null, { headers: respHeaders });
	} else {
		// Handle standard OPTIONS request.
		return new Response(null, {
			headers: {
				Allow: "POST, OPTIONS",
			},
		});
	}
};

// Main fetch handler
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "OPTIONS") {
			return handleOptions(request);
		}

		if (request.method !== "POST") {
			return new Response("Method Not Allowed", { status: 405 });
		}

		try {
			const formData: ContactFormData = await request.json();

			// Basic validation
			if (!formData.email || !formData.message) {
				return new Response(JSON.stringify({ error: "Email and message are required." }), {
					status: 400,
					headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
				});
			}

			// Construct Slack message using Block Kit
			const slackMessage = {
				blocks: [
					{
						type: "header",
						text: {
							type: "plain_text",
							text: "📬 New Contact Form Submission",
						},
					},
					{
						type: "section",
						fields: [
							{ type: "mrkdwn", text: `*Name:*
${formData.name || "Not provided"}` },
							{ type: "mrkdwn", text: `*Email:*
<mailto:${formData.email}|${formData.email}>` },
							{ type: "mrkdwn", text: `*Company:*
${formData.company || "Not provided"}` },
							{ type: "mrkdwn", text: `*Inquiry Type:*
${formData.inquiryType || "General"}` },
						],
					},
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text: `*Message:*
>>>${formData.message}`,
						},
					},
				],
			};

			// Add GPU details if they exist
			if (formData.inquiryType === "Bare Metal" && formData.gpuDetails) {
				slackMessage.blocks.push({ type: "divider" });
				slackMessage.blocks.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: "*Bare Metal GPU Requirements*",
					},
					fields: [
						{ type: "mrkdwn", text: `*GPU Model:*
${formData.gpuDetails.model || "Not specified"}` },
						{ type: "mrkdwn", text: `*Number of GPUs:*
${formData.gpuDetails.count || "Not specified"}` },
					],
				});
			}
			
			// Add a timestamp
			slackMessage.blocks.push({
				type: "context",
				elements: [
					{
						type: "plain_text",
						text: `Received at ${new Date().toUTCString()}`,
					},
				],
			});


			// Send to Slack
			const slackResponse = await fetch(env.SLACK_WEBHOOK_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(slackMessage),
			});

			if (!slackResponse.ok) {
				console.error("Slack API error:", await slackResponse.text());
				throw new Error("Failed to send message to Slack.");
			}

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
			});

		} catch (error) {
			console.error("Worker error:", error);
			return new Response(JSON.stringify({ error: "An internal error occurred." }), {
				status: 500,
				headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
			});
		}
	},
};
