import DebugButtonClient from "./DebugButton.client";

// This will be the fetch handler for anything you want to debug that requires server-side logic
// For example, fetching data from Supabase or another database
// You can pass in a function as a prop to be called when the button is clicked
// The function should return a promise that resolves to the data you want to log
// Example usage: <DebugButtonServer label="Fetch Shop Data" dataFunction={getShopData} />

export default function DebugButtonServer(props: {
  label: string;
  dataFunction: () => Promise<unknown[]>;
}) {
  return <DebugButtonClient label={props.label} />;
}
