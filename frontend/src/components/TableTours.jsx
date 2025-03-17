import { useCallback, useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
import { normalizeWords } from '@utils/normalizeWords.js'
import CrearTourForm from './CrearTourForm.jsx'
import EditarTourForm from './EditarTourForm.jsx'

export const INITIAL_VISIBLE_COLUMNS = [
  { name: 'NOMBRE', uid: 'nombre' },
  { name: 'DESTINO', uid: 'destino' },
  { name: 'CATEGORÍA', uid: 'categoria' },
  { name: 'PRECIO', uid: 'precio' },
  { name: 'ACCIONES', uid: 'actions' }
]
export const columns = [...INITIAL_VISIBLE_COLUMNS]

// Mapa de colores para las categorías
const statusColorMap = {
  BEACH: 'primary',
  VACATION: 'success',
  ADVENTURE: 'warning',
  ECOTOURISM: 'secondary',
  LUXURY: 'success',
  CITY: 'danger',
  MOUNTAIN: 'warning',
  CRUISE: 'primary',
  ADRENALIN: 'danger'
}

export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
}

const TableTours = () => {
  const [lugares, setLugares] = useState([])
  const URL = import.meta.env.VITE_URL_BACK || 'http://localhost:8080'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTour, setEditingTour] = useState(null)

  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS.map(col => col.uid)))
  const [statusFilter, setStatusFilter] = useState('all')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'nombre',
    direction: 'ascending'
  })
  const [page, setPage] = useState(1)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  // Extraemos las categorías únicas de los tours para el filtro
  const statusOptions = useMemo(() => {
    const categoriesSet = new Set()

    lugares.forEach(tour => {
      if (Array.isArray(tour.tags)) {
        tour.tags.forEach(tag => {
          categoriesSet.add(tag)
        })
      } else if (tour.categoria) {
        categoriesSet.add(tour.categoria)
      }
    })

    return Array.from(categoriesSet).map(category => ({
      name: normalizeWords(category),
      uid: category
    }))
  }, [lugares])

  const filteredItems = useMemo(() => {
    let filteredTours = [...lugares]

    if (hasSearchFilter) {
      filteredTours = filteredTours.filter(tour => tour.nombre?.toLowerCase().includes(filterValue.toLowerCase()))
    }

    if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
      filteredTours = filteredTours.filter(tour => {
        // Si tour.tags es un array, verificamos si contiene alguno de los valores seleccionados
        if (Array.isArray(tour.tags)) {
          return tour.tags.some(tag => Array.from(statusFilter).includes(tag))
        }

        // Si categoria es una sola cadena (primer tag)
        return Array.from(statusFilter).includes(tour.categoria)
      })
    }

    return filteredTours
  }, [lugares, filterValue, statusFilter, hasSearchFilter, statusOptions.length])

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

  const fetchLugares = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching tours from:', `${URL}/tours`)
      const response = await fetch(`${URL}/tours`)

      if (!response.ok) {
        throw new Error(`Error al cargar los datos: ${response.status}`)
      }

      const data = await response.json()
      console.log('Tours recibidos:', data)

      // Procesar los datos según la estructura real del backend
      const processedData = Array.isArray(data)
        ? data.map(tour => ({
            idPaquete: tour.id,
            nombre: tour.name || 'Sin nombre',
            destino: tour.destination?.city?.name || tour.destination?.country || 'Sin destino',
            // Usamos el primer tag como categoría principal para mostrar en la tabla
            categoria: Array.isArray(tour.tags) && tour.tags.length > 0 ? tour.tags[0] : 'Sin categoría',
            precio: tour.adultPrice || 0,
            imagenes: Array.isArray(tour.images) ? tour.images : [],
            description: tour.description,
            childPrice: tour.childPrice,
            status: tour.status?.status,
            // Guardamos todos los tags originales para el filtrado
            tags: tour.tags,
            includes: tour.includes,
            destination: tour.destination,
            hotel: tour.hotel,
            availability: tour.availability
          }))
        : []

      setLugares(processedData)
    } catch (error) {
      console.error('Error fetching tours:', error)
      setError(error.message)

      // Si estamos en modo desarrollo y falla, intentar cargar datos de ejemplo
      if (import.meta.env.DEV) {
        try {
          const response = await fetch('/data/tours.json')
          if (response.ok) {
            const mockData = await response.json()
            const processedMockData = mockData.map(tour => ({
              idPaquete: tour.id,
              nombre: tour.name || 'Sin nombre',
              destino: tour.destination?.city?.name || tour.destination?.country || 'Sin destino',
              categoria: Array.isArray(tour.tags) && tour.tags.length > 0 ? tour.tags[0] : 'Sin categoría',
              precio: tour.adultPrice || 0,
              imagenes: Array.isArray(tour.images) ? tour.images : [],
              description: tour.description,
              childPrice: tour.childPrice,
              status: tour.status?.status,
              tags: tour.tags,
              includes: tour.includes,
              destination: tour.destination,
              hotel: tour.hotel,
              availability: tour.availability
            }))
            setLugares(processedMockData)
            setError('Usando datos de desarrollo (mock)')
          }
        } catch (mockError) {
          console.error('Error cargando datos de ejemplo:', mockError)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [URL])

  useEffect(() => {
    fetchLugares()
  }, [fetchLugares])

  // Funciones para manejar la edición
  const handleOpenEditModal = useCallback(tour => {
    setEditingTour(tour)
    setIsEditModalOpen(true)
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setEditingTour(null)
  }, [])

  const handleTourUpdated = useCallback(
    updatedTour => {
      console.log('Tour actualizado:', updatedTour)
      fetchLugares() // Actualizamos la lista después de editar
    },
    [fetchLugares]
  )

  const renderCell = useCallback(
    (lugar, columnKey) => {
      const cellValue = lugar[columnKey]

      switch (columnKey) {
        case 'nombre':
          return (
            <User
              avatarProps={{
                radius: 'lg',
                src: lugar.imagenes && lugar.imagenes.length > 0 ? lugar.imagenes[0] : 'https://via.placeholder.com/150'
              }}
              name={cellValue || 'Sin nombre'}
              description={
                lugar.description ? (lugar.description.length > 30 ? lugar.description.substring(0, 30) + '...' : lugar.description) : ''
              }
            />
          )
        case 'categoria':
          return (
            <Chip className="capitalize" color={statusColorMap[lugar.categoria] || 'default'} size="sm" variant="flat">
              {normalizeWords(cellValue) || 'No definida'}
            </Chip>
          )
        case 'precio':
          // Formateamos el precio con separadores de miles y 2 decimales
          return `${(cellValue || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        case 'destino':
          // Mostramos el destino con más detalle si está disponible
          if (lugar.destination) {
            const fullDestination = [lugar.destination.city?.name, lugar.destination.country].filter(Boolean).join(', ')
            return fullDestination || cellValue || 'Sin destino'
          }
          return cellValue || 'Sin destino'
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Detalles">
                <Link to={`/tour/${lugar.idPaquete}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </Link>
              </Tooltip>
              <Tooltip content="Editar">
                <span onClick={() => handleOpenEditModal(lugar)} className="text-lg text-default-400 cursor-pointer active:opacity-50">
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
          return cellValue || '-'
      }
    },
    [handleOpenEditModal]
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
    fetchLugares()
  }, [fetchLugares])

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  const handleTourCreated = useCallback(
    newTour => {
      console.log('Tour creado:', newTour)
      fetchLugares() // Actualizamos la lista después de crear
    },
    [fetchLugares]
  )

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>
        <Pagination
          initialPage={1}
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            item: 'bg-white hover:bg-white',
            prev: 'bg-white hover:bg-purple-600',
            next: 'bg-white hover:bg-purple-600'
          }}
        />
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
            placeholder="Buscar por nombre..."
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
                  Categoría
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                shouldCloseOnItemClick={false}
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
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                shouldCloseOnItemClick={false}
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
            <Button color="primary" endContent={<PlusIcon />} onPress={handleOpenCreateModal}>
              Crear Tour
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {loading ? 'Cargando tours...' : error ? `Error: ${error}` : `${lugares.length} tours en total`}
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
    visibleColumns,
    onRowsPerPageChange,
    lugares.length,
    onSearchChange,
    onClear,
    handleRefresh,
    loading,
    error,
    statusOptions,
    handleOpenCreateModal
  ])

  return (
    <>
      <Table
        isHeaderSticky
        aria-label="Tours Table"
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
          emptyContent={loading ? 'Cargando...' : error ? `Error: ${error}` : 'No se encontraron paquetes'}
          loadingContent={<div>Cargando tours...</div>}
          loadingState={loading ? 'loading' : 'idle'}>
          {item => (
            <TableRow key={item.idPaquete || item.id || Math.random().toString()}>
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal para crear nuevo tour */}
      <CrearTourForm isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} onSuccess={handleTourCreated} />

      {/* Modal para editar tour */}
      {editingTour && (
        <EditarTourForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSuccess={handleTourUpdated} tourData={editingTour} />
      )}
    </>
  )
}

export default TableTours
