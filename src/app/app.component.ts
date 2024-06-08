import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './core/table_entities/api_response';
import { User } from './core/table_entities/user_entity';
import { dataService } from './core/data/data-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isOpen: boolean = false;
  callType: callTypes = callTypes.ADD;
  users: User[] = [];
  userToEdit: User | null = null;
  usersToDelete: User[] = [];
  constructor(private http: HttpClient, private service: dataService) {}

  ngOnInit(): void { //инициализация таблицы
    this.http
      .get<ApiResponse>('https://test-data.directorix.cloud/task1')
      .subscribe({
        next: (response: ApiResponse) => {
          this.users = response.users;
        },
        error: (error: any) => {
          console.log(error);
        },
      });

    this.service.getNewUsers().subscribe({
      next: (users: User[]) => {
        this.users = users; // Добавление нового пользователя в массив пользователей
      },
      error: (error: any) => {
        console.log(error);
      },
    });
    
  }

  onModalOpen() { //открытие формы для добавления пользователя
    this.isOpen = true;
    this.callType = callTypes.ADD
  }

  onEditModalOpen(user: User) { //открытие формы для редактирования пользователя
    this.isOpen = true;
    this.callType = callTypes.EDIT
    this.userToEdit = user;
  }

  onModalDelete(){
    this.isOpen = true;
    this.callType = callTypes.DELETE;
  }

  selectUser(user: User) { //ищем пользователя по индексу, в случае наличия в массиве удаляем(при повторном нажатии)
    if(this.usersToDelete?.includes(user)){
      let index = this.usersToDelete.findIndex(el => el === user);
      this.usersToDelete.slice(index, 1);
    } else {
      this.usersToDelete?.push(user);
    }
  }

  deleteUser() { //удаление пользователя
    if(this.usersToDelete){
      this.users = this.users.filter(user => !this.usersToDelete?.includes(user)); 
      this.service.fetchUsers(this.users);
      this.usersToDelete = [];
    }
  }
}

export enum callTypes  { //набор действий с формой(открыть для записи/редактирования/удаления)
  ADD,
  EDIT,
  DELETE,
}