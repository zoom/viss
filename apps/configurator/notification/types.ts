import { AlertColor } from "@mui/material"

export type NotificationMessage = {
  message: string | JSX.Element,
  severity?: AlertColor,
  open?: boolean,
  timeout?: number | 0
  timestamp?: number | 0
}

