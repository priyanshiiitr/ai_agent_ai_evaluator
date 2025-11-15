import React from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ result, isLoading, error }) => {
    if (isLoading) {
        return <div className="result-container loading">Loading...</div>;
    }

    if (error) {
        return <div className="result-container error">Error: {error}</div>;
    }

    if (!result) {
        return null; // Don't render anything if there's no result yet
    }

    return (
        <div className="result-container">
            <h2>Evaluation Result</h2>
            <div className="score-circle">{result.score}/10</div>
            <div className="explanation">
                <h3>Explanation:</h3>
                <p>{result.explanation}</p>
            </div>
        </div>
    );
};

export default ResultDisplay;
