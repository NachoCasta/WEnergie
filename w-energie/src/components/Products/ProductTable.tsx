import {
  IconButton,
  TableContainer,
  TablePagination,
  TablePaginationProps,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Product } from "database/products/productCollection";
import DeleteIcon from "@mui/icons-material/Delete";
import { QuoteProduct } from "database/quotes/quoteCollection";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Input from "@mui/material/Input";
import { getProductName } from "utils/productUtils";
import { formatEuro } from "utils/formatCurrency";

type ProductsTableProps<P> = {
  products: Array<P>;
  paginationProps: TablePaginationProps;
  onRemove?: (productId: string) => void;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onView?: (productId: string) => void;
  loading?: boolean;
  showQuantity?: boolean;
  maxHeight?: number;
};

export default function ProductTable<P extends Product>(
  props: ProductsTableProps<P>
) {
  const {
    products,
    paginationProps,
    onRemove,
    onQuantityChange,
    onView,
    showQuantity = false,
    maxHeight,
  } = props;
  return (
    <>
      <TableContainer sx={maxHeight != null ? { maxHeight } : null}>
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
            {products.map((product, index) => {
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
                  <TableCell>{formatEuro(product.price)}</TableCell>
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
        {...paginationProps}
      />
    </>
  );
}
