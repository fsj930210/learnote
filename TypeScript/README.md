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