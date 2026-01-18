
export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface Team {
  leader: string;
  members: TeamMember[];
  vehicles: string[];
}

export interface Target {
  id: string;
  name: string;
  suspectPhoto?: string; // base64
  locationPhoto?: string; // base64
  address: string;
  coordinates?: { lat: number; lng: number };
  description: string;
  team: Team;
}

export interface Operation {
  id: string;
  name: string;
  briefingLocation: string;
  briefingTime: string;
  date: string;
  targets: Target[];
}
