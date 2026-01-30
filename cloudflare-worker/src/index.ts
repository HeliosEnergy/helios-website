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
    // Cluster inquiry details
    clusterDetails?: {
        types: string;
        gpuCountMin: number;
        gpuCountMax: number;
    };
    // Inference inquiry details
    inferenceDetails?: {
        models: Array<{
            name: string;
            category: string;
            estimation: string;
        }>;
    };
    // Partnership details
    partnershipDetails?: string;
    // Legacy GPU details (for backwards compatibility)
    gpuDetails?: {
        model: string;
        count: number;
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
			"Access-Control-Allow-Origin": "*",
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

// Get emoji for inquiry type
const getInquiryEmoji = (type: string): string => {
	const emojiMap: Record<string, string> = {
		'Clusters': '🖥️',
		'Inference': '🤖',
		'Baremetal': '🔧',
		'Press': '📰',
		'Partnership': '🤝',
		'Others': '💬',
	};
	return emojiMap[type] || '📬';
};

// Main fetch handler
export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		if (request.method === "OPTIONS") {
			return handleOptions(request);
		}

		if (request.method !== "POST") {
			return new Response("Method Not Allowed", { status: 405 });
		}

		try {
			const formData: ContactFormData = await request.json();

			// Basic validation - email is required, message can be optional for some inquiry types
			if (!formData.email) {
				return new Response(JSON.stringify({ error: "Email is required." }), {
					status: 400,
					headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
				});
			}

			// Check if SLACK_WEBHOOK_URL is properly configured
			if (!env.SLACK_WEBHOOK_URL || env.SLACK_WEBHOOK_URL === "placeholder_url") {
				console.error("SLACK_WEBHOOK_URL is not properly configured");
				return new Response(JSON.stringify({ success: true }), {
					status: 200,
					headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
				});
			}

			const inquiryEmoji = getInquiryEmoji(formData.inquiryType);

			// Construct Slack message using Block Kit
			const slackMessage: any = {
				blocks: [
					{
						type: "header",
						text: {
							type: "plain_text",
							text: `${inquiryEmoji} New ${formData.inquiryType || 'Contact'} Inquiry`,
						},
					},
					{
						type: "section",
						fields: [
							{ type: "mrkdwn", text: `*Name:*\n${formData.name || "Not provided"}` },
							{ type: "mrkdwn", text: `*Email:*\n<mailto:${formData.email}|${formData.email}>` },
							{ type: "mrkdwn", text: `*Organization:*\n${formData.company || "Not provided"}` },
							{ type: "mrkdwn", text: `*Interest:*\n${formData.inquiryType || "General"}` },
						],
					},
				],
			};

			// Add Cluster details if present
			if (formData.clusterDetails) {
				slackMessage.blocks.push({ type: "divider" });
				slackMessage.blocks.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: "*🖥️ Cluster Requirements*",
					},
				});
				slackMessage.blocks.push({
					type: "section",
					fields: [
						{ type: "mrkdwn", text: `*Cluster Types:*\n${formData.clusterDetails.types || "Not specified"}` },
						{ type: "mrkdwn", text: `*GPU Range:*\n${formData.clusterDetails.gpuCountMin} - ${formData.clusterDetails.gpuCountMax} GPUs` },
					],
				});
			}

			// Add Inference details if present
			if (formData.inferenceDetails && formData.inferenceDetails.models && formData.inferenceDetails.models.length > 0) {
				slackMessage.blocks.push({ type: "divider" });
				slackMessage.blocks.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: "*🤖 Inference Requirements*",
					},
				});

				// Add each model with its estimation
				for (const model of formData.inferenceDetails.models) {
					slackMessage.blocks.push({
						type: "section",
						fields: [
							{ type: "mrkdwn", text: `*Model:*\n${model.name}` },
							{ type: "mrkdwn", text: `*Estimated Usage:*\n${model.estimation}` },
						],
					});
				}
			}

			// Add Partnership details if present
			if (formData.partnershipDetails) {
				slackMessage.blocks.push({ type: "divider" });
				slackMessage.blocks.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: `*🤝 Partnership Details:*\n>>>${formData.partnershipDetails}`,
					},
				});
			}

			// Add message if present and not a partnership inquiry (which uses partnershipDetails)
			if (formData.message && formData.message !== "No message provided" && !formData.partnershipDetails) {
				slackMessage.blocks.push({ type: "divider" });
				slackMessage.blocks.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: `*Additional Notes:*\n>>>${formData.message}`,
					},
				});
			}

			// Legacy GPU details support (for backwards compatibility)
			if (formData.inquiryType === "GPU Rental Calculator" && formData.gpuDetails) {
				slackMessage.blocks.push({ type: "divider" });

				const gpuFields = [
					{ type: "mrkdwn", text: `*GPU Model:*\n${formData.gpuDetails.model || "Not specified"}` },
					{ type: "mrkdwn", text: `*Number of GPUs:*\n${formData.gpuDetails.count || "Not specified"}` },
					{ type: "mrkdwn", text: `*Memory:*\n${formData.gpuDetails.memory || "Not specified"}` },
					{ type: "mrkdwn", text: `*VRAM:*\n${formData.gpuDetails.vram || "Not specified"}` },
					{ type: "mrkdwn", text: `*Specifications:*\n${formData.gpuDetails.specs || "Not specified"}` },
					{ type: "mrkdwn", text: `*Monthly Runtime:*\n${formData.gpuDetails.hoursPerMonth !== undefined ? formData.gpuDetails.hoursPerMonth + " hours" : "Not specified"}` },
					{ type: "mrkdwn", text: `*Contract Term:*\n${formData.gpuDetails.reservationPeriod || "Not specified"}` },
					{ type: "mrkdwn", text: `*Discount:*\n${formData.gpuDetails.discount !== undefined ? formData.gpuDetails.discount + "%" : "Not specified"}` },
					{ type: "mrkdwn", text: `*Total Monthly Cost:*\n${formData.gpuDetails.totalCost !== undefined ? "$" + formData.gpuDetails.totalCost.toFixed(2) : "Not specified"}` },
					{ type: "mrkdwn", text: `*Base Cost:*\n${formData.gpuDetails.baseCost !== undefined ? "$" + formData.gpuDetails.baseCost.toFixed(2) : "Not specified"}` },
					{ type: "mrkdwn", text: `*Discount Amount:*\n${formData.gpuDetails.discountAmount !== undefined ? "$" + formData.gpuDetails.discountAmount.toFixed(2) : "Not specified"}` },
					{ type: "mrkdwn", text: `*Effective Rate:*\n${formData.gpuDetails.effectiveRate !== undefined ? "$" + formData.gpuDetails.effectiveRate.toFixed(2) + "/hour" : "Not specified"}` },
				];

				slackMessage.blocks.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: "*GPU Rental Configuration*",
					},
				});

				// Split fields into chunks of 10 (Slack limitation)
				for (let i = 0; i < gpuFields.length; i += 10) {
					slackMessage.blocks.push({
						type: "section",
						fields: gpuFields.slice(i, i + 10),
					});
				}
			} else if (formData.inquiryType === "Bare Metal" && formData.gpuDetails) {
				slackMessage.blocks.push({ type: "divider" });
				slackMessage.blocks.push({
					type: "section",
					text: {
						type: "mrkdwn",
						text: "*Bare Metal GPU Requirements*",
					},
				});
				slackMessage.blocks.push({
					type: "section",
					fields: [
						{ type: "mrkdwn", text: `*GPU Model:*\n${formData.gpuDetails.model || "Not specified"}` },
						{ type: "mrkdwn", text: `*Number of GPUs:*\n${formData.gpuDetails.count || "Not specified"}` },
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
				// Still return success to avoid breaking the user experience
			}

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
			});

		} catch (error) {
			console.error("Worker error:", error);
			// Return success even in case of errors to avoid breaking the user experience
			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
			});
		}
	},
};
