import { useCallback, useEffect, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, Button } from '@heroui/react'

import { EyeIcon, DeleteIcon, EditIcon } from '../utils/icons.jsx'

export const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'NOMBRE', uid: 'nombre' },
  { name: 'APELLIDO', uid: 'apellido' },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'PAIS', uid: 'pais' },
  { name: 'ACCIONES', uid: 'actions' }
]

export const users = [
  {
    id: 1,
    nombre: 'Tony',
    apellido: 'Reichert',
    estado: 'active',
    age: 29,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    email: 'tony.reichert@example.com',
    pais: 'Holanda'
  },
  {
    id: 2,
    nombre: 'Sofia',
    apellido: 'Martínez',
    estado: 'inactive',
    age: 35,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    email: 'sofia.martinez@example.com',
    pais: 'Argentina'
  },
  {
    id: 3,
    nombre: 'Liam',
    apellido: 'O’Connor',
    estado: 'active',
    age: 42,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    email: 'liam.oconnor@example.com',
    pais: 'Irlanda'
  },
  {
    id: 4,
    nombre: 'Aisha',
    apellido: 'Khan',
    estado: 'active',
    age: 27,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    email: 'aisha.khan@example.com',
    pais: 'Pakistán'
  },
  {
    id: 5,
    nombre: 'Hiroshi',
    apellido: 'Tanaka',
    estado: 'inactive',
    age: 31,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    email: 'hiroshi.tanaka@example.com',
    pais: 'Japón'
  },
  {
    id: 6,
    nombre: 'Elena',
    apellido: 'Smirnova',
    estado: 'active',
    age: 24,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    email: 'elena.smirnova@example.com',
    pais: 'Rusia'
  },
  {
    id: 7,
    nombre: 'Carlos',
    apellido: 'Fernández',
    estado: 'inactive',
    age: 38,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
    email: 'carlos.fernandez@example.com',
    pais: 'España'
  },
  {
    id: 8,
    nombre: 'Emily',
    apellido: 'Johnson',
    estado: 'active',
    age: 26,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d',
    email: 'emily.johnson@example.com',
    pais: 'Estados Unidos'
  },
  {
    id: 9,
    nombre: 'Mohammed',
    apellido: 'Al-Farsi',
    estado: 'active',
    age: 45,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d',
    email: 'mohammed.alfarsi@example.com',
    pais: 'Emiratos Árabes'
  },
  {
    id: 10,
    nombre: 'Zoe',
    apellido: 'Dupont',
    estado: 'inactive',
    age: 30,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026712d',
    email: 'zoe.dupont@example.com',
    pais: 'Francia'
  }
]

const statusColorMap = {
  active: 'success',
  inactive: 'warning',
  sospechoso: 'danger'
}

const TableUsers = () => {
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

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'nombre':
        return <User avatarProps={{ radius: 'lg', src: user.avatar || '' }} description={user.email} name={cellValue} />
      case 'estado':
        return (
          <Chip className="capitalize" color={statusColorMap[user.estado] || 'default'} size="sm" variant="flat">
            {cellValue}
          </Chip>
        )
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
      <TableBody items={users}>
        {item => <TableRow key={item.id}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

export default TableUsers
