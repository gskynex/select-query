import { QueryBuilder } from './query-builder';

type User = Partial<{
  readonly active: boolean;
  readonly age: number;
  readonly createdAt: string;
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly role: 'Admin' | 'User',
  readonly stars: number;
}>

const mock: User[] = [
  { active: true,  age: 30, createdAt: '2023-10-10T10:20:00.931Z', id: '1', name: 'Bob', phone: '100-000', role: 'User', stars: 3 },
  { active: true,  age: 28, createdAt: '2023-09-09T20:30:00.931Z', id: '2', name: 'Tom', phone: '200-000', role: 'User', stars: 0 },
  { active: true,  age: 35, createdAt: '2023-09-09T20:30:00.931Z', id: '3', name: 'Sam', phone: '300-000', role: 'User' },
  { active: true,  age: 18, createdAt: '2023-10-09T20:30:00.931Z', id: '4', name: 'Max', phone: '400-000', role: 'Admin', stars: 10 },
  { active: false, age: 19, createdAt: '2023-10-09T20:30:00.931Z', id: '5', name: 'Nox', phone: '500-000', role: 'Admin', stars: 2 },
  { active: false, age: 24, createdAt: '2023-10-09T20:30:00.931Z', id: '6', name: 'Jon', phone: '500-000', role: 'Admin', stars: 20 },
  { active: true,  age: 24, createdAt: '2023-10-04T15:30:00.931Z', id: '7', name: 'Jon', phone: '600-000', role: 'User', stars: 0 },
];

describe('QueryBuilder', () => {
  test('[first] should return the first element of the collection', () => {
    expect(new QueryBuilder(mock).first()).toEqual(mock[0]);
  });

  test('[first] should return undefined for an empty collection', () => {
    expect(new QueryBuilder([]).first()).toBeUndefined();
  });

  test('[last] should return the last element of the collection', () => {
    expect(new QueryBuilder(mock).last()).toEqual(mock[6]);
  });

  test('[last] should return undefined for an empty collection', () => {
    expect(new QueryBuilder([]).last()).toBeUndefined();
  });

  test('[get] should return all elements in the collection', () => {
    expect(new QueryBuilder(mock).get()).toEqual(mock);
  });

  test('[count] should return the number of elements in the collection', () => {
    const count1 = new QueryBuilder([]).count();
    const count2 = new QueryBuilder(mock).count();

    expect(count1).toBe(0);
    expect(count2).toBe(7);
  });

  test('[limit] should return the number of objects in the collection to the specified maximum', () => {
    const values = new QueryBuilder(mock)
      .limit(3)
      .get();

    expect(values).toEqual([mock[0], mock[1], mock[2]]);
  });

  test('[offset] should return offsets the collection by the specified number of objects', () => {
    const values = new QueryBuilder(mock)
      .offset(5)
      .get();

    expect(values).toEqual([mock[5], mock[6]]);
  });

  test('[offset] should throws an error when offset is out of range', () => {
    expect(() => {
      new QueryBuilder(mock).offset(-1).get();
    }).toThrow('Offset is out of range.');
    expect(() => {
      new QueryBuilder(mock).offset(10).get();
    }).toThrow('Offset is out of range.');
  });

  test('[paginate] should return paginated the collection based on page number and page size', () => {
    const values1 = new QueryBuilder(mock)
      .paginate(1, 2)
      .get();

    const values2 = new QueryBuilder(mock)
      .paginate(2, 2)
      .get();

    expect(values1).toEqual([mock[0], mock[1]]);
    expect(values2).toEqual([mock[2], mock[3]]);
  });

  test('[where] should return filtered collection based on the specified condition', () => {
    const values1 = new QueryBuilder(mock)
      .where('age', '=', 24)
      .get();

    const values2 = new QueryBuilder(mock)
      .where('age', '=', 1)
      .get();

    const values3 = new QueryBuilder(mock)
      .where('id', '=', '2')
      .get();

    expect(values1).toEqual([mock[5], mock[6]]);
    expect(values2).toEqual([]);
    expect(values3).toEqual([mock[1]]);
  });

  test('[sum] should calculates the sum of values for the specified property in the collection', () => {
    const sum1 = new QueryBuilder(mock).sum('stars');

    const sum2 = new QueryBuilder(mock)
      .where('age', '=', 24)
      .sum('stars');

    expect(sum1).toBe(35);
    expect(sum2).toBe(20);
  });

  test('[select] should return specific properties from each object in the collection', () => {
    const values = new QueryBuilder(mock)
      .where('age', '=', 24)
      .select('phone')
      .get();

    expect(values).toEqual([
      { phone: mock[5].phone },
      { phone: mock[6].phone },
    ]);
  });

  test('[keyBy] should return groups elements in the collection based on the specified key', () => {
    const values1 = new QueryBuilder(mock)
      .where('age', '=', 24)
      .keyBy('id');

    const values2 = new QueryBuilder(mock)
      .where('age', '=', 24)
      .select('id', 'name')
      .keyBy('id');

    expect(values1).toEqual({
      '6': mock[5],
      '7': mock[6],
    });

    expect(values2).toEqual({
      '6': { id: mock[5].id, name: mock[5].name },
      '7': { id: mock[6].id, name: mock[6].name },
    });
  });
});