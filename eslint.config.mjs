// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended
)

export const ignore = [
    'dist/',
    'lib/',
    'node_modules/'
]