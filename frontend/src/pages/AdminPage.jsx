import { useCallback, useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import TableTours from '@components/TableTours'
import TableUsers from '@components/TableUsers'

export default function AdminPage() {
  const [tableType, setTableType] = useState('tourType')

  const toggleType = () => setTableType(prev => (prev === 'userType' ? 'tourType' : 'userType'))

  return (
    <div className="flex flex-col items-center 9-full min-h-screen bg-gray-100 p-6 mb-6">
      <Button onPress={toggleType}>{tableType === 'tourType' ? 'User' : 'Tour'}</Button>

      {tableType === 'tourType' ? <TableTours /> : <TableUsers />}
    </div>
  )
}
