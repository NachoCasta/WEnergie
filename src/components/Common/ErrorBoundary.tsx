import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, Box, Button } from "@mui/material";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => this.setState({ error: null })}
              >
                Reintentar
              </Button>
            }
          >
            Algo salió mal: {this.state.error.message}
          </Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}
