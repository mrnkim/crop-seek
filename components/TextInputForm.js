import { React} from "react";

const TextInputForm = ({
  textSearchQuery,
  setTextSearchQuery,
  setTextSearchSubmitted,
  handleChange,
  handleSubmit
}) => {


  return (
    <form
      className="text-[#c5c7c3] text-xl leading-loose ml-2"
      onSubmit={handleSubmit}
    >
      <input
        placeholder=" What are you looking for?"
        onChange={handleChange}
        value={textSearchQuery}
      ></input>
    </form>
  );
};

export default TextInputForm;
