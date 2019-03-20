/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module iModels */

/** Provide paging option for the queries.
 * @public
 */
export interface PageOptions {
  /** Zero base page number */
  start?: number;
  /** Number of rows per page */
  size?: number;
  /** load on main loop */
  stepsPerTick?: number;
}
/** Default option used when caller does not provide one */
export const kPagingDefaultOptions: PageOptions = { start: 0, size: 512, stepsPerTick: 20 };

/** @public */
export interface PageableECSql {
  /** Compute number of rows that would be returned by the ECSQL. */
  queryRowCount(ecsql: string, bindings?: any[] | object): Promise<number>;

  /** Execute a query agaisnt this ECDb */
  queryPage(ecsql: string, bindings?: any[] | object, options?: PageOptions): Promise<any[]>;

  /** Execute a pageable query. */
  query(ecsql: string, bindings?: any[] | object, options?: PageOptions): AsyncIterableIterator<any>;
}
