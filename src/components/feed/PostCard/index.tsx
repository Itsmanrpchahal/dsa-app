import { useEffect } from "react";
import { PostType } from "../../../types";
import { SmallImagePost, TextPost } from "./posts";
import registerAction, {
    ActionType,
} from "../../../helpers/feed/misc/registerAction";
import { useUserState } from "../../../state/userState";
export interface PostCardProps {
    post: PostType;
    height: number;
    noTopPadding?: boolean;
}

export function PostCard({ post, height, noTopPadding }: PostCardProps) {
    if (
        !post?.values?.content_img_url ||
        post?.values?.content_img_url?.length < 3 ||
        typeof post?.values?.content_img_url === "undefined" ||
        typeof post?.values?.post_type === "undefined"
    ) {
        return null;
    }

    useEffect(() => {
        registerAction({
            action: ActionType.VIEW,
            postId: String(post?.id),
            uuid: useUserState.getState().userDetails.uuid!,
        });
    }, []);

    switch (post?.values?.post_type) {
        case "text":
            return (
                <TextPost
                    post={post}
                    height={height}
                    noTopPadding={noTopPadding ?? false}
                />
            );
        case "image-gif":
            return (
                <SmallImagePost
                    post={post}
                    height={height}
                    noTopPadding={noTopPadding ?? false}
                />
            );

        default:
            return null;
    }
}
