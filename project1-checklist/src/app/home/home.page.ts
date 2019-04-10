import { Component } from '@angular/core';
import { ChecklistDataService } from '../services/checklist-data.service';
// import { Checklist, Todo} from '../../model/checklist';
// import { ChecklistManager, TodoManager } from '../../model/checklistManager';
import { Router } from '@angular/router';
// import { Location } from "@angular/common";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    public checklists: any[] = [];
    public sortByLists: string = 'descending';

    constructor(private dataService: ChecklistDataService, private router: Router) {
        this.dataService.getObservable().subscribe(() => {
            this.sortByLists = this.dataService.sortByLists;
            this.checklists = this.dataService.getChecklists();
            let sortByLists = this.sortByLists;
            this.checklists = this.checklists.sort(function(a, b) {
                switch (sortByLists) {
                    case 'descending': {
                        if (a.count_all - a.count_completed > b.count_all - b.count_completed) {
                            return -1;
                        } else {
                            return 1;
                        }
                        break;
                    }
                    case 'ascending': {
                        if (a.count_all - a.count_completed > b.count_all - b.count_completed) {
                            return 1;
                        } else {
                            return -1;
                        }
                        break;
                    }
                }
            });
            console.log("in HomePage constructor, checklist updated " + this.checklists);
        });
    }

    public ngOnInit() {
        this.dataService.getObservable().subscribe(() => {
            this.sortByLists = this.dataService.sortByLists;
            this.checklists = this.dataService.getChecklists();
            let sortByLists = this.sortByLists;
            this.checklists = this.checklists.sort(function(a, b) {
                switch (sortByLists) {
                    case 'descending': {
                        if (a.count_all - a.count_completed > b.count_all - b.count_completed) {
                            return -1;
                        } else {
                            return 1;
                        }
                        break;
                    }
                    case 'ascending': {
                        if (a.count_all - a.count_completed > b.count_all - b.count_completed) {
                            return 1;
                        } else {
                            return -1;
                        }
                        break;
                    }
                }
            });
            console.log("in HomePage constructor, checklist updated " + this.checklists);
        });
    }

    public goToChecklist(id: number): void {
        this.router.navigate(["checklist", id], {replaceUrl:true});
        // this.location.replaceState('checklist/' + id);
        // this.location.reload();
    }

    public newListName: string = "";
    public createNewList() {
        this.dataService.createList(this.newListName);
        this.dataService.saveData();
        this.checklists = this.dataService.getChecklists();
        // console.log("create new list" + this.newListName);
        this.newListName = "";
    }

    public deleteList(listId) {
        this.dataService.removeListById(listId);
        this.dataService.saveData();
        this.checklists = this.dataService.getChecklists();
    }

    public sortChange() {
        this.dataService.sortByLists = this.sortByLists;
        this.ngOnInit();
        this.dataService.saveData();
    }
}

