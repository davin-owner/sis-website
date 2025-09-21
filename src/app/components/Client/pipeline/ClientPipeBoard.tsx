import React, { Component } from 'react'
import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';

// CLIENT COMPONENT - Uses DnD Kit library for drag-and-drop functionality
// Handles interactive drag-and-drop features for pipeline board
// Requires client-side state management for drag-and-drop interactions
export default class ClientPipeBoard extends Component {
  render() {
    return (
     <DndContext>
      <Draggable id="draggable-1">
        <div className="p-4 bg-white rounded shadow mb-4">Draggable Item 1</div>
      </Draggable>
      <Droppable id="droppable-1">
        <div className="p-4 bg-gray-100 rounded shadow h-64">Drop Here</div>
      </Droppable>
     </DndContext>    )
  }
}
