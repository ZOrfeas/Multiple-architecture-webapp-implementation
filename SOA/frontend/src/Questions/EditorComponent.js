import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './EditorComponent.css'
import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState } from 'draft-js'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

function EditorComponent({ setHtml }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  const setEditorStateAndConvertToHtml = state => {
    setEditorState(state)
    if (setHtml) {
      const currentContent = editorState.getCurrentContent()
      setHtml(currentContent.hasText() ? draftToHtml(convertToRaw(currentContent)) : '')
    }
  }

  return (
      <Editor
          editorState={editorState}
          onEditorStateChange={setEditorStateAndConvertToHtml}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history']
          }}
          editorClassName='editor-class'
      />
  )
}

export default EditorComponent
