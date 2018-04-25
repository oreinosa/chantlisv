import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Workplace } from '../../../shared/classes/workplace';
import { WorkplacesService } from '../../../admin/workplaces/workplaces.service';
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  user: Observable<User>;
  workplace: string;
  workplaces: Observable<Workplace[]>;
  constructor(
    private authService: AuthService,
    private workplacesService: WorkplacesService
  ) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.workplaces = this.workplacesService.getAll();
  }

  onUpdateWorkplace(workplace: string, user: User) {
    this.authService.updateWorkplace(workplace, user);
  }

}