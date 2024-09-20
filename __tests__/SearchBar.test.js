/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar Component", () => {
  const mockSetImgQuery = jest.fn();
  const mockSetImgName = jest.fn();
  const mockClearQueryAndResults = jest.fn();
  const mockHandleImgSubmit = jest.fn();
  const mockHandleTextSubmit = jest.fn();

  const defaultProps = {
    imgQuery: null,
    setImgQuery: mockSetImgQuery,
    imgName: "",
    setImgName: mockSetImgName,
    clearQueryAndResults: mockClearQueryAndResults,
    handleImgSubmit: mockHandleImgSubmit,
    handleTextSubmit: mockHandleTextSubmit,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the text input field when no image is selected", () => {
    render(<SearchBar {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText(
      "What are you looking for?"
    );
    expect(inputElement).toBeInTheDocument();
  });

  test("calls handleTextFormSubmit when the search icon button is clicked", () => {
    render(<SearchBar {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText(
      "What are you looking for?"
    );
    fireEvent.change(inputElement, { target: { value: "test search query" } });
    const searchButton = screen.getByRole("button", { name: /Search Icon/i });
    fireEvent.click(searchButton);
    expect(mockHandleTextSubmit).toHaveBeenCalledWith("test search query");
  });

  test("renders SearchByImageButtonAndModal component", () => {
    render(<SearchBar {...defaultProps} />);

    const searchByImageButton = screen.getByRole("button", {
      name: /search by image/i,
    });
    expect(searchByImageButton).toBeInTheDocument();
  });
});
