import { TablePaginationProps } from "@mui/material";
import { useState } from "react";

export default function useClientPagination<T>(
  items: T[],
): [T[], TablePaginationProps] {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const currentPageItems = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const paginationProps: TablePaginationProps = {
    count: items.length,
    rowsPerPage,
    page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };

  return [currentPageItems, paginationProps];
}
