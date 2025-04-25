import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { userListSchema } from './data/schema'
import { useEffect, useState } from 'react'
import axios from 'axios'
// import { users } from './data/users'
interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  status: string;
  role: string;
  // created_at: Date;
  // updated_at: Date;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: string;
  role: string;
  // createdAt: Date;
  // updatedAt: Date;
}

export default function Users() {
  // Parse user list
  const [usersdata, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ users: UserResponse[] }>('http://localhost:4000/users');
      const res: UserResponse[] = response.data.users;

      const transformedUsers: User[] = res.map((item) => ({
        id: item.id,
        firstName: item.name,
        lastName: '', // Placeholder for last name
        username: item.username,
        email: item.email.toLowerCase(),
        phoneNumber: item.phone_number,
        status: item.status,
        role: item.role,
        createdAt: new  Date(),
        updatedAt: new Date(),
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const userList = userListSchema.parse(usersdata)

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable data={userList} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
