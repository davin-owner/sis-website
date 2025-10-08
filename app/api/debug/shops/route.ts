/**
 * API ROUTE: /api/debug/shops
 *
 * This is a Next.js API Route Handler (REST endpoint)
 *
 * HOW IT WORKS:
 * 1. Browser calls: fetch('/api/debug/shops')
 * 2. Next.js routes the request to this file
 * 3. The GET function below runs on the SERVER
 * 4. It calls getShopData() which queries Supabase
 * 5. Returns JSON response back to the browser
 *
 * FILE NAMING: This file MUST be named route.ts (Next.js convention)
 * URL PATH: /app/api/debug/shops/route.ts → /api/debug/shops
 */

import { getShopData } from "@/lib/supabase/shop-data";

/**
 * GET Handler - Handles GET requests to /api/debug/shops
 *
 * @returns {Response} JSON response with shop data or error
 */
export async function GET() {
  try {
    // Call our database function (runs on server, not in browser)
    const result = await getShopData();
    
    // Log to SERVER console (you'll see this in your terminal, not browser)
    console.log("API: Fetched shops:", result);

    // Return successful JSON response
    // Response.json() is a Next.js helper that:
    // 1. Converts result to JSON
    // 2. Sets Content-Type: application/json header
    // 3. Returns 200 status code
    return Response.json(result, { status: 200 });

  } catch (error) {
    // Something went wrong - log it
    console.error("API Error:", error);

    // Return error response to browser
    // Status 500 = Internal Server Error
    return Response.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}

/**
 * FUTURE: You can add more handlers here:
 *
 * export async function POST(request) {
 *   const body = await request.json();
 *   // Create new shop...
 * }
 *
 * export async function DELETE(request) {
 *   // Delete a shop...
 * }
 */
