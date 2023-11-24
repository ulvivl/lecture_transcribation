import {
  QueryKey,
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
  useQuery
} from "react-query"

type TGetMethod<T, TQueryFnData, TQueryKey extends QueryKey = QueryKey> = (data: T) => {
  key: TQueryKey;
  fetch: QueryFunction<TQueryFnData, TQueryKey>;
};

export const useBaseQuery = <T,
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey>({
  data,
  getMethod,
  ...options
}: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  data: T;
  getMethod: TGetMethod<T, TQueryFnData, TQueryKey>;
}): UseQueryResult<TData, TError> => {
  const { key, fetch } = getMethod({ ...data })

  return useQuery(key, fetch, {
    ...options
  })
}