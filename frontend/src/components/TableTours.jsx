import { useCallback, useEffect, useState, useMemo } from 'react'
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
  { name: 'NOMBRE', uid: 'nombre' },
  { name: 'DESTINO', uid: 'destino' },
  { name: 'CATEGORÍA', uid: 'categoria' },
  { name: 'PRECIO', uid: 'precio' },
  { name: 'ACCIONES', uid: 'actions' }
]
export const columns = [...INITIAL_VISIBLE_COLUMNS]

const statusColorMap = {
  Playa: 'primary',
  Cultural: 'success',
  Aventura: 'warning',
  Relax: 'secondary',
  Familiar: 'success',
  Urbano: 'danger'
}
// Opciones basadas en los posibles tags del backend
export const statusOptions = [
  { name: 'Playa', uid: 'Playa' },
  { name: 'Aventura', uid: 'Aventura' },
  { name: 'Cultural', uid: 'Cultural' },
  { name: 'Relax', uid: 'Relax' },
  { name: 'Familiar', uid: 'Familiar' },
  { name: 'Urbano', uid: 'Urbano' }
]

export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
}

const TableTours = () => {
  const [lugares, setLugares] = useState([])
  const URL = import.meta.env.VITE_URL_BACK || 'http://localhost:8080'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const filteredItems = useMemo(() => {
    let filteredTours = [...lugares]

    if (hasSearchFilter) {
      filteredTours = filteredTours.filter(tour => tour.nombre?.toLowerCase().includes(filterValue.toLowerCase()))
    }

    if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
      filteredTours = filteredTours.filter(tour => Array.from(statusFilter).includes(tour.categoria))
    }

    return filteredTours
  }, [lugares, filterValue, statusFilter, hasSearchFilter])

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
            categoria: Array.isArray(tour.tags) && tour.tags.length > 0 ? tour.tags[0] : 'Cultural',
            precio: tour.adultPrice || 0,
            imagenes: Array.isArray(tour.images) ? tour.images : [],
            description: tour.description,
            childPrice: tour.childPrice,
            status: tour.status?.status,
            tags: tour.tags,
            includes: tour.includes,
            destination: tour.destination,
            hotel: tour.hotel
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
              categoria: Array.isArray(tour.tags) && tour.tags.length > 0 ? tour.tags[0] : 'Cultural',
              precio: tour.adultPrice || 0,
              imagenes: Array.isArray(tour.images) ? tour.images : [],
              description: tour.description,
              childPrice: tour.childPrice,
              status: tour.status?.status,
              tags: tour.tags,
              includes: tour.includes,
              destination: tour.destination,
              hotel: tour.hotel
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

  const renderCell = useCallback((lugar, columnKey) => {
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
            {cellValue || 'No definida'}
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
        return cellValue || '-'
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
    fetchLugares()
  }, [fetchLugares])

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
    error
  ])

  return (
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
  )
}

export default TableTours
