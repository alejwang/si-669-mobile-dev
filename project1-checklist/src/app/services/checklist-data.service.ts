import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs';
import { Checklist, Todo } from '../../model/checklist';
import { ChecklistManager, TodoManager } from '../../model/checklistManager';
// import {st} from '@angular/core/src/render3';

@Injectable({
    providedIn: 'root'
})

export class ChecklistDataService {
    private checklistManager: ChecklistManager;
    private todoManager: TodoManager;
    private checklistBundle: Object;
    private todoBundle: Object;
    private DATA_KEY: string = 'data';
    private theObservable: Observable<Object>;
    private theObserver: Observer<Object>;
    // public hideCompleted: boolean = false;
    public sortByLists: string = 'descending';

    constructor(public storage: Storage) {
        this.checklistManager = new ChecklistManager();
        this.todoManager = new TodoManager();
        this.storage.get(this.DATA_KEY).then(data => {
            this.checklistBundle = data['checklist'];
            console.log("Retrieved checklistBundle: " + this.checklistBundle);
            if(this.checklistBundle === null) {
                this.checklistManager.initFromBundle([]);
            } else {
                this.checklistManager.initFromBundle(this.checklistBundle);
            }
            this.checklistManager.nextListId = data['checklist-next-id'];
            this.todoBundle = data['todo'];
            console.log("Retrieved todoBundle: " + this.todoBundle);
            if(this.todoBundle === null) {
                this.todoManager.initFromBundle([]);
            } else {
                this.todoManager.initFromBundle(this.todoBundle);
            }
            this.todoManager.nextTodoId = data['todo-next-id'];
            // this.hideCompleted = data['hideCompleted'];
            this.sortByLists = data['sortByLists'];
            this.updateObservers();
        });
    }

    public getChecklists(): Checklist[] {
        return this.checklistManager.getChecklists();
    }
    public getTodos(): Todo[] {
        return this.todoManager.getTodos();
    }

    public getListById(id: number): Checklist {
        return this.checklistManager.getListById(id);
    }

    public getTodoById(id: number): Todo {
        return this.todoManager.getTodoById(id);
    }

    public getTodosByListId(listId: number): Todo[] {
        const todoIds = this.checklistManager.getListById(listId).getTodos();
        // console.log("in getTodosByListId, todoIds is" + todoIds);
        let todosByListId: Todo[] = [];
        for (let key in todoIds) {
            todosByListId.push(this.todoManager.getTodoById(todoIds[key]));
        }
        return todosByListId;
    }

    public createList(name: string): Checklist {
        console.log("hecklistManager.createList");
        return this.checklistManager.createList(name);
    }

    public removeListById(listId: number) {
        return this.checklistManager.removeListById(listId);
    }

    public createTodo(name: string, listId: number) {
        let todo = this.todoManager.createTodo(name);
        let todoId = todo.getTodoId();
        this.checklistManager.getListById(listId).addTodo(todoId);
    }

    public removeTodo(todoId: number, listId: number) {
        let todo = this.todoManager.getTodoById(todoId)
        this.todoManager.removeTodoById(todoId);
        this.checklistManager.getListById(listId).removeTodo(todoId, todo.getCompleteMark());
    }

    public setCompleteMark(todoId: number, listId: number) {
        let finishMark = this.todoManager.getTodoById(todoId).setCompleteMark()
        if (finishMark) {
            this.checklistManager.getListById(listId).counting(0, 1);
        } else {
            this.checklistManager.getListById(listId).counting(0, -1);
        }
    }
    public saveData(): void {
        this.checklistBundle = this.checklistManager.getChecklists();
        this.todoBundle = this.todoManager.getTodos();
        let dataArchieve = {
            'checklist': this.checklistBundle,
            'todo': this.todoBundle,
            'checklist-next-id': this.checklistManager.nextListId,
            'todo-next-id': this.todoManager.nextTodoId,
            'sortByLists': this.sortByLists
        };
        this.storage.set(this.DATA_KEY, dataArchieve);
        this.updateObservers();
        // console.log("Saved checklistBundle: " + this.checklistBundle);
        // console.log("Saved todoBundle: " + this.todoBundle);
        // console.log("Saved sortByForTodos: " + this.sortByForTodos);

    }

    // getChecklists(): Checklist[]{
    //     return this.storage.get('checklists');
    // }
    //
    // saveChecklists(data) {
    //     this.storage.set('checklists', data);
    // }
    //
    // getChecklistByName(name) {
    //     return this.storage.get('checklist-' + name);
    // }
    //
    // saveChecklistByName(name, data) {
    //     let cleanData = [];
    //     data.forEach((d) => {
    //         cleanData.push({
    //             name: d.name
    //         });
    //     });
    //     let cleanDataToJson = JSON.stringify(cleanData);
    //     this.storage.set('checklists'+ name, cleanDataToJson);
    // }

    public getObservable(): Observable<Object> {
        if (this.theObservable === undefined) {
            this.theObservable = Observable.create(observer =>
                this.theObserver = observer);
        }
        return this.theObservable;

    }

    private updateObservers() {
        if (this.theObserver) {
            this.theObserver.next(true);
        }
    }
}
