
import prisma from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Stream } from "stream";


export async function GET() {
    const session =await getServerSession();

    const user = await prisma.user.findFirst({
        where:{
            email: session?.user?.email ?? ""
        }
    });
    if(!user){
        return NextResponse.json({
            message:"Unauthenticated"
        },{
            status:403
        })
    }
    const mostUpvotedStream = await prisma.stream.findFirst({
        where:{
            userId:user.id
        },
        orderBy:{
            upvotes:{
                _count:'desc'
            }
        }
    })
    await Promise.all([prisma.currentStream.upsert({
        where:{
            userId: user.id
        },
        update:{
            streamId: mostUpvotedStream?.id
        },
        create:{
            userId: user.id,
            streamId:mostUpvotedStream?.id
        }
    }), prisma.stream.delete({
        where:{
            id: mostUpvotedStream?.id ?? "",
        }
    })])
    return NextResponse.json({
        Stream:mostUpvotedStream
    })
    
}