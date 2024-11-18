import React from 'react';
import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-less-acabamentos.webp";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validação de e-mail
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("O campo e-mail é inválido");
      setLoading(false);
      return;
    }

    // Validação de senha (exemplo: mínimo 6 caracteres)
    if (password.length < 6) {
      setError("O campo senha é inválido");
      setLoading(false);
      return;
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      alert(
        "Conta criada com sucesso. Verifique seu e-mail para confirmar sua conta.",
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Company Logo" className="h-32" />
        </div>
        <div>
          <h3 className="mb-6 text-2xl font-bold text-center">
            {isRegistering ? "Registrar" : "Login"}
          </h3>
        </div>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="mb-4">
            <label
              className="block mb-1 text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block mb-1 text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Carregando..." : isRegistering ? "Registrar" : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isRegistering ? "Já tem uma conta?" : "Não tem uma conta?"}
          <button
            className="ml-2 text-blue-500 underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Entrar" : "Criar nova conta"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
