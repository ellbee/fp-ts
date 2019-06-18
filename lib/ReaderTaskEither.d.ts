import { Alt3 } from './Alt';
import { Bifunctor3 } from './Bifunctor';
import { Either } from './Either';
import { IO } from './IO';
import { IOEither } from './IOEither';
import { Monad3 } from './Monad';
import { MonadTask3 } from './MonadTask';
import { MonadThrow3 } from './MonadThrow';
import { Monoid } from './Monoid';
import { Reader } from './Reader';
import { ReaderEither } from './ReaderEither';
import { Semigroup } from './Semigroup';
import { Task } from './Task';
import * as TE from './TaskEither';
import TaskEither = TE.TaskEither;
declare module './HKT' {
    interface URItoKind3<R, E, A> {
        ReaderTaskEither: ReaderTaskEither<R, E, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "ReaderTaskEither";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface ReaderTaskEither<R, E, A> {
    (r: R): TaskEither<E, A>;
}
/**
 * @since 2.0.0
 */
export declare function run<R, E, A>(ma: ReaderTaskEither<R, E, A>, r: R): Promise<Either<E, A>>;
/**
 * @since 2.0.0
 */
export declare function left<R, E>(e: E): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare const right: <R, A>(a: A) => ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function rightTask<R, A>(ma: Task<A>): ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftTask<R, E>(me: Task<E>): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare const fromTaskEither: <R, E, A>(ma: TaskEither<E, A>) => ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare const rightReader: <R, A>(ma: Reader<R, A>) => ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftReader<R, E>(me: Reader<R, E>): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare function fromIOEither<R, E, A>(ma: IOEither<E, A>): ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromReaderEither<R, E, A>(ma: ReaderEither<R, E, A>): ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function rightIO<R, A>(ma: IO<A>): ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftIO<R, E>(me: IO<E>): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare function fold<R, E, A, B>(onLeft: (e: E) => Reader<R, Task<B>>, onRight: (a: A) => Reader<R, Task<B>>): (ma: ReaderTaskEither<R, E, A>) => Reader<R, Task<B>>;
/**
 * @since 2.0.0
 */
export declare function getOrElse<R, E, A>(onLeft: (e: E) => Reader<R, Task<A>>): (ma: ReaderTaskEither<R, E, A>) => Reader<R, Task<A>>;
/**
 * @since 2.0.0
 */
export declare function orElse<R, E, A, M>(f: (e: E) => ReaderTaskEither<R, M, A>): (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, M, A>;
/**
 * @since 2.0.0
 */
export declare function swap<R, E, A>(ma: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, A, E>;
/**
 * @since 2.0.0
 */
export declare function getSemigroup<R, E, A>(S: Semigroup<A>): Semigroup<ReaderTaskEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplySemigroup<R, E, A>(S: Semigroup<A>): Semigroup<ReaderTaskEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplyMonoid<R, E, A>(M: Monoid<A>): Monoid<ReaderTaskEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare const ask: <R>() => ReaderTaskEither<R, never, R>;
/**
 * @since 2.0.0
 */
export declare const asks: <R, A>(f: (r: R) => A) => ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function local<Q, R>(f: (f: Q) => R): <E, A>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<Q, E, A>;
/**
 * @since 2.0.0
 */
export declare const readerTaskEither: Monad3<URI> & Bifunctor3<URI> & Alt3<URI> & MonadTask3<URI> & MonadThrow3<URI>;
/**
 * Like `readerTaskEither` but `ap` is sequential
 * @since 2.0.0
 */
export declare const readerTaskEitherSeq: typeof readerTaskEither;
declare const alt: <R, E, A>(that: () => ReaderTaskEither<R, E, A>) => (fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>, ap: <R, E, A>(fa: ReaderTaskEither<R, E, A>) => <B>(fab: ReaderTaskEither<R, E, (a: A) => B>) => ReaderTaskEither<R, E, B>, apFirst: <R, E, B>(fb: ReaderTaskEither<R, E, B>) => <A>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>, apSecond: <R, E, B>(fb: ReaderTaskEither<R, E, B>) => <A>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>, bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => <R>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, B>, chain: <R, E, A, B>(f: (a: A) => ReaderTaskEither<R, E, B>) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>, chainFirst: <R, E, A, B>(f: (a: A) => ReaderTaskEither<R, E, B>) => (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>, flatten: <R, E, A>(mma: ReaderTaskEither<R, E, ReaderTaskEither<R, E, A>>) => ReaderTaskEither<R, E, A>, map: <A, B>(f: (a: A) => B) => <R, E>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>, mapLeft: <E, G, A>(f: (e: E) => G) => <R>(fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, G, A>, fromOption: <E>(onNone: () => E) => <R, A>(ma: import("./Option").Option<A>) => ReaderTaskEither<R, E, A>, fromEither: <R, E, A>(ma: Either<E, A>) => ReaderTaskEither<R, E, A>, fromPredicate: {
    <E, A, B extends A>(refinement: import("./function").Refinement<A, B>, onFalse: (a: A) => E): <U>(a: A) => ReaderTaskEither<U, E, B>;
    <E, A>(predicate: import("./function").Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderTaskEither<R, E, A>;
}, filterOrElse: {
    <E, A, B extends A>(refinement: import("./function").Refinement<A, B>, onFalse: (a: A) => E): <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>;
    <E, A>(predicate: import("./function").Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>;
};
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, flatten, map, mapLeft, fromOption, fromEither, fromPredicate, filterOrElse };
