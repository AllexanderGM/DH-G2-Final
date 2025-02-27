import { useCallback, useEffect, useState } from 'react'
import { Button, Switch } from '@heroui/react'
import TableTours from '@components/TableTours'
import TableUsers from '@components/TableUsers'

export default function AdminPage() {
  const [tableType, setTableType] = useState('tourType')

  const toggleType = () => setTableType(prev => (prev === 'userType' ? 'tourType' : 'userType'))

  return (
    <div className="flex flex-col items-center 9-full min-h-screen bg-gray-100 p-6 mb-6">
      <div>
        <Button
          size="sm"
          onPress={() => setTableType('tourType')}
          className={tableType === 'tourType' ? 'bg-primary-400 text-white' : 'divide-gray-400'}>
          Tours
        </Button>
        <Button
          size="sm"
          onPress={() => setTableType('userType')}
          className={tableType === 'userType' ? 'bg-primary-400 text-white' : 'divide-gray-400'}>
          Usuarios
        </Button>
      </div>

      {tableType === 'tourType' ? <TableTours /> : <TableUsers />}
    </div>
  )
}
