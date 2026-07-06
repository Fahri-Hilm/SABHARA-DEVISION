import { describe, it, expect } from "vitest";

function sum(a: number, b: number): number {
  return a + b;
}

describe("vitest setup example", () => {
  it("adds two numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });

  it("jsdom environment is active", () => {
    expect(typeof window).toBe("object");
    expect(document.createElement).toBeDefined();
  });

  it("jest-dom matchers are available", () => {
    const div = document.createElement("div");
    div.textContent = "hello";
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent("hello");
    document.body.removeChild(div);
  });
});
