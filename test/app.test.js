import request from 'supertest';
import { expect } from 'chai';
import { app } from '../server.js';
import mongoose from 'mongoose';
import { connectDB, closeDB } from './setup.js';
import Task from '../models/Task.js';
import Counter from '../models/Counter.js';

describe('Task API', () => {
  let taskId;

  before(async () => {
    await connectDB();
    await Task.deleteMany({});
    await Counter.deleteMany({});
    await mongoose.connection.db.dropDatabase();

    const res = await request(app)
      .post('/api/task')
      .send({
        description: 'Initial Task',
        status: 'Pending',
        dueDate: '2024-12-31',
        priority: 'Medium',
        assignedTo: 'User'
      });
    taskId = res.body.externalId;
  });

  after(async () => {
    await closeDB();
  });

  afterEach(async () => {
    await Task.deleteMany({});
    await Counter.deleteMany({});
  });

  describe('GET /api/task', () => {
    it('should return all tasks', (done) => {
      request(app)
        .get('/api/task')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /api/task', () => {
    it('should create a new task', (done) => {
      const newTask = {
        description: 'Test Task',
        status: 'Pending',
        dueDate: '2024-12-31',
        priority: 'High',
        assignedTo: 'User1'
      };

      request(app)
        .post('/api/task')
        .send(newTask)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('externalId');
          expect(res.body.description).to.equal(newTask.description);
          done();
        });
    });

    it('should return 400 if assignedTo is missing', (done) => {
      const invalidTask = {
        description: 'Invalid Task',
        status: 'Pending',
        dueDate: '2024-12-31',
        priority: 'Low'
      };

      request(app)
        .post('/api/task')
        .send(invalidTask)
        .expect(400)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message').that.equals('AssignedTo is required');
          done();
        });
    });
  });

  describe('PUT /api/task/:externalId', () => {
    it('should update a task by ExternalId', (done) => {
      const updatedTask = {
        description: 'Updated Task',
        status: 'Completed',
        dueDate: '2024-11-30',
        priority: 'High',
        assignedTo: 'User3'
      };

      request(app)
        .put(`/api/task/${taskId}`)
        .send(updatedTask)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.description).to.equal(updatedTask.description);
          expect(res.body.status).to.equal(updatedTask.status);
          done();
        });
    });

    it('should return 404 if task not found', (done) => {
      request(app)
        .put('/api/task/9999')  // Non-existent ID
        .send({ description: 'Non-existent Task' })
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message').that.equals('Task not found');
          done();
        });
    });
  });

  describe('DELETE /api/task/:externalId', () => {
    it('should delete a task by ExternalId', (done) => {
      request(app)
        .delete(`/api/task/${taskId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message').that.equals('Task deleted successfully');
          done();
        });
    });

    it('should return 404 if task not found', (done) => {
      request(app)
        .delete('/api/task/9999')  // Non-existent ID
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message').that.equals('Task not found');
          done();
        });
    });
  });
});
