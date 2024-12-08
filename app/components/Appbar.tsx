"use client"
import { Music } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"

import Link from "next/link";
export function Appbar(){
    const session = useSession();
    return <div>
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <Music className="mr-2" />
          FanTune
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="#features" className="hover:text-purple-400 transition">Features</Link>
          <Link href="#creators" className="hover:text-purple-400 transition">For Creators</Link>
          <Link href="#fans" className="hover:text-purple-400 transition">For Fans</Link>
        </nav>
        {
                    session.data?.user && <Button className="m-2 p-2 bg-blue-400" onClick={()=>signOut()}>Logout</Button>
                }
                {!session.data?.user && <Button className="m-2 p=2 bg-blue-400" onClick={()=> signIn
                    ()}>
                    Signin
                </Button>
}
      </header>
       
    </div>
}