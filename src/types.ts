export interface Blip {
  id?: string;
  name: string;
  quadrant: 'Techniques' | 'Tools' | 'Platforms' | 'Languages & Frameworks';
  ring: 'Adopt' | 'Trial' | 'Assess' | 'Hold';
  description: string;
  owner: string;
}

export interface RadarData {
  blips: Blip[];
}