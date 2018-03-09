import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map, take, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IOrganization } from '../../../../core/cf-api.types';
import { PaginationMonitorFactory } from '../../../../shared/monitors/pagination-monitor.factory';
import { OrganisationSchema, organisationSchemaKey } from '../../../../store/actions/action-types';
import { GetAllOrganisations, UpdateOrganization } from '../../../../store/actions/organisation.actions';
import { getPaginationKey } from '../../../../store/actions/pagination.actions';
import { RouterNav } from '../../../../store/actions/router.actions';
import { AppState } from '../../../../store/app-state';
import { getPaginationObservables } from '../../../../store/reducers/pagination-reducer/pagination-reducer.helper';
import { selectRequestInfo } from '../../../../store/selectors/api.selectors';
import { APIResource } from '../../../../store/types/api.types';
import { getActiveRouteCfOrgSpaceProvider } from '../../cf.helpers';
import { CloudFoundryOrganisationService } from '../../services/cloud-foundry-organisation.service';

const enum OrgStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended'
}
@Component({
  selector: 'app-edit-organization-step',
  templateUrl: './edit-organization-step.component.html',
  styleUrls: ['./edit-organization-step.component.scss'],
  providers: [
    getActiveRouteCfOrgSpaceProvider,
    CloudFoundryOrganisationService
  ]
})
export class EditOrganizationStepComponent implements OnInit, OnDestroy {

  submitSubscription: Subscription;
  fetchOrgsSub: Subscription;
  allOrgsInEndpoint: any;
  allOrgsInEndpoint$: Observable<any>;
  orgSubscription: Subscription;
  currentStatus: string;
  originalName: string;
  orgName: string;
  org$: Observable<IOrganization>;
  editOrgName: FormGroup;
  status: boolean;
  cfGuid: string;
  orgGuid: string;
  constructor(
    private store: Store<AppState>,
    private paginationMonitorFactory: PaginationMonitorFactory,
    private snackBar: MatSnackBar,
    private cfOrgService: CloudFoundryOrganisationService
  ) {
    this.orgGuid = cfOrgService.orgGuid;
    this.cfGuid = cfOrgService.cfGuid;
    this.status = false;
    this.editOrgName = new FormGroup({
      orgName: new FormControl('', this.nameTakenValidator())
      // toggleStatus: new FormControl(false),
    });
    this.org$ = this.cfOrgService.org$.pipe(
      map(o => o.entity.entity),
      take(1),
      tap(n => {
        this.orgName = n.name;
        this.originalName = n.name;
        this.status = n.status === OrgStatus.ACTIVE ? true : false;
        this.currentStatus = n.status;
      })
    );

    this.orgSubscription = this.org$.subscribe();
  }

  nameTakenValidator = (): ValidatorFn => {
    return (formField: AbstractControl): { [key: string]: any } => {
      const nameValid = this.validate(formField.value);
      return !nameValid ? { 'nameTaken': { value: formField.value } } : null;
    };
  }

  ngOnInit() {
    const paginationKey = getPaginationKey('cf-org', this.cfGuid);
    const action = new GetAllOrganisations(paginationKey, this.cfGuid);
    this.allOrgsInEndpoint$ = getPaginationObservables<APIResource>(
      {
        store: this.store,
        action,
        paginationMonitor: this.paginationMonitorFactory.create(
          action.paginationKey,
          OrganisationSchema
        )
      },
      true
    ).entities$.pipe(
      filter(o => !!o),
      map(o => o.map(org => org.entity.name)),
      tap((o) => this.allOrgsInEndpoint = o)
    );
    this.fetchOrgsSub = this.allOrgsInEndpoint$.subscribe();
  }

  validate = (value: string = null) => {
    if (this.allOrgsInEndpoint) {
      return this.allOrgsInEndpoint
        .filter(o => o !== this.originalName)
        .indexOf(value ? value : this.orgName) === -1;
    }
    return true;
  }

  submit = () => {
    this.store.dispatch(new UpdateOrganization(this.orgGuid, this.cfGuid, {
      name: this.orgName,
      status: this.status ? OrgStatus.ACTIVE : OrgStatus.SUSPENDED
    }));

    // Update action
    this.submitSubscription = this.store.select(selectRequestInfo(organisationSchemaKey, this.orgGuid)).pipe(
      filter(o => !!o && !o.updating[UpdateOrganization.UpdateExistingOrg].busy),
      map(o => {
        if (o.error) {
          this.displaySnackBar();
        } else {
          this.store.dispatch(
            new RouterNav({
              path: ['/cloud-foundry', this.cfGuid, 'organizations']
            })
          );
        }
      })
    ).subscribe();
    return Observable.of({ success: true });
  }

  displaySnackBar = () => this.snackBar.open(
    'Failed to update organization! Please try again or contact your organization manager!',
    'Dismiss'
  )

  ngOnDestroy(): void {
    this.fetchOrgsSub.unsubscribe();
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }
  }
}
