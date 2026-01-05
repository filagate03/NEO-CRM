'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
);

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar Skeleton */}
            <div className="fixed left-0 top-0 z-40 h-screen w-[280px] bg-white/90 border-r border-gray-200/50 p-4">
                <div className="flex items-center gap-3 mb-8">
                    <LoadingSkeleton className="w-11 h-11 rounded-2xl" />
                    <div className="flex-1">
                        <LoadingSkeleton className="w-24 h-5 mb-2" />
                        <LoadingSkeleton className="w-16 h-3" />
                    </div>
                </div>
                <div className="space-y-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <LoadingSkeleton key={i} className="w-full h-10 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-[280px]">
                {/* Header Skeleton */}
                <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <LoadingSkeleton className="w-96 h-10 rounded-lg" />
                    <div className="flex items-center gap-3">
                        <LoadingSkeleton className="w-10 h-10 rounded-lg" />
                        <LoadingSkeleton className="w-10 h-10 rounded-lg" />
                        <LoadingSkeleton className="w-10 h-10 rounded-full" />
                    </div>
                </div>

                {/* Content */}
                <main className="p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <LoadingSkeleton className="w-48 h-8 mb-2" />
                                <LoadingSkeleton className="w-32 h-5" />
                            </div>
                            <div className="flex gap-3">
                                <LoadingSkeleton className="w-28 h-10 rounded-xl" />
                                <LoadingSkeleton className="w-36 h-10 rounded-xl" />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <LoadingSkeleton key={i} className="w-24 h-9 rounded-lg" />
                            ))}
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <LoadingSkeleton className="w-24 h-4" />
                                        <LoadingSkeleton className="w-10 h-10 rounded-xl" />
                                    </div>
                                    <LoadingSkeleton className="w-32 h-8 mb-2" />
                                    <LoadingSkeleton className="w-20 h-4" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Chart Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
                                <LoadingSkeleton className="w-40 h-6 mb-2" />
                                <LoadingSkeleton className="w-28 h-4 mb-6" />
                                <LoadingSkeleton className="w-full h-[300px] rounded-xl" />
                            </div>
                            <div className="bg-white rounded-2xl p-5 shadow-sm">
                                <LoadingSkeleton className="w-32 h-6 mb-2" />
                                <LoadingSkeleton className="w-28 h-4 mb-6" />
                                <LoadingSkeleton className="w-full h-[300px] rounded-xl" />
                            </div>
                        </div>

                        {/* Bottom Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                                    <LoadingSkeleton className="w-32 h-6 mb-2" />
                                    <LoadingSkeleton className="w-24 h-4 mb-4" />
                                    <div className="space-y-3">
                                        {Array.from({ length: 4 }).map((_, j) => (
                                            <LoadingSkeleton key={j} className="w-full h-16 rounded-xl" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
