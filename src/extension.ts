import * as vscode from "vscode";
// import { getLatestBuildStatus } from "./github.js";
import { getCurrentBranch, getCurrentCommit, getOwnerAndRepo } from "./git";
import { getBuildStatus } from "./github";

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  myStatusBarItem.text = "Testing ok";
  myStatusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
  subscriptions.push(myStatusBarItem);

  // update status bar item once at start
  myStatusBarItem.show();

  setInterval(async () => {
    const branch = getCurrentBranch();
    const commit = getCurrentCommit();
    const result = getOwnerAndRepo();
    // console.log({
    //   commit,
    //   branch,
    //   owner: result?.owner,
    //   repo: result?.repo
    // });

    if (!result || !commit) {
      console.log("can't find git data or commit hash");
      return;
    }

    const { owner, repo } = result;
    // get action data
    const repoData = await getBuildStatus({
      owner,
      repo,
      commit
    });

    
  }, 5000);
}
