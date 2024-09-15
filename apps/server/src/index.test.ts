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

  it("should return a 200 with a valid Bearer token", async () => {
    const res = await request(app).post("/login").send({ username: "test", password: "test" })

    const token = JSON.parse(res.text).token

    const response = await request(app).get("/").set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
  })
})

describe("GET /verify ", () => {
  it("should return a 401 since no token", async () => {
    const response = await request(app).get("/verify")
    expect(response.statusCode).toBe(401)
  })

  it("should return a 403 with an invalid Bearer token", async () => {
    const validToken = "test_token"

    const response = await request(app).get("/verify").set("Authorization", `Bearer ${validToken}`)

    expect(response.statusCode).toBe(403)
  })

  it("should return a 200 with a valid Bearer token", async () => {
    const res = await request(app).post("/login").send({ username: "test", password: "test" })

    const token = JSON.parse(res.text).token

    const response = await request(app).get("/verify").set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
  })
})

describe("GET /api ", () => {
  const URL = "/api"
  it("should return a 401 since no token", async () => {
    const response = await request(app).get(URL)
    expect(response.statusCode).toBe(401)
  })

  it("should return a 403 with an invalid Bearer token", async () => {
    const validToken = "test_token"

    const response = await request(app).get(URL).set("Authorization", `Bearer ${validToken}`)

    expect(response.statusCode).toBe(403)
  })

  it("should return a 200 with a valid Bearer token", async () => {
    const res = await request(app).post("/login").send({ username: "test", password: "test" })

    const token = JSON.parse(res.text).token

    const response = await request(app).get(URL).set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
  })
})

describe("POST /login", () => {
  it("should return 200 for test user", async () => {
    const response = await request(app).post("/login").send({ username: "test", password: "test" })

    expect(response.statusCode).toBe(200)
  })

  it("should return 401 for invalid user", async () => {
    const response = await request(app).post("/login").send({ username: "xxx", password: "xxx" })

    expect(response.statusCode).toBe(401)
  })
})
