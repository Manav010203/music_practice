import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
     streamId : z.string(),
})

export async function POST (req: NextRequest){
    const session = await getServerSession();
   
    if (!session?.user) {
        return NextResponse.json(
          {
            message: "Unauthenticated",
          },
          {
            status: 403,
          },
        );
      }
      const user = session.user;
    try {
        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
          data: {
            //@ts-ignore
            userId: user.id,
            streamId: data.streamId,
          },
        });
        return NextResponse.json({
            message: "DOne!"
        })
    }
    catch(e){
        console.log(e)
        return NextResponse.json({
            message:"ERROR while upvoting"
        },{
            status:403
        })
    }

}