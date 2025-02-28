import { useCallback, useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Chip,
  Tooltip,
  Button
} from '@heroui/react'

import { EyeIcon, DeleteIcon, EditIcon } from '../utils/icons.jsx'

export const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'NOMBRE', uid: 'nombre' },
  { name: 'APELLIDO', uid: 'apellido' },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'PAIS', uid: 'pais' },
  { name: 'ACCIONES', uid: 'actions' }
]

const statusColorMap = {
  activo: 'success',
  inactivo: 'warning',
  sospechoso: 'danger'
}

const TableUsers = () => {
  const [users, setUsers] = useState([])
  const URL = 'data/mock-users.json'

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(URL)
      if (!response.ok) {
        throw new Error('Error al cargar los datos')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [URL])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

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
