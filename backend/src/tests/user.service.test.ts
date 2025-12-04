import { UserService } from '../services/user.service';

test('createUser should create a new user', async () => {
  const user = await UserService.createUser({
    email: 'testuser@example.com',
    password: 'secret',
    role: 'user',
  });

  expect(user).toHaveProperty('id');
  expect(user.email).toBe('testuser@example.com');
});

test('getAllUsers should return an array', async () => {
  const users = await UserService.getAllUsers();
  expect(Array.isArray(users)).toBe(true);
  expect(users[0].role).toBe("admin");
  expect(users[1].email).toBe("abc@example.com");
});
