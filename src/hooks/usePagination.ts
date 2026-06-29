import { TablePaginationProps } from "@mui/material";
import { GetDataOpts } from "database/getData";
import { useEffect, useRef, useState } from "react";
import { useAsync } from "react-use";

interface Data {
  id: string;
}

type GetData<Data> = (opts: GetDataOpts) => Promise<Data[]>;

type ResetFn = (newRowsPerPage?: number) => void;

interface InitialState {
  page?: number;
  at?: string | null;
}

type Result<Data> = [Data[], boolean, TablePaginationProps, number, ResetFn];

export default function usePagination<D extends Data>(
  getData: GetData<D>,
  getDataCount: () => Promise<number>,
  deps: React.DependencyList = [],
  initialRowsPerPage: number = 10,
  initialState: InitialState = {}
): Result<D> {
  const { value: count } = useAsync(getDataCount, deps);
  const [page, setPage] = useState(initialState.page ?? 0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [after, setAfter] = useState<string | null>(null);
  const [at, setAt] = useState<string | null>(initialState.at ?? null);
  const { value: data = [], loading } = useAsync(
    () =>
      getData({
        after,
        at,
        pageSize: rowsPerPage,
      }),
    [after, at, rowsPerPage, ...deps]
  );

  const pageCursorsRef = useRef<{ [page: number]: string }>(
    initialState.page && initialState.at
      ? { [initialState.page]: initialState.at }
      : {}
  );
  useEffect(() => {
    if (!loading && data.length > 0) {
      pageCursorsRef.current[page] = data[0].id;
    }
  }, [loading, data, page]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (newPage > page) {
      setAfter(data[data.length - 1].id);
      setAt(null);
    } else {
      setAt(pageCursorsRef.current[newPage]);
      setAfter(null);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setAfter(null);
    setAt(null);
    pageCursorsRef.current = {};
  };

  const resetPagination: ResetFn = (newRowsPerPage) => {
    setPage(0);
    setAfter(null);
    setAt(null);
    pageCursorsRef.current = {};
    if (newRowsPerPage !== undefined) {
      setRowsPerPage(newRowsPerPage);
    }
  };

  const paginationProps = {
    count: count ?? -1,
    rowsPerPage: rowsPerPage,
    page: page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };
  return [data, loading, paginationProps, rowsPerPage, resetPagination];
}
