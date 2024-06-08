import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { User } from "../table_entities/user_entity";

@Injectable({
    providedIn:'root'
})
export class dataService {
    private userSubject = new Subject<User[]>();
    constructor(){}
    
    getNewUsers(): Observable<User[]> {
        return this.userSubject.asObservable();
    }

    fetchUsers(users: User[]): void { // отправляет массив пользователей в объект userSubject для всех подписчиков.
        this.userSubject.next(users);
    }
}