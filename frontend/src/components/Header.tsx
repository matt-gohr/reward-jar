import { Sparkles, Star } from "lucide-react";

import React from "react";

const Header: React.FC = (): JSX.Element => {
    return (
        <header className="bg-white shadow-lg border-b-4 border-primary-500">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                Reward Jar
                            </h1>
                            <p className="text-sm text-gray-600 font-medium">
                                Collect tokens, earn rewards!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
