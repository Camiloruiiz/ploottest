import { render, screen } from "@testing-library/react";
import { HomeStatus } from "@/components/home-status";

describe("HomeStatus", () => {
  it("renders the platform checkpoints", () => {
    render(<HomeStatus />);

    expect(screen.getByText("PlootTest MVP Base")).toBeInTheDocument();
    expect(screen.getByText("Stack base")).toBeInTheDocument();
    expect(screen.getByText("Environment checkpoints")).toBeInTheDocument();
  });
});
