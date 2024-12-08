import { prismaClient } from "@/app/lib/db";
import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server"
//@ts-ignore 
import youtubesearchapi from "youtube-search-api"
import { z } from "zod";
var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;



const CreatStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})
export async function POST (req:NextRequest){
    try {
        const data = CreatStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX)

        if(!isYt){
            return NextResponse.json({
                message: "Wrong url format"
            },{
                status:411
            })
        }
        const extractedId = data.url.split("?v=")[1];
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res.title);
        console.log(res.thumbnail.thumbnails)
        const thumbnails = res.thumbnail.thumbnails
        thumbnails.sort ((a:{width: number}, b:{width : number})=> a.width<b.width ? -1:1)

        const stream = await prismaClient.stream.create({
            data:{
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title:res.title ?? "can't find video",
                smallImg:(thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url: thumbnails[thumbnails.length-1].url) ?? "https://static.tnn.in/thumb/msid-101085979,thumbsize-49024,width-1280,height-720,resizemode-75/101085979.jpg",
                bigImg:thumbnails[thumbnails.length-1].url ?? "https://static.tnn.in/thumb/msid-101085979,thumbsize-49024,width-1280,height-720,resizemode-75/101085979.jpg"
            }
            
        })
        return NextResponse.json({
            message:"Added stream",
            id: stream.id
        })

    }
    catch(e){
        return NextResponse.json({
            message:' error ehile adding a stream'
        },{
            status: 411
        })
    }
}

export async function GET(req:NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.user.findMany({
        where:{
            // check it

            id: creatorId??""

        }
    })
    return NextResponse.json({
        streams
    })
    
}