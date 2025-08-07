import { Coins, Gift, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Reward, Token } from "./types";
import { rewardApi, tokenApi } from "./services/api";

import AddRewardModal from "./components/AddRewardModal";
import AddTokenModal from "./components/AddTokenModal";
import Header from "./components/Header";
import RewardMenu from "./components/RewardMenu";
import TokenJar from "./components/TokenJar";

function App(): JSX.Element {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"tokens" | "rewards">("tokens");
    const [showAddTokenModal, setShowAddTokenModal] = useState<boolean>(false);
    const [showAddRewardModal, setShowAddRewardModal] =
        useState<boolean>(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (): Promise<void> => {
        try {
            setLoading(true);
            const [tokensResponse, rewardsResponse] = await Promise.all([
                tokenApi.getAll(),
                rewardApi.getAll(),
            ]);

            if (tokensResponse.success && tokensResponse.data) {
                setTokens(tokensResponse.data);
            }

            if (rewardsResponse.success && rewardsResponse.data) {
                setRewards(rewardsResponse.data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToken = async (tokenData: {
        name: string;
        color: string;
        icon: string;
    }): Promise<void> => {
        try {
            const response = await tokenApi.create(tokenData);
            if (response.success && response.data) {
                setTokens((prev) => [...prev, response.data!]);
                setShowAddTokenModal(false);
            }
        } catch (error) {
            console.error("Error adding token:", error);
        }
    };

    const handleAddReward = async (rewardData: {
        name: string;
        description: string;
        tokenCost: number;
        tokenType: string;
    }): Promise<void> => {
        try {
            const response = await rewardApi.create(rewardData);
            if (response.success && response.data) {
                setRewards((prev) => [...prev, response.data!]);
                setShowAddRewardModal(false);
            }
        } catch (error) {
            console.error("Error adding reward:", error);
        }
    };

    const handleTokenUpdate = (updatedToken: Token): void => {
        setTokens((prev) =>
            prev.map((token) =>
                token.id === updatedToken.id ? updatedToken : token
            )
        );
    };

    const handleRewardToggle = async (rewardId: string): Promise<void> => {
        try {
            const response = await rewardApi.toggleActive(rewardId);
            if (response.success && response.data) {
                setRewards((prev) =>
                    prev.map((reward) =>
                        reward.id === rewardId ? response.data! : reward
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling reward:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-lg">
                        <button
                            onClick={() => setActiveTab("tokens")}
                            className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
                                activeTab === "tokens"
                                    ? "bg-primary-500 text-white shadow-md"
                                    : "text-gray-600 hover:text-primary-500"
                            }`}
                        >
                            <Coins className="w-5 h-5 mr-2" />
                            Token Jars
                        </button>
                        <button
                            onClick={() => setActiveTab("rewards")}
                            className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
                                activeTab === "rewards"
                                    ? "bg-primary-500 text-white shadow-md"
                                    : "text-gray-600 hover:text-primary-500"
                            }`}
                        >
                            <Gift className="w-5 h-5 mr-2" />
                            Rewards
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === "tokens" ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Your Token Jars
                            </h2>
                            <button
                                onClick={() => setShowAddTokenModal(true)}
                                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Jar
                            </button>
                        </div>
                        <TokenJar
                            tokens={tokens}
                            onTokenUpdate={handleTokenUpdate}
                        />
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Rewards Menu
                            </h2>
                            <button
                                onClick={() => setShowAddRewardModal(true)}
                                className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Reward
                            </button>
                        </div>
                        <RewardMenu
                            rewards={rewards}
                            tokens={tokens}
                            onRewardToggle={handleRewardToggle}
                            onTokenUpdate={handleTokenUpdate}
                        />
                    </div>
                )}
            </main>

            {/* Modals */}
            <AddTokenModal
                isOpen={showAddTokenModal}
                onClose={() => setShowAddTokenModal(false)}
                onAdd={handleAddToken}
            />

            <AddRewardModal
                isOpen={showAddRewardModal}
                onClose={() => setShowAddRewardModal(false)}
                onAdd={handleAddReward}
                tokens={tokens}
            />
        </div>
    );
}

export default App;
