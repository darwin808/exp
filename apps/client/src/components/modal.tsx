/**
 * Property of Darwin Apolinario
 */
import { useAtom } from "jotai"
import React from "react"
import ReactModal from "react-modal"

import { showModal } from "../store"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  },
  overlay: { background: "rgba(0,0,0, 0.4)" }
}

ReactModal.setAppElement("#root")

type Props = {
  children: React.ReactNode
}
export const Modal = ({ children }: Props) => {
  const [modalIsOpen, setIsOpen] = useAtom(showModal)

  // function openModal() {
  //   setIsOpen(true);
  // }

  const afterOpenModal = () => {}

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <div>
      <ReactModal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {children}
      </ReactModal>
    </div>
  )
}
