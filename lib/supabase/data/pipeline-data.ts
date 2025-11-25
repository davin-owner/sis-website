// this going to have the main pipeline functions for the client cards

import { PipelineColumn, ShopLeads } from "@/lib/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { fetchShopLeadData } from "./shop-leads-data";

/*
  CRUD 
  Create a client Card
  Edit Client Card Info
  Move Clinet Card between columns via the int order and update it in the db
  Delete the client card
*/

// edits the hardcoded columns and make them have the data
export function formatPipelineColumns(clients: ShopLeads[]): PipelineColumn[] {
  const columns: PipelineColumn[] = [
    { id: "leads", title: "Leads", clients: [] },
    { id: "consulting", title: "Consulting", clients: [] },
    { id: "apts-made", title: "Apts Made", clients: [] },
    { id: "inking", title: "Inking", clients: [] },
    { id: "follow-ups", title: "Follow Ups", clients: [] },
    { id: "completed", title: "Completed", clients: [] },
  ];

  // Step 2: Loop through all clients and distribute to columns
  for (const client of clients) {
    // Step 3: Find matching column by pipeline_stage
    const matchingColumn = columns.find(
      (col) => col.id === client.pipeline_stage
    );
    // Step 4: Push client to that column (or default to leads)
    if (matchingColumn) {
      // Push to matching column
      matchingColumn.clients.push(client);
    } else {
      // Default to leads column if stage doesn't match any column
      const leadsColumn = columns.find((col) => col.id === "leads");
      if (leadsColumn) {
        leadsColumn.clients.push(client);
      }
    }
  }

  // Step 5: Sort each column by sort_order ONCE after all clients are added
  // This is MUCH faster than sorting inside the loop (O(n) vs O(n²))
  for (const column of columns) {
    column.clients.sort((a, b) => a.sort_order - b.sort_order);
  }

  // Step 6: Return organized columns
  return columns;
}

// This is going to be a wrapper
export async function getPipelineData(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<PipelineColumn[]> {
  const clients = await fetchShopLeadData(shopId, userId, supabase);

  // 4. Return typed data
  return formatPipelineColumns(clients);
}

/*

  if shopid null send to dashboard and it will let them choose if they have other shops if no other shops go back to onboarding ** this logic should be the default for access too**
  if the db qurey fails send the error and retry and if it keeps failing we will have to see what the problem is ** it shouldnt fail unless no access or null**
  if the stage has no clients still show the column cause they need to see no one is there and they need to move clients there in the future 
  yes we want the fetch the whole thing cause that way we as the developer can debug behind the screen and ui and possible future for previous stage for roll back feature ** after mvp**
*/
