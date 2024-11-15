import React, { useState, useContext } from "react";

import {
  Header,
  Footer,
  Feature,
  Hero,
  Token
}
  from "../components/index";

import { CONTEXT } from "../context/context";
const index = () => {
  const {
    TOKEN_SWAP,
    LOAD_TOKEN,
    notifyError,
    notifySuccess,
    setLoader,
    loader,
    connect,
    address,
    swap,
    getPool

  } = useContext(CONTEXT);

  const [token_1, setToken_1] = useState();
  const [token_2, setToken_2] = useState();
  const [openToken, setOpenToken] = useState(false);

  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  return <div>
    <Header address={address} connect={connect} />
    <Hero
      setInputAmount={setInputAmount}
      setLoader={setLoader}
      setOpenToken={setOpenToken}
      LOAD_TOKEN={LOAD_TOKEN}
      inputAmount={inputAmount}
      token_1={token_1}
      token_2={token_2}
      setToken_1={setToken_1}
      setToken_2={setToken_2}
      swap={swap}
    />
    <Feature getPool={getPool} />
    <Footer />
    {openToken && (
      <div className="new_loader">
        <Token
          notifyError={notifyError}
          notifySuccess={notifySuccess}
          setOpenToken={setOpenToken}
          LOAD_TOKEN={LOAD_TOKEN}
          token_1={token_1}
          token_2={token_2}
          setToken_1={setToken_1}
          setToken_2={setToken_2}
        />
      </div>
    )}
  </div>;
};

export default index;
