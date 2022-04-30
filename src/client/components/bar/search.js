import React, { useState } from "react";
import { useUserSearchQuery } from "../../apollo/queries/usersSearch";
import SearchList from "./searchList";

const SearchBar = () => {
  const [text, setText] = useState("");
  const { loading, error, data } = useUserSearchQuery(text);
  const changeText = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="search">
      <input type="text" value={text} onChange={changeText} />
      {!loading && !error && data && <SearchList data={data} />}
    </div>
  );
};

export default SearchBar;
