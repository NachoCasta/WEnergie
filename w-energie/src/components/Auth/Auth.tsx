import { Alert, CircularProgress, Grid, Typography } from "@mui/material";
import { SignInPage, type AuthProvider } from "@toolpad/core/SignInPage";
import { signInWithGoogle } from "database/auth";

type Props = {
  loading: boolean;
  error: Error | void;
};

const providers = [{ id: "google", name: "Google" }];

export default function Auth(props: Props) {
  const { loading, error } = props;
  if (loading || error) {
    return (
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        sx={{ height: "100vh" }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Alert severity="error" variant="outlined">
            {error?.message}
          </Alert>
        )}
      </Grid>
    );
  }
  const handleSignIn = async (
    provider: AuthProvider,
    formData?: any,
    callbackUrl?: string,
  ) => {
    let result;
    try {
      if (provider.id === "google") {
        result = await signInWithGoogle();
      }
      if (result?.success && result?.user) {
        return {};
      }
      return { error: result?.error || "Failed to sign in" };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  };
  return (
    <SignInPage
      signIn={handleSignIn}
      providers={providers}
      slots={{
        title: () => (
          <Typography component="h1" variant="h5" fontWeight={500}>
            Autenticación
          </Typography>
        ),
        subtitle: () => (
          <Typography variant="subtitle1" color="textSecondary">
            Bienvenido, inicia sesión para continuar
          </Typography>
        ),
      }}
    />
  );
}
