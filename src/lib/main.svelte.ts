import { buildPagination } from './pagination.js';

export type TableColumn = {
	accessor: string;
	id: string;
	label: string;
	visible?: boolean;
};

export type TableProps<T> = {
	pageState: () => {
		page: number;
		perPage: number;
	};
	data: () => T[];
	columns: () => TableColumn[] | TableColumn[];
	rowCount: () => number;
};

const getByPath = (obj: unknown, path: string): unknown =>
	path.split('.').reduce<unknown>((acc, key) => {
		if (!acc || typeof acc !== 'object') {
			return undefined;
		}

		return (acc as Record<string, unknown>)[key];
	}, obj);

const createCells = <T>(columns: TableColumn[], row: T) => {
	return columns.map((column) => ({
		id: column.id,
		label: column.label,
		value: getByPath(row, column.accessor),
		row
	}));
};

export const createTable = <T>({
	columns: columnsBuilder,
	data,
	rowCount,
	pageState
}: TableProps<T>) => {
	const columns = $derived(
		typeof columnsBuilder === 'function' ? columnsBuilder() : columnsBuilder
	);
	const visibleColumns = $derived(columns.filter((column) => column.visible !== false));
	const heading = $derived(
		visibleColumns.map(({ label }) => ({
			label
		}))
	);
	const rows = $derived(
		data().map((item, index) => ({
			index,
			columns: createCells(visibleColumns, item),
			raw: item
		}))
	);
	const canNext = $derived(pageState().page * pageState().perPage < rowCount());
	const canPrev = $derived(pageState().page > 1);

	const next = () => {
		pageState().page = Math.min(pageState().page + 1, Math.ceil(rowCount() / pageState().perPage));
	};
	const prev = () => {
		pageState().page = Math.max(pageState().page - 1, 1);
	};
	const jump = (page: number) => {
		pageState().page = Math.min(Math.max(page, 1), Math.ceil(rowCount() / pageState().perPage));
	};

	return {
		heading: () => heading,
		canNext: () => canNext,
		canPrev: () => canPrev,
		next,
		prev,
		jump,
		rows: () => rows,
		paginationItems: () =>
			buildPagination({
				current: pageState().page,
				total: Math.ceil(rowCount() / pageState().perPage)
			})
	};
};
