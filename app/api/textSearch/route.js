import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const apiKey = process.env.TWELVELABS_API_KEY;
    const indexId = process.env.TWELVELABS_INDEX_ID;

    if (!apiKey || !indexId) {
      return NextResponse.json(
        { error: "API key or Index ID is not set" },
        { status: 500 }
      );
    }

    const { textSearchQuery } = await request.json();

    const searchDataForm = new FormData();
    searchDataForm.append("search_options", "visual");
    searchDataForm.append("search_options", "conversation");
    searchDataForm.append("search_options", "text_in_video");
    searchDataForm.append("search_options", "logo");
    searchDataForm.append("index_id", indexId);
    searchDataForm.append("query_text", textSearchQuery);

    const url = "https://api.twelvelabs.io/v1.2/search-v2";

    const response = await axios.post(url, searchDataForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": `${apiKey}`,
      },
    });

    const responseData = response.data;

    if (!responseData) {
      return NextResponse.json(
        { error: "Error getting response from the API" },
        { status: 500 }
      );
    }

    // Return the search results as a JSON response
    return NextResponse.json({
      pageInfo: responseData.page_info || {},
      textSearchResults: responseData.data ,
    });
  } catch (error) {
    console.error("Error in POST handler:", error?.response?.data || error);
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || error.message;

    return NextResponse.json({ error: message }, { status });
  }
}
