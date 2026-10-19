import { FeaturedImage, PageInfo } from './common';

export interface PostNode {
  databaseId: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  date: string;
  featuredImage?: FeaturedImage | null;
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
