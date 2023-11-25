import { Config } from "@shared/api/types"

export class APIClient {
  baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  protected async request(
    endpoint: string,
    { data, timeout = 10000, headers: customHeaders = {}, params, ...customConfig }: Config = {}
  ) {
    const endpointWithParams = `${endpoint}${params ? `?${new URLSearchParams(params)}` : ""}`

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    const config = {
      method: data ? "POST" : "GET",
      body: data
        ? typeof window !== "undefined" && data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
      headers: {
        ...(data &&
          !(typeof window !== "undefined" && data instanceof FormData) && {
            "Content-Type": "application/json"
          }),
        ...customHeaders
      },
      ...customConfig,
      signal: controller.signal
    }
    const response = await fetch(`${this.baseURL}${endpointWithParams}`, config).then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка запроса`)
      }
      return response.json()
    })

    clearTimeout(timer)

    return response
  }

  public async get(endpoint: string, config?: Omit<Config, "data">): Promise<Response> {
    return this.request(endpoint, { ...config, method: "GET" })
  }

  public async post(endpoint: string, config?: Config): Promise<Response> {
    return this.request(endpoint, { ...config, method: "POST" })
  }

  public async patch(endpoint: string, config?: Config): Promise<Response> {
    return this.request(endpoint, { ...config, method: "PATCH" })
  }

  public async put(endpoint: string, config?: Config): Promise<Response> {
    return this.request(endpoint, { ...config, method: "PUT" })
  }

  public async delete(endpoint: string, config?: Config): Promise<Response> {
    return this.request(endpoint, { ...config, method: "DELETE" })
  }
}

export const apiClient = new APIClient(`${process.env.API_BASE_URL}:8000/v1/`)
