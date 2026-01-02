export interface TreeNode {
	label: string;
	description?: string; // Short summary for tree display and previews
	content?: string; // Long-form markdown content for detail panel
	children?: TreeNode[];
}

export interface Pillar extends TreeNode {
	icon: string;
	color: "green" | "blue" | "orange" | "purple"; // Pillar theme color
}

// Pillar color mapping for UI
export const pillarColors = {
	green: {
		bg: "bg-green-50 dark:bg-green-950",
		border: "border-green-600 dark:border-green-400",
		text: "text-green-900 dark:text-green-100",
		accent: "text-green-600 dark:text-green-400",
	},
	blue: {
		bg: "bg-blue-50 dark:bg-blue-950",
		border: "border-blue-600 dark:border-blue-400",
		text: "text-blue-900 dark:text-blue-100",
		accent: "text-blue-600 dark:text-blue-400",
	},
	orange: {
		bg: "bg-orange-50 dark:bg-orange-950",
		border: "border-orange-600 dark:border-orange-400",
		text: "text-orange-900 dark:text-orange-100",
		accent: "text-orange-600 dark:text-orange-400",
	},
	purple: {
		bg: "bg-purple-50 dark:bg-purple-950",
		border: "border-purple-600 dark:border-purple-400",
		text: "text-purple-900 dark:text-purple-100",
		accent: "text-purple-600 dark:text-purple-400",
	},
} as const;
