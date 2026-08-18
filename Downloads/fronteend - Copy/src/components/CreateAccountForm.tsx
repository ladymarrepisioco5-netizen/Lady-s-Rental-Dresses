import { useState } from "react";
import { createAccount } from "./api";

import CreateAccountForm from "../CreateAccountForm";

export function CreateAccountPage() {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Create Account</h2>
            <p className="text-slate-400 mb-6">
                Fill out the form below to register a new account in the system.
            </p>
            <CreateAccountForm />
        </div>
    );
}


export default function CreateAccountForm() {
    // State para sa form inputs
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [balance, setBalance] = useState(0);

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Payload object na ipapasa sa backend
        const payload = {
            accountNumber,
            accountName,
            balance
        };

        try {
            const result = await createAccount(payload);
            console.log("Account created:", result);
            alert("Account created successfully!");
        } catch (err) {
            console.error("Error creating account:", err);
            alert("Failed to create account.");
        }
    };

    // JSX form
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Account Holder Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Initial Deposit"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value))}
            />
            <button type="submit">Create Account</button>
        </form>
    );
}



