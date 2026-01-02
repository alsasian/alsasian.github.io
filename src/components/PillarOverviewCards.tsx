import type { Pillar } from "../data/architecture";
import { pillarColors } from "../data/architecture/types";

interface PillarOverviewCardsProps {
	pillars: Pillar[];
}

function countChildren(node: { children?: any[] }): number {
	if (!node.children || node.children.length === 0) return 0;
	return (
		node.children.length +
		node.children.reduce((sum, child) => sum + countChildren(child), 0)
	);
}

export default function PillarOverviewCards({ pillars }: PillarOverviewCardsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			{pillars.map((pillar, index) => {
				const colors = pillarColors[pillar.color];
				const categoryCount = pillar.children?.length || 0;
				const totalItems = countChildren(pillar);

				return (
					<div
						key={index}
						className={`${colors.bg} border-l-4 ${colors.border} rounded p-4 transition-transform hover:scale-105 hover:shadow-md`}
					>
						<div className="flex items-start gap-3 mb-2">
							<span className="text-2xl flex-shrink-0">{pillar.icon}</span>
							<h3 className={`font-serif font-bold text-sm leading-tight ${colors.text}`}>
								{pillar.label.replace(/^[🎯🏗️⚙️✅]\s*/, "")}
							</h3>
						</div>
						{pillar.description && (
							<p className={`text-xs font-serif leading-relaxed mb-3 ${colors.text} opacity-80`}>
								{pillar.description}
							</p>
						)}
						<div className="flex items-center justify-between text-xs">
							<span className={`font-medium ${colors.accent}`}>
								{categoryCount} {categoryCount === 1 ? "category" : "categories"}
							</span>
							<span className="text-neutral-500 dark:text-neutral-400">
								{totalItems} items
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
