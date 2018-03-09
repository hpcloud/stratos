import { Store } from '@ngrx/store';

import { IFeatureFlag } from '../../../../../core/cf-api.types';
import { FeatureFlagSchema, GetAllFeatureFlags } from '../../../../../store/actions/feature-flags.actions';
import { getPaginationKey } from '../../../../../store/actions/pagination.actions';
import { AppState } from '../../../../../store/app-state';
import { APIResource } from '../../../../../store/types/api.types';
import { ListDataSource } from '../../data-sources-controllers/list-data-source';
import { IListConfig } from '../../list.component.types';

export const FeatureFlagDescriptions = {
  user_org_creation: 'Any user can create an organization',
  private_domain_creation: ' An Org Manager can create private domains for that organization',
  app_bits_upload: 'Space Developers can upload app bits',
  app_scaling: 'Space Developers can perform scaling operations (i.e. change memory, disk, or instances)',
  route_creation: 'Space Developers can create routes in a space',
  service_instance_creation: 'Space Developers can create service instances in a space',
  diego_docker: 'Space Developers can push Docker apps',
  set_roles_by_username: 'Org Managers and Space Managers can add roles by username',
  unset_roles_by_username: 'Org Managers and Space Managers can remove roles by username',
  task_creation: 'Space Developers can create tasks on their application. This feature is under development',
  env_var_visibility: ' All users can view environment variables',
  space_scoped_private_broker_creation: 'Space Developers can create space-scoped private service brokers',
  space_developer_env_var_visibility:
    'Space Developers can view their v2 environment variables. Org Managers and Space Managers can view their v3 environment variables'
};
export class CfFeatureFlagsDataSource extends ListDataSource<APIResource<IFeatureFlag>> {
  constructor(store: Store<AppState>, endpointGuid: string, listConfig?: IListConfig<APIResource<IFeatureFlag>>) {
    const paginationKey = getPaginationKey('featureFlags', endpointGuid);
    const action = new GetAllFeatureFlags(endpointGuid, paginationKey);
    super({
      store,
      action,
      schema: FeatureFlagSchema,
      getRowUniqueId: (entity: APIResource<IFeatureFlag>) => {
        return entity.metadata ? entity.metadata.guid : null;
      },
      paginationKey,
      isLocal: true,
      transformEntities: [],
      listConfig
    });
  }
}
