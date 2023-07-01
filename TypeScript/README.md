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

### 逆变、协变、双向协变、不变

 1. 协变
 协变就是子类型可以赋值给父类型，子类型就是更具体的类型，函数的返回值是协变的
 ```typescript
    interface Person {
        name: string;
        age: number;
    } 

    interface Guang {
        name: string;
        age: number;
        hobbies: string[]
    }
    let person: Person = {
        name: '',
        age: 20
    };
    let a: Guang = {
        name: 'guang',
        age: 20,
        hobbies: ['play game', 'writing']
    };

    person = a;
 ```
  2. 逆变

**逆变是父类型可以赋值给子类型
函数的参数是逆变的，因为子类型更具体，所以函数体可能只会用到子类型特有的属性或者方法。参数是父类型的函数，其函数体只会用到父类型的属性或者方法；所以参数是父类型的函数可以赋值给参数是子类型的函数。
这样才能保证类型安全**

  ```typescript
    interface Person222 {
        name: string;
        age: number;
    }

    interface AAAA {
        name: string;
        age: number;
        hobbies: string[]
    }

    let printHobbies: (aaaa: AAAA) => void;

    printHobbies = (aaaa) => {
        console.log(aaaa.hobbies);
    }

    let printName: (person: Person222) => void;

    printName = (person) => {
        console.log(person.name);
    }

    printHobbies = printName;

    printName = printHobbies;
```
3. 双向协变
开启`strictFunctionTypes` 的编译选项后函数参数就是双向协变的
4. 不变
非父子类型的类型就是不变的

### 特别说明

1. **类型编程中如果需要取类型参数做一些计算的时候，默认推导出的是约束的类型，如果没有类型约束，那就是 unknown。**

这里把`Arr['length'] extends Length`改变顺序为`Length extends Arr['length']`时，会报错无限递归。
Add 将 Num1约束为number，其实就是Length约束为number，如果将Num1约束为数字字面量就不会报错
是因为在计算时`Length`其实传入的是 `number`：`number extends` 某个具体的数字自然永远不成立，永远是 `false`，所以就无限递归了
```typescript
// extends 约束
    // type BuildArrayTest<
    // 	Length extends number,
    // 	Ele = unknown,
    // 	Arr extends unknown[] = []
    // > = Length extends Arr['length']
    // 	? Arr
    // 	: BuildArrayTest<Length, Ele, [...Arr, Ele]>;

    // type AddTest<Num1 extends number, Num2 extends number> =
    // 	[...BuildArrayTest<Num1>, ...BuildArrayTest<Num2>]['length'];

    // type AddTestResult = Add<32, 25>;

    // type BuildArrayTest<
    // 	Length extends number,
    // 	Ele = unknown,
    // 	Arr extends unknown[] = []
    // > = Length extends Arr['length']
    // 	? Arr
    // 	: BuildArrayTest<Length, Ele, [...Arr, Ele]>;

    // type AddTest<Num1 extends 32, Num2 extends 25> =
    // 	[...BuildArrayTest<Num1>, ...BuildArrayTest<Num2>]['length'];

    // type AddTestResult = Add<32, 25>;

    type BuildArrayTest<
        Length extends number,
        Ele = unknown,
        Arr extends unknown[] = []
        > = Arr['length'] extends Length
        ? Arr
        : BuildArrayTest<Length, Ele, [...Arr, Ele]>;

    type AddTest<Num1 extends number, Num2 extends number> =
        [...BuildArrayTest<Num1>, ...BuildArrayTest<Num2>]['length'];

    type AddTestResult = Add<32, 25>;
```

2. **`boolean`类型其实是联合类型`true|false`**
3. **条件类型中 any 的特殊处理，如果左边是 any，则会返回 trueType 和 falseType 的联合类型**
4. **当条件类型左边是 never 的时候，就会直接返回 never。**

```typescript
// 分布式注意事项
// 联合类型在extends左边时触发分布式特性所以是1|2
type TestNum<T> = T extends number ? 1 : 2;

type ResNum = TestNum<1 | 'a'>; // 1|2
// boolean类型其实是true|false所以也会触发分布式
type TestBoolean<T> = T extends true ? 1 : 2;

type ResBoolean = TestBoolean<boolean>; // 1|2

// 条件类型中 any 的特殊处理，如果左边是 any，则会返回 trueType 和 falseType 的联合类型
type TestAny1<T> = T extends true ? 1 : 2;

type ResAny = TestAny1<any>; // 1|2
//当条件类型左边是 never 的时候，就会直接返回 never。
type TestNever1<T> = T extends true ? 1 : 2;

type ResNever = TestNever1<never>; // never

```

### TypeScript 有三种存放类型声明的地方

 * `lib`： 内置的类型声明，包含 `dom` 和 `es`的，因为这俩都是有标准的。
 * `@types/xx`： 其他环境的 `api` 类型声明，比如 `node`，还有` npm` 包的类型声明
 * 开发者写的代码：通过 `include` + `exclude` 还有 `files` 指定

 ### TS 声明模块的方式
 * `namespace`：最早的实现模块的方式，编译为声明对象和设置对象的属性的 JS 代码，很容易理解
* `module`：和 `namespace` 的 `AST` 没有任何区别，只不过一般用来声明 `CommonJS` 的模块，在 `@types/node` 下有很多
* `es module`：`es` 标准的模块语法，`ts` 额外扩展了 `import type`

```typescript
// namespace
namespace React{}
// module
declare module{}
// es module
export xxxx
import xxxx
```

**`.d.ts` 中，如果没有 `import`、`export` 语法，那所有的类型声明都是全局的，否则是模块内的。**

### 声明全局模块
1. ` declare  global`
2. 通过编译器指令 `reference`

```typescript
 declare global{
    const func(a: number, b: number) => void
}
/// <reference types="node"/>
/// <reference lib="es2020"/>
/// <reference path="assert/strict.d.ts"/>
```
### 编译优化

在独立的模块下添加 `tsconfig.json`，加上 `composite` 的编译选项，在入口的 `tsconfig.json` 里配置 `references` 引用这些独立的模块。然后执行 `tsc --build` 或者 `tsc -b` 来编译。

原理是编译时会生成 `tsconfig.tsbuildinfo` 的文件，记录着编译的文件和它们的 `hash`，当再次编译的时候，如果文件 `hash` 没变，那就直接跳过，从而提升了编译速度

### satisfies

`satisfies`可以给扩展的类型增加提示，但是不能动态扩展

```typescript
    type Obj = {
        a: number;
        b: string;
        c: Function;
        [key: string]: any;
    }
    const obj123 = {
        a: 1,
        b: 'b',
        c: () => {
            console.log('c')
        },
        d: 5
    } satisfies Obj
    obj123.d // 可以提示d
    obj123.e = '44' // 报错不能动态扩展
```