import { Breakpoint, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Divider, Stack, Typography } from "@mui/material"
import { PropsWithChildren } from "react"
import { If, Then } from "react-if"

export interface ModalProps {
  open: boolean,
  close?: () => void,
  title?: string
  subtitle?: string
  actions?: Array<JSX.Element>
  width?: Breakpoint | 'md'
  dense?: boolean
};

export function Modal({ 
  open, 
  close,
  title, 
  subtitle,
  actions,
  width,
  dense,
  children
}: PropsWithChildren<ModalProps>) {

  return (
    <Dialog 
      open={ open }
      onClose={ () => close && close() }
      fullWidth
      maxWidth={ width }
    >
      <If condition={ !!title || !!subtitle }>
        <Then>
          <DialogTitle component="div">
            <If condition={ !!title }>
              <Then>
                <Typography color="primary" variant="h6">{ title }</Typography>
              </Then>
            </If>

            <If condition={ !!title }>
              <Then>
                <Typography color="grey" variant="subtitle2" style={{ marginTop: '2px' }}>{ subtitle }</Typography>
              </Then>
            </If>
          </DialogTitle>
          <Divider />
        </Then>
      </If>
      
      <If condition={ !!children }>
        <Then>
          <DialogContent sx={{ padding: dense ? '0' : '20px 24px' }}>
            { children }
          </DialogContent>
          <Divider />
        </Then>
      </If>
      
      <If condition={ actions && actions.length > 0 }>
        <Then>
          <DialogActions>
            <Stack direction="row" spacing={ 2 }>
              { actions }
            </Stack>
          </DialogActions>
        </Then>
      </If>
    </Dialog>
  )
}

