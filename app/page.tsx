import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Music, Users, Heart, Headphones} from 'lucide-react'
import Link from "next/link"
import { Appbar } from "./components/Appbar"
import { Redirect } from "./components/Redirect"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <Appbar/>
      <Redirect/>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Music Shaped by Fans, Played by Creators</h1>
        <p className="text-xl mb-8 text-gray-300">Experience a new era of music streaming where fans influence the playlist and creators perform live.</p>
        <Button className="bg-purple-600 text-white hover:bg-purple-700 text-lg px-8 py-3">
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose FanTune?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="w-12 h-12 text-purple-400" />}
              title="Fan-Driven Playlists"
              description="Fans vote on songs they want to hear, creating a truly interactive experience."
            />
            <FeatureCard 
              icon={<Heart className="w-12 h-12 text-purple-400" />}
              title="Support Your Favorite Artists"
              description="Directly support creators through tips, subscriptions, and merchandise."
            />
            <FeatureCard 
              icon={<Headphones className="w-12 h-12 text-purple-400" />}
              title="Live Performances"
              description="Enjoy live streams where artists play the songs you've chosen in real-time."
            />
          </div>
        </div>
      </section>

      {/* For Creators Section
      <section id="creators" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">For Creators</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Connect with Your Audience Like Never Before</h3>
            <p className="text-gray-300 mb-6">
              FanTune gives you the power to interact directly with your fans. Play the music they want to hear, 
              receive instant feedback, and build a loyal community around your art.
            </p>
            <ul className="space-y-2">
              <ListItem>Real-time song requests from fans</ListItem>
              <ListItem>Live streaming capabilities</ListItem>
              <ListItem>Direct monetization through tips and subscriptions</ListItem>
              <ListItem>Analytics to understand your audience better</ListItem>
            </ul>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg">
            <h4 className="text-xl font-semibold mb-4">Join as a Creator</h4>
            <form className="space-y-4">
              <Input type="text" placeholder="Artist/Band Name" className="bg-gray-600 border-gray-500" />
              <Input type="email" placeholder="Email Address" className="bg-gray-600 border-gray-500" />
              <Input type="password" placeholder="Password" className="bg-gray-600 border-gray-500" />
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Creator Account</Button>
            </form>
          </div>
        </div>
      </section>

      {/* For Fans Section */}
      {/* <section id="fans" className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">For Fans</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-semibold mb-4">Shape the Music You Love</h3>
              <p className="text-gray-300 mb-6">
                As a fan on FanTune, you have the power to influence what your favorite artists play. 
                Vote for songs, participate in live streams, and be part of a community that truly 
                appreciates music.
              </p>
              <ul className="space-y-2">
                <ListItem>Vote on songs for live performances</ListItem>
                <ListItem>Interact with creators in real-time</ListItem>
                <ListItem>Discover new artists based on your preferences</ListItem>
                <ListItem>Exclusive content from your favorite creators</ListItem>
              </ul>
            </div>
            <div className="order-1 md:order-2 bg-gray-700 p-8 rounded-lg">
              <h4 className="text-xl font-semibold mb-4">Join as a Fan</h4>
              <form className="space-y-4">
                <Input type="text" placeholder="Username" className="bg-gray-600 border-gray-500" />
                <Input type="email" placeholder="Email Address" className="bg-gray-600 border-gray-500" />
                <Input type="password" placeholder="Password" className="bg-gray-600 border-gray-500" />
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Fan Account</Button>
              </form>
            </div>
          </div>
        </div>
      </section> */} 

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Revolutionize Your Music Experience?</h2>
        <p className="text-xl mb-8 text-gray-300">Join FanTune today and be part of the future of music streaming.</p>
        <Button className="bg-purple-600 text-white hover:bg-purple-700 text-lg px-8 py-3">
          Get Started Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-2xl font-bold flex items-center">
                <Music className="mr-2" />
                FanTune
              </Link>
              <p className="text-sm text-gray-400 mt-2">© 2023 FanTune. All rights reserved.</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition">Privacy</Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
//@ts-expect-error: This function has a known issue
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

// function ListItem({ children }) {
//   return (
//     <li className="flex items-center">
//       <Star className="w-5 h-5 text-purple-400 mr-2" />
//       <span>{children}</span>
//     </li>
//   )
// }

