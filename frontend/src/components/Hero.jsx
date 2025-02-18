import { Input } from '@heroui/react'

import styles from '../styles/Hero.module.css'
import SearchIcon from './SearchIcon.jsx'

const Hero = () => {
  return (
    <div className={` flex flex-col justify-center items-center h-80 text-center mb-14 ${styles.container}`}>
      <div className={`${styles.pattern_overlay}`}></div>
      <h1 className={`text-4xl md:text-6xl font-bold tracking-tight p-6 `}>
        <span className="inline-block">
          <span>🌎</span> La búsqueda perfecta,
        </span>
        <br />
        <span className="bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">del tour perfecto</span>
      </h1>
      <div className="w-full px-[200px] rounded-2xl flex justify-center items-center text-white">
        <Input
          isClearable
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: ['bg-transparent', 'text-black/90 dark:text-white/90', 'placeholder:text-default-900/50 dark:placeholder:text-white/60'],
            innerWrapper: 'bg-transparent',
            inputWrapper: [
              'shadow-xl',
              'bg-default-200/90',
              'dark:bg-default/60',
              'backdrop-blur-xl',
              'backdrop-saturate-200',
              'hover:bg-default-200/70',
              'dark:hover:bg-default/70',
              'group-data-[focus=true]:bg-default-200/0',
              'dark:group-data-[focus=true]:bg-default/60',
              '!cursor-text',
              'group-data-[focus=true]:border-1',
              'group-data-[focus=true]:border-[#E86C6E]'
            ]
          }}
          label="Buscar"
          placeholder="Buscar lugares..."
          radius="lg"
          startContent={<SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-500 pointer-events-none flex-shrink-0" />}
        />
      </div>
    </div>
  )
}

export default Hero
