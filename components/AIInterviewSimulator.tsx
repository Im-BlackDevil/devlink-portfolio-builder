'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, MicOff, Send, Brain, Target, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer: string;
  keywords: string[];
  followUpQuestions: string[];
}

interface InterviewSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  feedback: Record<string, any>;
  score: number;
  startTime: Date;
}

interface AIInterviewSimulatorProps {
  userSkills: string[];
  onSessionComplete: (session: InterviewSession) => void;
}

const AIInterviewSimulator: React.FC<AIInterviewSimulatorProps> = ({ userSkills, onSessionComplete }) => {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionResults, setSessionResults] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef<any>(null);

  const questionBank: Question[] = [
    {
      id: '1',
      question: 'Explain the difference between let, const, and var in JavaScript. When would you use each?',
      category: 'JavaScript',
      difficulty: 'medium',
      expectedAnswer: 'var has function scope and can be redeclared, let has block scope and can be reassigned, const has block scope and cannot be reassigned',
      keywords: ['scope', 'hoisting', 'block', 'function', 'reassignment'],
      followUpQuestions: ['What is hoisting?', 'How does the temporal dead zone work?']
    },
    {
      id: '2',
      question: 'Describe the React component lifecycle methods and when you would use them.',
      category: 'React',
      difficulty: 'hard',
      expectedAnswer: 'Mounting: constructor, render, componentDidMount. Updating: render, componentDidUpdate. Unmounting: componentWillUnmount',
      keywords: ['lifecycle', 'mounting', 'updating', 'unmounting', 'hooks'],
      followUpQuestions: ['How do hooks replace lifecycle methods?', 'What is the useEffect cleanup function?']
    },
    {
      id: '3',
      question: 'What is the difference between REST and GraphQL? When would you choose one over the other?',
      category: 'API Design',
      difficulty: 'medium',
      expectedAnswer: 'REST uses multiple endpoints with fixed data structures, GraphQL uses a single endpoint with flexible queries',
      keywords: ['endpoints', 'queries', 'over-fetching', 'under-fetching', 'schema'],
      followUpQuestions: ['What are the trade-offs of GraphQL?', 'How do you handle caching in GraphQL?']
    },
    {
      id: '4',
      question: 'Explain how you would implement a debounce function in JavaScript.',
      category: 'JavaScript',
      difficulty: 'medium',
      expectedAnswer: 'Use setTimeout to delay execution and clearTimeout to cancel previous calls',
      keywords: ['setTimeout', 'clearTimeout', 'closure', 'performance', 'optimization'],
      followUpQuestions: ['What is the difference between debounce and throttle?', 'How would you implement throttle?']
    },
    {
      id: '5',
      question: 'Describe the CAP theorem and its implications for distributed systems.',
      category: 'System Design',
      difficulty: 'hard',
      expectedAnswer: 'Consistency, Availability, Partition tolerance - you can only guarantee two out of three',
      keywords: ['consistency', 'availability', 'partition', 'distributed', 'trade-offs'],
      followUpQuestions: ['How do different databases handle CAP?', 'What is eventual consistency?']
    }
  ];

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentAnswer(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  };

  const startInterview = () => {
    const session: InterviewSession = {
      id: Date.now().toString(),
      questions: generatePersonalizedQuestions(),
      currentQuestionIndex: 0,
      answers: {},
      feedback: {},
      score: 0,
      startTime: new Date()
    };
    setCurrentSession(session);
    setIsInterviewing(true);
  };

  const generatePersonalizedQuestions = (): Question[] => {
    // AI-powered question selection based on user skills
    const skillBasedQuestions = questionBank.filter(q => 
      userSkills.some(skill => 
        q.category.toLowerCase().includes(skill.toLowerCase()) ||
        q.keywords.some(keyword => skill.toLowerCase().includes(keyword))
      )
    );

    // Ensure we have enough questions, fill with general questions if needed
    const selectedQuestions = skillBasedQuestions.length >= 3 
      ? skillBasedQuestions.slice(0, 3)
      : [...skillBasedQuestions, ...questionBank.slice(0, 3 - skillBasedQuestions.length)];

    return selectedQuestions.sort(() => Math.random() - 0.5);
  };

  const submitAnswer = async () => {
    if (!currentSession || !currentAnswer.trim()) return;

    setIsAnalyzing(true);
    setIsTyping(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const feedback = await analyzeAnswer(
      currentSession.questions[currentSession.currentQuestionIndex],
      currentAnswer
    );

    const updatedSession = {
      ...currentSession,
      answers: {
        ...currentSession.answers,
        [currentSession.questions[currentSession.currentQuestionIndex].id]: currentAnswer
      },
      feedback: {
        ...currentSession.feedback,
        [currentSession.questions[currentSession.currentQuestionIndex].id]: feedback
      }
    };

    setCurrentSession(updatedSession);
    setCurrentAnswer('');
    setIsAnalyzing(false);
    setIsTyping(false);
  };

  const analyzeAnswer = async (question: Question, answer: string): Promise<any> => {
    // Simulate AI-powered answer analysis
    const answerLower = answer.toLowerCase();
    const keywordMatches = question.keywords.filter(keyword => 
      answerLower.includes(keyword.toLowerCase())
    );
    
    const coverage = keywordMatches.length / question.keywords.length;
    const score = Math.round(coverage * 100);
    
    const feedback = {
      score,
      keywordMatches,
      missingKeywords: question.keywords.filter(keyword => 
        !answerLower.includes(keyword.toLowerCase())
      ),
      suggestions: generateSuggestions(score, question),
      followUpQuestion: question.followUpQuestions[Math.floor(Math.random() * question.followUpQuestions.length)]
    };

    return feedback;
  };

  const generateSuggestions = (score: number, question: Question): string[] => {
    if (score >= 80) {
      return [
        'Excellent answer! You covered all key concepts.',
        'Consider providing more specific examples.',
        'Great understanding of the topic.'
      ];
    } else if (score >= 60) {
      return [
        'Good foundation, but missing some key points.',
        'Consider mentioning: ' + question.keywords.filter(k => !question.keywords.includes(k)).join(', '),
        'Try to provide more detailed explanations.'
      ];
    } else {
      return [
        'Review the fundamental concepts of this topic.',
        'Focus on understanding: ' + question.keywords.join(', '),
        'Consider studying this area more thoroughly.'
      ];
    }
  };

  const nextQuestion = () => {
    if (!currentSession) return;

    if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex + 1
      });
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    if (!currentSession) return;

    const totalScore = Object.values(currentSession.feedback).reduce((sum: number, feedback: any) => sum + feedback.score, 0);
    const averageScore = Math.round(totalScore / Object.keys(currentSession.feedback).length);

    const results = {
      ...currentSession,
      score: averageScore,
      endTime: new Date(),
      duration: new Date().getTime() - currentSession.startTime.getTime(),
      overallFeedback: generateOverallFeedback(averageScore),
      improvementAreas: generateImprovementAreas(currentSession.feedback)
    };

    setSessionResults(results);
    setIsInterviewing(false);
    onSessionComplete(results);
  };

  const generateOverallFeedback = (score: number): string => {
    if (score >= 90) return 'Outstanding performance! You demonstrate expert-level knowledge.';
    if (score >= 80) return 'Excellent work! You have strong technical foundations.';
    if (score >= 70) return 'Good performance with room for improvement in specific areas.';
    if (score >= 60) return 'Fair performance. Focus on strengthening core concepts.';
    return 'Needs improvement. Consider reviewing fundamental concepts.';
  };

  const generateImprovementAreas = (feedback: Record<string, any>): string[] => {
    const areas = new Set<string>();
    Object.values(feedback).forEach((f: any) => {
      f.missingKeywords.forEach((keyword: string) => areas.add(keyword));
    });
    return Array.from(areas).slice(0, 3);
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const currentQuestion = currentSession?.questions[currentSession.currentQuestionIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8" />
            AI Interview Simulator
          </h2>
          <p className="text-emerald-200 text-lg">
            Practice with AI-powered technical interviews and get real-time feedback
          </p>
        </div>

        {!isInterviewing && !sessionResults && (
          <motion.button
            onClick={startInterview}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Target className="w-6 h-6 inline mr-2" />
            Start AI Interview
          </motion.button>
        )}

        {isInterviewing && currentQuestion && (
          <div className="space-y-6">
            {/* Question Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-emerald-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Question {currentSession!.currentQuestionIndex + 1} of {currentSession!.questions.length}
                  </span>
                  <span className="ml-2 bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {currentQuestion.difficulty.toUpperCase()}
                  </span>
                </div>
                <span className="text-emerald-200 text-sm">{currentQuestion.category}</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
            </div>

            {/* Answer Input */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <h4 className="text-lg font-semibold">Your Answer:</h4>
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-full transition-colors ${
                    isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type or speak your answer here..."
                className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-emerald-300 resize-none focus:outline-none focus:border-emerald-400"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-emerald-300">
                  {isListening && 'Listening... Speak now!'}
                </span>
                <button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim() || isAnalyzing}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feedback Display */}
            {currentSession.feedback[currentQuestion.id] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <h4 className="text-lg font-semibold">AI Feedback:</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {currentSession.feedback[currentQuestion.id].score}%
                    </span>
                    {currentSession.feedback[currentQuestion.id].score >= 80 ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-emerald-200 mb-2">Suggestions:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {currentSession.feedback[currentQuestion.id].suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-emerald-200 mb-2">Follow-up Question:</h5>
                    <p className="text-sm italic">{currentSession.feedback[currentQuestion.id].followUpQuestion}</p>
                  </div>
                </div>

                <button
                  onClick={nextQuestion}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  {currentSession.currentQuestionIndex < currentSession.questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Session Results */}
        <AnimatePresence>
          {sessionResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Interview Complete!</h3>
                <div className="text-6xl font-bold text-emerald-400 mb-4">
                  {sessionResults.score}%
                </div>
                <p className="text-lg text-emerald-200 mb-6">{sessionResults.overallFeedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <span className="font-semibold">{sessionResults.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">{Math.round(sessionResults.duration / 60000)} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Score:</span>
                      <span className="font-semibold text-emerald-400">{sessionResults.score}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {sessionResults.improvementAreas.map((area: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  setSessionResults(null);
                  setCurrentSession(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Start New Interview
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIInterviewSimulator; 