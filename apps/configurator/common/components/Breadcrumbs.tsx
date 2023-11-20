import { NavigateNextOutlined } from "@mui/icons-material"
import { Box, Link, Breadcrumbs as MUIBreadcrumbs, Stack, Typography } from "@mui/material"

type BreadcrumbItem = {
  item: JSX.Element | string
  link?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Box marginBottom={ 2 }>
      <Stack spacing={ 0.5 }>
        <MUIBreadcrumbs separator={<NavigateNextOutlined fontSize="small"/>}>
          {
            items.map((item, idx) => (
              item.link ?
                <Link key={ `breadcrumb-link-${idx}` } href={ item.link } underline="hover">
                  { item.item }
                </Link> :
                <Typography key={ `breadcrumb-link-${idx}` } variant="body1">
                  { item.item }
                </Typography>
            ))
          }
        </MUIBreadcrumbs>
      </Stack>
    </Box>
  )
}

export default Breadcrumbs;