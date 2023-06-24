// Camelcase
type Camelcase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}` ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}` : Str;
type CamelcaseResult = Camelcase<'abf_agf_lkiu'>;

// CamelcaseArr
type CamelcaseArr<Arr extends unknown[]> = Arr extends [infer Item, ...infer Rest] ? [Camelcase<Item & string>, ...CamelcaseArr<Rest>] : [];
type CamelcaseArrResult = CamelcaseArr<['abc', 'abc_uuuu', 'dc_uyt', 'suia']>;

// CamelcaseUnion
type CamelcaseUnion<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}` ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}` : Str;
type CamelcaseUnionResult = Camelcase<'abf_agf' | 'sdd_lkiu' | 'juy_ppo'>;

// isUnion
type IsUnion<A, B = A> = A extends A 
? [B] extends [A]
  ? false
  : true
: never;
type isUnionResult1 = IsUnion<'a'>;
type isUnionResult2 = IsUnion<'a' | 'b'>;

// TestUnion
type TestUnion<A, B = A> = A  extends A ? { a: A, b: B} : never;

type TestUnionResult = TestUnion<'a' | 'b' | 'c'>;

// ArrayToUnion
type ArrayToUnion<Arr extends unknown[]> = Arr[number];
type ArrayToUnionResult = ArrayToUnion<['a', 'b', 'c']>;

// BEM
type BEM<
Block extends string,
Element extends string[],
Modifiers extends string[],
> = `${Block}__${Element[number]}--${Modifiers[number]}`;
type BEMResult = BEM<'el', ['message', 'notication'], ['success', 'warning', 'error']>;

// 组合
type Combination<A extends string, B extends string> =  A
  | B
  | `${A}${B}`
  | `${B}${A}`;

type AllCombinations<A extends string, B extends string = A> =  A extends A
  ? Combination<A, Exclude<B, A>> : never;

type AllCombinationsResult1 = AllCombinations<'a', 'b'>;
type AllCombinationsResult2 = AllCombinations<'a' | 'b' | 'c', 'b' | 'c' | 'd'>;