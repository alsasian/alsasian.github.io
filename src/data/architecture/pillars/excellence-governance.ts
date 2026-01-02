import type { Pillar } from "../types";

export const excellenceGovernance: Pillar = {
	label: "✅ EXCELLENCE & GOVERNANCE",
	icon: "✅",
	color: "purple",
	description:
		"Quality assurance and continuous improvement - How we ensure quality and maintain standards",
	children: [
		{
			label: "7. Quality & Testing",
			description: "Ensuring code quality and system reliability through testing.",
			children: [
				{
					label: "Testing Strategy",
					description: "Comprehensive testing approach.",
					children: [
						{ label: "Unit Tests", description: "Component-level testing." },
						{ label: "Integration Tests", description: "Inter-component testing." },
						{ label: "Contract Tests", description: "API contract validation." },
						{ label: "E2E Tests", description: "End-to-end user flows." },
					],
				},
				{
					label: "Test Data Management",
					description: "Managing test data effectively.",
					children: [
						{ label: "Multi-tenant Test Data", description: "Tenant-specific test scenarios." },
						{ label: "Data Privacy", description: "Protecting sensitive test data." },
					],
				},
				{
					label: "Automated Testing",
					description: "Test automation infrastructure.",
					children: [
						{ label: "CI/CD Integration", description: "Pipeline-integrated testing." },
						{ label: "Test Parallelization", description: "Concurrent test execution." },
						{ label: "Flaky Test Management", description: "Addressing unreliable tests." },
					],
				},
				{
					label: "Performance Testing",
					description: "Testing system performance.",
					children: [
						{ label: "Load Testing", description: "Sustained load testing." },
						{ label: "Stress Testing", description: "Breaking point analysis." },
						{ label: "Capacity Planning", description: "Growth capacity testing." },
					],
				},
				{
					label: "Chaos Engineering",
					description: "Testing system resilience.",
					children: [
						{ label: "Resilience Testing", description: "Failure scenario testing." },
						{ label: "Failure Injection", description: "Controlled fault introduction." },
						{ label: "DR Drills", description: "Disaster recovery exercises." },
					],
				},
				{
					label: "Quality Gates",
					description: "Quality thresholds and enforcement.",
					children: [
						{ label: "Code Coverage", description: "Test coverage requirements." },
						{ label: "Code Quality Metrics", description: "Static analysis standards." },
						{ label: "Security Scans", description: "Automated security checks." },
					],
				},
			],
		},
		{
			label: "10. Compliance & Governance",
			description: "Meeting regulatory requirements and governance standards.",
			children: [
				{
					label: "Regulatory Compliance",
					description: "Meeting industry regulations.",
					children: [
						{ label: "SOC 2", description: "Service Organization Control 2 compliance." },
						{ label: "ISO 27001", description: "Information security management." },
						{ label: "GDPR", description: "EU data protection regulation." },
						{ label: "CCPA", description: "California Consumer Privacy Act." },
						{ label: "Industry-specific", description: "Sector-specific regulations." },
					],
				},
				{
					label: "Audit Logging",
					description: "Compliance audit trails.",
					children: [
						{ label: "Audit Trails", description: "Comprehensive activity logging." },
						{ label: "Immutable Logs", description: "Tamper-proof log storage." },
						{ label: "Compliance Reporting", description: "Regulatory report generation." },
					],
				},
				{
					label: "Data Residency",
					description: "Geographic data storage requirements.",
					children: [
						{ label: "Geographic Storage", description: "Region-specific data storage." },
						{ label: "Data Sovereignty", description: "Legal jurisdiction compliance." },
					],
				},
				{
					label: "Access Controls",
					description: "Privileged access management.",
					children: [
						{ label: "Least Privilege", description: "Minimal permission principle." },
						{ label: "Separation of Duties", description: "Control segregation." },
						{ label: "Privileged Access Mgmt", description: "Admin access controls." },
					],
				},
				{
					label: "Change Management",
					description: "Controlled change processes.",
					children: [
						{ label: "Approval Workflows", description: "Change approval process." },
						{ label: "Change Documentation", description: "Change tracking and records." },
					],
				},
				{
					label: "Vendor Management",
					description: "Third-party vendor oversight.",
					children: [
						{ label: "Risk Assessment", description: "Vendor security evaluation." },
						{ label: "SLA Management", description: "Service level agreement tracking." },
						{ label: "Security Reviews", description: "Vendor security audits." },
					],
				},
				{
					label: "Legal & Contracts",
					description: "Legal agreements and terms.",
					children: [
						{ label: "Terms of Service", description: "User agreement terms." },
						{ label: "SLAs", description: "Service level agreements." },
						{
							label: "Data Processing Agreements",
							description: "GDPR DPA requirements.",
						},
					],
				},
			],
		},
		{
			label: "12. Cost Management",
			description: "Managing and optimizing infrastructure costs.",
			children: [
				{
					label: "Cost Monitoring",
					description: "Tracking spending across the platform.",
					children: [
						{ label: "Cost per Tenant", description: "Tenant-level cost attribution." },
						{ label: "Cost per Feature", description: "Feature cost analysis." },
						{ label: "Infrastructure Tracking", description: "Resource cost monitoring." },
					],
				},
				{
					label: "Resource Optimization",
					description: "Reducing infrastructure waste.",
					children: [
						{ label: "Right-sizing", description: "Optimal resource allocation." },
						{ label: "Reserved Instances", description: "Committed use discounts." },
						{ label: "Spot Instances", description: "Opportunistic compute savings." },
					],
				},
				{
					label: "Cost Allocation",
					description: "Attributing costs accurately.",
					children: [
						{ label: "Tagging Strategy", description: "Resource tagging for tracking." },
						{ label: "Chargeback", description: "Internal cost allocation." },
					],
				},
				{
					label: "Budget Management",
					description: "Financial planning and controls.",
					children: [
						{ label: "Budget Alerts", description: "Spending threshold notifications." },
						{ label: "Cost Forecasting", description: "Predicting future costs." },
						{ label: "Waste Identification", description: "Finding cost savings." },
					],
				},
			],
		},
		{
			label: "15. Development Process",
			description: "Software development practices and team processes.",
			children: [
				{
					label: "Code Standards",
					description: "Maintaining code quality standards.",
					children: [
						{ label: "Coding Conventions", description: "Style guide enforcement." },
						{ label: "Linting Rules", description: "Automated code quality checks." },
						{ label: "Code Review Process", description: "Peer review procedures." },
					],
				},
				{
					label: "Git Workflow",
					description: "Version control practices.",
					children: [
						{ label: "Branching Strategy", description: "Branch naming and lifecycle." },
						{ label: "PR Process", description: "Pull request workflow." },
						{ label: "Merge Policies", description: "Merge requirements and rules." },
					],
				},
				{
					label: "Documentation Standards",
					description: "Documentation requirements.",
					children: [
						{ label: "Architecture Docs", description: "System architecture documentation." },
						{ label: "API Docs", description: "API reference documentation." },
						{ label: "Runbooks", description: "Operational procedures." },
						{ label: "ADRs", description: "Architecture decision records." },
					],
				},
				{
					label: "Technical Debt Management",
					description: "Managing and reducing technical debt.",
					children: [
						{ label: "Tracking", description: "Technical debt inventory." },
						{ label: "Prioritization", description: "Debt reduction planning." },
						{ label: "Remediation Planning", description: "Debt paydown strategy." },
					],
				},
				{
					label: "Dependency Management",
					description: "Managing third-party dependencies.",
					children: [
						{ label: "Updating Dependencies", description: "Keeping libraries current." },
						{ label: "Security Patches", description: "Applying security updates." },
						{ label: "Deprecation Handling", description: "Managing deprecated packages." },
					],
				},
				{
					label: "Team Structure",
					description: "Organizing development teams.",
					children: [
						{ label: "Squad Organization", description: "Team structure and ownership." },
						{ label: "Ownership Boundaries", description: "Service ownership clarity." },
						{ label: "Communication Patterns", description: "Team collaboration practices." },
					],
				},
			],
		},
	],
};
