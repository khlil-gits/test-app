import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { Task } from '../src/tasks/entities/task.entity';
import * as request from 'supertest';

export async function createTestingApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

export async function createTestTask(app: INestApplication, taskData = {}) {
  const defaultTask = {
    title: `Test Task ${Date.now()}`,
    description: 'This is a test task created for testing purposes',
    completed: false,
  };

  const testTask = { ...defaultTask, ...taskData };
  
  const response = await request(app.getHttpServer())
    .post('/tasks')
    .send(testTask);
    
  return response.body;
}

export async function cleanupTasks(app: INestApplication) {
  // Get all tasks
  const response = await request(app.getHttpServer()).get('/tasks');
  
  // Delete all tasks
  for (const task of response.body) {
    await request(app.getHttpServer()).delete(`/tasks/${task.id}`);
  }
}