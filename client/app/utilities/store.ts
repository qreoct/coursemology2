import { EntitySelection, EntityStore, SelectionKey } from 'types/store';

interface WithId {
  id: number;
}

/**
 * Creates and returns an empty entity store.
 * This method is meant to be used within the reducers.
 */
export function createEntityStore<M, E extends M = M>(): EntityStore<M, E> {
  return {
    ids: new Set(),
    byId: {},
  };
}

/**
 * Removes the entity with the given ID from the given entity store.
 * This method is meant to be used within the reducers.
 */
export function removeFromStore<M extends WithId, E extends M = M>(
  store: EntityStore<M, E>,
  id: number,
): void {
  store.ids.delete(id);
  delete store.byId[id];
}

/**
 * Saves the given (detailed) entity to the given entity store. If the given entity
 * already exists in the store, it will be merged with the existing entity.
 * This method is meant to be used within the reducers.
 */
export function saveEntityToStore<M extends WithId, E extends M = M>(
  store: EntityStore<M, E>,
  entity: E,
  isDetailed = true,
): void {
  const existing = store.byId[entity.id] || { lastFullUpdate: 0 };

  // delete all keys that are set to undefined, to avoid overriding existing values
  Object.keys(entity).forEach(
    (key) => (entity as any)[key] === undefined && delete (entity as any)[key],
  );

  store.ids.add(entity.id);
  store.byId[entity.id] = {
    ...existing,
    ...entity,
    lastUpdate: Date.now(),
    lastFullUpdate: isDetailed ? Date.now() : existing.lastFullUpdate,
  };
}

/**
 * Saves the given list of non-detailed entities to the given entity store. If any of the
 * entities already exist in the store, they will be merged with the existing entities.
 * This method is meant to be used within the reducers.
 */
export function saveListToStore<M extends WithId, E extends M = M>(
  store: EntityStore<M, E>,
  list: M[],
): void {
  list.forEach((entity) => saveEntityToStore(store, entity, false));
}

/**
 * Selects and returns the mini entity with the given ID from the given entity store.
 * This method is meant to be used within the selectors.
 */
export function selectMiniEntity<M, E extends M = M>(
  store: EntityStore<M, E>,
  id: SelectionKey,
): EntitySelection<M> {
  return (id != null && store.byId[id]) || null;
}

/**
 * Selects and returns the entity with the given ID from the given entity store.
 * This method is meant to be used within the selectors.
 */
export function selectEntity<M, E extends M = M>(
  store: EntityStore<M, E>,
  id: SelectionKey,
): EntitySelection<E> {
  const entity = id && store.byId[id];
  return entity && entity.lastFullUpdate > 0
    ? (entity as EntitySelection<E>)
    : null;
}

/**
 * Selects and returns multiple entities with the given IDs from the given entity store.
 * This method is meant to be used within the selectors.
 */
export function selectMiniEntities<M, E extends M = M>(
  store: EntityStore<M, E>,
  ids: Set<SelectionKey>,
): M[] {
  const result: M[] = [];
  ids.forEach((id) => {
    const entity = selectMiniEntity(store, id);
    if (entity) {
      result.push(entity);
    }
  });
  return result;
}
