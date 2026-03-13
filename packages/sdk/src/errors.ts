export class WebhookError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public shouldRetry: boolean = false
  ) {
    super(message)
    this.name = 'WebhookError'
  }
}

export class AuthError extends WebhookError {
  constructor(message: string) {
    super(message, 401, false)
    this.name = 'AuthError'
  }
}

export class ValidationError extends WebhookError {
  constructor(message: string) {
    super(message, 400, false)
    this.name = 'ValidationError'
  }
}

export class ConfigError extends WebhookError {
  constructor(message: string) {
    super(message, 500, false)
    this.name = 'ConfigError'
  }
}
