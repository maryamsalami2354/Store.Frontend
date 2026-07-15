// =============================================================================
// FILE: cartItemsList.jsx
// =============================================================================
import React from 'react';
import CartItem from './cartItem';

const CartItemsList = ({ items = [], onUpdateQuantity, onRemove }) => {
    if (!items.length) return null;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="font-bold text-gray-900 dark:text-white">
                    محصولات ({items.length.toLocaleString('fa-IR')})
                </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map(item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default CartItemsList;