import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const themeConfig: ThemeConfig = {
  initialColorMode: 'dark'
}

const theme = extendTheme(themeConfig)

export default theme
