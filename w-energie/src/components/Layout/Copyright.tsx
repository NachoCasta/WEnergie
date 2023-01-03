import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ pt: 4 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://kwb.wenergie.cl/">
        WEnergie
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
