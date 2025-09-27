"use client"

import React from 'react'
import {useDraggable} from '@dnd-kit/core'

type Props = {
  id: string
  children: React.ReactNode
}

export function Draggable({id, children}: Props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({id})
  const style = transform ? {transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`} : undefined

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
