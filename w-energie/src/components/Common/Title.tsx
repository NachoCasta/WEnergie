import Typography from "@mui/material/Typography";

interface TitleProps {
  children?: React.ReactNode;
}

export default function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

export function SubTitle(props: TitleProps) {
  return (
    <Typography component="h3" variant="subtitle1" color="primary">
      {props.children}
    </Typography>
  );
}
