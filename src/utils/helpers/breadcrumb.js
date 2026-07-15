// src/utils/helpers/breadcrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'react-feather';

export const Breadcrumb = ({ items, showHome = true }) => {
    return (
        React.createElement('div', { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap" },
            showHome && [
                React.createElement(Link, { key: "home", to: "/", className: "flex items-center gap-1 hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition" },
                    React.createElement(Home, { size: 16 }),
                    React.createElement('span', null, "خانه")
                ),
                React.createElement(ChevronLeft, { key: "chevron", size: 14 })
            ],
            items.map((item, index) => {
                const isLast = index === items.length - 1;
                const Icon = item.icon;

                return React.createElement(React.Fragment, { key: index },
                    isLast ?
                        React.createElement('div', { className: "flex items-center gap-1 text-gray-800 dark:text-gray-200 font-medium" },
                            Icon && React.createElement(Icon, { size: 16 }),
                            React.createElement('span', null, item.title)
                        ) :
                        [
                            React.createElement(Link, { key: "link", to: item.link, className: "flex items-center gap-1 hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition" },
                                Icon && React.createElement(Icon, { size: 14 }),
                                React.createElement('span', null, item.title)
                            ),
                            React.createElement(ChevronLeft, { key: "chevron", size: 14 })
                        ]
                );
            })
        )
    );
};
