import { Input } from '@heroui/react'
import image from '@assets/Backgrounds/topography.svg'

import './hero.scss'

const Hero = () => {
  return (
    <section className="hero-container" style={{ backgroundImage: `url("${image}")` }}>
      <div className="pattern_overlay"></div>

      <h1 className="title">
        <span className="inline-block">
          <span>🌎</span> La búsqueda perfecta,
        </span>
        <br />
        <span className="lurid">del tour perfecto</span>
      </h1>

      <div className="browser-container">
        <Input
          isClearable
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: ['bg-transparent', 'text-black/90 dark:text-white/90', 'placeholder:text-default-700/50 dark:placeholder:text-white/60'],
            innerWrapper: 'bg-transparent',
            inputWrapper: [
              'shadow-xl',
              'bg-default-200/50',
              'dark:bg-default/60',
              'backdrop-blur-xl',
              'backdrop-saturate-200',
              'hover:bg-default-200/70',
              'dark:hover:bg-default/70',
              'group-data-[focus=true]:bg-default-200/50',
              'dark:group-data-[focus=true]:bg-default/60',
              '!cursor-text'
            ]
          }}
          label="Buscar"
          placeholder="Buscar lugares..."
          radius="lg"
          startContent={<span className="material-symbols-outlined">search</span>}
        />
      </div>
    </section>
  )
}

export default Hero
