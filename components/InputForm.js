import React from "react";

const InputForm = ({searchQuery, setSearchQuery}) => {
  function handleChange(evt) {
    const input = evt.target;
    setSearchQuery(input.value);
  }

  function handleSubmit() {}

  return (
    <form
      className="text-[#c5c7c3] text-xl leading-loose ml-2"
      onSubmit={handleSubmit}
    >
      <input
        placeholder=" What are you looking for?"
        onChange={handleChange}
        value={searchQuery}
      ></input>
    </form>
  );
};

export default InputForm;
