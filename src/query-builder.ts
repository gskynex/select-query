type ComparisonOperator = '=';

/**
 * QueryBuilder provides utility methods for querying and manipulating collections of objects.
 *
 * @template T - The type of objects in the collection.
 */
export class QueryBuilder<T extends object> {
  readonly #collection: T[];

  /**
   * Creates a new QueryBuilder instance with the given collection.
   *
   * @param {T[]} collection - An array of objects to be used for querying.
   * @throws {Error} Throws an error if the input is not an array of objects.
   */
  constructor(collection: T[]) {
    if (!Array.isArray(collection) || collection.some((item) => typeof item !== 'object' || item === null)) {
      throw new Error('The collection should be an array of objects.');
    }

    this.#collection = collection;
  }

  /**
   * Gets the first element of the collection.
   *
   * @returns {T | undefined} - The first element of the collection, or undefined if the collection is empty.
   */
  first(): T | undefined {
    return this.#collection[0];
  }

  /**
   * Gets the last element of the collection.
   *
   * @returns {T | undefined} - The last element of the collection, or undefined if the collection is empty.
   */
  last(): T | undefined {
    return this.#collection[this.#collection.length - 1];
  }

  /**
   * Gets all elements in the collection.
   *
   * @returns {T[]} - An array containing all elements in the collection.
   */
  get(): T[] {
    return this.#collection;
  }

  /**
   * Gets the number of elements in the collection.
   *
   * @returns {number} - The number of elements in the collection.
   */
  count(): number {
    return this.#collection.length;
  }

  /**
   * Limits the number of objects in the collection to a specified maximum.
   *
   * @param {number} limit - The maximum number of objects to include in the collection.
   * @returns {QueryBuilder<T>} - A new QueryBuilder instance with a limited number of objects.
   */
  limit(limit: number): QueryBuilder<T> {
    if (limit <= 0) {
      throw new Error('Limit must be a positive number.');
    }

    return new QueryBuilder<T>(this.#collection.slice(0, limit));
  }

  /**
   * Offsets the collection by a specified number of objects.
   *
   * @param {number} offset - The number of objects to skip from the beginning of the collection.
   * @returns {QueryBuilder<T>} - A new QueryBuilder instance with objects after the specified offset.
   */
  offset(offset: number): QueryBuilder<T> {
    if (offset < 0 || offset >= this.#collection.length) {
      throw new Error('Offset is out of range.');
    }

    return new QueryBuilder<T>(this.#collection.slice(offset));
  }

  /**
   * Paginates the collection based on a page number and page size.
   *
   * @param {number} pageNumber - The page number (1-based).
   * @param {number} pageSize - The number of objects per page.
   * @returns {QueryBuilder<T>} - A new QueryBuilder instance with objects for the specified page.
   */
  paginate(pageNumber: number, pageSize: number): QueryBuilder<T> {
    return this.offset((Math.max(pageNumber, 1) - 1) * pageSize).limit(pageSize);
  }

  /**
   * Filters the collection based on a specified condition.
   *
   * @param {keyof T} key - The key (property name) to compare.
   * @param {ComparisonOperator} operator - The comparison operator.
   * @param {any} value - The value to compare against.
   * @returns {QueryBuilder<T>} - A new QueryBuilder instance with filtered elements.
   *
   * @example
   * const data = [
   *   { id: 1, name: 'Jak', age: 30 },
   *   { id: 2, name: 'Bob', age: 32 },
   *   { id: 3, name: 'Ton', age: 20 },
   * ];
   *
   * new QueryBuilder(data).where('name', '=', 'Jak').get();
   *
   * Returns:
   * [{ id: 1, name: 'Jak', age: 30 }]
   */
  where(key: keyof T, operator: ComparisonOperator, value: unknown): QueryBuilder<T> {
    return new QueryBuilder<T>(this.#collection.filter((item) => {
      switch (operator) {
        case '=':
          return item[key] === value;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    }));
  }

  /**
   * Calculates the sum of the values for a specified property in the collection.
   *
   * This method iterates over each object in the collection, accessing the value
   * of the specified property. It sums these values and returns the total. If a
   * property's value is `undefined`, `null` it will be ignored
   * (treated as 0) in the summation.
   *
   * @param {keyof T} key - The property key whose values are to be summed up.
   * @returns {number} The sum of the property values.
   * @throws {Error} Throws an error if any property value is not a number.
   *
   * @example
   * const data = [
   *   { price: 10 },
   *   { price: 20 },
   *   { price: 70 }
   * ];
   *
   * new QueryBuilder(data).sum('price');
   *
   * Returns: 100
   */
  sum(key: keyof T): number {
    return this.#collection.reduce((acc, item) => {
      const value = item[key] as unknown as number;

      if (value === undefined || value === null) {
        return acc;
      }

      if (typeof value !== 'number') {
        throw new Error(`Sum operation failed: the property '${String(key)}' must be a number in every item of the collection.`);
      }

      return acc + value;
    }, 0);
  }

  /**
   * Selects specific properties from each object in the collection and returns a new QueryBuilder instance.
   *
   * @template K - The keys to select from the objects in the collection.
   * @param {...K} keys - The keys (properties) to select.
   * @returns {QueryBuilder<Pick<T, K>>} - A new QueryBuilder instance with objects containing only the selected keys.
   *
   * @example
   * const data = [
   *   { id: 1, name: 'Jak', age: 30, phone: '000-000' },
   *   { id: 2, name: 'Bob', age: 25, phone: '000-000' },
   * ];
   *
   * new QueryBuilder(data).select('id', 'name').get();
   *
   * Returns:
   * [
   *    { id: 1, name: 'Jak' },
   *    { id: 2, name: 'Bob' }
   * ]
   */
  select<K extends keyof T>(...keys: K[]): QueryBuilder<Pick<T, K>> {
    return new QueryBuilder<Pick<T, K>>(this.#collection.map((item) => {
      return keys.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {} as Pick<T, K>);
    }));
  }

  /**
   * Groups elements in a collection based on a specified key.
   *
   * @template K - The type of the key.
   * @param {K} key - The key (property name) by which to group elements.
   * @returns {Record<T[K], T>} - An object with keys as unique values from the collection based on the specified key,
   * and values as the corresponding objects from the collection.
   *
   * @example
   * const data = [
   *   { id: 1, name: 'Jak', age: 30 },
   *   { id: 2, name: 'Bob', age: 25 },
   *   { id: 3, name: 'Tom', age: 20 },
   * ];
   *
   * new QueryBuilder(data).keyBy('id')
   *
   * Return:
   * {
   *    '1': { id: 1, name: 'Jak', age: 30 },
   *    '2': { id: 2, name: 'Bob', age: 25 },
   *    '3': { id: 3, name: 'Tom', age: 20 },
   * }
   */
  keyBy<K extends keyof T>(key: K): Record<T[K] & (string | number | symbol), T> {
    return this.#collection.reduce((acc, item) => {
      const keyValue = item[key] as T[K] & (string | number | symbol);

      return key in item ? { ...acc, [keyValue]: item } : acc;
    }, {} as Record<T[K] & (string | number | symbol), T>);
  }
}