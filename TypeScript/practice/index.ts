// KebabCaseToCamelCase
// abc-def-rgb -> abcDefRgb
type KebabCaseToCamelCase<Str extends string> = Str extends `${infer First}-${infer Rest}`
	? `${First}${KebabCaseToCamelCase<Capitalize<Rest>>}`
	: Str;
type KebabCaseToCamelCaseResult = KebabCaseToCamelCase<'abc-def-rgb'>;

// CamelCaseToKebabCase
// abcDefRgb -> abc-def-rgb
type CamelCaseToKebabCase<Str extends string> = Str extends `${infer First}${infer Rest}`
	? First extends Lowercase<First>
		? `${First}${CamelCaseToKebabCase<Rest>}`
		: `-${Lowercase<First>}${CamelCaseToKebabCase<Rest>}`
	: Str;
type CamelCaseToKebabCaseResult = CamelCaseToKebabCase<'abcDefRgb'>;

// Chunk
// [1,2,3,4,5] -> [[1,2], [3,4], [5]]
type Chunk<
	Arr extends unknown[],
	ItemLength extends number,
	ChunkArr extends unknown[] = [],
	Result extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
	? ChunkArr['length'] extends ItemLength
		? Chunk<Rest, ItemLength, [First], [...Result, ChunkArr]>
		: Chunk<Rest, ItemLength, [...ChunkArr, First], Result>
	: [...Result, ChunkArr];
type ChunkResult = Chunk<[1, 2, 3, 4, 5], 2>;

// TupleToNestedObject
// ['a', 'b', 'c] value = 1 -> {
//     a: {
//       b: {
//           c: 1
//       }
//   }
// }
type TupleToNestedObject<Arr extends unknown[], ValueType> = Arr extends [infer First, ...infer Rest]
	? {
			[Key in First as Key extends keyof any ? Key : never]: Rest extends unknown[]
				? TupleToNestedObject<Rest, ValueType>
				: ValueType;
	  }
	: ValueType;

type TupleToNestedObjectResult1 = TupleToNestedObject<['a', 'b', 'c'], number>;
type TupleToNestedObjectResult2 = TupleToNestedObject<['a', number, 'c'], number>;
type TupleToNestedObjectResult3 = TupleToNestedObject<['a', undefined, 'c'], number>;

// PartialObjectPropByKeys
// interface AB {
//   name: string
//   age: number
//   address: string
// }
// interface AB {
//   name?: string
//   age: number
//   address?: string
// }
interface AB {
	name: string;
	age: number;
	address: string;
}
// 包一层 可以查看类型
type Copy<Obj extends Record<string, any>> = {
	[Key in keyof Obj]: Obj[Key];
};
// Extract 提取过滤
type PartialObjectPropByKeys1<Obj extends Record<string, any>, Key extends keyof any> = Copy<
	Partial<Pick<Obj, Extract<keyof Obj, Key>>> & Omit<Obj, Key>
>;
// 直接约束为Obj的key
type PartialObjectPropByKeys2<Obj extends Record<string, any>, Key extends keyof Obj> = Copy<
	Partial<Pick<Obj, Key>> & Omit<Obj, Key>
>;
type PartialObjectPropByKeysResul1 = PartialObjectPropByKeys1<AB, 'name'>;
type PartialObjectPropByKeysResult2 = PartialObjectPropByKeys2<AB, 'address'>;

// UnionToTuple
// 'a' | 'b' | 'c' -> ['a', 'b', 'c']
type UnionToTuple<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer ReturnType
	? [...UnionToTuple<Exclude<T, ReturnType>>, ReturnType]
	: [];
type UnionToTupleResult = UnionToTuple<'a' | 'b' | 'c'>;

// join
// const res = join('-')('a', 'b', 'c');
// a-b-c
declare function join<Delimiter extends string>(
	delimiter: Delimiter
): <Args extends string[]>(...args: Args) => JoinType<Args, Delimiter>;
type JoinType<Items extends any[], Delimiter extends string, Result extends string = ''> = Items extends [
	infer First,
	...infer Rest
]
	? JoinType<Rest, Delimiter, `${Result}${Delimiter}${First & string}`>
	: RemoveFirstDelimiter<Result>;

type RemoveFirstDelimiter<Str extends string> = Str extends `${infer _}${infer Rest}` ? Rest : Str;

let res = join('-')('a', 'b', 'c');

// DeepCamelize
// type obj = {
//   aaa_bbb: string;
//   bbb_ccc: [
//       {
//           ccc_ddd: string;
//       },
//       {
//           ddd_eee: string;
//           eee_fff: {
//               fff_ggg: string;
//           }
//       }
//   ]
// }
// 转为
// type DeepCamelizeRes = {
//   aaaBbb: string;
//   bbbCcc: [{
//       cccDdd: string;
//   }, {
//       dddEee: string;
//       eeeFff: {
//           fffGgg: string;
//       };
//   }];
// }
type obj1 = {
	aaa_bbb_ddd: string;
	bbb_ccc: [
		{
			ccc_ddd: string;
		},
		{
			ddd_eee: string;
			eee_fff: {
				fff_ggg: string;
			};
		}
	];
};
type Camelize<Str extends string> = Str extends `${infer First}_${infer Rest}`
	? `${First}${Camelize<Capitalize<Rest>>}`
	: Str;
type DeepCamelize<Obj extends Record<string, any>> = Obj extends unknown[]
	? CamelizeArr<Obj>
	: {
			[Key in keyof Obj as Camelize<Key & string>]: DeepCamelize<Obj[Key]>;
	  };

type CamelizeArr<Arr> = Arr extends [infer First extends Record<string, any>, ...infer Rest]
	? [DeepCamelize<First>, ...CamelizeArr<Rest>]
	: [];
type DeepCamelizeResult = DeepCamelize<obj1>;

// AllKeyPath
// type Obj = {
//   a: {
//       b: {
//           b1: string
//           b2: string
//       }
//       c: {
//           c1: string;
//           c2: string;
//       }
//   },
// }
// a、a.b、a.b.b1、a.b.b2、a.c、a.c.c1、a.c.c2

type Obj2 = {
	a: {
		b: {
			b1: string;
			b2: string;
		};
		c: {
			c1: string;
			c2: string;
		};
	};
};

type AllKeyPath<Obj extends Record<string, any>> = {
	[Key in keyof Obj]: Key extends string
		? Obj[Key] extends Record<string, any>
			? Key | `${Key}.${AllKeyPath<Obj[Key]>}`
			: Key
		: never;
}[keyof Obj];

type AllKeyPathResult = AllKeyPath<Obj2>;

// Defaultize
type AA = {
	aaa: '111';
	bbb: '222';
};
type BB = {
	aaa: '333';
	ccc: '444';
};
type Defaultize<A, B> = Pick<A, Exclude<keyof A, keyof B>> &
	Partial<Pick<A, Extract<keyof A, keyof B>>> &
	Partial<Pick<B, Exclude<keyof B, keyof A>>>;

type DefaultizeResult = Copy<Defaultize<AA, BB>>;
