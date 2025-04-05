import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Task } from '../src/tasks/entities/task.entity';
import { CreateTaskDto } from '../src/tasks/dto/create-task.dto';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let createdTaskId: number;
  
  // Sample task data for testing
  const testTask: CreateTaskDto = {
    title: 'Test Task',
    description: 'This is a test task',
    completed: false
  };
  
  const updatedTaskData = {
    title: 'Updated Test Task',
    completed: true
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        // You might want to use a test-specific database config here
        // TypeOrmModule.forRoot({
        //   type: 'sqlite', 
        //   database: ':memory:',
        //   entities: [Task],
        //   synchronize: true,
        // }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Test: Get all tasks (initially should be empty or contain seed data)
  it('/tasks (GET) - should return an array of tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  // Test: Create a new task
  it('/tasks (POST) - should create a new task', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send(testTask)
      .expect(201)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.title).toBe(testTask.title);
        expect(res.body.description).toBe(testTask.description);
        expect(res.body.completed).toBe(testTask.completed);
        expect(res.body.id).toBeDefined();
        
        // Store the created task ID for later tests
        createdTaskId = res.body.id;
      });
  });

  // Test: Get a specific task by ID
  it('/tasks/:id (GET) - should return a task by ID', () => {
    return request(app.getHttpServer())
      .get(`/tasks/${createdTaskId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.id).toBe(createdTaskId);
        expect(res.body.title).toBe(testTask.title);
      });
  });

  // Test: Update a task
  it('/tasks/:id (PUT) - should update a task', () => {
    return request(app.getHttpServer())
      .put(`/tasks/${createdTaskId}`)
      .send(updatedTaskData)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.id).toBe(createdTaskId);
        expect(res.body.title).toBe(updatedTaskData.title);
        expect(res.body.completed).toBe(updatedTaskData.completed);
        // Description should remain unchanged
        expect(res.body.description).toBe(testTask.description);
      });
  });

  // Test: 404 for non-existent task
  it('/tasks/:id (GET) - should return 404 for non-existent task', () => {
    return request(app.getHttpServer())
      .get('/tasks/9999')
      .expect(404);
  });

  // Test: Delete a task
  it('/tasks/:id (DELETE) - should delete a task', () => {
    return request(app.getHttpServer())
      .delete(`/tasks/${createdTaskId}`)
      .expect(200);
  });

  // Test: Verify task was deleted
  it('/tasks/:id (GET) - should confirm task was deleted', () => {
    return request(app.getHttpServer())
      .get(`/tasks/${createdTaskId}`)
      .expect(404);
  });

  // Test: Validate task creation with invalid data
  it('/tasks (POST) - should validate task data', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({}) // Empty payload should fail validation
      .expect(400);
  });
});