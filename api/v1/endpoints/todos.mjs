import express from 'express'
import { log } from '../../utils/logger.mjs'
import { Todo } from '../models/index.mjs'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const data = req.body
        const newTodo = new Todo({
            ...data,
        })
        const todo = await newTodo.save()
        res.status(201).json({ message: 'Todo added successfully', todo })
    } catch (error) {
        log.error(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: `Something went wrong: ${error}` })
    }
})

router.get('/', async (_, res) => {
    try {
        const todos = await Todo.find({})
        res.status(200).json({ todos })
    } catch (error) {
        log.error(error)
        return res
            .status(error.statusCode || 500)
            .json({ message: `Something went wrong: ${error}` })
    }
})

export const todosRoute = router
