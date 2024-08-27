import { test, expect } from "@playwright/test"

test.describe("poc example app  ", () => {
  test("should render the example app correctly", async ({ page }) => {
    await page.goto("http://localhost:6969/")

    // Check if the login page and its elements are defined
    await expect(page.getByTestId("poc-example")).toBeDefined()
    await expect(page.getByTestId("data-from-lib")).toHaveText("Hello, World! from @repo/lib")
    await expect(page.getByTestId("data-from-config")).toHaveText("poc from @repo/config")
  })
})
