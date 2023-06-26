## TypeScript 类型系统中的类型

1. JS的基础类型`number`、`boolean`、`string`、`object`、`bigint`、`symbol`、`undefined`、`null` 
   及其包装类型 `Number`、`Boolean`、`String`、`Object`、`Symbol`

2. 复杂类型`class`、`Array`、`Function`等，元组（`Tuple`）、接口（`Interface`）、枚举（`Enum`）。对象类型、class 类型在 TypeScript 里叫做索引类型）

3. 特殊类型`void`、`never`、`any`、`unknown`


## 类型装饰

* `readonly` 只读
* `-readonly` 去掉只读
* `?` 可选
* `-?` 去掉可选成为必需

## TypeScript 类型系统中的类型运算

* 条件：`extends ? :`
* 推导：`infer`
* 联合：`｜`
* 交叉：`&`
* 类型映射：`keyof T` 是查询索引类型中所有的索引，叫做索引查询。
`T[Key]` 是取索引类型某个索引的值，叫做索引访问。
`in` 是用于遍历联合类型的运算符。
索引也可以做变化，用 as 运算符，叫做重映射。

```typescript
type MapType<T> = {
    [
        Key in keyof T 
            as `${Key & string}${Key & string}${Key & string}`
    ]: [T[Key], T[Key], T[Key]]
}

type res = MapType<{a: 1, b: 2}>;
```

## 类型编程

### ParseQueryString

```typescript
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

```

### Promise.all Promise.race

`unknown[] | []` 就是 `as const`

`T[]['number']` 转换为联合类型

```typescript

    interface MyPromiseConstructor {
        all<T extends readonly unknown[] | []>(
            values: T
        ): Promise<{
            -readonly [K in keyof T]: Awaited<T[K]>;
        }>;
        race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
    }
    declare const promise: MyPromiseConstructor;
    const allRes = promise.all([Promise.resolve(1),Promise.resolve(1), Promise.resolve(3)])
    const raceRes = promise.race([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);
    
    type pRes = [Promise<1>,Promise<2>,Promise<3>][number];
```

### currying

```typescript
    //currying
    type CurryFunc<Params, Result> = Params extends [infer Arg, ...infer Rest] ? (arg: Arg) => CurryFunc<Rest, Result> : Result;
    declare function currying<Func>(fn: Func): Func extends (...args: infer Params) => infer Res ? CurryFunc<Params, Res> : never;
    const func = (a: string, b: number, c: boolean) => {};
    const CurryFuncResult = currying(func);
```
