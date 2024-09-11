import { NextRequest, NextResponse } from "next/server";
import { TwelveLabs } from "twelvelabs-js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // Ensure environment variables are correctly loaded
    const apiKey = process.env.TWELVELABS_API_KEY;
    const indexId = process.env.TWELVELABS_INDEX_ID;

    // Check if API key or Index ID is missing
    if (!apiKey || !indexId) {
      return NextResponse.json(
        { error: "API key or Index ID is not set" },
        { status: 500 }
      );
    }

    // Initialize the TwelveLabs client
    const client = new TwelveLabs({ apiKey });

    // Parse the incoming request to get the queryText
    const { textSearchQuery } = await request.json();
    console.log("🚀 > POST > textSearchQuery=", textSearchQuery);

    // Check if textSearchQuery is missing in the request
    if (!textSearchQuery) {
      return NextResponse.json(
        { error: "Query text is missing in the request body" },
        { status: 400 }
      );
    }

    // Make the search query with provided options
    const response = await client.search.query({
      indexId: "663c310ae06d1c2c0212ce10", //TODO:
      queryText: textSearchQuery,
      options: ["conversation", "text_in_video", "visual", "logo"],
      operator: "or",
    });

    // Extract search results from the response
    const textSearchResults = response.data;

    // Check if search results are structured as expected
    if (!textSearchResults) {
      return NextResponse.json(
        { error: "Unexpected response structure from search query" },
        { status: 500 }
      );
    }

    console.log("🚀 > POST > { pageInfo, textSearchResults }=", {
      pageInfo: response.pageInfo || {},
      textSearchResults,
    });

    // Return the search results as a JSON response
    return NextResponse.json({
      pageInfo: response.pageInfo || {},
      textSearchResults,
    });
  } catch (error) {
    // Handle errors and log them appropriately
    console.error("Error in POST handler:", error?.response?.data || error);
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || error.message;

    // Return the error response
    return NextResponse.json({ error: message }, { status });
  }
}
