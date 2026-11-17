import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // Check if Vercel Blob token is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`circus-tours/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      return NextResponse.json({ url: blob.url });
    }

    // Fallback: If running locally without BLOB token yet, we can convert to base64 data URL
    // so images display immediately during local testing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      warning: "Almacenado localmente en base64. En producción con Vercel Blob se usará la URL pública del CDN.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al subir imagen";
    console.error("Upload error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

