import React from "react";
import DebugButtonClient from "./DebugButton.client";

// This will be the fetch handler for anything you want to debug that requires server-side logic
// For example, fetching data from Supabase or another database
// You can pass in a function as a prop to be called when the button is clicked
// The function should return a promise that resolves to the data you want to log
// Example usage: <DebugButtonServer label="Fetch Shop Data" dataFunction={getShopData} />

const handleClick = async (
  dataFunction: () => Promise<any[]>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setData: React.Dispatch<React.SetStateAction<any[] | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setLoading(true);
  setError(null);
  try {
    const data = await dataFunction();
    console.log("Debug Data:", data);
    setData(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    console.error("Debug Error:", errorMessage);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

export default function DebugButtonServer(props: {
  label: string;
  dataFunction: () => Promise<any[]>;
}) {
  return <DebugButtonClient label={props.label} />;
}
