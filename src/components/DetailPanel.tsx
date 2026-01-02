import type { TreeNode } from "../data/architectureData";

interface DetailPanelProps {
	selectedItem: TreeNode | null;
	onClose: () => void;
}

export default function DetailPanel({ selectedItem, onClose }: DetailPanelProps) {
	if (!selectedItem) return null;

	return (
		<>
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
				onClick={onClose}
			/>

			{/* Panel */}
			<div className="fixed md:sticky md:top-0 bottom-0 md:bottom-auto right-0 w-full md:w-96 h-2/3 md:h-screen bg-white dark:bg-neutral-950 border-t-2 md:border-t-0 md:border-l-2 border-neutral-900 dark:border-neutral-100 z-50 md:z-auto overflow-y-auto shadow-lg md:shadow-none animate-slide-up md:animate-slide-left">
				{/* Header */}
				<div className="sticky top-0 bg-white dark:bg-neutral-950 border-b-2 border-neutral-900 dark:border-neutral-100 p-4 flex justify-between items-start">
					<h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-neutral-100 pr-4">
						{selectedItem.label}
					</h3>
					<button
						onClick={onClose}
						className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
						aria-label="Close details"
					>
						✕
					</button>
				</div>

				{/* Content */}
				<div className="p-4">
					{selectedItem.description ? (
						<div className="prose prose-sm max-w-none">
							<p className="font-serif text-neutral-700 dark:text-neutral-300 leading-relaxed">
								{selectedItem.description}
							</p>
						</div>
					) : (
						<div className="text-sm text-neutral-500 dark:text-neutral-400 italic font-serif">
							No description available yet. This content will be added soon.
						</div>
					)}

					{/* Child items if any */}
					{selectedItem.children && selectedItem.children.length > 0 && (
						<div className="mt-6 pt-6 border-t border-neutral-300 dark:border-neutral-700">
							<h4 className="font-serif font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-3">
								Sub-topics ({selectedItem.children.length})
							</h4>
							<ul className="space-y-2">
								{selectedItem.children.map((child, index) => (
									<li
										key={index}
										className="text-sm font-serif text-neutral-700 dark:text-neutral-300 pl-3 border-l-2 border-neutral-300 dark:border-neutral-700"
									>
										{child.label}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
