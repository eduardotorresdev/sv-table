export type TablePageItem = {
	label: string;
	page?: number;
};

export type TablePageBuilder = (list: TablePageItem[]) => TablePageItem[];

export function collectNearbyPages(
	current: number,
	total: number,
	back: number,
	forward: number
): number[] {
	const pages = new Set<number>();

	pages.add(current);

	for (let i = 1; i <= back; i++) pages.add(current - i);
	for (let i = 1; i <= forward; i++) pages.add(current + i);

	return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function withPageSequence(pages: number[]): TablePageBuilder {
	return (list) => {
		const result = [...list];
		let prev: number | null = null;

		for (const page of pages) {
			if (prev !== null && page - prev > 1) {
				result.push({ label: '...' });
			}
			result.push({ label: String(page), page });
			prev = page;
		}

		return result;
	};
}

export function buildPagination({
	current,
	total,
	back = 2,
	forward = 5
}: {
	current: number;
	total: number;
	back?: number;
	forward?: number;
}): TablePageItem[] {
	const nearby = collectNearbyPages(current, total, back, forward);

	const pipeline: TablePageBuilder[] = [withPageSequence(nearby)];

	return pipeline.reduce<TablePageItem[]>((acc, step) => step(acc), []);
}
