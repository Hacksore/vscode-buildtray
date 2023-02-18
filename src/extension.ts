import * as vscode from "vscode";
import firebaseService from "./firebase";

// test a bar item
let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  myStatusBarItem.text = "$(sync~spin) CI";
  // myStatusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
  subscriptions.push(myStatusBarItem);

  // update status bar item once at start
  myStatusBarItem.show();

  getUserdata();
}

async function getUserdata() {    
  try {
    console.log("In get info...");
    console.log(await firebaseService.getData());
  } catch (err) {
    console.log("err get info...");
    console.log(err);
  }
}