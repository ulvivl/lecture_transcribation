export interface CommonOption {
  id: number;
  name: string;
}

export interface ApiError {
  code: string;
  message: string;
  meta?: {
    description: string;
  };
}

export interface FileType {
  /** relative path */
  path: string;
  /** file name */
  name: string;
  /** full url */
  url: string;
}

export interface CommonResponse<T> {
  data: T;
  meta: {};
  errors?: ApiError[];
}

export interface FileUpload {
  id: number;
  file: FormData;
}

export class FetchError extends Error {
  constructor(public message: string, public status: number, public code: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export interface Config {
  token?: string;
  data?: any;
  headers?: Record<string, string>;
  params?: any;
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  timeout?: number;
}
