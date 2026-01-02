import type { Pillar } from "../types";

export const technicalFoundation: Pillar = {
	label: "🏗️ TECHNICAL FOUNDATION",
	icon: "🏗️",
	color: "blue",
	description: "Architecture, infrastructure, and security - How we architect and build it",
	children: [
		{
			label: "2. Architecture & Design Patterns",
			description: "Core architectural decisions and design patterns.",
			children: [
				{
					label: "Overall Architecture Style",
					description: "High-level architectural approach.",
					children: [
						{ label: "Monolith", description: "Single deployable application." },
						{ label: "Modular Monolith", description: "Logically separated but physically together." },
						{ label: "Microservices", description: "Distributed, independently deployable services." },
						{ label: "Hybrid", description: "Combination of architectural styles." },
					],
				},
				{
					label: "Multi-Tenancy Pattern",
					description: "How tenant data is isolated and managed.",
					children: [
						{
							label: "Shared DB + Discriminator",
							description: "Single database with tenant ID columns.",
						},
						{
							label: "Schema-per-Tenant",
							description: "Separate schemas within same database.",
						},
						{ label: "DB-per-Tenant", description: "Completely separate databases per tenant." },
					],
				},
				{
					label: "Domain Model Design",
					description: "Domain-driven design principles.",
					children: [
						{ label: "Bounded Contexts", description: "Logical boundaries in the domain model." },
						{
							label: "Aggregates",
							description: "Cluster of objects treated as a single unit.",
						},
						{ label: "Entities", description: "Objects with unique identity." },
						{ label: "Value Objects", description: "Immutable objects without identity." },
					],
				},
				{
					label: "API Architecture",
					description: "API design and communication patterns.",
					children: [
						{ label: "REST", description: "RESTful API design principles." },
						{ label: "GraphQL", description: "Query language for APIs." },
						{ label: "Sync vs Async", description: "Synchronous vs asynchronous communication." },
					],
				},
				{
					label: "Event-Driven Architecture",
					description: "Event-based communication and processing.",
					children: [
						{ label: "Event Operations", description: "Publishing and consuming events." },
						{ label: "Event Schema", description: "Event data structure and versioning." },
						{ label: "Event Sourcing", description: "Storing state as sequence of events." },
					],
				},
				{
					label: "Integration Patterns",
					description: "System integration approaches.",
					children: [
						{ label: "Sync/Async", description: "Synchronous vs asynchronous integration." },
						{ label: "Direct/Message-based", description: "Point-to-point vs message queue." },
					],
				},
				{
					label: "Data Consistency Strategy",
					description: "Managing consistency in distributed systems.",
					children: [
						{ label: "CAP Tradeoffs", description: "Consistency, availability, partition tolerance." },
						{
							label: "Eventual Consistency",
							description: "Data becomes consistent over time.",
						},
						{
							label: "Transaction Scopes",
							description: "Boundaries of atomic operations.",
						},
					],
				},
			],
		},
		{
			label: "3. Technical Infrastructure",
			description: "Core infrastructure components and services.",
			children: [
				{
					label: "Technology Stack",
					description: "Chosen technologies for platform development.",
					children: [
						{ label: "Backend Framework", description: "Server-side framework selection." },
						{ label: "Frontend Framework", description: "Client-side framework selection." },
						{ label: "Databases", description: "Data storage technology choices." },
						{ label: "Message Brokers", description: "Asynchronous messaging infrastructure." },
					],
				},
				{
					label: "Hosting Strategy",
					description: "Where and how the platform is hosted.",
					children: [
						{ label: "Cloud Provider", description: "AWS, Azure, GCP selection." },
						{ label: "Regions", description: "Geographic distribution strategy." },
						{ label: "Multi-region", description: "Cross-region deployment approach." },
						{ label: "Hybrid Cloud", description: "On-premise and cloud combination." },
					],
				},
				{
					label: "Container Orchestration",
					description: "Container management and deployment.",
					children: [
						{ label: "Kubernetes", description: "Container orchestration platform." },
						{ label: "Managed Services", description: "Cloud-managed container services." },
						{ label: "Serverless", description: "Function-as-a-Service platforms." },
					],
				},
				{
					label: "Networking",
					description: "Network infrastructure and connectivity.",
					children: [
						{ label: "VPCs", description: "Virtual private cloud configuration." },
						{ label: "Load Balancers", description: "Traffic distribution mechanisms." },
						{ label: "CDN", description: "Content delivery network setup." },
						{ label: "API Gateway", description: "API routing and management layer." },
					],
				},
				{
					label: "Database Architecture",
					description: "Database setup and optimization.",
					children: [
						{ label: "Primary DB", description: "Main database configuration." },
						{ label: "Read Replicas", description: "Read scaling strategy." },
						{ label: "Caching Layer", description: "In-memory caching setup." },
						{ label: "Search Engine", description: "Full-text search implementation." },
					],
				},
				{
					label: "Message Infrastructure",
					description: "Asynchronous messaging setup.",
					children: [
						{ label: "Broker Selection", description: "Message broker technology choice." },
						{ label: "Queue vs Topic", description: "Point-to-point vs pub/sub patterns." },
						{ label: "Dead Letter Queues", description: "Failed message handling." },
					],
				},
				{
					label: "File Storage",
					description: "File and document storage solutions.",
					children: [
						{ label: "Object Storage", description: "S3-compatible storage setup." },
						{ label: "Documents", description: "Document management system." },
						{ label: "Attachments", description: "User upload handling." },
					],
				},
				{
					label: "DNS & Certificates",
					description: "Domain management and SSL/TLS.",
					children: [
						{ label: "Custom Domains", description: "Tenant-specific domain support." },
						{ label: "SSL/TLS Automation", description: "Certificate management and renewal." },
					],
				},
			],
		},
		{
			label: "4. Security Concerns",
			description: "Security measures and threat protection.",
			children: [
				{
					label: "Authentication",
					description: "User identity verification.",
					children: [
						{ label: "User Auth", description: "End-user authentication mechanisms." },
						{ label: "API Auth", description: "Service-to-service authentication." },
						{ label: "SSO/SAML/OIDC", description: "Enterprise single sign-on integration." },
						{ label: "MFA", description: "Multi-factor authentication setup." },
					],
				},
				{
					label: "Authorization",
					description: "Access control and permissions.",
					children: [
						{ label: "RBAC", description: "Role-based access control." },
						{ label: "ABAC", description: "Attribute-based access control." },
						{ label: "Permission Hierarchy", description: "Nested permission structures." },
						{
							label: "Tenant vs User Permissions",
							description: "Multi-level authorization model.",
						},
					],
				},
				{
					label: "API Security",
					description: "Protecting API endpoints.",
					children: [
						{ label: "API Keys", description: "API key generation and validation." },
						{ label: "OAuth2", description: "OAuth 2.0 implementation." },
						{ label: "Token Management", description: "JWT and token lifecycle." },
						{ label: "Rate Limiting", description: "Throttling and quota enforcement." },
						{ label: "IP Whitelisting", description: "Network-level access control." },
					],
				},
				{
					label: "Data Encryption",
					description: "Protecting data confidentiality.",
					children: [
						{ label: "At Rest", description: "Storage encryption mechanisms." },
						{ label: "In Transit", description: "TLS/SSL encryption." },
						{ label: "Field-level", description: "Sensitive field encryption." },
						{ label: "Key Management", description: "Encryption key rotation and storage." },
					],
				},
				{
					label: "Tenant Isolation",
					description: "Preventing cross-tenant data access.",
					children: [
						{ label: "Code-level", description: "Application-layer isolation." },
						{ label: "Database-level", description: "Physical or logical separation." },
						{ label: "Network Segmentation", description: "Network-layer isolation." },
					],
				},
				{
					label: "Secrets Management",
					description: "Managing sensitive credentials.",
					children: [
						{ label: "Credential Storage", description: "Secure secrets storage solutions." },
						{ label: "Rotation", description: "Automated credential rotation." },
						{ label: "Certificates", description: "Certificate management." },
					],
				},
				{
					label: "Security Scanning",
					description: "Automated security testing.",
					children: [
						{ label: "SAST", description: "Static application security testing." },
						{ label: "DAST", description: "Dynamic application security testing." },
						{
							label: "Dependency Vulnerabilities",
							description: "Third-party library scanning.",
						},
						{ label: "Container Scanning", description: "Container image vulnerability scanning." },
					],
				},
				{
					label: "Penetration Testing",
					description: "Manual security assessment.",
					children: [
						{ label: "Security Audits", description: "Regular security reviews." },
						{ label: "Bug Bounty", description: "Crowdsourced security testing." },
					],
				},
				{
					label: "Incident Response",
					description: "Security incident handling.",
					children: [
						{ label: "Playbooks", description: "Incident response procedures." },
						{ label: "Breach Notification", description: "Communication protocols." },
					],
				},
			],
		},
		{
			label: "5. Data Management",
			description: "Data storage, lifecycle, and governance.",
			children: [
				{
					label: "Data Modeling",
					description: "Database schema design.",
					children: [
						{ label: "Multi-tenant Schema", description: "Tenant data organization." },
						{ label: "Normalization", description: "Reducing data redundancy." },
						{ label: "Denormalization", description: "Performance optimization." },
					],
				},
				{
					label: "Database Migration",
					description: "Schema evolution strategies.",
					children: [
						{ label: "Zero-downtime", description: "Migrations without service interruption." },
						{ label: "Rollback Procedures", description: "Migration reversal process." },
						{
							label: "Multi-tenant Considerations",
							description: "Tenant-specific migration challenges.",
						},
					],
				},
				{
					label: "Data Validation",
					description: "Ensuring data integrity.",
					children: [
						{ label: "Input Validation", description: "Request data validation." },
						{ label: "Business Rules", description: "Domain logic enforcement." },
						{ label: "Referential Integrity", description: "Foreign key constraints." },
					],
				},
				{
					label: "Data Lifecycle",
					description: "Data retention and archival.",
					children: [
						{ label: "Archival Policies", description: "Long-term data storage." },
						{ label: "Retention", description: "Data retention periods." },
						{ label: "Soft vs Hard Deletes", description: "Deletion strategies." },
					],
				},
				{
					label: "Backup & Recovery",
					description: "Data protection and disaster recovery.",
					children: [
						{ label: "Backup Frequency", description: "Backup schedule and strategy." },
						{ label: "Retention Periods", description: "Backup retention policies." },
						{ label: "Restore Procedures", description: "Data recovery processes." },
						{
							label: "Tenant-specific Restores",
							description: "Granular recovery capabilities.",
						},
					],
				},
				{
					label: "Data Consistency",
					description: "Maintaining data correctness.",
					children: [
						{
							label: "Distributed Transactions",
							description: "Cross-service transaction handling.",
						},
						{ label: "Saga Patterns", description: "Long-running transaction management." },
						{
							label: "Compensating Transactions",
							description: "Rollback mechanisms.",
						},
					],
				},
				{
					label: "Data Privacy",
					description: "Protecting user privacy.",
					children: [
						{ label: "PII Handling", description: "Personal information management." },
						{ label: "Anonymization", description: "Data anonymization techniques." },
						{ label: "Right to be Forgotten", description: "GDPR deletion compliance." },
					],
				},
				{
					label: "Master Data Management",
					description: "Centralized reference data.",
					children: [
						{ label: "Product Catalogs", description: "Product information management." },
						{ label: "Pricing Rules", description: "Centralized pricing data." },
						{ label: "Reference Data Sync", description: "Cross-system synchronization." },
					],
				},
			],
		},
		{
			label: "6. Integration Concerns",
			description: "System integration and external connectivity.",
			children: [
				{
					label: "Internal System Integration",
					description: "Connecting with internal systems.",
					children: [
						{ label: "Product Systems", description: "Product management integration." },
						{ label: "Pricing Engines", description: "Pricing calculation systems." },
						{ label: "Inventory", description: "Inventory management connectivity." },
						{ label: "ERP", description: "Enterprise resource planning integration." },
						{ label: "CRM", description: "Customer relationship management sync." },
					],
				},
				{
					label: "Integration Reliability",
					description: "Resilient integration patterns.",
					children: [
						{ label: "Circuit Breakers", description: "Failure containment mechanisms." },
						{ label: "Retries", description: "Automatic retry strategies." },
						{ label: "Timeouts", description: "Request timeout configuration." },
						{ label: "Fallback Mechanisms", description: "Graceful degradation." },
					],
				},
				{
					label: "Data Synchronization",
					description: "Keeping data consistent across systems.",
					children: [
						{ label: "Real-time vs Batch", description: "Sync frequency strategy." },
						{ label: "Conflict Resolution", description: "Handling data conflicts." },
						{ label: "Eventual Consistency", description: "Delayed synchronization model." },
					],
				},
				{
					label: "Idempotency",
					description: "Preventing duplicate operations.",
					children: [
						{ label: "Duplicate Prevention", description: "Idempotent API design." },
						{ label: "Request Handling", description: "Deduplication mechanisms." },
					],
				},
				{
					label: "API Contract Management",
					description: "Managing API changes.",
					children: [
						{ label: "Version Handling", description: "API versioning strategy." },
						{ label: "Breaking Changes", description: "Backward compatibility management." },
					],
				},
				{
					label: "Webhook Implementation",
					description: "Event notification mechanisms.",
					children: [
						{ label: "Outbound Notifications", description: "Event-driven webhooks." },
						{ label: "Delivery Guarantees", description: "At-least-once delivery." },
						{ label: "Retry Logic", description: "Webhook retry strategies." },
					],
				},
				{
					label: "Third-Party Services",
					description: "External service integrations.",
					children: [
						{ label: "Payment Gateways", description: "Payment processing integration." },
						{ label: "Email Services", description: "Transactional email providers." },
						{ label: "SMS", description: "SMS notification services." },
						{ label: "Document Generation", description: "PDF generation services." },
					],
				},
			],
		},
	],
};
