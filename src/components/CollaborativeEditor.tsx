'use client'

import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { 
  Users, 
  Share, 
  Copy, 
  MessageCircle, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  Settings,
  Send
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Collaborator {
  id: string
  name: string
  color: string
  cursor?: { line: number; column: number }
  selection?: { start: number; end: number }
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
}

interface CollaborativeEditorProps {
  problemId: string
  initialCode: string
  language: string
  onCodeChange: (code: string) => void
  onRunCode: () => void
  onSubmit: () => void
}

export default function CollaborativeEditor({
  problemId,
  initialCode,
  language,
  onCodeChange,
  onRunCode,
  onSubmit
}: CollaborativeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [showCollaborators, setShowCollaborators] = useState(true)
  const [roomId, setRoomId] = useState('')
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // Generate room ID for this session
    const generatedRoomId = `room_${problemId}_${Date.now()}`
    setRoomId(generatedRoomId)

    // Mock collaborators - replace with real WebSocket connection
    const mockCollaborators: Collaborator[] = [
      { id: '1', name: 'Alice', color: '#3B82F6' },
      { id: '2', name: 'Bob', color: '#10B981' },
      { id: '3', name: 'Charlie', color: '#F59E0B' }
    ]
    setCollaborators(mockCollaborators)

    // Mock chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        user: 'Alice',
        message: 'Hey team! Let\'s start with a brute force approach and then optimize.',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        user: 'Bob',
        message: 'Good idea! I think we can use a hash map to reduce the time complexity.',
        timestamp: new Date(Date.now() - 180000)
      },
      {
        id: '3',
        user: 'Charlie',
        message: 'Perfect! That should give us O(n) time complexity.',
        timestamp: new Date(Date.now() - 60000)
      }
    ]
    setChatMessages(mockMessages)
  }, [problemId])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    editor.focus()
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      onCodeChange(value)
      // Here you would broadcast the change to other collaborators via WebSocket
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        timestamp: new Date()
      }
      setChatMessages([...chatMessages, message])
      setNewMessage('')
      // Here you would send the message to other collaborators via WebSocket
    }
  }

  const copyRoomLink = () => {
    const link = `${window.location.origin}/collaborate/${roomId}`
    navigator.clipboard.writeText(link)
    // Show toast notification
  }

  const shareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my coding session',
        text: 'Let\'s solve this problem together!',
        url: `${window.location.origin}/collaborate/${roomId}`
      })
    } else {
      copyRoomLink()
    }
  }

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Collaborative Editor</h3>
          
          {/* Collaborators */}
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">{collaborators.length + 1} online</span>
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: collaborator.color }}
                  title={collaborator.name}
                >
                  {collaborator.name.charAt(0)}
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-xs font-medium text-white">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Audio/Video Controls */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-md transition-colors ${
              isAudioEnabled ? 'bg-success-100 text-success-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title={isAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`p-2 rounded-md transition-colors ${
              isVideoEnabled ? 'bg-success-100 text-success-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title={isVideoEnabled ? 'Disable Video' : 'Enable Video'}
          >
            {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={shareRoom}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="Share Room"
          >
            <Share className="w-4 h-4" />
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-md transition-colors ${
              showChat ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title="Toggle Chat"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Run & Submit */}
          <button
            onClick={onRunCode}
            className="btn-primary px-4 py-2 text-sm"
          >
            Run Code
          </button>
          <button
            onClick={onSubmit}
            className="btn-success px-4 py-2 text-sm"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
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

        {/* Collaboration Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-gray-200 bg-gray-50 flex flex-col"
            >
              {/* Collaborators List */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Collaborators</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                      Y
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">You</p>
                      <p className="text-xs text-gray-500">Host</p>
                    </div>
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  </div>
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">Collaborator</p>
                      </div>
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">Chat</h4>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex space-x-2">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-medium text-white">
                          {message.user.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{message.user}</span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Room Info */}
      <div className="border-t border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Room: {roomId}</span>
            <button
              onClick={copyRoomLink}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy Link
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  )
}
