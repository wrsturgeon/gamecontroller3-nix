fn main() {
    use std::process::Command;
    let frontend = std::fs::canonicalize("../frontend")
        .expect("Couldn't canonicalize path `../frontend` from `game_controller_runtime`");
    let mut npm_pwd = Command::new("npm");
    let npm = npm_pwd.current_dir(frontend);
    npm.arg("ci")
        .output()
        .expect("Couldn't execute `npm ci` from `game_controller_runtime/../frontend`");
    npm.args(["run", "build"])
        .output()
        .expect("Couldn't execute `npm run build` from `game_controller_runtime/../frontend`");
}
