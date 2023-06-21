// String
// CapitalizeStr
type CapitalizeStr<Str extends string> =  Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str;
type CapitalizeResult = CapitalizeStr<'abc'>;

// CamelCase
type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}` ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
  : Str;
type CamelCaseResult = CamelCase<'a_boy_girl'>;

// DropSubStr
type DropSubStr<Str extends string, SubStr extends string> =
  Str extends `${infer Left}${SubStr}` ? `${DropSubStr<Left, SubStr>}`: Str;

type DropResult = DropSubStr<'abc!!!', '!'>;

// ============================= 分割线 =======================


// Array
// Push
type Push<T extends unknown[], El> = [...T, El];

type PushResult = Push<[1, 2, 3], 4>;

// Unshift
type Unshift<Arr extends unknown[], El> = [El, ...Arr];

type UnshiftResult = Unshift<[1, 2, 3], 0>;

// Zip
type Zip<One extends [unknown, unknown], Other extends [unknown, unknown]> =
 One extends [infer First, infer Last] ?
  Other extends [infer OtherFirst, infer OtherLast] ?
  [[First, OtherFirst], [Last, OtherLast]] : [] : []


type ZipResult = Zip<[1, 2], ['a', 'b']>;

// Zip2
type Zip2<One extends unknown[], Other extends unknown[]> =
  One extends [infer OneFirst, ...infer OneRest]
  ? Other extends [infer OtherFirst, ...infer OtherRest]
  ? [[OneFirst, OtherFirst], ...Zip2<OneRest, OtherRest>] : []
  : [];

type Zip2Result = Zip2<[1, 2, 3, 4, 5], ['a', 'b', 'c', 'd', 'e']>;


// ============================= 分割线 =======================

// Function
type AppendArgument<Func extends Function, Arg> = Func extends (...args: infer Args) => infer ReturnType ? (...args: [...Args, Arg]) => ReturnType : never
type AppendArgumentResult = AppendArgument<(name: string) => boolean, number>;



// ============================= 分割线 =======================


// 索引类型
// Mapping
type Mapping<Obj extends object> = {
  [Key in keyof Obj]: [Obj[Key], Obj[Key]]
}
type res = Mapping<{ a: 1, b: 2 }>;

// UppercaseKey
type UppercaseKey<Obj extends object> = {
  [Key in keyof Obj as Uppercase<Key & string>] : Obj[Key]
}
type UppercaseKeyResult = UppercaseKey<{ age: 1, count: 2 }>;

// ToReadonly
type ToReadonly<T> = {
  readonly [Key in keyof T] : T[Key]
}
type ReadonlyResult = ToReadonly<{
  name: string;
  age: number;
}>;

// ToPartial
type ToPartial<T> = {
  [Key in keyof T]?: T[Key]
}

type PartialResult = ToPartial<{
  name: string;
  age: number;
}>;

// ToMutable
type ToMutable<T> = {
  -readonly[Key in keyof T]: T[Key]
}
type MutableResult = ToMutable<{
  readonly name: string;
  age: number;
}>;

// ToRequired
type ToRequired<T> = {
  [Key in keyof T]-?: T[Key]
}
type RequiredResullt = ToRequired<{
  name?: string;
  age: number;
}>;

// FilterByValueType
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key]
}
interface Person {
  name: string;
  age: number;
  hobby: string[];
  is_show: boolean;
}

type FilterResult = FilterByValueType<Person, string | number | boolean>;