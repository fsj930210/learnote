// Parameters
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
type MyParametersResult = MyParameters<(name: string, age: number) => any>;

// ReturnType
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
type MyReturnTypeResult = MyReturnType<(name: string, age: number) => number>;

// ConstructorParameters
type MyConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (
	...args: infer CP
) => any
	? CP
	: never;
type MyConstructorParametersResult = MyConstructorParameters<DogConstructor>;
class Dog {
	constructor(name: string, age: number) {}
}
interface DogConstructor {
	new (name: string, age: number): Dog;
}

// InstanceType
type MyInstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer I
	? I
	: any;
type MyInstanceTypeResult = MyInstanceType<DogConstructor>;

// ThisParameterType
type MyThisParameterType<T> = T extends (this: infer U, ...rest: any) => any ? U : unknown;
type MyThisParameterTypeResult = MyThisParameterType<typeof hello>;
type Person1 = {
	name: string;
};
function hello(this: Person1, age: number, gender: string) {
	console.log(this.name);
}

// OmitThisParameter
type MyOmitThisParameterType<T> = unknown extends MyThisParameterType<T>
	? T
	: T extends (...args: infer P) => infer R
	? (...args: P) => R
	: T;
type MyOmitThisParameterTypeResult = MyOmitThisParameterType<typeof hello>;

// Partial
type MyPartial<T> = {
	[K in keyof T]?: T[K];
};
type MyPartialResult = MyPartial<{ name: string; age: number }>;

// Required
type MyRequired<T> = {
	[K in keyof T]-?: T[K];
};
type MyRequiredResult = MyRequired<{ name: string; age: number; gender?: string }>;

// Readonly
type MyReadonly<T> = {
	readonly [K in keyof T]: T[K];
};
type MyReadonlyResult = MyReadonly<{ name: string; age: number; gender?: string }>;

// Pick
type MyPick<T, K extends keyof T> = {
	[P in K]: T[P];
};
type MyPickResult = MyPick<{ name: string; age: number; gender?: string }, 'age' | 'gender'>;

// Record
type MyRecord<K extends keyof any, T> = {
	[P in K]: T;
};
type MyRecordResult = MyRecord<'string' | 'symbol', number>;

// Exclude
type MyExclude<T, U> = T extends U ? never : T;
type MyExcludeResult = MyExclude<'a' | 'b' | 'c' | 'd', 'a' | 'b'>;

// Extract
type MyExtract<T, U> = T extends U ? T : never;
type MyExtractResult = MyExtract<'a' | 'b' | 'c' | 'd', 'a' | 'b'>;

// Omit
type MyOmit<T, U extends keyof any> = MyPick<T, MyExclude<keyof T, U>>;
type MyOmitResult = MyOmit<{ name: string; age: number; gender?: string }, 'age' | 'gender'>;

// Awaited
type MyAwaited<T> = T extends null | undefined
	? T
	: T extends object & { then(onfulfilled: infer F): any }
	? F extends (value: infer V, ...rest: any) => any
		? Awaited<V>
		: never
	: T;
type MyAwaitedResult = MyAwaited<Promise<Promise<Promise<string>>>>;

// NonNullable
type MyNonNullable<T> = T extends null | undefined ? never : T;
type MyNonNullableResult1 = MyNonNullable<any>;
type MyNonNullableResult2 = MyNonNullable<number>;
type MyNonNullableResult3 = MyNonNullable<never>;
type MyNonNullableResult4 = MyNonNullable<null>;
