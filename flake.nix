{
  description = "RoboCup SPL GameController";
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    naersk.url = "github:nix-community/naersk";
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };
  outputs = { flake-utils, naersk, nixpkgs, self, }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        nrsk = pkgs.callPackage naersk { };
        tauri-deps = with pkgs; [
          curl
          dbus
          glib
          gtk3
          librsvg
          libsoup
          openssl_3
          pkg-config
          webkitgtk
          wget
        ];
      in {
        packages.default = nrsk.buildPackage {
          CPATH = "${pkgs.libclang}/include";
          LIBCLANG_PATH = "${pkgs.libclang}/lib";
          RUST_BACKTRACE = "full";
          buildInputs = with pkgs; [ libclang ] ++ tauri-deps;
          src = ./.;
        };
        apps.default = {
          type = "app";
          program = "${self.packages.${system}.default}/GameController.jar.sh";
        };
      });
}
