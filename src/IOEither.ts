/**
 * @file `IOEither<E, A>` represents a synchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `E`. If you want to represent a synchronous computation that never fails, please see `IO`.
 */
import { Alt2, Alt2C } from './Alt'
import { Bifunctor2 } from './Bifunctor'
import * as E from './Either'
import { getEitherM } from './EitherT'
import { Lazy } from './function'
import { getSemigroup as getIOSemigroup, IO, io } from './IO'
import { Monad2, Monad2C } from './Monad'
import { MonadIO2 } from './MonadIO'
import { MonadThrow2 } from './MonadThrow'
import { Monoid } from './Monoid'
import { pipeable } from './pipeable'
import { Semigroup } from './Semigroup'
import { getValidationM } from './ValidationT'

import Either = E.Either

const T = getEitherM(io)

declare module './HKT' {
  interface URItoKind2<E, A> {
    IOEither: IOEither<E, A>
  }
}

/**
 * @since 2.0.0
 */
export const URI = 'IOEither'

/**
 * @since 2.0.0
 */
export type URI = typeof URI

/**
 * @since 2.0.0
 */
export interface IOEither<E, A> extends IO<Either<E, A>> {}

/**
 * @since 2.0.0
 */
export const left: <E = never, A = never>(l: E) => IOEither<E, A> = T.left

/**
 * @since 2.0.0
 */
export const right: <E = never, A = never>(a: A) => IOEither<E, A> = T.of

/**
 * @since 2.0.0
 */
export const rightIO: <E = never, A = never>(ma: IO<A>) => IOEither<E, A> = T.rightM

/**
 * @since 2.0.0
 */
export const leftIO: <E = never, A = never>(me: IO<E>) => IOEither<E, A> = T.leftM

/**
 * @since 2.0.0
 */
export function fold<E, A, B>(onLeft: (e: E) => IO<B>, onRight: (a: A) => IO<B>): (ma: IOEither<E, A>) => IO<B> {
  return ma => T.fold(ma, onLeft, onRight)
}

/**
 * @since 2.0.0
 */
export function getOrElse<E, A>(f: (e: E) => IO<A>): (ma: IOEither<E, A>) => IO<A> {
  return ma => T.getOrElse(ma, f)
}

/**
 * @since 2.0.0
 */
export function orElse<E, A, M>(f: (e: E) => IOEither<M, A>): (ma: IOEither<E, A>) => IOEither<M, A> {
  return ma => T.orElse(ma, f)
}

/**
 * @since 2.0.0
 */
export const swap: <E, A>(ma: IOEither<E, A>) => IOEither<A, E> = T.swap

/**
 * @since 2.0.0
 */
export function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<IOEither<E, A>> {
  return getIOSemigroup(E.getSemigroup<E, A>(S))
}

/**
 * @since 2.0.0
 */
export function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<IOEither<E, A>> {
  return getIOSemigroup(E.getApplySemigroup<E, A>(S))
}

/**
 * @since 2.0.0
 */
export function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<IOEither<E, A>> {
  return {
    concat: getApplySemigroup<E, A>(M).concat,
    empty: right(M.empty)
  }
}

/**
 * Constructs a new `IOEither` from a function that performs a side effect and might throw
 *
 * @since 2.0.0
 */
export function tryCatch<E, A>(f: Lazy<A>, onError: (reason: unknown) => E): IOEither<E, A> {
  return () => E.tryCatch(f, onError)
}

/**
 * Make sure that a resource is cleaned up in the event of an exception. The
 * release action is called regardless of whether the body action throws or
 * returns.
 *
 * @since 2.0.0
 */
export function bracket<E, A, B>(
  acquire: IOEither<E, A>,
  use: (a: A) => IOEither<E, B>,
  release: (a: A, e: Either<E, B>) => IOEither<E, void>
): IOEither<E, B> {
  return T.chain(acquire, a =>
    T.chain(io.map(use(a), E.right), e => T.chain(release(a, e), () => (E.isLeft(e) ? T.left(e.left) : T.of(e.right))))
  )
}

/**
 * @since 2.0.0
 */
export function getIOValidation<E>(S: Semigroup<E>): Monad2C<URI, E> & Alt2C<URI, E> {
  const T = getValidationM(S, io)
  return {
    URI,
    _E: undefined as any,
    ...T
  }
}

/**
 * @since 2.0.0
 */
export const ioEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadIO2<URI> & MonadThrow2<URI> = {
  URI,
  bimap: T.bimap,
  mapLeft: T.mapLeft,
  map: T.map,
  of: right,
  ap: T.ap,
  chain: T.chain,
  alt: T.alt,
  fromIO: rightIO,
  throwError: left
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
} = pipeable(ioEither)

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
