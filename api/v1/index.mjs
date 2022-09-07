import express from 'express'
import { endpoints } from './endpoints/index.mjs'

const router = new express.Router()

endpoints.forEach((endpoint) => {
    router.use(endpoint.path, endpoint.router)
})

export default router
