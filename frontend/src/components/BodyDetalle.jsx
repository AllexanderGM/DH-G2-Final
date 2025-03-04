import CardDetalle from './CardDetalle.jsx'

const BodyDetalle = ({ tour }) => {
  const incluye = [
    { icon: 'villa', tag: 'Alojamiento' },
    { icon: 'directions_bus', tag: 'Transporte' },
    { icon: 'confirmation_number', tag: 'Boletos' },
    { icon: 'icecream', tag: 'Snack' },
    { icon: 'water_full', tag: 'Bebidas' },
    { icon: 'breakfast_dining', tag: 'Desayuno' },
    { icon: 'ramen_dining', tag: 'Almuerzo' },
    { icon: 'restaurant', tag: 'Cena' },
    { icon: 'familiar_face_and_zone', tag: 'Guía' },
    { icon: 'local_hospital', tag: 'Seguro de vida' },
    { icon: 'downhill_skiing', tag: 'Actividades' },
    { icon: 'photo_camera', tag: 'Fotografías' },
    { icon: 'redeem', tag: 'Souvenirs' },
    { icon: 'roller_skating', tag: 'Equipamiento' },
    { icon: 'rss_feed', tag: 'Wifi' },
    { icon: 'savings', tag: 'Propinas' },
    { icon: 'accessibility_new', tag: 'Asistencia' }
  ]

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className=" lg:col-span-2 pr-20 pl-0 text-[0.9rem]">
          <h2 className="text-[1rem] font-bold mb-4">Incluye</h2>
          <div className="grid grid-cols-3">
            <div className="flex justify-start items-center pb-2">
              <span className="material-symbols-outlined text-2xl pr-3" width="100%">
                {incluye[0].icon}
              </span>
              <p>{incluye[0].tag}</p>
            </div>
            <div className="flex justify-start items-center pb-2 ">
              <span className="material-symbols-outlined text-2xl pr-3 " width="100%">
                {incluye[5].icon}
              </span>
              <p>{incluye[5].tag}</p>
            </div>
            <div className="flex justify-start items-center pb-2 ">
              <span className="material-symbols-outlined text-2xl pr-3 " width="100%">
                {incluye[3].icon}
              </span>
              <p>{incluye[3].tag}</p>
            </div>
            <div className="flex justify-start items-center pb-2 ">
              <span className="material-symbols-outlined text-2xl pr-3 " width="100%">
                {incluye[6].icon}
              </span>
              <p>{incluye[6].tag}</p>
            </div>
            <div className="flex justify-start items-center pb-2 ">
              <span className="material-symbols-outlined text-2xl pr-3 " width="100%">
                {incluye[12].icon}
              </span>
              <p>{incluye[12].tag}</p>
            </div>
            <div className="flex justify-start items-center pb-2 ">
              <span className="material-symbols-outlined text-2xl pr-3" width="100%">
                {incluye[8].icon}
              </span>
              <p>{incluye[8].tag}</p>
            </div>
          </div>
          <hr className="bordegray border-solid border-gray-300 mt-8 mb-8" />
          <div>
            <h2 className="text-[1rem] font-bold mb-4">Descripción del lugar</h2>
            <p className="text-gray-800">
              El Valle del Aconcagua es una cuenca de origen cordillerano, ubicada en la Región de Valparaíso a unos 90 km al norte de
              Santiago y unos 105 km al oriente de la Ciudad de Valparaíso. Lo atraviesa el río Aconcagua que alimenta los fértiles campos
              que lo circundan.
            </p>
          </div>
          <hr className="bordegray border-solid border-gray-300 mt-8 mb-8" />
          <div>
            <h2 className="text-[1rem] font-bold mb-4">Detalles</h2>
            <ul>
              <li>Edad: 12 a 99 años</li>
              <li>Cupos: 9 cupos</li>
              <li>Duración: 1h 30m</li>
              <li>Guía: inglés-español</li>
            </ul>
          </div>
          <hr className="bordegray border-solid border-gray-300 mt-8 mb-8" />
          <div>
            <h2 className="text-[1rem] font-bold mb-4">Itinerario</h2>
            <ul>
              <li>Visita a la Viña Errázuriz</li>
              <li>Paseo por la Viña</li>
              <li>Degustación de vinos y cóctel</li>
              <li>Caminata por el Valle de Quillota</li>
            </ul>
          </div>
        </div>
        <CardDetalle tour={tour} />
      </div>
    </div>
  )
}

export default BodyDetalle
