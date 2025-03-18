import { Link } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Calendar } from '@heroui/react'
import { today, getLocalTimeZone, isWeekend } from '@internationalized/date'
import { useLocale, I18nProvider } from '@react-aria/i18n'

import BrandButton from './BrandButton.jsx'

const CardDetalle = ({ tour }) => {
  let now = today(getLocalTimeZone())
  let confirmURL = `/tour/${tour.id}/confirm`
  let disabledRanges = [
    [now, now.add({ days: 5 })],
    [now.add({ days: 14 }), now.add({ days: 16 })],
    [now.add({ days: 23 }), now.add({ days: 24 })]
  ]
  let { locale } = useLocale()

  let isDateUnavailable = date =>
    isWeekend(date, locale) || disabledRanges.some(interval => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0)

  return (
    <div className="rounded-lg">
      <Card className="py-3 px-4">
        <CardHeader className="pb-0 pt-2 px-4 mb-8 flex flex-col items-center justify-center">
          <p>
            Precio:{' '}
            <data value={tour.adultPrice} className="font-bold text-xl">
              ${tour.adultPrice}
            </data>{' '}
            USD
          </p>
        </CardHeader>
        <CardBody className="overflow-visible py-2 flex flex-col items-center justify-center mb-6">
          <I18nProvider locale="es">
            <Calendar aria-label="Date (Unavailable)" isDateUnavailable={isDateUnavailable} />
          </I18nProvider>
        </CardBody>

        <CardFooter>
          <BrandButton color="brandColor" size="md" variant="ghost" fullWidth={true} as={Link} to={confirmURL} state={{ tour }}>
            Reservar ahora
          </BrandButton>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CardDetalle
