import express from 'express';
const router = express.Router();
import Task from '../models/Task.js';
import Counter from '../models/Counter.js'; // Import the counter model

// GET all tasks
router.get('/task', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new task
router.post('/task', async (req, res) => {
  try {
    const { description, status, dueDate, priority, assignedTo } = req.body;

    // Validate required fields
    if (!assignedTo) {
      return res.status(400).json({ message: 'AssignedTo is required' });
    }

    if (!description || !status || !dueDate || !priority) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find and increment the counter for externalId
    const counter = await Counter.findOneAndUpdate(
      { id: 'taskId' }, // id for task counter
      { $inc: { seq: 1 } }, // Increment the sequence by 1
      { new: true, upsert: true } // Create if not exists
    );

    // Create the new task with the incremented externalId
    const newTask = new Task({
      externalId: counter.seq,
      description,
      status,
      dueDate,
      priority,
      assignedTo,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT/update a task by ExternalId
router.put('/task/:externalId', async (req, res) => {
  try {
    const { externalId } = req.params;
    const { description, status, dueDate, priority, assignedTo } = req.body;

    // Validate required fields
    if (!assignedTo) {
      return res.status(400).json({ message: 'AssignedTo is required' });
    }

    if (!description && !status && !dueDate && !priority) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { externalId }, // Find by externalId
      { description, status, dueDate, priority, assignedTo },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task by ExternalId
router.delete('/task/:externalId', async (req, res) => {
  try {
    const { externalId } = req.params;
    const deletedTask = await Task.findOneAndDelete({ externalId });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
