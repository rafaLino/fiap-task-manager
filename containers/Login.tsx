import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { executeRequest } from "../services/api";
import { AccessTokenProps } from "../types/AccessTokenProps";
import { SignUp } from "./SignUp";

/* eslint-disable @next/next/no-img-element */
export const Login: NextPage<AccessTokenProps> = ({ setToken }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const doLogin = async (login: string, password: string) => {
    try {
      setLoading(true);
      setError("");
      if (!login && !password) {
        setError("Favor informar email e senha");
        setLoading(false);
        return;
      }

      const body = {
        login,
        password,
      };

      const result = await executeRequest("login", "POST", body);
      if (result && result.data) {
        localStorage.setItem("accessToken", result.data.token);
        localStorage.setItem("userName", result.data.name);
        localStorage.setItem("userMail", result.data.email);
        setToken(result.data.token);
      } else {
        setError("Não foi possivel processar login, tente novamente");
      }
    } catch (e: any) {
      console.log(e);
      if (e?.response?.data?.error) {
        setError(e?.response?.data?.error);
      } else {
        setError("Não foi possivel processar login, tente novamente");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="container-login">
        <img src="/logo.svg" alt="Logo Fiap" className="logo" />
        <form>
          <p className="error">{error}</p>
          <div className="input">
            <img src="/mail.svg" alt="Informe seu email" />
            <input
              type="text"
              placeholder="Informe seu email"
              value={login}
              onChange={(evento) => setLogin(evento.target.value)}
            />
          </div>
          <div className="input">
            <img src="/lock.svg" alt="Informe sua senha" />
            <input
              type="password"
              placeholder="Informe sua senha"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => doLogin(login, password)}
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? "...Carregando" : "Login"}
          </button>
        </form>
        <div className="signup">
          <span>
            Ainda não tem um cadastro?
            <a onClick={() => setShowSignUp(true)}> Inscreva-se</a>
          </span>
        </div>
      </div>
      <SignUp show={showSignUp} setShow={setShowSignUp} doLogin={doLogin} />
    </>
  );
};
