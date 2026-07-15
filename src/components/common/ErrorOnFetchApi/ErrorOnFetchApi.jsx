import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "react-feather";

const ErrorOnFetchApi = ({ message, onClose, isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-2xl overflow-hidden">
          {/* گرادینت و افکت نوری */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent pointer-events-none" />
          
          {/* خط قرمز در بالا */}
          <div className="h-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500" />
          
          <div className="p-4 flex items-center gap-4">
            {/* آیکون با انیمیشن چرخشی */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
              className="flex-shrink-0"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* متن خطا */}
            <div className="flex-1 min-w-0">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white font-medium text-base truncate"
              >
                {message || "خطای ناشناخته رخ داده است"}
              </motion.p>
              <p className="text-white/70 text-xs mt-1">
                لطفا دوباره تلاش کنید
              </p>
            </div>

            {/* دکمه بستن */}
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </div>

          {/* افکت موجی در پایین */}
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute bottom-0 left-0 w-32 h-1 bg-white/30 rounded-full blur-sm"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorOnFetchApi;