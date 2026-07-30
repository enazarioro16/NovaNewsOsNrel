export interface ShortVideoScript {
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
}

export interface SocialPost {
  content: string;
  hashtags: string[];
}

export interface ISocialProvider {
  publishVideoScript(script: ShortVideoScript, newsId: string): Promise<boolean>;
  publishText(post: SocialPost, newsId: string): Promise<boolean>;
}
