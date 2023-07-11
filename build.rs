fn main() {
    use std::process::Command;
    Command::new("pushd")
        .arg("frontend")
        .output()
        .expect("Couldn't execute `pushd frontend`");
    Command::new("npm")
        .arg("ci")
        .output()
        .expect("Couldn't execute `npm ci`");
    Command::new("npm")
        .args(["run", "build"])
        .output()
        .expect("Couldn't execute `npm ci`");
    Command::new("popd")
        .output()
        .expect("Couldn't execute `popd`");
}
