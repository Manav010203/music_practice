import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    const user = session.user;

    // Parse and validate request body
    const data = UpvoteSchema.parse(await req.json());

    // Create the upvote
    await prismaClient.upvote.create({
      data: {
        userId: user.id, // Use user ID from the session
        streamId: data.streamId,
      },
    });

    return NextResponse.json({ message: "Done!" });
  } catch (e) {
    console.error("Error while upvoting:", e);
    return NextResponse.json(
      { message: "ERROR while upvoting",},
      { status: 500 } // Use a more appropriate status code for server errors
    );
  }
}
