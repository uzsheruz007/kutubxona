import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-800 p-4 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-stone-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold font-serif mb-3 text-stone-900">
                            Kutilmagan xatolik yuz berdi
                        </h1>

                        <p className="text-stone-600 mb-8 leading-relaxed">
                            Uzr, nimadir noto'g'ri ketdi. Iltimos, sahifani yangilab ko'ring.
                        </p>

                        <button
                            onClick={this.handleReload}
                            className="w-full py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Sahifani yangilash
                        </button>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left">
                                <details className="whitespace-pre-wrap text-xs text-red-500 bg-red-50 p-4 rounded-lg overflow-auto max-h-48 border border-red-100">
                                    <summary className="cursor-pointer font-medium mb-2">Technical Details</summary>
                                    {this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo?.componentStack}
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
