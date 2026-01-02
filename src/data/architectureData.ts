export interface TreeNode {
	label: string;
	description?: string;
	children?: TreeNode[];
}

export const architectureData: TreeNode = {
	label: "B2B SaaS Platform Architecture",
	description: "Comprehensive architectural framework for building scalable, secure, and maintainable B2B SaaS platforms.",
	children: [
		{
			label: "1. Business & Requirements",
			description: "Core business requirements and strategic decisions that shape the platform architecture.",
			children: [
				{
					label: "Functional Requirements",
					description: "Defines the specific features and capabilities the platform must provide to users.",
					children: [
						{ label: "Quote Creation", description: "Enable users to generate custom quotes with pricing, products, and terms." },
						{ label: "Approval Workflows", description: "Multi-step approval processes with routing rules and escalation paths." },
						{ label: "Order Placement", description: "Convert approved quotes to orders with fulfillment tracking." },
						{ label: "Pricing Rules", description: "Configure discounts, tiered pricing, and custom pricing strategies." },
						{ label: "Product Catalog", description: "Manage products, SKUs, bundles, and configuration options." },
					],
				},
				{
					label: "Non-Functional Requirements",
					children: [
						{ label: "Performance Targets" },
						{ label: "Availability SLAs" },
						{ label: "Scalability Targets" },
					],
				},
				{
					label: "Tenant Model Design",
					children: [
						{ label: "Organization Hierarchy" },
						{ label: "User Roles per Tenant" },
						{ label: "Data Isolation" },
						{ label: "Customization Needs" },
					],
				},
				{
					label: "API vs Portal Strategy",
					children: [
						{ label: "Feature Parity" },
						{ label: "API-first vs UI-first" },
						{ label: "Versioning Alignment" },
					],
				},
				{
					label: "Pricing & Billing Model",
					children: [
						{ label: "Per-seat" },
						{ label: "Usage-based" },
						{ label: "Tiered Pricing" },
						{ label: "Metering & Charging" },
					],
				},
			],
		},
		{
			label: "2. Architecture & Design Patterns",
			children: [
				{
					label: "Overall Architecture Style",
					children: [
						{ label: "Monolith" },
						{ label: "Modular Monolith" },
						{ label: "Microservices" },
						{ label: "Hybrid" },
					],
				},
				{
					label: "Multi-Tenancy Pattern",
					children: [
						{ label: "Shared DB + Discriminator" },
						{ label: "Schema-per-Tenant" },
						{ label: "DB-per-Tenant" },
					],
				},
				{
					label: "Domain Model Design",
					children: [
						{ label: "Bounded Contexts" },
						{ label: "Aggregates" },
						{ label: "Entities" },
						{ label: "Value Objects" },
					],
				},
				{
					label: "API Architecture",
					children: [{ label: "REST" }, { label: "GraphQL" }, { label: "Sync vs Async" }],
				},
				{
					label: "Event-Driven Architecture",
					children: [
						{ label: "Event Operations" },
						{ label: "Event Schema" },
						{ label: "Event Sourcing" },
					],
				},
				{
					label: "Integration Patterns",
					children: [{ label: "Sync/Async" }, { label: "Direct/Message-based" }],
				},
				{
					label: "Data Consistency Strategy",
					children: [
						{ label: "CAP Tradeoffs" },
						{ label: "Eventual Consistency" },
						{ label: "Transaction Scopes" },
					],
				},
			],
		},
		{
			label: "3. Technical Infrastructure",
			children: [
				{
					label: "Technology Stack",
					children: [
						{ label: "Backend Framework" },
						{ label: "Frontend Framework" },
						{ label: "Databases" },
						{ label: "Message Brokers" },
					],
				},
				{
					label: "Hosting Strategy",
					children: [
						{ label: "Cloud Provider" },
						{ label: "Regions" },
						{ label: "Multi-region" },
						{ label: "Hybrid Cloud" },
					],
				},
				{
					label: "Container Orchestration",
					children: [
						{ label: "Kubernetes" },
						{ label: "Managed Services" },
						{ label: "Serverless" },
					],
				},
				{
					label: "Networking",
					children: [
						{ label: "VPCs" },
						{ label: "Load Balancers" },
						{ label: "CDN" },
						{ label: "API Gateway" },
					],
				},
				{
					label: "Database Architecture",
					children: [
						{ label: "Primary DB" },
						{ label: "Read Replicas" },
						{ label: "Caching Layer" },
						{ label: "Search Engine" },
					],
				},
				{
					label: "Message Infrastructure",
					children: [
						{ label: "Broker Selection" },
						{ label: "Queue vs Topic" },
						{ label: "Dead Letter Queues" },
					],
				},
				{
					label: "File Storage",
					children: [{ label: "Object Storage" }, { label: "Documents" }, { label: "Attachments" }],
				},
				{
					label: "DNS & Certificates",
					children: [{ label: "Custom Domains" }, { label: "SSL/TLS Automation" }],
				},
			],
		},
		{
			label: "4. Security Concerns",
			children: [
				{
					label: "Authentication",
					children: [
						{ label: "User Auth" },
						{ label: "API Auth" },
						{ label: "SSO/SAML/OIDC" },
						{ label: "MFA" },
					],
				},
				{
					label: "Authorization",
					children: [
						{ label: "RBAC" },
						{ label: "ABAC" },
						{ label: "Permission Hierarchy" },
						{ label: "Tenant vs User Permissions" },
					],
				},
				{
					label: "API Security",
					children: [
						{ label: "API Keys" },
						{ label: "OAuth2" },
						{ label: "Token Management" },
						{ label: "Rate Limiting" },
						{ label: "IP Whitelisting" },
					],
				},
				{
					label: "Data Encryption",
					children: [
						{ label: "At Rest" },
						{ label: "In Transit" },
						{ label: "Field-level" },
						{ label: "Key Management" },
					],
				},
				{
					label: "Tenant Isolation",
					children: [
						{ label: "Code-level" },
						{ label: "Database-level" },
						{ label: "Network Segmentation" },
					],
				},
				{
					label: "Secrets Management",
					children: [{ label: "Credential Storage" }, { label: "Rotation" }, { label: "Certificates" }],
				},
				{
					label: "Security Scanning",
					children: [
						{ label: "SAST" },
						{ label: "DAST" },
						{ label: "Dependency Vulnerabilities" },
						{ label: "Container Scanning" },
					],
				},
				{
					label: "Penetration Testing",
					children: [{ label: "Security Audits" }, { label: "Bug Bounty" }],
				},
				{
					label: "Incident Response",
					children: [{ label: "Playbooks" }, { label: "Breach Notification" }],
				},
			],
		},
		{
			label: "5. Data Management",
			children: [
				{
					label: "Data Modeling",
					children: [
						{ label: "Multi-tenant Schema" },
						{ label: "Normalization" },
						{ label: "Denormalization" },
					],
				},
				{
					label: "Database Migration",
					children: [
						{ label: "Zero-downtime" },
						{ label: "Rollback Procedures" },
						{ label: "Multi-tenant Considerations" },
					],
				},
				{
					label: "Data Validation",
					children: [
						{ label: "Input Validation" },
						{ label: "Business Rules" },
						{ label: "Referential Integrity" },
					],
				},
				{
					label: "Data Lifecycle",
					children: [
						{ label: "Archival Policies" },
						{ label: "Retention" },
						{ label: "Soft vs Hard Deletes" },
					],
				},
				{
					label: "Backup & Recovery",
					children: [
						{ label: "Backup Frequency" },
						{ label: "Retention Periods" },
						{ label: "Restore Procedures" },
						{ label: "Tenant-specific Restores" },
					],
				},
				{
					label: "Data Consistency",
					children: [
						{ label: "Distributed Transactions" },
						{ label: "Saga Patterns" },
						{ label: "Compensating Transactions" },
					],
				},
				{
					label: "Data Privacy",
					children: [
						{ label: "PII Handling" },
						{ label: "Anonymization" },
						{ label: "Right to be Forgotten" },
					],
				},
				{
					label: "Master Data Management",
					children: [
						{ label: "Product Catalogs" },
						{ label: "Pricing Rules" },
						{ label: "Reference Data Sync" },
					],
				},
			],
		},
		{
			label: "6. Integration Concerns",
			children: [
				{
					label: "Internal System Integration",
					children: [
						{ label: "Product Systems" },
						{ label: "Pricing Engines" },
						{ label: "Inventory" },
						{ label: "ERP" },
						{ label: "CRM" },
					],
				},
				{
					label: "Integration Reliability",
					children: [
						{ label: "Circuit Breakers" },
						{ label: "Retries" },
						{ label: "Timeouts" },
						{ label: "Fallback Mechanisms" },
					],
				},
				{
					label: "Data Synchronization",
					children: [
						{ label: "Real-time vs Batch" },
						{ label: "Conflict Resolution" },
						{ label: "Eventual Consistency" },
					],
				},
				{
					label: "Idempotency",
					children: [{ label: "Duplicate Prevention" }, { label: "Request Handling" }],
				},
				{
					label: "API Contract Management",
					children: [{ label: "Version Handling" }, { label: "Breaking Changes" }],
				},
				{
					label: "Webhook Implementation",
					children: [
						{ label: "Outbound Notifications" },
						{ label: "Delivery Guarantees" },
						{ label: "Retry Logic" },
					],
				},
				{
					label: "Third-Party Services",
					children: [
						{ label: "Payment Gateways" },
						{ label: "Email Services" },
						{ label: "SMS" },
						{ label: "Document Generation" },
					],
				},
			],
		},
		{
			label: "7. Quality & Testing",
			children: [
				{
					label: "Testing Strategy",
					children: [
						{ label: "Unit Tests" },
						{ label: "Integration Tests" },
						{ label: "Contract Tests" },
						{ label: "E2E Tests" },
					],
				},
				{
					label: "Test Data Management",
					children: [{ label: "Multi-tenant Test Data" }, { label: "Data Privacy" }],
				},
				{
					label: "Automated Testing",
					children: [
						{ label: "CI/CD Integration" },
						{ label: "Test Parallelization" },
						{ label: "Flaky Test Management" },
					],
				},
				{
					label: "Performance Testing",
					children: [
						{ label: "Load Testing" },
						{ label: "Stress Testing" },
						{ label: "Capacity Planning" },
					],
				},
				{
					label: "Chaos Engineering",
					children: [
						{ label: "Resilience Testing" },
						{ label: "Failure Injection" },
						{ label: "DR Drills" },
					],
				},
				{
					label: "Quality Gates",
					children: [
						{ label: "Code Coverage" },
						{ label: "Code Quality Metrics" },
						{ label: "Security Scans" },
					],
				},
			],
		},
		{
			label: "8. Deployment & Operations",
			children: [
				{
					label: "CI/CD Pipeline",
					children: [
						{ label: "Build" },
						{ label: "Test" },
						{ label: "Deploy Automation" },
						{ label: "Deployment Strategies" },
					],
				},
				{
					label: "Infrastructure as Code",
					children: [{ label: "Version Control" }, { label: "Terraform/CloudFormation" }],
				},
				{
					label: "Deployment Strategy",
					children: [
						{ label: "Blue-Green" },
						{ label: "Canary" },
						{ label: "Rolling Updates" },
						{ label: "Rollback" },
					],
				},
				{
					label: "Environment Strategy",
					children: [{ label: "Dev" }, { label: "Test" }, { label: "Staging" }, { label: "Production" }],
				},
				{
					label: "Configuration Management",
					children: [
						{ label: "Environment Configs" },
						{ label: "Feature Flags" },
						{ label: "A/B Testing" },
					],
				},
				{
					label: "Release Management",
					children: [
						{ label: "Release Notes" },
						{ label: "Customer Communication" },
						{ label: "Deprecation Notices" },
					],
				},
				{
					label: "Database Deployment",
					children: [{ label: "Schema Migrations" }, { label: "Data Migration Scripts" }],
				},
			],
		},
		{
			label: "9. Observability & Monitoring",
			children: [
				{
					label: "Logging Strategy",
					children: [
						{ label: "Structured Logging" },
						{ label: "Log Aggregation" },
						{ label: "Retention Policies" },
						{ label: "Tenant-specific Filtering" },
					],
				},
				{
					label: "Metrics & Monitoring",
					children: [
						{ label: "Application Metrics" },
						{ label: "Infrastructure Metrics" },
						{ label: "Business Metrics" },
					],
				},
				{
					label: "Distributed Tracing",
					children: [{ label: "Request Tracing" }, { label: "Cross-service Tracking" }],
				},
				{
					label: "Alerting",
					children: [
						{ label: "Alert Definitions" },
						{ label: "Severity Levels" },
						{ label: "On-call Rotations" },
						{ label: "Escalation Policies" },
					],
				},
				{
					label: "Health Checks",
					children: [
						{ label: "Liveness Probes" },
						{ label: "Readiness Probes" },
						{ label: "Dependency Checks" },
					],
				},
				{
					label: "Dashboards",
					children: [
						{ label: "Operational Dashboards" },
						{ label: "BI Dashboards" },
						{ label: "Customer Analytics" },
					],
				},
				{
					label: "Error Tracking",
					children: [
						{ label: "Exception Tracking" },
						{ label: "Error Grouping" },
						{ label: "Error Rate Monitoring" },
					],
				},
				{
					label: "Performance Monitoring",
					children: [
						{ label: "APM Tools" },
						{ label: "Slow Query Detection" },
						{ label: "Bottleneck Identification" },
					],
				},
			],
		},
		{
			label: "10. Compliance & Governance",
			children: [
				{
					label: "Regulatory Compliance",
					children: [
						{ label: "SOC 2" },
						{ label: "ISO 27001" },
						{ label: "GDPR" },
						{ label: "CCPA" },
						{ label: "Industry-specific" },
					],
				},
				{
					label: "Audit Logging",
					children: [
						{ label: "Audit Trails" },
						{ label: "Immutable Logs" },
						{ label: "Compliance Reporting" },
					],
				},
				{
					label: "Data Residency",
					children: [{ label: "Geographic Storage" }, { label: "Data Sovereignty" }],
				},
				{
					label: "Access Controls",
					children: [
						{ label: "Least Privilege" },
						{ label: "Separation of Duties" },
						{ label: "Privileged Access Mgmt" },
					],
				},
				{
					label: "Change Management",
					children: [{ label: "Approval Workflows" }, { label: "Change Documentation" }],
				},
				{
					label: "Vendor Management",
					children: [
						{ label: "Risk Assessment" },
						{ label: "SLA Management" },
						{ label: "Security Reviews" },
					],
				},
				{
					label: "Legal & Contracts",
					children: [
						{ label: "Terms of Service" },
						{ label: "SLAs" },
						{ label: "Data Processing Agreements" },
					],
				},
			],
		},
		{
			label: "11. Performance & Scalability",
			children: [
				{
					label: "Performance Targets",
					children: [
						{ label: "Response Time SLAs" },
						{ label: "Throughput Requirements" },
						{ label: "Per-tenant Tiers" },
					],
				},
				{
					label: "Caching Strategy",
					children: [
						{ label: "What to Cache" },
						{ label: "Cache Invalidation" },
						{ label: "Cache Warming" },
					],
				},
				{
					label: "Database Performance",
					children: [
						{ label: "Indexing Strategy" },
						{ label: "Query Optimization" },
						{ label: "Connection Pooling" },
					],
				},
				{
					label: "Horizontal Scaling",
					children: [
						{ label: "Stateless Design" },
						{ label: "Load Balancing" },
						{ label: "Auto-scaling Policies" },
					],
				},
				{
					label: "Vertical Scaling",
					children: [{ label: "Scale Up vs Out" }, { label: "Resource Allocation" }],
				},
				{
					label: "Rate Limiting",
					children: [
						{ label: "API Rate Limits" },
						{ label: "Burst Allowances" },
						{ label: "Quota Management" },
					],
				},
				{
					label: "CDN Strategy",
					children: [{ label: "Static Assets" }, { label: "Edge Caching" }, { label: "Geo-routing" }],
				},
				{
					label: "Asynchronous Processing",
					children: [
						{ label: "Background Jobs" },
						{ label: "Queue Workers" },
						{ label: "Batch Processing" },
					],
				},
			],
		},
		{
			label: "12. Cost Management",
			children: [
				{
					label: "Cost Monitoring",
					children: [
						{ label: "Cost per Tenant" },
						{ label: "Cost per Feature" },
						{ label: "Infrastructure Tracking" },
					],
				},
				{
					label: "Resource Optimization",
					children: [
						{ label: "Right-sizing" },
						{ label: "Reserved Instances" },
						{ label: "Spot Instances" },
					],
				},
				{
					label: "Cost Allocation",
					children: [{ label: "Tagging Strategy" }, { label: "Chargeback" }],
				},
				{
					label: "Budget Management",
					children: [
						{ label: "Budget Alerts" },
						{ label: "Cost Forecasting" },
						{ label: "Waste Identification" },
					],
				},
			],
		},
		{
			label: "13. Customer Success & Support",
			children: [
				{
					label: "Onboarding Experience",
					children: [
						{ label: "Self-service Signup" },
						{ label: "Guided Setup" },
						{ label: "Data Import Tools" },
					],
				},
				{
					label: "Admin Portal",
					children: [
						{ label: "Support Tools" },
						{ label: "Customer Management" },
						{ label: "Troubleshooting" },
					],
				},
				{
					label: "Customer Analytics",
					children: [
						{ label: "Usage Dashboards" },
						{ label: "Health Scores" },
						{ label: "Adoption Metrics" },
					],
				},
				{
					label: "Documentation",
					children: [
						{ label: "API Docs" },
						{ label: "User Guides" },
						{ label: "Integration Guides" },
						{ label: "FAQs" },
					],
				},
				{
					label: "Support Ticketing",
					children: [{ label: "System Integration" }, { label: "SLA Tracking" }],
				},
				{
					label: "Customer Communication",
					children: [
						{ label: "Release Notifications" },
						{ label: "Maintenance Windows" },
						{ label: "Incident Updates" },
					],
				},
			],
		},
		{
			label: "14. Disaster Recovery & Business Continuity",
			children: [
				{
					label: "RTO/RPO Definitions",
					children: [
						{ label: "Recovery Time Objectives" },
						{ label: "Recovery Point Objectives" },
						{ label: "Per-tier Targets" },
					],
				},
				{
					label: "Backup Strategy",
					children: [
						{ label: "Full Backups" },
						{ label: "Incremental Backups" },
						{ label: "Off-site Storage" },
					],
				},
				{
					label: "Failover Procedures",
					children: [
						{ label: "Automated Failover" },
						{ label: "Manual Failover" },
						{ label: "Multi-region Setup" },
					],
				},
				{
					label: "Data Recovery",
					children: [{ label: "Point-in-time Recovery" }, { label: "Tenant-specific Recovery" }],
				},
				{
					label: "DR Testing",
					children: [{ label: "Regular Drills" }, { label: "Runbook Validation" }],
				},
				{
					label: "Business Continuity Planning",
					children: [{ label: "Degraded Mode Operations" }, { label: "Communication Plans" }],
				},
			],
		},
		{
			label: "15. Development Process",
			children: [
				{
					label: "Code Standards",
					children: [
						{ label: "Coding Conventions" },
						{ label: "Linting Rules" },
						{ label: "Code Review Process" },
					],
				},
				{
					label: "Git Workflow",
					children: [
						{ label: "Branching Strategy" },
						{ label: "PR Process" },
						{ label: "Merge Policies" },
					],
				},
				{
					label: "Documentation Standards",
					children: [
						{ label: "Architecture Docs" },
						{ label: "API Docs" },
						{ label: "Runbooks" },
						{ label: "ADRs" },
					],
				},
				{
					label: "Technical Debt Management",
					children: [{ label: "Tracking" }, { label: "Prioritization" }, { label: "Remediation Planning" }],
				},
				{
					label: "Dependency Management",
					children: [
						{ label: "Updating Dependencies" },
						{ label: "Security Patches" },
						{ label: "Deprecation Handling" },
					],
				},
				{
					label: "Team Structure",
					children: [
						{ label: "Squad Organization" },
						{ label: "Ownership Boundaries" },
						{ label: "Communication Patterns" },
					],
				},
			],
		},
	],
};
