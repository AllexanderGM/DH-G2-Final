import { useEffect, useState } from 'react'
import axios from 'axios'

const Users = () => {
  const [users, setUsers] = useState(null)
  const URL = 'http://localhost:8000/users'

  useEffect(() => {
    axios.get(URL).then(res => {
      setUsers(res.data)
    })
  }, [])

  if (!users) return null

  return (
    <>
      <ul className="ml-20 mt-20">
        {users.map(user => (
          <ol key={user.id}>{user.nombre}</ol>
        ))}
      </ul>
    </>
  )
}

export default Users
