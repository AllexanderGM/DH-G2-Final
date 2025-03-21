import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip
} from '@heroui/react'

import { useAuth } from '@context/AuthContext.jsx'
import { USER_COLUMNS } from '../constants/tableConstants'
import GenericTableControls from './GenericTableControls'
import TableActionCell from './TableActionCell'
import TablePagination from './TablePagination'

// Mapa de colores para los roles
const roleColorMap = {
  ADMIN: 'danger',
  CLIENT: 'success',
  GUEST: 'default'
}

const TableUsers = () => {
  const [users, setUsers] = useState([])
  const URL = import.meta.env.VITE_URL_BACK || 'http://localhost:8080'
  const { user: currentUser } = useAuth()

  // Estados de la tabla
  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(new Set(USER_COLUMNS.map(col => col.uid)))
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'username',
    direction: 'ascending'
  })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return USER_COLUMNS
    return USER_COLUMNS.filter(column => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        user =>
          (user.username?.toLowerCase() || '').includes(filterValue.toLowerCase()) ||
          (user.email?.toLowerCase() || '').includes(filterValue.toLowerCase()) ||
          (user.role?.toLowerCase() || '').includes(filterValue.toLowerCase())
      )
    }

    return filteredUsers
  }, [users, filterValue, hasSearchFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column] || ''
      const second = b[sortDescriptor.column] || ''
      const cmp = first < second ? -1 : first > second ? 1 : 0
      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('auth_token') || document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, '$1')

      console.log('Fetching users from:', `${URL}/users`)
      const response = await fetch(`${URL}/users`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error al cargar los datos: ${response.status}`)
      }

      const data = await response.json()
      console.log('Datos de usuarios recibidos:', data)

      // Procesar los datos para asegurar la estructura correcta
      const processedData = Array.isArray(data) ? data.map(user => ({
        id: user.id,
        username: user.username || 'Sin nombre',
        email: user.email || 'Sin email',
        role: user.role?.toUpperCase() || 'USER',
        avatar: user.image || null
      })) : []

      setUsers(processedData)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [URL])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'username':
        return (
          <User
            avatarProps={{
              radius: 'lg',
              src: user.avatar || 'https://via.placeholder.com/150',
              alt: user.username
            }}
            name={user.username}
          />
        )
      case 'role':
        return (
          <Chip
            className="capitalize"
            color={roleColorMap[user.role] || 'default'}
            size="sm"
            variant="flat"
          >
            {user.role?.toLowerCase() || 'user'}
          </Chip>
        )
      case 'actions':
        return (
          <TableActionCell
            item={user}
            onView={() => console.log('Ver usuario:', user)}
            onEdit={() => console.log('Editar usuario:', user)}
            onDelete={() => console.log('Eliminar usuario:', user)}
          />
        )
      default:
        return cellValue || ''
    }
  }, [])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = useCallback(newValue => {
    setRowsPerPage(newValue)
    setPage(1)
  }, [])

  const onSearchChange = useCallback(value => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const handleCreateUser = useCallback(() => {
    console.log('Crear nuevo usuario')
  }, [])

  const topContent = useMemo(() => (
    <GenericTableControls
      filterValue={filterValue}
      onClear={onClear}
      onSearchChange={onSearchChange}
      filterPlaceholder="Buscar por nombre o email..."
      columns={USER_COLUMNS}
      visibleColumns={visibleColumns}
      setVisibleColumns={setVisibleColumns}
      onCreateItem={handleCreateUser}
      createButtonLabel="Crear Usuario"
      loading={loading}
      error={error}
      totalItems={users.length}
      itemsLabel="usuarios"
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  ), [
    filterValue,
    onClear,
    onSearchChange,
    visibleColumns,
    handleCreateUser,
    loading,
    error,
    users.length,
    rowsPerPage,
    onRowsPerPageChange
  ])

  const bottomContent = useMemo(() => (
    <TablePagination
      selectedKeys={selectedKeys}
      filteredItemsLength={filteredItems.length}
      page={page}
      pages={pages}
      onPreviousPage={onPreviousPage}
      onNextPage={onNextPage}
      onPageChange={setPage}
    />
  ), [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage])

  return (
    <Table
      isHeaderSticky
      aria-label="Users Table"
      className="w-full max-w-6xl mt-6"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}>
      <TableHeader columns={headerColumns}>
        {column => (
          <TableColumn 
            key={column.uid} 
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.uid !== 'actions'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={sortedItems}
        emptyContent={loading ? 'Cargando...' : error ? 'Error al cargar usuarios' : 'No se encontraron usuarios'}
        loadingContent={<div>Cargando usuarios...</div>}
        loadingState={loading ? 'loading' : 'idle'}>
        {item => (
          <TableRow key={item.id}>
            {columnKey => (
              <TableCell>
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default TableUsers
