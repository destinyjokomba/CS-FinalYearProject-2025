import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partyDisplayMap } from '../../utils/predict_party_logic';
const ResultsPage = () => {
    const navigate = useNavigate();
    const [predictedParty, setPredictedParty] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPrediction = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await fetch('http://localhost:5001/me/prediction', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data.saved_prediction) {
                    setPredictedParty(data.saved_prediction);
                    localStorage.setItem('prediction_result', JSON.stringify(data.saved_prediction));
                }
                else {
                    const fallback = localStorage.getItem('prediction_result');
                    setPredictedParty(fallback ? JSON.parse(fallback) : null);
                }
            }
            catch (err) {
                console.error('❌ Failed to fetch prediction:', err);
                const fallback = localStorage.getItem('prediction_result');
                setPredictedParty(fallback ? JSON.parse(fallback) : null);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPrediction();
    }, [navigate]);
    const handleShare = () => {
        if (!predictedParty)
            return;
        const display = partyDisplayMap[predictedParty.party];
        const shareData = {
            title: 'Election Predictor',
            text: `My predicted UK party is: ${display.name}. Try it yourself:`,
            url: 'http://localhost:5173/', // Update with your live domain
        };
        if (navigator.share) {
            navigator.share(shareData).catch((err) => console.error('Sharing failed:', err));
        }
        else {
            const text = `${shareData.text} ${shareData.url}`;
            navigator.clipboard.writeText(text).then(() => {
                alert('Link copied! You can share it anywhere 🎉');
            });
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsx("p", { className: "text-gray-600 text-lg", children: "Loading result..." }) }));
    }
    if (!predictedParty || !(predictedParty.party in partyDisplayMap)) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsxs("div", { className: "bg-white p-6 rounded shadow text-center", children: [_jsx("p", { className: "text-lg font-semibold", children: "No prediction available." }), _jsx("button", { onClick: () => navigate('/survey'), className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Take Survey" })] }) }));
    }
    const display = partyDisplayMap[predictedParty.party];
    return (_jsx("div", { className: "min-h-screen bg-gray-100 py-10 px-4", children: _jsxs("div", { className: "max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden", children: [_jsxs("div", { className: "p-8 text-center text-white", style: { backgroundColor: display.color }, children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Your Predicted Party" }), _jsx("p", { className: "text-4xl font-extrabold mb-1", children: display.name }), predictedParty.timestamp && (_jsxs("p", { className: "text-sm opacity-80", children: ["Predicted on: ", new Date(predictedParty.timestamp).toLocaleString()] }))] }), _jsxs("div", { className: "p-6 text-center flex flex-col gap-3", children: [_jsx("button", { onClick: () => navigate('/survey'), className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Retake Survey" }), _jsx("button", { onClick: () => navigate('/history'), className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300", children: "View History" }), _jsx("button", { onClick: handleShare, className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700", children: "Share Your Result" })] })] }) }));
};
export default ResultsPage;
