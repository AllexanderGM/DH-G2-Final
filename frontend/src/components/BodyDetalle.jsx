const BodyDetalle = ({ tour }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="h-32 rounded-lg bg-gray-200 lg:col-span-2">
          <p className="text-gray-800">{tour.descripcion}</p>
        </div>
        <div className="h-32 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  )
}

export default BodyDetalle
