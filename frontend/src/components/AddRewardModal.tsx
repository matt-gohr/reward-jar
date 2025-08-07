import React, { useState } from "react";

import { Token } from "../types";
import { X } from "lucide-react";

interface AddRewardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (rewardData: {
        name: string;
        description: string;
        tokenCost: number;
        tokenType: string;
    }) => Promise<void>;
    tokens: Token[];
}

const AddRewardModal: React.FC<AddRewardModalProps> = ({
    isOpen,
    onClose,
    onAdd,
    tokens,
}): JSX.Element => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tokenCost, setTokenCost] = useState<number>(1);
    const [tokenType, setTokenType] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!name.trim() || !tokenType || tokenCost <= 0) return;

        setIsSubmitting(true);
        try {
            await onAdd({
                name: name.trim(),
                description: description.trim(),
                tokenCost,
                tokenType,
            });
            setName("");
            setDescription("");
            setTokenCost(1);
            setTokenType("");
        } catch (error) {
            console.error("Error adding reward:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return <></>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Create New Reward
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Reward Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reward Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., 30 minutes of TV time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Watch your favorite show for 30 minutes"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 resize-none"
                        />
                    </div>

                    {/* Token Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Token Type
                        </label>
                        {tokens.length === 0 ? (
                            <div className="text-center py-4 bg-gray-50 rounded-md">
                                <p className="text-gray-500 text-sm">
                                    No token jars available
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Create a token jar first
                                </p>
                            </div>
                        ) : (
                            <select
                                value={tokenType}
                                onChange={(e) => setTokenType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                                required
                            >
                                <option value="">Select a token jar</option>
                                {tokens.map((token) => (
                                    <option key={token.id} value={token.id}>
                                        {token.name} ({token.icon})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Token Cost */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Token Cost
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={tokenCost}
                            onChange={(e) =>
                                setTokenCost(parseInt(e.target.value) || 1)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            required
                        />
                    </div>

                    {/* Preview */}
                    {tokenType && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preview
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                        Reward:
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {name || "Your Reward"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Cost:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-800">
                                            {tokenCost}
                                        </span>
                                        {tokens.find(
                                            (t) => t.id === tokenType
                                        ) && (
                                            <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{
                                                    backgroundColor:
                                                        tokens.find(
                                                            (t) =>
                                                                t.id ===
                                                                tokenType
                                                        )!.color,
                                                }}
                                            >
                                                {
                                                    tokens.find(
                                                        (t) =>
                                                            t.id === tokenType
                                                    )!.icon
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {description && (
                                    <div className="text-sm text-gray-600 mt-2">
                                        "{description}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                !name.trim() ||
                                !tokenType ||
                                tokenCost <= 0 ||
                                isSubmitting
                            }
                            className="flex-1 px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Creating..." : "Create Reward"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRewardModal;
