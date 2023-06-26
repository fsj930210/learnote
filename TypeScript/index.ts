// 类型映射
// 因为索引类型（对象、class 等）可以用 string、number 和 symbol 作为 key，
// 这里 keyof T 取出的索引就是 string | number | symbol 的联合类型，和 string 取交叉部分就只剩下 string 了。
// 交叉类型会把同一类型做合并，不同类型舍弃。
type MapType<T> = {
	[Key in keyof T as `${Key & string}${Key & string}${Key & string}`]: [T[Key], T[Key], T[Key]];
};

type MapTypeResult = MapType<{ a: 1; b: 2 }>;

// ParseQueryString
// ParseQueryString<'a=1&b=2&c=3&a=4'> -> {a: [1, 4], b: 2, c: 3}
type ParseQueryString<Str extends string> = Str extends `${infer Param}&${infer Rest}`
	? MergeParam<ParseParam<Param>, ParseQueryString<Rest>>
	: ParseParam<Str>;
type ParseParam<Param extends string> = Param extends `${infer Key}=${infer Value}`
	? { [K in Key]: Value }
	: Record<string, any>;
type MergeParam<Param1 extends Record<string, any>, RestParam extends Record<string, any>> = {
	[Key in keyof Param1 | keyof RestParam]: Key extends keyof Param1
		? Key extends keyof RestParam
			? MergeValue<Param1[Key], RestParam[Key]>
			: Param1[Key]
		: Key extends keyof RestParam
		? RestParam[Key]
		: never;
};

type MergeValue<Value1, RestValue> = Value1 extends RestValue
	? Value1
	: RestValue extends unknown[]
	? [Value1, ...RestValue]
	: [Value1, RestValue];

type ParseQueryStringResult = ParseQueryString<'a=1&b=2&c=3&a=4'>;

// Promise.all Promise.race
interface MyPromiseConstructor {
	all<T extends readonly unknown[] | []>(
		values: T
	): Promise<{
		-readonly [K in keyof T]: Awaited<T[K]>;
	}>;
	race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
}
declare const promise: MyPromiseConstructor;
const allRes = promise.all([Promise.resolve(1), Promise.resolve(1), Promise.resolve(3)]);
const raceRes = promise.race([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);

type pRes = [Promise<1>, Promise<2>, Promise<3>][number];

//currying
type CurryFunc<Params, Result> = Params extends [infer Arg, ...infer Rest]
	? (arg: Arg) => CurryFunc<Rest, Result>
	: Result;
declare function currying<Func>(
	fn: Func
): Func extends (...args: infer Params) => infer Res ? CurryFunc<Params, Res> : never;
const func = (a: string, b: number, c: boolean) => 3;
const CurryFuncResult = currying(func);
