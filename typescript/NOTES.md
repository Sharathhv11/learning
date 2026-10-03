# TypeScript Notes

Practical notes for revision, interviews, and TypeScript work in React and Next.js projects.

## 1. What is TypeScript?

- TypeScript is a superset of JavaScript that adds a static type system.
- JavaScript types are mainly checked while the program runs. TypeScript checks many mistakes before the program runs.
- TypeScript improves editor completion, refactoring, documentation, and error detection in larger codebases.
- **Type inference** means TypeScript can often determine a type from a value without an annotation.
- TypeScript source is compiled (transpiled) to JavaScript, which browsers and Node.js execute.
- Types are removed during compilation. TypeScript does **not** exist at runtime and does not automatically validate API or user input at runtime.

```ts
const port = 3000; // inferred as number
const title: string = "Dashboard"; // explicit annotation
```

Use `tsconfig.json` to control the compiler. `strict: true` is strongly recommended for new projects.

## 2. Basic Types

| Type        | Meaning                                            | Common use                               |
| ----------- | -------------------------------------------------- | ---------------------------------------- |
| `number`    | Integers and floating-point values                 | Counts, prices, IDs when numeric         |
| `string`    | Text                                               | Names, labels, messages                  |
| `boolean`   | `true` or `false`                                  | Flags and conditions                     |
| `bigint`    | Integers larger than `number` can safely represent | Rare; very large integers                |
| `symbol`    | Unique runtime values                              | Rare; unique object keys                 |
| `any`       | Disables useful type checking                      | Temporary migration only                 |
| `unknown`   | A value of an unknown type                         | Safe boundaries such as parsed input     |
| `null`      | Deliberate absence of a value                      | Nullable fields                          |
| `undefined` | Missing or not assigned                            | Optional values                          |
| `void`      | A function does not return a useful value          | Side-effect functions                    |
| `never`     | A value that can never occur                       | Throwing functions and exhaustive checks |

```ts
let count: number = 3;
let label: string = "ready";
let enabled: boolean = true;
let input: unknown = JSON.parse(rawJson);

function fail(message: string): never {
  throw new Error(message);
}
```

`number`, `string`, `boolean`, `unknown`, object types, unions, and generics are common. `bigint`, `symbol`, `void`, and `never` are useful in specific situations. Prefer `unknown` to `any` when a value is not yet understood.

## 3. Type Annotations vs Type Inference

An annotation states the intended type explicitly. Inference lets TypeScript derive it.

```ts
const retries = 3; // inferred: number
let status: "idle" | "loading" = "idle"; // explicit restricted type
```

- Prefer inference for obvious local values.
- Annotate public function parameters, exported APIs, object shapes, empty collections, and values whose type is not obvious.
- An annotation is a constraint, not a conversion: `const value: number = "3"` is an error.
- Avoid annotating every variable with a type that TypeScript already knows.

## 4. Arrays

```ts
const scores: number[] = [80, 95];
const names: Array<string> = ["Asha", "Leo"]; // generic syntax
const values: (string | number)[] = ["page", 1];
```

`T[]` and `Array<T>` mean the same thing for ordinary arrays. Union element types allow different values, but every element must match the union. A mixed array is not automatically a tuple: use a tuple when position and length have meaning.

## 5. Tuples

A tuple is an array with a known number of positions and a specific type at each position.

```ts
const response: [number, string] = [200, "OK"];
```

- Array: many items of one element type, usually variable length.
- Tuple: fixed structure, useful for small return values such as `[value, error]` or coordinate pairs.
- Tuples can have optional or rest elements, but do not use them when a named object would be clearer.

## 6. Enums

Enums create a named set of constants.

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
}

const direction: Direction = Direction.Up;
```

- Numeric enums auto-increment, but explicit string values are usually easier to debug and safer across API boundaries.
- `const enum` can be inlined by the compiler, but it has toolchain and library compatibility considerations. Avoid it in published libraries unless the build setup is deliberate.
- Enums are a TypeScript feature that can emit JavaScript at runtime. They are not just erased types.
- For many application cases, a string literal union is simpler and has no runtime object:

```ts
type Theme = "light" | "dark";
```

## 7. Functions

```ts
function formatPrice(amount: number, currency = "USD"): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function logEvent(message: string, details?: string): void {
  console.log(message, details);
}
```

- Type every parameter; an untyped parameter can become an implicit `any` under weak compiler settings.
- Annotate return types for exported functions, public APIs, callbacks with important contracts, and recursive functions.
- An optional parameter uses `?` and must come after required parameters. Its type includes `undefined`.
- A default parameter is optional at the call site and has the default value when omitted.
- `void` means the caller should not use a returned value. It does not mean the function can never return internally.

Function types describe callable values:

```ts
type Comparator<T> = (left: T, right: T) => number;
const byLength: Comparator<string> = (a, b) => a.length - b.length;
```

## 8. Objects

```ts
type Account = {
  readonly id: string;
  displayName: string;
  avatarUrl?: string;
};
```

- Object types describe the required properties and their types.
- `?` makes a property optional; reading it may produce `undefined`.
- `readonly` prevents assignment through that property after initialization:

```ts
const account: Account = { id: "a1", displayName: "Mina" };
// account.id = "a2"; // TypeScript error
```

`readonly` is compile-time protection, not deep runtime immutability. It does not freeze an object and does not make nested properties readonly unless they are also marked.

## 9. Type Aliases

A type alias gives a reusable name to a type expression.

```ts
type UserId = string;
type Result = { ok: true; value: string } | { ok: false; error: Error };
```

Use aliases for unions, tuples, function types, object shapes, and domain names. An alias does not create a new runtime value or a nominal type; it is removed during compilation.

## 10. Type vs Interface

Both can describe object shapes and are structurally typed: a value is compatible when its required structure matches.

| Feature             | `type`                    | `interface`                            |
| ------------------- | ------------------------- | -------------------------------------- |
| Object properties   | Yes                       | Yes                                    |
| Unions and tuples   | Yes                       | No, use a type alias                   |
| Extension           | Intersections (`&`)       | `extends`                              |
| Declaration merging | No                        | Yes                                    |
| Typical use         | Flexible type composition | Public object contracts and class APIs |

```ts
interface Person {
  name: string;
}

interface Employee extends Person {
  employeeId: string;
}

type Audited = { createdAt: Date };
type AuditedEmployee = Employee & Audited;
```

Declaration merging combines interface declarations with the same name. This is useful for library augmentation but can be surprising in application code:

```ts
interface Settings {
  locale: string;
}
interface Settings {
  timezone: string;
}
// Settings now requires both properties.
```

Practical rule: use either consistently. Many teams use `interface` for extendable object contracts and `type` for unions and composition. Neither is universally better.

Interview points: interfaces can merge; type aliases can represent unions; both support extension-like composition; both are erased at runtime.

## 11. Union Types

A union means **OR**: a value may be one of several types.

```ts
function printId(id: string | number): string {
  return String(id);
}
```

Only operations common to every member are safe until the value is narrowed. Unions are useful for API states, input variants, and controlled options.

## 12. Intersection Types

An intersection means **AND**: a value must satisfy every combined type.

```ts
type HasId = { id: string };
type HasTimestamps = { createdAt: Date; updatedAt: Date };
type Entity = HasId & HasTimestamps;
```

Do not confuse `A | B` with `A & B`: a union accepts either shape, while an intersection requires all properties. Intersections of incompatible primitive types can become `never`.

## 13. Literal Types

Literal types restrict a value to exact values.

```ts
type HttpMethod = "GET" | "POST";
type RetryCount = 0 | 1 | 2;
type Enabled = true;
```

They are useful for configuration, UI states, action names, and safer function arguments. `const` often preserves a literal value, while a mutable `let` usually widens it to `string`, `number`, or `boolean`.

## 14. Nullable Types

With `strictNullChecks` (included by `strict`), `null` and `undefined` are not assignable to ordinary types.

```ts
function greet(name: string | null): string {
  return name === null ? "Hello" : `Hello ${name}`;
}

let selectedId: string | undefined;
```

- `null` commonly means deliberately empty.
- `undefined` commonly means missing or not provided.
- Model absence explicitly with `T | null` or `T | undefined`.
- Narrow before using the value, or use `?.` and `??` where appropriate.
- Turning off strict null checking hides real bugs and is discouraged.

## 15. Type Narrowing

Narrowing reduces a union to a more specific type based on runtime checks. TypeScript follows control flow.

```ts
function describe(value: string | Date): string {
  if (typeof value === "string") return value.toUpperCase();
  return value.toISOString();
}
```

- `typeof`: primitives such as `string`, `number`, and `boolean`.
- `instanceof`: class instances such as `Date`.
- `in`: whether a property exists on an object variant.
- Truthiness: removes `null` and `undefined`, but also treats `0`, `""`, and `false` as absent, so use an explicit check when those are valid.

```ts
type Cat = { meow: () => void };
type Dog = { bark: () => void };
function speak(pet: Cat | Dog): void {
  if ("meow" in pet) pet.meow();
  else pet.bark();
}
```

Custom type predicates (`value is SomeType`) can teach TypeScript about a validated runtime check. The predicate must be truthful; the compiler cannot verify its implementation.

## 16. Optional Chaining and Nullish Coalescing

These are JavaScript features supported by TypeScript; TypeScript checks their types.

```ts
const city = profile?.address?.city;
const pageSize = settings.pageSize ?? 20;
```

- `?.` stops and returns `undefined` when the value before it is `null` or `undefined`.
- `??` uses the fallback only for `null` or `undefined`.
- `||` uses the fallback for any falsy value, including `0`, `false`, and `""`.

Use `??` when zero, false, or an empty string are valid values. Use `||` only when all falsy values should trigger the fallback.

# TypeScript Concepts I Should Learn Next

| Concept                   | Simple explanation and example                                                                 | Why useful                                        | Interview importance            |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- | ---- |
| Generics                  | Preserve a relationship between types: `function first<T>(items: T[]): T { return items[0]; }` | Reusable, type-safe functions and components      | High                            |
| Generic constraints       | Limit a generic: `function idOf<T extends { id: string }>(x: T) { return x.id; }`              | Safely use required properties                    | High                            |
| Type assertions           | Tell the compiler what you know: `const el = node as HTMLButtonElement`                        | DOM and validated external data; no runtime check | High                            |
| `keyof`                   | Produces the keys of a type: `type UserKey = keyof User`                                       | Safe property access and generic helpers          | High                            |
| `typeof` in type contexts | Gets a type from a value: `const config = {...}; type Config = typeof config`                  | Avoids repeating object types                     | Medium                          |
| Utility types             | Built-in type transformations such as `Partial<T>`                                             | Quickly derive related API and state types        | High                            |
| `Partial<T>`              | Makes properties optional: `type Patch = Partial<User>`                                        | Update/patch payloads                             | High                            |
| `Required<T>`             | Makes properties required: `type Complete = Required<Config>`                                  | Enforce fully initialized objects                 | Medium                          |
| `Readonly<T>`             | Makes properties readonly: `type Snapshot = Readonly<State>`                                   | Model immutable views                             | Medium                          |
| `Pick<T, K>`              | Keeps selected keys: `Pick<User, "id"                                                          | "name">`                                          | Small view models and responses | High |
| `Omit<T, K>`              | Removes selected keys: `Omit<User, "password">`                                                | Public objects without private fields             | High                            |
| `Record<K, V>`            | Maps keys to one value type: `Record<string, number>`                                          | Dictionaries and lookup tables                    | High                            |
| `ReturnType<F>`           | Extracts a function's return type: `ReturnType<typeof loadUser>`                               | Connect related APIs and helpers                  | Medium                          |
| `Parameters<F>`           | Extracts parameter tuple: `Parameters<typeof loadUser>`                                        | Reuse function signatures                         | Medium                          |
| Index signatures          | Describe dynamic keys: `{ [key: string]: number }`                                             | Dictionaries with unknown property names          | Medium                          |
| Discriminated unions      | Union members share a literal tag: `{ kind: "ok"; value: string }`                             | Exhaustive, readable state handling               | High                            |
| Conditional types         | Choose a type using a condition: `T extends string ? 1 : 2`                                    | Advanced reusable type logic                      | Medium                          |
| Mapped types              | Transform each key: `{ [K in keyof T]?: T[K] }`                                                | Build custom utility types                        | Medium                          |

Do not reach for advanced type machinery first. A clear named type or discriminated union is usually easier to maintain.

# JavaScript vs TypeScript

| Area                      | JavaScript                            | TypeScript                                                          |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| Typing                    | Dynamic at runtime                    | Static checking during development plus JavaScript runtime behavior |
| Type checking             | Mostly while running                  | Before runtime through the compiler/type checker                    |
| Runtime                   | Runs directly in browsers and Node.js | Types are erased; emitted JavaScript runs                           |
| Compilation               | Often optional; may use bundlers      | Usually transpiled/bundled to JavaScript                            |
| Type inference            | Runtime values only                   | Compiler infers static types                                        |
| Interfaces                | Not available as a language type      | Compile-time object contracts                                       |
| Generics                  | Not available as a type feature       | Reusable type-safe abstractions                                     |
| Tooling                   | Good editor support                   | Stronger completion, refactoring, and diagnostics                   |
| Error detection           | Many errors appear at runtime         | Many type errors appear before runtime                              |
| Browser/Node.js execution | Executes directly                     | Executes emitted JavaScript, not `.ts` types                        |

# Common Beginner Mistakes

- **Overusing `any`:** it turns off checking and spreads uncertainty. Use a specific type, a union, or `unknown`.
- **Confusing `any` and `unknown`:** `any` permits every operation; `unknown` requires narrowing before use.
- **Confusing unions and intersections:** `A | B` is either; `A & B` is both.
- **Expecting runtime safety:** TypeScript cannot validate JSON, forms, or API responses by itself. Validate external data with runtime validation when needed.
- **Misunderstanding `readonly`:** it prevents TypeScript assignments through that property; it is not deep freezing or security.
- **Overusing assertions:** `as User` does not convert or validate data. Prefer narrowing or validation.
- **Adding unnecessary annotations:** let obvious local values be inferred; annotate meaningful boundaries.
- **Confusing `null` and `undefined`:** model the distinction intentionally and handle both when the type allows both.
- **Using truthiness for every check:** it also rejects valid `0`, `false`, and empty strings.
- **Treating TypeScript as JavaScript with annotations:** use unions, generics, narrowing, utility types, and strict settings to model the domain.

# Interview Preparation

## Beginner TypeScript Interview Questions

**Question:** What is TypeScript?
**Short Answer:** A superset of JavaScript that adds static type checking and compiles to JavaScript.
**Example:** `const total: number = 10;`

**Question:** Why use TypeScript?
**Short Answer:** It catches many mistakes early and improves completion, refactoring, and maintainability.
**Example:** `function add(a: number, b: number) { return a + b; }`

**Question:** TypeScript vs JavaScript?
**Short Answer:** TypeScript adds compile-time types; JavaScript is the runtime language executed by browsers and Node.js.
**Example:** `.ts` becomes JavaScript before normal browser execution.

**Question:** What is type inference?
**Short Answer:** The compiler derives a type from context or an assigned value.
**Example:** `const ready = true; // boolean`

**Question:** What is `any`?
**Short Answer:** An escape hatch that disables most type checking for a value.
**Example:** `let data: any; data.missingMethod();`

**Question:** What is `unknown`?
**Short Answer:** A safe top type; it can hold anything, but must be narrowed before most operations.
**Example:** `function use(value: unknown) { if (typeof value === "string") value.trim(); }`

**Question:** `any` vs `unknown`?
**Short Answer:** `any` allows unsafe operations; `unknown` forces validation or narrowing.
**Example:** `const value: unknown = getInput();`

**Question:** What is a union type?
**Short Answer:** A value that can be one of multiple types or literal values.
**Example:** `type Id = string | number;`

**Question:** What is an intersection type?
**Short Answer:** A type that must satisfy all combined types.
**Example:** `type User = HasId & HasName;`

**Question:** What is a tuple?
**Short Answer:** An array with fixed positions and known types.
**Example:** `const pair: [string, number] = ["age", 30];`

**Question:** What is an enum?
**Short Answer:** A named set of constants that can also emit a runtime JavaScript object.
**Example:** `enum Role { Admin = "admin", User = "user" }`

**Question:** What is a type alias?
**Short Answer:** A reusable name for a type expression.
**Example:** `type Point = { x: number; y: number };`

**Question:** What is `readonly`?
**Short Answer:** A compile-time restriction preventing assignment through a property after initialization.
**Example:** `type Config = { readonly port: number };`

**Question:** What is type narrowing?
**Short Answer:** Using control-flow checks to reduce a broad type to a safe specific type.
**Example:** `if (typeof value === "string") value.toUpperCase();`

**Question:** What are optional chaining and nullish coalescing?
**Short Answer:** `?.` safely accesses nullable values; `??` supplies a fallback only for `null` or `undefined`.
**Example:** `user?.name ?? "Guest"`

## Intermediate TypeScript Interview Questions

**Question:** What are generics?
**Short Answer:** Type parameters that preserve relationships while making code reusable.
**Example:** `function echo<T>(value: T): T { return value; }`

**Question:** What is a generic constraint?
**Short Answer:** A restriction on a generic type parameter using `extends`.
**Example:** `function keyOf<T extends object>(value: T, key: keyof T) { return value[key]; }`

**Question:** What is the difference between `type` and `interface`?
**Short Answer:** Both model object shapes; interfaces merge and extend with `extends`, while aliases handle unions and intersections directly.
**Example:** `interface Admin extends User { permissions: string[] }`

**Question:** What is declaration merging?
**Short Answer:** TypeScript combines multiple declarations with the same interface name.
**Example:** `interface Window { appVersion: string }` augments the global `Window` type.

**Question:** How do interfaces and type aliases extend types?
**Short Answer:** Interfaces use `extends`; aliases commonly use intersections.
**Example:** `type Admin = User & { permissions: string[] };`

**Question:** What is a type assertion?
**Short Answer:** A compile-time claim about a value; it does not convert or validate the runtime value.
**Example:** `const button = element as HTMLButtonElement;`

**Question:** What is `keyof`?
**Short Answer:** A type operator that creates a union of property keys.
**Example:** `type UserKey = keyof User;`

**Question:** What is `typeof` in a type context?
**Short Answer:** It derives a type from an existing value.
**Example:** `const defaults = { page: 1 }; type Defaults = typeof defaults;`

**Question:** What are utility types?
**Short Answer:** Built-in generic types that transform existing types.
**Example:** `type EditableUser = Partial<User>;`

**Question:** What is a discriminated union?
**Short Answer:** A union whose members share a literal property used for narrowing.
**Example:** `type State = { kind: "loading" } | { kind: "error"; message: string };`

**Question:** What is an index signature?
**Short Answer:** A type for objects with dynamic property names of a known value type.
**Example:** `type Scores = { [player: string]: number };`

**Question:** What is structural typing?
**Short Answer:** Compatibility is based on members and shape, not explicit class or type names.
**Example:** `{ name: string }` can accept any object with a string `name` property.

**Question:** What does `strict` enable?
**Short Answer:** A family of stricter checks, including strict null checking and safer function handling.
**Example:** `// tsconfig.json: { "compilerOptions": { "strict": true } }`

**Question:** What is the difference between `void` and `never`?
**Short Answer:** `void` describes a function whose result is not useful; `never` means execution cannot produce a value.
**Example:** `function stop(): never { throw new Error(); }`

**Question:** How do you make a union exhaustive?
**Short Answer:** Narrow on its discriminant and use a `never` check in the default branch.
**Example:** `const exhaustive: never = state;`

**Question:** Does TypeScript validate API responses at runtime?
**Short Answer:** No. Types disappear, so external data needs runtime validation when correctness matters.
**Example:** Parse JSON, then validate its shape before treating it as `User`.

# Quick Revision Cheat Sheet

```ts
let count: number = 1;
const names: string[] = ["A", "B"];
const pair: [string, number] = ["age", 30];

type User = { readonly id: string; name?: string };
interface Admin extends User {
  permissions: string[];
}

type Id = string | number; // OR
type FullUser = User & Admin; // AND
type Mode = "view" | "edit"; // literals

function get<T>(value: T): T {
  return value;
} // generic
function run(input: unknown): void {
  if (typeof input === "string") console.log(input);
}

value?.deep?.property ?? fallback;
Partial<User>;
Required<User>;
Readonly<User>;
Pick<User, "id">;
Omit<User, "id">;
Record<string, number>;
```

- Prefer inference for obvious locals; annotate boundaries.
- Prefer `unknown` to `any`.
- Narrow unions before using member-specific operations.
- `|` means OR; `&` means AND.
- `?.` protects nullable access; `??` preserves valid falsy values.
- Types are erased; runtime validation is separate.
- Enable `strict`.

# Learning Priority

### Must Know

Types and inference, arrays, objects, functions, unions, intersections, literals, nullable values, narrowing, `type` vs `interface`, generics, `unknown` vs `any`, utility types, and strict compiler settings.

### Good to Know

Enums, tuples, declaration merging, index signatures, discriminated unions, `keyof`, `typeof` in type contexts, `Record`, `ReturnType`, `Parameters`, and runtime validation at application boundaries.

### Advanced

Conditional types, mapped types, recursive types, template literal types, variance, declaration files, module augmentation, and advanced library type design.
