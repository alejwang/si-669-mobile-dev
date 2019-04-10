
export class Checklist {

    public constructor(private name: string,
                       private id: number,
                       private todos: number[] = [],
                       private count_all: number,
                       private count_completed: number,
                       public hideCompleted: boolean,
                       public sortBy: string) {
        // this.name = name;
        // this.id = id;
        // this.todos = todos;
        // console.log("creating new Checklist isntance");
    }

    public setName(newName: string): void {
        this.name = newName;
    }

    public getName(): string {
        return this.name;
    }

    public getId(): number {
        return this.id;
    }

    public getTodos(): number[] {
        return this.todos;
    }

    public addTodo(todoId): void {
        this.todos.push(todoId);
        this.counting(1, 0);
    }

    public removeTodo(todoId: number, completeMark: boolean) {
        if (this.todos.indexOf(todoId) != -1) {
            this.todos.splice(this.todos.indexOf(todoId), 1);
            if (completeMark) {
                this.counting(-1, -1);
            } else {
                this.counting(-1,0)
            }
        }
    }

    public counting(all: number, completed: number) {
        this.count_all += all;
        this.count_completed += completed;
    }
}

export class Todo {

    public constructor(private name: string,
                       private id: number,
                       private completeMark: boolean,
                       private priorityLevel: number) {
    }

    public setTodoName(newName: string): void {
        this.name = newName;
    }

    public getTodoName(): string {
        return this.name;
    }

    public getId(): number {
        return this.id;
    }

    public getTodoId(): number {
        return this.id;
    }

    public getCompleteMark(): boolean {
        return this.completeMark;
    }

    public setCompleteMark(): boolean {
        if (this.completeMark) {
            this.completeMark = false;
        } else {
            this.completeMark = true;
        }
        return this.completeMark;
    }

    public getpriorityLevel(): number {
        return this.priorityLevel;
    }

    public setpriorityLevel(level) {
        this.priorityLevel = level;
    }

}

