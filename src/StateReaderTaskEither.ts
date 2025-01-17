import { Either } from './Either'
import { IO } from './IO'
import { IOEither } from './IOEither'
import { Monad4 } from './Monad'
import { pipeable } from './pipeable'
import { Reader } from './Reader'
import { ReaderEither } from './ReaderEither'
import * as RTE from './ReaderTaskEither'
import { State } from './State'
import { getStateM } from './StateT'
import { Task } from './Task'
import { TaskEither } from './TaskEither'

import ReaderTaskEither = RTE.ReaderTaskEither
import { MonadThrow4 } from './MonadThrow'

const T = getStateM(RTE.readerTaskEither)

declare module './HKT' {
  interface URItoKind4<S, R, E, A> {
    StateReaderTaskEither: StateReaderTaskEither<S, R, E, A>
  }
}

/**
 * @since 2.0.0
 */
export const URI = 'StateReaderTaskEither'

/**
 * @since 2.0.0
 */
export type URI = typeof URI

/**
 * @since 2.0.0
 */
export interface StateReaderTaskEither<S, R, E, A> {
  (s: S): ReaderTaskEither<R, E, [A, S]>
}

/**
 * @since 2.0.0
 */
export function run<S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S, r: R): Promise<Either<E, [A, S]>> {
  return ma(s)(r)()
}

/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.0.0
 */
export const evalState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, A> =
  T.evalState

/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.0.0
 */
export const execState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, S> =
  T.execState

/**
 * @since 2.0.0
 */
export function left<S, R, E = never, A = never>(e: E): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.left(e))
}

/**
 * @since 2.0.0
 */
export const right: <S, R, E = never, A = never>(a: A) => StateReaderTaskEither<S, R, E, A> = T.of

/**
 * @since 2.0.0
 */
export function rightTask<S, R, E = never, A = never>(ma: Task<A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightTask(ma))
}

/**
 * @since 2.0.0
 */
export function leftTask<S, R, E = never, A = never>(me: Task<E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftTask(me))
}

/**
 * @since 2.0.0
 */
export function fromTaskEither<S, R, E, A>(ma: TaskEither<E, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.fromTaskEither(ma))
}

/**
 * @since 2.0.0
 */
export function rightReader<S, R, E = never, A = never>(ma: Reader<R, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightReader(ma))
}

/**
 * @since 2.0.0
 */
export function leftReader<S, R, E = never, A = never>(me: Reader<R, E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftReader(me))
}

/**
 * @since 2.0.0
 */
export function fromIOEither<S, R, E, A>(ma: IOEither<E, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.fromIOEither(ma))
}

/**
 * @since 2.0.0
 */
export function fromReaderEither<S, R, E, A>(ma: ReaderEither<R, E, A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.fromReaderEither(ma))
}

/**
 * @since 2.0.0
 */
export function rightIO<S, R, E = never, A = never>(ma: IO<A>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.rightIO(ma))
}

/**
 * @since 2.0.0
 */
export function leftIO<S, R, E = never, A = never>(me: IO<E>): StateReaderTaskEither<S, R, E, A> {
  return fromReaderTaskEither(RTE.leftIO(me))
}

/**
 * @since 2.0.0
 */
export const rightState: <S, R, E = never, A = never>(ma: State<S, A>) => StateReaderTaskEither<S, R, E, A> =
  T.fromState

/**
 * @since 2.0.0
 */
export function leftState<S, R, E = never, A = never>(me: State<S, E>): StateReaderTaskEither<S, R, E, A> {
  return s => RTE.left(me(s)[0])
}

/**
 * @since 2.0.0
 */
export const fromReaderTaskEither: <S, R, E, A>(ma: ReaderTaskEither<R, E, A>) => StateReaderTaskEither<S, R, E, A> =
  T.fromM

/**
 * Get the current state
 *
 * @since 2.0.0
 */
export const get: <S, R, E = never>() => StateReaderTaskEither<S, R, E, S> = T.get

/**
 * Set the state
 *
 * @since 2.0.0
 */
export const put: <S, R, E = never>(s: S) => StateReaderTaskEither<S, R, E, void> = T.put

/**
 * Modify the state by applying a function to the current state
 *
 * @since 2.0.0
 */
export const modify: <S, R, E = never>(f: (s: S) => S) => StateReaderTaskEither<S, R, E, void> = T.modify

/**
 * Get a value which depends on the current state
 *
 * @since 2.0.0
 */
export const gets: <S, R, E = never, A = never>(f: (s: S) => A) => StateReaderTaskEither<S, R, E, A> = T.gets

/**
 * @since 2.0.0
 */
export const stateReaderTaskEither: Monad4<URI> & MonadThrow4<URI> = {
  URI,
  map: T.map,
  of: right,
  ap: T.ap,
  chain: T.chain,
  throwError: left
}

/**
 * Like `stateReaderTaskEither` but `ap` is sequential
 * @since 2.0.0
 */
export const stateReaderTaskEitherSeq: typeof stateReaderTaskEither = {
  ...stateReaderTaskEither,
  ap: (mab, ma) => stateReaderTaskEither.chain(mab, f => stateReaderTaskEither.map(ma, f))
}

const { ap, apFirst, apSecond, chain, chainFirst, flatten, map, fromEither, fromOption } = pipeable(
  stateReaderTaskEither
)

export { ap, apFirst, apSecond, chain, chainFirst, flatten, map, fromEither, fromOption }
