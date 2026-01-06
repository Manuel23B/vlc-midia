
export enum TabType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PLAYLISTS = 'PLAYLISTS',
  BROWSE = 'BROWSE',
  MORE = 'MORE'
}

export interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  duration: string;
  thumbnail: string;
  url: string;
  type: 'video' | 'audio';
  description?: string;
  category?: string;
}

export interface AIRecommendation {
  reason: string;
  mediaId: string;
}
