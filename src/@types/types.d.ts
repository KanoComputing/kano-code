interface Type<T> extends Function { new (...args : any[]) : T; }

// Use for tests. web-tester exposes chai automatically
declare const assert : Chai.Assert;

declare function fixture<T>(a : TemplateStringsArray) : () => T;
