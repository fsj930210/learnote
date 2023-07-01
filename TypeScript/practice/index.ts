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

// 1. 实现一个 zip 函数，对两个数组的元素按顺序两两合并，比如输入 [1,2,3], [4,5,6] 时，返回 [[1,4], [2,5],[3,6]]
// 2. 给这个 zip 函数定义 ts 类型（两种写法）
// 3. 用类型编程实现精确的类型提示，比如参数传入 [1,2,3], [4,5,6]，那返回值的类型要提示出 [[1,4], [2,5],[3,6]]

/*     需求1   */
// function zip(arr1, arr2) {
// 	const [arr1First, ...restArr1] = arr1;
// 	const [arr2First, ...restArr2] = arr2;
// 	return [[arr1First, arr2First, ...zip(restArr1, restArr2)]]
// }
// const zipRes = zip([1,2,3], [4,5,6])

/*     需求2   */
// function zip(arr1: unknown[], arr2: unknown[]): unknown[] {
// 	const [arr1First, ...restArr1] = arr1;
// 	const [arr2First, ...restArr2] = arr2;
// 	return [[arr1First, arr2First, ...zip(restArr1, restArr2)]]
// }
// interface Zip {
// 	(a: unknown[], b: unknown[]): unknown[]
// }

/*     需求3   */
type ZipFunc<Arr1 extends unknown[], Arr2 extends unknown[]> = Arr1 extends [infer Arr1First, ...infer Arr1Rest]
? Arr2 extends [infer Arr2First, ...infer Arr2Rest]
	? [[Arr1First, Arr2First], ...ZipFunc<Arr1Rest, Arr2Rest>]
	:[]
:[];
// 第一步 因为声明函数的时候都不知道参数是啥，自然计算不出 Zip<Target, Source> 的值，所以这里会
// function zip<Arr1 extends unknown[], Arr2 extends unknown[]>(arr1: unknown[], arr2: unknown[]): ZipFunc<Arr1, Arr2>{
// 	if (!arr1.length || !arr2.length) return [];
// 	const [arr1First, ...restArr1] = arr1;
// 	const [arr2First, ...restArr2] = arr2;
// 	return [[arr1First, arr2First, ...zip(restArr1, restArr2)]]
// }
//  const zipRes = zip([1, 2, 3], [4, 5, 6])

// 第二步 解决第一步问题用函数重载 返回值的类型不对呢返回的是[]不是字面量量类型
// function zip<Arr1 extends unknown[], Arr2 extends unknown[]>(arr1: Arr1, arr2: Arr2): ZipFunc<Arr1, Arr2>
// function zip(arr1:unknown[], arr2: unknown[]):unknown[]
// function zip(arr1: unknown[], arr2: unknown[]) {
// 	if (!arr1.length || !arr2.length) return [];
// 	const [arr1First, ...restArr1] = arr1;
// 	const [arr2First, ...restArr2] = arr2;
// 	return [[arr1First, arr2First, ...zip(restArr1, restArr2)]]
// }
//  const zipRes = zip([1, 2, 3], [4, 5, 6])

// 第三步 解决第二步使用as const 参数约束为readonly 但是会报错类型不匹配 类型“Arr1、Arr2”不满足约束“unknown[]”。类型 "readonly unknown[]" 为 "readonly"
// function zip<Arr1 extends readonly unknown[], Arr2 extends readonly unknown[]>(arr1: Arr1, arr2: Arr2): ZipFunc<Arr1, Arr2>
// function zip(arr1:unknown[], arr2: unknown[]):unknown[]
// function zip(arr1: unknown[], arr2: unknown[]) {
// 	if (!arr1.length || !arr2.length) return [];
// 	const [arr1First, ...restArr1] = arr1;
// 	const [arr2First, ...restArr2] = arr2;
// 	return [[arr1First, arr2First, ...zip(restArr1, restArr2)]]
// }
//  const zipRes = zip([1, 2, 3] as const , [4, 5, 6] as const)

// 第四步 解决第三步问题则是返回值去掉readonly修饰符 需要自己实现一个去掉readonly的类型 但是如果不传入字面量类型返回的还是[]
// type Mutable<T> = {
// 	-readonly[Key in keyof T]: T[Key]
// }
// function zip<Arr1 extends readonly unknown[], Arr2 extends readonly unknown[]>(arr1: Arr1, arr2: Arr2): ZipFunc<Mutable<Arr1>, Mutable<Arr2>>
// function zip(arr1:unknown[], arr2: unknown[]):unknown[]
// function zip(arr1: unknown[], arr2: unknown[]) {
// 	if (!arr1.length || !arr2.length) return [];
// 	const [arr1First, ...restArr1] = arr1;
// 	const [arr2First, ...restArr2] = arr2;
// 	return [[arr1First, arr2First, ...zip(restArr1, restArr2)]]
// }
// const zipRes1 = zip([1, 2, 3] as const , [4, 5, 6] as const)
// const zipArr1 = [1, 2, 3];
// const zipArr2 = [4, 5, 6];
// const zipRes2 = zip(zipArr1, zipArr2)

// 第五步 解决第四步问题 则是交换函数重载顺序

type Mutable<T> = {
	-readonly [Key in keyof T]: T[Key]
}
function zip(arr1: unknown[], arr2: unknown[]): unknown[]
function zip<Arr1 extends readonly unknown[], Arr2 extends readonly unknown[]>(arr1: Arr1, arr2: Arr2): ZipFunc<Mutable<Arr1>, Mutable<Arr2>>
function zip(arr1: unknown[], arr2: unknown[]) {
	if (!arr1.length || !arr2.length) return [];
	const [arr1First, ...restArr1] = arr1;
	const [arr2First, ...restArr2] = arr2;
	return [[arr1First, arr2First, ...zip(restArr1, restArr2)]]
}
const zipRes1 = zip([1, 2, 3] as const, [4, 5, 6] as const)
const zipArr1 = [1, 2, 3];
const zipArr2 = [4, 5, 6];
const zipRes2 = zip(zipArr1, zipArr2)

// DeepRecord

type DeepRecord<Obj extends Record<string, any>> = {
	[Key in keyof Obj]:
	Obj[Key] extends Record<string, any>
	? DeepRecord<Obj[Key]> & Record<string, any>
	: Obj[Key]
} & Record<string, any>;
type Data = {
	aaa: number;
	bbb: {
		ccc: number;
		ddd: string;
	},
	eee: {
		fff: string;
		ddd: number;
	}
}
type DeepRecordResult = DeepRecord<Data>;

const data: Data = {
	aaa: 1,
	bbb: {
		ccc: 1,
		ddd: 'aaa'
	},
	eee: {
		fff: 'bbb',
		ddd: 2
	}
}

// GenerateType
type GenerateType<Keys extends keyof any> = {
	[Key in Keys]: {
		[Key2 in Key]: 'desc' | 'asc'
	} & {
		[Key3 in Exclude<Keys, Key>]: false
	}
}[Keys];

type GenerateTypeResult = GenerateType<'aaa' | 'bbb' | 'ccc'>;

const gtr1: GenerateTypeResult = {
	aaa: 'asc',
	bbb: false,
	ccc: false
}

const gtr2: GenerateTypeResult = {
	aaa: false,
	bbb: 'desc',
	ccc: false
}

// const gtr3: GenerateTypeResult = {
// 	aaa: 'asc',
// 	bbb: 'desc',
// 	ccc: false
// }
