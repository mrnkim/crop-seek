import React, { useRef } from "react";

const TextInputForm = ({
  handleSubmit,
}) => {
  const inputRef = useRef(null);

  const handleFormSubmit = (evt) => {
    evt.preventDefault(); // Prevent the default form submission
    handleSubmit(inputRef.current.value); // Pass the input value directly
  };

  return (
    <form
      className="text-[#c5c7c3] text-xl leading-loose ml-2"
      onSubmit={handleFormSubmit}
    >
      <input
        ref={inputRef} // Use ref to access the input
        placeholder=" What are you looking for?"
      ></input>
    </form>
  );
};

export default TextInputForm;
