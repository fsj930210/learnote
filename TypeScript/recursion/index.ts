// Promise
// 提取不确定层数的 Promise 中的 value 类型的高级类型
type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<infer Value>
  ? Value extends Promise<unknown> ? DeepPromiseValueType<Value> : Value : never;

type DeepPromiseValueTypeResult = DeepPromiseValueType<Promise<Promise<Promise<Record<string, any>>>>>;

type DeepPromiseValueType2<P> = P extends Promise<infer Value> ? DeepPromiseValueType2<Value> : P;
type DeepPromiseValueType2Result = DeepPromiseValueType<Promise<Promise<Promise<Record<string, any>>>>>;

// ============================= 分割线 =======================

// Array
type ReverseArray<T extends unknown[]> = T extends [infer First, ...infer Rest] ? [...ReverseArray<Rest>, First] : T;
type ReverseArrayResult = ReverseArray<[1,2,3,4,5]>

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);

type Includes<Arr extends unknown[], FindItem> = Arr extends [infer First, ...infer Rest] 
? IsEqual<First, FindItem> extends true
  ? true 
  : Includes<Rest, FindItem> 
: false

type IncludesResult = Includes<[1,2,3,4,5], 2>;

type RemoveItem<
Arr extends unknown[], 
Item,
Result extends unknown[] = []
> = Arr extends [infer First, ...infer Rest] 
? IsEqual<First, Item> extends true
  ? RemoveItem<Rest, Item, Result>
  : RemoveItem<Rest, Item, [...Result, First]>
: Result;
type RemoveItemResult = RemoveItem<[1, 2, 3, 4, 5, 6, 5, 3, 2, 7], 5>

type BuildArray<Length extends number, El = unknown, Arr extends unknown[] = []> = Arr['length'] extends Length 
? Arr
: BuildArray<Length, El, [...Arr, El]>;
type BuildArrayResult = BuildArray<5, number>


// ============================= 分割线 =======================

// string
type ReplaceAll<
Str extends string,
From extends string,
To extends string
> = Str extends `${infer Left}${From}${infer Right}`
? `${Left}${To}${ReplaceAll<Right, From, To>}`: Str;
type ReplaceAllResult = ReplaceAll<'abcdefabcuu', 'abc', 'iii'>;


type StringToUnion<Str extends string> = Str extends `${infer First}${infer Rest}` ? First | StringToUnion<Rest> : never;
type StringToUnionResult = StringToUnion<'abcdef'>;

type ReverseString<Str extends string, Result extends string = ''> = Str extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest, `${First}${Result}`>}`
  : Result;
type ReverseStringResult = ReverseString<'abcde'>;


// ============================= 分割线 =======================

// 索引类型
type DeepReadonly<Obj extends Record<string, any>> = {
  readonly [Key in keyof Obj]: Obj[Key] extends object ? 
  Obj[Key] extends Function 
    ? Obj[Key]
    : DeepReadonly<Obj[Key]>
    : Obj[Key]
}
type obj = {
  a: {
    b: {
      c: {
        f: () => 'abc',
        d: {
          e: {
            name: string
          }
        }
      }
    }
  }
}
type DeepReadonlyResult = DeepReadonly<obj>

type DeepReadonly2<Obj extends Record<string, any>> =  Obj extends any 
? {
  readonly [Key in keyof Obj]:
  Obj[Key] extends object ?
    Obj[Key] extends Function
      ? Obj[Key]
      : DeepReadonly2<Obj[Key]>
    : Obj[Key]
  } 
  : never;

type DeepReadonly2Result = DeepReadonly2<obj>;