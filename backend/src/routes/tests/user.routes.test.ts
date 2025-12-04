import request from 'supertest';
import app from '../../app'; // your Express app
import { UserService } from '../../services/user.service';

jest.mock('../../services/user.service');

describe('GET /api/users', () => {
  it('returns all users', async () => {
    const mockUsers = [{ id: 1, email: 'a@b.com', password: 'secretPassword', role: 'user', createdAt: (new Date(Date.now())).toDateString() }];
    (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('handles errors', async () => {
    (UserService.getAllUsers as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Database error' });
  });
});
