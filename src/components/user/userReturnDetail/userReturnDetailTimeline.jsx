// =============================================================================
// FILE: userReturnDetailTimeline.jsx
// =============================================================================
import React from 'react';
import { CheckCircle, Circle } from 'react-feather';

const UserReturnDetailTimeline = ({ timeline = [] }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">روند مرجوعی</h3>
        <div className="space-y-0">
            {timeline.map((step, idx) => (
                <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Line */}
                    {idx < timeline.length - 1 && (
                        <div className={`absolute right-[15px] top-8 bottom-0 w-0.5 ${step.done ? 'bg-[#002874] dark:bg-[#4C6FB6]' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    )}
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                        {step.done ? (
                            <CheckCircle size={16} className="text-[#002874] dark:text-[#4C6FB6]" />
                        ) : (
                            <Circle size={16} className="text-gray-300 dark:text-gray-600" />
                        )}
                    </div>
                    {/* Content */}
                    <div>
                        <p className={`text-sm font-medium ${step.done ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-500 dark:text-gray-400'}`}>
                            {step.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{step.date}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default UserReturnDetailTimeline;