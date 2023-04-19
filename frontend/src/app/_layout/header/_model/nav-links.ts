
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

import { SubMenu } from "./sub-menu";

export interface NavLinks {
  name: string,
  url: string,
  expandable: boolean,
  color?: string,
  submenu?: SubMenu[],
  isActive?: any,
  exact?: boolean,
}
