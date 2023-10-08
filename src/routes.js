import { randomUUID } from "node:crypto"

import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (request, response) => {
            const { search } = request.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)

            return response
                .setHeader("Content-type", "application/json")
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (request, response) => {
            const { title, description } = request.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: null,
            }

            database.insert('tasks', task)

            return response.writeHead(201).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const { id } = request.params

            database.delete('tasks', id)

            return response.writeHead(204).end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const { id } = request.params

            const { title, description } = request.body

            const [task] = database.select('tasks', { id })

            const raw = { ...task }
            raw.updated_at = new Date()

            title ? raw.title = title : null
            description ? raw.description = description : null

            if (!task) {
                return response.writeHead(404).end()
            }

            database.update('tasks', id, {
                ...raw
            })

            return response.writeHead(204).end()

        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (request, response) => {
            const { id } = request.params

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end()
            }


            const raw = {...task}

            const isTaskCompleted = !!task.completed_at
            const completed_at = isTaskCompleted ? null : new Date()
            
            raw.completed_at = completed_at

            database.update('tasks', id, { ...raw })

            return response.writeHead(204).end()
        }
    }
]