import React, { useState } from 'react';
import EvaluationForm from './components/EvaluationForm';
import ResultDisplay from './components/ResultDisplay';
import { evaluateSummary } from './services/api';
import './App.css';

function App() {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEvaluate = async (formData) => {
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const data = await evaluateSummary(formData);
            setResult(data);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>AI Summary Evaluator</h1>
                <p>Evaluate a student's summary against a lecture transcript.</p>
            </header>
            <main>
                <EvaluationForm onEvaluate={handleEvaluate} isLoading={isLoading} />
                <ResultDisplay result={result} isLoading={isLoading} error={error} />
            </main>
        </div>
    );
}

export default App;
