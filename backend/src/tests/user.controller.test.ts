import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

import type { Request, Response } from 'express';

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    res = {
      json: jsonMock,
      status: jest.fn().mockReturnThis(), // ✅ allows chaining
    };
    req = {};
  });

  it('should return all users', async () => {
    let date = new Date(Date.now());
    jest.spyOn(UserService, 'getAllUsers').mockResolvedValue([{ id: 1, email: 'a@b.com', password: 'hashedPassword', role: 'user', createdAt: date }]);

    await UserController.getAllUsers(req as any, res as any);

    expect(UserService.getAllUsers).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith([{ id: 1, email: 'a@b.com', password: 'hashedPassword', role: 'user', createdAt: date }]);
  });

  it('should handle errors', async () => {
    jest.spyOn(UserService, 'getAllUsers').mockRejectedValue(new Error('Database error'));

    await UserController.getAllUsers(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Database error' });
  });
});
