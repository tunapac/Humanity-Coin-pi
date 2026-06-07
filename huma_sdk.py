import subprocess
import json
import os

class HumanledgerSDK:
    def __init__(self):
        self.version = "1.0.0-Sovereign"
        self.supply_cap = 700000000

    def sync_layer1(self):
        """Triggers the PQC global node handshake via your sync script"""
        print(f"📡 [SDK] Initializing Layer-1 Multi-Node Sync (Cap: {self.supply_cap} HUMA)...")
        result = subprocess.run(["python3", "global_sync_test.py"], capture_output=True, text=True)
        return result.stdout

    def process_referral(self, referrer_id, new_user_id):
        """Triggers the Atom marketplace reference settlement via huma_rewards"""
        print(f"🪙 [SDK] Relaying Reference Registration to Atom Protocol...")
        # Automatically updates state by calling our rewards logic
        result = subprocess.run(["python3", "huma_rewards.py"], capture_output=True, text=True)
        return result.stdout

    def check_telecom_registry(self):
        """Checks the local Humatelco data voucher infrastructure file"""
        print(f"📶 [SDK] Auditing local Humatelco voucher registry database...")
        if os.path.exists("huma_vouchers_registry.csv"):
            with open("huma_vouchers_registry.csv", "r") as file:
                lines = file.readlines()
                return f"Success: {len(lines)} localized mesh vouchers registered in database."
        else:
            return "Warning: huma_vouchers_registry.csv file not found in directory."

# --- SDK RUN DIAGNOSTIC (For the Architect) ---
if __name__ == "__main__":
    sdk = HumanledgerSDK()
    print(f"==========================================")
    print(f"🛠️ HUMANLEDGER NATIVE SDK ONLINE (v{sdk.version})")
    print(f"==========================================\n")
    
    # 1. Check current localized voucher registries
    voucher_status = sdk.check_telecom_registry()
    print(voucher_status)
    print("-" * 42)
    
    # 2. Trigger the underlying reference reward routine
    reward_output = sdk.process_referral("User_Pioneer_888", "User_New_Joiner")
    print(reward_output)
