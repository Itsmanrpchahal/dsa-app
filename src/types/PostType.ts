export type PostType = {
    id: string;
    values: {
        created_at: string;
        title: string | null;
        eli5_explanation: string | null;
        background_img_url?: string | null;
        content_img_url?: string | null;
        post_type?: string | null;
    } & Record<string, any>;
} & Record<string, any>;
