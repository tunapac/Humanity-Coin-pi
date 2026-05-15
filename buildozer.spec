[app]
# --- Basic Project Info ---
title = Humanity Ledger
package.name = humaledger
package.domain = org.tunapac
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 0.1

# --- Requirements ---
# Added certifi and charset-normalizer for secure blockchain API calls
requirements = python3,kivy,android,pyjnius,requests,certifi,charset-normalizer

# --- Android Settings ---
orientation = portrait
fullscreen = 0
android.archs = arm64-v8a
android.allow_backup = True

# Target API 33 is required for modern Android/Play Store compatibility
android.api = 33
android.minapi = 21
android.ndk_api = 21

# --- Permissions ---
# Essential for network-based ledger projects
android.permissions = INTERNET, ACCESS_NETWORK_STATE

[buildozer]
log_level = 2
warn_on_root = 1

