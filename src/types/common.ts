export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string | null;
}

export interface FeaturedImageNode {
  sourceUrl: string;
  altText?: string | null;
}

export interface FeaturedImage {
  node?: FeaturedImageNode | null;
}
