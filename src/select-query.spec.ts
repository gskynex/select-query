import { SelectQuery } from './select-query';

type User = Partial<{
  readonly active: boolean;
  readonly age: number;
  readonly createdAt: string;
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly role: 'Admin' | 'User' | 'None',
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
  { active: true,  age: 25, createdAt: '2023-10-10T15:30:00.931Z', id: '8', name: 'Dom', phone: '623-000', role: 'None', stars: 0 },
];

describe('SelectQuery', () => {
  test('first', () => {
    expect(new SelectQuery(mock).first()).toEqual(mock[0]);
  });

  test('first is undefined', () => {
    expect(new SelectQuery([]).first()).toBeUndefined();
  });

  test('last', () => {
    expect(new SelectQuery(mock).last()).toEqual(mock[7]);
  });

  test('last is undefined', () => {
    expect(new SelectQuery([]).last()).toBeUndefined();
  });

  test('limit', () => {
    expect(new SelectQuery(mock).limit(3).get()).toEqual([mock[0], mock[1], mock[2]]);
  });

  test('limit exception', () => {
    expect(() => {new SelectQuery(mock).limit(-1).get();}).toThrow('Limit must be a positive number.');
  });

  test('offset', () => {
    expect(new SelectQuery(mock).offset(5).get()).toEqual([mock[5], mock[6], mock[7]]);
  });

  test('offset exception', () => {
    expect(() => {new SelectQuery(mock).offset(-1).get();}).toThrow('Offset is out of range.');
  });

  test('get', () => {
    expect(new SelectQuery(mock).get()).toEqual(mock);
  });

  test('count 0', () => {
    expect(new SelectQuery([]).count()).toBe(0);
  });

  test('count {N}', () => {
    expect(new SelectQuery(mock).count()).toBe(8);
  });

  test('paginate', () => {
    expect(new SelectQuery(mock).paginate(1, 2).get()).toEqual([mock[0], mock[1]]);
  });

  test('sum', () => {
    expect(new SelectQuery(mock).sum('stars')).toBe(35);
  });

  test('keyBy', () => {
    expect(new SelectQuery(mock).where('age', '===', 24).keyBy('id')).toEqual({ '6': mock[5], '7': mock[6] });
  });

  test('select', () => {
    const values = new SelectQuery(mock)
      .where('age', '===', 24)
      .select('phone')
      .get();

    expect(values).toEqual([{ phone: mock[5].phone }, { phone: mock[6].phone }]);
  });

  test('where ===', () => {
    expect(new SelectQuery(mock).where('stars', '===', 3).get()).toEqual([mock[0]]);
  });

  test('where !==', () => {
    expect(new SelectQuery(mock).where('role', '!==', 'None').get()).toEqual([...mock.slice(0, -1)]);
  });

  test('where <', () => {
    expect(new SelectQuery(mock).where('age', '<', 24).get()).toEqual([mock[3], mock[4]]);
  });

  test('where >', () => {
    expect(new SelectQuery(mock).where('age', '>', 35).get()).toEqual([]);
  });

  test('where like', () => {
    expect(new SelectQuery(mock).where('name', 'like', 'do').get()).toEqual([mock[7]]);
  });

  test('where ^like', () => {
    expect(new SelectQuery(mock).where('createdAt', '^like', '2023-10-10').get()).toEqual([mock[0], mock[7]]);
  });

  test('where like$', () => {
    expect(new SelectQuery(mock).where('name', 'like$', 'm').get()).toEqual([mock[1], mock[2], mock[7]]);
  });

  test('where exception', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => {new SelectQuery(mock).where('name', '====', 'do').get();}).toThrow('Unknown operator: ====');
  });
});