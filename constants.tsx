
import { MediaItem } from './types';

export const VLC_ORANGE = '#ff8800';

export const MOCK_VIDEOS: MediaItem[] = [
  {
    id: 'v1',
    title: 'Cinematic Nature Escape',
    duration: '0:15',
    thumbnail: 'https://picsum.photos/seed/nature/400/225',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    type: 'video',
    category: 'Nature',
    description: 'A beautiful escape into the wild wilderness.'
  },
  {
    id: 'v2',
    title: 'Urban Time-lapse',
    duration: '0:10',
    thumbnail: 'https://picsum.photos/seed/city/400/225',
    url: 'https://www.w3schools.com/html/movie.mp4',
    type: 'video',
    category: 'Urban',
    description: 'Fast-paced city life captured in a stunning time-lapse.'
  },
  {
    id: 'v3',
    title: 'Ocean Depths Explorer',
    duration: '0:20',
    thumbnail: 'https://picsum.photos/seed/ocean/400/225',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    type: 'video',
    category: 'Nature'
  },
  {
    id: 'v4',
    title: 'Mountain Peaks',
    duration: '0:12',
    thumbnail: 'https://picsum.photos/seed/mountains/400/225',
    url: 'https://www.w3schools.com/html/movie.mp4',
    type: 'video',
    category: 'Adventure'
  }
];

export const MOCK_AUDIO: MediaItem[] = [
  {
    id: 'a1',
    title: 'Midnight Jazz',
    artist: 'Blue Note Trio',
    duration: '3:45',
    thumbnail: 'https://picsum.photos/seed/jazz/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    type: 'audio'
  },
  {
    id: 'a2',
    title: 'Summer Breeze',
    artist: 'Lofi Girl',
    duration: '4:20',
    thumbnail: 'https://picsum.photos/seed/lofi/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    type: 'audio'
  },
  {
    id: 'a3',
    title: 'Cyberpunk Pulse',
    artist: 'Neon Rider',
    duration: '2:58',
    thumbnail: 'https://picsum.photos/seed/synth/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    type: 'audio'
  }
];
