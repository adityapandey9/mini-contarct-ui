import { useEffect, useReducer, useCallback } from "react";

type UseFetchDataResult<T, Args extends any[]> = {
  data: T | null;
  loading: boolean;
  refetch: (args?: Args) => Promise<void>;
};

export function useTaskScheduler<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  args?: Args
): UseFetchDataResult<T, Args> {
  const [{ data, loading }, setData] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      data: null,
      loading: true,
    }
  );

  const fetchData = useCallback(
    async (updatedArgs?: Args) => {
      const result = await fn(...((updatedArgs ?? args ?? []) as Args));
      setData({ data: result, loading: false });
    },
    [fn, args]
  );

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}
