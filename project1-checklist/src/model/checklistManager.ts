import {Checklist, Todo} from './checklist';



export class ChecklistManager {

    public nextListId: number = 1;
    private checklists: Object = {};

    public constructor() { }

    public initFromBundle(list: Object /*Hero[]*/) {
        for (let i in list) {
            console.log("initFromBundle" + list[i]['name']);
            let name:string = list[i]['name'];
            let id: number = parseInt(list[i]['id']);
            let todos: number[] = list[i]['todos'].map((st) => parseInt(st));
            let count_all: number = parseInt(list[i]['count_all']);
            let count_completed: number = parseInt(list[i]['count_completed']);
            let hideCompleted: boolean = list[i]['hideCompleted'];
            let sortBy: string = list[i]['sortBy'];
            this.createListWithId(name, id, todos, count_all, count_completed, hideCompleted, sortBy);
        }
        console.log(this.getChecklists());
    }

    private createListWithId(listName: string, listId: number, listTodos: number[] = [], count_all: number, count_completed: number, hideCompleted, sortBy): Checklist {
        let checklist = new Checklist(listName, listId, listTodos, count_all, count_completed, hideCompleted, sortBy);
        this.checklists[listId] = checklist;
        return checklist;
    }

    public createList(name: string): Checklist {
        let checkListId = this.getNextListId();
        console.log("checkListId is" + checkListId);
        let checklist = new Checklist(name, checkListId, [], 0,0, false, 'id');
        this.checklists[checkListId] = checklist;
        return checklist;
    }

    private getNextListId(): number {
        return this.nextListId++;
    }

    public getListById(id: number): Checklist {
        return this.checklists[id];
    }

    public getChecklists(): Checklist[] {
        let checklists: Checklist[] = [];
        for (let key in this.checklists) {
            checklists.push(this.checklists[key]);
        }
        return checklists;
    }

    public removeList(list: Checklist) {
        delete this.checklists[list.getId()];
    }

    public removeListById(id: number) {
        delete this.checklists[id];
    }
}


export class TodoManager {

    public nextTodoId: number = 101;
    private todos: Object = {};

    public constructor() { }

    public initFromBundle(list: Object /*Hero[]*/) {
        for (let i in list) {
            let name:string = list[i]['name'];
            let id: number = parseInt(list[i]['id']);
            let completeMark:boolean = list[i]['completeMark'];
            let priorityLevel:number = parseInt(list[i]['priorityLevel']);
            this.createTodoWithId(name, id, completeMark, priorityLevel);
        }
        console.log(this.getTodos());
    }

    private createTodoWithId(name: string, id: number, completeMark: boolean, priorityLevel: number): Todo {
        let todo = new Todo(name, id, completeMark, priorityLevel);
        this.todos[id] = todo;
        return todo;
    }

    public createTodo(name: string): Todo {
        let todoId = this.getNextTodoId();
        let todo = new Todo(name, todoId, false, 0);
        this.todos[todoId] = todo;
        return todo;
    }

    private getNextTodoId(): number {
        return this.nextTodoId++;
    }

    public getTodoById(id: number): Todo {
        return this.todos[id];
    }


    // public getTodosByIds(ids: number[]): Todo[] {
    //     let todos = Todo[];
    //     for (let i in ids) {
    //         todos.push(this.getTodoById(ids[i]));
    //     }
    //     return todos;
    // }

    public getTodos(): Todo[] {
        let todos: Todo[] = [];
        for (let key in this.todos) {
            todos.push(this.todos[key]);
        }
        return todos;
    }

    public removeTodo(todo: Todo) {
        delete this.todos[todo.getId()];
    }

    public removeTodoById(id: number) {
        delete this.todos[id];
    }
}