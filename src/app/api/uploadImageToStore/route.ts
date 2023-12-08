import { NextRequest, NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { getServerAuthSession } from "~/server/auth";
import { NextApiResponse } from "next";



export async function POST(req: NextRequest, res: NextApiResponse) {
  const session = await getServerAuthSession()
  if (session?.user.role != "seller") return new Response(JSON.stringify({ message: "" }), { status: 403 })
  const data = await req.formData()
  const { image, storeId } = Object.fromEntries(data.entries()) as { image: File, storeId: string };

  if (image == null || storeId == null) return new Response(JSON.stringify({ message: "Invalid Input" }), { status: 400 })
  const bytes = await image.arrayBuffer()
  const buffer = Buffer.from(bytes);
  const randomname = crypto.randomUUID();
  const fileName = `${randomname}.${image.type.split("image/")[1]}`; // Provide a suitable file name and extension
  const uploadDir = path.join(process.cwd(), `public/stores/${storeId}`); // Specify the directory for saving uploaded files

  // Create the uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const imageUrl = path.join(uploadDir, fileName);

  fs.writeFile(imageUrl, buffer, (err) => {
    if (err) {
      console.error(err);
      return new Response(JSON.stringify(err), { status: err.errno, statusText: err.code });
    }
  });

  return new Response(JSON.stringify({ imageName: `${fileName}` }), { status: 200 });

};

