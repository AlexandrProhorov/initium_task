import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../table_entities/user_entity';
import { AppComponent, callTypes } from 'src/app/app.component';
import { dataService } from '../data/data-service';

@Component({
  selector: 'modal-view',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() callType: callTypes = callTypes.ADD;
  @Input() deleteCount: number | null = null;
  userForm: FormGroup = new FormGroup({});

  constructor(
    private app: AppComponent,
    private fb: FormBuilder,
    private service: dataService,
  ) {}
  formName = new FormControl('');

  ngOnInit(): void { //инициализация формы
    if (this.app.userToEdit) {
      this.userForm = this.fb.group({
        name: [this.app.userToEdit.name],
        surname: [this.app.userToEdit.surname],
        email: [this.app.userToEdit.email],
        phone: [this.app.userToEdit.phone],
      })
    } else {
      [
        this.userForm = this.fb.group({
          name: ['', [Validators.required, Validators.minLength(2)]],
          surname: ['', [Validators.required, Validators.minLength(2)]],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', [Validators.required, this.phoneValidator]],
        }),

      ];
    }
  }
  onSubmit() { //валидация формы, отправка Subject с обновленными данными
    if(this.userForm.valid){
      const user: User = {
        name: this.userForm.value.name,
        surname: this.userForm.value.surname,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
      };
      if(this.app.userToEdit){
        let index = this.app.users.findIndex(el=> el === this.app.userToEdit);
        this.app.users[index] = user;
      } else {
        this.app.users.push(user);
      }
      this.service.fetchUsers(this.app.users);
    
    this.onClose();
    }
  }

  phoneValidator(control: AbstractControl): {[key: string]: any} | null {
    const phonePattern = /^(8|\+7)\d{10}$/; // Паттерн для проверки номера телефона
    if (control.value && !phonePattern.test(control.value)) {
      return { 'invalidPhone': true };
    }
    return null;
  }

  onClose() { 
    this.app.isOpen = false;
    this.app.userToEdit = null;
    this.app.usersToDelete = [];
    this.userForm.reset();
  }

  deleteUsers() {
    this.app.deleteUser();
    this.onClose();
  }
}
