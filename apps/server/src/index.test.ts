/**
 * Property of the Darwin Apolinario
 */
import request from "supertest"

import app from "./index"

describe("GET / ", () => {
  it("should return a 401 since no token", async () => {
    const response = await request(app).get("/")
    expect(response.statusCode).toBe(401)
  })

  it("should return a 403 with an invalid Bearer token", async () => {
    const validToken = "test_token"

    const response = await request(app).get("/").set("Authorization", `Bearer ${validToken}`)

    expect(response.statusCode).toBe(403)
  })
})
