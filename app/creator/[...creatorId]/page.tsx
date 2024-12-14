// import StreamView from "@/app/components/StreamView"

// export default function Creator({
//   params:{
//     creatorId
//   }
// }:{
//   params:{
//     creatorId: string
//   }
// }){
//   return <div>
//     <StreamView creatorId={creatorId} playVideo={false}/>
//   </div>
// }
import StreamView from "@/app/components/StreamView";

export default async function Creator({
  params,
}: {
  params: Promise<{ creatorId: string }>;
}) {
  const { creatorId } = await params; // Resolve the Promise

  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}
