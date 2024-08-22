/* eslint-disable no-restricted-imports */
import { MutationHookOptions, useMutation } from "@apollo/client"

/**
 * mutations without an onError may throw exceptions
 * this is a work-around to prevent them from throwing when
 * you don't otherwise have an onError handler
 *
 * @see https://github.com/apollographql/apollo-client/issues/5708
 */
export const apolloNoThrow: Pick<MutationHookOptions, "onError"> = {
  onError: () => null,
}

type UseMutationType = typeof useMutation

/** This function captures network errors so they are not thrown.
 *  This means that instead of needing a try/catch around every mutation call, we can use
 *  response.networkError.
 */
export const useSafeMutation: UseMutationType = (...args) => {
  const [arg1, options, ...otherArgs] = args
  return useMutation(
    arg1,
    {
      ...apolloNoThrow,
      ...options,
    },
    ...otherArgs
  )
}
