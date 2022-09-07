import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Todo = mongoose.model('Todo', todoSchema)
export default Todo
