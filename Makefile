ifeq ($(shell uname -s),Darwin) # Mac
export NIX_INSTALLER_FLAGS:=--darwin-use-unencrypted-nix-store-volume
export NIX_BUILD_FLAGS:=--impure
export NIXPKGS_ALLOW_BROKEN=1
else # Mac
export NIX_INSTALL_FLAGS:=
endif # Mac

build: .nix-installed
	nix $@ $(NIX_BUILD_FLAGS)

run: .nix-installed
	nix $@ $(NIX_BUILD_FLAGS)

.nix-installed:
	@if nix --version; then \
		echo 'Nix already installed; proceeding...'; \
	else \
		curl -L https://nixos.org/nix/install > install-nix.sh \
		sh install-nix.sh $(NIX_INSTALLER_FLAGS) --daemon; \
	fi
	@if grep ~/.config/nix/nix.conf -e 'flakes'; then \
		echo 'Flakes already enabled; proceeding...'; \
	else \
		mkdir -p ~/.config/nix; \
		echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf; \
	fi
	@touch $@
