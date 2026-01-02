export interface TreeNode {
	label: string;
	description?: string;
	children?: TreeNode[];
}

export interface Pillar extends TreeNode {
	icon: string;
	color: string;
}
