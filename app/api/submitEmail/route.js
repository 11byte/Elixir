import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import Email from "../../models/Email";

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const email = await Email.create(body);
    return NextResponse.json({ success: true, data: email }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
