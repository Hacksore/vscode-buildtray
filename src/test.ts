import Firebase from "./firebase";

async function main() {
  console.log(await Firebase.getData());
}

main();