
type TestAny<T> = T extends number ? 1 : 2;
type TestAnyResult = TestAny<any>;

// IsAny
type IsAny<T> = 123 extends ('adf' & T) ? true : false;
type IsAnyResult1 = IsAny<123>;
type IsAnyResult2 = IsAny<any>;

// IsEqual
type IsEqual1<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
type IsEqual1Result1 = IsEqual1<1, any>;
type IsEqual1Result2 = IsEqual1<1, 2>;
type IsEqual1Result3 = IsEqual1<1, 1>;

type IsEqual2<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type IsEqual2Result1 = IsEqual2<1, any>;
type IsEqual2Result2 = IsEqual2<1, 2>;
type IsEqual2Result3 = IsEqual2<1, 1>;

// IsNever
type TestNever<T> = T extends number ? 1 : 2;
type TestNeverResult = TestNever<never>;

type IsNever<T> = [T] extends [never] ? true : false;
type IsNeverResult1 = IsNever<11>;
type IsNeverResult2 = IsNever<any>;
type IsNeverResult3 = IsNever<never>;


// IsTuple
type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? false : true;
type IsTuple<T> = T extends [...infer Els] ? NotEqual<Els['length'], number> : false;
type IsTupleResult1 = IsTuple<[1]>;
type IsTupleResult2 = IsTuple<string[]>;


// UnionToIntersection
type UnionToIntersection<U> = (U extends U ? (arg: U) => unknown : never) extends (arg: infer R) => unknown ? R : never;
type UnionToIntersectionResult = UnionToIntersection<{a: 1} | {b: 2}>;


// GetOptional
type GetOptional<Obj extends Record<string, any>> = {
  [Key in keyof Obj  as { } extends Pick<Obj, Key> ? Key : never]: Obj[Key]
};
type GetOptionalResult = GetOptional<{a: 1, b?: 2, c?: 3, d: 4}>;

// GetRequired
type GetRequired<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? never : Key] : Obj[Key]
};
type GetRequiredResult = GetRequired<{ a: 1, b?: 2, c?: 3, d: 4 }>;

// RemoveIndexSignature
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never] : Obj[Key]
};
type RemoveIndexSignatureResult = RemoveIndexSignature<
{[key: string]: any;
sleep(): void;}
>;

// GetClassPublicProps
class Cat {
  public name: string;
  protected age: number;
  private hobbies: string[];

  constructor() {
    this.name = 'fafa';
    this.age = 20;
    this.hobbies = ['sleep', 'eat'];
  }
}
type GetClassPublicProps<Obj extends Record<string, any>> = { [Key in keyof Obj]: Obj[Key]};
type GetClassPublicPropsResult = GetClassPublicProps<Cat>;


// as const
const obj1 = {
  a: 1,
  b: 2
}

type ObjType1 = typeof obj1;

const obj2 = {
  a: 1,
  b: 2
} as const

type ObjType2 = typeof obj2;

const arr1 = [1, 2]
type ArrType1 = typeof arr1;

const arr2 = [1, 2] as const
type ArrType2 = typeof arr2;

type ReverseArr1<Arr> = Arr extends [infer A, infer B] ? [B, A]: never;
type ReverseArr2<Arr> = Arr extends readonly[infer A, infer B] ? [B, A] : never;
type ReverseArrResult1 = ReverseArr1<[1,2]>;
type ReverseArrResult2 = ReverseArr2<ArrType2>;