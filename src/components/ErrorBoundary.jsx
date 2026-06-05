import { Component } from "react";
import { motion } from "framer-motion";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-[60vh] flex items-center justify-center p-6"
        >
          <div className="card-dark rounded-2xl border p-8 max-w-md w-full text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl mb-2"
            >
              ⚠️
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Failed to Load</h2>
            <p className="text-white/60 text-sm">
              {this.props.fallbackMessage || "Something went wrong. Please try refreshing."}
            </p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => window.location.reload()}
              className="btn-gold px-8 py-3 mt-4 rounded-xl font-inter font-semibold text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Refresh Page
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}