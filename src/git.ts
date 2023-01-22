import path from "path";
import fs from "fs";
import { workspace } from "vscode";

export function findRootGitDir(): string | null {
  const workspaces = workspace.workspaceFolders;
  if (!workspaces) {
    return null;
  }

  // use first one for now
  const [firstWorkspace] = workspaces;
  const gitPath = path.resolve(`${firstWorkspace.uri.fsPath}/.git`);

  return gitPath;
}

export function getCurrentBranch(): string | null {
  const gitDir = findRootGitDir();

  if (gitDir) {
    const ref = fs.readFileSync(path.join(gitDir, "HEAD"), "utf-8");
    const currentBranch = ref
      .replace("ref: refs/heads/", "")
      .replace(/(\r\n\t|\n|\r\t)/gm, "");

    return currentBranch;
  }

  return null;
}

export function getCurrentCommit(): string | null {
  const gitDir = findRootGitDir();

  if (gitDir) {
    const currentBranch = getCurrentBranch();
    if (!currentBranch) {
      throw new Error("Can't find a git branch");
    }

    const currentCommit = fs.readFileSync(
      path.join(gitDir, "refs", "heads", currentBranch),
      "utf-8"
    );

    return currentCommit.replace(/(\r\n\t|\n|\r\t)/gm, "");
  }

  return null;
}

export function getOwnerAndRepo(): {
  owner: string;
  repo: string;
} | null {
  const gitDir = findRootGitDir();
  if (!gitDir) {
    throw new Error("Can't find a git dir");
  }

  const configData = fs.readFileSync(path.join(gitDir, "config"), "utf8");
  const line = configData.match(
    /url = git@(?:github\.com:)([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/
  );

  if (!line) {
    return null;
  }

  const [owner, repo] = line.slice(1);

  return {
    owner,
    repo,
  };
}
