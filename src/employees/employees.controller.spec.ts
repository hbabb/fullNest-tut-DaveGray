import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

jest.mock('src/database/database.service.ts', () => ({
  DatabaseService: jest.fn().mockImplementation(() => mockDatabaseService),
}));

const mockDatabase = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@test.com', role: 'ENGINEER' },
    { id: 2, name: 'Bob', email: 'bob@test.com', role: 'ADMIN' },
    { id: 3, name: 'John', email: 'john@test.com', role: 'INTERN' },
  ],
};

const mockDatabaseService = {
  employee: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('EmployeesController', () => {
  let controller: EmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        EmployeesService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an employee', async () => {
    const newEmployee = {
      name: 'Dave',
      email: 'dave@example.com',
      role: 'INTERN' as const,
    };
    mockDatabaseService.employee.create.mockResolvedValue(newEmployee);

    const result = await controller.create(newEmployee);
    expect(result).toEqual(newEmployee);
    expect(mockDatabaseService.employee.create).toHaveBeenCalledWith({
      data: newEmployee,
    });
  });

  it('should findAll employees', async () => {
    mockDatabaseService.employee.findMany.mockResolvedValue(mockDatabase.users);

    const result = await controller.findAll();
    expect(result).toEqual(mockDatabase.users);
    expect(mockDatabaseService.employee.findMany).toHaveBeenCalled();
  });

  it('should findOne employee', async () => {
    mockDatabaseService.employee.findUnique.mockResolvedValue(
      mockDatabase.users,
    );

    const result = await controller.findOne('1');
    expect(result).toEqual(mockDatabase.users);
    expect(mockDatabaseService.employee.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update an employee', async () => {
    const updatedUser = { name: 'Updated Bob', role: 'ENGINEER' as const };
    const result = await controller.update('2', updatedUser);
    expect(result).toEqual({
      id: '2',
      name: 'Updated Bob',
      email: 'bob@test.com',
      role: 'ENGINEER',
    });
    expect(mockDatabaseService.employee.update).toHaveBeenCalledWith(
      2,
      updatedUser,
    );
  });

  it('should delete an employee', async () => {
    mockDatabaseService.employee.delete.mockResolvedValue(mockDatabase.users);

    const result = await controller.remove('3');
    expect(result).toEqual({ success: true });
    expect(mockDatabaseService.employee.delete).toHaveBeenCalledWith({
      where: { id: 3 },
    });
  });
});
