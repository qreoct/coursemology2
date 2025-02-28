import { produce } from 'immer';
import {
  AchievementCourseUserEntity,
  AchievementEntity,
  AchievementMiniEntity,
} from 'types/course/achievements';
import {
  createEntityStore,
  removeFromStore,
  saveEntityToStore,
  saveListToStore,
} from 'utilities/store';
import {
  SAVE_ACHIEVEMENT_LIST,
  SAVE_ACHIEVEMENT,
  DELETE_ACHIEVEMENT,
  SAVE_ACHIEVEMENT_COURSE_USERS,
  AchievementsState,
  AchievementsActionType,
} from './types';

const initialState: AchievementsState = {
  achievements: createEntityStore(),
  permissions: { canCreate: false, canManage: false, canReorder: false },
};

const reducer = produce(
  (draft: AchievementsState, action: AchievementsActionType) => {
    switch (action.type) {
      case SAVE_ACHIEVEMENT_LIST: {
        const achievementList = action.achievementList;
        const entityList: AchievementMiniEntity[] = achievementList.map(
          (data) => ({
            ...data,
          }),
        );
        saveListToStore(draft.achievements, entityList);
        draft.permissions = action.achievementPermissions;
        break;
      }
      case SAVE_ACHIEVEMENT: {
        const achievementData = action.achievement;
        const achievementEntity: AchievementEntity = { ...achievementData };
        saveEntityToStore(draft.achievements, achievementEntity);
        break;
      }
      case DELETE_ACHIEVEMENT: {
        const achievementId = action.id;
        if (draft.achievements.byId[achievementId]) {
          removeFromStore(draft.achievements, achievementId);
        }
        break;
      }
      case SAVE_ACHIEVEMENT_COURSE_USERS: {
        const achievementId = action.id;
        const achievementUsers = action.achievementCourseUsers;
        const achievementUsersEntity: AchievementCourseUserEntity[] =
          achievementUsers.map((data) => ({
            ...data,
          }));

        // @ts-ignore: ignore other existing AchievementEntity contents as they are already saved
        saveEntityToStore(draft.achievements, {
          id: achievementId,
          achievementUsers: achievementUsersEntity,
        });
        break;
      }
      default: {
        break;
      }
    }
  },
  initialState,
);

export default reducer;
