import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";


export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb", // Set a high limit for batches of images
    },
    responseLimit: "100mb", // Allow large ZIP responses
  },
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { images } = data;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    // Create a new ZIP file using JSZip
    const zip = new JSZip();

    // Process each image and add to ZIP
    for (const image of images) {
      try {
        // Extract the base64 data from the data URL
        const { originalName, convertedUrl, format } = image;
        const base64Data = convertedUrl.split(",")[1];

        if (!base64Data) {
          console.error("Invalid data URL format");
          continue;
        }

        // Convert base64 to binary data
        const binaryData = Buffer.from(base64Data, "base64");

        // Add file to ZIP with appropriate name
        const fileName = originalName.replace(".webp", `.${format}`);
        zip.file(fileName, binaryData);
      } catch (error) {
        console.error("Error processing image for ZIP:", error);
        // Continue with other images
      }
    }

    // Generate the ZIP file
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6, // Balanced between size and speed
      },
    });

    // Convert Buffer to ArrayBuffer which is a valid BodyInit type
    const arrayBuffer = zipBuffer.buffer.slice(
      zipBuffer.byteOffset,
      zipBuffer.byteOffset + zipBuffer.byteLength
    ) as ArrayBuffer; // Add type assertion here

    // Create response with appropriate headers
    const response = new NextResponse(arrayBuffer);

    // Set headers for file download
    response.headers.set("Content-Type", "application/zip");
    response.headers.set(
      "Content-Disposition",
      "attachment; filename=converted_images.zip"
    );

    return response;
  } catch (error) {
    console.error("Server error creating ZIP:", error);
    return NextResponse.json(
      { error: "Failed to create ZIP file" },
      { status: 500 }
    );
  }
}
