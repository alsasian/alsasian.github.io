import type { TreeNode } from "./types";
import { strategyBusiness } from "./pillars/strategy-business";
import { technicalFoundation } from "./pillars/technical-foundation";
import { operationsReliability } from "./pillars/operations-reliability";
import { excellenceGovernance } from "./pillars/excellence-governance";

export type { TreeNode, Pillar } from "./types";

export const architectureData: TreeNode = {
	label: "B2B SaaS Platform Architecture",
	description:
		"Comprehensive architectural framework for building scalable, secure, and maintainable B2B SaaS platforms.",
	children: [strategyBusiness, technicalFoundation, operationsReliability, excellenceGovernance],
};

// Export individual pillars for reference
export { strategyBusiness, technicalFoundation, operationsReliability, excellenceGovernance };
