
/*
 * Copyright (c) Aista Ltd, 2021 - 2023 info@aista.com, all rights reserved.
 */

/**
 * Model for tree control.
 */
export class TreeNode {

  /**
   * File name only.
   */
  name: string;

  /**
   * Full path of file, including folder(s).
   */
  path: string;

  /**
   * if true, this is a folder.
   */
  isFolder: boolean;

  /**
   * Level from base.
   */
  level: number;

  /**
   * Children nodes.
   */
  children: TreeNode[];

  /**
   * If true, this is a system file.
   */
  systemFile: boolean;

  /**
   * Returns parent folder of TreeNode object.
   */
  static parentFolder(node: TreeNode) {
    let tmp = node.path;
    if (node.isFolder) {
      tmp = tmp.substring(0, node.path.length - 1);
    }
    return tmp.substring(0, tmp.lastIndexOf('/') + 1);
  }

  /**
   * Returns parent folder of path.
   */
  static parentFolderFromPath(path: string) {
    if (path.endsWith('/')) {
      path = path.substring(0, path.length - 1);
    }
    return path.substring(0, path.lastIndexOf('/') + 1);
  }
}
