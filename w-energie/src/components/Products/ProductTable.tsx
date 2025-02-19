import { IconButton, TableContainer, TablePagination } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { Product } from "database/products/productCollection";
import DeleteIcon from "@mui/icons-material/Delete";
import { QuoteProduct } from "database/quotes/quoteCollection";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Input from "@mui/material/Input";
import { getProductName } from "utils/productUtils";

type ProductsTableProps<P> = {
  products: Array<P>;
  onRemove?: (productId: string) => void;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onView?: (productId: string) => void;
  loading?: boolean;
  showQuantity?: boolean;
};

export default function ProductTable<P extends Product>(
  props: ProductsTableProps<P>
) {
  const {
    products,
    onRemove,
    onQuantityChange,
    onView,
    showQuantity = false,
  } = props;
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
              {(onRemove || onView) && (
                <TableCell align="center">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => {
                let quantityCellContent;
                if (showQuantity) {
                  const { quantity } = product as unknown as QuoteProduct;
                  if (onQuantityChange) {
                    const handleChange = (
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      onQuantityChange(
                        product.id,
                        Number.parseInt(e.target.value) || 0
                      );
                    };
                    quantityCellContent = (
                      <Input
                        name={`quantity-${product.id}`}
                        type="number"
                        value={quantity}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        required
                        sx={{ width: 70 }}
                      />
                    );
                  } else {
                    quantityCellContent = quantity;
                  }
                }

                return (
                  <TableRow key={`${product.id}-${index}`}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{getProductName(product)}</TableCell>
                    <TableCell>{product.weight}</TableCell>
                    {quantityCellContent != null && (
                      <TableCell>{quantityCellContent}</TableCell>
                    )}
                    <TableCell>{`$${product.price}`}</TableCell>
                    <TableCell align="center">
                      {onRemove && (
                        <IconButton onClick={() => onRemove(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {onView && (
                        <IconButton onClick={() => onView(product.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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
