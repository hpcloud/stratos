import { TestBed, inject } from '@angular/core/testing';

import { CfBuildpacksListConfigService } from './cf-buildpacks-list-config.service';

import {
  getBaseTestModules,
} from '../../../../../test-framework/cloud-foundry-endpoint-service.helper';
import { ActiveRouteCfOrgSpace } from '../../../../../features/cloud-foundry/cf-page.types';

describe('CfBuildpacksListConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CfBuildpacksListConfigService, ActiveRouteCfOrgSpace],
      imports: [...getBaseTestModules],
    });
  });

  it('should be created', inject([CfBuildpacksListConfigService], (service: CfBuildpacksListConfigService) => {
    expect(service).toBeTruthy();
  }));
});
