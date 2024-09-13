import React from 'react'

const TextSearchForm = ({handleFormSubmit, inputRef }) => {
  return (
    <form
    className="flex-grow flex items-center"
    onSubmit={handleFormSubmit}
  >
    <input
      className="text-[#c5c7c3] text-xl leading-loose w-full"
      ref={inputRef} 
      placeholder=" What are you looking for?"
    ></input>
  </form>
  )
}

export default TextSearchForm
