import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // Set a high limit for large image files
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const format = formData.get("format") as string;
    const quality = parseInt(formData.get("quality") as string) || 90;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (format !== "jpeg" && format !== "png") {
      return NextResponse.json(
        { error: "Invalid format requested" },
        { status: 400 }
      );
    }

    const convertedImages = [];

    for (const file of files) {
      try {
        // Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Use sharp to convert the image
        const sharpImage = sharp(buffer);
        let outputBuffer;

        if (format === "jpeg") {
          outputBuffer = await sharpImage.jpeg({ quality }).toBuffer();
        } else {
          outputBuffer = await sharpImage.png().toBuffer();
        }

        // Create a data URL for the image
        const base64Image = Buffer.from(outputBuffer).toString("base64");
        const dataUrl = `data:image/${format};base64,${base64Image}`;

        convertedImages.push({
          id: uuidv4(),
          originalName: file.name,
          convertedUrl: dataUrl,
          format,
          size: outputBuffer.length,
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Continue processing other files even if one fails
      }
    }

    return NextResponse.json({ convertedImages });
  } catch (error) {
    console.error("Server error during conversion:", error);
    return NextResponse.json(
      { error: "Failed to convert images" },
      { status: 500 }
    );
  }
}
