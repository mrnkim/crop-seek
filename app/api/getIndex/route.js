import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TWELVELABS_API_KEY;
  const indexId = process.env.TWELVELABS_INDEX_ID;
  const apiUrl = process.env.TWELVELABS_API_URL;

  if (!apiKey || !indexId || !apiUrl) {
    return NextResponse.json(
      {
        error:
          "Required environment variables are not set. Please check TWELVELABS_API_KEY, TWELVELABS_INDEX_ID, and TWELVELABS_API_URL",
      },
      { status: 500 }
    );
  }

  const url = `${apiUrl}/indexes/${indexId}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-key": `${apiKey}`,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const index = await response.json();

    return NextResponse.json(index);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error },
      { status: 500 }
    );
  }
}
