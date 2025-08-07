import { CheckCircle, Gift, Star, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Reward, Token } from "../types";

import { tokenApi } from "../services/api";

interface RewardMenuProps {
    rewards: Reward[];
    tokens: Token[];
    onRewardToggle: (rewardId: string) => Promise<void>;
    onTokenUpdate: (token: Token) => void;
}

const RewardMenu: React.FC<RewardMenuProps> = ({
    rewards,
    tokens,
    onRewardToggle,
    onTokenUpdate,
}): JSX.Element => {
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [showRedeemModal, setShowRedeemModal] = useState<boolean>(false);

    const handleRedeemReward = async (): Promise<void> => {
        if (!selectedReward) return;

        const token = tokens.find((t) => t.id === selectedReward.tokenType);
        if (!token) return;

        if (token.count < selectedReward.tokenCost) {
            alert("Not enough tokens to redeem this reward!");
            return;
        }

        try {
            const response = await tokenApi.spendTokens(
                selectedReward.tokenType,
                selectedReward.tokenCost,
                `Redeemed: ${selectedReward.name}`
            );

            if (response.success && response.data) {
                onTokenUpdate(response.data);
                setShowRedeemModal(false);
                setSelectedReward(null);
                alert(
                    `🎉 Congratulations! You redeemed "${selectedReward.name}"!`
                );
            }
        } catch (error) {
            console.error("Error redeeming reward:", error);
        }
    };

    const getTokenInfo = (tokenId: string): Token | undefined => {
        return tokens.find((t) => t.id === tokenId);
    };

    if (rewards.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Gift className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Rewards Yet
                </h3>
                <p className="text-gray-500">
                    Create some rewards to spend your tokens on!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
                const token = getTokenInfo(reward.tokenType);
                const canAfford = token
                    ? token.count >= reward.tokenCost
                    : false;

                return (
                    <div
                        key={reward.id}
                        className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                            reward.isActive
                                ? "border-green-200 hover:border-green-300"
                                : "border-gray-200 hover:border-gray-300 opacity-60"
                        }`}
                    >
                        {/* Reward Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center">
                                    <Gift className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">
                                        {reward.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {reward.description}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onRewardToggle(reward.id)}
                                className={`p-2 rounded-full transition-colors ${
                                    reward.isActive
                                        ? "text-green-500 hover:bg-green-50"
                                        : "text-gray-400 hover:bg-gray-50"
                                }`}
                            >
                                {reward.isActive ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <XCircle className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Token Cost */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Cost:
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-lg text-gray-800">
                                        {reward.tokenCost}
                                    </span>
                                    {token && (
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                            style={{
                                                backgroundColor: token.color,
                                            }}
                                        >
                                            {token.icon}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Token Availability */}
                            {token && (
                                <div className="mt-2 text-sm">
                                    <span className="text-gray-600">
                                        You have:{" "}
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            canAfford
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {token.count} {token.name} tokens
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Redeem Button */}
                        <button
                            onClick={() => {
                                setSelectedReward(reward);
                                setShowRedeemModal(true);
                            }}
                            disabled={!reward.isActive || !canAfford}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                                reward.isActive && canAfford
                                    ? "bg-secondary-500 hover:bg-secondary-600 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            <Star className="w-4 h-4" />
                            <span>
                                {!reward.isActive
                                    ? "Unavailable"
                                    : !canAfford
                                    ? "Not enough tokens"
                                    : "Redeem Reward"}
                            </span>
                        </button>
                    </div>
                );
            })}

            {/* Redeem Confirmation Modal */}
            {showRedeemModal && selectedReward && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Gift className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Redeem Reward!
                            </h3>
                            <p className="text-gray-600">
                                Are you sure you want to redeem "
                                {selectedReward.name}"?
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Cost:</span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-lg">
                                        {selectedReward.tokenCost}
                                    </span>
                                    {getTokenInfo(selectedReward.tokenType) && (
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                            style={{
                                                backgroundColor: getTokenInfo(
                                                    selectedReward.tokenType
                                                )!.color,
                                            }}
                                        >
                                            {
                                                getTokenInfo(
                                                    selectedReward.tokenType
                                                )!.icon
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRedeemReward}
                                className="flex-1 px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600"
                            >
                                Redeem Now!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RewardMenu;
