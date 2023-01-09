import { IconButton, TableContainer, TablePagination } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { Product } from "database/products/productCollection";
import RemoveIcon from "@mui/icons-material/Remove";
import { QuoteProduct } from "database/quotes/quoteCollection";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

type ProductsTableProps<P> = {
  products: Array<P>;
  onAdd?: (productId: string) => void;
  onRemove?: (productId: string) => void;
  onView?: (productId: string) => void;
  loading?: boolean;
  showQuantity?: boolean;
};

export default function ProductTable<P extends Product>(
  props: ProductsTableProps<P>
) {
  const { products, onRemove, onAdd, onView, showQuantity = false } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Peso</TableCell>
              {showQuantity && <TableCell>Cantidad</TableCell>}
              <TableCell>Precio</TableCell>
              {(onAdd || onRemove || onView) && (
                <TableCell align="center">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => (
                <TableRow key={`${product.id}-${index}`}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.weight}</TableCell>
                  {showQuantity && (
                    <TableCell>
                      {(product as unknown as QuoteProduct).quantity}
                    </TableCell>
                  )}
                  <TableCell>{`$${product.price}`}</TableCell>
                  <TableCell align="center">
                    {onAdd && (
                      <IconButton onClick={() => onAdd(product.id)}>
                        <AddIcon />
                      </IconButton>
                    )}
                    {onRemove && (
                      <IconButton onClick={() => onRemove(product.id)}>
                        <RemoveIcon />
                      </IconButton>
                    )}
                    {onView && (
                      <IconButton onClick={() => onView(product.id)}>
                        <VisibilityIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
