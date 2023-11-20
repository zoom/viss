import { Alert, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNotification } from "../context";

function Notification({ notification, clearNotification }: ReturnType<typeof useNotification>) {
  const handleClose = (_: unknown, reason?: SnackbarCloseReason) =>
    reason !== 'clickaway' && clearNotification();

  // autoHideDuration doesn't reset the timeout. This is a workaround
  useEffect(() => {
    if (notification.open) {
      const t = setTimeout(() => {
        clearNotification();
      }, notification.timeout);

      return () => clearTimeout(t);
    }
  }, [notification.timestamp]);

  return (
    <Snackbar
      open={ notification.open }
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={ handleClose }
    >
      <Alert severity={ notification.severity } onClose={ () => clearNotification() } sx={{ width: '100%' }} variant="standard">
        <Typography variant="body2">{ notification.message }</Typography>
      </Alert>
    </Snackbar>
  )
}

export default () => <Notification {...useNotification()} />;