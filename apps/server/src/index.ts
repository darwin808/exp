/**
 * Property of the Darwin Apolinario
 */
import bcrypt from "bcryptjs"
import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken"
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

const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Missing token" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    // @ts-expect-error: TypeScript doesn't recognize `user` on `req`, but we know it's safe.
    req.user = user
    next()
    return
  })

  return
}

// verify endpoint
app.get("/verify", authenticateToken, async (req, res) => {
  try {
    const query = `SELECT id, email, username from exp_users WHERE id = $1`

    // @ts-expect-error: We assume `req.user` exists after authentication
    const userId = req.user.userId

    const result = await client.query(query, [userId])
    const resultVal = await client.query(
      "SELECT SUM(value) AS total_value FROM user_data WHERE user_id = $1",
      [userId]
    )

    const user = { ...result.rows[0], total_value: resultVal.rows[0].total_value }
    res.status(200).json({ message: "Token is valid", user, login: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})
app.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    // @ts-expect-error: TypeScript doesn't recognize `user` on `req`, but we know it's safe.
    res.send({ darwin: req.user.userId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api", authenticateToken, async (req: Request, res: Response) => {
  try {
    const query = `
  SELECT 
    ud.id AS item_id,
    u.id AS user_id,
    u.username, 
    ud.date, 
    TO_CHAR(ud.value, 'FM999999999.00') AS value,
    ud.description
  FROM 
    exp_users u
  JOIN 
    user_data ud 
  ON 
    u.id = ud.user_id
  WHERE 
    u.id = $1
`
    // @ts-expect-error: TypeScript doesn't recognize `user` on `req`, but we know it's safe.
    const result = await client.query(query, [req.user.userId])

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
  body("date").isISO8601().withMessage("Date must be in ISO 8601 format"),
  body("value").isNumeric().withMessage("Value must be a number"),
  body("description").isString().notEmpty().withMessage("description 404")
]

app.post("/api", validateData, authenticateToken, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Extract data from the request body
    const { date, value, description } = req.body

    // @ts-expect-error: TypeScript doesn't recognize `user` on `req`, but we know it's safe.
    const userId = req.user.userId

    // Insert the new data
    const query = `
      INSERT INTO user_data (user_id, date, value, description)
      VALUES ($1, $2, $3, $4)
    `

    const result = await client.query(query, [userId, date, value, description])

    res.status(201).json({ message: "Data added successfully", data: result.rows })

    return
  } catch (err) {
    console.error("Error executing query", err.stack)
    res.status(500).json({ error: "Internal server error" })

    return
  }
})

app.delete("/api/:id", authenticateToken, async (req: Request, res: Response) => {
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

// JWT secret key
const JWT_SECRET = "your_jwt_secret"
// Validation middleware
const validateDataAuth = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").notEmpty().withMessage("Date must be in ISO 8601 format"),
  body("password").notEmpty().withMessage("Value must be a number")
]

app.post("/register", validateDataAuth, async (req: Request, res: Response) => {
  const { username, email, password } = req?.body || {}

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await client.query(
      "INSERT INTO exp_users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email, username",
      [username, email, hashedPassword]
    )

    // Generate JWT token
    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: "1h" })
    res.status(201).json({ message: "User registered successfully", data: result.rows[0], token })
    return
  } catch (error) {
    res.status(500).json({ error: "Registration failed", msg: error })
    return
  }
})

// Login route
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    // Find user in database
    const result = await client.query("SELECT * FROM exp_users WHERE username = $1", [username])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" })

    res.json({ token })
    return
  } catch (error) {
    res.status(500).json({ error: "Login failed", msg: error })
    return
  }
})

app.listen(port, () => {
  console.error(`Server is running on port ${port}`)
})
