/**
 * Property of the Darwin Apolinario
 */
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken"

// Initialize dotenv to load environment variables
dotenv.config()

const app = express()
const port = process.env.SERVER_PORT ?? 4000

const supabase = createClient(
  process.env.SUPABASE_PROJECT_ID as string,
  process.env.SUPABASE_API_KEY as string
)

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
/**
 * Calculates the sum of the `value` property for each object in the given array.
 *
 * @param {Array<{value: number}>} arr - An array of objects, each containing a `value` property of type number.
 * @return {number} The total sum of all `value` properties in the array. Returns 0 if the array is null or undefined.
 */
const sumValues = (arr: { value: number }[]) => {
  if (!arr) {
    return 0
  }
  return arr.reduce((total, obj) => total + obj.value, 0)
}
// verify endpoint
app.get("/verify", authenticateToken, async (req, res) => {
  try {
    // @ts-expect-error: We assume `req.user` exists after authentication
    const userId = req.user.userId

    // Fetch user details from the `exp_users` table
    const { data: userData, error: userError } = await supabase
      .from("exp_users")
      .select("id, email, username")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error(userError)
      return res.status(500).json({ error: "Error fetching user details" })
    }

    // Fetch the total value from the `user_data` table
    const { data: totalValueData, error: totalValueError } = await supabase
      .from("user_data")
      .select("value")
      .eq("user_id", userId)

    if (totalValueError) {
      console.error(totalValueError)
      return res.status(500).json({ error: "Error fetching total value" })
    }

    // Combine user details and total value into a single object
    const user = {
      ...userData,
      total_value: sumValues(totalValueData) || 0
    }

    res.status(200).json({ message: "Token is valid", user, login: true })
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
    return
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
    // @ts-expect-error: TypeScript doesn't recognize `user` on `req`, but we know it's safe.
    const userId = req.user.userId

    // Fetch data from `user_data` and `exp_users` tables using a join
    const { data, error } = await supabase
      .from("user_data")
      .select(
        `
        item_id:id,
        user_id,
        exp_users(username),
        date,
        value,
        description
        `
      )
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching data:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    // Format the value field (e.g., for two decimal places)
    const formattedData = data.map((row) => ({
      ...row,

      value: parseFloat(row.value).toFixed(2)
    }))

    res.json(formattedData)
    return
  } catch (err) {
    console.error("Error executing query", err)
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
    // Validate request data
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Extract data from the request body
    const { date, value, description } = req.body

    // @ts-expect-error: TypeScript doesn't recognize `user` on `req`, but we know it's safe.
    const userId = req.user.userId

    // Insert the new data into the `user_data` table
    const { data, error } = await supabase.from("user_data").insert([
      {
        user_id: userId,
        date,
        value,
        description
      }
    ])

    if (error) {
      console.error("Error inserting data:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    res.status(201).json({ message: "Data added successfully", data })

    return
  } catch (err) {
    console.error("Error executing request", err)
    res.status(500).json({ error: "Internal server error" })

    return
  }
})

app.delete("/api/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Delete the data using Supabase
    const { data, error, count } = await supabase.from("user_data").delete().eq("id", id)

    if (error) {
      console.error("Error deleting data:", error)
      return res.status(500).json({ error: "Failed to delete data" })
    }

    if (count === 0) {
      return res.status(404).json({ error: "No data found to delete" })
    }

    res.status(200).json({ message: "Data deleted successfully", data })

    return
  } catch (err) {
    console.error("Error executing query", err)
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user into the 'exp_users' table using Supabase
    const { data, error } = await supabase
      .from("exp_users")
      .insert([{ username, email, password: hashedPassword }])
      .select("id, email, username")
      .single() // To return a single inserted row

    if (error) {
      console.error("Error registering user:", error)
      return res.status(500).json({ error: "Registration failed", msg: error.message })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: data.id }, JWT_SECRET, { expiresIn: "1h" })

    res.status(201).json({
      message: "User registered successfully",
      data: data,
      token
    })
    return
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed", msg: error.message })
    return
  }
})

// Login route
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    // Find user in database
    const { data: users, error } = await supabase
      .from("exp_users")
      .select("*")
      .eq("username", username)
      .single()

    if (error || !users) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users

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
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed", msg: error })
    return
  }
})

app.listen(port, () => {})

export default app
