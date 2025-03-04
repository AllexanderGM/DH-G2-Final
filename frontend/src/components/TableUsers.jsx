import { useCallback, useEffect, useMemo, useState } from 'react'
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

import { EyeIcon, DeleteIcon, EditIcon, SearchIcon, ChevronDownIcon, PlusIcon } from '../utils/icons.jsx'

export const INITIAL_VISIBLE_COLUMNS = [
  { name: 'ID', uid: 'id' },
  { name: 'NOMBRE', uid: 'nombre' },
  { name: 'APELLIDO', uid: 'apellido' },
  { name: 'ESTADO', uid: 'estado' },
  { name: 'PAIS', uid: 'pais' },
  { name: 'ROL', uid: 'role' },
  { name: 'ACCIONES', uid: 'actions' }
]

export const columns = [...INITIAL_VISIBLE_COLUMNS]

const statusColorMap = {
  activo: 'success',
  inactivo: 'warning',
  sospechoso: 'danger'
}

const roleColorMap = {
  admin: 'danger',
  user: 'primary',
  undefined: 'default'
}

export const statusOptions = [
  { name: 'Activo', uid: 'activo' },
  { name: 'Inactivo', uid: 'inactivo' }
]

export const roleOptions = [
  { name: 'Admin', uid: 'admin' },
  { name: 'User', uid: 'user' }
]

export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
}

const TableUsers = () => {
  const [users, setUsers] = useState([])
  const URL = 'http://localhost:8000/users'

  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS.map(col => col.uid)))
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'nombre',
    direction: 'ascending'
  })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        user =>
          user.nombre?.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.apellido?.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.email?.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter(user => Array.from(statusFilter).includes(user.estado))
    }

    if (roleFilter !== 'all' && Array.from(roleFilter).length !== roleOptions.length) {
      filteredUsers = filteredUsers.filter(user => {
        // Handle cases where role is undefined
        if (!user.role && Array.from(roleFilter).includes('undefined')) {
          return true
        }
        return Array.from(roleFilter).includes(user.role)
      })
    }

    return filteredUsers
  }, [users, filterValue, statusFilter, roleFilter, hasSearchFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(URL)
      if (!response.ok) {
        throw new Error(`Error al cargar los datos: ${response.status}`)
      }
      const data = await response.json()
      console.log('Usuarios recibidos:', data)
      setUsers(data)
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
      case 'nombre':
        return <User avatarProps={{ radius: 'lg', src: user.avatar || '' }} description={user.email} name={cellValue} />
      case 'estado':
        return (
          <Chip className="capitalize" color={statusColorMap[user.estado] || 'default'} size="sm" variant="flat">
            {cellValue || 'No definido'}
          </Chip>
        )
      case 'role':
        return (
          <Chip className="capitalize" color={roleColorMap[user.role] || 'default'} size="sm" variant="flat">
            {cellValue || 'No definido'}
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

  const onRowsPerPageChange = useCallback(e => {
    setRowsPerPage(Number(e.target.value))
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

  const handleRefresh = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    )
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage])

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre, apellido o email..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            variant="underlined"
            classNames={{
              inputWrapper: [
                'data-[focus=true]:after:bg-[#E86C6E]',
                'after:transition-all after:duration-200 after:ease-in-out',
                'after:bg-[#E86C6E]'
              ]
            }}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}>
                {statusOptions.map(status => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Rol
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Role Filter"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}>
                {roleOptions.map(role => (
                  <DropdownItem key={role.uid} className="capitalize">
                    {capitalize(role.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}>
                {columns.map(column => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button variant="light" onPress={handleRefresh} isLoading={loading}>
              Actualizar
            </Button>
            <Button color="primary" endContent={<PlusIcon />}>
              Crear Usuario
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {loading ? 'Cargando usuarios...' : error ? `Error: ${error}` : `${users.length} usuarios en total`}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    filterValue,
    statusFilter,
    roleFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    onClear,
    loading,
    error,
    handleRefresh
  ])

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
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={sortedItems}
        emptyContent={loading ? 'Cargando...' : error ? 'Error al cargar usuarios' : 'No se encontraron usuarios'}
        loadingContent={<div>Cargando usuarios...</div>}
        loadingState={loading ? 'loading' : 'idle'}>
        {item => <TableRow key={item.id}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

export default TableUsers
