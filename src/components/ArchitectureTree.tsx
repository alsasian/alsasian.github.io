import { useState, useMemo } from "react";
import type { TreeNode } from "../data/architectureData";

interface TreeItemProps {
	node: TreeNode;
	level: number;
	searchTerm: string;
	expandedItems: Set<string>;
	onToggle: (path: string) => void;
	path: string;
}

function countChildren(node: TreeNode): number {
	if (!node.children || node.children.length === 0) return 0;
	return (
		node.children.length +
		node.children.reduce((sum, child) => sum + countChildren(child), 0)
	);
}

function TreeItem({
	node,
	level,
	searchTerm,
	expandedItems,
	onToggle,
	path,
}: TreeItemProps) {
	const hasChildren = node.children && node.children.length > 0;
	const childCount = countChildren(node);
	const isExpanded = expandedItems.has(path);
	const matchesSearch =
		!searchTerm || node.label.toLowerCase().includes(searchTerm.toLowerCase());

	const levelStyles = {
		0: "text-2xl font-bold",
		1: "text-xl font-semibold",
		2: "text-lg font-medium",
		3: "text-base",
	}[Math.min(level, 3)];

	return (
		<li className="my-1">
			<div
				className={`flex items-center px-3 py-2 rounded cursor-pointer transition-colors hover:bg-neutral-100 ${
					matchesSearch && searchTerm ? "bg-yellow-100" : ""
				}`}
				onClick={() => hasChildren && onToggle(path)}
			>
				<span className="w-5 h-5 mr-2 flex items-center justify-center text-xs text-neutral-600 flex-shrink-0">
					{hasChildren ? (isExpanded ? "▼" : "▶") : "●"}
				</span>
				<span className={`flex-1 ${levelStyles} font-serif text-neutral-900`}>
					{node.label}
				</span>
				{hasChildren && childCount > 0 && (
					<span className="bg-neutral-900 text-white px-2 py-0.5 rounded-full text-xs font-semibold ml-2">
						{childCount}
					</span>
				)}
			</div>
			{hasChildren && isExpanded && (
				<ul className="ml-7 border-l-2 border-neutral-200 pl-3">
					{node.children!.map((child, index) => (
						<TreeItem
							key={`${path}-${index}`}
							node={child}
							level={level + 1}
							searchTerm={searchTerm}
							expandedItems={expandedItems}
							onToggle={onToggle}
							path={`${path}-${index}`}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

interface ArchitectureTreeProps {
	data: TreeNode;
}

export default function ArchitectureTree({ data }: ArchitectureTreeProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["root"]));

	const expandAll = () => {
		const allPaths = new Set<string>();
		const collectPaths = (node: TreeNode, path: string) => {
			allPaths.add(path);
			if (node.children) {
				node.children.forEach((child, index) => {
					collectPaths(child, `${path}-${index}`);
				});
			}
		};
		collectPaths(data, "root");
		setExpandedItems(allPaths);
	};

	const collapseAll = () => {
		setExpandedItems(new Set());
	};

	const expandToLevel = (targetLevel: number) => {
		const paths = new Set<string>();
		const collectPathsToLevel = (node: TreeNode, path: string, currentLevel: number) => {
			if (currentLevel < targetLevel) {
				paths.add(path);
				if (node.children) {
					node.children.forEach((child, index) => {
						collectPathsToLevel(child, `${path}-${index}`, currentLevel + 1);
					});
				}
			}
		};
		collectPathsToLevel(data, "root", 0);
		setExpandedItems(paths);
	};

	const toggleItem = (path: string) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(path)) {
			newExpanded.delete(path);
		} else {
			newExpanded.add(path);
		}
		setExpandedItems(newExpanded);
	};

	const totalConcerns = useMemo(() => {
		const count = (node: TreeNode): number => {
			if (!node.children) return 1;
			return node.children.reduce((sum, child) => sum + count(child), 0);
		};
		return count(data);
	}, [data]);

	const majorCategories = data.children?.length || 0;

	return (
		<div className="w-full">
			{/* Info Box */}
			<div className="mb-6 p-4 bg-neutral-50 border-l-4 border-neutral-900 rounded">
				<h3 className="font-serif font-bold text-lg mb-2 text-neutral-900">
					How to Use
				</h3>
				<p className="font-serif text-neutral-700 leading-relaxed">
					Click on any category to expand/collapse its sub-items. Use the control
					buttons to expand or collapse all sections at once. Search to quickly find
					specific concerns. Each category shows the count of sub-items.
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="text-center p-4 bg-neutral-50 rounded">
					<div className="text-4xl font-bold font-serif text-neutral-900">
						{majorCategories}
					</div>
					<div className="text-sm text-neutral-600 mt-1 font-serif">
						Major Categories
					</div>
				</div>
				<div className="text-center p-4 bg-neutral-50 rounded">
					<div className="text-4xl font-bold font-serif text-neutral-900">
						{totalConcerns}+
					</div>
					<div className="text-sm text-neutral-600 mt-1 font-serif">
						Architectural Concerns
					</div>
				</div>
				<div className="text-center p-4 bg-neutral-50 rounded">
					<div className="text-4xl font-bold font-serif text-neutral-900">
						{totalConcerns * 2}+
					</div>
					<div className="text-sm text-neutral-600 mt-1 font-serif">
						Implementation Points
					</div>
				</div>
			</div>

			{/* Controls */}
			<div className="flex flex-wrap gap-2 mb-6 p-4 bg-neutral-50 rounded">
				<button
					onClick={expandAll}
					className="px-4 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-700 transition-colors"
				>
					Expand All
				</button>
				<button
					onClick={collapseAll}
					className="px-4 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-700 transition-colors"
				>
					Collapse All
				</button>
				<button
					onClick={() => expandToLevel(1)}
					className="px-4 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-700 transition-colors"
				>
					Level 1
				</button>
				<button
					onClick={() => expandToLevel(2)}
					className="px-4 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-700 transition-colors"
				>
					Level 2
				</button>
				<button
					onClick={() => expandToLevel(3)}
					className="px-4 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-700 transition-colors"
				>
					Level 3
				</button>
				<div className="flex-1 min-w-[250px] flex gap-2">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search concerns..."
						className="flex-1 px-4 py-2 border-2 border-neutral-200 rounded text-sm focus:outline-none focus:border-neutral-900 font-serif"
					/>
					<button
						onClick={() => setSearchTerm("")}
						className="px-4 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-700 transition-colors"
					>
						Clear
					</button>
				</div>
			</div>

			{/* Tree */}
			<div className="bg-neutral-50 rounded p-5 max-h-[800px] overflow-y-auto">
				<ul className="list-none">
					{data.children?.map((child, index) => (
						<TreeItem
							key={`root-${index}`}
							node={child}
							level={1}
							searchTerm={searchTerm}
							expandedItems={expandedItems}
							onToggle={toggleItem}
							path={`root-${index}`}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}
