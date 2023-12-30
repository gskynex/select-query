## @njs-lib/select-query

### Overview

The library provides a flexible and powerful set of tools for querying and manipulating collections of objects in TypeScript. Whether you need to filter, paginate, or perform complex queries, this library offers an intuitive interface and extensive features.

**Features**

- Construct queries with a variety of comparison operators.
- Easily manipulate and filter object collections based on specific criteria.
- Perform data manipulation operations on collections.
- Calculate sums, select specific properties, and group elements by key.
- Implement pagination with methods to limit and offset the collection.
- Benefit from type safety and enhanced code completion when using TypeScript.

### Installation

You can install the library using npm.

#### Using npm:

```shell
npm install @njs-lib/select-query --save
```

For more information on using `npm` check out the docs [here](https://docs.npmjs.com/cli/v10/commands/npm-install).

### SelectQuery Class

The **SelectQuery** provides utility methods for querying and manipulating collections of objects.

#### Constructor

##### `new SelectQuery([])`

Creates a new instance of SelectQuery with the provided collection.

- @param `collection`: An array of objects to be used for querying.

#### Methods

#### `first(): T | undefined`

Gets the first element of the collection.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).first();

// RESULT { id: 1, name: 'Jak', age: 30 };
```

#### `last(): T | undefined`

Gets the last element of the collection.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).last();

// RESULT { id: 4, name: 'Sam', age: 20 };
```

#### `get(): T[]`

Gets all elements in the collection.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).last();

/* RESULT
[
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
]; 
*/
```

#### `count(): number`

Gets the number of elements in the collection.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).count();

// RESULT 4
```

#### `limit(limit: number): SelectQuery<T>`

Limits the number of objects in the collection to a specified maximum.

- @param `limit` The maximum number of objects to include in the collection

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).limit(2).get();

/* RESULT 
[
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]
*/
```

#### `offset(offset: number): SelectQuery<T>`

Offsets the collection by a specified number of objects.

- @param `offset` The number of objects to skip from the beginning of the collection.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).offset(2).get();

/* RESULT 
[
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
]
*/
```

#### `paginate(num: number, size: number): SelectQuery<T>`

Paginates the collection based on a page number and page size.

- @param `num` The page number (1-based).
- @param `size` The number of objects per page.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).paginate(2, 2).get();

/* RESULT 
[
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
]
*/
```

#### `sum(key: K): number`

Calculates the sum of the values for a specified property in the collection.

- @param `key` The property key whose values are to be summed up.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).where('age', '===', 20).sum('age');

// RESULT 40
```

#### `select(...keys: K[]): SelectQuery<Pick<T, K>>`

Selects specific properties from each object in the collection and returns a new SelectQuery instance.

- @param `keys` The keys (properties) to select.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).select('name').get();

/* RESULT
[
  { name: 'Jak' },
  { name: 'Bob' },
  { name: 'Tom' },
  { name: 'Sam' },
];
*/
```

#### `keyBy(key: K): Record<T[K]), T>`

Groups elements in a collection based on a specified key.

- @param `key` The key (property name) by which to group elements.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).keyBy('id');

/* RESULT
{
  1: { id: 1, name: 'Jak', age: 30 },
  2: { id: 2, name: 'Bob', age: 25 },
  3: { id: 3, name: 'Tom', age: 20 },
  4: { id: 4, name: 'Sam', age: 20 },
};
*/
```

#### `where(key: K, operator: Operator, value: T[K]): SelectQuery<T>`

Filters the collection based on a specified condition.

- @param `key` The key (property name) to compare.
- @param `operator` The comparison operator.
- @param `value` The value to compare against.

```js
const data = [
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Tom', age: 20 },
  { id: 4, name: 'Sam', age: 20 },
];

const result = new SelectQuery(data).where('id', '===', 1).get();

// RESULT [{ id: 1, name: 'Jak', age: 30 }];

const result = new SelectQuery(data).where('age', '>', 20).get();

/* RESULT
[
  { id: 1, name: 'Jak', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
];
*/
```

#### `static getOperators(): Operator[]`

Returns an array of valid operators for comparisons.

```js
new SelectQuery.getOperators();

// RESULT ['===', '!==', '<', '<=', '>', '>=', 'like', '^like', 'like$'];
```

### Comparison operators

| Value   | Description                                                                            |
|---------|----------------------------------------------------------------------------------------|
| `===`   | Checks if the specified property of an item is equal to a given value.                 |
| `!==`   | Checks if the specified property of an item is not equal to a given value.             |
| `<`     | Checks if the specified property of an item is less than a given value.                |
| `<=`    | Checks if the specified property of an item is less than or equal to a given value.    |
| `>`     | Checks if the specified property of an item is greater than a given value.             |
| `>=`    | Checks if the specified property of an item is greater than or equal to a given value. |
| `like`  | Checks if the specified property of value contains the given value                     |
| `^like` | Checks if the specified property of value starts with the given value.                 |
| `like$` | Checks if the specified property of value ends with the given value.                   |

### License

Released under the terms of the [MIT License](LICENSE).