import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import ThreadCard from "@/components/cards/ThreadCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);
  console.log(userInfo.likes);
  return (
    <section className='relative'>
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={JSON.stringify(thread.author)}
          community={JSON.stringify(thread.community)}
          createdAt={thread.createdAt}
          comments={JSON.stringify(thread.children)}
          likesCount={thread.likesCount}
          userLikes = {userInfo.likes}
        />
      </div>

      <div className='mt-7'>
        <Comment
          threadId={params.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className='mt-10'>
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={JSON.stringify(childItem.author)}
            community={JSON.stringify(childItem.community)}
            createdAt={childItem.createdAt}
            comments={JSON.stringify(childItem.children)}
            isComment
            likesCount={childItem.likesCount}
            userLikes = {userInfo.likes}
          />
        ))}
      </div>
    </section>
  );
}

export default page;