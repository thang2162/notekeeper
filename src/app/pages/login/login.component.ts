import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../components/loader/loader.service'
import { faLock, faCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  faLock = faLock;
  faCheck = faCheck;
  faEnvelope = faEnvelope;

  isActive: string = '';
  modalBody: string;
  modalTitle: string;
  email: string = null;
  password: string = null;

  validateEmail: string = '';
  validatePassword: string = '';

  disableSubmit: boolean = true;

  emailIsValid (email:string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  validateForm (field: string) {
    if (field === 'email') {
      if (this.emailIsValid(this.email)) {

        this.validateEmail = 'is-success';

        if (this.password !== '' && this.password !== null) {
          this.disableSubmit = false;
        } else {
          this.disableSubmit = true;
        }

      } else {
        this.validateEmail = 'is-danger';
        this.disableSubmit = true;
      }
    } else if (field === 'password') {
      if (this.password !== '' && this.password !== null) {

        this.validatePassword = 'is-success';

        if (this.emailIsValid(this.email)) {
          this.disableSubmit = false;
        } else {
          this.disableSubmit = true;
        }

      } else {
        this.validatePassword = 'is-danger';
        this.disableSubmit = true;
      }
    }
  }

  closeModal () {
    this.isActive = ''
  }

  toggleLoader (show: boolean) {
    this.loaderService.toggleLoader(show);
  }

  loginUser(): void {
    this.toggleLoader(true);
    this.accountService.loginUser(this.email, this.password)
      .subscribe(res => {
        this.toggleLoader(false);
        // alert(JSON.stringify(res))
        if (res.status === 'success') {
          this.email = '';
          this.password = '';
          this.router.navigateByUrl('/notebook');
        } else {
          this.modalTitle = 'Error';
          this.modalBody = res.msg;
          this.isActive = 'is-active';
        }
      });
  }

  constructor(private loaderService: LoaderService,
  private accountService: AccountService,
  private router: Router) { }
}
