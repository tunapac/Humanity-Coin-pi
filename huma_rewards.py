def calculate_huma_reward(result, difficulty="Normal"):
    base_reward = 10.0
    if result == "WIN":
        multiplier = 1.5
        status = "FATALITY! Victory Achieved."
    else:
        multiplier = 0.5
        status = "DEFEAT! Try again, Pioneer."
    total_earned = base_reward * multiplier
    print(f"--- 🛡️ HUMANITY LEDGER SETTLEMENT ---")
    print(f"RESULT: {status}")
    print(f"REWARD: {total_earned} HUMA Coins")
    print(f"NETWORK: Huma-Blockchain Mainnet")
    print("-" * 36)

def process_reference_reward(referrer_id, new_user_id):
    # 1 Atom coin reference reward implementation
    atom_payout = 1.0
    print(f"\n--- 🪙 ATOM STABLECOIN PROTOCOL ---")
    print(f"EVENT: One-Time Reference Registered")
    print(f"REFERRER: {referrer_id} ◀─── NEW USER: {new_user_id}")
    print(f"PAYOUT: {atom_payout} ATOM Coin distributed")
    print(f"STATUS: Settled securely via Atom Marketplace")
    print("-" * 36)

# Execute both tests
calculate_huma_reward("WIN")
process_reference_reward("User_Pioneer_888", "User_New_Joiner")
