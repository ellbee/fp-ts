/**
 * @file `TaskEither<E, A>` represents an asynchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `E`. If you want to represent an asynchronous computation that never fails, please see `Task`.
 */
import { Alt2, Alt2C } from './Alt'
import { Bifunctor2 } from './Bifunctor'
import * as E from './Either'
import { getEitherM } from './EitherT'
import { Lazy } from './function'
import { IO } from './IO'
import { IOEither } from './IOEither'
import { Monad2, Monad2C } from './Monad'
import { MonadTask2 } from './MonadTask'
import { MonadThrow2 } from './MonadThrow'
import { Monoid } from './Monoid'
import { pipeable } from './pipeable'
import { Semigroup } from './Semigroup'
import { getSemigroup as getTaskSemigroup, Task, task } from './Task'
import { getValidationM } from './ValidationT'

import Either = E.Either

const T = getEitherM(task)

declare module './HKT' {
  interface URItoKind2<E, A> {
    TaskEither: TaskEither<E, A>
  }
}

/**
 * @since 2.0.0
 */
export const URI = 'TaskEither'

/**
 * @since 2.0.0
 */
export type URI = typeof URI

/**
 * @since 2.0.0
 */
export interface TaskEither<E, A> extends Task<Either<E, A>> {}

/**
 * @since 2.0.0
 */
export const left: <E = never, A = never>(e: E) => TaskEither<E, A> = T.left

/**
 * @since 2.0.0
 */
export const right: <E = never, A = never>(a: A) => TaskEither<E, A> = T.of

/**
 * @since 2.0.0
 */
export function rightIO<E = never, A = never>(ma: IO<A>): TaskEither<E, A> {
  return rightTask(task.fromIO(ma))
}

/**
 * @since 2.0.0
 */
export function leftIO<E = never, A = never>(me: IO<E>): TaskEither<E, A> {
  return leftTask(task.fromIO(me))
}

/**
 * @since 2.0.0
 */
export const rightTask: <E = never, A = never>(ma: Task<A>) => TaskEither<E, A> = T.rightM

/**
 * @since 2.0.0
 */
export const leftTask: <E = never, A = never>(me: Task<E>) => TaskEither<E, A> = T.leftM

/**
 * @since 2.0.0
 */
export const fromIOEither: <E, A>(fa: IOEither<E, A>) => TaskEither<E, A> = task.fromIO

/**
 * @since 2.0.0
 */
export function fold<E, A, B>(
  onLeft: (e: E) => Task<B>,
  onRight: (a: A) => Task<B>
): (ma: TaskEither<E, A>) => Task<B> {
  return ma => T.fold(ma, onLeft, onRight)
}

/**
 * @since 2.0.0
 */
export function getOrElse<E, A>(f: (e: E) => Task<A>): (ma: TaskEither<E, A>) => Task<A> {
  return ma => T.getOrElse(ma, f)
}

/**
 * @since 2.0.0
 */
export function orElse<E, A, M>(f: (e: E) => TaskEither<M, A>): (ma: TaskEither<E, A>) => TaskEither<M, A> {
  return ma => T.orElse(ma, f)
}

/**
 * @since 2.0.0
 */
export const swap: <E, A>(ma: TaskEither<E, A>) => TaskEither<A, E> = T.swap

/**
 * @since 2.0.0
 */
export function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<TaskEither<E, A>> {
  return getTaskSemigroup(E.getSemigroup<E, A>(S))
}

/**
 * @since 2.0.0
 */
export function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<TaskEither<E, A>> {
  return getTaskSemigroup(E.getApplySemigroup<E, A>(S))
}

/**
 * @since 2.0.0
 */
export function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<TaskEither<E, A>> {
  return {
    concat: getApplySemigroup<E, A>(M).concat,
    empty: right(M.empty)
  }
}

/**
 * @since 2.0.0
 */
export function tryCatch<E, A>(f: Lazy<Promise<A>>, onRejected: (reason: unknown) => E): TaskEither<E, A> {
  return () => f().then(a => E.right(a), reason => E.left(onRejected(reason)))
}

/**
 * Make sure that a resource is cleaned up in the event of an exception. The
 * release action is called regardless of whether the body action throws or
 * returns.
 *
 * @since 2.0.0
 */
export function bracket<E, A, B>(
  acquire: TaskEither<E, A>,
  use: (a: A) => TaskEither<E, B>,
  release: (a: A, e: Either<E, B>) => TaskEither<E, void>
): TaskEither<E, B> {
  return T.chain(acquire, a =>
    T.chain(task.map(use(a), E.right), e =>
      T.chain(release(a, e), () => (E.isLeft(e) ? T.left(e.left) : T.of(e.right)))
    )
  )
}

/**
 * Convert a node style callback function to one returning a `TaskEither`
 *
 * **Note**. If the function `f` admits multiple overloadings, `taskify` will pick last one. If you want a different
 * behaviour, add an explicit type annotation
 *
 * ```ts
 * // readFile admits multiple overloadings
 *
 * // const readFile: (a: string) => TaskEither<NodeJS.ErrnoException, Buffer>
 * const readFile = taskify(fs.readFile)
 *
 * const readFile2: (filename: string, encoding: string) => TaskEither<NodeJS.ErrnoException, Buffer> = taskify(
 *   fs.readFile
 * )
 * ```
 *
 * @example
 * import { taskify } from 'fp-ts/lib/TaskEither'
 * import * as fs from 'fs'
 *
 * // const stat: (a: string | Buffer) => TaskEither<NodeJS.ErrnoException, fs.Stats>
 * const stat = taskify(fs.stat)
 * assert.strictEqual(stat.length, 0)
 *
 *
 * @since 2.0.0
 */
export function taskify<L, R>(f: (cb: (e: L | null | undefined, r?: R) => void) => void): () => TaskEither<L, R>
export function taskify<A, L, R>(
  f: (a: A, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A) => TaskEither<L, R>
export function taskify<A, B, L, R>(
  f: (a: A, b: B, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B) => TaskEither<L, R>
export function taskify<A, B, C, L, R>(
  f: (a: A, b: B, c: C, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B, c: C) => TaskEither<L, R>
export function taskify<A, B, C, D, L, R>(
  f: (a: A, b: B, c: C, d: D, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B, c: C, d: D) => TaskEither<L, R>
export function taskify<A, B, C, D, E, L, R>(
  f: (a: A, b: B, c: C, d: D, e: E, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A, b: B, c: C, d: D, e: E) => TaskEither<L, R>
export function taskify<L, R>(f: Function): () => TaskEither<L, R> {
  return function() {
    const args = Array.prototype.slice.call(arguments)
    return () =>
      new Promise(resolve => {
        const cbResolver = (e: L, r: R) => (e != null ? resolve(E.left(e)) : resolve(E.right(r)))
        f.apply(null, args.concat(cbResolver))
      })
  }
}

/**
 * @since 2.0.0
 */
export function getTaskValidation<E>(S: Semigroup<E>): Monad2C<URI, E> & Alt2C<URI, E> {
  const T = getValidationM(S, task)
  return {
    URI,
    _E: undefined as any,
    ...T
  }
}

/**
 * @since 2.0.0
 */
export const taskEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadTask2<URI> & MonadThrow2<URI> = {
  URI,
  bimap: T.bimap,
  mapLeft: T.mapLeft,
  map: T.map,
  of: T.of,
  ap: T.ap,
  chain: T.chain,
  alt: T.alt,
  fromIO: rightIO,
  fromTask: rightTask,
  throwError: left
}

/**
 * Like `TaskEither` but `ap` is sequential
 *
 * @since 2.0.0
 */
export const taskEitherSeq: typeof taskEither = {
  ...taskEither,
  ap: (mab, ma) => T.chain(mab, f => T.map(ma, f))
}

const {
  alt,
  ap,
  apFirst,
  apSecond,
  bimap,
  chain,
  chainFirst,
  flatten,
  map,
  mapLeft,
  fromEither,
  fromOption,
  fromPredicate,
  filterOrElse
} = pipeable(taskEither)

export {
  alt,
  ap,
  apFirst,
  apSecond,
  bimap,
  chain,
  chainFirst,
  flatten,
  map,
  mapLeft,
  fromEither,
  fromOption,
  fromPredicate,
  filterOrElse
}
