/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { executeRequest } from "../services/api";


type Props = {
    show: boolean,
    setShow(v: boolean): void,
    doLogin(email: string, password: string): void
}

export const SignUp: NextPage<Props> = ({ doLogin, show, setShow }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState('');
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    const [confirmPassword, setconfirmPassword] = useState('');

    const [visiblePassword, setVisiblePassword] = useState(false);
    const [visibleConfirmPassword, setConfirmVisiblePassword] = useState(false);

    const closeModal = () => {
        setError('');
        setShow(false);
    }


    const doSignUp = async () => {
        try {
            setLoading(true);
            setError("");
            if (!email && !password && !name) {
                setError("Você precisa informar nome, email e senha");
                setLoading(false);
                return;
            }
            const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!regexEmail.test(email)) {
                setError("Digite um email válido");
                setLoading(false);
                return;
            }

            if (password.length < 4) {
                setError("Senha deve ter no mínimo 4 caracteres");
                setLoading(false);
                return;
            }

            if (password != confirmPassword) {
                setError("Verifique se os campos de senha e confirmação de senha coincidem");
                setLoading(false);
                return;
            }

            const body = {
                email,
                name,
                password,
            };

            const result = await executeRequest("user", "POST", body);
            if (result && result.data) {
                closeModal();
                doLogin(email, password);
            } else {
                setError("Não foi possivel efetuar seu cadastro, tente novamente");
            }
        } catch (e: any) {
            console.log(e);
            if (e?.response?.data?.error) {
                setError(e?.response?.data?.error);
            } else {
                setError("Não foi possivel efetuar seu cadastro, tente novamente");
            }
            setPassword('')
            setEmail('')
            setName('')
        }
        setLoading(false);
    }
    return (
        <Modal show={show}
            animation={false}
            onHide={() => closeModal()}
            className="container-signup">
            <Modal.Body>
                <p>Cadastre-se</p>
                {error && <p className="error">{error}</p>}
                <input type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                <input type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <div className="input_password">
                    <input type={visiblePassword ? "text" : "password"}
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div>
                        <img onClick={() => setVisiblePassword(!visiblePassword)} src={visiblePassword ? "/eye-closed.svg" : "/eye.svg"} alt="Informe sua senha" />
                    </div>
                </div>

                <div className="input_password">
                    <input type={visibleConfirmPassword ? "text" : "password"}
                        placeholder="Confirme a senha"
                        value={confirmPassword}
                        onChange={e => setconfirmPassword(e.target.value)}
                    />
                    <div>
                        <img onClick={() => setConfirmVisiblePassword(!visibleConfirmPassword)} src={visibleConfirmPassword ? "/eye-closed.svg" : "/eye.svg"} alt="Informe sua senha" />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="button col-12">
                    <button
                        onClick={doSignUp}
                        disabled={isLoading}
                    >{isLoading ? "...Enviando dados" : "Cadastrar"}</button>

                </div>
            </Modal.Footer>
        </Modal>
    );
}