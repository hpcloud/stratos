import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpaceStepComponent } from './create-space-step.component';
import { getBaseTestModules } from '../../../../test-framework/cloud-foundry-endpoint-service.helper';

describe('CreateSpaceStepComponent', () => {
  let component: CreateSpaceStepComponent;
  let fixture: ComponentFixture<CreateSpaceStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSpaceStepComponent],
      imports: [...getBaseTestModules]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSpaceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});