/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
 */

export const projectName = "poc from @repo/config"
// const host = 'http://10.11.153.40:8081';
//
// const host = "https://a7ef-209-141-3-90.ngrok-free.app"
const host = "http://localhost:8081"

const version = "v1"

export const api = {
  baseUrl: `${host}/ux40/branch`,
  timeout: 30000,
  endpoints: {
    BRANCH_OPENING_CLOSING_CONTROLLER: `/${version}/branch-opening-closing`,
    ACCOUNTS_CONTROLLER: `/${version}/accounts`
  }
}
