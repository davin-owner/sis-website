"use client"

import React from 'react'
import {useDroppable} from '@dnd-kit/core'

type Props = {
  id: string
  children: React.ReactNode
}

export function Droppable({id, children}: Props) {
  const {isOver, setNodeRef} = useDroppable({id})

  return (
    <div ref={setNodeRef} className={isOver ? 'ring-2 ring-blue-400' : ''}>
      {children}
    </div>
  )
}
