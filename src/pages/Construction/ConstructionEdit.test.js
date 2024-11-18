import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConstructionEdit from "./ConstructionEdit";
import { supabase } from "../../../supabaseClient";

// Mock do Supabase
jest.mock("../../../supabaseClient", () => {
  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: { code: "001", name: "Obra Teste", address: "Rua Teste" }, error: null })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null })),
        })),
      })),
    },
  };
});

describe("ConstructionEdit Component", () => {
  const mockOnClose = jest.fn();
  const mockOnConstructionUpdated = jest.fn();
  const constructionId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve buscar e preencher os dados da obra corretamente", async () => {
    supabase.from().select.mockResolvedValueOnce({
      data: { code: "001", name: "Obra Teste", address: "Rua Teste" },
      error: null,
    });

    render(<ConstructionEdit constructionId={constructionId} onClose={mockOnClose} onConstructionUpdated={mockOnConstructionUpdated} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("001")).toBeInTheDocument(); // Verifica se o código foi preenchido
      expect(screen.getByDisplayValue("Obra Teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Rua Teste")).toBeInTheDocument();
    });
  });

  
  it("Deve atualizar uma obra com sucesso", async () => {
    // Mock para resolver a atualização sem erro
    supabase.from().update.mockResolvedValueOnce({ data: {}, error: null });
  
    render(<ConstructionEdit constructionId={constructionId} onClose={mockOnClose} onConstructionUpdated={mockOnConstructionUpdated} />);
  
    // Simular mudança de valores nos campos do formulário
    fireEvent.change(screen.getByLabelText(/Código/i), { target: { value: "002" } });
    fireEvent.change(screen.getByLabelText(/Apelido/i), { target: { value: "Obra Atualizada" } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: "Rua Atualizada" } });
    
    // Simular clique no botão de "Atualizar"
    fireEvent.click(screen.getByRole("button", { name: /Atualizar/i }));
  
    // Espera que a função de atualização tenha sido chamada com os valores corretos
    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalledWith({
        code: "002",
        name: "Obra Atualizada",
        address: "Rua Atualizada",
      });
  
      // Verifica se as funções de callback foram chamadas
      expect(mockOnConstructionUpdated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
  

  it("Deve lidar com erro ao atualizar obra", async () => {
    console.error = jest.fn();  // Mock do console.error para verificar se o erro foi logado
  
    supabase.from().update.mockResolvedValueOnce({ data: null, error: { message: "Erro ao atualizar" } });
  
    render(<ConstructionEdit constructionId={constructionId} onClose={mockOnClose} onConstructionUpdated={mockOnConstructionUpdated} />);
  
    fireEvent.change(screen.getByLabelText(/Código/i), { target: { value: "002" } });
    fireEvent.change(screen.getByLabelText(/Apelido/i), { target: { value: "Obra Atualizada" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Atualizar/i }));
  
    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Erro ao atualizar a obra:", "Erro ao atualizar");
    });
  });

  it("Deve deletar uma obra com sucesso", async () => {
    supabase.from().delete.mockResolvedValueOnce({ error: null });

    render(<ConstructionEdit constructionId={constructionId} onClose={mockOnClose} onConstructionUpdated={mockOnConstructionUpdated} />);

    fireEvent.click(screen.getByRole("button", { name: /Deletar Obra/i }));

    await waitFor(() => {
      expect(supabase.from().delete).toHaveBeenCalledWith(expect.anything()); // Verifica se a função de deletar foi chamada
      expect(mockOnConstructionUpdated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("Deve fechar o modal ao clicar em cancelar", () => {
    render(<ConstructionEdit constructionId={constructionId} onClose={mockOnClose} onConstructionUpdated={mockOnConstructionUpdated} />);
    
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    
    expect(mockOnClose).toHaveBeenCalled(); // Verifica se a função de fechar foi chamada
  });

  it("Deve abrir o modal de edição ao selecionar uma obra existente", async () => {
    supabase.from().select.mockResolvedValueOnce({
      data: { code: "001", name: "Obra Teste", address: "Rua Teste" },
      error: null,
    });

    render(<ConstructionEdit constructionId={constructionId} onClose={mockOnClose} onConstructionUpdated={mockOnConstructionUpdated} />);

    await waitFor(() => {
      // Verifica se os campos do formulário estão preenchidos
      expect(screen.getByLabelText(/Código/i)).toHaveValue("001");
      expect(screen.getByLabelText(/Apelido/i)).toHaveValue("Obra Teste");
      expect(screen.getByLabelText(/Endereço/i)).toHaveValue("Rua Teste");
    });

    // Clica no botão "Editar"
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));

    // Verifica se o modal de edição foi aberto
    expect(screen.getByText(/Editar Obra/i)).toBeInTheDocument();
  });
});
