import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";

const Search = () => {
  const [type, setType] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState();
  const [numOfPages, setNumOfPages] = useState();

  const fetchSearch = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
        process.env.REACT_APP_API_KEY
      }&language=en-US&page=${page}&query=${searchText}&include_adult=false`
    );

    setContent(data.results);
    setNumOfPages(data.total_pages);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchSearch();
    // eslint-disable-next-line
  }, [type, page]);

  return (
    <div>
      <br />
      <span className="pageTitle">Search Movies / Shows</span>
      <br />
      <div style={{ display: "flex", margin: "5px 0" }}>
        <TextField
          id="filled-basic"
          label="Search"
          variant="filled"
          style={{ flex: 1 }}
          sx={{
            input: {
              color: "black",
              background: "#424D67",
            },
          }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          variant="contained"
          style={{ marginLeft: 10, color: "#E4E4E5" }}
          onClick={fetchSearch}
        >
          <SearchIcon />
        </Button>
      </div>
      <br />
      <Tabs
        value={type}
        onChange={(event, newValue) => {
          setType(newValue);
          setPage(1);
        }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab style={{ width: "50%" }} label="Search Movies" />
        <Tab style={{ width: "50%" }} label="Search TV Series" />
      </Tabs>
      <br />
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={type ? "tv" : "movie"}
              vote_average={c.vote_average}
            />
          ))}
        {searchText &&
          content.length === 0 &&
          (type ? <h2>No TV Series found</h2> : <h2>No Movies found</h2>)}
      </div>
      <br />
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  );
};

export default Search;
