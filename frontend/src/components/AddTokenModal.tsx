import React, { useState } from "react";

import { X } from "lucide-react";

interface AddTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (tokenData: {
        name: string;
        color: string;
        icon: string;
    }) => Promise<void>;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({
    isOpen,
    onClose,
    onAdd,
}): JSX.Element => {
    const [name, setName] = useState<string>("");
    const [color, setColor] = useState<string>("#3B82F6");
    const [icon, setIcon] = useState<string>("⭐");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const colorOptions = [
        { name: "Blue", value: "#3B82F6" },
        { name: "Green", value: "#10B981" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Orange", value: "#F59E0B" },
        { name: "Red", value: "#EF4444" },
        { name: "Yellow", value: "#EAB308" },
        { name: "Teal", value: "#14B8A6" },
    ];

    const iconOptions = [
        "⭐",
        "🌟",
        "💎",
        "🏆",
        "🎯",
        "🎪",
        "🎨",
        "🎭",
        "🎪",
        "🎯",
        "🎲",
        "🎮",
        "🎸",
        "🎹",
        "🎺",
        "🎻",
    ];

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await onAdd({ name: name.trim(), color, icon });
            setName("");
            setColor("#3B82F6");
            setIcon("⭐");
        } catch (error) {
            console.error("Error adding token:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Create New Token Jar
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Jar Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jar Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., TV Tokens, Candy Tokens"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jar Color
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {colorOptions.map((colorOption) => (
                                <button
                                    key={colorOption.value}
                                    type="button"
                                    onClick={() => setColor(colorOption.value)}
                                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                        color === colorOption.value
                                            ? "border-gray-800 scale-110"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    style={{
                                        backgroundColor: colorOption.value,
                                    }}
                                    title={colorOption.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jar Icon
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {iconOptions.map((iconOption) => (
                                <button
                                    key={iconOption}
                                    type="button"
                                    onClick={() => setIcon(iconOption)}
                                    className={`w-10 h-10 rounded-lg border-2 text-lg transition-all ${
                                        icon === iconOption
                                            ? "border-primary-500 bg-primary-50 scale-110"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                    {iconOption}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                        </label>
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: color }}
                            >
                                {icon}
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">
                                    {name || "Your Jar Name"}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Token Jar
                                </div>
                            </div>
                        </div>
                    </div>

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
                            disabled={!name.trim() || isSubmitting}
                            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Creating..." : "Create Jar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTokenModal;
