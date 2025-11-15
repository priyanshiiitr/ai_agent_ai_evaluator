import React, { useState } from 'react';
import './EvaluationForm.css';

const evaluationParams = [
    { id: 'accuracy', label: 'Accuracy' },
    { id: 'clarity', label: 'Clarity' },
    { id: 'conciseness', label: 'Conciseness' },
    { id: 'relevance', label: 'Relevance' },
];

const defaultTranscript = `The process of photosynthesis is crucial for life on Earth. It occurs in two main stages: the light-dependent reactions and the Calvin cycle. In the light-dependent reactions, which take place in the thylakoid membranes of chloroplasts, light energy is captured by chlorophyll and converted into chemical energy in the form of ATP and NADPH. Water is split in this process, releasing oxygen as a byproduct. The second stage, the Calvin cycle, occurs in the stroma. It uses the ATP and NADPH from the first stage to convert carbon dioxide into glucose, which is a sugar that plants use for energy and growth.`

const defaultSummary = `Photosynthesis uses light to make food for plants. It splits water, which makes oxygen. Then it uses CO2 to create sugar. This all happens inside the chloroplasts.`

const EvaluationForm = ({ onEvaluate, isLoading }) => {
    const [transcript, setTranscript] = useState(defaultTranscript);
    const [summary, setSummary] = useState(defaultSummary);
    const [selectedParams, setSelectedParams] = useState(['Accuracy', 'Conciseness']);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedParams(prev => [...prev, value]);
        } else {
            setSelectedParams(prev => prev.filter(param => param !== value));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedParams.length === 0) {
            alert('Please select at least one evaluation parameter.');
            return;
        }
        onEvaluate({ transcript, summary, params: selectedParams });
    };

    return (
        <form onSubmit={handleSubmit} className="evaluation-form">
            <div className="form-group">
                <label htmlFor="transcript">Lecture Transcript</label>
                <textarea
                    id="transcript"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows="8"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="summary">Student Summary</label>
                <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows="5"
                    required
                />
            </div>
            <div className="form-group">
                <label>Evaluation Parameters</label>
                <div className="checkbox-group">
                    {evaluationParams.map(param => (
                        <label key={param.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                value={param.label}
                                checked={selectedParams.includes(param.label)}
                                onChange={handleCheckboxChange}
                            />
                            {param.label}
                        </label>
                    ))}
                </div>
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Evaluating...' : 'Evaluate Summary'}
            </button>
        </form>
    );
};

export default EvaluationForm;
