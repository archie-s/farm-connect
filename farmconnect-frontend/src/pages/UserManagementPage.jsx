import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertTriangle, Search, Shield, UserCheck, UserX } from 'lucide-react'
import { useAuth } from '../App'

const seedUsers = [
  { id: 'u1', name: 'John Mwangi', email: 'farmer1@farmconnect.co.ke', role: 'FARMER', isVerified: true, isActive: true, location: 'Nakuru' },
  { id: 'u2', name: 'Mary Wanjiku', email: 'farmer2@farmconnect.co.ke', role: 'FARMER', isVerified: true, isActive: true, location: 'Kiambu' },
  { id: 'u3', name: 'David Ochieng', email: 'buyer1@farmconnect.co.ke', role: 'BUYER', isVerified: true, isActive: true, location: 'Nairobi' },
  { id: 'u4', name: 'Grace Akinyi', email: 'buyer2@farmconnect.co.ke', role: 'BUYER', isVerified: true, isActive: false, location: 'Mombasa' },
  { id: 'u5', name: 'Samuel Kipchoge', email: 'mfi1@farmconnect.co.ke', role: 'MFI', isVerified: true, isActive: true, location: 'Eldoret' },
  { id: 'u6', name: 'Peter Kamau', email: 'extension@farmconnect.co.ke', role: 'EXTENSION_OFFICER', isVerified: true, isActive: true, location: 'Nyeri' },
  { id: 'u7', name: 'Admin User', email: 'admin@farmconnect.co.ke', role: 'ADMIN', isVerified: true, isActive: true, location: 'Nairobi' }
]

const getRoleValue = (role) => {
  if (!role) return ''
  return role.toString().toUpperCase().replace(/\s+/g, '_')
}

const UserManagementPage = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState(seedUsers)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [lastAction, setLastAction] = useState('')

  const isAdmin = getRoleValue(user?.role) === 'ADMIN'

  const filteredUsers = useMemo(() => {
    return users.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === 'ALL' || account.role === roleFilter

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && account.isActive) ||
        (statusFilter === 'SUSPENDED' && !account.isActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  const summary = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((account) => account.isActive).length,
      suspended: users.filter((account) => !account.isActive).length,
      admins: users.filter((account) => account.role === 'ADMIN').length,
      unverified: users.filter((account) => !account.isVerified).length
    }
  }, [users])

  const updateUser = (id, updater) => {
    setUsers((currentUsers) => currentUsers.map((account) => (account.id === id ? { ...account, ...updater(account) } : account)))
  }

  const toggleUserActive = (id) => {
    const userToChange = users.find((account) => account.id === id)
    if (!userToChange) return

    updateUser(id, (account) => ({ isActive: !account.isActive }))
    setLastAction(`${userToChange.name} has been ${userToChange.isActive ? 'suspended' : 'reactivated'}.`)
  }

  const toggleUserVerified = (id) => {
    const userToChange = users.find((account) => account.id === id)
    if (!userToChange) return

    updateUser(id, (account) => ({ isVerified: !account.isVerified }))
    setLastAction(`${userToChange.name} verification status updated.`)
  }

  const updateRole = (id, nextRole) => {
    const userToChange = users.find((account) => account.id === id)
    if (!userToChange) return

    updateUser(id, () => ({ role: nextRole }))
    setLastAction(`${userToChange.name} is now assigned role ${nextRole}.`)
  }

  const toggleSelectedUser = (id) => {
    setSelectedUsers((currentSelected) =>
      currentSelected.includes(id)
        ? currentSelected.filter((selectedId) => selectedId !== id)
        : [...currentSelected, id]
    )
  }

  const applyBulkAction = (action) => {
    if (selectedUsers.length === 0) return

    setUsers((currentUsers) =>
      currentUsers.map((account) => {
        if (!selectedUsers.includes(account.id)) return account
        if (action === 'SUSPEND') return { ...account, isActive: false }
        if (action === 'ACTIVATE') return { ...account, isActive: true }
        if (action === 'VERIFY') return { ...account, isVerified: true }
        return account
      })
    )

    setLastAction(`${action} action applied to ${selectedUsers.length} account(s).`)
    setSelectedUsers([])
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Administrator Access Required
            </CardTitle>
            <CardDescription>
              User management controls are restricted to administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform accounts, roles, verification state, and suspension controls.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {lastAction && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{lastAction}</p>}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Total Users</p><p className="text-xl font-semibold">{summary.total}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Active</p><p className="text-xl font-semibold">{summary.active}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Suspended</p><p className="text-xl font-semibold">{summary.suspended}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Admins</p><p className="text-xl font-semibold">{summary.admins}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Unverified</p><p className="text-xl font-semibold">{summary.unverified}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Directory Controls</CardTitle>
            <CardDescription>Filter, search, select users, and apply platform-wide account actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <div className="md:col-span-2 relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, email, or location"
                  className="pl-9"
                />
              </div>
              <select
                className="border rounded-md px-3 py-2"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="FARMER">Farmer</option>
                <option value="BUYER">Buyer</option>
                <option value="MFI">MFI</option>
                <option value="EXTENSION_OFFICER">Extension Officer</option>
                <option value="ADMIN">Admin</option>
              </select>
              <select
                className="border rounded-md px-3 py-2"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => applyBulkAction('SUSPEND')} disabled={selectedUsers.length === 0}>
                <UserX className="h-4 w-4 mr-1" /> Suspend Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyBulkAction('ACTIVATE')} disabled={selectedUsers.length === 0}>
                <UserCheck className="h-4 w-4 mr-1" /> Activate Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyBulkAction('VERIFY')} disabled={selectedUsers.length === 0}>
                <Shield className="h-4 w-4 mr-1" /> Verify Selected
              </Button>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-3">Select</th>
                    <th className="py-2 pr-3">User</th>
                    <th className="py-2 pr-3">Role</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Verified</th>
                    <th className="py-2 pr-3">Location</th>
                    <th className="py-2">Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((account) => (
                    <tr key={account.id} className="border-b align-top">
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(account.id)}
                          onChange={() => toggleSelectedUser(account.id)}
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </td>
                      <td className="py-3 pr-3 space-y-2">
                        <Badge className="bg-gray-100">{account.role}</Badge>
                        <select
                          className="border rounded px-2 py-1 text-xs block"
                          value={account.role}
                          onChange={(event) => updateRole(account.id, event.target.value)}
                        >
                          <option value="FARMER">FARMER</option>
                          <option value="BUYER">BUYER</option>
                          <option value="MFI">MFI</option>
                          <option value="EXTENSION_OFFICER">EXTENSION_OFFICER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge className={account.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {account.isActive ? 'ACTIVE' : 'SUSPENDED'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge className={account.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-800'}>
                          {account.isVerified ? 'VERIFIED' : 'PENDING'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3">{account.location}</td>
                      <td className="py-3 space-x-2 space-y-2">
                        <Button variant="outline" size="sm" onClick={() => toggleUserActive(account.id)}>
                          {account.isActive ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleUserVerified(account.id)}>
                          {account.isVerified ? 'Unverify' : 'Verify'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">No users match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserManagementPage
