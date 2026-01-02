import { useState, useMemo } from "react";
import type { TreeNode } from "../data/architecture";
import DetailPanel from "./DetailPanel";

interface TreeItemProps {
	node: TreeNode;
	level: number;
	searchTerm: string;
	expandedItems: Set<string>;
	selectedPath: string | null;
	onToggle: (path: string) => void;
	onSelect: (node: TreeNode, path: string) => void;
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
	selectedPath,
	onToggle,
	onSelect,
	path,
}: TreeItemProps) {
	const hasChildren = node.children && node.children.length > 0;
	const childCount = countChildren(node);
	const isExpanded = expandedItems.has(path);
	const isSelected = selectedPath === path;
	const matchesSearch =
		!searchTerm || node.label.toLowerCase().includes(searchTerm.toLowerCase());

	const levelStyles = {
		0: "text-2xl font-bold",
		1: "text-xl font-semibold",
		2: "text-lg font-medium",
		3: "text-base",
	}[Math.min(level, 3)];

	const handleClick = () => {
		if (hasChildren) {
			onToggle(path);
		}
		onSelect(node, path);
	};

	return (
		<li className="my-1">
			<div
				className={`flex items-center px-3 py-2 rounded cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
					matchesSearch && searchTerm ? "bg-yellow-100 dark:bg-yellow-900" : ""
				} ${isSelected ? "bg-neutral-200 dark:bg-neutral-700" : ""}`}
				onClick={handleClick}
			>
				<span className="w-5 h-5 mr-2 flex items-center justify-center text-xs text-neutral-600 dark:text-neutral-400 flex-shrink-0">
					{hasChildren ? (isExpanded ? "▼" : "▶") : "●"}
				</span>
				<span className={`flex-1 ${levelStyles} font-serif text-neutral-900 dark:text-neutral-100`}>
					{node.label}
				</span>
				{hasChildren && childCount > 0 && (
					<span className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-0.5 rounded-full text-xs font-semibold ml-2">
						{childCount}
					</span>
				)}
			</div>
			{hasChildren && isExpanded && (
				<ul className="ml-7 border-l-2 border-neutral-200 dark:border-neutral-700 pl-3">
					{node.children!.map((child, index) => (
						<TreeItem
							key={`${path}-${index}`}
							node={child}
							level={level + 1}
							searchTerm={searchTerm}
							expandedItems={expandedItems}
							selectedPath={selectedPath}
							onToggle={onToggle}
							onSelect={onSelect}
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
	const [selectedItem, setSelectedItem] = useState<TreeNode | null>(null);
	const [selectedPath, setSelectedPath] = useState<string | null>(null);

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

	const handleSelect = (node: TreeNode, path: string) => {
		setSelectedItem(node);
		setSelectedPath(path);
	};

	const handleClosePanel = () => {
		setSelectedItem(null);
		setSelectedPath(null);
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
		<div className="w-full flex flex-col md:flex-row gap-4">
			{/* Main content */}
			<div className="flex-1 min-w-0">
				{/* Info Box */}
				<div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 border-l-4 border-neutral-900 dark:border-neutral-100 rounded">
					<h3 className="font-serif font-bold text-lg mb-2 text-neutral-900 dark:text-neutral-100">
						How to Use
					</h3>
					<p className="font-serif text-neutral-700 dark:text-neutral-300 leading-relaxed">
						Click on any item to view details in the side panel. Click categories to
						expand/collapse sub-items. Use the controls to manage sections and search.
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
						<div className="text-4xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
							{majorCategories}
						</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-serif">
							Major Categories
						</div>
					</div>
					<div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
						<div className="text-4xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
							{totalConcerns}+
						</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-serif">
							Architectural Concerns
						</div>
					</div>
					<div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
						<div className="text-4xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
							{totalConcerns * 2}+
						</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-serif">
							Implementation Points
						</div>
					</div>
				</div>

				{/* Controls */}
				<div className="flex flex-wrap gap-2 mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded">
					<button
						onClick={expandAll}
						className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
					>
						Expand All
					</button>
					<button
						onClick={collapseAll}
						className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
					>
						Collapse All
					</button>
					<button
						onClick={() => expandToLevel(1)}
						className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
					>
						Level 1
					</button>
					<button
						onClick={() => expandToLevel(2)}
						className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
					>
						Level 2
					</button>
					<button
						onClick={() => expandToLevel(3)}
						className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
					>
						Level 3
					</button>
					<div className="flex-1 min-w-[250px] flex gap-2">
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search concerns..."
							className="flex-1 px-4 py-2 border-2 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 rounded text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-serif"
						/>
						<button
							onClick={() => setSearchTerm("")}
							className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded font-medium text-sm hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
						>
							Clear
						</button>
					</div>
				</div>

				{/* Tree */}
				<div className="bg-neutral-50 dark:bg-neutral-800 rounded p-5 max-h-[800px] overflow-y-auto">
					<ul className="list-none">
						{data.children?.map((child, index) => (
							<TreeItem
								key={`root-${index}`}
								node={child}
								level={1}
								searchTerm={searchTerm}
								expandedItems={expandedItems}
								selectedPath={selectedPath}
								onToggle={toggleItem}
								onSelect={handleSelect}
								path={`root-${index}`}
							/>
						))}
					</ul>
				</div>
			</div>

			{/* Detail Panel */}
			{selectedItem && (
				<DetailPanel selectedItem={selectedItem} onClose={handleClosePanel} />
			)}
		</div>
	);
}
