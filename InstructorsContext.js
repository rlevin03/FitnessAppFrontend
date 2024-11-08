import React, { useEffect, useState, createContext } from "react";
import axios from "axios";

// Create the context with default values
export const InstructorsContext = createContext({
  instructors: null,
  refreshInstructors: () => {},
  ready: false,
  error: null,
});

// Provider component to wrap your app or part of your app
export function InstructorsProvider({ children }) {
  const [instructors, setInstructors] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch instructors from the API
  const fetchInstructors = () => {
    setReady(false);
    axios
      .get("/users/instructors")
      .then(({ data }) => {
        setInstructors(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Failed to fetch instructors:", error);
        setError(error);
      })
      .finally(() => {
        setReady(true);
      });
  };

  // useEffect to fetch instructors on initial render
  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <InstructorsContext.Provider
      value={{
        instructors,
        refreshInstructors: fetchInstructors,
        ready,
        error,
      }}
    >
      {children}
    </InstructorsContext.Provider>
  );
}
