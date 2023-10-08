import { parse } from "csv-parse"
import fs from "node:fs"

const path = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(path)

const csvParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

const run = async () => {
    const linesParse = stream.pipe(csvParse)

    for await (const line of linesParse) {
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title, 
                description,
            })
        })
    }
}

run()