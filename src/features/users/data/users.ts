import { faker } from '@faker-js/faker'

export const users = Array.from({ length: 20 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'invited',
      'suspended',
    ]),
    role: faker.helpers.arrayElement([
      'superadmin',
      'admin',
      'cashier',
      'manager',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})

/* 

import axios from 'axios';

// Define types for the API response and the user object
interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
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
  createdAt: string;
  updatedAt: string;
}

// Function to fetch data and transform it
const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<{ users: UserResponse[] }>('http://localhost:4000/users');
    const res: UserResponse[] = response.data.users; // Store the fetched data

    // Map and transform the data after fetching
    const users: User[] = res.map((item) => {
      return {
        id: item.id,
        firstName: item.name,
        lastName: '', // Placeholder for last name if not available
        username: item.username.toLocaleLowerCase(),
        email: item.email.toLocaleLowerCase(),
        phoneNumber: item.phone_number,
        status: item.status,
        role: item.role,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });
    console.log(users)
    return users; // Return the transformed users array
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array in case of error
  }
};

*/