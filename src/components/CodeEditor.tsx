'use client'

import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Download, Upload, Settings, Brain, CheckCircle, XCircle } from 'lucide-react'
import { Problem } from '@/types/problem'

interface CodeEditorProps {
  problem: Problem
  onCodeChange: (code: string) => void
  onRunCode: () => void
  onSubmit: () => void
  onGetAIFeedback: () => void
  language: string
  code: string
  isRunning: boolean
  isSubmitted: boolean
  isGettingAIFeedback: boolean
  testResults?: {
    passed: number
    total: number
    details: Array<{
      testCase: string
      expected: string
      actual: string
      passed: boolean
    }>
  }
  aiFeedback?: {
    suggestions: Array<{
      text: string
      reason: string
      lines: number[]
    }>
    improvements: string[]
    score: number
    assessment?: string
  }
}

const supportedLanguages = [
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'java', name: 'Java', extension: '.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'c', name: 'C', extension: '.c' }
]

export default function CodeEditor({
  problem,
  onCodeChange,
  onRunCode,
  onSubmit,
  onGetAIFeedback,
  language,
  code,
  isRunning,
  isSubmitted,
  isGettingAIFeedback,
  testResults,
  aiFeedback
}: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [showAI, setShowAI] = useState(false)
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const [decorations, setDecorations] = useState<string[]>([]);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      if (model) {
        model.setValue(problem.starterCode[selectedLanguage] || '')
      }
    }
  }, [selectedLanguage, problem.starterCode])

  useEffect(() => {
    if (!editorRef.current || !aiFeedback?.suggestions) return;

    // Remove previous decorations
    setDecorations(editorRef.current.deltaDecorations(decorations, []));

    // Add new decorations for each suggestion's lines
    const newDecorations = aiFeedback.suggestions.flatMap(suggestion =>
      (suggestion.lines || []).map(line => ({
        range: monacoRef.current
          ? new monacoRef.current.Range(line, 1, line, 1)
          : { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
        options: {
          isWholeLine: true,
          className: 'ai-suggestion-highlight',
          hoverMessage: { value: `**AI Suggestion:** ${suggestion.text}\n\n**Why:** ${suggestion.reason}` }
        }
      }))
    );

    setDecorations(editorRef.current.deltaDecorations(decorations, newDecorations));

    return () => {
      if (editorRef.current) {
        editorRef.current.deltaDecorations(decorations, []);
      }
    };
  }, [aiFeedback, editorRef.current]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    monacoRef.current = monaco
    editor.focus()
  }

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage)
    onCodeChange(problem.starterCode[newLanguage] || '')
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange(value)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `solution${supportedLanguages.find(l => l.id === selectedLanguage)?.extension || '.txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const uploadCode = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.py,.js,.java,.cpp,.c,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          onCodeChange(content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
          
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={uploadCode}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="Upload code"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={downloadCode}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onGetAIFeedback}
            disabled={isGettingAIFeedback || !code.trim()}
            className={`p-2 rounded-md transition-colors ${
              showAI 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Get AI Feedback"
          >
            <Brain className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAI(!showAI)}
            className={`p-2 rounded-md transition-colors ${
              showAI 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title="Show/Hide AI Feedback"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitted}
            className="btn-success px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Code Editor */}
        <div className="flex-1 min-w-0">
          <Editor
            height="100%"
            language={selectedLanguage}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              parameterHints: {
                enabled: true
              }
            }}
          />
        </div>

        {/* AI Feedback Panel */}
        {showAI && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto flex-shrink-0 lg:block hidden">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary-600" />
                AI Feedback
              </h4>
              <button
                onClick={() => setShowAI(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {aiFeedback ? (
              <div className="space-y-4">
                {/* Score */}
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Code Quality Score</span>
                    <span className="text-lg font-bold text-primary-600">{aiFeedback.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${aiFeedback.score}%` }}
                    />
                  </div>
                </div>

                {/* Suggestions */}
                {aiFeedback?.suggestions && aiFeedback.suggestions.length > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <h5 className="font-medium text-gray-900 mb-2">Suggestions</h5>
                    <ul className="space-y-2">
                      {aiFeedback.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex flex-col mb-2">
                          <div className="font-medium text-gray-900">{suggestion.text}</div>
                          <div className="text-xs text-gray-600 mb-1">{suggestion.reason}</div>
                          <div className="text-xs text-primary-600">
                            {suggestion.lines && suggestion.lines.length > 0 && (
                              <>Line{suggestion.lines.length > 1 ? 's' : ''}: {suggestion.lines.join(', ')}</>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {aiFeedback.improvements.length > 0 && (
                  <div className="bg-white p-3 rounded-lg border">
                    <h5 className="font-medium text-gray-900 mb-2">Areas for Improvement</h5>
                    <ul className="space-y-1">
                      {aiFeedback.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-warning-500 mr-2">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">
                  Click the AI Feedback button to get intelligent suggestions for your code.
                </p>
                <button
                  onClick={onGetAIFeedback}
                  disabled={isGettingAIFeedback || !code.trim()}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGettingAIFeedback ? 'Analyzing...' : 'Get AI Feedback'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-900">Test Results</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {testResults.passed}/{testResults.total} tests passed
              </span>
              <div className={`w-3 h-3 rounded-full ${
                testResults.passed === testResults.total ? 'bg-success-500' : 'bg-warning-500'
              }`} />
            </div>
          </div>
          
          <div className="space-y-2">
            {testResults.details.map((test, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                test.passed ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Test Case {index + 1}</span>
                  {test.passed ? (
                    <CheckCircle className="w-4 h-4 text-success-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-error-600" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Expected:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {test.expected}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600">Actual:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {test.actual}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile AI Feedback Panel */}
      {showAI && aiFeedback && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary-600" />
              AI Feedback
            </h4>
            <button
              onClick={() => setShowAI(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Score */}
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Code Quality Score</span>
                <span className="text-lg font-bold text-primary-600">{aiFeedback.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${aiFeedback.score}%` }}
                />
              </div>
            </div>

            {/* Suggestions */}
            {aiFeedback?.suggestions && aiFeedback.suggestions.length > 0 && (
              <div className="bg-white p-3 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-2">Suggestions</h5>
                <ul className="space-y-2">
                  {aiFeedback.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex flex-col mb-2">
                      <div className="font-medium text-gray-900">{suggestion.text}</div>
                      <div className="text-xs text-gray-600 mb-1">{suggestion.reason}</div>
                      <div className="text-xs text-primary-600">
                        {suggestion.lines && suggestion.lines.length > 0 && (
                          <>Line{suggestion.lines.length > 1 ? 's' : ''}: {suggestion.lines.join(', ')}</>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {aiFeedback.improvements.length > 0 && (
              <div className="bg-white p-3 rounded-lg border">
                <h5 className="font-medium text-gray-900 mb-2">Areas for Improvement</h5>
                <ul className="space-y-1">
                  {aiFeedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-warning-500 mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
