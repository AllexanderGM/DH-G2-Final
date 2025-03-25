import { useCallback, useEffect, useMemo, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip } from '@heroui/react'

import { useAuth } from '@context/AuthContext.jsx'
import { USER_COLUMNS } from '../constants/tableConstants'
import GenericTableControls from './GenericTableControls'
import TableActionCell from './TableActionCell'
import TablePagination from './TablePagination'

// Nuevos imports
import { getAllUsers, deleteUser } from '@services/userService'
import CrearUserForm from './CrearUserForm'
import EditarUserForm from './EditarUserForm'
import DeleteUserModal from './DeleteUserModal'

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

  // Nuevos estados para los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

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
          (user.name?.toLowerCase() || '').includes(filterValue.toLowerCase()) ||
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

      const result = await getAllUsers()

      if (result.error) {
        throw new Error(result.message || 'Error al cargar usuarios')
      }

      const data = result.data || []
      console.log('Datos de usuarios recibidos:', data)

      // Procesar los datos para asegurar la estructura correcta
      const processedData = Array.isArray(data)
        ? data.map(user => ({
            id: user.id,
            username: user.username || user.name || 'Sin nombre',
            name: user.name || user.username || 'Sin nombre',
            lastName: user.lastName || '',
            email: user.email || 'Sin email',
            role: user.role?.toUpperCase() || 'CLIENT',
            avatar: user.image || null,
            document: user.document || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth || '',
            address: user.address || '',
            city: user.city || ''
          }))
        : []

      setUsers(processedData)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      setError(error.message)

      // Si estamos en modo desarrollo y falla, intentar cargar datos de ejemplo
      if (import.meta.env.DEV) {
        try {
          const response = await fetch('/data/mock-users.json')
          if (response.ok) {
            const mockData = await response.json()
            setUsers(mockData)
            setError('Usando datos de desarrollo (mock)')
          }
        } catch (mockError) {
          console.error('Error cargando datos de ejemplo:', mockError)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Funciones para manejar la creación, edición y eliminación de usuarios
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  const handleUserCreated = useCallback(
    newUser => {
      console.log('Usuario creado:', newUser)
      fetchUsers() // Refrescar la lista
    },
    [fetchUsers]
  )

  const handleOpenEditModal = useCallback(user => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setEditingUser(null)
  }, [])

  const handleUserUpdated = useCallback(
    updatedUser => {
      console.log('Usuario actualizado:', updatedUser)
      fetchUsers() // Refrescar la lista
    },
    [fetchUsers]
  )

  const handleOpenDeleteModal = useCallback(user => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
    setDeleteError(null)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
    setDeleteError(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!userToDelete) return

    try {
      setDeleteLoading(true)
      setDeleteError(null)

      // Usar preferentemente el ID, pero si no está disponible usar el email
      const identifier = userToDelete.id || userToDelete.email

      if (!identifier) {
        throw new Error('No se pudo identificar al usuario para eliminarlo')
      }

      const success = await deleteUser(identifier)

      if (success) {
        // Actualizar la lista después de eliminar
        fetchUsers()
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
      } else {
        setDeleteError('No se pudo eliminar el usuario. Intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      setDeleteError(`Error: ${error.message || 'No se pudo eliminar el usuario'}`)
    } finally {
      setDeleteLoading(false)
    }
  }, [userToDelete, fetchUsers])

  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey]

      switch (columnKey) {
        case 'username':
          return (
            <User
              avatarProps={{
                radius: 'lg',
                src: user.avatar || 'https://via.placeholder.com/150',
                alt: user.username || user.name
              }}
              name={user.username || user.name}
              description={user.email}
            />
          )
        case 'role':
          return (
            <Chip className="capitalize" color={roleColorMap[user.role] || 'default'} size="sm" variant="flat">
              {user.role?.toLowerCase() || 'client'}
            </Chip>
          )
        case 'actions':
          return (
            <TableActionCell
              item={user}
              onView={() => console.log('Ver usuario:', user)}
              onEdit={() => handleOpenEditModal(user)}
              onDelete={() => handleOpenDeleteModal(user)}
            />
          )
        default:
          return cellValue || ''
      }
    },
    [handleOpenEditModal, handleOpenDeleteModal]
  )

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

  const topContent = useMemo(
    () => (
      <GenericTableControls
        filterValue={filterValue}
        onClear={onClear}
        onSearchChange={onSearchChange}
        filterPlaceholder="Buscar por nombre o email..."
        columns={USER_COLUMNS}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onCreateItem={handleOpenCreateModal}
        createButtonLabel="Crear Usuario"
        loading={loading}
        error={error}
        totalItems={users.length}
        itemsLabel="usuarios"
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    ),
    [
      filterValue,
      onClear,
      onSearchChange,
      visibleColumns,
      handleOpenCreateModal,
      loading,
      error,
      users.length,
      rowsPerPage,
      onRowsPerPageChange
    ]
  )

  const bottomContent = useMemo(
    () => (
      <TablePagination
        selectedKeys={selectedKeys}
        filteredItemsLength={filteredItems.length}
        page={page}
        pages={pages}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onPageChange={setPage}
      />
    ),
    [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]
  )

  return (
    <>
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
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'} allowsSorting={column.uid !== 'actions'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={sortedItems}
          emptyContent={loading ? 'Cargando...' : error ? 'Error al cargar usuarios' : 'No se encontraron usuarios'}
          loadingContent={<div>Cargando usuarios...</div>}
          loadingState={loading ? 'loading' : 'idle'}>
          {item => <TableRow key={item.id || item.email}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>

      {/* Modal para crear nuevo usuario */}
      <CrearUserForm isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} onSuccess={handleUserCreated} />

      {/* Modal para editar usuario */}
      {editingUser && (
        <EditarUserForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSuccess={handleUserUpdated} userData={editingUser} />
      )}

      {/* Modal para confirmar eliminación */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        userData={userToDelete}
        isLoading={deleteLoading}
        error={deleteError}
      />
    </>
  )
}

export default TableUsers
