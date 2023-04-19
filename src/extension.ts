import * as vscode from "vscode";
import firebaseService from "./firebase";
import { IBuildInfo } from "./types";

// test a bar item
let myStatusBarItem: vscode.StatusBarItem;

export async function activate({ subscriptions }: vscode.ExtensionContext) {
  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  myStatusBarItem.text = "$(pass-filled) CI";
  // myStatusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
  subscriptions.push(myStatusBarItem);

  // update status bar item once at start
  myStatusBarItem.show();

  firebaseService.subscribeToRepo("Hacksore/test");

  firebaseService.on("build", (build: IBuildInfo) => {
    if (build.status === "queued") {
      myStatusBarItem.text="$(sync~spin) CI";
    }

    if (build.status === "completed" && build.conclusion === "failure") {
      myStatusBarItem.text="$(error) CI";
      myStatusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
    }

    if (build.status === "completed" && build.conclusion === "success") {
      myStatusBarItem.text="$(pass-filled) CI";
      myStatusBarItem.backgroundColor = new vscode.ThemeColor("default");
    }
  });

}
