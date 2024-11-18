import React, { useState, useEffect } from "react";
import { supabase, supabaseAdmin } from "../../../supabaseClient";
import { useNavigate } from "react-router-dom";

const EditUser = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setEmail(session.user.email);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      alert("Dados atualizados com sucesso.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita."
    );
    if (confirmation) {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      const userId = session.user.id;

      try {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
          setError(deleteError.message);
        } else {
          await supabase.auth.signOut();
          alert("Conta excluída com sucesso.");
          navigate("/login");
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full">
      {/* O formulário agora ocupa toda a largura da tela e não tem altura mínima */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-2xl font-bold text-center mb-4">Editar Usuário</h3>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
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
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Nova Senha
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Atualizar"}
          </button>
        </form>
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors mt-4"
        >
          Excluir Conta
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors mt-4"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditUser;
