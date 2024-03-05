import type { QueryKey } from '@tanstack/query-core'
import { QueryObserverOptions, QueryOptions } from '@tanstack/query-core/src/types'
import type { UseQueryOptions } from '@tanstack/react-query/src/types'

export const queryOptions = <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'> & {queryKey: TQueryKey},
) => options