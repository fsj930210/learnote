// Promise
type GetPromiseValue<T> = T extends Promise<infer Value> ? Value : never;
type GetPromiseValueResult1 = GetPromiseValue<Promise<number>>;
type GetPromiseValueResult2 = GetPromiseValue<boolean>;

// ============================= 分割线 =======================

// String
// StartsWith
type StartsWith<Str extends string, Prefix extends string> = Str extends `${Prefix}${string}` ? true : false;
type StartsWithResult1 = StartsWith<'abcde', 'abc'>;
type StartsWithResult2 = StartsWith<'abcde', 'de'>;

// Replace
type ReplaceStr<Str extends string, From extends string, To extends string> =  Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : Str;
type ReplaceResult1 = ReplaceStr<"abcde", "cd", "ab">;
type ReplaceResult2 = ReplaceStr<"abc", "de", "ab">;

// Trim
// 递归处理后str实际变为了Rest
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? TrimStrRight<Rest> : Str;
type TrimRightResult = TrimStrRight<'abc        '>;
type TrimStrLeft<Str extends string> = Str extends `${' ' | '\n' | '\t'}${infer Rest}` ? TrimStrLeft<Rest> : Str;
type TrimLeftResult = TrimStrLeft<'      de'>;
type TrimStr<Str extends string> =TrimStrRight<TrimStrLeft<Str>>;
type TrimResult = TrimStr<'      adc   '>;


// ============================= 分割线 =======================


// Array
// GetFirst
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]] ? First : never;
type GetFirstResult = GetFirst<[1,2,3]>;
type GetFirstResult2 = GetFirst<[]>;

// GetLast
type GetLast<Arr extends unknown[]> = Arr extends [...unknown[], infer Last] ? Last : never;
type GetLastResult = GetLast<[1,2,3]>;
type GetLastResult2 = GetLast<[]>;

// PopArr
type PopArr<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends [...infer Rest, unknown] ? Rest : never;
type PopResult = PopArr<[1,2,3]>;
type PopResult2 = PopArr<[]>;


// ShiftArr
type ShiftArr<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends [unknown, ...infer Rest] ? Rest : never;
type ShiftResult = ShiftArr<[1,2,3]>;
type ShiftResult2 = ShiftArr<[]>;


// ============================= 分割线 =======================


// Function
// GetParameters
type GetParameters<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never;
type ParametersResult = GetParameters<(name: string, age: number) => string>;
type ParametersResult2 = GetParameters<() => string>;

// GetReturnType
type GetReturnType<Func extends Function> = Func extends (...args: any[]) => infer ReturnType ? ReturnType : never;
type ReturnTypeResullt = GetReturnType<(name: string) => number>;

// GetThisParameterType
class A {
    name: string;

    constructor() {
        this.name = "abc";
    }

    hello(this: A) {
        return 'hello, I\'m ' + this.name;
    }
}

const a = new A();
a.hello();

// dong.hello.call({xxx:1});

type GetThisParameterType<T> = T extends (this: infer ThisType, ...args: any[]) => any ? ThisType : unknown;
type GetThisParameterTypeRes = GetThisParameterType<typeof a.hello>;


// ============================= 分割线 =======================


// 构造器
// GetInstanceType
type GetInstanceType<ConstructorType extends new (...args: any) => any> 
    = ConstructorType extends new (...args: any) => infer InstanceType 
        ? InstanceType 
        : any;

interface Person {
    name: string;
}

interface PersonConstructor {
    new(name: string): Person;
}

type GetInstanceTypeRes = GetInstanceType<PersonConstructor>;

// GetConstructorParameters
type GetConstructorParameters<
    ConstructorType extends new (...args: any) => any
> = ConstructorType extends new (...args: infer ParametersType) => any
    ? ParametersType
    : never;

type GetConstructorParametersRes = GetConstructorParameters<PersonConstructor>;


// ============================= 分割线 =======================



// 索引类型
// GetRefProps
// 通过 keyof Props 取出 Props 的所有索引构成的联合类型，判断下 ref 是否在其中，也就是 'ref' extends keyof Props。
// 在 ts3.0 里面如果没有对应的索引，Obj[Key] 返回的是 {} 而不是 never，所以这样做下兼容处理。
type GetRefProps<Props> = 
    'ref' extends keyof Props
        ? Props extends { ref?: infer Value | undefined}
            ? Value
            : never
        : never;

type GetRefPropsRes = GetRefProps<{ ref?: 1, name: 'a'}>;

type GetRefPropsRes2 = GetRefProps<{ ref?: undefined, name: 'a'}>;