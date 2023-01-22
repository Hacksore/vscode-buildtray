import * as vscode from "vscode";
import { getLatestBuildStatus } from "./github";

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
    const data = getLatestBuildStatus();

    console.log(data);
  }, 5000);
}
