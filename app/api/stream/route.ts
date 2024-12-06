import { prismaClient } from "@/app/lib/db";
import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";


const CreatStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})
export async function POST (req:NextRequest){
    try {
        const data = CreatStreamSchema.parse(await req.json());
        const isYt = data.url.includes("youtube")
        prismaClient.stream.create({
            userId: data.creatorId,
            url: data.url
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