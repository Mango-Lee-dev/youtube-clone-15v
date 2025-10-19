import Link from "next/link";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";

interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  console.log(comment);
  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.id}`}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
          <div className="flex flex-col">{comment.value}</div>
        </Link>
      </div>
    </div>
  );
};
