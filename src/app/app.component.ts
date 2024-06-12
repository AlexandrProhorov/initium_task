import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './core/table_entities/api_response';
import { User } from './core/table_entities/user_entity';
import { dataService } from './core/data/data-service';
import { callTypes } from './core/table_entities/call_types';

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
  filteredUsers: User[] | null = null;
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
    if(this.usersToDelete.length > 0){
      this.isOpen = true;
      this.callType = callTypes.DELETE;
    }
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
      for (let user of this.usersToDelete) {
        let index = this.users.findIndex(u => u === user);
        if (index !== -1) {
          this.users.splice(index, 1);
        }
        if(this.filteredUsers){
          index = this.filteredUsers?.findIndex(u => u === user);
          if (index !== -1) {
            this.filteredUsers.splice(index, 1);
          }
          index = this.users.findIndex(val => val === user)
          if (index !== -1) {
            this.users.splice(index, 1);
          }
        }
      }
      this.service.fetchUsers(this.users);
      this.usersToDelete = [];
    }
  }

  filterUsers(filter: string) { //фильтрация всех атрибутов пользователя(имя, фамилия, почта, номер) по заданному фильтру
    this.filteredUsers = this.users.filter(user => {
      return user.name.toLowerCase().includes(filter.toLowerCase()) ||
             user.surname.toLowerCase().includes(filter.toLowerCase()) ||
             user.email.toLowerCase().includes(filter.toLowerCase()) ||
             user.phone.includes(filter);
    }) || [];
  }
}