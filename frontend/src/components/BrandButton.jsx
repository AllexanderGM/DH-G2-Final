import { extendVariants, Button } from '@heroui/react'

const BrandButton = extendVariants(Button, {
  variants: {
    color: {
      brandColor: 'bg-[#E86C6E] text-white hover:bg-[#CB5556]'
    }
  }
})

export default BrandButton
