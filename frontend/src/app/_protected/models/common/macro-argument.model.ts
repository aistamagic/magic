
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

/**
 * A single macro argument.
 */
export class MacroArgument {

  /**
   * Name of argument.
   */
  name: string;

  /**
   * Type of srgument, e.g. 'sql', 'string', 'int' etc.
   */
  type: string;

  /**
   * Description for argument.
   */
  description: string;

  /**
   * If true argument is mandatory.
   */
  mandatory: boolean;

  /**
   * Value of argument.
   */
  value?: any;

  /**
   * Default value of argument.
   */
  default?: any;
}
