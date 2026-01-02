import type { Pillar } from "../types";

export const strategyBusiness: Pillar = {
	label: "🎯 STRATEGY & BUSINESS",
	icon: "🎯",
	color: "green",
	description: "Business alignment and customer value - What we build and why",
	children: [
		{
			label: "1. Business & Requirements",
			description: "Core business requirements and strategic decisions that shape the platform architecture.",
			children: [
				{
					label: "Functional Requirements",
					description: "Defines the specific features and capabilities the platform must provide to users.",
					children: [
						{
							label: "Quote Creation",
							description: "Enable users to generate custom quotes with pricing, products, and terms.",
						},
						{
							label: "Approval Workflows",
							description:
								"Multi-step approval processes with routing rules and escalation paths.",
						},
						{
							label: "Order Placement",
							description: "Convert approved quotes to orders with fulfillment tracking.",
						},
						{
							label: "Pricing Rules",
							description: "Configure discounts, tiered pricing, and custom pricing strategies.",
						},
						{
							label: "Product Catalog",
							description: "Manage products, SKUs, bundles, and configuration options.",
						},
					],
				},
				{
					label: "Non-Functional Requirements",
					description: "Performance, availability, and scalability targets for the platform.",
					children: [
						{ label: "Performance Targets", description: "Response time and throughput requirements." },
						{ label: "Availability SLAs", description: "Uptime guarantees and service level agreements." },
						{ label: "Scalability Targets", description: "Growth projections and capacity planning." },
					],
				},
				{
					label: "Tenant Model Design",
					description: "Multi-tenancy strategy and organizational structure.",
					children: [
						{
							label: "Organization Hierarchy",
							description: "Parent-child relationships and organizational structure.",
						},
						{
							label: "User Roles per Tenant",
							description: "Role-based access control within tenant boundaries.",
						},
						{ label: "Data Isolation", description: "Ensuring tenant data segregation and security." },
						{
							label: "Customization Needs",
							description: "Tenant-specific configurations and branding.",
						},
					],
				},
				{
					label: "API vs Portal Strategy",
					description: "Balance between API-first and UI-first approaches.",
					children: [
						{
							label: "Feature Parity",
							description: "Ensuring consistent functionality across API and UI.",
						},
						{
							label: "API-first vs UI-first",
							description: "Strategic decision on development priorities.",
						},
						{
							label: "Versioning Alignment",
							description: "Coordinating API and UI version releases.",
						},
					],
				},
				{
					label: "Pricing & Billing Model",
					description: "Revenue model and billing strategies.",
					children: [
						{ label: "Per-seat", description: "User-based pricing model." },
						{ label: "Usage-based", description: "Consumption-based pricing." },
						{ label: "Tiered Pricing", description: "Feature-based pricing tiers." },
						{ label: "Metering & Charging", description: "Usage tracking and billing automation." },
					],
				},
			],
		},
		{
			label: "13. Customer Success & Support",
			description: "Ensuring customer satisfaction and providing effective support.",
			children: [
				{
					label: "Onboarding Experience",
					description: "First-time user setup and activation flow.",
					children: [
						{ label: "Self-service Signup", description: "Automated registration and activation." },
						{ label: "Guided Setup", description: "Step-by-step configuration wizard." },
						{ label: "Data Import Tools", description: "Migration from existing systems." },
					],
				},
				{
					label: "Admin Portal",
					description: "Administrative tools for support and management.",
					children: [
						{ label: "Support Tools", description: "Troubleshooting and diagnostic capabilities." },
						{ label: "Customer Management", description: "Tenant administration and configuration." },
						{ label: "Troubleshooting", description: "Issue diagnosis and resolution tools." },
					],
				},
				{
					label: "Customer Analytics",
					description: "Understanding customer behavior and platform usage.",
					children: [
						{ label: "Usage Dashboards", description: "Feature adoption and activity tracking." },
						{ label: "Health Scores", description: "Customer engagement metrics." },
						{ label: "Adoption Metrics", description: "Feature utilization analysis." },
					],
				},
				{
					label: "Documentation",
					description: "Comprehensive user and developer documentation.",
					children: [
						{ label: "API Docs", description: "API reference and integration guides." },
						{ label: "User Guides", description: "End-user documentation and tutorials." },
						{ label: "Integration Guides", description: "Third-party integration instructions." },
						{ label: "FAQs", description: "Common questions and answers." },
					],
				},
				{
					label: "Support Ticketing",
					description: "Customer support request management.",
					children: [
						{ label: "System Integration", description: "CRM and support tool integration." },
						{ label: "SLA Tracking", description: "Response and resolution time monitoring." },
					],
				},
				{
					label: "Customer Communication",
					description: "Keeping customers informed about platform changes.",
					children: [
						{ label: "Release Notifications", description: "New feature announcements." },
						{ label: "Maintenance Windows", description: "Scheduled downtime communication." },
						{ label: "Incident Updates", description: "Real-time status updates." },
					],
				},
			],
		},
	],
};
