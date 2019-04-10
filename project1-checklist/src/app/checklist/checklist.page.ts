import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { ChecklistDataService } from '../services/checklist-data.service';
import { Checklist } from '../../model/checklist';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {

  constructor(private dataService: ChecklistDataService, private route: ActivatedRoute, private router: Router, private location: Location) {
      this.route.params.subscribe((params) => {
          this.listId = params['id'];
      });
      this.dataService.getObservable().subscribe(() => {
          this.list = this.dataService.getListById(this.listId);
          this.listName = this.list.getName();
          this.todos = this.dataService.getTodosByListId(this.listId);
          this.hideCompleted = this.list.hideCompleted;
          this.sortBy = this.list.sortBy;
          let sortBy = this.sortBy;
          // console.log('sortBy in ngOnInit is ' + sortBy);
          this.todos = this.todos.sort(function(a, b) {
              switch(sortBy) {
                  case 'alpha': {
                      if (a.name < b.name) {
                          return -1;
                      } else {
                          return 1;
                      }
                      break;
                  }
                  case 'priority': {
                      if (a.priority > b.priority) {
                          return -1;
                      } else {
                          return 1;
                      }
                      break;
                  }
                  default: {
                      break;
                  }
              }
          });
          console.log('in ChecklistPage ngOnInit, todo updated ' + this.todos);
      });

  }

  public goBackHome(): void {
      for (var i = 0; i < this.router.config.length; i++) {
          var routePath:string = this.router.config[i].path;
          console.log('route : ' + routePath);
      }
      this.router.navigate(['/'], {replaceUrl:true});

      // this.location.reload();
      // this.location.back();
  }


  private list: Checklist;
  private listId: number;
  public listName: string;
  private todosOriginal: any[] = [];
  public todos: any[] = [];
  public hideCompleted: boolean ;
  public sortBy: string = 'id';
  public newTodoName = '';
  public currentEditing: number;
  public editingName: string;

  public ngOnInit() {
      this.list = this.dataService.getListById(this.listId);
      this.listName = this.list.getName();
      this.todosOriginal = this.dataService.getTodosByListId(this.listId);
      this.hideCompleted = this.list.hideCompleted;
      this.sortBy = this.list.sortBy;
      let sortBy = this.sortBy;
      console.log('sortBy in ngOnInit is ' + sortBy);
      this.todos = this.todosOriginal.sort(function(a, b) {
          switch(sortBy) {
              case 'alpha': {
                  if (a.name < b.name) {
                      return -1;
                  } else {
                      return 1;
                  }
                  break;
              }
              case 'priority': {
                  console.log(a.priority + ' ' + b.priority);
                  if (a.priority > b.priority) {
                      return -1;
                  } else {
                      return 1;
                  }
                  break;
              }
              default: {
                  break;
              }
          }
      });
      console.log('in ChecklistPage ngOnInit, todo updated ' + this.todos);
  }

  public sortTodosByAlpha() {
      this.sortBy = 'alpha'
      this.list.sortBy = 'alpha';
      this.dataService.saveData();
      this.ngOnInit();
  }

  public sortTodosByPriority() {
      this.sortBy = 'priority'
      this.list.sortBy = 'priority';
      this.dataService.saveData();
      this.ngOnInit();
  }

  public hideCompleteTodos() {
      console.log("hideCompleteTodos" + this.hideCompleted);
      this.list.hideCompleted = this.hideCompleted;
      this.dataService.saveData();
  }
  public createNewTodo() {
      this.dataService.createTodo(this.newTodoName, this.listId);
      this.dataService.saveData();
      // this.ngOnInit();
      // console.log("create new list" + this.newListName);
      this.newTodoName = '';
  }

  public editMode(todoId: number) {
      this.currentEditing = todoId;
      if (todoId > -1) {
          this.editingName = this.dataService.getTodoById(todoId).getTodoName();
      }
  }
  public saveChanges(todoId: number) {
      this.dataService.getTodoById(todoId).setTodoName(this.editingName);
      this.dataService.saveData();
      // this.ngOnInit();
      this.editMode(-1);
  }


  public deleteTodo(todoId: number) {
        console.log('calling deleteTodo with todoId as' + todoId);
        this.dataService.removeTodo(todoId, this.listId);
      this.dataService.saveData();
      // this.ngOnInit();
  }

  public getClassForCompleteMark(mark): string {
      if (mark === true) {
          return 'item-already-complete item-group item-group-ios hydrated';
      } else {
          return 'item-not-complete item-group item-group-ios hydrated' ;
      }
  }

  // public getEmojiForPriority(todoId) : string; {
  //     const emojiForPriority = {0: '🤨', 1: '😒', 2: '😩'};
  //     const priortity = this.dataService.getTodoById(todoId).getpriorityLevel();
  //     console.log('getEmojiForPriority' + priortity + emojiForPriority[priortity]);
  //     return emojiForPriority[priortity];
  // }

  public completeTodo(todoId) {
      this.dataService.setCompleteMark(todoId, this.listId);
      this.dataService.saveData();
      // this.ngOnInit();
  }

  public changePriority($event, todoId) {
      console.log('changePriority ' + $event.target.value + ' ' + todoId);
      this.dataService.getTodoById(todoId).setpriorityLevel($event.target.value);
      this.dataService.saveData();
      // this.ngOnInit();
  }
}
