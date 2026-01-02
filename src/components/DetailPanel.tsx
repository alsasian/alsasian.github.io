import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TreeNode } from "../data/architecture";

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
				<div className="sticky top-0 bg-white dark:bg-neutral-950 border-b-2 border-neutral-900 dark:border-neutral-100 p-4 flex justify-between items-start z-10">
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
					{/* Short description */}
					{selectedItem.description && (
						<div className="mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 border-l-4 border-neutral-900 dark:border-neutral-100 rounded">
							<p className="font-serif text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
								{selectedItem.description}
							</p>
						</div>
					)}

					{/* Long-form markdown content */}
					{selectedItem.content ? (
						<div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:font-serif prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed prose-a:text-neutral-900 dark:prose-a:text-neutral-100 prose-a:underline prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 prose-code:font-mono prose-code:text-sm prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-300 dark:prose-pre:border-neutral-700 prose-pre:rounded prose-ul:font-serif prose-ol:font-serif prose-li:text-neutral-700 dark:prose-li:text-neutral-300 prose-blockquote:border-l-4 prose-blockquote:border-neutral-900 dark:prose-blockquote:border-neutral-100 prose-blockquote:pl-4 prose-blockquote:italic">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{selectedItem.content}
							</ReactMarkdown>
						</div>
					) : !selectedItem.description && (
						<div className="text-sm text-neutral-500 dark:text-neutral-400 italic font-serif">
							No detailed content available yet. This will be added soon.
						</div>
					)}

					{/* Child items if any */}
					{selectedItem.children && selectedItem.children.length > 0 && (
						<div className="mt-6 pt-6 border-t-2 border-neutral-300 dark:border-neutral-700">
							<h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-3">
								Sub-topics ({selectedItem.children.length})
							</h4>
							<ul className="space-y-2">
								{selectedItem.children.map((child, index) => (
									<li
										key={index}
										className="text-sm font-serif text-neutral-700 dark:text-neutral-300 pl-3 border-l-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors"
									>
										{child.label}
										{child.description && (
											<span className="block text-xs text-neutral-500 dark:text-neutral-400 mt-1">
												{child.description}
											</span>
										)}
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
