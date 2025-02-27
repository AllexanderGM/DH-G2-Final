import { useCallback, useEffect, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from '@heroui/react'

import { EyeIcon, DeleteIcon, EditIcon } from '../utils/icons.jsx'

export const columns = [
  { name: 'NOMBRE', uid: 'nombre' },
  { name: 'DESTINO', uid: 'destino' },
  { name: 'CATEGORÍA', uid: 'categoria' },
  { name: 'PRECIO', uid: 'precio' },
  { name: 'ACCIONES', uid: 'actions' }
]

const statusColorMap = {
  Cultural: 'success',
  Aventura: 'warning',
  Relax: 'danger'
}

const TableTours = () => {
  const [lugares, setLugares] = useState([])
  const URL = import.meta.env.VITE_URL_BACK

  const fetchLugares = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/paquetes/aleatorios`)
      if (!response.ok) {
        throw new Error('Error al cargar los datos')
      }
      const data = await response.json()
      setLugares(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [URL])

  useEffect(() => {
    fetchLugares()
  }, [fetchLugares])

  const renderCell = useCallback((lugar, columnKey) => {
    const cellValue = lugar[columnKey]

    switch (columnKey) {
      case 'nombre':
        return <User avatarProps={{ radius: 'lg', src: lugar.imagenes?.[0] || '' }} name={cellValue} />
      case 'categoria':
        return (
          <Chip className="capitalize" color={statusColorMap[lugar.categoria] || 'default'} size="sm" variant="flat">
            {cellValue}
          </Chip>
        )
      case 'precio':
        return `$${cellValue}`
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Detalles">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Editar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <Table aria-label="Users Table" className="w-full max-w-6xl mt-12">
      <TableHeader columns={columns}>
        {column => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={lugares}>
        {item => <TableRow key={item.idPaquete}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

export default TableTours
