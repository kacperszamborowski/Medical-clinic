import { UserService } from '../services/user.service';

const userService = new UserService();

test('createUser should create a new user', async () => {
  const user = await userService.createUser({
    email: 'testuser@example.com',
    password: 'secret',
    role: 'user',
  });

  expect(user).toHaveProperty('id');
  expect(user.email).toBe('testuser@example.com');
});

test('getAllUsers should return an array', async () => {
  const users = await userService.getAllUsers();
  expect(Array.isArray(users)).toBe(true);
  expect(users[0].role).toBe("admin");
  expect(users[1].email).toBe("abc@example.com");
});
