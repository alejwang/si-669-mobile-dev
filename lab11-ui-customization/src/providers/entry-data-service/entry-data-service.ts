import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Entry } from '../../models/entry';

@Injectable()
export class EntryDataServiceProvider {

  private entries: Entry[] = [];
  private serviceObserver: Observer<Entry[]>;
  private clientObservable: Observable<Entry[]>;
  private nextID: number = 0;
  private reset: boolean = false;

  constructor(private storage: Storage ) { 
    this.loadFakeEntries();
    this.clientObservable = Observable.create(observerThatWasCreated => {
      this.serviceObserver = observerThatWasCreated;
    });
    if (!this.reset) {
      this.storage.get("myDiaryEntries").then(data => {
        if (data != undefined && data != null) {
          this.entries = JSON.parse(data);
          this.notifySubscribers();
        }
      }, err => {
        console.log(err);
      });
      this.storage.get("nextID").then(data => {
        if (data != undefined && data != null) {
          this.nextID = data;
          console.log("got nextID: ", this.nextID);
        }
      }, err => {
        console.log(err);
      })
    } else { // resetting all the data
      this.storage.clear().then(() => {
        this.loadFakeEntries();
        this.getUniqueID(); // force save of new uniqueID
        this.saveData(); // force save of fake entries
        this.notifySubscribers();
      }, err => {
        console.log(err);
      });
    }
  }

  public getObservable(): Observable<Entry[]> {
    return this.clientObservable;
  }

  private notifySubscribers(): void {
    this.serviceObserver.next(undefined);
  }

  public getEntries():Entry[] {
    let entriesClone = JSON.parse(JSON.stringify(this.entries));
    console.log("Someone got my entries! They got: ", entriesClone);
    return entriesClone;
  }

  public addEntry(entry:Entry) {
    entry.id = this.getUniqueID();
    //entry.timestamp = new Date();
    this.entries.push(entry);
    this.notifySubscribers();
    this.saveData();
  }

  private getUniqueID(): number {
    let uniqueID = this.nextID++;
    this.storage.set("nextID", this.nextID);
    return uniqueID;
  }

  public getEntryByID(id: number): Entry {
    for (let e of this.entries) {
      if (e.id === id) {
        let clone = JSON.parse(JSON.stringify(e));
        return clone;
      }
    }
    return undefined;
  }

  public updateEntry(id: number, newEntry: Entry): void {
    let entryToUpdate: Entry = this.findEntryByID(id); 
    entryToUpdate.title = newEntry.title;
    entryToUpdate.text = newEntry.text;
    entryToUpdate.timestamp = newEntry.timestamp;
    console.log("In service, updating entry: ", entryToUpdate);
    this.notifySubscribers();
    this.saveData();
  }

  public removeEntry(id: number): void {
    for (let i = 0; i < this.entries.length; i++) {
      let iID = this.entries[i].id;
      if (iID === id) {
        this.entries.splice(i, 1);
        break;
      }
    }
    this.notifySubscribers();
    this.saveData();
  }

  private findEntryByID(id: number): Entry {
    for (let e of this.entries) {
      if (e.id === id) {
         return e;
      }
    }
    return undefined;
  }

  private saveData(): void {
    let key = "myDiaryEntries";
    this.storage.set(key, JSON.stringify(this.entries));
  }

  private loadFakeEntries() {
    this.entries = [
      {
        id: this.getUniqueID(),
        title: "Latest Entry",
        text: "Today I went to my favorite class, SI 669. It was super great.",
        timestamp: new Date()
      },
      {
        id: this.getUniqueID(),
        title: "Earlier Entry",
        text: "I can't wait for Halloween! I'm going to eat so much candy!!!",
        timestamp: new Date()
      },
      {
        id: this.getUniqueID(),
        title: "First Entry",
        text: "OMG Project 1 was the absolute suck!",
        timestamp: new Date()
      }
    ];
  }
}
