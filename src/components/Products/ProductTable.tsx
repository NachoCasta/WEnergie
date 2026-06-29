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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Input from "@mui/material/Input";
import { getProductName } from "utils/productUtils";
import { formatEuro } from "utils/formatCurrency";

function isQuoteProduct(product: Product): product is QuoteProduct {
  return "quantity" in product;
}

type ProductsTableProps<P> = {
  products: Array<P>;
  paginationProps: TablePaginationProps;
  onRemove?: (productId: string) => void;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onView?: (productId: string) => void;
  onMoveUp?: (productId: string) => void;
  onMoveDown?: (productId: string) => void;
  loading?: boolean;
  showQuantity?: boolean;
  maxHeight?: number;
  containerRef?: React.Ref<HTMLDivElement>;
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
    onMoveUp,
    onMoveDown,
    showQuantity = false,
    maxHeight,
    containerRef,
  } = props;
  const { page, rowsPerPage, count } = paginationProps;
  return (
    <>
      <TableContainer ref={containerRef} sx={maxHeight != null ? { maxHeight } : null}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Peso</TableCell>
              {showQuantity && <TableCell>Cantidad</TableCell>}
              <TableCell>Precio</TableCell>
              {(onRemove || onView || onMoveUp || onMoveDown) && (
                <TableCell align="center">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => {
              let quantityCellContent;
              if (showQuantity && isQuoteProduct(product)) {
                const { quantity } = product;
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

              const globalIndex = (page as number) * (rowsPerPage as number) + index;
              const isFirst = globalIndex === 0;
              const isLast = globalIndex === (count as number) - 1;
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
                    {onMoveUp && (
                      <IconButton
                        size="small"
                        onClick={() => onMoveUp(product.id)}
                        disabled={isFirst}
                      >
                        <KeyboardArrowUpIcon />
                      </IconButton>
                    )}
                    {onMoveDown && (
                      <IconButton
                        size="small"
                        onClick={() => onMoveDown(product.id)}
                        disabled={isLast}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    )}
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
