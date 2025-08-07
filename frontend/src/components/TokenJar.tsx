import { Edit, Minus, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Token } from "../types";
import { tokenApi } from "../services/api";

interface TokenJarProps {
    tokens: Token[];
    onTokenUpdate: (token: Token) => void;
}

const TokenJar: React.FC<TokenJarProps> = ({
    tokens,
    onTokenUpdate,
}): JSX.Element => {
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showSpendModal, setShowSpendModal] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(1);
    const [description, setDescription] = useState<string>("");

    const handleAddTokens = async (): Promise<void> => {
        if (!selectedToken || amount <= 0) return;

        try {
            const response = await tokenApi.addTokens(
                selectedToken.id,
                amount,
                description
            );
            if (response.success && response.data) {
                onTokenUpdate(response.data);
                setShowAddModal(false);
                setAmount(1);
                setDescription("");
            }
        } catch (error) {
            console.error("Error adding tokens:", error);
        }
    };

    const handleSpendTokens = async (): Promise<void> => {
        if (!selectedToken || amount <= 0 || amount > selectedToken.count)
            return;

        try {
            const response = await tokenApi.spendTokens(
                selectedToken.id,
                amount,
                description
            );
            if (response.success && response.data) {
                onTokenUpdate(response.data);
                setShowSpendModal(false);
                setAmount(1);
                setDescription("");
            }
        } catch (error) {
            console.error("Error spending tokens:", error);
        }
    };

    const handleDeleteToken = async (tokenId: string): Promise<void> => {
        if (!confirm("Are you sure you want to delete this jar?")) return;

        try {
            const response = await tokenApi.delete(tokenId);
            if (response.success) {
                // Remove from local state
                window.location.reload(); // Simple refresh for now
            }
        } catch (error) {
            console.error("Error deleting token:", error);
        }
    };

    if (tokens.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Token Jars Yet
                </h3>
                <p className="text-gray-500">
                    Create your first token jar to start collecting rewards!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => (
                <div
                    key={token.id}
                    className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl"
                >
                    {/* Token Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: token.color }}
                            >
                                {token.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">
                                    {token.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Token Jar
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDeleteToken(token.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Token Count */}
                    <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-gray-800 mb-2">
                            {token.count}
                        </div>
                        <div className="text-sm text-gray-500">
                            tokens collected
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="h-3 rounded-full transition-all duration-500"
                                style={{
                                    backgroundColor: token.color,
                                    width: `${Math.min(
                                        (token.count / 10) * 100,
                                        100
                                    )}%`,
                                }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                            {token.count >= 10
                                ? "Full jar! 🎉"
                                : `${10 - token.count} more to fill`}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                setSelectedToken(token);
                                setShowAddModal(true);
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </button>
                        <button
                            onClick={() => {
                                setSelectedToken(token);
                                setShowSpendModal(true);
                            }}
                            disabled={token.count === 0}
                            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                            <Minus className="w-4 h-4 mr-1" />
                            Spend
                        </button>
                    </div>
                </div>
            ))}

            {/* Add Tokens Modal */}
            {showAddModal && selectedToken && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                        <h3 className="text-lg font-bold mb-4">
                            Add Tokens to {selectedToken.name}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of tokens
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(parseInt(e.target.value) || 1)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason (optional)
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="e.g., Good behavior, homework done"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTokens}
                                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                            >
                                Add Tokens
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Spend Tokens Modal */}
            {showSpendModal && selectedToken && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                        <h3 className="text-lg font-bold mb-4">
                            Spend Tokens from {selectedToken.name}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of tokens (max: {selectedToken.count}
                                    )
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedToken.count}
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(parseInt(e.target.value) || 1)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    What for? (optional)
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="e.g., TV time, candy"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowSpendModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSpendTokens}
                                disabled={amount > selectedToken.count}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Spend Tokens
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TokenJar;
