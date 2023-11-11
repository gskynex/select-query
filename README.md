# @njs-lib/query-builder

## Purpose

The main purpose of the QueryBuilder library is to streamline the process of working with collections of objects by offering a set of convenient methods that allow you to perform common operations efficiently. Whether you need to extract specific properties, filter data, paginate results, or perform other data-related tasks, the QueryBuilder library can help simplify your code and improve code readability.

## Features

- Efficient Querying: Simplify data querying and filtering for arrays of objects.
- Data Manipulation: Perform common data manipulation tasks, such as property selection and summation.
- Pagination: Implement pagination for large datasets with ease.
- Type Safety: Ensure robust and safe data operations.

## Installation

You can install the library using npm.

Using npm:

```shell
npm install @njs-lib/query-builder --save
```

## QueryBuilder Class

The **QueryBuilder** provides utility methods for querying and manipulating collections of objects.

### Constructor

#### `new QueryBuilder()`

Creates a new QueryBuilder instance with the given collection.

- `collection`: An array of objects to be used for querying.

### Methods

#### `first(): T | undefined`

Gets the first element of the collection.

#### `last(): T | undefined`

Gets the last element of the collection.

#### `get(): T[]`

Gets all elements in the collection.

#### `count(): number`

Gets the number of elements in the collection.

#### `limit(limit: number): QueryBuilder<T>`

Limits the number of objects in the collection to a specified maximum.

#### `offset(offset: number): QueryBuilder<T>`

Offsets the collection by a specified number of objects.

#### `paginate(pageNumber: number, pageSize: number): QueryBuilder<T>`

Paginates the collection based on a page number and page size.

#### `where(key: keyof T, operator: ComparisonOperator, value: unknown): QueryBuilder<T>`

Filters the collection based on a specified condition.

#### `sum(key: keyof T): number`

Calculates the sum of the values for a specified property in the collection.

#### `select<K extends keyof T>(...keys: K[]): QueryBuilder<Pick<T, K>>`

Selects specific properties from each object in the collection and returns a new QueryBuilder instance.

#### `keyBy<K extends keyof T>(key: K): Record<T[K]), T>`

Groups elements in a collection based on a specified key.

### Example

```javascript
import { QueryBuilder } from '@njs-lib/query-builder';

const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

new QueryBuilder(data).count();
// Output: 3

new QueryBuilder(data).first();
// Output:
// { id: 1, name: 'Jak', age: 30 }

new QueryBuilder(data).last();
// Output:
// { id: 4, name: 'Sam', age: 20 },

new QueryBuilder(data).get();
// Output: 
// [
//   { id: 1, name: 'Jak', age: 30 },
//   { id: 2, name: 'Bob', age: 25 },
//   { id: 3, name: 'Tom', age: 20 },
//   { id: 4, name: 'Sam', age: 20 },
// ]

new QueryBuilder(data).limit(2).get();
// Output: 
// [
//   { id: 1, name: 'Jak', age: 30 },
//   { id: 2, name: 'Bob', age: 25 },
// ]

new QueryBuilder(data).paginate(2, 2).get();
// Output: 
// [
//   { id: 3, name: 'Tom', age: 20 },
//   { id: 4, name: 'Sam', age: 20 },
// ]

new QueryBuilder(data).where('age', '=', 20).sum('age');
// Output: 40

new QueryBuilder(data).where('age', '=', 20).select('name').get();
// Output: 
// [{ name: 'Tom' }, { name: 'Sam' }]

new QueryBuilder(data).where('age', '=', 20).keyBy('id');
// Output: 
// {
//   1: { id: 1, name: 'Jak', age: 30 },
//   2: { id: 2, name: 'Bob', age: 25 },
//   3: { id: 3, name: 'Tom', age: 20 },
//   4: { id: 4, name: 'Sam', age: 20 },
// }
```