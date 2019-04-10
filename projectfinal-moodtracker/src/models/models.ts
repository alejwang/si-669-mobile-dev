export class Entry {
  id: any;
  timestamp: Date;
  location: string;
  locationId: string;
  text: string;
  mood: any;
  // image: string;
}

export class Mood {
  public constructor(public type: string,
                     public score: number,
                     public image: string,
                     public color: string,
                     public hover: string) {

  }
}

export class Location {
  public constructor(public name: string = "Finding...",
                     public address: string = "",
                     public lat: number = 0,
                     public lng: number = 0,
                     public countAll: number = 0,
                     public googleMapId: string = "",
                     public distanceToMe: number = 0) {
  }
}
