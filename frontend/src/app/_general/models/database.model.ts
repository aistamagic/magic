
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

// Application specific imports.
import { Table } from "../../models/table.model";

/**
 * Database class containing meta information about
 * a single database in a single database server instance.
 */
export class Database {

  /**
   * Name of database.
   */
  name: string;

  /**
   * List of all tables in database.
   */
  tables: Table[];
}
