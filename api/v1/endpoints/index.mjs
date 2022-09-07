import { healthRoute } from './health.mjs'
import { todosRoute } from './todos.mjs'

export const endpoints = [
    {
        path: '/todos',
        router: todosRoute,
    },
    {
        path: '/health',
        router: healthRoute,
    },
]
