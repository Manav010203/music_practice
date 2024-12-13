

import prisma from "@/app/lib/db";
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
//@ts-expect-error: This function has a known issue
import youtubesearchapi from "youtube-search-api"
import {  z } from "zod";



const CreatStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string(),
})
export async function POST (req:NextRequest){
    try {
        const data = CreatStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);
        const videoId = data.url ? data.url.match(YT_REGEX)?.[1] : null;
        if (!isYt || !videoId) {
          return NextResponse.json(
            {
              message: "Invalid YouTube URL format",
            },
            {
              status: 400,
            },
          );
        }
        
        const res = await youtubesearchapi.GetVideoDetails(videoId);
    
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: { width: number }, b: { width: number }) =>
          a.width < b.width ? -1 : 1,
        );
        const stream = await prisma.stream.create({
            data: {
              userId: data.creatorId,

              url: data.url,
              extractedId: videoId,
              type: "Youtube",
              title: res.title ?? "Can't find video",
              smallImg:
                (thumbnails.length > 1
                  ? thumbnails[thumbnails.length - 2].url
                  : thumbnails[thumbnails.length - 1].url) ??
                "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
              bigImg:
                thumbnails[thumbnails.length - 1].url ??
                "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg"
            },
          });
        return NextResponse.json({
            ...stream,
            hasUpvoted:false,
            upvotes: 0
        })

    }
    catch(e){
        console.error(e)
        return NextResponse.json({
            message:' error while adding a stream'
        },{
            status: 411
        })
    }
}

export async function GET(req:NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const session = await getServerSession();
    const user =await prisma.user.findFirst({
      where:{
        email: session?.user?.email ??""
      }
    });
    if(!user){
      return NextResponse.json({
        message:"Unauthenticated",
      },{
        status: 403
      })
    }
    if(!creatorId){
        return NextResponse.json({
            message:"ERROR"
        },{
            status: 411
        })
    }
    const [streams,activeStream] =await Promise.all([await prisma.stream.findMany({
        where:{
            userId: creatorId,
            played:false
        },
        include:{
            _count:{
                select:{
                    upvotes:true
                },
            },
            upvotes:{
                where:{
                    userId:user.id
                }
            }
        }
       }),
       prisma.currentStream.findFirst({
        where:{
          userId: creatorId
        }
       })])
       return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
          ...rest,
          upvotes: _count.upvotes,
          haveUpvoted: rest.upvotes.length ? true : false,
        })),
      });
        
    
    
}