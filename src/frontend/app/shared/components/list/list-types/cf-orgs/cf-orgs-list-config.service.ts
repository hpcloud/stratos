import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ListView } from '../../../../../store/actions/list.actions';
import { AppState } from '../../../../../store/app-state';
import { APIResource } from '../../../../../store/types/api.types';
import { IListConfig, ListViewTypes } from '../../list.component.types';
import { CfOrgCardComponent } from './cf-org-card/cf-org-card.component';
import { CfOrgsDataSourceService } from './cf-orgs-data-source.service';
import { CloudFoundryEndpointService } from '../../../../../features/cloud-foundry/services/cloud-foundry-endpoint.service';
import { ActiveRouteCfOrgSpace } from '../../../../../features/cloud-foundry/cf-page.types';

@Injectable()
export class CfOrgsListConfigService implements IListConfig<APIResource> {
  isLocal?: boolean;
  viewType = ListViewTypes.CARD_ONLY;
  enableTextFilter = false;
  tableFixedRowHeight?: boolean;
  dataSource: CfOrgsDataSourceService;
  pageSizeOptions = [9, 45, 90];
  cardComponent = CfOrgCardComponent;
  defaultView = 'cards' as ListView;
  getColumns = () => [];

  constructor(private store: Store<AppState>, private activeRouteCfOrgSpace: ActiveRouteCfOrgSpace) {
    this.dataSource = new CfOrgsDataSourceService(this.store, activeRouteCfOrgSpace.cfGuid, this);
  }

  getGlobalActions = () => [];
  getMultiActions = () => [];
  getSingleActions = () => [];
  getMultiFiltersConfigs = () => [];
  getDataSource = () => this.dataSource;
}
