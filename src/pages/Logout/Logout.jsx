import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";

const Logout = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const confirmLogout = window.confirm("Tem certeza que deseja encerrar a sua sessão?");
      if (confirmLogout) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Erro ao sair:", error.message);
        } else {
          setUser(null);
          navigate("/login");
        }
      } else {
        navigate("/"); // Redireciona para a página inicial se o usuário cancelar
      }
    };

    logout();
  }, [navigate, setUser]);

  return null;
};

export default Logout;
