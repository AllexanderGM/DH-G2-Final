import { Input } from '@heroui/react'
import styles from '../styles/Hero.module.css'
import SearchIcon from './SearchIcon'

const Hero = () => {
  return (
    <div className={` flex flex-col justify-center items-center h-64 text-center ${styles.container}`}>
      <div className={`${styles.pattern_overlay}`}></div>
      <h2 className={`text-4xl p-6`}>
        <span className="text-3xl">🌎</span> La búsqueda perfecta, del tour perfecto
      </h2>
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
              'group-data-[focus=true]:bg-default-200/100',
              'dark:group-data-[focus=true]:bg-default/60',
              '!cursor-text'
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
