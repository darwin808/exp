/**
 * Property of the Darwin Apolinario
 */
import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { Client } from "pg"

// Initialize dotenv to load environment variables
dotenv.config()

const app = express()
const port = process.env.SERVER_PORT ?? 4000

// Database connection details
const user = process.env.DB_USER as string
const password = process.env.DB_PASSWORD as string
const host = process.env.DB_HOST as string
const database = process.env.DATABASE as string
const dbPort = process.env.DB_PORT as string

const client = new Client({
  user,
  password,
  host,
  database,
  port: parseInt(dbPort)
})
client.connect()

app.use(express.json())
app.use(cors())

app.get("/", async (_req: Request, res: Response) => {
  try {
    res.send({ darwin: "test1:" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api", async (req: Request, res: Response) => {
  try {
    const { username } = req.query

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" })
    }

    const query = `
      SELECT 
        ud.id AS item_id,
        u.username, 
        ud.date, 
        TO_CHAR(ud.value, 'FM999999999.00') AS value,
        ud.description
      FROM 
        users u
      JOIN 
        user_data ud 
      ON 
        u.id = ud.user_id
      WHERE 
        u.username = $1;
    `

    const result = await client.query(query, [username])

    res.json(result.rows)
    return
  } catch (err) {
    console.error("Error executing query", err.stack)
    res.status(500).json({ error: "Internal server error" })
    return
  }
})

// Validation middleware
const validateData = [
  body("username").notEmpty().withMessage("Username is required"),
  body("date").isISO8601().withMessage("Date must be in ISO 8601 format"),
  body("value").isNumeric().withMessage("Value must be a number")
]

app.post("/api", validateData, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Extract data from the request body
    const { username, date, value, description } = req.body

    if (!username || !date || value === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Find the user ID for the given username
    let userResult = await client.query("SELECT id FROM users WHERE username = $1", [username])

    let userId: number

    if (userResult.rows.length === 0) {
      // User not found, create the user
      await client.query("INSERT INTO users (username) VALUES ($1)", [username])

      // Retrieve the newly created user ID
      userResult = await client.query("SELECT id FROM users WHERE username = $1", [username])
      userId = userResult.rows[0].id
    } else {
      // User found, use the existing user ID
      userId = userResult.rows[0].id
    }

    // Insert the new data
    const query = `
      INSERT INTO user_data (user_id, date, value, description)
      VALUES ($1, $2, $3, $4)
    `

    await client.query(query, [userId, date, value, description])

    res.status(201).json({ message: "Data added successfully" })

    return
  } catch (err) {
    console.error("Error executing query", err.stack)
    res.status(500).json({ error: "Internal server error" })

    return
  }
})

app.delete("/api/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const query = `DELETE FROM user_data WHERE id = $1`
    const result = await client.query(query, [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No data found to delete" })
    }
    res.status(200).json({ message: "Data deleted successfully" })

    return
  } catch (err) {
    console.error("Error executing query", err.stack)
    res.status(500).json({ error: "Internal server error" })

    return
  }
})

app.listen(port, () => {
  console.error(`Server is running on port ${port}`)
})
