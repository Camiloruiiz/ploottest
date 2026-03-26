export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly detail?: unknown,
  ) {
    super(message);
  }
}

export function ok<T>(data: T) {
  return {
    ok: true as const,
    data,
  };
}

export function apiErrorResponse(error: ApiError) {
  return {
    ok: false as const,
    error: {
      code: error.code,
      message: error.message,
      detail: error.detail ?? null,
    },
  };
}
