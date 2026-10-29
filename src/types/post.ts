import { FeaturedImage, PageInfo } from './common';

export interface PostCategoryNode {
  id: string;
  name: string;
  slug: string;
}

export interface PostNode {
  databaseId: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  date: string;
  featuredImage?: FeaturedImage | null;
  categories?: {
    nodes: PostCategoryNode[];
  } | null;
}

export interface PostsConnection {
  pageInfo: PageInfo;
  nodes: PostNode[];
}

export interface GetNewsListResponse {
  posts: PostsConnection;
}

export interface GetNewsListVariables {
  first?: number;
  after?: string | null;
}

export interface GetPostDetailResponse {
  post: PostNode | null;
}
