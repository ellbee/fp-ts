import {
  ApplicativeComposition12,
  ApplicativeComposition22,
  ApplicativeCompositionHKT2,
  getApplicativeComposition
} from './Applicative'
import { Either, either, fold, isLeft, left, right, swap, URI } from './Either'
import { HKT, Kind, Kind2, URIS, URIS2 } from './HKT'
import { Monad, Monad1, Monad2 } from './Monad'

/**
 * @since 2.0.0
 */
export interface EitherT<M, E, A> extends HKT<M, Either<E, A>> {}

/**
 * @since 2.0.0
 */
export interface EitherM<M> extends ApplicativeCompositionHKT2<M, URI> {
  readonly chain: <E, A, B>(ma: EitherT<M, E, A>, f: (a: A) => EitherT<M, E, B>) => EitherT<M, E, B>
  readonly alt: <E, A>(fx: EitherT<M, E, A>, f: () => EitherT<M, E, A>) => EitherT<M, E, A>
  readonly bimap: <E, A, N, B>(ma: EitherT<M, E, A>, f: (e: E) => N, g: (a: A) => B) => EitherT<M, N, B>
  readonly mapLeft: <E, A, N>(ma: EitherT<M, E, A>, f: (e: E) => N) => EitherT<M, N, A>
  readonly fold: <E, A, R>(ma: EitherT<M, E, A>, onLeft: (e: E) => HKT<M, R>, onRight: (a: A) => HKT<M, R>) => HKT<M, R>
  readonly getOrElse: <E, A>(ma: EitherT<M, E, A>, f: (e: E) => HKT<M, A>) => HKT<M, A>
  readonly orElse: <E, A, N>(ma: EitherT<M, E, A>, f: (e: E) => EitherT<M, N, A>) => EitherT<M, N, A>
  readonly swap: <E, A>(ma: EitherT<M, E, A>) => EitherT<M, A, E>
  readonly rightM: <E, A>(ma: HKT<M, A>) => EitherT<M, E, A>
  readonly leftM: <E, A>(me: HKT<M, E>) => EitherT<M, E, A>
  readonly left: <E, A>(e: E) => EitherT<M, E, A>
}

/**
 * @since 2.0.0
 */
export type EitherT1<M extends URIS, E, A> = Kind<M, Either<E, A>>

/**
 * @since 2.0.0
 */
export interface EitherM1<M extends URIS> extends ApplicativeComposition12<M, URI> {
  readonly chain: <E, A, B>(ma: EitherT1<M, E, A>, f: (a: A) => EitherT1<M, E, B>) => EitherT1<M, E, B>
  readonly alt: <E, A>(fx: EitherT1<M, E, A>, f: () => EitherT1<M, E, A>) => EitherT1<M, E, A>
  readonly bimap: <E, A, N, B>(ma: EitherT1<M, E, A>, f: (e: E) => N, g: (a: A) => B) => EitherT1<M, N, B>
  readonly mapLeft: <E, A, N>(ma: EitherT1<M, E, A>, f: (e: E) => N) => EitherT1<M, N, A>
  readonly fold: <E, A, R>(
    ma: EitherT1<M, E, A>,
    onLeft: (e: E) => Kind<M, R>,
    onRight: (a: A) => Kind<M, R>
  ) => Kind<M, R>
  readonly getOrElse: <E, A>(ma: EitherT1<M, E, A>, f: (e: E) => Kind<M, A>) => Kind<M, A>
  readonly orElse: <E, A, N>(ma: EitherT1<M, E, A>, f: (e: E) => EitherT1<M, N, A>) => EitherT1<M, N, A>
  readonly swap: <E, A>(ma: EitherT1<M, E, A>) => EitherT1<M, A, E>
  readonly rightM: <E, A>(ma: Kind<M, A>) => EitherT1<M, E, A>
  readonly leftM: <E, A>(me: Kind<M, E>) => EitherT1<M, E, A>
  readonly left: <E, A>(e: E) => EitherT1<M, E, A>
}

/**
 * @since 2.0.0
 */
export type EitherT2<M extends URIS2, R, E, A> = Kind2<M, R, Either<E, A>>

/**
 * @since 2.0.0
 */
export interface EitherM2<M extends URIS2> extends ApplicativeComposition22<M, URI> {
  readonly chain: <R, E, A, B>(ma: EitherT2<M, R, E, A>, f: (a: A) => EitherT2<M, R, E, B>) => EitherT2<M, R, E, B>
  readonly alt: <R, E, A>(fx: EitherT2<M, R, E, A>, f: () => EitherT2<M, R, E, A>) => EitherT2<M, R, E, A>
  readonly bimap: <R, E, A, N, B>(ma: EitherT2<M, R, E, A>, f: (e: E) => N, g: (a: A) => B) => EitherT2<M, R, N, B>
  readonly mapLeft: <R, E, A, N>(ma: EitherT2<M, R, E, A>, f: (e: E) => N) => EitherT2<M, R, N, A>
  readonly fold: <R, E, A, B>(
    ma: EitherT2<M, R, E, A>,
    onLeft: (e: E) => Kind2<M, R, B>,
    onRight: (a: A) => Kind2<M, R, B>
  ) => Kind2<M, R, B>
  readonly getOrElse: <R, E, A>(ma: EitherT2<M, R, E, A>, f: (e: E) => Kind2<M, R, A>) => Kind2<M, R, A>
  readonly orElse: <R, E, A, F>(ma: EitherT2<M, R, E, A>, f: (e: E) => EitherT2<M, R, F, A>) => EitherT2<M, R, F, A>
  readonly swap: <R, E, A>(ma: EitherT2<M, R, E, A>) => EitherT2<M, R, A, E>
  readonly rightM: <R, E, A>(ma: Kind2<M, R, A>) => EitherT2<M, R, E, A>
  readonly leftM: <R, E, A>(me: Kind2<M, R, E>) => EitherT2<M, R, E, A>
  readonly left: <R, E, A>(e: E) => EitherT2<M, R, E, A>
}

/**
 * @since 2.0.0
 */
export function getEitherM<M extends URIS2>(M: Monad2<M>): EitherM2<M>
export function getEitherM<M extends URIS>(M: Monad1<M>): EitherM1<M>
export function getEitherM<M>(M: Monad<M>): EitherM<M>
export function getEitherM<M>(M: Monad<M>): EitherM<M> {
  const A = getApplicativeComposition(M, either)

  return {
    ...A,
    chain: (ma, f) => M.chain(ma, e => (isLeft(e) ? M.of(left(e.left)) : f(e.right))),
    alt: (fx, f) => M.chain(fx, e => (isLeft(e) ? f() : A.of(e.right))),
    bimap: (ma, f, g) => M.map(ma, e => either.bimap(e, f, g)),
    mapLeft: (ma, f) => M.map(ma, e => either.mapLeft(e, f)),
    fold: (ma, onLeft, onRight) => M.chain(ma, fold(onLeft, onRight)),
    getOrElse: (ma, onLeft) => M.chain(ma, fold(onLeft, M.of)),
    orElse: (ma, f) => M.chain(ma, fold(f, a => A.of(a))),
    swap: ma => M.map(ma, swap),
    rightM: ma => M.map(ma, right),
    leftM: ml => M.map(ml, left),
    left: e => M.of(left(e))
  }
}
