import { apiErrorResponse, ApiError, ok } from "@/lib/api/http";

describe("http helpers", () => {
  it("builds ok responses", () => {
    expect(ok({ ready: true })).toEqual({
      ok: true,
      data: { ready: true },
    });
  });

  it("builds structured error responses", () => {
    expect(apiErrorResponse(new ApiError("boom", "Failure", 400, { field: "email" }))).toEqual({
      ok: false,
      error: {
        code: "boom",
        message: "Failure",
        detail: { field: "email" },
      },
    });
  });
});
