import React from "react";
import { render, screen } from "@testing-library/react";
import { useUsersQuery } from "../useInfiniteQuery";
import App from "../App";
import { responseForPage0 } from "../fixtures";

// Make TypeScript Happy, by resolving TS errors
const mockedUseUsersQuery = useUsersQuery as jest.Mock<any>;

// Mock the hook module
jest.mock("../useInfiniteQuery");

describe("<App />", () => {
  beforeEach(() => {
    mockedUseUsersQuery.mockImplementation(() => ({ isLoading: true }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Renders without crashing", () => {
    render(<App />);
  });

  it("Displays loading message", () => {
    mockedUseUsersQuery.mockImplementation(() => ({
      status: 'loading',
    }));
    render(<App />);
    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument()
  });

  it("Displays error message", () => {
    mockedUseUsersQuery.mockImplementation(() => ({
      status: 'error',
      error: {
        message: 'An error occured!'
      }
    }));
    render(<App />);
    expect(screen.getByText(/An error occured!/i)).toBeInTheDocument()
  });

  it("Displays no data found message", () => {
    mockedUseUsersQuery.mockImplementation(() => ({
      status: 'loaded',
      data: undefined
    }));
    render(<App />);
    expect(screen.getByText(/No users data found!/i)).toBeInTheDocument()
  });

  it("Displays the users list", () => {
    mockedUseUsersQuery.mockImplementation(() => ({
      status: 'success',
      data: {
        pages: [{ results: responseForPage0.data, next: 1 }]
      }
    }));
    render(<App />);
    expect(screen.getByText(`${responseForPage0.data[0].firstName} ${responseForPage0.data[0].lastName}`)).toBeInTheDocument()
  });
});