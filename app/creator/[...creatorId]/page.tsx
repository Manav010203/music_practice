// import StreamView from "@/app/components/StreamView"

// export default function CreatorId ({
//     params:{
//         creatorId
//     }
// }:{
//     params:{
//         creatorId:string
//     }
// }){
//     return<div>
//         <StreamView creatorId={creatorId}/>
//     </div>

// }

// import StreamView from "@/app/components/StreamView";

// // Define your component props interface to ensure type safety
// interface CreatorIdProps {
//   params: {
//     creatorId: string;
//   };
// }

// // Your functional component with the correct type for params
// export default function CreatorId({
//   params: { creatorId },
// }: CreatorIdProps) {
//   return (
//     <div>
//       <StreamView creatorId={creatorId} />
//     </div>
//   );
// }

// import StreamView from "@/app/components/StreamView";

// // The page component should have the correct typing for params
// export default function CreatorId({
//   params,
// }: {
//   params: { creatorId: string };
// }) {
//   return (
//     <div>
//       <StreamView creatorId={params.creatorId} />
//     </div>
//   );
// }

// import { NextPage } from "next";
// import StreamView from "@/app/components/StreamView";

// // Here, NextPage automatically handles types for dynamic routes
// const CreatorId: NextPage<{ params: { creatorId: string } }> = ({ params }) => {
//   return (
//     <div>
//       <StreamView creatorId={params.creatorId} />
//     </div>
//   );
// };

// export default CreatorId;

// import { NextPage } from "next";
// import StreamView from "@/app/components/StreamView";

// // Explicit typing for dynamic params
// interface CreatorIdProps {
//   params: { creatorId: string };
// }

// const CreatorId: NextPage<CreatorIdProps> = ({ params }) => {
//   return (
//     <div>
//       <StreamView creatorId={params.creatorId} />
//     </div>
//   );
// };

// export default CreatorId;

import StreamView from "@/app/components/StreamView";

// Function-based typing without PageProps
export default function CreatorId({
  params,
}: {
  params: { creatorId: string };
}) {
  return (
    <div>
      <StreamView creatorId={params.creatorId} playVideo={false} />
    </div>
  );
}
