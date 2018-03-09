import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { CoreModule } from '../core/core.module';
import { EntityServiceFactory } from '../core/entity-service-factory.service';
import { CloudFoundryEndpointService } from '../features/cloud-foundry/services/cloud-foundry-endpoint.service';
import { CloudFoundrySpaceService } from '../features/cloud-foundry/services/cloud-foundry-space.service';
import { CloudFoundryService } from '../features/cloud-foundry/services/cloud-foundry.service';
import {
  ApplicationStateIconComponent,
} from '../shared/components/application-state/application-state-icon/application-state-icon.component';
import {
  ApplicationStateIconPipe,
} from '../shared/components/application-state/application-state-icon/application-state-icon.pipe';
import { CardStatusComponent } from '../shared/components/cards/card-status/card-status.component';
import { MetaCardComponent } from '../shared/components/list/list-cards/meta-card/meta-card-base/meta-card.component';
import {
  MetaCardItemComponent,
} from '../shared/components/list/list-cards/meta-card/meta-card-item/meta-card-item.component';
import { MetaCardKeyComponent } from '../shared/components/list/list-cards/meta-card/meta-card-key/meta-card-key.component';
import {
  MetaCardTitleComponent,
} from '../shared/components/list/list-cards/meta-card/meta-card-title/meta-card-title.component';
import {
  MetaCardValueComponent,
} from '../shared/components/list/list-cards/meta-card/meta-card-value/meta-card-value.component';
import { CfOrgsListConfigService } from '../shared/components/list/list-types/cf-orgs/cf-orgs-list-config.service';
import { CfOrgSpaceDataService } from '../shared/data-services/cf-org-space-service.service';
import { CfUserService } from '../shared/data-services/cf-user.service';
import { EntityMonitorFactory } from '../shared/monitors/entity-monitor.factory.service';
import { PaginationMonitorFactory } from '../shared/monitors/pagination-monitor.factory';
import { SharedModule } from '../shared/shared.module';
import { AppState } from '../store/app-state';
import { CloudFoundrySpaceServiceMock } from './cloud-foundry-space.service.mock';
import { createBasicStoreModule, testSCFGuid } from './store-test-helper';
import { ActiveRouteCfOrgSpace } from '../features/cloud-foundry/cf-page.types';

export const cfEndpointServiceProviderDeps = [
  EntityServiceFactory,
  CfOrgSpaceDataService,
  CfUserService,
  PaginationMonitorFactory,
  EntityMonitorFactory
];
class BaseCFMock {
  orgGuid: string;
  spaceGuid: string;
  cfGuid: string;
  constructor(public guid = '1234') {
    this.cfGuid = guid;
    this.spaceGuid = guid;
    this.orgGuid = guid;
  }
}
export function generateTestCfEndpointServiceProvider(guid = testSCFGuid) {
  return [
    {
      provide: ActiveRouteCfOrgSpace,
      useFactory: () => new BaseCFMock(guid)
    },
    CloudFoundryEndpointService
  ];
}

export function generateTestCfEndpointService() {
  return [
    ...cfEndpointServiceProviderDeps,
    generateTestCfEndpointServiceProvider()
  ];
}

export function generateTestCfUserServiceProvider(guid = testSCFGuid) {
  return {
    provide: CfUserService,
    useFactory: (
      store: Store<AppState>,
      paginationMonitorFactory: PaginationMonitorFactory
    ) => {
      const cfUserService = new CfUserService(store, paginationMonitorFactory, { cfGuid: guid, orgGuid: guid, spaceGuid: guid });
      return cfUserService;
    },
    deps: [Store, PaginationMonitorFactory]
  };
}

export function generateTestCfServiceProvider() {
  return {
    provide: CloudFoundryService,
    useFactory: (
      store: Store<AppState>,
      paginationMonitorFactory: PaginationMonitorFactory
    ) => {
      const appService = new CloudFoundryService(
        store,
        paginationMonitorFactory
      );
      return appService;
    },
    deps: [Store, PaginationMonitorFactory]
  };
}

export const getBaseTestModulesNoShared = [
  RouterTestingModule,
  CoreModule,
  createBasicStoreModule(),
  NoopAnimationsModule
];
export const getBaseTestModules = [...getBaseTestModulesNoShared, SharedModule];

export const getBaseProviders = [createBasicStoreModule()];

export const getCfSpaceServiceMock = {
  provide: CloudFoundrySpaceService,
  useClass: CloudFoundrySpaceServiceMock
};

export const getMetadataCardComponents = [MetaCardComponent, MetaCardItemComponent,
  MetaCardKeyComponent, ApplicationStateIconPipe, ApplicationStateIconComponent,
  MetaCardTitleComponent, CardStatusComponent, MetaCardValueComponent];
