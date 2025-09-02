import { jsx as _jsx } from "react/jsx-runtime";
const TestSurvey = () => {
    console.log("TestSurvey loaded");
    return (_jsx("div", { className: "p-8 text-center", children: _jsx("h1", { className: "text-4xl font-bold text-green-700", children: "Survey Page is Working" }) }));
};
export default TestSurvey;
