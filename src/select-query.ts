const operators = [
  '===',
  '!==',
  '<',
  '<=',
  '>',
  '>=',
  'like',
  '^like',
  'like$',
] as const;

type Operator = typeof operators[number];

/**
 * SelectQuery provides utility methods for querying and manipulating collections of objects.
 * @template T - The type of objects in the collection.
 */
export class SelectQuery<T extends object> {
  readonly #collection: T[];

  /**
   * Gets the array of valid operators for comparisons.
   * @returns {Operator[]} - An array containing all valid operators for comparisons.
   * @description
   * This method returns an array of predefined operators that can be used for comparisons,
   * such as '===', '!==', '<', '<=', '>', '>=', 'like', '^like', and 'like$'.
   * These operators are useful in scenarios where you need to dynamically select
   * an operator for a comparison operation.
   */
  static getOperators(): typeof operators {
    return operators;
  }

  /**
   * Creates a new SelectQuery instance with the given collection.
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
   * @returns {T | undefined} - The first element of the collection, or undefined if the collection is empty.
   */
  first(): T | undefined {
    return this.#collection[0];
  }

  /**
   * Gets the last element of the collection.
   * @returns {T | undefined} - The last element of the collection, or undefined if the collection is empty.
   */
  last(): T | undefined {
    return this.#collection[this.#collection.length - 1];
  }

  /**
   * Gets all elements in the collection.
   * @returns {T[]} - An array containing all elements in the collection.
   */
  get(): T[] {
    return this.#collection;
  }

  /**
   * Gets the number of elements in the collection.
   * @returns {number} - The number of elements in the collection.
   */
  count(): number {
    return this.#collection.length;
  }

  /**
   * Limits the number of objects in the collection to a specified maximum.
   * @param {number} limit - The maximum number of objects to include in the collection.
   * @returns {SelectQuery<T>} - A new SelectQuery instance with a limited number of objects.
   */
  limit(limit: number): SelectQuery<T> {
    if (limit <= 0) {
      throw new Error('Limit must be a positive number.');
    }

    return new SelectQuery<T>(this.#collection.slice(0, limit));
  }

  /**
   * Offsets the collection by a specified number of objects.
   * @param {number} offset - The number of objects to skip from the beginning of the collection.
   * @returns {SelectQuery<T>} - A new SelectQuery instance with objects after the specified offset.
   */
  offset(offset: number): SelectQuery<T> {
    if (offset < 0 || offset >= this.#collection.length) {
      throw new Error('Offset is out of range.');
    }

    return new SelectQuery<T>(this.#collection.slice(offset));
  }

  /**
   * Paginates the collection based on a page number and page size.
   * @param {number} num - The page number (1-based).
   * @param {number} size - The number of objects per page.
   * @returns {SelectQuery<T>} - A new SelectQuery instance with objects for the specified page.
   */
  paginate(num: number, size: number): SelectQuery<T> {
    return this.offset((Math.max(num, 1) - 1) * size).limit(size);
  }

  /**
   * Calculates the sum of the values for a specified property in the collection.
   * This method iterates over each object in the collection, accessing the value
   * of the specified property. It sums these values and returns the total. If a
   * property's value is `undefined`, `null` it will be ignored
   * (treated as 0) in the summation.
   * @template K - The type of the key.
   * @param {keyof T} key - The property key whose values are to be summed up.
   * @returns {number} The sum of the property values.
   * @throws {Error} Throws an error if any property value is not a number.
   */
  sum<K extends keyof T>(key: K): number {
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
   * Selects specific properties from each object in the collection and returns a new SelectQuery instance.
   * @template K - The keys to select from the objects in the collection.
   * @param {...K} keys - The keys (properties) to select.
   * @returns {SelectQuery<Pick<T, K>>} - A new SelectQuery instance with objects containing only the selected keys.
   */
  select<K extends keyof T>(...keys: K[]): SelectQuery<Pick<T, K>> {
    return new SelectQuery<Pick<T, K>>(this.#collection.map((item) => {
      return keys.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {} as Pick<T, K>);
    }));
  }

  /**
   * Groups elements in a collection based on a specified key.
   * @template K - The type of the key.
   * @param {K} key - The key (property name) by which to group elements.
   * @returns {Record<T[K], T>} - An object with keys as unique values from the collection based on the specified key,
   * and values as the corresponding objects from the collection.
   */
  keyBy<K extends keyof T>(key: K): Record<T[K] & (string | number | symbol), T> {
    return this.#collection.reduce((acc, item) => {
      const keyValue = item[key] as T[K] & (string | number | symbol);

      return key in item ? { ...acc, [keyValue]: item } : acc;
    }, {} as Record<T[K] & (string | number | symbol), T>);
  }

  /**
   * Filters the collection based on a specified condition.
   * @template K - The type of the property to compare.
   * @param {keyof T} key - The key (property name) to compare.
   * @param {Operator} operator - The comparison operator.
   * @param {T[keyof T]} value - The value to compare against.
   * @returns {SelectQuery<T>} - A new SelectQuery instance with filtered elements.
   */
  where<K extends keyof T>(key: K, operator: Operator, value: T[K]): SelectQuery<T> {
    return new SelectQuery<T>(this.#collection.filter((item) => {
      const itemValue = item[key];

      switch (operator) {
        case '===':
          return this.#equal(itemValue, value);

        case '!==':
          return !this.#equal(itemValue, value);

        case '<':
          return this.#lessThan(itemValue, value);

        case '<=':
          return this.#lessThanOrEqualTo(itemValue, value);

        case '>':
          return this.#greaterThan(itemValue, value);

        case '>=':
          return this.#greaterThanOrEqualTo(itemValue, value);

        case 'like':
          return this.#like(itemValue, value);

        case '^like':
          return this.#like(itemValue, value, '^like');

        case 'like$':
          return this.#like(itemValue, value, 'like$');

        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    }));
  }

  /**
   * Checks if the specified property of an item is equal to a given value.
   * @template K - The type of the property to compare.
   * @param {T[K]} itemValue - The value of the property to compare.
   * @param {T[K]} value - The value to compare against.
   * @returns {boolean} - Returns true if the property values are equal, otherwise returns false.
   */
  #equal<K extends keyof T>(itemValue: T[K], value: T[K]): boolean {
    return itemValue === value;
  }

  /**
   * Checks if the specified property of an item is less than a given value.
   * @template K - The type of the property to compare.
   * @param {T[K]} itemValue - The value of the property to compare.
   * @param {T[K]} value - The value to compare against.
   * @returns {boolean} - Returns true if the property value is less than the given value, otherwise returns false.
   */
  #lessThan<K extends keyof T>(itemValue: T[K], value: T[K]): boolean {
    return itemValue < value;
  }

  /**
   * Checks if the specified property of an item is less than or equal to a given value.
   * @template K - The type of the property to compare.
   * @param {T[K]} itemValue - The value of the property to compare.
   * @param {T[K]} value - The value to compare against.
   * @returns {boolean} - Returns true if the property value is less than or equal to the given value, otherwise returns false.
   */
  #lessThanOrEqualTo<K extends keyof T>(itemValue: T[K], value: T[K]): boolean {
    return itemValue <= value;
  }

  /**
   * Checks if the specified property of an item is greater than a given value.
   * @template K - The type of the property to compare.
   * @param {T[K]} itemValue - The value of the property to compare.
   * @param {T[K]} value - The value to compare against.
   * @returns {boolean} - Returns true if the property value is greater than the given value, otherwise returns false.
   */
  #greaterThan<K extends keyof T>(itemValue: T[K], value: T[K]): boolean {
    return itemValue > value;
  }

  /**
   * Checks if the specified property of an item is greater than or equal to a given value.
   * @template K - The type of the property to compare.
   * @param {T[K]} itemValue - The value of the property to compare.
   * @param {T[K]} value - The value to compare against.
   * @returns {boolean} - Returns true if the property value is greater than or equal to the given value, otherwise returns false.
   */
  #greaterThanOrEqualTo<K extends keyof T>(itemValue: T[K], value: T[K]): boolean {
    return itemValue >= value;
  }

  /**
   * Checks if the specified property of an item is like a given value with optional type-based matching.
   * @template K - The type of the property to compare.
   * @param {T[K]} itemValue - The value of the property to compare.
   * @param {T[K]} value - The value to compare against.
   * @param {'^like' | 'like$'} [type] - The optional matching type:
   *   - ^like matches if the property value starts with the given value.
   *   - like$ matches if the property value ends with the given value.
   *   - if not provided or set to 'like', it matches if the property value contains the given value.
   * @returns {boolean} - Returns true if the property value matches the given value based on the specified type, otherwise returns false.
   */
  #like<K extends keyof T>(itemValue: T[K], value: T[K], type?: '^like' | 'like$'): boolean {
    const v1 = itemValue!.toString().toLowerCase();
    const v2 = value!.toString().toLowerCase();

    if (type === '^like') {
      return v1.startsWith(v2);
    }

    if (type === 'like$') {
      return v1.endsWith(v2);
    }

    return v1.includes(v2);
  }
}