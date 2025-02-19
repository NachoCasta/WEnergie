import { TablePaginationProps } from "@mui/material";
import { GetDataOpts } from "database/getData";
import { useEffect, useRef, useState } from "react";
import { useAsync } from "react-use";

interface Data {
  id: string;
}

type GetData<Data> = (opts: GetDataOpts) => Promise<Data[]>;

type Result<Data> = [Data[], boolean, TablePaginationProps, number];

export default function usePagination<D extends Data, Opts>(
  getData: GetData<D>,
  getDataCount: () => Promise<number>,
  opts?: Opts
): Result<D> {
  const { value: count } = useAsync(getDataCount, []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [after, setAfter] = useState<string | null>(null);
  const [at, setAt] = useState<string | null>(null);
  const { value: data = [], loading } = useAsync(
    () =>
      getData({
        after,
        at,
        pageSize: rowsPerPage,
        ...opts,
      }),
    [after, at, rowsPerPage, ...Object.values(opts ?? {})]
  );

  const pageCursorsRef = useRef<{ [page: number]: string }>({});
  useEffect(() => {
    if (!loading && data.length > 0) {
      const cursorId = data[0].id;
      pageCursorsRef.current[page] = cursorId;
    }
  });

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
  };

  const paginationProps = {
    count: count ?? -1,
    rowsPerPage: rowsPerPage,
    page: page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };
  return [data, loading, paginationProps, rowsPerPage];
}
