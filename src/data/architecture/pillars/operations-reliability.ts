import type { Pillar } from "../types";

export const operationsReliability: Pillar = {
	label: "⚙️ OPERATIONS & RELIABILITY",
	icon: "⚙️",
	color: "orange",
	description: "Deployment, monitoring, and performance - How we deploy and run it",
	children: [
		{
			label: "8. Deployment & Operations",
			description: "Continuous delivery and operational processes.",
			children: [
				{
					label: "CI/CD Pipeline",
					description: "Automated build and deployment pipeline.",
					children: [
						{ label: "Build", description: "Automated compilation and packaging." },
						{ label: "Test", description: "Automated testing in pipeline." },
						{ label: "Deploy Automation", description: "Automated deployment processes." },
						{ label: "Deployment Strategies", description: "Deployment pattern selection." },
					],
				},
				{
					label: "Infrastructure as Code",
					description: "Managing infrastructure through code.",
					children: [
						{ label: "Version Control", description: "Infrastructure version management." },
						{
							label: "Terraform/CloudFormation",
							description: "IaC tooling selection.",
						},
					],
				},
				{
					label: "Deployment Strategy",
					description: "Release deployment patterns.",
					children: [
						{ label: "Blue-Green", description: "Dual environment deployment." },
						{ label: "Canary", description: "Gradual traffic shifting." },
						{ label: "Rolling Updates", description: "Sequential instance updates." },
						{ label: "Rollback", description: "Quick reversion procedures." },
					],
				},
				{
					label: "Environment Strategy",
					description: "Managing multiple environments.",
					children: [
						{ label: "Dev", description: "Development environment setup." },
						{ label: "Test", description: "Testing environment configuration." },
						{ label: "Staging", description: "Production-like environment." },
						{ label: "Production", description: "Live environment management." },
					],
				},
				{
					label: "Configuration Management",
					description: "Managing application configuration.",
					children: [
						{ label: "Environment Configs", description: "Per-environment settings." },
						{ label: "Feature Flags", description: "Runtime feature toggles." },
						{ label: "A/B Testing", description: "Experimentation framework." },
					],
				},
				{
					label: "Release Management",
					description: "Coordinating releases.",
					children: [
						{ label: "Release Notes", description: "Change documentation." },
						{ label: "Customer Communication", description: "Release announcements." },
						{ label: "Deprecation Notices", description: "Sunset communication." },
					],
				},
				{
					label: "Database Deployment",
					description: "Database change management.",
					children: [
						{ label: "Schema Migrations", description: "Schema evolution process." },
						{ label: "Data Migration Scripts", description: "Data transformation scripts." },
					],
				},
			],
		},
		{
			label: "9. Observability & Monitoring",
			description: "System visibility and operational awareness.",
			children: [
				{
					label: "Logging Strategy",
					description: "Centralized logging approach.",
					children: [
						{ label: "Structured Logging", description: "Consistent log format." },
						{ label: "Log Aggregation", description: "Centralized log collection." },
						{ label: "Retention Policies", description: "Log storage duration." },
						{ label: "Tenant-specific Filtering", description: "Per-tenant log isolation." },
					],
				},
				{
					label: "Metrics & Monitoring",
					description: "Performance and health metrics.",
					children: [
						{ label: "Application Metrics", description: "Business and technical KPIs." },
						{ label: "Infrastructure Metrics", description: "System resource monitoring." },
						{ label: "Business Metrics", description: "Revenue and usage tracking." },
					],
				},
				{
					label: "Distributed Tracing",
					description: "Request flow tracking.",
					children: [
						{ label: "Request Tracing", description: "End-to-end request tracking." },
						{ label: "Cross-service Tracking", description: "Distributed trace correlation." },
					],
				},
				{
					label: "Alerting",
					description: "Proactive issue notification.",
					children: [
						{ label: "Alert Definitions", description: "Alert rule configuration." },
						{ label: "Severity Levels", description: "Alert priority classification." },
						{ label: "On-call Rotations", description: "Engineer scheduling." },
						{ label: "Escalation Policies", description: "Alert escalation procedures." },
					],
				},
				{
					label: "Health Checks",
					description: "Service availability monitoring.",
					children: [
						{ label: "Liveness Probes", description: "Service running verification." },
						{ label: "Readiness Probes", description: "Service ready verification." },
						{ label: "Dependency Checks", description: "Upstream service validation." },
					],
				},
				{
					label: "Dashboards",
					description: "Visualization and reporting.",
					children: [
						{ label: "Operational Dashboards", description: "Real-time system health." },
						{ label: "BI Dashboards", description: "Business intelligence reporting." },
						{ label: "Customer Analytics", description: "Tenant usage insights." },
					],
				},
				{
					label: "Error Tracking",
					description: "Exception monitoring.",
					children: [
						{ label: "Exception Tracking", description: "Error capture and grouping." },
						{ label: "Error Grouping", description: "Similar error aggregation." },
						{ label: "Error Rate Monitoring", description: "Error frequency tracking." },
					],
				},
				{
					label: "Performance Monitoring",
					description: "Application performance tracking.",
					children: [
						{ label: "APM Tools", description: "Application performance monitoring." },
						{ label: "Slow Query Detection", description: "Database performance issues." },
						{ label: "Bottleneck Identification", description: "Performance problem analysis." },
					],
				},
			],
		},
		{
			label: "11. Performance & Scalability",
			description: "Ensuring system performance and growth capacity.",
			children: [
				{
					label: "Performance Targets",
					description: "Performance goals and SLAs.",
					children: [
						{ label: "Response Time SLAs", description: "Latency requirements." },
						{ label: "Throughput Requirements", description: "Request volume targets." },
						{ label: "Per-tenant Tiers", description: "Differentiated performance levels." },
					],
				},
				{
					label: "Caching Strategy",
					description: "Optimizing through caching.",
					children: [
						{ label: "What to Cache", description: "Cache candidate identification." },
						{ label: "Cache Invalidation", description: "Cache freshness strategy." },
						{ label: "Cache Warming", description: "Preloading cache data." },
					],
				},
				{
					label: "Database Performance",
					description: "Database optimization techniques.",
					children: [
						{ label: "Indexing Strategy", description: "Query optimization through indexes." },
						{ label: "Query Optimization", description: "SQL query tuning." },
						{ label: "Connection Pooling", description: "Database connection management." },
					],
				},
				{
					label: "Horizontal Scaling",
					description: "Scaling by adding instances.",
					children: [
						{ label: "Stateless Design", description: "Enabling horizontal scaling." },
						{ label: "Load Balancing", description: "Traffic distribution." },
						{ label: "Auto-scaling Policies", description: "Dynamic scaling rules." },
					],
				},
				{
					label: "Vertical Scaling",
					description: "Scaling by adding resources.",
					children: [
						{ label: "Scale Up vs Out", description: "Vertical vs horizontal trade-offs." },
						{ label: "Resource Allocation", description: "CPU and memory sizing." },
					],
				},
				{
					label: "Rate Limiting",
					description: "Protecting against overload.",
					children: [
						{ label: "API Rate Limits", description: "Request throttling." },
						{ label: "Burst Allowances", description: "Temporary rate increases." },
						{ label: "Quota Management", description: "Usage limits enforcement." },
					],
				},
				{
					label: "CDN Strategy",
					description: "Content delivery optimization.",
					children: [
						{ label: "Static Assets", description: "Asset caching and delivery." },
						{ label: "Edge Caching", description: "Geo-distributed caching." },
						{ label: "Geo-routing", description: "Geographic traffic routing." },
					],
				},
				{
					label: "Asynchronous Processing",
					description: "Background task processing.",
					children: [
						{ label: "Background Jobs", description: "Async task execution." },
						{ label: "Queue Workers", description: "Message queue processing." },
						{ label: "Batch Processing", description: "Bulk operation handling." },
					],
				},
			],
		},
		{
			label: "14. Disaster Recovery & Business Continuity",
			description: "Preparing for and recovering from failures.",
			children: [
				{
					label: "RTO/RPO Definitions",
					description: "Recovery objectives.",
					children: [
						{
							label: "Recovery Time Objectives",
							description: "Maximum acceptable downtime.",
						},
						{
							label: "Recovery Point Objectives",
							description: "Maximum acceptable data loss.",
						},
						{ label: "Per-tier Targets", description: "Differentiated recovery goals." },
					],
				},
				{
					label: "Backup Strategy",
					description: "Data backup approach.",
					children: [
						{ label: "Full Backups", description: "Complete data backups." },
						{ label: "Incremental Backups", description: "Change-based backups." },
						{ label: "Off-site Storage", description: "Geographic backup distribution." },
					],
				},
				{
					label: "Failover Procedures",
					description: "Service failover processes.",
					children: [
						{ label: "Automated Failover", description: "Automatic failover mechanisms." },
						{ label: "Manual Failover", description: "Operator-initiated failover." },
						{ label: "Multi-region Setup", description: "Cross-region redundancy." },
					],
				},
				{
					label: "Data Recovery",
					description: "Restoring data from backups.",
					children: [
						{
							label: "Point-in-time Recovery",
							description: "Restore to specific timestamp.",
						},
						{
							label: "Tenant-specific Recovery",
							description: "Granular tenant recovery.",
						},
					],
				},
				{
					label: "DR Testing",
					description: "Validating disaster recovery.",
					children: [
						{ label: "Regular Drills", description: "Periodic DR exercises." },
						{ label: "Runbook Validation", description: "Procedure verification." },
					],
				},
				{
					label: "Business Continuity Planning",
					description: "Maintaining operations during incidents.",
					children: [
						{
							label: "Degraded Mode Operations",
							description: "Reduced functionality mode.",
						},
						{ label: "Communication Plans", description: "Stakeholder communication." },
					],
				},
			],
		},
	],
};
