import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  generateTestCfEndpointServiceProvider,
  getBaseTestModules,
} from '../../../../test-framework/cloud-foundry-endpoint-service.helper';
import { CloudFoundrySpaceServiceMock } from '../../../../test-framework/cloud-foundry-space.service.mock';
import { CloudFoundrySpaceService } from '../../services/cloud-foundry-space.service';
import { EditSpaceStepComponent } from './edit-space-step.component';
import { ActiveRouteCfOrgSpace } from '../../cf-page.types';

describe('EditSpaceStepComponent', () => {
  let component: EditSpaceStepComponent;
  let fixture: ComponentFixture<EditSpaceStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditSpaceStepComponent],
      imports: [...getBaseTestModules],
      providers: [
        { provide: CloudFoundrySpaceService, useClass: CloudFoundrySpaceServiceMock },
        generateTestCfEndpointServiceProvider(),
        ActiveRouteCfOrgSpace
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSpaceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
