/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import jest-dom for additional matchers
import Home from "../app/page";

// Mocking child components
jest.mock("../components/SearchBar", () =>
  jest.fn(() => <div>SearchBar Component</div>)
);
jest.mock("../components/SearchResults", () =>
  jest.fn(() => <div>SearchResults Component</div>)
);
jest.mock("../components/Videos", () =>
  jest.fn(() => <div>Videos Component</div>)
);

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the SearchBar component", () => {
    render(<Home />);
    expect(screen.getByText("SearchBar Component")).toBeInTheDocument();
  });

  test("renders the Videos component by default", () => {
    render(<Home />);
    expect(screen.getByText("Videos Component")).toBeInTheDocument();
  });a
});
