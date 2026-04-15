# @eduardotorresdev/sv-table

Micro-lib para construir tabelas reativas com paginação no Svelte 5.

## Instalação

```bash
yarn add @eduardotorresdev/sv-table
```

## Uso básico

```svelte
<script lang="ts">
	import { createTable, type TableColumn } from '@eduardotorresdev/sv-table';

	type Person = {
		name: string;
		email: string;
	};

	const columns: TableColumn[] = [
		{ id: 'name', label: 'Name', accessor: 'name' },
		{ id: 'email', label: 'Email', accessor: 'email' }
	];

	let pageState = $state({
		page: 1,
		perPage: 10
	});

	let rows = $state<Person[]>([
		{ name: 'Eduardo Torres', email: 'eduardo@example.com' },
		{ name: 'Ana Silva', email: 'ana@example.com' }
	]);

	const table = createTable<Person>({
		columns: () => columns,
		data: () => rows,
		rowCount: () => rows.length,
		pageState: () => pageState
	});
</script>

<table>
	<thead>
		<tr>
			{#each table.heading() as column}
				<th>{column.label}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each table.rows() as row}
			<tr>
				{#each row.columns as cell}
					<td>{cell.value}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
```

## API

### `createTable`

Cria uma estrutura reativa com:

- `heading()`
- `rows()`
- `canNext()`
- `canPrev()`
- `next()`
- `prev()`
- `jump(page)`
- `paginationItems()`

### `buildPagination`

Também pode ser usada isoladamente:

```ts
import { buildPagination } from '@eduardotorresdev/sv-table';

const pages = buildPagination({
	current: 5,
	total: 20,
	back: 2,
	forward: 3
});
```
