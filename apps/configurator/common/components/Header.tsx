import { Box, Stack, Typography } from "@mui/material"
import { PropsWithChildren } from "react"
import { If, Then } from "react-if"

export interface HeaderProps {
  title: string
  subtitle?: JSX.Element | string
};

export function Header({
  title,
  subtitle,
  children
}: PropsWithChildren<HeaderProps>) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={ 1 }>
      <Stack>
        <Typography variant="h5" color="primary">
          { title }
        </Typography>
        <If condition={ !!subtitle }>
          <Then>
            <Typography variant="subtitle1" color="grey">{ subtitle }</Typography>
          </Then>
        </If>
      </Stack>
      <Stack direction="row" spacing={ 1 }>
        { children }
      </Stack>
    </Box>
  )
}